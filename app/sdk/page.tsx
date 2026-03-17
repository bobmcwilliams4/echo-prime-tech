'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getHealth, getEngineStats, SDKHealthData, EngineStats } from '../../lib/sdk-api';
import ProductTutorialButton from '../../components/product-tutorial-button';

const CODE_EXAMPLES: Record<string, string> = {
  curl: `curl -X POST https://echo-sdk-gateway.bmcii1976.workers.dev/engine/query \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: YOUR_API_KEY" \\
  -d '{
    "query": "What are the tax implications of a 1031 exchange?",
    "mode": "FAST"
  }'`,

  python: `import requests

response = requests.post(
    "https://echo-sdk-gateway.bmcii1976.workers.dev/engine/query",
    headers={"X-Echo-API-Key": "YOUR_API_KEY"},
    json={
        "query": "What are the tax implications of a 1031 exchange?",
        "mode": "FAST"
    }
)
data = response.json()
print(data["data"]["analysis"])`,

  javascript: `const response = await fetch(
  "https://echo-sdk-gateway.bmcii1976.workers.dev/engine/query",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Echo-API-Key": "YOUR_API_KEY",
    },
    body: JSON.stringify({
      query: "What are the tax implications of a 1031 exchange?",
      mode: "FAST",
    }),
  }
);
const { data } = await response.json();
console.log(data.analysis);`,

  typescript: `interface SDKResponse<T> {
  success: boolean;
  data: T;
  error: { message: string; code: string } | null;
  meta: { ts: string; version: string; latency_ms: number };
}

const res = await fetch(
  "https://echo-sdk-gateway.bmcii1976.workers.dev/engine/query",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Echo-API-Key": process.env.ECHO_API_KEY!,
    },
    body: JSON.stringify({ query: "1031 exchange implications", mode: "FAST" }),
  }
);
const json: SDKResponse<{ analysis: string }> = await res.json();`,
};

export default function SDKLandingPage() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const [health, setHealth] = useState<SDKHealthData | null>(null);
  const [stats, setStats] = useState<EngineStats | null>(null);
  const [activeTab, setActiveTab] = useState('curl');

  useEffect(() => {
    getHealth().then((r) => { if (r.success) setHealth(r.data); }).catch(() => {});
    getEngineStats().then((r) => { if (r.success) setStats(r.data); }).catch(() => {});
  }, []);

  const cardStyle: React.CSSProperties = {
    background: 'var(--ept-card-bg)',
    border: '1px solid var(--ept-card-border)',
    borderRadius: 12,
    padding: 24,
  };

  const statItems = [
    { label: 'Engines', value: stats ? `${(stats.total_engines / 1000).toFixed(1)}K+` : '6.5K+' },
    { label: 'Doctrines', value: stats ? `${(stats.total_doctrines / 1000).toFixed(0)}K+` : '521K+' },
    { label: 'Domains', value: stats ? `${stats.categories?.length || 1000}+` : '1,000+' },
    { label: 'Endpoints', value: health ? String(health.endpoints?.total || 17) : '17' },
    { label: 'Latency', value: '<50ms' },
    { label: 'Uptime', value: '99.9%' },
  ];

  const features = [
    {
      title: 'Intelligence Engines',
      desc: 'Query 6,500+ purpose-built AI reasoning systems across 1,000+ domains. Tax, legal, oilfield, medical, finance, cybersecurity, and hundreds more.',
      endpoint: '/engine/query',
    },
    {
      title: 'Shared Brain',
      desc: 'Infinite memory layer with semantic search. Store and retrieve context across sessions, applications, and AI agents.',
      endpoint: '/brain/search',
    },
    {
      title: 'Knowledge Forge',
      desc: 'Search 12,000+ expert documents with 78,000+ chunks. 163 categories of indexed domain knowledge.',
      endpoint: '/knowledge/search',
    },
    {
      title: 'Worker Proxy',
      desc: 'Route requests to any Echo Worker through one gateway. Single auth, single endpoint, any service.',
      endpoint: '/worker/call',
    },
  ];

  return (
    <div style={{ color: 'var(--ept-text)' }}>
      <ProductTutorialButton tutorialId="sdk" productName="Echo SDK" />
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b transition-colors duration-500" style={{ backgroundColor: 'var(--ept-nav-bg)', borderColor: 'var(--ept-border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={600} height={400} className="w-[240px] md:w-[340px] h-auto transition-opacity duration-500" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Engines', href: '/engines' },
              { label: 'Closer AI', href: '/closer' },
              { label: 'Bree AI', href: '/bree-assistant' },
              { label: 'Business Manager', href: '/business-manager' },
              { label: 'Security', href: '/security' },
              { label: 'Pipelines', href: '/pipelines' },
              { label: 'SDK', href: '/sdk' },
              { label: 'Pricing', href: '/pricing' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:opacity-100" style={{ color: item.href === '/sdk' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>{item.label}</Link>
            ))}
            <Link href="/sentinel" className="text-sm font-semibold transition-colors" style={{ color: 'var(--ept-accent)' }}>Sentinel AI</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-sm" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <Link href="/dashboard" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section data-tutorial="sdk-hero" style={{ maxWidth: 1000, margin: '0 auto', padding: '120px 24px 48px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'var(--ept-accent)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 20,
            marginBottom: 20,
            letterSpacing: '0.5px',
          }}
        >
          SDK GATEWAY v1.0
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
          One API.{' '}
          <span style={{ color: 'var(--ept-accent)' }}>
            {stats ? `${(stats.total_engines / 1000).toFixed(1)}K` : '6,500'}+
          </span>{' '}
          intelligence engines.
        </h1>
        <p style={{ fontSize: 20, opacity: 0.7, maxWidth: 650, margin: '0 auto 32px', lineHeight: 1.5 }}>
          Query domain-specific AI reasoning, search infinite memory, and access 12,000+ knowledge documents — all through a single authenticated endpoint.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sdk/signup">
            <button
              style={{
                background: 'var(--ept-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Get Free API Key
            </button>
          </Link>
          <Link href="/sdk/docs">
            <button
              style={{
                background: 'transparent',
                color: 'var(--ept-text)',
                border: '1px solid var(--ept-card-border)',
                borderRadius: 8,
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              View Documentation
            </button>
          </Link>
        </div>
      </section>

      {/* Live Stats */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 48px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
          }}
        >
          {statItems.map((s) => (
            <div key={s.label} style={{ ...cardStyle, textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-accent)' }}>{s.value}</div>
              <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Service status */}
        {health && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {Object.entries(health.services).map(([name, status]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'var(--ept-card-bg)',
                  border: '1px solid var(--ept-card-border)',
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: status === 'healthy' ? '#22c55e' : '#ef4444',
                  }}
                />
                {name.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Code Example */}
      <section data-tutorial="sdk-playground" style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
          Start in seconds
        </h2>
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {/* Language tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--ept-card-border)',
              background: 'var(--ept-surface)',
            }}
          >
            {Object.keys(CODE_EXAMPLES).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                style={{
                  padding: '10px 18px',
                  fontSize: 13,
                  fontWeight: activeTab === lang ? 600 : 400,
                  color: activeTab === lang ? 'var(--ept-accent)' : 'var(--ept-text)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === lang ? '2px solid var(--ept-accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
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
              lineHeight: 1.6,
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

      {/* Features */}
      <section data-tutorial="sdk-endpoints" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
          What you can build
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} style={cardStyle}>
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 12,
                  color: 'var(--ept-accent)',
                  marginBottom: 8,
                  opacity: 0.8,
                }}
              >
                {f.endpoint}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section
        data-tutorial="sdk-pricing"
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '48px 24px 80px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Simple pricing</h2>
        <p style={{ opacity: 0.6, marginBottom: 32, fontSize: 15 }}>
          Start free. Scale when you need to.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 750, margin: '0 auto 32px' }}>
          {[
            { name: 'Free', price: '$0', queries: '100/day', cta: 'Get Started' },
            { name: 'Pro', price: '$49/mo', queries: '10,000/day', cta: 'Upgrade' },
            { name: 'Enterprise', price: '$299/mo', queries: 'Unlimited', cta: 'Contact Us' },
          ].map((t) => (
            <div key={t.name} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{t.name}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--ept-accent)', marginBottom: 4 }}>
                {t.price}
              </div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>{t.queries}</div>
              <Link href={t.name === 'Free' ? '/sdk/signup' : '/sdk/pricing'}>
                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 8,
                    border: t.name === 'Pro' ? 'none' : '1px solid var(--ept-card-border)',
                    background: t.name === 'Pro' ? 'var(--ept-accent)' : 'transparent',
                    color: t.name === 'Pro' ? '#fff' : 'var(--ept-text)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {t.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
        <Link href="/sdk/pricing" style={{ color: 'var(--ept-accent)', fontSize: 14, fontWeight: 500 }}>
          Compare all features →
        </Link>
      </section>
    </div>
  );
}
