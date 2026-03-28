'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';

/* ═══════════════════════════════════════════════════════════════════════════════
   Free Tier — Conversion Landing Page
   Shows all free products, feature matrix, and email capture for instant access.
   ═══════════════════════════════════════════════════════════════════════════════ */

interface FreeTier {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  freeFeatures: string[];
  limit: string;
  upgradePath: string;
  href: string;
}

const FREE_PRODUCTS: FreeTier[] = [
  {
    id: 'sentinel',
    name: 'Sentinel AI',
    tagline: 'Multi-domain AI assistant with 5,486+ engines',
    icon: '\u{1F9E0}',
    freeFeatures: ['10 queries per day', 'Web search', 'General knowledge base', 'Text responses', '940+ domains'],
    limit: '10 queries/day',
    upgradePath: 'Pro $29/mo for unlimited queries + voice',
    href: '/sentinel',
  },
  {
    id: 'sdk',
    name: 'Developer SDK',
    tagline: 'API access to engines, knowledge, brain, and search',
    icon: '\u{1F4BB}',
    freeFeatures: ['500 requests/day', 'Engine queries', 'Knowledge search', 'Brain memory', 'TypeScript + Python SDK'],
    limit: '500 req/day',
    upgradePath: 'Starter $49/mo for 5,000 req/day',
    href: '/sdk',
  },
  {
    id: 'price-alerts',
    name: 'Price Alerts',
    tagline: 'Real-time price monitoring across markets',
    icon: '\u{1F4C8}',
    freeFeatures: ['5 active alerts', 'Email notifications', 'Crypto & stocks', 'Daily summary email'],
    limit: '5 alerts',
    upgradePath: 'Pro $19/mo for unlimited alerts + SMS',
    href: '/price-alerts',
  },
  {
    id: 'payments',
    name: 'Payments Platform',
    tagline: 'Stripe + PayPal unified checkout',
    icon: '\u{1F4B3}',
    freeFeatures: ['Stripe + PayPal integration', '2.9% + 30\u00A2 per transaction', 'Dashboard', 'Email receipts'],
    limit: 'Standard rates',
    upgradePath: 'Pro $49/mo for reduced rates + crypto',
    href: '/payments',
  },
  {
    id: 'engines',
    name: 'Engine Explorer',
    tagline: 'Browse 5,486+ AI intelligence engines',
    icon: '\u{2699}\u{FE0F}',
    freeFeatures: ['Browse all categories', 'View engine specs', 'Sample queries', 'Domain directory'],
    limit: 'Browse only',
    upgradePath: 'API Access $199/mo for 100 queries/day',
    href: '/engines',
  },
  {
    id: 'knowledge',
    name: 'Knowledge Base',
    tagline: '24,800+ documents across 575 categories',
    icon: '\u{1F4DA}',
    freeFeatures: ['Search documents', 'View summaries', 'Category browsing', '575+ categories'],
    limit: 'Search only',
    upgradePath: 'SDK Starter $49/mo for full API access',
    href: '/knowledge',
  },
];

const COMPARISON_ROWS = [
  { feature: 'AI Engine Queries', free: '10/day', starter: '500/day', pro: '5,000/day', enterprise: 'Unlimited' },
  { feature: 'Knowledge Search', free: 'Basic', starter: 'Full text', pro: 'Semantic + hybrid', enterprise: 'Custom index' },
  { feature: 'Brain Memory', free: '\u2014', starter: '1,000 entries', pro: '50,000 entries', enterprise: 'Unlimited' },
  { feature: 'Voice Synthesis', free: '\u2014', starter: '50K chars', pro: '500K chars + cloning', enterprise: 'Unlimited' },
  { feature: 'Custom Bots', free: '\u2014', starter: '\u2014', pro: '3 bots', enterprise: 'Unlimited' },
  { feature: 'API Rate Limit', free: '500 req/day', starter: '5,000/day', pro: '50,000/day', enterprise: 'Custom SLA' },
  { feature: 'Support', free: 'Community', starter: 'Email', pro: 'Priority', enterprise: 'Dedicated engineer' },
  { feature: 'Service Bindings', free: '\u2014', starter: '5', pro: '21', enterprise: 'Custom' },
  { feature: 'Webhook Callbacks', free: '\u2014', starter: '\u2713', pro: '\u2713', enterprise: '\u2713' },
  { feature: 'Analytics Dashboard', free: '\u2014', starter: 'Basic', pro: 'Advanced', enterprise: 'Custom BI' },
];

