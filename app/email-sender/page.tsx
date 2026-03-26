'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Transactional Email', desc: 'Send invoices, receipts, password resets, and order confirmations with guaranteed delivery. Template-based with dynamic variable injection.' },
  { title: 'Broadcast Campaigns', desc: 'Send newsletters and announcements to segmented lists. Schedule sends, A/B test subject lines, and track open/click rates in real time.' },
  { title: 'Template Builder', desc: 'Create reusable email templates with HTML/CSS. Variables like {{name}}, {{company}}, {{amount}} auto-replaced at send time. Preview before sending.' },
  { title: 'Contact Lists', desc: 'Import contacts via CSV or API. Segment by tags, engagement score, last activity, or custom fields. Auto-unsubscribe handling.' },
  { title: 'Delivery Analytics', desc: 'Track sends, deliveries, opens, clicks, bounces, and complaints per campaign. Real-time dashboard with exportable reports.' },
  { title: 'Bounce & Complaint Handling', desc: 'Automatic hard bounce suppression. Complaint feedback loops processed instantly. Keeps your sender reputation clean.' },
  { title: 'Domain Authentication', desc: 'SPF, DKIM, and DMARC setup guidance. Verify sending domains to maximize inbox placement and avoid spam folders.' },
  { title: 'Webhook Events', desc: 'Real-time webhooks for delivered, opened, clicked, bounced, and complained events. Integrate with any CRM or automation pipeline.' },
  { title: 'AI Subject Line Optimizer', desc: 'Engine Runtime analyzes your audience and past performance to suggest subject lines that maximize open rates. A/B testing built in.' },
  { title: 'Drip Sequences', desc: 'Build multi-step email sequences triggered by signup, purchase, or custom events. Delay-based or behavior-based progression.' },
  { title: 'Rate Limiting & Throttling', desc: 'Configurable send rates per domain to respect ISP limits. Automatic backoff on temporary failures. Queue management.' },
  { title: 'Multi-Tenant', desc: 'Each tenant gets isolated sending domains, templates, lists, and analytics. Perfect for agencies managing multiple client brands.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost (10K emails)', sendgrid: '$19.95', mailgun: '$15', resend: '$20', echo: '$9' },
  { feature: 'Transactional Email', sendgrid: 'Yes', mailgun: 'Yes', resend: 'Yes', echo: 'Yes' },
  { feature: 'Broadcast Campaigns', sendgrid: 'Yes', mailgun: 'Basic', resend: 'No', echo: 'Yes' },
  { feature: 'Template Builder', sendgrid: 'Yes', mailgun: 'Basic', resend: 'React', echo: 'HTML + Variables' },
  { feature: 'AI Subject Line Optimizer', sendgrid: 'No', mailgun: 'No', resend: 'No', echo: 'Yes' },
  { feature: 'Drip Sequences', sendgrid: 'Add-on', mailgun: 'No', resend: 'No', echo: 'Built-in' },
  { feature: 'Webhook Events', sendgrid: 'Yes', mailgun: 'Yes', resend: 'Yes', echo: 'Yes' },
  { feature: 'Domain Auth (SPF/DKIM)', sendgrid: 'Yes', mailgun: 'Yes', resend: 'Yes', echo: 'Yes' },
  { feature: 'Bounce Suppression', sendgrid: 'Yes', mailgun: 'Yes', resend: 'Yes', echo: 'Auto' },
  { feature: 'Contact Segmentation', sendgrid: 'Yes', mailgun: 'No', resend: 'No', echo: 'Yes' },
  { feature: 'Multi-Tenant', sendgrid: 'Enterprise', mailgun: 'No', resend: 'No', echo: 'Yes' },
  { feature: 'API Endpoints', sendgrid: 'REST', mailgun: 'REST', resend: 'REST', echo: '30+ REST' },
];

const PRICING = [
  { name: 'Starter', price: '$9', period: '/mo', features: ['10,000 emails/mo', 'Transactional email', '5 templates', 'Delivery analytics', 'Bounce handling', 'Webhook events'] },
  { name: 'Growth', price: '$29', period: '/mo', features: ['50,000 emails/mo', 'Broadcast campaigns', 'Unlimited templates', 'Contact segmentation', 'Drip sequences', 'AI subject optimizer', 'A/B testing', 'Domain authentication'] },
  { name: 'Scale', price: '$99', period: '/mo', features: ['Everything in Growth', '500,000 emails/mo', 'Multi-tenant', 'Dedicated IP', 'Priority delivery', 'Advanced analytics', 'Custom webhooks', 'SLA guarantee'] },
];

const FAQS = [
  { q: 'How does Echo Email compare to Resend?', a: 'Resend focuses on developer-friendly transactional email. Echo Email adds broadcast campaigns, drip sequences, AI subject optimization, contact segmentation, and multi-tenant support — all in one platform at a lower price point.' },
  { q: 'Can I migrate from SendGrid or Mailgun?', a: 'Yes. Import your contact lists via CSV, recreate templates using our builder, and update your API calls — our REST API follows familiar patterns. Most migrations take under a day.' },
  { q: 'How does the AI subject line optimizer work?', a: 'Our Engine Runtime analyzes your historical open rates, audience demographics, and industry benchmarks to suggest high-performing subject lines. It also powers automatic A/B testing to continuously improve results.' },
  { q: 'What about deliverability?', a: 'We provide full SPF, DKIM, and DMARC setup. Automatic bounce suppression and complaint handling keep your sender reputation clean. Growth and Scale plans include dedicated IP options.' },
  { q: 'Is there a free tier?', a: 'New accounts get 100 emails/day free for the first 30 days. After that, the Starter plan at $9/mo covers most small business needs.' },
  { q: 'Can I use this for cold outreach?', a: 'Echo Email is designed for permission-based email. All lists must be opt-in. We enforce CAN-SPAM and GDPR compliance with automatic unsubscribe handling.' },
];

export default function EmailSenderPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
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
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI EMAIL PLATFORM</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6"><span className="gradient-text">Echo Email</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Transactional email, broadcast campaigns, drip sequences, and AI-optimized subject lines.
          Reliable delivery at a fraction of the cost.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Pricing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ val: '30+', label: 'API Endpoints' }, { val: '99.9%', label: 'Delivery Rate' }, { val: '<1s', label: 'Avg Send Time' }, { val: '6', label: 'Event Webhooks' }].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Send Email</h2>
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
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Echo Email vs The Rest</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>More features, lower cost, AI-native.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>SendGrid</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Mailgun</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Resend</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Email</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.sendgrid}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.mailgun}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.resend}</td>
                  <td className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Pay for what you send. No hidden fees.</p>
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
              <Link href="/signup" className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>
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
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Send Smarter?</h2>
          <p className="mb-6" style={{ color: 'var(--ept-text-secondary)' }}>100 free emails/day for 30 days. No credit card required.</p>
          <Link href="/signup" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
