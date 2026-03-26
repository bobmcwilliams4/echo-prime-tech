'use client'

import ProductDoc from '@/components/ProductDoc'

const data = {
  name: 'Incident Manager',
  tagline: 'AI-powered incident response — automated escalation, structured timelines, SLA tracking, and blameless post-mortems.',
  accent: '#dc2626',
  productUrl: '/sentinel',
  workerUrl: 'https://echo-incident-manager.bmcii1976.workers.dev',
  version: '1.5.0',

  overview: [
    'Incident Manager handles the full lifecycle of production incidents — from detection and escalation through resolution and post-mortem. It replaces the chaos of manual war rooms with structured timelines, automated escalation chains, SLA tracking, and AI-generated post-mortems that actually identify root causes. Incidents are created automatically from monitoring alerts or manually by responders, and the system takes care of the rest.',
    'The escalation engine guarantees that critical incidents never go unanswered. P0 incidents auto-escalate through a configurable chain of responders using phone call, SMS, Slack, and PagerDuty — cycling through tiers until acknowledged. Every action, discovery, and decision is logged to an immutable timeline that becomes the factual record for post-mortem analysis. No more reconstructing what happened from memory and chat logs.',
    'After resolution, the AI post-mortem engine reads the full incident timeline, correlated deployment events, and monitoring data to generate a structured blameless post-mortem within 5 minutes. It identifies the triggering event chain, constructs a 5-whys analysis, calculates customer impact, and produces a corrective action list with suggested owners and deadlines. The system also builds a pattern library — when the same type of incident recurs, responders are immediately shown the previous resolution path.',
  ],

  gettingStarted: [
    { step: 1, title: 'Define Your Services', desc: 'Create a service catalog listing every system that can have incidents. Assign owners, team channels, and on-call schedules per service. Services are the core organizational unit — all incidents link to one or more services.' },
    { step: 2, title: 'Build Escalation Chains', desc: 'For each service, define an escalation chain: who gets paged first, how long before escalating, who is next, and so on. Configure contact methods (phone, SMS, Slack DM, PagerDuty) with priority order per person.' },
    { step: 3, title: 'Connect Monitoring Tools', desc: 'Add incoming webhook integrations from your monitoring stack. Map alert sources to services and configure severity auto-detection rules based on alert name patterns or thresholds. Supported: Datadog, Prometheus, Grafana, New Relic, PagerDuty.' },
    { step: 4, title: 'Create a Status Page', desc: 'Enable the public or internal status page to keep stakeholders informed automatically. Status page updates as incident status changes. Subscribe options for end users via email or webhook.' },
    { step: 5, title: 'Configure Notification Channels', desc: 'Connect Slack workspaces, email distribution lists, SMS numbers, and PagerDuty services. Set which channels receive which severity levels and in what format.' },
  ],

  features: [
    { title: 'Automated Severity Classification', desc: 'Monitoring alerts are automatically classified into P0-P3 severity based on metric values, historical impact of similar alerts, and service dependency criticality. P0 (complete outage) through P3 (minor issue) each have distinct escalation timeouts, notification audiences, and SLA targets.' },
    { title: 'Multi-Tier Escalation Engine', desc: 'Configurable escalation chains with up to 5 tiers per service. P0 incidents escalate to the next tier within 2 minutes if unacknowledged. P1 escalates after 15 minutes. Escalation uses phone call first, then SMS, then Slack DM, then email — in configurable priority order per responder.' },
    { title: 'War Room Creation', desc: 'P0 and P1 incidents automatically create a dedicated Slack channel with all initial responders added, a pinned incident brief, and links to relevant dashboards. The channel is archived after post-mortem completion and linked to the incident record.' },
    { title: 'Immutable Timeline', desc: 'Every action, discovery, status change, and decision is logged to an immutable timeline with second-level timestamp. Timelines cannot be edited or deleted. They become the factual record for post-mortems, SLA reporting, and compliance audits.' },
    { title: 'SLA Tracking', desc: 'Per-severity SLA targets for time-to-acknowledge and time-to-resolve. Real-time countdown visible to all responders. Breach alerts fire at configurable thresholds (50%, 75%, 100% of SLA elapsed). Monthly SLA compliance reports generated automatically.' },
    { title: 'AI Post-Mortem Generation', desc: 'Within 5 minutes of resolution, the AI generates a structured blameless post-mortem: root cause analysis, 5-whys chain, impact calculation, timeline summary, and corrective action items. Human review is required before publishing. Post-mortems are searchable in the knowledge base.' },
    { title: 'Pattern Recognition', desc: 'The system builds a pattern library from resolved incidents. When a new incident matches a known pattern, responders are shown the previous resolution path as a suggested guide. Pattern matching reduces MTTR on recurring incident types.' },
    { title: 'On-Call Management', desc: 'Rotation schedules per team with override support, fair distribution tracking, and on-call burden analytics. Responders see their upcoming on-call windows in the mobile app and web dashboard. Calendar sync available for Google Calendar and Outlook.' },
    { title: 'Status Page', desc: 'Public or internal status page with service component health indicators, incident history, and subscriber notifications. Automatically updated as incident status changes. Customizable per brand with custom domain support.' },
    { title: 'Monitoring Integrations', desc: 'Native integrations with Datadog, Prometheus alertmanager, PagerDuty, OpsGenie, Grafana, New Relic, Sentry, and CloudWatch. Incoming webhooks configured per monitoring source with severity mapping and service routing rules.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/incidents', desc: 'Create a new incident. Accepts title, severity, affected services, description, and initial responder list.', auth: true },
    { method: 'GET', path: '/api/incidents', desc: 'List incidents filtered by status, severity, date range, and affected service.', auth: true },
    { method: 'PATCH', path: '/api/incidents/:id', desc: 'Update incident status (investigating, identified, mitigating, resolved), add notes, or reassign responders.', auth: true },
    { method: 'POST', path: '/api/incidents/:id/timeline', desc: 'Add a timeline event — status update, action taken, or discovery note. Timestamps are immutable after creation.', auth: true },
    { method: 'POST', path: '/api/incidents/:id/postmortem', desc: 'Trigger AI post-mortem generation. Returns structured report with root cause, impact, timeline, and action items.', auth: true },
    { method: 'GET', path: '/api/oncall/schedule', desc: 'Current on-call schedule with escalation chains, contact methods, and rotation periods.', auth: true },
    { method: 'POST', path: '/api/oncall/page', desc: 'Page the on-call responder for a specific service or escalation tier. Returns acknowledgment status.', auth: true },
    { method: 'GET', path: '/api/incidents/metrics', desc: 'MTTD, MTTR, incident count, SLA compliance, and on-call burden metrics for a specified time period.', auth: true },
  ],

  userGuide: [
    {
      id: 'incident-lifecycle',
      title: 'Incident Lifecycle',
      content: [
        'Incidents progress through six states: Detection, Investigating, Identified, Mitigating, Resolved, and Post-Mortem. Each state transition updates the status page, notifies stakeholders, and logs a timeline event automatically. Responders move incidents through states via the dashboard, mobile app, or Slack commands.',
        'Detection: Incident is created manually or via monitoring webhook. Title, severity, and affected services are required. Escalation begins immediately. Investigating: Responders paged. War room created. Timeline started. All responder notes logged. Identified: Root cause documented. ETA established. Mitigating: Active remediation. SLA countdown visible. Resolved: Service restored. Impact calculated. Post-Mortem triggered.',
        'The fastest path from Identified to Resolved is supported by the system showing previous resolution paths for matching incident patterns. For recurring incident types (database connection exhaustion, memory leak, deployment rollback), the pattern match typically surfaces within 60 seconds of the incident being created.',
      ],
    },
    {
      id: 'on-call',
      title: 'On-Call Schedules and Escalation',
      content: [
        'Create on-call schedules from Settings > On-Call. Schedules define rotation periods (weekly, bi-weekly, custom), the rotation order (alphabetical, reverse alphabetical, or custom), holiday overrides, and backup contacts. The schedule engine ensures exactly one primary on-call and one backup are always assigned per service.',
        'Escalation chains are defined per service and per severity level. A typical chain: Tier 1 (primary on-call, 2 min timeout for P0), Tier 2 (secondary on-call, 4 min timeout), Tier 3 (team lead, 6 min timeout), Tier 4 (engineering manager, 10 min timeout). Each tier tries all contact methods in priority order before moving to the next tier.',
        'Override the on-call schedule for vacations or emergencies from Settings > Overrides. Enter the override person, affected time window, and which services to cover. The override person receives all pages during their override window. Overrides are logged in the schedule history for audit purposes.',
      ],
    },
    {
      id: 'postmortems',
      title: 'Post-Mortem Process',
      content: [
        'After a P0 or P1 incident resolves, the AI generates an initial post-mortem draft within 5 minutes. The draft includes: an executive summary, full incident timeline, 5-whys root cause analysis, customer impact calculation (duration, affected user percentage, estimated revenue impact), and a corrective action list with suggested owners.',
        'All generated post-mortems must be reviewed and approved by the incident commander before publishing. Reviewers can edit any section of the draft, add context, reassign action items, and mark specific findings as sensitive (excluded from the public version). The post-mortem editor tracks changes with author attribution.',
        'Published post-mortems are indexed in the incident knowledge base and searchable by service, date, root cause category, and action item owner. Action items are tracked to completion with due date reminders and owner notifications. Post-mortem trends across the organization surface in the monthly engineering health report.',
      ],
    },
    {
      id: 'integrations',
      title: 'Monitoring Tool Integrations',
      content: [
        'Monitoring integrations let your existing alerting tools automatically create incidents. Each integration is configured with a webhook URL that receives alerts, severity mapping rules (alert name or threshold to P0-P3 severity), service routing rules (which service does this alert belong to), and deduplication logic (what makes two alerts the same incident).',
        'For Datadog, configure a webhook notification channel pointing to your Incident Manager webhook URL. Map Datadog alert states (Triggered, Recovered) to incident creation and resolution events. Use Datadog tags to route alerts to specific services. The integration pulls metric graphs from Datadog and embeds them in the incident timeline automatically.',
        'Prometheus alertmanager uses the alertmanager webhook receiver. Configure your alertmanager.yml to send alerts to the Incident Manager webhook. Use alert labels (severity, team, service) to drive severity mapping and service routing. Alert annotations (summary, description, runbook_url) populate the incident description and timeline.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Severity Classification', desc: 'Incoming monitoring alerts are classified into P0-P3 using a model trained on historical alert-to-impact mappings. The model considers metric values, time of day, affected service tier, current concurrent alert count, and historical impact of the same alert type. Classification accuracy exceeds 91% against analyst-validated ground truth.' },
    { capability: 'Timeline Summarization', desc: 'During long-running incidents, the AI generates situation reports every 30 minutes for incoming responders and executives. Reports synthesize the full timeline into a 3-5 sentence summary: what happened, what was tried, what is currently happening, and what the ETA is. Generated from raw timeline events — no responder effort required.' },
    { capability: 'Post-Mortem Generation', desc: 'The post-mortem engine reads every timeline event, responder note, monitoring metric (pulled via integration APIs), deployment event in the incident window, and related previous incidents. It outputs a complete blameless post-mortem in Google SRE format with 5-whys analysis, corrective actions, and follow-up monitoring recommendations.' },
    { capability: 'Incident Pattern Matching', desc: 'New incidents are compared against the pattern library using embedding similarity. When a match is found (same services, similar symptom description, similar alert signature), responders see the previous incident card with its resolution steps. Pattern matching has reduced MTTR by an average of 34% on recurring incident types in production.' },
    { capability: 'Burnout Risk Scoring', desc: 'Analyzes on-call burden data per responder: incidents per rotation, after-hours incidents, average acknowledgment response time, and consecutive on-call weeks. Generates a burnout risk score updated weekly. Scores above the warning threshold surface in the engineering manager dashboard with rotation adjustment suggestions.' },
  ],

  troubleshooting: [
    { issue: 'Monitoring webhook not creating incidents', solution: 'Verify the webhook URL is correct in your monitoring tool configuration. Test with the "Send Test Alert" button from Settings > Integrations. Check the integration log for HTTP response codes — a 401 means the API key is missing or wrong, a 422 means the payload format does not match the expected schema. Review severity mapping rules to ensure the alert severity maps to a P-level, not silently filtered.' },
    { issue: 'Escalation not reaching responders', solution: 'Check the on-call schedule for the affected service to verify a responder is assigned. Review the escalation chain to confirm contact methods are configured. Test contact method delivery from Settings > On-Call > Test Notification. If using PagerDuty as a contact method, verify the PagerDuty integration key is valid and the PagerDuty service is active.' },
    { issue: 'Post-mortem generation is taking longer than 5 minutes', solution: 'Post-mortem generation time scales with incident duration and timeline event count. Incidents longer than 8 hours with 100+ timeline events may take 10-15 minutes. Generation time is also affected if monitoring integration APIs are slow to return metric data. The draft appears as soon as all data is collected — check the incident page for a progress indicator.' },
    { issue: 'Status page not updating with incident status changes', solution: 'Verify that the affected service components are linked to the incident. Status page components only update when explicitly linked to an incident — an incident without linked components will not affect the status page display. Check Settings > Status Page > Components to confirm components are configured and linked to services.' },
  ],

  faq: [
    { q: 'How does the auto-escalation work?', a: 'Each severity level has a configurable acknowledgment timeout. If a P0 incident is not acknowledged within 2 minutes, the system automatically pages the next responder in the escalation chain. It continues escalating through all configured tiers until acknowledged. Escalation chains support phone call, SMS, Slack, PagerDuty, and email — in priority order.' },
    { q: 'Can Incident Manager integrate with our existing monitoring tools?', a: 'Yes. Incidents can be created automatically from Datadog, Prometheus alertmanager, PagerDuty, OpsGenie, Grafana, New Relic, and any system that supports webhook outbound alerts. Incoming webhooks are configured per service with severity mapping rules.' },
    { q: 'How does the AI post-mortem generation work?', a: 'When you trigger a post-mortem, the AI reads the full incident timeline, all status updates, and the responder notes. It identifies the root cause pattern, constructs a 5-whys analysis, calculates total impact (duration, affected users, estimated revenue), and generates a structured report with corrective action items. Post-mortems follow the blameless SRE format and are editable before publishing.' },
    { q: 'How is SLA tracking handled?', a: 'Each incident severity level has configurable SLA targets (time-to-acknowledge, time-to-resolve). The system tracks actual vs. target in real time and fires breach alerts as SLAs approach and pass. Monthly SLA compliance reports are generated automatically and can be exported for customer commitments.' },
    { q: 'Can we customize the incident notification templates?', a: 'Yes. All notification templates for Slack, email, SMS, and status pages are fully customizable with Handlebars syntax. Variables include incident title, severity, affected services, current status, responder list, timeline summary, and time elapsed. Different templates can be configured per severity level and notification channel.' },
  ],
}

export default function IncidentManagerDocsPage() {
  return <ProductDoc {...data} />
}