export default function FreePage() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('https://ept-api.bmcii1976.workers.dev/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'free_tier_landing', page: '/free' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Free Tier', href: '/free' }]} />
      <FaqSchema faqs={[
        { q: 'Is the free tier really free forever?', a: 'Yes. The free tier has no expiration date. Use it as long as you want. We only charge when you upgrade to access higher limits or premium features.' },
        { q: 'Do I need a credit card to sign up?', a: 'No. Sign up with just your email address. No credit card, no payment info, no commitments.' },
        { q: 'What happens if I hit my free tier limits?', a: 'Your requests will return a rate limit response (HTTP 429). Your data and configuration are preserved — just upgrade your plan or wait for the daily reset.' },
        { q: 'Can I use the free tier for commercial projects?', a: 'Yes. The free tier can be used for any purpose, including commercial applications. Attribution is appreciated but not required.' },
        { q: 'How do I upgrade?', a: 'Run `echo upgrade` in the CLI or visit the pricing page. Upgrades take effect immediately with prorated billing.' },
      ]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/engines" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/pricing" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/sdk" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>SDK</Link>
          <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
          No Credit Card Required
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          Start Building with{' '}
          <span className="gradient-text">Echo Prime</span>{' '}
          for Free
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Access 5,486+ AI intelligence engines, search 24,800+ knowledge documents,
          and query 940+ domains &mdash; all at zero cost. Upgrade when you&rsquo;re ready.
        </p>

        {/* Email Capture */}
        {status === 'success' ? (
          <div className="p-6 rounded-xl border max-w-md mx-auto" style={{ backgroundColor: isDark ? '#14b8a610' : '#0d737710', borderColor: 'var(--ept-accent)' }}>
            <p className="text-lg font-bold mb-1" style={{ color: 'var(--ept-accent)' }}>You&rsquo;re in!</p>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
              Check your inbox for your free API key.{' '}
              <Link href="/sdk/signup" className="underline" style={{ color: 'var(--ept-accent)' }}>Or sign up now &rarr;</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
              className="flex-1 px-4 py-3 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: status === 'error' ? '#ef4444' : 'var(--ept-border)', color: 'var(--ept-text)' }}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 rounded-xl font-semibold text-sm whitespace-nowrap"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              {status === 'loading' ? 'Starting...' : 'Start Free'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Something went wrong. Try again or <Link href="/sdk/signup" className="underline">sign up directly</Link>.</p>
        )}
        <p className="text-xs mt-4" style={{ color: 'var(--ept-text-muted)' }}>
          Free forever. No credit card. Upgrade anytime.
        </p>
      </section>

      {/* Free Products Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>
          What You Get for Free
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FREE_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="p-6 rounded-xl border transition-all hover:scale-[1.02] block"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}
            >
              <div className="text-3xl mb-3">{product.icon}</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{product.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{product.tagline}</p>
              <ul className="space-y-1.5 mb-4">
                {product.freeFeatures.map((f, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>{'\u2713'}</span> {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                  FREE: {product.limit}
                </span>
                <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{product.upgradePath}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3" style={{ color: 'var(--ept-text)' }}>
          Compare Plans
        </h2>
        <p className="text-center mb-10 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
          Start free. Scale as you grow.
        </p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)', minWidth: 180 }}>Feature</th>
                <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-accent)', minWidth: 120 }}>
                  Free<br /><span className="text-xs font-normal">$0</span>
                </th>
                <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text)', minWidth: 120 }}>
                  Starter<br /><span className="text-xs font-normal">$49/mo</span>
                </th>
                <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text)', minWidth: 120 }}>
                  Pro<br /><span className="text-xs font-normal">$199/mo</span>
                </th>
                <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text)', minWidth: 120 }}>
                  Enterprise<br /><span className="text-xs font-normal">Custom</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--ept-border)', backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="p-4 text-center" style={{ color: row.free === '\u2014' ? 'var(--ept-text-muted)' : 'var(--ept-accent)' }}>{row.free}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.starter}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.pro}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/sdk/signup" className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Get Free API Key
          </Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl border font-semibold text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Full Pricing
          </Link>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5,486', label: 'AI Engines' },
              { value: '607K+', label: 'Doctrine Blocks' },
              { value: '24,800+', label: 'Knowledge Docs' },
              { value: '940+', label: 'Domains Covered' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>
          Frequently Asked Questions
        </h2>
        {[
          { q: 'Is the free tier really free forever?', a: 'Yes. The free tier has no expiration date. Use it as long as you want. We only charge when you upgrade to access higher limits or premium features.' },
          { q: 'Do I need a credit card to sign up?', a: 'No. Sign up with just your email address. No credit card, no payment info, no commitments.' },
          { q: 'What happens if I hit my free tier limits?', a: 'Your requests will return a rate limit response (HTTP 429). Your data and configuration are preserved \u2014 just upgrade your plan or wait for the daily reset.' },
          { q: 'Can I use the free tier for commercial projects?', a: 'Yes. The free tier can be used for any purpose, including commercial applications. Attribution is appreciated but not required.' },
          { q: 'How do I upgrade?', a: 'Run `echo upgrade` in the CLI or visit the pricing page. Upgrades take effect immediately with prorated billing.' },
        ].map((faq, i) => (
          <div key={i} className="p-5 rounded-xl border mb-3" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Ready to Build?
        </h2>
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Join hundreds of developers using Echo Prime engines to power their applications.
          Get started in under 60 seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/sdk/signup" className="px-8 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Create Free Account
          </Link>
          <Link href="/sdk/docs" className="px-8 py-3 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Read the Docs
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.{' '}
          <Link href="/legal/privacy" className="underline">Privacy</Link> &middot;{' '}
          <Link href="/legal/terms" className="underline">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
