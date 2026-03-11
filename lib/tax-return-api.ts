// Echo Tax Return — Frontend API Client v4.0
// Connects to echo-tax-return.bmcii1976.workers.dev
// Covers: core CRUD, v2.0 features, v3.1 advanced, v3.2 advanced, v4.0 tools/filing/audit

const TAX_API = 'https://echo-tax-return.bmcii1976.workers.dev';
const API_KEY = process.env.NEXT_PUBLIC_ECHO_API_KEY || 'echo-omega-prime-forge-x-2026';

function headers(extra?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Echo-API-Key': API_KEY,
    ...extra,
  };
}

async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
  const resp = await fetch(url, opts);
  const data = await resp.json();
  if (!resp.ok) throw new Error((data as any).error || `HTTP ${resp.status}`);
  return data as T;
}

// ─── Core Types ─────────────────────────────────────────────

export interface Client {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  suffix: string | null;
  has_ssn: boolean;
  dob: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  filing_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaxReturn {
  id: string;
  client_id: string;
  tax_year: number;
  status: string;
  total_income: number;
  adjusted_gross_income: number;
  taxable_income: number;
  total_tax: number;
  total_payments: number;
  refund_or_owed: number;
  deduction_method: string | null;
  preparer_ptin: string | null;
  filed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaxDocument {
  id: string;
  return_id: string;
  doc_type: string;
  issuer_name: string | null;
  status: string;
  created_at: string;
}

export interface IncomeItem {
  id: string;
  return_id: string;
  category: string;
  description: string | null;
  amount: number;
  tax_withheld: number;
  form_line: string | null;
}

export interface Deduction {
  id: string;
  return_id: string;
  category: string;
  description: string | null;
  amount: number;
  schedule: string | null;
}

export interface Dependent {
  id: string;
  return_id: string;
  first_name: string | null;
  last_name: string | null;
  relationship: string | null;
  qualifies_ctc: number;
  qualifies_odc: number;
}

export interface Optimization {
  engine_id: string;
  category: string;
  suggestion: string;
  potential_savings: number;
  confidence: number;
  doctrine_source: string;
}

export interface TaxCalculation {
  return_id: string;
  tax_year: number;
  filing_status: string;
  income_summary: Record<string, number>;
  adjustments: Record<string, number>;
  agi: number;
  deductions: { standard: number; itemized: number; method: string; amount: number };
  qbi_deduction: number;
  taxable_income: number;
  tax_bracket_detail: Array<{ rate: number; range_start: number; range_end: number; taxable_in_bracket: number; tax_in_bracket: number }>;
  regular_tax: number;
  credits: Record<string, number>;
  other_taxes: Record<string, number>;
  total_tax: number;
  payments: { withholding: number; estimated: number; total: number };
  refund_or_owed: number;
}

export interface PricingTier {
  tier: string;
  price: number;
  name: string;
  description: string;
  includes: string[];
}

// ─── v3.1 / v3.2 Types ─────────────────────────────────────

export interface KeyNumbers {
  year: number;
  brackets: Record<string, any>;
  standard_deductions: Record<string, number>;
  contribution_limits: Record<string, number>;
  fica: Record<string, number>;
}

export interface Communication {
  id: string;
  client_id: string;
  type: string;
  subject: string;
  body: string;
  created_at: string;
}

export interface SelfEmploymentTax {
  schedule_se: Record<string, number>;
}

export interface SafeHarbor {
  analysis: Record<string, any>;
}

export interface StateTaxEstimate {
  state: string;
  state_tax: number;
  effective_rate: number;
  [key: string]: any;
}

export interface DepreciationResult {
  asset: string;
  schedule: Array<{ year: number; depreciation: number; remaining: number }>;
}

export interface TaxStrategy {
  strategies: Array<{
    rank: number;
    strategy: string;
    category: string;
    potential_savings: number;
    implementation: string;
    confidence: number;
  }>;
}

export interface TrendAnalysis {
  years: Array<{ year: number; income: number; tax: number; effective_rate: number }>;
  projections: Record<string, any>;
}

export interface PrintPackage {
  return_id: string;
  client: Record<string, any>;
  summary: Record<string, any>;
  income_detail: Record<string, any>;
  deduction_detail: Record<string, any>;
  credits: Record<string, any>;
  payments: Record<string, any>;
  forms: string[];
  [key: string]: any;
}

export interface IncomeAnalysis {
  return_id: string;
  diversification: Record<string, any>;
  sources: Array<{ category: string; amount: number; percentage: number }>;
  [key: string]: any;
}

export interface RequiredForm {
  form: string;
  title: string;
  reason: string;
  required: boolean;
}

// ─── v4.0 Types ─────────────────────────────────────────────

export interface WhatIfScenario {
  income_overrides?: Record<string, number>;
  deduction_overrides?: Record<string, number>;
  filing_status?: string;
  [key: string]: any;
}

export interface WhatIfResult {
  original: Record<string, any>;
  scenario: Record<string, any>;
  delta: Record<string, any>;
  [key: string]: any;
}

export interface AuditRisk {
  return_id: string;
  risk_score: number;
  risk_level: string;
  flags: Array<{ category: string; description: string; weight: number }>;
  [key: string]: any;
}

export interface WithholdingEstimate {
  return_id: string;
  recommended_withholding: number;
  current_withholding: number;
  adjustment_needed: number;
  [key: string]: any;
}

export interface ReturnSummary {
  return_id: string;
  client_name: string;
  tax_year: number;
  filing_status: string;
  total_income: number;
  agi: number;
  taxable_income: number;
  total_tax: number;
  refund_or_owed: number;
  [key: string]: any;
}

export interface EstimatedPayment {
  id: string;
  return_id: string;
  quarter: number;
  amount: number;
  due_date: string;
  paid_date: string | null;
  [key: string]: any;
}

export interface Amendment {
  id: string;
  return_id: string;
  reason: string;
  changes: Record<string, any>;
  status: string;
  created_at: string;
  [key: string]: any;
}

export interface TaxCalendarEntry {
  date: string;
  description: string;
  form: string | null;
  applies_to: string[];
  [key: string]: any;
}

export interface TaxTip {
  category: string;
  tip: string;
  potential_savings: number | null;
  [key: string]: any;
}

export interface PenaltyEstimate {
  return_id: string;
  underpayment_penalty: number;
  late_filing_penalty: number;
  late_payment_penalty: number;
  total_penalty: number;
  [key: string]: any;
}

export interface ReturnNote {
  id: string;
  return_id: string;
  content: string;
  author: string | null;
  created_at: string;
  [key: string]: any;
}

export interface EngagementLetter {
  return_id: string;
  letter_html: string;
  [key: string]: any;
}

export interface IncomeProjection {
  return_id: string;
  projected_income: number;
  projected_tax: number;
  [key: string]: any;
}

export interface ReturnHealth {
  return_id: string;
  score: number;
  issues: Array<{ severity: string; message: string; field: string | null }>;
  [key: string]: any;
}

export interface BracketAnalysis {
  return_id: string;
  current_bracket: { rate: number; range_start: number; range_end: number };
  room_in_bracket: number;
  marginal_rate: number;
  effective_rate: number;
  brackets: Array<{ rate: number; range_start: number; range_end: number; taxable_in_bracket: number; tax_in_bracket: number }>;
  [key: string]: any;
}

export interface DocumentChecklist {
  return_id: string;
  items: Array<{ document: string; required: boolean; received: boolean; category: string }>;
  [key: string]: any;
}

export interface ReturnDiff {
  return_a: string;
  return_b: string;
  differences: Array<{ field: string; value_a: any; value_b: any; delta: any }>;
  [key: string]: any;
}

export interface PortalView {
  return_id: string;
  client_name: string;
  summary: Record<string, any>;
  [key: string]: any;
}

export interface DeductionOpportunity {
  category: string;
  description: string;
  estimated_savings: number;
  confidence: number;
  [key: string]: any;
}

export interface ClientSummary {
  client_id: string;
  name: string;
  returns_count: number;
  total_revenue: number;
  years: number[];
  [key: string]: any;
}

export interface TimelineEntry {
  timestamp: string;
  event: string;
  details: string | null;
  [key: string]: any;
}

export interface FilingPackage {
  return_id: string;
  forms: Array<{ form: string; pages: number }>;
  efile_ready: boolean;
  [key: string]: any;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string | null;
  timestamp: string;
  details: Record<string, any>;
  [key: string]: any;
}

export interface PreparerDashboard {
  total_clients: number;
  total_returns: number;
  returns_by_status: Record<string, number>;
  revenue: number;
  pending_items: number;
  [key: string]: any;
}

// ─── Client Endpoints ───────────────────────────────────────

export async function createClient(data: {
  first_name: string; middle_name?: string; last_name: string; suffix?: string; email?: string; ssn?: string;
  dob?: string; phone?: string; filing_status?: string;
  address_street?: string; address_city?: string; address_state?: string; address_zip?: string;
}): Promise<Client> {
  const resp = await fetchJSON<{ client: Client }>(`${TAX_API}/clients`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  });
  return resp.client;
}

export async function getClient(id: string): Promise<Client> {
  const resp = await fetchJSON<{ client: Client }>(`${TAX_API}/clients/${id}`, { headers: headers() });
  return resp.client;
}

// ─── v2.0: List Clients / Returns / Stats ───────────────────

export async function listClients(): Promise<Client[]> {
  const resp = await fetchJSON<{ clients: Client[] }>(`${TAX_API}/clients`, { headers: headers() });
  return resp.clients;
}

export async function listReturns(params?: {
  client_id?: string;
  tax_year?: number;
  status?: string;
}): Promise<TaxReturn[]> {
  const searchParams = new URLSearchParams();
  if (params?.client_id) searchParams.set('client_id', params.client_id);
  if (params?.tax_year) searchParams.set('tax_year', String(params.tax_year));
  if (params?.status) searchParams.set('status', params.status);
  const qs = searchParams.toString();
  const url = qs ? `${TAX_API}/returns?${qs}` : `${TAX_API}/returns`;
  const resp = await fetchJSON<{ returns: TaxReturn[] }>(url, { headers: headers() });
  return resp.returns;
}

export async function getStats(): Promise<any> {
  const resp = await fetchJSON<{ stats: any }>(`${TAX_API}/stats`, { headers: headers() });
  return resp.stats;
}

// ─── Return Endpoints ───────────────────────────────────────

export async function createReturn(clientId: string, taxYear: number): Promise<TaxReturn> {
  const resp = await fetchJSON<{ return: TaxReturn }>(`${TAX_API}/returns`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ client_id: clientId, tax_year: taxYear }),
  });
  return resp.return;
}

