'use client'

import ProductDoc from '@/components/ProductDoc'

const data = {
  name: 'Echo Helpdesk',
  tagline: 'AI-powered customer support — tickets, knowledge base, SLA tracking, and auto-responses.',
  accent: '#059669',
  productUrl: '/helpdesk',
  workerUrl: 'https://echo-helpdesk.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Helpdesk is a comprehensive AI-powered customer support platform designed to streamline every aspect of your support operations. From the moment a customer reaches out, the system automatically categorizes, prioritizes, and routes tickets to the right agent — eliminating manual triage and reducing first-response times by up to 80%. Built on Cloudflare Workers for global edge performance, every interaction is fast, reliable, and secure.',
    'At the core of Echo Helpdesk is an intelligent ticket management engine paired with a deeply integrated knowledge base. Agents get real-time suggested responses drawn from your documentation, previous resolutions, and custom canned replies. SLA tracking ensures no ticket slips through the cracks — automated escalation rules trigger when response or resolution deadlines approach, keeping your team accountable and your customers satisfied.',
    'Beyond reactive support, Echo Helpdesk empowers proactive customer engagement through a self-service customer portal, satisfaction surveys, multi-channel intake (email, chat, API), and a powerful analytics dashboard. Custom workflows let you automate repetitive processes — from auto-assigning tickets based on category to closing stale tickets after inactivity. Whether you run a two-person support team or a 200-agent operation, Echo Helpdesk scales with you.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/helpdesk and complete workspace setup. Choose your plan and configure your organization name, timezone, and business hours.' },
    { step: 2, title: 'Configure Support Email', desc: 'Connect your support email address (e.g. support@yourcompany.com) to automatically convert incoming emails into helpdesk tickets. SMTP and forwarding options both supported.' },
    { step: 3, title: 'Set Up Categories & Priorities', desc: 'Create ticket categories (Billing, Technical, General, etc.) and define priority levels. Each category can have its own SLA rules, default assignee, and auto-response template.' },
    { step: 4, title: 'Create Canned Responses', desc: 'Build a library of pre-written responses for common questions. Canned responses support dynamic variables like {{customer_name}}, {{ticket_id}}, and {{agent_name}} for personalized replies.' },
    { step: 5, title: 'Invite Your Agents', desc: 'Add support agents to your workspace with role-based permissions. Assign agents to categories, set availability schedules, and configure notification preferences for new and escalated tickets.' },
  ],

  features: [
    { title: 'Ticket Management', desc: 'Create, track, and resolve support tickets with full lifecycle management. Threaded conversations, internal notes, file attachments, and complete audit trails for every interaction.' },
    { title: 'AI Auto-Categorization', desc: 'Incoming tickets are automatically categorized and tagged using natural language understanding. The AI analyzes subject, body, and context to assign the correct category, priority, and suggested agent.' },
    { title: 'SLA Tracking', desc: 'Define service level agreements per category and priority. Real-time countdown timers, automated warnings before breach, and escalation rules ensure every ticket meets its response and resolution targets.' },
    { title: 'Canned Responses', desc: 'Pre-built response templates with dynamic variable substitution. Agents can insert, customize, and send common replies in seconds — maintaining consistency while saving time on repetitive questions.' },
    { title: 'Knowledge Base', desc: 'Integrated knowledge base with rich-text articles, categories, and full-text search. Articles surface automatically as suggested solutions when agents view tickets, and customers can search them in the self-service portal.' },
    { title: 'Customer Portal', desc: 'Branded self-service portal where customers can submit tickets, track status, search the knowledge base, and view their complete support history — reducing agent workload by enabling self-resolution.' },
    { title: 'Agent Assignment', desc: 'Intelligent agent assignment based on category expertise, current workload, availability, and round-robin distribution. Manual override available for complex or VIP tickets.' },
    { title: 'Priority Escalation', desc: 'Automated escalation workflows triggered by SLA breach, customer sentiment, ticket age, or keyword detection. Escalated tickets are surfaced to team leads with full context and recommended actions.' },
    { title: 'Satisfaction Surveys', desc: 'Automated CSAT surveys sent after ticket resolution. Track satisfaction scores per agent, category, and time period. Identify patterns in negative feedback to drive continuous improvement.' },
    { title: 'Multi-Channel Support', desc: 'Accept tickets from email, web forms, live chat, API integrations, and the customer portal. All channels converge into a unified inbox so agents never miss a request regardless of source.' },
    { title: 'Custom Workflows', desc: 'Visual workflow builder for automating repetitive tasks — auto-assign tickets by category, send follow-ups after inactivity, close stale tickets, notify managers on escalation, and trigger webhooks for external integrations.' },
    { title: 'Analytics Dashboard', desc: 'Real-time metrics on ticket volume, resolution time, SLA compliance, agent performance, customer satisfaction, and channel distribution. Export reports and schedule automated email summaries.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/tickets', desc: 'List all tickets with filtering by status, category, priority, agent, and date range. Supports pagination and sorting.', auth: true },
    { method: 'POST', path: '/api/tickets', desc: 'Create a new support ticket with subject, description, category, priority, customer email, and optional file attachments.', auth: true },
    { method: 'GET', path: '/api/tickets/:id', desc: 'Retrieve full ticket details including conversation thread, internal notes, attachments, SLA status, and activity log.', auth: true },
    { method: 'PUT', path: '/api/tickets/:id', desc: 'Update ticket properties — reassign agent, change priority, update status, add tags, or modify category.', auth: true },
    { method: 'POST', path: '/api/tickets/:id/reply', desc: 'Add a public reply or internal note to an existing ticket. Supports rich text, attachments, and canned response insertion.', auth: true },
    { method: 'GET', path: '/api/categories', desc: 'List all ticket categories with their SLA rules, default assignees, and auto-response templates.', auth: true },
    { method: 'GET', path: '/api/agents', desc: 'List all agents with their roles, assigned categories, current workload, availability status, and performance metrics.', auth: true },
    { method: 'GET', path: '/api/sla/status', desc: 'Retrieve real-time SLA compliance dashboard showing tickets at risk, breached SLAs, and compliance percentages by category.', auth: true },
    { method: 'GET', path: '/api/knowledge/articles', desc: 'Search and list knowledge base articles by category, keyword, or full-text query. Returns article content, view count, and helpfulness rating.', auth: false },
    { method: 'GET', path: '/api/portal/tickets', desc: 'Customer-facing endpoint to list their own tickets, check status, and view responses. Authenticated via customer token.', auth: true },
  ],

  userGuide: [
    {
      title: 'Creating & Managing Tickets',
      id: 'creating-managing-tickets',
      content: [
        'Tickets can be created from multiple sources: the agent dashboard, customer portal, inbound email, live chat, or the REST API. Each ticket requires a subject and description at minimum — category, priority, and assignee can be set manually or auto-detected by AI.',
        'The ticket detail view shows the full conversation thread, internal notes (visible only to agents), file attachments, SLA countdown timer, and a complete activity log. Use the sidebar to change status, reassign, adjust priority, or add tags.',
        'Bulk actions allow you to select multiple tickets and apply changes simultaneously — merge duplicates, reassign to a different agent, change status, or add tags. Use saved filters to create custom views for common workflows like "My Open Tickets" or "Escalated - Billing".',
      ],
    },
    {
      title: 'Agent Workflow',
      id: 'agent-workflow',
      content: [
        'When you log in, the agent dashboard shows your assigned tickets sorted by SLA urgency. Tickets approaching their response deadline appear highlighted in amber; breached tickets appear in red. Click any ticket to open the full conversation view.',
        'As you type a response, the AI sidebar suggests relevant knowledge base articles and canned responses based on the ticket content. Insert a suggestion with one click, then customize before sending. Internal notes let you collaborate with teammates without the customer seeing the conversation.',
        'Set your availability status to Online, Away, or Offline. When you are offline, new tickets will not be auto-assigned to you. Use the quick-action bar to escalate, transfer, or close tickets without opening the full detail view.',
      ],
    },
    {
      title: 'SLA Configuration',
      id: 'sla-configuration',
      content: [
        'Navigate to Settings > SLA Policies to define your service level agreements. Each policy specifies a first-response target and a resolution target, measured in business hours. Policies are applied based on ticket category and priority level.',
        'Configure escalation rules for when SLAs are at risk: send email alerts at 75% elapsed time, reassign to a senior agent at 90%, and notify the team lead on breach. Each escalation step can trigger a webhook for external integrations.',
        'Business hours and holidays are configured under Settings > Schedules. SLA timers automatically pause outside business hours and on configured holidays, ensuring accurate compliance tracking regardless of timezone.',
      ],
    },
    {
      title: 'Knowledge Base Setup',
      id: 'knowledge-base-setup',
      content: [
        'Access the Knowledge Base editor from the main navigation. Create categories to organize articles (e.g., Getting Started, Billing, Troubleshooting). Each category can have subcategories for deeper organization.',
        'Articles support rich text formatting, embedded images, code blocks, and video embeds. Use the draft/publish workflow to review articles before making them visible to customers. Version history lets you track changes and revert if needed.',
        'Enable the AI article suggester under Settings > AI to automatically surface relevant articles when agents view tickets. The system matches ticket content against your knowledge base using semantic search, showing the top 3 most relevant articles in the agent sidebar.',
      ],
    },
    {
      title: 'Customer Portal',
      id: 'customer-portal',
      content: [
        'The customer portal is available at your custom subdomain (e.g., support.yourcompany.com). Customers can sign in with their email to submit new tickets, track existing ones, and browse the public knowledge base.',
        'Customize the portal appearance under Settings > Portal — upload your logo, set brand colors, and configure the welcome message. Choose which ticket fields are visible to customers and whether they can reopen closed tickets.',
        'The portal includes a smart search bar that searches both knowledge base articles and past ticket resolutions. If a matching article is found, the customer is prompted to try the solution before submitting a new ticket — reducing ticket volume by up to 30%.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Auto-Categorization', desc: 'Incoming tickets are analyzed using natural language understanding to automatically assign the correct category and subcategory. The model trains on your historical ticket data to improve accuracy over time, achieving 95%+ categorization accuracy after 500 tickets.' },
    { capability: 'Smart Routing', desc: 'AI evaluates ticket content, category, complexity, and current agent workloads to route each ticket to the best-suited available agent. Considers agent expertise areas, language proficiency, and historical resolution rates for similar issues.' },
    { capability: 'Sentiment Analysis', desc: 'Real-time sentiment scoring on every customer message detects frustration, urgency, or satisfaction. Negative sentiment triggers automatic priority boosts and alerts to team leads, ensuring unhappy customers get faster attention.' },
    { capability: 'Response Suggestions', desc: 'As agents view a ticket, the AI generates suggested responses by combining relevant knowledge base articles, similar past resolutions, and canned response templates. Agents can accept, edit, or dismiss suggestions with one click.' },
    { capability: 'Duplicate Detection', desc: 'When a new ticket is submitted, the AI scans recent tickets for potential duplicates based on semantic similarity — not just keyword matching. Agents are alerted to merge duplicates, preventing wasted effort on the same issue reported multiple times.' },
    { capability: 'Priority Prediction', desc: 'AI predicts the appropriate priority level for incoming tickets based on content analysis, customer history, and impact assessment. High-impact issues (outages, security concerns, billing errors) are automatically flagged as urgent before an agent even sees them.' },
  ],

  troubleshooting: [
    { issue: 'Incoming emails are not creating tickets', solution: 'Verify your email forwarding rules are active and pointing to your unique helpdesk intake address (shown in Settings > Email). Check your email provider\'s SPF/DKIM settings to ensure forwarded emails are not being rejected. Test by sending an email directly to the intake address and checking the ticket queue after 60 seconds.' },
    { issue: 'SLA timers seem inaccurate or not pausing outside business hours', solution: 'Confirm your business hours schedule is correctly configured under Settings > Schedules, including the correct timezone. Verify that holidays are added for the current year. If you recently changed schedules, existing tickets will recalculate their SLA on the next status change — or force a recalculation from Settings > SLA > Recalculate All.' },
    { issue: 'Agent auto-assignment rules are not working as expected', solution: 'Check that agents have the correct categories assigned under their profile settings. Verify agent availability status is set to "Online" — offline agents are excluded from auto-assignment. Review the assignment rules under Settings > Routing to confirm round-robin or load-balanced mode is active for the relevant categories.' },
    { issue: 'Customers cannot access the self-service portal', solution: 'Ensure the customer portal is enabled under Settings > Portal > Enable Portal. Verify your custom domain DNS is pointing to the correct CNAME record. If customers receive authentication errors, check that customer accounts are not disabled and that the portal sign-in method (email link vs. password) matches your configuration.' },
  ],

  faq: [
    { q: 'How many agents can I add to my helpdesk?', a: 'Agent limits depend on your plan. The Starter plan includes 3 agents, Professional includes 15, and Enterprise is unlimited. All plans support unlimited customers and tickets. You can upgrade your plan at any time from Settings > Billing.' },
    { q: 'Can I customize the ticket submission form?', a: 'Yes. Navigate to Settings > Forms to add custom fields (text, dropdown, checkbox, date) to the ticket creation form. Custom fields appear in both the agent dashboard and customer portal. You can make fields required or optional and use them in workflow automation rules.' },
    { q: 'Does Echo Helpdesk support multiple languages?', a: 'Yes. The interface supports 12 languages, and the AI auto-categorization and sentiment analysis work across English, Spanish, French, German, Portuguese, and Japanese. The knowledge base supports articles in any language, and customers see content based on their browser language preference.' },
    { q: 'Can I integrate Echo Helpdesk with my existing tools?', a: 'Echo Helpdesk integrates with Slack (ticket notifications), Discord (ticket creation via bot), email (any SMTP/IMAP provider), webhooks (custom integrations), and the full REST API for programmatic access. Zapier and Make.com integrations are available for connecting to 5,000+ apps without code.' },
    { q: 'How is my support data secured?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). The platform runs on Cloudflare\'s global edge network with built-in DDoS protection. Role-based access control ensures agents only see tickets assigned to their categories. Full audit logs track every action for compliance requirements.' },
  ],
}

export default function HelpdeskDocsPage() {
  return <ProductDoc {...data} />
}
