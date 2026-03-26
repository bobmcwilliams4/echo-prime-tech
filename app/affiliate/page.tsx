'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

const FEATURES = [
  { icon: 'M', title: 'Multi-Tier Commissions', desc: 'Percentage, flat rate, tiered, or recurring commissions. Sub-affiliate earnings with automatic parent credit. Custom rates per affiliate.' },
  { icon: 'T', title: 'Click Tracking & Cookies', desc: 'Every click tracked with IP deduplication, geo, device, and referrer data. Configurable cookie windows up to 365 days.' },
  { icon: 'F', title: 'AI Fraud Detection', desc: 'Automatic fraud scoring on every conversion. Flag high-value transactions, missing data, and suspicious patterns. Custom fraud rules.' },
  { icon: 'P', title: 'Branded Signup Pages', desc: 'Beautiful affiliate signup pages at /join/your-program. Affiliates apply, get auto-approved or queued for review.' },
  { icon: 'D', title: 'Affiliate Dashboard', desc: 'Real-time dashboard for every affiliate showing clicks, conversions, revenue, earnings, and payout history.' },
  { icon: 'A', title: 'Automated Payouts', desc: 'Generate payouts monthly, biweekly, or weekly. Minimum thresholds, PayPal/bank/Stripe/check methods. Batch processing.' },
  { icon: 'C', title: 'Creative Assets', desc: 'Upload banners, text ads, email templates, video embeds, and social media assets. Track which creatives convert best.' },
  { icon: 'L', title: 'Smart Link Builder', desc: 'Generate tracking links with UTM parameters. Custom slugs, unique click detection, and conversion attribution across sessions.' },
  { icon: 'I', title: 'AI Performance Insights', desc: 'AI analyzes your affiliate data and surfaces actionable growth opportunities, optimization suggestions, and risk areas.' },
  { icon: 'R', title: 'Conversion API', desc: 'Simple POST /convert endpoint to record sales from any platform. Works with Shopify, WooCommerce, custom checkouts, and webhooks.' },
  { icon: 'E', title: 'Leaderboard & Tiers', desc: 'Rank affiliates by revenue, set tier levels with escalating commission rates. Gamify your program to drive performance.' },
  { icon: 'X', title: 'Export & Reports', desc: 'Export affiliates, conversions, and payouts as CSV or JSON. Daily analytics aggregation with trend tracking.' },
];

