/**
 * Echo Office AI Intelligence Layer — Engine-Backed AI for Office Assistant
 *
 * Connects Office AI to 5,400+ intelligence engines via SDK Gateway.
 * Provides domain detection, doctrine injection, emotion detection,
 * Shared Brain memory, Knowledge Forge search, and VIP recognition.
 *
 * Architecture:
 *   User message → detectDomain() → queryEngines() + searchKnowledge()
 *   → loadBrainContext() → injectAll into Echo Chat → storeInBrain()
 */

import { getApiBase } from './api-base';

const SDK_URL = getApiBase('echo-sdk-gateway', 'sdk');
const BRAIN_URL = getApiBase('echo-shared-brain');
const CHAT_URL = getApiBase('echo-chat');
const SPEAK_URL = getApiBase('echo-speak-cloud');
const API_KEY = process.env.NEXT_PUBLIC_ECHO_API_KEY || 'echo-omega-prime-forge-x-2026';

const headers = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'X-Echo-API-Key': API_KEY,
});

/* ─── Types ──────────────────────────────────────────────────────── */

export interface DetectedDomain {
  domain: string;
  confidence: number;
  keywords: string[];
}

export interface DoctrineMatch {
  topic: string;
  conclusion: string;
  reasoning?: string;
  authority?: string;
  confidence?: string;
  engine_id?: string;
}

export interface IntelligenceContext {
  domains: DetectedDomain[];
  doctrines: DoctrineMatch[];
  knowledge: KnowledgeResult[];
  brainMemories: BrainMemory[];
  emotion: EmotionResult;
  isVip: boolean;
  processingMs: number;
}

export interface KnowledgeResult {
  title: string;
  content: string;
  category: string;
  similarity?: number;
}

export interface BrainMemory {
  content: string;
  role: string;
  importance: number;
  created_at: string;
}

export interface EmotionResult {
  primary: string;
  intensity: number;
  responseAdjustment: string;
}

export interface IntelligentResponse {
  reply: string;
  context: IntelligenceContext;
  personality: string;
  ttsText?: string;
}

/* ─── Domain Detection Map ───────────────────────────────────────── */

