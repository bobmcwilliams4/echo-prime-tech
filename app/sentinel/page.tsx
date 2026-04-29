'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { chatSentinelBrain } from '../../lib/sentinel-brain-api';
import {
  brainIngest,
  detectEmotion,
  buildPersonalityDirective,
  PERSONALITY_PROFILES,
  isCommander,
} from '../../lib/sentinel-cloud-api';
import MarkdownBlock from '../../components/MarkdownBlock';
import TitleChainReport from '../../components/TitleChainReport';
import {
  fetchDoctrineGrounding,
  generateDoctrineReport,
  formatReportAsMarkdown,
  getGroundingBadge,
  type GroundingResult,
} from '../../lib/doctrine-bridge-api';
import ProductTutorialButton from '../../components/product-tutorial-button';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';
import {
  startAsyncInvestigation,
  getJobProgress,
  searchRegionalRecords,
  searchRegionalParties,
  getRegionalStats,
  type TractInput,
  type AsyncJobProgress,
  type PipelineResult,
  type RegionalSearchParams,
  type RegionalDocument,
  type RegionalStats,
  type RegionalSearchResult,
  type PartySearchResult,
} from '../../lib/landman-api';

// Lazy-load 3D scene (no SSR — WebGL)
const NebulaCoreScene = dynamic(
  () => import('../../components/three/NebulaCoreScene'),
  { ssr: false }
);

// ── Types ──

type ChatMode = 'echo' | 'engine' | 'records';

interface DoctrineMatch {
  domain: string;
  engine_id: string;
  engine_name: string;
  topic: string;
  conclusion: string;
  confidence: string;
  score: number;
}

interface DomainRank {
  domain: string;
  label: string;
  matches: number;
  top_score: number;
  engines_matched: number;
}

interface EngineQueryResult {
  ok: boolean;
  mode: string;
  query: string;
  total_doctrines_searched: number;
  total_matches: number;
  response_ms: number;
  domain_ranking: DomainRank[];
  results: DoctrineMatch[];
  determinism_hash: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  personality?: string;
  emotion?: string;
  provider?: string;
  latency?: number;
  voicePlayed?: boolean;
  engineResult?: EngineQueryResult;
  grounding?: GroundingResult;
}

interface PipelineEvent {
  pipeline: string;
  data: Record<string, string>;
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

// ── Constants ──

const AGENT_URL = 'https://echo-sentinel-agent.bmcii1976.workers.dev';
const ECHO_CHAT_URL = 'https://echo-chat.bmcii1976.workers.dev';
const MODEL_HOST_URL = 'https://echo-model-host.bmcii1976.workers.dev';
// SDK-gated runtime: every /query routes through Forge SDK gate (ARCS → engine →
// DOCTRINE_CACHE) and returns audit metadata (run_id, why_link). Replaces the
// legacy bmcii1976 worker that was 500'ing on KV exhaustion.
const ENGINE_RUNTIME_URL = 'https://echo-sentinel.echo-prime.workers.dev';
const STORAGE_KEY = 'sentinel_chat_v2';
const MAX_STORED = 100;

const RESPONSE_MODES = [
  { id: 'FAST', label: 'Fast', desc: 'Concise analysis' },
  { id: 'DEFENSE', label: 'Defense', desc: 'Audit-ready with full citations' },
  { id: 'MEMO', label: 'Memo', desc: 'Full documentation and reasoning' },
] as const;

const DOMAIN_CHIPS = [
  { label: 'Tax', icon: '📊', hint: 'Tax planning, audit defense, compliance', model: 'taxlaw' },
  { label: 'Landman', icon: '🗺️', hint: 'Title chain, mineral rights, leases', model: 'landman' },
  { label: 'Legal', icon: '⚖️', hint: 'Contracts, litigation, compliance', model: 'legal' },
  { label: 'Cyber', icon: '🔒', hint: 'Threats, pentesting, forensics', model: 'cyber' },
  { label: 'Engineering', icon: '⚙️', hint: 'Mechanical, structural, design', model: 'engineering' },
  { label: 'Medical', icon: '🏥', hint: 'Clinical, research, pharmacology', model: 'medical' },
  { label: 'Oil & Gas', icon: '🛢️', hint: 'Drilling, production, completions', model: 'oilgas' },
  { label: 'Finance', icon: '💰', hint: 'Markets, valuation, accounting', model: 'auto' },
  { label: 'Software', icon: '💻', hint: 'Architecture, DevOps, AI/ML', model: 'software' },
  { label: 'Intelligence', icon: '🕵️', hint: 'OSINT, reconnaissance, research', model: 'auto' },
];

const FINE_TUNED_MODELS = [
  { id: 'auto', label: 'Auto (Sentinel Brain)', desc: 'Claude Opus 4.6 + Groq fallback' },
  { id: 'landman', label: 'Landman / TitleHound', desc: 'Chain of title, mineral rights, title examination' },
  { id: 'taxlaw', label: 'Tax Law', desc: 'IRC, partnerships, oil & gas taxation' },
  { id: 'legal', label: 'Legal', desc: 'Contracts, litigation, regulatory compliance' },
  { id: 'realestate', label: 'Real Estate', desc: 'Property law, title issues, zoning' },
  { id: 'cyber', label: 'Cybersecurity', desc: 'Threat analysis, incident response' },
  { id: 'medical', label: 'Medical', desc: 'Clinical analysis, pharmacology' },
  { id: 'engineering', label: 'Engineering', desc: 'Mechanical, structural, design' },
  { id: 'energy', label: 'Energy', desc: 'Nuclear, renewable, grid systems' },
  { id: 'software', label: 'Software', desc: 'Architecture, DevOps, AI/ML' },
  { id: 'oilgas', label: 'Oil & Gas', desc: 'Drilling, production, completions' },
];

// ── Domain → fine-tuned adapter mapping ──
// When auto mode detects a domain, route through BRAVO's specialized LoRA adapter first
function domainToAdapter(domain: string | undefined): string | undefined {
  if (!domain) return undefined;
  const map: Record<string, string> = {
    TAX: 'taxlaw', TX: 'taxlaw',
    LM: 'landman',
    LG: 'legal',
    RE: 'realestate',
    CYBER: 'cyber', S: 'cyber',
    MED: 'medical',
    MECH: 'engineering', DRL: 'engineering',
    FIN: 'software',
    DEVOPS: 'software',
    ENRG: 'engineering',
    CRYPTO: 'software',
  };
  return map[domain];
}

// ── Domain detection for Engine Runtime pre-fetch ──
// Maps user query keywords → Engine Runtime domain codes for targeted doctrine search
function detectQueryDomain(query: string, modelHint?: string): string | undefined {
  // If a specific fine-tuned model is selected, use its domain directly
  const modelDomainMap: Record<string, string> = {
    taxlaw: 'TAX', landman: 'LM', legal: 'LG', realestate: 'RE',
    cyber: 'CYBER', medical: 'MED', engineering: 'MECH', energy: 'ENRG',
    software: 'DEVOPS', oilgas: 'DRL',
  };
  if (modelHint && modelHint !== 'auto' && modelDomainMap[modelHint]) {
    return modelDomainMap[modelHint];
  }

  const q = query.toLowerCase();
  const patterns: [RegExp, string][] = [
    // Tax (TX prefix engines)
    [/\b(tax|irs|irc|1031|1040|deduct|deprec|macrs|gilti|subpart\s?f|cfc|pfic|fdii|beat|tcja|amt|estate\s*tax|gift\s*tax|partnership|s.?corp|llc\s*tax|k-?1|schedule\s*[a-z]|section\s*\d{2,4}|capital\s*gain|passive\s*(loss|income|activit)|like.?kind|opportunity\s*zone|qbi|199a|bonus\s*deprec|cost\s*segreg|r&d\s*credit|erc|salt|withhold|w-?[249]|1099|estimated\s*tax|audit|examiner|revenue\s*rul|treasury\s*reg)\b/i, 'TAX'],
    // Landman (LM prefix engines)
    [/\b(title\s*chain|mineral\s*right|royalt|lease\s*(hold|termina|analy)|deed|survey|abstract|chain\s*of\s*title|conveyance|easement|right.?of.?way|psl|pooling|spacing|unit\s*agree|surface\s*use|curative|run\s*sheet|title\s*opinion|landman)\b/i, 'LM'],
    // Legal (LG prefix engines)
    [/\b(contract|litigation|lawsuit|tort|negligence|breach|fiduciary|statute\s*of\s*limit|injunction|deposition|discovery|summary\s*judgment|class\s*action|arbitrat|mediat|intellect\s*property|trademark|patent|copyright|regulat\s*compli|hipaa|gdpr|aml|kyc|securities|antitrust|employment\s*law|wrongful\s*terminat|bankruptcy|foreclosure)\b/i, 'LG'],
    // Cybersecurity
    [/\b(cyber|malware|ransomware|phishing|pentest|penetration\s*test|vulnerability|cve|exploit|firewall|ids|ips|siem|soc|incident\s*response|threat\s*(hunt|intel)|nist|iso\s*27|pci.?dss|zero.?day|buffer\s*overflow|sql\s*inject|xss|csrf|ddos|encryption|crypto\s*graph)\b/i, 'CYBER'],
    // Medical
    [/\b(medical|clinical|diagnosis|symptom|treatment|pharma|drug\s*interact|dosage|pathology|radiology|oncology|cardiology|neurology|surgery|anesthesia|icd-?\d|cpt\s*code|patient|prescri|lab\s*result|blood\s*test|mri|ct\s*scan|prognosis)\b/i, 'MED'],
    // Oil & Gas / Drilling
    [/\b(drill|completion|fracking|frac|wellbore|casing|cement|mud\s*weight|bop|psi|production|artificial\s*lift|esp|rod\s*pump|gas\s*lift|rrc|railroad\s*commission|p&a|workover|perfora|tubing|annul|spud|deviation|horizontal\s*well|vertical\s*well)\b/i, 'DRL'],
    // Engineering
    [/\b(mechanical\s*engineer|structural|stress\s*analy|finite\s*element|fea|cfd|thermodynamic|fluid\s*mechanic|heat\s*transfer|vibrat\s*analy|fatigue|tolerance|gd&t|materials?\s*science|metallurg|weld|cnc|machin|manufactur)\b/i, 'MECH'],
    // Finance
    [/\b(portfolio|stock|bond|option|derivative|hedge|valuation|dcf|wacc|capm|balance\s*sheet|income\s*statement|cash\s*flow|ebitda|p\/e\s*ratio|market\s*cap|ipo|merger|acquisit|private\s*equity|venture\s*capital|mutual\s*fund|etf|interest\s*rate|federal\s*reserve|inflation)\b/i, 'FIN'],
    // Real Estate
    [/\b(real\s*estate|property\s*law|zoning|eminent\s*domain|property\s*tax|mortgage|title\s*insurance|closing|escrow|appraisal|comps|cap\s*rate|noi|reit|tenant|landlord|commercial\s*property|residential|1031\s*exchange)\b/i, 'RE'],
    // Software/DevOps
    [/\b(software\s*architect|microservice|kubernetes|docker|ci\/cd|devops|cloud\s*native|serverless|api\s*design|database\s*design|system\s*design|scalab|load\s*balanc|caching|message\s*queue|event\s*driven|monolith|react|next\.?js|python|typescript|rust|golang)\b/i, 'DEVOPS'],
    // Energy
    [/\b(nuclear|renewable|solar\s*panel|wind\s*turbine|energy\s*grid|power\s*plant|transmission|distribution|battery\s*storage|ev\s*charg|smart\s*grid|ferc|nerc|utility|kilowatt|megawatt|capacity\s*factor|carbon\s*capture)\b/i, 'ENRG'],
    // Crypto/Blockchain
    [/\b(bitcoin|ethereum|blockchain|defi|smart\s*contract|solidity|nft|token|staking|liquidity\s*pool|dex|cex|wallet|web3|dao|consensus|proof\s*of\s*(work|stake)|gas\s*fee|mempool)\b/i, 'CRYPTO'],
  ];

  for (const [regex, domain] of patterns) {
    if (regex.test(q)) return domain;
  }
  return undefined; // cross-domain search
}

// ── Helpers ──

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Message[];
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_STORED)));
  } catch { /* quota exceeded */ }
}

