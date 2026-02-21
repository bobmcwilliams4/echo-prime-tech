/**
 * Echo Engine Cloud API — Customer-Facing Engine Intelligence
 *
 * Connects to the encrypted engine cloud runtime at
 * https://echo-engine-cloud.bmcii1976.workers.dev
 *
 * All doctrine content is processed server-side.
 * Responses are sanitized — no internal metadata exposed.
 */

const API_URL = 'https://echo-engine-cloud.bmcii1976.workers.dev';

// ── Types ──

export interface QueryResponse {
  analysis: string;
  summary: string;
  confidence: string;
  mode: string;
  sources_cited: number;
  timestamp: string;
  determinism_hash: string;
  report_id: string;
  report_available: boolean;
  domain: string;
  domain_cost: number;
  usage: {
    remaining: number;
    cost: number;
  };
}

export interface UsageResponse {
  tier: string;
  month: string;
  queries: number;
  total_cost: number;
  remaining: number;
  limit: number;
}

export interface PricingTier {
  name: string;
  price: number;
  queries: number;
  features: string[];
  popular?: boolean;
}

export interface EngineCategory {
  name: string;
  engines: number;
  description: string;
  knowledge_depth?: number;
}

export interface PricingResponse {
  tiers: PricingTier[];
  engine_categories: EngineCategory[];
}

export interface CatalogResponse {
  total_engines: number;
  total_doctrines: number;
  categories: EngineCategory[];
}

export interface RegisterResponse {
  user_id: string;
  api_key: string;
  tier: string;
  monthly_queries: number;
  warning: string;
}

// ── Storage ──

const API_KEY_STORAGE = 'ept_api_key';
const USER_ID_STORAGE = 'ept_user_id';

export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE);
}

export function storeApiKey(key: string, userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE, key);
  localStorage.setItem(USER_ID_STORAGE, userId);
}

export function clearApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEY_STORAGE);
  localStorage.removeItem(USER_ID_STORAGE);
}

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_STORAGE);
}

// ── API Client ──

async function fetchEngine<T = unknown>(
  path: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<T> {
  const key = apiKey || getStoredApiKey();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (key) {
    headers['X-API-Key'] = key;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(data.error || `API ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Public Endpoints (no auth) ──

export async function getHealth(): Promise<{ status: string; timestamp: string }> {
  return fetchEngine('/health');
}

export async function getPricing(): Promise<PricingResponse> {
  return fetchEngine('/api/pricing');
}

export async function getCatalog(): Promise<CatalogResponse> {
  return fetchEngine('/api/catalog');
}

// ── Auth Endpoints ──

export async function registerUser(email: string, name?: string): Promise<RegisterResponse> {
  const data = await fetchEngine<RegisterResponse>('/api/register', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });

  // Auto-store the API key
  storeApiKey(data.api_key, data.user_id);
  return data;
}

// ── Authenticated Endpoints ──

export async function queryEngine(
  query: string,
  mode: 'FAST' | 'DEFENSE' | 'MEMO' = 'FAST'
): Promise<QueryResponse> {
  return fetchEngine('/api/query', {
    method: 'POST',
    body: JSON.stringify({ query, mode }),
  });
}

export async function getUsage(): Promise<UsageResponse> {
  return fetchEngine('/api/usage');
}

export async function createApiKey(label?: string): Promise<{ api_key: string; tier: string; warning: string }> {
  return fetchEngine('/api/keys/create', {
    method: 'POST',
    body: JSON.stringify({ label }),
  });
}

// ── Stripe Billing ──

export interface ProfileResponse {
  user_id: string;
  email: string;
  name: string | null;
  tier: string;
  has_subscription: boolean;
  api_keys_active: number;
  monthly_limit: number;
  created_at: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface PortalResponse {
  portal_url: string;
}

export async function getProfile(): Promise<ProfileResponse> {
  return fetchEngine('/api/profile');
}

export async function createCheckout(
  tier: 'professional' | 'business' | 'enterprise',
  successUrl?: string,
  cancelUrl?: string
): Promise<CheckoutResponse> {
  return fetchEngine('/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ tier, success_url: successUrl, cancel_url: cancelUrl }),
  });
}

export async function openCustomerPortal(returnUrl?: string): Promise<PortalResponse> {
  return fetchEngine('/api/stripe/portal', {
    method: 'POST',
    body: JSON.stringify({ return_url: returnUrl }),
  });
}

// ── Reports ──

export async function downloadReport(reportId: string): Promise<string> {
  const key = getStoredApiKey();
  const headers: Record<string, string> = {};
  if (key) headers['X-API-Key'] = key;

  const res = await fetch(`${API_URL}/api/reports/${reportId}`, { headers });
  if (!res.ok) throw new Error('Report not found');
  return res.text();
}

export async function listReports(): Promise<{ reports: { report_id: string; created: string; domain: string }[]; count: number }> {
  return fetchEngine('/api/reports');
}

// ── Utility ──

export function isAuthenticated(): boolean {
  return !!getStoredApiKey();
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'DEFENSIBLE': return '#10b981';
    case 'AGGRESSIVE': return '#f59e0b';
    case 'DISCLOSURE': return '#6366f1';
    case 'HIGH_RISK': return '#ef4444';
    default: return '#64748b';
  }
}

export function getConfidenceLabel(confidence: string): string {
  switch (confidence) {
    case 'DEFENSIBLE': return 'High Confidence';
    case 'AGGRESSIVE': return 'Moderate Confidence';
    case 'DISCLOSURE': return 'AI-Generated';
    case 'HIGH_RISK': return 'Low Confidence';
    default: return confidence;
  }
}