const DOMAIN_MAP: Record<string, string[]> = {
  ACCT: [
    'invoice', 'invoicing', 'accounting', 'bookkeeping', 'ledger',
    'journal entry', 'balance sheet', 'profit and loss', 'p&l',
    'accounts receivable', 'accounts payable', 'ar', 'ap',
    'chart of accounts', 'accrual', 'depreciation', 'amortization',
    'reconciliation', 'audit', 'gaap', 'financial statement',
    'trial balance', 'cost accounting', 'overhead',
  ],
  FIN: [
    'finance', 'financial', 'investment', 'portfolio', 'valuation',
    'cash flow', 'budget', 'forecast', 'capital', 'roi', 'irr', 'npv',
    'equity', 'debt', 'credit', 'loan', 'interest rate', 'risk',
    'working capital', 'liquidity', 'solvency', 'revenue projection',
    'break even', 'burn rate', 'runway',
  ],
  TX: [
    'tax', 'deduction', 'irs', 'w-2', 'w2', '1099', 'filing',
    'tax return', 'withholding', 'exemption', 'taxable income',
    'schedule c', 'quarterly tax', 'estimated tax', 'section 179',
    'macrs', '1040', 'tax bracket', 'agi', 'magi', 'standard deduction',
    'itemized deduction', 'tax credit', 'earned income', 'self-employment tax',
    'sales tax', 'property tax', 'excise tax', 'tax planning',
  ],
  LG: [
    'legal', 'contract', 'compliance', 'regulation', 'liability',
    'lawsuit', 'litigation', 'agreement', 'terms and conditions',
    'clause', 'attorney', 'dispute', 'arbitration', 'employment law',
    'intellectual property', 'patent', 'trademark', 'copyright',
    'non-compete', 'nda', 'indemnification', 'force majeure',
    'regulatory', 'osha', 'ada', 'eeoc',
  ],
  PAY: [
    'payroll', 'salary', 'wage', 'hourly rate', 'overtime',
    'bonus', 'compensation', 'pay period', 'timesheet', 'time tracking',
    'direct deposit', 'w-4', 'w4', 'benefits', 'garnishment',
    'fica', 'medicare', 'social security', 'pay stub', 'pay check',
    'commissions', 'tip reporting', 'minimum wage', 'exempt',
    'non-exempt', 'flsa',
  ],
  BIZ: [
    'business plan', 'startup', 'growth strategy', 'market analysis',
    'competitive analysis', 'swot', 'kpi', 'metrics', 'scaling',
    'operations', 'management', 'leadership', 'team building',
    'company culture', 'mission statement', 'vision', 'strategic planning',
    'business model', 'partnership', 'llc', 's-corp', 'sole proprietor',
    'franchise', 'acquisition', 'merger',
  ],
  SCM: [
    'supply chain', 'inventory management', 'vendor', 'procurement',
    'logistics', 'warehouse', 'shipping', 'freight', 'distribution',
    'supplier', 'purchase order', 'reorder point', 'stock level',
    'fulfillment', 'backorder', 'lead time', 'safety stock',
    'just in time', 'jit', 'fifo', 'lifo',
  ],
  INS: [
    'insurance', 'policy', 'premium', 'claim', 'coverage',
    'deductible', 'liability insurance', 'workers comp',
    'general liability', 'professional liability', 'bonding',
    'errors and omissions', 'umbrella policy', 'commercial auto',
    'property insurance', 'cyber insurance',
  ],
  RE: [
    'real estate', 'property', 'commercial lease', 'rent',
    'commercial property', 'tenant', 'landlord', 'mortgage',
    'appraisal', 'zoning', 'building code', 'lease agreement',
    'square footage', 'cap rate', 'noi',
  ],
  PROJM: [
    'project management', 'gantt', 'milestone', 'deadline',
    'sprint', 'agile', 'scope', 'deliverable', 'resource allocation',
    'timeline', 'critical path', 'work breakdown', 'risk register',
    'stakeholder', 'change management',
  ],
  ECOMM: [
    'ecommerce', 'e-commerce', 'online store', 'shopping cart',
    'checkout', 'product listing', 'sku', 'dropshipping',
    'marketplace', 'catalog', 'product page', 'conversion rate',
  ],
  CS: [
    'customer service', 'support ticket', 'complaint', 'satisfaction',
    'nps', 'net promoter', 'feedback', 'resolution', 'sla',
    'escalation', 'help desk', 'customer experience', 'retention',
    'churn', 'onboarding',
  ],
  MKT: [
    'marketing', 'campaign', 'advertising', 'seo', 'social media',
    'content marketing', 'email marketing', 'brand', 'lead generation',
    'conversion', 'google ads', 'facebook ads', 'newsletter',
    'landing page', 'click through', 'impressions', 'cpc', 'cpm',
  ],
  SALES: [
    'sales', 'pipeline', 'prospect', 'cold call', 'follow up',
    'close deal', 'negotiation', 'proposal', 'quota', 'commission',
    'crm', 'lead scoring', 'objection handling', 'upsell', 'cross-sell',
    'sales forecast', 'territory', 'key account',
  ],
  FLEETMGMT: [
    'fleet', 'vehicle', 'route', 'driver', 'delivery', 'dispatch',
    'fuel', 'maintenance', 'mileage', 'dot compliance', 'cdl',
    'gps tracking', 'telematics', 'route optimization',
  ],
  CYBER: [
    'cybersecurity', 'data breach', 'firewall', 'encryption',
    'phishing', 'malware', 'ransomware', 'vulnerability', 'penetration test',
    'two factor', '2fa', 'password policy', 'security audit',
    'incident response', 'backup', 'disaster recovery',
  ],
  CONST: [
    'construction', 'contractor', 'subcontractor', 'bid', 'estimate',
    'change order', 'punch list', 'building permit', 'blueprint',
    'renovation', 'general contractor', 'lien', 'bonding',
  ],
  MFG: [
    'manufacturing', 'production', 'quality control', 'assembly',
    'bom', 'bill of materials', 'lean', 'six sigma', 'iso',
    'defect rate', 'throughput', 'capacity planning',
  ],
  DATA: [
    'data analytics', 'dashboard', 'report', 'visualization',
    'business intelligence', 'trends', 'forecast', 'predictive',
    'kpi dashboard', 'metrics', 'benchmark',
  ],
  FOOD: [
    'restaurant', 'food service', 'menu', 'food cost', 'kitchen',
    'catering', 'food safety', 'health inspection', 'ServSafe',
  ],
  HVAC: [
    'hvac', 'heating', 'cooling', 'air conditioning', 'ductwork',
    'thermostat', 'refrigerant', 'furnace', 'heat pump',
  ],
  WELD: [
    'welding', 'fabrication', 'mig', 'tig', 'stick welding',
    'weld certification', 'aws', 'structural welding',
  ],
};

/* ─── Emotion Detection ──────────────────────────────────────────── */

const EMOTION_PATTERNS: Array<{
  emotion: string;
  patterns: RegExp[];
  responseAdj: string;
}> = [
  {
    emotion: 'frustrated',
    patterns: [
      /frustrat/i, /angry/i, /annoy/i, /hate/i, /terrible/i,
      /worst/i, /broken/i, /not working/i, /useless/i, /ridiculous/i,
      /fed up/i, /sick of/i, /give up/i, /impossible/i, /can't believe/i,
    ],
    responseAdj: 'Acknowledge frustration first, be empathetic and solution-focused. Use calming language.',
  },
  {
    emotion: 'anxious',
    patterns: [
      /worried/i, /anxious/i, /nervous/i, /scared/i, /deadline/i,
      /urgent/i, /emergency/i, /asap/i, /critical/i, /overdue/i,
      /behind/i, /running out/i, /panic/i, /stressed/i, /overwhelm/i,
    ],
    responseAdj: 'Prioritize reassurance, break down steps clearly, emphasize what CAN be done now.',
  },
  {
    emotion: 'happy',
    patterns: [
      /great/i, /awesome/i, /amazing/i, /love it/i, /perfect/i,
      /excellent/i, /thank/i, /wonderful/i, /appreciate/i,
      /fantastic/i, /brilliant/i, /excited/i, /thrilled/i,
    ],
    responseAdj: 'Match enthusiasm, celebrate with them, suggest next growth opportunities.',
  },
  {
    emotion: 'confused',
    patterns: [
      /confused/i, /don.t understand/i, /what does.*mean/i, /how do/i,
      /help me/i, /explain/i, /unclear/i, /lost/i, /what is/i,
      /not sure/i, /can you clarify/i, /difference between/i,
    ],
    responseAdj: 'Use simple language, provide step-by-step explanations, offer analogies.',
  },
  {
    emotion: 'urgent',
    patterns: [
      /now/i, /immediately/i, /right away/i, /today/i, /tonight/i,
      /due tomorrow/i, /last minute/i, /forgot to/i, /overdue/i,
    ],
    responseAdj: 'Lead with the most actionable step first. Be concise and direct.',
  },
];

/* ─── VIP Customer Patterns ──────────────────────────────────────── */

const VIP_SIGNALS = [
  /ceo/i, /owner/i, /president/i, /founder/i, /director/i,
  /vip/i, /premium/i, /enterprise/i, /priority/i,
];

/* ─── All Office AI Modules ──────────────────────────────────────── */

const ALL_MODULES = [
  'Dashboard', 'Invoices', 'Quotes', 'Bookings', 'Customers',
  'Expenses', 'Analytics', 'AR/AP', 'Employees', 'Time Tracking',
  'Inventory', 'Payroll', 'Reviews', 'Services', 'Settings',
  'Payments', 'Driver Routing', 'Sales Calls', 'Phone Support',
  'Tax Preparation',
];

/* ─── Core Functions ─────────────────────────────────────────────── */

