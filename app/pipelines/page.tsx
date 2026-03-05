'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';
import SubscriptionGate from '../../components/SubscriptionGate';

const SERVICE_ID = 'data-pipelines';

const FEATURES = [
  { icon: '\u26A1', title: 'Autonomous Extraction', desc: 'Systems that find, extract, and normalize data from thousands of sources without human intervention. Running 24/7.' },
  { icon: '\uD83C\uDF10', title: 'Multi-Source Ingestion', desc: 'County records, public filings, market data, government databases, web scraping, API aggregation, and more. 50+ source types supported.' },
  { icon: '\uD83D\uDD04', title: 'Real-Time Sync', desc: 'Keep your data current with configurable sync intervals from real-time to daily. Automatic change detection and delta updates.' },
  { icon: '\uD83E\uDDE9', title: 'Custom Transformations', desc: 'ETL pipelines that clean, normalize, deduplicate, and enrich your data. Custom schemas and mapping rules.' },
  { icon: '\uD83D\uDCE6', title: 'Flexible Delivery', desc: 'Get your data via REST API, webhooks, CSV/JSON export, database replication, or direct S3/R2 bucket delivery.' },
  { icon: '\uD83D\uDEE1\uFE0F', title: 'Data Quality Gates', desc: 'Automated validation, schema enforcement, completeness checks, and anomaly detection on every pipeline run.' },
  { icon: '\uD83D\uDCC8', title: 'Pipeline Analytics', desc: 'Track records processed, error rates, latency, throughput, and data freshness across all your pipelines.' },
  { icon: '\uD83D\uDD12', title: 'Enterprise Security', desc: 'Encrypted at rest and in transit. IP allowlisting, API key management, audit logging, and SOC2-ready controls.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Define Your Sources', desc: 'Tell us what data you need and where it lives. We support 50+ source types including websites, APIs, databases, and file systems.' },
  { step: '02', title: 'Configure Pipelines', desc: 'Set up extraction rules, transformation logic, sync schedules, and delivery destinations. Or let our AI configure it for you.' },
  { step: '03', title: 'Autonomous Operation', desc: 'Pipelines run 24/7 without intervention. Automatic retries, error healing, and self-adjusting rate limits.' },
  { step: '04', title: 'Monitor & Scale', desc: 'Real-time dashboards show pipeline health, throughput, and data quality. Scale from hundreds to millions of records.' },
];

const USE_CASES = [
  { title: 'Oil & Gas Land Records', desc: 'Extract deed records, mineral rights, leases, and assignments from 80+ county clerk databases. 259K+ records processed.' },
  { title: 'Competitive Intelligence', desc: 'Monitor competitor websites, pricing changes, product launches, job postings, and press releases in real-time.' },
  { title: 'Financial Data Aggregation', desc: 'Consolidate market data, SEC filings, earnings reports, and alternative data sources into a unified feed.' },
  { title: 'Government & Public Records', desc: 'Business filings, court records, property records, permits, and licensing data from state and federal databases.' },
];

function PipelinesPageContent() {
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
    if (!tier || tier.custom) { window.location.href = 'mailto:bob@echo-op.com?subject=Enterprise%20Data%20Pipelines%20Inquiry'; return; }
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
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Data Pipelines</div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>Autonomous Data<br /><span className="gradient-text">Extraction at Scale</span></h1>
        <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Systems that find, extract, normalize, and deliver structured data from thousands of sources &mdash; running 24/7 without human intervention.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href={user ? '/services' : '/signup'} className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Extracting</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>View Pricing</Link>
        </div>
        <div className="mt-4"><ReadAloudButton label="Read page" getText={() => document.querySelector('.max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} /></div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Records Processed', value: '259K+' },
            { label: 'Data Sources', value: '50+' },
            { label: 'Counties Covered', value: '80+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Built for Production Data at Scale</h2>
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

      {/* Use Cases */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{uc.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{uc.desc}</p>
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

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Pipelines vs. DIY Data Collection</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text-muted)' }}>Building In-House</h3>
            <ul className="space-y-3">
              {['3-6 months to build initial scrapers', 'Full-time engineer to maintain ($120K+/yr)', 'Constant breakage from site changes', 'No built-in data quality gates', 'Manual scaling and monitoring', 'Your team builds infrastructure, not products'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                  <span className="text-red-400 mt-0.5">&#x2717;</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 rounded-2xl border" style={{ borderColor: 'var(--ept-accent)', backgroundColor: 'var(--ept-card-bg)', boxShadow: '0 0 30px var(--ept-accent-glow)' }}>
            <h3 className="text-lg font-bold mb-4 gradient-text">Echo Prime Pipelines</h3>
            <ul className="space-y-3">
              {['Live in minutes, not months', 'Starting at $199/mo — fraction of an engineer', 'Auto-healing when sources change structure', 'Built-in validation, dedup, and anomaly detection', 'Auto-scaling from hundreds to millions of records', 'Your team focuses on insights, not plumbing'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Works Even Better With</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Combine pipelines with other Echo Prime services for end-to-end automation</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Title Intelligence', desc: 'Feed pipeline data directly into AI-powered chain of title analysis. 80+ Texas counties, 259K+ deed records.', href: '/title-intelligence', price: 'From $200/mo' },
            { title: 'Intelligence Engines', desc: '2,632 domain-specific AI engines that reason over your extracted data. Tax, legal, oilfield, and 56 more domains.', href: '/engines', price: 'From $199/mo' },
            { title: 'Sentinel AI', desc: 'Real-time monitoring and alerting on your pipeline data. Anomaly detection, trend analysis, and natural language queries.', href: '/sentinel', price: 'Free tier available' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Stop building scrapers from scratch</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Get production-grade data pipelines running in minutes, not months. Autonomous extraction, built for scale.</p>
          <Link href={user ? '/services' : '/signup'} className="inline-block px-10 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
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

export default function PipelinesPage() {
  return <SubscriptionGate serviceId="data-pipelines"><PipelinesPageContent /></SubscriptionGate>;
}
