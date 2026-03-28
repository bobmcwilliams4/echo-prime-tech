'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';

const FAQS = [
  { q: 'How does the referral system work?', a: 'Every person who signs up gets a unique referral link. When someone joins through that link, the referrer moves up in line. The more referrals, the higher the position. This creates a viral growth loop where signups drive more signups.' },
  { q: 'What are milestone rewards?', a: 'Set referral thresholds (e.g., 3 referrals, 10 referrals) with unlockable rewards like badges, early access, discount codes, or custom perks. Users see their progress toward the next milestone on the waitlist page.' },
  { q: 'Can I run multiple waitlists at once?', a: 'Yes. Growth plans support 5 campaigns and Scale supports unlimited. Each campaign has independent settings, branding, and subscriber lists — great for testing multiple products or launches.' },
  { q: 'How do I invite people off the waitlist?', a: 'Use the bulk invite feature to invite the top N people in one click. They receive an email notification that they have been selected. You control the pace of your rollout.' },
  { q: 'What happens when someone signs up?', a: 'They immediately receive a confirmation email with their position number and unique referral link. The email drives instant sharing by showing how referrals move them up the list.' },
  { q: 'Is there protection against fake signups?', a: 'Yes. Built-in IP-based rate limiting prevents bots from flooding your list. The system also deduplicates emails and validates format before accepting signups.' },
];

const FEATURES = [
  { icon: 'V', title: 'Viral Referral Loops', desc: 'Every signup gets a unique referral link. Friends who join boost the referrer up the list automatically' },
  { icon: 'P', title: 'Position Tracking', desc: 'Real-time position display with effective rank calculation — referrals move you closer to the front' },
  { icon: 'M', title: 'Milestone Rewards', desc: 'Set referral thresholds with unlockable rewards — badges, early access, discounts, or custom perks' },
  { icon: 'W', title: 'Embeddable Widget', desc: 'Drop a single script tag on any page for a branded signup form with built-in referral tracking' },
  { icon: 'E', title: 'Confirmation Emails', desc: 'Automatic welcome emails with position and referral link — drives immediate sharing' },
  { icon: 'B', title: 'Bulk Invite', desc: 'Invite the top N people from your waitlist in one click when you are ready to launch' },
  { icon: 'A', title: 'Analytics Dashboard', desc: 'Track signups, referrals, viral coefficient, conversion funnel, and top referrers' },
  { icon: 'C', title: 'Custom Fields', desc: 'Collect any data during signup — company, role, use case — with flexible JSON fields' },
  { icon: 'R', title: 'Referral Leaderboard', desc: 'See who is driving the most signups — identify your super-fans before launch' },
  { icon: 'S', title: 'Campaign Management', desc: 'Run multiple waitlists for different products with independent settings and branding' },
  { icon: 'D', title: 'Data Export', desc: 'Export your entire waitlist as JSON — emails, positions, referral data, custom fields' },
  { icon: 'L', title: 'Rate Limited', desc: 'Built-in abuse protection with IP-based rate limiting — no bots flooding your list' },
];

const COMPARE = [
  ['Feature', 'Echo Waitlist', 'Waitlist.me', 'Viral Loops'],
  ['Referral tracking', 'All plans', 'Premium only', 'All plans'],
  ['Position boosting', 'All plans', 'No', 'All plans'],
  ['Milestone rewards', 'All plans', 'No', 'Growth+'],
  ['Embeddable widget', 'All plans', 'Premium', 'All plans'],
  ['Multiple campaigns', 'All plans', 'Premium', 'Growth+'],
  ['Confirmation emails', 'All plans', 'All plans', 'All plans'],
  ['Custom fields', 'All plans', 'Premium', 'Growth+'],
  ['Analytics', 'All plans', 'Premium', 'All plans'],
  ['Bulk invite', 'All plans', 'Premium', 'Growth+'],
  ['API access', 'All plans', 'Enterprise', 'Growth+'],
  ['Data export', 'All plans', 'Premium', 'Growth+'],
  ['Starting price', '$9/mo', '$19/mo', '$49/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$9', per: '/mo', features: ['1 campaign', '5,000 signups', 'Referral tracking', 'Position boosting', 'Milestone rewards', 'Embeddable widget', 'Confirmation emails', 'Analytics'] },
  { name: 'Growth', price: '$29', per: '/mo', features: ['5 campaigns', '50,000 signups', 'Custom fields', 'Bulk invite', 'API access', 'Data export', 'Custom branding', 'Priority support'], popular: true },
  { name: 'Scale', price: '$79', per: '/mo', features: ['Unlimited campaigns', 'Unlimited signups', 'White-label', 'Webhook integrations', 'Custom domain', 'Advanced analytics', 'Dedicated support', 'SLA guarantee'] },
];

export default function WaitlistPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Waitlist', href: '/waitlist' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=waitlist&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Waitlist</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Turn signups into growth. Launch with momentum.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=waitlist&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Create Waitlist</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Every Signup Drives the Next One</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Most waitlists are just email forms. Echo Waitlist turns every signup into a referral engine. Each person gets a unique link. Every friend they bring moves them up the list. Set milestone rewards to supercharge sharing. Launch with thousands of engaged users instead of a cold list.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Embed Anywhere</h3>
          <div className="p-4 rounded-lg font-mono text-sm overflow-x-auto" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-accent)' }}>
            {'<script src="https://echo-waitlist.bmcii1976.workers.dev/widget.js?id=YOUR_CAMPAIGN_ID"></script>'}
          </div>
          <p className="text-sm mt-3" style={{ color: 'var(--ept-text-muted)' }}>One line of code. Branded signup form with referral tracking. Works on any website, landing page, or blog.</p>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything for a Viral Launch</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell.startsWith('All') || cell.startsWith('$9')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=waitlist&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <FaqSchema faqs={FAQS} name="Echo Waitlist FAQ" />
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details key={faq.q} className="p-5 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <span className="ml-2 transition-transform group-open:rotate-45 text-xl" style={{ color: 'var(--ept-accent)' }}>+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
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
