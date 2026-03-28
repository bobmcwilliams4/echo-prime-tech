'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Revenue Engine',
  tagline: 'AI-powered revenue optimization — pricing intelligence, conversion tracking, subscription analytics, and churn prediction.',
  accent: '#16a34a',
  productUrl: '/revenue-engine',
  workerUrl: 'https://echo-revenue-engine.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Revenue Engine is a comprehensive revenue intelligence platform that tracks every dollar from acquisition through retention. It combines pricing optimization, conversion funnel analysis, subscription lifecycle management, and AI-powered churn prediction into one unified system.',
    'The engine analyzes revenue patterns across all your products and customer segments. It identifies pricing opportunities (underpriced features, tier migration triggers), flags at-risk subscribers before they churn, and recommends upsell strategies based on usage patterns.',
    'Built for SaaS businesses and subscription-based products, the Revenue Engine integrates with Echo CRM, Invoice, and Analytics for a complete revenue operations stack. Every recommendation is backed by data from your actual customer behavior — not industry averages.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Revenue Sources', desc: 'Integrate your payment providers (Stripe, PayPal, manual invoicing). The engine automatically syncs transactions, subscriptions, and customer data.' },
    { step: 2, title: 'Define Product Tiers', desc: 'Set up your pricing tiers with features, limits, and price points. The engine tracks which features drive upgrades and which cause downgrades.' },
    { step: 3, title: 'Configure Funnels', desc: 'Define your conversion funnels from trial signup through paid conversion and renewal. Track drop-off points and conversion rates at each stage.' },
    { step: 4, title: 'Set Health Thresholds', desc: 'Configure revenue health metrics: target MRR growth, acceptable churn rate, minimum LTV/CAC ratio, and conversion rate benchmarks.' },
    { step: 5, title: 'Activate AI Insights', desc: 'Enable AI analysis for churn prediction, pricing recommendations, and upsell identification. The engine starts generating actionable insights after 30 days of data.' },
  ],

  features: [
    { title: 'MRR/ARR Tracking', desc: 'Real-time Monthly and Annual Recurring Revenue with breakdown by plan, segment, and cohort. Track net new, expansion, contraction, and churned MRR separately.' },
    { title: 'Churn Analysis', desc: 'Customer and revenue churn rates with cohort analysis. Identify churn patterns by plan, tenure, usage level, and customer segment.' },
    { title: 'Conversion Funnels', desc: 'Multi-stage funnel tracking from lead to trial to paid. Drop-off analysis at each stage with segment-level breakdowns.' },
    { title: 'LTV/CAC Metrics', desc: 'Customer Lifetime Value and Acquisition Cost tracking per channel and segment. LTV/CAC ratio health scoring with trend analysis.' },
    { title: 'Pricing Intelligence', desc: 'Feature usage analysis reveals which features drive value. Identifies underpriced tiers, migration triggers, and price sensitivity thresholds.' },
    { title: 'Subscription Lifecycle', desc: 'Track every subscription event: creation, upgrade, downgrade, pause, cancel, reactivation. Full lifecycle analytics per customer.' },
    { title: 'Revenue Forecasting', desc: 'AI-powered revenue projections based on historical trends, pipeline data, and seasonal patterns. Scenario modeling for pricing changes.' },
    { title: 'Segment Analysis', desc: 'Break down all metrics by customer segment: industry, company size, geography, acquisition channel, and custom attributes.' },
    { title: 'Expansion Revenue', desc: 'Track and optimize expansion revenue from upsells, cross-sells, and seat additions. Identify expansion-ready accounts.' },
    { title: 'Executive Dashboard', desc: 'Board-ready revenue dashboard with MRR waterfall, churn trends, cohort retention curves, and key SaaS metrics at a glance.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/mrr', desc: 'Current MRR with breakdown by component (new, expansion, contraction, churn). Historical MRR data by period.', auth: true },
    { method: 'GET', path: '/api/churn', desc: 'Churn rates (customer and revenue) with cohort analysis and segment breakdowns.', auth: true },
    { method: 'GET', path: '/api/funnels', desc: 'Conversion funnel data with stage-by-stage conversion rates and drop-off analysis.', auth: true },
    { method: 'GET', path: '/api/ltv', desc: 'Customer Lifetime Value calculations by segment with LTV/CAC ratios.', auth: true },
    { method: 'GET', path: '/api/forecast', desc: 'Revenue forecast for the next 3/6/12 months based on current trends and pipeline.', auth: true },
    { method: 'GET', path: '/api/at-risk', desc: 'List of customers predicted to churn within 30/60/90 days with risk scores and contributing factors.', auth: true },
    { method: 'POST', path: '/api/events', desc: 'Ingest subscription events (created, upgraded, downgraded, cancelled, reactivated).', auth: true },
    { method: 'GET', path: '/api/dashboard', desc: 'Executive dashboard data: MRR waterfall, key metrics, trends, and alerts.', auth: true },
  ],

  userGuide: [
    {
      title: 'Understanding MRR Waterfall',
      id: 'mrr-waterfall',
      content: [
        'The MRR waterfall breaks monthly recurring revenue into components: New MRR (first-time subscribers), Expansion MRR (upgrades and seat additions), Contraction MRR (downgrades), and Churned MRR (cancellations).',
        'Net New MRR = New + Expansion - Contraction - Churned. A healthy SaaS business maintains positive Net New MRR month-over-month.',
        'Track the ratio of Expansion to Churned MRR. When expansion exceeds churn (net negative churn), you have a powerful growth engine — existing customers generate more revenue than you lose from cancellations.',
      ],
    },
    {
      title: 'Churn Prevention',
      id: 'churn-prevention',
      content: [
        'The AI churn prediction model analyzes usage patterns, support interactions, payment history, and engagement metrics to identify at-risk customers 30-60 days before they churn.',
        'Each at-risk customer gets a risk score (0-100) with specific contributing factors: declining usage, late payments, support escalations, feature adoption gaps, or competitor mentions.',
        'Use the at-risk list to trigger proactive retention campaigns: personal outreach, feature education, temporary discounts, or plan adjustments. Early intervention reduces churn by 25-40% on average.',
      ],
    },
    {
      title: 'Pricing Optimization',
      id: 'pricing',
      content: [
        'Feature usage analysis shows which features customers actually use at each tier. If 80% of Basic users need a Pro feature, that feature is mispriced — either include it in Basic or make it the primary upgrade trigger.',
        'Price sensitivity analysis examines upgrade and downgrade patterns around price changes. It identifies the price thresholds where conversion drops significantly.',
        'A/B test pricing changes with the scenario modeling tool before implementing them. Forecast the revenue impact of price increases, new tiers, or feature repackaging.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Churn Prediction', desc: 'Machine learning model trained on your customer data predicts churn probability 30-60 days in advance. Identifies specific risk factors for each at-risk account.' },
    { capability: 'Revenue Forecasting', desc: 'Projects future MRR based on current growth rates, seasonal patterns, pipeline data, and market conditions. Provides confidence intervals and scenario analysis.' },
    { capability: 'Pricing Recommendations', desc: 'Analyzes feature usage, willingness-to-pay signals, and competitive positioning to recommend optimal pricing structures.' },
    { capability: 'Expansion Identification', desc: 'Identifies accounts ready for upsell based on usage patterns, growth signals, and engagement metrics. Ranks by expansion potential and urgency.' },
  ],

  troubleshooting: [
    { issue: 'MRR numbers don\'t match billing system', solution: 'Verify all subscription events are synced. Check for timezone mismatches between your billing system and the Revenue Engine. Ensure trial and free-tier subscriptions are excluded from MRR calculations. Run the reconciliation report to identify specific discrepancies.' },
    { issue: 'Churn predictions seem inaccurate', solution: 'The model needs at least 90 days of data and 50+ churn events to generate reliable predictions. Check that usage tracking is implemented correctly — missing usage data degrades prediction accuracy. Review the feature weights to ensure they align with your product.' },
    { issue: 'Funnel conversion rates unexpectedly low', solution: 'Verify funnel stage definitions match your actual customer journey. Check for missing event tracking at any stage. Ensure date ranges are consistent. Look for data collection gaps (events not firing during outages).' },
    { issue: 'Forecast diverging from actuals', solution: 'Forecasts are based on historical trends — sudden market changes or pricing modifications can cause divergence. Update the model with any known upcoming changes (price increases, product launches). Re-calibrate after any major business event.' },
  ],

  faq: [
    { q: 'Which payment providers are supported?', a: 'Native integrations with Stripe and PayPal via Echo PayPal. Manual invoice tracking via Echo Invoice. Webhook-based integration for any provider that sends subscription events. CSV import for historical data from any source.' },
    { q: 'How long until AI predictions are reliable?', a: 'Churn prediction requires 90+ days of data and 50+ historical churn events. Revenue forecasting becomes reliable after 6 months of data. Basic metrics (MRR, churn rate, conversion) are accurate from day one.' },
    { q: 'Can I track non-subscription revenue?', a: 'Yes. The engine tracks one-time purchases, usage-based billing, and hybrid pricing models alongside subscriptions. All revenue types contribute to the executive dashboard and forecasting.' },
    { q: 'Is it suitable for early-stage startups?', a: 'Yes, but with expectations. Early-stage startups (under $10K MRR) benefit most from basic metrics and funnel tracking. AI features become valuable at scale (100+ customers, 6+ months of data). Start with the free tier and upgrade as you grow.' },
    { q: 'How does it handle multiple products?', a: 'Each product can have its own pricing tiers, funnels, and metrics while rolling up into a unified company-level dashboard. Cross-product analytics identify bundling opportunities and multi-product retention effects.' },
  ],
}

export default function EchoRevenueEngineDocsPage() {
  return <ProductDoc {...data} />
}
