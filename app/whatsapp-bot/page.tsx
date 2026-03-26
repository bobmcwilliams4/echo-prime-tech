'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  {
    q: 'How does the AI WhatsApp bot work?',
    a: 'Your bot connects to the WhatsApp Business API and responds to messages using 14 AI personalities powered by 2,600+ knowledge engines. It understands context, remembers conversation history, and can switch personalities based on the topic.',
  },
  {
    q: 'Can I schedule broadcast messages?',
    a: 'Yes. Schedule broadcasts for specific times — promotional messages, updates, newsletters, or engagement campaigns. The system has 6 built-in cron schedules and supports custom timing for maximum reach.',
  },
  {
    q: 'What kind of leads can it capture?',
    a: 'The bot captures name, phone, email, company, and any custom fields through natural conversation. Leads are enriched via OpenClaw intelligence and stored in Shared Brain for cross-system access.',
  },
  {
    q: 'Does it support product catalogs?',
    a: 'Yes — 10 product categories built-in. Send product cards, handle inquiries, and guide customers through purchasing decisions directly in the WhatsApp chat.',
  },
  {
    q: 'How secure is the integration?',
    a: 'All messages are verified via HMAC signature validation from the WhatsApp Business API. No messages are stored unencrypted. The bot runs on Cloudflare Workers at the edge for sub-50ms response times globally.',
  },
]

const features = [
  { title: '14 AI Personalities', desc: 'From professional sales rep to casual friend — switch personalities based on context, customer segment, or manual selection.' },
  { title: '2,600+ Knowledge Engines', desc: 'Engine Runtime integration gives your bot expert knowledge in tax, legal, oilfield, medical, engineering, and 20+ other domains.' },
  { title: 'Lead Capture & Enrichment', desc: 'Automatically capture lead info through conversation. OpenClaw enrichment adds company data, social profiles, and intelligence.' },
  { title: 'Broadcast Scheduling', desc: '6 built-in cron schedules plus custom timing. Send targeted messages to segments at optimal engagement windows.' },
  { title: 'Product Catalog', desc: '10 product categories with rich cards, pricing, and interactive purchase flows inside WhatsApp.' },
  { title: 'Domain-Aware Routing', desc: 'Messages are classified by domain (tax, legal, medical, etc.) and routed to the specialized engine for expert-level responses.' },
  { title: 'Shared Brain Memory', desc: 'Conversations persist in Echo Shared Brain — the bot remembers every interaction across sessions and shares context with other Echo systems.' },
  { title: 'Knowledge Forge Access', desc: 'Direct access to 24,000+ documents and 170,000+ chunks for deep, citation-backed answers to complex questions.' },
  { title: 'HMAC Webhook Security', desc: 'Every incoming message is verified via HMAC signature. No spoofed messages get through. Enterprise-grade security.' },
  { title: 'Workers AI Fallback', desc: 'If external AI providers are down, Workers AI provides instant fallback so your bot never goes offline.' },
  { title: 'MoltBook Social Feed', desc: 'Bot activity posts to the AI social network — track engagement, see what topics are trending, and monitor performance.' },
  { title: 'Edge-First Performance', desc: 'Runs on Cloudflare Workers — sub-50ms response time globally, zero cold starts, automatic scaling to millions of messages.' },
]

const comparison = [
  { feature: 'AI personalities', echo: '14 built-in', wati: 'No', manychat: 'No', twilio: 'DIY' },
  { feature: 'Knowledge engines', echo: '2,600+ domains', wati: 'No', manychat: 'No', twilio: 'No' },
  { feature: 'Lead capture', echo: 'AI conversational', wati: 'Form-based', manychat: 'Flow-based', twilio: 'DIY' },
  { feature: 'Broadcast scheduling', echo: '6 crons + custom', wati: 'Yes', manychat: 'Yes', twilio: 'API only' },
  { feature: 'Product catalog', echo: '10 categories', wati: 'Yes', manychat: 'Limited', twilio: 'No' },
  { feature: 'Domain routing', echo: '10 expert domains', wati: 'No', manychat: 'No', twilio: 'No' },
  { feature: 'Memory / context', echo: 'Shared Brain (82K msgs)', wati: 'Session only', manychat: 'Tags', twilio: 'DIY' },
  { feature: 'Document knowledge', echo: '24K docs, 170K chunks', wati: 'No', manychat: 'No', twilio: 'No' },
  { feature: 'Webhook security', echo: 'HMAC verified', wati: 'Yes', manychat: 'Yes', twilio: 'Yes' },
  { feature: 'AI fallback', echo: 'Workers AI + 30 LLMs', wati: 'No', manychat: 'ChatGPT', twilio: 'No' },
  { feature: 'Edge performance', echo: 'Sub-50ms global', wati: 'Cloud', manychat: 'Cloud', twilio: 'Cloud' },
  { feature: 'Starting price', echo: '$49/mo', wati: '$49/mo', manychat: '$15/mo', twilio: '$0.005/msg' },
]

export default function WhatsAppBotPage() {
  const { isDark } = useTheme()
  const dark = isDark

  return (
    <>
      <FaqSchema faqs={faqs} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>

        <section data-tutorial="wa-hero" style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #25d366, #128c7e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Echo WhatsApp Bot
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>
            The most intelligent WhatsApp business bot ever built. 14 AI personalities, 2,600+ knowledge engines,
            lead capture, broadcast scheduling, and product catalogs — all running at the edge.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=whatsapp-bot&tier=starter" style={{ padding: '14px 32px', background: '#25d366', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              Start Free Trial
            </a>
            <a href="#pricing" style={{ padding: '14px 32px', border: '2px solid #25d366', color: '#25d366', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              View Pricing
            </a>
          </div>
        </section>

        <section data-tutorial="wa-features" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>AI-Powered WhatsApp for Business</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#25d366' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-tutorial="wa-comparison" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: '#25d366', fontWeight: 800 }}>Echo</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>WATI</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>ManyChat</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Twilio</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#25d366', fontWeight: 700 }}>{row.echo}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.wati}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.manychat}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.twilio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="pricing" data-tutorial="wa-pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$49', period: '/mo', features: ['1 WhatsApp number', '1,000 messages/mo', '3 AI personalities', 'Lead capture', 'Basic broadcasts', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$149', period: '/mo', features: ['3 WhatsApp numbers', '10,000 messages/mo', '14 AI personalities', 'Product catalog', 'Domain routing', 'Knowledge Forge access', 'Scheduled broadcasts', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$399', period: '/mo', features: ['Unlimited numbers', 'Unlimited messages', 'All personalities + custom', 'OpenClaw enrichment', 'Shared Brain memory', 'Full engine access', 'API integration', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? '2px solid #25d366' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#25d366', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
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
                      <span style={{ color: '#25d366', fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={`/checkout?service=whatsapp-bot&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? '#25d366' : 'transparent', color: plan.popular ? '#fff' : '#25d366', border: plan.popular ? 'none' : '2px solid #25d366', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
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
