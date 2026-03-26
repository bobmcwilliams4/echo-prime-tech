'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';
import {
  getKnowledgeStats,
  getKnowledgeCategories,
  searchKnowledge,
  getDocsByCategory,
  type KnowledgeStats,
  type KnowledgeCategory,
  type KnowledgeChunk,
} from '../../lib/knowledge-api';

const SERVICE_ID = 'knowledge-systems';

// ── Inline SVG Icons ─────────────────────────────────────────
function SearchIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>;
}
function ChevronRightIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
}
function FolderIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
}
function DocIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function ArrowLeftIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
}
function RefreshIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
}
function CheckIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}

// ── Marketing Data ───────────────────────────────────────────
const FEATURES = [
  { icon: '\uD83E\uDDE0', title: 'Knowledge Graphs', desc: 'Proprietary graph structures that map relationships between concepts, entities, and documents for deep contextual understanding.' },
  { icon: '\uD83D\uDD0D', title: 'Hybrid Retrieval', desc: 'Combines precision keyword search with semantic vector understanding. Find exactly what you need, even when you don\'t know the exact terms.' },
  { icon: '\uD83D\uDCDA', title: '50K+ Documents', desc: 'Ingest and index tens of thousands of documents with automatic categorization, tagging, and cross-referencing.' },
  { icon: '\u2728', title: 'AI Summarization', desc: 'Instant summaries of any document or topic. Ask questions in natural language and get cited, verifiable answers.' },
  { icon: '\uD83D\uDD17', title: 'API & Integrations', desc: 'REST API, webhooks, and native integrations with Slack, Notion, Google Workspace, and custom knowledge sources.' },
  { icon: '\uD83D\uDEE1\uFE0F', title: 'RBAC & Audit Trail', desc: 'Role-based access control, document-level permissions, and complete audit trails for every search and access event.' },
  { icon: '\uD83E\uDD16', title: 'Auto-Categorization', desc: 'AI-powered tagging and categorization that learns from your organization\'s taxonomy and improves over time.' },
  { icon: '\uD83D\uDCC8', title: 'Usage Analytics', desc: 'See what your team searches for most, identify knowledge gaps, and track adoption across departments.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Ingest Your Data', desc: 'Upload documents, connect data sources, or pipe in via API. We support PDF, Word, Markdown, HTML, CSV, and 20+ formats.' },
  { step: '02', title: 'Automatic Processing', desc: 'Documents are chunked, embedded, categorized, and indexed. Knowledge graphs are built automatically from entity extraction.' },
  { step: '03', title: 'Search & Discover', desc: 'Your team searches in natural language. Results combine keyword precision with semantic understanding for best-in-class recall.' },
  { step: '04', title: 'Continuous Learning', desc: 'The system learns from usage patterns, improving relevance ranking and suggesting related knowledge proactively.' },
];

// ── Knowledge Explorer App ───────────────────────────────────

