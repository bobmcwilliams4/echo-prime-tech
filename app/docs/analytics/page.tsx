'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Analytics',
  tagline: 'Unified analytics dashboard aggregating metrics from all Echo Omega Prime services.',
  accent: '#0ea5e9',
  productUrl: '/analytics',
  workerUrl: 'https://echo-analytics-engine.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Analytics is the central intelligence layer for the entire Echo Omega Prime ecosystem. It aggregates operational metrics from every connected service — engines, doctrines, knowledge bases, fleet operations, brain messages, and more — into a single unified dashboard. Instead of checking 20 different service dashboards, you get one comprehensive view of your entire platform health and growth trajectory.',
    'Data collection runs on a cron schedule every 6 hours via Cloudflare Workers, pulling metrics from the Engine Runtime, Knowledge Forge, Shared Brain, Fleet Commander, and all connected services. Each collection cycle creates a timestamped snapshot stored in D1, building a historical record that powers trend analysis, growth tracking, and anomaly detection across days, weeks, and months.',
    'The dashboard visualizes key performance indicators including total engines deployed, doctrine coverage, knowledge document count, brain message volume, fleet health score, and cross-service query throughput. Daily and weekly snapshots enable historical comparison so you can measure growth, identify regressions, and make data-driven decisions about where to invest engineering effort next.',
  ],
  gettingStarted: [
    { step: 1, title: 'Access the Dashboard', desc: 'Navigate to Analytics from the main menu. The dashboard loads the latest snapshot automatically with key metrics displayed in summary cards at the top. No configuration is needed — data collection begins as soon as your Echo services are active.' },
    { step: 2, title: 'Explore Service Metrics', desc: 'Click any summary card to drill into service-specific metrics. The Engine Runtime panel shows engine count, query volume, and response times. The Knowledge Forge panel shows document count, indexing rate, and search performance. Each panel includes trend charts and comparison to previous periods.' },
    { step: 3, title: 'Review Growth Trends', desc: 'Switch to the Growth tab to view time-series charts showing metric changes over 7, 30, and 90-day windows. Identify which services are growing fastest and which have plateaued. Growth rate percentages are calculated automatically for each metric.' },
    { step: 4, title: 'Set Up Alerts', desc: 'Configure threshold alerts for any metric. For example, alert when fleet health score drops below 90% or when query error rate exceeds 5%. Alerts are delivered via Echo Email, Echo Chat, or webhook to your preferred notification channel.' },
    { step: 5, title: 'Export Reports', desc: 'Use the Export function to download analytics data as CSV, JSON, or PDF reports. Schedule automated weekly reports that are emailed to stakeholders. Reports include all metrics, trend charts, and AI-generated executive summaries.' },
  ],
  features: [
    { title: 'Cross-Service Data Collection', desc: 'The analytics engine connects to every Echo service via internal service bindings. Each collection cycle queries the Engine Runtime, Knowledge Forge, Shared Brain, Fleet Commander, Doctrine Forge, Memory Prime, and more. All metrics are normalized into a consistent schema for unified analysis.' },
    { title: 'Engine & Doctrine Metrics', desc: 'Track the total number of engines deployed, queries processed per engine, average response time, doctrine coverage percentage, and doctrine quality scores. Identify your most-used engines and doctrines to prioritize optimization and expansion efforts.' },
    { title: 'Knowledge Document Tracking', desc: 'Monitor the Knowledge Forge with metrics including total documents indexed, documents added per day, search query volume, average search latency, and index freshness. Track knowledge growth over time to ensure your knowledge base keeps pace with your operations.' },
    { title: 'Brain Message Analytics', desc: 'Measure Shared Brain activity with message volume, topic distribution, message importance scores, and cross-session continuity metrics. Understand how effectively your AI instances share context and which topics generate the most inter-session communication.' },
    { title: 'Fleet Score Monitoring', desc: 'The fleet health score aggregates Worker uptime, response latency, error rates, and deployment freshness into a single 0-100 score. Track fleet health over time, identify degrading Workers before they fail, and measure the impact of deployments on overall system stability.' },
    { title: 'Growth Trend Analysis', desc: 'Automatic growth rate calculation for every metric over 7, 30, and 90-day windows. Visual trend lines show acceleration or deceleration. Comparison panels display current period vs. previous period side-by-side with percentage change and directional indicators.' },
    { title: 'Daily & Weekly Snapshots', desc: 'The cron collector creates timestamped snapshots every 6 hours, which are rolled up into daily and weekly aggregates. Snapshots are stored in D1 with 365-day retention. Query any historical snapshot to see the exact state of your platform at that point in time.' },
    { title: 'Dashboard Visualization', desc: 'The analytics dashboard presents data through summary cards, time-series line charts, bar charts, heat maps, and comparison tables. All visualizations are responsive and support hover tooltips with exact values. The layout adapts between desktop and mobile views.' },
    { title: 'Historical Comparison', desc: 'Compare any two time periods side-by-side. Select a baseline period and a comparison period to see exactly how each metric changed. Useful for measuring the impact of new deployments, infrastructure changes, or growth campaigns on platform performance.' },
    { title: 'Export & Reporting', desc: 'Export raw data as CSV for spreadsheet analysis, JSON for programmatic consumption, or PDF for stakeholder reports. Schedule automated weekly or monthly reports delivered via email. Reports include metric summaries, trend charts, and AI-generated narrative insights.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/analytics/dashboard', desc: 'Retrieve the latest analytics dashboard data. Returns a comprehensive object with summary cards (engines, doctrines, documents, messages, fleet score), recent activity feed, and top-level trend indicators. Cached for 15 minutes.', auth: true },
    { method: 'GET', path: '/analytics/growth', desc: 'Retrieve growth metrics over a specified period. Query parameters: period (7d, 30d, 90d), metric (engines, doctrines, documents, messages, queries). Returns current value, previous value, growth rate, and time-series data points.', auth: true },
    { method: 'GET', path: '/analytics/snapshot', desc: 'Retrieve a specific historical snapshot. Query parameters: date (ISO 8601 date), granularity (6h, daily, weekly). Returns the full metric snapshot for the requested time period including all service metrics and computed aggregates.', auth: true },
    { method: 'POST', path: '/analytics/collect', desc: 'Manually trigger a data collection cycle. Normally runs on a 6-hour cron schedule, but can be triggered on-demand for immediate metric refresh. Returns the collection results with per-service status and any errors encountered during collection.', auth: true },
    { method: 'GET', path: '/analytics/trends', desc: 'Retrieve trend analysis for a specific metric. Query parameters: metric (required), period (7d, 30d, 90d), resolution (hourly, daily, weekly). Returns trend direction, rate of change, forecasted next value, and annotated time-series with anomaly flags.', auth: true },
    { method: 'GET', path: '/analytics/export', desc: 'Export analytics data in the specified format. Query parameters: format (csv, json, pdf), date_from, date_to, metrics (comma-separated list). Returns the exported file as a download or a URL to the generated report stored in R2.', auth: true },
  ],
  userGuide: [
    {
      title: 'Understanding the Dashboard',
      id: 'dashboard-overview',
      content: [
        'The analytics dashboard is organized into three main sections: Summary Cards at the top, Trend Charts in the middle, and the Activity Feed at the bottom. Summary cards show the current value and change direction for your most important metrics at a glance.',
        'Each summary card displays the metric name, current value, change since the last snapshot (with green up arrow for growth and red down arrow for decline), and a mini sparkline showing the 7-day trend. Click any card to expand it into a full metric detail view with configurable time ranges and drill-down options.',
        'The trend charts section shows time-series visualizations for your selected metrics. By default, it displays engine count, document count, and fleet health score. Customize this view by clicking Configure and selecting up to 6 metrics to display simultaneously. Charts support zoom, pan, and hover tooltips.',
        'The activity feed at the bottom shows recent significant events across your platform: new engines deployed, knowledge documents indexed, fleet health changes, and collection cycle results. Each event includes a timestamp, source service, and description with a link to the relevant service dashboard.',
      ],
    },
    {
      title: 'Analyzing Growth and Trends',
      id: 'growth-analysis',
      content: [
        'The Growth tab provides a dedicated view for measuring platform expansion over time. The top section shows growth rate percentages for each tracked metric over your selected period (7, 30, or 90 days). Metrics growing faster than 10% per period are highlighted in green; declining metrics are highlighted in red.',
        'The comparison panel lets you select two time periods and view them side by side. For example, compare this week to last week or this month to the same month last quarter. The panel shows absolute values, percentage changes, and identifies which specific metrics improved or regressed.',
        'Trend forecasting uses the historical data to project future values. The forecast line on each chart extends 7 days beyond the current date using linear regression. While not a guarantee, forecasts help identify whether current growth rates are sustainable or if metrics are approaching a plateau.',
        'Anomaly detection flags unusual metric values that deviate more than 2 standard deviations from the rolling average. Anomalies appear as highlighted points on the chart with hover explanations. Common causes include deployments, infrastructure changes, or upstream service issues.',
      ],
    },
    {
      title: 'Alerts and Automated Reports',
      id: 'alerts-reports',
      content: [
        'Navigate to Settings > Alerts to configure threshold-based notifications. Create an alert by selecting a metric, a condition (above, below, or change exceeds), and a threshold value. When triggered, alerts are delivered to your configured notification channels with the current metric value and context.',
        'Supported notification channels include Echo Email (sends to any email address), Echo Chat (posts to a Sentinel conversation), and Webhook (sends a JSON payload to any URL). Configure multiple channels per alert for redundancy.',
        'Automated reports are configured under Settings > Reports. Select the metrics to include, the report period (weekly or monthly), the delivery day and time, and the recipient list. Reports are generated as PDF documents with charts, tables, and an AI-generated executive summary highlighting the most important changes.',
        'All historical reports are archived in the Reports section and can be downloaded at any time. The archive retains reports for 2 years, creating a long-term record of your platform\'s growth and operational performance.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Executive Summary Generation', desc: 'The AI analyzes each analytics snapshot and generates a concise executive summary in natural language. The summary highlights the most significant changes, identifies potential concerns, and suggests areas for attention. Example: "Engine query volume increased 23% this week, driven primarily by the tax-returns engine. Fleet health dipped to 94% due to 3 Workers reporting elevated latency in the EU region."' },
    { capability: 'Anomaly Detection & Root Cause Analysis', desc: 'When metrics deviate significantly from historical patterns, the AI identifies the anomaly and correlates it with events across connected services. It traces unusual query volume spikes to specific engines, links fleet health drops to recent deployments, and suggests probable root causes with confidence scores.' },
    { capability: 'Predictive Growth Forecasting', desc: 'Using historical snapshot data, the AI builds predictive models for key metrics. Forecasts account for seasonality, growth trends, and recent acceleration or deceleration. Projections are presented with confidence intervals so you can plan infrastructure scaling and resource allocation with data-backed estimates.' },
    { capability: 'Smart Alerting Recommendations', desc: 'Based on your platform usage patterns and metric volatility, the AI recommends alert thresholds that minimize false positives while catching genuine issues. It learns from alert history to refine recommendations over time, suggesting tighter thresholds for stable metrics and wider bands for naturally variable ones.' },
  ],
  troubleshooting: [
    { issue: 'Dashboard shows stale data from hours ago', solution: 'Data collection runs on a 6-hour cron cycle. If you need fresh data immediately, use the Refresh button on the dashboard or call POST /analytics/collect to trigger an on-demand collection. Check the Last Updated timestamp in the dashboard header to confirm when the last successful collection occurred.' },
    { issue: 'A specific service metric shows zero or is missing', solution: 'The analytics collector may not be able to reach that service. Check the service\'s health endpoint directly to confirm it is running. If the service is healthy but metrics are still missing, verify the service binding is configured in the analytics Worker\'s wrangler.toml. Collection errors for individual services are logged in the Activity Feed.' },
    { issue: 'Growth percentages seem incorrect or inflated', solution: 'Growth rates are calculated by comparing the current snapshot to the snapshot from exactly one period ago. If the comparison snapshot is missing (e.g., due to a collection failure), the system falls back to the nearest available snapshot which may represent a different time span. Check the Data Quality indicator on the Growth tab for warnings about missing comparison data.' },
    { issue: 'Export fails or produces an empty file', solution: 'Ensure the date range you specified contains at least one snapshot. The export endpoint requires date_from and date_to parameters in ISO 8601 format (e.g., 2026-03-01). If exporting PDF, the generation may take up to 30 seconds for large date ranges. Retry after a brief wait if you receive a timeout error.' },
  ],
  faq: [
    { q: 'How often is data collected?', a: 'The default collection schedule runs every 6 hours via a Cloudflare Workers cron trigger. This creates 4 snapshots per day (at 00:00, 06:00, 12:00, and 18:00 UTC). You can trigger additional collections on-demand via the dashboard or API. Enterprise plans support custom cron schedules down to every 15 minutes.' },
    { q: 'How long is historical data retained?', a: 'Raw 6-hour snapshots are retained for 90 days. Daily rollup summaries are retained for 365 days. Weekly rollups are retained indefinitely. This tiered retention strategy balances storage costs with long-term trend analysis needs. Export data before the retention window closes if you need granular historical records.' },
    { q: 'Can I track custom metrics from my own services?', a: 'Yes. The analytics collector supports custom metric sources. Register your service endpoint via the Settings > Custom Sources panel. Your endpoint must return a JSON object with metric name-value pairs. Custom metrics appear alongside built-in metrics in the dashboard, charts, and exports.' },
    { q: 'Does analytics collection impact service performance?', a: 'Collection queries are lightweight read-only operations that pull aggregate counts and averages from each service. They are equivalent to a single health check request. Collection runs are staggered across services to avoid simultaneous load. In practice, the performance impact is negligible even for high-traffic services.' },
    { q: 'Can I share dashboard access with my team?', a: 'Yes. Navigate to Settings > Team Access to invite team members by email. Assign Viewer (read-only dashboard), Analyst (dashboard + export), or Admin (full access including alert and report configuration) roles. All team members see the same unified dashboard with their access level determining which actions are available.' },
  ],
}

export default function Page() { return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/analytics' },
      ]} />
      <ProductDoc {...data} />
    </>
  ) }
