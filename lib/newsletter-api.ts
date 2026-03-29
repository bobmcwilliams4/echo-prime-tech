// Newsletter API client — calls echo-email-marketing Worker
const API_BASE = 'https://echo-email-marketing.bmcii1976.workers.dev';
const TENANT_ID = '3bac3a26-b564-49c1-973c-7f47a32861de';
const LIST_ID = 'f2b2629d-37c2-4780-9890-59926b360433';

export interface SubscribeResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<SubscribeResult> {
  try {
    // Create contact
    const contactRes = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': TENANT_ID },
      body: JSON.stringify({ email, name: name || '', source: 'echo-ept.com', tags: 'newsletter,website' }),
    });
    const contact = await contactRes.json() as { id?: string; error?: string };
    if (!contact.id) return { ok: false, error: contact.error || 'Failed to create contact' };

    // Add to newsletter list
    await fetch(`${API_BASE}/lists/${LIST_ID}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': TENANT_ID },
      body: JSON.stringify({ contact_ids: [contact.id] }),
    });

    return { ok: true, id: contact.id };
  } catch {
    return { ok: false, error: 'Network error — please try again' };
  }
}
