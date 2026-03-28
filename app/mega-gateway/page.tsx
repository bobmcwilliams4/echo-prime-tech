'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'What is MEGA Gateway?', answer: 'A unified API that aggregates 37,475+ tools from 1,873 MCP (Model Context Protocol) servers into one endpoint. Instead of integrating with dozens of APIs separately, call MEGA Gateway once and access everything — web search, file operations, database queries, browser automation, and more.' },
  { question: 'How does intelligent routing work?', answer: 'When you call a tool, MEGA Gateway selects the optimal server based on availability, latency, and capability. If a server is down, it automatically falls back to alternatives. Load balancing across servers ensures high availability.' },
  { question: 'Can I add my own MCP servers?', answer: 'Yes. Register custom MCP servers with the gateway. Your tools become searchable and executable alongside the 37K+ built-in tools. Perfect for extending the gateway with proprietary business tools.' },
  { question: 'How do credentials work?', answer: 'MEGA Gateway integrates with Echo Vault for secure credential management. API keys, OAuth tokens, and secrets are stored encrypted and injected at execution time. Never expose credentials in your code.' },
]

const features = [
  { title: '37,475+ Tools', desc: 'Access tools for web search, file operations, database queries, browser automation, code execution, image generation, and hundreds more categories.' },
  { title: '1,873 MCP Servers', desc: 'Aggregated from the global MCP ecosystem. Verified, tested, and monitored servers with automatic health checking and failover.' },
  { title: 'One Unified API', desc: 'Search tools by keyword, execute with one POST call, get results back. No need to integrate with 50 different APIs separately.' },
  { title: 'Intelligent Routing', desc: 'Automatic server selection based on availability, latency, and capability. Built-in failover and load balancing for high reliability.' },
  { title: 'Tool Search', desc: 'Semantic search across all 37K+ tools. Find the right tool by describing what you need in natural language.' },
  { title: 'Credential Vault', desc: 'Integrated with Echo Vault for secure API key and token management. Credentials injected at runtime, never exposed in code or logs.' },
  { title: 'Custom Servers', desc: 'Register your own MCP servers. Extend the gateway with proprietary business tools that work alongside the entire ecosystem.' },
  { title: 'Usage Analytics', desc: 'Track tool usage, success rates, latency, and costs. Identify which tools your agents use most and optimize accordingly.' },
  { title: 'Rate Limiting', desc: 'Per-tool and per-server rate limits prevent abuse and ensure fair usage. Configurable quotas for team management.' },
  { title: 'Batch Execution', desc: 'Execute multiple tools in parallel with one API call. Automatic dependency resolution for tool chains.' },
  { title: 'Audit Trail', desc: 'Full log of every tool execution with parameters, results, timing, and user attribution. Compliance-ready audit trail.' },
  { title: 'SDK Integration', desc: 'TypeScript and Python SDKs. Drop-in integration for Claude, GPT-4, and any LLM agent framework.' },
]

const comparison = [
  { feature: 'Total tools', echo: '37,475+', composio: '2,000+', relevance: '100+', toolhouse: '50+' },
  { feature: 'MCP servers', echo: '1,873 aggregated', composio: 'Custom connectors', relevance: 'Custom tools', toolhouse: 'Custom tools' },
  { feature: 'Semantic search', echo: 'Natural language', composio: 'Category browse', relevance: 'No', toolhouse: 'No' },
  { feature: 'Failover routing', echo: 'Auto multi-server', composio: 'No', relevance: 'No', toolhouse: 'No' },
  { feature: 'Credential vault', echo: '1,527+ keys encrypted', composio: 'Connected accounts', relevance: 'API keys', toolhouse: 'API keys' },
  { feature: 'Custom servers', echo: 'Register any MCP', composio: 'Custom actions', relevance: 'Custom tools', toolhouse: 'Custom tools' },
  { feature: 'Batch execution', echo: 'Parallel + chains', composio: 'Sequential', relevance: 'No', toolhouse: 'No' },
  { feature: 'Usage analytics', echo: 'Full dashboard', composio: 'Logs', relevance: 'Basic', toolhouse: 'Basic' },
  { feature: 'LLM integration', echo: 'Any model + SDK', composio: 'OpenAI + LangChain', relevance: 'OpenAI', toolhouse: 'OpenAI' },
  { feature: 'Self-hostable', echo: 'Cloudflare Workers', composio: 'Cloud only', relevance: 'Cloud only', toolhouse: 'Cloud only' },
  { feature: 'Starting price', echo: '$49/mo', composio: '$29/mo', relevance: '$19/mo', toolhouse: '$29/mo' },
]

export default function MegaGatewayPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#7c3aed'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'MEGA Gateway', href: '/mega-gateway' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo MEGA Gateway</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>One API for 37,475+ AI tools across 1,873 MCP servers. Search, execute, and monitor every tool your agents need — with intelligent routing, credential management, and full analytics.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=mega-gateway&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Every AI Tool, One API</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Composio</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Relevance AI</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Toolhouse</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.composio}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.relevance}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.toolhouse}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$49', period: '/mo', features: ['10K tool executions/mo', 'Tool search API', 'Basic credential vault', '5 custom servers', 'Usage dashboard', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$149', period: '/mo', features: ['100K executions/mo', 'Intelligent routing', 'Full credential vault', '25 custom servers', 'Batch execution', 'Analytics dashboard', 'SDK access', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$399', period: '/mo', features: ['Unlimited executions', 'Custom routing rules', 'Unlimited servers', 'Audit trail', 'Team management', 'Rate limit control', 'SLA guarantee', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=mega-gateway&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
