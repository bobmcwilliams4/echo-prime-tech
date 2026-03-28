'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'How does self-healing work?', answer: 'Phoenix monitors your services continuously. When it detects an error — failed health check, spike in error rates, memory leak — it automatically triggers a repair workflow. Simple fixes (restart, scale, rollback) happen instantly. Complex issues get AI-assisted root cause analysis and suggested fixes.' },
  { question: 'What services can Phoenix monitor?', answer: 'Any HTTP service, Cloudflare Worker, Docker container, database, or custom health endpoint. Supports Sentry, Datadog, PagerDuty, and custom monitoring integrations. If it has a health check URL, Phoenix can monitor it.' },
  { question: 'How does AI root cause analysis work?', answer: 'When an error occurs, Phoenix correlates it with recent deployments, config changes, traffic patterns, and dependent service status. AI analyzes error logs, stack traces, and metrics to identify the most likely root cause — then suggests or executes the fix.' },
  { question: 'Can it rollback bad deployments?', answer: 'Yes. Phoenix detects deployment regressions within minutes by monitoring error rates and latency after each deploy. Automatic rollback to the last known good version with one-click approval or fully automatic mode.' },
]

const features = [
  { title: 'Continuous Monitoring', desc: 'Health checks every 30 seconds across all your services. Detect outages, degradation, and anomalies before users notice.' },
  { title: 'AI Root Cause Analysis', desc: 'Correlate errors with deployments, config changes, and traffic. AI reads logs and stack traces to diagnose issues in seconds.' },
  { title: 'Auto-Repair Workflows', desc: 'Define repair actions: restart, scale, rollback, flush cache, rotate credentials. Phoenix executes automatically or with one-click approval.' },
  { title: 'Deployment Regression Detection', desc: 'Monitor error rates and latency after every deploy. Automatic rollback when regressions exceed thresholds.' },
  { title: 'GS343 Error Templates', desc: 'Every resolved incident becomes a reusable template. Phoenix learns from past incidents to fix future ones faster.' },
  { title: 'Dependency Mapping', desc: 'Auto-discover service dependencies. When Service A fails, Phoenix checks all downstream services and cascading impacts.' },
  { title: 'Runbook Automation', desc: 'Convert incident runbooks into automated workflows. Human operators focus on novel issues; Phoenix handles the repeatable ones.' },
  { title: 'Multi-Cloud Support', desc: 'Monitor Cloudflare Workers, AWS Lambda, GCP Cloud Run, Azure Functions, and bare-metal servers from one dashboard.' },
  { title: 'Incident Timeline', desc: 'Full timeline of every incident: detection, diagnosis, repair attempts, resolution, and post-mortem — all automated.' },
  { title: 'SLA Monitoring', desc: 'Track uptime against SLA targets. Alert when services approach SLA thresholds. Generate compliance reports.' },
  { title: 'Cost-Aware Scaling', desc: 'Auto-scale services based on demand, but with cost constraints. Never overspend on infrastructure during traffic spikes.' },
  { title: 'Integration Hub', desc: 'Slack, PagerDuty, Sentry, Datadog, OpsGenie, and webhook integrations. Fits into your existing incident response workflow.' },
]

const comparison = [
  { feature: 'Self-healing', echo: 'AI auto-repair', pagerduty: 'Alert routing', datadog: 'Watchdog alerts', betteruptime: 'No' },
  { feature: 'Root cause AI', echo: 'Log + deploy correlation', pagerduty: 'Event intelligence', datadog: 'Watchdog RCA', betteruptime: 'No' },
  { feature: 'Auto-rollback', echo: 'Deployment regression', pagerduty: 'No', datadog: 'No', betteruptime: 'No' },
  { feature: 'Error templates', echo: 'GS343 learning library', pagerduty: 'Runbook links', datadog: 'No', betteruptime: 'No' },
  { feature: 'Dependency map', echo: 'Auto-discovery', pagerduty: 'Service graph', datadog: 'Service map', betteruptime: 'No' },
  { feature: 'Runbook automation', echo: 'Full workflow engine', pagerduty: 'Rundeck integration', datadog: 'Workflows', betteruptime: 'No' },
  { feature: 'Health checks', echo: '30s intervals global', pagerduty: 'No (alert only)', datadog: 'Synthetic', betteruptime: '30s intervals' },
  { feature: 'SLA tracking', echo: 'Built-in reports', pagerduty: 'Analytics add-on', datadog: 'SLO tracking', betteruptime: 'Status pages' },
  { feature: 'Multi-cloud', echo: 'CF + AWS + GCP + Azure', pagerduty: 'Any (alert routing)', datadog: 'Full stack', betteruptime: 'HTTP only' },
  { feature: 'Cost-aware scaling', echo: 'Budget constraints', pagerduty: 'No', datadog: 'No', betteruptime: 'No' },
  { feature: 'Starting price', echo: '$39/mo', pagerduty: '$21/user/mo', datadog: '$15/host/mo', betteruptime: '$20/mo' },
]

export default function PhoenixCloudPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#dc2626'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Phoenix Cloud', href: '/phoenix-cloud' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #dc2626, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Phoenix Cloud</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Infrastructure that heals itself. AI detects errors, diagnoses root causes, and executes repairs automatically — rollbacks, restarts, scaling, and custom workflows. Zero-downtime resilience.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=phoenix-cloud&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Infrastructure That Never Goes Down</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>PagerDuty</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Datadog</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Better Uptime</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.pagerduty}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.datadog}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.betteruptime}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$39', period: '/mo', features: ['10 monitored services', '30s health checks', 'Auto-restart on failure', 'Slack/email alerts', 'Incident timeline', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$129', period: '/mo', features: ['50 services', 'AI root cause analysis', 'Auto-rollback', 'GS343 error templates', 'Dependency mapping', 'Runbook automation', 'SLA monitoring', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$349', period: '/mo', features: ['Unlimited services', 'Full self-healing AI', 'Multi-cloud monitoring', 'Cost-aware scaling', 'Custom repair workflows', 'PagerDuty + Datadog', 'Team management', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=phoenix-cloud&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
