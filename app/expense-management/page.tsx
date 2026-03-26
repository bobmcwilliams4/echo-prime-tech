'use client';

import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { icon: '🧾', title: 'AI Receipt Scanning', desc: 'AI extracts merchant, amount, date, and category from receipt text. Auto-categorizes expenses with confidence scores.' },
  { icon: '📋', title: 'Expense Reports', desc: 'Create reports, attach expenses, submit for approval. Track status from draft to submitted to approved to paid.' },
  { icon: '✅', title: 'Approval Workflows', desc: 'Multi-level approval with manager review, notes, and full audit trail. Auto-approve expenses under configurable thresholds.' },
  { icon: '🚨', title: 'Policy Enforcement', desc: 'Define spending policies per category with max amounts and receipt requirements. Auto-detect violations before submission.' },
  { icon: '🚗', title: 'Mileage Tracking', desc: 'Log business miles with configurable IRS mileage rates. Auto-calculates reimbursement amounts.' },
  { icon: '🏨', title: 'Per Diem', desc: 'Per diem tracking with configurable daily rates. Auto-calculates total for multi-day business trips.' },
  { icon: '💱', title: 'Multi-Currency', desc: 'Log expenses in any currency with exchange rates. All amounts normalize to your organization currency.' },
  { icon: '💰', title: 'Budget Tracking', desc: 'Set department and category budgets with period controls. Real-time utilization tracking and overspend alerts.' },
  { icon: '🔁', title: 'Reimbursement Management', desc: 'Track reimbursement status from approval to payment. Support direct deposit, check, and manual payment methods.' },
  { icon: '🔍', title: 'Duplicate Detection', desc: 'AI-powered duplicate detection finds expenses with matching merchant, amount, and date across your organization.' },
  { icon: '📊', title: 'Spending Analytics', desc: 'AI analyzes 90-day spending patterns and provides insights on cost reduction, budget optimization, and trends.' },
  { icon: '📤', title: 'CSV/JSON Export', desc: 'Export expenses with date ranges for payroll, accounting, QuickBooks, or any external system integration.' },
];

const COMPARISON = [
  { feature: 'AI Receipt Scanning', echo: true, expensify: true, brex: true, ramp: true },
  { feature: 'Expense Reports', echo: true, expensify: true, brex: true, ramp: true },
  { feature: 'Approval Workflows', echo: true, expensify: true, brex: true, ramp: true },
  { feature: 'Policy Enforcement', echo: true, expensify: true, brex: true, ramp: true },
  { feature: 'Mileage Tracking', echo: true, expensify: true, brex: false, ramp: false },
  { feature: 'Per Diem Rates', echo: true, expensify: true, brex: false, ramp: false },
  { feature: 'Auto-Approve Threshold', echo: true, expensify: false, brex: true, ramp: true },
  { feature: 'Duplicate Detection', echo: true, expensify: true, brex: false, ramp: false },
  { feature: 'Budget Tracking', echo: true, expensify: false, brex: true, ramp: true },
  { feature: 'AI Spending Analysis', echo: true, expensify: false, brex: false, ramp: false },
  { feature: 'Multi-Currency', echo: true, expensify: true, brex: true, ramp: true },
  { feature: 'GL Account Mapping', echo: true, expensify: true, brex: true, ramp: true },
  { feature: 'Corporate Card Required', echo: false, expensify: false, brex: true, ramp: true },
  { feature: 'Starting Price', echo: '$6/user', expensify: '$5/user', brex: 'Free*', ramp: 'Free*' },
];

