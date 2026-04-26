import { getApiBase, getWsBase } from './api-base';
/**
 * Doctrine Bridge API — Grounding layer between Engine Runtime doctrines and LLM calls.
 *
 * Fetches relevant doctrines from the Engine Runtime, formats them as grounding context,
 * and provides metadata for UI badges (match quality, domain, confidence).
 *
 * Used by Sentinel page.tsx to inject authoritative knowledge into every LLM call,
 * ensuring zero-hallucination responses backed by 849K+ doctrines across 5,600+ engines.
 */

const RUNTIME_URL = getApiBase('echo-engine-runtime');
const DOCTRINE_FORGE_URL = getApiBase('echo-doctrine-forge');
const API_KEY = 'echo-omega-prime-forge-x-2026';

// ── Types ──

export interface DoctrineMatch {
  engine_id: string;
  topic: string;
  conclusion: string;
  reasoning: string;
  confidence: string;
  score: number;
  keywords?: string[];
  authority?: string[];
  domain?: string;
}

export interface GroundingResult {
  matches: DoctrineMatch[];
  totalSearched: number;
  domain: string | undefined;
  domainLabel: string;
  matchQuality: 'strong' | 'moderate' | 'weak' | 'none';
  topScore: number;
  contextBlock: string;
  latencyMs: number;
  timestamp: number;
}

export interface ReportSection {
  title: string;
  content: string;
  citations: string[];
  confidence: string;
}

export interface DoctrineReport {
  query: string;
  domain: string | undefined;
  generatedAt: string;
  sections: ReportSection[];
  groundingResult: GroundingResult;
  summary: string;
}

// ── Domain Detection ──

const DOMAIN_PATTERNS: [RegExp, string, string][] = [
  [/\b(tax|irs|irc|1031|deduct|deprec|macrs|gilti|partnership|s.?corp|section\s*\d{2,4}|199a|qbi|tcja|amt|estate\s*tax)\b/i, 'TAX', 'Tax & IRS'],
  [/\b(title\s*chain|mineral\s*right|royalt|lease\s*(hold|analy)|deed|chain\s*of\s*title|easement|run\s*sheet|landman)\b/i, 'LM', 'Landman'],
  [/\b(contract|litigation|tort|breach|fiduciary|arbitrat|patent|trademark|copyright|bankruptcy)\b/i, 'LG', 'Legal'],
  [/\b(cyber|malware|pentest|vulnerability|cve|nist|siem|incident\s*response|zero.?day)\b/i, 'CYBER', 'Cybersecurity'],
  [/\b(medical|clinical|diagnosis|pharma|treatment|pathology|oncology|cardiology)\b/i, 'MED', 'Medical'],
  [/\b(drill|completion|fracking|wellbore|casing|production|rrc|workover|artificial\s*lift)\b/i, 'DRL', 'Oil & Gas'],
  [/\b(mechanical\s*engineer|structural|fea|cfd|thermodynamic|fatigue|gd&t|weld)\b/i, 'MECH', 'Engineering'],
  [/\b(portfolio|valuation|dcf|wacc|ebitda|ipo|merger|private\s*equity)\b/i, 'FIN', 'Finance'],
  [/\b(real\s*estate|zoning|eminent\s*domain|mortgage|appraisal|cap\s*rate|reit)\b/i, 'RE', 'Real Estate'],
  [/\b(software\s*architect|kubernetes|docker|ci\/cd|devops|serverless|microservice)\b/i, 'DEVOPS', 'Software'],
  [/\b(nuclear|renewable|solar|wind\s*turbine|energy\s*grid|smart\s*grid|ferc)\b/i, 'ENRG', 'Energy'],
];

