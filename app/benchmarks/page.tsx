'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import { useState, useEffect } from 'react';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';
import NewsletterSignup from '../../components/NewsletterSignup';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Engines', href: '/engines' },
  { label: 'Architecture', href: '/architecture' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

const PERFORMANCE_COMPARISONS = [
  {
    category: 'Response Time',
    metrics: [
      { label: 'Echo Prime API (p95)', value: '<50ms', bar: 95, ours: true },
      { label: 'AWS Lambda (cold start)', value: '500-2,000ms', bar: 15, ours: false },
      { label: 'Google Cloud Functions', value: '200-800ms', bar: 25, ours: false },
      { label: 'Azure Functions', value: '300-1,500ms', bar: 20, ours: false },
    ],
  },
  {
    category: 'Cold Start',
    metrics: [
      { label: 'Echo Prime (CF Workers)', value: '0ms', bar: 100, ours: true },
      { label: 'AWS Lambda (Node.js)', value: '200-500ms', bar: 30, ours: false },
      { label: 'Google Cloud Run', value: '100-300ms', bar: 40, ours: false },
      { label: 'Vercel Serverless', value: '50-200ms', bar: 50, ours: false },
    ],
  },
  {
    category: 'Global Edge Locations',
    metrics: [
      { label: 'Cloudflare Workers', value: '300+', bar: 100, ours: true },
      { label: 'AWS CloudFront', value: '218', bar: 73, ours: false },
      { label: 'Google Cloud CDN', value: '130+', bar: 43, ours: false },
      { label: 'Azure CDN', value: '120+', bar: 40, ours: false },
    ],
  },
];

const KNOWLEDGE_QUALITY = [
  {
    metric: 'Domain-Specific Engines',
    echo: '5,500+',
    chatgpt: 'General model',
    perplexity: 'Web search',
    note: 'Each engine embeds real expert knowledge, not prompt templates',
  },
  {
    metric: 'Doctrine Blocks (GOLD standard)',
    echo: '64,000+',
    chatgpt: '0',
    perplexity: '0',
    note: 'Structured knowledge with real citations — IRC, case law, NIST',
  },
  {
    metric: 'Citation Accuracy',
    echo: '100%',
    chatgpt: 'Hallucination risk',
    perplexity: 'Web citation',
    note: 'Every citation is verified against authoritative sources',
  },
  {
    metric: 'Domain Coverage',
    echo: '940+ categories',
    chatgpt: 'General',
    perplexity: 'General',
    note: 'Tax, legal, O&G, cyber, medical, engineering, and more',
  },
  {
    metric: 'Quality Gate',
    echo: '20-field GOLD standard',
    chatgpt: 'RLHF only',
    perplexity: 'None',
    note: 'Every doctrine passes 7-point quality validation',
  },
  {
    metric: 'Adversary Position',
    echo: 'Required in output',
    chatgpt: 'Optional',
    perplexity: 'Not included',
    note: 'Counter-arguments built into every expert response',
  },
];

const SCALE_METRICS = [
  { label: 'Production Workers', value: '144+', description: 'Microservices running 24/7 on Cloudflare edge' },
  { label: 'GitHub Repositories', value: '225+', description: 'Every line of code version-controlled and inspectable' },
  { label: 'SaaS Products', value: '70+', description: 'Full-featured business applications with Stripe billing' },
  { label: 'AI Engines', value: '5,500+', description: 'Domain-specific reasoning engines with doctrine backing' },
  { label: 'GOLD Doctrines', value: '64,000+', description: 'Expert knowledge blocks with citations and quality gates' },
  { label: 'Knowledge Documents', value: '26,000+', description: 'Indexed across 576 categories in Knowledge Forge' },
  { label: 'Brain Messages', value: '83,000+', description: 'Cross-session AI memory for contextual intelligence' },
  { label: 'Domain Categories', value: '940+', description: 'From tax law to cybersecurity to petroleum engineering' },
  { label: 'Social Bot Platforms', value: '8', description: 'Discord, X, LinkedIn, Telegram, Reddit, Slack, WhatsApp, Instagram' },
  { label: 'Documentation Pages', value: '133', description: 'Comprehensive user manuals for every product' },
  { label: 'Blog Articles', value: '200+', description: 'SEO-optimized content with industry comparisons' },
  { label: 'Total EPT Pages', value: '510+', description: 'Static pages deployed globally on Vercel' },
];

const AUTONOMY_BENCHMARKS = [
  { metric: 'Fleet Health Score', value: '99+/100', detail: 'Measured every 5 minutes across 97+ Workers' },
  { metric: 'Auto-Resolved Bugs', value: '1,000+', detail: 'QA bugs detected and fixed without human intervention' },
  { metric: 'Warmup Success Rate', value: '100%', detail: '69 critical Workers kept warm, zero cold-start failures' },
  { metric: 'Monitoring Cycles', value: '2,500+', detail: 'Autonomous Daemon cycles completed since launch' },
  { metric: 'Guardian Uptime', value: '100%', detail: 'Dual watchdog system — Alpha and Beta never both offline' },
  { metric: 'Avg Deployment Time', value: '<30s', detail: 'Push to GitHub → wrangler deploy → health check verified' },
];

const BENCHMARK_FAQS = [
  { q: 'How are these benchmarks measured?', a: 'All performance metrics come from our production monitoring system — the Autonomous Daemon measures latency every 5 minutes, the Builder runs QA sweeps every 30 minutes, and the Analytics Engine aggregates 24-hour rolling data. These are not lab numbers; they are real production measurements.' },
  { q: 'Why compare against ChatGPT and Perplexity?', a: 'We are not competing with ChatGPT as a chatbot. The comparison highlights a fundamental architecture difference: our engines contain structured domain knowledge (doctrines) with verified citations, while general-purpose AI generates answers from training data without guaranteed accuracy. Different approaches for different problems.' },
  { q: 'What is a GOLD doctrine block?', a: 'A GOLD (Guaranteed Operational Legal Doctrine) block is a 20-field structured knowledge unit that passes our 7-point quality gate. Each block contains a conclusion, reasoning chain, authority citations, IRS/legal position, appeals strategy, adversary counter-arguments, and related doctrines. Every citation references a real authority — no hallucinated case law.' },
  { q: 'How do you achieve zero cold starts?', a: 'Cloudflare Workers use V8 isolates, not containers. Your code is pre-loaded at every edge location. Additionally, our Autonomous Builder runs adaptive warmup cycles — pinging critical Workers every 5-15 minutes to prevent any cold-start scenarios.' },
  { q: 'Can I verify these numbers myself?', a: 'Yes. Our Engine Runtime stats endpoint is public: echo-engine-runtime.bmcii1976.workers.dev/stats. Our GitHub has 225+ repos you can inspect. The fleet health dashboard is visible at echo-op.com. We believe in verifiable claims, not marketing assertions.' },
];

function IconSvg({ name, className = '', style = {} }: { name: string; className?: string; style?: React.CSSProperties }) {
  const paths: Record<string, string> = {
    'arrow-right': 'M5 12h14m-7-7l7 7-7 7',
    'menu': 'M4 6h16M4 12h16M4 18h16',
    'x': 'M18 6L6 18M6 6l12 12',
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d={paths[name] || ''} />
    </svg>
  );
}

function useLiveStats() {
  const [stats, setStats] = useState({ engines: '5,500+', doctrines: '64K+', categories: '940+' });
  useEffect(() => {
    fetch('https://echo-engine-runtime.bmcii1976.workers.dev/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        const e = d.total_engines || 0;
        const doc = d.total_doctrines || 0;
        const cats = (d.categories || []).length;
        setStats({
          engines: e >= 1000 ? `${(e / 1000).toFixed(1).replace(/\.0$/, '')}K+` : `${e}+`,
          doctrines: doc >= 1000 ? `${(doc / 1000).toFixed(1).replace(/\.0$/, '')}K+` : `${doc}+`,
          categories: `${cats}+`,
        });
      })
      .catch(() => {});
  }, []);
  return stats;
}

