import { getApiBase, getWsBase } from './api-base';
/**
 * PayPal Business API Client — Echo Prime Technologies
 * Worker: echo-paypal.bmcii1976.workers.dev
 */

const PAYPAL_API_URL = getApiBase('echo-paypal');

async function getToken(): Promise<string | null> {
  try {
    const { auth } = await import('./firebase');
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
  } catch {}
  return null;
}

async function paypalFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${PAYPAL_API_URL}${path}`, { ...options, headers: { ...headers, ...(options.headers as Record<string, string>) } });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`PayPal API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ───

export interface PayPalInvoice {
  id: number;
  paypal_id: string;
  customer_email: string;
  customer_name: string | null;
  amount: number;
  currency: string;
  status: string;
  items_json: string;
  note: string | null;
  due_date: string;
  created_at: string;
  sent_at: string | null;
  paid_at: string | null;
}

export interface PayPalTransaction {
  id: number;
  paypal_id: string;
  type: string;
  amount: number;
  currency: string;
  fee: number;
  net: number;
  status: string;
  customer_email: string | null;
  invoice_id: string | null;
  order_id: string | null;
  description: string | null;
  created_at: string;
}

export interface PayPalSubscription {
  id: number;
  paypal_id: string;
  plan_id: string;
  plan_name: string | null;
  customer_email: string;
  status: string;
  amount: number;
  currency: string;
  interval_unit: string;
  created_at: string;
  next_billing: string | null;
  cancelled_at: string | null;
}

export interface PayPalCustomer {
  id: number;
  email: string;
  name: string | null;
  total_spent: number;
  invoice_count: number;
  subscription_count: number;
  first_seen: string;
  last_seen: string;
}

export interface PayPalStats {
  invoices: Array<{ status: string; count: number; total: number }>;
  transactions: Array<{ status: string; count: number; total: number }>;
  subscriptions: Array<{ status: string; count: number; mrr: number }>;
  customer_count: number;
  recent_transactions: PayPalTransaction[];
  mode: string;
}

export interface PayPalSummary {
  period_days: number;
  revenue: { total: number; transaction_count: number };
  refunds: { total: number; count: number };
  fees: { total: number };
  net_revenue: number;
  subscriptions: { active: number; mrr: number };
  outstanding_invoices: { count: number; total: number };
  top_customers: PayPalCustomer[];
}

// ─── Invoice APIs ───

export async function listInvoices(status?: string, limit = 50): Promise<{ invoices: PayPalInvoice[]; count: number }> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  params.set('limit', String(limit));
  return paypalFetch(`/invoices?${params}`);
}

export async function getInvoice(id: string): Promise<{ invoice: PayPalInvoice }> {
  return paypalFetch(`/invoices/${id}`);
}

export async function createInvoice(data: {
  customer_email: string;
  customer_name?: string;
  items: Array<{ name: string; quantity: number; unit_price: number; description?: string }>;
  note?: string;
  due_date?: string;
  auto_send?: boolean;
}): Promise<{ success: boolean; invoice_id: string; amount: number; status: string }> {
  return paypalFetch('/invoices', { method: 'POST', body: JSON.stringify(data) });
}

export async function sendInvoice(id: string): Promise<{ success: boolean }> {
  return paypalFetch(`/invoices/${id}/send`, { method: 'POST' });
}

export async function remindInvoice(id: string): Promise<{ success: boolean }> {
  return paypalFetch(`/invoices/${id}/remind`, { method: 'POST' });
}

export async function cancelInvoice(id: string): Promise<{ success: boolean }> {
  return paypalFetch(`/invoices/${id}/cancel`, { method: 'POST' });
}

// ─── Order / Checkout APIs ───

export async function createOrder(data: {
  amount: number;
  currency?: string;
  description?: string;
  return_url?: string;
  cancel_url?: string;
}): Promise<{ success: boolean; order_id: string; approval_url: string; amount: number }> {
  return paypalFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export async function captureOrder(orderId: string): Promise<{ success: boolean; order_id: string; status: string; capture_id: string }> {
  return paypalFetch(`/orders/${orderId}/capture`, { method: 'POST' });
}

// ─── Refund APIs ───

export async function refundPayment(captureId: string, amount?: number, reason?: string): Promise<{ success: boolean; refund_id: string; status: string }> {
  return paypalFetch(`/payments/${captureId}/refund`, {
    method: 'POST',
    body: JSON.stringify({ amount, reason }),
  });
}

// ─── Subscription APIs ───

export async function createSubscription(planId: string, customerEmail: string): Promise<{ success: boolean; subscription_id: string; approval_url: string }> {
  return paypalFetch('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ plan_id: planId, customer_email: customerEmail }),
  });
}

export async function cancelSubscription(id: string, reason?: string): Promise<{ success: boolean }> {
  return paypalFetch(`/subscriptions/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) });
}

// ─── Transaction & Reporting APIs ───

export async function listTransactions(filters?: {
  start_date?: string;
  end_date?: string;
  status?: string;
  limit?: number;
}): Promise<{ transactions: PayPalTransaction[]; count: number }> {
  const params = new URLSearchParams();
  if (filters?.start_date) params.set('start_date', filters.start_date);
  if (filters?.end_date) params.set('end_date', filters.end_date);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.limit) params.set('limit', String(filters.limit));
  return paypalFetch(`/transactions?${params}`);
}

export async function getRevenueSummary(periodDays = 30): Promise<PayPalSummary> {
  return paypalFetch(`/reporting/summary?period=${periodDays}`);
}

export async function getStats(): Promise<PayPalStats> {
  return paypalFetch('/stats');
}

// ─── Payment Link APIs ───

export async function createPaymentLink(data: {
  amount: number;
  currency?: string;
  description?: string;
}): Promise<{ success: boolean; payment_url: string; order_id: string; amount: number; currency: string }> {
  return paypalFetch('/payment-links', { method: 'POST', body: JSON.stringify(data) });
}

export async function getPayPalConfig(): Promise<{ client_id: string; mode: string; currency: string }> {
  return paypalFetch('/config');
}

// ─── Customer APIs ───

export async function listCustomers(limit = 50): Promise<{ customers: PayPalCustomer[]; count: number }> {
  return paypalFetch(`/customers?limit=${limit}`);
}

export async function getCustomer(idOrEmail: string): Promise<{
  customer: PayPalCustomer;
  invoices: PayPalInvoice[];
  transactions: PayPalTransaction[];
  subscriptions: PayPalSubscription[];
}> {
  return paypalFetch(`/customers/${encodeURIComponent(idOrEmail)}`);
}
