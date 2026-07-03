/**
 * Sentinel Brain API v2.0 — Ultra-Fast Claude Opus 4.6 CLI Bridge
 *
 * Dual-endpoint with automatic failover:
 *   PRIMARY:  https://sentinel-brain.echo-op.com (gateway v2.0, port 8465)
 *   FALLBACK: https://agentic.echo-op.com (bridge v2.0, port 8398)
 *
 * Uses submit-poll pattern to avoid Cloudflare Tunnel's 100s timeout:
 *   1. POST /analyze → returns call_id immediately
 *   2. GET /result/{call_id} → poll until complete
 *
 * Speed optimizations v2.0:
 *   - 1.5s poll interval (down from 2s)
 *   - Parallel health checks for endpoint selection
 *   - Automatic failover on submit failure
 *   - Compact system prompt injection
 */

// Updated 2026-04-29 cc2-hammer: dead Claude-Opus bridge replaced by
// FORGE-Raistlin proxy. Routes through existing SDK-gate trycloudflare tunnel
// (no separate cloudflared mapping needed). Named tunnel at sentinel-brain.echo-op.com
// kept as fallback — points at legacy bridge that's currently down but may revive.
const BRAIN_URLS = [
  'https://sdk1.echo-op.com/sentinel/brain',  // primary: FORGE/Raistlin via SDK gate (durable named tunnel, $0)
  'https://sdk2.echo-op.com/sentinel/brain',  // same gate, second hostname
  'https://sentinel-brain.echo-op.com',       // fallback: legacy Claude Opus bridge (may be dead)
  'https://agentic.echo-op.com',              // 2nd fallback: agentic bridge
];

const POLL_INTERVAL_MS = 1500;  // 1.5s — faster polling
const MAX_POLL_ATTEMPTS = 80;   // 2 minutes max

let _activeBrainUrl: string | null = null;
let _lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 60000; // re-check every 60s

export interface SentinelBrainResponse {
  response: string;
  model: string;
  duration_ms: number;
  call_id: string;
  cached?: boolean;
  endpoint: string;
}

/**
 * Determine which brain endpoint to use.
 * Caches the result for 60s to avoid latency on every call.
 */
async function getActiveBrainUrl(): Promise<string> {
  const now = Date.now();
  if (_activeBrainUrl && now - _lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return _activeBrainUrl;
  }

  // Try endpoints in order — first healthy one wins
  for (const url of BRAIN_URLS) {
    try {
      const res = await fetch(`${url}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' || data.status === 'operational') {
          _activeBrainUrl = url;
          _lastHealthCheck = now;
          return url;
        }
      }
    } catch {
      // Try next endpoint
    }
  }

  // Default to bridge (most likely to be accessible)
  _activeBrainUrl = BRAIN_URLS[1];
  _lastHealthCheck = now;
  return _activeBrainUrl;
}

/**
 * Submit a chat request to Claude Opus 4.6 via the bridge.
 * Returns a call_id for polling.
 */
async function submitAnalysis(
  brainUrl: string,
  prompt: string,
  systemPrompt: string,
  timeout: number = 120,
): Promise<string> {
  const res = await fetch(`${brainUrl}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      system_prompt: systemPrompt,
      max_turns: 5,
      timeout,
    }),
  });

  if (!res.ok) throw new Error(`Bridge submit failed: HTTP ${res.status}`);
  const data = await res.json();
  if (!data.call_id) throw new Error('No call_id returned from bridge');
  return data.call_id;
}

/**
 * Poll for the result of a submitted analysis.
 */
async function pollResult(
  brainUrl: string,
  callId: string,
  onProgress?: (status: string) => void,
): Promise<{ output: string; elapsed_ms: number; cached: boolean }> {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    const res = await fetch(`${brainUrl}/result/${callId}`);
    if (!res.ok) throw new Error(`Poll failed: HTTP ${res.status}`);

    const data = await res.json();

    if (data.status === 'complete') {
      return {
        output: data.output || data.html || '',
        elapsed_ms: data.elapsed_ms || 0,
        cached: data.cached || false,
      };
    }
    if (data.status === 'failed') {
      throw new Error(data.error || 'Analysis failed');
    }

    if (onProgress) onProgress(data.status);
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
  }

  throw new Error('Analysis timed out after polling');
}

/**
 * Chat with Sentinel AI via Claude Opus 4.6.
 *
 * Automatic endpoint selection + failover.
 * Submit-poll pattern handles long inference times gracefully.
 */
export async function chatSentinelBrain(
  query: string,
  systemPrompt: string,
  history?: { role: string; content: string }[],
  onProgress?: (status: string) => void,
): Promise<SentinelBrainResponse> {
  // Build prompt with conversation history
  let fullQuery = query;
  if (history && history.length > 0) {
    const historyStr = history
      .slice(-6)  // last 6 messages max
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
    fullQuery = `[CONVERSATION HISTORY]:\n${historyStr}\n\n[CURRENT QUERY]:\n${query}`;
  }

  const startTime = Date.now();
  let brainUrl = await getActiveBrainUrl();
  let callId: string;

  // Try primary endpoint, failover to secondary
  try {
    callId = await submitAnalysis(brainUrl, fullQuery, systemPrompt, 120);
  } catch {
    // Primary failed — try fallback
    brainUrl = BRAIN_URLS[1];
    callId = await submitAnalysis(brainUrl, fullQuery, systemPrompt, 120);
  }

  if (onProgress) onProgress('processing');

  const result = await pollResult(brainUrl, callId, onProgress);

  // Clean up the result on the server (fire-and-forget)
  fetch(`${brainUrl}/result/${callId}`, { method: 'DELETE' }).catch(() => {});

  return {
    response: result.output,
    model: 'claude-opus-4-6',
    duration_ms: result.elapsed_ms || (Date.now() - startTime),
    call_id: callId,
    cached: result.cached,
    endpoint: brainUrl,
  };
}

/**
 * Check if the Sentinel Brain is online (any endpoint).
 */
export async function checkBrainHealth(): Promise<boolean> {
  for (const url of BRAIN_URLS) {
    try {
      const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.status === 'ok' || data.status === 'operational') return true;
    } catch {
      continue;
    }
  }
  return false;
}
