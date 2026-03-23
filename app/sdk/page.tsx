'use client';

import { useState, useRef, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';

/* ═══════════════════════════════════════════════════════════════════════════════
   Echo Prime SDK — Developer Sales + Signup Page
   Gateway: https://echo-sdk-gateway.bmcii1976.workers.dev
   ═══════════════════════════════════════════════════════════════════════════════ */

const GATEWAY = 'https://echo-sdk-gateway.bmcii1976.workers.dev';

/* ─── Code examples ─── */
const CODE_EXAMPLES: Record<string, { label: string; code: string }> = {
  typescript: {
    label: 'TypeScript',
    code: `import { EchoPrimeSDK } from '@echo-omega-prime/sdk';

const echo = new EchoPrimeSDK({ apiKey: 'your-key' });

// Query an intelligence engine
const result = await echo.engines.query('LG01', 'contract liability');

console.log(result.analysis);
// => "Under UCC 2-314, implied warranty of merchantability..."
console.log(result.confidence);   // 0.94
console.log(result.authorities);  // ["UCC 2-314", "Henningsen v. Bloomfield"]`,
  },
  python: {
    label: 'Python',
    code: `from echo_prime_sdk import EchoPrimeSDK

echo = EchoPrimeSDK(api_key="your-key")

# Query an intelligence engine
result = echo.engines.query("LG01", "contract liability")

print(result.analysis)
print(f"Confidence: {result.confidence}")
print(f"Authorities: {result.authorities}")

# Search the knowledge base
docs = echo.knowledge.search("IRC Section 1031 like-kind exchange", limit=5)
for doc in docs:
    print(f"{doc.title} — {doc.score}")`,
  },
  curl: {
    label: 'cURL',
    code: `# Query an intelligence engine
curl -X POST ${GATEWAY}/engine/query \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: your-key" \\
  -d '{
    "engine_id": "LG01",
    "query": "contract liability",
    "mode": "DEFENSE"
  }'

# Search the knowledge base
curl -X POST ${GATEWAY}/knowledge/search \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: your-key" \\
  -d '{"query": "IRC Section 1031", "limit": 5}'`,
  },
};

/* ─── Pricing tiers ─── */
const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    requests: '500 req/day',
    features: [
      '500 requests per day',
      '10 engine domains',
      'Knowledge search',
      'Community support',
      'Rate limited: 5 req/min',
    ],
    cta: 'Get Started Free',
    highlighted: false,
    tier: 'free',
  },
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    requests: '2,000 req/day',
    features: [
      '2,000 requests per day',
      'All engine domains',
      'Knowledge search + Brain storage',
      'Doctrine generation',
      'Email support',
      'Rate: 30 req/min',
    ],
    cta: 'Subscribe',
    highlighted: false,
    tier: 'starter',
  },
  {
    name: 'Pro',
    price: '$199',
    period: '/mo',
    requests: '10,000 req/day',
    features: [
      '10,000 requests per day',
      'All engine domains + priority routing',
      'Unlimited brain storage',
      'Bot Factory access',
      'Scraper Orchestrator',
      'Webhook callbacks',
      'Priority support',
      'Rate: 120 req/min',
    ],
    cta: 'Subscribe',
    highlighted: true,
    tier: 'pro',
  },
  {
    name: 'Enterprise',
    price: '$999',
    period: '/mo',
    requests: '100,000 req/day',
    features: [
      '100,000 requests per day',
      'Dedicated infrastructure',
      'Custom engine training',
      'SLA guarantee (99.9%)',
      'Dedicated support engineer',
      'Audit logs & compliance',
      'Custom rate limits',
      'On-premises option',
    ],
    cta: 'Subscribe',
    highlighted: false,
    tier: 'enterprise',
  },
];

