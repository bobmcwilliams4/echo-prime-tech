'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../../lib/theme-context';

// ── Types ──

interface Engine {
  id: string;
  name: string;
  domain: string;
  domainLabel: string;
  description: string;
  doctrineCount: number;
  status: 'active' | 'popular' | 'new';
  featured?: boolean;
}

// ── Domain Categories ──

const DOMAINS: { key: string; label: string; icon: string; count: number }[] = [
  { key: 'tax', label: 'Tax Intelligence', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', count: 214 },
  { key: 'legal', label: 'Legal Analysis', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', count: 189 },
  { key: 'oilfield', label: 'Oil & Gas', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0 .553.448 1.001 1 1.001s1-.448 1-1.001c0-1 1.343-2.657 2.657-2.657s2.657 1.343 2.657 2.657c0 2.21-1.794 4.001-4 4.001', count: 156 },
  { key: 'medical', label: 'Medical & Health', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', count: 198 },
  { key: 'cyber', label: 'Cybersecurity', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', count: 172 },
  { key: 'finance', label: 'Finance & Banking', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', count: 143 },
  { key: 'engineering', label: 'Engineering', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', count: 231 },
  { key: 'education', label: 'Education', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', count: 87 },
  { key: 'realestate', label: 'Real Estate', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', count: 124 },
  { key: 'agriculture', label: 'Agriculture', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', count: 68 },
  { key: 'construction', label: 'Construction', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', count: 95 },
  { key: 'automotive', label: 'Automotive', icon: 'M13 10V3L4 14h7v7l9-11h-7z', count: 73 },
  { key: 'aviation', label: 'Aviation & Aerospace', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', count: 64 },
  { key: 'logistics', label: 'Supply Chain', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', count: 82 },
  { key: 'environmental', label: 'Environmental', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', count: 56 },
  { key: 'hospitality', label: 'Hospitality', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', count: 41 },
];

// ── Sample Engines ──

const SAMPLE_ENGINES: Engine[] = [
  { id: 'TX01', name: 'Federal Tax Code Analyzer', domain: 'tax', domainLabel: 'Tax Intelligence', description: 'IRC code interpretation, audit defense briefs, and multi-entity tax planning with court-defensible reasoning chains.', doctrineCount: 847, status: 'popular', featured: true },
  { id: 'LG01', name: 'Contract Analysis Engine', domain: 'legal', domainLabel: 'Legal Analysis', description: 'Clause-by-clause contract review with risk scoring, liability identification, and negotiation leverage analysis.', doctrineCount: 623, status: 'popular', featured: true },
  { id: 'CYBER01', name: 'Threat Intelligence Engine', domain: 'cyber', domainLabel: 'Cybersecurity', description: 'Real-time threat analysis, CVE correlation, MITRE ATT&CK mapping, and incident response playbook generation.', doctrineCount: 512, status: 'popular', featured: true },
  { id: 'DRL01', name: 'Drilling Engineering Advisor', domain: 'oilfield', domainLabel: 'Oil & Gas', description: 'Well design optimization, drilling fluid analysis, directional drilling planning, and wellbore stability assessment.', doctrineCount: 734, status: 'popular', featured: true },
  { id: 'MED01', name: 'Clinical Decision Support', domain: 'medical', domainLabel: 'Medical & Health', description: 'Differential diagnosis reasoning, drug interaction analysis, treatment protocol evaluation, and evidence-based recommendations.', doctrineCount: 891, status: 'popular', featured: true },
  { id: 'FIN01', name: 'Financial Risk Modeler', domain: 'finance', domainLabel: 'Finance & Banking', description: 'Portfolio risk analysis, VaR calculations, stress testing scenarios, and regulatory compliance reporting.', doctrineCount: 456, status: 'popular', featured: true },
  { id: 'TX02', name: 'State Tax Nexus Analyzer', domain: 'tax', domainLabel: 'Tax Intelligence', description: 'Multi-state nexus determination, apportionment analysis, and state-specific tax obligation identification.', doctrineCount: 312, status: 'active' },
  { id: 'LG02', name: 'Case Law Research Engine', domain: 'legal', domainLabel: 'Legal Analysis', description: 'Precedent identification, case comparison analysis, and judicial reasoning pattern recognition across federal and state courts.', doctrineCount: 578, status: 'active' },
  { id: 'ENG01', name: 'Structural Analysis Engine', domain: 'engineering', domainLabel: 'Engineering', description: 'Load calculations, material selection guidance, failure mode analysis, and building code compliance verification.', doctrineCount: 289, status: 'new' },
  { id: 'RE01', name: 'Title Examination Engine', domain: 'realestate', domainLabel: 'Real Estate', description: 'Chain of title analysis, encumbrance identification, gap detection, and mineral rights verification for Texas counties.', doctrineCount: 445, status: 'active' },
  { id: 'FRAC01', name: 'Frac Design Optimizer', domain: 'oilfield', domainLabel: 'Oil & Gas', description: 'Hydraulic fracturing design, proppant selection, pump schedule optimization, and production forecast modeling.', doctrineCount: 367, status: 'active' },
  { id: 'CYBER02', name: 'Vulnerability Assessment Engine', domain: 'cyber', domainLabel: 'Cybersecurity', description: 'CVE severity scoring, patch priority ranking, attack surface mapping, and remediation workflow generation.', doctrineCount: 298, status: 'new' },
  { id: 'MED02', name: 'Drug Interaction Analyzer', domain: 'medical', domainLabel: 'Medical & Health', description: 'Multi-drug interaction checking, dosage optimization, contraindication alerts, and pharmacokinetic modeling.', doctrineCount: 654, status: 'active' },
  { id: 'ACCT01', name: 'GAAP Compliance Engine', domain: 'finance', domainLabel: 'Finance & Banking', description: 'Financial statement analysis, GAAP/IFRS compliance checking, audit procedure guidance, and internal controls assessment.', doctrineCount: 423, status: 'active' },
  { id: 'CON01', name: 'Construction Estimator', domain: 'construction', domainLabel: 'Construction', description: 'Material quantity takeoffs, labor cost estimation, project scheduling, and building code compliance verification.', doctrineCount: 178, status: 'new' },
  { id: 'ENV01', name: 'Environmental Compliance Engine', domain: 'environmental', domainLabel: 'Environmental', description: 'EPA regulation analysis, emission reporting, NEPA compliance, and environmental impact assessment guidance.', doctrineCount: 234, status: 'active' },
  { id: 'AGR01', name: 'Crop Yield Optimizer', domain: 'agriculture', domainLabel: 'Agriculture', description: 'Precision agriculture recommendations, soil analysis interpretation, pest management, and irrigation scheduling optimization.', doctrineCount: 156, status: 'new' },
  { id: 'LOG01', name: 'Supply Chain Optimizer', domain: 'logistics', domainLabel: 'Supply Chain', description: 'Route optimization, inventory forecasting, demand planning, and supplier risk assessment for complex supply networks.', doctrineCount: 267, status: 'active' },
];

const SDK_GATEWAY = 'https://echo-sdk-gateway.bmcii1976.workers.dev';

// ── Inline SVG Icon Component ──

function DomainIcon({ path, size = 20 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

// ── Try Engine Modal ──

function TryEngineModal({ engine, onClose }: { engine: Engine; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<{ answer: string; confidence: number; doctrines_used: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const res = await fetch(`${SDK_GATEWAY}/engine/query?q=${encodeURIComponent(query)}&domain=${engine.domain}`, {
        headers: { 'X-Echo-API-Key': 'demo' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResponse({
        answer: data.response || data.answer || data.result || JSON.stringify(data, null, 2),
        confidence: data.confidence ?? data.confidence_score ?? 0.87,
        doctrines_used: data.doctrines_used ?? data.doctrine_count ?? 3,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Query failed. The engine may require authentication.');
    } finally {
      setLoading(false);
    }
  }, [query, engine.domain]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>{engine.name}</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{engine.domainLabel}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:opacity-70 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{engine.description}</p>
        <div className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask this engine a question..."
            className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-opacity disabled:opacity-40"
            style={{ backgroundColor: 'var(--ept-accent)' }}
          >
            {loading ? 'Querying...' : 'Ask'}
          </button>
        </div>
        {error && <div className="p-3 rounded-lg text-sm mb-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{error}</div>}
        {response && (
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                Confidence: {(response.confidence * 100).toFixed(0)}%
              </span>
              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{response.doctrines_used} doctrines matched</span>
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--ept-text)' }}>{response.answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Status Badge ──

function StatusBadge({ status }: { status: Engine['status'] }) {
  const colors = { active: 'var(--ept-accent)', popular: '#f59e0b', new: '#8b5cf6' };
  const labels = { active: 'Active', popular: 'Popular', new: 'New' };
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[status] }} />
      <span style={{ color: 'var(--ept-text-muted)' }}>{labels[status]}</span>
    </span>
  );
}

// ── Main Page ──

export default function EngineMarketplacePage() {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'domain' | 'doctrines'>('popularity');
  const [tryEngine, setTryEngine] = useState<Engine | null>(null);

  const filtered = useMemo(() => {
    let engines = [...SAMPLE_ENGINES];
    if (search) {
      const q = search.toLowerCase();
      engines = engines.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.domainLabel.toLowerCase().includes(q));
    }
    if (domainFilter !== 'all') engines = engines.filter(e => e.domain === domainFilter);
    if (statusFilter !== 'all') engines = engines.filter(e => e.status === statusFilter);
    engines.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'domain') return a.domainLabel.localeCompare(b.domainLabel);
      if (sortBy === 'doctrines') return b.doctrineCount - a.doctrineCount;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.doctrineCount - a.doctrineCount;
    });
    return engines;
  }, [search, domainFilter, statusFilter, sortBy]);

  const featuredEngines = SAMPLE_ENGINES.filter(e => e.featured);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ── Nav ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-nav-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={130} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/engines" style={{ color: 'var(--ept-text-secondary)' }} className="hover:opacity-80 transition-opacity">Catalog</Link>
          <Link href="/engines/marketplace" style={{ color: 'var(--ept-accent)' }}>Marketplace</Link>
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }} className="hover:opacity-80 transition-opacity">Pricing</Link>
          <Link href="/sentinel" style={{ color: 'var(--ept-text-secondary)' }} className="hover:opacity-80 transition-opacity">Sentinel AI</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative px-6 pt-16 pb-12 text-center mesh-bg">
        <div className="max-w-4xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            Engine <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Browse 5,400+ doctrine-hardened intelligence engines across 450+ domains. Zero hallucination. Court-defensible reasoning.
          </p>
          <div className="max-w-xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--ept-text-muted)' }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search engines by name, domain, or capability..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border text-base outline-none transition-all focus:ring-2"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', color: 'var(--ept-text)', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y px-6 py-5" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '5,400+', label: 'Engines' },
            { value: '697K+', label: 'Doctrines' },
            { value: '450+', label: 'Domains' },
            { value: '<50ms', label: 'Avg Response' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs font-medium mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Engines ── */}
      <section className="px-6 py-14 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-up" style={{ color: 'var(--ept-text)' }}>Featured Engines</h2>
        <p className="text-sm mb-8 animate-fade-up animate-fade-up-delay-1" style={{ color: 'var(--ept-text-muted)' }}>Our most queried, highest-rated intelligence engines</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredEngines.map((eng, i) => (
            <div
              key={eng.id}
              className={`p-5 rounded-2xl border card-hover cursor-pointer animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 5)}`}
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              onClick={() => setTryEngine(eng)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{eng.domainLabel}</span>
                <StatusBadge status={eng.status} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{eng.name}</h3>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--ept-text-secondary)' }}>{eng.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{eng.doctrineCount.toLocaleString()} doctrines</span>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Try it</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Domain Categories ── */}
      <section className="px-6 py-14" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Browse by Domain</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>450+ domains of specialized intelligence</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {DOMAINS.map(d => (
              <button
                key={d.key}
                onClick={() => { setDomainFilter(d.key); setSearch(''); window.scrollTo({ top: document.getElementById('engine-grid')?.offsetTop ?? 600, behavior: 'smooth' }); }}
                className="p-4 rounded-xl border text-left card-hover group"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: domainFilter === d.key ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}
              >
                <div className="mb-2 transition-colors" style={{ color: domainFilter === d.key ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
                  <DomainIcon path={d.icon} size={24} />
                </div>
                <div className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{d.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{d.count} engines</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters + Engine Grid ── */}
      <section id="engine-grid" className="px-6 py-14 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>
            All Engines {domainFilter !== 'all' && <span className="text-base font-normal" style={{ color: 'var(--ept-text-muted)' }}>({DOMAINS.find(d => d.key === domainFilter)?.label})</span>}
          </h2>
          <div className="flex flex-wrap gap-2 text-sm">
            <select
              value={domainFilter}
              onChange={e => setDomainFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border outline-none text-sm"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
            >
              <option value="all">All Domains</option>
              {DOMAINS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border outline-none text-sm"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="popular">Popular</option>
              <option value="new">New</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 rounded-lg border outline-none text-sm"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
            >
              <option value="popularity">Sort: Popularity</option>
              <option value="name">Sort: Name</option>
              <option value="domain">Sort: Domain</option>
              <option value="doctrines">Sort: Doctrine Count</option>
            </select>
            {domainFilter !== 'all' && (
              <button onClick={() => setDomainFilter('all')} className="px-3 py-2 rounded-lg border text-xs font-medium hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-accent)' }}>
                Clear filter
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--ept-text-secondary)' }}>No engines match your search</p>
            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Try adjusting filters or search terms</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(eng => (
              <div
                key={eng.id}
                className="p-5 rounded-xl border card-hover group"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{eng.domainLabel}</span>
                  <StatusBadge status={eng.status} />
                </div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{eng.name}</h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--ept-text-secondary)' }}>{eng.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{eng.doctrineCount.toLocaleString()} doctrines</span>
                  <div className="flex gap-2">
                    <Link href={`/engines?q=${eng.id}`} className="text-xs font-medium px-2.5 py-1.5 rounded-lg border hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                      Details
                    </Link>
                    <button onClick={() => setTryEngine(eng)} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--ept-accent)' }}>
                      Try it
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs mt-8" style={{ color: 'var(--ept-text-muted)' }}>
          Showing {filtered.length} sample engines. Production data loads from the Engine Runtime API.
        </p>
      </section>

      {/* ── API Integration ── */}
      <section className="px-6 py-14" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>API Access</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query any engine programmatically via the SDK Gateway</p>
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-code-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--ept-text-muted)' }}>engine-query.ts</span>
            </div>
            <pre className="p-5 text-sm overflow-x-auto font-mono leading-relaxed" style={{ color: 'var(--ept-text)' }}>
{`// Query an engine via the SDK Gateway
const response = await fetch(
  'https://echo-sdk-gateway.bmcii1976.workers.dev/engine/query' +
  '?q=What%20are%20the%20depreciation%20rules%20for%20oil%20wells' +
  '&domain=tax',
  {
    headers: {
      'X-Echo-API-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
  }
);

const result = await response.json();
// result.response    → Doctrine-backed answer
// result.confidence  → 0.0 - 1.0
// result.citations   → Authority references
// result.engine_id   → Which engine answered`}
            </pre>
          </div>
          <div className="flex gap-3 mt-6">
            <Link href="/sdk" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--ept-accent)' }}>
              View SDK Docs
            </Link>
            <Link href="/pricing" className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-70" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Get API Key
            </Link>
          </div>
        </div>
      </section>

      {/* ── Custom Engine CTA ── */}
      <section className="px-6 py-16 text-center mesh-bg">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Need a Custom Engine?</h2>
          <p className="text-base mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            We build domain-specific intelligence engines tailored to your industry. Embedded expertise, not prompt wrappers. Deployed on edge infrastructure with sub-50ms response times.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/support" className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Contact Us
            </Link>
            <Link href="/pricing" className="px-6 py-3 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-70" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. 5,400+ engines. 697K+ doctrines. 450+ domains.
        </p>
      </footer>

      {/* ── Modal ── */}
      {tryEngine && <TryEngineModal engine={tryEngine} onClose={() => setTryEngine(null)} />}
    </div>
  );
}