'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Surveillance (Prometheus)',
  tagline: 'AI-powered monitoring and intelligence gathering platform — real-time social media surveillance, brand tracking, competitive intel, dark web monitoring, and OSINT collection.',
  accent: '#8b5cf6',
  productUrl: '/surveillance',
  workerUrl: 'https://echo-prometheus-surveillance.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Surveillance, codenamed Prometheus, is an AI-powered intelligence and monitoring platform that aggregates signals from social media networks, public web sources, dark web marketplaces, and proprietary data feeds into a unified threat and opportunity dashboard. It monitors X/Twitter, Reddit, LinkedIn, Instagram, and dozens of additional sources in real time, surfacing brand mentions, competitive movements, emerging threats, and sentiment shifts as they happen — not hours or days later.',
    'The platform combines natural language processing with entity resolution and graph-based link analysis to distinguish signal from noise. When a brand mention spikes on Reddit, Prometheus correlates it with X/Twitter activity, LinkedIn discussions, and dark web chatter to determine whether it is a coordinated campaign, organic virality, or a security incident. Every alert includes sentiment classification (positive, negative, neutral, mixed), source attribution, entity extraction, and a confidence score so operators can prioritize response.',
    'Prometheus operates on Cloudflare Workers at the edge, processing monitoring jobs with sub-second latency across 300+ global PoPs. Alert pipelines deliver notifications via webhook, email, SMS (Twilio), Slack, and Discord within seconds of detection. The platform supports custom monitoring profiles, keyword watchlists, competitor tracking boards, and scheduled OSINT sweeps — all managed through the REST API or the built-in monitoring dashboard.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create a Monitoring Profile', desc: 'Define what you want to monitor: brand names, competitor names, keywords, hashtags, domains, or specific social media accounts. Each profile can track up to 500 keywords across all supported platforms simultaneously.' },
    { step: 2, title: 'Configure Alert Pipelines', desc: 'Set up alert rules that trigger when specific conditions are met — mention volume thresholds, negative sentiment spikes, new dark web listings, or competitor activity patterns. Route alerts to webhooks, email, SMS, Slack, or Discord.' },
    { step: 3, title: 'Launch Monitoring', desc: 'POST to /monitor with your profile configuration to start real-time monitoring. The platform immediately begins scanning all configured sources and delivers the first results within seconds.' },
    { step: 4, title: 'Review the Dashboard', desc: 'Access /dashboard for a real-time view of all active monitors, recent alerts, sentiment trends, source distribution, and entity graphs. The dashboard auto-refreshes and supports drill-down into individual mentions.' },
    { step: 5, title: 'Run OSINT Searches', desc: 'Use POST /search for on-demand OSINT investigations. Submit a target (person, company, domain, email, phone) and receive a comprehensive intelligence report aggregating data from public records, social media, domain registrations, and open databases.' },
  ],
  features: [
    { title: 'Real-Time Social Media Monitoring', desc: 'Continuous scanning of X/Twitter, Reddit, LinkedIn, and Instagram for brand mentions, keywords, and hashtags. Sub-minute detection latency with full post metadata, author profiles, and engagement metrics captured for every match.' },
    { title: 'Sentiment Analysis', desc: 'Every detected mention is classified as positive, negative, neutral, or mixed using multi-model NLP ensemble. Sentiment scores include confidence levels and highlighted phrases that drove the classification, enabling rapid triage of high-impact mentions.' },
    { title: 'Brand Mention Tracking', desc: 'Dedicated brand monitoring profiles track all variations of your brand name, common misspellings, competitor comparisons, and product-specific keywords. Historical trend analysis shows mention volume, sentiment trajectory, and share of voice over time.' },
    { title: 'Competitive Intelligence', desc: 'Track competitor activity across social media, press releases, job postings, patent filings, and domain registrations. Automated competitive scorecards compare your brand against up to 20 competitors on sentiment, mention volume, and audience engagement.' },
    { title: 'Dark Web Monitoring', desc: 'Continuous scanning of dark web marketplaces, forums, and paste sites for leaked credentials, data breach mentions, brand impersonation, and threat actor discussions. Alerts include source attribution, threat severity classification, and recommended response actions.' },
    { title: 'OSINT Collection', desc: 'On-demand and scheduled open source intelligence gathering from public records, WHOIS databases, social media profiles, corporate filings, court records, and academic publications. Results are normalized into structured entity profiles with confidence-scored attributes.' },
    { title: 'Automated Alert Pipelines', desc: 'Configurable alert rules with multi-channel delivery (webhook, email, SMS, Slack, Discord). Alerts support throttling, deduplication, escalation chains, and business-hours routing. Critical alerts bypass all throttles for immediate delivery.' },
    { title: 'Entity Resolution', desc: 'AI-powered entity resolution links mentions of the same person, company, or topic across different platforms and naming conventions. The system builds entity graphs showing relationships between actors, organizations, and events.' },
    { title: 'Monitoring Dashboard', desc: 'Real-time dashboard showing all active monitors, alert feed, sentiment trends, geographic distribution of mentions, top sources, trending keywords, and entity relationship graphs. Supports custom date ranges and exportable reports.' },
    { title: 'Keyword Watchlists', desc: 'Create and manage keyword watchlists with support for boolean operators, proximity matching, language filtering, and platform-specific targeting. Watchlists can be shared across monitoring profiles and updated without restarting active monitors.' },
    { title: 'Geolocation Intelligence', desc: 'Geo-tagged mentions are plotted on interactive maps showing activity clusters, geographic sentiment distribution, and regional trend analysis. Geofencing alerts trigger when monitored activity originates from specific regions.' },
    { title: 'Historical Analysis', desc: 'Full historical data retention with searchable archives. Replay past events, analyze how narratives evolved over time, identify the origin point of viral content, and generate post-incident reports with timeline reconstruction.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/monitor', desc: 'Start a new monitoring job. Provide keywords, platforms, alert rules, and notification channels. Returns a monitor_id for tracking status and managing the active monitor. Supports up to 500 keywords per monitor.', auth: true },
    { method: 'GET', path: '/alerts', desc: 'Retrieve active and recent alerts across all monitors. Supports filtering by severity, platform, sentiment, date range, and monitor_id. Returns alerts with full context including matched content, sentiment scores, and source metadata.', auth: true },
    { method: 'POST', path: '/search', desc: 'Execute an OSINT search against a target (person, company, domain, email, phone number). Returns a structured intelligence report with entity profiles, social media presence, public records, and confidence-scored attributes.', auth: true },
    { method: 'GET', path: '/dashboard', desc: 'Retrieve aggregated monitoring dashboard data including active monitor count, alert summary, sentiment trends, mention volume over time, top sources, trending keywords, and entity graph data. Supports custom date ranges.', auth: true },
    { method: 'GET', path: '/monitors', desc: 'List all active and paused monitoring jobs with their configuration, status, alert counts, and last activity timestamp. Supports pagination and filtering by platform or status.', auth: true },
    { method: 'PUT', path: '/monitors/:id', desc: 'Update an active monitor configuration — add or remove keywords, change alert rules, modify notification channels, or pause/resume the monitor without losing accumulated data.', auth: true },
    { method: 'DELETE', path: '/monitors/:id', desc: 'Stop and delete a monitoring job. Historical data is retained for 90 days after deletion and can be accessed via the /history endpoint.', auth: true },
    { method: 'GET', path: '/history', desc: 'Query historical monitoring data with full-text search, date range filtering, platform filtering, and sentiment filtering. Returns paginated results with full mention context and metadata.', auth: true },
    { method: 'GET', path: '/health', desc: 'System health check returning module status, active monitor count, alert pipeline status, and per-platform connection health. No authentication required.', auth: false },
    { method: 'POST', path: '/watchlist', desc: 'Create or update a keyword watchlist. Supports boolean operators (AND, OR, NOT), proximity matching, language filters, and platform-specific targeting. Watchlists can be attached to multiple monitors.', auth: true },
  ],
  userGuide: [
    { id: 'monitoring-profiles', title: 'Monitoring Profiles', content: [
      'A monitoring profile defines what Prometheus watches for and how it responds. Each profile contains a set of keywords, target platforms, alert rules, and notification channels. You can run multiple profiles simultaneously, each tracking different aspects of your intelligence requirements.',
      'Keywords support boolean operators: use AND to require multiple terms, OR for alternatives, NOT to exclude terms, and quotes for exact phrase matching. Proximity operators (NEAR/5) find terms within a specified word distance. Platform-specific prefixes (x:, reddit:, linkedin:) restrict keywords to individual platforms.',
      'Each profile has independent alert thresholds. You might want immediate alerts for dark web credential leaks (severity: critical, throttle: none) but daily digest summaries for routine brand mentions (severity: low, throttle: 24h). Configure these per-profile to match your operational tempo.',
    ]},
    { id: 'sentiment-analysis', title: 'Understanding Sentiment Scores', content: [
      'Prometheus classifies every detected mention into four sentiment categories: positive, negative, neutral, and mixed. The classification uses a multi-model NLP ensemble that analyzes text content, emoji usage, reply context, and platform-specific signals (upvotes, quote-tweet patterns, thread structure).',
      'Each sentiment classification includes a confidence score from 0.0 to 1.0. Scores above 0.85 indicate high-confidence classifications suitable for automated response triggers. Scores between 0.6 and 0.85 are reliable for trend analysis. Scores below 0.6 should be reviewed manually, especially for mixed sentiment or sarcasm-heavy content.',
      'Sentiment trends are tracked over time for each monitoring profile. The dashboard shows rolling 24-hour, 7-day, and 30-day sentiment trajectories. Sudden negative sentiment spikes trigger automatic alert escalation regardless of configured thresholds.',
    ]},
    { id: 'competitive-intel', title: 'Competitive Intelligence', content: [
      'The competitive intelligence module tracks up to 20 competitor profiles alongside your brand. For each competitor, Prometheus monitors social media mentions, press coverage, job postings (which reveal strategic direction), patent filings, domain registrations, and executive movements.',
      'Automated competitive scorecards are generated weekly comparing your brand against each competitor on five dimensions: share of voice (mention volume), sentiment ratio, audience engagement rate, content velocity, and topic coverage breadth. Scorecards highlight significant changes from the prior period.',
      'The competitive alert system notifies you when a competitor launches a new product, files a trademark, posts a job for a role that signals a strategic pivot, or experiences a PR crisis. These alerts include context analysis explaining the likely strategic implications.',
    ]},
    { id: 'dark-web-monitoring', title: 'Dark Web Monitoring', content: [
      'Dark web monitoring scans Tor-based marketplaces, forums, paste sites, and encrypted channels for mentions of your brand, domains, employee names, and leaked credentials. The scanner operates through anonymized proxy chains and never exposes your monitoring activity to threat actors.',
      'Detected threats are classified by severity: CRITICAL (active credential dumps, data breach sales), HIGH (brand impersonation, phishing kit sales), MEDIUM (discussion of targeting your organization), and LOW (passive mentions without clear threat intent). Critical alerts bypass all throttling for immediate delivery.',
      'Each dark web alert includes the source forum or marketplace, thread context, threat actor profile (if identifiable), estimated data freshness, and recommended response actions. For credential leaks, the alert includes affected account counts and credential types (email/password, API keys, session tokens).',
    ]},
    { id: 'osint-investigations', title: 'OSINT Investigations', content: [
      'On-demand OSINT searches aggregate data from dozens of public sources into structured intelligence reports. Submit a target identifier — person name, company name, domain, email address, or phone number — and receive a comprehensive profile within minutes.',
      'Person searches return social media profiles, professional history (LinkedIn, corporate filings), public records (property, court records, voter registration where available), domain ownership, and published content. All results include source attribution and confidence scores.',
      'Company searches return corporate filings, officer/director information, subsidiary relationships, domain portfolio, technology stack (from public-facing infrastructure), social media presence, press coverage, patent portfolio, and litigation history. Results are normalized into a structured company profile with timeline visualization.',
    ]},
    { id: 'alert-pipelines', title: 'Alert Pipeline Configuration', content: [
      'Alert pipelines define how detected events are delivered to your team. Each pipeline has a trigger condition, severity classification, throttle setting, and one or more delivery channels. Pipelines can be chained — a low-severity pipeline might escalate to a high-severity pipeline if mention volume exceeds a threshold within a time window.',
      'Delivery channels include webhook (custom URL with JSON payload), email (individual or distribution list), SMS via Twilio, Slack (channel or DM), and Discord (channel webhook). Each channel can have independent formatting templates and payload structures.',
      'Throttling prevents alert fatigue. Set per-pipeline throttle windows (e.g., max 1 alert per hour for routine brand mentions) with override rules for critical severity. Business-hours routing sends non-critical alerts to email during off-hours and Slack during business hours. Deduplication prevents the same mention from triggering multiple alerts across overlapping monitors.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Multi-Platform NLP', desc: 'Platform-aware natural language processing that understands the unique conventions of each social network — Twitter abbreviations, Reddit markdown, LinkedIn professional tone, Instagram hashtag patterns — for accurate keyword matching and sentiment classification across all monitored sources.' },
    { capability: 'Entity Resolution', desc: 'AI identifies and links references to the same entity across platforms and naming variations. "Echo Prime", "@echoprime", "echo-prime.tech", and "Echo Prime Technologies" are all resolved to a single entity node in the intelligence graph with cross-platform activity aggregation.' },
    { capability: 'Narrative Tracking', desc: 'Tracks how stories and narratives evolve across platforms over time. Identifies the original source of a narrative, maps its spread pattern, detects amplification by bots or coordinated groups, and predicts trajectory based on historical viral patterns.' },
    { capability: 'Threat Scoring', desc: 'AI assigns threat scores to dark web mentions and negative sentiment events based on source credibility, actor history, specificity of targeting, and correlation with other intelligence signals. Scores drive automatic alert severity classification and escalation decisions.' },
    { capability: 'Anomaly Detection', desc: 'Statistical anomaly detection identifies unusual patterns in mention volume, sentiment distribution, geographic origin, and posting cadence. Anomalies trigger investigation alerts that include baseline comparison data and potential explanations ranked by likelihood.' },
    { capability: 'Predictive Intelligence', desc: 'Machine learning models trained on historical monitoring data predict emerging trends, forecast mention volume, estimate crisis probability, and identify early warning signals of coordinated negative campaigns before they reach critical mass.' },
  ],
  troubleshooting: [
    { issue: 'Monitor is not detecting mentions on a specific platform', solution: 'Verify the platform is included in your monitor configuration. Check that your keywords do not use platform-specific prefixes that exclude the target platform. Some platforms have rate limits that may cause brief detection delays during high-volume periods — check /health for per-platform connection status.' },
    { issue: 'Sentiment classification seems inaccurate for sarcastic content', solution: 'Sarcasm detection is inherently challenging. The multi-model ensemble catches most sarcasm patterns, but edge cases exist. For critical monitoring profiles, enable the manual review queue for mentions with sentiment confidence below 0.7. You can also submit correction feedback via PUT /alerts/:id/feedback to improve future classifications.' },
    { issue: 'Alert volume is too high and causing fatigue', solution: 'Increase throttle windows on low-severity pipelines. Use deduplication to prevent overlapping monitors from generating duplicate alerts. Consider switching routine brand mentions to daily digest delivery while keeping critical alerts on immediate delivery. Review keyword watchlists for overly broad terms.' },
    { issue: 'OSINT search returns incomplete results for a person', solution: 'Person searches depend on publicly available information. Common names may require additional disambiguation parameters (location, employer, email). Try searching with different identifier types — email address and phone number searches often surface profiles that name-only searches miss.' },
    { issue: 'Dark web alerts are not appearing despite known leaks', solution: 'Dark web scanning operates on crawl cycles. New marketplace listings may take up to 2 hours to appear in alerts. Ensure your monitoring profile includes all relevant brand names, domain variations, and employee email patterns. Check that dark web monitoring is enabled in your subscription tier (Operator or Command).' },
    { issue: 'Dashboard data appears stale or delayed', solution: 'Dashboard data aggregates on 60-second intervals. If data appears significantly stale, check /health for system status. Clear browser cache and verify your authentication token has not expired. For real-time needs, use the /alerts endpoint with polling instead of the dashboard aggregation.' },
  ],
  faq: [
    { q: 'What social media platforms does Prometheus monitor?', a: 'Prometheus monitors X/Twitter, Reddit, LinkedIn, and Instagram in real time. Additional sources include news sites, blogs, forums, paste sites, and dark web marketplaces. The platform architecture supports adding new sources without disrupting existing monitors.' },
    { q: 'How quickly are mentions detected?', a: 'Most social media mentions are detected within 30-60 seconds of posting. Dark web sources operate on crawl cycles with detection latency of up to 2 hours. Alert delivery adds 1-3 seconds depending on the notification channel. Critical alerts are prioritized in the processing queue.' },
    { q: 'Is dark web monitoring included in all plans?', a: 'Basic dark web monitoring (credential leak scanning) is included in the Operator tier. Full dark web intelligence (marketplace monitoring, threat actor tracking, forum analysis) requires the Command tier. The Recon tier includes IP threat intelligence but not dark web monitoring.' },
    { q: 'How does OSINT collection handle privacy regulations?', a: 'Prometheus only collects publicly available information from sources that do not require authentication to access. The platform does not scrape private profiles, bypass access controls, or collect data that would require consent under GDPR, CCPA, or similar regulations. All collected data includes source attribution for compliance auditing.' },
    { q: 'Can I export monitoring data for external analysis?', a: 'Yes. All monitoring data, alerts, and OSINT reports can be exported as structured JSON or CSV. The /history endpoint supports bulk data export with date range filtering. Webhook delivery provides real-time data streaming to your own analytics infrastructure.' },
    { q: 'How many keywords can I monitor simultaneously?', a: 'Each monitoring profile supports up to 500 keywords. You can run multiple profiles simultaneously, with the total keyword capacity depending on your subscription tier: Recon (1 profile / 500 keywords), Operator (10 profiles / 5,000 keywords), Command (unlimited profiles and keywords).' },
    { q: 'Does Prometheus detect bot activity and coordinated campaigns?', a: 'Yes. The narrative tracking and anomaly detection AI identifies patterns consistent with bot networks and coordinated inauthentic behavior — synchronized posting times, identical content with minor variations, new accounts with unusual activity patterns, and amplification networks. Suspected coordination is flagged in alerts with supporting evidence.' },
  ],
}

export default function SurveillanceDocPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/surveillance' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
