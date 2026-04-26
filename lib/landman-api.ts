import { getApiBase, getWsBase } from './api-base';
/**
 * Landman Pipeline API Client
 * Connects echo-ept.com/sentinel to echo-landman-pipeline Worker
 * Investigation engine: Title Graph, Clue Loop, Budget Governor, 4 No-Gaps Gates
 */

const LANDMAN_API = getApiBase('echo-landman-pipeline');

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
  professional_report?: string;
  visual_chain_html?: string;
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
      max_clue_iterations: input.max_clue_iterations ?? 15,
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

// ── Async Job System ──

export type AsyncJobStatus = 'queued' | 'running' | 'complete' | 'failed' | 'cancelled';
export type StepStatus = 'pending' | 'running' | 'complete' | 'failed' | 'skipped';

export interface AsyncJobStep {
  name: string;
  label: string;
  status: StepStatus;
  started_at?: string;
  completed_at?: string;
  detail?: string;
  records_delta?: number;
}

export interface AsyncJobProgress {
  job_id: string;
  status: AsyncJobStatus;
  progress_pct: number;
  current_step: string;
  current_step_label: string;
  steps: AsyncJobStep[];
  records_found: number;
  gaps_found: number;
  elapsed_ms: number;
  result?: PipelineResult;
  error?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface AsyncJobSummary {
  job_id: string;
  tract_id: string;
  county: string;
  status: AsyncJobStatus;
  progress_pct: number;
  current_step: string;
  records_found: number;
  gaps_found: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TrainingExampleSummary {
  tract_id: string;
  quality: number;
  records: number;
  status: string;
}

export interface TrainingBatchResult {
  generated: number;
  failed: number;
  skipped: number;
  total_records: number;
  avg_quality: number;
  examples: TrainingExampleSummary[];
}

export interface TrainingStats {
  total_examples: number;
  avg_quality: number;
  quality_distribution: { label: string; min: number; max: number; count: number }[];
  by_county: { county: string; count: number; avg_quality: number }[];
  recent: { tract_id: string; county: string; quality_score: number; records_used: number; created_at: string }[];
}

// ── Async Job API Functions ──

/** Start an async chain-of-title investigation (returns immediately with job_id) */
export async function startAsyncInvestigation(input: TractInput): Promise<{
  job_id: string;
  status: 'queued';
  poll_url: string;
  message: string;
}> {
  return apiFetch('/chain-of-title/async', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      budget: input.budget ?? 200,
      max_clue_iterations: input.max_clue_iterations ?? 15,
    }),
  });
}

/** Poll async job progress (call every 2-3 seconds while status is queued/running) */
export async function getJobProgress(jobId: string): Promise<AsyncJobProgress> {
  return apiFetch<AsyncJobProgress>(`/jobs/${encodeURIComponent(jobId)}/progress`);
}

/** Cancel a running async job */
export async function cancelJob(jobId: string): Promise<{ ok: boolean; job_id: string; status: string }> {
  return apiFetch(`/jobs/${encodeURIComponent(jobId)}/cancel`, { method: 'POST' });
}

/** List async jobs with optional status filter */
export async function listAsyncJobs(
  status?: AsyncJobStatus,
  limit?: number,
): Promise<{ jobs: AsyncJobSummary[]; count: number }> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (limit) params.set('limit', String(limit));
  return apiFetch(`/async-jobs?${params.toString()}`);
}

// ── Training Data API Functions ──

/** Generate training examples from real deed records (auth required) */
export async function generateTraining(input: {
  county: string;
  state?: string;
  max_examples?: number;
  min_records?: number;
}): Promise<TrainingBatchResult> {
  return apiFetch<TrainingBatchResult>('/training/generate', {
    method: 'POST',
    body: JSON.stringify({
      county: input.county,
      state: input.state ?? 'TX',
      max_examples: input.max_examples ?? 50,
      min_records: input.min_records ?? 3,
    }),
  });
}

/** Export training examples as JSONL (OpenAI fine-tuning format) or JSON array */
export async function exportTraining(opts?: {
  format?: 'jsonl' | 'json';
  min_quality?: number;
  county?: string;
}): Promise<string | Array<{ messages: Array<{ role: string; content: string }> }>> {
  const params = new URLSearchParams();
  if (opts?.format) params.set('format', opts.format);
  if (opts?.min_quality) params.set('min_quality', String(opts.min_quality));
  if (opts?.county) params.set('county', opts.county);
  const url = `${LANDMAN_API}/training/export?${params.toString()}`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`Landman API ${res.status}: ${text}`);
  }
  if (opts?.format === 'jsonl') return res.text();
  return res.json();
}

/** Get training data statistics (quality distribution, county breakdown) */
export async function getTrainingStats(): Promise<TrainingStats> {
  return apiFetch<TrainingStats>('/training/stats');
}

// ── TitleHound AI Analysis ──

