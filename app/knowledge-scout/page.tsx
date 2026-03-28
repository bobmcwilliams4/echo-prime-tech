'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ═══════════════════════════════════════════════════════════════════
    Echo Knowledge Scout — AI-Powered Research & Discovery Agent
    Backend: echo-knowledge-scout.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Multi-Source Discovery', desc: 'Scans Reddit, Hacker News, arXiv, GitHub, RSS feeds, and tech blogs simultaneously. Finds relevant developments before your competitors do.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { title: 'AI Relevance Scoring', desc: 'Every discovery scored 0-100% for relevance to your configured domains. No noise — only signal that matters to your business.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Automated Daily Reports', desc: 'Wake up to a curated briefing of overnight discoveries. Delivered via Shared Brain broadcast so all your AI systems have context.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { title: 'Domain-Specific Tracking', desc: 'Configure interest domains: AI agents, MCP protocols, memory systems, robotics, models, tools, papers. Scout prioritizes what you care about.', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  { title: 'GitHub Repo Monitoring', desc: 'Track new repos, trending projects, and rising stars across AI, security, DevOps, and SaaS categories. Star counts, forks, and momentum analysis.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { title: 'arXiv Paper Analysis', desc: 'New AI/ML papers discovered daily with relevance scoring. Identifies breakthrough techniques applicable to your engine ecosystem.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { title: 'Competitive Intelligence', desc: 'Monitor competitor releases, product launches, and pricing changes. Get alerted when someone enters your market space.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { title: 'RSS Feed Aggregation', desc: 'Subscribe to any RSS/Atom feed. AI filters and scores articles so you only see high-value content from TechCrunch, Ars Technica, and custom sources.', icon: 'M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 110-2 1 1 0 010 2z' },
  { title: 'Cross-Instance Broadcasting', desc: 'Discoveries broadcast to Shared Brain, AI Orchestrator, and all CC instances. Your entire AI fleet learns simultaneously.', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0' },
  { title: 'Deduplication Engine', desc: 'Intelligent dedup prevents seeing the same discovery twice across different sources. Content fingerprinting catches reposts and aggregator copies.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: 'Historical Trend Analysis', desc: 'Track how topics gain momentum over weeks. Identify emerging technologies before they hit mainstream. Spot hype cycles early.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { title: 'Cron-Powered Automation', desc: 'Runs every 2 hours automatically on Cloudflare Workers. Zero maintenance, always-on intelligence gathering with no server to manage.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const COMPARISON = [
  { feature: 'Price', echo: '$19/mo', competitor1: '$99/mo', competitor2: '$49/mo', competitor3: 'Free (limited)' },
  { feature: 'Sources Monitored', echo: '7+ (extensible)', competitor1: '3', competitor2: '5', competitor3: '1' },
  { feature: 'AI Relevance Scoring', echo: 'Built-in', competitor1: 'No', competitor2: 'Basic keywords', competitor3: 'No' },
  { feature: 'arXiv Papers', echo: 'Yes', competitor1: 'No', competitor2: 'No', competitor3: 'Yes' },
  { feature: 'GitHub Monitoring', echo: 'Yes', competitor1: 'Yes', competitor2: 'No', competitor3: 'Yes' },
  { feature: 'Auto-Broadcasting', echo: 'Multi-AI fleet', competitor1: 'Slack only', competitor2: 'Email only', competitor3: 'No' },
  { feature: 'Deduplication', echo: 'Content fingerprint', competitor1: 'URL-only', competitor2: 'Title-only', competitor3: 'None' },
  { feature: 'Setup Time', echo: '2 minutes', competitor1: '30 minutes', competitor2: '15 minutes', competitor3: '5 minutes' },
];

const PRICING = [
  { tier: 'Starter', price: 19, features: ['3 source types', '50 discoveries/day', 'Daily email digest', 'Basic relevance scoring', 'Reddit + HN monitoring'], cta: 'Start Free Trial', href: '/checkout?service=knowledge-scout&tier=starter', popular: false },
  { tier: 'Pro', price: 49, features: ['All 7+ sources', 'Unlimited discoveries', 'Real-time broadcasting', 'AI relevance scoring', 'arXiv + GitHub tracking', 'Competitive monitoring', 'Custom RSS feeds', 'Trend analysis'], cta: 'Start Free Trial', href: '/checkout?service=knowledge-scout&tier=pro', popular: true },
  { tier: 'Enterprise', price: 149, features: ['Everything in Pro', 'Custom source plugins', 'API access', 'Multi-team routing', 'Priority support', 'Dedicated scout instance', 'White-label reports', 'SLA guarantee'], cta: 'Contact Sales', href: '/checkout?service=knowledge-scout&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'What sources does Knowledge Scout monitor?', a: 'Reddit (multiple subreddits), Hacker News, arXiv, GitHub trending repos, RSS/Atom feeds, and tech news sites (TechCrunch AI, etc). Each source is checked every 2-4 hours via Cloudflare Workers cron triggers.' },
  { q: 'How does AI relevance scoring work?', a: 'Each discovery is scored against your configured interest domains (e.g., "MCP protocols", "memory systems", "AI agents"). The scoring considers title match, content depth, source authority, and recency. Only discoveries above your threshold are included in reports.' },
  { q: 'Can I add custom RSS feeds?', a: 'Yes. Add any RSS or Atom feed URL and the Scout will parse, deduplicate, and score articles alongside other sources. Great for industry-specific blogs and company engineering blogs.' },
  { q: 'How does cross-AI broadcasting work?', a: 'Discoveries are posted to the Shared Brain, which means every AI system in your Echo ecosystem — Claude Desktop, Claude Code instances, bots, and orchestrators — automatically receives the intelligence. No manual forwarding needed.' },
  { q: 'Is there an API?', a: 'Yes. RESTful API for querying discoveries, managing sources, and configuring scoring thresholds. Webhook support for real-time notifications to Slack, Discord, or any HTTP endpoint.' },
  { q: 'What about data retention?', a: 'Discoveries are stored in D1 with configurable retention (default 90 days). Starred/important discoveries are kept indefinitely. Full export available anytime.' },
];

export default function KnowledgeScoutPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Knowledge Scout', href: '/knowledge-scout' }]} />
      {/* Nav */}
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

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          7+ Sources &middot; AI Scoring &middot; Always-On Cron
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Knowledge Scout</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>AI That Researches For You</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Stop wasting hours scrolling Reddit, HN, and arXiv. Knowledge Scout monitors 7+ sources every 2 hours, scores discoveries by relevance, and broadcasts intelligence to your entire AI fleet.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=knowledge-scout&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>7+</strong> Sources</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>2hr</strong> Scan Cycle</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>0</strong> Manual Effort</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Intelligence Gathering on Autopilot</h2>
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

      {/* Comparison */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Knowledge Scout vs. The Competition</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Knowledge Scout</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Feedly Pro</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Inoreader</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Google Alerts</th>
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

      {/* Pricing */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
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

      {/* FAQs */}
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

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Never Miss a Critical Development Again</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Knowledge Scout runs 24/7 so you can focus on building, not researching. Your AI fleet stays informed automatically.</p>
        <Link href="/checkout?service=knowledge-scout&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </main>
  );
}