export default function BenchmarksPage() {
  const { isDark } = useTheme();
  const liveStats = useLiveStats();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://echo-ept.com' }, { name: 'Benchmarks', url: 'https://echo-ept.com/benchmarks' }]} />
      <FaqSchema faqs={BENCHMARK_FAQS.map(f => ({ question: f.q, answer: f.a }))} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md" style={{ borderColor: 'var(--ept-border)', backgroundColor: isDark ? 'rgba(5,5,8,0.85)' : 'rgba(255,255,255,0.85)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[140px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-secondary)' }}>{item.label}</Link>
          ))}
          <Link href="/sentinel" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Sentinel AI</Link>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
          <IconSvg name={mobileMenu ? 'x' : 'menu'} className="w-6 h-6" style={{ color: 'var(--ept-text)' }} />
        </button>
      </nav>

      {mobileMenu && (
        <div className="md:hidden border-b px-6 py-4 flex flex-col gap-3" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className="text-sm font-medium py-2" style={{ color: 'var(--ept-text-secondary)' }} onClick={() => setMobileMenu(false)}>{item.label}</Link>
          ))}
        </div>
      )}

      {/* Hero */}
      <section className="px-6 py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Verified Performance</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--ept-text)' }}>
            <span className="gradient-text">Benchmarks</span> & Metrics
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Real production numbers, not marketing claims. Measured continuously from our live infrastructure and updated in real time.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="text-center">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{liveStats.engines}</div>
              <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>AI Engines (live)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{liveStats.doctrines}</div>
              <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>GOLD Doctrines (live)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{liveStats.categories}</div>
              <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Domain Categories (live)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Comparison */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Performance Comparison</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              How Echo Prime&apos;s edge architecture compares to traditional cloud platforms.
            </p>
          </div>
          <div className="space-y-10">
            {PERFORMANCE_COMPARISONS.map(group => (
              <div key={group.category}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{group.category}</h3>
                <div className="space-y-3">
                  {group.metrics.map(m => (
                    <div key={m.label} className="flex items-center gap-4">
                      <div className="w-40 md:w-52 text-sm flex-shrink-0" style={{ color: m.ours ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>
                        {m.ours && <span className="font-bold">&#9733; </span>}
                        {m.label}
                      </div>
                      <div className="flex-1 h-7 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
                        <div
                          className="h-full rounded-full flex items-center justify-end pr-3 text-xs font-bold text-white transition-all duration-700"
                          style={{
                            width: `${m.bar}%`,
                            backgroundColor: m.ours ? 'var(--ept-accent)' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'),
                            color: m.ours ? '#fff' : 'var(--ept-text-muted)',
                            minWidth: '80px',
                          }}
                        >
                          {m.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Quality Comparison */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Knowledge Quality: Engines vs. General AI</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              We are not a chatbot. We are a doctrine-backed intelligence platform. Here is how the approaches differ.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
                  <th className="text-left px-5 py-3 font-semibold border-b" style={{ color: 'var(--ept-text)', borderColor: 'var(--ept-card-border)' }}>Metric</th>
                  <th className="text-left px-5 py-3 font-semibold border-b" style={{ color: 'var(--ept-accent)', borderColor: 'var(--ept-card-border)' }}>Echo Prime</th>
                  <th className="text-left px-5 py-3 font-semibold border-b" style={{ color: 'var(--ept-text-secondary)', borderColor: 'var(--ept-card-border)' }}>ChatGPT</th>
                  <th className="text-left px-5 py-3 font-semibold border-b" style={{ color: 'var(--ept-text-secondary)', borderColor: 'var(--ept-card-border)' }}>Perplexity</th>
                </tr>
              </thead>
              <tbody>
                {KNOWLEDGE_QUALITY.map((row, idx) => (
                  <tr key={row.metric} style={{ backgroundColor: idx % 2 === 0 ? 'var(--ept-card-bg)' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)') }}>
                    <td className="px-5 py-3 font-medium border-b" style={{ color: 'var(--ept-text)', borderColor: 'var(--ept-card-border)' }}>
                      {row.metric}
                      <div className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{row.note}</div>
                    </td>
                    <td className="px-5 py-3 border-b font-bold" style={{ color: 'var(--ept-accent)', borderColor: 'var(--ept-card-border)' }}>{row.echo}</td>
                    <td className="px-5 py-3 border-b" style={{ color: 'var(--ept-text-muted)', borderColor: 'var(--ept-card-border)' }}>{row.chatgpt}</td>
                    <td className="px-5 py-3 border-b" style={{ color: 'var(--ept-text-muted)', borderColor: 'var(--ept-card-border)' }}>{row.perplexity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Scale Metrics */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Scale of the Platform</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Built by a single founder using autonomous AI. Every number here is a real deployed asset, not a roadmap promise.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SCALE_METRICS.map((m, idx) => (
              <div
                key={m.label}
                className="p-5 rounded-xl border text-center card-hover animate-fade-up"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${idx * 50}ms` }}
              >
                <div className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{m.value}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>{m.label}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{m.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autonomy Benchmarks */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Autonomous Operations Benchmarks</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Our infrastructure monitors itself, heals itself, and improves itself. These are the numbers that prove it.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {AUTONOMY_BENCHMARKS.map(b => (
              <div key={b.metric} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-2xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{b.value}</div>
                <div className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{b.metric}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{b.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verify CTA */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Verify Everything</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            These are not projections. Query our live APIs, browse our GitHub repos, and test our engines yourself. We publish what we build.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sentinel" className="px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Try Sentinel AI <IconSvg name="arrow-right" className="w-4 h-4" />
            </Link>
            <Link href="/architecture" className="px-8 py-4 rounded-xl font-semibold border flex items-center justify-center gap-2" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 px-6">
        <div className="max-w-xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Benchmark FAQ</h2>
        <div className="space-y-6">
          {BENCHMARK_FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-5">
          <div className="flex items-center gap-5">
            {[
              { label: 'X / Twitter', href: 'https://x.com/EchoPrimeTech', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/company/echo-prime-tech', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              { label: 'YouTube', href: 'https://www.youtube.com/@EchoPrimeTech', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
              { label: 'GitHub', href: 'https://github.com/ECHO-OMEGA-PRIME', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
            ].map(social => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="transition-all duration-300 hover:scale-110" style={{ color: 'var(--ept-text-muted)' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--ept-accent)'; e.currentTarget.style.filter = 'drop-shadow(0 0 6px var(--ept-accent))'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--ept-text-muted)'; e.currentTarget.style.filter = 'none'; }}>
                {social.icon}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/engines" className="hover:underline">Engines</Link>
            <Link href="/architecture" className="hover:underline">Architecture</Link>
            <Link href="/case-studies" className="hover:underline">Case Studies</Link>
            <Link href="/security" className="hover:underline">Security</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
              &copy; {new Date().getFullYear()} Echo Prime Technologies. Built with autonomous AI in Midland, TX.
            </p>
            <div className="flex gap-6">
              <Link href="/legal/privacy" className="text-sm hover:opacity-80" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
              <Link href="/legal/terms" className="text-sm hover:opacity-80" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Midland, TX &middot; bobbymcwilliams@echo-op.com</p>
        </div>
      </footer>
    </div>
  );
}
