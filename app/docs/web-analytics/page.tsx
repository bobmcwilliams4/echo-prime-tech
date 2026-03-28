'use client'

import ProductDoc from '@/components/ProductDoc'

const data = {
  name: 'Echo Web Analytics',
  tagline: 'Privacy-first, cookie-free analytics with a <1KB tracking script and real-time dashboards',
  accent: '#10b981',
  productUrl: '/web-analytics',
  workerUrl: 'https://echo-web-analytics.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Web Analytics delivers actionable traffic insights without cookies, consent banners, or GDPR compliance risk. The tracking script weighs less than 1KB and collects visitor data using localStorage for visitor ID persistence, sendBeacon for non-blocking hit delivery, and Cloudflare\'s CF-IPCountry and CF-Connecting-IP headers for geo resolution — all without ever writing a cookie to the browser.',
    'Visitor IDs are generated client-side using a cryptographic random UUID stored in localStorage under the key _echo_vid. IP addresses are hashed with a daily rotating salt before being stored, making it impossible to reconstruct individual browsing histories. Bot filtering uses a combination of user agent matching, headless browser detection, and Cloudflare\'s bot score to exclude non-human traffic from all metrics.',
    'The platform supports single-page application navigation tracking via pushState and popstate event listeners, custom goal events, UTM parameter attribution, and public shareable dashboards. Nine D1 tables store raw events, daily aggregates, goal completions, and site configuration. A 5-minute realtime window shows current active visitors. Daily aggregation runs via a scheduled Cloudflare Worker cron to compress raw events into summary rows, keeping storage costs flat as traffic grows.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create a Site', desc: 'Sign up at echo-ept.com/web-analytics and click "Add Site". Enter your domain (e.g., yoursite.com). The system generates a unique Site ID (e.g., ept_abc123) used to scope all tracking data to your domain.' },
    { step: 2, title: 'Install the Tracking Script', desc: 'Add one line to the <head> of every page: <script async src="https://echo-web-analytics.bmcii1976.workers.dev/script.js?id=YOUR_SITE_ID"></script>. No configuration required. The script auto-detects the page URL, referrer, UTM params, and device details.' },
    { step: 3, title: 'Verify Data is Flowing', desc: 'Open your site in a browser tab (not incognito — localStorage is disabled in private browsing on some browsers). Within 30 seconds, the Realtime panel in your dashboard should show 1 active visitor. Check the Events log to confirm hits are arriving.' },
    { step: 4, title: 'Configure Goals', desc: 'Define conversion goals in the Goals section: URL match (visitor reaches a specific path), custom event (your code fires echo("goal", "signup")), or element click (CSS selector). Goals appear as a separate metric column in all reports.' },
    { step: 5, title: 'Share the Dashboard', desc: 'Enable Public Dashboard in Site Settings to generate a shareable URL. Public dashboards show all traffic metrics but do not expose raw event data or goal details. Share with clients, stakeholders, or embed in your status page.' },
  ],
  features: [
    { title: 'Sub-1KB Tracking Script', desc: 'The tracking script (script.js) is a single minified JavaScript file under 1,000 bytes. It loads asynchronously and has no external dependencies. It never blocks page rendering. The script is served from Cloudflare\'s edge with aggressive Cache-Control headers so it is cached by browsers for 24 hours.' },
    { title: 'Cookie-Free with localStorage Visitor IDs', desc: 'Visitor persistence uses a UUID stored in localStorage under _echo_vid. This creates consistent visitor tracking across sessions without any cookie consent requirement. localStorage is cleared when users delete site data, providing natural data expiration that respects user intent.' },
    { title: 'sendBeacon Collection', desc: 'All tracking hits are sent via navigator.sendBeacon to the collection endpoint. sendBeacon fires asynchronously, never blocks page unload, and is not cancelled when the user navigates away. This ensures pageview and exit event fidelity that XHR and fetch-based trackers miss.' },
    { title: 'SPA Navigation Tracking', desc: 'The script patches the pushState and replaceState methods and listens to the popstate event to detect client-side navigation in React, Next.js, Vue, and other SPA frameworks. Each navigation fires a new pageview event with the updated URL, making SPA traffic data as accurate as traditional multi-page sites.' },
    { title: 'Bot Filtering', desc: 'Inbound hits are filtered against a frequently updated list of known bot user agents. Headless browser detection checks for webdriver, phantom, and automated browsing fingerprints. Cloudflare\'s bot score (available via the bot_management header) is used as an additional signal — hits with a bot score above 80 are excluded.' },
    { title: 'IP Hashing with Daily Salt Rotation', desc: 'Visitor IP addresses are hashed using SHA-256 with a salt that rotates every 24 hours. The hash is used for unique visitor counting within a day but cannot be used to track the same person across days. The raw IP is never written to the database.' },
    { title: 'Cloudflare Geo Headers', desc: 'Country is resolved from the CF-IPCountry header (free, always present on Workers). City and region are resolved from the CF-Connecting-IP header combined with a lightweight MaxMind GeoLite2 lookup stored in KV. No external geo API calls are required.' },
    { title: 'UTM Tracking', desc: 'The tracking script reads utm_source, utm_medium, utm_campaign, utm_term, and utm_content from the query string on every pageview. UTM values are stored in localStorage for the session and attributed to all subsequent pageviews and goal completions within the same session.' },
    { title: 'Custom Goals', desc: 'Define goals based on URL patterns (exact, starts-with, or regex), custom events fired from your JavaScript code via the echo() function, or element clicks matched by CSS selector. Goal completions are tracked separately from pageviews and attributed back to the UTM source of the session.' },
    { title: 'Public Dashboards', desc: 'Generate a public read-only dashboard URL for any site. Public dashboards show all traffic metrics with full date range controls. Operators can disable public dashboards at any time from Site Settings. Useful for agencies sharing reports with clients or open-source projects sharing traffic stats.' },
    { title: 'Realtime Panel', desc: 'The realtime panel shows visitors active in the last 5 minutes with their current page, country, device type, and referrer. Active visitor count updates every 30 seconds via polling. Used to monitor traffic spikes during launches, promotions, or press coverage.' },
    { title: 'Daily Aggregation via Cron', desc: 'A scheduled Cloudflare Worker runs daily at 02:00 UTC to aggregate the previous day\'s raw events into summary rows per page, per source, per country, and per device type. Aggregated rows replace raw events after 7 days, keeping D1 storage flat and query performance fast regardless of traffic volume.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/collect', desc: 'The hit collection endpoint. Accepts pageview, custom event, and goal completion payloads via sendBeacon. No auth — rate-limited by IP and site ID', auth: false },
    { method: 'GET', path: '/script.js', desc: 'The tracking script. Accepts id query parameter (site ID). Returns the self-configuring tracking script with the site ID baked in. No auth required', auth: false },
    { method: 'POST', path: '/sites', desc: 'Create a new site. Accepts domain, name, and public_dashboard (bool). Returns site_id and script embed code', auth: true },
    { method: 'GET', path: '/sites/:id/stats', desc: 'Retrieve aggregated stats for a site. Query params: start, end (ISO dates), metric (pageviews/visitors/sessions/bounce_rate/avg_duration). Returns daily timeseries and totals', auth: false },
    { method: 'GET', path: '/sites/:id/pages', desc: 'Top pages report. Returns the most visited paths for the date range with pageviews, unique visitors, bounce rate, and average time on page per path', auth: false },
    { method: 'GET', path: '/sites/:id/sources', desc: 'Traffic sources report. Breaks down visits by referrer domain, UTM source, UTM medium, and UTM campaign. Returns counts and percentages', auth: false },
    { method: 'GET', path: '/sites/:id/geo', desc: 'Geographic report. Returns top countries, regions, and cities with visitor counts. Supports map_data format for choropleth rendering', auth: false },
    { method: 'GET', path: '/sites/:id/devices', desc: 'Device and browser report. Breaks down visitors by device type, browser, OS, and screen resolution category (mobile/tablet/desktop)', auth: false },
    { method: 'GET', path: '/sites/:id/realtime', desc: 'Realtime visitors in the last 5 minutes. Returns count, list of active pages, and current country distribution. No auth for public dashboard sites', auth: false },
    { method: 'POST', path: '/sites/:id/goals', desc: 'Create a new goal definition. Accepts type (url/event/click), matcher (pattern/selector/event_name), and display name', auth: true },
  ],
  userGuide: [
    {
      id: 'script-installation',
      title: 'Installing the Tracking Script',
      content: [
        'Place the script tag in the <head> element of your HTML, before the closing </head> tag. The async attribute is critical — it prevents the script from blocking page rendering. The script loads and initializes in under 50ms on fast connections.',
        'For Next.js sites, use the next/script component with strategy="afterInteractive" to load the tracking script after the page becomes interactive. Place it in your root layout component. For WordPress, add the script tag via the theme\'s functions.php header action or a lightweight analytics plugin.',
        'To verify installation, open the browser developer console and type echo. You should see the echo function defined. Type echo("test") — this fires a custom event. Check the Events log in your dashboard within 30 seconds to confirm the event arrived.',
      ],
    },
    {
      id: 'goals-setup',
      title: 'Setting Up Goals',
      content: [
        'URL goals fire when a visitor loads a URL matching the pattern. Exact match requires the full path to match precisely. Starts-with match fires for any URL beginning with the prefix (e.g., /checkout captures all checkout steps). Regex match supports full regular expressions for complex patterns.',
        'Custom event goals require you to fire the echo() function from your JavaScript code when the conversion occurs. Example: after a form submission, call echo("goal", "newsletter_signup"). The first argument is always "goal" and the second is the goal name as configured in the dashboard.',
        'Click goals automatically fire when a visitor clicks any element matching the configured CSS selector. Example: echo-web-analytics tracks button[data-goal="signup"] clicks on your page without any additional code changes. This is useful for tracking CTA buttons without modifying your codebase.',
      ],
    },
    {
      id: 'understanding-metrics',
      title: 'Understanding the Metrics',
      content: [
        'Visitors are unique visitor IDs (localStorage UUIDs) seen in the date range. Sessions are groups of pageviews from the same visitor within a 30-minute window of inactivity. Pageviews are the total number of pages loaded. Bounce rate is the percentage of sessions where only one page was viewed. Average duration is the median session length in seconds.',
        'Sources are the referrer domains or UTM sources that drove traffic. Direct traffic (no referrer, no UTM) is labeled "Direct." Traffic with UTM parameters is grouped by utm_source. Referral traffic is grouped by the referring domain. Social platforms (twitter.com, instagram.com, etc.) are grouped under their canonical name regardless of the specific referring URL.',
        'The trend line on the main chart compares the current period to the previous period of equal length. Green indicates growth, red indicates decline. Hover over any data point to see the exact count and the percentage change vs. the same point in the comparison period.',
      ],
    },
    {
      id: 'public-dashboards',
      title: 'Public Dashboards',
      content: [
        'Enable a public dashboard in Site Settings → Public Dashboard. A read-only URL is generated in the format /public/:share_token. The token is a random 20-character string that can be regenerated to revoke access. Public dashboards do not require a login and are designed to be bookmarked or embedded.',
        'Public dashboards show the same metrics as the private view but do not expose goal definitions, event names, or raw event data. The site owner\'s identity is not disclosed on the public dashboard — it shows only the site domain name.',
        'Embed the public dashboard in an iframe for inclusion in status pages, investor reports, or agency client portals. The dashboard renders responsively at any width above 400px. Append ?theme=dark or ?theme=light to force a specific color scheme regardless of the visitor\'s system preference.',
      ],
    },
    {
      id: 'spa-tracking',
      title: 'SPA and Framework-Specific Tracking',
      content: [
        'For React and Next.js applications using the App Router, each client-side navigation to a new route fires a pageview event automatically via the pushState patch. No additional configuration is required. Test this by navigating between pages in the browser while watching the Realtime panel — each page change should appear within 5 seconds.',
        'For hash-based routing (#/path), the script listens to the hashchange event as well as popstate. Hash route changes are captured as pageview events with the full URL including the hash fragment. This covers legacy SPA frameworks that use hash routing.',
        'If your SPA framework uses a custom router that does not trigger popstate or pushState (rare), you can fire manual pageview events from your router\'s navigation hook: echo("pageview", { url: window.location.href, title: document.title }).',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Traffic Anomaly Detection', desc: 'Monitors daily visitor counts against a rolling 30-day baseline and alerts when traffic deviates significantly (>3 standard deviations). Distinguishes between spikes (viral content, press coverage) and drops (technical outages, indexing issues) based on referrer and source distribution.' },
    { capability: 'Content Performance Scoring', desc: 'Scores each page based on a combination of pageviews, unique visitors, average session duration, scroll depth (if scroll events are enabled), and goal conversion rate. Surfaces the highest-performing content and identifies pages with high traffic but low engagement that need improvement.' },
    { capability: 'Funnel Analysis', desc: 'Automatically constructs visitor funnels from the top URL sequences in your traffic data. Identifies where visitors drop off on the path to conversion goals. Highlights the highest-leverage steps to optimize based on the volume of drop-offs and the conversion rate impact.' },
    { capability: 'Channel Attribution Modeling', desc: 'Applies first-touch, last-touch, and linear attribution models to distribute goal completions across traffic sources. Shows how each attribution model changes your understanding of which channels are driving conversions, helping optimize marketing spend allocation.' },
    { capability: 'Seasonal Pattern Detection', desc: 'Identifies weekly, monthly, and annual traffic patterns in your historical data. Produces a seasonality forecast that shows expected traffic ranges for future periods so you can distinguish genuine growth from seasonal variation.' },
    { capability: 'SEO Opportunity Identification', desc: 'Analyzes organic search traffic by landing page and identifies pages that receive high organic traffic but have high bounce rates — indicating keyword-intent mismatch. Surfaces pages losing organic traffic month-over-month as early signals for content freshness issues.' },
  ],
  troubleshooting: [
    { issue: 'No data appearing after installing the script', solution: 'Open the browser console and check for JavaScript errors. The most common cause is a Content Security Policy (CSP) blocking the script from loading or the sendBeacon from firing to the collection endpoint. Add echo-web-analytics.bmcii1976.workers.dev to both script-src and connect-src in your CSP header.' },
    { issue: 'SPA page changes are not being tracked', solution: 'Verify the script loads before your SPA framework\'s router initializes. If the script loads after the first navigation event, it will miss that event. In Next.js App Router, placing the script in the root layout with strategy="afterInteractive" is correct. For hash routing, ensure hash changes are not silently swallowed by a router wrapper.' },
    { issue: 'Visitor count seems too low — I know more people visited', solution: 'localStorage-based visitor IDs are not set when users browse in private/incognito mode. Those sessions are counted as new visitors each time. Additionally, if your site is served over HTTP (not HTTPS), some browsers restrict localStorage access. Ensure your site is HTTPS.' },
    { issue: 'Realtime panel shows zero visitors despite active traffic', solution: 'The realtime panel uses a 5-minute active window. If traffic was more than 5 minutes ago, it will show zero. For testing, load your site in a browser tab and wait up to 30 seconds — the hit is batched and sent via sendBeacon on the next flush interval (every 5 seconds).' },
    { issue: 'Bot traffic is inflating my metrics', solution: 'Echo Web Analytics filters known bots automatically, but novel or obfuscated bots may slip through. Enable strict bot filtering in Site Settings → Bot Filtering. This applies additional heuristics (mouse movement detection, interaction timing) but may slightly reduce legitimate visitor counts from headless testing tools.' },
  ],
  faq: [
    { q: 'Is Echo Web Analytics GDPR compliant?', a: 'Yes. Because no cookies are used and no personally identifiable information is stored (IP addresses are hashed with a daily rotating salt, making them non-reversible), Echo Web Analytics does not require a cookie consent banner under GDPR or ePrivacy Directive. However, you should still mention analytics collection in your privacy policy.' },
    { q: 'How accurate is the visitor count compared to Google Analytics?', a: 'Echo Web Analytics typically shows 10–20% more unique visitors than Google Analytics because it counts every localStorage-identified visitor while GA undercounts due to ad blocker blocking and consent banner rejections. Cookie-free tracking has approximately 2–5% higher reach than cookie-based tracking.' },
    { q: 'Does the script work if localStorage is blocked?', a: 'If localStorage is blocked (private browsing in Safari, Firefox with strict tracking protection, or browser extensions), the script falls back to session-only tracking. Each tab session generates a fresh visitor ID. These sessions are counted as unique visitors but cannot be connected across tabs or page reloads.' },
    { q: 'Can I track multiple domains with one account?', a: 'Yes. Each domain is a separate Site with its own Site ID and script embed code. Your account can manage unlimited sites. Cross-domain tracking (attributing a visitor\'s journey across two of your domains) requires installing the script on both and configuring cross-site linking in Advanced Settings.' },
    { q: 'How long is raw event data retained?', a: 'Raw events are retained for 7 days. After daily aggregation runs, raw events older than 7 days are deleted and only the aggregated summary rows are kept. Aggregated data is retained indefinitely. If you need access to raw events for debugging, download them via the Events export within 7 days.' },
    { q: 'Can I self-host Echo Web Analytics?', a: 'Echo Web Analytics runs entirely on Cloudflare Workers and D1, making it deployable to any Cloudflare account. The worker source code is available via the Workers marketplace. Self-hosted deployments have no data sharing with Echo Prime Tech — your analytics data stays entirely in your own Cloudflare account.' },
  ],
}

export default function WebAnalyticsDocsPage() {
  return <ProductDoc {...data} />
}
