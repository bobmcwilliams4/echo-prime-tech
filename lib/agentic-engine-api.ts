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

export interface PropertyIntake {
  state?: string;
  county?: string;
  section?: string;
  block?: string;
  lots?: string;
  survey?: string;
}

export function startStreamingSession(
  query: string,
  domains: string[],
  callbacks: SSECallbacks,
  intake?: { known_owners?: string[]; notes?: string; property?: PropertyIntake },
): { sessionPromise: Promise<string>; abort: () => void } {
  let aborted = false;
  let pollStopper: { stop: () => void } | null = null;

  const sessionPromise = (async () => {
    // Step 1: POST to /orchestrate — returns 202 JSON with session_id
    const body: Record<string, unknown> = { query, domains, options: { stream: true } };
    if (intake?.known_owners?.length) body.known_owners = intake.known_owners;
    if (intake?.notes) body.notes = intake.notes;
    if (intake?.property) body.property = intake.property;

    const resp = await fetch(`${AGENTIC_BASE}/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Orchestrate failed: ${text}`);
    }

    const result = await resp.json() as { session_id: string; status: string };
    const sessionId = result.session_id;
    if (!sessionId) throw new Error('No session_id returned');
    if (aborted) return sessionId;

    // Step 2: Poll /session/:id every 2.5s, map state changes to callbacks
    let prevStatus = '';
    let prevStepStates: Record<number, string> = {};
    let planFired = false;
    let documentFired = false;

    await new Promise<void>((resolve) => {
      pollStopper = pollSession(sessionId, (session) => {
        if (aborted) { pollStopper?.stop(); resolve(); return; }

        // Fire onPlan once when plan becomes available
        if (!planFired && session.plan && session.steps?.length > 0) {
          planFired = true;
          callbacks.onPlan?.(session.plan);
        }

        // Track step status changes
        if (session.steps) {
          for (const step of session.steps) {
            const prev = prevStepStates[step.id];
            if (prev !== step.status) {
              if (step.status === 'running') {
                callbacks.onStepStart?.({ step_id: step.id, name: step.name, type: step.type, tool: step.tool });
              } else if (step.status === 'complete') {
                callbacks.onStepComplete?.({ step_id: step.id, name: step.name, duration_ms: step.duration_ms, summary: '' });
              } else if (step.status === 'failed') {
                callbacks.onStepFailed?.({ step_id: step.id, name: step.name, error: step.error || 'Unknown' });
              }
              prevStepStates[step.id] = step.status;
            }
          }
        }

        // Fire status-change callbacks
        if (session.status !== prevStatus) {
          if (session.status === 'validating') callbacks.onValidation?.(null);
          if (session.status === 'complete' && session.document_key && !documentFired) {
            documentFired = true;
            callbacks.onDocumentReady?.({ session_id: sessionId, document_key: session.document_key, size_bytes: 0 });
          }
          if (session.status === 'failed' && session.error) {
            callbacks.onError?.(session.error);
          }
          prevStatus = session.status;
        }

        // Terminal states
        if (['complete', 'failed', 'cancelled'].includes(session.status)) {
          callbacks.onDone?.({ session_id: sessionId, status: session.status });
          resolve();
        }
      }, 2500);
    });

    return sessionId;
  })();

  return {
    sessionPromise,
    abort: () => {
      aborted = true;
      pollStopper?.stop();
    },
  };
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
