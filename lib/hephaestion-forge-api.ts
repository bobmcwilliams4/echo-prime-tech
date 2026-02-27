/**
 * Hephaestion Forge API — AI Program Builder & Code Forge
 *
 * Connects to https://hephaestion-forge.bmcii1976.workers.dev
 * 15 project archetypes, 13-stage pipeline, 6 quality gates,
 * multi-LLM swarm, conversational code generation.
 */

const API_BASE = 'https://hephaestion-forge.bmcii1976.workers.dev';

// ── Types ──

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  pipeline: { stages: number; gates: number };
  projectTypes: number;
  languages: number;
  designPatterns: number;
  graphicsSystem: boolean;
}

export interface ForgeStats {
  archetypes: string[];
  pipeline_stages: number;
  quality_gates: number;
  languages: string[];
  frameworks: string[];
  capabilities: string[];
}

export interface PipelineStage {
  id: number;
  name: string;
  phase: string;
  description: string;
  inputs: string[];
  outputs: string[];
  quality_gate?: string;
}

export interface ProjectPlan {
  archetype: string;
  language: string;
  framework: string;
  stages: string[];
  estimated_files: number;
  estimated_lines: number;
  estimated_time: string;
  dependencies: string[];
  architecture: string;
}

export interface CodeReview {
  file: string;
  language: string;
  issues: { severity: string; line: number; message: string; suggestion: string }[];
  quality_score: number;
  complexity: string;
  recommendations: string[];
}

export interface ConsultMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConsultResponse {
  success: boolean;
  response: string;
  ready_to_build: boolean;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  error?: string;
}

export interface LLMProvider {
  id: string;
  name: string;
  model: string;
  available: boolean;
}

// ── API Fetch with Firebase Auth ──

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { auth } = await import('./firebase');
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Echo-API-Key': process.env.NEXT_PUBLIC_ECHO_API_KEY || 'echo-omega-prime-forge-x-2026',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`Hephaestion Forge API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Endpoints ──

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch('/health');
}

export async function getStats(): Promise<ForgeStats> {
  return apiFetch('/stats');
}

export async function getPipeline(): Promise<{ stages: PipelineStage[] }> {
  return apiFetch('/pipeline');
}

export async function getTemplates(): Promise<{ templates: { id: string; name: string; archetype: string; description: string }[] }> {
  return apiFetch('/templates');
}

export async function getForgeTemplates(): Promise<unknown> {
  return apiFetch('/forge/templates');
}

export async function getLanguages(): Promise<{ languages: string[]; frameworks: Record<string, string[]> }> {
  return apiFetch('/languages');
}

export async function getPatterns(): Promise<unknown> {
  return apiFetch('/patterns');
}

export async function startForge(description: string, archetype?: string, language?: string): Promise<unknown> {
  return apiFetch('/forge/start', {
    method: 'POST',
    body: JSON.stringify({ description, archetype, language }),
  });
}

export async function generateScaffold(description: string, archetype?: string, language?: string): Promise<unknown> {
  return apiFetch('/generate/scaffold', {
    method: 'POST',
    body: JSON.stringify({ description, archetype, language }),
  });
}

export async function generateModule(name: string, description: string, language?: string): Promise<unknown> {
  return apiFetch('/generate/module', {
    method: 'POST',
    body: JSON.stringify({ name, description, language }),
  });
}

export async function reviewCode(code: string, language: string): Promise<CodeReview> {
  return apiFetch('/quality/review', {
    method: 'POST',
    body: JSON.stringify({ code, language }),
  });
}

export async function lintCode(code: string, language: string): Promise<unknown> {
  return apiFetch('/quality/lint', {
    method: 'POST',
    body: JSON.stringify({ code, language }),
  });
}

export async function securityScan(code: string, language: string): Promise<unknown> {
  return apiFetch('/quality/security', {
    method: 'POST',
    body: JSON.stringify({ code, language }),
  });
}

export async function recommendArchitecture(description: string): Promise<unknown> {
  return apiFetch('/architecture/recommend', {
    method: 'POST',
    body: JSON.stringify({ description }),
  });
}

export async function planDeploy(description: string, target?: string): Promise<unknown> {
  return apiFetch('/deploy/plan', {
    method: 'POST',
    body: JSON.stringify({ description, target }),
  });
}

export async function getLLMProviders(): Promise<{ providers: LLMProvider[] }> {
  return apiFetch('/llm/providers');
}

export async function dispatchLLM(prompt: string, provider?: string): Promise<unknown> {
  return apiFetch('/llm/dispatch', {
    method: 'POST',
    body: JSON.stringify({ prompt, provider }),
  });
}

export async function queryEngines(query: string): Promise<unknown> {
  return apiFetch('/engines/query', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

export async function getEngineDomains(): Promise<unknown> {
  return apiFetch('/engines/domains');
}

export async function consult(messages: ConsultMessage[], context?: string): Promise<ConsultResponse> {
  return apiFetch('/consult', {
    method: 'POST',
    body: JSON.stringify({ messages, context }),
  });
}

export async function advanceForge(projectId: string): Promise<unknown> {
  return apiFetch(`/forge/advance/${projectId}`, { method: 'POST' });
}

export async function getForgeProject(projectId: string): Promise<unknown> {
  return apiFetch(`/forge/project/${projectId}`);
}

export async function exportForge(projectId: string): Promise<unknown> {
  return apiFetch(`/forge/export/${projectId}`);
}
