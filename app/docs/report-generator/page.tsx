'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Report Generator',
  tagline: 'AI-powered business intelligence reports with automated data collection and visualization.',
  accent: '#7c3aed',
  productUrl: '/report-generator',
  workerUrl: 'https://echo-analytics-engine.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Report Generator transforms raw operational data into polished, executive-ready intelligence reports. Connect any data source across the Echo ecosystem — CRM pipelines, financial ledgers, scraper outputs, engine analytics, security logs — and the system automatically collects, correlates, and renders the information into structured reports with charts, tables, and narrative summaries.',
    'Reports can be generated on-demand through the API or scheduled to run at fixed intervals. The generation pipeline uses AI to identify trends, surface anomalies, and write human-readable executive summaries that highlight what matters most. Every report is versioned, searchable, and exportable in PDF, CSV, or JSON format for downstream consumption.',
    'Built for teams that need consistent, automated reporting without manual data wrangling. Whether you are tracking revenue across business units, monitoring scraper uptime, or auditing security incidents, Echo Report Generator delivers the answers on schedule with zero manual intervention.',
  ],
  gettingStarted: [
    { step: 1, title: 'Authenticate with the SDK Gateway', desc: 'Obtain your API key from the Echo Prime dashboard and include it as X-Echo-API-Key in all requests to the SDK Gateway. The Report Generator is accessed through the unified gateway endpoint at echo-sdk-gateway.bmcii1976.workers.dev.' },
    { step: 2, title: 'Browse Available Templates', desc: 'Call GET /templates to see the library of pre-built report templates — revenue summary, scraper health, engine utilization, security audit, and more. Each template defines the data sources, chart types, and layout structure.' },
    { step: 3, title: 'Generate Your First Report', desc: 'Send a POST to /reports/generate with your chosen template ID and any parameter overrides (date range, filters, grouping). The system collects data from all referenced sources, runs AI analysis, and returns a report object with a unique ID.' },
    { step: 4, title: 'Schedule Recurring Reports', desc: 'Use POST /schedules to create a cron-based schedule. Specify the template, parameters, frequency (hourly, daily, weekly, monthly), and delivery method (webhook, email, or R2 storage). Reports generate automatically and notify on completion.' },
    { step: 5, title: 'Export and Distribute', desc: 'Call POST /reports/export with the report ID and desired format (PDF, CSV, JSON). For automated distribution, configure email recipients or webhook endpoints in the schedule definition. Reports are retained for 90 days in cold storage.' },
  ],
  features: [
    { title: 'Automated Data Collection', desc: 'Pulls data from any Echo ecosystem service — CRM, finance, scrapers, engines, security logs, and custom data sources — through service bindings and API integrations. No manual data preparation required.' },
    { title: 'Custom Report Templates', desc: 'Design reusable templates that define data sources, chart configurations, table layouts, and narrative sections. Templates accept parameters for date ranges, filters, and grouping so one template serves many use cases.' },
    { title: 'Scheduled Generation', desc: 'Create cron-based schedules that generate reports automatically at any interval. Supports hourly, daily, weekly, and monthly frequencies with timezone awareness and business-day-only options.' },
    { title: 'Multi-Format Export', desc: 'Export finished reports as PDF (with charts and branding), CSV (raw tabular data), or JSON (structured data for programmatic consumption). Each format is optimized for its target audience.' },
    { title: 'Chart Visualizations', desc: 'Automatically generates bar charts, line graphs, pie charts, area charts, and sparklines based on the data profile. Chart types are inferred from data shape or explicitly defined in the template.' },
    { title: 'Cross-Service Data Aggregation', desc: 'Joins and correlates data across multiple Echo services in a single report. Combine revenue data with scraper output and engine utilization to build comprehensive operational dashboards.' },
    { title: 'AI Trend Analysis', desc: 'Applies statistical and AI models to detect trends, seasonality, outliers, and anomalies in the data. Trend indicators are embedded directly in charts and called out in the executive summary.' },
    { title: 'Executive Summaries', desc: 'Uses LLM-powered narrative generation to write plain-English summaries of report findings. Summaries highlight key metrics, notable changes, and recommended actions — ready for leadership consumption.' },
    { title: 'Drill-Down Capabilities', desc: 'Reports include expandable sections that let readers drill from summary KPIs down to individual records. Hierarchical data is automatically structured into collapsible layers.' },
    { title: 'Email Distribution', desc: 'Attach finished reports to automated emails sent to configured recipient lists. Supports per-schedule recipient groups, custom subject lines, and inline summary previews in the email body.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/reports/generate', desc: 'Generate a new report from a template. Accepts template_id, date_range, filters, and grouping parameters. Returns the report object with status and data.', auth: true },
    { method: 'GET', path: '/reports/:id', desc: 'Retrieve a previously generated report by its unique ID. Returns the full report payload including charts, tables, and AI-generated summary.', auth: true },
    { method: 'GET', path: '/templates', desc: 'List all available report templates with their schema definitions, required parameters, and supported output formats.', auth: false },
    { method: 'POST', path: '/schedules', desc: 'Create a recurring report schedule. Accepts template_id, cron expression, parameters, and delivery configuration (email, webhook, or R2).', auth: true },
    { method: 'GET', path: '/analytics/dashboard', desc: 'Returns aggregated analytics data suitable for dashboard rendering — top-level KPIs, trend sparklines, and alert counts across all connected services.', auth: true },
    { method: 'POST', path: '/reports/export', desc: 'Export a generated report in the specified format (pdf, csv, json). Returns a signed download URL valid for 24 hours.', auth: true },
  ],
  userGuide: [
    {
      title: 'Creating and Managing Templates',
      id: 'templates',
      content: [
        'Templates are the foundation of every report. A template defines which data sources to query, how to transform and aggregate the results, what charts to render, and how to structure the final layout. Start with one of the built-in templates (revenue summary, scraper health, engine utilization) and customize from there.',
        'Each template accepts parameters — date ranges, filters, grouping keys — that make it reusable across different contexts. For example, a single revenue template can generate reports for any business unit, any time period, and any product line just by changing the parameters at generation time.',
        'To create a custom template, POST to /templates with a JSON schema defining your data sources, transformations, chart definitions, and layout sections. Templates are versioned automatically so you can iterate without breaking existing schedules.',
      ],
    },
    {
      title: 'Scheduling and Automation',
      id: 'scheduling',
      content: [
        'Schedules tie a template to a recurring cron expression. When the schedule fires, the system generates the report with the configured parameters and delivers it via the specified method — email attachment, webhook POST, or R2 storage upload.',
        'Schedules support timezone-aware cron expressions, business-day-only execution, and retry logic for transient failures. If a data source is temporarily unavailable, the schedule retries up to 3 times with exponential backoff before marking the run as failed and sending an alert.',
        'Monitor schedule health through the /schedules endpoint. Each schedule tracks its last run time, success/failure count, average generation duration, and next scheduled execution. Failed runs include diagnostic details for troubleshooting.',
      ],
    },
    {
      title: 'Interpreting AI-Generated Insights',
      id: 'ai-insights',
      content: [
        'Every report includes an AI-generated executive summary and embedded trend annotations. The summary is produced by analyzing the report data against historical baselines and applying statistical models to detect significant changes.',
        'Trend indicators appear as colored arrows and badges on charts and KPI cards. Green upward arrows indicate positive trends; red downward arrows indicate concerns. Each annotation includes a confidence score and a plain-English explanation of the detected pattern.',
        'The AI engine prioritizes actionable insights over noise. Minor fluctuations are filtered out while statistically significant deviations — revenue drops, scraper failure spikes, unusual traffic patterns — are highlighted prominently in the summary section.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Natural Language Summaries', desc: 'Transforms complex datasets into clear, executive-ready narrative summaries. The AI identifies the most important metrics, notable changes, and emerging patterns, then writes a concise overview suitable for leadership review without requiring data literacy.' },
    { capability: 'Anomaly Detection', desc: 'Continuously compares current data against historical baselines using statistical models. Automatically flags unusual spikes, drops, or pattern breaks with confidence scores. Detected anomalies are highlighted in charts and called out in the executive summary.' },
    { capability: 'Predictive Trend Forecasting', desc: 'Extrapolates current trends forward using time-series models to forecast future values. Predictions include confidence intervals and are rendered as dashed lines on charts. Useful for capacity planning, revenue projections, and resource allocation.' },
    { capability: 'Intelligent Chart Selection', desc: 'Analyzes the shape, cardinality, and distribution of each dataset to automatically select the most effective chart type. Categorical data gets bar charts, time-series data gets line graphs, proportional data gets pie charts — all without manual configuration.' },
  ],
  troubleshooting: [
    { issue: 'Report generation returns empty data', solution: 'Verify that the data sources referenced in the template are accessible and returning data for the specified date range. Check that your API key has read permissions on the target services. Use GET /analytics/dashboard to confirm data flow before generating a full report.' },
    { issue: 'Scheduled reports are not delivering', solution: 'Check the schedule status via GET /schedules/:id. Look at the last_run_status field for error details. Common causes include expired webhook URLs, invalid email addresses, or data source timeouts. Ensure the delivery endpoint is reachable from the Cloudflare edge.' },
    { issue: 'PDF export fails or renders incorrectly', solution: 'PDF generation requires all chart data to be present in the report. If charts show as blank, the underlying data source may have timed out during generation. Regenerate the report and then export. For layout issues, verify the template chart dimensions are within the supported PDF page size.' },
    { issue: 'AI summary is generic or unhelpful', solution: 'The AI summary quality depends on having sufficient historical data for comparison. Reports with fewer than 7 days of historical data will produce generic summaries. Ensure the date range includes enough history for meaningful trend analysis — at least 30 days is recommended for executive reports.' },
  ],
  faq: [
    { q: 'How many reports can I generate per month?', a: 'Free tier includes 50 report generations per month. Pro tier allows 500, and Enterprise is unlimited. Scheduled reports count toward the monthly generation limit. Exports of existing reports do not count as new generations.' },
    { q: 'Can I connect external data sources outside the Echo ecosystem?', a: 'Yes. Custom data sources can be registered via the template configuration by providing an HTTP endpoint that returns JSON data. The Report Generator will call your endpoint during generation and merge the results with Echo ecosystem data.' },
    { q: 'How long are generated reports retained?', a: 'Reports are retained for 90 days in hot storage (instant access) and 1 year in cold archive (retrieval within 30 seconds). After 1 year, reports are permanently deleted unless you enable long-term retention in your account settings.' },
    { q: 'Can multiple team members access the same reports?', a: 'Yes. Reports inherit the access permissions of the generating account. You can share reports with team members by adding their email addresses to the distribution list or by sharing the signed download URL. Team-level API keys provide shared access to all reports.' },
    { q: 'What chart types are supported?', a: 'The system supports bar charts, line graphs, area charts, pie charts, donut charts, sparklines, heatmaps, and scatter plots. Charts are rendered using a server-side engine for consistent output across PDF and web formats. Custom chart configurations can be defined in templates.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }
