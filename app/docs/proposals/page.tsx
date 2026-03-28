'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Proposals',
  tagline: 'AI-powered proposal platform with content generation, branded client portals, e-signatures, view tracking, and win rate analytics.',
  accent: '#be185d',
  productUrl: '/proposals',
  workerUrl: 'https://echo-proposals.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Proposals transforms the way your team creates and closes deals. Instead of assembling proposals in Word or PowerPoint and attaching PDFs to emails, Echo Proposals gives every prospect a live, interactive web portal at /p/:slug — a fully branded page where they can read your proposal, leave comments, accept pricing, and sign directly in the browser without downloading anything.',
    'The AI content engine (GEN-01) accelerates proposal writing by generating tailored sections from a brief description of the client\'s problem and your proposed solution. Pricing tables support tiered options, line-item discounts, and tax calculations — clients can select from multiple service tiers and see totals update in real time. View time tracking via the sendBeacon API captures exactly how long a prospect spends on each section, giving your sales team intelligence about where interest is highest and where objections may be forming.',
    'The complete proposal lifecycle — from first draft to sent to viewed to accepted to signed — is tracked with version control so you can clone and revise without losing the original. Win rate analytics report on average proposal-to-close time, most viewed sections, pricing tier selection rates, and which proposal templates generate the highest acceptance rates. Every accepted proposal carries a legally valid e-signature with a full IP-based audit trail.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Brand Profile', desc: 'Upload your company logo, set your primary brand color, configure your company name and contact details. These appear on every client portal your team creates. Set a custom sending domain for proposal links (e.g., proposals.yourcompany.com) on Enterprise plans.' },
    { step: 2, title: 'Build a Proposal Template', desc: 'Create a reusable template with standard sections — Executive Summary, Problem Statement, Our Solution, Scope of Work, Pricing, Timeline, Team, Terms. Templates can have AI-generated content placeholders that auto-fill when you create a proposal from the template.' },
    { step: 3, title: 'Create Your First Proposal', desc: 'Click "New Proposal," select a template, enter the client name and project description. Click "Generate with AI" to auto-draft content for each section. Edit and refine, then build your pricing table with service tiers, line items, and discount rules.' },
    { step: 4, title: 'Send to Client', desc: 'Click "Send Proposal" — the client receives a branded email with a link to their unique portal at /p/:slug. The portal opens immediately, no account required. View tracking starts the moment the link is opened.' },
    { step: 5, title: 'Track & Close', desc: 'Monitor the proposal dashboard for view activity — how many times it\'s been opened, which sections were read, and how long the client spent on pricing. When the client is ready, they click "Accept & Sign" directly in the portal to close the deal.' },
  ],

  features: [
    { title: 'AI Content Generation', desc: 'GEN-01 powered content generation creates tailored proposal sections from a project brief. Input the client\'s problem, your proposed solution, and key differentiators — the AI drafts an executive summary, problem analysis, solution overview, and scope of work in seconds. Edit or regenerate individual sections.' },
    { title: 'AI Pricing Suggestions', desc: 'Based on project scope, industry, and your historical win data, the AI suggests pricing ranges for each service component. Shows comparable projects from your history and market benchmarks. Final pricing decisions stay with your team — AI only informs, never overrides.' },
    { title: 'Branded Client Portal', desc: 'Every proposal lives at /p/:slug — a live, interactive web page with your logo, brand colors, and domain. Clients never see generic proposal software branding. Sections are navigable via a sticky table of contents. The portal is mobile-optimized for reading on any device.' },
    { title: 'Pricing Tables', desc: 'Build multi-tier pricing tables with service packages, individual line items, quantity adjustments, per-item discounts, subtotals, tax rates, and grand totals. Clients can select from multiple tiers (Basic, Pro, Enterprise) with totals updating in real time. Optional approval-required toggles for custom pricing.' },
    { title: 'E-Signature with Audit Trail', desc: 'Clients accept and sign directly in the browser using an HTML5 Canvas signature. Each signature captures the signer\'s name, company, IP address, user agent, GPS coordinates (if permission granted), and timestamp. Generates a signed proposal PDF with an appended certificate of acceptance.' },
    { title: 'View Time Tracking', desc: 'The sendBeacon API logs view sessions with per-section time data. See exactly how many seconds a prospect spent on your pricing section vs your scope of work. Identify disengaged proposals early and re-engage before they go cold. View history is accessible to the proposal owner in real time.' },
    { title: 'Clone & Revise Workflow', desc: 'Clone any proposal to create a new version while preserving the original. Version history shows all iterations with creation date, editor, and status. Compare versions side-by-side. When a client requests revisions, clone and revise rather than overwriting — maintain a complete history of what was offered and when.' },
    { title: 'Client Comments', desc: 'Clients can leave inline comments on any proposal section directly in the portal. Comments notify the proposal owner via email and appear in the proposal dashboard. Sales reps can reply directly from the dashboard. Comment threads create a record of client concerns and how they were addressed.' },
    { title: 'Auto-Expiration & Follow-up', desc: 'Set proposal expiration dates — the portal shows a countdown timer to create urgency. Expired proposals display an "Request Updated Proposal" button. Configure automatic follow-up email sequences for proposals that have been viewed but not accepted after N days.' },
    { title: 'Proposal Templates', desc: 'Build a library of industry-specific and service-specific templates with standard language, pre-configured pricing tables, and AI content placeholders. Share templates across the team with editing permissions. Lock sections that should never change (legal terms, disclaimers) while leaving others editable.' },
    { title: 'Win Rate Analytics', desc: 'Dashboard reporting on proposal performance: total sent, open rate, acceptance rate by template, average time-to-accept, most/least viewed sections, pricing tier selection distribution, and revenue won vs lost. Filter by time period, team member, industry, or proposal template.' },
    { title: 'CRM Integration', desc: 'Webhook events fire on proposal_sent, proposal_viewed, proposal_accepted, and proposal_signed. Each event includes full proposal data for automatic CRM deal stage updates. Direct integrations available for Salesforce, HubSpot, and Pipedrive on Enterprise plans.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/proposals', desc: 'Create a new proposal with client details, sections, pricing table, and settings. Optionally pass a template ID to inherit structure. Returns proposal ID and the /p/:slug client portal URL.', auth: true },
    { method: 'POST', path: '/api/proposals/:id/generate', desc: 'Trigger AI content generation for one or all sections of a proposal. Pass section IDs and a brief (problem, solution, differentiators) — returns AI-drafted content for each requested section.', auth: true },
    { method: 'POST', path: '/api/proposals/:id/send', desc: 'Send the proposal to the client via email with the portal link. Records the sent timestamp. Optional: include a custom message and set an expiration date at send time.', auth: true },
    { method: 'GET', path: '/api/proposals/:id/analytics', desc: 'Get detailed view analytics for a proposal: total views, unique viewers, per-section time spent, last viewed timestamp, and a timeline of all view events.', auth: true },
    { method: 'POST', path: '/api/proposals/:id/clone', desc: 'Clone an existing proposal into a new draft. All sections, pricing, and settings are copied. Original proposal is preserved unchanged. Returns the new proposal ID.', auth: true },
    { method: 'GET', path: '/p/:slug', desc: 'Public client portal endpoint — no auth required. Returns the branded, interactive proposal page. View tracking begins on load via sendBeacon. Requires the proposal to be in sent or viewed status.', auth: false },
    { method: 'POST', path: '/p/:slug/accept', desc: 'Client acceptance endpoint called when the client clicks "Accept & Sign." Accepts signature data, client name, and company. Records the acceptance event and generates the signed PDF.', auth: false },
    { method: 'GET', path: '/api/analytics/win-rates', desc: 'Aggregate win rate analytics across all proposals with filtering by date range, template, team member, and industry. Returns acceptance rates, average time-to-close, and revenue metrics.', auth: true },
  ],

  userGuide: [
    {
      id: 'creating-proposals',
      title: 'Creating a Proposal',
      content: [
        'Start by clicking "New Proposal" from the dashboard. Choose to start from a template (recommended) or from scratch. If starting from a template, select the most relevant one for the project type — the section structure, standard language, and pricing table configuration carry over automatically, giving you an 80% complete foundation.',
        'Fill in the client name, project name, and contact email on the Proposal Settings panel. These populate placeholders throughout the proposal content and configure the client portal. Optionally set an expiration date and enable the pricing selection feature if you want to offer multiple service tiers.',
        'Work through each section editor — rich text editing with formatting, images, embedded videos, and file attachments. For any section, click "Generate with AI" and provide a brief describing what this section should cover. The AI drafts the section content which you can edit, regenerate, or accept as-is. The AI maintains context across sections so later sections reference earlier ones coherently.',
      ],
    },
    {
      id: 'pricing-tables',
      title: 'Pricing Tables',
      content: [
        'The pricing table editor lives in the Pricing section of every proposal. Add service tiers (e.g., Starter, Professional, Enterprise) or build a line-item table without tiers. Each line item has a name, description, unit (hour, month, flat, license), quantity, unit price, optional discount percentage, and optional tax rate. The table totals update in real time as you edit.',
        'For multi-tier proposals, each tier is a separate column with its own set of line items and total. The client selects their preferred tier in the portal and the selected tier\'s total carries into the signature acceptance section. You can mark a specific tier as "Recommended" to highlight it visually in the portal.',
        'Discount rules can be applied at the line item level (percentage or fixed amount off a specific service) or at the proposal level (a global discount applied after subtotal). Custom pricing requests — where the client asks for a modified scope — trigger a notification to the proposal owner who can clone, revise, and resend with the adjusted pricing.',
      ],
    },
    {
      id: 'client-portal',
      title: 'The Client Portal Experience',
      content: [
        'The client portal at /p/:slug is a live web page — not a PDF, not an attachment — that loads in any browser without requiring any software installation or account creation. The page displays your company logo and brand color in the header, a sticky table of contents for navigation, and each proposal section rendered with full formatting including images, bullet points, and embedded media.',
        'View tracking is invisible to the client. As they scroll through sections, the sendBeacon API silently logs entry and exit times for each section. This data is immediately available in your proposal dashboard — you\'ll know within seconds if a prospect just opened your proposal and which section they\'re reading right now.',
        'The Pricing section in the portal shows the interactive pricing table. For multi-tier proposals, clients click a tier to select it and see the total update. When ready to accept, they click the "Accept Proposal" button, enter their name and company, draw their signature on the canvas, and click "I Accept." The portal confirms acceptance with a thank-you message, sends them a copy of the signed proposal, and notifies your team immediately.',
      ],
    },
    {
      id: 'version-control',
      title: 'Version Control & Collaboration',
      content: [
        'Every proposal maintains a complete version history. The first time you send a proposal it becomes Version 1. If the client requests changes, clone the proposal to create Version 2 — the original is preserved in your history, and the new version starts with all the same content ready to edit. Send Version 2 to the client, and they\'ll see the updated portal while the Version 1 link still works to view the original offer.',
        'The version history panel shows each version with creation date, creator, status (draft, sent, viewed, accepted, declined, expired), and the key differences from the previous version (sections edited, pricing changed). Restore any version as a new draft with one click.',
        'Multiple team members can edit a proposal simultaneously with live collaboration indicators showing who is editing which section. Comments and change notes can be added to each edit for context. The activity log records every edit with editor identity and timestamp.',
      ],
    },
    {
      id: 'analytics',
      title: 'Proposal Analytics & Win Rate',
      content: [
        'The Proposal Analytics dashboard gives your sales team real-time and historical intelligence on how proposals perform. For individual proposals, the analytics tab shows a view timeline — every time the portal was opened, by whom (if the client has a tracked email), how long they stayed, and which sections received the most attention. The section heatmap visualizes engagement across the document.',
        'Team-level analytics aggregate performance across all proposals to surface patterns. Which templates have the highest acceptance rates? Which team members close fastest from send to signature? Which industries respond best to which pricing structures? These insights feed directly into proposal strategy — double down on what works, revise what doesn\'t.',
        'The AI win rate model analyzes the characteristics of won vs lost proposals to identify which factors most strongly predict acceptance: proposal length, time-to-send after first contact, number of pricing tiers offered, presence of specific sections (case studies, team bios, ROI calculators), and pricing position relative to your historical range. These factors are surfaced as pre-send recommendations when you\'re finalizing a proposal.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Proposal Content Generation', desc: 'GEN-01 generates complete proposal sections from a project brief — problem analysis, executive summary, solution overview, scope of work, methodology, and differentiation narrative. Maintains internal consistency across sections, referencing earlier content to build a coherent story. Supports regeneration at the paragraph level for targeted rewrites.' },
    { capability: 'Pricing Optimization', desc: 'Analyzes your historical win/loss data by price point, industry, company size, and project type to suggest optimal pricing ranges for each new proposal. Flags pricing that is statistically below market (underpricing risk) or above your typical win range (competitive risk) before sending.' },
    { capability: 'Win Probability Scoring', desc: 'Scores each proposal\'s win probability in real time based on client engagement signals (view time, section focus, comment activity), proposal characteristics (template, pricing tier, length), and historical patterns from similar proposals. Updates the score as new engagement data arrives.' },
    { capability: 'Engagement Anomaly Detection', desc: 'Identifies unusual engagement patterns that may signal buying intent or risk — a prospect who views the pricing section 5+ times in a day, a proposal that was forwarded to additional viewers (suggesting internal review), or a proposal that has not been opened 7+ days after sending (re-engagement trigger).' },
    { capability: 'Objection Anticipation', desc: 'Analyzes client comment patterns and section focus data to predict likely objections before the discovery call. If a prospect spends disproportionate time on the pricing section but doesn\'t leave comments, the system flags a likely price objection. Suggests talking points and proposal amendments to address anticipated concerns.' },
    { capability: 'Template Performance Intelligence', desc: 'Continuously analyzes which proposal templates, section structures, and content patterns are associated with higher acceptance rates and faster close times. Surfaces recommendations for template improvements and flags underperforming templates for revision. Compares your win rates to anonymized benchmarks from similar industries.' },
  ],

  troubleshooting: [
    { issue: 'Client portal showing 404 or not loading', solution: 'Verify the proposal status is "Sent" or "Viewed" — portals for proposals in Draft status are not publicly accessible. Check that the /p/:slug URL was not modified when shared with the client (some email clients add tracking parameters that can break the slug). Confirm the proposal has not been expired or voided — expired portals show an expiration message rather than 404. If the proposal appears active in your dashboard but the portal returns 404, regenerate the portal link from the proposal settings.' },
    { issue: 'AI content generation returning generic or inaccurate content', solution: 'The quality of generated content depends heavily on the brief quality. Include specific details about the client\'s industry, the specific problem they\'re solving, your unique approach, key differentiators, and any specific terminology the client uses. A brief with 3-5 sentences per section produces significantly better results than a 1-sentence brief. If the output is still unsatisfactory, try the "Regenerate with Different Angle" option which prompts the model from a different perspective.' },
    { issue: 'View tracking not showing data', solution: 'View tracking uses the sendBeacon API which requires JavaScript to be enabled in the client\'s browser. Some corporate security tools block analytics beacons — if you know a specific client uses aggressive content filtering, view tracking may be unavailable for them. Check that your proposal is in "Sent" status (view tracking only activates after sending). Allow 30 seconds after opening for the first beacon to register.' },
    { issue: 'Signature not appearing on the signed PDF', solution: 'If the completion email PDF is missing the signature, trigger a PDF regeneration from the proposal\'s Acceptance tab. The signature canvas data is stored separately and re-rendered onto the PDF. If the canvas data is present in the audit trail but missing from the PDF, this indicates a rendering issue — contact support with the proposal ID and the affected page number.' },
    { issue: 'Pricing table totals calculating incorrectly', solution: 'Verify that discount amounts are entered as percentage values (10 for 10%, not 0.10). Check that tax rates are applied to the correct subtotal — line-item taxes apply before discounts by default, which can affect the expected total. If using multi-currency, confirm the display currency matches the client\'s expected currency. Use the "Preview Client View" button to see exactly what totals the client sees before sending.' },
  ],

  faq: [
    { q: 'Can clients leave comments or ask questions in the portal?', a: 'Yes. The client portal includes an inline comment feature — clients highlight any section and click "Add Comment" to leave a note. Comments notify the proposal owner by email immediately and appear in the proposal\'s Comments tab in your dashboard. Replies from your team are delivered to the client by email with a link back to the comment thread in the portal.' },
    { q: 'How many proposals can I create per month?', a: 'Starter plans include 10 active proposals and 5 AI generations per month. Professional plans allow 100 active proposals and unlimited AI generations. Enterprise plans are unlimited. All plans retain completed and expired proposals indefinitely in your history — the monthly limits apply only to active (unsent or in-progress) proposals.' },
    { q: 'Can I use a custom domain for client portals?', a: 'Yes on Enterprise plans. Instead of echo-ept.com/p/:slug, your proposals appear at proposals.yourcompany.com/:slug. Custom domains require DNS CNAME configuration pointing to Echo Proposals\' edge network. SSL certificates are provisioned automatically. Custom domains apply to all portals your team creates — per-proposal domains are not supported.' },
    { q: 'Is the client signature legally binding?', a: 'Yes. The acceptance flow records the client\'s typed name, company, drawn signature, IP address, user agent, and timestamp — satisfying the ESIGN Act\'s requirements for intent, attribution, and record retention. The signed PDF and acceptance certificate together constitute a complete electronic contract record. For high-value contracts, the optional SMS OTP second factor (Enterprise) adds an additional layer of identity verification.' },
    { q: 'Can I see who forwarded my proposal internally?', a: 'View tracking captures the IP address of every browser session that opens the portal. If the client forwarded the link to colleagues, you\'ll see multiple unique IP addresses in the view log (indicating different viewers). The system cannot identify who each additional viewer is by name, but the view analytics will show "3 unique viewers" for a proposal opened from multiple locations — a strong signal of internal review activity.' },
    { q: 'How does the AI know my company\'s pricing history?', a: 'The AI pricing suggestions are based on your own historical proposal data within Echo Proposals — specifically, which price points have historically been accepted vs declined for similar project types, service categories, and client industries. It does not use external market data or competitor pricing. New accounts with no history start with general suggestions and the model improves as you accumulate accepted and declined proposals.' },
  ],
}

export default function EchoProposalsDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/proposals' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
