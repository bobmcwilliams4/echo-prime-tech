'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Analytics',
  tagline: 'Real-time dashboards, fleet monitoring, revenue analytics, and AI anomaly detection — infrastructure, product, and business metrics in one platform.',
  accent: '#0ea5e9',
  productUrl: '/analytics',
  workerUrl: 'echo-analytics-engine.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Analytics combines infrastructure monitoring (like Datadog), product analytics (like Mixpanel), and revenue tracking (like Baremetrics) into a single privacy-first platform. Events are ingested at the edge via Cloudflare Workers with sub-2-second latency and no centralized bottleneck.',
    'Track fleet health across 150+ Workers, monitor API performance with per-endpoint latency percentiles (p50, p95, p99), and visualize revenue metrics including MRR, ARR, churn rate, and LTV. AI anomaly detection powered by the Engine Runtime builds baseline patterns and flags deviations with context.',
    'Privacy-first by design — no cookies, no third-party scripts. Multi-tenant isolation lets agencies white-label dashboards for client reporting. Exportable PDF and CSV reports on any date range, scheduled weekly or monthly.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com and select an Analytics plan. New accounts get full Pro features for 14 days. No credit card required for the trial.' },
    { step: 2, title: 'Install the Tracking Snippet', desc: 'Add the lightweight tracking snippet to your site or application. It runs on the edge with no cookies and no third-party scripts — fully privacy compliant.' },
    { step: 3, title: 'Configure Dashboards', desc: 'Choose from pre-built dashboard templates for fleet monitoring, revenue tracking, or user behavior. Customize layouts, add custom metrics, and set refresh intervals.' },
    { step: 4, title: 'Set Up Alerts', desc: 'Configure threshold-based or AI anomaly-based alerts. Choose notification channels: webhook, email, Slack, or Discord. Set cooldowns to prevent alert fatigue.' },
    { step: 5, title: 'Push Custom Metrics', desc: 'Use the REST API to push any business metric with arbitrary dimensions and tags. Build custom dashboards for domain-specific KPIs alongside infrastructure data.' },
  ],
  features: [
    { title: 'Real-Time Dashboards', desc: 'Live metrics across all services — API calls, active users, error rates, latency percentiles. Auto-refreshing with configurable intervals.' },
    { title: 'Fleet Health Monitoring', desc: 'Track the health of every Cloudflare Worker in your fleet. Uptime history, response times, error spikes, and auto-generated incident reports.' },
    { title: 'Revenue Analytics', desc: 'Track MRR, ARR, churn rate, LTV, and revenue per product. Cohort analysis and subscription funnel visualization built-in.' },
    { title: 'User Behavior Tracking', desc: 'Page views, session duration, feature adoption, and conversion funnels. Privacy-first with no cookies and no third-party scripts.' },
    { title: 'AI Anomaly Detection', desc: 'Engine Runtime monitors metrics continuously and flags unusual patterns — traffic spikes, error rate increases, latency degradation — before they become incidents.' },
    { title: 'Custom Metric Ingestion', desc: 'Push any metric via REST API with arbitrary dimensions and tags. Build custom dashboards for domain-specific KPIs.' },
    { title: 'Alerting & Notifications', desc: 'Threshold-based or anomaly-based alerts via webhook, email, Slack, or Discord. Configurable cooldowns prevent alert fatigue.' },
    { title: 'Retention & Cohort Analysis', desc: 'Track user retention by signup cohort. Visualize drop-off points and identify features that drive engagement.' },
    { title: 'API Performance Profiling', desc: 'Per-endpoint latency percentiles (p50, p95, p99), error rates, and throughput. Identify slow endpoints before users notice.' },
    { title: 'Cost Tracking', desc: 'Monitor Cloudflare Workers usage, D1 queries, R2 operations, and KV reads. Correlate cost with traffic to optimize spend.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/events', desc: 'Ingest one or more events with arbitrary dimensions, tags, and values.', auth: true },
    { method: 'GET', path: '/dashboards', desc: 'List all dashboards for the authenticated tenant with layout configuration.', auth: true },
    { method: 'GET', path: '/metrics/:name', desc: 'Query a specific metric with time range, resolution, and dimension filters.', auth: true },
    { method: 'GET', path: '/fleet/health', desc: 'Get current health status for all monitored Workers including uptime and latency.', auth: true },
    { method: 'POST', path: '/alerts', desc: 'Create a new alert rule with threshold or anomaly detection configuration.', auth: true },
    { method: 'GET', path: '/reports/export', desc: 'Generate a PDF or CSV report for a specified date range and metric set.', auth: true },
  ],
  userGuide: [
    { title: 'Dashboard Configuration', id: 'dashboards', content: [
      'Dashboards are composed of widgets — each widget displays a metric with a visualization type (line chart, bar chart, gauge, number, table). Drag widgets to rearrange, resize by pulling corners, and set per-widget refresh intervals.',
      'Use dimension filters to slice data by any tag you send with events. For example, filter API latency by endpoint, region, or HTTP status code. Save filter presets for quick switching between views.',
      'Share dashboards with team members or generate a public read-only link. Enterprise plans support multi-tenant isolation where each client sees only their own data.',
    ] },
    { title: 'Alert Configuration', id: 'alerts', content: [
      'Threshold alerts fire when a metric crosses a static value — for example, error rate exceeds 5% or p99 latency exceeds 2 seconds. Set severity levels (info, warning, critical) to route alerts to different channels.',
      'AI anomaly alerts learn baseline patterns automatically. You do not need to configure thresholds. The Engine Runtime detects deviations and includes context — what changed, when, and correlated metrics that may explain the anomaly.',
      'Configure cooldown periods to prevent alert storms. Group related alerts into incidents. Set escalation policies that notify additional channels if an alert is not acknowledged within a configured window.',
    ] },
    { title: 'Revenue Tracking Setup', id: 'revenue', content: [
      'Connect your payment provider (Stripe, PayPal, or custom webhook) to automatically ingest subscription events. The system calculates MRR, ARR, churn, and LTV from raw transaction data.',
      'Cohort analysis groups users by signup date and tracks retention over time. Identify which acquisition channels produce the highest LTV and lowest churn to optimize marketing spend.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'Anomaly Detection', desc: 'The Engine Runtime builds baseline patterns for every metric using historical data. When values deviate beyond learned thresholds, it triggers alerts with context — what changed, when, and potential causes based on correlated metrics.' },
    { capability: 'Predictive Alerting', desc: 'AI projects metric trends forward to predict threshold breaches before they occur. Get warned about capacity limits, spending overruns, or degradation trends hours before they become critical.' },
    { capability: 'Automated Incident Reports', desc: 'When anomalies are detected across multiple correlated metrics, the AI generates an incident report summarizing the timeline, affected services, potential root causes, and suggested remediation steps.' },
  ],
  troubleshooting: [
    { issue: 'Events not appearing in dashboards', solution: 'Verify the tracking snippet is loaded by checking browser devtools network tab. Ensure the API key is correct and the event payload includes required fields (event name, timestamp). Events appear within 2 seconds of ingestion.' },
    { issue: 'Anomaly alerts firing too frequently', solution: 'The AI needs at least 7 days of data to build accurate baselines. During the learning period, switch to threshold-based alerts. You can also adjust anomaly sensitivity from the alert configuration panel.' },
    { issue: 'Fleet health showing stale data', solution: 'Fleet monitoring relies on periodic health checks. Verify that monitored Workers have a /health endpoint returning 200. Check that the monitoring interval has not been set too long (default is 60 seconds).' },
    { issue: 'CSV export timing out on large date ranges', solution: 'For date ranges exceeding 90 days, use the asynchronous export endpoint which generates the file in the background and emails a download link. The synchronous endpoint has a 30-second timeout.' },
  ],
  faq: [
    { q: 'How does this compare to Google Analytics?', a: 'Echo Analytics is privacy-first with no cookies or third-party scripts. It combines product analytics, infrastructure monitoring, and revenue tracking in one platform. Google Analytics focuses only on web traffic.' },
    { q: 'How fast is data ingestion?', a: 'Events appear in dashboards within seconds. Our Cloudflare Workers edge architecture processes data at the nearest PoP — no centralized ingestion bottleneck.' },
    { q: 'Can agencies use this for client reporting?', a: 'Yes. The Enterprise plan includes multi-tenant isolation and white-label dashboards. Each client gets their own analytics view with your branding.' },
    { q: 'Is there a free tier?', a: 'New accounts get full Pro features for 14 days. After that, the Starter plan at $19/mo covers most small teams. A forever-free plan with 1 dashboard and 10K events/mo is also available.' },
    { q: 'What are the pricing tiers?', a: 'Starter at $19/mo (5 dashboards, 100K events), Pro at $79/mo (unlimited dashboards, 1M events, AI anomaly detection), and Enterprise at $249/mo (multi-tenant, unlimited events, cost tracking, exportable reports).' },
  ],
}

export default function AnalyticsEngineDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/analytics-engine' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
