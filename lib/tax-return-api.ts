// Echo Tax Return — Frontend API Client
// Connects to echo-tax-return.bmcii1976.workers.dev

const TAX_API = 'https://echo-tax-return.bmcii1976.workers.dev';
const API_KEY = 'echo-omega-prime-forge-x-2026';

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

// ─── Types ───────────────────────────────────────────────────

export interface Client {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
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

// ─── Client Endpoints ────────────────────────────────────────

export async function createClient(data: {
  first_name: string; last_name: string; email?: string; ssn?: string;
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

// ─── Return Endpoints ────────────────────────────────────────

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

// ─── Income / Deduction / Dependent ──────────────────────────

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

// ─── Document Upload ─────────────────────────────────────────

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

// ─── Calculate + Optimize ────────────────────────────────────

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

// ─── Forms ───────────────────────────────────────────────────

export async function getReturnForms(returnId: string): Promise<any> {
  return fetchJSON(`${TAX_API}/returns/${returnId}/forms`, { headers: headers() });
}

// ─── Billing ─────────────────────────────────────────────────

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

// ─── Health ──────────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string; clients: number }> {
  return fetchJSON(`${TAX_API}/health`);
}