export async function getReturn(id: string): Promise<{
  return: TaxReturn;
  income_items: IncomeItem[];
  deductions: Deduction[];
  dependents: Dependent[];
  documents: TaxDocument[];
  optimizations: Optimization[];
}> {
  return fetchJSON(`${TAX_API}/returns/${id}`, { headers: headers() });
}

export async function updateReturnStatus(id: string, status: string): Promise<TaxReturn> {
  const resp = await fetchJSON<{ return: TaxReturn }>(`${TAX_API}/returns/${id}/status`, {
    method: 'PUT', headers: headers(), body: JSON.stringify({ status }),
  });
  return resp.return;
}

// ─── Income / Deduction / Dependent ─────────────────────────

export async function addIncome(returnId: string, data: { category: string; description?: string; amount: number; tax_withheld?: number }): Promise<IncomeItem> {
  const resp = await fetchJSON<{ income_item: IncomeItem }>(`${TAX_API}/returns/${returnId}/income`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  });
  return resp.income_item;
}

export async function deleteIncome(returnId: string, id: string): Promise<void> {
  await fetchJSON(`${TAX_API}/returns/${returnId}/income/${id}`, { method: 'DELETE', headers: headers() });
}

export async function addDeduction(returnId: string, data: { category: string; description?: string; amount: number; schedule?: string }): Promise<Deduction> {
  const resp = await fetchJSON<{ deduction: Deduction }>(`${TAX_API}/returns/${returnId}/deductions`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  });
  return resp.deduction;
}

