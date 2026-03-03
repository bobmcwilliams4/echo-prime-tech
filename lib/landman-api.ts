/**
 * Landman Pipeline API Client
 * Connects echo-ept.com/sentinel to echo-landman-pipeline Worker
 * Investigation engine: Title Graph, Clue Loop, Budget Governor, 4 No-Gaps Gates
 */

const LANDMAN_API = 'https://echo-landman-pipeline.bmcii1976.workers.dev';

// ── Types ──

export interface TractInput {
  county: string;
  state?: string;
  abstract?: string;
  block?: string;
  section?: string;
  quarter?: string;
  township?: string;
  range?: string;
  lot?: string;
  subdivision?: string;
  party?: string;
  legal_description?: string;
  budget?: number;
  max_clue_iterations?: number;
}

export interface RunSheetRow {
  event_order: number;
  event_date: string;
  doc_type: string;
  from_party: string;
  to_party: string;
  instrument_no: string;
  book_page: string;
  interest_conveyed: string;
  mineral_surface: string;
  notes: string;
  exceptions: string;
  gap_flags: string[];
}

export interface OwnershipEntry {
  party: string;
  interest_type: string;
  fraction: string;
  source_doc: string;
  as_of_date: string;
}

export interface GapEntry {
  party: string;
  gap_type: string;
  description: string;
  suggested_cure: string;
  doc_refs: string[];
}

export interface RequirementEntry {
  type: string;
  severity: string;
  description: string;
  doc_refs: string[];
}

export interface GateResult {
  gate: string;
  passed: boolean;
  message: string;
  severity: 'stop' | 'warn' | 'info';
}

export interface GraphNode {
  id: string;
  type: 'party' | 'document' | 'tract';
  label: string;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: string;
  doc_id?: string;
  date?: string;
  interest?: string;
}

export interface PipelineResult {
  report: string;
  tract_id: string;
  status: string;
  records_found: number;
  run_sheet: RunSheetRow[];
  ownership_table: OwnershipEntry[];
  requirements: RequirementEntry[];
  gaps: GapEntry[];
  evidence_count: number;
  execution_log: string[];
}

export interface GraphResult {
  tract_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: { total_nodes: number; parties: number; documents: number; edges: number };
  gates: GateResult[];
}

export interface BudgetEstimate {
  tract_id: string;
  estimated_index_records: number;
  cost_per_doc: number;
  full_cost: number;
  probable_opens: number;
  probable_cost: number;
  budget: number;
  within_budget: boolean;
  savings_estimate: string;
}

export interface JobSummary {
  tract_id: string;
  county: string;
  status: string;
  records_found: number;
  gaps_found: number;
  gaps_solved: number;
  created_at: string;
  completed_at: string;
}

export interface PipelineStats {
  service: string;
  jobs_by_status: { status: string; count: number }[];
  documents: { total: number; tracts: number };
  run_sheet_events: { total: number };
  requirements_by_status: { status: string; count: number }[];
}

// ── API Functions ──

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${LANDMAN_API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`Landman API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/** Run the full investigation engine — Title Graph, Clue Loop, Budget Governor, 4 No-Gaps Gates */
export async function investigateChainOfTitle(input: TractInput): Promise<PipelineResult> {
  return apiFetch<PipelineResult>('/investigate', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      budget: input.budget ?? 200,
      max_clue_iterations: input.max_clue_iterations ?? 2,
    }),
  });
}

/** Run basic chain-of-title (backward compat, still uses investigation engine internally) */
export async function queryChainOfTitle(input: TractInput): Promise<PipelineResult> {
  return apiFetch<PipelineResult>('/chain-of-title', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Get the Title Graph for a previously investigated tract */
export async function getTitleGraph(input: TractInput): Promise<GraphResult> {
  return apiFetch<GraphResult>('/graph', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Pre-flight budget estimate (no search, just cost projection) */
export async function estimateBudget(input: TractInput): Promise<BudgetEstimate> {
  return apiFetch<BudgetEstimate>('/budget-estimate', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Normalize a tract description (dry run, no search) */
export async function normalizeTract(input: TractInput): Promise<Record<string, string>> {
  return apiFetch<Record<string, string>>('/normalize', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** List recent jobs with optional filters */
export async function listJobs(status?: string, county?: string): Promise<{ jobs: JobSummary[]; count: number }> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (county) params.set('county', county);
  return apiFetch(`/jobs?${params.toString()}`);
}

/** Get full job details including documents, run sheet, and requirements */
export async function getJobDetails(tractId: string): Promise<{
  job: JobSummary;
  documents: Record<string, unknown>[];
  run_sheet: RunSheetRow[];
  requirements: RequirementEntry[];
}> {
  return apiFetch(`/jobs/${encodeURIComponent(tractId)}`);
}

/** Get run sheet for a tract */
export async function getRunSheet(tractId: string): Promise<{ tract_id: string; events: RunSheetRow[]; count: number }> {
  return apiFetch(`/runsheet/${encodeURIComponent(tractId)}`);
}

/** Get pipeline stats */
export async function getPipelineStats(): Promise<PipelineStats> {
  return apiFetch('/stats');
}

/** Health check */
export async function getHealth(): Promise<{
  status: string;
  version: string;
  architecture: string;
  modules: string[];
  gates: { legacy: string[]; no_gaps: string[] };
}> {
  return apiFetch('/health');
}
