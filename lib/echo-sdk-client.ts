/**
 * Echo SDK Gateway Client — Unified access to 5,477 engines, 697K doctrines,
 * Shared Brain, Knowledge Forge, and OpenClaw bridge.
 *
 * SDK Gateway: https://echo-sdk-gateway.bmcii1976.workers.dev
 * OpenClaw Bridge: https://openclaw-bridge.bmcii1976.workers.dev
 */

import { getApiBase } from './api-base';

const SDK_URL = getApiBase('echo-sdk-gateway', 'sdk');
const OPENCLAW_URL = getApiBase('openclaw-bridge', 'sdk');
const SDK_KEY = 'echo-omega-prime-forge-x-2026';

// ── Types ──

export interface SDKEnvelope<T = unknown> {
  success: boolean;
  data: T;
  error?: { message: string; code: string };
  meta?: { ts: string; version: string; service: string; latency_ms: number };
}

export interface EngineQueryResult {
  topic: string;
  conclusion: string;
  reasoning: string;
  confidence: string;
  authority: string[];
  engine_id: string;
  domain: string;
  score: number;
}

export interface SearchResult {
  id: string;
  source: 'engine' | 'knowledge' | 'brain';
  title: string;
  snippet: string;
  category: string;
  score: number;
}

export interface UnifiedSearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  performance: { cache_hit: boolean; total_ms: number };
}

export interface OpenClawEnrichment {
  brainContext: string[];
  engineDoctrines: string[];
  graphInsights: string[];
  knowledgeChunks: string[];
}

// ── Core fetch ──

async function sdkFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Echo-API-Key': SDK_KEY,
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${SDK_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`SDK ${res.status}: ${await res.text()}`);
  const env: SDKEnvelope<T> = await res.json();
  if (!env.success) throw new Error(env.error?.message || 'SDK error');
  return env.data;
}

async function openclawFetch<T>(path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SDK_KEY}`,
  };
  const res = await fetch(`${OPENCLAW_URL}${path}`, {
    method: body ? 'POST' : 'GET',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`OpenClaw ${res.status}`);
  return res.json();
}

// ── Engine Queries ──

export async function queryEngine(engineId: string, query: string, mode: 'FAST' | 'DEFENSE' | 'MEMO' = 'FAST') {
  return sdkFetch<{ results: EngineQueryResult[]; total: number; latency_ms: number }>('/engine/query', {
    method: 'POST',
    body: JSON.stringify({ engine_id: engineId, query, mode }),
  });
}

export async function queryDomain(domain: string, query: string, mode: 'FAST' | 'DEFENSE' | 'MEMO' = 'FAST') {
  return sdkFetch<{ results: EngineQueryResult[]; total: number; latency_ms: number }>('/engine/domain', {
    method: 'POST',
    body: JSON.stringify({ domain, query, mode }),
  });
}

export async function crossDomainQuery(query: string, limit = 15) {
  return sdkFetch<{ results: EngineQueryResult[]; total: number; latency_ms: number }>('/engine/cross-domain', {
    method: 'POST',
    body: JSON.stringify({ query, limit }),
  });
}

export async function searchEngines(q: string, limit = 10) {
  return sdkFetch<{ results: unknown[]; total: number }>(`/engine/search?q=${encodeURIComponent(q)}&limit=${limit}`);
}

export async function getEngineStats() {
  return sdkFetch<{ total_engines: number; total_doctrines: number; total_queries: number; categories: unknown[] }>('/engine/stats');
}

// ── Unified Search ──

export async function unifiedSearch(query: string, sources?: ('engine' | 'knowledge' | 'brain')[], mode: 'FAST' | 'DEEP' = 'FAST') {
  return sdkFetch<UnifiedSearchResponse>('/search', {
    method: 'POST',
    body: JSON.stringify({ query, sources, mode }),
  });
}

// ── Brain (Shared Memory) ──

export async function brainSearch(query: string, limit = 10) {
  return sdkFetch<{ results: unknown[]; total: number }>('/brain/search', {
    method: 'POST',
    body: JSON.stringify({ query, limit }),
  });
}

export async function brainIngest(content: string, tags: string[] = [], importance = 5) {
  return sdkFetch<{ stored: boolean }>('/brain/ingest', {
    method: 'POST',
    body: JSON.stringify({ content, tags, importance, instance_id: 'echo-ept-frontend' }),
  });
}

// ── Knowledge Forge ──

export async function knowledgeSearch(query: string, category?: string, limit = 10) {
  return sdkFetch<{ results: unknown[]; total: number }>('/knowledge/search', {
    method: 'POST',
    body: JSON.stringify({ query, category, limit }),
  });
}

// ── OpenClaw Bridge — Enrichment for Concierge ──

export async function openclawEnrich(query: string, context?: string): Promise<OpenClawEnrichment> {
  try {
    const [brain, engines, knowledge] = await Promise.allSettled([
      openclawFetch<{ results: { content: string }[] }>('/brain', { query, limit: 3 }),
      openclawFetch<{ results: { conclusion: string }[] }>('/engines', { query, limit: 3 }),
      openclawFetch<{ results: { content: string }[] }>('/knowledge', { query, limit: 3 }),
    ]);

    return {
      brainContext: brain.status === 'fulfilled' && brain.value?.results
        ? brain.value.results.map((r: { content: string }) => r.content).slice(0, 3)
        : [],
      engineDoctrines: engines.status === 'fulfilled' && engines.value?.results
        ? engines.value.results.map((r: { conclusion: string }) => r.conclusion).slice(0, 3)
        : [],
      graphInsights: [],
      knowledgeChunks: knowledge.status === 'fulfilled' && knowledge.value?.results
        ? knowledge.value.results.map((r: { content: string }) => r.content).slice(0, 3)
        : [],
    };
  } catch {
    return { brainContext: [], engineDoctrines: [], graphInsights: [], knowledgeChunks: [] };
  }
}

// ── Worker Proxy ──

export async function callWorker(worker: string, path = '/', method = 'GET', body?: unknown) {
  return sdkFetch<unknown>('/worker/call', {
    method: 'POST',
    body: JSON.stringify({ worker, path, method, body }),
  });
}
