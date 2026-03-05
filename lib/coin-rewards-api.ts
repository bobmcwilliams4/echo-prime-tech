const API_BASE = 'https://echo-coin-rewards.bmcii1976.workers.dev';

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  try {
    const { auth } = await import('./firebase');
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {}
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getTokenomics() {
  return apiFetch('/tokenomics');
}

export async function getRules() {
  return apiFetch('/rules');
}

export async function getLeaderboard(limit = 25) {
  return apiFetch(`/leaderboard?limit=${limit}`);
}

export async function getBurnStats() {
  return apiFetch('/burns');
}

export async function getBalance(userId: string) {
  return apiFetch(`/balance?user_id=${userId}`);
}

export async function getHistory(userId: string, limit = 50) {
  return apiFetch(`/history?user_id=${userId}&limit=${limit}`);
}

export async function getReferralStats(userId: string) {
  return apiFetch(`/referrals?user_id=${userId}`);
}

export async function signup(username: string, email?: string, wallet?: string, referralCode?: string) {
  return apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, wallet, referral_code: referralCode }),
  });
}

export async function earnPoints(userId: string, action: string, metadata?: Record<string, unknown>) {
  return apiFetch('/earn', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, action, metadata }),
  });
}

export async function spendPoints(userId: string, amount: number, description: string, category: string) {
  return apiFetch('/spend', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, amount, description, category }),
  });
}

export async function stakePoints(userId: string, amount: number, lockDays: number) {
  return apiFetch('/stake', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, amount, lock_days: lockDays }),
  });
}
