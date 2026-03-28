'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import TrialCTA from '@/components/TrialCTA';

/* ==============================================================================
   ECHO FINANCE AI — Personal & Business Finance Intelligence
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-finance-ai.bmcii1976.workers.dev (55 endpoints, 10 D1 tables, v1.0)
   ============================================================================== */

const FEATURES = [
  { title: 'Account Management', desc: 'Bank, brokerage, credit card, crypto wallet, and cash accounts in one unified dashboard. Real-time balance tracking across all institutions.', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
  { title: 'Transaction Tracking', desc: 'Every dollar logged with merchant, category, tags, and notes. Filter by date, account, or category. Auto-detect recurring expenses.', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { title: 'Smart Budgeting', desc: 'Set category budgets with custom alert thresholds. Real-time spend tracking with percentage warnings. Monthly budget vs actual reports.', icon: 'M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z' },
  { title: 'Portfolio & Holdings', desc: 'Track stocks, ETFs, crypto, bonds, and real estate. Unrealized P&L, cost basis, allocation breakdown, and performance metrics.', icon: 'M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941' },
  { title: 'Trade History', desc: 'Full audit trail of every buy, sell, and transfer. Symbol, quantity, price, fees, and execution timestamps for tax reporting.', icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5' },
  { title: 'Market Watchlist', desc: 'Track any stock, crypto, or commodity. Set price alerts for above/below thresholds. Day change percentages at a glance.', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' },
  { title: 'Recurring Bills & Income', desc: 'Track every subscription, loan payment, and income stream. Frequency-based scheduling with due date alerts and upcoming payment views.', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' },
  { title: 'Financial Goals', desc: 'Set savings targets, debt payoff goals, and investment milestones. Track progress with percentage completion and deadline tracking.', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
  { title: 'Net Worth Tracking', desc: 'Aggregate all accounts, holdings, and debts into a single net worth figure. Track growth over time with automated daily snapshots.', icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z' },
  { title: 'Spending Anomaly Detection', desc: 'AI compares your last 30 days to 90-day averages per category. Flags any category with 25%+ deviation — catch subscription creep and impulse spending.', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { title: 'Tax-Loss Harvesting', desc: 'Automatically identifies holdings trading below cost basis. Calculates harvestable losses and estimated tax savings at your bracket.', icon: 'M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { title: 'Financial Health Score', desc: 'Composite 0-100 score grading savings rate, emergency fund, portfolio diversity, budget adherence, and goal progress. Letter grade A-F.', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { title: 'Cash Flow Forecasting', desc: 'Trend-based projection of next month income, expenses, and savings. Detects increasing/decreasing patterns from 3-month rolling data.', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6' },
];

const COMPARISON = [
  { feature: 'Multi-account aggregation', echo: true, mint: true, ynab: 'Manual', quicken: true },
  { feature: 'Portfolio P&L tracking', echo: true, mint: 'Basic', ynab: false, quicken: true },
  { feature: 'Tax-loss harvest detection', echo: true, mint: false, ynab: false, quicken: false },
  { feature: 'AI anomaly detection', echo: true, mint: false, ynab: false, quicken: false },
  { feature: 'Financial health score', echo: true, mint: 'Basic', ynab: false, quicken: false },
  { feature: 'Cash flow forecasting', echo: true, mint: false, ynab: 'Basic', quicken: true },
  { feature: 'Budget vs actual reports', echo: true, mint: true, ynab: true, quicken: true },
  { feature: 'Trade history audit trail', echo: true, mint: false, ynab: false, quicken: true },
  { feature: 'Recurring bill alerts', echo: true, mint: true, ynab: true, quicken: true },
  { feature: 'Financial goal tracking', echo: true, mint: true, ynab: true, quicken: true },
  { feature: 'Net worth dashboard', echo: true, mint: true, ynab: true, quicken: true },
  { feature: 'API access (55 endpoints)', echo: true, mint: false, ynab: 'Limited', quicken: false },
  { feature: 'Engine-backed AI insights', echo: true, mint: false, ynab: false, quicken: false },
  { feature: 'Self-hosted / no data sharing', echo: true, mint: false, ynab: false, quicken: false },
];

const PRICING = [
  {
    name: 'Personal',
    price: '$19',
    period: '/mo',
    desc: 'For individuals managing personal finances',
    features: ['5 accounts', 'Transaction tracking', 'Budget management', 'Net worth dashboard', 'Spending categories', 'Recurring bill alerts'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$49',
    period: '/mo',
    desc: 'Full financial intelligence suite',
    features: ['Unlimited accounts', 'Portfolio & trade tracking', 'Tax-loss harvesting', 'AI anomaly detection', 'Financial health score', 'Cash flow forecasting', 'Watchlist & price alerts', 'Goal tracking', 'API access (55 endpoints)'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/mo',
    desc: 'Multi-entity business finance',
    features: ['Everything in Premium', 'Multi-entity support', 'Custom reporting', 'Engine Runtime integration', 'Dedicated support', 'RBAC & audit logging', 'Custom categories & tags', 'Bulk transaction import', 'Shared Brain analytics'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQS = [
  { q: 'Does Echo Finance AI connect to my bank automatically?', a: 'Currently, transactions are added via API or manual entry. Bank sync via Plaid is on the roadmap. The API-first approach means your data stays on your infrastructure — no third-party data sharing.' },
  { q: 'How does the tax-loss harvesting feature work?', a: 'The system automatically identifies holdings trading below your cost basis, calculates the harvestable loss amount, and estimates tax savings at a 25% bracket. It flags candidates but doesn\'t execute trades — you maintain full control.' },
  { q: 'What makes the financial health score different from Credit Karma?', a: 'Credit Karma focuses on credit score. Our health score evaluates 5 dimensions: savings rate, emergency fund coverage, budget adherence, portfolio diversity, and goal progress — giving a holistic view of financial wellness, not just creditworthiness.' },
  { q: 'Can I track both personal and business finances?', a: 'Yes. Create separate accounts for personal and business. The Enterprise tier supports multi-entity management with separate reporting, budgets, and goals per entity.' },
  { q: 'How does spending anomaly detection work?', a: 'Every 15 minutes, the system compares your last 30 days of spending per category against your 90-day rolling average. Any category with 25%+ deviation is flagged — catching subscription price increases, unusual charges, or spending pattern changes.' },
  { q: 'Is my financial data secure?', a: 'Your data lives in a dedicated Cloudflare D1 database. No bank credentials are stored. All API calls are authenticated. The Worker runs on Cloudflare\'s global edge network with enterprise-grade encryption at rest and in transit.' },
];

export default function FinanceAIPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Finance AI', href: '/finance-ai' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/sdk" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>SDK</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>55 API Endpoints</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>10 D1 Tables</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>13 Modules</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>AI-Powered</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">
          <span className="gradient-text">Finance AI</span> That Thinks<br />Like a CFO
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
          Portfolio tracking, budget management, spending anomaly detection, tax-loss harvesting, net worth dashboards, and financial health scoring — powered by intelligence engines, not spreadsheets.
        </p>
        <div className="flex gap-4 justify-center animate-fade-up-delay-2">
          <Link href="/checkout?service=finance-ai&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/sdk/docs" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>API Docs</Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'API Endpoints', value: '55' },
            { label: 'Core Modules', value: '13' },
            { label: 'D1 Tables', value: '10' },
            { label: 'Monthly Cost', value: '$0.04' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Master Your Money</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(13,115,119,0.1)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `2px solid var(--ept-border)` }}>
                <th className="text-left p-3" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                <th className="text-center p-3 font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Finance AI</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Mint</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>YNAB</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Quicken</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid var(--ept-border)` }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.mint, row.ynab, row.quicken].map((val, j) => (
                    <td key={j} className="text-center p-3">
                      {val === true ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : val === false ? <span style={{ color: 'var(--ept-text-muted)' }}>&#10007;</span> : <span style={{ color: 'var(--ept-text-muted)' }}>{val}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING.map((p) => (
            <div key={p.name} className={`p-8 rounded-2xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {p.popular && <div className="text-xs font-bold mb-4 px-3 py-1 rounded-full inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{p.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=finance-ai&tier=${p.name.toLowerCase()}`} className="block text-center w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-text)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button className="w-full text-left p-5 flex justify-between items-center" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{faq.q}</span>
                <span style={{ color: 'var(--ept-text-muted)' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <div className="px-5 pb-5 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Take Control of Your Financial Future</h2>
        <p className="text-lg mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>55 endpoints. 13 modules. AI that works for your money, not against it.</p>
        <TrialCTA serviceId="echo-finance-ai" tier="starter" productName="Echo Finance AI" />
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-muted)' }}>Support</Link>
        </div>
      </footer>
    </div>
  );
}
