'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Waitlist',
  tagline: 'Viral referral waitlists with position tracking, milestone rewards, and embeddable signup widgets',
  accent: '#ec4899',
  productUrl: '/waitlist',
  workerUrl: 'https://echo-waitlist.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Waitlist turns your product launch into a viral growth engine. Every person who signs up receives a unique referral link. When they share it and others sign up through their link, they move up the waitlist automatically — creating organic incentive to spread the word before your product even ships. The effective position formula (base_position - referral_boost × multiplier) is calculated in real time on every page load, so users always see their current rank.',
    'Campaigns are the core unit: each campaign has a unique slug, customizable messaging, optional goal (e.g., "Join 10,000 early adopters"), and configurable milestone rewards. Milestones trigger automatically when a participant reaches a referral count threshold — unlocking exclusive access, discount codes, or custom rewards defined by the operator. The system handles the entire reward lifecycle: detection, notification, and fulfillment tracking.',
    'The embeddable widget (widget.js?id=CAMPAIGN_ID) deploys with a single script tag and requires no iframe or backend integration from your side. It renders a signup form, position display, referral link with one-click copy, and milestone progress bar — all styled to match your brand. Six D1 tables, 40+ endpoints, and a real-time viral coefficient analytics panel give operators full visibility into how the campaign is performing.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create a Campaign', desc: 'Sign up at echo-ept.com/waitlist and click "New Campaign". Set a name, slug, start date, and optional goal count. The campaign slug becomes part of the public signup URL: echo-waitlist.bmcii1976.workers.dev/join/YOUR_SLUG.' },
    { step: 2, title: 'Configure Milestone Rewards', desc: 'In the Milestones tab, define rewards for referral count thresholds. Example: 5 referrals = beta access, 20 referrals = lifetime discount code, 50 referrals = founding member status. Each milestone has a name, description, reward payload (code or webhook), and an optional badge image.' },
    { step: 3, title: 'Embed the Signup Widget', desc: 'Copy the embed snippet from the Embed tab: <script src="https://echo-waitlist.bmcii1976.workers.dev/widget.js?id=YOUR_CAMPAIGN_ID"></script> <div id="echo-waitlist"></div>. Drop it anywhere on your landing page. The widget self-configures and renders in under 200ms.' },
    { step: 4, title: 'Drive Initial Signups', desc: 'Share the direct signup URL (echo-waitlist.bmcii1976.workers.dev/join/YOUR_SLUG) in your launch email, social posts, and press outreach. The first wave of signups creates the referral network that drives organic growth.' },
    { step: 5, title: 'Invite Top Referrers', desc: 'Use the Bulk Invite feature to send access emails to the top N participants by effective position. Configure the invite email template, then trigger invites for batches of 10, 50, or 500 users. Each invite is tracked and opens are logged.' },
  ],
  features: [
    { title: 'Viral Referral System', desc: 'Every signup receives a unique 8-character referral code. The code is embedded in a shareable URL and tracked through the full referral chain. Multi-level referrals are supported: signing up through a referred user\'s link credits the original referrer for network-level growth analytics.' },
    { title: 'Position Tracking with Effective Position', desc: 'Each participant has a base position (their signup order) and an effective position calculated as: base_position - (referral_count × boost_multiplier). The effective position is displayed in the widget and API and updates in real time as new referrals arrive.' },
    { title: 'Milestone Reward System', desc: 'Define unlimited milestones per campaign, each triggered when a participant\'s confirmed referral count reaches a threshold. Rewards are delivered via email (with a code or attachment) or a webhook POST to your backend with the participant\'s data.' },
    { title: 'Embeddable Widget', desc: 'A self-contained JavaScript widget that renders a complete signup flow — email input, position display, referral link, one-click copy button, and milestone progress bar. Loads in under 200ms, requires no build step, and respects the host page\'s dark/light mode via CSS media queries.' },
    { title: 'Confirmation Emails with Referral Links', desc: 'Signup confirmation emails include the participant\'s unique referral link, their current position, the number of spots they can jump by referring friends, and a milestone progress bar showing how close they are to the next reward.' },
    { title: 'Referral Code Auto-Boost', desc: 'The referral boost multiplier is configurable per campaign (default: 1 position per referral). Operators can set aggressive multipliers (e.g., 5 positions per referral) to create steeper viral incentives for competitive launch campaigns.' },
    { title: 'Bulk Invite Top N', desc: 'Select a cohort size (e.g., "top 100 by effective position") and trigger access invites for that cohort. Invites use a customizable email template with the participant\'s name, position, and a unique invite code. Invite batches are rate-limited to avoid email deliverability issues.' },
    { title: 'Viral Coefficient Analytics', desc: 'The analytics panel shows the campaign\'s viral coefficient (average referrals per signup), referral conversion rate (referral clicks → signups), daily new signup and referral rates, and a cohort breakdown of how many signups came from each referral tier.' },
    { title: 'Campaign Goals and Progress', desc: 'Set a target signup count for the campaign. A public progress bar on the widget and campaign page shows how close the campaign is to the goal. Operators can also set a "soft close" trigger — automatically pausing signups when the goal is reached.' },
    { title: 'Custom Reward Webhooks', desc: 'For each milestone, configure a webhook URL to receive a POST with the participant\'s data when the milestone is triggered. Use this to automatically provision accounts, apply credits in your billing system, or send custom emails via your own email provider.' },
    { title: 'Referral Attribution Chain', desc: 'Track the full referral ancestry for every signup. The analytics API returns the complete referral tree for a campaign, showing which users are driving the most downstream signups and where the viral growth is concentrated.' },
    { title: 'Fraud Detection', desc: 'Detects self-referral attempts (signing up with your own referral code), duplicate email addresses, and suspicious signup patterns (multiple signups from the same IP in a short window). Flagged signups are held in a review queue before being credited.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/campaigns', desc: 'Create a new waitlist campaign with slug, title, description, goal count, boost multiplier, and milestone definitions', auth: true },
    { method: 'GET', path: '/campaigns/:slug', desc: 'Retrieve campaign metadata, current signup count, viral coefficient, and goal progress. Public endpoint for active campaigns', auth: false },
    { method: 'POST', path: '/campaigns/:slug/join', desc: 'Sign up for a waitlist campaign. Accepts email, name (optional), and referral_code (optional). Returns participant ID, position, effective position, and unique referral code', auth: false },
    { method: 'GET', path: '/campaigns/:slug/position/:code', desc: 'Look up a participant\'s current position, effective position, referral count, and milestone progress by their referral code. Used by the widget to display live position', auth: false },
    { method: 'GET', path: '/campaigns/:slug/participants', desc: 'List all participants with position, effective position, referral count, and milestone status. Sortable by position or referral count. Admin only', auth: true },
    { method: 'POST', path: '/campaigns/:slug/invite', desc: 'Trigger access invites for the top N participants by effective position. Accepts count and email_template_id. Returns invite batch ID and recipient list', auth: true },
    { method: 'GET', path: '/campaigns/:slug/analytics', desc: 'Campaign analytics: viral coefficient, referral conversion rate, daily signups, referral chain depth distribution, and top 10 referrers', auth: true },
    { method: 'GET', path: '/campaigns/:slug/milestones', desc: 'List all milestone definitions and current achievement counts (how many participants have unlocked each milestone)', auth: true },
    { method: 'POST', path: '/campaigns/:slug/milestones/:id/trigger', desc: 'Manually trigger a milestone reward for a specific participant. Used for manual overrides and testing. Returns delivery status', auth: true },
    { method: 'GET', path: '/widget.js', desc: 'The embeddable widget script. Accepts id query parameter (campaign ID). Returns self-executing JavaScript that renders the full signup widget', auth: false },
  ],
  userGuide: [
    {
      id: 'campaign-setup',
      title: 'Campaign Configuration',
      content: [
        'When creating a campaign, the slug determines the public URL and cannot be changed after the first signup. Choose a slug that matches your product name and is easy to remember. The campaign title and description appear on the widget and signup page and can be updated at any time.',
        'The boost multiplier controls how many positions a participant moves up per confirmed referral. The default is 1 (one position per referral). For high-urgency launches, use a multiplier of 3–5 to create steeper viral incentives. The effective position formula is: effective_position = base_position - (confirmed_referrals × boost_multiplier).',
        'Set a campaign goal to enable the public progress bar. The goal appears on the widget as "X of Y spots claimed." When the goal is reached, the campaign can auto-pause (configurable in campaign settings) to create scarcity or remain open to continue growing the waitlist.',
      ],
    },
    {
      id: 'milestone-configuration',
      title: 'Configuring Milestones',
      content: [
        'Milestones are triggered when a participant\'s confirmed referral count reaches a threshold. Confirmed referrals are those where the referred person has verified their email address — unverified signups do not count toward milestone thresholds. This prevents gaming via fake email signups.',
        'Each milestone can deliver rewards via email or webhook. For email delivery, write a custom email template using merge tags like {{first_name}}, {{referral_count}}, and {{reward_code}}. For webhook delivery, specify a URL that accepts POST requests — the payload includes the participant\'s full profile and which milestone was triggered.',
        'Milestone badges are displayed on the public leaderboard (if enabled) next to the participant\'s display name. Badges are 64×64 PNG images uploaded in the milestone configuration. They give participants a visible status symbol that motivates continued sharing.',
      ],
    },
    {
      id: 'widget-customization',
      title: 'Customizing the Embed Widget',
      content: [
        'The embed widget inherits your campaign\'s title and description. Additional style customization is available through data attributes on the mount div: data-accent-color controls the primary color, data-font sets the font family, and data-dark forces dark mode regardless of the host page.',
        'The widget renders in three states: pre-signup (email input form), post-signup (referral link display with position and milestone progress), and position-lookup (if the visitor has already signed up, detected via localStorage). The widget stores the participant\'s referral code in localStorage under the key echo_waitlist_{campaign_id}.',
        'For custom form integrations, use the API directly instead of the widget. POST to /campaigns/:slug/join with an email address and optional referral_code. The response provides everything needed to build a custom confirmation screen: position, effective_position, referral_code, and milestone_status.',
      ],
    },
    {
      id: 'inviting-participants',
      title: 'Inviting Participants to Access',
      content: [
        'When you are ready to grant access, navigate to Participants → Bulk Invite. Set the cohort size (how many of the top-ranked participants to invite) and select or create an email template. The invite email should contain the participant\'s access link, their final rank, and any onboarding instructions.',
        'Invites are processed in batches of 50 per minute to maintain email deliverability rates. A bulk invite to 500 participants will complete in approximately 10 minutes. Monitor the invite batch status from the Invites tab — it shows sent count, open rate, and click rate in real time.',
        'After sending invites, the invited participants are marked as Invited in the dashboard. You can re-invite participants who did not open their email by filtering for Invited status with zero opens and triggering a follow-up invite batch.',
      ],
    },
    {
      id: 'analytics-interpretation',
      title: 'Reading Viral Analytics',
      content: [
        'The viral coefficient (K-factor) measures the average number of additional signups each participant generates. A K-factor above 1.0 means the campaign is growing exponentially without additional promotion. Below 1.0, the campaign requires sustained external promotion to grow.',
        'The referral funnel shows: total referral link clicks → email entries started → signups completed → emails verified. Drop-off at each stage indicates where to optimize. Low click-to-start rate suggests the referral messaging is not compelling. Low start-to-complete rate suggests the form is too long or the email verification step is losing people.',
        'The daily new signups chart separates organic signups (direct URL visits) from referred signups (via referral codes). When the referred line exceeds the organic line, the campaign has achieved self-sustaining viral growth. Use this as the signal to reduce paid promotion spend.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Viral Coefficient Forecasting', desc: 'Uses the first 72 hours of campaign data to forecast the K-factor trajectory and project total signup count at 7, 14, and 30 days. Updates the forecast daily as new data arrives. Alerts the operator if the trajectory suggests the campaign will stall below the goal.' },
    { capability: 'Fraud Pattern Detection', desc: 'Identifies suspicious signup clusters — multiple accounts created in rapid succession from the same IP range, email addresses with auto-generated patterns, or referral chains where one account refers dozens of others in under an hour. Flags these for review before crediting referral counts.' },
    { capability: 'Milestone Optimization Recommendations', desc: 'Analyzes the drop-off rate at each referral count threshold and suggests milestone placements that maximize conversion. If few participants reach the 10-referral milestone, recommends moving a milestone to 5 referrals to provide an earlier win and re-engage passive participants.' },
    { capability: 'Email Timing Optimization', desc: 'Analyzes open and click rates by hour-of-day and day-of-week for referral confirmation emails and invite emails. Recommends the optimal send time window for each participant\'s timezone based on engagement patterns.' },
    { capability: 'Top Referrer Identification', desc: 'Identifies the participants driving the most downstream signups — not just direct referrals but the full downstream tree. Surfaces these "super-referrers" for VIP treatment, early access, or additional reward escalation.' },
    { capability: 'Signup Page Copy Suggestions', desc: 'Analyzes the conversion rate of the signup page and widget against benchmarks for similar campaign types. Suggests headline, subheading, and CTA copy changes backed by historical performance data across the Echo Waitlist platform.' },
  ],
  troubleshooting: [
    { issue: 'Referral counts are not incrementing after sharing the link', solution: 'Referral counts only increment for confirmed signups — the referred person must complete email verification before the referral is credited. Check the participant\'s referral panel to see pending (unverified) vs. confirmed referrals. Ask testers to check their spam folder for the verification email.' },
    { issue: 'Widget is not rendering on the host page', solution: 'Verify the script tag and mount div are both present. The div must have id="echo-waitlist" or match the custom mount ID if configured. Check the browser console for CSP (Content Security Policy) errors — the host site may be blocking script execution from external domains. Add echo-waitlist.bmcii1976.workers.dev to the script-src allowlist.' },
    { issue: 'Milestone reward emails are not being delivered', solution: 'Check the Milestone Delivery Log in the campaign dashboard. Failed deliveries show the error reason. Common causes: invalid email address (flagged by Resend/email provider), soft bounce, or the participant\'s email provider is blocking transactional email. For webhook-based rewards, check that your endpoint returns a 200 status within 10 seconds.' },
    { issue: 'Participants are seeing incorrect positions', solution: 'Effective positions are recalculated on every API request, so they reflect the current state. If a participant is seeing a stale position, clear their localStorage (the widget caches position for 5 minutes) or reload the page. If the position seems mathematically wrong, check the boost multiplier setting in campaign configuration.' },
    { issue: 'Bulk invite is paused or not completing', solution: 'Bulk invites are throttled to 50 emails per minute to maintain deliverability. A large batch will take several minutes to complete. If the batch is stuck in Paused status, it was likely rate-limited by the email provider. Wait 10 minutes and resume from the Invites tab — the system will continue from where it left off.' },
  ],
  faq: [
    { q: 'Can one person sign up multiple times with different email addresses?', a: 'The system checks for duplicate emails at signup time. The same email address cannot be registered twice in the same campaign. However, the system does not prevent someone from using multiple email addresses. Fraud detection flags suspicious IP patterns that suggest single-person multi-account creation, and flagged signups are held for manual review.' },
    { q: 'What is the difference between base position and effective position?', a: 'Base position is the order in which someone signed up — first to sign up is position 1. Effective position is calculated as base_position minus (confirmed_referral_count times boost_multiplier). It is possible to have a base position of 500 but an effective position of 1 if you have referred many people.' },
    { q: 'Do referred signups also get their own referral code?', a: 'Yes. Every signup, whether referred or organic, receives their own unique referral code. Referred participants can share their code to move up the list just like everyone else. This creates multi-level referral chains where downstream participants can become top performers.' },
    { q: 'Can I customize the confirmation and reward emails?', a: 'Yes. The email templates support full HTML/CSS with merge tags for personalization. Templates are configured per campaign in the Emails tab. You can customize the confirmation email, referral milestone emails, and invite emails independently. Default templates are provided as starting points.' },
    { q: 'Is the widget compatible with React and Next.js sites?', a: 'Yes. The widget is a plain JavaScript snippet that mounts onto a DOM element by ID. It is compatible with any framework. For React/Next.js, add the script tag to the page-level component or use a useEffect to load it dynamically. The widget uses a defensive mount pattern that skips initialization if the mount element is not found.' },
    { q: 'How does the effective position handle ties?', a: 'When two participants have the same effective position, they are ordered by base position (earlier signup wins the tiebreaker). This means early signups have a durable advantage — even if a later signup matches their referral count, the original participant retains the higher rank.' },
  ],
}

export default function WaitlistDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/waitlist' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
