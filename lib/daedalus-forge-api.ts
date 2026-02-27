/**
 * Daedalus Forge API — AI Manufacturing Intelligence Platform
 *
 * Connects to https://daedalus-forge.bmcii1976.workers.dev
 * 50-stage manufacturing pipeline, 15 guilds × 1200 agents,
 * 8 engineering domains, Trinity Council (SAGE/NYX/THORNE).
 */

const API_BASE = 'https://daedalus-forge.bmcii1976.workers.dev';

// ── Types ──

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  pipeline_stages: number;
  guilds: number;
  agents: number;
  domains: number;
  materials: number;
  cnc_machines: number;
}

export interface ForgeStats {
  guilds: number;
  agents: number;
  domains: string[];
  stages: number;
  capabilities: string[];
}

export interface Guild {
  name: string;
  agents: number;
}

export interface Domain {
  name: string;
  standards: string[];
  certifications: string[];
  codes: string[];
}

export interface ManufacturingStage {
  id: number;
  name: string;
  phase: string;
  description: string;
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
    'X-Echo-API-Key': process.env.NEXT_PUBLIC_ECHO_API_KEY || 'echo-omega-prime-forge-x-2026',
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

export async function getGuilds(): Promise<{ guilds: Guild[]; total: number; total_agents: number }> {
  return apiFetch('/guilds');
}

export async function getDomains(): Promise<{ success: boolean; domains: Record<string, Domain> }> {
  return apiFetch('/domains');
}

export async function getPipeline(): Promise<{ success: boolean; stages: ManufacturingStage[]; total: number }> {
  return apiFetch('/pipeline');
}

export async function getTemplates(): Promise<{ templates: ProjectTemplate[] }> {
  return apiFetch('/forge/templates');
}

export async function getMaterials(): Promise<{ success: boolean; materials: { id: string; name: string; grade: string; yield_mpa: number; nace: boolean; cost_usd_kg: number }[] }> {
  return apiFetch('/materials');
}

export async function getStandards(domain?: string): Promise<{ success: boolean; domains: Record<string, Domain>; total_standards: number }> {
  return apiFetch('/standards');
}

export async function selectMaterial(requirements: Record<string, unknown>): Promise<unknown> {
  return apiFetch('/materials/select', {
    method: 'POST',
    body: JSON.stringify(requirements),
  });
}

export async function startForge(description: string, domain: string, requirements?: Record<string, unknown>): Promise<unknown> {
  return apiFetch('/forge/start', {
    method: 'POST',
    body: JSON.stringify({ description, domain, requirements }),
  });
}

export async function runQualityFMEA(component: string, domain: string, material?: string): Promise<QualityReport> {
  return apiFetch('/quality/fmea', {
    method: 'POST',
    body: JSON.stringify({ component, domain, material }),
  });
}

export async function getCouncilVerdict(project: string, context: string): Promise<CouncilVerdict> {
  return apiFetch('/council/deliberate', {
    method: 'POST',
    body: JSON.stringify({ project, context }),
  });
}

export async function queryEngines(query: string, domain?: string): Promise<unknown> {
  return apiFetch('/engines/query', {
    method: 'POST',
    body: JSON.stringify({ query, domain }),
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
