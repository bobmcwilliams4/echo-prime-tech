'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTheme } from '../../../lib/theme-context'
import BreadcrumbSchema from '../../../components/BreadcrumbSchema'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'lifecycle', label: 'Incident Lifecycle' },
  { id: 'escalation', label: 'Escalation & On-Call' },
  { id: 'ai-guide', label: 'AI Guide' },
  { id: 'api', label: 'API Reference' },
  { id: 'faq', label: 'FAQ' },
]

const SEVERITY_LEVELS = [
  { level: 'P0 — Critical', color: '#ef4444', desc: 'Complete service outage or data loss. Auto-escalates to on-call lead within 2 minutes. War room created automatically.' },
  { level: 'P1 — High', color: '#f97316', desc: 'Major functionality impaired. Core features unavailable for a significant user segment. Escalates after 15 minutes without acknowledgment.' },
  { level: 'P2 — Medium', color: '#eab308', desc: 'Partial degradation with workaround available. Escalates after 1 hour. Included in daily digest.' },
  { level: 'P3 — Low', color: '#22c55e', desc: 'Minor issue with minimal user impact. Tracked and resolved during business hours. Included in weekly report.' },
]

const API_ENDPOINTS = [
  { method: 'POST', path: '/api/incidents', desc: 'Create a new incident. Accepts title, severity, affected services, description, and initial responder list.' },
  { method: 'GET', path: '/api/incidents', desc: 'List incidents filtered by status, severity, date range, and affected service.' },
  { method: 'PATCH', path: '/api/incidents/:id', desc: 'Update incident status (investigating, identified, mitigating, resolved), add notes, or reassign responders.' },
  { method: 'POST', path: '/api/incidents/:id/timeline', desc: 'Add a timeline event — status update, action taken, or discovery note. Timestamps are immutable after creation.' },
  { method: 'POST', path: '/api/incidents/:id/postmortem', desc: 'Trigger AI post-mortem generation. Returns structured report with root cause, impact, timeline, and action items.' },
  { method: 'GET', path: '/api/oncall/schedule', desc: 'Current on-call schedule with escalation chains, contact methods, and rotation periods.' },
  { method: 'POST', path: '/api/oncall/page', desc: 'Page the on-call responder for a specific service or escalation tier. Returns acknowledgment status.' },
]

const FAQS = [
  { q: 'How does the auto-escalation work?', a: 'Each severity level has a configurable acknowledgment timeout. If a P0 incident is not acknowledged within 2 minutes, the system automatically pages the next responder in the escalation chain. It continues escalating through all configured tiers until acknowledged. Escalation chains support phone call, SMS, Slack, PagerDuty, and email — in priority order.' },
  { q: 'Can Incident Manager integrate with our existing monitoring tools?', a: 'Yes. Incidents can be created automatically from Datadog, Prometheus alertmanager, PagerDuty, OpsGenie, Grafana, New Relic, and any system that supports webhook outbound alerts. Incoming webhooks are configured per service with severity mapping rules.' },
  { q: 'How does the AI post-mortem generation work?', a: 'When you trigger a post-mortem, the AI reads the full incident timeline, all status updates, and the responder notes. It identifies the root cause pattern, constructs a 5-whys analysis, calculates total impact (duration, affected users, estimated revenue), and generates a structured report with corrective action items. Post-mortems follow the blameless SRE format and are editable before publishing.' },
  { q: 'How is SLA tracking handled?', a: 'Each incident severity level has configurable SLA targets (time-to-acknowledge, time-to-resolve). The system tracks actual vs. target in real time and fires breach alerts as SLAs approach and pass. Monthly SLA compliance reports are generated automatically and can be exported for customer commitments.' },
  { q: 'Can we customize the incident notification templates?', a: 'Yes. All notification templates for Slack, email, SMS, and status pages are fully customizable with Handlebars syntax. Variables include incident title, severity, affected services, current status, responder list, timeline summary, and time elapsed. Different templates can be configured per severity level and notification channel.' },
]

