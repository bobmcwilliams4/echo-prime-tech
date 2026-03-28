'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'What is persistent AI memory?', answer: 'AI models forget everything between sessions. Memory Prime solves this by storing conversations, facts, decisions, and context in a 9-pillar architecture. Your AI agents remember everything — across sessions, across models, across your entire organization.' },
  { question: 'How does cross-agent memory work?', answer: 'Memory Prime provides a shared memory layer. When Agent A learns a customer preference, Agent B can access it instantly. No manual context passing. Works across Claude, GPT-4, Gemini, and any LLM.' },
  { question: 'What are the 9 memory pillars?', answer: 'Episodic (conversation history), Semantic (facts & knowledge), Procedural (how-to instructions), Working (current session context), Long-term (permanent records), Emotional (sentiment patterns), Social (relationship graphs), Spatial (location context), and Temporal (time-based patterns).' },
  { question: 'How does it integrate with my LLM?', answer: 'Simple API: store memories after interactions, retrieve relevant context before generating responses. SDK handles injection automatically. Works as middleware between your app and any LLM provider.' },
]

const features = [
  { title: '9-Pillar Architecture', desc: 'Episodic, Semantic, Procedural, Working, Long-term, Emotional, Social, Spatial, and Temporal memory types — mirroring human cognition.' },
  { title: 'Cross-Agent Sharing', desc: 'Memories flow between all your AI agents automatically. One unified knowledge base regardless of which model or agent is responding.' },
  { title: 'Fact Extraction', desc: 'AI automatically extracts entities, relationships, preferences, and decisions from conversations. No manual tagging required.' },
  { title: 'Importance Scoring', desc: 'Every memory gets an importance score (1-10). High-importance memories surface first. Stale memories decay naturally over time.' },
  { title: 'Conversation History', desc: 'Full conversation threads with timestamps, participants, and context. Search across millions of messages in milliseconds.' },
  { title: 'Decision Tracking', desc: 'Automatically log decisions with reasoning, alternatives considered, and outcomes. Build institutional memory that outlasts any individual.' },
  { title: 'Context Windows', desc: 'Smart context injection fits the most relevant memories into any LLM context window. Automatic prioritization and compression.' },
  { title: 'Memory Search', desc: 'Semantic search across all memory types. Find relevant context even when exact keywords do not match — powered by Vectorize embeddings.' },
  { title: 'Privacy Controls', desc: 'Per-user, per-team, and per-organization memory isolation. Encryption at rest. GDPR-compliant deletion. You own your data.' },
  { title: 'Consolidation Engine', desc: 'Automatically merge duplicate memories, resolve contradictions, and compress verbose records into concise facts.' },
  { title: 'Memory Analytics', desc: 'Track memory usage, retrieval patterns, and knowledge gaps. Identify what your AI knows well and where it needs more data.' },
  { title: 'REST + SDK', desc: 'Full REST API for store/search/retrieve. TypeScript and Python SDKs. Webhook notifications on memory events.' },
]

const comparison = [
  { feature: 'Memory architecture', echo: '9-pillar cognitive', mem0: '3-tier', langchain: 'Buffer/summary', zep: 'Temporal graph' },
  { feature: 'Cross-agent sharing', echo: 'Built-in universal', mem0: 'Per-user', langchain: 'Per-chain', zep: 'Per-session' },
  { feature: 'Fact extraction', echo: 'AI automatic', mem0: 'Yes', langchain: 'Manual', zep: 'Entity extraction' },
  { feature: 'Importance scoring', echo: '1-10 with decay', mem0: 'No', langchain: 'No', zep: 'Relevance ranking' },
  { feature: 'Decision tracking', echo: 'Full audit trail', mem0: 'No', langchain: 'No', zep: 'No' },
  { feature: 'Semantic search', echo: 'Vectorize + D1', mem0: 'Yes', langchain: 'Vector stores', zep: 'Yes' },
  { feature: 'Consolidation', echo: 'Auto-merge + compress', mem0: 'No', langchain: 'Summary buffer', zep: 'No' },
  { feature: 'Privacy controls', echo: 'Per-user/team/org', mem0: 'Per-user', langchain: 'None', zep: 'Per-session' },
  { feature: 'Infrastructure', echo: 'Cloudflare edge', mem0: 'Cloud', langchain: 'Self-host', zep: 'Cloud or self-host' },
  { feature: 'Multi-model', echo: 'Any LLM provider', mem0: 'Any', langchain: 'Any', zep: 'Any' },
  { feature: 'Starting price', echo: '$29/mo', mem0: 'Free (limited)', langchain: 'Free (DIY)', zep: '$8/mo' },
]

export default function MemoryPrimePage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#f43f5e'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Memory Prime', href: '/memory-prime' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Memory Prime</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Give your AI agents a brain that remembers. 9-pillar persistent memory with fact extraction, cross-agent sharing, and semantic search — your AI never forgets a conversation again.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=memory-prime&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>AI Memory That Mirrors Human Cognition</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Mem0</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>LangChain</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Zep</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.mem0}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.langchain}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.zep}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['100K memories stored', '50K searches/mo', 'Fact extraction', 'Conversation history', 'REST API', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$99', period: '/mo', features: ['1M memories', '500K searches/mo', 'All 9 memory pillars', 'Cross-agent sharing', 'Importance scoring', 'Consolidation engine', 'TypeScript SDK', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$299', period: '/mo', features: ['Unlimited memories', 'Unlimited searches', 'Custom memory types', 'Decision tracking', 'Privacy controls', 'Memory analytics', 'Team management', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=memory-prime&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
