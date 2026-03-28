'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Link Shortener',
  tagline: 'Sub-millisecond KV-cached redirects with click analytics, custom domains, and bulk operations',
  accent: '#3b82f6',
  productUrl: '/link-shortener',
  workerUrl: 'https://echo-link-shortener.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Link Shortener is a high-performance URL shortening platform built on Cloudflare Workers and KV, delivering sub-millisecond redirect latency from 300+ edge locations worldwide. Every redirect is served from KV cache — the D1 database is only hit for first-time cache misses and analytics writes, meaning your links never slow down under traffic spikes.',
    'The platform supports both custom slugs and auto-generated 6-character alphanumeric codes. Click analytics capture device type, browser, operating system, country, city, referrer, and UTM parameters for every visit. Unique click detection uses salted IP hashing to distinguish individual visitors from repeated visits without storing PII. Password protection, expiration dates, maximum click limits, UTM auto-append, and Open Graph overrides give marketers full control over link behavior.',
    'Bulk operations allow creating up to 100 links in a single API call with per-link configuration. QR code generation produces clean SVG files for any link on demand. Custom domain support maps your own branded short domain to the service with zero additional infrastructure. Eight D1 tables and 50+ endpoints cover every aspect of link lifecycle management, from creation to archival to analytics export.',
  ],
  gettingStarted: [
    { step: 1, title: 'Get Your API Key', desc: 'Sign up at echo-ept.com/link-shortener. Your API key is displayed in Settings → API Keys. All write operations require the X-Echo-API-Key header. Redirect serving and public stats endpoints are unauthenticated.' },
    { step: 2, title: 'Create Your First Link', desc: 'POST to /links with a destination URL. Optionally provide a custom slug, password, expiration date, or max click count. The response includes the short URL, QR code URL, and full link metadata.' },
    { step: 3, title: 'Configure UTM Auto-Append', desc: 'Set default UTM parameters on your account (utm_source, utm_medium, utm_campaign) in Settings → UTM Defaults. All new links will automatically append these parameters to the destination URL unless overridden per-link.' },
    { step: 4, title: 'Set Up a Custom Domain', desc: 'Add a CNAME record pointing your domain (e.g., go.yourcompany.com) to echo-link-shortener.bmcii1976.workers.dev, then register it in Settings → Custom Domains. All links under your account can use the custom domain as their base.' },
    { step: 5, title: 'Explore Click Analytics', desc: 'Visit the Analytics dashboard for any link to see click volume over time, top countries, device breakdown, referrer sources, and UTM attribution. Export to CSV for integration with your data warehouse or BI tool.' },
  ],
  features: [
    { title: 'Sub-Millisecond KV Redirects', desc: 'Every active link is cached in Cloudflare KV at the edge closest to the visitor. Redirect response times are typically under 5ms globally. Cache entries are invalidated automatically when a link is updated, deleted, or expires.' },
    { title: 'Custom Slugs and Auto-Generation', desc: 'Specify any alphanumeric slug up to 64 characters, or let the system generate a unique 6-character code. Custom slugs are checked for conflicts at creation time. Reserved slugs (health, api, docs) are blocked.' },
    { title: 'Click Analytics', desc: 'Captures geo (country, region, city via Cloudflare headers), device type (mobile/tablet/desktop), browser, OS, referrer URL, and all UTM parameters for every click. Data is stored in D1 and queryable via the analytics API.' },
    { title: 'Unique Click Detection', desc: 'Unique visitors are identified by a salted SHA-256 hash of the visitor\'s IP address combined with a 24-hour rolling window. The analytics API returns both total clicks and unique clicks for every time interval. Raw IPs are never stored.' },
    { title: 'Password Protection', desc: 'Set a plaintext password on any link. Visitors are redirected to a branded password gate page before being forwarded to the destination. The password is stored as a bcrypt hash and never returned in API responses.' },
    { title: 'Link Expiration', desc: 'Set an expiration date-time (ISO 8601) on any link. After expiration, clicks are redirected to a configurable fallback URL (default: your account\'s 404 page). Expired links are excluded from analytics and marked as Expired in the dashboard.' },
    { title: 'Max Click Limits', desc: 'Cap the total number of clicks a link will serve. Once the limit is reached, subsequent visitors see the expiration fallback. Useful for limited-time offers, beta invite links, or capacity-controlled promotions.' },
    { title: 'UTM Auto-Append', desc: 'Configure account-level UTM defaults that are automatically appended to every destination URL. Per-link UTM overrides take precedence. The system merges UTM parameters cleanly, preserving any parameters already present in the destination URL.' },
    { title: 'Open Graph Override', desc: 'Override the og:title, og:description, and og:image for any link. When the short URL is shared on social media or messaging apps, these values are used instead of the destination page\'s OG tags. Useful for branded share previews.' },
    { title: 'Bulk Create (100/batch)', desc: 'POST to /links/bulk with an array of up to 100 link objects. Each item in the array supports the full per-link configuration. The response returns the created links in the same order, with errors flagged per-item without failing the entire batch.' },
    { title: 'QR Code SVG Generation', desc: 'GET /links/:id/qr returns an SVG QR code for any link. Optional query parameters control size, error correction level (L/M/Q/H), foreground color, background color, and margin. The SVG can be embedded directly in HTML or saved as a file.' },
    { title: 'Custom Domains', desc: 'Map any domain you own to your Echo Link Shortener account with a CNAME record. Links under custom domains redirect with the same sub-millisecond KV performance. Multiple custom domains per account are supported.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/links', desc: 'Create a new short link. Accepts destination, slug (optional), password, expires_at, max_clicks, utm overrides, og overrides', auth: true },
    { method: 'GET', path: '/links', desc: 'List all links for the authenticated account. Supports filtering by status (active/expired/depleted) and pagination via cursor', auth: true },
    { method: 'GET', path: '/links/:id', desc: 'Retrieve full metadata for a single link including click counts, status, password flag, and all configuration', auth: true },
    { method: 'PATCH', path: '/links/:id', desc: 'Update a link\'s destination, password, expiration, max clicks, UTM params, or OG overrides. Cache is invalidated immediately', auth: true },
    { method: 'DELETE', path: '/links/:id', desc: 'Delete a link and remove it from KV cache. Clicks to deleted links return 404. Analytics history is preserved', auth: true },
    { method: 'POST', path: '/links/bulk', desc: 'Bulk create up to 100 links in a single request. Returns all created links with per-item error reporting for conflicts or validation failures', auth: true },
    { method: 'GET', path: '/links/:id/analytics', desc: 'Retrieve click analytics for a link. Query params: start, end (ISO dates), interval (hour/day/week), breakdown (country/device/browser/os/referrer/utm)', auth: true },
    { method: 'GET', path: '/links/:id/qr', desc: 'Generate and return an SVG QR code. Query params: size, ecc, fg_color, bg_color, margin. No auth required — QR generation is public', auth: false },
    { method: 'GET', path: '/:slug', desc: 'The redirect endpoint. Serves from KV cache with 301/302 redirect. Password-protected links redirect to the gate page first. No auth required', auth: false },
    { method: 'GET', path: '/analytics/summary', desc: 'Account-level analytics summary: total links, total clicks, unique clicks, top performing links, and top countries for a given date range', auth: true },
  ],
  userGuide: [
    {
      id: 'creating-links',
      title: 'Creating and Managing Links',
      content: [
        'From the Links dashboard, click "New Link" to open the creation form. Enter the destination URL and an optional custom slug. If you leave the slug blank, a 6-character alphanumeric code is generated automatically. Slug availability is checked in real time as you type.',
        'Expand the Advanced Options section to configure password protection, expiration date, maximum click count, UTM overrides, and Open Graph overrides. These settings can all be changed later by editing the link — updates propagate to KV cache within seconds.',
        'The link list supports bulk operations: select multiple links with checkboxes and use the bulk action menu to delete, export, or change the UTM source for all selected links at once. Use the search bar to filter by slug, destination URL, or tag.',
      ],
    },
    {
      id: 'analytics-guide',
      title: 'Reading Click Analytics',
      content: [
        'Click any link in the dashboard to open its analytics view. The overview chart shows total and unique clicks over the selected date range (default: last 30 days). Switch the interval between hourly, daily, and weekly aggregations using the selector above the chart.',
        'The breakdown panels show the top 10 countries, device types, browsers, operating systems, and referrers. Each row shows the count and percentage of total clicks. Hover over any row to see the exact unique vs. total split for that dimension.',
        'UTM attribution data is shown in its own panel below the breakdowns. Each unique UTM combination (source/medium/campaign/term/content) is listed with its click count. This lets you compare performance across different marketing channels that all point to the same destination.',
      ],
    },
    {
      id: 'custom-domains',
      title: 'Setting Up Custom Domains',
      content: [
        'Navigate to Settings → Custom Domains and click "Add Domain". Enter your branded short domain (e.g., go.acme.com). The system will display the CNAME target to add to your DNS provider: echo-link-shortener.bmcii1976.workers.dev.',
        'After adding the CNAME record, click "Verify" in the dashboard. DNS propagation typically takes 1–5 minutes. Once verified, the domain is activated and all links in your account can use it as the base URL. Existing links using the default domain continue to work — both URLs redirect to the same destination.',
        'SSL certificates for custom domains are provisioned automatically via Cloudflare\'s Universal SSL. No certificate management is required on your end. Certificate renewal is handled automatically before expiration.',
      ],
    },
    {
      id: 'bulk-operations',
      title: 'Bulk Link Creation',
      content: [
        'Use the Bulk Create API endpoint (POST /links/bulk) to create up to 100 links in a single HTTP request. The request body is a JSON array where each element has the same schema as a single link creation request. This is ideal for generating large volumes of unique affiliate links, invite codes, or campaign URLs programmatically.',
        'Errors are reported per-item in the response — if 3 out of 100 links fail due to slug conflicts, the remaining 97 are created successfully and the response includes both the successful results and the per-item error messages for the failures. No transaction rollback occurs; partial success is the default behavior.',
        'For very large batches (thousands of links), split requests into 100-item chunks and send them concurrently. The API supports up to 50 concurrent requests per account without rate limiting.',
      ],
    },
    {
      id: 'password-protection',
      title: 'Password-Protected Links',
      content: [
        'Enable password protection on any link by entering a password in the creation form or by patching an existing link. When a visitor clicks the short URL, they are redirected to a branded password gate page hosted at echo-link-shortener.bmcii1976.workers.dev/gate/:slug.',
        'The gate page displays your account name and link title (if set), a password input field, and a submit button. Correct passwords set a short-lived cookie that allows the visitor to proceed to the destination. Incorrect passwords show an error and increment a failed attempt counter — links can be configured to lock after 5 failed attempts.',
        'Password gate pages are responsive and support dark mode. You can customize the gate page title and description in the link settings to give context about what the link leads to without revealing the destination URL.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Link Performance Prediction', desc: 'Analyzes historical click patterns for your account and predicts expected click volume for new links based on channel, time of day, UTM source, and destination domain. Surfaces links that are underperforming relative to predictions for investigation.' },
    { capability: 'Anomaly Detection', desc: 'Monitors click velocity in real time and alerts when a link receives an abnormal spike (potential bot traffic or viral spread). Flags suspicious traffic patterns based on IP concentration, click interval distribution, and referrer uniformity.' },
    { capability: 'UTM Tag Suggestions', desc: 'Analyzes your existing UTM taxonomy and suggests consistent tag values when creating new links. Catches typos and non-standard values (e.g., "Email" vs "email") that would fragment your analytics data.' },
    { capability: 'Geo Expansion Insights', desc: 'Identifies links that receive significant traffic from countries not targeted in the campaign. Surfaces opportunities to create geo-targeted variants with localized destination URLs for the high-traffic untargeted regions.' },
    { capability: 'Optimal Publish Time', desc: 'Based on the click-time distribution of your past links to similar audiences, recommends the best day and hour to publish new links for maximum first-24-hour engagement.' },
  ],
  troubleshooting: [
    { issue: 'Redirects are returning 404 for active links', solution: 'Check if the link\'s status is Active in the dashboard. If it was recently created, KV propagation takes up to 60 seconds globally. If the link uses a custom domain, verify the CNAME is correctly configured and verified in Settings → Custom Domains.' },
    { issue: 'Click counts in analytics seem lower than expected', solution: 'The analytics endpoint reports unique clicks separately from total clicks. Bot filtering is applied automatically — requests from known bot user agents and Cloudflare\'s bot score > 80 are excluded from analytics counts. Check the Raw Clicks toggle in the analytics panel to see unfiltered counts.' },
    { issue: 'Bulk create returning 400 for some items', solution: 'Each item in the bulk array is validated independently. The error response includes a per-item errors array with the index and reason for each failure. Common causes are slug conflicts (another link already uses that slug) and invalid destination URLs (must be a valid https:// URL).' },
    { issue: 'UTM parameters are not appearing in destination URL', solution: 'Verify the destination URL does not already contain a query string with the same UTM keys — the system preserves existing parameters and only appends the ones not already present. If the destination URL uses a fragment (#), UTM parameters are appended before the fragment.' },
    { issue: 'QR code SVG is not scanning correctly', solution: 'Increase the error correction level to Q or H using the ecc query parameter. Low error correction (L) is susceptible to rendering artifacts at small sizes. Also verify the QR code is being displayed at a minimum of 150×150 pixels and there is sufficient contrast between the foreground and background colors.' },
  ],
  faq: [
    { q: 'How fast are the redirects?', a: 'Redirect latency is typically 2–8ms for cached links because the lookup is served entirely from Cloudflare KV at the edge node closest to the visitor. The D1 database is only queried on the first request after a link is created or updated, which takes 20–50ms. After that, the response is cached in KV for 24 hours or until the link is modified.' },
    { q: 'Are raw IP addresses ever stored?', a: 'No. IP addresses are immediately hashed using SHA-256 with a daily rotating salt before storage. The salt changes every 24 hours, making it impossible to correlate visits across days. No raw IP address ever touches the database.' },
    { q: 'What happens when a link reaches its max click limit?', a: 'Subsequent visitors are redirected to the link\'s configured fallback URL. If no fallback is set, they see a generic "This link has expired" page. The link\'s status changes to Depleted in the dashboard. You can reset the click counter or remove the limit to re-activate the link.' },
    { q: 'Can I use the same slug on different custom domains?', a: 'Yes. Slugs are scoped to a domain, not your account globally. The same slug "promo" can exist on go.brand-a.com and go.brand-b.com as two separate links with different destinations. Both are cached independently in KV.' },
    { q: 'How are OG tags used for social previews?', a: 'When a short link is pasted into Slack, Twitter, iMessage, or any platform that fetches link previews, the platform\'s crawler hits the short URL. Echo Link Shortener detects the crawler\'s user agent and returns an HTML page containing the OG meta tags instead of issuing a redirect. Real user visits always get an instant redirect.' },
    { q: 'Is there a rate limit on link creation?', a: 'Free accounts can create 1,000 links per month and 10 links per minute. Pro accounts have no monthly limit and a rate limit of 100 links per minute. The bulk endpoint counts against the same rate limit: a batch of 50 links consumes 50 of the per-minute quota.' },
  ],
}

export default function LinkShortenerDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/link-shortener' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
