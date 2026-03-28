'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ==============================================================================
   ECHO AUTONOMOUS BUILDER — Self-Healing AI Infrastructure
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-autonomous-builder.bmcii1976.workers.dev (v3.0, 25 service bindings)
   ============================================================================== */

const FEATURES = [
  { title: 'Worker Warmer', desc: 'Keeps 11 critical Workers warm with scheduled pings, eliminating cold-start latency alerts. Configurable warm list with priority ordering.', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
  { title: 'QA Bug Processor', desc: 'Automatically triages and resolves false-positive QA bugs — Next.js script count variance, known redirect pages, Organization schema differences.', icon: 'M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06' },
  { title: 'Daemon Task Resolver', desc: 'Resolves Autonomous Daemon warm-up tasks by pinging cold Workers. Eliminates latency alerts before they cascade into fleet score drops.', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Bug Hunter', desc: 'Scans 85+ Workers for real bugs — broken endpoints, misconfigured CORS, missing health routes. Detects same-account 404 false positives from unbound Workers.', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
  { title: 'Thin Page Fixer', desc: 'Reads thin pages from GitHub API, uses Engine Runtime to generate rich product content, then pushes the improved page back to GitHub via Contents API.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Evolution Auto-Fixer', desc: 'Module 15 — reads evolution scan findings, generates code fixes using Engine Runtime intelligence, and pushes corrected code to GitHub automatically.', icon: 'M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m5.254-5.254L18.34 2.622a2.548 2.548 0 013.586 3.586l-4.655 5.254m-5.254 5.254l5.254-5.254' },
  { title: 'Diagnostics Agent Trigger', desc: 'Module 16 — triggers the Diagnostics Agent to scan repos on demand, coordinating code quality scans across the entire 225+ repo fleet.', icon: 'M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Upgrade Scanner', desc: 'Identifies Workers running outdated patterns, deprecated APIs, or missing security headers. Recommends and applies upgrades across the fleet.', icon: 'M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69zM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69z' },
  { title: 'Daily Briefing', desc: 'Automated 8am briefing aggregating fleet health, overnight issues resolved, pending fixes, and performance metrics — delivered to Shared Brain and MoltBook.', icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z' },
  { title: '25 Service Bindings', desc: 'Direct Worker-to-Worker connections to Engine Runtime, Shared Brain, Doctrine Forge, Knowledge Forge, Daemon, and 20 more — no external HTTP required.', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' },
  { title: '4 Cron Cycles', desc: 'Layered automation: */5 warmup, */30 QA+daemon+fixes, every 4hr full audit+hunt+upgrades, daily 8am briefing. Zero human intervention required.', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Self-Reporter', desc: 'Logs all actions to Shared Brain with importance scoring and posts milestones to MoltBook. Full audit trail of every autonomous action taken.', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5' },
];

const COMPARISON = [
  { feature: 'Autonomous bug detection', echo: true, datadog: 'Alerts only', pagerduty: false, rundeck: false },
  { feature: 'Auto-fix code & push to GitHub', echo: true, datadog: false, pagerduty: false, rundeck: false },
  { feature: 'Fleet-wide Worker warming', echo: true, datadog: false, pagerduty: false, rundeck: 'Manual' },
  { feature: 'QA false-positive resolution', echo: true, datadog: false, pagerduty: false, rundeck: false },
  { feature: 'Thin page content generation', echo: true, datadog: false, pagerduty: false, rundeck: false },
  { feature: 'Engine Runtime AI integration', echo: true, datadog: false, pagerduty: false, rundeck: false },
  { feature: 'Daily automated briefings', echo: true, datadog: true, pagerduty: true, rundeck: false },
  { feature: 'Evolution scan auto-fixer', echo: true, datadog: false, pagerduty: false, rundeck: false },
  { feature: '25 service bindings (no HTTP)', echo: true, datadog: false, pagerduty: false, rundeck: false },
  { feature: 'Cross-AI broadcast (MoltBook)', echo: true, datadog: false, pagerduty: false, rundeck: false },
  { feature: 'Multi-cron layered automation', echo: true, datadog: 'Basic', pagerduty: false, rundeck: true },
  { feature: '$0.04/mo Cloudflare Workers', echo: true, datadog: false, pagerduty: false, rundeck: false },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    desc: 'Essential fleet maintenance',
    features: ['Worker warming (5 Workers)', 'QA bug processing', 'Daemon task resolver', 'Daily briefing', 'Shared Brain logging'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/mo',
    desc: 'Full autonomous operations',
    features: ['Worker warming (unlimited)', 'Bug hunter (85+ Workers)', 'Thin page fixer', 'Evolution auto-fixer', 'Diagnostics agent trigger', 'Upgrade scanner', '25 service bindings', '4 cron cycles', 'API access'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$299',
    period: '/mo',
    desc: 'Custom fleet automation',
    features: ['Everything in Professional', 'Custom scan rules', 'Custom auto-fix modules', 'Priority support', 'Multi-fleet management', 'Custom cron schedules', 'RBAC & audit logging', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQS = [
  { q: 'What does "self-healing" actually mean?', a: 'The Autonomous Builder detects issues (broken endpoints, thin pages, cold Workers, QA false positives) and fixes them automatically — generating code, pushing to GitHub, warming Workers, and resolving alerts without any human intervention. It runs 24/7 on 4 cron cycles.' },
  { q: 'Will it break my production Workers?', a: 'No. Auto-fixes are pushed to GitHub as new commits, which trigger your normal CI/CD pipeline. The Builder never modifies running Workers directly. If a fix causes a build failure, it\'s caught by your existing deployment checks.' },
  { q: 'How does it know what a "thin page" is?', a: 'The Builder reads page content via GitHub API and evaluates it against quality thresholds — word count, feature sections, comparison tables, pricing, FAQs. Pages below the threshold are flagged and enriched using Engine Runtime AI to generate product-quality content.' },
  { q: 'What are service bindings and why do they matter?', a: 'Service bindings are direct Worker-to-Worker connections that bypass the public internet. Instead of making HTTP calls (which add latency and can hit rate limits), the Builder calls Engine Runtime, Shared Brain, and 23 other Workers directly through Cloudflare\'s internal network — faster and more reliable.' },
  { q: 'Can I customize which Workers get warmed?', a: 'Yes. The warm list is configurable via the Worker\'s KV store. Add or remove Worker URLs, set priority ordering, and configure ping intervals. The default list covers the 11 most critical infrastructure Workers.' },
  { q: 'How does the Evolution Auto-Fixer work?', a: 'Module 15 reads findings from evolution scans (code quality issues detected across your repos), uses Engine Runtime to generate targeted code fixes, and pushes the corrected code to GitHub via the Contents API. Each fix includes a descriptive commit message and is tracked in Shared Brain.' },
];

export default function AutonomousBuilderPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Autonomous Builder', href: '/autonomous-builder' }]} />
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
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>25 Service Bindings</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>4 Cron Cycles</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>85+ Workers Scanned</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Zero Human Intervention</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">
          <span className="gradient-text">Self-Healing</span> AI<br />Infrastructure
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
          Autonomous bug fixing, QA processing, Worker warming, thin page repair, evolution scanning, and daily briefings — the execution engine that keeps your fleet running while you sleep.
        </p>
        <div className="flex gap-4 justify-center animate-fade-up-delay-2">
          <Link href="/checkout?service=autonomous-builder&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/sdk/docs" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>API Docs</Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Workers Scanned', value: '85+' },
            { label: 'Service Bindings', value: '25' },
            { label: 'Cron Cycles', value: '4' },
            { label: 'Monthly Cost', value: '$0.04' },
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
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Autonomous Operations, Zero Babysitting</h2>
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
                <th className="text-center p-3 font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Builder</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Datadog</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>PagerDuty</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Rundeck</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid var(--ept-border)` }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.datadog, row.pagerduty, row.rundeck].map((val, j) => (
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
            <div key={p.name} className={`p-8 rounded-2xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
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
              <Link href={`/checkout?service=autonomous-builder&tier=${p.name.toLowerCase()}`} className="block text-center w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-text)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
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
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Let Your Infrastructure Heal Itself</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>25 service bindings. 4 cron cycles. 85+ Workers scanned. Zero human intervention.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout?service=autonomous-builder&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started Free</Link>
          <Link href="/pricing" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>View Pricing</Link>
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
