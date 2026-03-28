'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ═══════════════════════════════════════════════════════════════════
    Echo SDK Gateway — Unified API for 50+ AI Products
    Backend: echo-sdk-gateway.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Single API Key', desc: 'One API key unlocks access to all 50+ Echo products. No juggling multiple credentials or endpoints. Authenticate once, use everything.', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { title: 'Unified REST API', desc: 'Consistent JSON request/response format across all services. If you know one endpoint, you know them all. No service-specific SDKs needed.', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { title: 'Service Discovery', desc: 'GET /services returns every available product with endpoints, status, and capabilities. Auto-discover new products as they deploy.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { title: 'Rate Limiting', desc: 'Built-in rate limiting per API key with configurable thresholds. Burst protection with sliding window counters. No abuse, no surprises.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { title: 'Request Routing', desc: 'Intelligent routing to the correct backend Worker via service bindings. Sub-millisecond internal routing with zero public network hops.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Usage Analytics', desc: 'Track requests per service, latency percentiles, error rates, and quota consumption. Dashboard and API access to your usage data.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Webhook Relay', desc: 'Register webhook URLs and receive events from any Echo service. Signed payloads, retry logic, and delivery logs included.', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0' },
  { title: 'TypeScript SDK', desc: 'Official TypeScript/JavaScript SDK with full type definitions. npm install @echo-prime/sdk and start building in minutes.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { title: 'Python SDK', desc: 'Official Python SDK with async support. pip install echo-prime-sdk. Pydantic models for every request and response type.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { title: 'Error Handling', desc: 'Consistent error format with machine-readable codes, human-readable messages, and remediation hints. Never guess what went wrong.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { title: 'CORS & Security', desc: 'Configurable CORS origins, API key rotation, IP allowlisting, and request signing. Enterprise-grade security out of the box.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Versioned Endpoints', desc: 'API versioning ensures backward compatibility. Pin to v1, v2, or latest. Deprecation notices with 90-day migration windows.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
];

const COMPARISON = [
  { feature: 'Price', echo: '$0 (pay per service)', competitor1: '$99/mo base', competitor2: 'Per-call pricing', competitor3: '$29/mo + usage' },
  { feature: 'Products Available', echo: '50+', competitor1: '10-15', competitor2: 'Custom', competitor3: '5-10' },
  { feature: 'Single API Key', echo: 'Yes', competitor1: 'Per-service', competitor2: 'Yes', competitor3: 'Per-service' },
  { feature: 'TypeScript SDK', echo: 'Official', competitor1: 'Community', competitor2: 'Yes', competitor3: 'No' },
  { feature: 'Service Discovery', echo: 'Auto', competitor1: 'Docs only', competitor2: 'Manual', competitor3: 'Docs only' },
  { feature: 'Edge Deployment', echo: 'Global (300+ PoPs)', competitor1: 'US-East only', competitor2: '3 regions', competitor3: '2 regions' },
  { feature: 'Webhook Support', echo: 'All services', competitor1: 'Select services', competitor2: 'Yes', competitor3: 'No' },
  { feature: 'Setup Time', echo: '30 seconds', competitor1: '1 hour', competitor2: '2 hours', competitor3: '30 minutes' },
];

const PRICING = [
  { tier: 'Free', price: 0, features: ['1,000 requests/day', '5 services', 'TypeScript SDK', 'Service discovery', 'Community support', 'Basic analytics'], cta: 'Get Free Key', href: '/checkout?service=sdk-gateway&tier=free', popular: false },
  { tier: 'Developer', price: 49, features: ['50,000 requests/day', 'All 50+ services', 'TypeScript + Python SDKs', 'Webhook relay', 'Usage analytics', 'Priority support', 'API key rotation', 'Custom rate limits'], cta: 'Start Building', href: '/checkout?service=sdk-gateway&tier=developer', popular: true },
  { tier: 'Enterprise', price: 299, features: ['Unlimited requests', 'All services + early access', 'Dedicated SDK support', 'SLA guarantee (99.9%)', 'IP allowlisting', 'Custom endpoints', 'Audit logs', 'Dedicated account manager'], cta: 'Contact Sales', href: '/checkout?service=sdk-gateway&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'What products can I access through the SDK Gateway?', a: 'All 50+ Echo products including CRM, Helpdesk, Engine Runtime, Knowledge Forge, Doctrine Forge, Call Center, Finance AI, Booking, Invoice, Forms, HR, Contracts, LMS, and more. New products are automatically available through the gateway as they deploy.' },
  { q: 'Is there a free tier?', a: 'Yes. The Free tier gives you 1,000 requests/day across 5 services with full SDK access. No credit card required. Perfect for prototyping and testing.' },
  { q: 'How does authentication work?', a: 'Pass your API key in the X-Echo-API-Key header. The gateway validates, rate-limits, and routes your request to the correct backend service. All responses include usage headers showing remaining quota.' },
  { q: 'Can I use the SDK in serverless functions?', a: 'Absolutely. The SDK is designed for serverless environments — Cloudflare Workers, AWS Lambda, Vercel Edge Functions, and Deno Deploy. Minimal cold-start impact with lazy initialization.' },
  { q: 'What about latency?', a: 'The gateway runs on Cloudflare Workers at 300+ edge locations. Internal routing uses service bindings (zero network hops). Median latency overhead is under 5ms. Your requests are processed at the nearest edge to your users.' },
  { q: 'How do I get started?', a: 'npm install @echo-prime/sdk, create a free API key at echo-ept.com/sdk, and start calling any service. The SDK includes TypeScript types for every endpoint. Full docs at echo-ept.com/docs/sdk.' },
];

export default function SDKGatewayPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'SDK Gateway', href: '/sdk-gateway' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/docs/sdk" style={{ color: 'var(--ept-text-secondary)' }}>Docs</Link>
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          50+ Products &middot; 1 API Key &middot; Global Edge
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">SDK Gateway</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>One API. Every Product.</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Access CRM, Helpdesk, Finance, HR, and 46 more AI-powered products through a single REST API. Official TypeScript and Python SDKs included.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=sdk-gateway&tier=developer" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Your API Key</Link>
          <Link href="/docs/sdk" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Read the Docs</Link>
        </div>
        {/* Code sample */}
        <div className="mt-12 max-w-lg mx-auto text-left rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-surface)' }}>
          <div className="px-4 py-2 text-xs font-mono" style={{ color: 'var(--ept-text-muted)', borderBottom: '1px solid var(--ept-card-border)' }}>TypeScript</div>
          <pre className="p-4 text-sm font-mono overflow-x-auto" style={{ color: 'var(--ept-text-secondary)' }}>
{`import Echo from '@echo-prime/sdk';

const echo = new Echo({ apiKey: 'ek_...' });

// Query any service
const leads = await echo.crm.contacts.list();
const ticket = await echo.helpdesk.tickets.create({
  subject: 'New inquiry',
  priority: 'high'
});`}
          </pre>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Built for Developers</h2>
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
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>SDK Gateway vs. Building It Yourself</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo SDK</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>RapidAPI</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Custom Build</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Kong Gateway</th>
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
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Start Building in 30 Seconds</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>One API key. 50+ products. Zero infrastructure to manage. Get your free key and ship your first integration today.</p>
        <Link href="/checkout?service=sdk-gateway&tier=developer" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Your Free API Key</Link>
      </section>
    </main>
  );
}
