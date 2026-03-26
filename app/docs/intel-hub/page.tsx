'use client'

import ProductDoc from '@/components/ProductDoc'

export default function IntelHubDocPage() {
  return (
    <ProductDoc
      name="Echo Intel Hub"
      tagline="Unified intelligence dashboard — aggregate, correlate, and act on data from every Echo source in real time."
      accent="#1e40af"
      productUrl="/intelligence"
      workerUrl="https://echo-drive-intelligence.bmcii1976.workers.dev"
      version="1.4.0"
      overview={[
        'Echo Intel Hub is the central nervous system of the Echo Prime ecosystem. It aggregates data from every Echo product, third-party API, and custom data source into a single unified intelligence dashboard. Instead of checking ten different tools for ten different answers, Intel Hub gives you one pane of glass where all your data converges, correlates, and surfaces actionable insights automatically.',
        'The platform connects to over 30 data source types out of the box — from Echo internal systems like Sentinel AI, County Records, and Engine Runtime to external feeds like news APIs, social media monitors, financial data streams, and government databases. Each source is normalized into a common schema, enabling cross-source queries that were previously impossible without custom engineering.',
        'Intel Hub is not a passive dashboard. Its AI engine continuously analyzes incoming data streams, detects anomalies, identifies trends, and generates proactive alerts. When a competitor files a new patent, a monitored company changes executives, or a county records a suspicious instrument, you know about it in minutes — not days. Custom dashboards, automated reports, and a full API make Intel Hub the command center for data-driven decision making.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Hub', desc: 'Sign up and create your Intel Hub workspace. Name your workspace and invite team members. Each workspace supports unlimited data sources and custom dashboards with role-based access control.' },
        { step: 2, title: 'Connect Data Sources', desc: 'Navigate to Sources and add your first data feeds. Choose from 30+ built-in connectors (Echo products, news APIs, social feeds, financial data) or create custom webhooks for proprietary sources. Each source auto-syncs on a configurable schedule.' },
        { step: 3, title: 'Configure Alerts', desc: 'Set up alert rules based on keywords, entity names, data thresholds, or anomaly detection. Choose notification channels — email, Slack, SMS, or webhook. Alerts fire in real time as matching data arrives.' },
        { step: 4, title: 'Build Dashboards', desc: 'Create custom dashboards with drag-and-drop widgets: data tables, charts, maps, timelines, and feed viewers. Pin your most critical metrics and data streams for at-a-glance monitoring.' },
        { step: 5, title: 'Schedule Reports', desc: 'Configure automated reports that compile, analyze, and deliver intelligence summaries on a daily, weekly, or monthly schedule. Reports are generated as PDF or delivered via email with interactive links.' },
      ]}
      features={[
        { title: 'Cross-Source Search', desc: 'Search across all connected data sources with a single query. Results are normalized, deduplicated, and ranked by relevance. Find connections between data points that exist in different systems.' },
        { title: 'Real-Time Feeds', desc: 'Live data streams from all connected sources displayed in a unified feed. Filter by source, entity, keyword, or sentiment. Auto-refresh keeps you current without manual polling.' },
        { title: 'Alert Management', desc: 'Configurable alerts on keywords, entities, thresholds, and anomalies. Supports compound conditions (A AND B within 24 hours). Alerts route to email, Slack, SMS, or custom webhooks with full context.' },
        { title: 'Data Fusion Engine', desc: 'AI engine that correlates data points across sources to identify patterns invisible in any single feed. Links people to companies, companies to filings, filings to geographic areas, and events to outcomes.' },
        { title: 'Trend Analysis', desc: 'Automated trend detection across all data streams. Identifies increasing/decreasing patterns, seasonal cycles, and sudden changes. Visualized as interactive charts with drill-down capability.' },
        { title: 'Competitive Intelligence', desc: 'Monitor competitors across news, filings, job postings, patent applications, social media, and financial data. Automated competitive landscape reports highlight strategic moves and market shifts.' },
        { title: 'Threat Monitoring', desc: 'Continuous monitoring for threats to your business — data breaches, negative press, regulatory changes, litigation filings, and executive departures. Risk scoring prioritizes the most urgent threats.' },
        { title: 'Custom Dashboards', desc: 'Build unlimited dashboards with drag-and-drop widgets. Support for tables, bar charts, line charts, pie charts, geographic maps, timelines, and live feed viewers. Dashboards are shareable with configurable permissions.' },
        { title: 'Report Generation', desc: 'AI-generated intelligence reports that synthesize data from multiple sources into structured narratives. Configurable templates for daily briefs, weekly summaries, competitive analyses, and custom formats.' },
        { title: 'API Aggregation', desc: 'Unified API that exposes aggregated data from all connected sources. Build custom applications, integrations, and automations on top of your unified intelligence layer.' },
        { title: 'Entity Resolution', desc: 'AI identifies and links references to the same entity across different data sources, even when names vary (abbreviations, misspellings, aliases). Builds comprehensive entity profiles from fragmented data.' },
        { title: 'Geospatial Intelligence', desc: 'Map-based visualization of location-tagged data. Heat maps, cluster analysis, and geographic filtering. Particularly powerful for oil and gas operations, real estate, and logistics intelligence.' },
      ]}
      apiEndpoints={[
        { method: 'GET', path: '/api/search', desc: 'Cross-source search with keyword, entity, date range, and source filters. Returns normalized, ranked results.', auth: true },
        { method: 'GET', path: '/api/feeds', desc: 'Retrieve real-time feed items with filtering by source, entity, keyword, and time window.', auth: true },
        { method: 'POST', path: '/api/alerts', desc: 'Create a new alert rule with conditions, notification channels, and schedule.', auth: true },
        { method: 'GET', path: '/api/alerts', desc: 'List all configured alerts with current status, trigger count, and last fired timestamp.', auth: true },
        { method: 'GET', path: '/api/entities/:id', desc: 'Retrieve a unified entity profile with all cross-source data, relationships, and timeline.', auth: true },
        { method: 'POST', path: '/api/reports/generate', desc: 'Trigger an on-demand intelligence report with specified sources, time range, and template.', auth: true },
        { method: 'GET', path: '/api/sources', desc: 'List all connected data sources with status, record count, and last sync timestamp.', auth: false },
        { method: 'POST', path: '/api/sources', desc: 'Add a new data source connection with type, credentials, and sync schedule.', auth: true },
      ]}
      userGuide={[
        { id: 'data-sources', title: 'Connecting & Managing Data Sources', content: [
          'Intel Hub supports over 30 built-in data source connectors. Navigate to Sources > Add Source to browse available connectors. Each connector has specific configuration requirements — API keys for external services, OAuth for Echo products, or webhook URLs for custom sources. The setup wizard guides you through each step.',
          'Once connected, sources sync on a configurable schedule ranging from real-time (webhook-driven) to daily batch imports. The Sources dashboard shows each source status (active, syncing, error), total records imported, and last successful sync time. Failed syncs are retried automatically with exponential backoff.',
          'For data that does not fit a built-in connector, use the Custom Webhook source. Configure a unique webhook URL in Intel Hub, then POST JSON payloads from your application. The platform normalizes incoming data into the common schema using configurable field mappings.',
        ]},
        { id: 'dashboards', title: 'Building Custom Dashboards', content: [
          'Create a new dashboard from the Dashboards tab. Each dashboard is a grid-based canvas where you place widgets. Available widget types include data tables, bar charts, line charts, area charts, pie charts, geographic maps, timelines, live feed viewers, and metric cards.',
          'Each widget connects to one or more data sources with configurable filters, grouping, and aggregation. For example, a bar chart might show weekly filing counts by county, while a live feed widget displays real-time alerts. Widgets auto-refresh based on the underlying source sync schedule.',
          'Dashboards support multiple layouts (desktop, tablet, mobile) and can be shared with team members via link or embedded in external applications via iframe. Permission controls let you specify who can view, edit, or manage each dashboard.',
        ]},
        { id: 'alerts', title: 'Configuring Intelligence Alerts', content: [
          'Alerts are the proactive backbone of Intel Hub. Create alerts from the Alerts tab by specifying trigger conditions: keyword match, entity mention, numeric threshold, anomaly detection, or custom compound rules. Compound rules combine multiple conditions with AND/OR logic and time windows.',
          'Each alert routes to one or more notification channels. Supported channels include email (with full context), Slack (with interactive buttons), SMS (concise summary), and custom webhooks (full JSON payload). Configure escalation paths for critical alerts — if not acknowledged within a time window, escalate to a secondary contact.',
          'The alert history page shows every trigger with timestamp, matched data, and notification status. Use this to tune alert sensitivity — reduce false positives by adding exclusion rules or tightening keyword specificity. Analytics show alert volume trends to help you optimize your monitoring posture.',
        ]},
        { id: 'reports', title: 'Generating Intelligence Reports', content: [
          'Intel Hub generates three types of reports: scheduled, on-demand, and AI-synthesized. Scheduled reports run automatically on a daily, weekly, or monthly cadence and deliver compiled intelligence to your inbox. On-demand reports are triggered manually for specific topics or time ranges.',
          'AI-synthesized reports are the most powerful. The AI engine analyzes data across all sources, identifies the most significant events and trends, and writes a structured narrative with supporting data. These reports highlight what matters most rather than simply listing everything that happened.',
          'Report templates control the structure, branding, and content focus. Built-in templates include Daily Intelligence Brief, Weekly Competitive Analysis, Monthly Market Summary, and Entity Deep Dive. You can create custom templates with your preferred sections, data sources, and formatting.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Cross-Source Correlation', desc: 'AI engine automatically identifies relationships between data points across different sources. A company name in a news article is linked to its SEC filings, county records, social media mentions, and job postings to build a complete picture from fragmented data.' },
        { capability: 'Anomaly Detection', desc: 'Continuously monitors all data streams for unusual patterns — sudden spikes in filing activity, unexpected executive changes, abnormal trading volumes, or sentiment shifts. Anomalies are scored by severity and routed as alerts.' },
        { capability: 'Natural Language Reports', desc: 'Generates human-readable intelligence reports from raw data. The AI synthesizes key events, trends, and insights into structured narratives, saving hours of manual analysis and report writing.' },
        { capability: 'Predictive Analytics', desc: 'Uses historical patterns to forecast future trends — filing volumes, market movements, competitive actions. Predictions include confidence intervals and the key factors driving each forecast.' },
        { capability: 'Entity Resolution', desc: 'Identifies when different data sources reference the same entity using different names, abbreviations, or identifiers. Builds unified entity profiles that aggregate all known information from every connected source.' },
        { capability: 'Sentiment Analysis', desc: 'Analyzes text content from news, social media, and communications to determine sentiment toward entities, topics, and events. Tracks sentiment over time to identify reputation shifts and emerging narratives.' },
      ]}
      troubleshooting={[
        { issue: 'Data source shows "Connection Error" status', solution: 'Verify that the API key or OAuth token for the source is still valid. Navigate to Sources > Edit and re-authenticate. Check if the external service is experiencing an outage. The system retries failed connections automatically every 15 minutes.' },
        { issue: 'Cross-source search returns incomplete results', solution: 'Ensure all relevant sources are in "Active" status and have completed their initial sync. New sources may take up to an hour to fully index. Check the source filter in your search — by default, all active sources are included, but a previous filter may be narrowing results.' },
        { issue: 'Alerts firing too frequently (false positives)', solution: 'Tighten your alert conditions by adding exclusion keywords, narrowing the source scope, or increasing the anomaly detection threshold. Review alert history to identify the most common false positive patterns and create exception rules for them.' },
        { issue: 'Dashboard widgets showing stale data', solution: 'Check the underlying source sync status — if a source sync has failed, widgets showing that data will be stale. Manually trigger a sync from Sources > Sync Now. Verify that your browser is not caching old widget data by doing a hard refresh.' },
      ]}
      faq={[
        { q: 'How many data sources can I connect?', a: 'There is no hard limit on the number of data sources. Starter plans include 5 source connections, Professional includes 25, and Enterprise is unlimited. Each source connection counts once regardless of how many dashboards or alerts reference it.' },
        { q: 'Can I connect my own proprietary data sources?', a: 'Yes. Use the Custom Webhook connector to receive data from any system that can make HTTP POST requests. For more complex integrations, the Custom API connector supports polling external APIs on a configurable schedule with authentication and field mapping.' },
        { q: 'How real-time is the data?', a: 'Webhook-driven sources (like Echo internal products) deliver data in near real-time — typically under 5 seconds. Polled external sources update on their configured schedule, ranging from every 5 minutes to daily. The feed and alerts process new data within seconds of arrival.' },
        { q: 'Can team members have different dashboard views?', a: 'Yes. Each team member can create their own dashboards or be granted access to shared dashboards. Role-based access control lets you define who can view, edit, or administer each dashboard. Personal dashboards are private by default.' },
        { q: 'Does Intel Hub store the raw source data?', a: 'Intel Hub stores normalized copies of all ingested data to enable cross-source search and correlation. Raw source data is retained based on your plan (90 days for Starter, 1 year for Professional, unlimited for Enterprise). You can configure per-source retention policies.' },
      ]}
    />
  )
}