export async function deleteDeduction(returnId: string, id: string): Promise<void> {
  await fetchJSON(`${TAX_API}/returns/${returnId}/deductions/${id}`, { method: 'DELETE', headers: headers() });
}

export async function addDependent(returnId: string, data: { first_name: string; last_name: string; dob?: string; relationship?: string; qualifies_ctc?: boolean; qualifies_odc?: boolean }): Promise<Dependent> {
  const resp = await fetchJSON<{ dependent: Dependent }>(`${TAX_API}/returns/${returnId}/dependents`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  });
  return resp.dependent;
}

export async function deleteDependent(returnId: string, id: string): Promise<void> {
  await fetchJSON(`${TAX_API}/returns/${returnId}/dependents/${id}`, { method: 'DELETE', headers: headers() });
}

// ─── Document Upload ────────────────────────────────────────

export async function uploadDocument(returnId: string, file: File, docType: string, issuerName?: string): Promise<TaxDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('return_id', returnId);
  formData.append('doc_type', docType);
  if (issuerName) formData.append('issuer_name', issuerName);

  const resp = await fetch(`${TAX_API}/documents/upload`, {
    method: 'POST',
    headers: { 'X-Echo-API-Key': API_KEY },
    body: formData,
  });
  const data = await resp.json() as any;
  if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
  return data.document;
}

