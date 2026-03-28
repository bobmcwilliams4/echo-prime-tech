// Trial API client — calls echo-subscription Worker
const API_BASE = 'https://echo-subscription.bmcii1976.workers.dev';

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

export async function startTrial(params: TrialRequest): Promise<TrialResponse> {
  const res = await fetch(`${API_BASE}/trial/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}