function detectPipelineReady(text: string): PipelineEvent | null {
  const match = text.match(/\[PIPELINE_READY:(\w+)\]\s*(\{.*?\})/);
  if (!match) return null;
  try {
    return { pipeline: match[1], data: JSON.parse(match[2]) };
  } catch {
    return null;
  }
}

function stripPipelineTokens(text: string): string {
  return text.replace(/\[PIPELINE_READY:\w+\]\s*\{.*?\}/g, '').trim();
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Detect title chain / run sheet requests and extract tract info */
function parseTitleChainRequest(message: string): TractInput | null {
  const lower = message.toLowerCase();
  const triggers = [
    'title chain', 'chain of title', 'run sheet', 'mineral title',
    'ownership history', 'title search', 'title opinion', 'title examination',
    'who owns the minerals', 'ownership chain', 'title report', 'mineral ownership',
    'run a title', 'investigate title', 'title analysis',
  ];
  if (!triggers.some(t => lower.includes(t))) return null;

  // Extract county
  const countyMatch = message.match(/(?:in\s+)?(\w+(?:\s+\w+)?)\s+county/i);
  const county = countyMatch?.[1] || '';

  // Extract section — handle typos (sectiom, seciton, secton) and shorthand (sec, s-)
  const sectionMatch = message.match(/(?:sect?i?o[nm]|sec\.?|s[-.]\s*)\s*(\d+[A-Za-z]?)/i);
  const section = sectionMatch?.[1] || '';

  // Extract block — handle shorthand (blk, blck, b-)
  const blockMatch = message.match(/(?:block|blk|blck|b[-.]\s*)\s*(\d+[A-Za-z]?)/i);
  const block = blockMatch?.[1] || '';

  // Extract lot(s)
  const lotMatch = message.match(/lots?\s+([\d,\s&]+)/i);
  const lot = lotMatch?.[1]?.trim() || '';

  // Extract abstract
  const abstractMatch = message.match(/abstract\s+(\d+[A-Za-z]?)/i);
  const abstract = abstractMatch?.[1] || '';

  // Extract party name
  const partyMatch = message.match(/(?:for|party|grantor|grantee|owner)\s+["""]?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})["""]?/i);
  const party = partyMatch?.[1] || '';

  // Need at least county to proceed
  if (!county) return null;

  const input: TractInput = { county, state: 'TX' };
  if (section) input.section = section;
  if (block) input.block = block;
  if (lot) input.lot = lot;
  if (abstract) input.abstract = abstract;
  if (party) input.party = party;

  return input;
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ── Confidence helpers ──

function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'DEFENSIBLE': return '#10b981';
    case 'AGGRESSIVE': return '#f59e0b';
    case 'DISCLOSURE': return '#6366f1';
    case 'HIGH_RISK': return '#ef4444';
    default: return '#64748b';
  }
}

function getConfidenceLabel(confidence: string): string {
  switch (confidence) {
    case 'DEFENSIBLE': return 'High Confidence';
    case 'AGGRESSIVE': return 'Moderate';
    case 'DISCLOSURE': return 'AI-Generated';
    case 'HIGH_RISK': return 'Low Confidence';
    default: return confidence;
  }
}

// ── Doctrine Result Card — Engine Mode Response Renderer ──

