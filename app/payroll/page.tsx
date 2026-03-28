'use client';
import FaqSchema from '../../components/FaqSchema';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FEATURES = [
  { icon: '💰', title: 'Automatic Tax Calculations', desc: 'Federal, state, Social Security, Medicare — all calculated automatically for every employee, every pay period.' },
  { icon: '📋', title: 'Pay Run Lifecycle', desc: 'Draft → Calculate → Approve → Process. Full workflow with audit trail and approval gates.' },
  { icon: '🏦', title: 'Direct Deposit Tracking', desc: 'Track multiple bank accounts per employee with split deposits and routing verification.' },
  { icon: '📊', title: 'YTD Tracking', desc: 'Automatic year-to-date accumulation for gross pay, taxes, deductions, and benefits across all pay periods.' },
  { icon: '⏰', title: 'Time Entry Management', desc: 'Log hours by type (regular, overtime, PTO, sick, holiday) with manager approval workflows.' },
  { icon: '📄', title: 'Pay Stub Generation', desc: 'Detailed pay stubs with earnings breakdown, tax withholdings, deductions, and employer contributions.' },
  { icon: '🏛️', title: 'Tax Filing Support', desc: 'Generate 941, W-2, and 1099 data with auto-calculated totals from processed pay runs.' },
  { icon: '✅', title: 'Compliance Management', desc: 'Track compliance deadlines, filing requirements, and regulatory obligations with automated reminders.' },
  { icon: '🤖', title: 'AI Cost Forecasting', desc: 'Predict monthly and annual payroll costs based on historical data, headcount, and trends.' },
  { icon: '⚙️', title: 'Overtime Automation', desc: 'Configurable overtime thresholds and rates. Auto-splits regular vs. overtime hours per FLSA rules.' },
  { icon: '💊', title: 'Benefits & Deductions', desc: 'Pre-tax and post-tax deductions for health insurance, 401(k), HSA, garnishments, and more.' },
  { icon: '📈', title: 'Payroll Analytics', desc: 'Dashboard with cost trends, per-employee averages, department breakdowns, and tax summaries.' },
];

const COMPARISON = [
  { feature: 'Automatic tax calculations', echo: true, gusto: true, adp: true, quickbooks: true },
  { feature: 'AI cost forecasting', echo: true, gusto: false, adp: false, quickbooks: false },
  { feature: 'Multi-state payroll', echo: true, gusto: true, adp: true, quickbooks: true },
  { feature: 'Time tracking built-in', echo: true, gusto: true, adp: true, quickbooks: false },
  { feature: 'Overtime auto-calculation', echo: true, gusto: true, adp: true, quickbooks: true },
  { feature: 'Benefits administration', echo: true, gusto: true, adp: true, quickbooks: false },
  { feature: 'Compliance tracking', echo: true, gusto: true, adp: true, quickbooks: false },
  { feature: 'Pay run approval workflow', echo: true, gusto: true, adp: true, quickbooks: false },
  { feature: 'API access', echo: true, gusto: true, adp: true, quickbooks: false },
  { feature: 'CSV/JSON export', echo: true, gusto: true, adp: false, quickbooks: true },
  { feature: 'Multi-tenant / white-label', echo: true, gusto: false, adp: false, quickbooks: false },
  { feature: 'AI payroll analysis', echo: true, gusto: false, adp: false, quickbooks: false },
  { feature: 'No per-payrun fees', echo: true, gusto: false, adp: false, quickbooks: false },
  { feature: 'Starting price', echo: '$19/mo', gusto: '$40/mo', adp: 'Quote', quickbooks: '$45/mo' },
];

