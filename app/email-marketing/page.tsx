'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { title: 'AI Campaign Builder', desc: 'Generate high-converting email campaigns with AI. Input your goal and audience — get subject line, body copy, and CTA in seconds.' },
  { title: 'Visual Template Editor', desc: 'Drag-and-drop email editor with responsive templates. Brand-matched colors, fonts, and layouts. Preview on desktop and mobile.' },
  { title: 'Audience Segmentation', desc: 'Segment contacts by behavior, demographics, purchase history, engagement score, or custom tags. Dynamic segments update in real-time.' },
  { title: 'Automated Workflows', desc: 'Build multi-step automation flows: welcome series, abandoned cart, re-engagement, birthday campaigns, and custom event triggers.' },
  { title: 'A/B Testing', desc: 'Test subject lines, send times, content, and CTAs. AI selects the winner automatically based on opens, clicks, or conversions.' },
  { title: 'AI Content Generation', desc: 'Our Engine Runtime writes email copy, subject lines, and preheader text optimized for your industry and audience segment.' },
  { title: 'Send Time Optimization', desc: 'AI analyzes subscriber behavior to predict the optimal send time for each contact. Maximize opens without manual scheduling.' },
  { title: 'Real-Time Analytics', desc: 'Track opens, clicks, conversions, revenue, and unsubscribes per campaign. Heatmap view shows where readers click most.' },
  { title: 'List Management', desc: 'Import via CSV, API, or form embed. Automatic duplicate detection, bounce removal, and unsubscribe compliance (CAN-SPAM, GDPR).' },
  { title: 'Landing Page Builder', desc: 'Create campaign-specific landing pages with forms. Track form submissions as conversions. No separate tool needed.' },
  { title: 'Deliverability Suite', desc: 'SPF/DKIM/DMARC setup, reputation monitoring, inbox placement testing, and spam score checker. Keep emails out of junk folders.' },
  { title: 'Multi-Tenant', desc: 'Agencies and resellers: each client gets isolated branding, sending domains, lists, and analytics under one account.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost (5K contacts)', mailchimp: '$59', convertkit: '$79', activecampaign: '$49', echo: '$15' },
  { feature: 'AI Content Generation', mailchimp: 'Basic', convertkit: 'No', activecampaign: 'No', echo: 'Full' },
  { feature: 'AI Subject Line Testing', mailchimp: 'Paid add-on', convertkit: 'No', activecampaign: 'No', echo: 'Built-in' },
  { feature: 'Send Time Optimization', mailchimp: 'Premium only', convertkit: 'No', activecampaign: 'Plus+', echo: 'All plans' },
  { feature: 'Automation Workflows', mailchimp: 'Standard+', convertkit: 'Yes', activecampaign: 'Yes', echo: 'Yes' },
  { feature: 'A/B Testing', mailchimp: 'Yes', convertkit: 'Pro', activecampaign: 'Yes', echo: 'AI-powered' },
  { feature: 'Landing Pages', mailchimp: 'Yes', convertkit: 'Yes', activecampaign: 'Plus+', echo: 'Yes' },
  { feature: 'Multi-Tenant', mailchimp: 'No', convertkit: 'No', activecampaign: 'No', echo: 'Yes' },
  { feature: 'API Endpoints', mailchimp: 'REST', convertkit: 'REST', activecampaign: 'REST', echo: '25+ REST' },
];

const PRICING = [
  { name: 'Starter', price: '$15', period: '/mo', features: ['2,500 contacts', '10,000 emails/mo', 'Template editor', 'Basic analytics', 'List management', 'Form embeds'] },
  { name: 'Growth', price: '$49', period: '/mo', features: ['15,000 contacts', '100,000 emails/mo', 'AI content generation', 'Automation workflows', 'A/B testing', 'Send time optimization', 'Landing pages', 'Advanced analytics'] },
  { name: 'Scale', price: '$149', period: '/mo', features: ['Everything in Growth', 'Unlimited contacts', '500,000 emails/mo', 'Multi-tenant', 'Deliverability suite', 'Dedicated IP', 'Priority support', 'Custom integrations'] },
];

const FAQS = [
  { q: 'How does Echo Email Marketing differ from Echo Email Sender?', a: 'Echo Email Sender is for transactional and developer-focused email (receipts, notifications, API-driven sends). Echo Email Marketing is for marketers — campaigns, automations, audience segmentation, A/B testing, and AI content generation.' },
  { q: 'Can I migrate from Mailchimp?', a: 'Yes. Export your Mailchimp contacts as CSV and import directly. Templates can be recreated in our visual editor or via HTML import. Most migrations complete in under an hour.' },
  { q: 'How does the AI content generation work?', a: 'Our Engine Runtime analyzes your brand voice, audience data, and campaign goal to generate email copy, subject lines, and preheader text. You review, edit, and send — or let the AI handle it end-to-end.' },
  { q: 'Is there a free tier?', a: 'New accounts get a 14-day free trial on the Growth plan. After that, the Starter plan at $15/mo covers small lists. No credit card required to start.' },
  { q: 'Do you support GDPR compliance?', a: 'Yes. Double opt-in, automatic unsubscribe links, data export, and right-to-delete are built in. Consent tracking is automatic.' },
];

export default function EmailMarketingPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Email Marketing', href: '/email-marketing' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI EMAIL MARKETING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6"><span className="gradient-text">Echo Email Marketing</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered email campaigns that write themselves. Segment audiences, automate workflows,
          and optimize send times — all from one platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout?service=email-marketing&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#pricing" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Pricing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ val: '25+', label: 'API Endpoints' }, { val: '98.5%', label: 'Inbox Rate' }, { val: 'AI', label: 'Content Engine' }, { val: '12', label: 'Automation Triggers' }].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything Marketers Need</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover animate-fade-up" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${i * 50}ms` }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Echo vs The Competition</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>AI-native marketing at a fraction of the cost.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Mailchimp</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>ConvertKit</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>ActiveCampaign</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.mailchimp}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.convertkit}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.activecampaign}</td>
                  <td className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Scale as you grow. No per-subscriber surprises.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className={`p-6 rounded-xl border ${i === 1 ? 'ring-2 ring-[--ept-accent]' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{p.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=email-marketing&tier=${p.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>
                {i === 0 ? 'Start Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>FAQ</h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Ready to Grow Your List?</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>14-day free trial on the Growth plan. No credit card required.</p>
        <TrialCTA serviceId="echo-email-marketing" tier="starter" productName="Echo Email Marketing" />
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
