/**
 * EchoCAD API — AI-Native Parametric CAD Engine
 *
 * Connects to https://echocad.bmcii1976.workers.dev
 * 20 engineering materials, 8 primitive types, OpenSCAD codegen,
 * BOM generation, stress analysis, DFM analysis.
 */

const API_URL = 'https://echocad.bmcii1976.workers.dev';

// ── Types ──

export interface Material {
  id: string;
  name: string;
  category: string;
  density: number;
  yield_strength: number;
  tensile_strength: number;
  elongation: number;
  hardness: string;
  thermal_conductivity: number;
  max_service_temp: number;
  machinability: string;
  cost_per_kg: number;
}

export interface Primitive {
  type: string;
  params: Record<string, number>;
  material: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export interface Assembly {
  id: string;
  name: string;
  parts: Primitive[];
  created: string;
}

export interface BOMEntry {
  part: number;
  type: string;
  material: string;
  volume_cm3: number;
  weight_kg: number;
  cost_usd: number;
}

export interface BOMResult {
  assembly: string;
  parts: number;
  entries: BOMEntry[];
  total_weight_kg: number;
  total_cost_usd: number;
}

export interface StressResult {
  force_n: number;
  area_mm2: number;
  material: string;
  applied_stress_mpa: number;
  yield_strength_mpa: number;
  safety_factor: number;
  verdict: string;
}

export interface PressureResult {
  inner_radius_mm: number;
  outer_radius_mm: number;
  internal_pressure_mpa: number;
  material: string;
  max_hoop_stress_mpa: number;
  max_radial_stress_mpa: number;
  von_mises_mpa: number;
  yield_strength_mpa: number;
  safety_factor: number;
  verdict: string;
}

export interface ToleranceResult {
  dimensions: { nominal: number; tolerance: number }[];
  worst_case_min: number;
  worst_case_max: number;
  rss_tolerance: number;
  rss_min: number;
  rss_max: number;
}

export interface DFMResult {
  part_type: string;
  material: string;
  issues: string[];
  recommendations: string[];
  score: number;
  grade: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  materials: number;
  categories: number;
  primitives: number;
}

export interface StatsResponse {
  materials: number;
  categories: string[];
  primitives: string[];
  features: string[];
}

// ── Fetchers ──

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`EchoCAD API ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function getHealth(): Promise<HealthResponse> {
  return fetchJSON('/health');
}

export async function getStats(): Promise<StatsResponse> {
  return fetchJSON('/stats');
}

export async function getMaterials(): Promise<{ materials: Material[] }> {
  return fetchJSON('/materials');
}

export async function getMaterial(id: string): Promise<{ material: Material }> {
  return fetchJSON(`/materials/${encodeURIComponent(id)}`);
}

export async function compareMaterials(ids: string[]): Promise<{ comparison: Material[] }> {
  return fetchJSON('/materials/compare', {
    method: 'POST',
    body: JSON.stringify({ materials: ids }),
  });
}

export async function selectMaterial(requirements: Record<string, unknown>): Promise<{ recommendations: Material[] }> {
  return fetchJSON('/materials/select', {
    method: 'POST',
    body: JSON.stringify(requirements),
  });
}

export async function createPrimitive(primitive: Primitive): Promise<{ primitive: Primitive; volume_cm3: number; weight_kg: number; scad: string }> {
  return fetchJSON('/primitives/create', {
    method: 'POST',
    body: JSON.stringify(primitive),
  });
}

export async function createAssembly(name: string, parts: Primitive[]): Promise<{ assembly: Assembly }> {
  return fetchJSON('/assembly/create', {
    method: 'POST',
    body: JSON.stringify({ name, parts }),
  });
}

export async function generateBOM(parts: Primitive[]): Promise<BOMResult> {
  return fetchJSON('/bom/generate', {
    method: 'POST',
    body: JSON.stringify({ parts }),
  });
}

export async function exportSCAD(parts: Primitive[]): Promise<{ scad: string; parts: number }> {
  return fetchJSON('/export/scad', {
    method: 'POST',
    body: JSON.stringify({ parts }),
  });
}

export async function analyzeStress(force_n: number, area_mm2: number, material: string): Promise<StressResult> {
  return fetchJSON('/engineering/stress', {
    method: 'POST',
    body: JSON.stringify({ force_n, area_mm2, material }),
  });
}

export async function analyzePressure(inner_radius: number, outer_radius: number, pressure: number, material: string): Promise<PressureResult> {
  return fetchJSON('/engineering/pressure', {
    method: 'POST',
    body: JSON.stringify({ inner_radius, outer_radius, pressure, material }),
  });
}

export async function analyzeTolerances(dimensions: { nominal: number; tolerance: number }[]): Promise<ToleranceResult> {
  return fetchJSON('/engineering/tolerance', {
    method: 'POST',
    body: JSON.stringify({ dimensions }),
  });
}

export async function analyzeDFM(type: string, material: string, params: Record<string, number>): Promise<DFMResult> {
  return fetchJSON('/dfm/analyze', {
    method: 'POST',
    body: JSON.stringify({ type, material, params }),
  });
}

export async function calculateRingSize(diameter_mm: number): Promise<{ diameter_mm: number; us_size: number; eu_size: number }> {
  return fetchJSON('/tools/ring-size', {
    method: 'POST',
    body: JSON.stringify({ diameter_mm }),
  });
}
