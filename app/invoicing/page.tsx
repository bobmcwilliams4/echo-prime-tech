'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ═══════════════════════════════════════════════════════════════════
    Echo Invoicing — AI-Powered Invoicing & Billing
    Backend: echo-invoicing.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Professional Invoices', desc: 'Generate branded invoices with line items, taxes, discounts, and custom notes. Print-ready PDF output with your company details.' },
  { title: 'Client Management', desc: 'Maintain a full client directory with company details, billing addresses, and payment history. One click to see all invoices for any client.' },
  { title: 'Multi-Currency', desc: 'Invoice in any currency. Set default currency per tenant or per client. Automatic tax calculations based on configurable tax rates.' },
  { title: 'Recurring Invoices', desc: 'Set up automatic recurring invoices for retainers and subscriptions. Weekly, monthly, quarterly, or yearly — auto-generated and sent on schedule.' },
  { title: 'Payment Tracking', desc: 'Record payments by card, bank transfer, PayPal, check, cash, or crypto. Partial payments supported with running balance tracking.' },
  { title: 'AI Payment Prediction', desc: 'AI analyzes payment patterns per client to predict when invoices will be paid and flag high-risk accounts before they become overdue.' },
  { title: 'Overdue Automation', desc: 'Daily cron automatically marks past-due invoices as overdue. Configure automatic reminder emails at 7, 14, and 30 days past due.' },
  { title: 'Revenue Reports', desc: 'See revenue by month, quarter, or year. Break down by client, service, or payment method. Export data for your accountant.' },
  { title: 'Aging Reports', desc: 'Accounts receivable aging report shows current, 30-day, 60-day, and 90+ day outstanding balances. Never lose track of money owed.' },
  { title: 'Email Integration', desc: 'One-click invoice sending via integrated email. Clients receive professional HTML invoices with payment instructions.' },
  { title: 'Payment Terms', desc: 'Configure Net 15, Net 30, Net 60, or custom payment terms. Terms auto-calculate due dates and drive overdue automation.' },
  { title: 'Dashboard Overview', desc: 'Real-time view of total revenue, outstanding invoices, overdue amounts, recent payments, and upcoming recurring invoices.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', echo: '$15/mo', c1: '$30/mo', c2: '$25/mo', c3: 'Free (ads)' },
  { feature: 'AI Payment Prediction', echo: 'Yes', c1: 'No', c2: 'No', c3: 'No' },
  { feature: 'Recurring Invoices', echo: 'All tiers', c1: 'Plus+', c2: 'Pro', c3: 'No' },
  { feature: 'Multi-Currency', echo: 'Yes', c1: 'Plus+', c2: 'Yes', c3: 'Limited' },
  { feature: 'Aging Reports', echo: 'All tiers', c1: 'Plus+', c2: 'Pro', c3: 'No' },
  { feature: 'API Access', echo: 'Full REST', c1: 'Enterprise', c2: 'Pro', c3: 'No' },
  { feature: 'Payment Methods', echo: '6 types', c1: '4 types', c2: '3 types', c3: '2 types' },
  { feature: 'Email Sending', echo: 'Built-in', c1: 'Built-in', c2: 'Built-in', c3: 'Manual' },
  { feature: 'Self-Hostable', echo: 'Cloudflare', c1: 'No', c2: 'No', c3: 'No' },
];

const PRICING = [
  { tier: 'Starter', price: 15, features: ['50 clients', 'Unlimited invoices', 'Payment tracking', 'PDF generation', 'Email sending', 'Basic reports', 'Dashboard'], cta: 'Start Free Trial', href: '/checkout?service=invoicing&tier=starter', popular: false },
  { tier: 'Professional', price: 39, features: ['Unlimited clients', 'Recurring invoices', 'AI payment prediction', 'Aging reports', 'Revenue analytics', 'Multi-currency', 'Custom payment terms', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=invoicing&tier=professional', popular: true },
  { tier: 'Business', price: 99, features: ['Everything in Pro', 'Multi-user access', 'Custom branding', 'Webhook integrations', 'Priority support', 'Data export (CSV/JSON)', 'Audit log', 'Dedicated support'], cta: 'Contact Sales', href: '/checkout?service=invoicing&tier=business', popular: false },
];

const FAQS = [
  { q: 'How does AI payment prediction work?', a: 'Our AI analyzes each client\'s payment history — average days to pay, payment consistency, and current invoice amount — to predict when each outstanding invoice will likely be paid. High-risk invoices are flagged early so you can follow up proactively.' },
  { q: 'Can I customize invoice templates?', a: 'Yes. Set your company name, address, tax ID, logo, and payment terms at the tenant level. Each invoice includes your branding and custom notes. PDF output is print-ready.' },
  { q: 'How do recurring invoices work?', a: 'Set a client, line items, frequency (weekly/monthly/quarterly/yearly), and start date. Our daily cron automatically generates and sends invoices on schedule. Pause or resume anytime.' },
  { q: 'What payment methods are supported?', a: 'Record payments via credit card, bank transfer, PayPal, check, cash, or cryptocurrency. Each payment is linked to an invoice with reference numbers and notes. Partial payments are tracked with running balances.' },
  { q: 'Can I track partial payments?', a: 'Absolutely. Record multiple payments against a single invoice. The system tracks total paid vs. invoice amount and automatically marks invoices as "paid" when the balance reaches zero.' },
  { q: 'Is my data secure?', a: 'All data is stored in Cloudflare D1 with encrypted connections. Write operations require API key authentication. We never share or sell your financial data.' },
];

export default function InvoicingPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Invoicing', href: '/invoicing' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>INVOICING & BILLING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Get Paid Faster with<br /><span className="gradient-text">AI-Powered Invoicing</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Professional invoices, recurring billing, payment tracking, and AI that predicts when you&#39;ll get paid. The invoicing tool built for modern businesses.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/checkout?service=invoicing&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial — $15/mo</Link>
          <Link href="/engines" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See AI Engines</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Complete Invoicing Suite</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Echo vs FreshBooks vs QuickBooks vs Wave</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}><th className="p-3 text-left font-bold">Feature</th><th className="p-3 text-center font-bold">FreshBooks</th><th className="p-3 text-center font-bold">QuickBooks</th><th className="p-3 text-center font-bold">Wave</th><th className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>Echo</th></tr></thead>
            <tbody>{COMPARISON.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                <td className="p-3 font-medium">{r.feature}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c1}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c2}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c3}</td><td className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Simple, Honest Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: p.popular ? 2 : 1 }}>
              {p.popular && <div className="text-xs font-bold mb-2" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{p.tier}</h3>
              <div className="my-4"><span className="text-4xl font-extrabold">${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>/mo</span></div>
              <ul className="space-y-2 mb-6 flex-1">{p.features.map((f, j) => <li key={j} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={p.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: p.popular ? '#fff' : 'var(--ept-text)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{f.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
