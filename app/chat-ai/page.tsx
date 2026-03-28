'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { q: 'How many AI personalities are available?', a: '14 distinct personalities out of the box — from professional business advisor to creative storyteller. Each has unique tone, knowledge focus, and conversation style. Enterprise plans support custom personality creation.' },
  { q: 'Which LLM models power the chat?', a: 'Five backend options: Claude (via proxy), RunPod LoRA fine-tuned models, Azure GPT-4.1, Workers AI, and Groq for ultra-fast responses. The system auto-selects the best model per query or you can pin a specific backend.' },
  { q: 'Does it support voice?', a: 'Yes. Echo Speak integration provides text-to-speech with 69 cloned voices and emotion detection. Full voice-in (STT) and voice-out (TTS) for hands-free conversational AI.' },
  { q: 'Can it access my company knowledge?', a: 'Absolutely. Engine Runtime integration connects to 2,600+ knowledge engines and Knowledge Forge provides 24,000+ document chunks. Upload your own docs for RAG-powered answers grounded in your data.' },
  { q: 'Is conversation history persistent?', a: 'All conversations persist in Shared Brain — the AI remembers context across sessions, devices, and even across different Echo products. Full conversation search and export included.' },
]

const features = [
  { title: '14 AI Personalities', desc: 'Professional, creative, analytical, casual — choose the right persona for every use case. Each personality maintains its own conversation style.' },
  { title: '5 LLM Backends', desc: 'Claude, GPT-4.1, RunPod LoRA, Workers AI, and Groq. Auto-routing picks the best model, or pin your preference.' },
  { title: 'Voice Synthesis', desc: '69 cloned voices with emotion detection via Echo Speak. Natural conversational AI with text-to-speech and speech-to-text.' },
  { title: '2,600+ Knowledge Engines', desc: 'Domain expertise in tax, legal, medical, engineering, oilfield, crypto, and more — with citation-backed answers.' },
  { title: 'Persistent Memory', desc: 'Shared Brain stores every conversation. The AI remembers you across sessions, builds context over time.' },
  { title: 'Document RAG', desc: 'Upload documents and get AI answers grounded in your data. Knowledge Forge indexes and chunks for instant retrieval.' },
  { title: 'Multi-Channel Deploy', desc: 'Embed in websites, connect to WhatsApp, Telegram, Slack, Discord — one AI brain, every channel.' },
  { title: 'Engine Routing', desc: 'Questions auto-route to specialized engines. Tax queries cite IRC, legal cites case law, medical cites clinical guidelines.' },
  { title: 'Streaming Responses', desc: 'Real-time SSE streaming for instant, token-by-token delivery. No waiting for complete responses.' },
  { title: 'Conversation Analytics', desc: 'Track engagement, satisfaction, topic distribution, and response quality across all conversations.' },
  { title: 'Custom Training', desc: 'Fine-tune responses with your brand voice, product catalog, and internal knowledge base.' },
  { title: 'Edge Performance', desc: 'Cloudflare Workers deliver sub-100ms first-token globally. Zero cold starts, infinite scaling.' },
]

const comparison = [
  { feature: 'AI personalities', echo: '14 built-in', chatgpt: '1 (custom GPTs)', jasper: 'Brand voice', intercom: 'Fin AI' },
  { feature: 'LLM backends', echo: '5 (auto-route)', chatgpt: '1 (GPT-4o)', jasper: '1 (GPT-4)', intercom: '1 (GPT-4)' },
  { feature: 'Voice synthesis', echo: '69 cloned voices', chatgpt: 'Basic TTS', jasper: 'No', intercom: 'No' },
  { feature: 'Knowledge engines', echo: '2,600+ domains', chatgpt: 'General only', jasper: 'Marketing only', intercom: 'Help docs' },
  { feature: 'Document RAG', echo: '24K docs indexed', chatgpt: 'File upload', jasper: 'Knowledge base', intercom: 'Help center' },
  { feature: 'Persistent memory', echo: 'Cross-system brain', chatgpt: 'Session only', jasper: 'Campaign level', intercom: 'Conversation' },
  { feature: 'Multi-channel', echo: 'All platforms', chatgpt: 'Web + API', jasper: 'Web only', intercom: 'Widget + inbox' },
  { feature: 'Engine routing', echo: 'Domain-specific', chatgpt: 'No', jasper: 'No', intercom: 'No' },
  { feature: 'Streaming', echo: 'SSE real-time', chatgpt: 'Yes', jasper: 'Yes', intercom: 'Yes' },
  { feature: 'Self-hosted option', echo: 'Cloudflare Workers', chatgpt: 'No', jasper: 'No', intercom: 'No' },
  { feature: 'Starting price', echo: '$29/mo', chatgpt: '$20/mo', jasper: '$49/mo', intercom: '$74/mo' },
]

export default function ChatAiPage() {
  const { isDark } = useTheme()
  const dark = isDark

  return (
    <>
      <FaqSchema faqs={faqs} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Echo Chat AI', href: '/chat-ai' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Chat AI</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>The most intelligent conversational AI platform. 14 personalities, 5 LLM backends, voice synthesis, and 2,600+ knowledge engines — deploy everywhere.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=chat-ai&tier=starter" style={{ padding: '14px 32px', background: '#06b6d4', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: '2px solid #06b6d4', color: '#06b6d4', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Enterprise Conversational AI</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#06b6d4' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: '#06b6d4', fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>ChatGPT Plus</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Jasper</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Intercom</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: '#06b6d4', fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.chatgpt}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.jasper}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.intercom}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['3 personalities', '5,000 messages/mo', 'Basic voice TTS', 'Web embed', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$99', period: '/mo', features: ['14 personalities', '50,000 messages/mo', 'Full voice (69 voices)', 'Multi-channel deploy', 'Document RAG', 'Engine routing', 'Analytics', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$299', period: '/mo', features: ['Custom personalities', 'Unlimited messages', 'All 5 LLM backends', 'Full Knowledge Forge', 'Custom training', 'White-label', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? '2px solid #06b6d4' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#06b6d4', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#06b6d4', fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=chat-ai&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? '#06b6d4' : 'transparent', color: plan.popular ? '#fff' : '#06b6d4', border: plan.popular ? 'none' : '2px solid #06b6d4', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
