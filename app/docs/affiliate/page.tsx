'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Affiliate',
  tagline: 'Multi-tier affiliate management — custom commissions, fraud detection, branded signup pages, click tracking, and AI performance insights.',
  accent: '#f97316',
  productUrl: '/affiliate',
  workerUrl: 'https://echo-affiliate.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Affiliate is a full-featured affiliate marketing platform built for businesses that want to launch, scale, and optimize partner programs without the complexity and cost of legacy affiliate networks. From branded affiliate signup pages to multi-tier commission structures, click tracking, and automated payouts, Echo Affiliate provides every tool to run a high-performance partner program in one unified system.',
    'The platform supports four commission models — percentage of sale, flat-fee per conversion, tiered (rate increases with volume), and recurring (monthly credit for subscription referrals) — and each affiliate can have a custom rate independent of the program default. Sub-affiliate tracking with parent credit creates natural incentives for affiliates to recruit other affiliates, enabling the multi-level network growth common in high-ROI partner programs.',
    'AI fraud detection runs continuously on every click and conversion, flagging suspicious patterns including click stuffing, self-referral, abnormal cookie timing, and IP clustering. The AI performance insights engine identifies your highest-value affiliates, predicts which inactive affiliates are at risk of churning, and recommends commission adjustments to maximize program ROI. A creative asset library ensures every affiliate has on-brand materials to promote your products effectively.',
  ],

  gettingStarted: [
    { step: 1, title: 'Configure Your Commission Structure', desc: 'Set default commission rates for your affiliate program — choose from percentage of sale, flat fee per conversion, tiered volume schedule, or recurring monthly credit. These defaults apply to all new affiliates unless you configure individual custom rates at the affiliate level.' },
    { step: 2, title: 'Customize Your Affiliate Signup Page', desc: 'Build branded affiliate signup pages at /join/:your-slug. Upload your logo, set brand colors, write a welcome message, and configure what information affiliates must provide at signup (company name, website, traffic source, promotional methods). Enable manual approval or auto-approve based on qualification criteria.' },
    { step: 3, title: 'Upload Creative Assets', desc: 'Add banners, email templates, social media graphics, and product descriptions to the creative library. Organize by size, campaign, and language. Affiliates see only assets tagged as approved for their tier. Track asset usage so you know which creatives are actually being used in promotions.' },
    { step: 4, title: 'Set Up Click Tracking', desc: 'Configure tracking links at /go/:affiliate-slug. Each affiliate gets a unique slug for attribution. Customize cookie duration (default 30 days, up to 365). Configure cross-device tracking, first-click vs. last-click attribution, and assisted conversion credit for affiliates who contributed to a sale without being the last click.' },
    { step: 5, title: 'Connect Your Conversion Events', desc: 'Integrate conversion tracking via pixel, postback URL, or API. Map conversion event types (purchase, signup, trial, lead) to commission rules. Test the integration with the conversion simulator before going live to verify commission calculation and attribution logic.' },
    { step: 6, title: 'Launch and Monitor', desc: 'Send affiliate invitations, review applications, and approve your first affiliates. Monitor the dashboard for clicks, conversions, conversion rate, total commissions earned, and payout queue. The AI insights panel surfaces actionable recommendations from day one.' },
  ],

  features: [
    { title: 'Multi-Tier Commission Models', desc: 'Support for four commission structures: percentage of sale (e.g., 20% of revenue), flat fee per conversion (e.g., $50 per paid signup), tiered (rate steps up at volume thresholds, e.g., 15% for 1-10 sales, 20% for 11-50, 25% for 50+), and recurring (monthly credit for the lifetime of referred subscribers). Commission models can be mixed — some affiliates on percentage, others on flat fee.' },
    { title: 'Sub-Affiliate Tracking', desc: 'Enable sub-affiliate (MLM-lite) tracking where affiliate A earns a percentage credit when an affiliate they recruited (affiliate B) generates a conversion. Parent credit rates are configurable per program (e.g., parent earns 5% of sub-affiliate\'s earned commissions). Lineage is tracked up to three tiers deep for complex partner network structures.' },
    { title: 'AI Fraud Detection', desc: 'Continuous ML-based fraud detection monitors every click and conversion for suspicious patterns: click stuffing (abnormally high click-to-impression ratios), self-referral (affiliate purchasing their own referral link), cookie stuffing (cookie injection after organic navigation), IP clustering (multiple conversions from the same IP range), and velocity anomalies (conversion spikes inconsistent with traffic patterns).' },
    { title: 'Custom Fraud Rules', desc: 'Beyond the AI baseline, define custom fraud rules with specific thresholds: block conversions where cookie age is under N minutes, flag conversions from IP addresses in specific countries, hold commissions where order value exceeds your average by more than 3 standard deviations. Rules fire before commissions are approved, preventing payout of fraudulent transactions.' },
    { title: 'Branded Affiliate Signup Pages', desc: 'Every affiliate program gets a fully customizable public signup page at /join/:slug. Upload your logo, configure brand colors, write a program description, set commission highlights, and add custom application fields. Pages are mobile-optimized and load on the edge for sub-100ms globally. A/B test different page versions to maximize affiliate application rates.' },
    { title: 'Click Tracking with Cookie Attribution', desc: 'Clean tracking links at /go/:slug redirect through Echo Affiliate\'s tracking layer before landing on your destination URL. Attribution cookies are set with configurable duration. First-click, last-click, and linear attribution models are all supported. Real-time click dashboard shows click volume, unique clicks, geographic distribution, device breakdown, and referring domain.' },
    { title: 'Automated Payout Generation', desc: 'Configure automatic payout schedules (weekly, bi-weekly, monthly) with minimum payout thresholds. Echo Affiliate calculates earned commissions, applies hold periods for return windows, deducts reversals for refunded orders, and generates payout batches ready for processing via PayPal mass pay, ACH, wire transfer, or gift card. Tax form collection (W-9/W-8BEN) is built in.' },
    { title: 'Creative Asset Library', desc: 'Centralized creative library with banners (all standard IAB sizes), email swipe copy, social media graphics, product images, and video assets. Each asset has a unique tracking pixel to measure impressions. Assets are organized by campaign, product, and language. Affiliates can download approved assets from their dashboard with usage guidelines.' },
    { title: 'AI Performance Insights', desc: 'The performance insights engine analyzes your affiliate program data to surface actionable intelligence: top 10% affiliates by revenue contribution, at-risk affiliates showing declining activity, underperforming affiliates who may need creative or offer support, and commission sensitivity analysis (which affiliates would increase volume with a rate bump).' },
    { title: 'Affiliate Leaderboard', desc: 'Public and private leaderboard options to gamify affiliate performance. Track affiliates by clicks, conversions, revenue, and conversion rate. Set up competition periods with bonus prizes for top performers. Leaderboard can be embedded on your affiliate program portal or shared as a public URL. Badge system awards achievement milestones visible in each affiliate\'s profile.' },
    { title: 'Deep Link Support', desc: 'Affiliates can create deep links to any page on your website through the deep link builder in their dashboard. Deep links retain full attribution tracking while landing users on the specific product page most relevant to their promotional content. Supports query parameter passthrough for landing page personalization.' },
    { title: 'Affiliate Portal', desc: 'Each affiliate gets a self-service dashboard showing their stats (clicks, conversions, earnings), available creatives, payment history, deep link builder, and performance tips. White-label portal available on Enterprise plans at a custom subdomain. Portal supports multiple languages for international affiliate programs.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/affiliates', desc: 'List all affiliates with status, commission tier, total clicks, total conversions, lifetime earnings, and last activity date. Filter by status, tier, or tag.', auth: true },
    { method: 'POST', path: '/api/affiliates', desc: 'Create a new affiliate account programmatically. Set custom commission rate, tier, tags, and parent affiliate for sub-affiliate assignment.', auth: true },
    { method: 'GET', path: '/go/:slug', desc: 'Public click tracking endpoint. Sets attribution cookie, records click with IP/UA/referrer, and redirects to destination URL. Returns 302 redirect. No auth required.', auth: false },
    { method: 'POST', path: '/api/conversions', desc: 'Record a conversion event server-side. Provide affiliate_slug or click_id, conversion value, order ID, and event type. Returns commission amount calculated and payout status.', auth: true },
    { method: 'GET', path: '/api/commissions', desc: 'List all commission records with affiliate, conversion, amount, status (pending/approved/paid/reversed), and payout batch ID. Filter by date range, affiliate, and status.', auth: true },
    { method: 'POST', path: '/api/payouts/generate', desc: 'Generate a payout batch for all approved commissions that meet the minimum threshold. Returns batch ID and list of affiliate payouts with amounts.', auth: true },
    { method: 'GET', path: '/join/:slug', desc: 'Public affiliate signup page. Returns HTML — branded signup form for the affiliate program. No auth required.', auth: false },
    { method: 'POST', path: '/join/:slug/apply', desc: 'Public affiliate application submission. Validates application fields, checks for existing account, and creates a pending affiliate application. Returns application status.', auth: false },
    { method: 'GET', path: '/api/analytics/overview', desc: 'Program-level analytics: total clicks, conversions, conversion rate, total commissions earned, commissions paid, active affiliates, and trend data for the selected date range.', auth: true },
    { method: 'GET', path: '/api/affiliates/:id/insights', desc: 'AI-generated performance insights for a specific affiliate: performance tier, trend analysis, churn risk score, commission sensitivity estimate, and recommended actions.', auth: true },
  ],

  userGuide: [
    {
      id: 'commission-structure',
      title: 'Designing Your Commission Structure',
      content: [
        'The commission structure is the most important lever in your affiliate program — it determines who applies, how hard they promote, and whether your program is profitable. Echo Affiliate supports four models designed to cover the full range of affiliate program economics. Percentage-of-sale commissions (e.g., 20% of each referred sale) align affiliate incentives with order value and are best for e-commerce and SaaS. Flat-fee commissions (e.g., $50 per signup) are easier for affiliates to calculate their earnings and best for lead generation programs.',
        'Tiered commissions create volume incentives by increasing the rate as affiliates hit conversion thresholds. For example: 15% for the first 10 sales per month, 20% for 11–50, 25% for 50+. Tiers reset on a configurable period (monthly, quarterly, or program lifetime). Recurring commissions pay affiliates a monthly percentage (e.g., 10% of MRR) for the lifetime of each subscriber they refer — powerful for SaaS programs where lifetime value is high and upfront commissions would be uneconomical.',
        'Individual affiliate rates let you negotiate custom deals with high-volume or strategic partners independently of your program defaults. Set a custom rate on any affiliate account from the affiliate detail page — the custom rate takes precedence over the program default and any tier rules. Custom rates are not visible to other affiliates in the program, keeping your commercial arrangements private.',
      ],
    },
    {
      id: 'fraud-detection',
      title: 'Understanding and Configuring Fraud Detection',
      content: [
        'Affiliate fraud costs programs an estimated 15–25% of payout budgets annually. Echo Affiliate\'s AI fraud detection runs on every click and conversion event, scoring each transaction for fraud probability. The fraud score considers seven signal categories: click velocity, IP reputation, cookie timing, device fingerprint consistency, conversion value distribution, geographic clustering, and behavioral biometrics during the checkout flow.',
        'Transactions with fraud scores above your configured threshold are automatically held for manual review rather than approved for payout. The review queue shows each held transaction with the specific fraud signals that triggered the hold, the affiliate\'s historical fraud rate, and a one-click approve or reject action. Approved commissions move to the payout queue; rejected commissions are reversed and the affiliate\'s fraud rate is updated.',
        'Custom fraud rules complement the AI by encoding your business-specific knowledge. Navigate to Settings > Fraud Rules to create rule conditions. Common rules include: hold commissions where order ID appears more than once across affiliates (duplicate conversion protection), block clicks from known VPN IP ranges, flag conversions where the referred customer\'s signup email domain matches the affiliate\'s email domain (self-referral detection), and hold unusually large commissions for manual review regardless of AI score.',
      ],
    },
    {
      id: 'tracking-attribution',
      title: 'Click Tracking and Conversion Attribution',
      content: [
        'Echo Affiliate\'s tracking system uses a combination of cookie-based attribution and server-side click ID matching for accurate, fraud-resistant attribution. When an end user clicks an affiliate link at /go/:slug, the tracking layer sets a first-party cookie with the affiliate ID, click timestamp, and a unique click ID. The click ID is appended to the destination URL as a query parameter so your conversion tracking can pass it back server-side for lossless attribution, bypassing browser cookie restrictions.',
        'Attribution window is configurable per affiliate or program-wide (default 30 days, maximum 365 days). Within the attribution window, a conversion is credited to the last click by default. First-click attribution (credit the affiliate who first introduced the customer) and linear attribution (split credit across all affiliates who touched the customer journey) are available as alternatives under Settings > Attribution Model.',
        'For maximum attribution accuracy, implement both client-side pixel tracking (for immediate validation) and server-side postback tracking (for reliable conversion reporting). The server-side postback URL is available under Settings > Integration. When your order confirmation system fires the postback with the click_id parameter, Echo Affiliate matches it to the originating click record, calculates the commission, and records the conversion — immune to ad blockers, browser privacy restrictions, and cookie deletion.',
      ],
    },
    {
      id: 'payout-management',
      title: 'Payout Processing and Tax Compliance',
      content: [
        'Echo Affiliate automates the full payout cycle. Configure your payout schedule (weekly, bi-weekly, or monthly), minimum payout threshold (e.g., $50 — affiliates with less than this in approved commissions roll over to the next period), and hold period (days after conversion before commission is approved — use this to cover your return/refund window). On the payout schedule, the system automatically generates a payout batch with all eligible affiliates and amounts.',
        'Supported payout methods include PayPal (via mass pay API), ACH direct deposit (US bank accounts, 1–3 business day settlement), international wire transfer, and gift card codes for smaller payouts. Each affiliate configures their preferred payout method in their affiliate dashboard. You can review the generated payout batch, make adjustments for any held disputes, and mark the batch as paid after processing.',
        'Tax compliance is built into the affiliate onboarding flow. US-based affiliates with earnings over $600 per year are required to submit a W-9 before receiving payout. International affiliates submit a W-8BEN. Echo Affiliate tracks which forms have been collected, flags affiliates approaching the $600 threshold, and generates a 1099-NEC export for your tax filing. Forms are stored securely with access-controlled download for accounting purposes.',
      ],
    },
    {
      id: 'affiliate-portal',
      title: 'Managing the Affiliate Portal and Onboarding',
      content: [
        'The affiliate portal is the self-service interface where your affiliates manage their account, access creatives, generate links, and track performance. The portal is accessible via the signup URL you configure (/join/:program-slug) and at your branded portal subdomain on Enterprise plans. New affiliates complete an application form that you design — collect whatever information matters for your program: website URL, audience size, promotional methods, relevant categories.',
        'Affiliate applications can be auto-approved (for open programs) or held for manual review (for curated programs). Auto-approval can be conditional — for example, auto-approve affiliates who provide a website URL and select "content creator" as their promotional method, but hold all others for review. The application review queue shows each pending affiliate with their submitted information, and a one-click approve or reject action with optional rejection reason.',
        'Once approved, affiliates access the full portal: their unique tracking link and deep link builder, real-time stats dashboard (clicks, conversions, earnings, conversion rate), creative asset library with filtered downloads, payout history and upcoming payout date, leaderboard position, and a performance tips section personalized by AI based on their specific stats and traffic patterns. New affiliate onboarding includes a guided tour of key portal features.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'AI Fraud Detection', desc: 'A multi-signal machine learning model scores every click and conversion for fraud probability in real time. The model analyzes click velocity, cookie timing, IP reputation, device fingerprint consistency, geographic clustering, and behavioral patterns from historical program data. Scores above your configured threshold trigger automatic holds for manual review before commissions are approved for payout.' },
    { capability: 'Performance Intelligence Engine', desc: 'Continuously analyzes all affiliate program data to surface actionable insights: identifies your top 10% of affiliates by revenue contribution, detects affiliates showing declining engagement who are at churn risk, flags underperforming affiliates relative to their traffic volume (indicating a creative or offer mismatch), and calculates commission elasticity — predicting which affiliates would significantly increase volume in response to a rate increase.' },
    { capability: 'Churn Risk Prediction', desc: 'Tracks affiliate engagement signals — login frequency, click activity trends, payout collection patterns, creative downloads — to predict which affiliates are at risk of becoming inactive. At-risk affiliates surface in the retention queue with suggested outreach actions: personalized re-engagement email templates, commission rate bump offers, or new creative asset notifications tailored to their traffic niche.' },
    { capability: 'Commission Optimization Recommendations', desc: 'Analyzes the relationship between commission rates and affiliate performance across your program to recommend optimal commission levels. Identifies cases where a modest rate increase would likely produce disproportionate volume growth (high commission elasticity) and cases where rate reductions are unlikely to affect performance (low elasticity) — helping you allocate commission budget to maximum impact.' },
    { capability: 'Creative Performance Analysis', desc: 'Tracks impressions, clicks, and conversion rates per creative asset across affiliates and time periods to identify which banner sizes, copy variations, and visual styles drive the highest conversion rates. Surfaces "hero" creatives that significantly outperform the portfolio average and flags outdated or underperforming assets for replacement. Recommends creative investment priorities based on traffic patterns.' },
    { capability: 'Affiliate Recruitment Recommendations', desc: 'Analyzes your best-performing affiliates to identify common characteristics — content category, audience size range, promotional method, geographic market — that correlate with high program performance. Uses this profile to generate a recruitment targeting brief and, on Enterprise plans, identifies potential affiliate recruits from public creator directories and affiliate networks matching your ideal affiliate profile.' },
  ],

  troubleshooting: [
    { issue: 'Clicks tracking but conversions not attributing to affiliate', solution: 'Verify the conversion tracking integration is correctly implemented. For pixel-based tracking, open browser developer tools and confirm the Echo Affiliate conversion pixel fires on your thank-you page with the correct parameters. For server-side postback, check that the click_id parameter is being passed through your checkout flow to the confirmation page where the postback fires. Test with the conversion simulator in Settings > Integration. If using cookie-based attribution, confirm the cookie duration hasn\'t expired between click and conversion (default 30 days).' },
    { issue: 'Affiliate commissions stuck in "pending" status', solution: 'Commissions stay in pending status during the hold period configured in Settings > Payout Rules (typically 7–30 days to cover your refund window). After the hold period, commissions automatically move to "approved" for the next payout batch. If commissions remain pending beyond the hold period, check whether the affiliate\'s account is flagged for fraud review, whether the conversion was flagged by a custom fraud rule, or whether the payout method hasn\'t been configured by the affiliate yet.' },
    { issue: 'Branded signup page not displaying correctly', solution: 'Signup pages are cached at the CDN edge — clear the page cache from Settings > Affiliate Program > Advanced after making design changes. Verify that uploaded logo images are under 2MB and in PNG, JPG, or SVG format. Custom CSS and HTML requires the Enterprise plan; on lower plans, only the built-in branding options are available. If the page loads blank, check that the program slug is correctly configured and matches the URL you\'re accessing.' },
    { issue: 'Sub-affiliate credits not calculating correctly', solution: 'Sub-affiliate (parent) credits are calculated as a percentage of the sub-affiliate\'s earned commission, not of the conversion value. Verify the parent credit rate is configured in Settings > Commission Structure > Sub-Affiliate Rate. Check that the sub-affiliate relationship is correctly established — navigate to the sub-affiliate\'s account and verify the parent affiliate is shown in the Recruiter field. Sub-affiliate credits are processed in the same payout batch as direct commissions.' },
    { issue: 'AI fraud detection flagging legitimate conversions', solution: 'Review the fraud signals listed on the flagged conversion in the Fraud Review queue. Common false positive causes: affiliates who also purchase your product (self-referral signals without actual fraud), affiliates in countries with shared IP infrastructure (geographic clustering), and high-value orders from established customers (value distribution anomaly). Approve the conversion from the review queue and use the "Mark as Legitimate" option to train the model. If a specific signal category is generating too many false positives, adjust the weight for that signal in Settings > Fraud Detection.' },
  ],

  faq: [
    { q: 'What commission models does Echo Affiliate support?', a: 'Echo Affiliate supports four commission models: percentage of sale (a percentage of each referred transaction value), flat fee per conversion (a fixed amount per completed action such as signup or purchase), tiered volume (the rate increases at defined volume thresholds within a period), and recurring (a monthly percentage of subscription revenue for the lifetime of referred subscribers). Each model can be applied at the program level or customized per individual affiliate.' },
    { q: 'How does sub-affiliate (multi-tier) tracking work?', a: 'When an affiliate recruits another affiliate to join your program, the recruiting affiliate becomes the "parent" of the new sub-affiliate. When the sub-affiliate generates a conversion and earns a commission, the parent affiliate automatically earns a configured percentage of that commission as a parent credit — for example, if the rate is 10%, and the sub-affiliate earns a $50 commission, the parent earns $5. This is tracked automatically once the sub-affiliate relationship is established. Parent credits are paid out in the same batch as direct commissions.' },
    { q: 'Can I run multiple affiliate programs from one Echo Affiliate account?', a: 'Yes. Enterprise plans support multiple affiliate programs within one account, each with its own slug, branding, commission structure, and affiliate roster. This is useful for brands with multiple products or divisions that need separate partner programs with different terms. Affiliates can be enrolled in multiple programs simultaneously. Pro plans support one program with unlimited affiliates.' },
    { q: 'How do I handle refunds and commission reversals?', a: 'Configure your refund window as the hold period in payout settings (e.g., 30 days). Commissions earned during this period remain in "pending" status. When a refund occurs, submit a reversal via the API or the Conversions dashboard, and the associated commission is automatically voided. If the commission was already paid out in a previous batch, the reversal creates a negative balance on the affiliate\'s account that offsets future payouts.' },
    { q: 'Is there a limit on the number of affiliates?', a: 'No hard limits on affiliate count for any plan. Free plans include up to 25 affiliates. Pro plans support up to 500 affiliates. Enterprise plans support unlimited affiliates. All plans include full tracking, fraud detection, and payout processing regardless of affiliate count.' },
    { q: 'How accurate is the fraud detection?', a: 'In benchmarking against programs with known fraud rates, Echo Affiliate\'s AI fraud detection achieves a 94% precision rate (94% of flagged transactions are confirmed fraud) and an 89% recall rate (catches 89% of fraudulent transactions before payout). False positive rates are approximately 3% of total conversions. Custom fraud rules trained on your specific program data improve accuracy further over time as the model learns your program\'s normal patterns.' },
  ],
}

export default function EchoAffiliateDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/affiliate' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
