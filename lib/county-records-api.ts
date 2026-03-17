// ════════════════════════════════════════════════════════════════
// County Records API Client
// Connects to echo-county-records (genealogy) + encore-cloud-scraper (deeds)
// ════════════════════════════════════════════════════════════════

const GENEALOGY_API = 'https://echo-county-records.bmcii1976.workers.dev';
const DEEDS_API = 'https://encore-cloud-scraper.bmcii1976.workers.dev';
const API_KEY = 'echo-omega-prime-forge-x-2026';

async function apiFetch(base: string, path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Echo-API-Key': API_KEY,
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${base}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Genealogy Records (echo-county-records) ──────────────────

export interface GenealogyRecord {
  id: number;
  content_hash: string;
  source_id: string;
  source_platform: string;
  record_type: string;
  full_name: string | null;
  given_name: string | null;
  surname: string | null;
  birth_date: string | null;
  birth_place: string | null;
  death_date: string | null;
  death_place: string | null;
  burial_place: string | null;
  marriage_date: string | null;
  marriage_place: string | null;
  spouse_name: string | null;
  father_name: string | null;
  mother_name: string | null;
  county: string | null;
  state: string | null;
  country: string;
  document_number: string | null;
  description: string | null;
  source_url: string | null;
  ai_summary: string | null;
  created_at: string;
}

export interface GenealogySearchParams {
  surname?: string;
  given_name?: string;
  county?: string;
  state?: string;
  record_type?: string;
  source?: string;
  limit?: number;
  offset?: number;
}

export interface GenealogyHealth {
  status: string;
  service: string;
  version: string;
  database: string;
  records: number;
  sources: number;
  platforms: string[];
  timestamp: string;
}

export async function getGenealogyHealth(): Promise<GenealogyHealth> {
  return apiFetch(GENEALOGY_API, '/health');
}

export async function searchGenealogyRecords(params: GenealogySearchParams): Promise<{ records: GenealogyRecord[]; total: number }> {
  const qs = new URLSearchParams();
  if (params.surname) qs.set('surname', params.surname);
  if (params.given_name) qs.set('given_name', params.given_name);
  if (params.county) qs.set('county', params.county);
  if (params.state) qs.set('state', params.state);
  if (params.record_type) qs.set('record_type', params.record_type);
  if (params.source) qs.set('source', params.source);
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.offset) qs.set('offset', String(params.offset));
  return apiFetch(GENEALOGY_API, `/search?${qs.toString()}`);
}

export async function getGenealogySources(): Promise<{ sources: Array<{ id: string; name: string; platform: string; total_records: number; enabled: boolean }> }> {
  return apiFetch(GENEALOGY_API, '/sources');
}

export async function triggerGenealogyScrape(sourceId: string, query: Record<string, string>): Promise<{ job_id: number; status: string }> {
  return apiFetch(GENEALOGY_API, '/scrape', {
    method: 'POST',
    body: JSON.stringify({ source_id: sourceId, query }),
  });
}

// ── Deed / Instrument Records (encore-cloud-scraper) ─────────

export interface DeedRecord {
  id: number;
  county: string;
  instrument_type: string;
  doc_number: string;
  book: string | null;
  page: string | null;
  filing_date: string | null;
  recording_date: string | null;
  grantor: string | null;
  grantee: string | null;
  legal_description: string | null;
  consideration: string | null;
  source_url: string | null;
  created_at: string;
}

export interface DeedSearchParams {
  county?: string;
  instrument_type?: string;
  grantor?: string;
  grantee?: string;
  doc_number?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface DeedHealth {
  ok: boolean;
  service: string;
  mode: string;
  types: number;
  counties: string[];
}

export async function getDeedHealth(): Promise<DeedHealth> {
  return apiFetch(DEEDS_API, '/health');
}

export async function searchDeedRecords(params: DeedSearchParams): Promise<{ records: DeedRecord[]; total: number }> {
  const qs = new URLSearchParams();
  if (params.county) qs.set('county', params.county);
  if (params.instrument_type) qs.set('type', params.instrument_type);
  if (params.grantor) qs.set('grantor', params.grantor);
  if (params.grantee) qs.set('grantee', params.grantee);
  if (params.doc_number) qs.set('doc_number', params.doc_number);
  if (params.date_from) qs.set('date_from', params.date_from);
  if (params.date_to) qs.set('date_to', params.date_to);
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.offset) qs.set('offset', String(params.offset));
  return apiFetch(DEEDS_API, `/search?${qs.toString()}`);
}

export async function getDeedCounties(): Promise<{ counties: string[] }> {
  return apiFetch(DEEDS_API, '/counties');
}

export async function getDeedInstrumentTypes(): Promise<{ types: string[] }> {
  return apiFetch(DEEDS_API, '/types');
}

export async function getDeedStats(): Promise<{ total_records: number; counties: number; instrument_types: number; last_scrape: string | null }> {
  return apiFetch(DEEDS_API, '/stats');
}

// ── Unified Search ───────────────────────────────────────────

export type UnifiedRecord =
  | { type: 'genealogy'; data: GenealogyRecord }
  | { type: 'deed'; data: DeedRecord };

export async function unifiedSearch(query: string, county?: string): Promise<UnifiedRecord[]> {
  const results: UnifiedRecord[] = [];
  const parts = query.trim().split(/\s+/);
  const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const givenName = parts.length > 1 ? parts.slice(0, -1).join(' ') : undefined;

  const [genealogy, deeds] = await Promise.allSettled([
    searchGenealogyRecords({ surname, given_name: givenName, county, limit: 20 }),
    searchDeedRecords({ grantor: query, county, limit: 20 }),
  ]);

  if (genealogy.status === 'fulfilled' && genealogy.value.records) {
    for (const r of genealogy.value.records) results.push({ type: 'genealogy', data: r });
  }
  if (deeds.status === 'fulfilled' && deeds.value.records) {
    for (const r of deeds.value.records) results.push({ type: 'deed', data: r });
  }

  return results;
}