export function detectDomains(message: string): DetectedDomain[] {
  const lower = message.toLowerCase();
  const results: DetectedDomain[] = [];

  for (const [domain, keywords] of Object.entries(DOMAIN_MAP)) {
    const matched = keywords.filter(kw => lower.includes(kw));
    if (matched.length > 0) {
      results.push({
        domain,
        confidence: Math.min(matched.length / 3, 1),
        keywords: matched,
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

export function detectEmotion(message: string): EmotionResult {
  let bestEmotion = 'neutral';
  let bestIntensity = 0;
  let bestAdj = '';

  for (const { emotion, patterns, responseAdj } of EMOTION_PATTERNS) {
    const matchCount = patterns.filter(p => p.test(message)).length;
    const intensity = Math.min(matchCount / 3, 1);
    if (intensity > bestIntensity) {
      bestEmotion = emotion;
      bestIntensity = intensity;
      bestAdj = responseAdj;
    }
  }

  return {
    primary: bestEmotion,
    intensity: bestIntensity,
    responseAdjustment: bestAdj,
  };
}

export function detectVip(message: string, userProfile?: string): boolean {
  const combined = `${message} ${userProfile || ''}`;
  return VIP_SIGNALS.some(p => p.test(combined));
}

export async function queryEngines(
  query: string,
  domains: DetectedDomain[],
): Promise<DoctrineMatch[]> {
  if (!domains.length) return [];
  const topDomain = domains[0].domain;
  try {
    const res = await fetch(
      `${SDK_URL}/engine/query?q=${encodeURIComponent(query)}&domain=${topDomain}&limit=5`,
      { headers: headers(), signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const doctrines = data?.doctrines || data?.results || [];
    return doctrines.slice(0, 5).map((d: any) => ({
      topic: d.topic || d.title || '',
      conclusion: d.conclusion || d.conclusion_template || d.content || '',
      reasoning: d.reasoning_framework || d.reasoning || '',
      authority: d.primary_authority || d.authority || '',
      confidence: d.confidence_stratification || d.confidence || '',
      engine_id: d.engine_id || '',
    }));
  } catch {
    return [];
  }
}

export async function searchKnowledge(query: string): Promise<KnowledgeResult[]> {
  try {
    const res = await fetch(`${SDK_URL}/knowledge/search`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ query, limit: 3 }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results = data?.results || data?.chunks || [];
    return results.slice(0, 3).map((r: any) => ({
      title: r.title || r.doc_title || '',
      content: r.content || r.chunk || '',
      category: r.category || '',
      similarity: r.similarity || r.score || 0,
    }));
  } catch {
    return [];
  }
}

export async function loadBrainContext(
  query: string,
  userId?: string,
): Promise<BrainMemory[]> {
  try {
    const res = await fetch(`${BRAIN_URL}/search`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ query, user_id: userId, limit: 5 }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.results || []).slice(0, 5).map((m: any) => ({
      content: m.content || '',
      role: m.role || 'assistant',
      importance: m.importance || 5,
      created_at: m.created_at || '',
    }));
  } catch {
    return [];
  }
}

export async function storeInBrain(
  content: string,
  role: 'user' | 'assistant',
  importance: number,
  tags: string[] = [],
): Promise<void> {
  try {
    await fetch(`${BRAIN_URL}/ingest`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        instance_id: 'office-ai-echo-ept',
        role,
        content,
        importance,
        tags: ['office-ai', 'echo-ept', ...tags],
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Non-critical
  }
}

function buildSystemPrompt(ctx: IntelligenceContext): string {
  const parts: string[] = [];

  parts.push(
    'You are the Echo Office AI Assistant — an intelligent business operations advisor powered by Echo Prime Technologies. ' +
    'You are warm, professional, and deeply knowledgeable about business operations. ' +
    'You speak like a trusted business advisor who genuinely cares about the business owner\'s success. ' +
    'Keep answers practical and actionable. Use specific numbers when possible. ' +
    'You have access to 5,400+ intelligence engines covering accounting, tax, legal, payroll, HR, inventory, marketing, sales, and more.',
  );

  if (ctx.emotion.primary !== 'neutral' && ctx.emotion.responseAdjustment) {
    parts.push(`\nEMOTIONAL CONTEXT: The user seems ${ctx.emotion.primary}. ${ctx.emotion.responseAdjustment}`);
  }

  if (ctx.isVip) {
    parts.push('\nVIP CONTEXT: This appears to be a senior decision-maker. Provide executive-level insights with ROI focus.');
  }

  if (ctx.domains.length > 0) {
    parts.push(`\nDETECTED DOMAINS: ${ctx.domains.map(d => `${d.domain} (${(d.confidence * 100).toFixed(0)}%)`).join(', ')}`);
  }

  if (ctx.doctrines.length > 0) {
    parts.push('\nEXPERT KNOWLEDGE (from intelligence engines — use this to give authoritative answers):');
    for (const doc of ctx.doctrines) {
      let block = `\n[${doc.topic}]`;
      if (doc.conclusion) block += `\nConclusion: ${doc.conclusion}`;
      if (doc.reasoning) block += `\nReasoning: ${doc.reasoning.slice(0, 300)}`;
      if (doc.authority) block += `\nAuthority: ${doc.authority}`;
      if (doc.confidence) block += `\nConfidence: ${doc.confidence}`;
      parts.push(block);
    }
  }

  if (ctx.knowledge.length > 0) {
    parts.push('\nREFERENCE DOCUMENTS:');
    for (const k of ctx.knowledge) {
      parts.push(`- [${k.category}] ${k.title}: ${k.content.slice(0, 200)}`);
    }
  }

  if (ctx.brainMemories.length > 0) {
    parts.push('\nPREVIOUS CONTEXT (from past conversations):');
    for (const m of ctx.brainMemories) {
      parts.push(`- ${m.content.slice(0, 150)}`);
    }
  }

  parts.push(
    `\nAVAILABLE MODULES: ${ALL_MODULES.join(', ')}. ` +
    'You can help with any of these. When relevant, suggest which module the user should check.',
  );

  return parts.join('\n');
}

async function generateWithEchoChat(
  systemPrompt: string,
  conversationHistory: Array<{ role: string; content: string }>,
  personality: string,
): Promise<string> {
  try {
    const res = await fetch(`${CHAT_URL}/chat`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        personality,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
        ],
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Echo Chat ${res.status}`);
    const data = await res.json();
    return data?.reply || data?.content || data?.message || '';
  } catch {
    return '';
  }
}

async function generateFallback(
  systemPrompt: string,
  conversationHistory: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    const res = await fetch(`${SDK_URL}/worker/call`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        worker: 'echo-chat',
        path: '/chat',
        method: 'POST',
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
          ],
          max_tokens: 1500,
        },
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data?.reply || data?.content || data?.result?.reply || '';
  } catch {
    return '';
  }
}

function generateLocalFallback(
  message: string,
  domains: DetectedDomain[],
  emotion: EmotionResult,
): string {
  const domainStr = domains.length > 0
    ? `I can see this is about ${domains.map(d => d.domain).join(', ')}.`
    : '';

  const emotionStr = emotion.primary === 'frustrated'
    ? "I understand this is frustrating. Let's work through it together."
    : emotion.primary === 'anxious'
    ? 'I hear the urgency. Let me help you tackle this step by step.'
    : emotion.primary === 'confused'
    ? 'Great question — let me break this down clearly.'
    : '';

  return (
    `${emotionStr ? emotionStr + ' ' : ''}${domainStr ? domainStr + ' ' : ''}` +
    'I\'m here to help with your business needs. Could you give me a bit more detail ' +
    'so I can provide the most useful guidance? I have access to expertise in accounting, ' +
    'tax, legal, payroll, inventory, marketing, and many more areas.'
  );
}

/* ─── Main Entry Point ───────────────────────────────────────────── */

export async function processMessage(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  options?: {
    userId?: string;
    userProfile?: string;
    personality?: string;
  },
): Promise<IntelligentResponse> {
  const startMs = Date.now();
  const personality = options?.personality || 'bree';

  const domains = detectDomains(message);
  const emotion = detectEmotion(message);
  const isVip = detectVip(message, options?.userProfile);

  const [doctrines, knowledge, brainMemories] = await Promise.all([
    queryEngines(message, domains),
    searchKnowledge(message),
    loadBrainContext(message, options?.userId),
  ]);

  const context: IntelligenceContext = {
    domains,
    doctrines,
    knowledge,
    brainMemories,
    emotion,
    isVip,
    processingMs: Date.now() - startMs,
  };

  const systemPrompt = buildSystemPrompt(context);

  let reply = await generateWithEchoChat(systemPrompt, conversationHistory, personality);
  if (!reply) {
    reply = await generateFallback(systemPrompt, conversationHistory);
  }
  if (!reply) {
    reply = generateLocalFallback(message, domains, emotion);
  }

  context.processingMs = Date.now() - startMs;

  const domainTag = domains.length > 0 ? domains[0].domain : 'general';
  storeInBrain(`User asked about ${domainTag}: ${message.slice(0, 200)}`, 'user', 5, [domainTag]);
  storeInBrain(
    `Office AI answered (${domainTag}, ${doctrines.length} doctrines): ${reply.slice(0, 200)}`,
    'assistant', 6, [domainTag, 'office-ai-reply'],
  );

  return {
    reply,
    context,
    personality,
    ttsText: reply.slice(0, 500),
  };
}

/* ─── TTS Helper ─────────────────────────────────────────────────── */

export async function speakText(text: string): Promise<Blob | null> {
  try {
    const res = await fetch(`${SPEAK_URL}/tts`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ text: text.slice(0, 500), voice: 'bree' }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return res.blob();
  } catch {
    return null;
  }
}

/* ─── Quick Action Suggestions ───────────────────────────────────── */

export function getSuggestedActions(domains: DetectedDomain[]): Array<{
  label: string;
  prompt: string;
  module: string;
}> {
  const suggestions: Array<{ label: string; prompt: string; module: string }> = [];
  const domainSet = new Set(domains.map(d => d.domain));

  if (domainSet.has('TX')) {
    suggestions.push(
      { label: 'Review Tax Deductions', prompt: 'What tax deductions am I missing this quarter?', module: 'taxes' },
      { label: 'Estimate Quarterly Taxes', prompt: 'Calculate my estimated quarterly tax payment.', module: 'taxes' },
    );
  }
  if (domainSet.has('PAY')) {
    suggestions.push(
      { label: 'Run Payroll', prompt: 'Show me the steps to process this week\'s payroll.', module: 'payroll' },
      { label: 'Review Overtime', prompt: 'Which employees have overtime this pay period?', module: 'hours' },
    );
  }
  if (domainSet.has('ACCT')) {
    suggestions.push(
      { label: 'Aging Report', prompt: 'Show me my accounts receivable aging report.', module: 'arAp' },
      { label: 'Reconcile Accounts', prompt: 'Walk me through reconciling my bank statement.', module: 'analytics' },
    );
  }
  if (domainSet.has('SALES')) {
    suggestions.push(
      { label: 'Sales Pipeline', prompt: 'Review my current sales pipeline and suggest next steps.', module: 'salesCalls' },
    );
  }
  if (domainSet.has('SCM')) {
    suggestions.push(
      { label: 'Low Stock Alert', prompt: 'Which inventory items need reordering?', module: 'inventory' },
    );
  }
  if (domainSet.has('FIN')) {
    suggestions.push(
      { label: 'Cash Flow Forecast', prompt: 'Project my cash flow for the next 90 days.', module: 'analytics' },
    );
  }
  if (domainSet.has('MKT')) {
    suggestions.push(
      { label: 'Campaign ROI', prompt: 'Analyze the ROI on my current marketing campaigns.', module: 'analytics' },
    );
  }
  if (domainSet.has('LG')) {
    suggestions.push(
      { label: 'Contract Review', prompt: 'What should I check before signing this contract?', module: 'services' },
    );
  }

  return suggestions.slice(0, 4);
}
