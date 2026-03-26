'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { q: 'What are prompt enhancement techniques?', a: '20 techniques including chain-of-thought, few-shot injection, role assignment, structured output, constraint framing, and more. Each technique is applied automatically based on your task type.' },
  { q: 'How does prompt versioning work?', a: 'Every prompt change is versioned with full diff history. Compare performance across versions, roll back to any point, and branch for A/B testing.' },
  { q: 'Can I share prompts with my team?', a: 'Yes. Create shared workspaces with role-based access. Publish prompts to the internal marketplace or keep them private to your organization.' },
  { q: 'Does it work with any LLM?', a: 'Absolutely. Prompts are provider-agnostic. Optimize for Claude, GPT-4, Gemini, Llama, or any model. The platform tracks which prompts perform best on which models.' },
]

const features = [
  { title: '20 Enhancement Techniques', desc: 'Chain-of-thought, few-shot, role assignment, structured output, constraint framing, and 15 more — applied automatically.' },
  { title: '14 Task Type Detection', desc: 'Auto-detects task type (code, analysis, creative, research, etc.) and applies the optimal enhancement strategy.' },
  { title: 'Semantic Search', desc: 'Vectorize-powered semantic search finds the perfect prompt for any task. Search by meaning, not just keywords.' },
  { title: 'Version Control', desc: 'Full version history with diffs, rollbacks, and branching. Track prompt evolution over time.' },
  { title: 'A/B Testing', desc: 'Split-test prompt variants against each other. Statistical analysis determines the winner automatically.' },
  { title: 'Prompt Marketplace', desc: 'Share and discover prompts across your organization or the public marketplace. Rate, fork, and improve.' },
  { title: '7-Dimension Selection', desc: 'Select prompts based on quality, speed, cost, creativity, accuracy, consistency, and user satisfaction scores.' },
  { title: 'Model Performance', desc: 'Track which prompts work best on which models. Auto-recommend optimal model-prompt combinations.' },
  { title: 'Template Library', desc: '194+ sovereign templates pre-loaded. Start from proven patterns for any domain or task type.' },
  { title: 'API Integration', desc: 'REST API to fetch and apply prompts programmatically. Integrate prompt management into your AI pipeline.' },
  { title: 'Analytics Dashboard', desc: 'Usage metrics, performance scores, cost tracking, and optimization recommendations for every prompt.' },
  { title: 'Team Workspaces', desc: 'Shared prompt libraries with role-based access control. Collaborate on prompt engineering across your organization.' },
]

const comparison = [
  { feature: 'Enhancement techniques', echo: '20 automatic', promptbase: 'None', flowgpt: 'None', langsmith: 'Manual' },
  { feature: 'Task detection', echo: '14 types', promptbase: 'No', flowgpt: 'Categories', langsmith: 'No' },
  { feature: 'Semantic search', echo: 'Vectorize-powered', promptbase: 'Keyword', flowgpt: 'Keyword', langsmith: 'Keyword' },
  { feature: 'Version control', echo: 'Full + branching', promptbase: 'No', flowgpt: 'No', langsmith: 'Yes' },
  { feature: 'A/B testing', echo: 'Built-in stats', promptbase: 'No', flowgpt: 'No', langsmith: 'Yes' },
  { feature: 'Marketplace', echo: '194+ templates', promptbase: 'Community', flowgpt: 'Community', langsmith: 'Hub' },
  { feature: 'Multi-model tracking', echo: '7 dimensions', promptbase: 'No', flowgpt: 'No', langsmith: 'Yes' },
  { feature: 'API access', echo: 'Full REST', promptbase: 'No', flowgpt: 'No', langsmith: 'Yes' },
  { feature: 'Team workspaces', echo: 'RBAC', promptbase: 'No', flowgpt: 'No', langsmith: 'Yes' },
  { feature: 'Starting price', echo: '$19/mo', promptbase: 'Pay per prompt', flowgpt: 'Free', langsmith: '$39/mo' },
]

export default function PromptForgePage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#ec4899'

  return (
    <>
      <FaqSchema faqs={faqs} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Prompt Forge</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>The prompt engineering platform. 20 auto-enhancement techniques, semantic search, version control, A/B testing, and a marketplace of 194+ sovereign templates.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=prompt-forge&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Master Your AI Prompts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>PromptBase</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>FlowGPT</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>LangSmith</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.promptbase}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.flowgpt}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.langsmith}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$19', period: '/mo', features: ['100 prompts', '5 techniques', 'Semantic search', 'Version history', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$59', period: '/mo', features: ['1,000 prompts', '20 techniques', 'A/B testing', 'Marketplace access', 'Team workspace', 'API access', 'Analytics', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$149', period: '/mo', features: ['Unlimited prompts', 'All techniques', 'Custom templates', 'Private marketplace', 'Multi-model tracking', 'SSO + RBAC', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=prompt-forge&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.q} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.q}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.a}</p></details>))}
        </section>
      </div>
    </>
  )
}