const TIERS = [
  { name: 'Starter', price: 19, per_emp: 4, features: ['Up to 25 employees', 'Automatic tax calculations', 'Pay stubs', 'Direct deposit tracking', 'Time entry management', 'Basic analytics', 'Email support'], cta: 'Start Payroll' },
  { name: 'Business', price: 49, per_emp: 6, popular: true, features: ['Unlimited employees', 'Everything in Starter', 'AI cost forecasting', 'Tax filing support (941, W-2)', 'Compliance management', 'Benefits & deductions', 'Overtime automation', 'Approval workflows', 'Priority support'], cta: 'Go Business' },
  { name: 'Enterprise', price: 99, per_emp: 8, features: ['Everything in Business', 'Multi-company payroll', 'Multi-tenant / white-label', 'Custom deduction types', 'Full API access', 'CSV/JSON export', 'AI payroll analysis', 'Dedicated support', 'Custom integrations'], cta: 'Go Enterprise' },
];

const FAQS = [
  { q: 'Does Echo Payroll file taxes for me?', a: 'Echo Payroll calculates all federal and state taxes automatically and generates the data needed for 941, W-2, and 1099 filings. On Business+ plans, we help prepare the filing documents. Actual filing with the IRS is your responsibility or can be handled by your accountant using our export data.' },
  { q: 'Which states are supported?', a: 'All 50 US states plus DC. We handle states with no income tax (TX, FL, etc.) and complex states like CA, NY, and NJ. State tax rates are updated annually.' },
  { q: 'How does overtime calculation work?', a: 'You set the weekly overtime threshold (default 40 hours) and rate (default 1.5x). The system automatically splits regular and overtime hours when time entries exceed the threshold for any pay period.' },
  { q: 'Can I run off-cycle payrolls?', a: 'Yes. Create a pay run with type "bonus", "correction", or "off-cycle" at any time. It calculates taxes the same way and updates YTD totals.' },
  { q: 'Is there a per-payrun fee?', a: 'No. Unlike Gusto and QuickBooks, we charge a flat monthly rate plus per-employee. Run payroll as often as you need — weekly, biweekly, semimonthly, or monthly.' },
  { q: 'Can I migrate from Gusto or ADP?', a: 'Yes. Export your employee data as CSV from your current provider and import it into Echo Payroll. We support all standard payroll fields including YTD balances.' },
];

export default function PayrollPage() {
  const { isDark } = useTheme();
  const check = '✓';
  const cross = '✗';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'Payroll', href: '/payroll' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Login</Link>
          <Link href="/checkout?service=payroll&tier=business" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI-POWERED PAYROLL</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Payroll That<br />
          <span className="gradient-text">Runs Itself.</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Automatic tax calculations for all 50 states. Pay runs in minutes, not hours. AI-powered cost forecasting and compliance tracking. No per-payrun fees.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=payroll&tier=business" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--ept-text-muted)' }}>14-day free trial. No credit card required.</p>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need for Payroll</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Payroll</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Gusto</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>ADP</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>QuickBooks</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.gusto, row.adp, row.quickbooks].map((val, i) => (
                    <td key={i} className="p-3 text-center">
                      {typeof val === 'string' ? (
                        <span className="font-bold" style={{ color: i === 0 ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>{val}</span>
                      ) : val ? (
                        <span style={{ color: '#22c55e' }}>{check}</span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>{cross}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Transparent Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-payrun fees. No hidden charges. Run payroll as often as you need.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div key={tier.name} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: tier.popular ? 2 : 1 }}>
              {tier.popular && <div className="text-xs font-bold mb-3 text-center" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
              <div className="mb-1">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${tier.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>+ ${tier.per_emp}/employee/month</p>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--ept-accent)' }}>{check}</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=payroll&tier=${tier.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: tier.popular ? '#fff' : 'var(--ept-text)' }}>{tier.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Ready to Simplify Payroll?</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Join businesses that save hours every pay period with Echo Payroll.</p>
        <TrialCTA serviceId="echo-payroll" tier="starter" productName="Echo Payroll" />
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <Link href="/" style={{ color: 'var(--ept-text-secondary)' }}>Home</Link>
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/blog" style={{ color: 'var(--ept-text-secondary)' }}>Blog</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-secondary)' }}>Support</Link>
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-secondary)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-secondary)' }}>Terms</Link>
        </div>
        &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
      </footer>
    </div>
  );
}
