'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo News Intelligence',
  tagline: 'AI-curated news aggregation with topic tracking, sentiment analysis, and smart briefings.',
  accent: '#f59e0b',
  productUrl: '/news',
  workerUrl: 'https://echo-news-scraper.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo News Intelligence is a real-time, AI-powered news aggregation engine that pulls from dozens of sources across RSS feeds, Reddit, HackerNews, GitHub releases, arXiv papers, and mainstream outlets. Instead of manually checking ten different sites each morning, News Intelligence consolidates everything into a single prioritized feed scored by relevance, freshness, and impact to your specific interests.',
    'The system continuously monitors your configured topics and keywords, assigning sentiment scores and relevance ratings to every article it ingests. When a story breaks that matches your alert criteria, you get notified instantly via email, webhook, or in-app notification. Daily and weekly digest emails summarize the top stories so nothing slips through the cracks.',
    'Built on Cloudflare Workers for zero-latency edge processing, Echo News Intelligence deduplicates content across sources, classifies articles into custom categories, and detects emerging trends before they hit mainstream coverage. Whether you are tracking competitors, monitoring regulatory changes, or staying ahead of technology shifts, this engine keeps you informed without the noise.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com and navigate to the News Intelligence dashboard. Your account comes pre-configured with a default set of general technology and business news sources.' },
    { step: 2, title: 'Configure Your Topics', desc: 'Add the topics you care about most, such as "AI regulation", "oil and gas prices", or "Cloudflare Workers". The system uses these topics to score and prioritize every incoming article against your interests.' },
    { step: 3, title: 'Add Custom Sources', desc: 'Bring your own RSS feeds, subreddits, or HackerNews filters. Echo News Intelligence accepts any valid RSS/Atom URL and can monitor specific Reddit communities or GitHub organizations for releases and announcements.' },
    { step: 4, title: 'Set Up Alerts', desc: 'Define keyword alerts with severity levels. Critical alerts push immediately via webhook or email. Standard alerts are batched into your daily digest. You can set quiet hours so alerts do not interrupt your sleep.' },
    { step: 5, title: 'Review Your First Digest', desc: 'Within 24 hours you will receive your first daily digest email, a curated summary of the top stories across all your topics, ranked by relevance score and annotated with sentiment indicators.' },
  ],
  features: [
    { title: 'Multi-Source Aggregation', desc: 'Pulls content from RSS/Atom feeds, Reddit (any subreddit), HackerNews (front page, new, best), GitHub (releases, trending repos), arXiv (papers by category), and major news APIs. One unified feed from dozens of sources.' },
    { title: 'Topic Tracking', desc: 'Define unlimited topics with weighted keywords. The AI scores every article against your topic configuration and surfaces only what matters. Topics can overlap without duplication, and relevance scores are computed per-topic.' },
    { title: 'Sentiment Analysis', desc: 'Every article receives a sentiment score from -1.0 (strongly negative) to +1.0 (strongly positive). Filter your feed by sentiment to see only positive developments, or watch for negative sentiment spikes that might signal emerging problems.' },
    { title: 'Relevance Scoring', desc: 'A composite score combining keyword match density, source authority, recency, engagement metrics, and topic alignment. Articles scoring below your threshold are automatically filtered out, keeping your feed clean and actionable.' },
    { title: 'Daily Digest Emails', desc: 'Automated email digests sent at your preferred time. Each digest includes the top 10-25 stories per topic, complete with summaries, sentiment badges, source links, and trend arrows showing whether coverage of a topic is increasing or declining.' },
    { title: 'Keyword Alerts', desc: 'Real-time alerts when specific keywords appear in monitored sources. Configure alert channels (email, webhook, Slack), severity levels, cooldown periods, and deduplication windows to prevent alert fatigue.' },
    { title: 'Source Management', desc: 'Full CRUD for your source library. Rate each source for reliability, set per-source refresh intervals, pause sources temporarily, or bulk-import an OPML file of existing RSS subscriptions.' },
    { title: 'Content Deduplication', desc: 'Intelligent dedup engine that detects when multiple sources cover the same story. Uses title similarity, URL canonicalization, and content fingerprinting to merge duplicates into a single entry with all source links preserved.' },
    { title: 'Category Classification', desc: 'AI-powered automatic categorization into configurable taxonomy: Technology, Business, Finance, Security, Science, Regulation, and custom categories you define. Articles can belong to multiple categories simultaneously.' },
    { title: 'Trend Detection', desc: 'Identifies emerging trends by analyzing topic velocity, the rate at which a keyword or subject appears across sources over time. Get early signals on breaking stories, viral content, and shifting market narratives before they peak.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/news/feed', desc: 'Retrieve your personalized news feed with pagination, filtering by topic, category, sentiment range, date range, and source. Returns articles sorted by relevance score descending.', auth: true },
    { method: 'GET', path: '/news/topics', desc: 'List all configured topics with their keyword sets, article counts, average sentiment, and trend direction. Includes unread counts and last-updated timestamps.', auth: true },
    { method: 'POST', path: '/alerts', desc: 'Create or update a keyword alert. Body includes keywords array, channels (email, webhook URL, Slack), severity (critical, standard, low), cooldown in minutes, and active hours.', auth: true },
    { method: 'GET', path: '/digests', desc: 'Retrieve historical digest reports. Each digest contains ranked article summaries, topic breakdowns, sentiment histograms, and trend charts. Supports date range filtering.', auth: true },
    { method: 'POST', path: '/sources', desc: 'Add a new content source. Accepts RSS/Atom URL, Reddit subreddit name, GitHub org, or arXiv category. Returns source ID, initial fetch status, and estimated article volume.', auth: true },
    { method: 'GET', path: '/trends', desc: 'Fetch trend data across all tracked topics. Returns time-series arrays of mention counts, sentiment averages, and velocity scores. Supports hourly, daily, and weekly granularity.', auth: true },
  ],
  userGuide: [
    {
      title: 'Managing Your News Sources',
      id: 'managing-sources',
      content: [
        'Your source library is the foundation of Echo News Intelligence. Navigate to Sources in the dashboard to see all active feeds. Each source displays its type (RSS, Reddit, HackerNews, GitHub, arXiv), refresh interval, last fetch time, article count, and reliability score.',
        'To add a new source, click Add Source and select the type. For RSS feeds, paste the full URL. For Reddit, enter the subreddit name without the /r/ prefix. For GitHub, provide the organization or user name. The system validates the source immediately and performs an initial fetch to confirm connectivity.',
        'You can bulk-import sources by uploading an OPML file exported from any RSS reader. The system parses all feed URLs, validates them in parallel, and adds the working feeds to your library. Failed imports are reported with specific error reasons so you can fix and retry.',
      ],
    },
    {
      title: 'Configuring Topic Tracking',
      id: 'configuring-topics',
      content: [
        'Topics are the core of your personalized experience. Each topic consists of a name, a set of weighted keywords, optional exclusion keywords, and a minimum relevance threshold. When an article is ingested, it is scored against every topic you have defined.',
        'Keyword weights range from 1 (nice to have) to 10 (must match). An article about "AI regulation in oil and gas" would score highly against a topic with keywords "AI" (weight 5), "regulation" (weight 8), and "oil and gas" (weight 10). The final score is a normalized weighted sum.',
        'Use exclusion keywords to filter noise. If you track "Python" as a programming language, add exclusions for "snake", "monty python", and "python snake" to avoid irrelevant animal or comedy articles polluting your feed.',
      ],
    },
    {
      title: 'Understanding Sentiment and Trends',
      id: 'sentiment-trends',
      content: [
        'Every article processed by Echo News Intelligence receives a sentiment score computed by analyzing the headline, summary, and first 500 words of body content. Scores range from -1.0 (very negative) to +1.0 (very positive), with 0.0 representing neutral coverage.',
        'The Trends dashboard shows how topic mention volume and average sentiment change over time. A sharp spike in mentions with declining sentiment often signals a crisis or controversy. Conversely, steadily rising mentions with positive sentiment indicate a growing opportunity or favorable market shift.',
        'Set up trend alerts to be notified when a topic exceeds a velocity threshold, such as more than 50 mentions per hour when the baseline is 5. These early warning signals give you a head start on reacting to breaking developments.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Natural Language Topic Extraction', desc: 'Automatically extracts and suggests relevant topics from your existing reading habits, bookmarks, and browsing history. The AI identifies patterns in what you read most and recommends new topics you might be missing.' },
    { capability: 'Smart Summarization', desc: 'Generates concise 2-3 sentence summaries for every article using extractive and abstractive techniques. Summaries highlight the key facts, named entities, and conclusions so you can decide whether to read the full article in seconds.' },
    { capability: 'Cross-Source Narrative Synthesis', desc: 'When multiple sources cover the same story, the AI synthesizes a unified narrative that captures all perspectives. It identifies where sources agree, where they disagree, and flags factual claims that appear in only one source.' },
    { capability: 'Predictive Trend Forecasting', desc: 'Uses historical pattern analysis to predict which topics are likely to trend in the next 24-72 hours. Based on early signal detection in niche sources that historically precede mainstream coverage by 1-3 days.' },
  ],
  troubleshooting: [
    { issue: 'RSS feed not returning articles', solution: 'Verify the feed URL is accessible by opening it directly in a browser. Some feeds require authentication or have geo-restrictions. Check the source status in your dashboard for specific error codes. If the feed uses HTTPS with a self-signed certificate, it may be blocked by our security policy.' },
    { issue: 'Duplicate articles appearing in feed', solution: 'The deduplication engine uses content fingerprinting which can occasionally miss near-duplicates with significant rewording. You can manually merge duplicates by selecting them and clicking Merge. To improve future detection, report false negatives via the feedback button on each article.' },
    { issue: 'Digest emails not arriving', solution: 'Check your spam/junk folder first. Verify your email address in Account Settings. Ensure digest delivery is enabled and the scheduled time has not been set to a timezone different from your expectation. You can manually trigger a test digest from Settings > Digests > Send Test.' },
    { issue: 'Sentiment scores seem inaccurate', solution: 'Sentiment analysis works best on English-language content with clear opinion signals. Technical documentation, press releases with neutral language, and satire can produce misleading scores. You can override sentiment on any article, and your corrections train the model for improved accuracy on similar content.' },
  ],
  faq: [
    { q: 'How many sources can I monitor simultaneously?', a: 'Free accounts support up to 25 sources. Pro accounts support up to 200 sources. Enterprise accounts have no source limit. Each source is polled independently on its own schedule, so adding more sources does not slow down your existing feeds.' },
    { q: 'How often are sources checked for new content?', a: 'The default polling interval is 15 minutes for RSS feeds, 5 minutes for Reddit and HackerNews, and 1 hour for GitHub and arXiv. You can customize intervals per source, with a minimum of 1 minute for Pro and Enterprise accounts.' },
    { q: 'Can I export my news data?', a: 'Yes. You can export your full article history, topic configurations, alert rules, and trend data as JSON or CSV. The API also supports programmatic export via the /news/feed endpoint with pagination for building custom integrations.' },
    { q: 'Does Echo News Intelligence support non-English content?', a: 'The aggregation engine supports content in any language. Sentiment analysis and summarization currently perform best on English, Spanish, French, and German. Other languages use a general-purpose multilingual model with somewhat reduced accuracy.' },
    { q: 'How is my reading data used?', a: 'Your topic configurations, source lists, and reading patterns are used solely to improve your personalized feed. We do not sell user data, share reading habits with third parties, or use individual data for advertising. All data is encrypted at rest in Cloudflare R2.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }
