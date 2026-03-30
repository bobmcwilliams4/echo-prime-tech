'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import { useState } from 'react';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';
import NewsletterSignup from '../../components/NewsletterSignup';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Engines', href: '/engines' },
  { label: 'Benchmarks', href: '/benchmarks' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

const STACK_LAYERS = [
  {
    id: 'presentation',
    label: 'Presentation Layer',
    color: '#14b8a6',
    tech: ['Next.js 15', 'React 19', 'Tailwind CSS', 'Vercel Edge'],
    description: 'Static-exported progressive web apps deployed globally on Vercel. Sub-100ms first paint, automatic code splitting, ISR for dynamic content.',
    metrics: { latency: '<100ms', uptime: '99.99%' },
  },
  {
    id: 'gateway',
    label: 'API Gateway',
    color: '#0d9488',
    tech: ['SDK Gateway', 'Rate Limiting', 'Auth Middleware', 'CORS'],
    description: 'Unified entry point for all 70+ microservices. Token-based authentication, per-endpoint rate limiting, request routing, and API versioning.',
    metrics: { latency: '<15ms', throughput: '10K rps' },
  },
  {
    id: 'intelligence',
    label: 'Intelligence Layer',
    color: '#0f766e',
    tech: ['Engine Runtime', 'Doctrine Forge', 'Multi-Model AI', 'LLM Reasoning'],
    description: '5,500+ domain-specific engines backed by 64,000+ GOLD-standard doctrine blocks. Real expertise — not prompt wrappers. Claude, GPT-4, Gemini, DeepSeek, and 20+ LLM providers.',
    metrics: { engines: '5,500+', doctrines: '64K+' },
  },
  {
    id: 'automation',
    label: 'Autonomous Operations',
    color: '#115e59',
    tech: ['Autonomous Daemon', 'Builder Agent', 'Diagnostics', 'Guardian System'],
    description: 'Self-monitoring, self-healing infrastructure. Fleet health scoring, automated bug detection and resolution, cold-start prevention, version drift detection — all running 24/7 without human intervention.',
    metrics: { fleetScore: '99+', autoResolved: '1,000+' },
  },
  {
    id: 'data',
    label: 'Data Layer',
    color: '#134e4a',
    tech: ['D1 (SQLite)', 'KV Store', 'R2 Object Storage', 'Vectorize'],
    description: 'Distributed edge databases with sub-millisecond reads. 50+ D1 databases, KV namespaces for hot cache, R2 buckets for documents and media, Vectorize for semantic search.',
    metrics: { databases: '50+', storage: 'Unlimited' },
  },
  {
    id: 'memory',
    label: 'Memory & Knowledge',
    color: '#0c3631',
    tech: ['Shared Brain', 'Knowledge Forge', 'Memory Prime', 'GraphRAG'],
    description: '83,000+ brain messages across 380+ AI instances. 26,000+ knowledge documents in 576 categories. Persistent cross-session memory with semantic retrieval.',
    metrics: { documents: '26K+', messages: '83K+' },
  },
  {
    id: 'edge',
    label: 'Edge Infrastructure',
    color: '#042f2e',
    tech: ['Cloudflare Workers', '300+ PoPs', 'Zero Cold Start', 'Global Edge'],
    description: 'All services run on Cloudflare Workers — serverless functions deployed to 300+ data centers worldwide. No containers, no VMs, no scaling decisions. Code runs within 50ms of every user on Earth.',
    metrics: { locations: '300+', coldStart: '0ms' },
  },
];

const STACK_TABLE = [
  { component: 'Web Framework', choice: 'Next.js 15.3 + React 19', why: 'Static export, RSC support, automatic optimization' },
  { component: 'Hosting (Sites)', choice: 'Vercel Edge Network', why: 'Auto-deploy from GitHub, global CDN, instant rollback' },
  { component: 'Hosting (APIs)', choice: 'Cloudflare Workers', why: 'Zero cold start, 300+ edge locations, $0 idle cost' },
  { component: 'Database', choice: 'Cloudflare D1 (SQLite)', why: 'Edge-local reads, automatic replication, SQL compatibility' },
  { component: 'Cache', choice: 'Cloudflare KV', why: 'Sub-ms reads globally, 25M free reads/month' },
  { component: 'Object Storage', choice: 'Cloudflare R2', why: 'S3-compatible, zero egress fees, global replication' },
  { component: 'AI Models', choice: 'Claude + GPT-4 + 20+ LLMs', why: 'Domain-optimized routing, cost-aware model selection' },
  { component: 'Authentication', choice: 'Firebase Auth + Custom JWT', why: 'Google OAuth, email/password, role-based access' },
  { component: 'Payments', choice: 'Stripe + PayPal', why: 'Subscription billing, one-time payments, credit packs' },
  { component: 'Email', choice: 'Zoho SMTP + Resend', why: 'Transactional email, marketing campaigns, deliverability' },
  { component: 'CI/CD', choice: 'GitHub Actions + Wrangler', why: 'Push-to-deploy, automated testing, zero-downtime releases' },
  { component: 'Monitoring', choice: 'Custom Autonomous Daemon', why: 'AI-powered fleet monitoring, self-healing, 5min intervals' },
  { component: 'Version Control', choice: 'GitHub (225+ repos)', why: 'Every Worker, every site, every script tracked' },
  { component: 'Voice/TTS', choice: 'ElevenLabs + Edge TTS', why: 'Clone voices, multilingual, quota-aware provider switching' },
];

const PERFORMANCE_METRICS = [
  { label: 'API Response Time', value: '<50ms', detail: 'p95 across all endpoints', icon: 'zap' },
  { label: 'Global Edge Locations', value: '300+', detail: 'Cloudflare PoPs worldwide', icon: 'globe' },
  { label: 'Active Workers', value: '144+', detail: 'Microservices in production', icon: 'server' },
  { label: 'Engine Count', value: '5,500+', detail: 'Domain-specific AI engines', icon: 'brain' },
  { label: 'Doctrine Blocks', value: '64K+', detail: 'GOLD-standard knowledge units', icon: 'database' },
  { label: 'Fleet Health Score', value: '99+', detail: 'Autonomous monitoring 24/7', icon: 'shield' },
  { label: 'Cold Start Time', value: '0ms', detail: 'Cloudflare Workers V8 isolates', icon: 'lightning' },
  { label: 'Uptime SLA', value: '99.9%', detail: 'Across all production services', icon: 'check' },
];

const AGENT_WORKFLOW = [
  { step: 1, name: 'Request Ingestion', description: 'SDK Gateway receives and authenticates the request, applies rate limiting, and routes to the appropriate Worker.', icon: 'inbox' },
  { step: 2, name: 'Domain Classification', description: 'Engine Runtime classifies the query across 940+ domain categories to select the optimal engine(s).', icon: 'filter' },
  { step: 3, name: 'Doctrine Retrieval', description: 'Matching engines retrieve relevant doctrine blocks — real domain knowledge with citations, not generated text.', icon: 'search' },
  { step: 4, name: 'LLM Reasoning', description: 'Claude Haiku synthesizes doctrines into a structured response with confidence levels, citations, and counter-arguments.', icon: 'brain' },
  { step: 5, name: 'Quality Gate', description: 'Response passes through GOLD quality validation — minimum citation count, confidence thresholds, adversary position required.', icon: 'shield' },
  { step: 6, name: 'Response Delivery', description: 'Formatted response with structured metadata delivered to client. Brain logs the interaction for continuous improvement.', icon: 'send' },
];

const ARCH_FAQS = [
  { q: 'Why Cloudflare Workers instead of AWS Lambda or traditional servers?', a: 'Cloudflare Workers run on V8 isolates with zero cold starts, deploy to 300+ locations globally, and cost nothing when idle. Traditional servers require capacity planning, load balancers, and per-hour billing. Lambda has cold start penalties of 500ms-2s. Workers start in under 5ms every time.' },
  { q: 'How do you achieve zero cold starts?', a: 'Cloudflare Workers use V8 isolates instead of containers. There\'s no boot sequence — your code is already loaded at the edge. Additionally, our Autonomous Builder runs adaptive warmup cycles every 15 minutes for critical services.' },
  { q: 'What happens if Cloudflare goes down?', a: 'Cloudflare\'s edge network has 99.99% uptime across 300+ data centers. In the extremely unlikely event of a regional outage, traffic automatically routes to the nearest healthy PoP. Our Guardian System monitors all 144 Workers and can trigger automated failover.' },
  { q: 'How is the AI different from ChatGPT wrappers?', a: 'Our engines contain 64,000+ doctrine blocks — structured domain knowledge from real experts with actual citations (IRC sections, case law, NIST frameworks, API standards). When you ask a tax question, the answer comes from doctrine, not from an LLM making things up. The LLM formats the response; the doctrine IS the answer.' },
  { q: 'Can I inspect the stack? Is it really transparent?', a: 'Yes. Our GitHub organization (ECHO-OMEGA-PRIME) has 225+ public repositories. Every Worker, every website, every bot. This architecture page itself is open source. We believe transparency builds trust.' },
  { q: 'How does the autonomous self-healing work?', a: 'The Autonomous Daemon checks all Workers every 5 minutes. The Builder Agent runs QA sweeps, bug hunts, and version drift detection on 30-minute cycles. The dual Guardian System (Alpha + Beta) monitors each other and can resurrect crashed Workers via the Cloudflare API — all without human intervention.' },
];

function IconSvg({ name, className = '', style = {} }: { name: string; className?: string; style?: React.CSSProperties }) {
  const paths: Record<string, string> = {
    'arrow-right': 'M5 12h14m-7-7l7 7-7 7',
    'chevron-right': 'M9 18l6-6-6-6',
    'zap': 'M13 2L3 14h9l-1 10 10-12h-9l1-10z',
    'globe': 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 0 4.5 4.5 4.5 10S14.5 22 12 22 7.5 17.5 7.5 12 9.5 2 12 2zM2 12h20',
    'server': 'M2 5a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm4-8h.01M6 17h.01',
    'brain': 'M12 2a4 4 0 014 4v1a4 4 0 012 3.5 4 4 0 01-2 3.5v1a4 4 0 01-8 0v-1a4 4 0 01-2-3.5A4 4 0 018 7V6a4 4 0 014-4z',
    'database': 'M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 3c4.42 0 8 1.79 8 4s-3.58 4-8 4-8-1.79-8-4 3.58-4 8-4z',
    'shield': 'M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z',
    'lightning': 'M13 2L3 14h9l-1 10 10-12h-9l1-10z',
    'check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'inbox': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    'filter': 'M3 4h18l-7 8v5l-4 2V12L3 4z',
    'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    'send': 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
    'menu': 'M4 6h16M4 12h16M4 18h16',
    'x': 'M18 6L6 18M6 6l12 12',
    'cpu': 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7V7z',
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d={paths[name] || paths['check']} />
    </svg>
  );
}

export default function ArchitecturePage() {
  const { isDark } = useTheme();
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://echo-ept.com' }, { name: 'Architecture', url: 'https://echo-ept.com/architecture' }]} />
      <FaqSchema faqs={ARCH_FAQS.map(f => ({ question: f.q, answer: f.a }))} />

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
          <Link href="/sentinel" className="px-4 py-2 rounded-lg text-sm font-semibold text-white text-center" style={{ backgroundColor: 'var(--ept-accent)' }} onClick={() => setMobileMenu(false)}>Sentinel AI</Link>
        </div>
      )}

      {/* Hero */}
      <section className="px-6 py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Full Stack Transparency</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--ept-text)' }}>
            Our <span className="gradient-text">Architecture</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            No black boxes. No vendor lock-in. Every layer of our stack is documented, open-source, and built on commodity infrastructure you can inspect yourself.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://github.com/ECHO-OMEGA-PRIME" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2" style={{ backgroundColor: 'var(--ept-accent)' }}>
              View on GitHub <IconSvg name="arrow-right" className="w-4 h-4" />
            </a>
            <Link href="/docs" className="px-6 py-3 rounded-xl font-semibold border flex items-center gap-2" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* 7-Layer Stack Diagram */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>7-Layer Architecture</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Click any layer to explore the technologies and performance characteristics behind it.
            </p>
          </div>
          <div className="space-y-2">
            {STACK_LAYERS.map((layer, idx) => {
              const isExpanded = expandedLayer === layer.id;
              return (
                <div key={layer.id} className="animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <button
                    onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
                    className="w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 flex items-center justify-between group"
                    style={{
                      backgroundColor: isExpanded ? (isDark ? 'rgba(13,115,119,0.12)' : 'rgba(13,115,119,0.06)') : 'var(--ept-card-bg)',
                      borderColor: isExpanded ? layer.color : 'var(--ept-card-border)',
                      boxShadow: isExpanded ? `0 0 20px ${layer.color}20` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: layer.color }}>
                        L{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-base" style={{ color: 'var(--ept-text)' }}>{layer.label}</div>
                        <div className="text-xs mt-0.5 flex flex-wrap gap-1.5">
                          {layer.tech.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded font-mono" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: 'var(--ept-text-muted)', fontSize: '11px' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <IconSvg name="chevron-right" className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} style={{ color: 'var(--ept-text-muted)' }} />
                  </button>
                  {isExpanded && (
                    <div className="mt-1 p-5 rounded-xl border animate-fade-up" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{layer.description}</p>
                      <div className="flex flex-wrap gap-4">
                        {Object.entries(layer.metrics).map(([key, value]) => (
                          <div key={key} className="px-4 py-2 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
                            <div className="text-lg font-bold" style={{ color: 'var(--ept-accent)' }}>{value}</div>
                            <div className="text-xs capitalize" style={{ color: 'var(--ept-text-muted)' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stack Disclosure Table */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Complete Stack Disclosure</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Every technology we use, why we chose it, and what it does. No hidden dependencies.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
                  <th className="text-left px-5 py-3 font-semibold border-b" style={{ color: 'var(--ept-text)', borderColor: 'var(--ept-card-border)' }}>Component</th>
                  <th className="text-left px-5 py-3 font-semibold border-b" style={{ color: 'var(--ept-text)', borderColor: 'var(--ept-card-border)' }}>Technology</th>
                  <th className="text-left px-5 py-3 font-semibold border-b hidden md:table-cell" style={{ color: 'var(--ept-text)', borderColor: 'var(--ept-card-border)' }}>Why We Chose It</th>
                </tr>
              </thead>
              <tbody>
                {STACK_TABLE.map((row, idx) => (
                  <tr key={row.component} style={{ backgroundColor: idx % 2 === 0 ? 'var(--ept-card-bg)' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)') }}>
                    <td className="px-5 py-3 font-medium border-b" style={{ color: 'var(--ept-text)', borderColor: 'var(--ept-card-border)' }}>{row.component}</td>
                    <td className="px-5 py-3 border-b font-mono text-xs" style={{ color: 'var(--ept-accent)', borderColor: 'var(--ept-card-border)' }}>{row.choice}</td>
                    <td className="px-5 py-3 border-b hidden md:table-cell" style={{ color: 'var(--ept-text-muted)', borderColor: 'var(--ept-card-border)' }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Performance Metrics Grid */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Performance at a Glance</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Real numbers from our production infrastructure. Not projections — measured.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PERFORMANCE_METRICS.map((metric, idx) => (
              <div
                key={metric.label}
                className="p-5 rounded-xl border text-center card-hover animate-fade-up"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${idx * 60}ms` }}
              >
                <IconSvg name={metric.icon} className="w-6 h-6 mx-auto mb-3" style={{ color: 'var(--ept-accent)' }} />
                <div className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{metric.value}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>{metric.label}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{metric.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Workflow */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>How a Query Flows</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              From your question to a doctrine-backed answer in under 2 seconds. Here is exactly what happens.
            </p>
          </div>
          <div className="relative">
            {AGENT_WORKFLOW.map((step, idx) => (
              <div key={step.step} className="flex gap-5 mb-6 animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Timeline */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: 'var(--ept-accent)' }}>
                    {step.step}
                  </div>
                  {idx < AGENT_WORKFLOW.length - 1 && (
                    <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: 'var(--ept-card-border)' }} />
                  )}
                </div>
                {/* Content */}
                <div className="p-5 rounded-xl border flex-1" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconSvg name={step.icon} className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} />
                    <h3 className="font-bold" style={{ color: 'var(--ept-text)' }}>{step.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autonomous Operations Overview */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Autonomous Operations</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Our infrastructure doesn&apos;t just run — it monitors itself, heals itself, and improves itself. No NOC team. No on-call rotation. AI does it all.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Autonomous Daemon', desc: 'Monitors 97+ Workers every 5 minutes. Fleet health scoring, latency tracking, cold-start detection. Alerts only on real issues — false positive rate near zero.', stat: '2,500+ cycles' },
              { title: 'Autonomous Builder', desc: '25 modules, 44 capabilities. Automated warmup, QA sweeps, bug hunting, version drift detection, thin page fixing, GitHub deployment — all on recurring cron schedules.', stat: '5,080+ lines' },
              { title: 'Guardian System', desc: 'Dual redundant AI agents (Alpha + Beta) that monitor each other. If one crashes, the other resurrects it via Cloudflare API. Mutual watchdog — 24/7 zero downtime.', stat: '144 Workers watched' },
              { title: 'Diagnostics Agent', desc: 'Scans 225+ GitHub repos for 9 code quality issues. Auto-fixes logging, CORS, and route handlers. Rotating batch: 5 repos every 6 hours.', stat: '225+ repos scanned' },
              { title: 'Doctrine Forge', desc: 'Autonomous GOLD doctrine generation across 5,460 engines. 200+ LLM providers. Quality gate ensures every doctrine meets the 20-field GOLD standard.', stat: '64K+ GOLD docs' },
              { title: 'Knowledge Scout', desc: 'Daily intelligence gathering from GitHub, Reddit, and 5+ other sources. Discovers relevant new tools, frameworks, and techniques. Reports delivered every 24 hours.', stat: '7 sources daily' },
            ].map(item => (
              <div key={item.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--ept-accent)' }}>{item.stat}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source CTA */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>See For Yourself</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Every Worker, every website, every bot — all on GitHub. Browse the source code, inspect the architecture, and verify our claims. Transparency is not a feature; it is the foundation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/ECHO-OMEGA-PRIME" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--ept-accent)' }}>
              225+ Repos on GitHub <IconSvg name="arrow-right" className="w-4 h-4" />
            </a>
            <Link href="/docs" className="px-8 py-4 rounded-xl font-semibold border flex items-center justify-center gap-2" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Full Documentation
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
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Architecture FAQ</h2>
        <div className="space-y-6">
          {ARCH_FAQS.map(faq => (
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
            <Link href="/benchmarks" className="hover:underline">Benchmarks</Link>
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
