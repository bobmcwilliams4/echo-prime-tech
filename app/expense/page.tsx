'use client';

import FaqSchema from '../../components/FaqSchema';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FEATURES = [
  { icon: '🧾', title: 'Receipt Scanning', desc: 'Snap a photo or upload a PDF — AI extracts vendor, amount, date, tax, and category in seconds. No manual data entry.' },
  { icon: '🚗', title: 'Mileage Tracking', desc: 'Automatic GPS mileage logging with IRS-compliant reports. Set business vs personal trips and calculate reimbursements instantly.' },
  { icon: '✅', title: 'Approval Workflows', desc: 'Multi-level approval chains with configurable thresholds. Managers review, approve, or reject with one click. Escalation rules included.' },
  { icon: '💳', title: 'Corporate Card Management', desc: 'Issue virtual and physical cards with per-employee spending limits. Real-time transaction feeds auto-match to expense reports.' },
  { icon: '📋', title: 'Policy Enforcement', desc: 'Define spending policies by category, amount, and role. Out-of-policy expenses are flagged before submission, not after.' },
  { icon: '🤖', title: 'AI Categorization', desc: 'Machine learning assigns GL codes and categories based on vendor, amount patterns, and past behavior. Accuracy improves over time.' },
  { icon: '🌍', title: 'Multi-Currency Support', desc: 'Submit expenses in any currency. Auto-conversion at daily exchange rates with configurable rate sources and gain/loss tracking.' },
  { icon: '🍽️', title: 'Per Diem Management', desc: 'GSA and custom per diem rates by location. Auto-calculate meal and lodging allowances for travel expense reports.' },
  { icon: '📊', title: 'Audit Trail & Compliance', desc: 'Every action logged with timestamp, user, and IP. SOX-ready audit reports. Duplicate detection prevents double submissions.' },
  { icon: '🔗', title: 'Accounting Integrations', desc: 'Sync approved expenses to QuickBooks, Xero, NetSuite, and Sage. Two-way sync keeps your books accurate without manual exports.' },
  { icon: '📱', title: 'Mobile App', desc: 'Full expense management from your phone. Capture receipts on the go, approve requests from anywhere, track spending in real time.' },
  { icon: '📈', title: 'Spend Analytics', desc: 'Dashboards showing spend by category, department, vendor, and employee. Identify savings opportunities and budget overruns instantly.' },
];

const COMPARISON = [
  { feature: 'Receipt Scanning (AI)', echo: true, expensify: true, concur: true, ramp: true },
  { feature: 'Mileage Tracking', echo: true, expensify: true, concur: true, ramp: false },
  { feature: 'Approval Workflows', echo: true, expensify: true, concur: true, ramp: true },
  { feature: 'Corporate Cards', echo: true, expensify: true, concur: false, ramp: true },
  { feature: 'Policy Enforcement', echo: true, expensify: true, concur: true, ramp: true },
  { feature: 'AI Categorization', echo: true, expensify: false, concur: false, ramp: true },
  { feature: 'Multi-Currency', echo: true, expensify: true, concur: true, ramp: true },
  { feature: 'Per Diem Management', echo: true, expensify: false, concur: true, ramp: false },
  { feature: 'Duplicate Detection', echo: true, expensify: true, concur: true, ramp: false },
  { feature: 'Spend Analytics', echo: true, expensify: true, concur: true, ramp: true },
  { feature: 'SOX Audit Trail', echo: true, expensify: false, concur: true, ramp: false },
  { feature: 'Starting Price', echo: '$4/user', expensify: '$5/user', concur: 'Custom', ramp: 'Free*' },
];

const TIERS = [
  { name: 'Starter', price: '$4', period: '/user/mo', desc: 'For small teams tracking everyday expenses.', features: ['Up to 25 users', 'Receipt scanning (AI)', 'Mileage tracking', 'Basic approval workflows', 'Expense reports', 'CSV export', 'Mobile app', 'Email support'] },
  { name: 'Growth', price: '$9', period: '/user/mo', desc: 'For growing teams with corporate cards and policies.', features: ['Unlimited users', 'Corporate card management', 'Policy enforcement', 'AI categorization', 'Multi-currency', 'Per diem management', 'Accounting integrations', 'Spend analytics', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$18', period: '/user/mo', desc: 'For organizations requiring full compliance and control.', features: ['Everything in Growth', 'SOX-ready audit trail', 'Duplicate detection', 'Custom approval chains', 'Advanced analytics', 'API access', 'SSO integration', 'Dedicated account manager'] },
];

const FAQS = [
  { q: 'How does receipt scanning work?', a: 'Take a photo with your phone or upload a PDF/image. Our AI extracts the vendor name, total amount, date, tax, and suggests a category — all in under 3 seconds. It works with receipts in over 40 languages and handles crumpled, faded, or partial receipts.' },
  { q: 'Can I issue corporate cards to employees?', a: 'Yes, on Growth and Enterprise plans. Issue virtual cards instantly or request physical cards. Set per-card spending limits, merchant category restrictions, and auto-lock cards when employees leave. All transactions auto-populate into expense reports.' },
  { q: 'How does policy enforcement work?', a: 'Define rules like "meals cannot exceed $75" or "flights require manager approval over $500." When an employee submits an out-of-policy expense, it\'s flagged immediately with the specific policy violated. Managers see policy violations highlighted in the approval queue.' },
  { q: 'What accounting software do you integrate with?', a: 'We integrate with QuickBooks Online, QuickBooks Desktop, Xero, NetSuite, Sage Intacct, and FreshBooks. Approved expenses sync automatically with correct GL codes, departments, and tax amounts. Two-way sync ensures your books stay accurate.' },
  { q: 'How does this compare to Expensify?', a: 'Expensify starts at $5/user and focuses on receipt scanning and basic expense management. Echo Expense includes AI categorization, per diem management, and SOX-ready audit trails at a lower price. Expensify charges extra for corporate cards and advanced policy features that are included in our Growth plan.' },
  { q: 'Is mileage tracking IRS-compliant?', a: 'Yes. Our GPS-based mileage tracker logs start point, end point, distance, date, and business purpose — all required by the IRS. You can classify trips as business or personal and generate year-end mileage reports for tax deductions. We use the current IRS standard mileage rate automatically.' },
];

export default function ExpensePage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'Expense Management', href: '/expense' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=expense&tier=growth" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>AI-Powered Expense Management</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Track Expenses,<br /><span className="gradient-text">Not Receipts</span></h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Receipt scanning, mileage tracking, corporate cards, and policy enforcement — all powered by AI that categorizes, flags, and syncs your expenses automatically.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=expense&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
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
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Full-featured expense management with AI, at a fraction of the cost.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th><th className="py-3 px-4 font-semibold">Expensify</th><th className="py-3 px-4 font-semibold">Concur</th><th className="py-3 px-4 font-semibold">Ramp</th></tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.expensify === 'boolean' ? (row.expensify ? '✅' : '❌') : row.expensify}</td>
                  <td className="py-3 px-4 text-center">{typeof row.concur === 'boolean' ? (row.concur ? '✅' : '❌') : row.concur}</td>
                  <td className="py-3 px-4 text-center">{typeof row.ramp === 'boolean' ? (row.ramp ? '✅' : '❌') : row.ramp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Per-User Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No contracts. No setup fees. Scale as your team grows.</p>
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
        <h2 className="text-3xl font-bold mb-4">Ready to Eliminate Expense Report Headaches?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Join teams saving hours every month with AI-powered expense tracking and policy enforcement.</p>
        <Link href="/checkout?service=expense&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </div>
  );
}
