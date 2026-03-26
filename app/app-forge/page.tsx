'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { q: 'What types of apps can it generate?', a: 'Six archetypes: Electron desktop apps, Next.js web apps, React Native mobile, CLI tools, Chrome extensions, and MCP servers. Each archetype has specialized templates and build pipelines.' },
  { q: 'How does the 16-stage pipeline work?', a: 'Requirements analysis, architecture design, component planning, code generation, testing, optimization, packaging, and deployment — all automated. Multiple LLMs compete on each stage, and the best output wins.' },
  { q: 'Can I modify generated code?', a: 'Absolutely. All generated code is clean, well-documented TypeScript with no lock-in. Export to GitHub, modify in VS Code, or refine through the chat interface.' },
  { q: 'How is this different from Bolt.new or Lovable?', a: 'Multi-LLM competitive generation means you get the best output across multiple AI models, not just one. Plus 16 stages vs single-prompt generation, and support for desktop/mobile/CLI — not just web apps.' },
]

const features = [
  { title: '6 App Archetypes', desc: 'Electron desktop, Next.js web, React Native mobile, CLI tools, Chrome extensions, and MCP servers — all from a single prompt.' },
  { title: '16-Stage Pipeline', desc: 'From requirements to deployment in 16 automated stages. Each stage produces clean, tested, production-ready output.' },
  { title: 'Multi-LLM Competition', desc: 'Multiple AI models compete on each build stage. The best code wins — not limited to a single provider.' },
  { title: 'Workers AI + R2 Storage', desc: 'Builds run on Cloudflare Workers AI with artifacts stored in R2. Fast, serverless, globally distributed.' },
  { title: 'Iterative Refinement', desc: 'Chat with your app — describe changes in natural language and the AI updates the code in real-time.' },
  { title: 'GitHub Export', desc: 'One-click export to a GitHub repository with proper project structure, README, CI/CD, and deployment config.' },
  { title: 'Template Library', desc: 'Start from proven templates for common app types — SaaS dashboards, landing pages, mobile apps, developer tools.' },
  { title: 'Full Stack Generation', desc: 'Frontend + backend + database schema + API routes + auth — complete applications, not just UI components.' },
  { title: 'Live Preview', desc: 'See your app running in real-time as it builds. Make changes and watch updates instantly.' },
  { title: 'Custom Components', desc: 'Save generated components to your library for reuse across projects. Build faster with each iteration.' },
  { title: 'Deployment Pipeline', desc: 'Deploy to Vercel, Cloudflare Pages, or Electron builds with zero configuration. From prompt to production.' },
  { title: 'Version History', desc: 'Every build iteration is versioned. Roll back, compare, or branch from any point in your app history.' },
]

const comparison = [
  { feature: 'App types', echo: '6 archetypes', bolt: 'Web only', lovable: 'Web only', cursor: 'Any (manual)' },
  { feature: 'Build pipeline', echo: '16 stages', bolt: 'Single prompt', lovable: 'Single prompt', cursor: 'Code assist' },
  { feature: 'Multi-LLM', echo: 'Competitive build', bolt: 'Claude only', lovable: 'Claude only', cursor: 'Multiple' },
  { feature: 'Desktop apps', echo: 'Electron native', bolt: 'No', lovable: 'No', cursor: 'Manual' },
  { feature: 'Mobile apps', echo: 'React Native', bolt: 'No', lovable: 'No', cursor: 'Manual' },
  { feature: 'CLI tools', echo: 'Yes', bolt: 'No', lovable: 'No', cursor: 'Manual' },
  { feature: 'Full stack', echo: 'Front + back + DB', bolt: 'Frontend focus', lovable: 'Frontend focus', cursor: 'Any (manual)' },
  { feature: 'Template library', echo: 'Built-in', bolt: 'Community', lovable: 'Limited', cursor: 'None' },
  { feature: 'GitHub export', echo: 'One-click', bolt: 'Download', lovable: 'GitHub sync', cursor: 'Native' },
  { feature: 'Version history', echo: 'Full branching', bolt: 'Snapshots', lovable: 'History', cursor: 'Git native' },
  { feature: 'Starting price', echo: '$49/mo', bolt: '$20/mo', lovable: '$20/mo', cursor: '$20/mo' },
]

export default function AppForgePage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#f59e0b'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo App Forge</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Describe your app. We build it. Desktop, web, mobile, CLI — 16-stage AI pipeline with multi-LLM competitive generation delivers production-ready apps in minutes.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=app-forge&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Build Any App with AI</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Bolt.new</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Lovable</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Cursor</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.bolt}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.lovable}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.cursor}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$49', period: '/mo', features: ['10 builds/mo', 'Web apps only', 'Basic templates', 'GitHub export', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$149', period: '/mo', features: ['50 builds/mo', 'All 6 archetypes', 'Multi-LLM competition', 'Full stack generation', 'Template library', 'Version history', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$399', period: '/mo', features: ['Unlimited builds', 'Custom archetypes', 'Private templates', 'Team collaboration', 'CI/CD integration', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=app-forge&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
