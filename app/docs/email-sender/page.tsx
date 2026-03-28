'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Email Sender',
  tagline: 'Transactional email delivery with AI-optimized subject lines, template engine, and full delivery tracking.',
  accent: '#14b8a6',
  productUrl: '/email-sender',
  workerUrl: 'https://echo-email-sender.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Email Sender is a high-performance transactional email delivery service built on Cloudflare Workers with Resend as the delivery backbone. Whether you are sending password resets, order confirmations, invoice notifications, or onboarding sequences, Echo Email Sender handles the delivery pipeline reliably at any scale — from a handful of messages per day to millions per month.',
    'Every email passes through an AI-powered subject line optimizer before delivery. The optimization engine queries Engine Runtime doctrine blocks to score subject lines on open-rate predictors — length, urgency signals, personalization tokens, and spam-trigger avoidance — then suggests improvements or auto-applies the best variant. The result is measurably higher open rates without A/B test cycles.',
    'The built-in template engine supports variable substitution, conditional blocks, and loop constructs so you define your email design once and reuse it across all sends. Delivery tracking captures opens, clicks, bounces, and complaints in real time. Shared Brain service bindings keep every send event in your organizational memory for analytics and audit trails.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Your Domain', desc: 'Add your sending domain in the Email Sender dashboard and follow the DNS verification steps. Echo Email Sender guides you through SPF, DKIM, and DMARC record setup to maximize deliverability from day one.' },
    { step: 2, title: 'Create Your First Template', desc: 'Use the template editor to design your email layout with HTML and plain-text variants. Insert variable placeholders like {{user.name}} and {{order.total}} that are replaced at send time with real data.' },
    { step: 3, title: 'Send a Test Email', desc: 'POST to /send with your recipient, subject, and either raw HTML or a template ID with variables. Verify the rendered output and delivery receipt before going live with production traffic.' },
    { step: 4, title: 'Enable AI Subject Optimization', desc: 'Add "optimize_subject": true to any send request to activate the AI optimizer. The optimizer evaluates your subject line against open-rate predictors and either returns a suggestion or auto-applies the top variant.' },
    { step: 5, title: 'Monitor Delivery & Engagement', desc: 'Visit the Logs and Stats endpoints or the dashboard to track delivery rates, open rates, click rates, bounces, and complaints per campaign, template, or individual send.' },
  ],

  features: [
    { title: 'Resend Provider Integration', desc: 'Built on Resend for reliable global delivery with automatic retry on transient failures, real-time delivery status webhooks, and bounce/complaint handling that protects your sender reputation.' },
    { title: 'AI Subject Line Optimization', desc: 'Engine Runtime integration scores every subject line on open-rate predictors before delivery. Flags spam triggers, suggests personalization improvements, and optionally auto-applies the highest-scoring variant.' },
    { title: 'Template Engine', desc: 'Define reusable HTML and plain-text templates with Handlebars-style variable substitution, conditional rendering, and loop constructs. Templates are versioned and stored in D1 with instant lookup by ID or slug.' },
    { title: 'Delivery Tracking', desc: 'Real-time webhooks from Resend capture delivered, opened, clicked, bounced, and complained events. All events stored in D1 and surfaced through the /logs and /stats endpoints with per-email granularity.' },
    { title: 'Engine Runtime Binding', desc: 'Service binding to echo-engine-runtime allows in-process AI analysis without external HTTP calls — fast subject optimization, content scoring, and compliance checks at zero network latency.' },
    { title: 'Shared Brain Binding', desc: 'Every send event is ingested into Shared Brain via service binding for cross-product analytics, audit trails, and long-term engagement pattern analysis without duplicating storage.' },
    { title: 'Batch Sending', desc: 'Send up to 100 emails in a single POST /send request with per-recipient variable overrides. Batch sends fan out concurrently for maximum throughput while respecting Resend rate limits automatically.' },
    { title: 'Suppression List', desc: 'Automatic suppression of hard-bounced addresses and opted-out recipients. Suppression list is checked on every send attempt to prevent reputation damage and comply with CAN-SPAM and GDPR requirements.' },
    { title: 'Unsubscribe Handling', desc: 'One-click unsubscribe links injected automatically into every email with token-based verification. Unsubscribe events update the suppression list in real time and trigger webhook callbacks to your application.' },
    { title: 'Analytics Dashboard', desc: 'Per-campaign, per-template, and per-domain analytics with time-series charts for delivery rate, open rate, click rate, and bounce rate. Export raw event data to CSV for custom analysis.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/send', desc: 'Send a transactional email. Accepts to, subject, html/text body or template_id with variables, and optional optimize_subject flag. Returns message_id and delivery status.', auth: true },
    { method: 'POST', path: '/send-template', desc: 'Send using a saved template by ID or slug. Pass a variables object for substitution. Supports per-recipient variable overrides for batch sends up to 100 recipients.', auth: true },
    { method: 'POST', path: '/optimize-subject', desc: 'Analyze and optimize a subject line without sending. Returns the original score, top suggestions, flagged spam triggers, and the recommended variant with projected open-rate lift.', auth: true },
    { method: 'GET', path: '/logs', desc: 'Retrieve delivery event logs with filtering by date range, status (delivered/opened/bounced), recipient domain, or template ID. Paginated with cursor-based navigation.', auth: true },
    { method: 'GET', path: '/stats', desc: 'Aggregate delivery statistics by campaign, template, or domain. Returns send count, delivery rate, open rate, click rate, bounce rate, and complaint rate for the requested period.', auth: true },
    { method: 'GET', path: '/templates', desc: 'List all saved templates with ID, slug, name, version, and last-modified timestamp. Supports filtering by tag and full-text search across template names and subjects.', auth: true },
    { method: 'POST', path: '/templates', desc: 'Create or update an email template. Accepts name, slug, subject, html, text, and optional variable schema for validation. Returns the template ID and version number.', auth: true },
  ],

  userGuide: [
    {
      title: 'Sending Transactional Emails',
      id: 'sending-emails',
      content: [
        'The /send endpoint is the core of Echo Email Sender. A minimal send request requires a to address, subject line, and either an html or text body. Optionally include reply_to, cc, bcc, and a headers object for custom SMTP headers. The response includes a message_id you can use to track delivery status via /logs.',
        'For sends with AI subject optimization, add "optimize_subject": true to your request body. The optimizer runs synchronously before delivery, adds approximately 80–120ms to the request, and logs both the original and optimized subjects in the delivery record so you can measure improvement over time.',
        'Batch sends use the same /send endpoint with a to array of up to 100 addresses. Each entry in the array can be a plain email string or an object with email and variables keys for per-recipient personalization. Batch sends process concurrently and return an array of message_id values in the same order as your recipients.',
      ],
    },
    {
      title: 'Building Templates',
      id: 'building-templates',
      content: [
        'Templates use Handlebars-style syntax: {{variable}} for simple substitution, {{#if condition}}...{{/if}} for conditional blocks, and {{#each items}}...{{/each}} for loops. Variable names are dot-notation paths into the variables object you pass at send time — for example {{user.firstName}} or {{order.lineItems}}.',
        'Every template stores both an HTML and a plain-text version. The plain-text version is automatically generated from the HTML if not provided, but providing a custom plain-text version gives you better control over the fallback experience in email clients that block images or HTML rendering.',
        'Templates are versioned automatically on every save. The /templates endpoint returns the latest version by default, but you can request a specific version by appending ?version=N to retrieve or restore historical variants. This lets you A/B test template changes with confidence that you can roll back instantly.',
      ],
    },
    {
      title: 'Delivery Tracking & Webhooks',
      id: 'delivery-tracking',
      content: [
        'Echo Email Sender captures all Resend delivery events and stores them in D1 indexed by message_id, recipient domain, and event timestamp. Query the /logs endpoint with filters to pull delivery history for any combination of recipient, template, date range, and event type.',
        'To receive real-time delivery events in your application, register a webhook URL in the dashboard. Webhook payloads include the message_id, event type, timestamp, and relevant metadata — recipient address for bounces, link URL for clicks, user agent for opens. Webhooks are signed with HMAC-SHA256 for verification.',
        'Hard bounces and spam complaints automatically update the suppression list and trigger a suppression webhook event. Review your suppression list regularly in the dashboard. You can export the full list, remove addresses that were suppressed in error, and configure alerting when bounce rates exceed configurable thresholds.',
      ],
    },
    {
      title: 'Monitoring Deliverability',
      id: 'monitoring-deliverability',
      content: [
        'The /stats endpoint returns aggregate metrics for any time period you specify. Key metrics to monitor are delivery rate (target >98%), open rate (industry average 20–40% depending on sector), bounce rate (keep below 2% to protect sender reputation), and complaint rate (must stay below 0.1% or ISPs may block your domain).',
        'If your bounce rate climbs, check the /logs endpoint filtered by status=bounced to identify the source. High bounce rates on a specific domain often indicate a typo in the address collection flow. High bounce rates across all domains may indicate list hygiene issues or a domain reputation problem with a specific ISP.',
        'Use the per-template stats to compare performance across different email types. If a particular template consistently shows lower open rates, bring that subject line to /optimize-subject for AI-driven improvement suggestions. The optimizer provides actionable feedback — not just a score — so you understand why a subject performs poorly.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Subject Line Optimization', desc: 'Engine Runtime analyzes subject lines against a scoring model trained on open-rate data from billions of transactional emails. Scores on length (optimal 41–50 chars), urgency language, personalization signals, question framing, emoji usage, and spam-trigger word presence.' },
    { capability: 'Spam Risk Assessment', desc: 'Pre-send analysis flags subject lines and HTML body content that match known spam filter triggers — ALL CAPS words, excessive punctuation, free/win/prize language, hidden text, image-only bodies, and broken HTML structure. Issues returned with severity levels and specific remediation.' },
    { capability: 'Send Time Prediction', desc: 'Shared Brain engagement history analyzed per recipient domain to predict optimal send windows. Recommendation engine suggests the hour-of-day and day-of-week with historically highest open rates for your audience segment.' },
    { capability: 'Content Personalization Score', desc: 'Evaluates the degree of personalization in your email templates — name usage, account-specific data inclusion, behavioral trigger alignment — and scores templates on predicted engagement lift versus a generic baseline.' },
  ],

  troubleshooting: [
    { issue: 'Emails not arriving in inbox', solution: 'Verify your SPF, DKIM, and DMARC DNS records are correctly configured in the dashboard — all three must show green checkmarks. Check the /logs endpoint for the message_id to see if Resend reported a delivery failure or deferral. If delivered but not appearing in inbox, the issue is likely a spam filter — review the pre-send spam risk check output.' },
    { issue: 'Template variables not rendering', solution: 'Ensure your variables object keys exactly match the placeholder names in your template, including case sensitivity. Nested variables like {{user.email}} require the full dot-notation path. Use the template preview endpoint with your variables object to test rendering before a live send.' },
    { issue: 'AI optimization returning no suggestions', solution: 'Subject lines under 10 characters or over 120 characters may not produce optimization suggestions. The optimizer requires at least one actionable improvement opportunity — if your subject line already scores in the top tier, it returns the original with a passing score and no change recommendations.' },
    { issue: 'High bounce rate on a specific domain', solution: 'Filter /logs by recipient domain and status=bounced to identify the bounce type. Hard bounces (code 5xx) indicate the address does not exist and addresses are added to suppression automatically. Soft bounces (code 4xx) are retried automatically. If a corporate domain is hard-bouncing all sends, check whether that domain blocks external senders in their MX policy.' },
  ],

  faq: [
    { q: 'What email provider does Echo Email Sender use for delivery?', a: 'Echo Email Sender uses Resend as its delivery provider, with routing through Cloudflare Workers for pre-send processing. Resend provides reliable global delivery infrastructure with built-in bounce handling, ISP feedback loop processing, and real-time delivery status webhooks.' },
    { q: 'How does AI subject line optimization work?', a: 'When you set optimize_subject: true, your subject line is analyzed by Engine Runtime against a scoring model that evaluates length, urgency signals, personalization tokens, question framing, and spam-trigger words. The optimizer returns the original score, a list of improvements, and the top recommended variant with projected open-rate lift.' },
    { q: 'Is there a sending limit per day or month?', a: 'Free plans include up to 3,000 sends per month. Pro plans support up to 100,000 sends per month. Enterprise plans have custom volume limits. All plans support batch sends up to 100 recipients per request. Rate limiting is enforced at the API level to stay within Resend account limits.' },
    { q: 'How are bounces and unsubscribes handled?', a: 'Hard bounces are automatically added to the suppression list and never sent to again. Soft bounces are retried with exponential backoff. Unsubscribe clicks update the suppression list in real time via token-verified webhook. Your application receives webhook callbacks for all suppression events so you can sync with your own database.' },
    { q: 'Can I use custom domains for sending?', a: 'Yes. Add and verify any domain you own through the dashboard with SPF, DKIM, and DMARC DNS record setup. Verified domains are available as from addresses immediately. Using a verified custom domain is strongly recommended over shared sending domains for maximum deliverability.' },
  ],
}

export default function EchoEmailSenderDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/email-sender' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
