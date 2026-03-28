'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Data Pipeline',
  tagline: 'Serverless data ingestion, transformation, and routing across your entire data stack.',
  accent: '#0d9488',
  productUrl: '/pipelines',
  workerUrl: 'https://echo-data-pipeline.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Data Pipeline is a serverless event processing engine that ingests data from any source, transforms it through configurable processing steps, and routes it to one or more destinations. Built entirely on Cloudflare Workers, the pipeline processes millions of events per day with sub-100ms end-to-end latency, zero servers to manage, and automatic scaling from zero to peak traffic.',
    'Unlike traditional ETL tools that require dedicated infrastructure and batch-oriented scheduling, Echo Data Pipeline operates in real time. Events enter via HTTP webhook, message queue, or scheduled pull, pass through your configured transformation chain (filtering, enrichment, schema mapping, aggregation), and exit to destinations including databases, data warehouses, APIs, message queues, and storage buckets.',
    'Every pipeline includes built-in observability: event counts, throughput rates, error rates, processing latency, and dead letter queue depth are tracked automatically. Schema validation catches malformed events before they corrupt downstream systems. Retry policies with exponential backoff ensure no data is lost during transient failures. Whether you are building a real-time analytics stream, a data synchronization layer, or an event-driven architecture, Echo Data Pipeline provides the connective tissue.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your First Pipeline', desc: 'Navigate to the Pipelines dashboard and click Create Pipeline. Name your pipeline, select a source type (HTTP webhook, scheduled pull, or queue subscription), and configure the source connection. The system generates a unique ingestion URL for HTTP sources.' },
    { step: 2, title: 'Define Your Schema', desc: 'Upload a JSON Schema or define fields manually to validate incoming events. The schema enforces required fields, data types, value ranges, and format constraints. Events failing validation are routed to the dead letter queue with detailed error annotations.' },
    { step: 3, title: 'Add Transformation Steps', desc: 'Build your transformation chain by adding steps: filter (drop events matching conditions), map (rename or restructure fields), enrich (add data from external lookups), compute (calculate derived fields), and aggregate (batch events into windows).' },
    { step: 4, title: 'Configure Destinations', desc: 'Add one or more output destinations. Each destination receives the transformed events independently. Supported destinations include Cloudflare D1, R2, KV, HTTP endpoints, PostgreSQL, BigQuery, S3, and Kafka. Configure per-destination batching and retry policies.' },
    { step: 5, title: 'Activate and Monitor', desc: 'Toggle the pipeline to Active and send a test event to verify end-to-end processing. The monitoring dashboard shows real-time throughput, latency, success rate, and any errors. Set up alert thresholds to be notified when error rates exceed acceptable levels.' },
  ],
  features: [
    { title: 'Event Ingestion', desc: 'Accept events via HTTP POST (webhooks, API calls), scheduled HTTP pulls from external APIs, Cloudflare Queue subscriptions, and R2 object creation triggers. Each ingestion source gets a unique URL with HMAC authentication. Supports batched and single-event payloads up to 10MB.' },
    { title: 'Data Transformation', desc: 'Chain together transformation steps including field mapping (rename, restructure, type cast), filtering (drop or route events by condition), computed fields (arithmetic, string manipulation, date math), and custom JavaScript transform functions for complex logic.' },
    { title: 'Routing Rules', desc: 'Route events to different destinations based on content. Define rules using field values, regex patterns, or JavaScript expressions. A single event can be routed to multiple destinations simultaneously, or split into separate streams for different processing paths.' },
    { title: 'Batch Processing', desc: 'Aggregate individual events into batches by count, size, or time window before forwarding to destinations. Configurable batch sizes from 1 to 10,000 events and time windows from 1 second to 24 hours. Reduces API calls to downstream systems and improves throughput.' },
    { title: 'Real-Time Streaming', desc: 'Process events in real time with sub-100ms latency from ingestion to destination delivery. No batching delays when immediate processing is required. Supports server-sent events (SSE) for clients that need live event streams.' },
    { title: 'Schema Validation', desc: 'Validate every event against a JSON Schema before processing. Supports Draft 2020-12 with custom format validators. Invalid events are rejected with detailed error messages and optionally routed to a dead letter queue for manual review or automated repair.' },
    { title: 'Dead Letter Queues', desc: 'Events that fail processing, validation, or destination delivery are captured in a dead letter queue (DLQ) with full context: original event, error message, processing step that failed, and timestamp. Review, repair, and replay DLQ events from the dashboard.' },
    { title: 'Retry Policies', desc: 'Configure retry behavior per destination: maximum attempts (1-10), backoff strategy (fixed, linear, exponential), initial delay, maximum delay, and jitter. Failed events are retried automatically. After exhausting retries, events move to the dead letter queue.' },
    { title: 'Pipeline Monitoring', desc: 'Real-time metrics for every pipeline: events ingested, events processed, events delivered, events failed, processing latency (p50, p95, p99), throughput (events/second), and DLQ depth. Metrics retained for 30 days with 1-minute granularity.' },
    { title: 'Multi-Destination Output', desc: 'Fan out processed events to multiple destinations simultaneously. Each destination operates independently with its own batching, retry, and formatting configuration. If one destination fails, others continue receiving events uninterrupted.' },
    { title: 'Data Enrichment', desc: 'Enrich events in-flight by looking up additional data from external APIs, Cloudflare KV stores, D1 databases, or R2 objects. Lookup results are cached with configurable TTL to minimize external API calls. Enrichment adds context like geo-IP data, user profiles, or product details.' },
    { title: 'Pipeline Templates', desc: 'Start from pre-built templates for common use cases: webhook relay, API aggregation, log processing, event archival, data synchronization, and analytics stream. Templates include pre-configured sources, transforms, and destinations that you customize for your specific needs.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/events/ingest', desc: 'Ingest one or more events into a pipeline. Accepts single event objects or batched arrays. Returns ingestion receipt with event IDs, validation status, and estimated processing time. Supports Content-Type application/json and application/x-ndjson for streaming ingestion.', auth: true },
    { method: 'GET', path: '/pipelines', desc: 'List all pipelines with status (active, paused, error), event counts, throughput, error rate, and last activity timestamp. Supports filtering by status and sorting by any metric. Includes pagination for accounts with many pipelines.', auth: true },
    { method: 'POST', path: '/pipelines/create', desc: 'Create a new pipeline. Body includes name, source configuration, schema definition, transformation chain (ordered array of step objects), destination configurations, retry policies, and alerting thresholds. Returns the pipeline ID and generated ingestion URL.', auth: true },
    { method: 'GET', path: '/metrics', desc: 'Retrieve pipeline metrics for a specified time range. Returns time-series data for ingestion rate, processing rate, delivery rate, error rate, latency percentiles, and DLQ depth. Supports per-pipeline or aggregate views with minute, hour, or day granularity.', auth: true },
    { method: 'POST', path: '/transforms', desc: 'Test a transformation chain against sample events without creating a pipeline. Submit the transform steps and an array of test events. Returns the transformed output for each event, showing exactly how data flows through each step. Useful for development and debugging.', auth: true },
    { method: 'GET', path: '/destinations', desc: 'List all configured destinations across pipelines with health status, delivery success rate, average latency, and last delivery timestamp. Identify underperforming destinations and view error logs per destination.', auth: true },
  ],
  userGuide: [
    {
      title: 'Building Transformation Chains',
      id: 'transformation-chains',
      content: [
        'Transformation chains are ordered sequences of processing steps that events pass through after ingestion and validation. Each step receives the event from the previous step and outputs a modified event to the next step. Steps execute synchronously in order.',
        'The Filter step evaluates a condition against the event and either passes it through or drops it. Conditions support field comparisons (equals, contains, greater than, regex match), boolean logic (AND, OR, NOT), and nested field access using dot notation. Dropped events are counted in metrics but not sent to destinations.',
        'The Map step restructures the event by renaming fields, moving nested fields to top level, removing unwanted fields, or changing data types (string to number, ISO date to Unix timestamp). Map steps are the most common transformation for adapting source data formats to destination requirements.',
        'The Enrich step pauses processing to fetch additional data from an external source (API call, KV lookup, D1 query) and merges the result into the event. Configure a cache TTL to avoid redundant lookups. If the enrichment source is unavailable, configure whether to pass the event through without enrichment or route it to the DLQ.',
        'The Compute step adds new fields derived from existing fields using expressions. Supported operations include arithmetic (price * quantity), string concatenation, date calculations (days between two dates), conditional logic (if status equals "paid" then "complete" else "pending"), and hash functions.',
      ],
    },
    {
      title: 'Configuring Destinations',
      id: 'configuring-destinations',
      content: [
        'Each pipeline can output to one or more destinations. Navigate to your pipeline settings and click Add Destination. Select the destination type and provide connection details. All credentials are stored encrypted and never exposed in logs or the dashboard.',
        'For Cloudflare D1 destinations, select the database and table. The pipeline auto-maps event fields to table columns by name. For fields that do not match, configure explicit column mappings. The pipeline uses INSERT statements by default with optional ON CONFLICT (upsert) behavior for idempotent delivery.',
        'For HTTP destinations, provide the URL, method (POST or PUT), headers, and optional authentication (Bearer token, API key header, or Basic auth). Events are delivered as JSON in the request body. Batch mode sends arrays of events in a single request to reduce HTTP overhead for high-throughput pipelines.',
        'Each destination has independent batching and retry configuration. A destination receiving 1,000 events per second might batch into groups of 100 every 500ms, while another destination receiving the same events might process them individually in real time. This flexibility lets you optimize for each downstream system.',
      ],
    },
    {
      title: 'Handling Failures and Dead Letters',
      id: 'failure-handling',
      content: [
        'Echo Data Pipeline is designed for zero data loss. Every event that enters the system is either successfully delivered to all destinations or captured in the dead letter queue (DLQ) with full diagnostic context.',
        'When a destination returns an error, the retry policy activates. Exponential backoff with jitter is the recommended strategy: it prevents thundering herd problems when a destination recovers from an outage. Configure max retries between 3 and 10 depending on your tolerance for delivery delay.',
        'The DLQ dashboard shows all failed events grouped by pipeline, error type, and destination. Select events individually or in bulk to replay them through the pipeline. Before replaying, you can edit events to fix malformed data or update stale references. Replayed events go through the full transformation chain again.',
        'Set up DLQ alerts to be notified when the queue depth exceeds a threshold. A growing DLQ typically indicates a systemic issue with a destination (database full, API key expired, schema mismatch) that needs attention rather than event-by-event troubleshooting.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Intelligent Schema Inference', desc: 'Automatically infers JSON Schema from sample events using statistical analysis of field types, value distributions, and structural patterns. Handles polymorphic fields, optional properties, and nested objects. Generates a draft schema you can review and refine before activating validation.' },
    { capability: 'Anomaly Detection in Event Streams', desc: 'Monitors event volume, field value distributions, and structural patterns in real time. Detects anomalies like sudden volume spikes, missing fields that are normally present, value range violations, and structural changes that might indicate upstream bugs or data quality issues.' },
    { capability: 'Auto-Mapping for Destinations', desc: 'When connecting a new destination, the AI analyzes the destination schema (database table columns, API expected fields) and your event structure to suggest optimal field mappings. Handles name variations (created_at vs createdAt vs creation_date) and type conversions automatically.' },
    { capability: 'Smart Retry Optimization', desc: 'Learns from historical failure patterns to optimize retry timing per destination. If a destination consistently recovers within 30 seconds, retries are scheduled tightly. If recovery typically takes 5 minutes, early retries are skipped to reduce wasted requests and improve overall throughput.' },
  ],
  troubleshooting: [
    { issue: 'Events not arriving at destination', solution: 'Check the pipeline metrics for processing and delivery rates. If events are being ingested but not delivered, look at the destination health panel for error messages. Common causes include expired API keys, destination rate limits, network connectivity issues, and schema mismatches where the transformed event does not match the destination expectations.' },
    { issue: 'High dead letter queue depth', solution: 'A growing DLQ usually indicates a systemic issue rather than individual bad events. Check the DLQ entries for common error patterns. If most failures share the same error (e.g., "connection refused"), the destination may be down. If errors vary (e.g., "field X is required"), your transformation chain may not be handling all event variations correctly.' },
    { issue: 'Processing latency increasing over time', solution: 'Check if enrichment steps are the bottleneck by reviewing per-step latency in the pipeline metrics. Enrichment calls to external APIs are the most common source of latency. Increase cache TTL for enrichment lookups, add more aggressive caching, or switch to KV-based enrichment for frequently accessed reference data.' },
    { issue: 'Schema validation rejecting valid events', solution: 'Review the validation errors in the DLQ to identify which schema constraint is failing. Common issues include overly strict type constraints (number vs string containing a number), missing optional field handling, and date format mismatches. Update your schema to use union types, coercion, or format alternatives. Test changes with the /transforms endpoint before deploying.' },
  ],
  faq: [
    { q: 'How many events can a single pipeline process?', a: 'Each pipeline can process up to 10,000 events per second sustained, with burst capacity to 50,000 events per second. For workloads exceeding these limits, create multiple pipelines with a load balancer distributing events across them. There is no limit to the number of pipelines per account.' },
    { q: 'What happens during a Cloudflare outage?', a: 'Cloudflare Workers run across 300+ data centers globally. Regional outages are handled by automatic failover to the nearest healthy data center. In the extremely rare event of a global outage, events sent to the ingestion endpoint receive a 503 response. Configure your event producers to buffer and retry, and no data will be lost.' },
    { q: 'Can I use custom JavaScript in transformations?', a: 'Yes. The Custom Function step accepts JavaScript code that receives the event as input and returns the transformed event. Functions run in an isolated V8 sandbox with a 10ms execution time limit and no network access. This is ideal for complex transformations that cannot be expressed with the built-in step types.' },
    { q: 'How are credentials for destinations stored?', a: 'All destination credentials (API keys, database passwords, OAuth tokens) are encrypted at rest using AES-256-GCM with keys managed by Cloudflare. Credentials are never logged, never exposed in the dashboard after initial entry, and are only decrypted at the moment of destination delivery within the Worker runtime.' },
    { q: 'Can I replay historical events through a modified pipeline?', a: 'Yes. Every successfully ingested event is stored in the event archive for 7 days (configurable up to 90 days on Enterprise). You can replay any time range of archived events through the current pipeline configuration, which is useful for backfilling after adding a new destination or fixing a transformation bug.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }
