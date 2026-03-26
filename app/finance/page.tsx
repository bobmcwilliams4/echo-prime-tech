'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Multi-Account Tracking', desc: 'Track checking, savings, credit, and investment accounts with real-time balances. Connect all your financial accounts in one dashboard.' },
  { title: 'Smart Transactions', desc: 'Log income and expenses with categories, payees, dates, and tags. Filter by account, category, type, and date range with instant search.' },
  { title: 'AI Auto-Categorization', desc: 'AI analyzes transaction descriptions and payees to automatically categorize spending into 15+ categories. No manual tagging needed.' },
  { title: 'Budget Tracking', desc: 'Set monthly budgets by category with real-time spending tracking. See percent used, remaining balance, and get alerts at custom thresholds (default 80%).' },
  { title: 'Financial Goals', desc: 'Set savings targets with deadlines. Track progress toward emergency fund, vacation, home down payment, or any financial goal with visual progress bars.' },
  { title: 'Recurring Payments', desc: 'Track subscriptions and recurring bills with auto-processing. Weekly, biweekly, monthly, quarterly, or yearly frequencies with automatic account deductions.' },
  { title: 'AI Spending Insights', desc: 'AI analyzes your 30-day spending patterns and provides actionable tips. Identifies savings opportunities, spending anomalies, and budget alerts.' },
  { title: 'Financial Reports', desc: 'Summary reports with income vs expenses, net savings, and savings rate. Category breakdowns and monthly trend analysis up to 12 months.' },
  { title: 'Dashboard Overview', desc: 'One-screen view of total balance, all accounts, recent transactions, upcoming recurring payments, and active financial goals with progress.' },
  { title: 'Transaction Search', desc: 'Full-text search across descriptions, payees, and categories. Filter by date range, account, type (income/expense), and tags for instant lookups.' },
  { title: 'Monthly Trends', desc: 'Track income and expense trends over time with monthly aggregation. Spot patterns, seasonal changes, and long-term financial trajectory.' },
  { title: 'Multi-Tenant SaaS', desc: 'Built for businesses and families. Each tenant gets isolated data with full API access. Perfect for financial advisors managing multiple clients.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', mint: 'Free (ads)', ynab: '$14.99/mo', echo: '$12/mo' },
  { feature: 'AI Categorization', mint: 'Basic', ynab: 'Rules', echo: 'AI (Engine Runtime)' },
  { feature: 'AI Insights', mint: 'No', ynab: 'No', echo: 'Yes (30-day analysis)' },
  { feature: 'Budgets', mint: 'Yes', ynab: 'Yes (envelope)', echo: 'Yes (category)' },
  { feature: 'Goals', mint: 'Yes', ynab: 'Yes', echo: 'Yes (with progress)' },
  { feature: 'Recurring Tracking', mint: 'Yes', ynab: 'Scheduled', echo: 'Auto-process (cron)' },
  { feature: 'Reports', mint: 'Basic', ynab: 'Good', echo: 'Summary + Trends' },
  { feature: 'API Access', mint: 'No', ynab: 'No', echo: 'Full REST API' },
  { feature: 'Multi-Tenant', mint: 'No', ynab: 'No', echo: 'Yes' },
  { feature: 'Self-Hostable', mint: 'No', ynab: 'No', echo: 'Cloudflare' },
  { feature: 'Ads / Data Selling', mint: 'Yes', ynab: 'No', echo: 'No' },
];

const PRICING = [
  { name: 'Personal', price: '$12', period: '/mo', features: ['3 accounts', 'Unlimited transactions', 'Budget tracking', 'Financial goals', 'Recurring payments', 'Basic reports', 'Dashboard'] },
  { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited accounts', 'Unlimited transactions', 'AI auto-categorization', 'AI spending insights', 'Monthly trend reports', 'Category breakdowns', 'Goal tracking', 'API access'] },
  { name: 'Business', price: '$79', period: '/mo', features: ['Unlimited everything', 'Multi-user access', 'Advanced analytics', 'Custom categories', 'Export data (CSV/JSON)', 'Priority support', 'Webhook integrations', 'Audit log'] },
];

const FAQS = [
  { q: 'How does AI auto-categorization work?', a: 'When you add a transaction, our AI analyzes the description and payee against 15+ spending categories (housing, utilities, food, transport, health, entertainment, etc.). It uses the Engine Runtime with trained financial models to classify with high accuracy — no manual tagging needed.' },
  { q: 'What types of accounts can I track?', a: 'Checking, savings, credit cards, investment, cash, and custom account types. Each account tracks its own balance, currency, and institution. Transactions automatically update account balances in real-time.' },
  { q: 'How do recurring payments work?', a: 'Add recurring bills and subscriptions with their frequency (weekly, biweekly, monthly, quarterly, yearly). Our daily cron job automatically creates transactions and deducts from the linked account when payments are due. Next payment date advances automatically.' },
  { q: 'What insights does the AI provide?', a: 'The AI analyzes your last 30 days of spending by category and type. It provides 3-5 actionable insights: warnings about overspending categories, tips for saving money, alerts about unusual activity, and positive reinforcement for good financial habits.' },
  { q: 'Can I export my financial data?', a: 'Business plan users can export transactions, reports, and budgets in CSV or JSON format via the API. All data is yours — we never sell or monetize your financial information.' },
  { q: 'Is my financial data secure?', a: 'All data is stored in Cloudflare D1 with encrypted connections. Write operations require API key authentication. We never store bank credentials — transactions are manually entered or imported via API. No ads, no data selling, ever.' },
];

export default function FinancePage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Finance', href: '/finance' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>PERSONAL FINANCE AI</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Your Money, Managed by<br /><span className="gradient-text">Artificial Intelligence</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Track accounts, auto-categorize spending, set budgets, crush financial goals, and get AI-powered insights. The Mint replacement that actually works.</p>
        <div className="flex justify-center gap-4">
          <Link href="/checkout?service=finance&tier=personal" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial — $12/mo</Link>
          <Link href="/engines" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See AI Engines</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Complete Financial Intelligence</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Echo Finance vs Mint vs YNAB</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}><th className="p-3 text-left font-bold">Feature</th><th className="p-3 text-center font-bold">Mint</th><th className="p-3 text-center font-bold">YNAB</th><th className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>Echo</th></tr></thead>
            <tbody>{COMPARISON.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                <td className="p-3 font-medium">{r.feature}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.mint}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.ynab}</td><td className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Simple, Honest Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: i === 1 ? 2 : 1 }}>
              {i === 1 && <div className="text-xs font-bold mb-2" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <div className="my-4"><span className="text-4xl font-extrabold">{p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-6 flex-1">{p.features.map((f, j) => <li key={j} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=finance&tier=${p.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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
