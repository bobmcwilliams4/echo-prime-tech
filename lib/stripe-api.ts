import { getApiBase, getWsBase } from './api-base';
// Stripe Checkout API client — calls echo-subscription Worker
const API_BASE = getApiBase('echo-subscription');

export interface CheckoutSessionRequest {
  plan_name: string;
  price_cents: number;
  interval: 'month' | 'year';
  customer_email?: string;
  customer_name?: string;
  service_id?: string;
  tier?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutSessionResponse {
  ok: boolean;
  session_id?: string;
  url?: string;
  error?: string;
}

export async function createCheckoutSession(params: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  const res = await fetch(`${API_BASE}/stripe/checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}
