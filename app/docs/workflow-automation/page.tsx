'use client'

import ProductDoc from '@/components/ProductDoc'

const data = {
  name: 'Echo Workflow Automation',
  tagline: 'Visual workflow builder with 200+ triggers, AI decision nodes, and cross-product orchestration \u2014 automate any business process.',
  accent: '#06b6d4',
  productUrl: '/workflow-automation',
  workerUrl: 'https://echo-workflow-automation.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Workflow Automation is a visual process builder that connects every product in the Echo ecosystem into automated workflows. Define triggers (schedule, webhook, email, form submission, database change, or any of 200+ event types), add processing steps (AI analysis, data transformation, API calls, human approval), and configure outputs (email, SMS, Slack, CRM update, database write, or any webhook destination).',
    'What sets it apart from generic workflow tools is deep integration with the Echo Intelligence Engine ecosystem. A workflow step can query a tax engine for IRC analysis, run a security scan, generate a voice message, search the knowledge graph, or delegate to the AI Swarm \u2014 all as native workflow nodes, not external API calls. This means enterprise processes that combine AI analysis with business logic run entirely within the platform.',
    'Workflows are durable \u2014 they survive Worker restarts and handle long-running processes (title chain investigations, multi-day approval chains, scheduled report sequences) without losing state. Built on Cloudflare Durable Objects for exactly-once execution semantics and D1 for persistent workflow state.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create a Workflow', desc: 'Use the visual builder or POST to /api/workflows. Start with a trigger node \u2014 the event that kicks off the workflow. Common triggers: schedule (cron), webhook, form submission, or database change.' },
    { step: 2, title: 'Add Processing Steps', desc: 'Drag processing nodes onto the canvas. Choose from: AI Query (engine analysis), Transform (data mapping), Condition (if/else branching), Loop (iterate over arrays), Human Approval (pause for review), or Custom Code (JavaScript).' },
    { step: 3, title: 'Configure Outputs', desc: 'Add output nodes: Send Email, Send SMS, Post to Slack, Update CRM, Write to Database, Call Webhook, or Generate Report. Each output node has its own configuration for formatting and delivery.' },
    { step: 4, title: 'Test and Activate', desc: 'Use the test runner to execute the workflow with sample data. Review each step\'s input/output in the execution log. Once satisfied, activate the workflow \u2014 it runs automatically on every trigger event.' },
    { step: 5, title: 'Monitor Executions', desc: 'The execution dashboard shows every workflow run with status, duration, step-by-step details, and any errors. Set up alerts for failed executions or performance degradation.' },
  ],
  features: [
    { title: '200+ Trigger Types', desc: 'Schedule (cron), webhook, email receipt, form submission, database change, file upload, payment received, new lead, ticket created, custom API events, and 190+ more trigger types.' },
    { title: 'AI Decision Nodes', desc: 'Native integration with Intelligence Engines. A workflow step can query any of 5,486 engines for domain analysis, confidence scoring, and doctrine-backed recommendations.' },
    { title: 'Visual Canvas Builder', desc: 'Drag-and-drop workflow editor with real-time preview. Connect nodes with data mapping, add conditions for branching, and configure parallel execution paths.' },
    { title: 'Human-in-the-Loop', desc: 'Pause workflow execution for human review and approval. Approvers receive email or Slack notifications with context. Timeout and escalation rules configurable.' },
    { title: 'Durable Execution', desc: 'Workflows survive crashes, restarts, and long delays. Built on Cloudflare Durable Objects for exactly-once semantics. Multi-day approval chains run reliably.' },
    { title: 'Cross-Product Integration', desc: 'Native nodes for every Echo product: Engine queries, Voice TTS, Knowledge search, Swarm delegation, Email campaigns, CRM updates, Scanner checks, and more.' },
    { title: 'Conditional Branching', desc: 'If/else nodes with complex conditions: compare values, check AI confidence levels, evaluate regex patterns, or use custom JavaScript expressions.' },
    { title: 'Loop Processing', desc: 'Iterate over arrays and process each item through subsequent steps. Supports parallel iteration for independent items with configurable concurrency limits.' },
    { title: 'Error Handling', desc: 'Per-step retry policies, fallback paths, error notification routing, and dead letter queues. Failed steps do not block the entire workflow \u2014 configurable error isolation.' },
    { title: 'Version Control', desc: 'Workflow definitions are versioned. Roll back to any previous version. Active executions continue on their version while new triggers use the latest.' },
    { title: 'Execution Analytics', desc: 'Dashboards for execution volume, success rates, average duration, bottleneck identification, and cost per execution. Export data for custom reporting.' },
    { title: 'Template Marketplace', desc: 'Pre-built workflow templates for common patterns: lead scoring, invoice processing, compliance checks, report generation, customer onboarding, and incident response.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/workflows', desc: 'Create a new workflow definition with trigger, steps, and output configuration. Returns workflow ID.', auth: true },
    { method: 'GET', path: '/api/workflows', desc: 'List all workflows with status, trigger type, last execution time, and success rate.', auth: true },
    { method: 'POST', path: '/api/workflows/:id/execute', desc: 'Manually trigger a workflow execution with input data. Returns execution ID for tracking.', auth: true },
    { method: 'GET', path: '/api/workflows/:id/executions', desc: 'List executions for a workflow with status, duration, and step-by-step results. Supports pagination and date filtering.', auth: true },
    { method: 'POST', path: '/api/workflows/:id/test', desc: 'Test a workflow with sample data without activating the trigger. Returns full execution trace with intermediate results.', auth: true },
    { method: 'GET', path: '/api/executions/:id', desc: 'Get detailed execution results including every step\'s input, output, duration, and status.', auth: true },
    { method: 'POST', path: '/api/approvals/:id/approve', desc: 'Approve a human-in-the-loop step. Workflow execution resumes from the approval point.', auth: true },
    { method: 'GET', path: '/api/templates', desc: 'Browse pre-built workflow templates. Filter by category, trigger type, or use case.', auth: false },
  ],
  userGuide: [
    { id: 'triggers', title: 'Configuring Triggers', content: [
      'Every workflow starts with a trigger \u2014 the event that initiates execution. Schedule triggers use cron syntax for recurring workflows (daily reports, weekly audits). Webhook triggers accept HTTP requests from any external system.',
      'Database triggers fire when specific tables are updated. Configure which tables, which operations (INSERT, UPDATE, DELETE), and optionally filter by column values. This is powerful for event-driven architectures.',
      'Composite triggers combine multiple conditions: "fire when a new lead is created AND their company size is over 100 employees AND they are in the technology industry." Use the AND/OR logic builder in the trigger configuration.',
    ]},
    { id: 'ai-nodes', title: 'Using AI Decision Nodes', content: [
      'AI nodes query Intelligence Engines as workflow steps. Configure the engine domain (tax, legal, security, etc.) and pass workflow data as the query. The engine returns an analysis with confidence scoring and doctrine citations.',
      'Use AI node outputs for conditional branching: if confidence is DEFENSIBLE, proceed to the approval step; if AGGRESSIVE, route to a senior reviewer; if HIGH_RISK, flag and notify compliance. This embeds domain expertise into automated processes.',
      'AI nodes support batch mode: process an array of items through the same engine query. Useful for bulk analysis workflows like processing a list of transactions through tax compliance checks.',
    ]},
    { id: 'error-handling', title: 'Error Handling Strategies', content: [
      'Each step can have its own retry policy: immediate retry, exponential backoff, or fixed delay. Configure max retry attempts and the action on final failure (skip step, halt workflow, or route to error path).',
      'Error paths are separate branches in the workflow that execute only when a step fails. Use error paths to send notifications, log incidents, create support tickets, or execute compensating actions.',
      'Dead letter queues capture executions that fail all retries. Review the dead letter queue in the dashboard to identify systemic issues. Reprocess items individually or in bulk once the issue is resolved.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Smart Routing', desc: 'AI analyzes workflow input data and automatically routes to the most appropriate processing path. Reduces branching complexity for workflows that handle diverse input types.' },
    { capability: 'Anomaly Detection', desc: 'AI monitors workflow execution patterns and flags anomalies: unusual execution times, unexpected branching paths, or data values outside normal ranges.' },
    { capability: 'Natural Language Workflow Creation', desc: 'Describe what you want to automate in plain English. AI generates a complete workflow definition with appropriate triggers, steps, conditions, and outputs.' },
    { capability: 'Performance Optimization', desc: 'AI identifies bottleneck steps and suggests optimizations: parallel execution, caching, batching, or step reordering to minimize total workflow duration.' },
  ],
  troubleshooting: [
    { issue: 'Workflow not triggering on schedule', solution: 'Verify the cron expression is correct using a cron syntax checker. Ensure the workflow status is ACTIVE. Check the Cloudflare Workers cron trigger dashboard for execution history.' },
    { issue: 'AI node returning low confidence on all queries', solution: 'Check the engine domain configuration \u2014 your data may be routing to the wrong engine. Add domain context to the query template. Review the engine catalog for a better-suited engine.' },
    { issue: 'Human approval step stuck waiting', solution: 'Check if the approval notification was delivered (email/Slack). Verify the approver has the correct permissions. Review timeout settings \u2014 set an escalation path for overdue approvals.' },
    { issue: 'Workflow execution is slow', solution: 'Check the execution trace for the slowest step. Common causes: external API timeouts, AI engine queries on complex topics, or database operations on large datasets. Consider adding parallel execution for independent steps.' },
  ],
  faq: [
    { q: 'How many workflows can I create?', a: 'Free tier: 5 workflows, 100 executions/month. Starter: 25 workflows, 5,000 executions/month. Pro: unlimited workflows, 50,000 executions/month. Enterprise: unlimited everything with priority execution.' },
    { q: 'Can workflows call external APIs?', a: 'Yes. The HTTP Request node can call any REST API with configurable method, headers, body, and authentication. Response data is available to subsequent workflow steps.' },
    { q: 'How long can a workflow run?', a: 'Individual steps time out at 30 seconds (configurable to 5 minutes for Enterprise). Total workflow duration is unlimited \u2014 human approval steps and scheduled delays can span days or weeks.' },
    { q: 'Can I use custom JavaScript in workflows?', a: 'Yes. The Custom Code node executes JavaScript with access to workflow context data. Use it for data transformation, complex conditions, or custom business logic that does not fit pre-built nodes.' },
    { q: 'Are workflow executions logged?', a: 'Yes. Every execution is logged with full step-by-step trace: inputs, outputs, duration, and status. Logs are retained for 90 days (unlimited for Enterprise). Export to external analytics anytime.' },
  ],
}

export default function WorkflowAutomationDocPage() {
  return <ProductDoc {...data} />
}
