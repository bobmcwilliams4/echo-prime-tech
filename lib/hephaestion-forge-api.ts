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
  forge: string;
  version: string;
  archetypes: number;
  pipeline_stages: number;
  quality_gates: number;
  languages: number;
}

export interface ForgeStats {
  archetypes: string[];
  pipeline_stages: number;
  quality_gates: number;
  languages: string[];
  frameworks: string[];
  capabilities: string[];
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
  stack: string[];
  default_language: string;
  stages: string[];
  estimated_time: string;
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

export interface BuildResult {
  project_id: string;
  archetype: string;
  language: string;
  files_generated: number;
  lines_of_code: number;
  test_coverage: number;
  quality_score: number;
  stages_completed: number;
  artifacts: { name: string; type: string; size: number }[];
  warnings: string[];
}

export interface QualityGateResult {
  gate: string;
  passed: boolean;
  score: number;
  checks: { name: string; status: string; detail: string }[];
  blockers: string[];
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

// ── API Fetch with Firebase Auth ──

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { auth } = await import('./firebase');
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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

export async function getArchetypes(): Promise<{ archetypes: Archetype[] }> {
  return apiFetch('/archetypes');
}

export async function getPipeline(): Promise<{ stages: PipelineStage[] }> {
  return apiFetch('/pipeline');
}

export async function planProject(description: string, archetype?: string, language?: string): Promise<ProjectPlan> {
  return apiFetch('/plan', {
    method: 'POST',
    body: JSON.stringify({ description, archetype, language }),
  });
}

export async function buildProject(plan: ProjectPlan): Promise<BuildResult> {
  return apiFetch('/build', {
    method: 'POST',
    body: JSON.stringify(plan),
  });
}

export async function reviewCode(code: string, language: string): Promise<CodeReview> {
  return apiFetch('/review', {
    method: 'POST',
    body: JSON.stringify({ code, language }),
  });
}

export async function getQualityGates(): Promise<{ gates: QualityGateResult[] }> {
  return apiFetch('/quality/gates');
}

export async function getTemplates(): Promise<{ templates: { id: string; name: string; archetype: string; description: string }[] }> {
  return apiFetch('/templates');
}

export async function getLanguages(): Promise<{ languages: string[]; frameworks: Record<string, string[]> }> {
  return apiFetch('/languages');
}

export async function consult(messages: ConsultMessage[], context?: string): Promise<ConsultResponse> {
  return apiFetch('/consult', {
    method: 'POST',
    body: JSON.stringify({ messages, context }),
  });
}
