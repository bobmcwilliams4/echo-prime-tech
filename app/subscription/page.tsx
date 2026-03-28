'use client';

import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { icon: '💳', title: 'Subscription Plans', desc: 'Create monthly, yearly, weekly, or custom interval plans with trial periods, setup fees, and feature lists. Public or private plans.' },
  { icon: '📊', title: 'Usage Metering', desc: 'Track usage-based billing with included units and overage pricing. Automatic overage calculations per billing period.' },
  { icon: '🔄', title: 'Auto-Renewals', desc: 'Automated renewal at period end with invoice generation, tax calculation, and payment processing. Zero manual work.' },
  { icon: '⬆️', title: 'Upgrade / Downgrade', desc: 'Plan changes with automatic proration. Credits and charges calculated to the day — fair billing for every change.' },
  { icon: '⏸️', title: 'Pause & Resume', desc: 'Customers can pause subscriptions with optional auto-resume dates. Retain subscribers instead of losing them to cancellation.' },
  { icon: '🔔', title: 'Smart Dunning', desc: 'Configurable retry logic for failed payments. Automatic dunning emails with customizable attempts, intervals, and grace periods.' },
  { icon: '🎟️', title: 'Coupons & Discounts', desc: 'Percentage or fixed-amount coupons with expiration, max redemptions, duration control, and plan-specific targeting.' },
  { icon: '🤖', title: 'AI Churn Prediction', desc: 'AI analyzes subscriber behavior to predict churn risk. Get proactive alerts and retention recommendations before customers cancel.' },
  { icon: '📈', title: 'Revenue Analytics', desc: 'Daily MRR, ARR, new vs churned MRR, expansion revenue, trial conversions, and payment success rates — all in one dashboard.' },
  { icon: '🔮', title: 'AI Revenue Forecast', desc: 'AI projects future revenue based on growth trends, churn patterns, and seasonality. Plan hiring and spending with confidence.' },
  { icon: '🧩', title: 'Add-ons & Extras', desc: 'Attach add-on products to subscriptions with flat or per-unit pricing. Perfect for feature tiers and metered services.' },
  { icon: '🔗', title: 'Webhook Events', desc: 'Real-time webhook notifications for subscription events — created, renewed, canceled, payment failed, dunning, and more.' },
];

const COMPARISON = [
  { feature: 'Subscription Plans', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Usage Metering', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Trial Periods', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Proration on Changes', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Pause & Resume', echo: true, stripe: false, chargebee: true, recurly: true },
  { feature: 'Smart Dunning', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Coupons & Discounts', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'AI Churn Prediction', echo: true, stripe: false, chargebee: false, recurly: false },
  { feature: 'AI Revenue Forecast', echo: true, stripe: false, chargebee: false, recurly: false },
  { feature: 'Revenue Analytics', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Webhook Events', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Add-ons', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Multi-Currency', echo: true, stripe: true, chargebee: true, recurly: true },
  { feature: 'Starting Price', echo: '$29/mo', stripe: '0.5% + 25¢', chargebee: '$249/mo', recurly: '$249/mo' },
];

const TIERS = [
  { name: 'Starter', price: '$29', period: '/mo', desc: 'For startups launching their first subscription product.', features: ['Up to 100 subscribers', 'Unlimited plans', 'Auto-renewals', 'Invoice generation', 'Coupons', 'Basic analytics', 'Webhook events', 'CSV export', 'Email support'] },
  { name: 'Growth', price: '$79', period: '/mo', desc: 'For growing SaaS with metering and AI insights.', features: ['Up to 5,000 subscribers', 'Usage metering', 'Smart dunning', 'Add-ons', 'Proration', 'Pause & resume', 'AI churn prediction', 'AI revenue forecast', 'Revenue dashboard', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$199', period: '/mo', desc: 'For scale-ups with complex billing needs.', features: ['Unlimited subscribers', 'Everything in Growth', 'Multi-currency', 'Custom webhooks', 'API access', 'Audit trail', 'Dedicated account manager', 'SLA guarantee'] },
];

const FAQS = [
  { q: 'What is subscription billing?', a: 'Subscription billing automates recurring charges for SaaS products, memberships, and services. Instead of manually invoicing customers each month, the system automatically generates invoices, processes payments, handles failed payments (dunning), and manages plan changes — all without human intervention.' },
  { q: 'How does usage metering work?', a: 'Usage metering tracks consumption of a resource (API calls, storage, seats, etc.) against included allowances. When usage exceeds the included units, overage charges are automatically calculated at your configured per-unit price and added to the next invoice.' },
  { q: 'How does proration work for plan changes?', a: 'When a customer upgrades or downgrades mid-cycle, we calculate the unused value of their current plan and the remaining value of the new plan. The difference is either charged immediately (upgrade) or applied as a credit (downgrade). Fair billing to the day.' },
  { q: 'What does AI churn prediction do?', a: 'Our AI analyzes subscriber behavior patterns — payment history, usage trends, support interactions, engagement signals — to identify customers likely to cancel. You get risk scores and specific retention recommendations before the customer even thinks about leaving.' },
  { q: 'How does this compare to Stripe Billing?', a: 'Stripe Billing charges 0.5% of billing volume plus per-invoice fees, which adds up fast at scale. Echo Subscription is flat-rate pricing ($29-$199/mo) with AI features Stripe does not offer — churn prediction and revenue forecasting. Best fit if you want predictable costs and AI insights.' },
  { q: 'Can I migrate from Chargebee or Recurly?', a: 'Yes. Export your subscription data as CSV and import via our API. We support bulk customer, plan, and subscription creation. Our team can help with complex migrations involving usage data and custom billing rules.' },
];

export default function SubscriptionPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Subscription — AI-Powered Subscription Billing for SaaS</h1><p>Complete subscription billing platform with AI churn prediction and revenue forecasting. Features include monthly, yearly, and custom interval subscription plans with trial periods. Usage-based metering with included units and overage pricing. Automated renewals with invoice generation and tax calculation. Upgrade and downgrade handling with automatic proration to the day. Pause and resume subscriptions with optional auto-resume dates. Smart dunning with configurable retry logic for failed payments. Percentage and fixed-amount coupons with expiration and targeting. AI churn prediction analyzing subscriber behavior patterns. Revenue analytics with daily MRR, ARR, and trial conversion tracking. AI revenue forecasting based on growth trends and seasonality. Add-on products with flat or per-unit pricing. Real-time webhook events for all subscription lifecycle changes. Flat-rate pricing from $29/mo compared to 0.5% plus per-invoice fees at Stripe Billing.</p></div></noscript>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Subscription Management', href: '/subscription' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=subscription&tier=growth" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>AI-Powered Revenue Platform</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Billing That<br /><span className="gradient-text">Grows With You</span></h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Subscription plans, usage metering, smart dunning, proration, and AI-powered churn prediction — everything your SaaS needs to maximize recurring revenue.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=subscription&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Bill Subscribers</h2>
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
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered billing with flat-rate pricing. No percentage fees.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th><th className="py-3 px-4 font-semibold">Stripe Billing</th><th className="py-3 px-4 font-semibold">Chargebee</th><th className="py-3 px-4 font-semibold">Recurly</th></tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.stripe === 'boolean' ? (row.stripe ? '✅' : '❌') : row.stripe}</td>
                  <td className="py-3 px-4 text-center">{typeof row.chargebee === 'boolean' ? (row.chargebee ? '✅' : '❌') : row.chargebee}</td>
                  <td className="py-3 px-4 text-center">{typeof row.recurly === 'boolean' ? (row.recurly ? '✅' : '❌') : row.recurly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Flat-Rate Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No percentage fees. No per-invoice charges. Just predictable monthly pricing.</p>
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
              <Link href={`/checkout?service=subscription&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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
        <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Billing?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Join SaaS teams using AI-powered subscription billing to maximize revenue and reduce churn.</p>
        <Link href="/checkout?service=subscription&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </div>
  );
}
