'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';

const ANNUAL_DISCOUNT = 0.20; // 20% off annual

const FALLBACK_SERVICES: Service[] = [
  { id: 'ai-closer', name: 'AI Sales Agent', tagline: 'Autonomous voice closer with full CRM', pricing: [
    { tier: 'Starter', price: 299, interval: 'mo', features: ['1 AI closer agent', '500 calls/mo', 'CRM dashboard', 'Email follow-ups'], popular: false },
    { tier: 'Growth', price: 499, interval: 'mo', features: ['3 AI closer agents', '2,000 calls/mo', 'Custom scripts', 'Analytics dashboard', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited agents', 'Unlimited calls', 'White-label', 'Dedicated account manager', 'Custom integrations'], popular: false, custom: true },
  ] },
  { id: 'engines', name: 'Intelligence Engines', tagline: '2,632 domain-specific AI engines', pricing: [
    { tier: 'API Access', price: 199, interval: 'mo', features: ['100 queries/day', 'All engine categories', 'REST API', 'JSON responses'], popular: false },
    { tier: 'Professional', price: 499, interval: 'mo', features: ['1,000 queries/day', 'Priority routing', 'Webhook callbacks', 'Custom doctrines', 'Dedicated support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited queries', 'Private deployment', 'Custom engines', 'SLA guarantee', 'On-premises option'], popular: false, custom: true },
  ] },
  { id: 'title-intelligence', name: 'Title Intelligence', tagline: 'AI chain of title across 80+ Texas counties', pricing: [
    { tier: 'Starter', price: 200, interval: 'mo', features: ['100 searches/mo', '80+ counties', 'Grantor/Grantee index', 'Export to CSV'], popular: false },
    { tier: 'Professional', price: 500, interval: 'mo', features: ['Unlimited searches', 'AI gap detection', 'Chain of title reports', 'API access', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Bulk operations', 'Custom integrations', 'Dedicated account', 'On-site training'], popular: false, custom: true },
  ] },
  { id: 'sentinel', name: 'Sentinel AI', tagline: 'Multi-domain AI assistant', pricing: [
    { tier: 'Free', price: 0, interval: 'mo', features: ['10 queries/day', 'Web search', 'General knowledge', 'Text responses'], popular: false },
    { tier: 'Pro', price: 29, interval: 'mo', features: ['Unlimited queries', '14 personalities', 'Document analysis', 'Voice responses', 'Memory'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Custom personalities', 'Private deployment', 'API access', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'bots', name: 'Custom Bots', tagline: 'AI-powered bots for social, trading & automation', pricing: [
    { tier: 'Starter', price: 499, interval: 'mo', features: ['1 custom bot', 'Basic AI personality', 'Scheduled posting', 'Analytics dashboard'], popular: false },
    { tier: 'Professional', price: 1499, interval: 'mo', features: ['3 custom bots', 'Advanced AI + memory', 'Multi-platform', 'Trading strategies', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited bots', 'Custom trading algos', 'White-label', 'Dedicated engineer'], popular: false, custom: true },
  ] },
  { id: 'scrapers', name: 'Data Scrapers', tagline: 'Industrial-scale web scraping & data harvesting', pricing: [
    { tier: 'Starter', price: 399, interval: 'mo', features: ['1 scraper', 'Up to 10K records/mo', 'CSV/JSON export', 'Email delivery'], popular: false },
    { tier: 'Professional', price: 1299, interval: 'mo', features: ['3 scrapers', '100K records/mo', 'API access', 'Anti-detection', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited scrapers', 'Custom pipelines', 'Dedicated infra', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'pipelines', name: 'Data Pipelines', tagline: 'Automated ETL, transforms & delivery', pricing: [
    { tier: 'Starter', price: 149, interval: 'mo', features: ['5 pipelines', '10K records/day', 'Email/webhook delivery', 'Scheduling'], popular: false },
    { tier: 'Professional', price: 399, interval: 'mo', features: ['25 pipelines', '100K records/day', 'AI enrichment', 'Multi-destination', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited pipelines', 'Custom transforms', 'On-prem connectors', 'SLA guarantee'], popular: false, custom: true },
  ] },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const getDisplayPrice = (monthlyPrice: number | null): number | null => {
    if (monthlyPrice === null || monthlyPrice === 0) return monthlyPrice;
    if (billingCycle === 'annual') return Math.round(monthlyPrice * (1 - ANNUAL_DISCOUNT));
    return monthlyPrice;
  };

  const getAnnualSavings = (monthlyPrice: number | null): number => {
    if (monthlyPrice === null || monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 12 * ANNUAL_DISCOUNT);
  };

  useEffect(() => {
    getServices()
      .then(d => { setServices(d.services); if (d.services.length > 0) setActiveService(d.services[0].id); })
      .catch(() => { setServices(FALLBACK_SERVICES); setActiveService(FALLBACK_SERVICES[0].id); });
  }, []);

  const current = services.find(s => s.id === activeService);

  const handleCheckout = async (serviceId: string, tier: { tier: string; price: number | null; custom?: boolean }) => {
    if (tier.custom || tier.price === null) { window.location.href = `mailto:bob@echo-op.com?subject=Enterprise%20${encodeURIComponent(serviceId)}%20Inquiry`; return; }
    const checkoutUrl = `/checkout?service=${encodeURIComponent(serviceId)}&tier=${encodeURIComponent(tier.tier.toLowerCase())}`;
    if (!user) { window.location.href = `/signup?redirect=${encodeURIComponent(checkoutUrl)}`; return; }
    window.location.href = checkoutUrl;
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Can I switch plans anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle. No lock-in contracts.' } },
      { '@type': 'Question', name: 'Do you offer a free trial?', acceptedAnswer: { '@type': 'Answer', text: 'Many services have free tiers or trial periods. Sentinel AI, Grading, and the Knowledge systems all offer free access to get started.' } },
      { '@type': 'Question', name: 'What payment methods do you accept?', acceptedAnswer: { '@type': 'Answer', text: 'We accept all major credit cards via Stripe and PayPal. Enterprise clients can request invoicing with NET 30 terms.' } },
      { '@type': 'Question', name: 'How does the AI engine pricing work?', acceptedAnswer: { '@type': 'Answer', text: 'Engine queries are priced per-use or via monthly subscriptions. Each query hits our doctrine cache first (free, under 200ms), then semantic retrieval, then deep analysis.' } },
      { '@type': 'Question', name: 'Is there a setup fee?', acceptedAnswer: { '@type': 'Answer', text: 'No setup fees for any self-service plan. Enterprise and custom deployments may include onboarding costs depending on scope.' } },
      { '@type': 'Question', name: 'Can I combine multiple services?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Our services are designed to work together. Data Pipelines feed into Title Intelligence, engines power the AI Closer, and Sentinel monitors everything. Contact us for bundle pricing.' } },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Pricing</div>
          <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Simple, transparent pricing</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Every service has clear tiers. No hidden fees. Scale up or down anytime.</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              30-day money-back guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Cancel anytime
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Stripe &amp; PayPal accepted
            </span>
          </div>
          <div className="mt-4"><ReadAloudButton label="Read pricing" getText={() => {
            const el = document.querySelector('.max-w-6xl');
            return el?.textContent?.trim().slice(0, 3000) || '';
          }} /></div>

          {/* Billing cycle toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm font-medium" style={{ color: billingCycle === 'monthly' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>Monthly</span>
            <button
              onClick={() => setBillingCycle(c => c === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 rounded-full transition-colors"
              style={{ backgroundColor: billingCycle === 'annual' ? 'var(--ept-accent)' : 'var(--ept-surface)' }}
              aria-label="Toggle annual billing"
            >
              <span
                className="absolute top-0.5 w-6 h-6 rounded-full transition-all shadow-sm"
                style={{
                  backgroundColor: '#fff',
                  left: billingCycle === 'annual' ? '30px' : '2px',
                }}
              />
            </button>
            <span className="text-sm font-medium" style={{ color: billingCycle === 'annual' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold animate-fade-up" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Service tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {services.map(svc => (
            <button key={svc.id} onClick={() => setActiveService(svc.id)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{
              backgroundColor: activeService === svc.id ? 'var(--ept-accent)' : 'var(--ept-surface)',
              color: activeService === svc.id ? '#fff' : 'var(--ept-text-secondary)',
            }}>
              {svc.name}
            </button>
          ))}
        </div>

        {/* Pricing cards */}
        {current && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{current.name}</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>{current.tagline}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {current.pricing.map((tier, i) => (
                <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: tier.popular ? '0 0 30px var(--ept-accent-glow)' : 'none',
                }}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
                  )}
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
                  <div className="mb-6">
                    {tier.price !== null ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold font-mono gradient-text">${getDisplayPrice(tier.price)}</span>
                          <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{billingCycle === 'annual' ? 'mo' : tier.interval}</span>
                        </div>
                        {billingCycle === 'annual' && tier.price > 0 && (
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs line-through" style={{ color: 'var(--ept-text-muted)' }}>${tier.price}/mo</span>
                            <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>Save ${getAnnualSavings(tier.price)}/yr</span>
                          </div>
                        )}
                        {billingCycle === 'annual' && tier.price > 0 && (
                          <div className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>
                            Billed ${(getDisplayPrice(tier.price) ?? 0) * 12}/yr
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleCheckout(current.id, tier)} disabled={checkingOut === `${current.id}-${tier.tier}`} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60" style={{
                    backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                    color: tier.popular ? '#fff' : 'var(--ept-accent)',
                    border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
                  }}>
                    {checkingOut === `${current.id}-${tier.tier}` ? 'Redirecting...' : tier.custom ? 'Contact Sales' : tier.price === 0 ? 'Start Free' : 'Get Started'}
                  </button>
                  {!tier.custom && tier.price !== null && tier.price > 0 && (
                    <p className="text-center text-[10px] mt-2" style={{ color: 'var(--ept-text-muted)' }}>30-day money-back guarantee</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust signals */}
        <div className="mt-20 mb-12">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { value: '2,632', label: 'AI Engines', sub: 'Domain-specific intelligence' },
              { value: '259K+', label: 'Records Indexed', sub: '80+ Texas counties' },
              { value: '99.9%', label: 'Uptime SLA', sub: 'Enterprise reliability' },
              { value: '<200ms', label: 'Avg Response', sub: 'Doctrine cache layer' },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: 'var(--ept-text)' }}>{s.label}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-20 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: 'var(--ept-text)' }}>Compare All Services</h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>See which services fit your needs at a glance</p>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[800px] text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th className="text-left p-4 font-semibold sticky left-0 z-10" style={{ color: 'var(--ept-text)', backgroundColor: 'var(--ept-bg)' }}>Feature</th>
                  {services.map(svc => (
                    <th key={svc.id} className="p-4 text-center font-semibold" style={{ color: 'var(--ept-text)' }}>
                      <button onClick={() => setActiveService(svc.id)} className="hover:underline">{svc.name}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Starting Price', values: (svcs: Service[]) => svcs.map(s => { const p = s.pricing[0]?.price; return p === 0 ? 'Free' : p !== null ? `$${getDisplayPrice(p)}/mo` : 'Custom'; }) },
                  { label: 'AI-Powered', values: (svcs: Service[]) => svcs.map(s => ['sentinel','engines','ai-closer','bots'].includes(s.id)) },
                  { label: 'REST API Access', values: (svcs: Service[]) => svcs.map(s => !['sentinel'].includes(s.id) || s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('api')))) },
                  { label: 'Custom Integrations', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('custom')))) },
                  { label: 'Analytics Dashboard', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('analytics') || f.toLowerCase().includes('dashboard')))) },
                  { label: 'Enterprise / SLA', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.custom || t.features.some(f => f.toLowerCase().includes('sla') || f.toLowerCase().includes('enterprise')))) },
                  { label: 'Free Tier Available', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.price === 0)) },
                  { label: 'Priority Support', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('priority')))) },
                  { label: 'White-Label Option', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('white-label') || f.toLowerCase().includes('white label')))) },
                ].map((row, ri) => {
                  const vals = row.values(services);
                  return (
                    <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? 'var(--ept-card-bg)' : 'transparent' }}>
                      <td className="p-4 font-medium sticky left-0 z-10" style={{ color: 'var(--ept-text-secondary)', backgroundColor: ri % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-bg)' }}>{row.label}</td>
                      {vals.map((v, ci) => (
                        <td key={ci} className="p-4 text-center">
                          {typeof v === 'string' ? (
                            <span className="font-mono font-bold text-sm" style={{ color: 'var(--ept-accent)' }}>{v}</span>
                          ) : v ? (
                            <svg className="w-5 h-5 mx-auto" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <span className="text-lg" style={{ color: 'var(--ept-text-muted)' }}>&mdash;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle. No lock-in contracts.' },
              { q: 'Do you offer a free trial?', a: 'Many services have free tiers or trial periods. Sentinel AI, Grading, and the Knowledge systems all offer free access to get started.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards via Stripe and PayPal. Enterprise clients can request invoicing with NET 30 terms.' },
              { q: 'Is there a setup fee?', a: 'No setup fees for any self-service plan. Enterprise and custom deployments may include onboarding costs depending on scope.' },
              { q: 'How does the AI engine pricing work?', a: 'Engine queries are priced per-use or via monthly subscriptions. Each query hits our doctrine cache first (free, <200ms), then semantic retrieval, then deep analysis. Most queries resolve at the cache layer.' },
              { q: 'How does annual billing save me money?', a: 'Annual billing gives you 20% off every service. You pay for 12 months upfront at the discounted rate. Switch between monthly and annual using the toggle above to compare pricing.' },
              { q: 'Can I combine multiple services?', a: 'Absolutely. Our services are designed to work together. Data Pipelines feed into Title Intelligence, engines power the AI Closer, and Sentinel monitors everything. Contact us for bundle pricing.' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{item.q}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bundle CTA */}
        <div className="max-w-3xl mx-auto mb-16 p-8 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Need the full stack?</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Bundle Engines + Bots + Scrapers + Pipelines + Title Intelligence for a custom enterprise rate. Get everything at a steep discount.
          </p>
          <a href="mailto:bob@echo-op.com?subject=Enterprise%20Bundle%20Inquiry" className="inline-block px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Get Bundle Pricing
          </a>
        </div>

        <div className="text-center pb-8">
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> or email <a href="mailto:customerservice@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>customerservice@echo-op.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
