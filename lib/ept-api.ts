const API_URL = 'https://ept-api.bmcii1976.workers.dev';

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
  description: string;
  icon: string;
  status: string;
  url: string;
  team_contact: string;
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

export async function syncUser(): Promise<{ uid: string; email: string; role: string; subscriptions: string[] }> {
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