function DoctrineResultCard({ result }: { result: EngineQueryResult }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [showAllDomains, setShowAllDomains] = useState(false);

  const visibleDomains = showAllDomains ? result.domain_ranking : result.domain_ranking.slice(0, 5);

  return (
    <div className="space-y-3 text-sm">
      {/* ── Header Stats ── */}
      <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: '#94a3b8' }}>
        <span className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>
          {result.mode}
        </span>
        <span>{result.total_matches} matches</span>
        <span>{result.total_doctrines_searched?.toLocaleString()} doctrines searched</span>
        <span>{result.domain_ranking.length} domains</span>
        <span>{result.response_ms}ms</span>
      </div>

      {/* ── Domain Rankings ── */}
      {result.domain_ranking.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
            Domain Rankings
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visibleDomains.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs"
                style={{ backgroundColor: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
              >
                <span className="font-semibold" style={{ color: '#c084fc' }}>{d.label || d.domain}</span>
                <span style={{ color: '#94a3b8' }}>×{d.matches}</span>
                <span className="font-mono text-[10px]" style={{ color: '#64748b' }}>
                  {(d.top_score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
            {result.domain_ranking.length > 5 && !showAllDomains && (
              <button
                onClick={() => setShowAllDomains(true)}
                className="px-2 py-1 rounded-md text-xs"
                style={{ color: '#c084fc', border: '1px dashed rgba(168,85,247,0.3)' }}
              >
                +{result.domain_ranking.length - 5} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Doctrine Matches ── */}
      {result.results.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
            Doctrine Matches ({result.results.length})
          </div>
          {result.results.map((doc, i) => {
            const isExpanded = expandedIdx === i;
            return (
              <div
                key={i}
                className="rounded-lg border cursor-pointer transition-colors"
                style={{
                  backgroundColor: isExpanded ? 'rgba(12,18,32,0.9)' : 'rgba(12,18,32,0.4)',
                  borderColor: isExpanded ? 'rgba(168,85,247,0.3)' : 'rgba(30,41,59,0.3)',
                }}
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
              >
                <div className="flex items-start gap-2 p-3">
                  {/* Rank */}
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    {/* Topic + confidence */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs" style={{ color: '#e2e8f0' }}>{doc.topic}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ backgroundColor: `${getConfidenceColor(doc.confidence)}20`, color: getConfidenceColor(doc.confidence) }}
                      >
                        {getConfidenceLabel(doc.confidence)}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: '#64748b' }}>
                        {(doc.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    {/* Engine + domain */}
                    <div className="flex items-center gap-2 mt-0.5 text-[10px]" style={{ color: '#64748b' }}>
                      <span>{doc.engine_id}</span>
                      <span>·</span>
                      <span>{doc.domain}</span>
                    </div>
                    {/* Conclusion (always visible, truncated when collapsed) */}
                    <p
                      className={`mt-1 text-xs leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}
                      style={{ color: '#94a3b8' }}
                    >
                      {doc.conclusion}
                    </p>
                  </div>
                  {/* Expand icon */}
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"
                    className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Determinism Hash ── */}
      {result.determinism_hash && (
        <div className="flex items-center gap-2 pt-1 text-[10px]" style={{ color: '#475569' }}>
          <span>SHA-256:</span>
          <span className="font-mono">{result.determinism_hash.slice(0, 16)}...</span>
          <button
            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(result.determinism_hash); }}
            className="hover:opacity-100 opacity-50 transition-opacity"
          >
            Copy
          </button>
        </div>
      )}

      {/* ── No results fallback ── */}
      {result.results.length === 0 && (
        <div className="text-center py-4" style={{ color: '#64748b' }}>
          <p className="text-sm">No doctrine matches found for this query.</p>
          <p className="text-xs mt-1">Try broadening your search terms or switching to Echo Chat mode for AI analysis.</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──

export default function SentinelPage() {
  const router = useRouter();
  const { user, loading, role, grants } = useAuth();
  const { isDark, toggle } = useTheme();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // Mode state: 'echo' = LLM Chat, 'engine' = Pure Doctrine
  const [chatMode, setChatMode] = useState<ChatMode>('echo');
  const [responseMode, setResponseMode] = useState<'FAST' | 'DEFENSE' | 'MEMO'>('FAST');

  // Model state
  const [selectedModel, setSelectedModel] = useState('auto');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [lastSearchResults, setLastSearchResults] = useState<SearchResult[]>([]);
  const [lastToolsUsed, setLastToolsUsed] = useState<string[]>([]);

  // Pipeline state (title chain async jobs)
  const [pipelineJobId, setPipelineJobId] = useState<string | null>(null);
  const [pipelineProgress, setPipelineProgress] = useState<AsyncJobProgress | null>(null);
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);
  const pipelineTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Records DB state
  const [recordsQuery, setRecordsQuery] = useState('');
  const [recordsCounty, setRecordsCounty] = useState('');
  const [recordsGrantor, setRecordsGrantor] = useState('');
  const [recordsGrantee, setRecordsGrantee] = useState('');
  const [recordsDocType, setRecordsDocType] = useState('');
  const [recordsRegion, setRecordsRegion] = useState<'' | 'permian' | 'east_texas' | 'central_texas'>('');
  const [recordsResults, setRecordsResults] = useState<RegionalSearchResult | null>(null);
  const [partyResults, setPartyResults] = useState<PartySearchResult | null>(null);
  const [recordsStats, setRecordsStats] = useState<RegionalStats | null>(null);
  const [recordsSearching, setRecordsSearching] = useState(false);
  const [recordsSearchMode, setRecordsSearchMode] = useState<'document' | 'party'>('document');

  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [listening, setListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Ambient audio state
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const ambientCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientNodesRef = useRef<OscillatorNode[]>([]);

  // Start/stop ambient audio
  useEffect(() => {
    if (!ambientEnabled) {
      // Stop ambient
      ambientNodesRef.current.forEach(n => { try { n.stop(); } catch {} });
      ambientNodesRef.current = [];
      if (ambientCtxRef.current && ambientCtxRef.current.state !== 'closed') {
        ambientCtxRef.current.close();
      }
      ambientCtxRef.current = null;
      ambientGainRef.current = null;
      return;
    }
    // Create ambient drone — ethereal choir pad
    const ctx = new AudioContext();
    ambientCtxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.06; // Very low volume
    master.connect(ctx.destination);
    ambientGainRef.current = master;

    // Choir-like pad: layered detuned sine waves at harmonic intervals
    const baseFreq = 110; // A2
    const harmonics = [1, 1.5, 2, 2.5, 3, 4]; // octave, fifth, octave, etc
    const detunes = [-8, -3, 0, 3, 5, 8]; // cents of detuning for chorus effect
    const nodes: OscillatorNode[] = [];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = baseFreq * h;
      osc.detune.value = detunes[i % detunes.length] + (Math.random() - 0.5) * 4;
      const g = ctx.createGain();
      // Higher harmonics quieter
      g.gain.value = 0.3 / (1 + i * 0.5);
      // Slow tremolo for ethereal feel
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + Math.random() * 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = g.gain.value * 0.3;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      lfo.start();
      nodes.push(lfo as unknown as OscillatorNode);

      osc.connect(g);
      g.connect(master);
      osc.start();
      nodes.push(osc);
    });

    // Add filtered noise for breath/wind texture
    const noiseLen = ctx.sampleRate * 2;
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) noiseData[i] = (Math.random() * 2 - 1) * 0.3;
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    noiseSrc.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 0.5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSrc.start();

    ambientNodesRef.current = nodes;

    return () => {
      nodes.forEach(n => { try { n.stop(); } catch {} });
      try { noiseSrc.stop(); } catch {}
      if (ctx.state !== 'closed') ctx.close();
    };
  }, [ambientEnabled]);

  // Lightning sound effect — short electric crackle via Web Audio
  const playLightningSfx = useCallback(() => {
    if (!ambientEnabled) return; // Only play if ambient audio is on
    try {
      const ctx = ambientCtxRef.current || new AudioContext();
      const duration = 0.08 + Math.random() * 0.06;
      const bufLen = Math.floor(ctx.sampleRate * duration);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      // White noise burst with exponential decay
      for (let i = 0; i < bufLen; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 30) * 0.4;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000 + Math.random() * 3000;
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ambientGainRef.current || ctx.destination);
      src.start();
    } catch {}
  }, [ambientEnabled]);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const commander = user ? isCommander(user.email || '') : false;

  // ── Close model dropdown on outside click ──
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!modelDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [modelDropdownOpen]);

  // ── Auth guard ──
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // ── Load messages from localStorage ──
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) setMessages(stored);
  }, []);

  // ── Persist messages ──
  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  // ── Auto-scroll ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Speech recognition setup ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      }
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  // ── Pipeline polling ──
  useEffect(() => {
    if (!pipelineJobId) return;
    const poll = async () => {
      try {
        const progress = await getJobProgress(pipelineJobId);
        setPipelineProgress(progress);

        if (progress.status === 'complete' && progress.result) {
          setPipelineResult(progress.result);
          setPipelineJobId(null);
          setSending(false);
          // Replace the progress system message with a completion message
          setMessages(prev => {
            const updated = prev.filter(m => m.id !== 'pipeline_progress');
            return [...updated, {
              id: generateId(),
              role: 'system' as const,
              content: `Title chain analysis complete — ${progress.records_found} records found, ${progress.gaps_found} gaps identified in ${formatElapsed(progress.elapsed_ms)}`,
              timestamp: Date.now(),
            }];
          });
        } else if (progress.status === 'failed') {
          setPipelineJobId(null);
          setSending(false);
          setMessages(prev => {
            const updated = prev.filter(m => m.id !== 'pipeline_progress');
            return [...updated, {
              id: generateId(),
              role: 'assistant' as const,
              content: `The title chain analysis encountered an error: ${progress.error || 'Unknown error'}. Please try again or refine your search criteria.`,
              timestamp: Date.now(),
              provider: 'landman-pipeline',
            }];
          });
        } else {
          // Update the progress system message in-place
          setMessages(prev => prev.map(m =>
            m.id === 'pipeline_progress'
              ? { ...m, content: `__PIPELINE_PROGRESS__` }
              : m
          ));
        }
      } catch {
        // Polling error — keep trying
      }
    };
    poll(); // Immediate first poll
    pipelineTimerRef.current = setInterval(poll, 3000);
    return () => {
      if (pipelineTimerRef.current) clearInterval(pipelineTimerRef.current);
    };
  }, [pipelineJobId]);

  // ── Voice playback ──
  const playVoice = useCallback(async (text: string, msgId: string) => {
    if (voicePlaying) return;
    setVoicePlaying(true);
    try {
      const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/\[.*?\]/g, '').replace(/[#*_~`>|]/g, '').slice(0, 2000);
      // 2026-04-29 cc2-hammer: dead echo-speak-cloud worker (CF 1010 blocked) ->
      // FORGE Echo voice (XTTS-v2 GPU :7800) via SDK gate proxy.
      const res = await fetch('https://theories-equity-expect-population.trycloudflare.com/sentinel/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Echo-API-Key': process.env.NEXT_PUBLIC_ECHO_API_KEY || 'echo-omega-prime-forge-x-2026',
        },
        body: JSON.stringify({
          text: cleanText,
          voice: 'echo',
        }),
      });
      if (!res.ok) throw new Error(`TTS error: ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      let audioUrl: string;
      if (contentType.includes('audio') || contentType.includes('octet-stream')) {
        // TTS returns raw audio bytes (MP3)
        const blob = await res.blob();
        audioUrl = URL.createObjectURL(blob);
      } else {
        // Fallback: JSON response with base64
        const data = await res.json();
        if (!data.audio_base64) throw new Error('No audio data');
        audioUrl = `data:${data.content_type || 'audio/mpeg'};base64,${data.audio_base64}`;
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setVoicePlaying(false);
        if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setVoicePlaying(false);
        if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, voicePlayed: true } : m));
    } catch {
      setVoicePlaying(false);
    }
  }, [voicePlaying]);

  // ── Toggle microphone ──
  const toggleMic = useCallback(() => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening]);

  // ── Load records stats when entering records mode ──
  useEffect(() => {
    if (chatMode === 'records' && !recordsStats) {
      getRegionalStats().then(setRecordsStats).catch(() => {});
    }
  }, [chatMode, recordsStats]);

  // ── Records DB search handler ──
  const handleRecordsSearch = useCallback(async (overrideCounty?: string) => {
    if (recordsSearching) return;
    const county = overrideCounty ?? recordsCounty;
    setRecordsSearching(true);
    setRecordsResults(null);
    setPartyResults(null);
    try {
      if (recordsSearchMode === 'party' && (recordsGrantor || recordsGrantee)) {
        const name = recordsGrantor || recordsGrantee;
        const role = recordsGrantor ? 'grantor' as const : 'grantee' as const;
        const res = await searchRegionalParties({
          name,
          role,
          county: county || undefined,
          region: (recordsRegion || undefined) as RegionalSearchParams['region'],
          limit: 50,
        });
        setPartyResults(res);
      } else {
        const res = await searchRegionalRecords({
          query: recordsQuery || undefined,
          county: county || undefined,
          grantor: recordsGrantor || undefined,
          grantee: recordsGrantee || undefined,
          doc_type: recordsDocType || undefined,
          region: (recordsRegion || undefined) as RegionalSearchParams['region'],
          limit: 50,
        });
        setRecordsResults(res);
      }
    } catch (err) {
      console.error('Records search error:', err);
    } finally {
      setRecordsSearching(false);
    }
  }, [recordsSearching, recordsSearchMode, recordsQuery, recordsCounty, recordsGrantor, recordsGrantee, recordsDocType, recordsRegion]);

  // ── Send message (dual-mode) ──
  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;

    setInput('');
    setSending(true);
    setLastSearchResults([]);
    setLastToolsUsed([]);

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: msg,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);

    // ── Title Chain Pipeline Detection (both modes) ──
    const tractInput = parseTitleChainRequest(msg);
    if (tractInput) {
      try {
        const job = await startAsyncInvestigation(tractInput);
        setPipelineJobId(job.job_id);
        setPipelineProgress(null);
        setPipelineResult(null);
        setMessages(prev => [...prev, {
          id: 'pipeline_progress',
          role: 'system' as const,
          content: '__PIPELINE_PROGRESS__',
          timestamp: Date.now(),
        }]);
        return;
      } catch (err) {
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'system' as const,
          content: `Title chain pipeline unavailable — falling back to ${chatMode === 'engine' ? 'doctrine query' : 'AI analysis'}. (${err instanceof Error ? err.message : 'Connection error'})`,
          timestamp: Date.now(),
        }]);
      }
    }

    const showThinking = () => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '...') return prev;
        return [...prev, {
          id: 'thinking',
          role: 'assistant' as const,
          content: '...',
          timestamp: Date.now(),
        }];
      });
    };

    // ═══════════════════════════════════════════════
    // MODE 2: ENGINE QUERY — Pure Doctrine, Zero LLM
    // ═══════════════════════════════════════════════
    if (chatMode === 'engine') {
      showThinking();
      const startTime = Date.now();
      try {
        const detectedDomain = detectQueryDomain(msg, selectedModel);
        const engineBody: Record<string, unknown> = {
          query: msg,
          limit: 20,
          mode: responseMode,
        };
        if (detectedDomain) engineBody.domain = detectedDomain;
        const engineRes = await fetch(`${ENGINE_RUNTIME_URL}/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026',
          },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify(engineBody),
        });

        setMessages(prev => prev.filter(m => m.id !== 'thinking'));

        if (engineRes.ok) {
          const engineData: EngineQueryResult = await engineRes.json();
          const latency = Date.now() - startTime;

          // Build search results from engine matches for the sources panel
          if (engineData.results?.length) {
            setLastSearchResults(engineData.results.map(r => ({
              title: `${r.engine_id}: ${r.topic}`,
              snippet: r.conclusion,
              url: '',
              source: `engine:${r.domain}`,
            })));
            setLastToolsUsed(['engine_query']);
          }

          const assistantMsg: Message = {
            id: generateId(),
            role: 'assistant',
            content: '__ENGINE_RESULT__',
            timestamp: Date.now(),
            provider: `engine-runtime (${responseMode})`,
            latency,
            engineResult: engineData,
          };

          setMessages(prev => [...prev, assistantMsg]);

          brainIngest('sentinel_engine', `[user] ${msg}`, 5, ['sentinel', 'engine-query']).catch(() => {});
          brainIngest('sentinel_engine', `[doctrine] ${engineData.total_matches} matches across ${engineData.domain_ranking.length} domains in ${engineData.response_ms}ms`, 5, ['sentinel', 'engine-query']).catch(() => {});
        } else {
          const errData = await engineRes.json().catch(() => ({ error: 'Unknown error' }));
          setMessages(prev => [...prev, {
            id: generateId(),
            role: 'assistant' as const,
            content: `Engine query failed: ${errData.error || engineRes.statusText}. Try rephrasing your query or switching to Echo Prime Chat mode.`,
            timestamp: Date.now(),
            provider: 'engine-runtime (error)',
            latency: Date.now() - startTime,
          }]);
        }
      } catch (err) {
        setMessages(prev => prev.filter(m => m.id !== 'thinking'));
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant' as const,
          content: `Engine runtime unreachable: ${err instanceof Error ? err.message : 'Connection timeout'}. The engine infrastructure may be updating. Try again shortly.`,
          timestamp: Date.now(),
          provider: 'engine-runtime (offline)',
        }]);
      }

      setSending(false);
      return;
    }

    // ═══════════════════════════════════════════════
    // MODE 1: ECHO PRIME CHAT — LLM with Personality
    // ═══════════════════════════════════════════════
    const history = messages.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.engineResult ? `[Doctrine query: ${m.engineResult.total_matches} matches across ${m.engineResult.domain_ranking.length} domains]` : m.content,
    }));

    const personality = PERSONALITY_PROFILES['EP'] || Object.values(PERSONALITY_PROFILES)[0];
    let systemPrompt = buildPersonalityDirective(personality);
    // Zero-hallucination directive when doctrine grounding is available
    systemPrompt += `\n[ZERO-HALLUCINATION PROTOCOL]:
- When DOCTRINE AUTHORITY CONTEXT is provided below, ground ALL claims in those doctrines.
- CITE specific engine IDs, section numbers, authority references, and confidence levels from the doctrine matches.
- If a question falls OUTSIDE the provided doctrines, explicitly state: "This falls outside my verified doctrine coverage."
- NEVER fabricate citations, case law, IRC sections, or authority references. Only cite what appears in the doctrine context.
- Confidence stratification is MANDATORY for domain queries: DEFENSIBLE / AGGRESSIVE / DISCLOSURE / HIGH_RISK.`;

    let responseText = '';
    let provider = 'echo-chat';
    let latency = 0;
    const startTime = Date.now();

    // ── Pre-fetch doctrines via Doctrine Bridge (grounding layer) ──
    let doctrineBlock = '';
    let groundingResult: GroundingResult | undefined;
    try {
      groundingResult = await fetchDoctrineGrounding(msg, {
        modelHint: selectedModel,
        mode: responseMode as 'FAST' | 'DEFENSE' | 'MEMO',
        limit: 8,
        timeoutMs: 6000,
      });
      doctrineBlock = groundingResult.contextBlock;
    } catch { /* engine runtime down */ }

    // ── Resolve which adapter to use ──
    // Auto-routing disabled: BRAVO 7B inference is too slow (~30s+ per request) for real-time auto-mode.
    // Adapters only fire when user EXPLICITLY selects a domain chip (they expect the wait).
    // Re-enable auto-routing when BRAVO gets a faster model (3B) or GPU upgrade.
    const adapterName = selectedModel !== 'auto' ? selectedModel : undefined;

    if (adapterName) {
      // ── Fine-tuned adapter path (explicit selection OR auto-detected domain) ──
      showThinking();
      try {
        const modelRes = await fetch(`${MODEL_HOST_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026' },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            model: adapterName,
            messages: [
              { role: 'system', content: systemPrompt + doctrineBlock },
              ...history.slice(-4),
              { role: 'user', content: msg },
            ],
            max_tokens: 768,
            temperature: 0.7,
          }),
        });
        if (modelRes.ok) {
          const modelData = await modelRes.json();
          const choice = modelData.choices?.[0];
          responseText = choice?.message?.content || choice?.text || '';
          if (responseText && responseText.length > 20) {
            const modelMeta = FINE_TUNED_MODELS.find(m => m.id === adapterName);
            const routeLabel = selectedModel !== 'auto' ? '(explicit)' : '(auto-routed)';
            provider = `${modelMeta?.label || adapterName} ${routeLabel} → BRAVO`;
            latency = modelData.timing?.total_seconds ? modelData.timing.total_seconds * 1000 : (Date.now() - startTime);
          } else {
            responseText = ''; // adapter returned too-short response, fall through
          }
        }
      } catch { /* adapter/BRAVO down — fall through to main chain */ }
    }

    if (!responseText) {
      // ── Step 1: Agent enrichment ──
      let enrichedSystemPrompt = systemPrompt;
      showThinking();
      try {
        const agentRes = await fetch(`${AGENT_URL}/agent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({ message: msg }),
        });
        if (agentRes.ok) {
          const agentData = await agentRes.json();
          if (agentData.enriched_context) enrichedSystemPrompt = agentData.enriched_context;
          if (agentData.search_results?.length) setLastSearchResults(agentData.search_results);
          if (agentData.knowledge_results?.length) {
            setLastSearchResults(prev => [...prev, ...agentData.knowledge_results]);
          }
          if (agentData.tools_used?.length) setLastToolsUsed(agentData.tools_used);
        }
      } catch { /* agent down */ }

      // ── Step 1.5: Inject pre-fetched doctrine context ──
      if (doctrineBlock) {
        enrichedSystemPrompt += doctrineBlock;
      }

      // ── Step 2: Sentinel Brain (Claude Opus 4.6) ──
      try {
        const brainResult = await chatSentinelBrain(msg, enrichedSystemPrompt, history, (status) => {
          if (status === 'processing') showThinking();
        });
        if (brainResult.response && brainResult.response.length > 10) {
          responseText = brainResult.response;
          provider = `sentinel-brain → opus-4.6`;
          latency = brainResult.duration_ms;
        }
      } catch { /* brain down */ }

      // ── Step 3: Echo Chat ──
      if (!responseText) {
        try {
          const chatRes = await fetch(`${ECHO_CHAT_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026' },
            signal: AbortSignal.timeout(30000),
            body: JSON.stringify({
              message: msg, user_id: user?.uid || 'sentinel_web', site_id: 'echo-ept',
              system_prompt: enrichedSystemPrompt, history: history.slice(-6), personality: 'EP', max_tokens: 2048,
            }),
          });
          if (chatRes.ok) {
            const chatData = await chatRes.json();
            responseText = chatData.response || chatData.message || '';
            provider = `echo-chat → ${chatData.llm_provider || chatData.model || 'auto'}`;
            latency = chatData.latency_ms || (Date.now() - startTime);
          }
        } catch { /* fall through */ }
      }

      // ── Step 4: Groq fallback ──
      if (!responseText) {
        try {
          const groqRes = await fetch(`${ECHO_CHAT_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026' },
            signal: AbortSignal.timeout(15000),
            body: JSON.stringify({
              message: msg, user_id: user?.uid || 'sentinel_web', site_id: 'echo-ept',
              system_prompt: enrichedSystemPrompt, history: history.slice(-4), model: 'groq', personality: 'EP', max_tokens: 2048,
            }),
          });
          if (groqRes.ok) {
            const groqData = await groqRes.json();
            responseText = groqData.response || groqData.message || '';
            provider = 'echo-chat → groq';
          }
        } catch { /* fall through */ }
      }

      // ── Step 5: Offline fallback ──
      if (!responseText) {
        responseText = 'I\'m experiencing connectivity issues with my backend services. Please try again in a moment, or try selecting a specific model from the dropdown above.';
        provider = 'offline';
      }
    }

    latency = latency || (Date.now() - startTime);
    setMessages(prev => prev.filter(m => m.id !== 'thinking'));

    const pipeline = detectPipelineReady(responseText);
    const cleanResponse = stripPipelineTokens(responseText);

    let emotion = 'neutral';
    try { emotion = detectEmotion(cleanResponse).dominant; } catch { /* ignore */ }

    const assistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: cleanResponse,
      timestamp: Date.now(),
      personality: 'Echo Prime',
      emotion,
      provider,
      latency,
      grounding: groundingResult,
    };

    setMessages(prev => [...prev, assistantMsg]);

    if (voiceEnabled && cleanResponse.length < 2000) {
      playVoice(cleanResponse, assistantMsg.id);
    }

    if (pipeline) {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'system',
        content: `Pipeline triggered: ${pipeline.pipeline} with data: ${JSON.stringify(pipeline.data)}`,
        timestamp: Date.now(),
      }]);
    }

    brainIngest('sentinel_chat', `[user] ${msg}`, 5, ['sentinel', 'chat']).catch(() => {});
    brainIngest('sentinel_chat', `[assistant] ${cleanResponse.slice(0, 500)}`, 5, ['sentinel', 'chat']).catch(() => {});

    setSending(false);
  }, [input, sending, messages, selectedModel, chatMode, responseMode, voiceEnabled, playVoice]);

  // ── Clear chat ──
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setPipelineJobId(null);
    setPipelineProgress(null);
    setPipelineResult(null);
    if (pipelineTimerRef.current) clearInterval(pipelineTimerRef.current);
  }, []);

  // ── Handle keyboard ──
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // ── Handle domain chip click ──
  const handleChipClick = useCallback((label: string) => {
    const chip = DOMAIN_CHIPS.find(c => c.label === label);
    if (chip && chip.model !== 'auto') {
      setSelectedModel(chip.model);
    }
    const starters: Record<string, string> = {
      'Tax': 'I need help with a tax question. ',
      'Landman': 'I need a title chain analysis. ',
      'Legal': 'I have a legal question. ',
      'Cyber': 'I need cybersecurity analysis. ',
      'Engineering': 'I have an engineering question. ',
      'Medical': 'I have a medical question. ',
      'Oil & Gas': 'I need oilfield operations analysis. ',
      'Finance': 'I have a finance question. ',
      'Software': 'I need software engineering help. ',
      'Intelligence': 'I need intelligence research. ',
    };
    setInput(starters[label] || `I need help with ${label}. `);
    inputRef.current?.focus();
  }, []);

  // ── Loading / Auth check ──
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{name:'Home',href:'/'},{name:'Products',href:'/services'},{name:'Sentinel AI',href:'/sentinel'}]} />
      <FaqSchema faqs={[
        { q: 'What makes Sentinel AI different from ChatGPT or other chatbots?', a: 'Sentinel is not a chatbot — it is a professional intelligence interface backed by 5,486+ domain-specific engines and 607K+ pre-compiled doctrines. Every response includes authority citations (IRC codes, case law, NIST frameworks, medical literature) with confidence stratification. Sentinel delivers court-defensible answers, not conversational guesses.' },
        { q: 'What domains can Sentinel query?', a: 'Sentinel covers 940+ knowledge domains including tax law, legal analysis, cybersecurity, medical intelligence, oilfield engineering, financial modeling, forensics, accounting, insurance, and dozens of specialized fields. You can query a single domain or let the system auto-route across multiple relevant engines.' },
        { q: 'How does the title chain investigation feature work?', a: 'Sentinel detects natural language requests for title chain research and automatically triggers our Landman Pipeline — an async investigation system covering 80+ Texas counties and 259K+ records. Results are delivered in a professional 5-tab report: Summary, Run Sheet, Ownership Chain, Gap Analysis, and Full Report.' },
        { q: 'Can I choose which AI model processes my query?', a: 'Yes. Sentinel supports multiple fine-tuned models including Claude Opus 4.6, GPT-4.1, Grok, and specialized adapters trained on domain-specific content. You can select a specific model or use auto-routing, which matches your query to the best-performing model for that domain.' },
        { q: 'Is voice interaction available?', a: 'Pro and higher plans include voice-enabled Sentinel with real-time speech-to-text input and text-to-speech responses powered by ElevenLabs. You can have natural spoken conversations with Sentinel while it queries intelligence engines and delivers expert-level answers out loud.' },
        { q: 'What are the query limits on each plan?', a: 'Free tier includes 50 queries per day. Pro plans offer unlimited queries with priority model access and voice. Business plans add API access, team seats, and SLA guarantees. Sovereign plans include custom engine development and white-label deployment.' },
      ]} />
      <ProductTutorialButton tutorialId="engines" productName="Sentinel AI" />
      {/* ── Chat viewport (contains 3D scene, header, messages, input) ── */}
      <div className="relative flex flex-col overflow-hidden" style={{ height: '100vh', minHeight: '100vh', backgroundColor: '#050508' }}>
      {/* ── 3D Nebula Orb Background — confined to chat viewport ── */}
      <div className="absolute inset-0 z-0">
        <NebulaCoreScene
          isSpeaking={voicePlaying}
          isThinking={sending}
          onLightning={playLightningSfx}
        />
      </div>

      {/* ── Gradient overlay for readability — confined to chat viewport ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: hasMessages
            ? 'linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, rgba(5,5,8,0.7) 30%, rgba(5,5,8,0.85) 60%, rgba(5,5,8,0.95) 100%)'
            : 'linear-gradient(to bottom, rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.3) 50%, rgba(5,5,8,0.7) 100%)',
        }}
      />

      {/* ── Nav Bar ── */}
      <header
        className="relative z-10 border-b px-4 md:px-6 py-3 flex items-center justify-between shrink-0"
        style={{
          borderColor: 'rgba(30,41,59,0.5)',
          backgroundColor: 'rgba(5,5,8,0.6)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="Echo Prime"
              width={32}
              height={32}
              style={{ mixBlendMode: 'screen' }}
            />
          </Link>
          <h1 className="text-lg font-bold text-white">
            Sentinel AI
          </h1>
          {commander && (
            <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              CMDR
            </span>
          )}
          {/* ── Mode Toggle ── */}
          <div
            className="flex items-center rounded-lg border overflow-hidden ml-2"
            style={{ borderColor: 'rgba(100,116,139,0.3)', backgroundColor: 'rgba(15,23,42,0.6)' }}
          >
            <button
              onClick={() => setChatMode('echo')}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{
                backgroundColor: chatMode === 'echo' ? 'var(--ept-accent)' : 'transparent',
                color: chatMode === 'echo' ? '#fff' : '#94a3b8',
              }}
            >
              Echo Chat
            </button>
            <button
              onClick={() => setChatMode('engine')}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{
                backgroundColor: chatMode === 'engine' ? '#a855f7' : 'transparent',
                color: chatMode === 'engine' ? '#fff' : '#94a3b8',
              }}
            >
              Engine Query
            </button>
            <button
              onClick={() => setChatMode('records')}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{
                backgroundColor: chatMode === 'records' ? '#f59e0b' : 'transparent',
                color: chatMode === 'records' ? '#fff' : '#94a3b8',
              }}
            >
              Records DB
            </button>
          </div>
          {/* ── Response Mode (Engine mode only) ── */}
          {chatMode === 'engine' && (
            <div className="flex items-center gap-1 ml-1">
              {RESPONSE_MODES.map(rm => (
                <button
                  key={rm.id}
                  onClick={() => setResponseMode(rm.id as 'FAST' | 'DEFENSE' | 'MEMO')}
                  className="px-2 py-1 text-[10px] font-semibold rounded transition-colors"
                  style={{
                    backgroundColor: responseMode === rm.id ? 'rgba(168,85,247,0.2)' : 'transparent',
                    color: responseMode === rm.id ? '#c084fc' : '#64748b',
                    border: responseMode === rm.id ? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent',
                  }}
                  title={rm.desc}
                >
                  {rm.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Model selector (hidden in engine mode — engine mode uses ALL engines, no model selection) */}
          {chatMode === 'echo' && <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
              style={{
                borderColor: selectedModel !== 'auto' ? 'var(--ept-accent)' : 'rgba(100,116,139,0.4)',
                backgroundColor: selectedModel !== 'auto' ? 'var(--ept-accent)' : 'rgba(15,23,42,0.6)',
                color: selectedModel !== 'auto' ? '#fff' : '#94a3b8',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              {FINE_TUNED_MODELS.find(m => m.id === selectedModel)?.label || 'Auto'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {modelDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-64 rounded-xl border shadow-xl overflow-hidden z-50"
                style={{ backgroundColor: 'rgba(12,18,32,0.95)', borderColor: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(16px)' }}
              >
                <div className="p-2 text-xs font-semibold border-b" style={{ color: '#64748b', borderColor: 'rgba(30,41,59,0.4)' }}>
                  Fine-Tuned Models (Qwen2.5-7B)
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {FINE_TUNED_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setModelDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between hover:bg-white/5"
                      style={{
                        backgroundColor: selectedModel === m.id ? 'rgba(20,184,166,0.1)' : 'transparent',
                        color: '#e2e8f0',
                      }}
                    >
                      <div>
                        <div className="font-medium">{m.label}</div>
                        <div className="text-xs" style={{ color: '#64748b' }}>{m.desc}</div>
                      </div>
                      {selectedModel === m.id && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--ept-accent)' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>}
          {/* Voice toggle */}
          <button
            onClick={() => {
              if (voicePlaying && audioRef.current) {
                audioRef.current.pause();
                setVoicePlaying(false);
              }
              setVoiceEnabled(v => !v);
            }}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: voiceEnabled ? 'var(--ept-accent)' : 'transparent',
              color: voiceEnabled ? '#fff' : '#94a3b8',
            }}
            title={voiceEnabled ? 'Voice ON' : 'Voice OFF'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              {voiceEnabled ? (
                <>
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </>
              ) : (
                <path d="M23 9l-6 6M17 9l6 6" />
              )}
            </svg>
          </button>
          {/* Ambient audio toggle */}
          <button
            onClick={() => setAmbientEnabled(v => !v)}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: ambientEnabled ? 'rgba(168,85,247,0.2)' : 'transparent',
              color: ambientEnabled ? '#a855f7' : '#94a3b8',
            }}
            title={ambientEnabled ? 'Ambient Audio ON' : 'Ambient Audio OFF'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </button>
          {/* Clear */}
          <button
            onClick={clearChat}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#94a3b8' }}
            title="Clear chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
          {/* Theme */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#94a3b8' }}
            title="Toggle theme"
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Chat Area ── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 py-6" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        {chatMode === 'records' ? (
          /* ── Records DB Search Panel ── */
          <div className="max-w-5xl mx-auto space-y-4 animate-fade-up">
            {/* Stats Header */}
            <div className="text-center pt-4 pb-2">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: '#f59e0b' }}>
                Oil &amp; Gas Records Database
              </h2>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                {recordsStats
                  ? `${recordsStats.total_documents.toLocaleString()} deed records across ${recordsStats.counties.length} Texas counties — 3 regional databases`
                  : 'Loading database stats...'}
              </p>
              {recordsStats && (
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {recordsStats.regions.map(r => (
                    <span key={r.region} className="px-3 py-1 rounded-full text-xs font-medium border" style={{
                      borderColor: 'rgba(245,158,11,0.3)',
                      backgroundColor: 'rgba(245,158,11,0.1)',
                      color: '#f59e0b',
                    }}>
                      {r.region.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {r.documents.toLocaleString()} docs · {r.counties} counties
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Search Mode Toggle */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setRecordsSearchMode('document')}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: recordsSearchMode === 'document' ? '#f59e0b' : 'rgba(15,23,42,0.6)',
                  color: recordsSearchMode === 'document' ? '#000' : '#94a3b8',
                }}
              >
                Document Search
              </button>
              <button
                onClick={() => setRecordsSearchMode('party')}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: recordsSearchMode === 'party' ? '#f59e0b' : 'rgba(15,23,42,0.6)',
                  color: recordsSearchMode === 'party' ? '#000' : '#94a3b8',
                }}
              >
                Party Search
              </button>
            </div>

            {/* Search Form */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'rgba(15,23,42,0.6)', borderColor: 'rgba(30,41,59,0.5)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recordsSearchMode === 'document' && (
                  <input
                    value={recordsQuery}
                    onChange={e => setRecordsQuery(e.target.value)}
                    placeholder="Search text (legal desc, instrument #...)"
                    className="col-span-1 md:col-span-3 rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                    style={{ borderColor: 'rgba(30,41,59,0.5)', color: '#e2e8f0' }}
                    onKeyDown={e => e.key === 'Enter' && handleRecordsSearch()}
                  />
                )}
                <input
                  value={recordsGrantor}
                  onChange={e => setRecordsGrantor(e.target.value)}
                  placeholder="Grantor name"
                  className="rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                  style={{ borderColor: 'rgba(30,41,59,0.5)', color: '#e2e8f0' }}
                  onKeyDown={e => e.key === 'Enter' && handleRecordsSearch()}
                />
                <input
                  value={recordsGrantee}
                  onChange={e => setRecordsGrantee(e.target.value)}
                  placeholder="Grantee name"
                  className="rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                  style={{ borderColor: 'rgba(30,41,59,0.5)', color: '#e2e8f0' }}
                  onKeyDown={e => e.key === 'Enter' && handleRecordsSearch()}
                />
                <select
                  value={recordsRegion}
                  onChange={e => setRecordsRegion(e.target.value as typeof recordsRegion)}
                  className="rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                  style={{ borderColor: 'rgba(30,41,59,0.5)', color: '#e2e8f0', backgroundColor: 'rgba(15,23,42,0.8)' }}
                >
                  <option value="">All Regions</option>
                  <option value="permian">Permian Basin</option>
                  <option value="east_texas">East Texas</option>
                  <option value="central_texas">Central Texas</option>
                </select>
                <input
                  value={recordsCounty}
                  onChange={e => setRecordsCounty(e.target.value.toUpperCase())}
                  placeholder="County (e.g. REEVES)"
                  className="rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                  style={{ borderColor: 'rgba(30,41,59,0.5)', color: '#e2e8f0' }}
                  onKeyDown={e => e.key === 'Enter' && handleRecordsSearch()}
                />
                {recordsSearchMode === 'document' && (
                  <input
                    value={recordsDocType}
                    onChange={e => setRecordsDocType(e.target.value)}
                    placeholder="Doc type (DEED, LEASE, OGL...)"
                    className="rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                    style={{ borderColor: 'rgba(30,41,59,0.5)', color: '#e2e8f0' }}
                    onKeyDown={e => e.key === 'Enter' && handleRecordsSearch()}
                  />
                )}
                <button
                  onClick={() => handleRecordsSearch()}
                  disabled={recordsSearching}
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    backgroundColor: recordsSearching ? '#78350f' : '#f59e0b',
                    color: '#000',
                    opacity: recordsSearching ? 0.6 : 1,
                  }}
                >
                  {recordsSearching ? 'Searching...' : 'Search Records'}
                </button>
              </div>
            </div>

            {/* Results Table — Document Search */}
            {recordsResults && (
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(30,41,59,0.5)' }}>
                <div className="px-4 py-2 text-xs font-medium flex justify-between" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                  <span>{recordsResults.total.toLocaleString()} results found</span>
                  <span>Showing {recordsResults.documents.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ color: '#e2e8f0' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>County</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Type</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Grantor</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Grantee</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Date</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Instrument #</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Legal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recordsResults.documents.map((doc, i) => (
                        <tr
                          key={doc.doc_id || i}
                          className="border-t hover:bg-white/5 transition-colors"
                          style={{ borderColor: 'rgba(30,41,59,0.3)' }}
                        >
                          <td className="px-3 py-2 font-medium" style={{ color: '#f59e0b' }}>{doc.county}</td>
                          <td className="px-3 py-2">{doc.doc_type || '—'}</td>
                          <td className="px-3 py-2 max-w-[160px] truncate">{doc.grantor || '—'}</td>
                          <td className="px-3 py-2 max-w-[160px] truncate">{doc.grantee || '—'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{doc.filing_date || doc.recording_date || '—'}</td>
                          <td className="px-3 py-2">{doc.instrument_number || '—'}</td>
                          <td className="px-3 py-2 max-w-[200px] truncate text-[10px]" style={{ color: '#64748b' }}>
                            {doc.legal_description || (doc.legals?.[0] ? `S${doc.legals[0].section} B${doc.legals[0].block} ${doc.legals[0].survey}` : '—')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Results Table — Party Search */}
            {partyResults && (
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(30,41,59,0.5)' }}>
                <div className="px-4 py-2 text-xs font-medium flex justify-between" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                  <span>{partyResults.total.toLocaleString()} party matches</span>
                  <span>Showing {partyResults.results.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ color: '#e2e8f0' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>County</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Party Name</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Role</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Doc Type</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Grantor</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Grantee</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: '#94a3b8' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partyResults.results.map((r, i) => (
                        <tr
                          key={r.doc_id || i}
                          className="border-t hover:bg-white/5 transition-colors"
                          style={{ borderColor: 'rgba(30,41,59,0.3)' }}
                        >
                          <td className="px-3 py-2 font-medium" style={{ color: '#f59e0b' }}>{r.county}</td>
                          <td className="px-3 py-2 font-medium">{r.party_name}</td>
                          <td className="px-3 py-2 uppercase text-[10px]">{r.party_role}</td>
                          <td className="px-3 py-2">{r.doc_type || '—'}</td>
                          <td className="px-3 py-2 max-w-[140px] truncate">{r.grantor || '—'}</td>
                          <td className="px-3 py-2 max-w-[140px] truncate">{r.grantee || '—'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{r.filing_date || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* County Grid */}
            {recordsStats && !recordsResults && !partyResults && (
              <div className="rounded-xl border p-4" style={{ backgroundColor: 'rgba(15,23,42,0.4)', borderColor: 'rgba(30,41,59,0.5)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#f59e0b' }}>Counties in Database</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {recordsStats.counties
                    .sort((a, b) => b.documents - a.documents)
                    .map(c => (
                      <button
                        key={c.county}
                        onClick={() => { setRecordsCounty(c.county); handleRecordsSearch(c.county); }}
                        className="text-left px-3 py-2 rounded-lg border text-xs transition-colors hover:bg-white/5"
                        style={{ borderColor: 'rgba(30,41,59,0.3)', color: '#e2e8f0' }}
                      >
                        <div className="font-medium">{c.county}</div>
                        <div style={{ color: '#64748b' }}>{c.documents.toLocaleString()} docs</div>
                      </button>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Welcome screen with orb visible behind */}
          {!hasMessages && (
            <div className="text-center pt-[28vh] pb-8 animate-fade-up">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-3 gradient-text">
                Sentinel AI
              </h2>
              <p className="text-lg mb-10" style={{ color: '#94a3b8' }}>
                {chatMode === 'engine'
                  ? 'Pure doctrine search — 5,486+ engines, 607K+ doctrines, zero hallucination'
                  : 'Expert analysis across 1,000+ knowledge domains'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {DOMAIN_CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => handleChipClick(chip.label)}
                    className="px-3 py-2 rounded-xl border text-sm transition-all hover:scale-105"
                    style={{
                      borderColor: selectedModel === chip.model ? 'var(--ept-accent)' : 'rgba(30,41,59,0.5)',
                      backgroundColor: selectedModel === chip.model ? 'var(--ept-accent)' : 'rgba(12,18,32,0.6)',
                      color: selectedModel === chip.model ? '#fff' : '#e2e8f0',
                      backdropFilter: 'blur(8px)',
                    }}
                    title={`${chip.hint}${chip.model !== 'auto' ? ` — Fine-tuned ${chip.model} model` : ''}`}
                  >
                    <span className="mr-1">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'system' && msg.content === '__PIPELINE_PROGRESS__' && pipelineProgress ? (
                /* ── Pipeline Progress Bar ── */
                <div
                  className="w-full rounded-xl border p-4 space-y-3"
                  style={{ backgroundColor: 'rgba(12,18,32,0.8)', borderColor: 'rgba(30,41,59,0.5)', backdropFilter: 'blur(12px)' }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold" style={{ color: 'var(--ept-accent)' }}>
                      Title Chain Analysis
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {formatElapsed(pipelineProgress.elapsed_ms)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(30,41,59,0.5)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pipelineProgress.progress_pct}%`,
                        backgroundColor: 'var(--ept-accent)',
                        boxShadow: '0 0 8px rgba(20,184,166,0.5)',
                      }}
                    />
                  </div>
                  {/* Step label */}
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: '#94a3b8' }}>
                      {pipelineProgress.current_step_label || pipelineProgress.current_step || 'Initializing...'}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {Math.round(pipelineProgress.progress_pct)}%
                    </span>
                  </div>
                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs" style={{ color: '#64748b' }}>
                    <span>{pipelineProgress.records_found} records found</span>
                    {pipelineProgress.gaps_found > 0 && (
                      <span>{pipelineProgress.gaps_found} gaps detected</span>
                    )}
                  </div>
                  {/* Step list */}
                  {pipelineProgress.steps && pipelineProgress.steps.length > 0 && (
                    <div className="space-y-1 mt-1">
                      {pipelineProgress.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px]">
                          <span style={{
                            color: step.status === 'complete' ? '#4ade80' :
                                   step.status === 'running' ? 'var(--ept-accent)' :
                                   '#64748b',
                          }}>
                            {step.status === 'complete' ? '✓' : step.status === 'running' ? '●' : '○'}
                          </span>
                          <span style={{
                            color: step.status === 'complete' ? '#94a3b8' :
                                   step.status === 'running' ? '#e2e8f0' :
                                   '#64748b',
                          }}>
                            {step.label || step.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : msg.role === 'system' ? (
                <div
                  className="w-full text-center text-xs py-2 px-4 rounded-lg"
                  style={{ backgroundColor: 'rgba(15,23,42,0.6)', color: '#64748b', backdropFilter: 'blur(8px)' }}
                >
                  {msg.content}
                </div>
              ) : msg.role === 'user' ? (
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className="text-xs mt-1 opacity-60">{formatTime(msg.timestamp)}</div>
                </div>
              ) : (
                <div className="max-w-[85%] space-y-1">
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                    <span className="font-semibold" style={{ color: 'var(--ept-accent)' }}>
                      {msg.personality || 'Echo Prime'}
                    </span>
                    {msg.emotion && msg.emotion !== 'neutral' && (
                      <span className="opacity-70">{msg.emotion}</span>
                    )}
                    {msg.provider && (
                      <span className="opacity-50">{msg.provider}</span>
                    )}
                    {msg.latency && (
                      <span className="opacity-50">{(msg.latency / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-md border"
                    style={{
                      backgroundColor: 'rgba(12,18,32,0.7)',
                      borderColor: 'rgba(30,41,59,0.4)',
                      color: '#e2e8f0',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {msg.content === '...' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)', animationDelay: '0.2s' }} />
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)', animationDelay: '0.4s' }} />
                      </div>
                    ) : msg.content === '__ENGINE_RESULT__' && msg.engineResult ? (
                      <DoctrineResultCard result={msg.engineResult} />
                    ) : (
                      <MarkdownBlock content={msg.content} className="sentinel-md" />
                    )}
                  </div>
                  {msg.content !== '...' && (
                    <div className="flex items-center gap-2 px-1">
                      <button
                        onClick={() => playVoice(msg.content, msg.id)}
                        disabled={voicePlaying}
                        className="text-xs flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: '#64748b' }}
                        title="Play voice"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        {msg.voicePlayed ? 'Replay' : 'Listen'}
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: '#64748b' }}
                        title="Copy"
                      >
                        Copy
                      </button>
                      {/* Grounding indicator badge */}
                      {msg.grounding && msg.grounding.matches.length > 0 && (() => {
                        const badge = getGroundingBadge(msg.grounding);
                        return (
                          <span
                            className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full border"
                            style={{ color: badge.color, borderColor: badge.color + '40', backgroundColor: badge.color + '15' }}
                            title={badge.tooltip}
                          >
                            {badge.icon} {badge.label} ({msg.grounding.matches.length})
                          </span>
                        );
                      })()}
                      {msg.grounding && msg.grounding.matches.length === 0 && (
                        <span
                          className="text-xs flex items-center gap-1 opacity-40"
                          style={{ color: '#64748b' }}
                          title="No doctrine matches found — response is general-purpose AI output"
                        >
                          ✕ Ungrounded
                        </span>
                      )}
                      {/* Generate Report button */}
                      {msg.grounding && msg.grounding.matches.length > 0 && (
                        <button
                          onClick={() => {
                            const report = generateDoctrineReport(
                              messages.filter(m => m.timestamp < msg.timestamp && m.role === 'user').pop()?.content || 'Unknown query',
                              msg.grounding!,
                              msg.content,
                            );
                            const md = formatReportAsMarkdown(report);
                            const blob = new Blob([md], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `sentinel-report-${new Date().toISOString().slice(0, 10)}.md`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="text-xs flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                          style={{ color: 'var(--ept-accent)' }}
                          title="Download doctrine-grounded analysis report"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                          Report
                        </button>
                      )}
                      <span className="text-xs opacity-40" style={{ color: '#64748b' }}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* ── Title Chain Report (full-width, below messages) ── */}
          {pipelineResult && (
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: 'rgba(12,18,32,0.85)',
                borderColor: 'rgba(30,41,59,0.5)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <TitleChainReport
                result={pipelineResult}
                onClose={() => setPipelineResult(null)}
              />
            </div>
          )}

          {/* Search results panel — collapsible sources */}
          {lastSearchResults.length > 0 && (
            <details
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: 'rgba(12,18,32,0.6)',
                borderColor: 'rgba(30,41,59,0.4)',
                backdropFilter: 'blur(8px)',
              }}
              open
            >
              <summary className="flex items-center gap-2 text-xs font-semibold cursor-pointer px-4 py-3 select-none" style={{ color: 'var(--ept-accent)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Sources ({lastSearchResults.length})
                {lastToolsUsed.length > 0 && (
                  <span className="ml-auto opacity-60 font-normal flex items-center gap-1.5">
                    {lastToolsUsed.includes('web_search') && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>Web</span>}
                    {lastToolsUsed.includes('engine_query') && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#a78bfa' }}>Engines</span>}
                    {lastToolsUsed.includes('knowledge_search') && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>Knowledge</span>}
                  </span>
                )}
              </summary>
              <div className="px-4 pb-3 space-y-2.5 border-t" style={{ borderColor: 'rgba(30,41,59,0.3)' }}>
                {lastSearchResults.map((r, i) => (
                  <div key={i} className="text-xs space-y-0.5 pt-2">
                    <div className="flex items-start gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 mt-0.5" style={{
                        backgroundColor: r.source === 'web' ? 'rgba(59,130,246,0.15)' :
                          r.source.startsWith('engine') ? 'rgba(168,85,247,0.15)' :
                          r.source.startsWith('knowledge') ? 'rgba(34,197,94,0.15)' :
                          'rgba(20,184,166,0.15)',
                        color: r.source === 'web' ? '#60a5fa' :
                          r.source.startsWith('engine') ? '#a78bfa' :
                          r.source.startsWith('knowledge') ? '#4ade80' :
                          'var(--ept-accent)',
                      }}>
                        {r.source.length > 25 ? r.source.slice(0, 25) + '...' : r.source}
                      </span>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline leading-snug" style={{ color: '#e2e8f0' }}>
                          {r.title}
                        </a>
                      ) : (
                        <span className="font-medium leading-snug" style={{ color: '#e2e8f0' }}>{r.title}</span>
                      )}
                    </div>
                    {r.snippet && (
                      <p className="pl-0.5 leading-relaxed" style={{ color: '#94a3b8' }}>
                        {r.snippet.slice(0, 250)}{r.snippet.length > 250 ? '...' : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </details>
          )}

          <div ref={chatEndRef} />
        </div>
        )}
      </main>

      {/* ── Input Area ── */}
      {chatMode === 'records' ? (
        <footer
          className="relative z-10 border-t px-4 md:px-8 py-3 shrink-0"
          style={{
            borderColor: 'rgba(30,41,59,0.5)',
            backgroundColor: 'rgba(5,5,8,0.8)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between text-xs" style={{ color: '#64748b' }}>
            <span style={{ color: '#f59e0b' }}>
              Records DB · {recordsStats ? `${recordsStats.total_documents.toLocaleString()} documents · ${recordsStats.counties.length} counties` : 'Loading...'}
            </span>
            <span>Use the search panel above to query deed records</span>
          </div>
        </footer>
      ) : (
      <footer
        className="relative z-10 border-t px-4 md:px-8 py-3 shrink-0"
        style={{
          borderColor: 'rgba(30,41,59,0.5)',
          backgroundColor: 'rgba(5,5,8,0.8)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-2 rounded-xl border px-3 py-2"
            style={{
              backgroundColor: 'rgba(15,23,42,0.6)',
              borderColor: sending ? 'var(--ept-accent)' : 'rgba(30,41,59,0.5)',
            }}
          >
            {/* Mic button */}
            <button
              onClick={toggleMic}
              className="p-2 rounded-lg transition-colors shrink-0"
              style={{
                backgroundColor: listening ? '#ef4444' : 'transparent',
                color: listening ? '#fff' : '#94a3b8',
              }}
              title={listening ? 'Stop listening' : 'Voice input'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder={sending ? 'Analyzing...' : chatMode === 'engine' ? 'Search 5,486+ engines across 940+ domains...' : 'Ask anything across 940+ domains...'}
              disabled={sending}
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm py-1.5"
              style={{ color: '#e2e8f0', minHeight: '24px', maxHeight: '160px' }}
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className="p-2 rounded-lg transition-all shrink-0"
              style={{
                backgroundColor: input.trim() && !sending ? 'var(--ept-accent)' : 'transparent',
                color: input.trim() && !sending ? '#fff' : '#64748b',
                opacity: input.trim() && !sending ? 1 : 0.4,
              }}
              title="Send"
            >
              {sending ? (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-2 text-xs px-1" style={{ color: '#64748b' }}>
            <span>
              {chatMode === 'engine' ? (
                <span style={{ color: '#c084fc' }}>Engine Query · {responseMode}</span>
              ) : (
                <>
                  {selectedModel !== 'auto' && (
                    <span style={{ color: 'var(--ept-accent)' }}>
                      {FINE_TUNED_MODELS.find(m => m.id === selectedModel)?.label || selectedModel}
                    </span>
                  )}
                  {selectedModel !== 'auto' && voiceEnabled && ' · '}
                  {voiceEnabled && (
                    <span style={{ color: 'var(--ept-accent)' }}>Voice ON</span>
                  )}
                  {voicePlaying && ' — Speaking...'}
                  {listening && (
                    <span style={{ color: '#ef4444' }}> Listening...</span>
                  )}
                </>
              )}
            </span>
            <span>
              {messages.filter(m => m.role === 'user').length} queries this session
            </span>
          </div>
        </div>
      </footer>
      )}
      {/* ── ConvAI Voice Widget — "Talk to Echo" ── */}
      <SentinelConvAI />
      </div>{/* ── end chat viewport ── */}

      {/* ─── Upgrade Banner + Cross-Sell (below chat) ─── */}
      <div className="relative z-20 px-4 pt-6 pb-6 space-y-4" style={{ backgroundColor: 'var(--ept-bg)' }}>
        {/* Upgrade CTA — hidden for users with paid/sovereign tier or owner role */}
        {(!grants?.custom_tier || grants.custom_tier === 'free') && role !== 'owner' ? (
        <div className="max-w-3xl mx-auto p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>
            Unlock Unlimited Queries &amp; Priority Models
          </p>
          <p className="text-xs mb-3" style={{ color: 'var(--ept-text-muted)' }}>
            Free tier: 50 queries/day &middot; Pro: unlimited queries, custom engines, voice &middot; Business: API access, team seats, SLA
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/checkout?service=sentinel&tier=pro" className="px-5 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Upgrade to Pro
            </Link>
            <Link href="/pricing" className="px-5 py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View All Plans
            </Link>
          </div>
        </div>
        ) : (
        <div className="max-w-3xl mx-auto p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}>
          <p className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>
            {grants.custom_tier === 'sovereign' ? 'Sovereign' : grants.custom_tier?.charAt(0).toUpperCase() + grants.custom_tier?.slice(1)} Plan &middot; {grants.sentinel_queries_limit === 'unlimited' ? 'Unlimited' : grants.sentinel_queries_limit} queries {grants.sentinel_voice === 'true' && ' · Voice enabled'} {grants.sentinel_memory === 'true' && ' · Memory enabled'}
          </p>
        </div>
        )}

        {/* FAQ */}
        <section className="py-16 px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'What makes Sentinel AI different from ChatGPT or other chatbots?', a: 'Sentinel is not a chatbot — it is a professional intelligence interface backed by 5,486+ domain-specific engines and 607K+ pre-compiled doctrines. Every response includes authority citations (IRC codes, case law, NIST frameworks, medical literature) with confidence stratification. Sentinel delivers court-defensible answers, not conversational guesses.' },
              { q: 'What domains can Sentinel query?', a: 'Sentinel covers 940+ knowledge domains including tax law, legal analysis, cybersecurity, medical intelligence, oilfield engineering, financial modeling, forensics, accounting, insurance, and dozens of specialized fields. You can query a single domain or let the system auto-route across multiple relevant engines.' },
              { q: 'How does the title chain investigation feature work?', a: 'Sentinel detects natural language requests for title chain research and automatically triggers our Landman Pipeline — an async investigation system covering 80+ Texas counties and 259K+ records. Results are delivered in a professional 5-tab report: Summary, Run Sheet, Ownership Chain, Gap Analysis, and Full Report.' },
              { q: 'Can I choose which AI model processes my query?', a: 'Yes. Sentinel supports multiple fine-tuned models including Claude Opus 4.6, GPT-4.1, Grok, and specialized adapters trained on domain-specific content. You can select a specific model or use auto-routing, which matches your query to the best-performing model for that domain.' },
              { q: 'Is voice interaction available?', a: 'Pro and higher plans include voice-enabled Sentinel with real-time speech-to-text input and text-to-speech responses powered by ElevenLabs. You can have natural spoken conversations with Sentinel while it queries intelligence engines and delivers expert-level answers out loud.' },
              { q: 'What are the query limits on each plan?', a: 'Free tier includes 50 queries per day. Pro plans offer unlimited queries with priority model access and voice. Business plans add API access, team seats, and SLA guarantees. Sovereign plans include custom engine development and white-label deployment.' },
            ].map(faq => (
              <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Also from Echo Prime</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'AI Sales Agent', price: '$299/mo', href: '/closer' },
              { title: 'Intelligence Engines', price: '$199/mo', href: '/engines' },
              { title: 'Title Intelligence', price: '$200/mo', href: '/title-intelligence' },
              { title: 'Data Pipelines', price: '$199/mo', href: '/pipelines' },
            ].map((p, i) => (
              <Link key={i} href={p.href} className="p-3 rounded-lg border text-center transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <p className="text-xs font-bold" style={{ color: 'var(--ept-text)' }}>{p.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--ept-accent)' }}>{p.price} &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sentinel ConvAI Voice Widget ── */

const SENTINEL_CONVAI_AGENT = 'agent_9201kk4sdqsrfbs8y2e304jtz6dg';

function SentinelConvAI() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    // Load ElevenLabs ConvAI widget script
    if (!customElements.get('elevenlabs-convai')) {
      const s = document.createElement('script');
      s.src = 'https://elevenlabs.io/convai-widget/index.js';
      s.async = true;
      document.head.appendChild(s);
    }
    const el = document.createElement('elevenlabs-convai');
    el.setAttribute('agent-id', SENTINEL_CONVAI_AGENT);
    containerRef.current.replaceChildren(el);
    return () => { if (containerRef.current) containerRef.current.replaceChildren(); };
  }, [loaded]);

  return (
    <>
      <div ref={containerRef} style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 60 }} />
      {!loaded && (
        <button
          onClick={() => setLoaded(true)}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 60,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 14,
            backgroundColor: 'rgba(20,184,166,0.9)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(20,184,166,0.3)',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          title="Talk to Echo via voice"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0014 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
          Talk to Echo
        </button>
      )}
    </>
  );
}
