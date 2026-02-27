// ═══════════════════════════════════════════════════════════════
// ECHO PRIME — Agentic Engine API Client
// Connects to echo-agentic-engine Cloudflare Worker
// ═══════════════════════════════════════════════════════════════

const AGENTIC_BASE = 'https://echo-agentic-engine.bmcii1976.workers.dev';

// ─── Types ───────────────────────────────────────────────────

export interface ClassificationResult {
  complex: boolean;
  reason: string;
  suggested_engines: string[];
  recommended_mode: 'direct' | 'agentic';
  estimated_steps: number;
}

export interface AgenticSession {
  id: string;
  query: string;
  domains: string[];
  status: 'planning' | 'executing' | 'validating' | 'assembling' | 'complete' | 'failed' | 'cancelled';
  plan: ExecutionPlan | null;
  steps: AgenticStep[];
  document_key: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
  elapsed_ms: number;
}

export interface ExecutionPlan {
  goal: string;
  complexity: string;
  estimated_steps: number;
  strategy: string;
  steps: PlannedStep[];
}

export interface PlannedStep {
  id: number;
  name: string;
  type: string;
  tool: string;
  description: string;
  depends_on: number[];
  expected_output: string;
  timeout_ms: number;
}

export interface AgenticStep {
  id: number;
  name: string;
  type: 'search' | 'analyze' | 'validate' | 'assemble' | 'enrich' | 'calculate';
  status: 'pending' | 'running' | 'complete' | 'failed' | 'skipped';
  tool: string;
  duration_ms: number;
  error: string | null;
}

export interface SSECallbacks {
  onPlan?: (plan: ExecutionPlan) => void;
  onStepStart?: (step: { step_id: number; name: string; type: string; tool: string }) => void;
  onStepComplete?: (step: { step_id: number; name: string; duration_ms: number; summary: string }) => void;
  onStepFailed?: (step: { step_id: number; name: string; error: string }) => void;
  onValidation?: (validation: unknown) => void;
  onDocumentReady?: (data: { session_id: string; document_key: string; size_bytes: number }) => void;
  onError?: (error: string) => void;
  onDone?: (data: { session_id: string; status: string }) => void;
}

// ─── Classify Query ──────────────────────────────────────────

export async function classifyQuery(
  query: string,
  domains: string[] = [],
): Promise<ClassificationResult> {
  const resp = await fetch(`${AGENTIC_BASE}/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, domains }),
  });

  if (!resp.ok) {
    throw new Error(`Classification failed: ${resp.status}`);
  }

  return resp.json();
}

// ─── Start Agentic Session ───────────────────────────────────

export async function startSession(
  query: string,
  domains: string[] = [],
  options: { stream?: boolean } = {},
): Promise<{ session_id: string; status: string }> {
  const resp = await fetch(`${AGENTIC_BASE}/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, domains, options }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to start session: ${text}`);
  }

  return resp.json();
}

// ─── Start Streaming Session ─────────────────────────────────

export function startStreamingSession(
  query: string,
  domains: string[],
  callbacks: SSECallbacks,
): { sessionPromise: Promise<string>; abort: () => void } {
  const controller = new AbortController();

  const sessionPromise = (async () => {
    const resp = await fetch(`${AGENTIC_BASE}/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, domains, options: { stream: true } }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Stream failed: ${text}`);
    }

    const reader = resp.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';
    let sessionId = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let eventType = '';
      let eventData = '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          eventData = line.slice(6).trim();
          if (eventType && eventData) {
            try {
              const data = JSON.parse(eventData);
              processSSEEvent(eventType, data, callbacks);
              if (data.session_id) sessionId = data.session_id;
            } catch {
              // Skip malformed JSON
            }
          }
          eventType = '';
          eventData = '';
        }
      }
    }

    return sessionId;
  })();

  return {
    sessionPromise,
    abort: () => controller.abort(),
  };
}

function processSSEEvent(type: string, data: Record<string, unknown>, callbacks: SSECallbacks): void {
  switch (type) {
    case 'plan':
      callbacks.onPlan?.(data.plan as ExecutionPlan);
      break;
    case 'step_start':
      callbacks.onStepStart?.(data as { step_id: number; name: string; type: string; tool: string });
      break;
    case 'step_complete':
      callbacks.onStepComplete?.(data as { step_id: number; name: string; duration_ms: number; summary: string });
      break;
    case 'step_failed':
      callbacks.onStepFailed?.(data as { step_id: number; name: string; error: string });
      break;
    case 'validation':
      callbacks.onValidation?.(data.validation);
      break;
    case 'document_ready':
      callbacks.onDocumentReady?.(data as { session_id: string; document_key: string; size_bytes: number });
      break;
    case 'error':
      callbacks.onError?.(String(data.error || 'Unknown error'));
      break;
    case 'done':
      callbacks.onDone?.(data as { session_id: string; status: string });
      break;
  }
}

// ─── Get Session ─────────────────────────────────────────────

export async function getSession(sessionId: string): Promise<AgenticSession> {
  const resp = await fetch(`${AGENTIC_BASE}/session/${sessionId}`);
  if (!resp.ok) {
    throw new Error(`Session not found: ${resp.status}`);
  }
  return resp.json();
}

// ─── Get Document ────────────────────────────────────────────

export async function getDocument(sessionId: string): Promise<string> {
  const resp = await fetch(`${AGENTIC_BASE}/session/${sessionId}/document`);
  if (!resp.ok) {
    throw new Error(`Document not ready: ${resp.status}`);
  }
  return resp.text();
}

// ─── Cancel Session ──────────────────────────────────────────

export async function cancelSession(sessionId: string): Promise<void> {
  await fetch(`${AGENTIC_BASE}/session/${sessionId}/cancel`, { method: 'POST' });
}

// ─── Poll Session (fallback for non-SSE) ─────────────────────

export function pollSession(
  sessionId: string,
  onUpdate: (session: AgenticSession) => void,
  intervalMs: number = 2000,
): { stop: () => void } {
  let running = true;

  const poll = async () => {
    while (running) {
      try {
        const session = await getSession(sessionId);
        onUpdate(session);
        if (['complete', 'failed', 'cancelled'].includes(session.status)) {
          running = false;
          break;
        }
      } catch {
        // Retry on next interval
      }
      await new Promise(r => setTimeout(r, intervalMs));
    }
  };

  poll();

  return { stop: () => { running = false; } };
}