export default function IncidentManagerDocsPage() {
  const { isDark } = useTheme()
  const [active, setActive] = useState('overview')

  const sectionStyle = { backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }
  const headingColor = { color: 'var(--ept-text)' }
  const bodyColor = { color: 'var(--ept-text-secondary)' }
  const mutedColor = { color: 'var(--ept-text-muted)' }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: 'Incident Manager', href: '/docs/incident-manager' },
      ]} />

      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={36} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="text-lg font-bold" style={headingColor}>Incident Manager Docs</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/docs" className="text-sm font-medium" style={mutedColor}>All Docs</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ backgroundColor: active === s.id ? 'var(--ept-accent)' : 'var(--ept-surface)', color: active === s.id ? '#fff' : 'var(--ept-text-muted)' }}>
              {s.label}
            </button>
          ))}
        </div>

        {active === 'overview' && (
          <section className="space-y-6 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-extrabold" style={headingColor}>Incident Manager</h1>
            <p style={bodyColor}>Incident Manager handles the full lifecycle of production incidents — from detection and escalation through resolution and post-mortem. It replaces the chaos of manual war rooms with structured timelines, automated escalation chains, SLA tracking, and AI-generated post-mortems that actually identify root causes.</p>
            <div className="space-y-3">
              <h3 className="font-bold" style={headingColor}>Severity Levels</h3>
              {SEVERITY_LEVELS.map(s => (
                <div key={s.level} className="p-4 rounded-xl border flex gap-4 items-start" style={sectionStyle}>
                  <span className="px-2 py-1 rounded text-xs font-bold text-white shrink-0" style={{ backgroundColor: s.color }}>{s.level}</span>
                  <p className="text-sm" style={bodyColor}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === 'getting-started' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Getting Started</h2>
            <div className="space-y-4">
              {[
                { n: 1, t: 'Define Your Services', d: 'Create a service catalog listing every system that can have incidents. Assign owners, team channels, and on-call schedules per service. Services are the core organizational unit — all incidents link to one or more services.' },
                { n: 2, t: 'Build Escalation Chains', d: 'For each service, define an escalation chain: who gets paged first, how long before escalating, who is next, and so on. Configure contact methods (phone, SMS, Slack DM, PagerDuty) with priority order per person.' },
                { n: 3, t: 'Connect Monitoring Tools', d: 'Add incoming webhook integrations from your monitoring stack. Map alert sources to services and configure severity auto-detection rules based on alert name patterns or thresholds.' },
                { n: 4, t: 'Create a Status Page', d: 'Enable the public or internal status page to keep stakeholders informed automatically. Status page updates as incident status changes. Subscribe options for end users via email or webhook.' },
                { n: 5, t: 'Configure Notification Channels', d: 'Connect Slack workspaces, email distribution lists, SMS numbers, and PagerDuty services. Set which channels receive which severity levels and in what format.' },
              ].map(s => (
                <div key={s.n} className="p-5 rounded-xl border flex gap-4" style={sectionStyle}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: 'var(--ept-accent)' }}>{s.n}</span>
                  <div>
                    <h3 className="font-bold mb-1" style={headingColor}>{s.t}</h3>
                    <p className="text-sm" style={bodyColor}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === 'lifecycle' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Incident Lifecycle</h2>
            <div className="space-y-3">
              {[
                { phase: 'Detection', desc: 'Incident created manually, via monitoring webhook, or by a responder. Title, severity, and affected services are required at creation. Optional: initial responder, description, customer impact statement.' },
                { phase: 'Investigating', desc: 'Responders are paged. War room channel created in Slack. Timeline begins. All actions and discoveries logged as timeline events. Stakeholder notifications sent with initial impact assessment.' },
                { phase: 'Identified', desc: 'Root cause identified and documented in the timeline. Impact scope confirmed. Mitigation plan established. Stakeholders updated with ETA for resolution.' },
                { phase: 'Mitigating', desc: 'Active work to resolve the incident. Progress updates posted to timeline. SLA countdown visible to all responders. Automated reminders if no timeline update in 30 minutes.' },
                { phase: 'Resolved', desc: 'Service restored. Resolution summary written. Impact metrics calculated (duration, affected users). Post-mortem triggered automatically for P0/P1 incidents.' },
                { phase: 'Post-Mortem', desc: 'AI generates initial post-mortem draft within 5 minutes of resolution. Responders review, edit, and add context. Action items assigned with owners and due dates. Post-mortem published to knowledge base.' },
              ].map((p, i) => (
                <div key={p.phase} className="p-4 rounded-xl border flex gap-4" style={sectionStyle}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: 'var(--ept-accent)' }}>{i + 1}</span>
                  <div>
                    <span className="font-bold text-sm" style={headingColor}>{p.phase}</span>
                    <p className="text-sm mt-1" style={bodyColor}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === 'escalation' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Escalation and On-Call</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { t: 'Rotation Schedules', d: 'Define weekly, bi-weekly, or custom rotation schedules per team. Override scheduling for holidays and time-off. The schedule ensures someone is always on-call without manual tracking.' },
                { t: 'Multi-Tier Escalation', d: 'Define up to 5 escalation tiers per service. Each tier has a configurable timeout. If tier 1 does not acknowledge, tier 2 is paged. Escalation continues until acknowledged or all tiers exhausted.' },
                { t: 'Contact Methods', d: 'Each responder configures priority contact methods: phone call (highest priority), SMS, Slack DM, email. The system tries methods in order until a response is received.' },
                { t: 'Acknowledgment Tracking', d: 'Acknowledgment is a one-click action in the Slack notification, mobile app, or web dashboard. Acknowledgment time is logged and counted toward SLA metrics.' },
                { t: 'Override Handling', d: 'Manually override the on-call schedule for a specific time window. Overrides are logged. The override person receives all pages during their override period.' },
                { t: 'On-Call Analytics', d: 'Track on-call burden per person: incidents handled, average acknowledgment time, pages per rotation, and after-hours incidents. Helps identify burnout risk and schedule imbalances.' },
              ].map(c => (
                <div key={c.t} className="p-4 rounded-xl border" style={sectionStyle}>
                  <h4 className="font-bold text-sm mb-1" style={headingColor}>{c.t}</h4>
                  <p className="text-xs" style={bodyColor}>{c.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === 'ai-guide' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>AI Guide — How Incident Manager Works</h2>
            <div className="space-y-4">
              {[
                { t: 'Automated Incident Classification', d: 'When a monitoring alert triggers an incident, the AI classifies severity based on the alert\'s metric values, historical impact of similar alerts, and current service dependency graph. Classification is a recommendation — the first responder can override. The model improves as responders correct misclassifications.' },
                { t: 'Timeline Summarization', d: 'During a long-running incident, the AI summarizes the timeline into a concise situation report for incoming responders and executives. The summary is regenerated every 30 minutes with the latest updates, so a responder joining a 3-hour incident gets up to speed in 30 seconds.' },
                { t: 'Post-Mortem Generation', d: 'The post-mortem engine reads every timeline event, responder note, metric anomaly (pulled from monitoring integrations), and deployment event in the incident window. It constructs a 5-whys analysis, identifies the triggering event chain, and writes a structured blameless post-mortem using the Google SRE format as the template. Human review is always required before publishing.' },
                { t: 'Pattern Recognition', d: 'Over time, the system builds a pattern library from resolved incidents. When a new incident matches a known pattern (same services, similar alert signature, same time of day), responders are shown the previous incident\'s resolution path as a suggested remediation guide — reducing MTTR on recurring issues.' },
              ].map(s => (
                <div key={s.t} className="p-5 rounded-xl border" style={sectionStyle}>
                  <h3 className="font-bold mb-2" style={headingColor}>{s.t}</h3>
                  <p className="text-sm" style={bodyColor}>{s.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === 'api' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>API Reference</h2>
            <p style={bodyColor}>All endpoints require <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>Authorization: Bearer &lt;token&gt;</code>. Base URL: <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>https://echo-sdk-gateway.bmcii1976.workers.dev/incidents</code></p>
            <div className="space-y-3">
              {API_ENDPOINTS.map(ep => (
                <div key={ep.path} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start gap-3" style={sectionStyle}>
                  <span className="px-2 py-0.5 rounded text-xs font-bold font-mono shrink-0"
                    style={{ backgroundColor: ep.method === 'GET' ? 'rgba(16,185,129,0.15)' : ep.method === 'POST' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                      color: ep.method === 'GET' ? '#10b981' : ep.method === 'POST' ? '#3b82f6' : '#f59e0b' }}>
                    {ep.method}
                  </span>
                  <div>
                    <code className="text-sm font-mono font-bold" style={headingColor}>{ep.path}</code>
                    <p className="text-xs mt-1" style={bodyColor}>{ep.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === 'faq' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map(f => (
                <div key={f.q} className="p-5 rounded-xl border" style={sectionStyle}>
                  <h3 className="font-semibold mb-2 text-sm" style={headingColor}>{f.q}</h3>
                  <p className="text-sm" style={bodyColor}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 text-center">
          <Link href="/pricing" className="px-6 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105 inline-block" style={{ backgroundColor: 'var(--ept-accent)' }}>
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
