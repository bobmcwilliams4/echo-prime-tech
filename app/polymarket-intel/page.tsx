'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

/* ==============================================================================
   ECHO POLYMARKET INTEL — Prediction Markets Intelligence Platform
   Product page: hero, features, dashboard preview, pricing, FAQ, footer CTA
   Backend: echo-polymarket-intel.bmcii1976.workers.dev (v1.1.0, 113 markets, 25 watchlist)
   ============================================================================== */

const FEATURES = [
  { title: 'Market Tracking', desc: 'Monitor 113+ prediction markets in real-time. Track price movements, volume, and sentiment across politics, economics, technology, and crypto.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Watchlist Alerts', desc: 'Set custom watchlist rules with price thresholds and probability triggers. Get instant alerts when markets move beyond your defined ranges.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { title: 'Crude Oil Intelligence', desc: 'Dedicated crude oil price tracking with 24-hour data points. Correlate oil markets with energy prediction contracts for oilfield decision-making.', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9.172 7 12c0 1.657 1.343 3 3 3h1a4.99 4.99 0 003.899-1.867A3.99 3.99 0 0016 12c0-1.173-.636-2.193-1.58-2.742' },
  { title: 'AI-Powered Analysis', desc: 'Engine Runtime integration provides deep analysis on market movements. Get AI explanations for probability shifts and cross-market correlations.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { title: 'Telegram Alerts', desc: 'Real-time push notifications via Telegram. Configure alert severity and get notified instantly when markets hit your watchlist triggers.', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
  { title: 'Dashboard Analytics', desc: 'Comprehensive dashboard with market heatmaps, volume leaders, biggest movers, and sector breakdowns. Export data as JSON for custom analysis.', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { title: 'Rate-Limited API', desc: 'Production-ready API with 120 reads/min and 30 writes/min per IP. Structured JSON responses, CORS support, and security headers on every request.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { title: 'Market Categories', desc: 'Browse markets by category: elections, geopolitics, crypto, economics, tech, energy, sports, and more. Filter by volume, probability, or recency.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
];

const FAQS = [
  { q: 'What prediction markets does Echo Polymarket Intel track?', a: 'We track 113+ markets across Polymarket covering politics, economics, technology, energy, crypto, and more. Markets are updated continuously with price, volume, and probability data.' },
  { q: 'How does the crude oil tracking work?', a: 'Dedicated crude oil price tracking captures data points every hour, providing 24-hour trend analysis. This is especially valuable for oilfield operators correlating energy futures with prediction market contracts.' },
  { q: 'Can I get alerts on my phone?', a: 'Yes — Telegram integration provides instant push notifications. Set up watchlist rules with custom price thresholds and probability triggers, and get alerts the moment a market moves beyond your defined range.' },
  { q: 'Is there an API?', a: 'Yes, the full REST API is available with rate limiting (120 reads/min, 30 writes/min). All endpoints return structured JSON with proper CORS headers. API key authentication protects write operations.' },
  { q: 'How does this differ from using Polymarket directly?', a: 'Echo Polymarket Intel adds: AI-powered analysis via Engine Runtime, custom watchlist alerts, crude oil correlation tracking, Telegram notifications, historical data, and a unified dashboard — features Polymarket itself does not provide.' },
  { q: 'Is this suitable for oilfield decision-making?', a: 'Absolutely. The combination of energy prediction markets, crude oil price tracking, and AI analysis makes it ideal for energy sector professionals making operational and investment decisions based on market intelligence.' },
];

const PRICING = [
  { name: 'Observer', price: 'Free', features: ['View all markets', 'Basic dashboard', '25 API calls/day', 'Public market data', 'Category browsing'] },
  { name: 'Analyst', price: '$29', features: ['Everything in Observer', 'Unlimited API access', 'Custom watchlist rules', 'Telegram alerts', 'AI market analysis', 'Crude oil tracking'] },
  { name: 'Operator', price: '$99', features: ['Everything in Analyst', 'Priority API rate limits', 'Multi-channel alerts', 'Custom market tracking', 'Data export (JSON/CSV)', 'Dedicated support'] },
];

export default function PolymarketIntelPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/pricing' },
        { name: 'Polymarket Intel', href: '/polymarket-intel' },
      ]} />
      <FaqSchema faqs={FAQS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/intel-hub" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Intel Hub</Link>
          <Link href="/sentinel" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Sentinel</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="text-center mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            113+ Markets Tracked — Real-Time Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
            Prediction Markets<br /><span className="gradient-text">Intelligence Platform</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Track prediction markets, set watchlist alerts, correlate crude oil prices, and get AI-powered analysis — all from one platform built for decision-makers in energy, finance, and technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 rounded-xl font-bold text-lg text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Start Tracking Free
            </Link>
            <a href="https://echo-polymarket-intel.bmcii1976.workers.dev/dashboard" target="_blank" rel="noopener" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Dashboard
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-fade-up">
          {[
            { label: 'Markets Tracked', value: '113+' },
            { label: 'Watchlist Rules', value: '25' },
            { label: 'Alerts (24h)', value: '134' },
            { label: 'Oil Data Points', value: '14/day' },
          ].map(s => (
            <div key={s.label} className="p-5 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 rounded-xl border flex gap-4 card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)' }}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-20">
          <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Why Echo Polymarket Intel?</h2>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <th className="p-4 text-left font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                  <th className="p-4 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Polymarket Intel</th>
                  <th className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>Polymarket Direct</th>
                  <th className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>Kalshi</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Custom Watchlist Alerts', true, false, false],
                  ['AI-Powered Analysis', true, false, false],
                  ['Crude Oil Correlation', true, false, false],
                  ['Telegram Notifications', true, false, false],
                  ['REST API Access', true, false, true],
                  ['Rate Limiting', true, false, true],
                  ['Multi-Category Dashboard', true, true, true],
                  ['Historical Data Export', true, false, true],
                  ['Security Headers', true, true, true],
                  ['Oilfield Decision Support', true, false, false],
                ].map(([feature, ...vals], i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{feature as string}</td>
                    {(vals as boolean[]).map((v, j) => (
                      <td key={j} className="p-4 text-center">{v ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : <span style={{ color: 'var(--ept-text-muted)' }}>&#8212;</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-20">
          <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((tier, i) => (
              <div key={tier.name} className={`p-6 rounded-xl border ${i === 1 ? 'ring-2' : ''}`}
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', ...(i === 1 ? { ringColor: 'var(--ept-accent)' } : {}) }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
                <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{tier.price}<span className="text-base font-normal" style={{ color: 'var(--ept-text-muted)' }}>{tier.price !== 'Free' ? '/mo' : ''}</span></div>
                <ul className="mt-4 space-y-2">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6 text-center px-4 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                  {tier.price === 'Free' ? 'Start Free' : 'Subscribe'}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>FAQ</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQS.map(f => (
              <details key={f.q} className="p-5 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: 'var(--ept-text)' }}>
                  {f.q}
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--ept-text-muted)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 px-8 rounded-2xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Start Tracking Prediction Markets</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            113+ markets, AI analysis, crude oil intelligence, and instant alerts — free to start.
          </p>
          <Link href="/signup" className="inline-block px-10 py-4 rounded-xl font-bold text-lg text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
            Get Started Free
          </Link>
        </section>

        <TrialCTA serviceId="polymarket-intel" productName="Polymarket Intel" />
      </main>
    </div>
  );
}
