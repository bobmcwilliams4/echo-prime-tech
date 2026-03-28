'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ==============================================================================
   ECHO DIAGNOSTICS AGENT — Autonomous Code Quality Scanner
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-diagnostics-agent.bmcii1976.workers.dev (v1.1, 225+ repos)
   ============================================================================== */

const FEATURES = [
  { title: 'Health Endpoint Detection', desc: 'Scans every repo for a /health endpoint. Missing health routes are the #1 cause of fleet monitoring blind spots — this catches them automatically.', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
  { title: 'Structured Logging Audit', desc: 'Detects bare console.log/print() calls that should be structured JSON logging. Auto-fixes by injecting a slog helper with proper log levels.', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
  { title: 'Error Handling Analysis', desc: 'Finds empty catch blocks, swallowed exceptions, and missing error responses. These silent failures are the hardest bugs to diagnose in production.', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { title: 'CORS Verification', desc: 'Checks that Workers handling browser requests have proper CORS headers and OPTIONS handlers. Auto-fixes by injecting Access-Control-Allow headers.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { title: 'Version Tracking', desc: 'Ensures every Worker reports its version in /health responses. Unversioned Workers are invisible to fleet management and upgrade scanning.', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z' },
  { title: 'Auth Middleware Check', desc: 'Identifies Workers with unprotected write endpoints — POST/PUT/DELETE routes accessible without API key or bearer token authentication.', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
  { title: 'Timestamp Validation', desc: 'Verifies that API responses include ISO-8601 timestamps for auditing and debugging. Missing timestamps make incident investigation nearly impossible.', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: '3 Auto-Fix Capabilities', desc: 'Doesn\'t just find problems — fixes them. Logging injection (slog helper), CORS headers, and OPTIONS handler generation pushed directly to GitHub.', icon: 'M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m5.254-5.254L18.34 2.622a2.548 2.548 0 013.586 3.586l-4.655 5.254m-5.254 5.254l5.254-5.254' },
  { title: 'Rotating Batch Scans', desc: '5 repos per 6-hour cron cycle with KV offset tracking. Covers the entire 225+ repo fleet every few days without overwhelming GitHub API rate limits.', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' },
  { title: 'D1 Findings Database', desc: 'All diagnostic findings stored in D1 with severity, file path, line number, and fix status. Query historical trends and track resolution rates.', icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375' },
  { title: 'Shared Brain Integration', desc: 'Reports findings to Shared Brain for cross-instance awareness. Other AI agents can query diagnostic status and prioritize their own work accordingly.', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
  { title: 'Dashboard & Reporting', desc: 'Visual dashboard on echo-op.com/autonomous-ops with filter bar, health summary, findings table, and sidebar detail panel. Real-time scan status.', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5' },
];

const COMPARISON = [
  { feature: 'Auto-scan 225+ repos', echo: true, sonar: 'Limited', codeclimate: 'Limited', snyk: true },
  { feature: 'Auto-fix and push to GitHub', echo: true, sonar: false, codeclimate: false, snyk: 'PRs only' },
  { feature: 'Rotating batch (no rate limits)', echo: true, sonar: false, codeclimate: false, snyk: false },
  { feature: 'Health endpoint detection', echo: true, sonar: false, codeclimate: false, snyk: false },
  { feature: 'Structured logging audit', echo: true, sonar: 'Basic', codeclimate: false, snyk: false },
  { feature: 'Empty catch block detection', echo: true, sonar: true, codeclimate: true, snyk: false },
  { feature: 'CORS verification + auto-fix', echo: true, sonar: false, codeclimate: false, snyk: false },
  { feature: 'Auth middleware detection', echo: true, sonar: false, codeclimate: false, snyk: 'Basic' },
  { feature: 'Cross-AI awareness (Shared Brain)', echo: true, sonar: false, codeclimate: false, snyk: false },
  { feature: 'D1 findings database', echo: true, sonar: true, codeclimate: true, snyk: true },
  { feature: 'Cloudflare Workers native', echo: true, sonar: false, codeclimate: false, snyk: false },
  { feature: '$0.04/mo infrastructure cost', echo: true, sonar: false, codeclimate: false, snyk: false },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    desc: 'Essential code quality scanning',
    features: ['Up to 25 repos', '7 diagnostic checks', 'D1 findings storage', '6-hour scan cycles', 'Dashboard access'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$59',
    period: '/mo',
    desc: 'Full autonomous code quality',
    features: ['Unlimited repos', '9 diagnostic checks', '3 auto-fix capabilities', 'Rotating batch scans', 'Shared Brain integration', 'Custom scan rules', 'GitHub auto-push fixes', 'API access'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/mo',
    desc: 'Fleet-scale diagnostics',
    features: ['Everything in Professional', 'Custom diagnostic rules', 'Custom auto-fix modules', 'Multi-org support', 'Priority scanning', 'SLA guarantee', 'RBAC & audit logging', 'Dedicated support'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQS = [
  { q: 'How does the rotating batch scan work?', a: 'The agent scans 5 repos per 6-hour cron cycle, tracking its position via KV offset. After scanning all repos, it wraps around. This covers 225+ repos every few days without hitting GitHub API rate limits (5,000 requests/hour).' },
  { q: 'What are the 3 auto-fix capabilities?', a: 'The agent can auto-fix: (1) Missing structured logging — injects a slog helper function with proper log levels, (2) Missing CORS headers — adds Access-Control-Allow-Origin/Methods/Headers, (3) Missing OPTIONS handler — generates a preflight response handler. All fixes are pushed to GitHub as commits.' },
  { q: 'Will auto-fixes break my code?', a: 'Auto-fixes are conservative — they add missing functionality rather than modifying existing code. Each fix is a minimal, targeted change pushed as a new commit. Your CI/CD pipeline runs tests before deploying. If a fix causes issues, it\'s a normal git revert away.' },
  { q: 'Can I exclude repos from scanning?', a: 'Yes. Configure exclude patterns in the Worker\'s KV store. You can exclude by repo name, topic/tag, or path pattern. Archived repos are automatically skipped.' },
  { q: 'How does it integrate with the Autonomous Builder?', a: 'The Diagnostics Agent reports findings to Shared Brain. The Autonomous Builder\'s Module 16 can trigger diagnostic scans on demand, and Module 15 can read findings to generate more complex fixes that the Diagnostics Agent\'s simple auto-fixers can\'t handle.' },
  { q: 'What languages/frameworks are supported?', a: 'Currently optimized for TypeScript/JavaScript Cloudflare Workers (the Echo Prime stack). The diagnostic rules check for Hono middleware patterns, Cloudflare-specific bindings, and Worker-standard health endpoints. Custom rules can extend this to any language.' },
];

export default function DiagnosticsPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Diagnostics Agent', href: '/diagnostics' }]} />
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
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>225+ Repos Scanned</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>9 Diagnostic Checks</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>3 Auto-Fixes</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>6hr Cron Cycles</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">
          Autonomous <span className="gradient-text">Code Quality</span><br />Scanner
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
          Scans 225+ repos for 9 diagnostic issues, auto-fixes 3, and reports findings to your fleet intelligence layer — all on a rotating 6-hour cron cycle with zero configuration.
        </p>
        <div className="flex gap-4 justify-center animate-fade-up-delay-2">
          <Link href="/checkout?service=diagnostics&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/sdk/docs" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>API Docs</Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Repos Scanned', value: '225+' },
            { label: 'Diagnostic Checks', value: '9' },
            { label: 'Auto-Fix Types', value: '3' },
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
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Find It. Fix It. Forget It.</h2>
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
                <th className="text-center p-3 font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Diagnostics</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>SonarQube</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>CodeClimate</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Snyk</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid var(--ept-border)` }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.sonar, row.codeclimate, row.snyk].map((val, j) => (
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
              <Link href={`/checkout?service=diagnostics&tier=${p.name.toLowerCase()}`} className="block text-center w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-text)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
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
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Code Quality on Autopilot</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>225+ repos. 9 checks. 3 auto-fixes. Running every 6 hours while you focus on building.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout?service=diagnostics&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started Free</Link>
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
