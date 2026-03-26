'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  {
    q: 'How does AI-powered A/B testing work?',
    a: 'Define your variants and goals. The platform automatically splits traffic, collects data, and uses Bayesian statistics to determine winners faster than traditional frequentist methods. AI suggests optimizations based on patterns across all your experiments.',
  },
  {
    q: 'What can I test?',
    a: 'Headlines, CTAs, pricing pages, landing pages, email subjects, checkout flows, onboarding sequences — anything with a measurable conversion event. The platform supports split tests, multivariate tests, and bandit algorithms.',
  },
  {
    q: 'How quickly do I get results?',
    a: 'Bayesian analysis produces actionable confidence intervals from day one — no waiting for arbitrary sample sizes. Most experiments reach 95% confidence 3-5x faster than traditional tools.',
  },
  {
    q: 'Does it integrate with my website?',
    a: 'Drop in a single JavaScript snippet or use the REST API. Works with any website, app, or API. Server-side and client-side testing both supported.',
  },
  {
    q: 'Can I run tests across the Echo ecosystem?',
    a: 'Yes. Service bindings to Shared Brain and Swarm Brain enable cross-product experimentation — test changes across your entire Echo stack from one dashboard.',
  },
]

const features = [
  { title: 'Split Testing', desc: 'A/B and A/B/n tests with automatic traffic allocation. Test up to 10 variants simultaneously with clean statistical isolation.' },
  { title: 'Multivariate Testing', desc: 'Test multiple elements at once. The platform computes interaction effects to find the winning combination, not just individual winners.' },
  { title: 'Bayesian Statistics', desc: 'Get probability-to-win confidence from day one. No minimum sample sizes. Actionable results 3-5x faster than frequentist methods.' },
  { title: 'AI Optimization', desc: 'AI analyzes patterns across all experiments and suggests new tests likely to produce the biggest conversion lifts.' },
  { title: 'Revenue Tracking', desc: 'Track revenue per variant, not just clicks. Know exactly how much money each experiment generates or costs.' },
  { title: 'Audience Segmentation', desc: 'Target experiments by device, location, referrer, user property, or custom segments. Personalize at scale.' },
  { title: 'Visual Editor', desc: 'Change headlines, images, CTAs, and layouts without writing code. WYSIWYG editor with live preview.' },
  { title: 'Server-Side Testing', desc: 'REST API for server-side tests — pricing algorithms, recommendation engines, API responses. No flicker, no latency.' },
  { title: 'Feature Flags', desc: 'Gradual rollouts with percentage-based targeting. Ship features safely and roll back instantly if metrics drop.' },
  { title: 'Experiment Calendar', desc: 'Schedule experiments in advance. Avoid collisions with a visual calendar showing all active and planned tests.' },
  { title: 'Goal Tracking', desc: 'Define conversion goals — purchases, signups, pageviews, custom events. Track primary and secondary metrics per experiment.' },
  { title: 'Export & Reports', desc: 'Export experiment results as CSV or JSON. Generate shareable reports with confidence intervals and revenue impact.' },
]

const comparison = [
  { feature: 'Bayesian statistics', echo: 'Built-in', optimizely: 'Stats Engine', vwo: 'SmartStats', google: 'Frequentist' },
  { feature: 'AI suggestions', echo: 'Pattern analysis', optimizely: 'Limited', vwo: 'No', google: 'No' },
  { feature: 'Multivariate tests', echo: 'Full factorial', optimizely: 'Enterprise only', vwo: 'Yes', google: 'Yes' },
  { feature: 'Server-side testing', echo: 'REST API', optimizely: 'Full Stack', vwo: 'Add-on', google: 'No' },
  { feature: 'Revenue tracking', echo: 'Per-variant P&L', optimizely: 'Yes', vwo: 'Yes', google: 'Limited' },
  { feature: 'Audience segments', echo: 'Unlimited custom', optimizely: 'Yes', vwo: 'Yes', google: 'Basic' },
  { feature: 'Visual editor', echo: 'Yes', optimizely: 'Yes', vwo: 'Yes', google: 'Yes' },
  { feature: 'Feature flags', echo: 'Integrated', optimizely: 'Separate product', vwo: 'Add-on', google: 'No' },
  { feature: 'Edge performance', echo: 'Cloudflare Workers', optimizely: 'CDN', vwo: 'Cloud', google: 'Slow' },
  { feature: 'Cross-product testing', echo: 'Shared Brain', optimizely: 'No', vwo: 'No', google: 'No' },
  { feature: 'Setup time', echo: '< 5 minutes', optimizely: 'Weeks', vwo: 'Hours', google: 'Hours' },
  { feature: 'Starting price', echo: '$29/mo', optimizely: '$50K+/yr', vwo: '$199/mo', google: 'Free (limited)' },
]

export default function AbTestingPage() {
  const { isDark } = useTheme()
  const dark = isDark

  return (
    <>
      <FaqSchema faqs={faqs} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>

        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Echo A/B Testing
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>
            Stop guessing, start testing. Bayesian A/B testing with AI-powered optimization,
            revenue tracking, and results 3-5x faster than traditional tools.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=ab-testing&tier=starter" style={{ padding: '14px 32px', background: '#8b5cf6', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              Start Free Trial
            </a>
            <a href="#pricing" style={{ padding: '14px 32px', border: '2px solid #8b5cf6', color: '#8b5cf6', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              View Pricing
            </a>
          </div>
        </section>

        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Experiment Smarter, Convert More</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#8b5cf6' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: '#8b5cf6', fontWeight: 800 }}>Echo</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Optimizely</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>VWO</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Google Optimize</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#8b5cf6', fontWeight: 700 }}>{row.echo}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.optimizely}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.vwo}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.google}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['5 active experiments', '10K visitors/mo', 'A/B split tests', 'Bayesian statistics', 'Goal tracking', 'Email support'], cta: 'starter' },
              { tier: 'Growth', price: '$99', period: '/mo', features: ['25 active experiments', '100K visitors/mo', 'Multivariate tests', 'AI suggestions', 'Revenue tracking', 'Audience segments', 'Visual editor', 'Priority support'], cta: 'growth', popular: true },
              { tier: 'Enterprise', price: '$299', period: '/mo', features: ['Unlimited experiments', 'Unlimited visitors', 'Server-side testing', 'Feature flags', 'Cross-product tests', 'Experiment calendar', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? '2px solid #8b5cf6' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#8b5cf6', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span>
                  <span style={{ opacity: 0.6 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#8b5cf6', fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={`/checkout?service=ab-testing&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? '#8b5cf6' : 'transparent', color: plan.popular ? '#fff' : '#8b5cf6', border: plan.popular ? 'none' : '2px solid #8b5cf6', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (
            <details key={faq.q} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.q}</summary>
              <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.a}</p>
            </details>
          ))}
        </section>
      </div>
    </>
  )
}
