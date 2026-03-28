'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ===================================================================
    Fleet Commander — AI Worker Fleet Management & Orchestration
    Backend: echo-fleet-commander.bmcii1976.workers.dev
    =================================================================== */

const FEATURES = [
  { title: 'Fleet Dashboard', desc: 'Real-time overview of all Workers — health status, response times, error rates, and deployment versions at a glance.', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { title: 'Auto-Scaling', desc: 'Automatically scale Workers based on request volume, latency thresholds, and custom rules. Zero cold starts.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { title: 'Health Monitoring', desc: 'Continuous health checks with configurable intervals, timeout detection, and automatic unhealthy Worker quarantine.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { title: 'Deployment Coordination', desc: 'Rolling deployments, canary releases, and instant rollback. Deploy to 200+ Workers with zero downtime.', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { title: 'Service Mesh', desc: 'Intelligent request routing between Workers with load balancing, circuit breaking, and failover.', icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l-2-1M4 7l-2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' },
  { title: 'Cost Analytics', desc: 'Track Cloudflare Worker costs per request, per Worker, per day. Identify expensive routes and optimize spending.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Log Aggregation', desc: 'Centralized log collection from all Workers with search, filtering, and alerting on error patterns.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: 'Dependency Graph', desc: 'Visual map of service bindings between Workers. See which Workers depend on each other and trace request flows.', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { title: 'Cron Management', desc: 'Centralized view and management of all cron triggers across your fleet. Edit schedules without redeploying.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Alert Rules', desc: 'Custom alert rules based on error rate, latency, request volume, or custom metrics. SMS, email, and webhook delivery.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { title: 'Worker Templates', desc: 'Pre-built Worker templates for common patterns — CRUD API, webhook handler, cron job, queue processor, and more.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { title: 'Fleet API', desc: 'Programmatic access to all fleet operations — deploy, rollback, scale, configure, and monitor via REST API.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
];

const COMPARISON = [
  { feature: 'Price (per month)', echo: '$49', competitor1: '$249+', competitor2: 'Custom', competitor3: '$99+' },
  { feature: 'Worker Management', echo: 'Unlimited', competitor1: '20 services', competitor2: 'Unlimited', competitor3: '50 services' },
  { feature: 'Auto-Scaling', echo: 'Yes', competitor1: 'Yes', competitor2: 'Yes', competitor3: 'Manual' },
  { feature: 'Health Monitoring', echo: 'Built-in', competitor1: 'Yes', competitor2: 'Yes', competitor3: 'Basic' },
  { feature: 'Rolling Deploys', echo: 'Yes', competitor1: 'Yes', competitor2: 'Yes', competitor3: 'No' },
  { feature: 'Cost Analytics', echo: 'All tiers', competitor1: 'Enterprise', competitor2: 'Enterprise', competitor3: 'No' },
  { feature: 'Service Mesh', echo: 'Yes', competitor1: 'Yes', competitor2: 'Yes', competitor3: 'No' },
  { feature: 'Setup Time', echo: '5 minutes', competitor1: '1-2 hours', competitor2: '1+ weeks', competitor3: '30 min' },
];

const PRICING = [
  { tier: 'Starter', price: 49, features: ['Up to 50 Workers', 'Health monitoring', 'Fleet dashboard', 'Log aggregation', 'Alert rules', 'Cron management', 'Email notifications'], cta: 'Start Free Trial', href: '/checkout?service=fleet-commander&tier=starter', popular: false },
  { tier: 'Professional', price: 149, features: ['Up to 200 Workers', 'Auto-scaling', 'Rolling deployments', 'Service mesh', 'Cost analytics', 'Dependency graph', 'Worker templates', 'Fleet API'], cta: 'Start Free Trial', href: '/checkout?service=fleet-commander&tier=pro', popular: true },
  { tier: 'Enterprise', price: 399, features: ['Unlimited Workers', 'Canary releases', 'Custom routing rules', 'Multi-account support', 'Priority support', 'Custom integrations', 'SLA guarantee', 'Dedicated instance'], cta: 'Contact Sales', href: '/checkout?service=fleet-commander&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'How many Workers can Fleet Commander manage?', a: 'The Starter tier supports up to 50 Workers, Professional up to 200, and Enterprise is unlimited. We currently manage 200+ Workers in production for Echo Prime itself.' },
  { q: 'Does it work with existing Cloudflare Workers?', a: 'Yes. Fleet Commander integrates with any Cloudflare Workers account via API token. No code changes needed — just connect your account and your Workers appear in the dashboard.' },
  { q: 'How do rolling deployments work?', a: 'Fleet Commander deploys to a small percentage of traffic first (canary), monitors for errors, then gradually shifts traffic. If errors spike, it automatically rolls back to the previous version.' },
  { q: 'What happens if a Worker goes down?', a: 'Health monitoring detects failures within seconds. The circuit breaker activates to prevent cascading failures, and alerts fire via your configured channels. If auto-healing is enabled, the Worker is automatically redeployed.' },
  { q: 'Can I use this with non-Cloudflare services?', a: 'Fleet Commander is optimized for Cloudflare Workers but can monitor any HTTP endpoint. Health checks, alerts, and cost tracking work with any service that responds to HTTP requests.' },
  { q: 'Is there an API for CI/CD integration?', a: 'Yes. The Fleet API supports programmatic deploys, rollbacks, and health checks. GitHub Actions and GitLab CI templates are included.' },
];

export default function FleetCommanderPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Fleet Commander', href: '/fleet-commander' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          200+ Workers &middot; Zero Downtime &middot; Full Automation
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Fleet Commander</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>Command Your Cloud Army</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Manage, monitor, and deploy hundreds of Cloudflare Workers from a single dashboard. Auto-scaling, health checks, rolling deploys, and cost analytics built in.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=fleet-commander&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>200+</strong> Workers Managed</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>99.99%</strong> Uptime</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>&lt;5s</strong> Deploy Time</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Run a Fleet</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Fleet Commander vs. The Competition</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Fleet Commander</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Datadog</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Kubernetes</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Railway</th>
            </tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="p-4 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor1}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor2}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {p.popular && <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span></div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-accent)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Command Your Fleet?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Stop managing Workers one at a time. Fleet Commander gives you the control tower your infrastructure deserves.</p>
        <Link href="/checkout?service=fleet-commander&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </main>
  );
}