function KnowledgeExplorerApp() {
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [results, setResults] = useState<KnowledgeChunk[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [expandedChunk, setExpandedChunk] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDocs, setCategoryDocs] = useState<KnowledgeChunk[]>([]);
  const [loadingCategoryDocs, setLoadingCategoryDocs] = useState(false);
  const [view, setView] = useState<'dashboard' | 'search-results' | 'category-browse'>('dashboard');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState('');

  // Load stats + categories on mount
  useEffect(() => {
    getKnowledgeStats()
      .then(s => setStats(s))
      .catch(() => setStats({ total_docs: 12000, total_chunks: 75000, total_categories: 175 }))
      .finally(() => setLoadingStats(false));

    getKnowledgeCategories()
      .then(c => setCategories(c))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleSearch = useCallback(async (q?: string) => {
    const query = q || searchQuery;
    if (!query.trim()) return;
    setSearching(true);
    setError('');
    setView('search-results');
    try {
      const r = await searchKnowledge({ query, category: searchCategory || undefined, limit: 30 });
      setResults(r.results || []);
      setSearchTotal(r.total || 0);
    } catch {
      setError('Search failed. Try again.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [searchQuery, searchCategory]);

  const handleCategoryClick = useCallback(async (cat: string) => {
    setSelectedCategory(cat);
    setLoadingCategoryDocs(true);
    setView('category-browse');
    setError('');
    try {
      const r = await getDocsByCategory(cat, 30);
      setCategoryDocs(r.results || []);
    } catch {
      setError('Failed to load category documents.');
      setCategoryDocs([]);
    } finally {
      setLoadingCategoryDocs(false);
    }
  }, []);

  const backToDashboard = () => {
    setView('dashboard');
    setResults([]);
    setSelectedCategory(null);
    setCategoryDocs([]);
    setExpandedChunk(null);
    setError('');
  };

  const filteredCategories = categories.filter(c =>
    c.category.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  const topCategories = [...categories].sort((a, b) => b.count - a.count).slice(0, 12);

  // ── Dashboard View ─────────────────────────────────────────
  if (view === 'dashboard') {
    return (
      <div className="space-y-8">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Knowledge', href: '/knowledge' }]} />
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingStats ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 rounded-xl border animate-pulse" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="h-8 rounded w-20 mb-2" style={{ backgroundColor: 'var(--ept-surface)' }} />
                <div className="h-4 rounded w-28" style={{ backgroundColor: 'var(--ept-surface)' }} />
              </div>
            ))
          ) : (
            [
              { value: stats?.total_docs?.toLocaleString() || '0', label: 'Documents', sub: 'Indexed & searchable' },
              { value: stats?.total_chunks?.toLocaleString() || '0', label: 'Knowledge Chunks', sub: 'Embedded vectors' },
              { value: stats?.total_categories?.toLocaleString() || '0', label: 'Categories', sub: 'Auto-classified' },
              { value: stats?.last_updated ? new Date(stats.last_updated).toLocaleDateString() : 'Live', label: 'Last Updated', sub: 'Continuous ingestion' },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-2xl font-extrabold font-mono gradient-text">{s.value}</div>
                <div className="text-xs font-semibold mt-1" style={{ color: 'var(--ept-text)' }}>{s.label}</div>
                <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</div>
              </div>
            ))
          )}
        </div>

        {/* Search Bar */}
        <div data-tutorial="knowledge-search" className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Search Knowledge Base</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search documents, topics, or ask a question..."
                className="w-full px-4 py-3 pl-10 rounded-xl text-sm border outline-none"
                style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ept-text-muted)' }}><SearchIcon /></div>
            </div>
            <select
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm border outline-none"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.category} value={c.category}>{c.category} ({c.count})</option>
              ))}
            </select>
            <button
              onClick={() => handleSearch()}
              disabled={!searchQuery.trim()}
              className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              Search
            </button>
          </div>
          {/* Quick Searches */}
          <div className="mt-3 flex flex-wrap gap-2">
            {['Tax law', 'Cybersecurity', 'Cloudflare Workers', 'Oil and gas', 'Medical', 'Real estate'].map(q => (
              <button
                key={q}
                onClick={() => { setSearchQuery(q); handleSearch(q); }}
                className="px-3 py-1 rounded-full text-xs border"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Top Categories</h3>
            <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{categories.length} total</span>
          </div>
          <div data-tutorial="knowledge-categories" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {loadingCategories ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border animate-pulse" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="h-5 rounded w-24 mb-2" style={{ backgroundColor: 'var(--ept-surface)' }} />
                  <div className="h-3 rounded w-16" style={{ backgroundColor: 'var(--ept-surface)' }} />
                </div>
              ))
            ) : (
              topCategories.map(c => (
                <button
                  key={c.category}
                  onClick={() => handleCategoryClick(c.category)}
                  className="p-4 rounded-xl border text-left transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: 'var(--ept-accent)' }}><FolderIcon /></span>
                    <span className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{c.category}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.count} docs</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* All Categories (collapsible) */}
        {categories.length > 12 && (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Browse All Categories</h3>
            <input
              type="text"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              placeholder="Filter categories..."
              className="w-full px-4 py-2 rounded-lg text-sm border outline-none mb-4"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto">
              {filteredCategories.map(c => (
                <button
                  key={c.category}
                  onClick={() => handleCategoryClick(c.category)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs border hover:scale-[1.01] transition-all"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  <span className="truncate">{c.category}</span>
                  <span className="ml-2 flex-shrink-0 font-mono" style={{ color: 'var(--ept-text-muted)' }}>{c.count}</span>
                </button>
              ))}
              {filteredCategories.length === 0 && (
                <p className="col-span-full text-sm py-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>No categories match &quot;{categoryFilter}&quot;</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Search Results View ────────────────────────────────────
  if (view === 'search-results') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={backToDashboard} className="p-2 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}><ArrowLeftIcon /></button>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Search Results</h3>
            <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
              {searching ? 'Searching...' : `${results.length} results found${searchTotal > results.length ? ` (of ${searchTotal} total)` : ''}`}
            </p>
          </div>
        </div>

        {/* Inline search refinement */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 rounded-lg text-sm border outline-none"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
          <button onClick={() => handleSearch()} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Search</button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {searching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>No results found</p>
            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Try a different query or browse categories instead.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((chunk, i) => (
              <div key={chunk.id || i} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: expandedChunk === i ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
                <button onClick={() => setExpandedChunk(expandedChunk === i ? null : i)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: 'var(--ept-accent)' }}><DocIcon /></span>
                        <span className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{chunk.title || 'Untitled Document'}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>{chunk.category}</span>
                        {chunk.similarity != null && (
                          <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{(chunk.similarity * 100).toFixed(1)}% match</span>
                        )}
                        {chunk.source && <span className="text-[10px] truncate" style={{ color: 'var(--ept-text-muted)' }}>{chunk.source}</span>}
                      </div>
                    </div>
                    <span className={`transform transition-transform ${expandedChunk === i ? 'rotate-90' : ''}`} style={{ color: 'var(--ept-text-muted)' }}><ChevronRightIcon /></span>
                  </div>
                </button>
                {expandedChunk === i && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                    <pre className="text-xs whitespace-pre-wrap leading-relaxed font-mono" style={{ color: 'var(--ept-text-secondary)' }}>{chunk.content}</pre>
                    {chunk.tags && chunk.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {chunk.tags.map((t, j) => (
                          <span key={j} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    {chunk.created_at && (
                      <p className="mt-2 text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Added: {new Date(chunk.created_at).toLocaleString()}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Category Browse View ───────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={backToDashboard} className="p-2 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}><ArrowLeftIcon /></button>
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{selectedCategory}</h3>
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            {loadingCategoryDocs ? 'Loading...' : `${categoryDocs.length} documents in this category`}
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loadingCategoryDocs ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : categoryDocs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>No documents found</p>
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>This category may still be populating.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryDocs.map((chunk, i) => (
            <div key={chunk.id || i} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: expandedChunk === i ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              <button onClick={() => setExpandedChunk(expandedChunk === i ? null : i)} className="w-full text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: 'var(--ept-accent)' }}><DocIcon /></span>
                      <span className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{chunk.title || 'Untitled Document'}</span>
                    </div>
                    {chunk.source && <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{chunk.source}</span>}
                  </div>
                  <span className={`transform transition-transform ${expandedChunk === i ? 'rotate-90' : ''}`} style={{ color: 'var(--ept-text-muted)' }}><ChevronRightIcon /></span>
                </div>
              </button>
              {expandedChunk === i && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <pre className="text-xs whitespace-pre-wrap leading-relaxed font-mono" style={{ color: 'var(--ept-text-secondary)' }}>{chunk.content}</pre>
                  {chunk.tags && chunk.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {chunk.tags.map((t, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {chunk.created_at && (
                    <p className="mt-2 text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Added: {new Date(chunk.created_at).toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────

function KnowledgePageContent() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'explorer'>('overview');

  useEffect(() => {
    getServices().then(d => {
      const svc = d.services.find(s => s.id === SERVICE_ID);
      if (svc) setService(svc);
    }).catch(() => {});
  }, []);

  const handleCheckout = async (tierIndex: number) => {
    if (!user) { window.location.href = '/signup?redirect=/knowledge'; return; }
    const tier = service?.pricing[tierIndex];
    if (!tier || tier.custom) { window.location.href = 'mailto:bob@echo-op.com?subject=Enterprise%20Knowledge%20Systems%20Inquiry'; return; }
    setCheckingOut(tier.tier);
    try {
      const { url } = await createCheckout(SERVICE_ID, tier.tier);
      window.location.href = url;
    } catch {
      setCheckingOut(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <ProductTutorialButton tutorialId="knowledge" productName="Knowledge Forge" />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* Tab Bar */}
      <div className="border-b px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="max-w-6xl mx-auto flex gap-6">
          {(['overview', 'explorer'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="py-3 text-sm font-semibold border-b-2 transition-colors"
              style={{
                borderColor: tab === t ? 'var(--ept-accent)' : 'transparent',
                color: tab === t ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
              }}
            >
              {t === 'overview' ? 'Overview' : 'Knowledge Explorer'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview Tab ── */}
      {tab === 'overview' && (
        <>
          {/* Hero */}
          <section data-tutorial="knowledge-hero" className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Knowledge Systems</div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>Your Organization&apos;s<br /><span className="gradient-text">Second Brain</span></h1>
            <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Proprietary knowledge graphs with tens of thousands of embedded reasoning blocks. Hybrid retrieval combining precision keyword search with semantic vector understanding.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button onClick={() => setTab('explorer')} className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</button>
              <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>View Pricing</Link>
            </div>
            <div className="mt-4"><ReadAloudButton label="Read page" getText={() => document.querySelector('.max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} /></div>
          </section>

          {/* Feature Grid */}
          <section className="max-w-6xl mx-auto px-6 pb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything Your Knowledge Base Needs</h2>
            <div className="grid md:grid-cols-4 gap-5">
              {FEATURES.map((f, i) => (
                <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section data-tutorial="knowledge-stats" className="max-w-5xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '170K+', label: 'Knowledge Chunks', sub: 'Indexed & searchable' },
                { value: '575', label: 'Categories', sub: 'Auto-classified' },
                { value: '312K', label: 'Graph Nodes', sub: 'Entity relationships' },
                { value: '<50ms', label: 'Search Latency', sub: 'Vectorize + D1' },
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl font-extrabold font-mono gradient-text">{s.value}</div>
                  <div className="text-xs font-semibold mt-1" style={{ color: 'var(--ept-text)' }}>{s.label}</div>
                  <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="max-w-4xl mx-auto px-6 pb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
            <div className="space-y-8">
              {HOW_IT_WORKS.map((s, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s.step}</div>
                  <div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          {service && (
            <section data-tutorial="knowledge-pricing" className="max-w-5xl mx-auto px-6 pb-20">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
              <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>{service.tagline}</p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {service.pricing.map((tier, i) => (
                  <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
                    backgroundColor: 'var(--ept-card-bg)',
                    borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                    boxShadow: tier.popular ? '0 0 30px var(--ept-accent-glow)' : 'none',
                  }}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
                    )}
                    <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
                    <div className="mb-6">
                      {tier.price !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price}</span>
                          <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                          <span className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }}><CheckIcon /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleCheckout(i)} disabled={checkingOut === tier.tier} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60" style={{
                      backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                      color: tier.popular ? '#fff' : 'var(--ept-accent)',
                      border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
                    }}>
                      {checkingOut === tier.tier ? 'Redirecting...' : tier.custom ? 'Contact Sales' : 'Get Started'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
            <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Stop losing institutional knowledge</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Every document your team creates becomes searchable, connected, and actionable. Set up in minutes.</p>
              <button onClick={() => setTab('explorer')} className="inline-block px-10 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</button>
            </div>
          </section>

          {/* Domain Intelligence Browser */}
          <section className="max-w-4xl mx-auto px-6 pb-16">
            <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Intelligence Engine Query</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Search across all 940+ knowledge domains, 5,486+ engines, and 607K+ pre-compiled doctrines. Select a domain or search globally.</p>
              <EngineQueryPanel
                title="Cross-Domain Intelligence Search"
                placeholder="Search all 940+ domains — tax, legal, cyber, engineering, medical, finance, AI/ML..."
                exampleQueries={[
                  'Section 1031 like-kind exchange requirements',
                  'NIST cybersecurity framework core functions',
                  'Welding procedure specification variables',
                  'HIPAA minimum necessary standard',
                  'Machine learning model evaluation metrics',
                  'Partnership tax allocation methods',
                ]}
                showStats
              />
            </div>
          </section>
        </>
      )}

      {/* ── Knowledge Explorer Tab ── */}
      {tab === 'explorer' && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <KnowledgeExplorerApp />
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: 'How is Knowledge Forge different from a regular search engine?', a: 'Knowledge Forge uses proprietary knowledge graphs and 5,486+ Intelligence Engines to understand relationships between concepts across 940+ domains. Instead of returning keyword matches, it delivers synthesized, citation-backed answers with full provenance chains — you know exactly where every fact comes from.' },
            { q: 'What types of documents can I ingest?', a: 'The platform supports PDFs, Word documents, spreadsheets, plain text, HTML, Markdown, and structured data formats like JSON and CSV. Documents are automatically chunked, embedded, and indexed into domain-specific knowledge graphs. Bulk ingestion APIs handle thousands of documents in parallel.' },
            { q: 'Can my team collaborate on a shared knowledge base?', a: 'Yes. Business and Enterprise plans support multi-user access with role-based permissions. Your team can ingest documents, tag knowledge, and query the system collaboratively. All access is logged in a full audit trail for compliance and governance.' },
            { q: 'How do you ensure the accuracy of knowledge retrieval?', a: 'Every response is grounded in verified source documents with deterministic audit trails. Our engines use doctrine-backed retrieval — not hallucination-prone generation — meaning every claim is traceable to a specific document, section, and version. Confidence scoring tells you how reliable each answer is.' },
            { q: 'Can I query across multiple domains simultaneously?', a: 'Absolutely. The cross-domain intelligence search routes your query to all relevant engines at once. A question about tax implications of a medical practice, for example, will pull doctrine from Tax, Legal, Medical, and Business engines simultaneously and synthesize a unified answer.' },
            { q: 'Is there an API for integrating Knowledge Forge into our applications?', a: 'Yes. All plans include REST API access for programmatic search, ingestion, and knowledge retrieval. The SDK provides client libraries for JavaScript/TypeScript, Python, and cURL. Enterprise customers get dedicated rate limits, custom endpoints, and service-level agreements.' },
          ].map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}

export default function KnowledgePage() {
  return <SubscriptionGate serviceId="knowledge-systems"><KnowledgePageContent /></SubscriptionGate>;
}
