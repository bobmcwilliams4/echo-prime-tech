import { getApiBase, getWsBase } from './api-base';
/**
 * EchoCAD API Client v2.0
 * Connects to https://echocad.bmcii1976.workers.dev
 * 38 engineering materials, 15 primitive types, 12 engineering calculators,
 * OpenSCAD/STL/DXF/G-code export, BOM generation, AI-powered design.
 */

const API_URL = getApiBase('echocad');

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
  vonMises_mpa: number;
  principal: number[];
  safetyFactor: number;
  yieldMargin_pct: number;
  status: string;
  material: string;
  yield_mpa: number;
}

export interface DFMResult {
  score: number;
  grade: string;
  estimatedCostMultiplier: number;
  issues: string[];
  suggestions: string[];
  processRecommendation: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface StatsResponse {
  materials: number;
  materialCategories: string[];
  primitiveTypes: string[];
  engineeringCalcs: string[];
  manufacturing: string[];
  exportFormats: string[];
  aiFeatures: string[];
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
  const res = await fetchJSON<{ count: number; categories: string[]; materials: Material[] }>(`/materials${q}`);
  return res.materials ?? [];
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

// ── Additional Engineering ──

export async function analyzeThermal(params: { inner_radius_mm: number; outer_radius_mm: number; length_mm: number; material?: string; inner_temp_c?: number; outer_temp_c?: number }) {
  return fetchJSON('/engineering/thermal', { method: 'POST', body: JSON.stringify(params) });
}

export async function analyzeSafetyFactor(params: { loads: Record<string, number>; geometry: Record<string, number>; material: string }) {
  return fetchJSON('/engineering/safety-factor', { method: 'POST', body: JSON.stringify(params) });
}

export async function analyzeBeam(params: { length: number; load: number; support_type: string; material: string; width?: number; height?: number }) {
  return fetchJSON('/engineering/beam', { method: 'POST', body: JSON.stringify(params) });
}

export async function analyzeWeld(params: { type: string; size: number; length: number; electrode: string; load?: number }) {
  return fetchJSON('/engineering/weld', { method: 'POST', body: JSON.stringify(params) });
}

export async function analyzeBolt(params: { size: string; grade: string; clamp_force: number; joint_material?: string }) {
  return fetchJSON('/engineering/bolt', { method: 'POST', body: JSON.stringify(params) });
}

// ── Manufacturing ──

export async function estimateCNC(params: { parts: Record<string, unknown>[]; material?: string }) {
  return fetchJSON('/manufacturing/cnc', { method: 'POST', body: JSON.stringify(params) });
}

export async function estimateCost(params: { parts: Record<string, unknown>[]; quantity?: number; material?: string }) {
  return fetchJSON('/manufacturing/cost', { method: 'POST', body: JSON.stringify(params) });
}

export async function getProcessPlan(params: { parts: Record<string, unknown>[]; material?: string; quantity?: number }) {
  return fetchJSON('/manufacturing/process-plan', { method: 'POST', body: JSON.stringify(params) });
}

// ── Additional Export ──

export async function exportSTL(parts: Record<string, unknown>[]) {
  return fetchJSON('/export/stl', { method: 'POST', body: JSON.stringify({ parts }) });
}

export async function exportDXF(parts: Record<string, unknown>[]) {
  return fetchJSON('/export/dxf', { method: 'POST', body: JSON.stringify({ parts }) });
}

export async function exportGCode(parts: Record<string, unknown>[]) {
  return fetchJSON('/export/gcode', { method: 'POST', body: JSON.stringify({ parts }) });
}

// ── Quality ──

export async function checkNACE(material: string) {
  return fetchJSON('/quality/nace', { method: 'POST', body: JSON.stringify({ material }) });
}

export async function runFMEA(params: { component: string; functions?: string[]; failure_modes?: string[] }) {
  return fetchJSON('/quality/fmea', { method: 'POST', body: JSON.stringify(params) });
}

// ── AI ──

export async function textToCAD(prompt: string) {
  return fetchJSON('/ai/text-to-cad', { method: 'POST', body: JSON.stringify({ prompt }) });
}

export async function aiCopilot(question: string, context?: string) {
  return fetchJSON('/ai/copilot', { method: 'POST', body: JSON.stringify({ question, context }) });
}

export async function aiOptimize(params: { parts: Record<string, unknown>[]; objective?: string; constraints?: Record<string, unknown> }) {
  return fetchJSON('/ai/optimize', { method: 'POST', body: JSON.stringify(params) });
}
