/**
 * EchoCAD API Client v2.0
 * Connects to https://echocad.bmcii1976.workers.dev
 * 38 engineering materials, 15 primitive types, 12 engineering calculators,
 * OpenSCAD/STL/DXF/G-code export, BOM generation, AI-powered design.
 */

const API_URL = 'https://echocad.bmcii1976.workers.dev';

// ── Types (matched to actual API response shapes) ──

export interface Material {
  id: string;
  name: string;
  category: string;
  density_g_cm3: number;
  yield_mpa: number;
  tensile_mpa: number;
  elongation_pct: number;
  hardness_hrc: number;
  hardness_hb: number;
  elastic_modulus_gpa: number;
  poisson_ratio: number;
  thermal_conductivity_w_mk: number;
  thermal_expansion_um_mk: number;
  melting_point_c: number;
  max_service_temp_c: number;
  machinability_rating: number;
  weldability: string;
  nace_compliant: boolean;
  cost_usd_kg: number;
  color: string;
  applications: string[];
}

export interface StressResult {
  force_N: number;
  area_mm2: number;
  material: string;
  sigma_direct_mpa: number;
  vonMises_mpa: number;
  yield_mpa: number;
  safetyFactor: number;
  verdict: string;
}

export interface DFMResult {
  score: number;
  grade: string;
  cost_multiplier: number;
  issues: string[];
  recommendations: string[];
  breakdown: Record<string, number>;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface StatsResponse {
  materials: { count: number; categories: string[] };
  primitives: string[];
  engineeringCalcs: string[];
  exportFormats: string[];
}

// ── Fetcher ──

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`EchoCAD API ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Read endpoints ──

export async function getHealth(): Promise<HealthResponse> {
  return fetchJSON('/health');
}

export async function getStats(): Promise<StatsResponse> {
  return fetchJSON('/stats');
}

export async function getMaterials(category?: string): Promise<Material[]> {
  const q = category ? `?category=${encodeURIComponent(category)}` : '';
  return fetchJSON(`/materials${q}`);
}

export async function getMaterial(id: string): Promise<Material> {
  return fetchJSON(`/materials/${encodeURIComponent(id)}`);
}

// ── Material operations ──

export async function compareMaterials(ids: string[]): Promise<Record<string, Material | null>> {
  return fetchJSON('/materials/compare', {
    method: 'POST',
    body: JSON.stringify({ materials: ids }),
  });
}

export async function selectMaterial(requirements: Record<string, unknown>): Promise<Material[]> {
  return fetchJSON('/materials/select', {
    method: 'POST',
    body: JSON.stringify(requirements),
  });
}

// ── Primitives ──

export async function createPrimitive(type: string, name: string, dimensions: Record<string, number>, material?: string) {
  return fetchJSON('/primitives/create', {
    method: 'POST',
    body: JSON.stringify({ type, name, dimensions, material }),
  });
}

// ── Assembly ──

export async function createAssembly(name: string, parts: Record<string, unknown>[]) {
  return fetchJSON('/assembly/create', {
    method: 'POST',
    body: JSON.stringify({ name, parts }),
  });
}

// ── Engineering ──

export async function analyzeStress(force: number, area: number, material?: string): Promise<StressResult> {
  return fetchJSON('/engineering/stress', {
    method: 'POST',
    body: JSON.stringify({ force, area, material }),
  });
}

export async function analyzeDFM(params: {
  material?: string;
  features?: string[];
  tolerances?: string;
  surface_finish_ra?: number;
  quantity?: number;
}): Promise<DFMResult> {
  return fetchJSON('/engineering/dfm', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function analyzeFatigue(stress_range_mpa: number, mean_stress_mpa: number, material?: string) {
  return fetchJSON('/engineering/fatigue', {
    method: 'POST',
    body: JSON.stringify({ stress_range_mpa, mean_stress_mpa, material }),
  });
}

export async function analyzePressure(pressure: number, outer_diameter: number, inner_diameter: number, material?: string) {
  return fetchJSON('/engineering/pressure', {
    method: 'POST',
    body: JSON.stringify({ pressure, outer_diameter, inner_diameter, material }),
  });
}

export async function analyzeTolerances(dimensions: { nominal: number; tolerance: number }[]) {
  return fetchJSON('/engineering/tolerance', {
    method: 'POST',
    body: JSON.stringify({ dimensions }),
  });
}

export async function analyzeThread(size: string, pitch?: number, type?: string, material?: string) {
  return fetchJSON('/engineering/thread', {
    method: 'POST',
    body: JSON.stringify({ size, pitch, type, material }),
  });
}

export async function calculateWeight(parts: Record<string, unknown>[]) {
  return fetchJSON('/engineering/weight', {
    method: 'POST',
    body: JSON.stringify({ parts }),
  });
}

// ── Export ──

export async function exportSCAD(parts: Record<string, unknown>[]) {
  return fetchJSON('/export/scad', {
    method: 'POST',
    body: JSON.stringify({ parts }),
  });
}

export async function exportBOM(parts: Record<string, unknown>[]) {
  return fetchJSON('/export/bom', {
    method: 'POST',
    body: JSON.stringify({ parts }),
  });
}

// ── Quality ──

export async function checkNACE(material: string) {
  return fetchJSON('/quality/nace', {
    method: 'POST',
    body: JSON.stringify({ material }),
  });
}
