'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Scraper Orchestrator',
  tagline: 'Intelligent web scraping fleet with anti-detection, rate limiting, and structured data extraction.',
  accent: '#ea580c',
  productUrl: '/scrapers',
  workerUrl: 'https://echo-scraper-orchestrator.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Scraper Orchestrator manages a fleet of intelligent web scrapers that extract structured data from any website at scale. The system handles the hardest parts of production scraping — anti-detection, rate limiting, retry logic, proxy rotation, and data normalization — so you can focus on defining what data you need rather than fighting bot detection systems.',
    'Each scrape job runs through a multi-stage pipeline: target resolution, page rendering (headless or static), content extraction via CSS/XPath selectors or AI-powered parsing, data normalization, deduplication, and structured output delivery. Jobs can be one-shot or scheduled on recurring intervals with automatic change detection.',
    'The orchestrator distributes work across a pool of scraper instances running at the Cloudflare edge. Requests are routed through rotating residential proxies with randomized user agents, viewport sizes, and timing patterns to minimize detection risk. Rate limiters enforce per-domain courtesy delays, and circuit breakers halt scraping if a target site starts returning captchas or blocks.',
  ],
  gettingStarted: [
    { step: 1, title: 'Authenticate via SDK Gateway', desc: 'All scraper operations route through the Echo SDK Gateway. Include your X-Echo-API-Key header in every request. Obtain your key from the Echo Prime dashboard under Settings > API Keys.' },
    { step: 2, title: 'Define a Scrape Target', desc: 'Create a target configuration specifying the URL pattern, extraction selectors (CSS or XPath), output field mapping, and pagination rules. Targets are reusable definitions that describe what to scrape and how to structure the output.' },
    { step: 3, title: 'Launch a Scrape Job', desc: 'POST to /scrapes/start with your target ID and any runtime parameters (page limits, date filters, custom headers). The orchestrator queues the job, assigns it to an available scraper instance, and returns a job ID for tracking.' },
    { step: 4, title: 'Monitor Progress', desc: 'Poll GET /scrapes/:id/status for real-time progress — pages scraped, records extracted, errors encountered, and estimated completion time. For long-running jobs, configure a webhook URL to receive completion notifications.' },
    { step: 5, title: 'Export Results', desc: 'Once complete, call POST /exports with the job ID and desired format (JSON, CSV, or NDJSON). Results are stored for 30 days and can be re-exported at any time. Large result sets are automatically paginated.' },
  ],
  features: [
    { title: 'Multi-Site Scraping', desc: 'Run scrape jobs across dozens of target sites simultaneously. The orchestrator manages job queues, distributes load across scraper instances, and merges results from multiple sources into unified datasets.' },
    { title: 'Anti-Detection Engine', desc: 'Rotates residential proxies, randomizes user agents and viewport sizes, varies request timing, and mimics human browsing patterns. Supports TLS fingerprint rotation and header order randomization to bypass advanced bot detection.' },
    { title: 'Intelligent Rate Limiting', desc: 'Enforces per-domain rate limits with configurable courtesy delays. Automatically adjusts request frequency based on target server response times and error rates. Respects robots.txt directives when configured to do so.' },
    { title: 'Structured Extraction', desc: 'Define extraction rules using CSS selectors, XPath expressions, or AI-powered content parsing. Map extracted fields to typed output schemas with validation rules. Handles nested data, lists, and paginated content automatically.' },
    { title: 'Recurring Schedules', desc: 'Schedule scrape jobs on cron intervals with change detection. The system compares new results against previous runs and flags additions, removals, and modifications. Only changed records trigger downstream notifications.' },
    { title: 'Retry Logic & Circuit Breakers', desc: 'Failed requests are automatically retried with exponential backoff and proxy rotation. If a target site consistently returns errors or captchas, the circuit breaker halts the job and alerts the operator to prevent IP burns.' },
    { title: 'Data Normalization', desc: 'Raw scraped content is cleaned, trimmed, and transformed into consistent formats. Dates are parsed into ISO-8601, currencies are normalized, addresses are geocoded, and phone numbers are formatted to E.164.' },
    { title: 'Deduplication', desc: 'Content-hash-based deduplication ensures the same record is never stored twice. Configurable dedup keys let you define what constitutes a unique record — URL, title, SKU, or any combination of extracted fields.' },
    { title: 'Webhook Notifications', desc: 'Receive real-time notifications when jobs complete, fail, or detect changes. Webhooks deliver a summary payload with record counts, error counts, and a signed URL to download the full result set.' },
    { title: 'Scrape History & Audit Trail', desc: 'Every scrape job is logged with full metadata — start time, duration, pages visited, records extracted, errors, proxy usage, and bandwidth consumed. History is queryable for compliance auditing and performance optimization.' },
    { title: 'Multiple Export Formats', desc: 'Export results as JSON, CSV, NDJSON (newline-delimited JSON), or directly into Echo ecosystem services like Knowledge Forge, Shared Brain, or D1 databases. Custom export adapters can be registered for specialized downstream systems.' },
    { title: 'Concurrent Execution', desc: 'The orchestrator manages a pool of scraper instances and dynamically scales concurrency based on job queue depth and target site responsiveness. Up to 50 concurrent scraper instances can be active per account.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/scrapes/start', desc: 'Launch a new scrape job. Accepts target_id, parameters (page_limit, date_range, custom_headers), and optional webhook_url for completion notification. Returns a job ID.', auth: true },
    { method: 'GET', path: '/scrapes/:id/status', desc: 'Get real-time status of a scrape job — pages completed, records extracted, errors encountered, estimated time remaining, and current state (queued, running, completed, failed).', auth: true },
    { method: 'GET', path: '/scrapes/history', desc: 'Query scrape job history with filters for target, date range, status, and record count. Returns paginated results sorted by start time descending. Useful for auditing and performance tracking.', auth: true },
    { method: 'POST', path: '/schedules', desc: 'Create a recurring scrape schedule. Accepts target_id, cron expression, parameters, and change detection settings. Returns the schedule object with next_run timestamp.', auth: true },
    { method: 'GET', path: '/targets', desc: 'List all registered scrape targets with their selector configurations, output schemas, and usage statistics. Supports filtering by domain, tag, and last-used date.', auth: true },
    { method: 'POST', path: '/exports', desc: 'Export scrape results in the specified format (json, csv, ndjson). Accepts job_id and format. Returns a signed download URL valid for 24 hours. Large exports are chunked automatically.', auth: true },
  ],
  userGuide: [
    {
      title: 'Configuring Scrape Targets',
      id: 'targets',
      content: [
        'A scrape target is a reusable configuration that describes what to extract from a specific website. Each target includes the base URL pattern, extraction selectors, output field definitions, pagination rules, and any required authentication or cookie handling.',
        'Selectors can be CSS (recommended for most sites) or XPath (for complex HTML structures). Use the built-in selector tester to validate your expressions against a live page before creating the target. The tester shows extracted values in real time and highlights matched DOM elements.',
        'For sites with JavaScript-rendered content, enable the headless rendering mode in the target configuration. This instructs the scraper to fully render the page using a headless browser before extracting content. Headless mode is slower but handles SPAs, lazy-loaded content, and infinite scroll patterns.',
        'Output fields are typed — string, number, date, url, email, currency — and validated during extraction. Invalid values are flagged in the job results but do not halt the scrape. You can configure strict mode to skip records that fail validation.',
      ],
    },
    {
      title: 'Managing Proxies and Anti-Detection',
      id: 'anti-detection',
      content: [
        'The anti-detection engine operates transparently — you do not need to configure proxies or user agents manually. The system maintains a pool of residential proxies across 30+ countries and rotates them automatically based on target domain and request volume.',
        'If you need to target a specific geography (for example, scraping prices that vary by region), set the geo_target parameter in your scrape request. The system will route all requests through proxies in the specified country.',
        'For heavily protected sites, enable stealth mode in the target configuration. Stealth mode adds realistic mouse movements, scroll events, and timing variations to the headless browser session. It also randomizes TLS cipher suites and HTTP/2 settings to avoid fingerprinting.',
      ],
    },
    {
      title: 'Monitoring and Troubleshooting Jobs',
      id: 'monitoring',
      content: [
        'Active jobs can be monitored through the /scrapes/:id/status endpoint or the Scraper Dashboard in the Echo Prime web interface. The dashboard shows real-time metrics — pages per minute, extraction success rate, proxy health, and error distribution.',
        'When a job encounters errors, the system categorizes them by type: network errors (timeouts, DNS failures), HTTP errors (403, 429, 503), extraction errors (selector mismatch, missing field), and validation errors (type mismatch, constraint violation). Each category has its own retry strategy.',
        'If a job is stuck or producing bad data, you can pause it via the API without losing progress. Paused jobs retain their state and can be resumed from the exact page where they stopped. This is useful for adjusting selectors mid-job when a target site has changed its layout.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'AI Content Extraction', desc: 'When CSS and XPath selectors are insufficient, the AI extraction mode analyzes page structure semantically to identify and extract target content. Useful for sites with dynamic class names, obfuscated HTML, or frequently changing layouts.' },
    { capability: 'Smart Change Detection', desc: 'Goes beyond simple hash comparison to understand semantic changes in scraped content. Distinguishes between meaningful updates (price changes, new listings) and noise (ad rotations, timestamp updates, layout shifts) to reduce false-positive change notifications.' },
    { capability: 'Adaptive Rate Optimization', desc: 'Continuously monitors target site response patterns and adjusts scraping speed in real time. Slows down when the server shows signs of strain (increasing latency, intermittent errors) and speeds up during low-traffic periods to maximize throughput without triggering defenses.' },
    { capability: 'Automatic Schema Inference', desc: 'Analyzes sample pages from a target site to automatically infer the data schema — field names, types, and relationships. Generates a draft target configuration that you can review and refine, dramatically reducing the setup time for new scrape targets.' },
  ],
  troubleshooting: [
    { issue: 'Scrape job returns zero records despite pages loading', solution: 'The extraction selectors likely do not match the current page structure. Use the selector tester to validate your CSS or XPath expressions against a live page. If the site uses JavaScript rendering, enable headless mode in the target configuration. Check if the site has changed its DOM structure since the target was created.' },
    { issue: 'High error rate with 403 or 429 responses', solution: 'The target site is detecting and blocking scrape requests. Enable stealth mode and reduce concurrency to 1-2 instances for the affected domain. Check that rate limiting is enabled with at least 2-second courtesy delays. If blocks persist, rotate to a fresh proxy pool via the anti-detection settings.' },
    { issue: 'Duplicate records in export results', solution: 'Configure a dedup key in the target definition to specify which fields uniquely identify a record (for example, URL + title or product SKU). Run a re-export with dedup_enabled=true to retroactively remove duplicates from an existing result set.' },
    { issue: 'Scheduled scrape jobs not firing on time', solution: 'Verify the cron expression and timezone setting in the schedule configuration. Check GET /schedules/:id for the next_run field to confirm the calculated next execution time. If the schedule shows as paused, it may have been auto-paused after 3 consecutive failures — check the error log and resume manually.' },
  ],
  faq: [
    { q: 'Is web scraping legal?', a: 'The legality of web scraping depends on the jurisdiction, the target site terms of service, and the type of data being collected. Echo Scraper Orchestrator provides the technical infrastructure — compliance with applicable laws and target site policies is the responsibility of the account holder. We recommend consulting legal counsel for your specific use case.' },
    { q: 'How many concurrent scrape jobs can I run?', a: 'Free tier supports 2 concurrent jobs with 1 scraper instance each. Pro tier supports 10 concurrent jobs with up to 10 instances each. Enterprise tier supports 50 concurrent jobs with up to 50 instances. Concurrency limits apply per account across all active jobs.' },
    { q: 'Can I scrape sites that require login?', a: 'Yes. Configure authentication in the target definition using cookie injection, session token headers, or automated login flows via headless mode. Credentials are stored encrypted in the Echo Vault and injected at runtime. OAuth and SSO flows are supported through the headless browser.' },
    { q: 'How long are scrape results stored?', a: 'Results are stored for 30 days in hot storage with instant access. After 30 days, results are moved to cold archive where they are retained for 1 year. Results can be exported at any time during the retention period. Long-term retention beyond 1 year is available on Enterprise plans.' },
    { q: 'Does the scraper handle JavaScript-heavy single-page applications?', a: 'Yes. Enable headless rendering mode in the target configuration to fully render JavaScript before extraction. The headless browser supports SPAs built with React, Angular, Vue, and other frameworks. It handles lazy loading, infinite scroll, and client-side routing automatically.' },
  ],
}

export default function Page() { return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/scrapers' },
      ]} />
      <ProductDoc {...data} />
    </>
  ) }