const COMPARE = [
  ['Feature', 'Echo Affiliate', 'PartnerStack', 'Rewardful', 'Impact'],
  ['Multi-tier commissions', 'All plans', 'Growth+', 'No', 'Pro+'],
  ['Sub-affiliate tracking', 'All plans', 'Enterprise', 'No', 'Enterprise'],
  ['AI fraud detection', 'All plans', 'No', 'No', 'Pro+'],
  ['AI performance insights', 'All plans', 'No', 'No', 'No'],
  ['Branded signup pages', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Affiliate dashboard', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Click tracking & cookies', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Automated payouts', 'All plans', 'Growth+', 'All plans', 'Pro+'],
  ['Creative asset library', 'All plans', 'Growth+', 'No', 'All plans'],
  ['Conversion API', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Custom fraud rules', 'All plans', 'Enterprise', 'No', 'Enterprise'],
  ['Tiered commission rates', 'All plans', 'Growth+', 'Growth+', 'Pro+'],
  ['CSV/JSON export', 'All plans', 'All plans', 'Growth+', 'All plans'],
  ['API access', 'All plans', 'Growth+', 'All plans', 'Pro+'],
  ['Starting price', '$29/mo', '$800/mo', '$49/mo', 'Custom'],
];

const TIERS = [
  { name: 'Starter', price: '$29', per: '/mo', features: ['Unlimited affiliates', 'Multi-tier commissions', 'Click tracking & cookies', 'AI fraud detection', 'Branded signup pages', 'Affiliate dashboard', 'Conversion API', '1 program'] },
  { name: 'Growth', price: '$79', per: '/mo', features: ['Everything in Starter', 'Unlimited programs', 'Sub-affiliate tracking', 'Automated payouts', 'Creative asset library', 'AI performance insights', 'Leaderboard & tiers', 'Priority support'], popular: true },
  { name: 'Scale', price: '$199', per: '/mo', features: ['Everything in Growth', 'Custom fraud rules', 'White-label portal', 'Custom domains', 'Webhook integrations', 'Bulk operations', 'Dedicated support', 'SLA guarantee'] },
];

export default function AffiliatePage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Affiliate Program', href: '/affiliate' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=affiliate&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Affiliate</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Launch affiliate programs that scale. AI-powered.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=affiliate&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Launch Your Program</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Turn Customers into Revenue Partners</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Most affiliate platforms charge $800+/month and take weeks to set up. Echo Affiliate lets you launch a full program in minutes — with multi-tier commissions, AI fraud detection, branded signup pages, and automated payouts. Your affiliates get a real-time dashboard. You get revenue growth on autopilot.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>27x</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Cheaper than PartnerStack ($29 vs $800/mo)</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>5min</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>From signup to live affiliate program</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>0%</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Transaction fees — keep every dollar</p>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything to Grow Through Partners</h2>
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

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="space-y-6">
          {[
            { step: '1', title: 'Create Your Program', desc: 'Set commission rates (percentage, flat, tiered, or recurring), cookie duration, payout frequency, and terms. Done in 2 minutes.' },
            { step: '2', title: 'Affiliates Join', desc: 'Share your branded signup page. Affiliates apply and get auto-approved or queued for review. They get a dashboard and referral code instantly.' },
            { step: '3', title: 'Track Everything', desc: 'Every click, conversion, and dollar is tracked. AI detects fraud automatically. Affiliates see real-time stats in their dashboard.' },
            { step: '4', title: 'Pay Automatically', desc: 'Generate payouts on your schedule. Set minimum thresholds. Pay via PayPal, bank transfer, Stripe, or check. Batch processing for scale.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{s.step}</div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
              </div>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell.startsWith('All') || cell.startsWith('$29')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=affiliate&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How does multi-tier commission work?', a: 'When an affiliate recruits sub-affiliates, they earn a percentage of their sub-affiliates\' commissions automatically. You set the sub-commission rate (default 10%). This incentivizes your top affiliates to recruit more partners.' },
            { q: 'How does AI fraud detection work?', a: 'Every conversion is scored for fraud risk based on transaction value, missing data, velocity patterns, and custom rules. High-risk conversions are flagged for manual review. You can create custom fraud rules that auto-flag, reject, or suspend.' },
            { q: 'Can I integrate with my existing checkout?', a: 'Yes. Use the POST /convert API endpoint from any platform — Shopify, WooCommerce, Stripe webhooks, or custom checkouts. Pass the affiliate referral code, order ID, and revenue amount. Commissions are calculated automatically.' },
            { q: 'How do payouts work?', a: 'Set your payout frequency (weekly, biweekly, monthly, or manual). When triggered, the system generates payouts for all affiliates above the minimum threshold. Supports PayPal, bank transfer, Stripe, and check methods.' },
            { q: 'Is there a limit on affiliates or programs?', a: 'Starter plans include 1 program with unlimited affiliates. Growth and Scale plans include unlimited programs. There are no limits on clicks, conversions, or tracking links on any plan.' },
            { q: 'Do affiliates need to create an account?', a: 'No. Affiliates apply through your branded signup page and get a referral code and dashboard link instantly. No separate login system required — they access their dashboard via their unique referral code.' },
          ].map((item) => (
            <details key={item.q} className="p-4 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center" style={{ color: 'var(--ept-text)' }}>{item.q}<span className="text-lg" style={{ color: 'var(--ept-text-muted)' }}>+</span></summary>
              <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
