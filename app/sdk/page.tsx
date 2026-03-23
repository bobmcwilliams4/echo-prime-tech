'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';

/* ═══════════════════════════════════════════════════════════════════════════
   Echo Prime SDK Developer Portal
   ═══════════════════════════════════════════════════════════════════════════ */

const CODE_EXAMPLES: Record<string, string> = {
  typescript: `import EchoPrime from "@echo-omega-prime/sdk";

const echo = new EchoPrime({ apiKey: process.env.ECHO_API_KEY });

// Query an intelligence engine
const result = await echo.engine.query({
  query: "What is MACRS depreciation for 5-year property?",
  domain: "tax",
  mode: "FAST",
});

console.log(result.analysis);
// => "MACRS (Modified Accelerated Cost Recovery System) for 5-year
//     property uses the 200% declining balance method switching to
//     straight-line. Recovery periods: 20%, 32%, 19.2%, 11.52%..."`,

  python: `import echo_prime

client = echo_prime.Client(api_key="YOUR_API_KEY")

# Query an intelligence engine
result = client.engine.query(
    query="Analyze drilling mud weight for 12,000ft well",
    domain="drilling",
    mode="DEFENSE",
)

print(result.analysis)
print(f"Confidence: {result.confidence}")
print(f"Citations: {result.authorities}")`,

  curl: `# Query an intelligence engine
curl -X POST https://echo-sdk-gateway.bmcii1976.workers.dev/engine/query \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: YOUR_API_KEY" \\
  -d '{
    "query": "What are the tax implications of a 1031 exchange?",
    "domain": "tax",
    "mode": "FAST"
  }'

# Search the knowledge base
curl -X POST https://echo-sdk-gateway.bmcii1976.workers.dev/knowledge/search \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: YOUR_API_KEY" \\
  -d '{"query": "IRC Section 1031 like-kind exchange", "limit": 5}'`,
};

const SDK_PRODUCTS = [
  {
    title: 'CLI Tool',
    description: '20 commands, 45+ subcommands. Engine queries, knowledge search, brain memory, doctrine generation. Install globally and query from any terminal.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    stats: '20 commands',
  },
  {
    title: 'Engine SDK',
    description: 'TypeScript SDK for engine queries, batch operations, metadata lookup, and domain routing. Full type safety with generics and Zod validation.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    stats: '5,400+ engines',
  },
  {
    title: 'Doctrine SDK',
    description: 'Generate domain expertise blocks with 24 FREE LLM providers. Compile reasoning frameworks, key factors, and authority citations into reusable doctrine caches.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    stats: '24 LLM providers',
  },
  {
    title: 'Tool Discovery',
    description: '927+ indexed tools across 20 categories, 8 tool chains, and intelligent recommendations. Search, discover, and compose tools into automated workflows.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    stats: '927+ tools',
  },
  {
    title: 'Bot Factory',
    description: '29 bot templates across 8 platforms. Deploy Discord, X, Telegram, LinkedIn, Slack, Reddit, WhatsApp, and Messenger bots with 14 AI personalities.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
      </svg>
    ),
    stats: '29 templates',
  },
  {
    title: 'Scraper Orchestrator',
    description: '23 scraper templates with job scheduling, result storage, and R2 integration. Web, government, social media, and dark web data extraction at scale.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
      </svg>
    ),
    stats: '23 scrapers',
  },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/engine/query', description: 'Query intelligence engines with domain routing' },
  { method: 'POST', path: '/knowledge/search', description: 'Semantic search across 12,000+ knowledge documents' },
  { method: 'POST', path: '/brain/ingest', description: 'Store memories with importance scoring' },
  { method: 'POST', path: '/brain/search', description: 'Semantic recall across infinite memory' },
  { method: 'GET', path: '/engine/list', description: 'List all engines with metadata and domains' },
  { method: 'POST', path: '/doctrine/generate', description: 'Generate doctrine blocks via 24 LLM providers' },
  { method: 'POST', path: '/chat', description: 'Chat with 14 AI personalities and engine context' },
  { method: 'POST', path: '/search/unified', description: 'Unified search across engines, knowledge, and brain' },
  { method: 'GET', path: '/health', description: 'System health with dependency status' },
  { method: 'POST', path: '/worker/call', description: 'Proxy requests to any Echo Worker service' },
];

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    queries: '1,000 queries/month',
    features: [
      '10 engine domains',
      'Knowledge search',
      'Brain storage (100 memories)',
      'Community support',
      'Rate limited: 10 req/min',
    ],
    cta: 'Get Started',
    ctaLink: '/sdk/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/mo',
    queries: '50,000 queries/month',
    features: [
      'All engine domains',
      'Doctrine generation',
      'Brain storage (unlimited)',
      'Bot Factory access',
      'Scraper Orchestrator',
      'Priority support',
      'Webhook callbacks',
      'Rate: 100 req/min',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/sdk/pricing',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    queries: 'Unlimited',
    features: [
      'Dedicated infrastructure',
      'Custom engine training',
      'Private deployment',
      'SLA guarantee (99.9%)',
      'Dedicated support engineer',
      'Audit logs & compliance',
      'Custom rate limits',
      'On-premises option',
    ],
    cta: 'Contact Sales',
    ctaLink: '/support',
    highlighted: false,
  },
];

