'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import FaqSchema from '@/components/FaqSchema';

/* ═══════════════════════════════════════════════════════════════════════════════
   Echo Prime SDK — Developer Manual
   Gateway: https://echo-sdk-gateway.bmcii1976.workers.dev
   ═══════════════════════════════════════════════════════════════════════════════ */

const BASE = 'https://echo-sdk-gateway.bmcii1976.workers.dev';

const SECTIONS = [
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'auth', label: 'Authentication' },
  { id: 'api', label: 'API Reference' },
  { id: 'sdks', label: 'SDKs' },
  { id: 'rate-limits', label: 'Rate Limits' },
  { id: 'errors', label: 'Error Handling' },
  { id: 'faq', label: 'FAQ' },
];

const RATE_LIMITS = [
  { tier: 'Free', daily: '100', perMin: '5', price: '$0', color: 'var(--ept-text-muted)' },
  { tier: 'Starter', daily: '1,000', perMin: '30', price: '$49/mo', color: 'var(--ept-accent)' },
  { tier: 'Pro', daily: '10,000', perMin: '120', price: '$199/mo', color: '#a78bfa' },
  { tier: 'Enterprise', daily: 'Unlimited', perMin: 'Custom', price: '$999/mo', color: '#f59e0b' },
];

const ERROR_CODES = [
  { code: 400, message: 'Bad Request', cause: 'Missing or invalid parameters.', fix: 'Check the request body matches the endpoint schema.' },
  { code: 401, message: 'Unauthorized', cause: 'Missing or invalid API key.', fix: 'Include a valid X-Echo-API-Key header.' },
  { code: 403, message: 'Forbidden', cause: 'Key does not have access to this resource.', fix: 'Upgrade your tier or contact support.' },
  { code: 404, message: 'Not Found', cause: 'Endpoint or resource does not exist.', fix: 'Verify the URL path and resource ID.' },
  { code: 429, message: 'Too Many Requests', cause: 'Rate limit exceeded.', fix: 'Wait for the Retry-After period or upgrade your tier.' },
  { code: 500, message: 'Internal Server Error', cause: 'Unexpected server error.', fix: 'Retry with exponential backoff. If persistent, contact support.' },
];

const FAQ = [
  { q: 'Is there a free tier?', a: 'Yes. The free tier gives you 100 requests per day across all endpoints and all 5,486+ engines. No credit card required.' },
  { q: 'How do I get an API key?', a: 'Sign up at echo-ept.com/sdk/signup. Your API key is generated instantly and shown on your dashboard.' },
  { q: 'Can I use the SDK with TypeScript?', a: 'Yes. Install @echo-omega-prime/sdk from npm. It ships with full TypeScript declarations and supports both ESM and CommonJS.' },
  { q: 'What happens when I hit the rate limit?', a: 'You receive HTTP 429 with a Retry-After header indicating seconds until your next allowed request. Implement exponential backoff for best results.' },
  { q: 'Do you support WebSocket or streaming?', a: 'Not yet. All endpoints use standard HTTP request/response. Streaming support for engine queries is on the roadmap.' },
  { q: 'How is pricing calculated?', a: 'Each authenticated API call counts as one request against your daily limit. Health checks and the OpenAPI spec endpoint are free.' },
  { q: 'Can I switch tiers mid-cycle?', a: 'Yes. Upgrades take effect immediately with prorated billing. Downgrades apply at the next billing cycle.' },
  { q: 'Is there an SLA?', a: 'Enterprise tier includes a 99.9% uptime SLA. Free, Starter, and Pro tiers target 99.5% but without a contractual guarantee.' },
];

