/**
 * Daedalus Forge API — AI Manufacturing Intelligence Platform
 *
 * Connects to https://daedalus-forge.bmcii1976.workers.dev
 * 50-stage manufacturing pipeline, 15 guilds × 80 agents,
 * 8 engineering domains, Trinity Council (SAGE/NYX/THORNE).
 */

const API_BASE = 'https://daedalus-forge.bmcii1976.workers.dev';

// ── Types ──

export interface HealthResponse {
  status: string;
  forge: string;
  version: string;
  guilds: number;
  agents: number;
  domains: number;
  stages: number;
  council: string[];
}

export interface ForgeStats {
  guilds: number;
  agents: number;
  domains: string[];
  stages: number;
  council: string[];
  capabilities: string[];
}

export interface Guild {
  name: string;
  agents: number;
  domain: string;
  specialization: string;
  capabilities: string[];
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  guilds: string[];
  standards: string[];
}

export interface ManufacturingStage {
  id: number;
  name: string;
  phase: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

export interface AnalysisResult {
  project: string;
  domain: string;
  feasibility: number;
  risk_score: number;
  estimated_stages: number;
  recommendations: string[];
  materials_suggested: string[];
  standards_applicable: string[];
  timeline_estimate: string;
}

export interface QualityReport {
  project: string;
  stage: string;
  pass: boolean;
  score: number;
  checks: { name: string; status: string; detail: string }[];
  non_conformances: string[];
}

export interface CouncilVerdict {
  project: string;
  sage: { recommendation: string; confidence: number };
  nyx: { recommendation: string; confidence: number };
  thorne: { recommendation: string; confidence: number };
  consensus: string;
  final_verdict: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  domain: string;
  stages: number;
  description: string;
  default_materials: string[];
}

export interface ConsultMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConsultResponse {
  success: boolean;
  response: string;
  ready_to_forge: boolean;
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
  if (!res.ok) throw new Error(`Daedalus Forge API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Endpoints ──

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch('/health');
}

export async function getStats(): Promise<ForgeStats> {
  return apiFetch('/stats');
}

export async function getGuilds(): Promise<{ guilds: Guild[] }> {
  return apiFetch('/guilds');
}

export async function getDomains(): Promise<{ domains: Domain[] }> {
  return apiFetch('/domains');
}

export async function getStages(): Promise<{ stages: ManufacturingStage[] }> {
  return apiFetch('/pipeline/stages');
}

export async function getTemplates(): Promise<{ templates: ProjectTemplate[] }> {
  return apiFetch('/templates');
}

export async function analyzeProject(description: string, domain: string, requirements?: Record<string, unknown>): Promise<AnalysisResult> {
  return apiFetch('/analyze', {
    method: 'POST',
    body: JSON.stringify({ description, domain, requirements }),
  });
}

export async function runQualityCheck(project: string, stage: string, data: Record<string, unknown>): Promise<QualityReport> {
  return apiFetch('/quality/check', {
    method: 'POST',
    body: JSON.stringify({ project, stage, data }),
  });
}

export async function getCouncilVerdict(project: string, context: string): Promise<CouncilVerdict> {
  return apiFetch('/council/review', {
    method: 'POST',
    body: JSON.stringify({ project, context }),
  });
}

export async function getMaterialStandards(material: string): Promise<{ material: string; standards: string[]; properties: Record<string, unknown> }> {
  return apiFetch(`/materials/standards/${encodeURIComponent(material)}`);
}

export async function getStandards(domain?: string): Promise<{ standards: { id: string; name: string; domain: string; description: string }[] }> {
  const query = domain ? `?domain=${encodeURIComponent(domain)}` : '';
  return apiFetch(`/standards${query}`);
}

export async function consult(messages: ConsultMessage[], context?: string): Promise<ConsultResponse> {
  return apiFetch('/consult', {
    method: 'POST',
    body: JSON.stringify({ messages, context }),
  });
}
