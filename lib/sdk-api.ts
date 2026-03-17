/**
 * Echo SDK Gateway API Client
 * Endpoint: https://echo-sdk-gateway.bmcii1976.workers.dev
 * 17 endpoints — engines, brain, knowledge, vault, worker proxy
 */

const SDK_GATEWAY = 'https://echo-sdk-gateway.bmcii1976.workers.dev';
const EPT_API = 'https://ept-api.bmcii1976.workers.dev';

// ── Types ──

export interface SDKResponse<T = unknown> {
  success: boolean;
  data: T;
  error: { message: string; code: string } | null;
  meta: { ts: string; version: string; service: string; latency_ms?: number };
}

export interface SDKHealthData {
  status: string;
  version: string;
  timestamp: string;
  services: Record<string, string>;
  endpoints: Record<string, number>;
}

export interface EngineStats {
  total_engines: number;
  total_doctrines: number;
  total_domains: number;
  categories: Array<{ category: string; c: number }>;
}

export interface OpenAPIEndpoint {
  method: string;
  path: string;
  summary: string;
  description?: string;
  operationId?: string;
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema: { type: string; default?: unknown; example?: unknown };
  }>;
  requestBody?: {
    required?: boolean;
    content: {
      'application/json': {
        schema: {
          type: string;
          properties?: Record<string, { type: string; description?: string; default?: unknown; example?: unknown }>;
          required?: string[];
        };
      };
    };
  };
  responses: Record<string, { description: string; content?: unknown }>;
  tags?: string[];
  security?: Array<Record<string, string[]>>;
}

export interface OpenAPISpec {
  openapi: string;
  info: { title: string; version: string; description: string };
  servers?: Array<{ url: string; description?: string }>;
  paths: Record<string, Record<string, unknown>>;
  components?: { securitySchemes?: Record<string, unknown> };
}

export interface SDKKey {
  id: string;
  key: string;
  tier: 'free' | 'pro' | 'enterprise';
  label?: string;
  created_at: string;
  last_used?: string;
  queries_today: number;
  daily_limit: number;
}

export interface SDKUsage {
  tier: string;
  queries_today: number;
  daily_limit: number;
  queries_this_month: number;
  reset_at: string;
}

// ── Storage ──

const SDK_KEY_STORAGE = 'ept_sdk_api_key';
const SDK_TIER_STORAGE = 'ept_sdk_tier';

export function getStoredSDKKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SDK_KEY_STORAGE);
}

export function storeSDKKey(key: string, tier?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SDK_KEY_STORAGE, key);
  if (tier) localStorage.setItem(SDK_TIER_STORAGE, tier);
}

export function clearSDKKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SDK_KEY_STORAGE);
  localStorage.removeItem(SDK_TIER_STORAGE);
}

export function getStoredTier(): string {
  if (typeof window === 'undefined') return 'free';
  return localStorage.getItem(SDK_TIER_STORAGE) || 'free';
}

// ── Gateway Fetcher ──