export async function getDocuments(returnId: string): Promise<TaxDocument[]> {
  const resp = await fetchJSON<{ documents: TaxDocument[] }>(`${TAX_API}/documents/${returnId}`, { headers: headers() });
  return resp.documents;
}

// ─── Calculate + Optimize ───────────────────────────────────

export async function calculateReturn(returnId: string): Promise<TaxCalculation> {
  const resp = await fetchJSON<{ calculation: TaxCalculation }>(`${TAX_API}/returns/${returnId}/calculate`, {
    method: 'POST', headers: headers(),
  });
  return resp.calculation;
}

export async function getOptimizations(returnId: string): Promise<Optimization[]> {
  const resp = await fetchJSON<{ optimizations: Optimization[]; count: number }>(`${TAX_API}/returns/${returnId}/optimize`, {
    method: 'POST', headers: headers(),
  });
  return resp.optimizations;
}

// ─── Forms ──────────────────────────────────────────────────

export async function getReturnForms(returnId: string): Promise<any> {
  return fetchJSON(`${TAX_API}/returns/${returnId}/forms`, { headers: headers() });
}

// ─── Billing ────────────────────────────────────────────────

export async function getPricing(): Promise<PricingTier[]> {
  const resp = await fetchJSON<{ pricing: PricingTier[] }>(`${TAX_API}/pricing`);
  return resp.pricing;
}

export async function createCheckout(clientId: string, returnId: string, tier: string): Promise<{ checkout_url: string }> {
  const resp = await fetchJSON<{ checkout_url: string }>(`${TAX_API}/billing/checkout`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ client_id: clientId, return_id: returnId, tier }),
  });
  return resp;
}

// ─── Health ─────────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string; clients: number }> {
  return fetchJSON(`${TAX_API}/health`);
}

// ─── v3.1: Key Numbers ─────────────────────────────────────

export async function getKeyNumbers(year: number): Promise<KeyNumbers> {
  return fetchJSON<KeyNumbers>(`${TAX_API}/returns/key-numbers/${year}`, { headers: headers() });
}

// ─── v3.1: Communications ──────────────────────────────────

export async function addCommunication(clientId: string, data: {
  type: string;
  subject: string;
  body: string;
}): Promise<Communication> {
  const resp = await fetchJSON<{ communication: Communication }>(`${TAX_API}/returns/communications`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ client_id: clientId, ...data }),
  });
  return resp.communication;
}

export async function getCommunications(clientId: string): Promise<Communication[]> {
  const resp = await fetchJSON<{ communications: Communication[] }>(
    `${TAX_API}/returns/communications/${clientId}`,
    { headers: headers() },
  );
  return resp.communications;
}

// ─── v3.1: Self-Employment Tax ─────────────────────────────

export async function getSelfEmploymentTax(returnId: string): Promise<SelfEmploymentTax> {
  return fetchJSON<SelfEmploymentTax>(`${TAX_API}/returns/${returnId}/se-tax`, { headers: headers() });
}

// ─── v3.1: Safe Harbor ─────────────────────────────────────

export async function getSafeHarbor(returnId: string): Promise<SafeHarbor> {
  return fetchJSON<SafeHarbor>(`${TAX_API}/returns/${returnId}/safe-harbor`, { headers: headers() });
}

