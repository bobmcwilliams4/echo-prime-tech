'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  {
    q: 'How smart is the Telegram bot?',
    a: 'Backed by 2,600+ knowledge engines and 32 AI personalities, the bot provides expert-level responses in tax, legal, medical, engineering, crypto, and 20+ other domains. It learns from every conversation via Shared Brain memory.',
  },
  {
    q: 'Does it support voice messages?',
    a: 'Yes. Speech-to-text converts voice messages to text, processes them through the AI engine, and responds with text. Full voice-in, text-out pipeline for hands-free interaction.',
  },
  {
    q: 'Can I use it for my crypto/finance community?',
    a: 'Absolutely. The bot integrates with Echo crypto trading engines for real-time price alerts, portfolio tracking, and market analysis. Perfect for Telegram trading groups and alpha channels.',
  },
  {
    q: 'How do inline keyboards work?',
    a: 'Interactive buttons appear below bot messages, letting users navigate menus, make selections, and trigger actions without typing. Build custom keyboard layouts for your specific workflow.',
  },
  {
    q: 'Can I customize the bot personality?',
    a: 'Choose from 32 built-in personalities or create custom ones. Each personality has its own tone, knowledge focus, and response style — from formal business advisor to casual crypto degen.',
  },
]

const features = [
  { title: '32 AI Personalities', desc: 'From Wall Street analyst to crypto degen — pick the perfect voice for your community. Switch personalities per channel or per user.' },
  { title: '18 Slash Commands', desc: 'Rich command system for common actions — /price, /portfolio, /ask, /analyze, /summarize, and 13 more built-in commands.' },
  { title: 'Voice STT Pipeline', desc: 'Users send voice messages, the bot transcribes and processes them. Hands-free AI interaction for mobile-first users.' },
  { title: 'Inline Keyboards', desc: 'Interactive button menus for guided workflows. Navigate product catalogs, select services, and trigger actions with a tap.' },
  { title: '2,600+ Knowledge Engines', desc: 'Engine Runtime integration provides domain expertise in tax, legal, crypto, medical, engineering, oilfield, and more.' },
  { title: 'Autonomous Posting', desc: 'Scheduled cron-driven posts deliver market updates, news digests, and community content — even when nobody is chatting.' },
  { title: 'Domain-Aware Routing', desc: 'Questions are classified by domain and routed to specialized engines. Tax questions get IRC citations, legal gets case law.' },
  { title: 'Shared Brain Memory', desc: 'Every conversation persists across sessions. The bot remembers user preferences, past questions, and context.' },
  { title: 'Group & Channel Support', desc: 'Works in private chats, groups, and channels. Mention the bot or use commands — it handles all Telegram interaction types.' },
  { title: 'Knowledge Forge Access', desc: 'Query 24,000+ documents and 170,000+ knowledge chunks for deep, citation-backed research responses.' },
  { title: 'Crypto Integration', desc: 'Real-time price feeds, portfolio tracking, and market analysis via Echo crypto engines. Built for trading communities.' },
  { title: 'Edge Performance', desc: 'Cloudflare Workers deliver sub-50ms response times globally. No cold starts, instant scaling, 100% uptime.' },
]

const comparison = [
  { feature: 'AI personalities', echo: '32 built-in', manychat: 'No', botfather: 'DIY', combot: 'No' },
  { feature: 'Knowledge engines', echo: '2,600+ domains', manychat: 'No', botfather: 'No', combot: 'No' },
  { feature: 'Voice STT', echo: 'Built-in pipeline', manychat: 'No', botfather: 'DIY', combot: 'No' },
  { feature: 'Inline keyboards', echo: 'Dynamic + custom', manychat: 'Flow-based', botfather: 'Manual', combot: 'Limited' },
  { feature: 'Slash commands', echo: '18 built-in', manychat: 'Custom flows', botfather: 'Manual', combot: 'Moderation' },
  { feature: 'Autonomous posting', echo: 'Cron-driven', manychat: 'Scheduled', botfather: 'No', combot: 'No' },
  { feature: 'Crypto integration', echo: 'Real-time feeds', manychat: 'No', botfather: 'DIY', combot: 'No' },
  { feature: 'Memory / context', echo: 'Shared Brain', manychat: 'Tags', botfather: 'None', combot: 'None' },
  { feature: 'Document knowledge', echo: '24K docs', manychat: 'No', botfather: 'No', combot: 'No' },
  { feature: 'Group moderation', echo: 'AI + rules', manychat: 'Limited', botfather: 'No', combot: 'Yes' },
  { feature: 'Edge performance', echo: 'Sub-50ms global', manychat: 'Cloud', botfather: 'Self-hosted', combot: 'Cloud' },
  { feature: 'Starting price', echo: '$29/mo', manychat: '$15/mo', botfather: 'Free (DIY)', combot: '$10/mo' },
]

export default function TelegramBotPage() {
  const { isDark } = useTheme()
  const dark = isDark

  return (
    <>
      <FaqSchema faqs={faqs} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Telegram Bot', href: '/telegram-bot' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>

        <section data-tutorial="tg-hero" style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #0088cc, #229ed9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Echo Telegram Bot
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>
            The most powerful AI Telegram bot on the planet. 32 personalities, 18 commands,
            voice transcription, crypto feeds, and 2,600+ knowledge engines — for communities that demand intelligence.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=telegram-bot&tier=starter" style={{ padding: '14px 32px', background: '#0088cc', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              Start Free Trial
            </a>
            <a href="#pricing" style={{ padding: '14px 32px', border: '2px solid #0088cc', color: '#0088cc', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              View Pricing
            </a>
          </div>
        </section>

        <section data-tutorial="tg-features" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>AI-Powered Telegram for Communities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#0088cc' }}>{f.title}</h3>
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
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: '#0088cc', fontWeight: 800 }}>Echo</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>ManyChat</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>BotFather DIY</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Combot</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#0088cc', fontWeight: 700 }}>{row.echo}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.manychat}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.botfather}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.combot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="pricing" data-tutorial="tg-pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['1 bot instance', '5,000 messages/mo', '5 personalities', 'Slash commands', 'Inline keyboards', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$99', period: '/mo', features: ['3 bot instances', '50,000 messages/mo', '32 personalities', 'Voice STT pipeline', 'Crypto integration', 'Knowledge Forge access', 'Autonomous posting', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$249', period: '/mo', features: ['Unlimited bots', 'Unlimited messages', 'Custom personalities', 'Full engine access', 'Shared Brain memory', 'Group moderation AI', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? '2px solid #0088cc' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#0088cc', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
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
                      <span style={{ color: '#0088cc', fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={`/checkout?service=telegram-bot&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? '#0088cc' : 'transparent', color: plan.popular ? '#fff' : '#0088cc', border: plan.popular ? 'none' : '2px solid #0088cc', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
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