/* ─── Features grid ─── */
const FEATURES = [
  {
    title: '5,486+ Intelligence Engines',
    description: 'Purpose-built AI reasoning across 940+ domains. Tax, legal, engineering, oil & gas, cybersecurity, finance, and more.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    stat: '940+ domains',
  },
  {
    title: '29 LLM Models',
    description: 'Route queries to the optimal model. Claude, GPT-4, Gemini, Mistral, Llama, Qwen, and 23 more — all through one API.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    stat: '29 models',
  },
  {
    title: 'Knowledge Forge',
    description: '24,000+ indexed documents. IRC sections, case law, NIST frameworks, API specs, engineering standards, and domain expertise.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    stat: '24K+ docs',
  },
  {
    title: 'Graph RAG',
    description: '312,000 connected knowledge nodes. Traverse relationships, discover hidden connections, and reason across linked concepts.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="8.5" y1="7.5" x2="15.5" y2="16.5" /><line x1="15.5" y1="7.5" x2="8.5" y2="16.5" />
      </svg>
    ),
    stat: '312K nodes',
  },
  {
    title: 'Bot Factory',
    description: 'Deploy AI bots across 8 platforms: Discord, X, Telegram, LinkedIn, Slack, Reddit, WhatsApp, Messenger. 14 built-in personalities.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><circle cx="8" cy="16" r="1" /><circle cx="16" cy="16" r="1" />
      </svg>
    ),
    stat: '8 platforms',
  },
  {
    title: 'Forge Marketplace',
    description: 'Browse, purchase, and deploy pre-built intelligence engines from the marketplace. Monetize your own engines and doctrine blocks.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    stat: 'Buy & sell',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════ */

export default function SDKPage() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('typescript');
  const [showSignup, setShowSignup] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const signupRef = useRef<HTMLDivElement>(null);

  const RED = '#dc2626';
  const RED_GLOW = 'rgba(220, 38, 38, 0.15)';
  const RED_LIGHT = 'rgba(220, 38, 38, 0.08)';

  const scrollToSignup = () => {
    setShowSignup(true);
    setTimeout(() => signupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    setApiKey('');
    try {
      const res = await fetch(`${GATEWAY}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, name: signupName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setApiKey(data.api_key || data.apiKey || data.key || '');
    } catch (err: unknown) {
      setSignupError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handlePricingCTA = async (tier: typeof PRICING_TIERS[0]) => {
    if (tier.tier === 'free') {
      scrollToSignup();
      return;
    }
    // Paid tiers — POST to checkout endpoint
    try {
      const res = await fetch(`${GATEWAY}/auth/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: tier.tier, email: signupEmail || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback — open signup first
        scrollToSignup();
      }
    } catch {
      scrollToSignup();
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardBg = 'var(--ept-card-bg)';
  const cardBorder = 'var(--ept-card-border)';
  const textPrimary = 'var(--ept-text)';
  const textSecondary = 'var(--ept-text-secondary)';
  const textMuted = 'var(--ept-text-muted)';
  const surface = 'var(--ept-surface)';

  return (
    <div style={{ color: textPrimary, minHeight: '100vh' }}>
      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b transition-colors duration-500"
        style={{ backgroundColor: 'var(--ept-nav-bg)', borderColor: 'var(--ept-border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="Echo Prime Technologies"
              width={600}
              height={400}
              className="w-[200px] md:w-[280px] h-auto transition-opacity duration-500"
              style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Engines', href: '/engines' },
              { label: 'Closer AI', href: '/closer' },
              { label: 'Security', href: '/security' },
              { label: 'SDK', href: '/sdk' },
              { label: 'Pricing', href: '/pricing' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:opacity-100"
                style={{ color: item.href === '/sdk' ? RED : textSecondary }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-sm"
              style={{ backgroundColor: surface, color: textSecondary }}
              aria-label="Toggle theme"
            >
              {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
            </button>
            {user ? (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: RED, color: '#fff' }}
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={scrollToSignup}
                className="hidden md:inline-flex px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: RED, color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Get API Key
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: 120 }}>
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${RED_GLOW} 0%, transparent 70%)`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <div
            className="inline-block text-xs font-bold tracking-widest uppercase mb-6 animate-fade-up"
            style={{
              background: RED_LIGHT,
              color: RED,
              padding: '6px 16px',
              borderRadius: 20,
              border: `1px solid ${RED}33`,
            }}
          >
            ECHO PRIME SDK
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold animate-fade-up animate-fade-up-delay-1"
            style={{ lineHeight: 1.05, marginBottom: 24 }}
          >
            Build with{' '}
            <span style={{ color: RED }}>5,486+</span>
            <br />
            Intelligence Engines
          </h1>

          <p
            className="text-lg md:text-xl animate-fade-up animate-fade-up-delay-2"
            style={{ color: textSecondary, maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6 }}
          >
            One API key. 940+ domains. Query domain-specific AI reasoning, search infinite memory,
            generate doctrine blocks, and deploy bots — all through a single gateway.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-up animate-fade-up-delay-3">
            <button
              onClick={scrollToSignup}
              className="font-bold text-base transition-all hover:scale-105"
              style={{
                background: RED,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '16px 36px',
                cursor: 'pointer',
                boxShadow: `0 0 30px ${RED_GLOW}`,
              }}
            >
              Get Free API Key
            </button>
            <a href="#docs">
              <button
                className="font-semibold text-base transition-all hover:opacity-80"
                style={{
                  background: 'transparent',
                  color: textPrimary,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 12,
                  padding: '16px 36px',
                  cursor: 'pointer',
                }}
              >
                View Docs
              </button>
            </a>
          </div>

          {/* Live stats */}
          <div
            className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-16 animate-fade-up animate-fade-up-delay-4"
            style={{ maxWidth: 800, margin: '64px auto 0' }}
          >
            {[
              { v: '5,486+', l: 'Engines' },
              { v: '940+', l: 'Domains' },
              { v: '29', l: 'LLM Models' },
              { v: '24K+', l: 'Knowledge Docs' },
              { v: '<50ms', l: 'Latency' },
              { v: '99.9%', l: 'Uptime' },
            ].map(s => (
              <div
                key={s.l}
                className="rounded-xl text-center py-4 px-2"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="text-xl md:text-2xl font-extrabold" style={{ color: RED }}>{s.v}</div>
                <div className="text-xs mt-1" style={{ color: textMuted }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TERMINAL INSTALL ═══════════════ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          Up and running in 60 seconds
        </h2>
        <p className="text-center mb-10" style={{ color: textSecondary, fontSize: 15 }}>
          Install the CLI, sign up, and start querying — all from your terminal.
        </p>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: isDark ? '#0c0c14' : '#1a1a2e', border: `1px solid ${isDark ? '#1e293b' : '#2d2d44'}` }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: isDark ? '#08080f' : '#12121f', borderBottom: `1px solid ${isDark ? '#1e293b' : '#2d2d44'}` }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-3 text-xs font-mono" style={{ color: '#64748b' }}>terminal</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm leading-relaxed" style={{ color: '#e2e8f0' }}>
            <div style={{ color: '#64748b', marginBottom: 12 }}># Install the CLI (Node.js)</div>
            <div>
              <span style={{ color: '#22c55e' }}>$</span>{' '}
              <span style={{ color: '#f1f5f9' }}>npm install -g @echo-omega-prime/cli</span>
            </div>
            <div className="mt-6" style={{ color: '#64748b' }}># Sign up for a free API key</div>
            <div>
              <span style={{ color: '#22c55e' }}>$</span>{' '}
              <span style={{ color: '#f1f5f9' }}>echo signup you@email.com</span>
            </div>
            <div className="mt-1" style={{ color: '#94a3b8' }}>
              {'  '}API Key: <span style={{ color: RED }}>echo_sk_1a2b3c4d5e6f...</span>
            </div>
            <div className="mt-6" style={{ color: '#64748b' }}># Query an intelligence engine</div>
            <div>
              <span style={{ color: '#22c55e' }}>$</span>{' '}
              <span style={{ color: '#f1f5f9' }}>echo engine query &quot;contract liability&quot;</span>
            </div>
            <div className="mt-1" style={{ color: '#94a3b8' }}>
              {'  '}Engine LG01 | Confidence: 0.94 | 3 authorities cited
            </div>

            <div
              className="mt-8 pt-6"
              style={{ borderTop: `1px solid ${isDark ? '#1e293b' : '#2d2d44'}` }}
            >
              <div style={{ color: '#64748b', marginBottom: 8 }}># Or install with Python</div>
              <div>
                <span style={{ color: '#22c55e' }}>$</span>{' '}
                <span style={{ color: '#f1f5f9' }}>pip install echo-prime-sdk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CODE EXAMPLES ═══════════════ */}
      <section id="docs" className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          Code Examples
        </h2>
        <p className="text-center mb-10" style={{ color: textSecondary, fontSize: 15 }}>
          First-class support for TypeScript, Python, and cURL.
        </p>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: `1px solid ${cardBorder}`, background: surface }}>
            {Object.entries(CODE_EXAMPLES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="font-medium text-sm transition-colors"
                style={{
                  padding: '14px 24px',
                  color: activeTab === key ? RED : textSecondary,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === key ? `2px solid ${RED}` : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
          {/* Code block */}
          <pre
            className="font-mono text-sm"
            style={{
              padding: 24,
              margin: 0,
              lineHeight: 1.7,
              overflowX: 'auto',
              color: isDark ? '#e2e8f0' : '#1e293b',
              background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <code>{CODE_EXAMPLES[activeTab].code}</code>
          </pre>
        </div>
      </section>

      {/* ═══════════════ FEATURES GRID ═══════════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          Everything You Need
        </h2>
        <p className="text-center mb-12" style={{ color: textSecondary, fontSize: 15, maxWidth: 500, margin: '0 auto 48px' }}>
          One API. Full stack intelligence infrastructure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="card-hover rounded-2xl p-6 flex flex-col gap-4 transition-all"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="flex items-center justify-between">
                <div style={{ color: RED }}>{f.icon}</div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: RED_LIGHT, color: RED, border: `1px solid ${RED}22` }}
                >
                  {f.stat}
                </span>
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: textSecondary, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center mb-12" style={{ color: textSecondary, fontSize: 15 }}>
          Start free. Scale as you grow. No surprises.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {PRICING_TIERS.map(tier => (
            <div
              key={tier.name}
              className="card-hover rounded-2xl p-6 flex flex-col relative transition-all"
              style={{
                background: cardBg,
                border: tier.highlighted ? `2px solid ${RED}` : `1px solid ${cardBorder}`,
                boxShadow: tier.highlighted ? `0 0 40px ${RED_GLOW}` : 'none',
              }}
            >
              {tier.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full"
                  style={{ background: RED, color: '#fff', letterSpacing: '0.5px' }}
                >
                  MOST POPULAR
                </div>
              )}

              <div className="text-base font-bold mb-2">{tier.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold" style={{ color: RED }}>{tier.price}</span>
                {tier.period && <span className="text-sm" style={{ color: textMuted }}>{tier.period}</span>}
              </div>
              <div className="text-sm mb-5" style={{ color: textMuted }}>{tier.requests}</div>

              <ul className="flex-1 mb-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 py-1.5 text-sm" style={{ color: textSecondary }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
                      <path d="M3 8.5L6.5 12L13 4" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePricingCTA(tier)}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{
                  background: tier.highlighted ? RED : 'transparent',
                  color: tier.highlighted ? '#fff' : textPrimary,
                  border: tier.highlighted ? 'none' : `1px solid ${cardBorder}`,
                  cursor: 'pointer',
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SIGNUP FORM ═══════════════ */}
      <section ref={signupRef} className="max-w-xl mx-auto px-6 pb-24" id="signup">
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          {apiKey ? (
            /* ─── Success state ─── */
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(34, 197, 94, 0.12)' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">You&apos;re in!</h3>
              <p className="text-sm mb-6" style={{ color: textSecondary }}>
                Your API key is ready. Keep it safe — you won&apos;t see it again.
              </p>

              <div
                className="flex items-center gap-2 rounded-xl p-4 mb-6 font-mono text-sm"
                style={{
                  background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${cardBorder}`,
                  wordBreak: 'break-all',
                }}
              >
                <code className="flex-1" style={{ color: RED }}>{apiKey}</code>
                <button
                  onClick={copyKey}
                  className="flex-shrink-0 p-2 rounded-lg transition-all hover:opacity-80"
                  style={{
                    background: copied ? 'rgba(34,197,94,0.12)' : RED_LIGHT,
                    color: copied ? '#22c55e' : RED,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              </div>

              <div
                className="rounded-xl p-4 text-left font-mono text-xs leading-relaxed"
                style={{
                  background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
                  color: isDark ? '#94a3b8' : '#64748b',
                }}
              >
                <div style={{ color: '#64748b' }}># Start using your key:</div>
                <div className="mt-1">
                  <span style={{ color: '#22c55e' }}>$</span>{' '}
                  npm install -g @echo-omega-prime/cli
                </div>
                <div>
                  <span style={{ color: '#22c55e' }}>$</span>{' '}
                  echo init {apiKey.slice(0, 12)}...
                </div>
                <div>
                  <span style={{ color: '#22c55e' }}>$</span>{' '}
                  echo engine query &quot;your first query&quot;
                </div>
              </div>
            </div>
          ) : (
            /* ─── Signup form ─── */
            <>
              <h3 className="text-2xl font-bold mb-2 text-center">Get Your Free API Key</h3>
              <p className="text-sm text-center mb-8" style={{ color: textSecondary }}>
                No credit card required. 500 requests per day. Start building immediately.
              </p>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="Jane Developer"
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2"
                    style={{
                      background: surface,
                      border: `1px solid ${cardBorder}`,
                      color: textPrimary,
                      // @ts-expect-error CSS custom property
                      '--tw-ring-color': RED,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="signup-email">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2"
                    style={{
                      background: surface,
                      border: `1px solid ${cardBorder}`,
                      color: textPrimary,
                      // @ts-expect-error CSS custom property
                      '--tw-ring-color': RED,
                    }}
                  />
                </div>

                {signupError && (
                  <div className="text-sm font-medium rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                    {signupError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: RED,
                    color: '#fff',
                    border: 'none',
                    cursor: signupLoading ? 'not-allowed' : 'pointer',
                    boxShadow: `0 0 20px ${RED_GLOW}`,
                  }}
                >
                  {signupLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating your key...
                    </span>
                  ) : (
                    'Get Free API Key'
                  )}
                </button>
              </form>

              <p className="text-xs text-center mt-6" style={{ color: textMuted }}>
                By signing up you agree to our{' '}
                <Link href="/legal/terms" className="underline" style={{ color: textSecondary }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/legal/privacy" className="underline" style={{ color: textSecondary }}>Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ═══════════════ AUTH HEADER INFO ═══════════════ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <h3 className="text-xl font-bold mb-3">Single Authentication Header</h3>
          <p className="text-sm mb-6" style={{ color: textSecondary, maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
            No OAuth flows, no token rotation, no session management. One header. Every endpoint.
          </p>
          <pre
            className="inline-block font-mono text-sm rounded-xl px-6 py-4"
            style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)' }}
          >
            <code>
              <span style={{ color: textMuted }}>X-Echo-API-Key:</span>{' '}
              <span style={{ color: RED }}>your-api-key-here</span>
            </code>
          </pre>
        </div>
      </section>

      {/* ═══════════════ FOOTER CTA ═══════════════ */}
      <section className="max-w-3xl mx-auto px-6 pb-32 text-center">
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${RED_GLOW} 0%, transparent 70%)`,
            }}
          />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Start building for free
            </h2>
            <p className="text-base mb-10" style={{ color: textSecondary, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Get a free API key in seconds. 500 requests per day. No credit card required.
              Join developers building the next generation of intelligent applications.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={scrollToSignup}
                className="font-bold text-base transition-all hover:scale-105"
                style={{
                  background: RED,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '16px 40px',
                  cursor: 'pointer',
                  boxShadow: `0 0 30px ${RED_GLOW}`,
                }}
              >
                Get Free API Key
              </button>
              <Link href="/engines">
                <button
                  className="font-semibold text-base transition-all hover:opacity-80"
                  style={{
                    background: 'transparent',
                    color: textPrimary,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: 12,
                    padding: '16px 40px',
                    cursor: 'pointer',
                  }}
                >
                  Browse Engines
                </button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 justify-center text-sm" style={{ color: textMuted }}>
              <span>5,486+ engines</span>
              <span>|</span>
              <span>29 LLM models</span>
              <span>|</span>
              <span>99.9% uptime</span>
              <span>|</span>
              <span>{'<'}50ms latency</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