// ─── v3.1: Print Package ───────────────────────────────────

export async function getPrintPackage(returnId: string): Promise<PrintPackage> {
  return fetchJSON<PrintPackage>(`${TAX_API}/returns/${returnId}/print-package`, { headers: headers() });
}

// ─── v3.1: Income Analysis ─────────────────────────────────

export async function getIncomeAnalysis(returnId: string): Promise<IncomeAnalysis> {
  return fetchJSON<IncomeAnalysis>(`${TAX_API}/returns/${returnId}/income-analysis`, { headers: headers() });
}

// ─── v3.2: State Tax ───────────────────────────────────────

export async function getStateTax(returnId: string, state: string): Promise<StateTaxEstimate> {
  return fetchJSON<StateTaxEstimate>(
    `${TAX_API}/returns/${returnId}/state-tax?state=${encodeURIComponent(state)}`,
    { headers: headers() },
  );
}

// ─── v3.2: Required Forms ──────────────────────────────────

export async function getRequiredForms(returnId: string): Promise<RequiredForm[]> {
  const resp = await fetchJSON<{ forms: RequiredForm[] }>(
    `${TAX_API}/returns/${returnId}/required-forms`,
    { headers: headers() },
  );
  return resp.forms;
}

// ─── v3.2: Depreciation Calculator ─────────────────────────

