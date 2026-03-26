'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Professional Invoices', desc: 'Create branded invoices with auto-incrementing numbers, custom prefixes, line items, tax calculations, and discounts. Send with one click.' },
  { title: 'Recurring Billing', desc: 'Set up weekly, biweekly, monthly, quarterly, or yearly recurring invoices. Auto-generated via cron with configurable end dates.' },
  { title: 'Estimates & Quotes', desc: 'Create estimates for prospects, track acceptance, and convert accepted estimates to invoices with one click — all items carry over.' },
  { title: 'Payment Tracking', desc: 'Record partial or full payments against invoices. Multiple payment methods tracked. Auto-updates invoice status and client totals.' },
  { title: 'AI Late Payment Risk', desc: 'Engine Runtime analyzes client payment history — avg days to pay, late patterns, outstanding balances — to predict late payment probability and recommend actions.' },
  { title: 'AI Invoice Optimization', desc: 'AI reviews your invoicing patterns and suggests optimal payment terms, early payment discounts, reminder timing, and wording improvements.' },
  { title: 'Expense Tracking', desc: 'Log business expenses by category with receipts, vendor info, and tax amounts. Mark expenses as billable to specific clients.' },
  { title: 'Client Credits', desc: 'Issue credits to clients for overpayments or refunds. Apply credits directly to outstanding invoices as payment.' },
  { title: 'Aging Reports', desc: 'See outstanding invoices grouped by aging buckets: current, 1-30 days, 31-60 days, 61-90 days, and 90+ days overdue.' },
  { title: 'Profit & Loss', desc: 'Real-time P&L reports with income from payments, expense breakdown by category, and net profit calculation over any date range.' },
  { title: 'Auto Late Fees', desc: 'Configure late fee percentage per tenant. Fees automatically applied to overdue invoices via daily cron after a 7-day grace period.' },
  { title: 'Product/Service Catalog', desc: 'Maintain a catalog of products and services with descriptions, unit prices, tax rates, and SKUs. Quick-add to any invoice or estimate.' },
  { title: 'Multi-Currency', desc: 'Set default currency per tenant or per client. Support for any ISO 4217 currency code.' },
  { title: 'Client Portal Data', desc: 'Track when invoices are sent, viewed, and paid. Reminder counts and dates logged for full communication audit trail.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost (SMB)', quickbooks: '$30+', freshbooks: '$22+', echo: '$19' },
  { feature: 'Recurring Invoices', quickbooks: 'Yes', freshbooks: 'Yes', echo: 'Yes' },
  { feature: 'Estimates → Invoice', quickbooks: 'Yes', freshbooks: 'Yes', echo: 'Yes' },
  { feature: 'Expense Tracking', quickbooks: 'Yes', freshbooks: 'Yes', echo: 'Yes' },
  { feature: 'AI Late Payment Prediction', quickbooks: 'No', freshbooks: 'No', echo: 'Yes' },
  { feature: 'AI Invoice Optimization', quickbooks: 'No', freshbooks: 'No', echo: 'Yes' },
  { feature: 'Auto Late Fees', quickbooks: 'Manual', freshbooks: 'Manual', echo: 'Auto (cron)' },
  { feature: 'Aging Report', quickbooks: 'Yes', freshbooks: 'Basic', echo: '5-bucket' },
  { feature: 'Profit & Loss', quickbooks: 'Yes', freshbooks: 'Yes', echo: 'Yes' },
  { feature: 'Client Credits', quickbooks: 'Yes', freshbooks: 'No', echo: 'Yes' },
  { feature: 'API Endpoints', quickbooks: 'Limited', freshbooks: 'REST', echo: '75+ REST' },
  { feature: 'Multi-Tenant', quickbooks: 'No', freshbooks: 'No', echo: 'Yes' },
  { feature: 'Product Catalog', quickbooks: 'Yes', freshbooks: 'Yes', echo: 'Yes' },
  { feature: 'Clone Invoice', quickbooks: 'Yes', freshbooks: 'Yes', echo: 'Yes' },
];

const PRICING = [
  { name: 'Freelancer', price: '$19', period: '/mo', features: ['Unlimited invoices', '10 clients', 'Payment tracking', 'Expense logging', 'Aging report', 'Product catalog'] },
  { name: 'Business', price: '$49', period: '/mo', features: ['Unlimited invoices', 'Unlimited clients', 'Recurring billing', 'Estimates & quotes', 'AI late payment risk', 'P&L reports', 'Auto late fees', 'Client credits', 'API access'] },
  { name: 'Enterprise', price: '$149', period: '/mo', features: ['Everything in Business', 'Multi-currency', 'AI optimization', 'Custom branding', 'Webhook integrations', 'Priority support', 'Team access', 'Audit log'] },
];

const FAQS = [
  { q: 'Can I migrate from QuickBooks or FreshBooks?', a: 'Yes. Export your client list and invoice history as CSV, then import via our API. Most migrations complete in under an hour.' },
  { q: 'How does AI late payment prediction work?', a: 'We analyze each client\'s payment history — average days to pay, late payment frequency, outstanding balances — and use our Engine Runtime to calculate risk scores and recommend actions like adjusted payment terms or early reminders.' },
  { q: 'Are recurring invoices fully automatic?', a: 'Yes. Set the frequency, items, and start/end dates. Our daily cron generates invoices on schedule and auto-advances the next date. You can pause, modify, or cancel any recurring setup.' },
  { q: 'How do late fees work?', a: 'Set a late fee percentage in your tenant settings. After invoices are overdue for 7+ days, the cron automatically calculates and applies the fee. Fully auditable.' },
  { q: 'Can I track expenses and generate P&L?', a: 'Yes. Log expenses by category with receipt URLs and tax amounts. The P&L report subtracts expenses from payment income over any date range, with a category breakdown.' },
  { q: 'Is there a client portal?', a: 'Invoice view tracking is built in — you can see when invoices are sent, opened, and paid. A full client portal with self-service payment is on the roadmap.' },
];

export default function InvoicePage() {
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
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI INVOICING & BILLING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6"><span className="gradient-text">Echo Invoice</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Professional invoicing with recurring billing, AI late payment prediction, expense tracking, and real-time P&L reports.
          Get paid faster. Spend less time on paperwork.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Pricing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ val: '75+', label: 'API Endpoints' }, { val: '13', label: 'Database Tables' }, { val: '5', label: 'Report Types' }, { val: '24/7', label: 'Auto Late Fees' }].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Get Paid</h2>
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
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Echo Invoice vs The Rest</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>AI-native invoicing at a fraction of the cost.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>QuickBooks</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>FreshBooks</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Invoice</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.quickbooks}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.freshbooks}</td>
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
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>No per-invoice fees. No hidden costs. Cancel anytime.</p>
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
        <div className="p-10 rounded-2xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Stop Chasing Payments. Start Getting Paid.</h2>
          <p className="mb-6" style={{ color: 'var(--ept-text-secondary)' }}>AI predicts which clients will pay late, auto-applies fees to overdue invoices, and generates recurring bills on autopilot.</p>
          <Link href="/signup" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
        </div>
      </section>
    </div>
  );
}
