'use client';

const SDK_GATEWAY = 'https://echo-sdk-gateway.bmcii1976.workers.dev';

async function getHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { auth } = await import('./firebase');
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch { /* unauthenticated */ }
  return headers;
}

// ── Types ────────────────────────────────────────────────────

export type ScanMode = 'quick' | 'standard' | 'deep';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface ScanRequest {
  target: string;
  mode?: ScanMode;
  analyzers?: string[];
}

export interface ScanFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
  analyzer: string;
  evidence?: string;
  mitre_attack_id?: string | null;
  mitre_attack_name?: string | null;
  remediation?: string;
}

export interface ScanResult {
  scan_id: string;
  target: string;
  target_type: string;
  timestamp: string;
  duration_ms: number;
  risk_score: number;
  findings_count: number;
  findings: ScanFinding[];
  technologies?: Array<{ name: string; category: string; confidence: number }>;
  endpoints?: Array<{ url: string; method: string; status: number }>;
}

// ── Scanner API (via SDK Gateway → echo-343-scanner Worker) ──

export async function startScan(request: ScanRequest): Promise<{ scan_id: string; status: string }> {
  const headers = await getHeaders();
  const res = await fetch(`${SDK_GATEWAY}/worker/call`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ worker: 'echo-343-scanner', path: '/scan', method: 'POST', body: request }),
  });
  if (!res.ok) throw new Error(`Scan failed: HTTP ${res.status}`);
  return res.json();
}

export async function getScanStatus(scanId: string): Promise<{ status: string; progress: number }> {
  const headers = await getHeaders();
  const res = await fetch(`${SDK_GATEWAY}/worker/call`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ worker: 'echo-343-scanner', path: `/scan/${scanId}/status`, method: 'GET' }),
  });
  if (!res.ok) throw new Error(`Status check failed: HTTP ${res.status}`);
  return res.json();
}

export async function getScanResults(scanId: string): Promise<ScanResult> {
  const headers = await getHeaders();
  const res = await fetch(`${SDK_GATEWAY}/worker/call`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ worker: 'echo-343-scanner', path: `/scan/${scanId}`, method: 'GET' }),
  });
  if (!res.ok) throw new Error(`Results fetch failed: HTTP ${res.status}`);
  return res.json();
}

export async function listScans(limit = 20): Promise<ScanResult[]> {
  const headers = await getHeaders();
  const res = await fetch(`${SDK_GATEWAY}/worker/call`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ worker: 'echo-343-scanner', path: `/scans?limit=${limit}`, method: 'GET' }),
  });
  if (!res.ok) throw new Error(`List scans failed: HTTP ${res.status}`);
  return res.json();
}

// ── Engine Knowledge Queries (via SDK Gateway → Engine Runtime) ──

export async function querySecurityKnowledge(query: string, domain = 'CYBER'): Promise<unknown> {
  const headers = await getHeaders();
  const res = await fetch(`${SDK_GATEWAY}/engine/query?q=${encodeURIComponent(query)}&domain=${domain}`, { headers });
  if (!res.ok) throw new Error(`Knowledge query failed: HTTP ${res.status}`);
  return res.json();
}

export async function searchSecurityDocs(query: string, limit = 10): Promise<unknown> {
  const headers = await getHeaders();
  const res = await fetch(`${SDK_GATEWAY}/knowledge/search`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, limit, category: 'security' }),
  });
  if (!res.ok) throw new Error(`Doc search failed: HTTP ${res.status}`);
  return res.json();
}

// ── Brain Memory (via SDK Gateway → Shared Brain) ──

export async function storeScanInBrain(scan: ScanResult): Promise<void> {
  const headers = await getHeaders();
  await fetch(`${SDK_GATEWAY}/brain/ingest`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      content: `SCAN COMPLETE: ${scan.target} — Risk ${scan.risk_score}/10, ${scan.findings_count} findings`,
      importance: 6,
      tags: ['scan', 'scanner', scan.target_type.toLowerCase()],
    }),
  });
}
