'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';
import TrialCTA from '@/components/TrialCTA';

const FAQS = [
  { q: 'How many subscribers can I have?', a: 'Starter supports 1,000 subscribers, Growth supports 10,000, and Scale supports 100,000. All plans include unlimited lists and segments.' },
  { q: 'Does Echo Newsletter take a cut of paid subscriptions?', a: 'No. Echo Newsletter charges a flat monthly fee with zero revenue share. Unlike Substack which takes 10% of your subscription revenue forever, you keep 100% of what your readers pay.' },
  { q: 'Can I migrate from Substack or Beehiiv?', a: 'Yes. You can bulk import subscribers via CSV or API. Upload up to 500 subscribers per batch with automatic duplicate detection and validation.' },
  { q: 'How does the embeddable widget work?', a: 'Add a single script tag to any website. A branded subscribe form appears instantly — no iframe, no dependencies, no configuration required. It works on any static site, WordPress, or custom app.' },
  { q: 'What does AI content generation do?', a: 'Provide a topic and tone, and the AI generates a publication-ready HTML newsletter draft. Available on Growth plans and above. Powered by the Echo Engine Runtime.' },
  { q: 'Can I use my own domain for sending?', a: 'Yes. Custom sending domains are available on Growth and Scale plans. Configure your DNS records and send newsletters from your own branded email address.' },
];

const FEATURES = [
  { icon: 'S', title: 'Subscriber Management', desc: 'Import, segment, and manage unlimited subscribers with custom fields, lists, and double opt-in support' },
  { icon: 'E', title: 'Email Campaigns', desc: 'Compose rich HTML newsletters with a visual editor, preview, schedule, and send to targeted lists' },
  { icon: 'T', title: 'Open & Click Tracking', desc: 'Pixel-based open tracking and link click tracking with per-subscriber attribution and real-time dashboards' },
  { icon: 'A', title: 'Drip Automations', desc: 'Build multi-step email sequences triggered by subscribe, tag, or custom events with configurable delays' },
  { icon: 'R', title: 'RSS Feeds', desc: 'Auto-generated RSS feed for every newsletter — let readers subscribe via their favorite RSS reader' },
  { icon: 'W', title: 'Embeddable Widgets', desc: 'Drop a single script tag on any site to add a branded subscribe form — no iframe, no dependencies' },
  { icon: 'I', title: 'AI Content Generation', desc: 'Generate newsletter drafts with AI — provide a topic and tone, get publication-ready HTML in seconds' },
  { icon: 'M', title: 'Email Templates', desc: 'Save and reuse branded HTML templates across campaigns for consistent design and faster publishing' },
  { icon: 'L', title: 'List Segmentation', desc: 'Create unlimited subscriber lists for targeted sends — separate audiences by interest, product, or geography' },
  { icon: 'D', title: 'Analytics Dashboard', desc: 'Track subscriber growth, open rates, click rates, and bounce rates with daily trend charts' },
  { icon: 'B', title: 'Bulk Import', desc: 'Import up to 500 subscribers per batch from CSV or API with duplicate detection and validation' },
  { icon: 'U', title: 'Unsubscribe Management', desc: 'One-click unsubscribe links in every email with automatic list cleanup and compliance tracking' },
];

const COMPARE = [
  ['Feature', 'Echo Newsletter', 'Substack', 'Beehiiv'],
  ['Subscribers', 'Unlimited', 'Unlimited', '2,500 (Free)'],
  ['Email sends', 'By plan', 'Unlimited', 'Unlimited (Free)'],
  ['Custom domain', 'All plans', 'Paid only', 'Scale+'],
  ['RSS feed', 'All plans', 'Yes', 'Scale+'],
  ['Drip automations', 'All plans', 'No', 'Scale+'],
  ['AI content', 'Pro+', 'No', 'Scale+'],
  ['Email templates', 'All plans', 'Limited', 'Scale+'],
  ['Open tracking', 'All plans', 'Yes', 'Yes'],
  ['Click tracking', 'All plans', 'Yes', 'Yes'],
  ['Embeddable widget', 'All plans', 'Limited', 'Yes'],
  ['API access', 'All plans', 'No', 'Scale+'],
  ['Revenue cut', '0%', '10%', '0% (Scale+)'],
  ['Starting price', '$14/mo', 'Free + 10%', 'Free / $42/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$14', per: '/mo', features: ['1,000 subscribers', '5,000 sends/month', 'Unlimited lists', 'Email templates', 'Open & click tracking', 'RSS feed', 'Embeddable widget', 'Drip automations'] },
  { name: 'Growth', price: '$39', per: '/mo', features: ['10,000 subscribers', '50,000 sends/month', 'AI content generation', 'Custom domain', 'Advanced analytics', 'Bulk import', 'Priority support', 'Custom branding'], popular: true },
  { name: 'Scale', price: '$99', per: '/mo', features: ['100,000 subscribers', '500,000 sends/month', 'Dedicated IP', 'Webhook integrations', 'API access', 'A/B testing', 'White-label', 'Dedicated support'] },
];

export default function NewsletterPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Newsletter', href: '/newsletter' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=newsletter&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Newsletter</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Your words, your audience, your revenue. Zero platform tax.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=newsletter&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Publishing</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      {/* Value Prop */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Own Your Audience. Keep Your Revenue.</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Substack takes 10% of your paid subscriptions forever. Beehiiv locks features behind $99/mo plans. Echo Newsletter gives you everything from day one — subscriber management, automations, analytics, AI content, and embeddable widgets — for a flat $14/mo. No revenue share. No lock-in. Your list, your data, your business.</p>
        </div>
      </section>

      {/* Embed Demo */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Embed in One Line</h3>
          <div className="p-4 rounded-lg font-mono text-sm overflow-x-auto" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-accent)' }}>
            {'<script src="https://echo-newsletter.bmcii1976.workers.dev/widget.js?id=YOUR_ID"></script>'}
          </div>
          <p className="text-sm mt-3" style={{ color: 'var(--ept-text-muted)' }}>Drop this on any page. A branded subscribe form appears instantly — no iframe, no dependencies, no configuration.</p>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Publish</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Unlimited' || cell.startsWith('All') || cell.startsWith('$14') || cell === '0%' || cell === 'By plan' || cell === 'Pro+') ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=newsletter&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <FaqSchema faqs={FAQS} name="Echo Newsletter FAQ" />
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Own Your Audience?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Start publishing newsletters with zero platform tax. Your words, your revenue.</p>
        <TrialCTA serviceId="echo-newsletter" tier="starter" productName="Echo Newsletter" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