export async function calculateDepreciation(returnId: string, data: {
  asset_description: string;
  cost_basis: number;
  placed_in_service: string;
  asset_class: string;
  section_179?: boolean;
  bonus_depreciation?: boolean;
}): Promise<DepreciationResult> {
  return fetchJSON<DepreciationResult>(`${TAX_API}/returns/${returnId}/depreciation`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

// ─── v3.2: Tax Strategy ────────────────────────────────────

export async function getStrategy(returnId: string): Promise<TaxStrategy> {
  return fetchJSON<TaxStrategy>(`${TAX_API}/returns/${returnId}/strategy`, { headers: headers() });
}

// ─── v3.2: Year-over-Year Trend ────────────────────────────

export async function getTrend(returnId: string): Promise<TrendAnalysis> {
  return fetchJSON<TrendAnalysis>(`${TAX_API}/returns/${returnId}/trend`, { headers: headers() });
}

// ═══════════════════════════════════════════════════════════════
// v4.0: Tools Endpoints
// ═══════════════════════════════════════════════════════════════

export async function whatIf(returnId: string, scenario: WhatIfScenario): Promise<WhatIfResult> {
  return fetchJSON<WhatIfResult>(`${TAX_API}/returns/${returnId}/what-if`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(scenario),
  });
}

export async function compareReturns(clientId: string): Promise<any> {
  return fetchJSON<any>(
    `${TAX_API}/returns/compare?client_id=${encodeURIComponent(clientId)}`,
    { headers: headers() },
  );
}

export async function getAuditRisk(returnId: string): Promise<AuditRisk> {
  return fetchJSON<AuditRisk>(`${TAX_API}/returns/${returnId}/audit-risk`, { headers: headers() });
}

export async function getWithholdingEstimate(returnId: string, data: Record<string, any>): Promise<WithholdingEstimate> {
  return fetchJSON<WithholdingEstimate>(`${TAX_API}/returns/${returnId}/withholding-estimate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

export async function getReturnSummary(returnId: string): Promise<ReturnSummary> {
  return fetchJSON<ReturnSummary>(`${TAX_API}/returns/${returnId}/summary`, { headers: headers() });
}

export async function getSupportedYears(): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/supported-years`, { headers: headers() });
}

export async function addEstimatedPayment(returnId: string, data: {
  quarter: number;
  amount: number;
  paid_date?: string;
}): Promise<EstimatedPayment> {
  return fetchJSON<EstimatedPayment>(`${TAX_API}/returns/${returnId}/estimated-payments`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

export async function getEstimatedPayments(returnId: string): Promise<EstimatedPayment[]> {
  const resp = await fetchJSON<{ payments: EstimatedPayment[] }>(
    `${TAX_API}/returns/${returnId}/estimated-payments`,
    { headers: headers() },
  );
  return resp.payments;
}

export async function createAmendment(returnId: string, data: {
  reason: string;
  changes: Record<string, any>;
}): Promise<Amendment> {
  return fetchJSON<Amendment>(`${TAX_API}/returns/${returnId}/amendments`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

export async function getAmendments(returnId: string): Promise<Amendment[]> {
  const resp = await fetchJSON<{ amendments: Amendment[] }>(
    `${TAX_API}/returns/${returnId}/amendments`,
    { headers: headers() },
  );
  return resp.amendments;
}

export async function getTaxCalendar(year: number): Promise<TaxCalendarEntry[]> {
  const resp = await fetchJSON<{ calendar: TaxCalendarEntry[] }>(
    `${TAX_API}/returns/tax-calendar?year=${year}`,
    { headers: headers() },
  );
  return resp.calendar;
}

export async function getTaxTips(returnId: string): Promise<TaxTip[]> {
  const resp = await fetchJSON<{ tips: TaxTip[] }>(
    `${TAX_API}/returns/${returnId}/tips`,
    { headers: headers() },
  );
  return resp.tips;
}

export async function getPenaltyEstimate(returnId: string): Promise<PenaltyEstimate> {
  return fetchJSON<PenaltyEstimate>(`${TAX_API}/returns/${returnId}/penalty-estimate`, { headers: headers() });
}

export async function addNote(returnId: string, data: {
  content: string;
  author?: string;
}): Promise<ReturnNote> {
  return fetchJSON<ReturnNote>(`${TAX_API}/returns/${returnId}/notes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

export async function getNotes(returnId: string): Promise<ReturnNote[]> {
  const resp = await fetchJSON<{ notes: ReturnNote[] }>(
    `${TAX_API}/returns/${returnId}/notes`,
    { headers: headers() },
  );
  return resp.notes;
}

export async function deleteNote(returnId: string, noteId: string): Promise<void> {
  await fetchJSON(`${TAX_API}/returns/${returnId}/notes/${noteId}`, {
    method: 'DELETE',
    headers: headers(),
  });
}

export async function getEngagementLetter(returnId: string): Promise<EngagementLetter> {
  return fetchJSON<EngagementLetter>(`${TAX_API}/returns/${returnId}/engagement-letter`, { headers: headers() });
}

export async function exportReturn(returnId: string, format: 'json' | 'csv' = 'json'): Promise<any> {
  return fetchJSON<any>(
    `${TAX_API}/returns/${returnId}/export?format=${format}`,
    { headers: headers() },
  );
}

export async function projectIncome(returnId: string, data: Record<string, any>): Promise<IncomeProjection> {
  return fetchJSON<IncomeProjection>(`${TAX_API}/returns/${returnId}/project`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

export async function duplicateReturn(returnId: string): Promise<TaxReturn> {
  const resp = await fetchJSON<{ return: TaxReturn }>(`${TAX_API}/returns/${returnId}/duplicate`, {
    method: 'POST',
    headers: headers(),
  });
  return resp.return;
}

export async function getClientActivity(clientId: string): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/activity/${clientId}`, { headers: headers() });
}

export async function getTaxReference(topic: string): Promise<any> {
  return fetchJSON<any>(
    `${TAX_API}/returns/tax-reference/${encodeURIComponent(topic)}`,
    { headers: headers() },
  );
}

export async function getReturnHealth(returnId: string): Promise<ReturnHealth> {
  return fetchJSON<ReturnHealth>(`${TAX_API}/returns/${returnId}/health`, { headers: headers() });
}

// ═══════════════════════════════════════════════════════════════
// v4.0: Advanced Endpoints
// ═══════════════════════════════════════════════════════════════

export async function batchCalculate(clientId: string): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/batch-calculate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ client_id: clientId }),
  });
}

export async function diffReturns(returnA: string, returnB: string): Promise<ReturnDiff> {
  return fetchJSON<ReturnDiff>(
    `${TAX_API}/returns/diff?return_a=${encodeURIComponent(returnA)}&return_b=${encodeURIComponent(returnB)}`,
    { headers: headers() },
  );
}

export async function getDocumentChecklist(returnId: string): Promise<DocumentChecklist> {
  return fetchJSON<DocumentChecklist>(`${TAX_API}/returns/${returnId}/document-checklist`, { headers: headers() });
}

