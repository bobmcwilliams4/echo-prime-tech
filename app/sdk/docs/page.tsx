'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
interface Param { name: string; type: string; required: boolean; description: string }
interface Endpoint {
  id: string; method: 'GET'|'POST'|'PUT'|'DELETE'; path: string;
  description: string; params?: Param[]; body?: Param[];
  curl: string; response: string; section: string;
}
interface Section { id: string; label: string; endpoints: Endpoint[] }

// ── Constants ──────────────────────────────────────────────────────────────
const BASE = 'https://echo-sdk-gateway.bmcii1976.workers.dev';
const METHOD_CLS: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

// ── Endpoint Data ──────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  { id: 'engines', label: 'Engines', endpoints: [
    { id:'eq', method:'GET', path:'/engine/query', section:'engines',
      description:'Query intelligence engines with natural language. Routes to the best-matching engine based on domain detection and returns doctrine-backed analysis.',
      params:[{name:'q',type:'string',required:true,description:'Natural language query'},{name:'domain',type:'string',required:false,description:'Filter to specific domain (tax, legal, cyber, etc.)'},{name:'mode',type:'string',required:false,description:'Response mode: FAST, DEFENSE, or MEMO'}],
      curl:`curl -s "${BASE}/engine/query?q=What%20is%20IRC%20Section%20179&domain=tax" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "answer": "IRC Section 179 allows businesses to deduct the full purchase price...",\n    "engine_id": "TX01",\n    "domain": "tax",\n    "confidence": "DEFENSIBLE",\n    "authorities": ["IRC §179", "Rev. Proc. 2023-34"],\n    "latency_ms": 38\n  },\n  "meta": { "ts": "2026-03-20T00:00:00Z", "version": "3.0.0", "service": "sdk-gateway" }\n}` },
    { id:'eqb', method:'POST', path:'/engine/query-batch', section:'engines',
      description:'Submit multiple queries in a single request. Each query is routed independently to the appropriate engine.',
      body:[{name:'queries',type:'array',required:true,description:'Array of {q, domain?, mode?} objects (max 10)'},{name:'parallel',type:'boolean',required:false,description:'Execute queries in parallel (default: true)'}],
      curl:`curl -s -X POST "${BASE}/engine/query-batch" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"queries":[{"q":"IRC 179 limits","domain":"tax"},{"q":"OSHA fall protection","domain":"safety"}]}'`,
      response:`{\n  "success": true,\n  "data": {\n    "results": [\n      { "q": "IRC 179 limits", "engine_id": "TX01", "answer": "..." },\n      { "q": "OSHA fall protection", "engine_id": "SF02", "answer": "..." }\n    ],\n    "total_latency_ms": 84\n  }\n}` },
    { id:'el', method:'GET', path:'/engine/list', section:'engines',
      description:'List all available intelligence engines, optionally filtered by domain.',
      params:[{name:'domain',type:'string',required:false,description:'Filter by domain (tax, legal, oilfield, etc.)'},{name:'limit',type:'number',required:false,description:'Max results (default: 50)'},{name:'offset',type:'number',required:false,description:'Pagination offset'}],
      curl:`curl -s "${BASE}/engine/list?domain=legal&limit=5" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "engines": [\n      { "engine_id": "LG01", "name": "Contract Analysis", "domain": "legal", "doctrines": 142 },\n      { "engine_id": "LG02", "name": "Case Law Research", "domain": "legal", "doctrines": 98 }\n    ],\n    "total": 18,\n    "domains": ["legal"]\n  }\n}` },
    { id:'es', method:'GET', path:'/engine/search', section:'engines',
      description:'Full-text search across engine names, descriptions, and doctrine topics.',
      params:[{name:'q',type:'string',required:true,description:'Search keyword'},{name:'limit',type:'number',required:false,description:'Max results (default: 10)'}],
      curl:`curl -s "${BASE}/engine/search?q=drilling&limit=5" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "results": [\n      { "engine_id": "DRL01", "name": "Drilling Operations", "score": 0.97 },\n      { "engine_id": "DRL03", "name": "Directional Drilling", "score": 0.82 }\n    ]\n  }\n}` },
    { id:'em', method:'GET', path:'/engine/metadata', section:'engines',
      description:'Get detailed metadata for a specific engine including doctrine count, domain, and capabilities.',
      params:[{name:'engine_id',type:'string',required:true,description:'Engine identifier (e.g., TX01, LG05)'}],
      curl:`curl -s "${BASE}/engine/metadata?engine_id=TX01" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "engine_id": "TX01",\n    "name": "Tax Intelligence Engine",\n    "domain": "tax",\n    "doctrines": 374,\n    "version": "1.2.0",\n    "modes": ["FAST","DEFENSE","MEMO"],\n    "authority_sources": ["IRC","Treasury Regs","Case Law"]\n  }\n}` },
    { id:'ec', method:'GET', path:'/engine/status', section:'engines',
      description:'Get real-time engine runtime status including total engines, domains, and system health.',
      curl:`curl -s "${BASE}/engine/status" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "total_engines": 5486,\n    "total_doctrines": 529977,\n    "domains": 940,\n    "status": "operational",\n    "avg_latency_ms": 35\n  }\n}` },
  ]},
  { id: 'knowledge', label: 'Knowledge', endpoints: [
    { id:'ks', method:'POST', path:'/knowledge/search', section:'knowledge',
      description:'Semantic search across the knowledge base. Returns relevant document chunks ranked by similarity.',
      body:[{name:'query',type:'string',required:true,description:'Search query'},{name:'limit',type:'number',required:false,description:'Max results (default: 10)'},{name:'category',type:'string',required:false,description:'Filter by category'}],
      curl:`curl -s -X POST "${BASE}/knowledge/search" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"query":"Cloudflare D1 migration patterns","limit":5}'`,
      response:`{\n  "success": true,\n  "data": {\n    "results": [\n      { "title": "D1 Database Migration Guide", "category": "cloudflare", "score": 0.94, "chunk": "..." },\n      { "title": "Workers D1 Bindings", "category": "cloudflare", "score": 0.87, "chunk": "..." }\n    ],\n    "total_chunks": 75000\n  }\n}` },
    { id:'kc', method:'GET', path:'/knowledge/categories', section:'knowledge',
      description:'List all knowledge base categories with document counts.',
      curl:`curl -s "${BASE}/knowledge/categories" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "categories": [\n      { "name": "tax", "documents": 312, "chunks": 4200 },\n      { "name": "cloudflare", "documents": 65, "chunks": 337 },\n      { "name": "legal", "documents": 180, "chunks": 2100 }\n    ],\n    "total_categories": 218\n  }\n}` },
    { id:'ki', method:'POST', path:'/knowledge/ingest', section:'knowledge',
      description:'Ingest a new document into the knowledge base. The document is automatically chunked, embedded, and indexed.',
      body:[{name:'title',type:'string',required:true,description:'Document title'},{name:'content',type:'string',required:true,description:'Full document text'},{name:'category',type:'string',required:true,description:'Category for classification'}],
      curl:`curl -s -X POST "${BASE}/knowledge/ingest" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"title":"API Best Practices","content":"Document body here...","category":"engineering"}'`,
      response:`{\n  "success": true,\n  "data": {\n    "doc_id": "doc_a1b2c3",\n    "chunks_created": 12,\n    "category": "engineering"\n  }\n}` },
  ]},
  { id: 'brain', label: 'Brain', endpoints: [
    { id:'bi', method:'POST', path:'/brain/ingest', section:'brain',
      description:'Store a memory in the Shared Brain. Memories are semantically indexed and available across all services.',
      body:[{name:'content',type:'string',required:true,description:'Memory content to store'},{name:'importance',type:'number',required:false,description:'Importance score 1-10 (default: 5)'},{name:'tags',type:'array',required:false,description:'String tags for categorization'}],
      curl:`curl -s -X POST "${BASE}/brain/ingest" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"content":"Deployed new feature X with Y architecture","importance":7,"tags":["deploy","feature"]}'`,
      response:`{\n  "success": true,\n  "data": {\n    "message_id": "msg_x7k9p2",\n    "importance": 7,\n    "indexed": true\n  }\n}` },
    { id:'bs', method:'POST', path:'/brain/search', section:'brain',
      description:'Semantic search across all stored memories. Returns results ranked by relevance with importance weighting.',
      body:[{name:'query',type:'string',required:true,description:'Search query'},{name:'limit',type:'number',required:false,description:'Max results (default: 10)'}],
      curl:`curl -s -X POST "${BASE}/brain/search" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"query":"deployment architecture decisions","limit":5}'`,
      response:`{\n  "success": true,\n  "data": {\n    "results": [\n      { "content": "Deployed new feature X...", "importance": 7, "tags": ["deploy"], "score": 0.92 }\n    ]\n  }\n}` },
    { id:'br', method:'GET', path:'/brain/recall', section:'brain',
      description:'Recall a specific memory by key. Used for structured key-value storage alongside semantic memory.',
      params:[{name:'key',type:'string',required:true,description:'Memory key to recall'}],
      curl:`curl -s "${BASE}/brain/recall?key=CURRENT_FOCUS" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "key": "CURRENT_FOCUS",\n    "value": { "task": "Building SDK", "domain": "infrastructure" },\n    "updated_at": "2026-03-20T00:00:00Z"\n  }\n}` },
    { id:'bst', method:'POST', path:'/brain/store', section:'brain',
      description:'Store a key-value pair in the Brain. Overwrites any existing value for the same key.',
      body:[{name:'key',type:'string',required:true,description:'Storage key'},{name:'value',type:'any',required:true,description:'Value to store (string, object, or array)'}],
      curl:`curl -s -X POST "${BASE}/brain/store" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"key":"MY_CONFIG","value":{"setting":"enabled"}}'`,
      response:`{\n  "success": true,\n  "data": {\n    "key": "MY_CONFIG",\n    "stored": true\n  }\n}` },
    { id:'bstat', method:'GET', path:'/brain/stats', section:'brain',
      description:'Get memory statistics including total messages, storage usage, and index health.',
      curl:`curl -s "${BASE}/brain/stats" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "total_messages": 9200,\n    "vectorize_indexed": 8950,\n    "kv_keys": 340,\n    "storage_mb": 128\n  }\n}` },
  ]},
  { id: 'doctrine', label: 'Doctrine', endpoints: [
    { id:'dg', method:'POST', path:'/doctrine/generate', section:'doctrine',
      description:'Generate new doctrine blocks for a given domain and topic using free LLM providers.',
      body:[{name:'domain',type:'string',required:true,description:'Target domain (tax, legal, cyber, etc.)'},{name:'topic',type:'string',required:true,description:'Specific topic for doctrine generation'},{name:'provider',type:'string',required:false,description:'LLM provider (default: auto-select from free tier)'}],
      curl:`curl -s -X POST "${BASE}/doctrine/generate" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"domain":"tax","topic":"Section 1031 like-kind exchanges"}'`,
      response:`{\n  "success": true,\n  "data": {\n    "doctrine_id": "doc_1031_lke",\n    "domain": "tax",\n    "topic": "Section 1031 like-kind exchanges",\n    "blocks_generated": 3,\n    "provider": "deepseek-v3"\n  }\n}` },
    { id:'dl', method:'GET', path:'/doctrine/list', section:'doctrine',
      description:'List doctrine blocks, optionally filtered by domain.',
      params:[{name:'domain',type:'string',required:false,description:'Filter by domain'},{name:'limit',type:'number',required:false,description:'Max results (default: 50)'}],
      curl:`curl -s "${BASE}/doctrine/list?domain=tax&limit=5" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "doctrines": [\n      { "id": "tx_179", "topic": "IRC Section 179", "domain": "tax", "confidence": "DEFENSIBLE" }\n    ],\n    "total": 449000\n  }\n}` },
    { id:'dp', method:'GET', path:'/doctrine/providers', section:'doctrine',
      description:'List available LLM providers for doctrine generation with their status and rate limits.',
      curl:`curl -s "${BASE}/doctrine/providers" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "providers": [\n      { "name": "deepseek-v3", "status": "available", "free": true },\n      { "name": "workers-ai-llama", "status": "available", "free": true },\n      { "name": "together-mixtral", "status": "available", "free": true }\n    ]\n  }\n}` },
    { id:'ds', method:'GET', path:'/doctrine/search', section:'doctrine',
      description:'Search doctrine blocks by keyword across all domains.',
      params:[{name:'q',type:'string',required:true,description:'Search query'},{name:'domain',type:'string',required:false,description:'Filter by domain'},{name:'limit',type:'number',required:false,description:'Max results (default: 10)'}],
      curl:`curl -s "${BASE}/doctrine/search?q=depreciation&domain=tax&limit=5" \\\n  -H "X-Echo-API-Key: YOUR_KEY"`,
      response:`{\n  "success": true,\n  "data": {\n    "results": [\n      { "id": "tx_macrs", "topic": "MACRS Depreciation", "domain": "tax", "score": 0.95 }\n    ]\n  }\n}` },
  ]},
  { id: 'chat', label: 'Chat', endpoints: [
    { id:'ch', method:'POST', path:'/chat', section:'chat',
      description:'Chat with an AI personality. Supports 14 distinct personalities with different expertise and tone.',
      body:[{name:'message',type:'string',required:true,description:'User message'},{name:'personality',type:'string',required:false,description:'AI personality: echo_prime, bree, nexus, sage, prometheus, gs343, phoenix, raven, warmaster, belle, thinker, tech_expert, r2, third_person'},{name:'context',type:'array',required:false,description:'Previous messages [{role, content}] for conversation context'}],
      curl:`curl -s -X POST "${BASE}/chat" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message":"Explain edge computing benefits","personality":"nexus"}'`,
      response:`{\n  "success": true,\n  "data": {\n    "reply": "Edge computing reduces latency by processing data closer to...",\n    "personality": "nexus",\n    "model": "gpt-4.1",\n    "tokens_used": 340\n  }\n}` },
  ]},
  { id: 'search', label: 'Search', endpoints: [
    { id:'su', method:'POST', path:'/search', section:'search',
      description:'Unified search across engines, knowledge base, and brain memory. Returns combined results ranked by relevance.',
      body:[{name:'query',type:'string',required:true,description:'Search query'},{name:'sources',type:'array',required:false,description:'Sources to search: ["engines","knowledge","brain"] (default: all)'},{name:'limit',type:'number',required:false,description:'Max results per source (default: 5)'}],
      curl:`curl -s -X POST "${BASE}/search" \\\n  -H "X-Echo-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"query":"MACRS depreciation","sources":["engines","knowledge"],"limit":3}'`,
      response:`{\n  "success": true,\n  "data": {\n    "engines": [{ "engine_id": "TX01", "match": "MACRS Depreciation", "score": 0.96 }],\n    "knowledge": [{ "title": "IRS Pub 946", "score": 0.91 }],\n    "brain": [],\n    "total": 2\n  }\n}` },
  ]},
  { id: 'health', label: 'Health', endpoints: [
    { id:'hc', method:'GET', path:'/health', section:'health',
      description:'Gateway health check. Returns service status, version, uptime, and downstream dependency health. No authentication required.',
      curl:`curl -s "${BASE}/health"`,
      response:`{\n  "success": true,\n  "data": {\n    "status": "operational",\n    "version": "3.0.0",\n    "uptime_s": 864000,\n    "services": {\n      "engine_runtime": "healthy",\n      "shared_brain": "healthy",\n      "knowledge_forge": "healthy",\n      "doctrine_forge": "healthy",\n      "echo_chat": "healthy"\n    }\n  }\n}` },
  ]},
];

