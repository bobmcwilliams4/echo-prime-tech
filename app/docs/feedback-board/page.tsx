'use client'

import ProductDoc from '@/components/ProductDoc'

const data = {
  name: 'Echo Feedback Board',
  tagline: 'Public feedback management with upvoting, roadmaps, changelogs, and AI summarization',
  accent: '#f59e0b',
  productUrl: '/feedback-board',
  workerUrl: 'https://echo-feedback-board.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Feedback Board is a complete public feedback management platform that transforms raw user input into actionable product intelligence. Customers submit feature requests and bug reports, upvote existing items, and track the progress of requests through a structured status workflow — all without creating an account.',
    'The platform is built around a 7-stage status lifecycle (Open → Under Review → Planned → In Progress → Complete → Closed → Merged) with full vote transfer when duplicate items are merged. A public roadmap organizes planned work into quarterly milestones, giving users visibility into what is coming and when. Changelogs automatically close related feedback items when a release is published, keeping the board clean without manual housekeeping.',
    'AI-powered summarization clusters related feedback items, surfaces recurring pain points across hundreds of submissions, and drafts release notes from completed items. Internal notes allow product teams to annotate feedback with context that is never visible to submitters. The system runs on 10 D1 tables with 50+ API endpoints and supports multiple independent boards per account, each with its own domain, branding, and moderation settings.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/feedback-board and create your organization. One organization can host multiple boards for different products or teams.' },
    { step: 2, title: 'Create a Board', desc: 'Give your board a name and slug (e.g., /board/my-product). Set the board visibility (public or private), configure allowed post types (feature requests, bugs, or both), and optionally add a custom logo and accent color.' },
    { step: 3, title: 'Embed or Share the Public Link', desc: 'Share the public board URL directly with your users or embed the feedback widget on your site with a single <script> tag. The widget opens in a modal overlay and requires no iframe or extra dependencies.' },
    { step: 4, title: 'Triage Incoming Feedback', desc: 'From your admin dashboard, review new submissions in the Open queue. Move items to Under Review to signal acknowledgment, add internal notes with your triage reasoning, and merge duplicates to consolidate votes automatically.' },
    { step: 5, title: 'Publish Your Roadmap and Changelog', desc: 'Add planned items to quarterly roadmap milestones and publish a changelog entry when features ship. Changelog entries auto-close linked feedback items and notify upvoters via email that their request was fulfilled.' },
  ],
  features: [
    { title: 'Public Feedback Boards', desc: 'Each board has a public-facing URL where users can submit feedback, browse existing items, and upvote without requiring account creation. IP-based deduplication prevents vote manipulation — each IP address may cast one vote per item.' },
    { title: '7-Stage Status Workflow', desc: 'Items move through Open, Under Review, Planned, In Progress, Complete, Closed, and Merged statuses. Status transitions trigger webhooks and update subscribers. The Merged status transfers all votes from the duplicate to the canonical item.' },
    { title: 'Duplicate Detection and Merge', desc: 'Administrators can merge any two feedback items. The merged item inherits the combined vote count of both, all comments and attachments are preserved on the canonical item, and the duplicate redirects to the canonical URL permanently.' },
    { title: 'Public Roadmap with Quarters', desc: 'Organize planned and in-progress items into quarterly milestones (Q1 2026, Q2 2026, etc.). The public roadmap view groups items by quarter and displays vote counts, helping users understand priority and timeline.' },
    { title: 'Changelogs with Auto-Close', desc: 'Publish changelog entries linked to one or more feedback items. When a changelog is published, all linked items are automatically moved to the Complete or Closed status, and upvoters receive an email notification.' },
    { title: 'Internal Notes', desc: 'Add private notes to any feedback item — visible only to team members with admin access. Use internal notes to record engineering estimates, link to Jira tickets, or capture decisions without cluttering the public thread.' },
    { title: 'AI Feedback Summarization', desc: 'The AI summarizer clusters semantically similar submissions, identifies the top 5 recurring themes across open items, and generates a ranked list of the highest-impact improvements based on vote weight and recency signals.' },
    { title: 'Feature Requests and Bug Reports', desc: 'Boards support two distinct post types with separate templates. Feature requests capture the user story and use case. Bug reports capture reproduction steps, expected vs. actual behavior, and severity. Each type has its own moderation queue.' },
    { title: 'Comment Threads', desc: 'Every feedback item supports threaded comments. Public users can comment anonymously or with a display name. Administrators can pin comments, respond officially, and lock threads on closed items.' },
    { title: 'Webhook Notifications', desc: 'Configure webhooks to fire on status changes, new submissions, vote milestones, and changelog publications. Payloads are signed with HMAC-SHA256 for verification and include the full item object.' },
    { title: 'Multi-Board Organizations', desc: 'One organization can manage unlimited boards. Boards share a user pool, billing, and API key but have independent moderation settings, branding, roadmaps, and changelogs. Ideal for companies with multiple products.' },
    { title: 'Moderation Controls', desc: 'Set boards to require admin approval before submissions go public, configure profanity filtering, block specific email domains, and rate-limit submissions per IP to prevent spam flooding during product launches.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/boards', desc: 'Create a new feedback board under your organization with slug, title, visibility, and allowed post types', auth: true },
    { method: 'GET', path: '/boards/:slug', desc: 'Retrieve board metadata, settings, and stats (total items, open count, voter count) — public endpoint for published boards', auth: false },
    { method: 'POST', path: '/boards/:slug/posts', desc: 'Submit a new feedback item (feature request or bug report) to a board. Returns the created post with its unique ID and share URL', auth: false },
    { method: 'GET', path: '/boards/:slug/posts', desc: 'List all posts on a board with filtering by status, type, and sort order (votes, recent, trending). Supports pagination via cursor', auth: false },
    { method: 'POST', path: '/posts/:id/vote', desc: 'Cast or retract a vote on a feedback item. IP deduplication enforced server-side. Returns updated vote count', auth: false },
    { method: 'PATCH', path: '/posts/:id/status', desc: 'Update the status of a feedback item. Triggers webhooks and email notifications to upvoters. Merge action requires target_post_id', auth: true },
    { method: 'POST', path: '/posts/:id/notes', desc: 'Add an internal note to a feedback item, visible only to organization administrators', auth: true },
    { method: 'POST', path: '/boards/:slug/changelog', desc: 'Publish a changelog entry linked to one or more post IDs. Auto-closes linked posts and emails upvoters', auth: true },
    { method: 'GET', path: '/boards/:slug/roadmap', desc: 'Retrieve roadmap milestones with grouped posts, vote totals, and completion percentages per quarter', auth: false },
    { method: 'POST', path: '/posts/:id/ai-summary', desc: 'Trigger AI summarization for a post and its related cluster — returns theme analysis and suggested action', auth: true },
  ],
  userGuide: [
    {
      id: 'submitting-feedback',
      title: 'Submitting Feedback as a User',
      content: [
        'Navigate to the public board URL or open the embedded widget on the product site. Click "Submit Feedback" and choose between Feature Request and Bug Report. Each form includes a title field, a description area, and an optional attachment field.',
        'Before submitting, the board shows you the top 5 most similar existing items to prevent duplicate submissions. If your issue is already listed, click the upvote arrow instead of creating a new item — this consolidates signal and gives the team a clearer picture of demand.',
        'After submission, enter your email address to receive notifications when the status of your item changes. You will be notified when the team moves your item to Planned, completes it, or publishes a changelog that resolves it.',
      ],
    },
    {
      id: 'triage-workflow',
      title: 'Triaging the Feedback Queue',
      content: [
        'The Admin dashboard opens to the Moderation Queue, which shows all items awaiting review. Use keyboard shortcuts (A to approve, R to reject, N to add a note, M to merge) to process the queue rapidly. Batch actions let you approve or reject up to 50 items at once.',
        'When merging duplicates, search for the canonical item by title or ID. The merge dialog shows you the vote counts on both items and the combined total after merge. The duplicate item is permanently redirected to the canonical URL, so existing links continue to work.',
        'Add internal notes during triage to record your reasoning. Notes are timestamped and attributed to the team member who wrote them. Use the @mention syntax to tag colleagues in notes — they receive an in-app notification.',
      ],
    },
    {
      id: 'roadmap-management',
      title: 'Managing the Public Roadmap',
      content: [
        'Open the Roadmap editor from the admin sidebar. Create quarterly milestones (e.g., "Q2 2026 — Mobile App") and drag planned items into each milestone. The public roadmap view renders all milestones in chronological order with vote totals and completion progress bars.',
        'Items in a milestone automatically inherit the In Progress status when the milestone is marked active. When all items in a milestone are complete, the milestone is shown as delivered and archived to the changelog history.',
        'You can pin up to 3 milestones to the top of the public roadmap as "Focus Areas" — these appear with a highlighted border and a "Coming Soon" badge to signal near-term delivery to users.',
      ],
    },
    {
      id: 'changelog-publishing',
      title: 'Publishing Changelogs',
      content: [
        'Create a changelog entry from the Changelog section of the admin dashboard. Give it a version number or release name, a publication date, and a markdown-formatted body. Link it to one or more resolved feedback items using the item picker.',
        'When you publish, all linked items move to the Closed status and their upvoters receive an email with a link to the changelog entry. The public changelog renders as a clean timeline with release names, dates, and collapsible content sections.',
        'Use the AI draft feature to generate an initial changelog body from the titles and descriptions of the linked feedback items. The AI produces a user-facing summary that you can edit before publishing.',
      ],
    },
    {
      id: 'ai-tools',
      title: 'Using AI Tools',
      content: [
        'The AI Summarizer button in the board overview generates a cluster analysis of all open items. It groups semantically similar submissions, ranks clusters by combined vote weight, and outputs a prioritized list of themes with representative quotes from user submissions.',
        'Use the AI Release Notes generator on the Changelog creation screen to produce a first draft from completed items. It reads the item titles, descriptions, and any internal notes marked as "release context" to produce a user-friendly summary.',
        'The Duplicate Detector runs automatically when new submissions arrive — it flags items with cosine similarity above 0.85 to an existing open item and holds them in a dedicated review queue. You can confirm or dismiss each flag from the moderation dashboard.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Semantic Cluster Analysis', desc: 'Groups all open feedback items into semantic clusters using embedding similarity. Each cluster is ranked by combined vote weight so product teams immediately see which themes matter most to users.' },
    { capability: 'Automated Duplicate Detection', desc: 'Computes cosine similarity between new submissions and the existing item corpus. Items above the 0.85 similarity threshold are flagged for merge review before going public, keeping the board clean without manual monitoring.' },
    { capability: 'AI Changelog Drafting', desc: 'Reads completed item titles, descriptions, and release-context internal notes to produce a user-facing changelog entry in plain language. Produces a first draft in under 3 seconds that teams can edit before publishing.' },
    { capability: 'Priority Scoring', desc: 'Combines vote count, recency, comment activity, and semantic uniqueness into a priority score for each open item. Surfaces high-impact items that may have fewer votes but represent underserved user segments.' },
    { capability: 'Sentiment Analysis', desc: 'Classifies the emotional tone of each submission (frustrated, enthusiastic, neutral, confused) and surfaces spikes in negative sentiment that may indicate a production incident or breaking change that users have discovered.' },
    { capability: 'Theme Trend Detection', desc: 'Monitors how cluster sizes change week-over-week and alerts the product team when a previously small theme grows rapidly — an early signal that a pain point is becoming critical before vote counts catch up.' },
  ],
  troubleshooting: [
    { issue: 'Votes are not being counted', solution: 'IP deduplication is enforced — each IP address can cast only one vote per item. If testing from the same machine, votes after the first will be silently rejected. Use different IPs or check the vote log in the admin panel to verify the dedup is not being triggered incorrectly.' },
    { issue: 'Webhook deliveries are failing', solution: 'Check the webhook delivery log in Settings → Webhooks. Failed deliveries show the HTTP status code returned by your endpoint. Ensure your endpoint returns a 2xx status within 10 seconds. The system retries failed webhooks 3 times with exponential backoff.' },
    { issue: 'Merged item votes did not transfer', solution: 'Vote transfer only occurs for votes cast before the merge. If the canonical item already had votes from the same IPs as the duplicate, those votes are deduplicated in the merge and the total may be lower than the arithmetic sum of both items.' },
    { issue: 'Changelog did not auto-close linked items', solution: 'Verify the feedback items were correctly linked before publishing. Open the changelog entry in edit mode and confirm the linked items appear in the picker. Items must be in Open, Under Review, Planned, or In Progress status to be auto-closed — items already in Complete or Closed are unaffected.' },
    { issue: 'AI summarization returns no clusters', solution: 'Cluster analysis requires a minimum of 10 open items with sufficient text content. Short one-word submissions and items with only a title (no description) are excluded from the embedding corpus. Ensure the board has at least 10 descriptive items before running the summarizer.' },
  ],
  faq: [
    { q: 'Do users need to create an account to submit feedback?', a: 'No. Users can submit feedback and upvote items without any account. They provide an optional email address to receive status notifications. This frictionless flow maximizes submission rates.' },
    { q: 'Can I run multiple boards for different products?', a: 'Yes. One organization can host unlimited boards, each with its own slug, branding, post types, roadmap, and changelog. Boards share a single billing account and API key but are fully isolated from one another.' },
    { q: 'How does vote deduplication work?', a: 'Each vote is tied to a salted SHA-256 hash of the submitter\'s IP address. The hash is stored per item and checked on every vote submission. The raw IP address is never stored. If a user changes their IP (e.g., switches from WiFi to mobile data), they can cast a second vote, which is a deliberate trade-off for privacy.' },
    { q: 'Can I embed the feedback board on my own website?', a: 'Yes. Add a single script tag that loads the widget from echo-feedback-board.bmcii1976.workers.dev/widget.js?id=YOUR_BOARD_ID. The widget opens as a modal overlay and requires no iframe. It is styled to match your board\'s accent color and supports dark and light modes.' },
    { q: 'Are internal notes ever visible to end users?', a: 'Never. Internal notes are stored in a separate D1 table with a visibility flag and are filtered out of all public API responses. They are only returned for authenticated admin requests. There is no configuration option that would expose internal notes publicly.' },
    { q: 'What happens to votes when items are merged?', a: 'All votes from the duplicate item are transferred to the canonical item before the duplicate is archived. If the same IP voted on both items, only one vote is counted on the canonical item to prevent double-counting. The net result is always the union of unique voters across both items.' },
  ],
}

export default function FeedbackBoardDocsPage() {
  return <ProductDoc {...data} />
}