export async function getBracketAnalysis(returnId: string): Promise<BracketAnalysis> {
  return fetchJSON<BracketAnalysis>(`${TAX_API}/returns/${returnId}/bracket-analysis`, { headers: headers() });
}

export async function lockReturn(returnId: string, locked: boolean): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/${returnId}/lock`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ locked }),
  });
}

export async function getLockStatus(returnId: string): Promise<{ locked: boolean; locked_at: string | null; locked_by: string | null }> {
  return fetchJSON<{ locked: boolean; locked_at: string | null; locked_by: string | null }>(
    `${TAX_API}/returns/${returnId}/lock-status`,
    { headers: headers() },
  );
}

export async function generatePortalToken(returnId: string): Promise<{ token: string; expires_at: string }> {
  return fetchJSON<{ token: string; expires_at: string }>(`${TAX_API}/returns/portal-token`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ return_id: returnId }),
  });
}

export async function getPortalView(token: string): Promise<PortalView> {
  return fetchJSON<PortalView>(`${TAX_API}/returns/portal/${token}`, { headers: headers() });
}

export async function getDeductionOpportunities(returnId: string): Promise<DeductionOpportunity[]> {
  const resp = await fetchJSON<{ opportunities: DeductionOpportunity[] }>(
    `${TAX_API}/returns/${returnId}/deduction-opportunities`,
    { headers: headers() },
  );
  return resp.opportunities;
}

export async function getClientSummary(clientId: string): Promise<ClientSummary> {
  return fetchJSON<ClientSummary>(`${TAX_API}/returns/client-summary/${clientId}`, { headers: headers() });
}

export async function getReturnTimeline(returnId: string): Promise<TimelineEntry[]> {
  const resp = await fetchJSON<{ timeline: TimelineEntry[] }>(
    `${TAX_API}/returns/${returnId}/timeline`,
    { headers: headers() },
  );
  return resp.timeline;
}

export async function searchTaxKnowledge(query: string): Promise<any> {
  return fetchJSON<any>(
    `${TAX_API}/returns/tax-knowledge/search?q=${encodeURIComponent(query)}`,
    { headers: headers() },
  );
}

export async function createSnapshot(returnId: string): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/${returnId}/snapshot`, {
    method: 'POST',
    headers: headers(),
  });
}

export async function validateReturn(returnId: string): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/${returnId}/validate`, { headers: headers() });
}

export async function getPreparerDashboard(): Promise<PreparerDashboard> {
  return fetchJSON<PreparerDashboard>(`${TAX_API}/returns/preparer/dashboard`, { headers: headers() });
}

// ═══════════════════════════════════════════════════════════════
// v4.0: Filing Endpoints
// ═══════════════════════════════════════════════════════════════

export async function getFilingPackage(returnId: string): Promise<FilingPackage> {
  return fetchJSON<FilingPackage>(`${TAX_API}/returns/${returnId}/filing-package`, { headers: headers() });
}

export async function fileReturn(returnId: string, method: 'efile' | 'paper'): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/${returnId}/file`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ method }),
  });
}

export async function batchFile(clientId: string): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/batch-file`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ client_id: clientId }),
  });
}

export async function getPrintableReturn(returnId: string): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/${returnId}/printable`, { headers: headers() });
}

// ═══════════════════════════════════════════════════════════════
// v4.0: Audit Log Endpoints
// ═══════════════════════════════════════════════════════════════

export async function getAuditLog(page?: number, limit?: number): Promise<{ entries: AuditLogEntry[]; total: number; page: number }> {
  const params = new URLSearchParams();
  if (page !== undefined) params.set('page', String(page));
  if (limit !== undefined) params.set('limit', String(limit));
  const qs = params.toString();
  const url = qs ? `${TAX_API}/returns/audit-log?${qs}` : `${TAX_API}/returns/audit-log`;
  return fetchJSON<{ entries: AuditLogEntry[]; total: number; page: number }>(url, { headers: headers() });
}

export async function exportAuditLog(): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/audit-log/export`, { headers: headers() });
}

export async function getAuditStats(): Promise<any> {
  return fetchJSON<any>(`${TAX_API}/returns/audit-log/stats`, { headers: headers() });
}
