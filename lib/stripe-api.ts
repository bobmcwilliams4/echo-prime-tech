// Stripe Checkout API client.
// 2026-07-03 sweep: dead echo-subscription CF worker -> sovereign FORGE service
// (subs.echo-op.com, echo-subscription.service :8180). Live Stripe checkout.
const API_BASE = 'https://subs.echo-op.com';

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
