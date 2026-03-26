'use client'

import ProductDoc from '@/components/ProductDoc'
import type { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Bot Fleet',
  tagline: 'Autonomous AI bots across 8 platforms — Discord, X/Twitter, LinkedIn, Reddit, Telegram, Slack, WhatsApp, Instagram.',
  accent: '#3b82f6',
  productUrl: '/bots',
  workerUrl: 'https://echo-bot-factory.bmcii1976.workers.dev',
  version: '2.0.0',

  overview: [
    'Echo Bot Fleet is a unified platform for deploying and managing autonomous AI bots across 8 major social and messaging platforms: Discord, X/Twitter, LinkedIn, Reddit, Telegram, Slack, WhatsApp, and Instagram. Each bot runs on Cloudflare Workers with D1 storage, KV caching, and cron-triggered scheduling, delivering zero-downtime autonomous operation with global edge performance and no idle cost.',
    'Every bot in the fleet is powered by AI content generation that understands platform conventions — hashtags and brevity on X, professional tone on LinkedIn, threaded discussions on Reddit, visual-first content on Instagram. The content engine generates original posts, replies, and engagement actions tailored to each platform\'s culture and algorithm preferences, while cross-platform coordination ensures consistent brand messaging without duplicate content.',
    'The fleet management dashboard provides real-time analytics across all platforms including engagement metrics, audience growth tracking, posting performance, sentiment analysis, and A/B testing results. Smart scheduling uses machine learning to identify optimal posting windows for each platform and audience segment, while the bot auditor continuously monitors health scores, shadowban indicators, and rate limit headroom to keep every bot operating at peak effectiveness.',
  ],

  gettingStarted: [
    { step: 1, title: 'Choose Your Platforms', desc: 'Select which platforms you want to deploy bots on from the 8 supported options. Each platform requires API credentials — the onboarding wizard walks you through obtaining developer access and API keys for each selected platform.' },
    { step: 2, title: 'Connect Your Accounts', desc: 'Store your platform API tokens securely in the Echo Vault. The platform validates each connection by performing a read-only API call to confirm token validity, permission scopes, and account status before proceeding.' },
    { step: 3, title: 'Configure Content Strategy', desc: 'Define your content categories (educational, promotional, engagement, curated, behind-the-scenes) and set distribution weights for each. Select or customize an AI personality that matches your brand voice across all platforms.' },
    { step: 4, title: 'Set Posting Schedule', desc: 'Configure posting frequency and timing for each platform. Use preset schedules (peak hours, business hours, always-on) or define custom cron expressions with timezone-aware triggers. Enable smart scheduling to let the AI optimize timing automatically.' },
    { step: 5, title: 'Monitor Performance', desc: 'Launch your bots and monitor real-time performance from the fleet dashboard. Track engagement metrics, audience growth, content performance, and bot health scores. Adjust strategy based on analytics and A/B test results.' },
  ],

  features: [
    { title: '8-Platform Support', desc: 'Deploy bots on Discord, X/Twitter, LinkedIn, Reddit, Telegram, Slack, WhatsApp, and Instagram from a single control panel. Each platform integration handles native APIs, webhooks, rate limits, and content formatting requirements automatically.' },
    { title: 'AI Content Generation', desc: 'LLM-powered content engine generates original posts, replies, threads, and stories tailored to each platform\'s conventions. Understands hashtag culture on X, professional formatting on LinkedIn, threaded discussion style on Reddit, and visual-first approach on Instagram.' },
    { title: 'Smart Scheduling', desc: 'ML-driven analysis of your specific audience activity patterns determines optimal posting windows per platform. Cron-triggered schedules with timezone awareness ensure posts hit when your audience is most active and engaged.' },
    { title: 'Engagement Automation', desc: 'Automated likes, replies, follows, and retweets based on configurable rules and AI-driven relevance scoring. Engagement actions respect platform rate limits and are spaced naturally to avoid detection patterns.' },
    { title: 'Cross-Platform Coordination', desc: 'A single content theme is automatically adapted for each platform — shortened for X, formatted with headers for LinkedIn, threaded for Reddit, visual for Instagram. Deduplication ensures adapted content, never copy-pasted duplicates.' },
    { title: 'Analytics Dashboard', desc: 'Unified analytics across all platforms: impressions, engagement rate, click-through rate, follower growth, sentiment breakdown, and revenue attribution. Compare performance across platforms, content categories, and posting times.' },
    { title: 'A/B Testing', desc: 'Test different content styles, posting times, hashtag strategies, and personality tones across controlled segments. Statistical significance calculations ensure you make data-driven decisions, not gut-feel changes.' },
    { title: 'Hashtag Optimization', desc: 'AI-powered hashtag selection that mixes high-volume and niche tags, rotates to avoid repetition, and tracks which hashtag combinations drive the highest engagement and discovery rates per platform.' },
    { title: 'Audience Growth', desc: 'Follower and subscriber tracking with growth velocity analysis, audience demographics (where available), follow/unfollow attribution by content type, and growth projection modeling based on current trajectory.' },
    { title: 'Sentiment Monitoring', desc: 'NLP-powered sentiment analysis on replies, comments, and mentions across all platforms. Track brand sentiment trends, identify negative sentiment spikes early, and measure how content strategy changes affect public perception.' },
    { title: 'Brand Voice Consistency', desc: '14 pre-built AI personalities with tunable parameters: formality, emoji density, response length, humor level, and engagement aggression. Ensures every post across every platform sounds authentically on-brand.' },
    { title: 'Competitor Tracking', desc: 'Monitor competitor posting frequency, engagement rates, and content themes using public data. Identify content gaps, trending topics in your niche, and engagement benchmarks to inform your own content strategy.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/bots', desc: 'List all bots in the fleet with platform, status, health score, last activity timestamp, and posting statistics summary.', auth: true },
    { method: 'POST', path: '/api/bots/:id/post', desc: 'Trigger an immediate post on a specific bot. Accepts content text, media URLs, hashtag overrides, and platform-specific formatting options.', auth: true },
    { method: 'GET', path: '/api/analytics/fleet', desc: 'Fleet-wide analytics summary: total posts, total engagement, platform breakdown, top-performing content, and alert count across all active bots.', auth: true },
    { method: 'GET', path: '/api/analytics/:botId', desc: 'Per-bot analytics: engagement metrics, audience growth, post performance history, sentiment breakdown, and A/B test results for a specific bot.', auth: true },
    { method: 'PUT', path: '/api/schedules/:botId', desc: 'Update posting schedule for a bot. Accepts cron expression, timezone, content category weights, and smart scheduling toggle.', auth: true },
    { method: 'GET', path: '/api/platforms', desc: 'List all connected platforms with credential status, API quota usage, rate limit headroom, and platform-specific feature availability.', auth: true },
    { method: 'POST', path: '/api/engagement/:botId', desc: 'Configure engagement automation rules: reply triggers, like criteria, follow-back rules, and interaction frequency limits per platform.', auth: true },
    { method: 'GET', path: '/health', desc: 'Health check endpoint. Returns service status, active bot count, platform connectivity, and scheduler status.', auth: false },
  ],

  userGuide: [
    {
      title: 'Setting Up Bots',
      id: 'setting-up-bots',
      content: [
        'Each bot requires a connected platform account with valid API credentials. Navigate to Fleet > Add Bot, select the target platform, and follow the platform-specific setup guide. Discord bots require a Bot Application token with Message Content intent. X bots need OAuth 2.0 with API v2 access. LinkedIn requires Community Management API approval.',
        'After connecting credentials, configure the bot\'s AI personality by selecting a preset (Professional Advisor, Casual Friend, Technical Expert, etc.) or building a custom personality with tunable parameters. The personality controls tone, vocabulary, emoji usage, response length, and engagement style across all generated content.',
        'Test your bot configuration by posting a single test message before enabling the automated schedule. Review the generated content to ensure the personality, hashtags, and formatting match your expectations. Adjust parameters as needed before going live.',
      ],
    },
    {
      title: 'Content Strategy',
      id: 'content-strategy',
      content: [
        'Define content categories that map to your business goals: educational content builds authority, promotional content drives conversions, engagement content grows your audience, and curated content fills gaps without requiring original generation. Set distribution weights (e.g., 40% educational, 20% promotional, 40% engagement) to maintain a balanced feed.',
        'The AI content engine generates original posts for each scheduled slot based on your category weights, trending topics in your niche, and historical performance data. Each post is adapted for the target platform — character limits, formatting conventions, hashtag counts, and media requirements are handled automatically.',
        'Build a content library of evergreen themes, product highlights, and brand narratives that the AI can reference and remix. The more context you provide about your brand, products, and audience, the more relevant and on-brand the generated content becomes over time.',
      ],
    },
    {
      title: 'Scheduling',
      id: 'scheduling',
      content: [
        'Posting schedules use cron syntax with timezone awareness. Common presets include peak-hours (9am, 12pm, 5pm local), business-hours (every 2 hours from 8am-6pm), and always-on (every 4 hours around the clock). Each platform can have an independent schedule optimized for its specific audience activity patterns.',
        'Enable smart scheduling to let the ML model analyze your audience engagement patterns and automatically adjust posting times. The model learns which days and hours produce the highest engagement for your specific followers and adjusts the cron triggers accordingly on a rolling 30-day window.',
        'Posting queues buffer content when multiple platforms are scheduled simultaneously. The queue respects per-platform rate limits and spaces posts naturally to avoid burst patterns that could trigger platform throttling or shadowban detection.',
      ],
    },
    {
      title: 'Analytics',
      id: 'analytics',
      content: [
        'The fleet dashboard aggregates metrics across all platforms into a unified view. Key metrics include total impressions, engagement rate (likes + comments + shares / impressions), click-through rate for posts with links, follower growth velocity, and sentiment score based on reply and comment analysis.',
        'Drill down into per-bot and per-post analytics to identify what content types, posting times, and hashtag strategies produce the best results. The A/B testing module lets you run controlled experiments — test two personality styles, two posting times, or two content categories against each other with statistical significance tracking.',
        'Export analytics data as CSV or JSON for integration with external business intelligence tools. Automated weekly and monthly report emails summarize fleet performance with trend analysis and actionable recommendations for strategy adjustments.',
      ],
    },
    {
      title: 'Cross-Platform Coordination',
      id: 'cross-platform-coordination',
      content: [
        'Cross-platform coordination ensures your brand message is consistent across all 8 platforms without posting identical content. When a content theme is generated, the engine creates platform-specific adaptations: a concise tweet with hashtags for X, a detailed article-format post for LinkedIn, a conversational thread opener for Reddit, and a visual story with caption for Instagram.',
        'The deduplication engine hashes all content and checks against a 90-day rolling window. Exact duplicates across platforms are blocked. Near-duplicates (above 85% similarity) are flagged for review. This ensures every platform gets unique, adapted content that respects the audience expectations of each channel.',
        'Campaign mode allows you to coordinate a product launch, announcement, or event across all platforms simultaneously with platform-optimized content variants, staggered timing, and unified hashtag tracking. Post-campaign analytics show aggregate reach, engagement, and conversion across the full multi-platform push.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Content Generation', desc: 'LLM-powered engine generates original posts, replies, threads, and stories for each platform. Understands platform-specific conventions, character limits, formatting norms, and hashtag culture to produce native-feeling content at scale.' },
    { capability: 'Optimal Timing', desc: 'Machine learning model analyzes follower activity patterns, historical engagement data, and platform-wide trends to predict the optimal posting time for each piece of content on each platform, maximizing reach and engagement.' },
    { capability: 'Engagement Prediction', desc: 'Pre-publish scoring model estimates expected engagement (likes, replies, shares) for generated content before it posts. Low-scoring content is regenerated or held for review, ensuring only high-potential content reaches your audience.' },
    { capability: 'Audience Analysis', desc: 'Continuous analysis of follower demographics, interest signals, engagement patterns, and growth sources. Identifies your most engaged segments and adapts content strategy to attract more of your ideal audience profile.' },
    { capability: 'Trend Detection', desc: 'Real-time monitoring of trending topics, hashtags, and conversations across all connected platforms. The content engine can automatically incorporate relevant trends into generated posts to increase discovery and timeliness.' },
    { capability: 'Brand Voice Learning', desc: 'The AI personality system learns from your feedback and historical content performance to refine its understanding of your brand voice over time. The more you use it, the more accurately it captures your unique tone and messaging style.' },
  ],

  troubleshooting: [
    { issue: 'Bot hitting API rate limits on X/Twitter', solution: 'X/Twitter has strict rate limits on the free and basic API tiers. Reduce posting frequency to no more than 3-5 posts per day. Space engagement actions (likes, replies) by at least 60 seconds. Upgrade to the Pro API tier for higher quotas. Check Settings > Rate Limits for real-time quota usage.' },
    { issue: 'Content flagged or removed by platform moderation', solution: 'Review the flagged content in the Audit log to understand which platform policy was triggered. Adjust your AI personality settings to increase the content safety filter level. Enable the pre-publish moderation queue to review all generated content before it posts. Avoid topics that commonly trigger automated moderation.' },
    { issue: 'Bot account suspended by platform', solution: 'Platform suspensions typically result from excessive automation, rate limit violations, or content policy breaches. Pause all bot activity on the affected platform immediately. Review the suspension notice and audit log to identify the trigger. Appeal through the platform\'s official process. Reduce automation aggressiveness before re-enabling.' },
    { issue: 'Posts not publishing at scheduled times', solution: 'Verify that the bot\'s API credentials are still valid — tokens expire and need refreshing. Check the schedule configuration for correct timezone settings. Review the posting queue for errors (Settings > Queue). Ensure the Cloudflare Worker cron trigger is active and the bot status is set to "Running" in the fleet dashboard.' },
  ],

  faq: [
    { q: 'How many platforms can a single bot manage?', a: 'Each bot instance is dedicated to one platform for optimal performance and rate limit management. However, the fleet dashboard lets you manage all platform bots from a single interface with cross-platform coordination, unified analytics, and shared content strategy across all 8 supported platforms.' },
    { q: 'What AI personalities are available?', a: 'Echo Bot Fleet ships with 14 pre-built personalities: Professional Advisor, Casual Friend, Technical Expert, Sales Closer, Community Manager, News Anchor, Motivational Coach, Sarcastic Wit, Data Analyst, Customer Support, Brand Ambassador, Thought Leader, Entertainer, and Educator. Each is fully customizable with tunable parameters.' },
    { q: 'Will the bots get my accounts banned?', a: 'The fleet includes multiple safety layers: intelligent rate limiting that stays well within platform quotas, content safety filters, deduplication to avoid spam patterns, and the Bot Auditor which checks for shadowban indicators every 6 hours. Following the recommended posting frequencies and keeping content quality high minimizes platform risk.' },
    { q: 'Can I review content before it posts?', a: 'Yes. Each bot supports auto-post mode for hands-off operation or approval-required mode where all generated content enters a review queue. In approval mode, you can approve, reject, or edit each post with one click. LinkedIn bots default to approval mode given the professional context.' },
    { q: 'How does cross-platform deduplication work?', a: 'The dedup engine hashes content before posting and checks against a 90-day rolling window across all platforms. Exact duplicates are blocked automatically. Near-duplicates (above 85% cosine similarity) are flagged for review. Cross-platform posts are adapted to each platform\'s format and conventions rather than copy-pasted.' },
  ],
}

export default function BotsDocsPage() {
  return <ProductDoc {...data} />
}
