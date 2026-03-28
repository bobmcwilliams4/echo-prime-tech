'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Phoenix Cloud',
  tagline: 'Disaster recovery and system resurrection platform ensuring Echo systems survive any failure',
  accent: '#f97316',
  productUrl: '/phoenix-cloud',
  workerUrl: 'echo-phoenix-cloud.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Phoenix Cloud is the disaster recovery and system resurrection platform for the entire Echo ecosystem. Every registered service is continuously snapshotted, cross-region replicated, and dependency-mapped so that any failure — from a single Worker crash to a complete regional outage — can be recovered in under 60 seconds.',
    'State snapshots capture the complete runtime state of each service: configuration, in-flight tasks, database contents, KV data, and R2 object checksums. Snapshots are replicated across Cloudflare global network with three-region redundancy. One-click recovery restores a service to its last healthy state without manual intervention.',
    'Version rollback lets you rewind any service to any prior snapshot, not just the most recent. The dependency graph ensures rollbacks cascade correctly — if Service A depends on Service B, rolling back A to a version that requires an older B automatically identifies the required B snapshot. Recovery playbooks document exact steps for every registered failure scenario.',
  ],
  gettingStarted: [
    { step: 1, title: 'Register your services', desc: 'POST to /services/register with your service name, Worker URL, environment, and dependency list. Phoenix Cloud begins health checking and snapshotting within 60 seconds of successful registration.' },
    { step: 2, title: 'Configure snapshot schedule', desc: 'Set snapshot frequency per service: continuous (on every state change), hourly, or daily. Critical services should use continuous snapshots. Snapshots complete in under 500ms and do not impact service performance.' },
    { step: 3, title: 'Set replication targets', desc: 'Choose two or more Cloudflare regions as replication targets. Snapshots write to primary storage (D1 and R2) then replicate asynchronously. Target RPO under 30 seconds for services on continuous snapshot schedules.' },
    { step: 4, title: 'Test recovery procedures', desc: 'Run a recovery drill from the Testing tab. Phoenix Cloud spins up a shadow instance in an isolated namespace, restores the latest snapshot, runs automated health checks, and reports recovery time and any state gaps detected.' },
    { step: 5, title: 'Enable monitoring and alerts', desc: 'Configure health thresholds and alert channels (webhook, email, or Echo Commander notification). Alerts fire when health checks fail, replication lag exceeds threshold, or backup age exceeds the configured schedule.' },
  ],
  features: [
    { title: 'Automatic State Snapshots', desc: 'Continuous, hourly, or daily snapshots capture complete service state including configuration, active task queues, D1 database tables, KV namespaces, and R2 object manifests. Snapshot overhead is under 500ms per capture.' },
    { title: 'Cross-Region Replication', desc: 'Every snapshot is replicated to two or more Cloudflare regions within 30 seconds of creation. Replication status is tracked per snapshot with alerts if any region falls behind the configured lag threshold.' },
    { title: 'One-Click System Recovery', desc: 'Select any service and snapshot from the recovery dashboard, click Restore, and Phoenix Cloud handles routing cutover, state restoration, dependency re-wiring, and health verification automatically.' },
    { title: 'Version Rollback', desc: 'Roll back any service to any prior snapshot by version number or timestamp. The system presents a diff showing configuration and state changes between the current version and the rollback target before execution.' },
    { title: 'Dependency Graph Tracking', desc: 'Phoenix Cloud maintains a live dependency graph for all registered services. Rollback operations check the graph to identify downstream services that may require coordinated rollback or compatibility patches.' },
    { title: 'Health Monitoring', desc: 'Continuous HTTP health checks against each registered service /health endpoint. Failure thresholds are configurable per service. Three consecutive failures trigger automatic recovery initiation if auto-recovery is enabled.' },
    { title: 'Recovery Testing', desc: 'Isolated recovery drills spin up shadow instances to validate snapshots are restorable without affecting production. Drills produce detailed reports including RTO measurement, health check results, and data integrity percentages.' },
    { title: 'Backup Scheduling', desc: 'Flexible cron-based backup scheduling with per-service overrides. Schedules can be paused during maintenance windows and auto-resumed. Missed backups due to service downtime are queued and executed on service recovery.' },
    { title: 'Data Integrity Verification', desc: 'Every snapshot includes SHA-256 checksums for all state components. Integrity is verified at replication time and again at restore time. Corrupted snapshots are quarantined and the next valid snapshot is used automatically.' },
    { title: 'Recovery Playbooks', desc: 'Auto-generated step-by-step recovery procedures for each registered service and failure scenario. Playbooks are built from the dependency graph and updated after every successful recovery drill and production incident.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/snapshot', desc: 'Trigger an on-demand snapshot for a registered service. Body: { service_id, include_deps }. Returns snapshot ID, storage location, and checksum for verification.', auth: true },
    { method: 'POST', path: '/recover', desc: 'Initiate service recovery from a specific snapshot. Body: { service_id, snapshot_id, dry_run }. Returns recovery job ID for status polling and estimated completion time.', auth: true },
    { method: 'GET', path: '/backups', desc: 'List all snapshots for a service or all services. Filter by date range, version number, and replication region. Returns snapshot metadata including size, integrity status, and region coverage.', auth: true },
    { method: 'GET', path: '/health', desc: 'Return health status for all registered services including last check time, consecutive failure count, replication lag, and current recovery job status if any.', auth: false },
    { method: 'POST', path: '/rollback/:version', desc: 'Roll back a service to a specific version. Includes dependency impact analysis before execution. Requires confirmation token from the impact analysis response to proceed.', auth: true },
    { method: 'GET', path: '/dependencies', desc: 'Return the full dependency graph for all registered services as a directed acyclic graph in JSON. Includes version compatibility ranges per service edge.', auth: true },
  ],
  userGuide: [
    {
      title: 'Configuring Backups',
      id: 'backups',
      content: [
        'Snapshot configuration is set per service via the Services dashboard or API. Choose snapshot frequency based on your service change rate and acceptable RPO: continuous for stateful services with active task queues, hourly for moderate write volume, daily for read-heavy or configuration-only services.',
        'State scope determines what is captured in each snapshot. By default Phoenix Cloud captures Worker environment variables, D1 table contents, KV key-value pairs, and R2 object checksums. Exclude large, easily-regenerated datasets from snapshot scope to reduce storage cost and snapshot duration.',
        'Retention policies control how many snapshots are kept per service. The recommended policy retains the last 24 hourly snapshots, the last 7 daily snapshots, and one weekly snapshot per month. Foundation snapshots (manually pinned) are never pruned regardless of retention policy.',
      ],
    },
    {
      title: 'Recovery Procedures',
      id: 'recovery',
      content: [
        'Standard recovery from the dashboard takes three steps: select the service, select the target snapshot (default: last healthy), and click Restore. Phoenix Cloud routes traffic away from the failed service, restores state to the target snapshot, runs health checks, and cuts traffic back when checks pass.',
        'For cascading failures affecting multiple services, use the Dependency Recovery flow. Provide the root-cause service; Phoenix Cloud analyzes the dependency graph and presents an ordered recovery plan for all affected services. Approve the plan to execute recovery in the correct dependency order.',
        'Dry run mode (set dry_run: true in the API or toggle in dashboard) simulates recovery without modifying production state. Dry runs confirm the snapshot is restorable and estimate recovery duration. Always run a dry run before executing recovery on a production service during a live incident.',
      ],
    },
    {
      title: 'Testing Disaster Recovery',
      id: 'testing',
      content: [
        'Schedule monthly recovery drills via the Testing tab. Each drill selects a service, spins up an isolated shadow environment on Cloudflare Workers, restores the latest snapshot, and runs the health endpoint sequence. The drill report shows RTO, data completeness percentage, and configuration drift detected.',
        'Chaos testing mode injects specific failure scenarios — region outage, database corruption, dependency failure — to validate that recovery procedures handle each scenario correctly. Chaos tests run in isolated environments and do not affect production services or real data.',
        'Track drill history in the Testing dashboard. RTO trend charts show whether recovery times are improving or degrading over time. Drills that exceed your RTO SLA trigger automatic investigation workflows to identify the bottleneck causing the regression.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Failure Prediction', desc: 'Anomaly detection models analyze health check latency trends, error rate patterns, and resource utilization to predict service failures 5–15 minutes before they occur, triggering proactive snapshot creation and alerting the operations team.' },
    { capability: 'Optimal Recovery Path Selection', desc: 'When multiple recovery snapshots are available, the AI evaluates each candidate on data completeness, time distance from failure, and dependency compatibility to recommend the snapshot with the highest probability of clean, complete recovery.' },
    { capability: 'Dependency Impact Analysis', desc: 'Before any rollback, the dependency analysis engine traverses the full service graph to identify which downstream services will be affected, what version compatibility constraints apply, and whether coordinated multi-service rollback is required.' },
    { capability: 'Backup Prioritization', desc: 'Resource-aware backup scheduling prioritizes snapshot creation during low-traffic windows, deprioritizes services with minimal change rates, and accelerates backups for services showing early failure prediction signals.' },
  ],
  troubleshooting: [
    { issue: 'Snapshot failing with timeout error', solution: 'Large D1 tables or R2 buckets may exceed the 30-second snapshot window. Exclude high-volume easily-regenerated tables from snapshot scope in the service configuration. Alternatively, enable incremental snapshots which capture only changed rows and objects since the prior snapshot.' },
    { issue: 'Recovery taking longer than expected RTO', solution: 'Check replication lag via GET /health — if the target region replica is stale, recovery must fetch data from primary storage which adds latency. Increase replication targets to include a region geographically closer to your recovery site.' },
    { issue: 'Version rollback blocked by dependency conflict', solution: 'The dependency impact analysis identified an incompatible downstream service. Review the conflict details in the rollback response and either roll back the conflicting service to a compatible version or set override_conflicts: true if you have confirmed compatibility.' },
    { issue: 'Health checks passing but service behaving incorrectly after recovery', solution: 'The /health endpoint passed but application state may have semantic inconsistencies. Run the recovery drill in dry run mode to compare restored state against expected state. If drift is detected, restore from an older snapshot with a higher data completeness score.' },
  ],
  faq: [
    { q: 'What is the maximum snapshot size?', a: 'Individual snapshots support up to 10 GB of D1 data, unlimited KV keys (up to 25 MB per value), and full R2 object manifests. Services exceeding these limits should use incremental snapshots which capture only changed data since the last snapshot.' },
    { q: 'How long does a full recovery take?', a: 'Median recovery time for a standard Echo Worker is 8–12 seconds. Services with large D1 databases or many KV keys may take 30–60 seconds. The recovery drill report shows actual RTO for your specific service configuration before a production incident occurs.' },
    { q: 'Can Phoenix Cloud recover a service that was deleted from Cloudflare?', a: 'Yes, if a snapshot was taken before deletion. Phoenix Cloud stores the Worker script, bindings, and environment configuration in R2 alongside state data. Recovery deploys a new Worker from the snapshot and restores all associated state.' },
    { q: 'Is Phoenix Cloud itself protected against failure?', a: 'Phoenix Cloud runs on Cloudflare Workers with built-in edge redundancy. Its own state is replicated to three regions via Cloudflare D1 and Durable Objects. In the unlikely event of a Phoenix Cloud failure, snapshots remain directly accessible in R2.' },
    { q: 'How are secrets handled in snapshots?', a: 'Worker secrets (environment variables marked as sensitive) are excluded from snapshots by default. Secret names are recorded but values are not stored. On recovery, secrets are re-injected from the Echo Vault API using the stored secret name references.' },
  ],
}

export default function PhoenixCloudDocsPage() {
  return <ProductDoc {...data} />
}
