'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Workflows',
  tagline: 'Visual workflow automation engine with multi-step execution, triggers, and integrations.',
  accent: '#d946ef',
  productUrl: '/workflows',
  workerUrl: 'https://echo-workflows.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Workflows is a powerful automation engine that lets you design, execute, and monitor multi-step workflows without writing code. Built on Cloudflare Workers for sub-50ms cold starts and global edge execution, it connects your Echo Omega Prime services into cohesive automated pipelines that run 24/7 with built-in retry logic and error recovery.',
    'Each workflow is a directed sequence of steps that can include HTTP requests to external APIs, data transformations with JSONPath expressions, conditional branching based on runtime values, timed delays, calls to any of the 18 integrated Echo services, and AI-powered decision steps. Workflows are triggered by webhooks, cron schedules, or manual dispatch, giving you full control over when and how automations run.',
    'The analytics dashboard tracks every workflow run with detailed step-by-step execution logs, duration metrics, and success rates. Template library ships with 30+ pre-built automations for common patterns like lead processing, data synchronization, alert escalation, and report generation, so you can start automating in minutes rather than hours.',
  ],
  gettingStarted: [
    { step: 1, title: 'Open the Workflow Builder', desc: 'Navigate to Workflows from the main dashboard. Click Create Workflow to open the visual builder. Give your workflow a name and optional description.' },
    { step: 2, title: 'Add Your First Step', desc: 'Click the + button to add a step. Choose from 6 step types: HTTP Request, Data Transform, Condition, Delay, Echo Service, or AI Step. Each type has a configuration panel with validated inputs.' },
    { step: 3, title: 'Configure a Trigger', desc: 'Every workflow needs a trigger. Select Webhook to fire on incoming HTTP requests, Schedule to run on a cron expression (e.g. every 6 hours), or Manual to trigger on-demand from the dashboard.' },
    { step: 4, title: 'Test Your Workflow', desc: 'Click Test Run to execute the workflow with sample data. The execution panel shows each step in real time with input/output payloads, duration, and status. Fix any errors before activating.' },
    { step: 5, title: 'Activate and Monitor', desc: 'Toggle the workflow to Active. It will now run automatically based on its trigger. Monitor executions from the Runs tab, where you can filter by status, date range, and duration.' },
  ],
  features: [
    { title: 'Multi-Step Execution', desc: 'Chain unlimited steps into sequential or branching workflows. Each step receives the output of the previous step as input. Steps execute with isolated error boundaries so a failure in step 5 does not lose the results from steps 1-4.' },
    { title: '6 Step Types', desc: 'HTTP Request for calling any API, Data Transform for reshaping payloads with JSONPath, Condition for if/else branching, Delay for timed pauses (1 second to 24 hours), Echo Service for calling internal services, and AI Step for LLM-powered decisions and text generation.' },
    { title: 'Webhook Triggers', desc: 'Each workflow gets a unique webhook URL that accepts POST requests. Incoming payloads are validated against an optional JSON schema. Webhook secrets ensure only authorized senders can trigger your workflows.' },
    { title: 'Schedule Triggers', desc: 'Run workflows on cron schedules with second-level precision. Common presets include every minute, hourly, daily, and weekly. Custom cron expressions support complex schedules like "every weekday at 9 AM UTC".' },
    { title: 'Template Library', desc: '30+ pre-built workflow templates for common automation patterns. Templates include lead intake processing, CRM data sync, alert escalation chains, daily report generation, and social media scheduling. One-click import with customizable parameters.' },
    { title: 'Retry & Error Handling', desc: 'Configure per-step error policies: retry with exponential backoff (up to 5 attempts), skip and continue to the next step, or stop the entire workflow. Failed runs are flagged in the dashboard with full error details for debugging.' },
    { title: 'Run Analytics', desc: 'Track execution metrics including total runs, success rate, average duration, and error frequency. Time-series charts show trends over 7, 30, and 90-day windows. Export run data as CSV for external analysis.' },
    { title: '18 Echo Service Integrations', desc: 'Native integrations with Echo CRM, Echo Email, Echo Chat, Echo Documents, Echo Analytics, Echo Invoicing, Echo Vault, and 11 more Echo services. Service steps use internal bindings for zero-latency communication and automatic authentication.' },
    { title: 'AI Workflow Generation', desc: 'Describe your automation in plain English and the AI builder generates a complete workflow with steps, triggers, and configurations. Review the generated workflow, adjust as needed, and activate. Reduces workflow creation time from 20 minutes to 30 seconds.' },
    { title: 'Manual Triggers', desc: 'Trigger any workflow on-demand from the dashboard with an optional payload override. Useful for testing, one-off data migrations, and ad-hoc report generation. Manual runs are logged identically to automated runs for full audit trail.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/workflows/create', desc: 'Create a new workflow. Body accepts name, description, steps array (each with type, config, error_policy), and trigger configuration. Returns the created workflow with unique ID and webhook URL if applicable.', auth: true },
    { method: 'POST', path: '/workflows/:id/run', desc: 'Manually trigger a workflow execution. Optional body provides input payload that overrides the default trigger data. Returns the run ID for tracking. Execution happens asynchronously.', auth: true },
    { method: 'GET', path: '/runs/:id', desc: 'Retrieve the status and details of a specific workflow run. Returns overall status (running, completed, failed), step-by-step results with input/output payloads, duration per step, and any error messages.', auth: true },
    { method: 'GET', path: '/templates', desc: 'List all available workflow templates. Returns template metadata including name, description, category, step count, and estimated setup time. Supports filtering by category (crm, email, analytics, etc.).', auth: false },
    { method: 'POST', path: '/webhooks', desc: 'Register or update a webhook trigger for a workflow. Body accepts workflow_id, secret (for HMAC validation), and optional JSON schema for payload validation. Returns the webhook URL endpoint.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Retrieve workflow execution analytics. Query parameters: workflow_id (optional, omit for all), period (7d, 30d, 90d), group_by (day, week). Returns total runs, success count, failure count, avg duration, and time-series data.', auth: true },
  ],
  userGuide: [
    {
      title: 'Building Your First Workflow',
      id: 'building-workflows',
      content: [
        'The workflow builder uses a vertical step layout where each step flows into the next. Start by clicking Create Workflow and entering a name. The builder opens with an empty canvas and a single + button to add your first step.',
        'Click the + button and select a step type. For example, choose HTTP Request to call an external API. Enter the URL, HTTP method, headers, and body. Use template variables like {{trigger.body.email}} to reference data from the trigger payload.',
        'Add more steps by clicking + below the last step. Each step automatically receives the output of the previous step as {{prev.result}}. For conditional branching, add a Condition step with a JSONPath expression that evaluates to true or false, then define steps for each branch.',
        'Data Transform steps are essential for reshaping data between steps. Use JSONPath expressions to extract, rename, and restructure fields. For example, map {{prev.result.data.items[*].name}} to extract all item names from an API response into a flat array.',
      ],
    },
    {
      title: 'Configuring Triggers and Schedules',
      id: 'triggers',
      content: [
        'Every workflow must have exactly one trigger. The trigger determines when and how the workflow starts executing. Open the Trigger panel from the workflow settings tab to configure.',
        'Webhook triggers generate a unique URL like https://echo-workflows.bmcii1976.workers.dev/hook/wf_abc123. POST requests to this URL start a new workflow run with the request body as input data. Set a webhook secret to enable HMAC-SHA256 signature validation on incoming requests.',
        'Schedule triggers use standard cron syntax. Enter a cron expression or use the visual schedule picker to set frequency. Common patterns: "0 */6 * * *" runs every 6 hours, "0 9 * * 1-5" runs at 9 AM UTC on weekdays. Schedule triggers pass the current timestamp as the input payload.',
        'Manual triggers are the simplest: workflows with manual triggers only run when you click Run in the dashboard or call the /workflows/:id/run API endpoint. You can provide a custom JSON payload at trigger time.',
      ],
    },
    {
      title: 'Monitoring and Debugging Runs',
      id: 'monitoring',
      content: [
        'The Runs tab shows every execution of your workflow in reverse chronological order. Each run displays its status (running, completed, failed), start time, duration, and trigger source. Click any run to drill into the step-by-step execution log.',
        'The step detail view shows the input payload, output result, duration, and status for each step. For failed steps, the full error message and stack trace are displayed. Use this information to identify which step failed and why.',
        'The Analytics view aggregates run data across all your workflows. The dashboard shows total runs, success rate, average duration, and error frequency. Time-series charts let you spot trends like increasing failure rates or growing execution times that might indicate an upstream API issue.',
        'Set up alert notifications by integrating with Echo Email or Echo Chat. Create a monitoring workflow that checks execution stats via the /analytics endpoint and sends alerts when the failure rate exceeds your threshold.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Natural Language Workflow Generation', desc: 'Describe your desired automation in plain English, such as "when a new lead comes in via webhook, enrich the data from our CRM, score them with AI, and send a personalized email if the score is above 80." The AI generates a complete workflow with all steps, conditions, and configurations ready to review and activate.' },
    { capability: 'Intelligent Error Recovery', desc: 'When a step fails, the AI analyzes the error context and suggests recovery actions. For HTTP errors, it recommends retry strategies based on the status code. For data transform failures, it identifies the malformed field and suggests a fix. Suggestions appear inline in the run detail view.' },
    { capability: 'AI Decision Steps', desc: 'Add AI-powered decision points to your workflows. The AI Step type sends data to an LLM with a custom prompt and routes the workflow based on the response. Use cases include sentiment analysis for routing support tickets, content moderation for user submissions, and lead qualification scoring.' },
    { capability: 'Smart Template Recommendations', desc: 'Based on your existing workflows and connected services, the AI recommends templates that complement your automation stack. Recommendations consider your industry, workflow patterns, and service usage to suggest the most impactful automations to build next.' },
  ],
  troubleshooting: [
    { issue: 'Webhook trigger returns 401 Unauthorized', solution: 'Your webhook request is missing or has an invalid signature. Ensure you are computing the HMAC-SHA256 signature using the webhook secret from your workflow settings. The signature must be sent in the X-Webhook-Signature header. Check that the secret has not been rotated since you configured your sender.' },
    { issue: 'Workflow run stuck in "running" status', solution: 'A step may be waiting on a slow external API or a long delay step. Check the step detail view to see which step is currently executing. If an HTTP step is hanging, the request will timeout after 30 seconds and the error policy (retry, skip, or stop) will apply. For delay steps, the run will resume automatically after the configured wait time.' },
    { issue: 'Data Transform step produces empty output', solution: 'The JSONPath expression likely does not match the input structure. Open the run detail view and inspect the input payload for the transform step. Verify your JSONPath expression against the actual data shape. Common issues include missing array brackets, incorrect nesting depth, and case-sensitive field names.' },
    { issue: 'Schedule trigger not firing at expected time', solution: 'Cron expressions use UTC timezone. If your workflow should run at 9 AM Central Time, the cron hour should be 14 (UTC offset -5) or 15 (UTC offset -6 for CDT). Also verify the workflow is in Active status, as paused workflows skip scheduled triggers.' },
  ],
  faq: [
    { q: 'How many steps can a workflow have?', a: 'There is no hard limit on the number of steps per workflow. However, total execution time per run is capped at 5 minutes for free plans and 30 minutes for paid plans. Complex workflows with many HTTP steps should consider parallel execution patterns to stay within limits.' },
    { q: 'Can workflows call external APIs outside the Echo ecosystem?', a: 'Yes. The HTTP Request step can call any public API endpoint. Configure the URL, method, headers, and body as needed. For APIs requiring authentication, store credentials in Echo Vault and reference them with template variables.' },
    { q: 'Are workflow runs logged and auditable?', a: 'Every workflow run is logged with full input/output payloads for each step, execution timestamps, and the triggering event. Logs are retained for 90 days on free plans and 365 days on paid plans. Export run history via the /analytics endpoint for long-term archival.' },
    { q: 'Can I version my workflows?', a: 'Yes. Every time you save changes to a workflow, a new version is created. You can view the version history, compare changes between versions, and rollback to any previous version. Active workflows continue running the published version until you explicitly publish a new one.' },
    { q: 'What happens if a webhook receives concurrent requests?', a: 'Each webhook request creates an independent workflow run. Concurrent requests are processed in parallel with isolated execution contexts. There is no queue or serialization, ensuring low latency even under high throughput. Rate limiting applies at 100 requests per second per workflow.' },
  ],
}

export default function Page() { return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/workflows' },
      ]} />
      <ProductDoc {...data} />
    </>
  ) }
