'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Reddit Bot',
  tagline: 'Autonomous Reddit engagement — AI-powered community participation, lead generation, and brand monitoring across targeted subreddits.',
  accent: '#ff4500',
  productUrl: '/reddit',
  workerUrl: 'https://echo-reddit-bot.bmcii1976.workers.dev',
  version: '2.6.0',

  overview: [
    'Echo Reddit Bot provides autonomous community engagement across targeted subreddits. It monitors conversations in your niche, contributes genuinely helpful answers powered by Engine Runtime expertise, and captures qualified leads — all while maintaining authentic community participation.',
    'Unlike spam bots that get shadowbanned immediately, Echo Reddit Bot is designed for authentic engagement. It contributes real value through domain-expert answers (632K+ doctrines), follows subreddit rules, respects rate limits, and builds genuine karma through helpful participation.',
    'The bot tracks 11+ subreddits simultaneously, maintaining a daily activity cap (5 posts/day) to avoid detection. Each response is crafted with real industry knowledge — tax answers cite IRC sections, legal answers reference case law, oilfield answers use proper terminology.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Reddit Account', desc: 'Provide your Reddit API credentials (client ID, client secret, username, password). Create a Reddit app at reddit.com/prefs/apps as a "script" type application.' },
    { step: 2, title: 'Configure Subreddits', desc: 'Select target subreddits where your expertise is relevant. The bot monitors new posts and comments for opportunities to contribute valuable answers.' },
    { step: 3, title: 'Set Engagement Rules', desc: 'Configure daily activity caps (default: 5/day), response tone, and topic filters. Define which types of posts to engage with (questions, discussions, help requests).' },
    { step: 4, title: 'Define Lead Criteria', desc: 'Set up lead capture rules — what signals indicate a potential customer? Keywords, intent patterns, and engagement indicators that trigger lead scoring.' },
    { step: 5, title: 'Monitor & Optimize', desc: 'Track karma growth, lead capture rate, and engagement quality from the dashboard. Adjust subreddit selection and response strategies based on performance.' },
  ],

  features: [
    { title: 'Multi-Subreddit Monitoring', desc: '11+ subreddits monitored simultaneously. Configurable keyword filters and post type targeting (questions, discussions, help requests).' },
    { title: 'Domain-Expert Responses', desc: 'Engine Runtime-powered answers with real expertise. Tax answers cite IRC sections. Legal answers reference case law. Every response adds genuine value.' },
    { title: 'Lead Generation', desc: '258+ leads captured from conversation signals. Intent detection identifies potential customers based on keywords, questions, and expressed needs.' },
    { title: 'Daily Activity Caps', desc: 'Configurable daily limits (default: 5/day) prevent over-engagement. Smart scheduling spaces interactions naturally throughout the day.' },
    { title: 'Karma Tracking', desc: 'Monitor karma growth per subreddit. Track which types of responses earn the most upvotes and adjust strategy accordingly.' },
    { title: 'Shadowban Detection', desc: 'Automatic monitoring for shadowban indicators. If detected, the bot pauses and alerts you immediately to prevent further reputation damage.' },
    { title: 'Subreddit Rule Compliance', desc: 'Automatically reads and respects subreddit rules. Avoids self-promotion in communities that prohibit it. Adapts tone to match subreddit culture.' },
    { title: 'Conversation Threading', desc: 'Tracks full conversation context when replying. Responses reference parent comments and original posts for contextually relevant contributions.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/posts', desc: 'List all bot-authored posts and comments with karma scores and engagement metrics.', auth: true },
    { method: 'GET', path: '/leads', desc: 'View captured leads with intent scores, source subreddit, and conversation context.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Engagement analytics: karma growth, response rate, lead conversion, and per-subreddit performance.', auth: true },
    { method: 'POST', path: '/subreddits', desc: 'Add or remove monitored subreddits. Configure per-subreddit engagement rules and topic filters.', auth: true },
    { method: 'GET', path: '/health', desc: 'Bot health status including shadowban check, rate limit status, and credential validity.', auth: true },
    { method: 'POST', path: '/settings', desc: 'Update bot settings: daily caps, response tone, keyword filters, and lead capture rules.', auth: true },
  ],

  userGuide: [
    {
      title: 'Subreddit Selection',
      id: 'subreddit-selection',
      content: [
        'Choose subreddits where your expertise genuinely adds value. The bot performs best in communities that welcome helpful answers — r/tax, r/legaladvice, r/oilandgasworkers, r/smallbusiness, r/cybersecurity, etc.',
        'Avoid subreddits with strict anti-bot policies or heavily moderated communities where automated posting is explicitly prohibited. The bot checks sidebar rules automatically but manual review is recommended.',
        'Start with 3-5 subreddits and expand based on performance. Quality engagement in fewer communities beats shallow participation across many.',
      ],
    },
    {
      title: 'Response Quality',
      id: 'response-quality',
      content: [
        'Every response is generated using Engine Runtime doctrines. This means answers contain real citations, accurate terminology, and verifiable information — not generic AI platitudes.',
        'The bot formats responses appropriately for Reddit: concise paragraphs, bullet points for lists, and direct answers to questions. It avoids corporate-speak and matches each subreddit\'s conversational tone.',
        'Responses are capped at a reasonable length (typically 200-400 words) to provide value without overwhelming the conversation. Longer detailed responses are reserved for complex questions.',
      ],
    },
    {
      title: 'Lead Capture',
      id: 'lead-capture',
      content: [
        'Lead capture happens passively through conversation signals. When someone asks "Can anyone recommend a tool for X?" or "I need help with Y", the bot detects purchase intent and logs the lead.',
        'Each lead includes: username, subreddit, conversation context, intent keywords, and a computed score. Higher scores indicate stronger purchase signals.',
        'Export leads to your CRM or review them in the dashboard. The bot never sends unsolicited DMs or makes overt sales pitches — all leads are captured from organic conversations.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Intent Detection', desc: 'Natural language understanding identifies purchase intent, help requests, and recommendation queries. Distinguishes casual discussion from actionable opportunities.' },
    { capability: 'Tone Matching', desc: 'Adapts response tone to match subreddit culture. Technical subreddits get detailed answers. Casual communities get conversational responses. Professional subs get formal expertise.' },
    { capability: 'Deduplication', desc: 'Prevents responding to the same user or topic repeatedly. Tracks conversation history to avoid appearing repetitive or bot-like.' },
    { capability: 'Quality Scoring', desc: 'Rates potential responses before posting. Low-quality or irrelevant responses are discarded. Only contributions that genuinely add value are published.' },
  ],

  troubleshooting: [
    { issue: 'Bot appears shadowbanned', solution: 'Check your posts from a logged-out browser — if they are invisible, you are shadowbanned. Stop all activity immediately. Create a new Reddit app with fresh credentials. Wait 7-14 days before resuming with lower activity caps. Consider using a different account.' },
    { issue: 'Low karma growth', solution: 'Focus on subreddits where your expertise is strongest. Answer questions early (first-mover advantage on Reddit). Provide specific, actionable advice rather than general statements. Include relevant links or sources when appropriate.' },
    { issue: 'Posts being removed by moderators', solution: 'Review the specific subreddit rules — some prohibit external links, promotional content, or short responses. Adjust per-subreddit settings to comply with local rules. Consider removing subreddits with overly strict policies.' },
    { issue: 'Lead quality is poor', solution: 'Refine your intent detection keywords. Focus on subreddits closer to your target market. Increase the minimum lead score threshold to filter out casual mentions. Add negative keywords to exclude irrelevant conversations.' },
  ],

  faq: [
    { q: 'Is using a Reddit bot against the rules?', a: 'Reddit allows bots that add value to communities. The key requirements are: the bot must not spam, must follow subreddit rules, and should contribute genuinely helpful content. Echo Reddit Bot is designed for authentic engagement, not mass posting or manipulation.' },
    { q: 'How do I avoid getting shadowbanned?', a: 'Keep daily activity low (5 or fewer posts/day), space interactions throughout the day, never post the same content twice, always provide genuine value, and avoid self-promotional language. The bot enforces all these safeguards automatically.' },
    { q: 'Can I target specific keywords within subreddits?', a: 'Yes. Configure keyword filters per subreddit to only engage with posts containing specific terms. This ensures the bot only responds when it has relevant expertise to contribute.' },
    { q: 'How does lead generation work without being promotional?', a: 'The bot never promotes products or sends DMs. It captures leads passively by identifying users who express needs your product can solve. When someone asks "I need help with X" in a relevant subreddit, the bot logs them as a lead. You follow up manually or through other channels.' },
    { q: 'What happens if Reddit changes their API?', a: 'Echo Reddit Bot uses the official Reddit API with proper authentication. We monitor API changes and update the bot accordingly. The bot includes version checking and will pause rather than operate against an incompatible API.' },
  ],
}

export default function EchoRedditBotDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/reddit' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
