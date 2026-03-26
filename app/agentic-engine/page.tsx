'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { q: 'What is an autonomous AI agent?', a: 'An AI agent that can plan, execute, and iterate without human intervention. Give it a goal, and it breaks it into tasks, selects tools, executes steps, evaluates results, and adjusts its approach — running 24/7 on Cloudflare Workers.' },
  { q: 'What tools can agents use?', a: 'Agents access the full Echo ecosystem: 2,600+ knowledge engines, document search, web scraping, API calls, database queries, file operations, and custom tool definitions. Define your own tools via simple JSON schemas.' },
  { q: 'How does task queuing work?', a: 'Cloudflare Queues provide durable task queuing with producer-consumer patterns. Tasks survive failures, retry automatically, and scale to millions of concurrent operations.' },
  { q: 'Is it like AutoGPT or CrewAI?', a: 'Similar concept but production-grade. Runs on Cloudflare Workers (not localhost), scales globally, has durable task queues (not in-memory), and integrates with 2,600+ knowledge engines (not just ChatGPT).' },
]

const features = [
  { title: 'Autonomous Execution', desc: 'Agents plan, execute, and iterate without human intervention. Set a goal and let the agent figure out the rest.' },
  { title: 'Tool Use Framework', desc: 'Define tools as JSON schemas. Agents select the right tool for each step — API calls, searches, calculations, file operations.' },
  { title: 'Durable Task Queues', desc: 'Cloudflare Queues ensure tasks survive failures. Auto-retry, dead letter queues, and priority scheduling built-in.' },
  { title: 'Multi-Step Reasoning', desc: 'Chain-of-thought planning with self-evaluation. Agents reason about their approach and adjust when results differ from expectations.' },
  { title: '2,600+ Knowledge Engines', desc: 'Every agent has access to the full Echo Engine Runtime — domain expertise in 20+ fields with citation-backed responses.' },
  { title: 'R2 Artifact Storage', desc: 'Agents store intermediate results, generated files, and final outputs in R2 for persistent access and sharing.' },
  { title: 'Workers AI Integration', desc: 'On-device inference for fast, private AI processing. No external API calls for sensitive operations.' },
  { title: 'Agent Templates', desc: 'Pre-built agent templates for common workflows — research, data analysis, content creation, monitoring, and automation.' },
  { title: 'Parallel Execution', desc: 'Spawn sub-agents for parallel task execution. Complex workflows decompose into concurrent streams automatically.' },
  { title: 'Observation Loops', desc: 'Agents observe their own output, detect errors, and self-correct. Built-in guardrails prevent runaway execution.' },
  { title: 'Event-Driven Triggers', desc: 'Trigger agents on schedules, webhooks, database changes, or custom events. Reactive automation that responds to your business.' },
  { title: 'Full Audit Trail', desc: 'Every agent decision, tool call, and result is logged. Complete reproducibility for debugging and compliance.' },
]

const comparison = [
  { feature: 'Infrastructure', echo: 'Cloudflare Workers', autogpt: 'Localhost', crewai: 'Python process', langchain: 'Python process' },
  { feature: 'Task durability', echo: 'Cloudflare Queues', autogpt: 'In-memory', crewai: 'In-memory', langchain: 'In-memory' },
  { feature: 'Scaling', echo: 'Global edge', autogpt: 'Single machine', crewai: 'Single machine', langchain: 'Single machine' },
  { feature: 'Knowledge engines', echo: '2,600+ domains', autogpt: 'Web search only', crewai: 'Custom tools', langchain: 'Custom tools' },
  { feature: 'Tool framework', echo: 'JSON schema + ecosystem', autogpt: 'Plugin system', crewai: 'Tool classes', langchain: 'Tool classes' },
  { feature: 'Multi-agent', echo: 'Parallel sub-agents', autogpt: 'Sequential', crewai: 'Crew delegation', langchain: 'Agent chain' },
  { feature: 'Self-correction', echo: 'Observation loops', autogpt: 'Basic retry', crewai: 'Feedback loops', langchain: 'Custom' },
  { feature: 'Artifact storage', echo: 'R2 persistent', autogpt: 'Local files', crewai: 'Local files', langchain: 'Custom' },
  { feature: 'Event triggers', echo: 'Cron + webhook + DB', autogpt: 'Manual only', crewai: 'Manual only', langchain: 'Custom' },
  { feature: 'Audit trail', echo: 'Full D1 logging', autogpt: 'Console logs', crewai: 'Basic', langchain: 'LangSmith' },
  { feature: 'Starting price', echo: '$49/mo', autogpt: 'Free (DIY)', crewai: 'Free (DIY)', langchain: '$39/mo' },
]

export default function AgenticEnginePage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#22c55e'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #22c55e, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Agentic Engine</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Build AI agents that work autonomously. Tool use, multi-step reasoning, durable task queues, and 2,600+ knowledge engines — running 24/7 on the global edge.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=agentic-engine&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Autonomous AI That Works For You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>AutoGPT</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>CrewAI</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>LangChain</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.autogpt}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.crewai}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.langchain}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$49', period: '/mo', features: ['5 active agents', '10K task executions/mo', 'Basic tool framework', 'D1 audit trail', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$149', period: '/mo', features: ['25 active agents', '100K executions/mo', 'Full tool ecosystem', 'Parallel sub-agents', 'Knowledge engines', 'Event triggers', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$399', period: '/mo', features: ['Unlimited agents', 'Unlimited executions', 'Custom tools', 'R2 artifact storage', 'Advanced scheduling', 'Team management', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=agentic-engine&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