export async function sdkFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  apiKey?: string,
): Promise<SDKResponse<T>> {
  const key = apiKey || getStoredSDKKey();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) headers['X-Echo-API-Key'] = key;

  const start = Date.now();
  const res = await fetch(`${SDK_GATEWAY}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });
  const latency = Date.now() - start;
  const json = await res.json() as SDKResponse<T>;
  if (json.meta) json.meta.latency_ms = latency;
  return json;
}

// ── Public Endpoints ──

export async function getHealth(): Promise<SDKResponse<SDKHealthData>> {
  return sdkFetch('/health');
}

export async function getOpenAPISpec(): Promise<OpenAPISpec> {
  const res = await fetch(`${SDK_GATEWAY}/openapi.json`);
  return res.json();
}

export async function getEngineStats(): Promise<SDKResponse<EngineStats>> {
  return sdkFetch('/engine/stats');
}

export async function getEngineDomains(): Promise<SDKResponse<{ domains: Array<{ domain: string; count: number }> }>> {
  return sdkFetch('/engine/domains');
}

// ── Authenticated Engine Endpoints ──

export async function queryEngine(params: { engine_id?: string; query: string; mode?: string }) {
  return sdkFetch('/engine/query', { method: 'POST', body: JSON.stringify(params) });
}

export async function queryDomain(params: { domain: string; query: string; mode?: string }) {
  return sdkFetch('/engine/domain', { method: 'POST', body: JSON.stringify(params) });
}

export async function crossDomainQuery(params: { query: string; limit?: number }) {
  return sdkFetch('/engine/cross-domain', { method: 'POST', body: JSON.stringify(params) });
}

export async function searchEngines(q: string, domain?: string, limit?: number) {
  const qs = new URLSearchParams({ q });
  if (domain) qs.set('domain', domain);
  if (limit) qs.set('limit', String(limit));
  return sdkFetch(`/engine/search?${qs}`);
}

export async function getEngineById(id: string) {
  return sdkFetch(`/engine/${id}`);
}

// ── Brain Endpoints ──

export async function brainSearch(params: { query: string; limit?: number }) {
  return sdkFetch('/brain/search', { method: 'POST', body: JSON.stringify(params) });
}

export async function brainIngest(params: { instance_id: string; role: string; content: string; importance?: number; tags?: string[] }) {
  return sdkFetch('/brain/ingest', { method: 'POST', body: JSON.stringify(params) });
}

export async function brainContext(params: { instance_id: string; query: string; conversation_id?: string }) {
  return sdkFetch('/brain/context', { method: 'POST', body: JSON.stringify(params) });
}

export async function brainHeartbeat(params: { instance_id: string; current_task: string }) {
  return sdkFetch('/brain/heartbeat', { method: 'POST', body: JSON.stringify(params) });
}

// ── Knowledge Endpoints ──

export async function knowledgeSearch(params: { query: string; category?: string; limit?: number }) {
  return sdkFetch('/knowledge/search', { method: 'POST', body: JSON.stringify(params) });
}

export async function knowledgeIngest(params: { title: string; content: string; category?: string; tags?: string[] }) {
  return sdkFetch('/knowledge/ingest', { method: 'POST', body: JSON.stringify(params) });
}

// ── Worker Proxy ──

export async function workerCall(params: { worker: string; path: string; method?: string; body?: unknown }) {
  return sdkFetch('/worker/call', { method: 'POST', body: JSON.stringify(params) });
}

// ── Key Management (via ept-api) ──

async function eptFetch<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${EPT_API}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || `API error ${res.status}`);
  }
  return res.json();
}

export async function createSDKKey(firebaseToken: string, label?: string): Promise<SDKKey> {
  return eptFetch('/sdk/keys', { method: 'POST', body: JSON.stringify({ label }) }, firebaseToken);
}

export async function listSDKKeys(firebaseToken: string): Promise<{ keys: SDKKey[] }> {
  return eptFetch('/sdk/keys', {}, firebaseToken);
}

export async function revokeSDKKey(firebaseToken: string, keyId: string): Promise<{ success: boolean }> {
  return eptFetch(`/sdk/keys/${keyId}`, { method: 'DELETE' }, firebaseToken);
}

export async function getSDKUsage(firebaseToken: string): Promise<SDKUsage> {
  return eptFetch('/sdk/usage', {}, firebaseToken);
}

// ── OpenAPI Parser ──

export function parseOpenAPIEndpoints(spec: OpenAPISpec): OpenAPIEndpoint[] {
  const endpoints: OpenAPIEndpoint[] = [];
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, def] of Object.entries(methods as Record<string, Record<string, unknown>>)) {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        endpoints.push({
          method: method.toUpperCase(),
          path,
          summary: (def.summary as string) || path,
          description: def.description as string | undefined,
          operationId: def.operationId as string | undefined,
          parameters: def.parameters as OpenAPIEndpoint['parameters'],
          requestBody: def.requestBody as OpenAPIEndpoint['requestBody'],
          responses: (def.responses || {}) as Record<string, { description: string }>,
          tags: def.tags as string[] | undefined,
          security: def.security as Array<Record<string, string[]>> | undefined,
        });
      }
    }
  }
  return endpoints.sort((a, b) => {
    const order = ['GET', 'POST', 'PUT', 'DELETE'];
    const tagOrder = ['engine', 'brain', 'knowledge', 'vault', 'worker', 'system'];
    const aTag = (a.tags?.[0] || 'z').toLowerCase();
    const bTag = (b.tags?.[0] || 'z').toLowerCase();
    const tagDiff = tagOrder.indexOf(aTag) - tagOrder.indexOf(bTag);
    if (tagDiff !== 0) return tagDiff;
    return order.indexOf(a.method) - order.indexOf(b.method);
  });
}

// ── Tier Definitions ──

export const SDK_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    dailyLimit: 100,
    features: [
      '100 queries/day',
      'All 17 endpoints',
      '6,500+ engines',
      'Community support',
      'Rate limited',
    ],
  },
  pro: {
    name: 'Pro',
    price: 49,
    dailyLimit: 10000,
    features: [
      '10,000 queries/day',
      'All 17 endpoints',
      '6,500+ engines',
      'Priority routing',
      'Email support',
      'Webhook callbacks',
      'Usage analytics',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    dailyLimit: -1,
    features: [
      'Unlimited queries',
      'All 17 endpoints',
      '6,500+ engines',
      'Dedicated routing',
      '24/7 phone support',
      'SLA guarantee (99.9%)',
      'Custom domains',
      'Webhook callbacks',
      'Usage analytics',
      'Dedicated account manager',
    ],
  },
} as const;
