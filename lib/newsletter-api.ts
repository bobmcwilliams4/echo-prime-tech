import { getApiBase, getWsBase } from './api-base';
// Newsletter API client — calls echo-email-marketing Worker /subscribe (public, no auth needed)
const API_BASE = getApiBase('echo-email-marketing');
const TENANT_ID = '3bac3a26-b564-49c1-973c-7f47a32861de';
const LIST_ID = 'f2b2629d-37c2-4780-9890-59926b360433';

export interface SubscribeResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: name || '',
        tenant_id: TENANT_ID,
        list_id: LIST_ID,
        source: 'echo-ept.com',
        tags: 'newsletter,website',
      }),
    });
    const data = await res.json() as { ok?: boolean; id?: string; error?: string };
    if (data.ok) return { ok: true, id: data.id };
    return { ok: false, error: data.error || 'Failed to subscribe' };
  } catch {
    return { ok: false, error: 'Network error — please try again' };
  }
}
