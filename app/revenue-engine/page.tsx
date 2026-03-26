'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'How does AI pricing optimization work?', answer: 'Machine learning analyzes customer behavior, competitor pricing, demand patterns, and elasticity curves to recommend optimal prices for every product/service. Prices update dynamically based on real-time signals.' },
  { question: 'What data does churn prediction use?', answer: 'Usage frequency, support tickets, payment patterns, feature adoption, login recency, NPS scores, and engagement metrics. The model identifies at-risk customers 30-60 days before they churn.' },
  { question: 'Can it integrate with my billing system?', answer: 'Yes. Direct integrations with Stripe, PayPal, Chargebee, and Paddle. Webhook-based integration for any billing system. Import historical revenue data via CSV or API.' },
  { question: 'How accurate are revenue forecasts?', answer: 'Typically within 5-10% accuracy for 90-day forecasts, improving with more historical data. The model accounts for seasonality, growth trends, churn rates, and expansion revenue.' },
]

const features = [
  { title: 'Dynamic Pricing', desc: 'AI adjusts prices based on demand, competition, customer segment, and willingness-to-pay. A/B test pricing strategies with statistical significance.' },
  { title: 'Churn Prediction', desc: 'ML models identify at-risk customers 30-60 days before cancellation. Trigger automated retention campaigns at the right moment.' },
  { title: 'Upsell Automation', desc: 'AI identifies expansion opportunities based on usage patterns and recommends the right upgrade at the right time for each customer.' },
  { title: 'LTV Forecasting', desc: 'Predict customer lifetime value at signup and over time. Allocate acquisition spend based on predicted cohort value.' },
  { title: 'Revenue Forecasting', desc: '90-day revenue projections with confidence intervals. Factor in seasonality, growth, churn, and expansion revenue.' },
  { title: 'Cohort Analysis', desc: 'Track revenue metrics by signup date, plan, source, geography, and custom segments. Identify your most valuable acquisition channels.' },
  { title: 'Payment Recovery', desc: 'AI-optimized dunning sequences for failed payments. Smart retry timing and personalized recovery emails recover 15-30% of failed charges.' },
  { title: 'Discount Intelligence', desc: 'Model the revenue impact of discounts before offering them. Optimize coupon values to maximize conversion without destroying margins.' },
  { title: 'Competitor Monitoring', desc: 'Track competitor pricing changes and market positioning. Alert when competitors adjust prices so you can respond strategically.' },
  { title: 'Revenue Attribution', desc: 'Multi-touch attribution connects marketing spend to actual revenue. Know which campaigns drive real money, not just clicks.' },
  { title: 'Expansion Signals', desc: 'Detect account expansion signals — increased usage, new user invites, API call growth — and route to sales or automation.' },
  { title: 'Real-Time Dashboard', desc: 'MRR, ARR, churn rate, ARPU, LTV, CAC, and 20+ revenue metrics updated in real-time with trend analysis.' },
]

const comparison = [
  { feature: 'Dynamic pricing', echo: 'AI-optimized', profitwell: 'No', baremetrics: 'No', chartmogul: 'No' },
  { feature: 'Churn prediction', echo: '30-60 day ML', profitwell: 'Basic', baremetrics: 'Alerts only', chartmogul: 'No' },
  { feature: 'Upsell automation', echo: 'AI-triggered', profitwell: 'No', baremetrics: 'No', chartmogul: 'No' },
  { feature: 'LTV forecasting', echo: 'ML per-customer', profitwell: 'Cohort avg', baremetrics: 'Cohort avg', chartmogul: 'Cohort avg' },
  { feature: 'Payment recovery', echo: 'AI dunning', profitwell: 'Retain product', baremetrics: 'Recover add-on', chartmogul: 'No' },
  { feature: 'Revenue forecast', echo: '90-day + CI', profitwell: 'Basic', baremetrics: 'Yes', chartmogul: 'Yes' },
  { feature: 'Discount modeling', echo: 'Impact simulation', profitwell: 'No', baremetrics: 'No', chartmogul: 'No' },
  { feature: 'Competitor pricing', echo: 'AI monitoring', profitwell: 'No', baremetrics: 'No', chartmogul: 'No' },
  { feature: 'Revenue attribution', echo: 'Multi-touch', profitwell: 'No', baremetrics: 'No', chartmogul: 'Limited' },
  { feature: 'Billing integrations', echo: 'Stripe/PayPal/4+', profitwell: 'Stripe/Chargebee', baremetrics: 'Stripe/Braintree', chartmogul: 'All major' },
  { feature: 'Starting price', echo: '$49/mo', profitwell: 'Free (basic)', baremetrics: '$108/mo', chartmogul: '$100/mo' },
]

export default function RevenueEnginePage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#10b981'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Revenue Engine', href: '/revenue-engine' }]} />
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Revenue Engine</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>AI-powered revenue optimization. Dynamic pricing, churn prediction, upsell automation, and LTV forecasting — maximize every dollar from every customer.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=revenue-engine&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Maximize Revenue With AI</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>ProfitWell</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Baremetrics</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>ChartMogul</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.profitwell}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.baremetrics}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.chartmogul}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$49', period: '/mo', features: ['Up to $50K MRR', 'Revenue dashboard', 'Churn alerts', 'Basic forecasting', 'Stripe integration', 'Email support'], cta: 'starter' },
              { tier: 'Growth', price: '$149', period: '/mo', features: ['Up to $500K MRR', 'Dynamic pricing', 'Churn prediction ML', 'Upsell automation', 'LTV forecasting', 'Payment recovery', 'All integrations', 'Priority support'], cta: 'growth', popular: true },
              { tier: 'Enterprise', price: '$399', period: '/mo', features: ['Unlimited MRR', 'All AI features', 'Competitor monitoring', 'Discount modeling', 'Revenue attribution', 'Custom models', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=revenue-engine&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.question} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.question}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.answer}</p></details>))}
        </section>
      </div>
    </>
  )
}
