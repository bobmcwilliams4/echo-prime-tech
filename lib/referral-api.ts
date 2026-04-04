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

// ─── Types ───

export interface ReferralCode {
  code: string;
  referral_link: string;
}

export interface ReferralValidation {
  valid: boolean;
  code: string;
  referrer_name?: string;
}

export interface ReferralTrackResult {
  tracked: boolean;
  message?: string;
}

export interface ReferralReward {
  reward_type: string;
  reward_value: string;
  tier: number;
  referral_count: number;
  granted_at: string;
}

export interface ReferralStats {
  code: string;
  referral_link: string;
  total_referrals: number;
  converted_referrals: number;
  this_week: number;
  rewards: ReferralReward[];
  recent_referrals: { referred_name: string; status: string; created_at: string }[];
  next_tier: { count: number; reward_type: string; reward_value: string; remaining: number } | null;
}

export interface LeaderboardEntry {
  display_name: string;
  referral_count: number;
  rank: number;
}

// ─── API Functions ───

export async function getReferralCode(): Promise<ReferralCode> {
  return fetchApi('/api/referral/code');
}

export async function validateReferralCode(code: string): Promise<ReferralValidation> {
  return fetchApi(`/api/referral/validate/${encodeURIComponent(code)}`);
}

export async function trackReferral(code: string): Promise<ReferralTrackResult> {
  return fetchApi('/api/referral/track', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function getReferralStats(): Promise<ReferralStats> {
  return fetchApi('/api/referral/stats');
}

export async function getLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
  return fetchApi('/api/referral/leaderboard');
}
