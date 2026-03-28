'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Newsletter',
  tagline: 'Full-lifecycle email newsletter platform — build lists, automate drip sequences, and track every open and click.',
  accent: '#7c3aed',
  productUrl: '/newsletter',
  workerUrl: 'https://echo-newsletter.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Newsletter is a complete email marketing and newsletter platform built on Cloudflare Workers with 55+ API endpoints and 10 D1 tables. It handles the entire subscriber lifecycle — from embeddable signup widgets and multi-list segmentation to a full issue editor, scheduled sends, and real-time engagement tracking at the pixel level.',
    'Every newsletter goes through a structured issue lifecycle: draft your content in the rich editor, schedule it for a specific send time, watch the sending queue process recipients in parallel batches, and review the final sent analytics. Open tracking uses a 1×1 invisible pixel served from a Cloudflare-edge endpoint, while click tracking transparently redirects every link through an event-capture endpoint before forwarding to the destination URL — all with sub-millisecond overhead.',
    'Echo Newsletter ships with a public subscriber archive, RSS feed generation, embeddable subscribe widgets (one script tag per publication), and an automation engine for drip sequences. AI content generation (model ID GEN-01) helps you draft subject lines, intros, and full issue bodies from a topic prompt — reducing the time from idea to send to under 30 minutes.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create a Publication', desc: 'Navigate to /newsletter and click "New Publication." Give it a name, slug (used in the public archive URL and widget embed), and set your sender name and reply-to email. Each publication is an isolated namespace with its own subscriber list, issues, and analytics.' },
    { step: 2, title: 'Add Subscribers', desc: 'Import subscribers via CSV upload (name, email, optional custom fields), use the API to sync from your CRM, or drop the embeddable widget script onto any page. Widget.js?id=YOUR_PUB_ID renders a fully styled subscribe form that adds confirmed subscribers directly to your list.' },
    { step: 3, title: 'Write Your First Issue', desc: 'Create a new issue and give it a subject line and preview text. Write your content in the editor — add text blocks, images, buttons, and dividers. Toggle the AI assist button to generate a draft body from a brief topic prompt using the GEN-01 engine.' },
    { step: 4, title: 'Schedule or Send Immediately', desc: 'Choose to send immediately or schedule for a future date and time. The platform queues outgoing emails, processes recipients in parallel batches, updates issue status through draft → scheduled → sending → sent, and captures every delivery event.' },
    { step: 5, title: 'Review Analytics', desc: 'Open the Analytics tab to see unique opens, total clicks, unsubscribes, and bounce events for each issue. Click-by-link breakdowns show which CTAs are driving traffic. Subscriber-level events let you see exactly who opened and what they clicked.' },
  ],

  features: [
    { title: 'Multi-List Subscriber Management', desc: 'Organize subscribers across multiple named lists within each publication. Assign subscribers to one or many lists, segment sends to specific lists, and manage subscription preferences at the list level with independent unsubscribe links.' },
    { title: 'Issue Lifecycle Engine', desc: 'Every issue progresses through five explicit states: draft, scheduled, sending, sent, and archived. State transitions are atomic, logged, and trigger downstream actions — scheduler picks up queued issues, analytics aggregates on send completion, archive updates on publish.' },
    { title: 'Pixel-Level Open Tracking', desc: 'A 1×1 transparent GIF is injected at the bottom of every HTML email. When the image loads, the edge endpoint logs the subscriber ID, issue ID, timestamp, IP, and user agent — giving you a precise open rate without any client-side JavaScript.' },
    { title: 'Click Redirect Tracking', desc: 'Every hyperlink in outgoing emails is rewritten to route through the /track/click endpoint before redirecting to the original destination. Click events capture the link target, subscriber, issue, and timestamp. Redirect latency is under 5ms on Cloudflare edge.' },
    { title: 'Embeddable Subscribe Widget', desc: 'One script tag (widget.js?id=PUBLICATION_ID) adds a fully styled subscribe form to any website. The widget handles email validation, duplicate detection, confirmation email sending, and double opt-in flow — all without requiring any backend code on the host site.' },
    { title: 'Drip Automation Sequences', desc: 'Build multi-step drip campaigns that automatically send a series of emails to new subscribers. Define each step with a delay (hours or days after the previous), assign a template, and let the automation engine handle scheduling and delivery per subscriber join date.' },
    { title: 'Public Archive', desc: 'Every sent issue is available at your public archive URL (echo-ept.com/newsletter/archive/SLUG). Readers can browse the full history, read past issues in a clean web view, and subscribe from the archive page. Archive access is configurable per publication.' },
    { title: 'RSS Feed Generation', desc: 'A live RSS feed is automatically maintained for each publication at /rss/SLUG. It includes the 20 most recent sent issues with full content, publish dates, and links. Compatible with all major RSS readers and podcast apps for content syndication.' },
    { title: 'AI Content Generation (GEN-01)', desc: 'The GEN-01 engine generates subject line options, preview text, intro paragraphs, and full issue drafts from a brief prompt. Provide a topic, target audience, and tone — GEN-01 returns structured content blocks ready to review and publish. Generation requests are async with a webhook callback.' },
    { title: 'Bounce & Unsubscribe Processing', desc: 'Hard bounces are automatically marked in the subscriber record and suppressed from future sends. Soft bounces are tracked with a counter — three consecutive soft bounces trigger automatic suppression. One-click unsubscribes update subscriber status instantly and confirm with a landing page.' },
    { title: 'Webhook Events', desc: 'Subscribe to newsletter events via outbound webhooks: subscriber.created, issue.sent, email.opened, email.clicked, subscriber.unsubscribed, and bounce.recorded. Payloads are signed with HMAC-SHA256 for verification and delivered with automatic retry on failure.' },
    { title: 'CSV Import / Export', desc: 'Bulk import subscribers from any CSV with intelligent column mapping for name, email, and custom fields. Export subscriber lists or issue analytics to CSV at any time. Scheduled exports can auto-send to an S3 bucket or webhook endpoint for data warehouse sync.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/publications', desc: 'List all publications with subscriber counts, issue totals, and last send date. Supports pagination and search by name.', auth: true },
    { method: 'POST', path: '/api/publications', desc: 'Create a new publication with name, slug, sender name, reply-to email, and optional custom branding colors.', auth: true },
    { method: 'GET', path: '/api/publications/:id/subscribers', desc: 'List subscribers for a publication with filtering by list, status (active, unsubscribed, bounced), and join date range.', auth: true },
    { method: 'POST', path: '/api/publications/:id/subscribers', desc: 'Add a subscriber to a publication. Accepts name, email, list assignments, and custom field values. Deduplicates on email.', auth: true },
    { method: 'POST', path: '/api/publications/:id/issues', desc: 'Create a new issue (draft). Accepts subject, preview_text, html_body, plain_body, and optional scheduled_at timestamp.', auth: true },
    { method: 'PUT', path: '/api/issues/:id/schedule', desc: 'Schedule a draft issue for delivery. Set scheduled_at to a future ISO timestamp. Issue status transitions to "scheduled."', auth: true },
    { method: 'POST', path: '/api/issues/:id/send', desc: 'Send an issue immediately to all active subscribers or a specific list segment. Returns a send_job_id for progress polling.', auth: true },
    { method: 'GET', path: '/api/issues/:id/analytics', desc: 'Retrieve send analytics for an issue: total sent, unique opens, open rate, total clicks, click rate, unsubscribes, and bounces.', auth: true },
    { method: 'GET', path: '/api/track/open', desc: 'Open tracking pixel endpoint. Logs an open event and returns a 1×1 transparent GIF. Accepts encoded subscriber+issue tokens.', auth: false },
    { method: 'GET', path: '/api/track/click', desc: 'Click redirect endpoint. Logs a click event and redirects to the destination URL. Accepts encoded link+subscriber+issue tokens.', auth: false },
    { method: 'GET', path: '/api/archive/:slug', desc: 'Public archive endpoint. Returns the 20 most recent sent issues for a publication by slug. No authentication required.', auth: false },
    { method: 'POST', path: '/api/ai/generate', desc: 'AI content generation endpoint. Submit a topic, tone, and audience — returns subject options and a full structured issue draft from GEN-01.', auth: true },
  ],

  userGuide: [
    {
      id: 'managing-subscribers',
      title: 'Managing Subscribers',
      content: [
        'Subscribers are the core asset of every publication. Each subscriber record holds their email address, display name, status (active, unsubscribed, bounced), the lists they belong to, custom field values, and a full event history of every email interaction. Subscribers belong to a publication and can be members of multiple lists within that publication.',
        'To import existing subscribers, go to Subscribers > Import and upload a CSV. The importer auto-detects email and name columns and lets you map any additional columns to custom fields. A dry-run preview shows matched columns and sample rows before you commit the import. Duplicate emails within the same publication are silently merged.',
        'The subscriber detail view shows the complete event timeline: every issue they received, whether they opened it, which links they clicked, and any bounce or unsubscribe events. Use this view to understand individual engagement patterns or to manually resubscribe a contact who accidentally unsubscribed.',
      ],
    },
    {
      id: 'creating-issues',
      title: 'Creating & Sending Issues',
      content: [
        'Each issue is composed of a subject line, preview text (shown in email clients before the email is opened), and an HTML body. The built-in editor provides blocks for headings, paragraphs, images, buttons, dividers, and raw HTML for custom sections. All blocks are mobile-responsive by default.',
        'Before sending, use the Preview & Test section to render your issue in a desktop and mobile preview, and to send yourself a test email. Test sends do not count as opens or clicks in analytics — they use a dedicated test tracking scope. Check your subject and preview text across simulated email clients in the Inbox Preview tab.',
        'When you\'re ready to send, choose "Send Now" to start delivery immediately or "Schedule" to set a specific date and time in any timezone. The issue status progresses automatically: draft → scheduled → sending (once the send job starts) → sent (when all recipients have been processed). You can monitor send progress in the Status tab with a live recipient counter.',
      ],
    },
    {
      id: 'drip-sequences',
      title: 'Drip Automation Sequences',
      content: [
        'Drip sequences automatically send a series of emails to new subscribers at defined intervals. A sequence is associated with a publication and consists of ordered steps — each step has a delay from the previous step, a subject line, and a body template. Sequences run per-subscriber, triggered when they join.',
        'Create a drip sequence from Automations > New Sequence. Add steps in order, setting the delay as "send X hours/days after the previous step." The first step can have a zero delay (send immediately on subscribe) for a welcome email. Preview each step, reorder steps by dragging, and activate the sequence when ready.',
        'The sequence engine checks every hour for subscribers who are due for the next step. If a subscriber unsubscribes at any point, they are immediately removed from all pending sequence steps. You can pause a sequence without removing pending steps, or cancel it to clear all queued deliveries.',
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics & Reporting',
      content: [
        'Every sent issue generates a live analytics dashboard with key metrics: total recipients, unique opens, open rate, total clicks, unique click rate, unsubscribe count, bounce count, and a click-by-link breakdown showing each link\'s click total. Metrics update in real time as events arrive from the tracking endpoints.',
        'The Subscribers analytics view shows list growth over time, churn rate, engagement distribution (hot, warm, cold subscribers by open recency), and top-performing subscriber segments. Use cohort analysis to compare engagement between subscribers acquired in different months.',
        'Export any analytics view to CSV from the Export button. Scheduled analytics reports can be configured to auto-generate weekly or monthly summaries and deliver them to your email or a webhook endpoint for ingestion into your data warehouse.',
      ],
    },
    {
      id: 'widget-integration',
      title: 'Subscribe Widget Integration',
      content: [
        'The embeddable subscribe widget lets you add a signup form to any website with a single script tag. Find your widget embed code in Publication Settings > Widget. It includes a script src pointing to widget.js?id=YOUR_PUB_ID and a container div where the form renders.',
        'The widget supports several configuration options passed as data attributes on the container div: data-list to pre-assign subscribers to a specific list, data-redirect to specify a post-subscribe URL, data-theme to select light or dark mode, and data-fields to request additional fields like first name or phone.',
        'All form submissions are sent directly to the Echo Newsletter API with CORS headers allowing any origin. The widget handles client-side validation, duplicate email detection, and double opt-in confirmation email delivery. No backend code is required on the host site — the widget is fully self-contained.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Issue Draft Generation (GEN-01)', desc: 'Submit a topic, target audience, tone, and approximate length — GEN-01 returns a complete issue draft with subject line, preview text, intro paragraph, body sections, and a closing CTA. Generated content is structured as editable blocks ready to review and adjust before sending.' },
    { capability: 'Subject Line Optimization', desc: 'AI analyzes your publication\'s historical open rate data to identify subject line patterns that resonate with your audience — length, emoji usage, question vs. statement framing, personalization tokens. Returns 3-5 optimized subject line variants per issue with predicted open rate estimates.' },
    { capability: 'Engagement Segmentation', desc: 'Automatically classifies subscribers into engagement tiers (champions, loyal, at-risk, dormant) based on open recency, click frequency, and overall engagement score. Use these segments to send re-engagement campaigns to dormant subscribers or exclusive content to champions.' },
    { capability: 'Send Time Optimization', desc: 'Analyzes per-subscriber open timestamps to identify each individual\'s peak engagement window. Recommend optimal send times that maximize open rates for your specific audience distribution across timezones, days of week, and times of day.' },
    { capability: 'Content Quality Scoring', desc: 'Before sending, AI reviews your issue content for readability score, spam trigger words, link-to-text ratio, image-to-text balance, and mobile rendering issues. Returns a quality score with specific improvement recommendations to maximize deliverability and engagement.' },
  ],

  troubleshooting: [
    { issue: 'Emails going to spam', solution: 'Verify your publication\'s sending domain has SPF, DKIM, and DMARC records configured in DNS. Go to Publication Settings > Sending Domain to see the current authentication status and the exact DNS records you need to add. Unauthenticated sends use shared infrastructure which has higher spam risk. Also review your issue content — avoid excessive caps, multiple exclamation points, and spam-trigger phrases flagged in the AI quality check.' },
    { issue: 'Open rate tracking not showing', solution: 'Open tracking requires the recipient\'s email client to load images. Many email clients block images by default, which is why real open rates are always an undercount. Ensure your HTML email includes the tracking pixel (it\'s injected automatically by the send engine — verify the issue template is using the standard send path and not a raw SMTP bypass). Check the issue detail > Events tab to confirm pixel requests are arriving.' },
    { issue: 'Widget embed not appearing', solution: 'Confirm the script tag is in the page body and the container div with the matching data-pub attribute is present. Check the browser console for CORS errors or script load failures. If your site uses a Content Security Policy, add echo-newsletter.bmcii1976.workers.dev to the connect-src and script-src directives. Test the widget on a plain HTML page to isolate site-specific conflicts.' },
    { issue: 'Drip sequence not sending', solution: 'Verify the sequence is in "active" status — paused sequences do not process steps. Check that the subscriber\'s status is "active" (unsubscribed or bounced subscribers are excluded from sequences). The sequence engine runs hourly, so there can be up to a 60-minute delay between a subscriber joining and the first step being queued. Check the Automations > Logs tab for execution history and error details.' },
    { issue: 'CSV import shows zero subscribers added', solution: 'The CSV must be UTF-8 encoded with a header row in the first line. The email column must be named "email" or mapped to the email field in the import wizard. Rows with invalid email formats, missing emails, or emails that already exist as active subscribers are skipped. Download the import error report after the attempt to see which rows were rejected and the specific reason for each rejection.' },
  ],

  faq: [
    { q: 'Is there a subscriber or send volume limit?', a: 'Free plans support up to 1,000 subscribers and 5,000 sends/month. Pro plans support up to 50,000 subscribers and 500,000 sends/month. Enterprise plans have no hard limits and include dedicated sending infrastructure with enhanced deliverability. All plans include unlimited publications and issues.' },
    { q: 'How does double opt-in work?', a: 'When double opt-in is enabled for a publication, new subscribers receive a confirmation email with a unique link. Their status remains "pending" until they click the confirmation link, at which point it changes to "active" and they receive the welcome email or first drip step. Pending subscribers are excluded from all newsletter sends. Double opt-in is required for GDPR compliance in the EU.' },
    { q: 'Can I use a custom sending domain?', a: 'Yes. In Publication Settings > Sending Domain, add your domain and follow the instructions to configure CNAME, SPF, DKIM, and DMARC records. Once DNS propagates (usually under an hour), all newsletters from that publication send with your domain in the From header. Custom domains improve deliverability and brand recognition significantly.' },
    { q: 'How does the RSS feed work?', a: 'Echo Newsletter automatically generates a valid RSS 2.0 feed for each publication at /rss/PUBLICATION_SLUG. The feed includes the 20 most recent sent issues with title, description (preview text), full content, author, and publish date. The feed updates automatically each time a new issue is sent. Readers can subscribe in any RSS reader using the feed URL.' },
    { q: 'Does the AI generation use my subscriber data?', a: 'AI content generation (GEN-01) uses only the topic, tone, and audience description you provide in the generation request. It does not access your subscriber list, past issues, or analytics data unless you explicitly include that context in your prompt. No subscriber data is sent to external AI services.' },
    { q: 'How are unsubscribes handled?', a: 'Every outgoing email includes a one-click unsubscribe link in the footer (required by CAN-SPAM and GDPR). Clicking the link immediately sets the subscriber status to "unsubscribed" without requiring a login or confirmation page. Unsubscribed contacts are permanently suppressed from all future sends for that publication. The List-Unsubscribe email header is also included for email clients that surface the unsubscribe action in their UI.' },
  ],
}

export default function EchoNewsletterDocsPage() {
  return <ProductDoc {...data} />
}
