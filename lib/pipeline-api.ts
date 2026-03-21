// ════════════════════════════════════════════════════════════════
// Pipeline Manager API Client
// Client-side pipeline configuration manager with a catalog of
// available data sources backed by live Cloudflare Workers.
// ════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────

export interface PipelineConfig {
  id: string;
  name: string;
  sourceType: string;
  sourceConfig: Record<string, string>;
  transformations: string[];
  schedule: string;
  outputFormat: 'json' | 'csv' | 'webhook' | 'api';
  outputUrl: string;
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
  lastRun: string;
  recordsTotal: number;
  errorCount: number;
}

export interface DataSourceType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  fields: { key: string; label: string; placeholder: string; required?: boolean }[];
  workerUrl?: string;
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  startedAt: string;
  finishedAt: string;
  status: 'success' | 'partial' | 'failed';
  recordsProcessed: number;
  errors: number;
  duration: string;
}

// ── Data Source Catalog ────────────────────────────────────────

export const DATA_SOURCE_TYPES: DataSourceType[] = [
  {
    id: 'county_records',
    name: 'County Records',
    description: 'Deed records, mineral rights, leases, and assignments from 80+ Texas county clerk databases.',
    icon: '\uD83C\uDFDB\uFE0F',
    category: 'Government',
    fields: [
      { key: 'county', label: 'County', placeholder: 'e.g. Reeves, Midland, Ector', required: true },
      { key: 'instrument_type', label: 'Instrument Type', placeholder: 'e.g. Deed, Lease, Assignment' },
      { key: 'date_from', label: 'Date From', placeholder: 'YYYY-MM-DD' },
      { key: 'date_to', label: 'Date To', placeholder: 'YYYY-MM-DD' },
      { key: 'grantor', label: 'Grantor Name', placeholder: 'Last name or company' },
      { key: 'grantee', label: 'Grantee Name', placeholder: 'Last name or company' },
    ],
    workerUrl: 'https://encore-cloud-scraper.bmcii1976.workers.dev',
  },
  {
    id: 'genealogy',
    name: 'Genealogy Records',
    description: 'Birth, death, marriage, and burial records from multiple genealogy platforms and county sources.',
    icon: '\uD83C\uDF33',
    category: 'Government',
    fields: [
      { key: 'surname', label: 'Surname', placeholder: 'Last name', required: true },
      { key: 'given_name', label: 'Given Name', placeholder: 'First name' },
      { key: 'county', label: 'County', placeholder: 'e.g. Midland' },
      { key: 'state', label: 'State', placeholder: 'e.g. TX' },
    ],
    workerUrl: 'https://echo-county-records.bmcii1976.workers.dev',
  },
  {
    id: 'sec_filings',
    name: 'SEC EDGAR Filings',
    description: '10-K, 10-Q, 8-K, and insider trading filings from the SEC EDGAR database.',
    icon: '\uD83D\uDCC4',
    category: 'Financial',
    fields: [
      { key: 'ticker', label: 'Ticker Symbol', placeholder: 'e.g. AAPL, MSFT', required: true },
      { key: 'filing_type', label: 'Filing Type', placeholder: 'e.g. 10-K, 10-Q, 8-K' },
      { key: 'date_from', label: 'Date From', placeholder: 'YYYY-MM-DD' },
    ],
    workerUrl: 'https://echo-sec-edgar.bmcii1976.workers.dev',
  },
  {
    id: 'news',
    name: 'News Feeds',
    description: 'Real-time news aggregation from hundreds of sources with AI categorization and sentiment analysis.',
    icon: '\uD83D\uDCF0',
    category: 'Intelligence',
    fields: [
      { key: 'keywords', label: 'Keywords', placeholder: 'e.g. oil gas permian basin', required: true },
      { key: 'sources', label: 'Sources', placeholder: 'Comma-separated (or leave blank for all)' },
      { key: 'language', label: 'Language', placeholder: 'en' },
    ],
    workerUrl: 'https://echo-news-scraper.bmcii1976.workers.dev',
  },
  {
    id: 'reddit',
    name: 'Reddit Monitor',
    description: 'Track subreddits, keywords, and sentiment across Reddit communities in real-time.',
    icon: '\uD83D\uDCAC',
    category: 'Social',
    fields: [
      { key: 'subreddits', label: 'Subreddits', placeholder: 'e.g. artificial, machinelearning', required: true },
      { key: 'keywords', label: 'Keywords', placeholder: 'Filter keywords' },
      { key: 'min_score', label: 'Min Score', placeholder: 'e.g. 10' },
    ],
    workerUrl: 'https://echo-reddit-monitor.bmcii1976.workers.dev',
  },
  {
    id: 'crypto',
    name: 'Crypto Market Data',
    description: 'Real-time prices, order books, trades, and OHLCV candles from major exchanges.',
    icon: '\uD83D\uDCB0',
    category: 'Financial',
    fields: [
      { key: 'symbol', label: 'Trading Pair', placeholder: 'e.g. BTC_USDT', required: true },
      { key: 'interval', label: 'Candle Interval', placeholder: 'e.g. 1h, 4h, 1d' },
      { key: 'alert_price', label: 'Price Alert', placeholder: 'e.g. 50000' },
    ],
    workerUrl: 'https://echo-price-alert.bmcii1976.workers.dev',
  },
  {
    id: 'dark_web',
    name: 'Dark Web Intelligence',
    description: 'Monitor dark web sources for brand mentions, credential leaks, and threat intelligence.',
    icon: '\uD83D\uDD75\uFE0F',
    category: 'Security',
    fields: [
      { key: 'brand', label: 'Brand / Domain', placeholder: 'e.g. echo-ept.com', required: true },
      { key: 'keywords', label: 'Keywords', placeholder: 'Additional search terms' },
      { key: 'severity', label: 'Min Severity', placeholder: 'low, medium, high, critical' },
    ],
    workerUrl: 'https://echo-darkweb-intelligence.bmcii1976.workers.dev',
  },
  {
    id: 'web_scraper',
    name: 'Custom Web Scraper',
    description: 'Extract structured data from any website with AI-powered content detection and scheduling.',
    icon: '\uD83C\uDF10',
    category: 'General',
    fields: [
      { key: 'url', label: 'Target URL', placeholder: 'https://example.com/data', required: true },
      { key: 'selector', label: 'CSS Selector', placeholder: '.data-table tr (optional — AI auto-detects)' },
      { key: 'pages', label: 'Max Pages', placeholder: 'e.g. 50' },
    ],
  },
];

