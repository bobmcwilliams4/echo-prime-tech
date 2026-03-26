'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  {
    q: 'How does AI-powered incident escalation work?',
    a: 'Define escalation rules with severity thresholds and time windows. When an incident exceeds its response SLA, the system automatically escalates to the next tier — notifying the right on-call engineer via Alert Router integration.',
  },
  {
    q: 'What is an incident post-mortem?',
    a: 'After resolving an incident, the system generates a structured post-mortem template covering root cause, impact, timeline, action items, and preventive measures. Teams fill in details collaboratively, creating a permanent record that prevents repeat outages.',
  },
  {
    q: 'Can I integrate with my existing monitoring tools?',
    a: 'Yes. The REST API accepts webhook payloads from Datadog, Grafana, Prometheus, Sentry, and any tool that can POST JSON. Incidents are auto-created with the right severity and assigned to the correct team.',
  },
  {
    q: 'How does severity classification work?',
    a: 'Four severity levels (P1-P4) with configurable SLAs per level. The system tracks response time and resolution time against SLA targets, flagging breaches in real-time.',
  },
  {
    q: 'Is there an on-call schedule?',
    a: 'Escalation rules define who gets notified at each tier and when. Combined with the Alert Router service binding, notifications reach the right person via email, Slack, or webhook within seconds of detection.',
  },
]

const features = [
  { title: 'Incident Lifecycle', desc: 'Full workflow from creation through investigation, escalation, resolution, and closure with automatic state machine transitions.' },
  { title: 'AI Escalation Rules', desc: 'Configurable multi-tier escalation with automatic promotion when SLAs are breached. No incident falls through the cracks.' },
  { title: 'Timeline Tracking', desc: 'Chronological event log for every incident — who did what, when, and why. Perfect audit trail for compliance.' },
  { title: 'Post-Mortem Reports', desc: 'Structured blameless post-mortems with root cause, impact analysis, timeline, action items, and preventive measures.' },
  { title: 'Severity Classification', desc: 'P1-P4 severity levels with per-level SLA targets for response and resolution time. Real-time breach alerts.' },
  { title: 'Incident Tags', desc: 'Tag incidents by service, team, root cause type, or any custom taxonomy for powerful filtering and trend analysis.' },
  { title: 'Metrics Dashboard', desc: 'MTTR, MTTD, incident volume by severity, SLA compliance rate, and trend analysis — all computed in real-time.' },
  { title: 'Active Incident Board', desc: 'Live view of all open incidents sorted by severity. One-glance situational awareness for your entire infrastructure.' },
  { title: 'Webhook Ingestion', desc: 'Accept alerts from any monitoring tool via REST API. Auto-create incidents with correct severity and assignment.' },
  { title: 'Alert Router Integration', desc: 'Service binding to Echo Alert Router for multi-channel notifications — email, Slack, webhooks, and SMS.' },
  { title: 'Reopen & Track', desc: 'Resolved incidents can be reopened if issues recur. Full history preserved across the incident lifecycle.' },
  { title: 'Export & Reporting', desc: 'Export incident data, post-mortems, and metrics for executive reporting, compliance audits, and trend analysis.' },
]

const comparison = [
  { feature: 'Incident lifecycle', echo: 'Full state machine', pagerduty: 'Full', opsgenie: 'Full', statuspage: 'Limited' },
  { feature: 'AI escalation', echo: 'Auto + configurable', pagerduty: 'Rule-based', opsgenie: 'Rule-based', statuspage: 'No' },
  { feature: 'Post-mortem reports', echo: 'Structured + AI', pagerduty: 'Basic', opsgenie: 'Basic', statuspage: 'No' },
  { feature: 'Timeline tracking', echo: 'Granular events', pagerduty: 'Activity log', opsgenie: 'Activity log', statuspage: 'Updates only' },
  { feature: 'Severity SLAs', echo: 'P1-P4 + breach alerts', pagerduty: 'Urgency levels', opsgenie: 'Priority levels', statuspage: 'No' },
  { feature: 'Metrics (MTTR/MTTD)', echo: 'Real-time computed', pagerduty: 'Analytics add-on', opsgenie: 'Reports', statuspage: 'No' },
  { feature: 'Webhook ingestion', echo: 'Any JSON payload', pagerduty: '700+ integrations', opsgenie: '200+ integrations', statuspage: 'Limited' },
  { feature: 'Multi-channel alerts', echo: 'Alert Router binding', pagerduty: 'Built-in', opsgenie: 'Built-in', statuspage: 'Email only' },
  { feature: 'Incident tags', echo: 'Unlimited custom', pagerduty: 'Labels', opsgenie: 'Tags', statuspage: 'Components' },
  { feature: 'Status page', echo: 'Echo Status Page add-on', pagerduty: 'Separate product', opsgenie: 'Separate product', statuspage: 'Core product' },
  { feature: 'API-first', echo: 'Full REST', pagerduty: 'Full REST', opsgenie: 'Full REST', statuspage: 'REST' },
  { feature: 'Setup time', echo: '< 5 minutes', pagerduty: 'Hours', opsgenie: 'Hours', statuspage: 'Minutes' },
  { feature: 'Starting price', echo: '$19/mo', pagerduty: '$25/user/mo', opsgenie: '$9/user/mo', statuspage: '$29/mo' },
]

export default function IncidentManagerPage() {
  const { isDark } = useTheme()
  const dark = isDark

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Incident Manager', href: '/incident-manager' }]} />
      <FaqSchema faqs={faqs} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>

        {/* Hero */}
        <section data-tutorial="im-hero" style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Echo Incident Manager
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>
            From alert to post-mortem in one platform. AI-powered escalation, timeline tracking,
            severity SLAs, and blameless post-mortems — so your team resolves faster and learns from every incident.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=incident-manager&tier=starter" style={{ padding: '14px 32px', background: '#ef4444', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              Start Free Trial
            </a>
            <a href="#pricing" style={{ padding: '14px 32px', border: '2px solid #ef4444', color: '#ef4444', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              View Pricing
            </a>
          </div>
        </section>

        {/* Features */}
        <section data-tutorial="im-features" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Complete Incident Response Platform</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#ef4444' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section data-tutorial="im-comparison" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: '#ef4444', fontWeight: 800 }}>Echo</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>PagerDuty</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>OpsGenie</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Statuspage</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>{row.echo}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.pagerduty}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.opsgenie}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.statuspage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" data-tutorial="im-pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$19', period: '/mo', features: ['10 active incidents', 'P1-P4 severity levels', 'Timeline tracking', 'Basic escalation rules', 'Email notifications', 'API access'], cta: 'starter' },
              { tier: 'Professional', price: '$59', period: '/mo', features: ['Unlimited incidents', 'AI escalation rules', 'Post-mortem reports', 'MTTR/MTTD metrics', 'Webhook ingestion', 'Alert Router integration', 'Incident tags', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$149', period: '/mo', features: ['Unlimited everything', 'Custom severity levels', 'Advanced analytics', 'SLA breach alerts', 'Multi-team routing', 'Compliance exports', 'Service bindings', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? '2px solid #ef4444' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
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
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={`/checkout?service=incident-manager&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? '#ef4444' : 'transparent', color: plan.popular ? '#fff' : '#ef4444', border: plan.popular ? 'none' : '2px solid #ef4444', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
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
