/**
 * Engine Runtime API — Direct access to 6,500+ intelligence engines
 *
 * Connects to https://echo-engine-runtime.bmcii1976.workers.dev
 * 1,000+ domain categories, 521K+ doctrines
 *
 * This is the RAW doctrine/engine data backend.
 * For customer billing/Stripe, see engine-cloud-api.ts instead.
 */

const RUNTIME_URL = 'https://echo-engine-runtime.bmcii1976.workers.dev';

// ── Types ──

export interface RuntimeHealth {
  ok: boolean;
  service: string;
  version: string;
  engines_loaded: number;
  total_doctrines: number;
  total_queries: number;
  status: string;
}

export interface CategoryStats {
  category: string;
  c: number;
  lines: number;
  doctrines: number;
}

export interface RuntimeStats {
  ok: boolean;
  total_engines: number;
  total_doctrines: number;
  total_queries: number;
  categories: CategoryStats[];
}

export interface DoctrineResult {
  topic: string;
  conclusion: string;
  reasoning: string;
  confidence: string;
  authority: string[];
  engine_id: string;
  domain: string;
  score: number;
  keywords?: string[];
}

export interface QueryResponse {
  ok: boolean;
  results: DoctrineResult[];
  total: number;
  query: string;
  domain?: string;
  domains?: string[];
  latency_ms: number;
  match_quality?: 'strong' | 'moderate' | 'weak' | 'none';
  match_guidance?: string;
  top_score?: number;
}

export interface EngineInfo {
  engine_id: string;
  name: string;
  category: string;
  lines: number;
  doctrines: number;
}

export interface DomainDetail {
  ok: boolean;
  category: string;
  engines: EngineInfo[];
  total_engines: number;
  total_doctrines: number;
  total_lines: number;
}

// ── Fetch (no auth — public read-only) ──

async function runtimeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${RUNTIME_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(data.error || `Engine Runtime ${res.status}`);
  }
  return res.json();
}

// ── Endpoints ──

export async function getRuntimeHealth(): Promise<RuntimeHealth> {
  return runtimeFetch('/health');
}

export async function getRuntimeStats(): Promise<RuntimeStats> {
  return runtimeFetch('/stats');
}

export async function getDomains(): Promise<{ ok: boolean; domains: string[] }> {
  return runtimeFetch('/domains');
}

export async function getDomainDetail(category: string): Promise<DomainDetail> {
  return runtimeFetch(`/domains/${encodeURIComponent(category)}`);
}

export async function queryDoctrines(
  query: string,
  domain?: string,
  limit = 5,
): Promise<QueryResponse> {
  return runtimeFetch('/query', {
    method: 'POST',
    body: JSON.stringify({ query, domain, limit }),
  });
}

export async function queryMultiDomain(
  query: string,
  domains: string[],
  limit = 3,
): Promise<QueryResponse> {
  return runtimeFetch('/query/multi', {
    method: 'POST',
    body: JSON.stringify({ query, domains, limit }),
  });
}

// ── Utilities ──

export function getConfidenceBadge(confidence: string): { label: string; color: string } {
  switch (confidence) {
    case 'DEFENSIBLE':
      return { label: 'High Confidence', color: '#10b981' };
    case 'AGGRESSIVE':
      return { label: 'Moderate', color: '#f59e0b' };
    case 'DISCLOSURE':
      return { label: 'Advisory', color: '#6366f1' };
    case 'HIGH_RISK':
      return { label: 'Low Confidence', color: '#ef4444' };
    default:
      return { label: confidence || 'Unknown', color: '#64748b' };
  }
}

export function getMatchQualityBadge(quality?: string): { label: string; color: string; icon: string } {
  switch (quality) {
    case 'strong':
      return { label: 'Strong Match', color: '#10b981', icon: '●' };
    case 'moderate':
      return { label: 'Partial Match', color: '#f59e0b', icon: '◐' };
    case 'weak':
      return { label: 'Weak Match', color: '#ef4444', icon: '○' };
    case 'none':
      return { label: 'No Match', color: '#64748b', icon: '✕' };
    default:
      return { label: '', color: '#64748b', icon: '' };
  }
}

export function formatDoctrineCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
