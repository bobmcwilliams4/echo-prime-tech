// ════════════════════════════════════════════════════════════════
// Knowledge Forge API Client
// Connects to echo-knowledge-forge Worker for document search,
// category browsing, and knowledge base statistics.
// ════════════════════════════════════════════════════════════════

const KNOWLEDGE_FORGE = 'https://echo-knowledge-forge.bmcii1976.workers.dev';
const API_KEY = 'echo-omega-prime-forge-x-2026';

async function kfFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Echo-API-Key': API_KEY,
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${KNOWLEDGE_FORGE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`Knowledge Forge: HTTP ${res.status}`);
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────

export interface KnowledgeChunk {
  id: number;
  doc_id?: number;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  source?: string;
  similarity?: number;
  created_at?: string;
}

export interface KnowledgeCategory {
  category: string;
  count: number;
}

export interface KnowledgeStats {
  total_docs: number;
  total_chunks: number;
  total_categories: number;
  categories?: KnowledgeCategory[];
  last_updated?: string;
}

export interface KnowledgeSearchResult {
  results: KnowledgeChunk[];
  total: number;
  query: string;
  category?: string;
}

// ── API Functions ──────────────────────────────────────────────

export async function getKnowledgeStats(): Promise<KnowledgeStats> {
  return kfFetch('/stats');
}

export async function getKnowledgeCategories(): Promise<KnowledgeCategory[]> {
  const data = await kfFetch<{ categories: KnowledgeCategory[] }>('/categories');
  return data.categories || [];
}

export async function searchKnowledge(params: {
  query: string;
  category?: string;
  limit?: number;
}): Promise<KnowledgeSearchResult> {
  return kfFetch('/search', {
    method: 'POST',
    body: JSON.stringify({
      query: params.query,
      category: params.category,
      limit: params.limit || 20,
    }),
  });
}

export async function getDocsByCategory(category: string, limit = 20): Promise<KnowledgeSearchResult> {
  return kfFetch('/search', {
    method: 'POST',
    body: JSON.stringify({ query: '*', category, limit }),
  });
}
