'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Real-Time Dashboards', desc: 'Live metrics across all your services — API calls, active users, error rates, latency percentiles. Auto-refreshing with configurable intervals.' },
  { title: 'Fleet Health Monitoring', desc: 'Track the health of every Cloudflare Worker in your fleet. Uptime history, response times, error spikes, and auto-generated incident reports.' },
  { title: 'Revenue Analytics', desc: 'Track MRR, ARR, churn rate, LTV, and revenue per product. Cohort analysis and subscription funnel visualization.' },
  { title: 'User Behavior Tracking', desc: 'Page views, session duration, feature adoption, and conversion funnels. Privacy-first — no cookies, no third-party scripts.' },
  { title: 'AI Anomaly Detection', desc: 'Engine Runtime continuously monitors metrics and flags unusual patterns — traffic spikes, error rate increases, latency degradation — before they become incidents.' },
  { title: 'Custom Metric Ingestion', desc: 'Push any metric via REST API with arbitrary dimensions and tags. Build custom dashboards for domain-specific KPIs.' },
  { title: 'Alerting & Notifications', desc: 'Set threshold-based or anomaly-based alerts. Notify via webhook, email, Slack, or Discord. Configurable cooldowns to prevent alert fatigue.' },
  { title: 'Retention & Cohort Analysis', desc: 'Track user retention by signup cohort. Visualize drop-off points and identify features that drive engagement.' },
  { title: 'API Performance Profiling', desc: 'Per-endpoint latency percentiles (p50, p95, p99), error rates, and throughput. Identify slow endpoints before users notice.' },
  { title: 'Cost Tracking', desc: 'Monitor Cloudflare Workers usage, D1 queries, R2 operations, and KV reads. Correlate cost with traffic to optimize spend.' },
  { title: 'Exportable Reports', desc: 'Generate PDF or CSV reports for any date range. Schedule weekly or monthly reports delivered to your inbox.' },
  { title: 'Multi-Tenant Isolation', desc: 'Each tenant sees only their own analytics. Agencies can white-label dashboards for client reporting.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', datadog: '$15/host', newrelic: '$25/100GB', mixpanel: '$28+', echo: '$19' },
  { feature: 'Real-Time Dashboards', datadog: 'Yes', newrelic: 'Yes', mixpanel: 'Yes', echo: 'Yes' },
  { feature: 'Fleet Health Monitoring', datadog: 'Yes', newrelic: 'Yes', mixpanel: 'No', echo: 'Yes' },
  { feature: 'Revenue Analytics', datadog: 'No', newrelic: 'No', mixpanel: 'Add-on', echo: 'Built-in' },
  { feature: 'AI Anomaly Detection', datadog: 'Enterprise', newrelic: 'Pro', mixpanel: 'No', echo: 'All plans' },
  { feature: 'User Behavior', datadog: 'RUM ($)', newrelic: 'Browser ($)', mixpanel: 'Yes', echo: 'Built-in' },
  { feature: 'Privacy-First (No Cookies)', datadog: 'No', newrelic: 'No', mixpanel: 'No', echo: 'Yes' },
  { feature: 'Custom Metrics API', datadog: 'Yes', newrelic: 'Yes', mixpanel: 'Yes', echo: 'Yes' },
  { feature: 'Cost Tracking', datadog: 'Yes', newrelic: 'Yes', mixpanel: 'No', echo: 'Built-in' },
  { feature: 'Cohort Analysis', datadog: 'No', newrelic: 'No', mixpanel: 'Yes', echo: 'Yes' },
  { feature: 'Multi-Tenant', datadog: 'Enterprise', newrelic: 'Enterprise', mixpanel: 'No', echo: 'Yes' },
  { feature: 'Setup Time', datadog: 'Hours', newrelic: 'Hours', mixpanel: '30min', echo: '5min' },
];

const PRICING = [
  { name: 'Starter', price: '$19', period: '/mo', features: ['5 dashboards', '30-day retention', 'Fleet monitoring', 'API performance', 'Email alerts', '100K events/mo'] },
  { name: 'Pro', price: '$79', period: '/mo', features: ['Unlimited dashboards', '90-day retention', 'Revenue analytics', 'User behavior', 'AI anomaly detection', 'Cohort analysis', 'Slack/Discord alerts', '1M events/mo'] },
  { name: 'Enterprise', price: '$249', period: '/mo', features: ['Everything in Pro', '1-year retention', 'Multi-tenant', 'Cost tracking', 'Custom metrics', 'Exportable reports', 'Dedicated support', 'Unlimited events'] },
];

const FAQS = [
  { q: 'How does this compare to Google Analytics?', a: 'Echo Analytics is privacy-first with no cookies or third-party scripts. It combines product analytics (like Mixpanel), infrastructure monitoring (like Datadog), and revenue tracking (like Baremetrics) in one platform. Google Analytics focuses only on web traffic.' },
  { q: 'How does AI anomaly detection work?', a: 'Our Engine Runtime builds baseline patterns for every metric. When values deviate beyond learned thresholds, it triggers alerts with context — what changed, when, and potential causes based on correlated metrics.' },
  { q: 'Can I track custom business metrics?', a: 'Yes. Push any metric with arbitrary dimensions via our REST API. Create custom dashboards to visualize domain-specific KPIs alongside infrastructure metrics.' },
  { q: 'Is there a free tier?', a: 'New accounts get full Pro features for 14 days. After that, the Starter plan at $19/mo covers most small teams. We also offer a forever-free plan with 1 dashboard and 10K events/mo.' },
  { q: 'How fast is data ingestion?', a: 'Events appear in dashboards within seconds. Our Cloudflare Workers edge architecture means data is processed at the nearest PoP — no centralized ingestion bottleneck.' },
  { q: 'Can agencies use this for client reporting?', a: 'Yes. The Enterprise plan includes multi-tenant isolation and white-label dashboards. Each client gets their own analytics view with your branding.' },
];

export default function AnalyticsPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Analytics', href: '/analytics' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI ANALYTICS PLATFORM</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6"><span className="gradient-text">Echo Analytics</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Real-time dashboards, fleet monitoring, revenue analytics, and AI anomaly detection.
          One platform for infrastructure, product, and business metrics.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout?service=analytics&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#pricing" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Pricing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ val: '150+', label: 'Fleet Workers' }, { val: '<2s', label: 'Ingestion Latency' }, { val: '5,486', label: 'AI Engines' }, { val: '99.99%', label: 'Uptime' }].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Infrastructure + Product + Revenue in One Place</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover animate-fade-up" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${i * 50}ms` }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Echo Analytics vs The Rest</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Three tools in one. AI-native. Privacy-first.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Datadog</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>New Relic</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Mixpanel</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Analytics</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.datadog}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.newrelic}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.mixpanel}</td>
                  <td className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>No per-host fees. No surprise bills.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className={`p-6 rounded-xl border ${i === 1 ? 'ring-2 ring-[--ept-accent]' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{p.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=analytics&tier=${p.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>
                {i === 0 ? 'Start Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>FAQ</h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>See Your Entire Stack in One Dashboard</h2>
          <p className="mb-6" style={{ color: 'var(--ept-text-secondary)' }}>14-day free trial. No credit card required.</p>
          <Link href="/checkout?service=analytics&tier=starter" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