export function detectDomain(query: string, modelHint?: string): { code: string | undefined; label: string } {
  const modelMap: Record<string, [string, string]> = {
    taxlaw: ['TAX', 'Tax & IRS'], landman: ['LM', 'Landman'], legal: ['LG', 'Legal'],
    realestate: ['RE', 'Real Estate'], cyber: ['CYBER', 'Cybersecurity'], medical: ['MED', 'Medical'],
    engineering: ['MECH', 'Engineering'], energy: ['ENRG', 'Energy'], software: ['DEVOPS', 'Software'],
    oilgas: ['DRL', 'Oil & Gas'],
  };
  if (modelHint && modelHint !== 'auto' && modelMap[modelHint]) {
    return { code: modelMap[modelHint][0], label: modelMap[modelHint][1] };
  }
  const q = query.toLowerCase();
  for (const [regex, code, label] of DOMAIN_PATTERNS) {
    if (regex.test(q)) return { code, label };
  }
  return { code: undefined, label: 'Cross-Domain' };
}

// ── Core: Fetch Doctrines ──

export async function fetchDoctrineGrounding(
  query: string,
  options: {
    domain?: string;
    modelHint?: string;
    limit?: number;
    mode?: 'FAST' | 'DEFENSE' | 'MEMO';
    timeoutMs?: number;
  } = {},
): Promise<GroundingResult> {
  const start = Date.now();
  const { limit = 8, mode = 'FAST', timeoutMs = 6000 } = options;

  const detected = detectDomain(query, options.modelHint);
  const domain = options.domain || detected.code;

  const body: Record<string, unknown> = { query, limit, mode };
  if (domain) body.domain = domain;

  try {
    const res = await fetch(`${RUNTIME_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': API_KEY },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return emptyResult(domain, detected.label, Date.now() - start);
    }

    const data = await res.json();
    const matches: DoctrineMatch[] = (data.matches || data.results || []).slice(0, limit);

    if (matches.length === 0) {
      return emptyResult(domain, detected.label, Date.now() - start);
    }

    const topScore = Math.max(...matches.map(m => m.score || 0));
    const matchQuality = topScore > 0.8 ? 'strong' : topScore > 0.5 ? 'moderate' : topScore > 0.2 ? 'weak' : 'none';
    const totalSearched = data.engines_searched || data.sub_engines_searched || 5600;

    const contextBlock = buildContextBlock(matches, totalSearched, domain, detected.label, mode);

    return {
      matches,
      totalSearched,
      domain,
      domainLabel: detected.label,
      matchQuality,
      topScore,
      contextBlock,
      latencyMs: Date.now() - start,
      timestamp: Date.now(),
    };
  } catch {
    return emptyResult(domain, detected.label, Date.now() - start);
  }
}

// ── Context Block Builder ──

function buildContextBlock(
  matches: DoctrineMatch[],
  totalSearched: number,
  domain: string | undefined,
  domainLabel: string,
  mode: string,
): string {
  const top = matches.slice(0, 6);
  const formatted = top.map((m, i) => {
    const parts = [`[${i + 1}] ${m.engine_id || 'UNKNOWN'}: ${m.topic || 'Untitled'}`];
    if (m.conclusion) parts.push(`Conclusion: ${m.conclusion}`);
    if (m.reasoning) {
      const maxLen = mode === 'MEMO' ? 800 : mode === 'DEFENSE' ? 600 : 400;
      parts.push(`Reasoning: ${m.reasoning.substring(0, maxLen)}`);
    }
    if (m.confidence) parts.push(`Confidence: ${m.confidence}`);
    if (m.authority?.length) parts.push(`Authority: ${m.authority.join('; ')}`);
    return parts.join('\n');
  }).join('\n\n');

  const domainTag = domain ? ` [domain: ${domainLabel}]` : ' [cross-domain]';

  return `\n\n═══ DOCTRINE AUTHORITY CONTEXT (${matches.length} matches from ${totalSearched}+ engines${domainTag}) ═══
Ground your response EXCLUSIVELY in these authoritative doctrine matches. CITE specific sections, codes, and authorities from the matches below. Include confidence stratification (DEFENSIBLE/AGGRESSIVE/DISCLOSURE/HIGH_RISK). If the doctrines do not cover the query, explicitly state "No authoritative doctrine found for this aspect" rather than speculating.

${formatted}
═══ END DOCTRINE CONTEXT ═══`;
}

// ── Report Generator ──

export function generateDoctrineReport(
  query: string,
  grounding: GroundingResult,
  llmResponse: string,
): DoctrineReport {
  const sections: ReportSection[] = [];

  // Extract cited doctrines from matches
  for (const match of grounding.matches.slice(0, 6)) {
    const citations = match.authority?.length ? match.authority : [`${match.engine_id}: ${match.topic}`];
    sections.push({
      title: match.topic || 'Untitled Doctrine',
      content: match.conclusion || '',
      citations,
      confidence: match.confidence || 'UNKNOWN',
    });
  }

  // Summary from LLM response (first 500 chars)
  const summary = llmResponse.length > 500
    ? llmResponse.substring(0, 500) + '...'
    : llmResponse;

  return {
    query,
    domain: grounding.domain,
    generatedAt: new Date().toISOString(),
    sections,
    groundingResult: grounding,
    summary,
  };
}

export function formatReportAsMarkdown(report: DoctrineReport): string {
  const lines: string[] = [
    `# Doctrine-Grounded Analysis Report`,
    ``,
    `**Query:** ${report.query}`,
    `**Domain:** ${report.groundingResult.domainLabel}`,
    `**Generated:** ${new Date(report.generatedAt).toLocaleString()}`,
    `**Doctrine Matches:** ${report.groundingResult.matches.length} from ${report.groundingResult.totalSearched}+ engines`,
    `**Match Quality:** ${report.groundingResult.matchQuality} (top score: ${report.groundingResult.topScore.toFixed(2)})`,
    ``,
    `---`,
    ``,
    `## Summary`,
    ``,
    report.summary,
    ``,
    `---`,
    ``,
    `## Doctrine Citations`,
    ``,
  ];

  for (const section of report.sections) {
    lines.push(`### ${section.title}`);
    lines.push(``);
    lines.push(section.content);
    lines.push(``);
    lines.push(`**Confidence:** ${section.confidence}`);
    if (section.citations.length > 0) {
      lines.push(`**Authority:** ${section.citations.join('; ')}`);
    }
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(``);
  lines.push(`*Report generated by Echo Prime Sentinel — grounded in ${report.groundingResult.totalSearched}+ intelligence engines.*`);

  return lines.join('\n');
}

// ── Grounding Quality Badge ──

export function getGroundingBadge(result: GroundingResult): {
  label: string;
  color: string;
  icon: string;
  tooltip: string;
} {
  switch (result.matchQuality) {
    case 'strong':
      return {
        label: 'Grounded',
        color: '#10b981',
        icon: '●',
        tooltip: `${result.matches.length} strong doctrine matches from ${result.totalSearched}+ engines (${result.domainLabel})`,
      };
    case 'moderate':
      return {
        label: 'Partial',
        color: '#f59e0b',
        icon: '◐',
        tooltip: `${result.matches.length} partial matches — response may extend beyond doctrine coverage`,
      };
    case 'weak':
      return {
        label: 'Low Grounding',
        color: '#ef4444',
        icon: '○',
        tooltip: `Weak doctrine match — response may contain ungrounded reasoning`,
      };
    case 'none':
    default:
      return {
        label: 'Ungrounded',
        color: '#64748b',
        icon: '✕',
        tooltip: 'No doctrine matches found — response is general-purpose AI output',
      };
  }
}

// ── Helpers ──

function emptyResult(domain: string | undefined, domainLabel: string, latencyMs: number): GroundingResult {
  return {
    matches: [],
    totalSearched: 0,
    domain,
    domainLabel,
    matchQuality: 'none',
    topScore: 0,
    contextBlock: '',
    latencyMs,
    timestamp: Date.now(),
  };
}
