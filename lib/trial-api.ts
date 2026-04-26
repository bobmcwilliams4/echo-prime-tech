import { getApiBase, getWsBase } from './api-base';
// Trial API client — calls echo-subscription Worker
const API_BASE = getApiBase('echo-subscription');

export interface TrialRequest {
  email: string;
  name?: string;
  service_id: string;
  tier?: string;
}

export interface TrialResponse {
  ok: boolean;
  trial?: {
    email: string;
    service_id: string;
    tier: string;
    trial_days: number;
    trial_end: string;
    customer_id: number;
  };
  error?: string;
}

export interface TrialInfo {
  id: number;
  status: string;
  plan_name: string;
  service_id: string;
  tier: string;
  product_name: string;
  product_slug: string;
  trial_start: string;
  trial_end: string;
  days_remaining: number;
  expired: boolean;
  api_url: string;
  docs_url: string;
  product_url: string;
}

export interface TrialStatusResponse {
  ok: boolean;
  customer?: { name: string; email: string; since: string };
  trials: TrialInfo[];
  subscriptions: { id: number; status: string; plan_name: string; plan_price: number; plan_interval: string; period_start: string; period_end: string }[];
}

export async function startTrial(params: TrialRequest): Promise<TrialResponse> {
  const res = await fetch(`${API_BASE}/trial/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function getTrialStatus(email: string): Promise<TrialStatusResponse> {
  const res = await fetch(`${API_BASE}/trial/status?email=${encodeURIComponent(email)}`);
  return res.json();
}