export interface TitleHoundGap {
  gate: string;
  severity: string;
  type: string;
  seq_ref: number;
  description: string;
  resolution: string;
}

export interface TitleHoundAction {
  priority: number;
  action: string;
  estimated_cost: string;
  expected_result: string;
}

export interface TitleHoundGateStatus {
  overall: string;
  gates: Record<string, { status: string; issues: number }>;
}

export interface TitleHoundAnalysis {
  run_sheet?: {
    property: string;
    county: string;
    effective_date: string;
    chain: Array<{
      seq: number;
      date: string;
      instrument: string;
      grantor: string;
      grantee: string;
      interest: string;
      fraction: string;
      recording: string;
      notes?: string;
    }>;
  };
  gaps?: TitleHoundGap[];
  next_search_actions?: TitleHoundAction[];
  open_recommendations?: string[];
  gate_status?: TitleHoundGateStatus;
}

export interface TitleHoundResult {
  ok: boolean;
  model: string;
  tract_id: string | null;
  analysis: TitleHoundAnalysis | string;
  raw?: string;
  error?: string;
}

export interface TitleHoundStatus {
  titlehound: {
    available: boolean;
    bravo_model: string;
    ai_orchestrator: string;
    active_backend: string;
  };
}

/** Run TitleHound AI analysis on a chain of title */
export async function analyzeTitleHound(input: {
  tract_id?: string;
  county?: string;
  section?: string;
  block?: string;
  abstract?: string;
  run_sheet?: RunSheetRow[];
  gaps?: GapEntry[];
  records?: Record<string, unknown>[];
}): Promise<TitleHoundResult> {
  return apiFetch<TitleHoundResult>('/titlehound/analyze', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Check TitleHound availability */
export async function getTitleHoundStatus(): Promise<TitleHoundStatus> {
  return apiFetch<TitleHoundStatus>('/titlehound/status');
}

// ── Regional Database Search (Permian Basin, East Texas, Central Texas) ──

export interface RegionalSearchParams {
  query?: string;
  county?: string;
  grantor?: string;
  grantee?: string;
  doc_type?: string;
  year_from?: number;
  year_to?: number;
  region?: 'permian' | 'east_texas' | 'central_texas';
  limit?: number;
  offset?: number;
}

export interface RegionalDocument {
  doc_id: string;
  county: string;
  region: string;
  doc_type: string;
  instrument_number?: string;
  book?: string;
  page?: string;
  filing_date?: string;
  recording_date?: string;
  grantor?: string;
  grantee?: string;
  legal_description?: string;
  consideration?: string;
  volume?: string;
  source?: string;
  parties?: { name: string; role: string }[];
  legals?: { section: string; block: string; survey: string; abstract: string; description: string }[];
}

export interface RegionalCounty {
  county: string;
  region: string;
  total_documents: number;
  total_parties: number;
  total_legals: number;
  doc_types: Record<string, number>;
}

export interface RegionalStats {
  total_documents: number;
  total_parties: number;
  total_legals: number;
  regions: {
    region: string;
    database: string;
    counties: number;
    documents: number;
    parties: number;
    legals: number;
  }[];
  counties: { county: string; region: string; documents: number }[];
}

export interface PartySearchParams {
  name: string;
  role?: 'grantor' | 'grantee';
  county?: string;
  region?: 'permian' | 'east_texas' | 'central_texas';
  limit?: number;
  offset?: number;
}

export interface RegionalSearchResult {
  total: number;
  documents: RegionalDocument[];
  query: RegionalSearchParams;
}

export interface PartySearchResult {
  total: number;
  results: {
    doc_id: string;
    county: string;
    region: string;
    party_name: string;
    party_role: string;
    doc_type: string;
    filing_date?: string;
    grantor?: string;
    grantee?: string;
  }[];
}

/** Search regional deed records across all 3 D1 databases (~2M+ docs) */
export async function searchRegionalRecords(params: RegionalSearchParams): Promise<RegionalSearchResult> {
  return apiFetch<RegionalSearchResult>('/regional/search', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/** Get a specific document by ID from any regional database */
export async function getRegionalDocument(docId: string): Promise<RegionalDocument> {
  return apiFetch<RegionalDocument>(`/regional/document/${encodeURIComponent(docId)}`);
}

/** Get county list with stats across all regions */
export async function getRegionalCounties(): Promise<RegionalCounty[]> {
  const res = await apiFetch<{ counties: RegionalCounty[] }>('/regional/counties');
  return res.counties;
}

/** Search by grantor/grantee name across all regional databases */
export async function searchRegionalParties(params: PartySearchParams): Promise<PartySearchResult> {
  return apiFetch<PartySearchResult>('/regional/party-search', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/** Get aggregate stats for all regional databases */
export async function getRegionalStats(): Promise<RegionalStats> {
  return apiFetch<RegionalStats>('/regional/stats');
}