const NAV_ITEMS = [
  { id: 'auth', label: 'Authentication' },
  ...SECTIONS.map(s => ({ id: s.id, label: `${s.label} (${s.endpoints.length})` })),
  { id: 'envelope', label: 'Response Format' },
  { id: 'errors', label: 'Error Codes' },
  { id: 'rate-limits', label: 'Rate Limits' },
  { id: 'sdks', label: 'SDK / Quick Start' },
];

// ── Code Block Component ───────────────────────────────────────────────────
function Code({ children, label }: { children: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="relative group rounded-lg overflow-hidden border border-zinc-800 my-3">
      {label && <div className="px-3 py-1.5 text-[11px] font-medium text-zinc-500 bg-zinc-900/80 border-b border-zinc-800 uppercase tracking-wider">{label}</div>}
      <pre className="bg-zinc-950 p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-zinc-300"><code>{children}</code></pre>
      <button onClick={copy} className="absolute top-2 right-2 px-2 py-1 rounded text-[11px] bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700">{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

// ── Method Badge ───────────────────────────────────────────────────────────
function Badge({ method }: { method: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded text-[12px] font-bold font-mono border ${METHOD_CLS[method] || ''}`}>{method}</span>;
}

// ── Params Table ───────────────────────────────────────────────────────────
function ParamTable({ params, title }: { params: Param[]; title: string }) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-zinc-300 mb-2">{title}</h4>
      <div className="border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-[13px]">
          <thead><tr className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800">
            <th className="text-left px-3 py-2 font-medium">Name</th>
            <th className="text-left px-3 py-2 font-medium">Type</th>
            <th className="text-left px-3 py-2 font-medium">Required</th>
            <th className="text-left px-3 py-2 font-medium">Description</th>
          </tr></thead>
          <tbody>{params.map(p => (
            <tr key={p.name} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
              <td className="px-3 py-2 font-mono text-teal-400">{p.name}</td>
              <td className="px-3 py-2 text-zinc-500">{p.type}</td>
              <td className="px-3 py-2">{p.required ? <span className="text-amber-400 text-[11px] font-semibold">Required</span> : <span className="text-zinc-600">Optional</span>}</td>
              <td className="px-3 py-2 text-zinc-400">{p.description}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── Endpoint Block ─────────────────────────────────────────────────────────
function EndpointBlock({ ep }: { ep: Endpoint }) {
  return (
    <div id={ep.id} className="mb-10 scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <Badge method={ep.method} />
        <code className="text-[15px] font-mono text-zinc-200">{ep.path}</code>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed mb-4">{ep.description}</p>
      {ep.params && ep.params.length > 0 && <ParamTable params={ep.params} title="Query Parameters" />}
      {ep.body && ep.body.length > 0 && <ParamTable params={ep.body} title="Request Body (JSON)" />}
      <Code label="Request">{ep.curl}</Code>
      <Code label="Response">{ep.response}</Code>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function SDKDocsPage() {
  const [activeSection, setActiveSection] = useState('auth');
  const [mobileNav, setMobileNav] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { setActiveSection(entry.target.id); break; }
      }
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 });
    const ids = ['auth', ...SECTIONS.map(s => s.id), 'envelope', 'errors', 'rate-limits', 'sdks'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNav(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#e2e8f0' }}>
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,10,10,0.85)' }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/sdk" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">SDK</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-sm font-semibold text-zinc-200">API Reference</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="hidden sm:block text-[11px] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono">v3.0.0</code>
            <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Sidebar */}
        <aside className={`${mobileNav ? 'block fixed inset-0 top-14 z-40 bg-zinc-950/95 backdrop-blur-sm p-6' : 'hidden'} md:block md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-56 md:shrink-0 md:overflow-y-auto md:py-6 md:pl-4 md:pr-2`}>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className={`block w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${activeSection === item.id ? 'bg-teal-500/10 text-teal-400 font-medium' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main ref={mainRef} className="flex-1 min-w-0 px-4 md:px-10 py-10 md:py-12">
          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">API Reference</h1>
            <p className="text-zinc-400 text-base mb-4 max-w-2xl">Complete reference for the Echo Prime SDK Gateway. Access 5,486+ intelligence engines, 170K+ knowledge chunks, semantic memory, doctrine generation, and multi-personality AI chat through a single unified API.</p>
            <div className="flex flex-wrap gap-2 items-center">
              <code className="text-[13px] px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">{BASE}</code>
              <span className="text-[12px] text-zinc-600">|</span>
              <span className="text-[12px] text-zinc-500">REST + JSON</span>
              <span className="text-[12px] text-zinc-600">|</span>
              <span className="text-[12px] text-zinc-500">21 Endpoints</span>
            </div>
          </div>

          {/* Authentication */}
          <section id="auth" className="mb-14 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-zinc-100">Authentication</h2>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">All endpoints (except <code className="text-teal-400 text-[13px]">/health</code>) require an API key. Include it in every request as a header:</p>
            <Code label="Header">{`X-Echo-API-Key: your_api_key_here`}</Code>
            <p className="text-sm text-zinc-500 mt-3">Alternatively, you can use <code className="text-zinc-400 text-[13px]">Authorization: Bearer your_api_key_here</code>. Get your API key at <Link href="/sdk/signup" className="text-teal-400 hover:underline">/sdk/signup</Link>.</p>
          </section>

          {/* Endpoint Sections */}
          {SECTIONS.map(section => (
            <section key={section.id} id={section.id} className="mb-14 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-zinc-100">{section.label}</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-medium">{section.endpoints.length} endpoint{section.endpoints.length > 1 ? 's' : ''}</span>
              </div>
              {section.endpoints.map(ep => <EndpointBlock key={ep.id} ep={ep} />)}
            </section>
          ))}

          {/* Response Envelope */}
          <section id="envelope" className="mb-14 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-zinc-100">Response Format</h2>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">Every response follows a consistent JSON envelope. On success, <code className="text-teal-400">success</code> is <code className="text-teal-400">true</code> and <code className="text-teal-400">data</code> contains the result. On failure, <code className="text-red-400">success</code> is <code className="text-red-400">false</code> and <code className="text-red-400">error</code> contains the error details.</p>
            <Code label="Success">{`{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "ts": "2026-03-20T14:30:00Z",
    "version": "3.0.0",
    "service": "sdk-gateway",
    "latency_ms": 42
  }
}`}</Code>
            <Code label="Error">{`{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Missing or invalid API key"
  },
  "meta": {
    "ts": "2026-03-20T14:30:00Z",
    "version": "3.0.0",
    "service": "sdk-gateway"
  }
}`}</Code>
          </section>

          {/* Error Codes */}
          <section id="errors" className="mb-14 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-zinc-100">Error Codes</h2>
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-[13px]">
                <thead><tr className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800">
                  <th className="text-left px-4 py-2.5 font-medium">HTTP</th>
                  <th className="text-left px-4 py-2.5 font-medium">Code</th>
                  <th className="text-left px-4 py-2.5 font-medium">Description</th>
                </tr></thead>
                <tbody>
                  {[
                    ['401','AUTH_REQUIRED','Missing or invalid X-Echo-API-Key header'],
                    ['403','FORBIDDEN','API key does not have permission for this endpoint'],
                    ['404','NOT_FOUND','Endpoint or resource does not exist'],
                    ['422','VALIDATION_ERROR','Request body or parameters failed validation'],
                    ['429','RATE_LIMITED','Too many requests. Check Rate Limits section below'],
                    ['500','INTERNAL_ERROR','Unexpected server error. Contact support if persistent'],
                    ['502','UPSTREAM_ERROR','A downstream service (engine, brain, etc.) is unavailable'],
                    ['503','SERVICE_UNAVAILABLE','Gateway is temporarily overloaded or in maintenance'],
                  ].map(([http, code, desc]) => (
                    <tr key={code} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
                      <td className="px-4 py-2.5 font-mono text-amber-400">{http}</td>
                      <td className="px-4 py-2.5 font-mono text-red-400">{code}</td>
                      <td className="px-4 py-2.5 text-zinc-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="mb-14 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-zinc-100">Rate Limits</h2>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">Rate limits are applied per API key. Exceeded limits return HTTP 429 with a <code className="text-zinc-300">Retry-After</code> header.</p>
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-[13px]">
                <thead><tr className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800">
                  <th className="text-left px-4 py-2.5 font-medium">Tier</th>
                  <th className="text-left px-4 py-2.5 font-medium">Daily Limit</th>
                  <th className="text-left px-4 py-2.5 font-medium">Per-Minute</th>
                  <th className="text-left px-4 py-2.5 font-medium">Batch Size</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Free','100 requests','10','3 queries'],
                    ['Pro','10,000 requests','100','10 queries'],
                    ['Enterprise','Unlimited','1,000','50 queries'],
                  ].map(([tier, daily, minute, batch]) => (
                    <tr key={tier} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
                      <td className="px-4 py-2.5 font-semibold text-zinc-200">{tier}</td>
                      <td className="px-4 py-2.5 text-zinc-400">{daily}</td>
                      <td className="px-4 py-2.5 text-zinc-400">{minute}</td>
                      <td className="px-4 py-2.5 text-zinc-400">{batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] text-zinc-600 mt-3">Rate limit headers are included in every response: <code className="text-zinc-500">X-RateLimit-Remaining</code>, <code className="text-zinc-500">X-RateLimit-Reset</code>.</p>
          </section>

          {/* SDK / Quick Start */}
          <section id="sdks" className="mb-14 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-zinc-100">SDK / Quick Start</h2>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">Get started in seconds with any language. The API accepts and returns JSON over HTTPS.</p>

            <h3 className="text-sm font-semibold text-zinc-300 mb-2">TypeScript / JavaScript</h3>
            <Code label="TypeScript">{`const SDK_URL = '${BASE}';
const API_KEY = 'your_api_key';

async function queryEngine(q: string, domain?: string) {
  const params = new URLSearchParams({ q });
  if (domain) params.set('domain', domain);
  const res = await fetch(\`\${SDK_URL}/engine/query?\${params}\`, {
    headers: { 'X-Echo-API-Key': API_KEY },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
}

// Usage
const result = await queryEngine('What is IRC Section 179?', 'tax');
console.log(result.answer);`}</Code>

            <h3 className="text-sm font-semibold text-zinc-300 mb-2 mt-6">Python</h3>
            <Code label="Python">{`import requests

SDK_URL = '${BASE}'
API_KEY = 'your_api_key'
HEADERS = {'X-Echo-API-Key': API_KEY, 'Content-Type': 'application/json'}

# Query an engine
resp = requests.get(f'{SDK_URL}/engine/query',
    params={'q': 'What is IRC Section 179?', 'domain': 'tax'},
    headers=HEADERS)
data = resp.json()['data']
print(data['answer'])

# Search knowledge base
resp = requests.post(f'{SDK_URL}/knowledge/search',
    json={'query': 'MACRS depreciation', 'limit': 5},
    headers=HEADERS)
for r in resp.json()['data']['results']:
    print(f"{r['title']} (score: {r['score']})")`}</Code>

            <h3 className="text-sm font-semibold text-zinc-300 mb-2 mt-6">cURL</h3>
            <Code label="Shell">{`# Query an engine
curl -s "${BASE}/engine/query?q=OSHA+fall+protection&domain=safety" \\
  -H "X-Echo-API-Key: YOUR_KEY" | jq .

# Chat with an AI personality
curl -s -X POST "${BASE}/chat" \\
  -H "X-Echo-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Explain edge computing","personality":"nexus"}' | jq .

# Health check (no auth required)
curl -s "${BASE}/health" | jq .`}</Code>
          </section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-wrap gap-6 text-[13px] text-zinc-500">
            <Link href="/sdk" className="hover:text-teal-400 transition-colors">SDK Overview</Link>
            <Link href="/sdk/signup" className="hover:text-teal-400 transition-colors">Get API Key</Link>
            <Link href="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link>
            <Link href="/support" className="hover:text-teal-400 transition-colors">Support</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
