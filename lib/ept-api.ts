import { getApiBase, getWsBase } from './api-base';
const API_URL = getApiBase('ept-api');

async function getToken(): Promise<string | null> {
  try {
    const { auth } = await import('./firebase');
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
  } catch {}
  return null;
}

async function fetchApi<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface ServicePricing {
  tier: string;
  price: number | null;
  interval: string;
  features: string[];
  popular?: boolean;
  custom?: boolean;
}

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  icon?: string;
  status?: string;
  url?: string;
  team_contact?: string;
  pricing: ServicePricing[];
}

export interface UserProfile {
  uid: string;
  email: string;
  display_name: string;
  photo_url: string;
  role: 'owner' | 'user';
  created_at: string;
  subscriptions: string[];
  services: Service[];
}

export interface AdminAnalytics {
  total_users: number;
  total_subscriptions: number;
  new_this_week: number;
  new_today: number;
  subscriptions_by_service: { service_id: string; count: number }[];
  recent_users: { uid: string; email: string; display_name: string; photo_url: string; role: string; created_at: string; last_login: string }[];
  services: Service[];
}

export async function syncUser(): Promise<{ uid: string; email: string; role: string; subscriptions: string[]; grants?: Record<string, string> }> {
  return fetchApi('/api/user/sync', { method: 'POST' });
}

export async function getProfile(): Promise<UserProfile> {
  return fetchApi('/api/user/me');
}

export async function getServices(): Promise<{ services: Service[] }> {
  return fetchApi('/api/services');
}

export async function subscribe(serviceIds: string[]): Promise<{ ok: boolean; subscribed: string[] }> {
  return fetchApi('/api/subscribe', { method: 'POST', body: JSON.stringify({ service_ids: serviceIds }) });
}

export async function unsubscribe(serviceId: string): Promise<{ ok: boolean }> {
  return fetchApi(`/api/unsubscribe/${serviceId}`, { method: 'DELETE' });
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  return fetchApi('/api/admin/analytics');
}

export async function getAdminUsers(): Promise<{ users: Array<{ uid: string; email: string; display_name: string; photo_url: string; role: string; created_at: string; last_login: string; subscribed_services: string | null }> }> {
  return fetchApi('/api/admin/users');
}

// ─── Admin User Management ───

export interface AdminUserDetail {
  user: { uid: string; email: string; display_name: string; photo_url: string; role: string; stripe_customer_id: string | null; created_at: string; last_login: string };
  subscriptions: Array<{ service_id: string; status: string; tier: string; stripe_subscription_id: string | null; created_at: string }>;
  grants: Record<string, string>;
  services: Service[];
}

export async function getAdminUserDetail(uid: string): Promise<AdminUserDetail> {
  return fetchApi(`/api/admin/users/${uid}`);
}

export async function updateUserRole(uid: string, role: string): Promise<{ ok: boolean }> {
  return fetchApi(`/api/admin/users/${uid}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
}

export async function grantUserServices(uid: string, serviceIds: string[]): Promise<{ ok: boolean; granted: string[] }> {
  return fetchApi(`/api/admin/users/${uid}/services`, { method: 'POST', body: JSON.stringify({ service_ids: serviceIds }) });
}

export async function revokeUserService(uid: string, serviceId: string): Promise<{ ok: boolean }> {
  return fetchApi(`/api/admin/users/${uid}/services/${serviceId}`, { method: 'DELETE' });
}

export async function updateUserSettings(uid: string, settings: Record<string, string>): Promise<{ ok: boolean }> {
  return fetchApi(`/api/admin/users/${uid}/settings`, { method: 'PUT', body: JSON.stringify(settings) });
}

// ─── Stripe Billing ───

export async function createCheckout(serviceId: string, tier: string): Promise<{ url: string }> {
  return fetchApi('/api/checkout', { method: 'POST', body: JSON.stringify({ service_id: serviceId, tier }) });
}

export async function getBillingPortal(): Promise<{ url: string }> {
  return fetchApi('/api/billing/portal');
}

export async function getStripeConfig(): Promise<{ publishable_key: string }> {
  return fetchApi('/api/billing/config');
}

// ─── Commander Vault API ───

const VAULT_API_URL = getApiBase('echo-vault-api');

async function fetchVault<T = unknown>(path: string, masterPassword?: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (masterPassword) {
    headers['X-Vault-Key'] = btoa(masterPassword);
  }
  const res = await fetch(`${VAULT_API_URL}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Vault ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface VaultCredential {
  service: string;
  username: string;
  tags: string[];
  strength: number;
  last_accessed: string;
}

export interface VaultStats {
  total_credentials: number;
  total_backups: number;
  storage_used_mb: number;
  last_sync: string;
  strength_distribution: Record<string, number>;
}

export interface VaultBackup {
  key: string;
  size: number;
  uploaded: string;
}

export interface VaultAuditEntry {
  action: string;
  service: string;
  timestamp: string;
  ip: string;
}

export async function vaultList(masterPassword: string): Promise<{ objects: { key: string; size: number; uploaded: string }[] }> {
  return fetchVault('/api/vault/list', masterPassword);
}

export async function vaultCredentials(masterPassword: string): Promise<{ credentials: VaultCredential[] }> {
  return fetchVault('/api/vault/credentials', masterPassword);
}

export async function vaultCredential(masterPassword: string, service: string): Promise<{ service: string; username: string; password: string }> {
  return fetchVault(`/api/vault/credential/${encodeURIComponent(service)}`, masterPassword);
}

export async function vaultSearch(masterPassword: string, query: string): Promise<{ results: VaultCredential[] }> {
  return fetchVault('/api/vault/search', masterPassword, { method: 'POST', body: JSON.stringify({ query }) });
}

export async function vaultKeychain(masterPassword: string): Promise<{ keys: { name: string; masked_value: string }[] }> {
  return fetchVault('/api/vault/keychain', masterPassword);
}

export async function vaultBackups(masterPassword: string): Promise<{ backups: VaultBackup[] }> {
  return fetchVault('/api/vault/backups', masterPassword);
}

export async function vaultStats(masterPassword: string): Promise<VaultStats> {
  return fetchVault('/api/vault/stats', masterPassword);
}

export async function vaultAudit(masterPassword: string): Promise<{ entries: VaultAuditEntry[] }> {
  return fetchVault('/api/vault/audit', masterPassword);
}