export default function SDKDeveloperPortal() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('typescript');
  const [engineCount, setEngineCount] = useState('5,400+');
  const [doctrineCount, setDoctrineCount] = useState('697K+');

  useEffect(() => {
    fetch('https://echo-engine-runtime.bmcii1976.workers.dev/stats')
      .then(r => { if (!r.ok) throw new Error('fail'); return r.json(); })
      .then(d => {
        if (d.total_engines) {
          setEngineCount(`${(d.total_engines / 1000).toFixed(1).replace(/\.0$/, '')}K+`);
        }
        if (d.total_doctrines) {
          setDoctrineCount(`${(d.total_doctrines / 1000).toFixed(0)}K+`);
        }
      })
      .catch(() => {});
  }, []);

  const cardStyle: React.CSSProperties = {
    background: 'var(--ept-card-bg)',
    border: '1px solid var(--ept-card-border)',
    borderRadius: 12,
    padding: 24,
  };

  return (
    <div style={{ color: 'var(--ept-text)' }}>
      {/* ─── Navigation ─── */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b transition-colors duration-500"
        style={{ backgroundColor: 'var(--ept-nav-bg)', borderColor: 'var(--ept-border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Image
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="Echo Prime Technologies"
              width={600}
              height={400}
              className="w-[240px] md:w-[340px] h-auto transition-opacity duration-500"
              style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Engines', href: '/engines' },
              { label: 'Closer AI', href: '/closer' },
              { label: 'Bree AI', href: '/bree-assistant' },
              { label: 'Security', href: '/security' },
              { label: 'SDK', href: '/sdk' },
              { label: 'Pricing', href: '/pricing' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:opacity-100"
                style={{ color: item.href === '/sdk' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/sentinel" className="text-sm font-semibold transition-colors" style={{ color: 'var(--ept-accent)' }}>
              Sentinel AI
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-sm"
              style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}
            >
              {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
            </button>
            {user ? (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '140px 24px 48px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'var(--ept-accent)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 14px',
            borderRadius: 20,
            marginBottom: 20,
            letterSpacing: '0.5px',
          }}
        >
          DEVELOPER PORTAL
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold" style={{ lineHeight: 1.08, marginBottom: 20 }}>
          Echo Prime SDK
        </h1>
        <p className="text-lg md:text-xl" style={{ opacity: 0.65, maxWidth: 660, margin: '0 auto 12px', lineHeight: 1.6 }}>
          Intelligence at your fingertips.{' '}
          <span style={{ color: 'var(--ept-accent)', fontWeight: 700 }}>{engineCount}</span> engines.{' '}
          One API key.
        </p>
        <p className="text-base" style={{ opacity: 0.5, maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.5 }}>
          Query domain-specific AI reasoning, search infinite memory, generate doctrine blocks,
          and deploy bots — all through a single authenticated gateway.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sdk/signup">
            <button
              className="font-semibold transition-all hover:opacity-90"
              style={{
                background: 'var(--ept-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '14px 32px',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Get API Key
            </button>
          </Link>
          <a href="#docs">
            <button
              className="font-medium transition-all hover:opacity-80"
              style={{
                background: 'transparent',
                color: 'var(--ept-text)',
                border: '1px solid var(--ept-card-border)',
                borderRadius: 10,
                padding: '14px 32px',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              View Docs
            </button>
          </a>
        </div>
      </section>

      {/* ═══════════════ LIVE STATS BAR ═══════════════ */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14 }}>
          {[
            { label: 'Engines', value: engineCount },
            { label: 'Doctrines', value: doctrineCount },
            { label: 'Domains', value: '1,000+' },
            { label: 'Endpoints', value: '17' },
            { label: 'Latency', value: '<50ms' },
            { label: 'Uptime', value: '99.9%' },
          ].map(s => (
            <div key={s.label} style={{ ...cardStyle, textAlign: 'center', padding: 18 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ept-accent)' }}>{s.value}</div>
              <div style={{ fontSize: 12, opacity: 0.55, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ QUICK START ═══════════════ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 72px' }}>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ textAlign: 'center', marginBottom: 36 }}>
          Up and running in 60 seconds
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              step: '1',
              title: 'Install',
              code: 'npm install @echo-omega-prime/sdk',
              description: 'Install the SDK package globally or in your project.',
            },
            {
              step: '2',
              title: 'Initialize',
              code: 'echo init <your-api-key>',
              description: 'Authenticate with your API key. Keys are free at /sdk/signup.',
            },
            {
              step: '3',
              title: 'Query',
              code: 'echo engine query "What is MACRS depreciation?" --domain tax',
              description: 'Query any of 5,400+ engines from the command line or SDK.',
            },
          ].map(s => (
            <div key={s.step} style={{ ...cardStyle, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div
                style={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--ept-accent)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.title}</div>
                <pre
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 14,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
                    margin: '6px 0 6px',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  <code style={{ color: 'var(--ept-accent)' }}>{s.code}</code>
                </pre>
                <p style={{ fontSize: 13, opacity: 0.55, margin: 0 }}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SDK PRODUCTS GRID ═══════════════ */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 72px' }}>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ textAlign: 'center', marginBottom: 12 }}>
          SDK Products
        </h2>
        <p style={{ textAlign: 'center', opacity: 0.55, fontSize: 15, maxWidth: 550, margin: '0 auto 36px' }}>
          Everything you need to build intelligent applications.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
          {SDK_PRODUCTS.map(p => (
            <div
              key={p.title}
              className="card-hover"
              style={{
                ...cardStyle,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ color: 'var(--ept-accent)' }}>{p.icon}</div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(13,115,119,0.08)',
                    color: 'var(--ept-accent)',
                    letterSpacing: '0.3px',
                  }}
                >
                  {p.stats}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{p.title}</h3>
              <p style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.55, margin: 0, flex: 1 }}>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ API ENDPOINTS ═══════════════ */}
      <section id="docs" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 72px' }}>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ textAlign: 'center', marginBottom: 12 }}>
          API Reference
        </h2>
        <p style={{ textAlign: 'center', opacity: 0.55, fontSize: 15, maxWidth: 500, margin: '0 auto 32px' }}>
          All endpoints are authenticated with a single API key header.
        </p>
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr',
              fontSize: 13,
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            {/* Header */}
            <div
              style={{
                gridColumn: '1 / -1',
                display: 'grid',
                gridTemplateColumns: '90px 1fr',
                padding: '12px 20px',
                background: 'var(--ept-surface)',
                borderBottom: '1px solid var(--ept-card-border)',
                fontWeight: 700,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: 'inherit',
                opacity: 0.6,
              }}
            >
              <span>Method</span>
              <span>Endpoint</span>
            </div>
            {API_ENDPOINTS.map((ep, i) => (
              <div
                key={ep.path}
                style={{
                  gridColumn: '1 / -1',
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr',
                  padding: '14px 20px',
                  borderBottom: i < API_ENDPOINTS.length - 1 ? '1px solid var(--ept-card-border)' : 'none',
                  alignItems: 'start',
                  gap: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: ep.method === 'GET'
                      ? (isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)')
                      : (isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)'),
                    color: ep.method === 'GET' ? '#22c55e' : '#3b82f6',
                    display: 'inline-block',
                    width: 'fit-content',
                  }}
                >
                  {ep.method}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{ep.path}</div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.55,
                      marginTop: 2,
                      fontFamily: 'inherit',
                    }}
                  >
                    {ep.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link
            href="/sdk/docs"
            style={{ color: 'var(--ept-accent)', fontSize: 14, fontWeight: 600 }}
          >
            Full API documentation {'->'}
          </Link>
        </div>
      </section>

      {/* ═══════════════ CODE EXAMPLES ═══════════════ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 72px' }}>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ textAlign: 'center', marginBottom: 12 }}>
          Code Examples
        </h2>
        <p style={{ textAlign: 'center', opacity: 0.55, fontSize: 15, maxWidth: 500, margin: '0 auto 32px' }}>
          First-class support for TypeScript, Python, and cURL.
        </p>
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {/* Language tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--ept-card-border)',
              background: 'var(--ept-surface)',
            }}
          >
            {Object.keys(CODE_EXAMPLES).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                style={{
                  padding: '12px 22px',
                  fontSize: 13,
                  fontWeight: activeTab === lang ? 700 : 400,
                  color: activeTab === lang ? 'var(--ept-accent)' : 'var(--ept-text-secondary)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === lang ? '2px solid var(--ept-accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'color 0.15s',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
          {/* Code block */}
          <pre
            style={{
              padding: 24,
              margin: 0,
              fontSize: 13,
              lineHeight: 1.65,
              fontFamily: 'var(--font-mono, monospace)',
              overflowX: 'auto',
              color: isDark ? '#e2e8f0' : '#1e293b',
              background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <code>{CODE_EXAMPLES[activeTab]}</code>
          </pre>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 72px', textAlign: 'center' }}>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ marginBottom: 12 }}>
          Simple, transparent pricing
        </h2>
        <p style={{ opacity: 0.55, marginBottom: 40, fontSize: 15 }}>
          Start free. Scale when you need to. No surprises.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {PRICING_TIERS.map(tier => (
            <div
              key={tier.name}
              style={{
                ...cardStyle,
                textAlign: 'left',
                position: 'relative',
                borderColor: tier.highlighted ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {tier.highlighted && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--ept-accent)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 14px',
                    borderRadius: 20,
                    letterSpacing: '0.5px',
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tier.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--ept-accent)' }}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span style={{ fontSize: 14, opacity: 0.5 }}>{tier.period}</span>
                )}
              </div>
              <div style={{ fontSize: 13, opacity: 0.55, marginBottom: 20 }}>{tier.queries}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {tier.features.map(f => (
                  <li
                    key={f}
                    style={{
                      fontSize: 14,
                      padding: '6px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      opacity: 0.75,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="var(--ept-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={tier.ctaLink}>
                <button
                  className="font-semibold transition-all hover:opacity-90"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 10,
                    border: tier.highlighted ? 'none' : '1px solid var(--ept-card-border)',
                    background: tier.highlighted ? 'var(--ept-accent)' : 'transparent',
                    color: tier.highlighted ? '#fff' : 'var(--ept-text)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {tier.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ AUTH HEADER INFO ═══════════════ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 72px' }}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Single authentication header</h3>
          <p style={{ fontSize: 14, opacity: 0.55, maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.55 }}>
            Every request uses the same API key. No OAuth flows, no token rotation, no session management.
            One header. Every endpoint.
          </p>
          <pre
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 14,
              padding: '14px 28px',
              borderRadius: 8,
              background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
              textAlign: 'left',
            }}
          >
            <code>
              <span style={{ opacity: 0.5 }}>X-Echo-API-Key:</span>{' '}
              <span style={{ color: 'var(--ept-accent)' }}>your-api-key-here</span>
            </code>
          </pre>
        </div>
      </section>

      {/* ═══════════════ CTA FOOTER ═══════════════ */}
      <section
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '48px 24px 100px',
          textAlign: 'center',
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold" style={{ marginBottom: 12 }}>
          Start building today
        </h2>
        <p style={{ opacity: 0.55, fontSize: 15, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.55 }}>
          Get a free API key in seconds. No credit card required. 1,000 queries per month on us.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sdk/signup">
            <button
              className="font-semibold transition-all hover:opacity-90"
              style={{
                background: 'var(--ept-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '14px 36px',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Get Free API Key
            </button>
          </Link>
          <Link href="/sdk/docs">
            <button
              className="font-medium transition-all hover:opacity-80"
              style={{
                background: 'transparent',
                color: 'var(--ept-text)',
                border: '1px solid var(--ept-card-border)',
                borderRadius: 10,
                padding: '14px 36px',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Read the Docs
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