/* ─── CodeBlock component ─── */
function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--ept-card-border)', marginBottom: 16 }}>
      {lang && (
        <div style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, background: 'var(--ept-surface)', borderBottom: '1px solid var(--ept-card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ opacity: 0.6, color: 'var(--ept-text-secondary)' }}>{lang}</span>
          <button onClick={handleCopy} style={{ background: 'transparent', border: 'none', color: 'var(--ept-accent)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      )}
      <pre className="font-mono" style={{ margin: 0, padding: 16, fontSize: 13, lineHeight: 1.6, overflowX: 'auto', background: 'var(--ept-surface)', color: 'var(--ept-text)' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── Section heading ─── */
function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ept-text)', marginTop: 48, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--ept-border)' }}>
      {children}
    </h2>
  );
}

/* ─── Endpoint block ─── */
function Endpoint({ method, path, description, reqBody, resBody }: { method: string; path: string; description: string; reqBody: string; resBody: string }) {
  const methodColors: Record<string, string> = { GET: '#10b981', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444' };
  return (
    <div style={{ marginBottom: 32, padding: 20, borderRadius: 12, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4, color: '#fff', backgroundColor: methodColors[method] || 'var(--ept-accent)' }}>{method}</span>
        <code className="font-mono" style={{ fontSize: 14, color: 'var(--ept-text)' }}>{path}</code>
      </div>
      <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{description}</p>
      <CodeBlock lang="Request" code={reqBody} />
      <CodeBlock lang="Response" code={resBody} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════ */
export default function SDKDocsManualPage() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('quickstart');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Docs', href: '/docs' }, { name: 'SDK Manual', href: '/docs/sdk' }]} />
      <FaqSchema faqs={FAQ} />

      {/* ── Nav bar ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/sdk" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>SDK Home</Link>
          <Link href="/sdk/playground" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Playground</Link>
          <Link href="/sdk/signup" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get API Key</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 32, padding: '32px 24px' }}>
        {/* ── Sidebar TOC ── */}
        <aside className="hidden md:block" style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ept-text-muted)', marginBottom: 12 }}>On this page</p>
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)} style={{ display: 'block', padding: '6px 12px', fontSize: 13, borderRadius: 6, marginBottom: 2, color: activeSection === s.id ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: activeSection === s.id ? 600 : 400, backgroundColor: activeSection === s.id ? 'var(--ept-surface)' : 'transparent', textDecoration: 'none' }}>
              {s.label}
            </a>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)', marginBottom: 8 }}>Echo Prime SDK Manual</h1>
          <p style={{ fontSize: 16, color: 'var(--ept-text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
            One API, 5,486+ intelligence engines across 940+ domains. Build AI-powered applications with engine queries, knowledge search, bot management, and voice synthesis.
          </p>

          {/* ═══ 1. QUICK START ═══ */}
          <SectionHeading id="quickstart">Quick Start</SectionHeading>
          <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Get up and running in under two minutes. Install the SDK, set your API key, and make your first query.
          </p>
          <CodeBlock lang="bash" code={`npm install @echo-omega-prime/sdk`} />
          <CodeBlock lang="TypeScript" code={`import { EchoPrimeSDK } from '@echo-omega-prime/sdk';

const echo = new EchoPrimeSDK({ apiKey: process.env.ECHO_API_KEY });

// Query an intelligence engine
const result = await echo.engines.query('TX01', 'What is IRC Section 179?');

console.log(result.analysis);      // Full doctrine-backed analysis
console.log(result.confidence);     // "DEFENSIBLE"
console.log(result.authorities);    // ["IRC \u00a7179", "Rev. Proc. 2023-34"]
console.log(result.latency_ms);     // 38`} />

          {/* ═══ 2. AUTHENTICATION ═══ */}
          <SectionHeading id="auth">Authentication</SectionHeading>
          <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            All API requests require an API key passed via the <code className="font-mono" style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--ept-surface)', fontSize: 13 }}>X-Echo-API-Key</code> header.
          </p>
          <div style={{ padding: 16, borderRadius: 8, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-card-border)', marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 8 }}>How to get your key:</p>
            <ol style={{ fontSize: 14, color: 'var(--ept-text-secondary)', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li>Go to <Link href="/sdk/signup" style={{ color: 'var(--ept-accent)', textDecoration: 'underline' }}>echo-ept.com/sdk/signup</Link> and create an account.</li>
              <li>Your API key is generated instantly on signup.</li>
              <li>Copy the key and store it securely (environment variable recommended).</li>
              <li>Include it in every request as shown below.</li>
            </ol>
          </div>
          <CodeBlock lang="bash" code={`curl -s "${BASE}/engine/status" \\
  -H "X-Echo-API-Key: YOUR_API_KEY"`} />
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', margin: 0 }}>
              <strong style={{ color: 'var(--ept-text)' }}>Security tip:</strong> Never expose your API key in client-side code or public repositories. Use environment variables and server-side proxies.
            </p>
          </div>

          {/* ═══ 3. API REFERENCE ═══ */}
          <SectionHeading id="api">API Reference</SectionHeading>
          <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>
            Base URL: <code className="font-mono" style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--ept-surface)', fontSize: 13 }}>{BASE}</code>
          </p>
          <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            All responses follow a consistent envelope: <code className="font-mono" style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--ept-surface)', fontSize: 13 }}>{`{ "success": bool, "data": {...}, "error"?: string }`}</code>
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Engine Queries</h3>
          <Endpoint
            method="POST" path="/v1/engine/query"
            description="Query an intelligence engine with natural language. The gateway routes to the best-matching engine based on domain detection and returns doctrine-backed analysis with authority citations."
            reqBody={`POST ${BASE}/v1/engine/query
Content-Type: application/json
X-Echo-API-Key: YOUR_KEY

{
  "engine_id": "TX01",
  "query": "What is the Section 179 deduction limit for 2025?",
  "mode": "DEFENSE"
}`}
            resBody={`{
  "success": true,
  "data": {
    "answer": "For tax year 2025, the Section 179 deduction limit is...",
    "engine_id": "TX01",
    "domain": "tax",
    "confidence": "DEFENSIBLE",
    "authorities": ["IRC \u00a7179", "Rev. Proc. 2024-34"],
    "latency_ms": 42
  }
}`}
          />

          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Knowledge Search</h3>
          <Endpoint
            method="POST" path="/v1/knowledge/search"
            description="Semantic search across the knowledge base with 24,000+ indexed documents. Returns ranked document chunks with similarity scores."
            reqBody={`POST ${BASE}/v1/knowledge/search
Content-Type: application/json
X-Echo-API-Key: YOUR_KEY

{
  "query": "IRC Section 1031 like-kind exchange requirements",
  "limit": 5,
  "category": "tax"
}`}
            resBody={`{
  "success": true,
  "data": {
    "results": [
      { "title": "IRC 1031 Exchange Guide", "category": "tax", "score": 0.96, "chunk": "..." },
      { "title": "Like-Kind Property Rules", "category": "tax", "score": 0.89, "chunk": "..." }
    ],
    "total_chunks": 75000
  }
}`}
          />

          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Bot Management</h3>
          <Endpoint
            method="GET" path="/v1/bots"
            description="List all bots in your account. Returns bot configurations, platform connections, and status."
            reqBody={`GET ${BASE}/v1/bots
X-Echo-API-Key: YOUR_KEY`}
            resBody={`{
  "success": true,
  "data": {
    "bots": [
      { "bot_id": "bot_x9k2", "name": "Support Bot", "platform": "discord", "status": "active" },
      { "bot_id": "bot_m3p7", "name": "Sales Bot", "platform": "slack", "status": "active" }
    ],
    "total": 2
  }
}`}
          />
          <Endpoint
            method="POST" path="/v1/bots"
            description="Create a new bot with a specified platform, personality, and configuration. The bot is deployed automatically."
            reqBody={`POST ${BASE}/v1/bots
Content-Type: application/json
X-Echo-API-Key: YOUR_KEY

{
  "name": "Customer Support",
  "platform": "discord",
  "personality": "professional",
  "engine_id": "CS01"
}`}
            resBody={`{
  "success": true,
  "data": {
    "bot_id": "bot_r4w1",
    "name": "Customer Support",
    "platform": "discord",
    "status": "provisioning",
    "webhook_url": "https://..."
  }
}`}
          />

          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Voice Synthesis</h3>
          <Endpoint
            method="POST" path="/v1/voice/synthesize"
            description="Convert text to speech using 69+ cloned voices. Supports multiple providers (ElevenLabs, Edge TTS) with emotion control."
            reqBody={`POST ${BASE}/v1/voice/synthesize
Content-Type: application/json
X-Echo-API-Key: YOUR_KEY

{
  "text": "Hello, this is a test of the voice synthesis API.",
  "voice_id": "echo-default",
  "format": "mp3"
}`}
            resBody={`{
  "success": true,
  "data": {
    "audio_url": "https://r2.echo-op.com/voice/abc123.mp3",
    "duration_ms": 3200,
    "voice_id": "echo-default",
    "format": "mp3",
    "size_bytes": 51200
  }
}`}
          />

          {/* ═══ 4. SDKs ═══ */}
          <SectionHeading id="sdks">SDK Libraries</SectionHeading>
          <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Official client libraries handle authentication, retries, and type safety. Use any language that can make HTTP requests.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>JavaScript / TypeScript</h3>
          <CodeBlock lang="bash" code="npm install @echo-omega-prime/sdk" />
          <CodeBlock lang="TypeScript" code={`import { EchoPrimeSDK } from '@echo-omega-prime/sdk';

const echo = new EchoPrimeSDK({ apiKey: process.env.ECHO_API_KEY });

const result = await echo.engines.query('LG01', 'contract liability');
const docs = await echo.knowledge.search('OSHA fall protection', { limit: 5 });
const audio = await echo.voice.synthesize('Hello world', { voice: 'echo-default' });`} />

          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>Python</h3>
          <CodeBlock lang="bash" code="pip install echo-prime-sdk" />
          <CodeBlock lang="Python" code={`from echo_prime_sdk import EchoPrimeSDK

echo = EchoPrimeSDK(api_key="YOUR_KEY")

result = echo.engines.query("TX01", "IRC Section 179 limits")
docs = echo.knowledge.search("like-kind exchange", limit=5)
audio = echo.voice.synthesize("Hello world", voice="echo-default")`} />

          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>cURL</h3>
          <CodeBlock lang="bash" code={`# Engine query
curl -X POST "${BASE}/v1/engine/query" \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: YOUR_KEY" \\
  -d '{"engine_id":"TX01","query":"Section 179 limits","mode":"DEFENSE"}'

# Knowledge search
curl -X POST "${BASE}/v1/knowledge/search" \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: YOUR_KEY" \\
  -d '{"query":"IRC 1031 exchange","limit":5}'`} />

          {/* ═══ 5. RATE LIMITS ═══ */}
          <SectionHeading id="rate-limits">Rate Limits</SectionHeading>
          <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Each API key has a daily request limit and a per-minute burst limit based on its tier. Limits reset at midnight UTC.
          </p>
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ept-border)' }}>
                  {['Tier', 'Daily Limit', 'Burst (per min)', 'Price'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--ept-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RATE_LIMITS.map(r => (
                  <tr key={r.tier} style={{ borderBottom: '1px solid var(--ept-border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: r.color }}>{r.tier}</td>
                    <td className="font-mono" style={{ padding: '12px 16px', color: 'var(--ept-text)' }}>{r.daily}</td>
                    <td className="font-mono" style={{ padding: '12px 16px', color: 'var(--ept-text)' }}>{r.perMin}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ept-text-secondary)' }}>{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
            <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', margin: 0 }}>
              <strong style={{ color: 'var(--ept-text)' }}>Rate limit headers:</strong> Every response includes{' '}
              <code className="font-mono" style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, backgroundColor: 'var(--ept-surface)' }}>X-RateLimit-Remaining</code>,{' '}
              <code className="font-mono" style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, backgroundColor: 'var(--ept-surface)' }}>X-RateLimit-Limit</code>, and{' '}
              <code className="font-mono" style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, backgroundColor: 'var(--ept-surface)' }}>X-RateLimit-Reset</code> (Unix timestamp).
            </p>
          </div>

          {/* ═══ 6. ERROR HANDLING ═══ */}
          <SectionHeading id="errors">Error Handling</SectionHeading>
          <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            All errors return a JSON body with <code className="font-mono" style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--ept-surface)', fontSize: 13 }}>{`{ "success": false, "error": "message" }`}</code> and the appropriate HTTP status code.
          </p>
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ept-border)' }}>
                  {['Code', 'Status', 'Common Cause', 'Solution'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--ept-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ERROR_CODES.map(e => (
                  <tr key={e.code} style={{ borderBottom: '1px solid var(--ept-border)' }}>
                    <td className="font-mono" style={{ padding: '12px 16px', fontWeight: 600, color: e.code >= 500 ? '#ef4444' : e.code >= 400 ? '#f59e0b' : 'var(--ept-text)' }}>{e.code}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ept-text)', fontWeight: 500 }}>{e.message}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ept-text-secondary)', fontSize: 13 }}>{e.cause}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ept-text-secondary)', fontSize: 13 }}>{e.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeBlock lang="TypeScript — Error handling example" code={`try {
  const result = await echo.engines.query('TX01', 'Section 179');
} catch (err) {
  if (err.status === 429) {
    const retryAfter = err.headers.get('Retry-After');
    console.log(\`Rate limited. Retry in \${retryAfter}s\`);
  } else if (err.status === 401) {
    console.error('Invalid API key');
  } else {
    console.error(\`Error \${err.status}: \${err.message}\`);
  }
}`} />

          {/* ═══ 7. FAQ ═══ */}
          <SectionHeading id="faq">Frequently Asked Questions</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 6 }}>{item.q}</p>
                <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', margin: 0, lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* ── CTA footer ── */}
          <div style={{ marginTop: 48, padding: 32, borderRadius: 12, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)', textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Ready to build?</h3>
            <p style={{ fontSize: 14, color: 'var(--ept-text-secondary)', marginBottom: 20 }}>Get your free API key and start querying 5,486+ engines in under two minutes.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/sdk/signup" className="px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', textDecoration: 'none' }}>Get Free API Key</Link>
              <Link href="/sdk/playground" className="px-6 py-3 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', textDecoration: 'none' }}>Try the Playground</Link>
            </div>
          </div>

          <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--ept-border)', fontSize: 12, color: 'var(--ept-text-muted)' }}>
            Need help? Reach us at <a href="mailto:contact@echo-op.com" style={{ color: 'var(--ept-accent)' }}>contact@echo-op.com</a> or visit <Link href="/support" style={{ color: 'var(--ept-accent)' }}>Support</Link>.
          </div>
        </main>
      </div>
    </div>
  );
}
