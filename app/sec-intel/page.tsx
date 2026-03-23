'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import ProductTutorialButton from '../../components/product-tutorial-button';

const SERVICE_ID = 'sec-intel';

/* ================================================================
   FEATURE CARDS — 8 SEC intelligence capabilities
   ================================================================ */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Filing Monitor',
    desc: 'Comprehensive real-time monitoring of all SEC EDGAR filings including 10-K annual reports, 10-Q quarterly reports, 8-K current event disclosures, Form 4 insider transactions, S-1 registration statements, proxy statements (DEF 14A), and 13-F institutional holdings. Our crawlers poll EDGAR every 60 seconds and cross-reference with company RSS feeds for zero-latency filing detection across 90,000+ public companies.',
    sources: ['10-K Annual', '10-Q Quarterly', '8-K Events', 'Form 4 Insider', 'S-1 Registration', '13-F Holdings'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'AI Summarization',
    desc: 'Instant AI-generated executive summaries of complex SEC filings. Our models extract key financial metrics, risk factors, material events, management discussion highlights, revenue breakdowns, and forward-looking statements from filings that typically run 100-300 pages. Each summary includes sentiment scoring, comparisons to prior filings, and flagged anomalies that warrant deeper investigation.',
    sources: ['Executive Summary', 'Key Metrics', 'Risk Factors', 'Material Events', 'Sentiment Score', 'Anomaly Flags'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Company Tracking',
    desc: 'Build custom watchlists of public companies and receive instant alerts on any filing activity. Track competitors, portfolio holdings, industry peers, and acquisition targets. Automatic CIK-to-ticker resolution, subsidiary mapping, and corporate hierarchy visualization. Includes peer comparison dashboards showing relative financial performance, valuation multiples, and filing frequency patterns.',
    sources: ['Custom Watchlists', 'Competitor Tracking', 'Peer Comparison', 'Subsidiary Mapping', 'Industry Groups', 'CIK Resolution'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: 'Insider Trading Alerts',
    desc: 'Real-time Form 4 monitoring with pattern detection for unusual insider activity. Track executive purchases, sales, option exercises, and gift transactions. Our AI identifies clustering patterns — when multiple insiders buy/sell within a narrow window — and scores each transaction for significance based on historical patterns, position size relative to holdings, and pre-announcement timing.',
    sources: ['Form 4 Filings', 'Cluster Detection', 'Pattern Scoring', 'Executive Tracking', 'Option Exercises', 'Historical Patterns'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: 'Financial Analysis',
    desc: 'Automated extraction and normalization of financial statements — income statement, balance sheet, and cash flow — from XBRL-tagged filings. Ratio analysis (P/E, EV/EBITDA, ROE, debt/equity, current ratio, free cash flow yield), trend visualization across 20+ quarters, and peer benchmarking. Detect margin compression, revenue deceleration, and balance sheet deterioration before they become market-moving news.',
    sources: ['XBRL Extraction', 'Ratio Analysis', 'Trend Detection', 'Peer Benchmarking', 'Margin Analysis', 'Cash Flow Scoring'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: 'Historical Archive',
    desc: 'Searchable archive of SEC filings spanning 25+ years. Full-text search across millions of documents with faceted filtering by company, filing type, date range, SIC code, and keyword. Side-by-side filing comparison to identify language changes, removed risk factors, and new disclosures between reporting periods. Complete XBRL financial data export in CSV, JSON, and Excel formats.',
    sources: ['25+ Year Archive', 'Full-Text Search', 'Filing Comparison', 'XBRL Data Export', 'SIC Code Filter', 'Language Diff'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
      </svg>
    ),
    title: 'Custom Alerts',
    desc: 'Granular alert configuration for any combination of companies, filing types, and content triggers. Set alerts for specific keywords appearing in new filings (e.g., &ldquo;going concern,&rdquo; &ldquo;material weakness,&rdquo; &ldquo;restatement&rdquo;), insider transaction thresholds, revenue miss/beat patterns, and guidance changes. Multi-channel delivery via Telegram, Discord, email, SMS, and webhook with severity-based routing.',
    sources: ['Keyword Triggers', 'Filing Type Filters', 'Revenue Alerts', 'Guidance Changes', 'Multi-Channel', 'Severity Routing'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: 'API Access',
    desc: 'RESTful API with OpenAPI documentation for programmatic access to all SEC intelligence data. Query filings, financial data, insider transactions, and AI summaries via authenticated endpoints. Supports bulk data downloads, real-time WebSocket streams for filing alerts, and GraphQL queries for complex data relationships. SDKs available for Python, JavaScript, and Go. Rate limits scale with subscription tier.',
    sources: ['REST API', 'WebSocket Streams', 'GraphQL', 'Python SDK', 'Bulk Downloads', 'OpenAPI Docs'],
  },
];

/* ================================================================
   HOW IT WORKS — 4-step process
   ================================================================ */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Track Companies',
    desc: 'Add companies to your watchlist by ticker, CIK, or company name. Configure which filing types matter to you — 10-K, 10-Q, 8-K, Form 4, or all of them. Set up industry peer groups for automatic benchmarking.',
  },
  {
    step: '02',
    title: 'AI Analyzes',
    desc: 'Every new filing is automatically ingested, parsed, and analyzed by our AI pipeline within minutes of publication. Financial data is extracted from XBRL tags, risk factors are compared to prior filings, and executive summaries are generated with anomaly flags.',
  },
  {
    step: '03',
    title: 'Get Insights',
    desc: 'Receive AI-generated summaries with key metrics, sentiment scores, and peer comparisons delivered to your dashboard and configured alert channels. Insider trading patterns are scored and flagged for significance.',
  },
  {
    step: '04',
    title: 'Make Decisions',
    desc: 'Use our financial analysis tools, historical comparisons, and trend visualizations to make informed investment decisions. Export data for your own models or access via API for quantitative strategies.',
  },
];

/* ================================================================
   STATS
   ================================================================ */
const STATS = [
  { value: '90,000+', label: 'Companies Monitored' },
  { value: '60s', label: 'Filing Detection' },
  { value: '25+', label: 'Years of Archive' },
  { value: '8', label: 'Filing Types' },
  { value: '<5min', label: 'AI Summary Time' },
  { value: '15+', label: 'Financial Ratios' },
  { value: '24/7', label: 'EDGAR Monitoring' },
  { value: '99.9%', label: 'Uptime SLA' },
];

/* ================================================================
   PRICING TIERS
   ================================================================ */
const PRICING = [
  {
    tier: 'Analyst',
    price: 199,
    interval: 'mo',
    popular: false,
    custom: false,
    features: [
      '25 tracked companies',
      'Real-time filing alerts',
      'AI filing summaries',
      'Basic financial analysis',
      'Insider trading alerts',
      'Email + Telegram notifications',
      'Dashboard access',
      '5-year historical data',
    ],
  },
  {
    tier: 'Professional',
    price: 499,
    interval: 'mo',
    popular: true,
    custom: false,
    features: [
      '250 tracked companies',
      'Real-time filing + insider alerts',
      'Advanced AI summaries with anomaly detection',
      'Full financial ratio analysis',
      'Peer benchmarking dashboards',
      'Filing comparison (side-by-side diff)',
      'API access (REST + WebSocket)',
      'Custom keyword triggers',
      'Multi-channel alerts',
      '15-year historical data',
    ],
  },
  {
    tier: 'Institutional',
    price: 999,
    interval: 'mo',
    popular: false,
    custom: false,
    features: [
      'Unlimited tracked companies',
      'Priority filing detection (<30s)',
      'Custom AI model fine-tuning',
      'Full XBRL data export',
      'GraphQL API access',
      'Bulk data downloads',
      '13-F institutional holdings tracking',
      'Dedicated account manager',
      'SLA with guaranteed response times',
      'Custom integrations',
      '25+ year full archive access',
      'White-label option',
    ],
  },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function SecIntelPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const handleCheckout = (tierIndex: number) => {
    const tier = PRICING[tierIndex];
    if (!user) {
      window.location.href = `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
      return;
    }
    window.location.href = `/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* --- Nav --- */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/price-alerts" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Price Alerts</Link>
          <Link href="/crypto-trading" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Crypto Trading</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* --- Hero --- */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-accent-glow)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#3b82f6' }} /> SEC Filings &bull; Financial Analysis &bull; Insider Intelligence
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          SEC Intelligence<br />
          Platform<br />
          <span className="gradient-text">AI-Powered Analysis.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered financial filing analysis across <strong>90,000+ public companies</strong>. Real-time EDGAR monitoring, instant AI summaries, insider trading pattern detection, financial ratio analysis, and custom alerts &mdash; filings analyzed in under <strong>5 minutes</strong> from publication.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/dashboard' : `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=analyst`} className="px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Monitoring Filings
          </Link>
          <Link href="/engines" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            Explore All Engines
          </Link>
        </div>
        <div className="mt-4">
          <ReadAloudButton label="Read page" getText={() => document.querySelector('main, .max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} />
        </div>
      </section>

      {/* --- Stats Grid --- */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-wide font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Feature Grid (expandable) --- */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>8 Intelligence Layers</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            From raw EDGAR filings to actionable investment intelligence &mdash; each layer operates independently and feeds into a unified analysis pipeline.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const isExpanded = expandedFeature === i;
            return (
              <button key={i} onClick={() => setExpandedFeature(isExpanded ? null : i)} className="text-left p-5 rounded-2xl border transition-all hover:shadow-lg" style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: isExpanded ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: isExpanded ? '0 0 25px var(--ept-accent-glow)' : undefined,
                gridColumn: isExpanded ? 'span 2' : undefined,
                gridRow: isExpanded ? 'span 2' : undefined,
              }}>
                <div className="text-2xl mb-3" style={{ color: 'var(--ept-accent)' }}>{f.icon}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                  {isExpanded ? f.desc : f.desc.slice(0, 120) + '...'}
                </p>
                {isExpanded && (
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: 'var(--ept-accent)' }}>Sources &amp; Methods</div>
                    <div className="flex flex-wrap gap-1.5">
                      {f.sources.map((s, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2 text-[10px] font-medium" style={{ color: 'var(--ept-accent)' }}>{isExpanded ? 'Click to collapse' : 'Click for details'}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="space-y-6">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="flex gap-6 items-start p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s.step}</div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Institutional-grade SEC intelligence at every scale</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING.map((tier, i) => (
            <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
              boxShadow: tier.popular ? '0 0 40px var(--ept-accent-glow)' : 'none',
            }}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
              )}
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price.toLocaleString()}</span>
                  <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout(i)} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all" style={{
                backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                color: tier.popular ? '#fff' : 'var(--ept-accent)',
                border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
              }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Financial Intelligence Engine --- */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Financial Intelligence Engine</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our financial analysis doctrine library &mdash; backed by engines covering SEC regulations, financial analysis, corporate governance, and securities law.</p>
          <EngineQueryPanel
            domains={['FINANCE', 'ACCT', 'LG', 'ECON', 'GOV']}
            title="SEC &amp; Financial Analysis"
            placeholder="Ask about SEC filings, financial ratios, insider trading patterns..."
            exampleQueries={[
              'How to identify material weakness in 10-K filings?',
              'What insider trading patterns precede earnings surprises?',
              'Key financial ratios for evaluating oil & gas companies',
              'SEC rules on Form 4 reporting deadlines',
            ]}
            showStats
          />
        </div>
      </section>

      {/* --- Related Services --- */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Related Services</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Combine SEC intelligence with these capabilities for comprehensive financial analysis.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Price Alerts', desc: 'Real-time market monitoring across 10,000+ assets. AI trend scoring, custom thresholds, and multi-channel delivery.', href: '/price-alerts', price: 'Free tier available' },
            { title: 'Crypto Trading', desc: 'Automated trading strategies on BTC, ETH, and altcoins. Grid, momentum, and custom strategies with risk management.', href: '/crypto-trading', price: 'From $99/mo' },
            { title: 'Intelligence Engines', desc: '5,400+ domain-specific AI engines with embedded expertise across 940+ verticals including finance and accounting.', href: '/engines', price: 'From $199/mo' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Read filings faster than Wall Street.</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            The average analyst spends 4+ hours reading a single 10-K filing. Our AI delivers actionable summaries in under 5 minutes. Start monitoring your first 25 companies today.
          </p>
          <Link href={`/checkout?service=${SERVICE_ID}&tier=analyst`} className="inline-block px-10 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Analyst Plan &mdash; $199/mo
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/price-alerts" className="underline" style={{ color: 'var(--ept-accent)' }}>Price Alerts</Link> | <Link href="/crypto-trading" className="underline" style={{ color: 'var(--ept-accent)' }}>Crypto Trading</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
      <ProductTutorialButton tutorialId="sec-intel" productName="Security Intelligence" />
    </div>
  );
}