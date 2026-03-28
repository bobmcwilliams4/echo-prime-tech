'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Instagram Bot',
  tagline: 'Autonomous Instagram content management — AI-generated posts, story scheduling, hashtag optimization, and audience growth.',
  accent: '#e1306c',
  productUrl: '/instagram-ai',
  workerUrl: 'https://echo-instagram.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Instagram Bot manages your Instagram presence autonomously with AI-generated content, optimal posting schedules, and strategic hashtag selection. It handles feed posts, stories, and engagement tracking to maintain a consistent, professional presence.',
    'Content generation leverages Engine Runtime for domain-expert captions that go beyond generic marketing copy. Whether your niche is technology, oil and gas, finance, or any other industry, posts are crafted with authentic expertise that resonates with your audience.',
    'The bot includes webhook-based real-time notifications for new followers, comments, and direct messages, plus analytics dashboards tracking reach, engagement rate, and audience demographics.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Instagram', desc: 'Link your Instagram Business or Creator account via Meta\'s Graph API. Requires a Facebook Page connected to your Instagram account and proper API permissions.' },
    { step: 2, title: 'Configure Content Plan', desc: 'Set up your content calendar with posting frequency, content categories, and visual style preferences. Upload brand assets (logos, color palettes, templates).' },
    { step: 3, title: 'Set Hashtag Strategy', desc: 'Define your hashtag pools — mix of high-reach (100K+ posts), medium (10K-100K), and niche (under 10K) hashtags for optimal discoverability.' },
    { step: 4, title: 'Enable Webhooks', desc: 'Activate real-time webhooks for new followers, comments, and DMs. Route notifications to your preferred channel (email, Slack, dashboard).' },
    { step: 5, title: 'Launch & Monitor', desc: 'Review the first week of scheduled content, then enable autonomous mode. Monitor reach, engagement rate, and follower growth from the analytics dashboard.' },
  ],

  features: [
    { title: 'AI Caption Generation', desc: 'Engine Runtime-powered captions with industry expertise, storytelling hooks, and strategic calls-to-action. Not generic marketing copy.' },
    { title: 'Hashtag Optimization', desc: 'AI-curated hashtag sets balancing reach and competition. Dynamic rotation prevents hashtag fatigue and reaches different audience segments.' },
    { title: 'Posting Schedule', desc: 'Optimal posting times based on your audience activity patterns. Automatic spacing between posts for maximum reach per post.' },
    { title: 'Story Scheduling', desc: 'Plan and schedule Instagram Stories in advance with auto-publish at optimal engagement windows.' },
    { title: 'Webhook Notifications', desc: 'Real-time alerts for new followers, comments, and messages via configurable webhook endpoints.' },
    { title: 'Engagement Analytics', desc: 'Track reach, impressions, engagement rate, saves, shares, and profile visits. Per-post performance and historical trends.' },
    { title: 'Audience Insights', desc: 'Demographic breakdown of your audience by age, gender, location, and active hours. Growth trend analysis.' },
    { title: 'Content Calendar', desc: 'Visual calendar view of scheduled and published content. Drag-and-drop rescheduling. Gap detection alerts.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/posts', desc: 'Create and schedule a new Instagram post with AI-generated or custom caption and hashtags.', auth: true },
    { method: 'GET', path: '/posts', desc: 'List all published posts with engagement metrics.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Account analytics including reach, engagement rate, follower growth, and audience demographics.', auth: true },
    { method: 'POST', path: '/stories', desc: 'Schedule an Instagram Story with image/video and optional link sticker.', auth: true },
    { method: 'GET', path: '/hashtags/suggest', desc: 'Get AI-suggested hashtag sets for a given topic or caption.', auth: true },
    { method: 'POST', path: '/webhooks', desc: 'Configure webhook endpoints for real-time event notifications.', auth: true },
  ],

  userGuide: [
    {
      title: 'Content Creation',
      id: 'content-creation',
      content: [
        'Instagram content performs best with a consistent visual style and authentic voice. Configure your brand guidelines (colors, fonts, imagery style) and the AI will generate captions that match.',
        'Mix content types: educational carousel posts (highest saves), behind-the-scenes stories (highest engagement), inspirational quotes (highest shares), and product showcases (highest conversion).',
        'Captions should be 150-300 words for feed posts. Lead with a hook (first 125 characters visible before "more"). Include a clear call-to-action (save, share, comment, or link in bio).',
      ],
    },
    {
      title: 'Hashtag Strategy',
      id: 'hashtags',
      content: [
        'Use 20-30 hashtags per post. Mix: 5 high-reach (>500K posts), 10 medium (10K-500K), 10 niche (<10K). Niche hashtags are where your content can rank in "Top Posts."',
        'Rotate hashtag sets to avoid Instagram\'s repetitive hashtag penalty. The bot maintains pools of relevant hashtags and selects different combinations for each post.',
        'Track which hashtag sets drive the most reach and engagement. The AI automatically weights more effective hashtags higher in future selection.',
      ],
    },
    {
      title: 'Growth Tactics',
      id: 'growth',
      content: [
        'Consistency beats volume. 4-5 feed posts per week with daily stories outperforms sporadic posting of any volume.',
        'Post during your audience\'s peak activity hours. The bot analyzes your Instagram Insights data to identify optimal windows.',
        'Engage with comments on your posts within the first hour. Early engagement signals to the algorithm that your content is worth promoting.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Visual Content Planning', desc: 'AI suggests content themes, formats (carousel, single image, reel), and visual styles based on your audience preferences and trending content in your niche.' },
    { capability: 'Caption Optimization', desc: 'Generates captions optimized for engagement — hooks, storytelling structure, CTAs — based on what performs best for your audience.' },
    { capability: 'Hashtag Intelligence', desc: 'Analyzes hashtag competitiveness, relevance, and your content\'s ranking potential. Selects optimal combinations for maximum discoverability.' },
    { capability: 'Audience Analysis', desc: 'Identifies your most engaged audience segments, optimal posting times, and content preferences for data-driven strategy adjustments.' },
  ],

  troubleshooting: [
    { issue: 'Posts not publishing', solution: 'Verify your Instagram Business account is connected to a Facebook Page. Check Meta Graph API permissions include instagram_content_publish. Ensure your API token hasn\'t expired — tokens need periodic refresh.' },
    { issue: 'Low reach and engagement', solution: 'Check posting consistency — gaps longer than 3 days significantly reduce algorithmic reach. Review hashtag strategy (over-competitive hashtags mean your content never surfaces). Ensure posts include strong hooks in the first 125 characters.' },
    { issue: 'Webhook notifications not arriving', solution: 'Verify your webhook URL is publicly accessible and returns a 200 status. Check that the Meta app subscription is active in the developer portal. Review webhook challenge verification handling.' },
    { issue: 'Content quality concerns', solution: 'Narrow your content categories for more specific expertise. Provide example posts that match your desired tone. Review and edit the first 10-20 generated captions to train the AI on your preferences.' },
  ],

  faq: [
    { q: 'Does it support Instagram Reels?', a: 'Currently, the bot supports feed posts and Stories. Reel scheduling is on the roadmap and will leverage the Instagram Content Publishing API\'s reel support when available for automated publishing.' },
    { q: 'Can I schedule carousel posts?', a: 'Yes. Provide multiple images and the bot handles carousel creation with individual captions for each slide if desired, or a single caption for the carousel.' },
    { q: 'How do I connect my Instagram account?', a: 'You need an Instagram Business or Creator account connected to a Facebook Page. Then create a Meta app in the developer portal with Instagram Graph API permissions. The bot walks you through the OAuth flow to obtain your access token.' },
    { q: 'Will using a bot hurt my account?', a: 'The bot uses official Meta Graph API endpoints — the same APIs that Hootsuite, Buffer, and Later use. It respects rate limits, posts at human-reasonable frequencies, and generates original content. This is standard social media management automation.' },
    { q: 'Can I use it for multiple Instagram accounts?', a: 'Yes. Each Instagram account is configured as a separate instance with its own content strategy, hashtag pools, and analytics. Manage all accounts from a single Echo dashboard.' },
  ],
}

export default function EchoInstagramBotDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/instagram-ai' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
