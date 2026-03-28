'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo LinkedIn Bot',
  tagline: 'Autonomous LinkedIn presence — AI-generated professional posts, connection growth, and lead generation.',
  accent: '#0a66c2',
  productUrl: '/linkedin',
  workerUrl: 'https://echo-linkedin.bmcii1976.workers.dev',
  version: '2.9.0',

  overview: [
    'Echo LinkedIn Bot maintains a professional LinkedIn presence with AI-generated content tailored to your industry. It publishes thought leadership posts, engages with your network, discovers new connections, and generates qualified leads — all autonomously.',
    'Content is generated using Engine Runtime with 632K+ doctrines, ensuring every post contains genuine industry expertise rather than generic AI text. Posts about tax strategy cite real IRC sections. Oilfield posts use correct drilling terminology. Legal posts reference actual case law.',
    'The bot includes proactive connection discovery via post likers API, weighted content categories, and twice-weekly recap posts. Built-in OPSEC protections ensure your account stays safe with human-like posting patterns and rate limiting.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect LinkedIn', desc: 'Provide your LinkedIn API credentials. The bot uses OAuth 2.0 for secure access to your profile, posts, and connections.' },
    { step: 2, title: 'Set Content Categories', desc: 'Configure weighted content categories matching your professional brand. Default: Industry Insights (35%), Career Tips (25%), Company Updates (20%), Engagement (20%).' },
    { step: 3, title: 'Configure Posting Schedule', desc: 'Set posting frequency (default: 3/day on weekdays). LinkedIn engagement peaks Tuesday-Thursday 8-10am, so the bot prioritizes these windows.' },
    { step: 4, title: 'Enable Connection Discovery', desc: 'Activate proactive discovery to find and connect with relevant professionals who engage with content in your niche.' },
    { step: 5, title: 'Monitor Lead Generation', desc: 'Track qualified leads from post engagement, connection requests accepted, and profile views driven by your content.' },
  ],

  features: [
    { title: 'Professional Content Generation', desc: 'Engine Runtime-powered posts with real domain expertise. LinkedIn-optimized formatting with hooks, bullet points, and calls to action.' },
    { title: 'Weighted Categories', desc: 'Content categories with adjustable weights ensure a balanced mix of thought leadership, tips, company updates, and engagement posts.' },
    { title: 'Connection Discovery', desc: 'Proactive discovery via post likers API (socialActions/{urn}/likes). Identifies and connects with professionals who engage with content in your niche.' },
    { title: 'Lead Tracking', desc: 'Tracks engagement-to-lead conversion. Identifies prospects who consistently engage with your content and scores them for sales outreach.' },
    { title: 'Recap Posts', desc: 'Automatic twice-weekly recap posts highlighting your best-performing content, driving re-engagement and new follower discovery.' },
    { title: 'Hashtag Optimization', desc: 'AI-selected LinkedIn-appropriate hashtags based on trending professional topics and your industry niche.' },
    { title: 'Engagement Analytics', desc: 'Track impressions, reactions, comments, shares, and profile views. Historical trends and per-post performance metrics.' },
    { title: 'OPSEC Protection', desc: 'Human-like posting patterns, rate limiting, and platform compliance. No account flags or restrictions.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/post', desc: 'Generate and publish a professional LinkedIn post. Specify category, topic, and optional formatting preferences.', auth: true },
    { method: 'GET', path: '/posts', desc: 'List all published posts with engagement metrics including reactions, comments, and shares.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Engagement analytics with impression trends, follower growth, and lead generation metrics.', auth: true },
    { method: 'POST', path: '/discover', desc: 'Trigger proactive connection discovery. Searches post likers in your niche and sends connection requests.', auth: true },
    { method: 'GET', path: '/leads', desc: 'View qualified leads identified from engagement patterns, sorted by lead score.', auth: true },
    { method: 'GET', path: '/connections/growth', desc: 'Connection count history with daily and weekly growth rates.', auth: true },
  ],

  userGuide: [
    {
      title: 'Content Strategy',
      id: 'content-strategy',
      content: [
        'LinkedIn rewards long-form thought leadership. Posts between 1,200-1,800 characters with clear formatting (line breaks, bullet points, numbered lists) consistently outperform short updates.',
        'Start posts with a strong hook — a surprising stat, contrarian take, or relatable scenario. End with a clear call to action (question, poll, or link).',
        'The Engine Runtime integration ensures posts contain verifiable expertise. When posting about tax strategy, the bot cites actual IRC sections. For oilfield content, it uses correct API numbers and formation names.',
      ],
    },
    {
      title: 'Lead Generation',
      id: 'lead-generation',
      content: [
        'The bot tracks which connections and non-connections consistently engage with your posts. Repeat engagers are scored as leads with higher scores for comments (high intent) vs. reactions (low intent).',
        'Connection discovery uses the socialActions API to find professionals who engage with content similar to yours. These targeted connection requests have 3-5x higher acceptance rates than cold outreach.',
        'Export qualified leads to your CRM via the /leads endpoint. Each lead includes engagement history, company, title, and a computed lead score.',
      ],
    },
    {
      title: 'Growth Optimization',
      id: 'growth',
      content: [
        'Posting consistency matters more than volume on LinkedIn. 3 posts per week with high engagement outperforms daily low-quality posts.',
        'Tuesday through Thursday between 8-10am and 5-6pm are peak engagement windows. The bot automatically schedules posts during these windows for your timezone.',
        'Engage with comments on your posts within the first hour — LinkedIn\'s algorithm heavily weights early engagement velocity.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Professional Tone Calibration', desc: 'AI ensures all content matches LinkedIn\'s professional tone expectations. No casual language, memes, or off-brand content that could harm your professional reputation.' },
    { capability: 'Engagement Prediction', desc: 'Predicts which topics and formats will drive the most engagement based on your audience composition, historical performance, and trending professional topics.' },
    { capability: 'Lead Scoring', desc: 'Machine learning scores leads based on engagement frequency, interaction type (comment > reaction), seniority level, company relevance, and content affinity.' },
    { capability: 'Content Differentiation', desc: 'Ensures each post is distinctly different from previous posts. Varies format (story, listicle, opinion, case study), length, and hook style to prevent audience fatigue.' },
  ],

  troubleshooting: [
    { issue: 'Posts not publishing', solution: 'Verify LinkedIn API credentials are valid and have write permissions (w_member_social scope). Check if your LinkedIn developer app is approved and active. Review error logs for specific API error codes.' },
    { issue: 'Low engagement rates', solution: 'Review posting times — ensure they align with your audience timezone peak hours. Try longer-form posts with clear formatting. Include a question at the end to encourage comments. Check if hashtags are too niche or too broad.' },
    { issue: 'Connection requests being rejected', solution: 'Reduce discovery rate (default: 10/day). Ensure connection requests include a personalized note referencing shared interests. Target connections who already engage with similar content.' },
    { issue: 'Content feels generic', solution: 'Narrow your content categories with specific domain constraints. Instead of broad "business tips", use "Permian Basin operator efficiency" or "IRS audit defense strategies". Specificity drives expertise quality.' },
  ],

  faq: [
    { q: 'Is automated posting allowed on LinkedIn?', a: 'LinkedIn\'s API provides official endpoints for posting content programmatically. Echo LinkedIn Bot uses only official API endpoints with proper OAuth authentication. Thousands of businesses use marketing automation tools for LinkedIn posting within their terms of service.' },
    { q: 'How does lead generation work?', a: 'The bot tracks who engages with your posts (reactions, comments, shares). Repeat engagers are scored as leads based on interaction type and frequency. Connection discovery finds relevant professionals through the socialActions API. All leads include engagement history and scoring.' },
    { q: 'Can I customize the posting voice?', a: 'Yes. Configure your professional tone (thought leader, educator, practitioner), industry vocabulary, and formatting preferences. The bot learns from your edits to approved posts and adapts over time.' },
    { q: 'How many posts per day is optimal?', a: 'For most professionals, 1 post per weekday (5/week) is optimal. The bot can post more frequently but quality always beats quantity on LinkedIn. Start with 3/week and increase based on engagement metrics.' },
    { q: 'Does it handle comments and messages?', a: 'Currently, the bot focuses on content publishing and analytics. Comment management and direct message automation are on the roadmap. You can view comments through the analytics dashboard and respond manually.' },
  ],
}

export default function EchoLinkedInBotDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/linkedin' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
