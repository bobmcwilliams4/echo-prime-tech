const ZOHO_API = 'https://echo-zoho-integration.bmcii1976.workers.dev';

async function zohoFetch(path: string, options: RequestInit = {}) {
  const { auth } = await import('./firebase');
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['X-Echo-API-Key'] = 'echo-omega-prime-forge-x-2026';
  const res = await fetch(`${ZOHO_API}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getZohoConnection() {
  return zohoFetch('/api/connection');
}

export async function disconnectZoho() {
  return zohoFetch('/api/disconnect', { method: 'POST' });
}

export async function getZohoStats() {
  return zohoFetch('/stats');
}

export async function runFullSync() {
  return zohoFetch('/api/sync/full', { method: 'POST' });
}

export async function syncZohoToCloser() {
  return zohoFetch('/api/sync/zoho-to-closer', { method: 'POST' });
}

export async function syncCloserToZoho() {
  return zohoFetch('/api/sync/closer-to-zoho', { method: 'POST' });
}

export function getOAuthUrl() {
  return `${ZOHO_API}/oauth/authorize?redirect_uri=${encodeURIComponent(ZOHO_API + '/oauth/callback')}`;
}

export async function checkHealth() {
  return zohoFetch('/health');
}

// ── Zoho Mail API ──────────────────────────────────────────────────

export interface MailAccount {
  accountId: string;
  displayName: string;
  emailAddress: string;
  accountType: string;
}

export interface MailFolder {
  folderId: string;
  folderName: string;
  messageCount: number;
  unreadCount: number;
  folderType: string;
}

export interface MailMessage {
  messageId: string;
  folderId: string;
  subject: string;
  sender: string;
  toAddress: string;
  receivedTime: string;
  sentDateInGMT: string;
  summary: string;
  status: string;
  hasAttachment: boolean;
  flagid?: string;
}

export interface MailMessageContent {
  messageId: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  content: string;
  htmlContent?: string;
  receivedTime: string;
  sentDateInGMT: string;
  hasAttachment: boolean;
  attachments?: Array<{ attachmentName: string; attachmentId: string; size: number }>;
}

export interface SendEmailPayload {
  accountId: string;
  fromAddress: string;
  toAddress: string;
  subject: string;
  content: string;
  ccAddress?: string;
  bccAddress?: string;
  mailFormat?: 'html' | 'plaintext';
  inReplyTo?: string;
}

export interface EmailLogEntry {
  id: number;
  from_address: string;
  to_address: string;
  subject: string;
  status: string;
  message_id?: string;
  sent_at: string;
}

export async function getMailAccounts(): Promise<MailAccount[]> {
  const res = await zohoFetch('/api/mail/accounts');
  return res?.accounts || [];
}

export async function getMailFolders(accountId: string): Promise<MailFolder[]> {
  const res = await zohoFetch(`/api/mail/folders?accountId=${accountId}`);
  return res?.folders || [];
}

export async function getMailMessages(
  accountId: string,
  folderId: string,
  limit = 25,
  start = 0,
): Promise<MailMessage[]> {
  const res = await zohoFetch(`/api/mail/messages?accountId=${accountId}&folderId=${folderId}&limit=${limit}&start=${start}`);
  return res?.messages || [];
}

export async function getMailMessage(accountId: string, messageId: string): Promise<MailMessageContent | null> {
  const res = await zohoFetch(`/api/mail/messages/${messageId}?accountId=${accountId}`);
  return res?.message || null;
}

export async function sendMail(payload: SendEmailPayload) {
  return zohoFetch('/api/mail/send', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function searchMail(accountId: string, query: string, limit = 20) {
  const res = await zohoFetch(`/api/mail/search?accountId=${accountId}&q=${encodeURIComponent(query)}&limit=${limit}`);
  return res?.messages || [];
}

export async function flagMailMessage(accountId: string, messageId: string, flagAction: Record<string, unknown>) {
  return zohoFetch(`/api/mail/messages/${messageId}/flag?accountId=${accountId}`, {
    method: 'PUT',
    body: JSON.stringify(flagAction),
  });
}

export async function getEmailHistory(limit = 50): Promise<EmailLogEntry[]> {
  const res = await zohoFetch(`/api/mail/history?limit=${limit}`);
  return res?.history || [];
}
