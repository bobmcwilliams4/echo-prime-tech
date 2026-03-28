'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ==============================================================================
   ECHO ANALYTICS ENGINE — Fleet Intelligence & Growth Metrics
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-analytics-engine.bmcii1976.workers.dev (6 endpoints, 3 D1 tables, v1.0)
   ============================================================================== */

const FEATURES = [
  { title: 'Engine Intelligence Metrics', desc: 'Track 5,500+ engines, 630K+ doctrines, and 30K+ queries in real-time. Monitor engine growth, query patterns, and domain coverage across your entire knowledge fleet.', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { title: 'Fleet Health Scoring', desc: 'Composite fleet score across 90+ Cloudflare Workers. Real-time health checks, latency monitoring, and degradation detection. Know your fleet status at a glance.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { title: 'Growth Trend Analysis', desc: 'Track daily, weekly, and monthly growth of engines, doctrines, knowledge documents, and brain messages. Visualize inflection points and predict capacity needs.', icon: 'M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941' },
  { title: 'Knowledge Forge Metrics', desc: 'Monitor 25K+ documents across 575+ categories. Track chunk counts, embedding completions, and category distribution. Identify knowledge gaps.', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { title: 'Shared Brain Intelligence', desc: '82K+ messages across 330+ instances. Track cross-AI communication patterns, decision density, and instance coordination. Understand how your AI fleet thinks.', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z' },
  { title: 'Automated Snapshots', desc: 'Every 6 hours, the system captures a complete metrics snapshot. Historical data powers trend analysis, anomaly detection, and capacity planning.', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { title: 'Doctrine Forge Monitoring', desc: 'Track doctrine generation rates, quality scores, and domain coverage. Monitor the TIE Gold Standard pipeline producing 20-field expert doctrines.', icon: 'M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m4.655-5.653L15.536 4.88a2.548 2.548 0 113.586 3.586l-2.049 2.049' },
  { title: 'Query Performance Analytics', desc: 'Per-domain query latency, throughput, and success rates. Identify hot domains, slow engines, and error patterns. Optimize the knowledge you serve most.', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6' },
  { title: 'Multi-Service Aggregation', desc: 'Pulls live data from Engine Runtime, Knowledge Forge, Doctrine Forge, Shared Brain, and Autonomous Daemon. One dashboard for your entire AI fleet.', icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z' },
  { title: 'Cost Tracking', desc: 'Monitor Cloudflare Workers compute usage across your fleet. Track D1 queries, R2 storage, and KV operations. Correlate cost with growth to optimize spend.', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
  { title: 'Alerting & Thresholds', desc: 'Set alerts for fleet score drops, engine count changes, query spikes, or error rate increases. Notify via webhook when metrics cross your defined thresholds.', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' },
  { title: 'REST API Access', desc: '6 endpoints for programmatic access: /snapshot, /dashboard, /growth, /trends, /health, and /status. Build custom dashboards or feed data into your own analytics pipeline.', icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
];

const COMPARISON = [
  { feature: 'AI engine analytics', echo: true, datadog: false, grafana: false, amplitude: false },
  { feature: 'Doctrine tracking', echo: true, datadog: false, grafana: false, amplitude: false },
  { feature: 'Fleet health scoring', echo: true, datadog: 'Custom', grafana: 'Custom', amplitude: false },
  { feature: 'Knowledge base metrics', echo: true, datadog: false, grafana: false, amplitude: false },
  { feature: 'Cross-AI communication tracking', echo: true, datadog: false, grafana: false, amplitude: false },
  { feature: 'Automated snapshots', echo: '6-hour', datadog: 'Custom', grafana: 'Custom', amplitude: 'Daily' },
  { feature: 'Growth trend analysis', echo: true, datadog: true, grafana: true, amplitude: true },
  { feature: 'Multi-service aggregation', echo: '5 services', datadog: 'Unlimited', grafana: 'Unlimited', amplitude: 'Events' },
  { feature: 'Cost tracking', echo: true, datadog: true, grafana: 'Plugin', amplitude: false },
  { feature: 'Setup time', echo: '2 min', datadog: 'Hours', grafana: 'Hours', amplitude: '30 min' },
  { feature: 'Monthly cost', echo: '$19', datadog: '$15/host', grafana: 'Free OSS', amplitude: '$49+' },
  { feature: 'Purpose-built for AI fleets', echo: true, datadog: false, grafana: false, amplitude: false },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    desc: 'For small AI deployments',
    features: ['Dashboard + growth trends', '6-hour snapshots', 'Fleet health scoring', '30-day retention', 'API access (6 endpoints)', 'Email alerts'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mo',
    desc: 'Full fleet intelligence suite',
    features: ['Everything in Starter', '1-hour snapshots', '90-day retention', 'Query performance analytics', 'Doctrine quality tracking', 'Multi-service aggregation', 'Webhook alerts', 'Cost tracking', 'Custom thresholds'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$249',
    period: '/mo',
    desc: 'Large-scale AI infrastructure',
    features: ['Everything in Pro', '15-minute snapshots', '1-year retention', 'Unlimited workers', 'Anomaly detection', 'Capacity planning', 'Custom dashboards', 'Dedicated support', 'SLA guarantees'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQS = [
  { q: 'What makes this different from Datadog or Grafana?', a: 'Echo Analytics Engine is purpose-built for AI fleets. It natively understands engines, doctrines, knowledge graphs, and cross-AI communication patterns. Traditional monitoring tools require extensive custom configuration to track these metrics. We do it out of the box.' },
  { q: 'What services does it aggregate?', a: 'It pulls live data from 5 core services: Engine Runtime (5,500+ engines, 630K+ doctrines, 30K+ queries), Knowledge Forge (25K+ docs, 575+ categories), Doctrine Forge (generation rates, quality scores), Shared Brain (82K+ messages, 330+ instances), and Autonomous Daemon (fleet score, 90+ workers).' },
  { q: 'How often are snapshots taken?', a: 'The default cron runs every 6 hours, capturing a complete metrics snapshot across all services. Pro plans can increase to hourly, and Enterprise to every 15 minutes. All snapshots are stored in D1 for historical analysis.' },
  { q: 'Can I build custom dashboards?', a: 'Yes. The REST API exposes 6 endpoints returning structured JSON. Pipe the data into any visualization tool, or use the built-in dashboard at echo-op.com/analytics for a real-time overview.' },
  { q: 'What does fleet health scoring measure?', a: 'The composite fleet score factors in: percentage of healthy workers (200 OK responses), average latency across the fleet, degraded worker count, pending fixes, daemon cycle completeness, and open QA bugs. A score of 95+ means your fleet is in excellent shape.' },
  { q: 'Is there a free tier?', a: 'New accounts get full Pro features for 14 days. The Starter plan at $19/mo covers small deployments. We also offer a free tier with daily snapshots, 7-day retention, and the dashboard endpoint.' },
];

export default function AnalyticsEnginePage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Analytics Engine', href: '/analytics-engine' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/sdk" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>SDK</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>90+ Workers</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>5 Service Bindings</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>6-Hour Snapshots</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>AI-Powered</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">
          <span className="gradient-text">Analytics Engine</span><br />For AI-First Infrastructure
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
          Unified metrics across engines, doctrines, knowledge bases, and Cloudflare Workers. Fleet health scoring, growth trends, query analytics, and cost tracking — purpose-built for AI fleets.
        </p>
        <div className="flex gap-4 justify-center animate-fade-up-delay-2">
          <Link href="/checkout?service=analytics-engine&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/analytics" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>View Live Dashboard</Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Engines Tracked', value: '5,500+' },
            { label: 'Doctrines Indexed', value: '630K+' },
            { label: 'Brain Messages', value: '82K+' },
            { label: 'Workers Monitored', value: '90+' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Complete AI Fleet Observability</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(13,115,119,0.1)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `2px solid var(--ept-border)` }}>
                <th className="text-left p-3" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                <th className="text-center p-3 font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Analytics</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Datadog</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Grafana</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Amplitude</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid var(--ept-border)` }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.datadog, row.grafana, row.amplitude].map((val, j) => (
                    <td key={j} className="text-center p-3">
                      {val === true ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : val === false ? <span style={{ color: 'var(--ept-text-muted)' }}>&#10007;</span> : <span style={{ color: 'var(--ept-text-muted)' }}>{val}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING.map((p) => (
            <div key={p.name} className={`p-8 rounded-2xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              {p.popular && <div className="text-xs font-bold mb-4 px-3 py-1 rounded-full inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{p.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=analytics-engine&tier=${p.name.toLowerCase()}`} className="block text-center w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-text)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button className="w-full text-left p-5 flex justify-between items-center" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{faq.q}</span>
                <span style={{ color: 'var(--ept-text-muted)' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <div className="px-5 pb-5 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>See Everything. Know Everything.</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>90+ Workers. 5,500+ engines. 630K+ doctrines. One dashboard to rule them all.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout?service=analytics-engine&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started Free</Link>
          <Link href="/analytics" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>View Live Dashboard</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-muted)' }}>Support</Link>
        </div>
      </footer>
    </div>
  );
}
