'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Diagnostics',
  tagline: 'Real-time system health monitoring, performance profiling, and automated issue detection.',
  accent: '#dc2626',
  productUrl: '/diagnostics',
  workerUrl: 'https://echo-performance-profiler.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Diagnostics is a comprehensive system health monitoring and performance profiling platform designed for distributed Cloudflare Worker architectures. It continuously monitors endpoint response times, error rates, memory utilization, and dependency health across your entire service fleet. When something degrades, you know about it in seconds — not minutes — through configurable alert thresholds that notify via email, SMS, Slack, or webhook.',
    'Beyond simple uptime checks, Echo Diagnostics provides deep performance profiling that traces requests across service boundaries, identifies slow database queries, measures cold start impact, and surfaces latency bottlenecks that traditional monitoring misses. Historical trend analysis shows how performance evolves over time, making it easy to correlate deployments with regressions and validate that fixes actually improve the metrics that matter.',
    'The platform includes automated load testing that simulates realistic traffic patterns against your endpoints, measuring throughput, error rates, and latency percentiles under pressure. Combined with the auto-remediation engine — which can restart unhealthy workers, clear stale caches, and reroute traffic around degraded dependencies — Echo Diagnostics transforms monitoring from a passive dashboard into an active self-healing system.',
  ],
  gettingStarted: [
    { step: 1, title: 'Register Your Services', desc: 'Add each Cloudflare Worker or API endpoint you want to monitor. Provide the URL, expected response time threshold, and health check path (typically /health). Echo Diagnostics begins probing immediately from multiple global edge locations.' },
    { step: 2, title: 'Configure Alert Rules', desc: 'Define alerting thresholds for each metric: response time exceeding P95 baseline, error rate above 1%, health check failures for 3+ consecutive probes, or custom metric conditions. Assign notification channels (email, SMS, Slack webhook) per alert rule.' },
    { step: 3, title: 'Install the Profiler SDK', desc: 'Add the Echo Diagnostics SDK to your Workers for deep request tracing. The SDK wraps your fetch handlers with automatic timing, captures D1 query durations, measures KV read latency, and reports cold start events. Total overhead is under 2ms per request.' },
    { step: 4, title: 'Set Up Dependency Mapping', desc: 'Define the service dependency graph so Echo Diagnostics can trace failures to root causes. When Service A depends on Service B, and Service B is degraded, alerts for Service A reference the upstream dependency rather than generating duplicate noise.' },
    { step: 5, title: 'Review Your First Report', desc: 'After 24 hours of data collection, access the Profiler Report for a baseline analysis of your system health. The report highlights the slowest endpoints, most error-prone services, and dependencies with the highest failure rates, along with specific optimization recommendations.' },
  ],
  features: [
    { title: 'Real-Time Health Checks', desc: 'Continuous health probing from 20+ global edge locations every 30 seconds. Each probe tests endpoint availability, response time, TLS certificate validity, and response body assertions. Failures are confirmed from multiple locations before triggering alerts to eliminate false positives from network partitions.' },
    { title: 'Latency Monitoring', desc: 'Sub-millisecond precision timing for every monitored endpoint with P50, P90, P95, and P99 percentile tracking. Latency is measured from multiple geographic regions to identify location-specific performance issues. Baseline drift detection alerts when latency gradually increases beyond historical norms.' },
    { title: 'Error Rate Tracking', desc: 'Real-time error rate monitoring with breakdowns by HTTP status code, error type, and endpoint. Tracks 4xx (client errors) and 5xx (server errors) separately with configurable thresholds for each. Error rate spikes trigger immediate alerts with sample error responses for quick debugging.' },
    { title: 'Memory Profiling', desc: 'Worker memory utilization tracking across request lifecycles. Identifies memory leaks by analyzing heap growth patterns over time. Alerts when workers approach the 128MB memory limit, giving you time to optimize before crashes occur. Memory snapshots can be captured on demand for detailed analysis.' },
    { title: 'CPU Utilization', desc: 'CPU time tracking per request with breakdown by processing phase (parsing, business logic, serialization, I/O wait). Identifies compute-heavy operations that risk exceeding the Worker CPU time limit. Historical trending shows the impact of code changes on CPU consumption.' },
    { title: 'Database Query Analysis', desc: 'Automatic D1 query profiling that captures execution time, rows scanned, rows returned, and query plan for every database operation. Highlights slow queries, missing indexes, and N+1 query patterns. Provides specific index recommendations based on actual query patterns observed in production.' },
    { title: 'Endpoint Response Times', desc: 'Granular response time tracking per endpoint with time-series visualization. Compare response times across deployments to identify regressions. Supports custom timing annotations via the SDK to measure specific code sections within a request (e.g., "auth check: 12ms, data fetch: 45ms, render: 8ms").' },
    { title: 'Alerting Thresholds', desc: 'Configurable multi-condition alert rules with severity levels (info, warning, critical). Alerts support composite conditions (e.g., "error rate > 5% AND response time P95 > 500ms"). Notification channels include email, SMS via Twilio, Slack webhooks, PagerDuty, and custom webhook URLs.' },
    { title: 'Historical Trends', desc: '90-day data retention with configurable aggregation intervals (1min, 5min, 1hr, 1day). Trend visualization overlays deployments, incidents, and configuration changes on metric graphs for correlation. Export historical data via CSV or the analytics API for custom reporting and capacity planning.' },
    { title: 'Dependency Mapping', desc: 'Visual service dependency graph showing how your Workers interconnect via service bindings, fetch calls, and shared D1/KV/R2 resources. Failure propagation analysis traces the blast radius of any single service degradation. Dependency health status is aggregated into the parent service health score.' },
    { title: 'Load Testing', desc: 'Built-in load testing that generates configurable traffic patterns (constant, ramp-up, spike, soak) against your endpoints from distributed edge locations. Measures throughput ceiling, breaking point, error rate under load, and recovery time after load subsides. Tests run in isolation with dedicated traffic markers to avoid polluting production metrics.' },
    { title: 'Auto-Remediation', desc: 'Automated response actions triggered by alert conditions. Configurable remediation playbooks can restart unhealthy Workers (via Wrangler API), clear KV cache keys, trigger DNS failover to backup endpoints, or execute custom webhook-based recovery scripts. All actions are logged with before/after health status for audit.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/health', desc: 'Aggregate health status across all monitored services. Returns overall system health (healthy, degraded, critical), individual service statuses, active alerts, and the timestamp of the last successful check for each service.', auth: true },
    { method: 'GET', path: '/metrics', desc: 'Current and historical metrics for all monitored endpoints. Supports filtering by service, metric type (latency, errors, memory, cpu), time range, and aggregation interval. Returns time-series data points suitable for charting.', auth: true },
    { method: 'GET', path: '/profiler/report', desc: 'Generate a performance profiling report for a specified time window. Includes slowest endpoints ranked by P95 latency, highest error rate services, database query analysis with optimization suggestions, and cold start frequency analysis.', auth: true },
    { method: 'POST', path: '/alerts/configure', desc: 'Create or update alert rules. Specify the metric, condition operator, threshold value, evaluation window, severity level, and notification channels. Supports composite conditions with AND/OR logic across multiple metrics.', auth: true },
    { method: 'GET', path: '/dependencies', desc: 'Retrieve the service dependency graph with current health status for each node and edge. Includes failure propagation analysis showing which downstream services are affected by each dependency. Useful for incident response and architecture documentation.', auth: true },
    { method: 'POST', path: '/loadtest/run', desc: 'Initiate a load test against specified endpoints. Configure the traffic pattern (constant/ramp/spike/soak), requests per second, duration, geographic distribution, and custom headers. Returns a test ID for polling results via GET /loadtest/:id.', auth: true },
  ],
  userGuide: [
    { title: 'Setting Up Monitoring for Your Services', id: 'setup-monitoring', content: [
      'Start by adding your most critical services — typically your API gateway, authentication service, and primary database-backed endpoints. For each service, provide the base URL, health check path, and expected response time. Echo Diagnostics begins probing immediately and establishes a performance baseline over the first 24 hours.',
      'For deeper visibility, install the Echo Diagnostics SDK in your Workers. The SDK is a lightweight wrapper (under 3KB) that instruments your fetch handler with automatic timing, error capture, and request tracing. Add it with a single line: import { withDiagnostics } from "echo-diagnostics-sdk" and wrap your default export.',
      'Group related services into logical environments (production, staging, development) to keep dashboards organized. Each environment has its own alert rules and notification channels, preventing staging noise from reaching on-call engineers.',
    ] },
    { title: 'Responding to Alerts and Incidents', id: 'incident-response', content: [
      'When an alert fires, the notification includes the service name, metric that triggered, current value versus threshold, and a direct link to the relevant dashboard view. Start by checking the dependency graph — if an upstream service is also alerting, focus on the root cause rather than the symptoms.',
      'Use the Profiler Report to identify what changed. Filter the time range to the window when the alert began and compare against the previous period. Look for deployment markers, traffic spikes, or dependency degradation that correlates with the metric change.',
      'For recurring issues, configure auto-remediation playbooks. Common patterns include: cache-clear on error rate spike, Worker restart on memory threshold breach, and DNS failover on sustained health check failure. Every automated action is logged and can be reviewed or rolled back from the Remediation History page.',
    ] },
    { title: 'Running Load Tests', id: 'load-testing', content: [
      'Before running load tests against production endpoints, ensure your alert rules have a "load-test" suppression tag configured. This prevents load test traffic from triggering false alerts. Alternatively, run load tests against a staging environment that mirrors production.',
      'Choose the appropriate traffic pattern for your testing goal: "constant" for baseline throughput measurement, "ramp" for finding the breaking point, "spike" for testing burst handling, and "soak" for identifying memory leaks and gradual degradation over extended periods. Start with conservative request rates and increase incrementally.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'Anomaly Detection', desc: 'Machine learning models establish dynamic baselines for every metric across each service, accounting for daily and weekly traffic patterns. Anomalies are detected when metrics deviate beyond the predicted range, catching issues that static thresholds miss — like a 30% latency increase during a typically low-traffic period that would still be below a fixed threshold.' },
    { capability: 'Root Cause Analysis', desc: 'When multiple alerts fire simultaneously, the AI correlates timing, dependency relationships, and metric patterns to identify the most likely root cause. Instead of five separate alerts saying "Service A, B, C, D, E degraded," you get one insight: "Database connection pool exhaustion on D1 instance is causing cascading failures across 5 dependent services."' },
    { capability: 'Predictive Alerting', desc: 'Trend analysis models project metric trajectories forward and alert before thresholds are breached. If memory usage is growing linearly and will exceed 128MB within 4 hours based on current trajectory, you receive a predictive alert with time-to-breach and recommended action — giving you hours instead of seconds to respond.' },
    { capability: 'Optimization Recommendations', desc: 'AI analyzes profiling data across your entire service fleet and generates actionable optimization suggestions. Recommendations include specific database indexes to add (based on actual query patterns), caching opportunities for frequently-fetched data, and code-level suggestions for reducing CPU time in hot paths.' },
  ],
  troubleshooting: [
    { issue: 'Health checks showing false failures', solution: 'False health check failures typically result from network routing issues at specific edge locations. Check the failure details — if failures are isolated to one or two probe locations while others succeed, the issue is transient network connectivity, not a real outage. Increase the confirmation threshold from 1 to 3 consecutive failures before alerting. Also verify your health endpoint responds within the configured timeout (default 10 seconds) under all conditions.' },
    { issue: 'Profiler SDK not reporting data', solution: 'Verify the SDK is correctly wrapping your Worker\'s default export: export default withDiagnostics(handler, { serviceId: "your-service-id" }). Check that the serviceId matches the service registered in your Echo Diagnostics dashboard. If the Worker uses service bindings, ensure the diagnostics reporting endpoint is accessible from your Worker\'s environment. Check the Worker\'s console logs for any SDK initialization errors.' },
    { issue: 'Alert notifications not being delivered', solution: 'Test each notification channel independently from the Alert Rules settings page. For email, verify the recipient address is not filtering Echo Diagnostics messages to spam. For Slack webhooks, confirm the webhook URL is still active (Slack deactivates unused webhooks after 60 days). For SMS, verify the phone number format (E.164) and that your Twilio account has sufficient balance.' },
    { issue: 'Load test results showing unexpected errors', solution: 'High error rates during load testing often indicate rate limiting by Cloudflare or the target service rather than actual application failures. Check if errors are 429 (rate limited) or 503 (capacity). Increase your Worker\'s rate limit or add the load test source IPs to your allowlist. If errors are 500s, the application may have a concurrency bug — reduce the RPS and examine error response bodies for specific failure details.' },
  ],
  faq: [
    { q: 'How often are health checks performed?', a: 'Health checks run every 30 seconds from 20+ global edge locations by default. You can adjust the interval from 10 seconds (for critical services) to 5 minutes (for non-critical endpoints). More frequent checks provide faster detection but consume more probe quota.' },
    { q: 'How long is monitoring data retained?', a: 'Raw metric data (1-second granularity) is retained for 7 days. Aggregated data at 1-minute intervals is retained for 30 days. Hourly aggregates are retained for 90 days. Daily aggregates are retained for 1 year. Alert history and incident logs are retained indefinitely.' },
    { q: 'Does the profiler SDK impact my Worker performance?', a: 'The SDK adds less than 2ms of overhead per request and approximately 3KB to your Worker bundle size. Timing measurements use the high-resolution performance.now() API and are non-blocking. Diagnostic data is batched and reported asynchronously after the response is sent to the client, so there is zero impact on user-facing latency.' },
    { q: 'Can I monitor services outside of Cloudflare Workers?', a: 'Yes. The health check and latency monitoring features work with any publicly accessible HTTP endpoint — AWS Lambda, Google Cloud Functions, traditional servers, or third-party APIs. The deep profiling SDK is currently Cloudflare Worker-specific, but external services can report custom metrics via the metrics ingestion API.' },
    { q: 'How does auto-remediation avoid making things worse?', a: 'Auto-remediation playbooks include circuit breakers that prevent repeated execution. Each playbook has a cooldown period (default 15 minutes) during which it will not fire again. Playbooks also have a maximum execution count per incident (default 3). If the issue persists after max retries, the system escalates to human notification instead of continuing automated actions.' },
  ],
}

export default function Page() { return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/diagnostics' },
      ]} />
      <ProductDoc {...data} />
    </>
  ) }
