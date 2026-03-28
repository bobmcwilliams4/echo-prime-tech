'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Reviews',
  tagline: 'AI-powered review management — collect, analyze, respond, and amplify your reputation.',
  accent: '#14b8a6',
  productUrl: '/reviews',
  workerUrl: 'https://echo-reviews.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Reviews is a comprehensive AI-powered reputation management platform that centralizes review collection, sentiment analysis, and response management across your entire customer base. Instead of manually monitoring Google, Yelp, and industry-specific directories, Echo Reviews aggregates all feedback into one intelligent dashboard — then helps you act on it faster and smarter than any competitor.',
    'The AI sentiment engine (powered by GEN-01) processes every incoming review in milliseconds, extracting themes, scoring emotional tone, identifying recurring complaints, and surfacing trends that would take a human analyst hours to find. When a review requires a response, the AI drafts personalized replies that match your brand voice and address specific points raised — turning response management from a chore into a competitive advantage.',
    'Beyond reactive management, Echo Reviews helps you proactively build your reputation through automated review request campaigns. Branded request pages with smart reminder sequences dramatically increase review volume from happy customers who simply forgot to leave one. Embeddable widgets let you display your best reviews anywhere on your website — carousels, grids, lists, and trust badges that convert visitors into customers.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Your Review Sources', desc: 'Link your Google Business Profile, Yelp, Facebook Page, and any industry-specific review platforms. Echo Reviews pulls existing reviews into your dashboard and monitors for new ones in real time.' },
    { step: 2, title: 'Configure Your Brand Voice', desc: 'Set your response tone (professional, friendly, apologetic, confident), response length preference, and any phrases or policies to include in every response. The AI uses these settings to draft replies that sound like you.' },
    { step: 3, title: 'Launch Your First Campaign', desc: 'Create a review request campaign targeting recent customers. Set the trigger (post-purchase, post-service, post-appointment), request timing, and follow-up reminder schedule. The branded request page is auto-generated from your business profile.' },
    { step: 4, title: 'Embed Widgets on Your Website', desc: 'Copy the widget embed code from the Widgets tab and paste it into your website. Choose carousel, grid, list, or badge format. Widgets auto-populate with your highest-rated reviews and update in real time as new reviews arrive.' },
    { step: 5, title: 'Monitor Competitors', desc: 'Add competitor business profiles to track their review volume, average rating trends, and recurring customer complaints. Use competitor intelligence to identify gaps in their reputation you can exploit in your marketing.' },
  ],

  features: [
    { title: 'AI Sentiment Analysis', desc: 'Every review processed through GEN-01 sentiment engine. Scores emotional tone (positive/neutral/negative), extracts key themes (service, price, quality, cleanliness), identifies specific staff mentions, and flags urgent issues requiring immediate response.' },
    { title: 'Branded Review Request Pages', desc: 'Custom-branded landing pages with your logo, colors, and messaging that guide customers to leave a review on your preferred platform. Mobile-optimized and load in under 1 second. Unique link per customer enables tracking and prevents duplicate requests.' },
    { title: 'Embeddable Widgets', desc: 'Four widget formats — carousel (scrolling horizontal display), grid (masonry layout), list (vertical feed), and badge (compact star rating summary). All widgets are responsive, load asynchronously to avoid slowing your site, and update automatically.' },
    { title: 'Competitor Tracking', desc: 'Monitor up to 10 competitor business profiles. Track their aggregate rating over time, review velocity, and most-mentioned positive and negative themes. Receive alerts when competitors receive a surge of negative reviews — a signal to capture their dissatisfied customers.' },
    { title: 'Review Campaigns with Reminders', desc: 'Multi-touch review request sequences via email and SMS. Configure initial request timing (1 day, 3 days, 1 week post-transaction) and up to 2 reminder touches for non-responders. Reminders stop automatically when the customer leaves a review.' },
    { title: 'Response Management', desc: 'Respond to reviews directly from the Echo Reviews dashboard without logging into each platform separately. AI drafts personalized responses for every review — approve with one click or edit before sending. Response templates for common scenarios speed up high-volume periods.' },
    { title: 'Review Filtering & Moderation', desc: 'Flag inappropriate reviews, mark responses as pending approval, and assign reviews to team members for handling. Filter dashboard by rating, platform, date, sentiment, and response status to prioritize your queue.' },
    { title: 'Analytics Dashboard', desc: 'Track aggregate rating trends over time, review volume by platform and month, average response time, sentiment distribution, and theme frequency. Compare your metrics against competitor benchmarks for context.' },
    { title: 'Smart Alerts', desc: 'Receive instant notifications for 1-star reviews, reviews mentioning specific keywords (refund, lawsuit, health department), reviews with high negative sentiment scores, and competitor rating drops.' },
    { title: 'Review Gate', desc: 'Optional pre-screening flow that asks customers to rate their experience before directing them to a public review platform. Customers rating 4-5 stars are directed to Google or Yelp. Customers rating 1-3 stars are directed to a private feedback form, protecting your public rating.' },
    { title: 'Team Collaboration', desc: 'Multi-user access with role-based permissions. Managers see all reviews and analytics. Responders see and reply to reviews. Analysts view analytics without modifying responses. Full audit trail of who responded to what and when.' },
    { title: 'API & Webhooks', desc: 'Full REST API for programmatic review access. Webhooks fire on new review arrival, sentiment score thresholds, and campaign conversions. Integrate with your CRM, Slack, or customer success platform.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/reviews', desc: 'Manually submit a review record (for reviews from platforms not directly integrated). Includes source, rating, text, reviewer name, and date.', auth: true },
    { method: 'GET', path: '/reviews', desc: 'List all reviews with filtering by platform, rating, sentiment, date range, response status, and theme tags. Supports pagination and sorting.', auth: true },
    { method: 'POST', path: '/review-requests', desc: 'Send a review request to a customer. Provide customer email, name, platform preference, and optional custom message. Triggers the configured campaign sequence.', auth: true },
    { method: 'GET', path: '/r/:token', desc: 'Public endpoint — loads the branded review request landing page for a customer token. Tracks click and redirects to the selected review platform. No auth required.', auth: false },
    { method: 'POST', path: '/campaigns', desc: 'Create a new review request campaign with trigger conditions, timing rules, reminder schedule, and brand customization settings.', auth: true },
    { method: 'POST', path: '/widgets', desc: 'Generate an embeddable widget with specified format (carousel/grid/list/badge), filter rules (minimum rating, platforms), and styling options. Returns embed code.', auth: true },
    { method: 'GET', path: '/competitors', desc: 'Retrieve competitor tracking data — aggregate ratings, review velocity, sentiment trends, and top themes for all configured competitor profiles.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Aggregate analytics for a date range — total reviews, average rating, sentiment distribution, response rate, response time, campaign conversion rate, and platform breakdown.', auth: true },
  ],

  userGuide: [
    {
      title: 'Setting Up Review Collection',
      id: 'review-collection',
      content: [
        'Connect your existing review platform accounts from Settings > Integrations. Echo Reviews supports direct API connections with Google Business Profile, Yelp, Facebook, TripAdvisor, and G2. For platforms without direct API access, configure the webhook receiver or use the manual import feature to upload review exports.',
        'Once connected, Echo Reviews imports your full review history (up to 24 months) and processes every review through the AI sentiment engine. Initial processing takes 2-5 minutes depending on volume. You\'ll receive a notification when the initial analysis is complete and your dashboard is ready.',
        'New reviews sync in real time for connected platforms. For platforms on polling-based sync, reviews arrive within 15 minutes of posting. Configure your alert preferences in Settings > Notifications to receive instant alerts for new reviews meeting your specified criteria.',
      ],
    },
    {
      title: 'Running Review Campaigns',
      id: 'review-campaigns',
      content: [
        'Review campaigns automate the most important reputation-building activity: asking happy customers to share their experience. Navigate to Campaigns > New Campaign and configure your trigger — post-purchase for e-commerce, post-appointment for service businesses, or manual list upload for a one-time push to existing customers.',
        'The campaign builder lets you customize the timing of each touch point. Best practice is an initial request within 24 hours of the experience while it\'s fresh, a first reminder 3 days later if no review was left, and a final reminder 7 days after the first request. The campaign stops automatically when the customer clicks the review request link, preventing over-messaging.',
        'Branded request pages are generated automatically from your business profile. Customize the header message, photo, and platform selection to match your brand. A/B test different message approaches using the campaign split-testing feature — the winning variation is automatically promoted after reaching statistical significance.',
      ],
    },
    {
      title: 'Managing Responses',
      id: 'managing-responses',
      content: [
        'The response queue shows all unresponded reviews sorted by priority — 1-star reviews and high-negative-sentiment reviews appear first. Click any review to see the full text, AI sentiment analysis, extracted themes, and the AI-drafted response waiting for your review.',
        'AI responses are drafted based on your configured brand voice, the specific points raised in the review, and the sentiment level. Positive reviews receive grateful, personalized acknowledgments. Negative reviews receive empathetic responses that address the specific complaint and offer resolution paths. Review and approve or edit before sending.',
        'For high-volume response periods, use bulk response approval — review the AI\'s drafts in a queue and approve with one click, or flag specific reviews for manual editing. Response templates handle the most common scenarios for instant deployment without any AI generation.',
      ],
    },
    {
      title: 'Competitor Intelligence',
      id: 'competitor-intelligence',
      content: [
        'Add competitor businesses from the Competitors tab. Search by business name and location — Echo Reviews finds the corresponding Google, Yelp, and other platform profiles automatically. Configure up to 10 competitors on Pro and Enterprise plans.',
        'The competitor dashboard shows each competitor\'s rating trend over time, monthly review volume, and top-mentioned themes in their reviews. Positive themes reveal what customers love about them — areas where you need to match or exceed their performance. Negative themes are opportunities to directly address those pain points in your marketing.',
        'Competitor alerts notify you when a competitor receives a surge of negative reviews. This is a signal that their dissatisfied customers are actively looking for alternatives. Use this intelligence to launch targeted acquisition campaigns at exactly the right moment.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Sentiment Analysis', desc: 'GEN-01 engine scores every review on a granular sentiment scale, extracts specific themes and topics mentioned, identifies staff by name, detects urgency signals (health concern, safety issue, legal threat), and classifies the overall review tone for prioritized response queuing.' },
    { capability: 'Response Suggestions', desc: 'AI generates a complete draft response for every review using your configured brand voice, the review\'s specific content, and sentiment level. Responses are contextually tailored — a complaint about wait times gets a different response than a complaint about food quality, even if both are 2-star reviews.' },
    { capability: 'Theme Extraction', desc: 'Natural language processing identifies recurring themes across hundreds of reviews automatically — "staff is friendly" appears in 34% of 5-star reviews, "parking is difficult" appears in 18% of 3-star reviews. Theme tracking over time reveals whether your operational changes are registering with customers.' },
    { capability: 'Campaign Optimization', desc: 'Analyzes campaign open rates, click rates, and review conversion rates to suggest optimal send times, message variations, and reminder timing. Learns from your specific customer base\'s behavior patterns over time.' },
    { capability: 'Review Gate Intelligence', desc: 'Analyzes pre-screening response patterns to identify which customer segments are most likely to leave negative public reviews, enabling proactive outreach before dissatisfaction escalates to a public post.' },
  ],

  troubleshooting: [
    { issue: 'Google reviews not syncing', solution: 'Verify your Google Business Profile connection is authorized with an account that has Manager or Owner access. Google API connections require re-authorization every 60 days — check Settings > Integrations for an expired token warning. If recently verified, allow up to 24 hours for initial historical import to complete.' },
    { issue: 'Campaign emails going to spam', solution: 'Verify your sending domain has SPF and DKIM records configured in Settings > Email. Avoid spam-trigger words in campaign subject lines. Ensure your campaign list only includes customers who have an existing relationship with your business. Review campaign send rates — high-volume sends without warm-up can trigger spam filters.' },
    { issue: 'Widget not displaying on website', solution: 'Confirm the embed script is placed before the closing </body> tag. Check browser console for CORS errors — ensure your website domain is added to the allowed origins in widget settings. Widgets require at least one published review meeting the filter criteria (minimum rating) to display.' },
    { issue: 'AI responses not generating', solution: 'AI response generation requires the review text to be at least 10 characters. Check that your GEN-01 integration is active in Settings > AI. For high-volume accounts during peak periods, generation may take up to 30 seconds. Verify your subscription includes AI response generation — this feature requires Pro or Enterprise plan.' },
  ],

  faq: [
    { q: 'Which review platforms does Echo Reviews support?', a: 'Direct API integration with Google Business Profile, Yelp, Facebook, TripAdvisor, G2, Capterra, and Trustpilot. Webhook-based integration supports any platform that can send an HTTP notification. Manual CSV import handles platforms without API access. New platform integrations are added based on user demand.' },
    { q: 'Can Echo Reviews respond to reviews on my behalf automatically?', a: 'Yes, with your approval. The AI drafts responses and places them in an approval queue. You can configure auto-approve for 4-5 star reviews with positive sentiment scores, while requiring manual approval for all negative reviews. Fully automatic responses without human review are available for Enterprise accounts with confirmed brand voice training.' },
    { q: 'How does the review gate work, and is it allowed by Google?', a: 'The review gate asks customers to rate their experience before directing them to a public platform. Google\'s terms prohibit "review gating" that conditions a request on the response — Echo Reviews\' implementation directs all customers to leave a review regardless of their pre-screen rating, staying within platform policies. The pre-screen simply routes highly satisfied customers to Google first.' },
    { q: 'How many team members can access Echo Reviews?', a: 'Free plans include 1 user. Pro plans include up to 5 team members with role-based permissions (Admin, Manager, Responder, Analyst). Enterprise plans have unlimited users with custom role configurations and SSO support.' },
    { q: 'Can I use Echo Reviews for multiple business locations?', a: 'Yes. Multi-location support is included in Pro and Enterprise plans. Each location has independent review streams, campaigns, and analytics while sharing brand voice settings and response templates. The aggregate dashboard shows combined performance across all locations.' },
  ],
}

export default function EchoReviewsDocsPage() {
  return <ProductDoc {...data} />
}
