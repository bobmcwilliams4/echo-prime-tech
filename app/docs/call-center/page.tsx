'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Call Center',
  tagline: 'AI-powered call center — IVR, queue management, call routing, analytics, and workforce optimization.',
  accent: '#7c3aed',
  productUrl: '/call-center',
  workerUrl: 'https://echo-call-center.bmcii1976.workers.dev',
  version: '3.4.0',

  overview: [
    'Echo Call Center is a comprehensive AI-driven contact center platform built for businesses of every size. It unifies voice, SMS, and live chat into a single pane of glass so agents never miss a customer interaction. Intelligent call routing uses real-time skill matching, queue depth, and caller history to connect every inbound contact with the best available agent in under three seconds.',
    'The platform ships with a drag-and-drop IVR builder, real-time dashboards, call recording with automatic transcription, quality scoring powered by sentiment analysis, and post-call surveys that feed directly into coaching workflows. Managers get a live wall-board view of every queue, SLA timer, and agent state — plus historical analytics that expose trends across hours, days, and seasons.',
    'Beyond day-to-day operations, Echo Call Center delivers workforce optimization tools including AI-driven demand forecasting, shift scheduling recommendations, agent gamification with leaderboards, and automated break enforcement. Whether you run a five-seat support desk or a five-hundred-seat sales floor, the platform scales elastically on Cloudflare Workers with zero cold starts and global edge latency.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Tenant', desc: 'Sign up at echo-ept.com/call-center and create a new tenant. Each tenant is a fully isolated call center environment with its own phone numbers, agents, queues, and analytics.' },
    { step: 2, title: 'Configure Phone Numbers', desc: 'Provision local, toll-free, or international numbers from the Numbers dashboard. Assign each number to an inbound queue or IVR entry point. Port existing numbers in under 48 hours.' },
    { step: 3, title: 'Build Your IVR Flow', desc: 'Open the drag-and-drop IVR Builder to create call flows. Add greeting prompts, menu options, skill-based routing nodes, voicemail drops, and callback offers. Preview the flow with a test call before publishing.' },
    { step: 4, title: 'Add Agents & Assign Skills', desc: 'Invite agents by email and assign skill tags (e.g., billing, tech-support, spanish). Set proficiency levels from 1-10 for each skill. The routing engine uses these scores to match callers to the most qualified available agent.' },
    { step: 5, title: 'Set Business Hours & Holidays', desc: 'Define operating schedules per queue. Configure after-hours behavior — voicemail, overflow to another queue, or automated callback scheduling. Add holiday calendars that automatically activate alternate greetings.' },
    { step: 6, title: 'Launch & Monitor', desc: 'Publish your IVR, set queues to active, and start receiving calls. Open the real-time dashboard to monitor queue depth, wait times, agent states, and SLA compliance. Adjust routing weights on the fly as volume shifts.' },
  ],

  features: [
    { title: 'IVR Builder', desc: 'Drag-and-drop visual editor for building multi-level interactive voice response flows. Supports DTMF input, speech recognition, conditional branching, time-of-day routing, and API lookups mid-call to pull customer data.' },
    { title: 'Smart Call Routing', desc: 'AI-powered routing engine that matches inbound calls to agents using skill proficiency, queue priority, estimated wait time, caller history, and real-time sentiment from the IVR. Supports round-robin, longest-idle, and weighted distribution strategies.' },
    { title: 'Queue Management', desc: 'Create unlimited queues with independent SLA targets, priority levels, overflow rules, and maximum wait thresholds. Callers hear estimated wait times and can opt for a callback without losing their place in line.' },
    { title: 'Real-Time Dashboard', desc: 'Live wall-board view of every queue, agent state, active call, and SLA timer. Color-coded alerts fire when thresholds breach. Managers can whisper, barge, or silently monitor any active call with one click.' },
    { title: 'Call Recording', desc: 'Automatic recording of all inbound and outbound calls with configurable retention policies. Recordings are stored encrypted in R2, searchable by agent, date, duration, or quality score. PCI-compliant pause/resume for sensitive data.' },
    { title: 'Quality Scoring', desc: 'AI analyzes every call for sentiment, script adherence, talk-to-listen ratio, dead air, and resolution outcome. Each call receives a composite quality score from 0-100 that feeds into agent leaderboards and coaching workflows.' },
    { title: 'Post-Call Surveys', desc: 'Automated CSAT and NPS surveys delivered via IVR transfer or SMS after call completion. Survey responses link directly to the call record, agent profile, and quality score for 360-degree performance visibility.' },
    { title: 'Agent Notes & Dispositions', desc: 'Agents tag every call with a disposition code and free-text notes during wrap-up. Dispositions drive reporting segments, trigger follow-up workflows, and feed into the predictive dialer for outbound campaigns.' },
    { title: 'Business Hours & Holidays', desc: 'Per-queue operating schedules with timezone awareness. After-hours calls route to voicemail, overflow queues, or callback scheduling. Holiday calendars override normal schedules and play custom greetings.' },
    { title: 'Agent Skills & Proficiency', desc: 'Tag agents with unlimited skill categories and proficiency levels (1-10). The routing engine uses skill weights to match callers with the most qualified agent, reducing transfers and improving first-call resolution.' },
    { title: 'Canned Responses', desc: 'Library of pre-approved responses for chat and SMS channels. Agents insert canned responses with keyboard shortcuts, and AI suggests the best response based on conversation context and customer intent.' },
    { title: 'SMS Channel', desc: 'Two-way SMS support on every provisioned number. Conversations appear in the same agent workspace as voice calls. Auto-replies handle after-hours messages, and AI classifies inbound SMS by intent for smart routing.' },
    { title: 'Gamification', desc: 'Agent leaderboards ranked by quality score, calls handled, CSAT rating, and first-call resolution. Earn badges for milestones, compete in team challenges, and unlock rewards. Gamification data feeds into performance reviews.' },
    { title: 'Workforce Forecasting', desc: 'AI analyzes historical call volume patterns across hours, days, and seasons to predict future demand. Generates recommended staffing schedules, identifies overstaffing waste, and alerts managers to coverage gaps before they impact SLAs.' },
    { title: 'Conference Calls', desc: 'Agents can escalate any active call into a three-way or multi-party conference with supervisors, subject matter experts, or external parties. Conference participants are logged in the call record for full audit trail.' },
    { title: 'Knowledge Base', desc: 'Built-in searchable knowledge base that agents access without leaving the call screen. AI auto-suggests relevant articles based on the live conversation. Managers track which articles resolve the most calls and identify content gaps.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/calls/initiate', desc: 'Initiate an outbound call to a specified number with agent assignment and optional IVR flow override.', auth: true },
    { method: 'GET', path: '/api/calls/:id', desc: 'Retrieve call details including duration, recording URL, quality score, disposition, and agent notes.', auth: true },
    { method: 'GET', path: '/api/queues', desc: 'List all queues with real-time metrics: depth, average wait time, SLA compliance, and active agents.', auth: true },
    { method: 'PUT', path: '/api/queues/:id', desc: 'Update queue configuration including SLA targets, overflow rules, priority, and routing strategy.', auth: true },
    { method: 'GET', path: '/api/agents', desc: 'List all agents with current state (available, on-call, wrap-up, offline), skills, and daily stats.', auth: true },
    { method: 'PUT', path: '/api/agents/:id/skills', desc: 'Update agent skill tags and proficiency levels. Changes take effect on the next routing decision.', auth: true },
    { method: 'POST', path: '/api/ivr/flows', desc: 'Create or update an IVR flow definition. Accepts the visual builder JSON schema with nodes and edges.', auth: true },
    { method: 'GET', path: '/api/recordings/:callId', desc: 'Stream or download the encrypted call recording. Requires caller-consent compliance flag in tenant settings.', auth: true },
    { method: 'GET', path: '/api/analytics/summary', desc: 'Aggregated analytics for a date range: total calls, average handle time, abandonment rate, CSAT, FCR, and quality scores.', auth: true },
    { method: 'GET', path: '/api/analytics/agent/:id', desc: 'Per-agent performance metrics including calls handled, average quality score, CSAT, talk time, and wrap time.', auth: true },
    { method: 'POST', path: '/api/billing/usage', desc: 'Retrieve current billing period usage: minutes consumed, SMS sent, recordings stored, and projected cost.', auth: true },
    { method: 'GET', path: '/api/billing/invoices', desc: 'List past invoices with line-item detail for voice minutes, SMS, storage, phone number fees, and AI processing.', auth: true },
  ],

  userGuide: [
    {
      title: 'Setting Up Your Call Center',
      id: 'setup',
      content: [
        'After creating your tenant, the setup wizard walks you through four essential steps: provisioning phone numbers, creating your first queue, inviting agents, and publishing a basic IVR flow. Most teams complete initial setup in under 30 minutes.',
        'Each tenant operates in full isolation with dedicated phone numbers, agent pools, recording storage, and analytics. You can create multiple tenants under a single billing account for multi-brand or multi-department configurations.',
        'The Numbers dashboard shows all provisioned numbers, their current assignment (queue or IVR entry point), monthly cost, and call volume. Use the search tool to find available local or toll-free numbers by area code, city, or country.',
      ],
    },
    {
      title: 'Building IVR Flows',
      id: 'ivr',
      content: [
        'The IVR Builder uses a visual canvas where you drag nodes (greeting, menu, route, voicemail, API lookup, transfer, callback) and connect them with edges. Each node has configurable properties — the greeting node lets you type text for TTS or upload an audio file.',
        'Menu nodes support DTMF (press 1, 2, 3) and speech recognition (say "billing" or "support"). Conditional nodes branch on caller data from API lookups — for example, route VIP customers directly to a senior agent queue.',
        'Always test your IVR flow before publishing. The Preview button places a simulated test call through the entire flow so you can verify prompts, branching, and queue destinations. Published flows take effect within 60 seconds.',
      ],
    },
    {
      title: 'Managing Agents',
      id: 'agents',
      content: [
        'Invite agents by email from the Team page. Each agent receives a login to the Agent Workspace — a unified interface showing their assigned queues, active calls, chat conversations, and performance stats.',
        'Assign skills from a global skill catalog (e.g., billing, tech-support, spanish, retention). Set proficiency levels from 1-10 for each skill. Agents with higher proficiency receive priority routing for matching call types.',
        'Agent states include Available, On Call, Wrap-Up, Break, Training, and Offline. Managers can enforce automatic break schedules, set maximum consecutive call limits, and configure wrap-up time allowances per queue.',
      ],
    },
    {
      title: 'Queue Configuration',
      id: 'queues',
      content: [
        'Each queue defines an SLA target (e.g., 80% of calls answered within 20 seconds), a priority level, and a routing strategy (round-robin, longest-idle, skill-weighted, or predictive). Callers hear their estimated wait time upon entry.',
        'Overflow rules trigger when wait time exceeds a threshold or queue depth hits a limit. Overflow destinations include another queue, a voicemail box, a callback offer, or an external transfer number.',
        'Queue analytics display real-time and historical data: average speed of answer, abandonment rate, service level, peak hours, and agent utilization. Use these metrics to tune SLA targets and staffing levels.',
      ],
    },
    {
      title: 'Analytics & Reports',
      id: 'analytics',
      content: [
        'The Analytics dashboard provides real-time and historical views of call center performance. Key metrics include total calls, average handle time, first-call resolution rate, CSAT score, abandonment rate, and quality score distribution.',
        'Drill into any metric by date range, queue, agent, skill, or disposition code. Export reports as CSV or PDF for executive summaries. Schedule automated reports to be emailed daily, weekly, or monthly.',
        'The Workforce tab shows forecasted call volume overlaid with actual staffing. Identify periods where you are overstaffed (wasted cost) or understaffed (SLA risk) and adjust schedules accordingly.',
      ],
    },
    {
      title: 'Billing & Usage',
      id: 'billing',
      content: [
        'Billing is usage-based with transparent line items: voice minutes (inbound and outbound), SMS messages, recording storage (per GB/month), phone number fees, and AI processing (transcription, quality scoring, sentiment analysis).',
        'The Billing dashboard shows current-period usage, projected end-of-month cost, and historical invoices. Set budget alerts to receive notifications when usage approaches a threshold.',
        'Volume discounts apply automatically: voice minutes drop in cost at 10K, 50K, and 100K tiers. Annual commitment plans offer an additional 20% discount on all line items. Contact sales for enterprise pricing above 500 seats.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Intelligent Routing', desc: 'The AI routing engine evaluates caller intent (from IVR input and speech recognition), agent skill proficiency, real-time queue depth, historical resolution data, and caller lifetime value to make sub-second routing decisions that maximize first-call resolution.' },
    { capability: 'Call Quality AI', desc: 'Every call is analyzed in real time for sentiment trajectory, script adherence, compliance keywords, talk-to-listen ratio, dead air percentage, and resolution indicators. A composite quality score (0-100) is assigned within seconds of call completion.' },
    { capability: 'Agent Coaching', desc: 'AI identifies coaching opportunities by comparing individual agent metrics against team benchmarks. Generates personalized improvement plans with specific call examples, suggested training modules, and progress tracking over time.' },
    { capability: 'Workforce Forecasting', desc: 'Machine learning models trained on your historical call data predict volume by 15-minute intervals up to 8 weeks ahead. Recommendations include optimal agent count per queue, break scheduling, and overtime alerts.' },
    { capability: 'Sentiment Analysis', desc: 'Real-time sentiment detection on active calls enables supervisor alerts when caller frustration exceeds a threshold. Post-call sentiment scores correlate with CSAT responses to continuously improve detection accuracy.' },
    { capability: 'Auto-Transcription', desc: 'Every call is transcribed in real time using speech-to-text AI with speaker diarization. Transcripts are searchable, linked to recordings, and feed into quality scoring, compliance checks, and knowledge base gap analysis.' },
    { capability: 'Smart Escalation', desc: 'AI monitors active calls and automatically flags conversations for supervisor intervention based on sentiment drop, compliance risk keywords, extended hold times, or customer-requested escalation — before the situation deteriorates.' },
    { capability: 'Predictive Queuing', desc: 'Uses real-time traffic patterns and historical data to predict queue surges 15-30 minutes before they happen. Automatically adjusts routing weights, activates overflow queues, and sends staffing alerts to managers.' },
  ],

  troubleshooting: [
    { issue: 'Calls dropping or audio cutting out', solution: 'Check the Network Health panel in Settings for packet loss or jitter warnings. Ensure agents are on a wired connection with at least 100 Kbps upstream per concurrent call. If using WebRTC, verify that UDP ports 10000-20000 are open on the firewall. Contact support if the issue persists across multiple agents.' },
    { issue: 'IVR not routing callers to the correct queue', solution: 'Open the IVR Builder and verify that menu option nodes are connected to the intended queue destination nodes. Check conditional branches for correct logic (e.g., time-of-day conditions use the tenant timezone, not UTC). Use the Preview test call feature to trace the exact path a caller takes through the flow.' },
    { issue: 'Call recordings not appearing or storage full', solution: 'Recordings take up to 60 seconds to process after call completion. If recordings are missing after 5 minutes, check the Recording Settings page for storage quota. Expired recordings are purged per your retention policy — extend the retention period or archive to cold storage if needed.' },
    { issue: 'Agent showing wrong status or stuck in wrap-up', solution: 'Agents can manually reset their state from the Agent Workspace status dropdown. If the state is stuck due to a browser issue, refreshing the page forces a state sync. Managers can override any agent state from the Team dashboard. Automatic wrap-up timeout (configurable per queue) prevents indefinite wrap-up states.' },
    { issue: 'Billing discrepancies or unexpected charges', solution: 'Review the Usage Breakdown page which shows minute-by-minute detail for the billing period. Common causes include after-hours overflow calls routing to external numbers (charged as outbound), recording storage exceeding the included tier, or AI processing fees for transcription and quality scoring. Compare the invoice line items against the Usage Breakdown for exact reconciliation.' },
  ],

  faq: [
    { q: 'How many concurrent calls can Echo Call Center handle?', a: 'The platform scales elastically on Cloudflare Workers with no fixed concurrency limit. Each tenant can handle thousands of concurrent calls. Telephony capacity is provisioned per phone number — each number supports up to 100 concurrent calls by default, extendable on request.' },
    { q: 'Can I keep my existing phone numbers?', a: 'Yes. Number porting is supported for most US and international carriers. Submit a port request from the Numbers dashboard with your current carrier account details. Most ports complete within 1-2 business days for toll-free and 5-10 business days for local numbers.' },
    { q: 'Does Echo Call Center support outbound dialing campaigns?', a: 'Yes. The Outbound module includes a predictive dialer, power dialer, and preview dialer. Upload contact lists, assign campaigns to agent teams, and configure call pacing, retry logic, and disposition-based follow-ups. All outbound calls comply with TCPA regulations.' },
    { q: 'What integrations are available?', a: 'Native integrations include Echo CRM, Salesforce, HubSpot, Zendesk, Slack, Microsoft Teams, and Zapier. The REST API and webhook system support custom integrations with any platform. Screen-pop functionality pushes caller data to your CRM before the agent answers.' },
    { q: 'Is call recording compliant with privacy regulations?', a: 'Echo Call Center supports one-party and two-party consent configurations per tenant or per number. PCI-DSS compliant pause/resume prevents recording of sensitive payment data. Recordings are AES-256 encrypted at rest and access is controlled by role-based permissions.' },
    { q: 'How does pricing work for SMS?', a: 'SMS is billed per message segment at carrier rates plus a small platform fee. Inbound SMS to provisioned numbers is included in the number fee. Outbound SMS pricing varies by destination country. Volume discounts apply at 10K, 50K, and 100K monthly message tiers. See the Billing dashboard for current rates.' },
  ],
}

export default function CallCenterDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/call-center' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
