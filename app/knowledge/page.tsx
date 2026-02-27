'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

const SERVICE_ID = 'knowledge-systems';

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

export default function KnowledgePage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    getServices().then(d => {
      const svc = d.services.find(s => s.id === SERVICE_ID);
      if (svc) setService(svc);
    }).catch(() => {});
  }, []);

  const handleCheckout = async (tierIndex: number) => {
    if (!user) { window.location.href = '/signup'; return; }
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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Knowledge Systems</div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>Your Organization&apos;s<br /><span className="gradient-text">Second Brain</span></h1>
        <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Proprietary knowledge graphs with tens of thousands of embedded reasoning blocks. Hybrid retrieval combining precision keyword search with semantic vector understanding.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href={user ? '/services' : '/signup'} className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
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
        <section className="max-w-5xl mx-auto px-6 pb-20">
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
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
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
          <Link href={user ? '/services' : '/signup'} className="inline-block px-10 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </section>

      {/* ─── Domain Intelligence Browser ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Intelligence Engine Query</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Search across all 210 knowledge domains, 2,632 engines, and 188K+ pre-compiled doctrines. Select a domain or search globally.</p>
          <EngineQueryPanel
            title="Cross-Domain Intelligence Search"
            placeholder="Search all 210 domains — tax, legal, cyber, engineering, medical, finance, AI/ML..."
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

      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}
