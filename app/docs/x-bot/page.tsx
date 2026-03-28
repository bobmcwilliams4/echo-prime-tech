'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo X Bot',
  tagline: 'Autonomous X/Twitter presence — AI-generated posts, engagement tracking, follower growth, and brand monitoring.',
  accent: '#1d9bf0',
  productUrl: '/x-bot',
  workerUrl: 'https://echo-x-bot.bmcii1976.workers.dev',
  version: '2.11.0',

  overview: [
    'Echo X Bot is a fully autonomous Twitter/X presence manager that creates, schedules, and publishes AI-generated content aligned with your brand voice. It monitors engagement metrics, tracks follower growth, and identifies trending topics in your niche to keep your account active and relevant 24/7.',
    'The bot uses Engine Runtime for domain-expert content generation — not generic AI text. Posts are crafted with real industry knowledge from 5,500+ specialized engines covering tax, legal, oilfield, technology, cybersecurity, and more. Each post includes relevant hashtags, optimal timing, and engagement hooks.',
    'With built-in OPSEC protections, rate limiting, and platform compliance, Echo X Bot maintains your account safely. Weighted category selection ensures content diversity, while recap posts twice weekly summarize your best-performing content.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Your X Account', desc: 'Provide your X API credentials (API Key, API Secret, Access Token, Access Secret) with read and write permissions. OAuth 1.0a authentication is used for all API calls.' },
    { step: 2, title: 'Configure Content Categories', desc: 'Set up weighted content categories that match your brand. Default categories include industry insights, tips, thought leadership, and engagement posts. Adjust weights to control content mix.' },
    { step: 3, title: 'Set Posting Schedule', desc: 'Configure your posting frequency (default: 3 posts/day) and preferred time windows. The bot automatically spaces posts for optimal engagement based on your audience timezone.' },
    { step: 4, title: 'Review First Posts', desc: 'The bot generates a batch of preview posts for your review. Approve, edit, or regenerate until the tone matches your expectations. Once satisfied, enable autonomous mode.' },
    { step: 5, title: 'Monitor Performance', desc: 'Track impressions, engagement rate, follower growth, and top-performing posts from the dashboard. The bot automatically adjusts its strategy based on what resonates with your audience.' },
  ],

  features: [
    { title: 'AI Content Generation', desc: 'Engine Runtime-powered posts with real domain expertise. Not generic AI text — actual industry knowledge from 632K+ doctrines across 5,500+ engines.' },
    { title: 'Weighted Categories', desc: 'Configure content categories with relative weights. Industry insights might get 40%, tips 25%, engagement 20%, promotional 15%. Ensures content diversity.' },
    { title: 'Optimal Timing', desc: 'Posts scheduled at peak engagement windows based on your audience analytics. Automatic spacing prevents flooding.' },
    { title: 'Hashtag Strategy', desc: 'AI-selected hashtags based on trending topics, niche relevance, and reach optimization. Mix of high-volume and niche-specific tags.' },
    { title: 'Engagement Tracking', desc: 'Real-time metrics for impressions, likes, retweets, replies, and profile visits. Historical trends and per-post analytics.' },
    { title: 'Recap Posts', desc: 'Automatic twice-weekly recap posts summarizing your best content, driving followers back to top-performing threads.' },
    { title: 'Proactive Following', desc: 'Discovers and follows relevant accounts in your niche using keyword-based search (20 queries, 50/day cap). Builds your network organically.' },
    { title: 'OPSEC Protection', desc: 'Rate limiting, human-like posting patterns, platform compliance checks, and automatic cooldown on API errors. No account flags.' },
    { title: 'Brand Voice Consistency', desc: 'Configurable tone, style, and vocabulary preferences. The bot learns your voice from approved posts and maintains consistency.' },
    { title: 'Content Queue', desc: 'Preview and manage upcoming posts. Drag to reorder, edit before publishing, or add manual posts alongside AI-generated content.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/post', desc: 'Generate and publish a new post immediately or add to queue. Specify category, tone, and optional topic.', auth: true },
    { method: 'GET', path: '/posts', desc: 'List all published posts with engagement metrics, sorted by date or performance.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Engagement analytics including impressions, engagement rate, follower growth, and top posts.', auth: true },
    { method: 'POST', path: '/schedule', desc: 'Schedule a post for a specific date and time. Supports recurring schedules.', auth: true },
    { method: 'GET', path: '/queue', desc: 'View the content queue with upcoming scheduled posts.', auth: true },
    { method: 'POST', path: '/categories', desc: 'Update content category weights and add custom categories.', auth: true },
    { method: 'GET', path: '/followers/growth', desc: 'Follower count history with daily/weekly/monthly growth rates.', auth: true },
    { method: 'POST', path: '/discover', desc: 'Trigger proactive account discovery based on configured keyword queries.', auth: true },
  ],

  userGuide: [
    {
      title: 'Content Strategy',
      id: 'content-strategy',
      content: [
        'Your content strategy is defined by weighted categories. Each category has a name, weight (relative probability of selection), and optional constraints like maximum posts per day or required hashtags.',
        'The default strategy includes: Industry Insights (40%) for thought leadership, Quick Tips (25%) for actionable advice, Engagement Posts (20%) for questions and polls, and Promotional (15%) for product mentions. Adjust these weights based on what your audience responds to.',
        'The Engine Runtime integration means posts contain real expertise. A post about tax strategy will reference actual IRC sections. A cybersecurity tip will cite real NIST frameworks. This domain accuracy is what sets Echo X Bot apart from generic AI posting tools.',
      ],
    },
    {
      title: 'Performance Optimization',
      id: 'performance',
      content: [
        'Monitor your analytics dashboard weekly. Key metrics to track: engagement rate (target >2%), impression growth, and follower-to-following ratio.',
        'The bot automatically A/B tests post formats — questions vs. statements, with vs. without hashtags, short vs. long — and shifts toward formats that perform best.',
        'Recap posts on Tuesdays and Fridays drive traffic back to your best content. These are auto-generated from your top 5 posts of the period.',
      ],
    },
    {
      title: 'Safety & Compliance',
      id: 'safety',
      content: [
        'Echo X Bot enforces strict platform compliance. Posting rates stay well within X API limits. Human-like patterns (variable timing, natural language variation) prevent bot detection.',
        'All posts go through a content filter that checks for potentially problematic content before publishing. You can configure sensitivity levels and add banned words or topics.',
        'API error handling includes automatic backoff. If rate limits are hit, the bot pauses and resumes when the window resets. Credit exhaustion triggers an alert rather than repeated failed attempts.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Domain-Expert Content', desc: 'Posts generated using Engine Runtime with 632K+ doctrines. Tax posts cite IRC sections. Legal posts reference case law. Oilfield posts use correct drilling terminology. Every post carries real expertise.' },
    { capability: 'Engagement Prediction', desc: 'AI predicts which post formats, topics, and timing will drive the most engagement based on your historical performance data and audience behavior patterns.' },
    { capability: 'Trend Detection', desc: 'Monitors trending topics in your niche and automatically generates timely posts that ride trending conversations for maximum visibility.' },
    { capability: 'Voice Adaptation', desc: 'Learns your brand voice from approved and edited posts. Over time, generated content becomes increasingly aligned with your preferred tone, vocabulary, and style.' },
  ],

  troubleshooting: [
    { issue: 'Posts not publishing', solution: 'Check X API credentials are valid and have read+write permissions. Verify your account has available API credits (Basic tier provides limited monthly posts). Check the error log for specific API error codes — 403 usually means permission issues, 429 means rate limiting.' },
    { issue: 'Low engagement rates', solution: 'Review your category weights — engagement posts (questions, polls) typically drive more interaction. Check posting times align with your audience timezone. Try shorter posts (under 200 chars perform 23% better). Increase hashtag variety.' },
    { issue: 'Content seems generic', solution: 'Specify more targeted content categories with domain constraints. Instead of broad "tech tips", use "cybersecurity NIST compliance tips" or "Permian Basin drilling optimization". The more specific the category, the more expert the generated content.' },
    { issue: 'Account flagged or restricted', solution: 'Immediately pause the bot and review recent posting patterns. Reduce posting frequency to 1-2/day. Ensure follow/unfollow rates are within platform limits. Wait 24-48 hours before resuming. Contact X support if restrictions persist.' },
  ],

  faq: [
    { q: 'Will my account get banned for using a bot?', a: 'Echo X Bot is designed with platform compliance as a priority. It uses human-like posting patterns, respects rate limits, and generates original content (not copied text). Thousands of businesses use automated posting tools within X\'s terms of service. The key is quality content at reasonable frequencies.' },
    { q: 'How many posts per day should I schedule?', a: 'We recommend starting with 2-3 posts per day, spaced at least 4 hours apart. Monitor engagement for 2 weeks, then adjust. Some accounts thrive with 5+ daily posts; others do better with 1 high-quality post. Let the analytics guide your frequency.' },
    { q: 'Can I review posts before they go live?', a: 'Yes. You can run in "approval mode" where every post goes to your queue for review before publishing. Once you trust the content quality, switch to autonomous mode where posts publish automatically with optional notification.' },
    { q: 'Does it work with X Premium / API tiers?', a: 'Echo X Bot works with any X API tier that provides write access. Basic tier has limited monthly tweets; Pro tier offers higher limits. Enterprise provides full API access. The bot automatically adjusts its posting frequency based on your available API quota.' },
    { q: 'Can I use it for multiple X accounts?', a: 'Each X account requires its own API credentials configured as a separate bot instance. You can manage multiple instances from a single Echo dashboard, each with its own content strategy and posting schedule.' },
  ],
}

export default function EchoXBotDocsPage() {
  return <ProductDoc {...data} />
}
