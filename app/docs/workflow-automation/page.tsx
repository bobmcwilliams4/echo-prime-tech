'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Workflow Automation',
  tagline: 'Multi-step workflow engine with 6 step types, 18 Echo integrations, webhook triggers, and AI-powered workflow generation.',
  accent: '#14b8a6',
  productUrl: '/workflow-automation',
  workerUrl: 'https://echo-workflow-automation.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Workflow Automation is a powerful multi-step workflow engine that connects your Echo products, external APIs, and business logic into automated pipelines without writing infrastructure code. Define workflows as sequences of typed steps — HTTP requests, data transforms, conditional branches, delays, Echo service calls, and AI operations — then trigger them via webhooks, schedules, or manual invocation.',
    'The step execution engine processes each step in order, passing the output of one step as the input to the next. Six step types cover virtually every automation need: HTTP steps call any external API, transform steps reshape data with JSONata or JavaScript expressions, condition steps create branches based on runtime values, delay steps introduce time-based pauses, echo_service steps call any Echo product directly, and AI steps invoke Engine Runtime for intelligent processing within the pipeline.',
    'Eighteen built-in Echo integrations give workflows direct access to the full Echo product ecosystem — CRM, email sender, knowledge base, feature flags, document manager, and more — with pre-configured connection templates that eliminate authentication boilerplate. A growing template library of pre-built workflows covers common business patterns so teams ship automations in minutes, not days.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your First Workflow', desc: 'POST to /workflows with a name, trigger type (webhook/schedule/manual), and an array of steps. Start with a simple two-step workflow: one HTTP step to fetch data from an external API and one echo_service step to write the result to Echo CRM.' },
    { step: 2, title: 'Configure Your Trigger', desc: 'Webhook-triggered workflows return a unique inbound URL you send events to. Schedule-triggered workflows accept a cron expression (e.g. "0 9 * * 1-5" for weekdays at 9 AM). Manual triggers expose a /workflows/:id/run endpoint for on-demand execution.' },
    { step: 3, title: 'Add Step Logic', desc: 'Chain steps together by referencing previous step outputs with the {{steps.step_name.output}} syntax. Add a condition step to branch based on a field value. Add a transform step to reshape data before passing it downstream.' },
    { step: 4, title: 'Connect an Echo Integration', desc: 'Browse the 18 built-in integrations in /connections. Select the Echo product, choose the action (e.g. "create contact" in Echo CRM), and map your workflow data to the action inputs. No authentication configuration needed — integrations use your account credentials automatically.' },
    { step: 5, title: 'Monitor Runs and Debug', desc: 'Every execution is logged as a run record. GET /runs/:id/logs shows the step-by-step execution trace — inputs, outputs, duration, and any errors per step. Use the run trace to debug failures and refine step expressions before re-enabling the workflow.' },
  ],

  features: [
    { title: 'HTTP Steps', desc: 'Call any external REST API with configurable method, URL, headers, and body. Supports templated values from previous step outputs, secret injection from the vault for Authorization headers, and response body mapping to named outputs for downstream steps.' },
    { title: 'Transform Steps', desc: 'Reshape, filter, and compute data using JSONata expressions or JavaScript arrow functions. Transform steps can rename fields, flatten nested objects, compute derived values, filter arrays, and convert types — all without an external compute resource.' },
    { title: 'Condition Steps', desc: 'Branch workflow execution based on runtime data. Conditions support equality, comparison, contains, regex, and null checks against any step output or trigger payload field. Each branch continues as an independent step sequence with its own error handling.' },
    { title: 'Delay Steps', desc: 'Introduce fixed or dynamic time delays between steps. Fixed delays accept a duration in seconds, minutes, or hours. Dynamic delays read a datetime value from a previous step output and wait until that moment — useful for scheduled follow-ups and SLA-based escalations.' },
    { title: 'Echo Service Steps', desc: 'Call any Echo product directly via internal service binding — zero network latency, no authentication, full response data available to subsequent steps. Supported: CRM, Email Sender, Knowledge Base, Feature Flags, Document Manager, and 13 other Echo services.' },
    { title: 'AI Steps', desc: 'Invoke Engine Runtime within a workflow for document classification, sentiment analysis, entity extraction, summarization, or custom prompt evaluation. AI step outputs are structured JSON objects that downstream steps can branch on or pass to other systems.' },
    { title: 'Webhook Triggers', desc: 'Every webhook-triggered workflow gets a unique inbound URL. Validate incoming webhook signatures, filter triggers by payload field values, and transform the raw webhook body before the first step executes.' },
    { title: 'Schedule Triggers', desc: 'Run workflows on cron schedules with timezone support. Schedules are evaluated at the edge with sub-second precision. Missed executions (due to maintenance windows) are tracked and optionally retried when the service resumes.' },
    { title: '18 Built-In Echo Integrations', desc: 'Pre-configured connections to all 18 Echo products eliminate authentication setup. Each integration exposes typed actions with input schemas so you configure workflow data mappings instead of raw HTTP calls.' },
    { title: 'Error Handling', desc: 'Configure per-step error handling: retry with exponential backoff, skip the step and continue, or stop the run and emit an error event. Global workflow-level error handlers can notify via Echo Email Sender or webhook on any run failure.' },
    { title: 'Template Library', desc: 'Curated library of pre-built workflow templates covering onboarding sequences, lead enrichment, invoice processing, report generation, and data sync patterns. Import a template, configure your connections, and activate in minutes.' },
    { title: 'Run History & Analytics', desc: 'Complete execution history per workflow with run status (success/failed/skipped), duration, step counts, and trigger metadata. Analytics dashboard shows run volume trends, error rates by step, and average execution duration over time.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/workflows', desc: 'Create a new workflow with name, description, trigger config (type, cron, webhook filter), and steps array. Each step has a type, name, config, and error_handling policy. Returns workflow ID and inbound webhook URL if applicable.', auth: true },
    { method: 'POST', path: '/workflows/:id/run', desc: 'Manually trigger a workflow execution. Accepts an optional payload object injected as the trigger data. Executes synchronously for runs under 30 seconds; returns a run ID for async polling for longer workflows.', auth: true },
    { method: 'GET', path: '/runs', desc: 'List workflow execution runs with filtering by workflow ID, status (success/failed/running), date range, and trigger type. Returns run ID, start time, duration, step count, and final status per run.', auth: true },
    { method: 'GET', path: '/runs/:id/logs', desc: 'Retrieve the step-by-step execution log for a specific run. Returns each step with input data, output data, start and end timestamps, duration, and error details if failed. Essential for debugging complex workflow failures.', auth: true },
    { method: 'POST', path: '/templates', desc: 'Save a workflow definition as a reusable template with name, description, category, and tags. Templates are available to all workspace members and returned by the template library endpoint.', auth: true },
    { method: 'POST', path: '/connections', desc: 'Create a named connection to an external service with authentication credentials (API key, OAuth token, basic auth). Connections are referenced by name in HTTP step configurations and stored in the vault — never in workflow definitions.', auth: true },
    { method: 'POST', path: '/webhooks', desc: 'Register an outbound webhook endpoint to receive workflow lifecycle events — run started, run completed, run failed. Accepts URL, secret for HMAC signing, and event type filters.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Workflow analytics with run volume by day, success rate, average duration, most-used steps, and error frequency by step type and connection. Filterable by workflow ID and date range.', auth: true },
  ],

  userGuide: [
    {
      title: 'Building Workflows',
      id: 'building-workflows',
      content: [
        'A workflow is a named, versioned definition containing a trigger and an ordered array of steps. Each step has a unique name within the workflow (used to reference its output), a type, a configuration object specific to that type, and an error_handling policy. Steps execute in order — the output of step N is available to step N+1 via the {{steps.step_name.output}} template syntax.',
        'Start simple: create a two-step workflow to test the pattern, verify it runs correctly, then add complexity. The most common source of errors in new workflows is expression syntax in transform steps or incorrect field paths when referencing previous step outputs. Use the /workflows/:id/run endpoint with a test payload to iterate quickly before enabling the production trigger.',
        'Version your workflows by incrementing the version field when making breaking changes. Previous versions are archived and can be restored. This lets you test a new version while the previous version continues processing live traffic, then promote the new version atomically when confident.',
      ],
    },
    {
      title: 'Step Types In Depth',
      id: 'step-types',
      content: [
        'HTTP steps are the most versatile: they call any URL with any method and headers. Use the vault_secret() expression in header values to inject API keys without hardcoding them — for example, "Authorization": "Bearer {{vault_secret(\'my_api_key\')}}" resolves the secret at runtime. The response body is automatically parsed as JSON if the Content-Type is application/json.',
        'Transform steps use JSONata, a declarative query and transformation language for JSON. A transform step expression like "{ \\"name\\": first_name & \\" \\" & last_name, \\"email\\": email_address }" reshapes the input object into a new structure. JSONata supports filters, aggregations, string functions, and custom function definitions for complex transformations.',
        'AI steps accept a prompt template and an optional engine_id targeting a specific Engine Runtime doctrine block. The step output is a structured JSON object with a result field containing the model response and a metadata field with model ID, token counts, and latency. Downstream condition steps can branch on result.classification or result.score from AI step outputs.',
      ],
    },
    {
      title: 'Using Echo Service Integrations',
      id: 'echo-integrations',
      content: [
        'Echo service steps call any of the 18 built-in Echo products via internal service bindings — not public HTTP. This means no network round-trip, no rate limiting, and no authentication headers required. Configure an echo_service step with the service name ("echo-crm"), the action name ("create_contact"), and a mapping of your workflow data to the action input fields.',
        'Each action has a typed input schema — open the integration catalog at /connections to see all available actions and their required fields. Required fields that are missing at runtime cause the step to fail with a validation error. Use the test run feature to verify your field mappings before activating the workflow against live data.',
        'When an Echo service step fails, the error response from the target service is available in the step output under steps.step_name.error. Use this in downstream condition steps to implement fallback logic — for example, if a CRM contact creation fails due to a duplicate, redirect to an update action instead of stopping the workflow.',
      ],
    },
    {
      title: 'Error Handling Strategies',
      id: 'error-handling',
      content: [
        'Each step has an error_handling object with three configurable policies: retry, skip, and stop. Retry accepts max_attempts and backoff_seconds — the step is retried up to max_attempts times with exponential backoff before falling through to the fallback policy. Use retry for transient failures in HTTP steps calling external APIs with occasional timeouts.',
        'Skip means: if this step fails, log the error, mark the step as skipped, and continue to the next step. Use skip for non-critical enrichment steps where a partial result is acceptable. Stop is the default: a step failure halts the entire run and marks it as failed. Stop is appropriate for critical steps where partial execution would cause data integrity issues.',
        'At the workflow level, configure an on_error handler that fires when any step reaches a Stop failure. The on_error handler is itself a step array — typically an HTTP step posting to a Slack channel or an echo_service step sending an email via Echo Email Sender with the run ID and error details for immediate investigation.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Workflow Generation', desc: 'Describe your automation goal in plain English and Engine Runtime generates a complete workflow definition — trigger type, step sequence, and configuration — as a JSON object ready to POST to /workflows. Generated workflows require review and connection configuration before activation.' },
    { capability: 'Workflow Optimization', desc: 'Analyzes existing workflow definitions and execution logs to identify inefficiencies — redundant HTTP calls that could be batched, transform steps that could be merged, delays that could be eliminated by switching trigger types. Returns a ranked list of optimization suggestions with expected impact.' },
    { capability: 'Error Pattern Analysis', desc: 'Scans run failure logs across all workflows to identify recurring error patterns — specific API endpoints that fail disproportionately, expression syntax errors that recur, or timeout patterns indicating step timeout misconfiguration. Surfaces actionable remediation steps.' },
    { capability: 'Step Output Classification', desc: 'AI steps within workflows can classify, categorize, or score incoming data — classifying support tickets by urgency, scoring lead quality from form submissions, extracting structured fields from unstructured text. Classification outputs flow into condition steps for intelligent branching.' },
  ],

  troubleshooting: [
    { issue: 'Workflow run fails at HTTP step with "Connection refused"', solution: 'The target URL is either unreachable from the Cloudflare edge or the connection is blocked. Verify the URL is publicly accessible. Internal services on private networks must be exposed via a public URL — Cloudflare Workers cannot reach private network addresses. Check that the Authorization header is correctly configured and the credential has not expired.' },
    { issue: 'Transform step returns null or undefined output', solution: 'The JSONata expression likely references a field path that does not exist in the input data. Open the run log and inspect the transform step input to see the actual data structure. Verify your expression against the real input using the JSONata Exerciser online tool. Wrap optional field references in the JSONata $exists() check to handle missing fields gracefully.' },
    { issue: 'Scheduled workflow not triggering at expected time', solution: 'Verify the cron expression is correct for your intended schedule — cron syntax is evaluated in UTC. Use a cron expression validator to confirm the schedule matches your intent. Check the workflow is in Active state and not Paused. Missed runs are logged with a "skipped" status and retried only if retry_missed is set to true in the trigger config.' },
    { issue: 'Echo service step fails with "Action not found"', solution: 'Verify the action name matches exactly the action identifier in the integration catalog at /connections — action names are case-sensitive. Check that the target Echo product is active. If the action was recently added to the integration catalog, re-save the workflow to pick up the updated action schema.' },
  ],

  faq: [
    { q: 'How many workflows can I create?', a: 'Starter plans include up to 10 active workflows. Pro plans support 100 active workflows. Business plans are unlimited. Inactive (paused) workflows do not count toward your limit. All plans include unlimited run history retention for 90 days.' },
    { q: 'What is the maximum execution time for a workflow run?', a: 'Workflow runs have a maximum wall-clock time of 30 minutes. Individual step timeouts are configurable up to 5 minutes per step. Long-running workflows should use delay steps to pause between phases. Runs that exceed the timeout are automatically terminated and marked as failed with a timeout error.' },
    { q: 'Can workflows call external APIs that require OAuth?', a: 'Yes. Create a connection with OAuth credentials via POST /connections. The connection stores the refresh token and automatically handles token refresh before each workflow run. Supported OAuth flows: authorization code, client credentials, and refresh token. For browser-based OAuth, generate the initial token manually and store it as the connection credential.' },
    { q: 'How are secrets and API keys secured in workflows?', a: 'Never store secrets in workflow step configurations directly. Use the vault_secret() expression in step config values to pull secrets from the vault at runtime. Connection objects store credentials in the vault automatically. Workflow definitions in D1 and API responses never include secret values — only the secret name references.' },
    { q: 'Can I trigger a workflow from another workflow?', a: 'Yes. Use an echo_service step with service "echo-workflow-automation" and action "trigger_workflow", passing the target workflow ID and payload. This creates a parent-child run relationship visible in the run logs. Circular trigger chains are detected and blocked at activation time to prevent infinite loops.' },
  ],
}

export default function EchoWorkflowAutomationDocsPage() {
  return <ProductDoc {...data} />
}
