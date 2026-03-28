'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ═══════════════════════════════════════════════════════════════════
    Echo Arcanum — Sovereign Build Template Library
    Backend: echo-arcanum.bmcii1976.workers.dev (194 templates)
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: '194 Sovereign Templates', desc: 'Battle-tested build plans for Workers, bots, scrapers, AI systems, websites, and infrastructure. Each template is a complete deployment blueprint.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { title: 'Semantic Search', desc: 'Search templates by keyword, domain, technology, or use case. Fuzzy matching finds relevant templates even with imprecise queries.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { title: 'Quality Tiers', desc: 'Templates ranked by quality: Sovereign (battle-tested), Gold (production-ready), Silver (working draft). Only deploy what meets your standards.', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { title: 'Domain-Organized', desc: 'Templates categorized by domain: AI, Security, Finance, Legal, Oilfield, Bots, Infrastructure, and more. Find what you need in seconds.', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { title: 'Build Plan Generation', desc: 'Templates include full build plans: architecture, D1 schemas, API endpoints, cron schedules, service bindings, and deployment steps.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { title: 'Auto-Ingestion Loop', desc: 'Every completed build gets ingested back as a new template. The library grows smarter with every deployment. Search BEFORE → Build → Ingest AFTER.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { title: 'Multi-Template Composition', desc: 'Combine multiple templates into a single build plan. Merge a bot template with an API template with a D1 schema template for custom builds.', icon: 'M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z' },
  { title: 'REST API', desc: 'Full CRUD API for templates: search, create, update, fetch by slug. Integrate Arcanum into your CI/CD pipeline or AI agent workflows.', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { title: 'Tag System', desc: 'Rich tagging for fine-grained filtering: technology (TypeScript, Python, D1, R2), domain (AI, security, finance), status (built, planned, upgraded).', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { title: 'Version Tracking', desc: 'Templates track version history. See how build plans evolve over time. Roll back to previous versions if needed.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'AI Agent Integration', desc: 'Claude Code instances automatically search Arcanum before every build. Templates are pre-loaded into agent context for faster, better builds.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { title: 'Cloudflare-Native', desc: 'Built on Cloudflare Workers with D1 storage. Zero cold starts, global edge delivery, and sub-50ms search latency worldwide.', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
];

const PRICING = [
  { tier: 'Free', price: 0, features: ['Browse all 194 templates', 'Search by keyword', '10 API calls/day', 'Community templates', 'Read-only access'], cta: 'Browse Free', href: '/checkout?service=arcanum&tier=free', popular: false },
  { tier: 'Builder', price: 29, features: ['Unlimited API calls', 'Create custom templates', 'Quality tier filtering', 'Tag management', 'Build plan export', 'Auto-ingestion loop', 'Priority support'], cta: 'Start Building', href: '/checkout?service=arcanum&tier=builder', popular: true },
  { tier: 'Enterprise', price: 149, features: ['Everything in Builder', 'Private template library', 'Team collaboration', 'CI/CD integration', 'Custom domains', 'Audit logs', 'SLA guarantee', 'Dedicated support'], cta: 'Contact Sales', href: '/checkout?service=arcanum&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'What is a "sovereign template"?', a: 'A sovereign template is a battle-tested, production-proven build plan. It includes complete architecture specs, D1 schemas, API endpoint definitions, cron schedules, service binding configs, and deployment instructions. Think of it as a blueprint that has already been deployed and verified in production.' },
  { q: 'How does the auto-ingestion loop work?', a: 'After completing any build (Worker, bot, website, etc.), the build spec is automatically ingested back into Arcanum with a [BUILT] prefix. This means the template library grows with every deployment. Future builds benefit from everything built before.' },
  { q: 'Can I create private templates?', a: 'Yes. Enterprise tier supports private template libraries that are only visible to your team. Share build plans internally without making them public.' },
  { q: 'How do AI agents use Arcanum?', a: 'Claude Code instances are configured to search Arcanum before starting any build. The relevant templates are loaded into the agent context, providing architecture guidance, code patterns, and deployment configs. This makes builds 3-5x faster than starting from scratch.' },
  { q: 'What domains are covered?', a: 'Templates span 15+ domains: AI/ML, Security, Finance, Legal, Oilfield, Bots, Infrastructure, SaaS, Ecommerce, Healthcare, Education, Real Estate, Manufacturing, DevOps, and more. New domains are added as templates are built.' },
  { q: 'Is there an API?', a: 'Yes. Full REST API at echo-arcanum.bmcii1976.workers.dev. Search (GET /prompts/search?q=), fetch by slug (GET /prompts/by-slug/:slug), create (POST /prompts), and list all (GET /prompts). API key authentication required for write operations.' },
];

export default function ArcanumPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Arcanum', href: '/arcanum' }]} />
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
          194 Templates &middot; 15+ Domains &middot; Auto-Growing
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Echo Arcanum</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>Sovereign Build Templates</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Never build from scratch again. 194 battle-tested templates for Workers, bots, AI systems, and infrastructure. Search, combine, deploy. The library grows with every build.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=arcanum&tier=builder" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Building</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Templates</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>194</strong> Templates</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>15+</strong> Domains</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>&lt;50ms</strong> Search</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Build Faster With Battle-Tested Blueprints</h2>
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
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Stop Rebuilding What Already Exists</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>194 sovereign templates. 15+ domains. Every build makes the next one faster. Search, combine, deploy.</p>
        <Link href="/checkout?service=arcanum&tier=builder" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Building Today</Link>
      </section>
    </main>
  );
}