const TIERS = [
  { name: 'Starter', price: '$6', period: '/user/mo', desc: 'For small teams tracking expenses.', features: ['Unlimited expenses', 'Up to 25 employees', 'Expense reports', 'Basic approval workflow', 'Mileage & per diem', 'Receipt upload', 'CSV export', 'Email support'] },
  { name: 'Business', price: '$12', period: '/user/mo', desc: 'For teams needing policy enforcement and AI.', features: ['Unlimited employees', 'AI receipt scanning', 'Policy enforcement', 'Auto-approve thresholds', 'Budget tracking', 'Duplicate detection', 'AI spending analysis', 'Multi-currency', 'Reimbursement tracking', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$22', period: '/user/mo', desc: 'For organizations with advanced compliance needs.', features: ['Everything in Business', 'GL account mapping', 'Custom approval chains', 'Advanced analytics', 'API access', 'SSO integration', 'Audit compliance reports', 'Dedicated account manager'] },
];

const FAQS = [
  { q: 'How does AI receipt scanning work?', a: 'Submit receipt text (from a photo or scan) and our AI extracts the merchant name, amount, date, and suggests a category with a confidence score. This saves manual data entry and reduces errors on expense submissions.' },
  { q: 'What is auto-approve threshold?', a: 'You can set a dollar amount (e.g., $25) below which expenses are automatically approved without manager review. This eliminates approval bottleneck for small purchases like coffee or parking while still enforcing review for larger expenses.' },
  { q: 'How does policy enforcement work?', a: 'Define spending policies per category with maximum amounts and receipt requirements. When an employee submits an expense, the system automatically checks against policies and flags violations before the report reaches the approver.' },
  { q: 'Can I track mileage and per diem?', a: 'Yes. Log business miles and the system calculates reimbursement using configurable mileage rates (default: IRS standard $0.67/mile). For per diem, enter the number of days and the daily rate auto-calculates the total amount.' },
  { q: 'How do reimbursements work?', a: 'After an expense report is approved, mark it as paid with the payment method (direct deposit, check, etc.) and reference number. The system creates a reimbursement record and tracks the full lifecycle from submission to payment.' },
  { q: 'Do I need a corporate card?', a: 'No. Unlike Brex and Ramp which require their corporate cards, Echo Expense works with any payment method. Employees can use personal cards, corporate cards, cash, or any other method — you just track and reimburse the expenses.' },
];

export default function ExpenseManagementPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Expense Management', href: '/expense-management' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=expense&tier=business" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>AI-Powered Expense Management</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Expenses on<br /><span className="gradient-text">Autopilot</span></h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>AI receipt scanning, policy enforcement, approval workflows, mileage & per diem tracking, budget controls, and spending analytics — everything your team needs to manage expenses without the pain.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=expense&tier=business" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Manage Expenses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How We Compare</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Full expense management without requiring a corporate card.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th><th className="py-3 px-4 font-semibold">Expensify</th><th className="py-3 px-4 font-semibold">Brex</th><th className="py-3 px-4 font-semibold">Ramp</th></tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.expensify === 'boolean' ? (row.expensify ? '✅' : '❌') : row.expensify}</td>
                  <td className="py-3 px-4 text-center">{typeof row.brex === 'boolean' ? (row.brex ? '✅' : '❌') : row.brex}</td>
                  <td className="py-3 px-4 text-center">{typeof row.ramp === 'boolean' ? (row.ramp ? '✅' : '❌') : row.ramp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Per-User Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No corporate card required. No hidden fees. Cancel anytime.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <div key={i} className={`p-8 rounded-xl border ${t.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              {t.popular && <div className="text-xs font-bold uppercase mb-4 tracking-wider" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-2xl font-bold mb-1">{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold">{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.period}</span></div>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{t.desc}</p>
              <ul className="space-y-2 mb-8">
                {t.features.map((f, j) => (<li key={j} className="text-sm flex items-start gap-2"><span style={{ color: 'var(--ept-accent)' }}>✓</span><span>{f}</span></li>))}
              </ul>
              <Link href={`/checkout?service=expense&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Simplify Expense Management?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Join teams saving hours on expense reports with AI-powered automation.</p>
        <Link href="/checkout?service=expense&tier=business" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </div>
  );
}