export const SCHEDULE_OPTIONS = [
  { value: 'realtime', label: 'Real-time (streaming)' },
  { value: '*/5 * * * *', label: 'Every 5 minutes' },
  { value: '*/15 * * * *', label: 'Every 15 minutes' },
  { value: '0 * * * *', label: 'Hourly' },
  { value: '0 */4 * * *', label: 'Every 4 hours' },
  { value: '0 */6 * * *', label: 'Every 6 hours' },
  { value: '0 6,18 * * *', label: 'Twice daily (6am, 6pm)' },
  { value: '0 6 * * *', label: 'Daily (6am)' },
  { value: '0 6 * * 1', label: 'Weekly (Monday 6am)' },
  { value: '0 6 1 * *', label: 'Monthly (1st, 6am)' },
];

export const TRANSFORM_OPTIONS = [
  { id: 'deduplicate', label: 'Deduplicate Records', desc: 'Remove duplicate entries based on content hash' },
  { id: 'normalize', label: 'Normalize Fields', desc: 'Standardize dates, names, addresses, and phone numbers' },
  { id: 'enrich', label: 'AI Enrichment', desc: 'Add AI-generated summaries, categories, and entity extraction' },
  { id: 'validate', label: 'Data Validation', desc: 'Schema enforcement, type checking, and completeness scoring' },
  { id: 'geocode', label: 'Geocoding', desc: 'Convert addresses to lat/lng coordinates' },
  { id: 'sentiment', label: 'Sentiment Analysis', desc: 'Classify sentiment of text content (positive/negative/neutral)' },
];

// ── Storage ────────────────────────────────────────────────────

const PIPELINES_KEY = 'ept_user_pipelines';
const RUNS_KEY = 'ept_pipeline_runs';

export function getUserPipelines(): PipelineConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(PIPELINES_KEY) || '[]');
  } catch { return []; }
}

export function savePipeline(pipeline: PipelineConfig): void {
  const all = getUserPipelines();
  const idx = all.findIndex(p => p.id === pipeline.id);
  if (idx >= 0) all[idx] = pipeline;
  else all.push(pipeline);
  localStorage.setItem(PIPELINES_KEY, JSON.stringify(all));
}

export function deletePipeline(id: string): void {
  const all = getUserPipelines().filter(p => p.id !== id);
  localStorage.setItem(PIPELINES_KEY, JSON.stringify(all));
}

export function getPipelineRuns(pipelineId?: string): PipelineRun[] {
  if (typeof window === 'undefined') return [];
  try {
    const all: PipelineRun[] = JSON.parse(localStorage.getItem(RUNS_KEY) || '[]');
    return pipelineId ? all.filter(r => r.pipelineId === pipelineId) : all;
  } catch { return []; }
}

export function addPipelineRun(run: PipelineRun): void {
  const all = getPipelineRuns();
  all.unshift(run);
  if (all.length > 100) all.length = 100;
  localStorage.setItem(RUNS_KEY, JSON.stringify(all));
}

export function createBlankPipeline(): PipelineConfig {
  return {
    id: `pl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    sourceType: '',
    sourceConfig: {},
    transformations: [],
    schedule: '0 6 * * *',
    outputFormat: 'json',
    outputUrl: '',
    status: 'draft',
    createdAt: new Date().toISOString(),
    lastRun: '',
    recordsTotal: 0,
    errorCount: 0,
  };
}

export interface SourceHealthResult {
  ok: boolean;
  latency?: number;
  version?: string;
  service?: string;
  data?: Record<string, unknown>;
}

export async function testSourceHealth(sourceType: string): Promise<SourceHealthResult> {
  const src = DATA_SOURCE_TYPES.find(s => s.id === sourceType);
  if (!src?.workerUrl) return { ok: false };
  const start = Date.now();
  try {
    const res = await fetch(`${src.workerUrl}/health`, { signal: AbortSignal.timeout(5000) });
    const latency = Date.now() - start;
    if (!res.ok) return { ok: false, latency };
    try {
      const body = await res.json();
      return {
        ok: true,
        latency,
        version: body.version,
        service: body.service || body.worker,
        data: body,
      };
    } catch {
      return { ok: true, latency };
    }
  } catch {
    return { ok: false };
  }
}
