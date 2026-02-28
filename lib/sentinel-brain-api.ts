/**
 * Sentinel Brain API — Claude Opus 4.6 CLI Bridge
 *
 * Connects to the Echo Claude Bridge via Cloudflare Tunnel:
 *   https://agentic.echo-op.com (port 8398 on ALPHA)
 *
 * Uses submit-poll pattern to avoid Cloudflare Tunnel's 100s timeout:
 *   1. POST /analyze → returns call_id immediately
 *   2. GET /result/{call_id} → poll until complete
 *
 * This replaces the Azure GPT-4.1 chatEngine() for Echo Prime mode,
 * routing Sentinel AI through Claude Opus 4.6 with real drive access.
 */

const BRAIN_URL = 'https://agentic.echo-op.com';
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 90; // 3 minutes max

export interface SentinelBrainResponse {
  response: string;
  model: string;
  duration_ms: number;
  call_id: string;
}

/**
 * Submit a chat request to Claude Opus 4.6 via the bridge.
 * Returns a call_id for polling.
 */
async function submitAnalysis(
  prompt: string,
  systemPrompt: string,
  maxTurns: number = 1,
  timeout: number = 120,
): Promise<string> {
  const fullPrompt = systemPrompt
    ? `[SYSTEM PROMPT]:\n${systemPrompt}\n\n[USER QUERY]:\n${prompt}`
    : prompt;

  const res = await fetch(`${BRAIN_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: fullPrompt,
      system_prompt: '',
      max_turns: maxTurns,
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
 * Returns the response text when complete.
 */
async function pollResult(
  callId: string,
  onProgress?: (status: string) => void,
): Promise<{ output: string; elapsed_ms: number }> {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    const res = await fetch(`${BRAIN_URL}/result/${callId}`);
    if (!res.ok) throw new Error(`Poll failed: HTTP ${res.status}`);

    const data = await res.json();

    if (data.status === 'complete') {
      return { output: data.output || data.html || '', elapsed_ms: data.elapsed_ms || 0 };
    }
    if (data.status === 'failed') {
      throw new Error(data.error || 'Analysis failed');
    }

    // Still processing — report status and wait
    if (onProgress) onProgress(data.status);
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
  }

  throw new Error('Analysis timed out after polling');
}

/**
 * Chat with Sentinel AI via Claude Opus 4.6.
 *
 * Submit-poll pattern handles long inference times gracefully.
 * The bridge spawns `claude --print --model claude-opus-4-6` as a subprocess.
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
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
    fullQuery = `[CONVERSATION HISTORY]:\n${historyStr}\n\n[CURRENT QUERY]:\n${query}`;
  }

  const startTime = Date.now();
  const callId = await submitAnalysis(fullQuery, systemPrompt, 1, 120);

  if (onProgress) onProgress('processing');

  const result = await pollResult(callId, onProgress);

  // Clean up the result on the server
  fetch(`${BRAIN_URL}/result/${callId}`, { method: 'DELETE' }).catch(() => {});

  return {
    response: result.output,
    model: 'claude-opus-4-6',
    duration_ms: result.elapsed_ms || (Date.now() - startTime),
    call_id: callId,
  };
}

/**
 * Check if the Sentinel Brain bridge is online.
 */
export async function checkBrainHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BRAIN_URL}/health`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
