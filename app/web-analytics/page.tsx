'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'P', title: 'Privacy-First', desc: 'No cookies, no fingerprinting, no consent banners. Fully GDPR, CCPA, and PECR compliant out of the box' },
  { icon: 'L', title: 'Lightweight Script', desc: 'Under 1KB tracking script loads async. Zero impact on page speed, Core Web Vitals, or Lighthouse scores' },
  { icon: 'R', title: 'Realtime Dashboard', desc: 'See active visitors, live pageviews, and trending pages right now — not from yesterday' },
  { icon: 'U', title: 'UTM Campaign Tracking', desc: 'Track utm_source, utm_medium, utm_campaign, utm_term, and utm_content automatically from URLs' },
  { icon: 'G', title: 'Goal Conversions', desc: 'Define goals by page path or custom events. Track conversion rates and funnel performance' },
  { icon: 'D', title: 'Device & Browser Stats', desc: 'See desktop vs mobile vs tablet split, top browsers, operating systems, and screen sizes' },
  { icon: 'C', title: 'Country & Region', desc: 'Geographic breakdown using Cloudflare edge headers — no third-party GeoIP lookups needed' },
  { icon: 'F', title: 'Referrer Analysis', desc: 'See where your traffic comes from — search engines, social media, direct, and specific domains' },
  { icon: 'T', title: 'Top Pages', desc: 'Ranked list of your most visited pages with unique visitors, pageviews, and average time on page' },
  { icon: 'B', title: 'Bounce Rate', desc: 'Session-based bounce detection using visibility API — know which pages keep visitors engaged' },
  { icon: 'S', title: 'Public Share Links', desc: 'Share your analytics dashboard publicly with a single link — great for transparency reports' },
  { icon: 'E', title: 'Data Export', desc: 'Export daily stats, page breakdowns, and full analytics as JSON for your own analysis' },
];

const COMPARE = [
  ['Feature', 'Echo Analytics', 'Plausible', 'Fathom'],
  ['Cookie-free', 'Yes', 'Yes', 'Yes'],
  ['Script size', '<1KB', '~1KB', '~1KB'],
  ['Realtime dashboard', 'All plans', 'All plans', 'All plans'],
  ['UTM tracking', 'All plans', 'All plans', 'All plans'],
  ['Goal conversions', 'All plans', 'All plans', '$25+/mo'],
  ['Custom events', 'All plans', 'All plans', '$25+/mo'],
  ['Public dashboard', 'All plans', 'All plans', 'All plans'],
  ['API access', 'All plans', '$9+/mo', '$25+/mo'],
  ['Data export', 'All plans', 'All plans', '$25+/mo'],
  ['Team members', 'Unlimited', '3 (Starter)', '1 (Lite)'],
  ['Sites', 'By plan', '50', '50'],
  ['Data retention', 'Unlimited', 'Unlimited', 'Unlimited'],
  ['Starting price', '$9/mo', '$9/mo', '$15/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$9', per: '/mo', features: ['3 sites', '100K pageviews/mo', 'Realtime dashboard', 'UTM tracking', 'Goal conversions', 'Custom events', 'Public dashboards', 'API access'] },
  { name: 'Growth', price: '$24', per: '/mo', features: ['10 sites', '1M pageviews/mo', 'Team members', 'Email reports', 'Advanced filters', 'Funnel analysis', 'Priority support', 'Custom domain'], popular: true },
  { name: 'Business', price: '$59', per: '/mo', features: ['Unlimited sites', '10M pageviews/mo', 'White-label', 'Webhook alerts', 'SLA guarantee', 'Dedicated support', 'Data warehouse export', 'Custom retention'] },
];

const FAQS = [
  { q: 'How is Echo Web Analytics different from Google Analytics?', a: 'Echo Web Analytics is privacy-first — no cookies, no fingerprinting, no consent banners required. Your visitor data stays on Cloudflare\'s edge network and is never sent to third parties. Google Analytics has been banned in multiple EU countries for GDPR violations. We are fully compliant out of the box.' },
  { q: 'Will the tracking script slow down my website?', a: 'No. Our script is under 1KB and loads asynchronously. It has zero measurable impact on page load speed, Core Web Vitals, or Lighthouse scores. Compare that to Google Analytics at 45KB+.' },
  { q: 'Do I need to show a cookie consent banner?', a: 'No. Echo Web Analytics sets no cookies and performs no fingerprinting, so no consent banner is required under GDPR, CCPA, or PECR. One less thing cluttering your site.' },
  { q: 'Can I track single-page applications (SPAs)?', a: 'Yes. The script automatically detects pushState and replaceState navigation events, so page transitions in React, Next.js, Vue, and other SPA frameworks are tracked without any additional configuration.' },
  { q: 'How long is my analytics data retained?', a: 'All plans include unlimited data retention. Your historical data is never deleted or downsampled. Export it at any time as JSON for your own analysis or archival.' },
  { q: 'Can I migrate from Google Analytics or Plausible?', a: 'You can start collecting data immediately by adding our one-line script tag. Historical data from other platforms cannot be imported, but you will see real-time data flowing within seconds of installation.' },
];

export default function WebAnalyticsPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Web Analytics', href: '/web-analytics' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=web-analytics&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Web Analytics</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Simple, privacy-first analytics. No cookies. No consent banners.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=web-analytics&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Tracking</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Google Analytics Is Overkill. And Illegal in the EU.</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Google Analytics sends your visitors&apos; data to Google, requires cookie consent banners, and has been banned in multiple EU countries. Echo Web Analytics runs entirely on Cloudflare Workers — your data never leaves our edge network, no cookies are set, and no consent banners are needed. One script tag, full compliance, real insights.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>One Script Tag. That&apos;s It.</h3>
          <div className="p-4 rounded-lg font-mono text-sm overflow-x-auto" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-accent)' }}>
            {'<script defer src="https://web-analytics.echo-op.com/script.js?id=YOUR_SITE_ID"></script>'}
          </div>
          <p className="text-sm mt-3" style={{ color: 'var(--ept-text-muted)' }}>Under 1KB. Async loading. No impact on page speed. Handles SPAs with pushState tracking automatically.</p>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>All the Insights, None of the Bloat</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              {COMPARE[0].map((h, i) => <th key={i} className="px-4 py-3 text-left font-bold" style={{ color: 'var(--ept-text)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {COMPARE.slice(1).map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--ept-border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Yes' || cell.startsWith('All') || cell.startsWith('$9') || cell === 'Unlimited' || cell === '<1KB' || cell.startsWith('By')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: t.popular ? 2 : 1 }}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.per}</span></div>
              <ul className="space-y-2 mb-6">{t.features.map((f) => <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=web-analytics&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Ready to See Your Real Traffic?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Privacy-first analytics with no cookies, no consent banners, and no bloat.</p>
        <TrialCTA serviceId="echo-web-analytics" tier="starter" productName="Echo Web Analytics" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
