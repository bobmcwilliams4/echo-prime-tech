'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Autonomous Builder',
  tagline: 'Self-operating execution engine — automatic QA bug fixing, worker warming, thin page generation, and fleet-wide upgrades.',
  accent: '#dc2626',
  productUrl: '/autonomous-builder',
  workerUrl: 'https://echo-autonomous-builder.bmcii1976.workers.dev',
  version: '1.2.0',

  overview: [
    'Echo Autonomous Builder is the execution engine of ECHO OMEGA PRIME — the system that turns monitoring data into automated fixes. While the Autonomous Daemon watches for problems, the Builder solves them: warming cold workers, resolving QA false positives, fixing thin pages by generating content via AI, and scanning the entire fleet for bugs.',
    'Running on 4 cron schedules (every 5 minutes for warmups, every 30 minutes for QA/daemon/fixes, every 4 hours for full audit and bug hunts, daily at 8am for briefings), the Builder operates 24/7 without human intervention. It has 25 service bindings connecting it to the entire Echo ecosystem.',
    'Day 1 statistics demonstrated the system\'s value: 110 worker warmups, 96 QA bugs auto-resolved, 23 daemon tasks completed, 85 workers scanned, and 2 thin pages fixed and deployed to GitHub — all autonomously.',
  ],

  gettingStarted: [
    { step: 1, title: 'Deploy the Worker', desc: 'Deploy echo-autonomous-builder to Cloudflare with all 25 service bindings configured. D1 database and KV namespace must be provisioned.' },
    { step: 2, title: 'Configure Critical Workers', desc: 'Set the list of 11 critical workers that need warm-up pings to prevent cold-start latency alerts from the daemon.' },
    { step: 3, title: 'Set GitHub Token', desc: 'Add GITHUB_TOKEN secret for the Thin Page Fixer module. This enables reading existing pages and pushing AI-generated fixes to the repository.' },
    { step: 4, title: 'Enable Cron Schedules', desc: 'Activate all 4 cron triggers: */5 warmup, */30 QA+daemon+fixes, 0 */4 full audit+hunt, 0 13 daily briefing (8am CST).' },
    { step: 5, title: 'Monitor Dashboard', desc: 'Check the daily briefing in Shared Brain for warmup counts, bugs found, bugs auto-resolved, and pages fixed. Review the KV logs for detailed operation records.' },
  ],

  features: [
    { title: 'Worker Warmer', desc: 'Keeps 11 critical workers warm with periodic health check pings. Prevents cold-start alerts from the Autonomous Daemon by ensuring workers are always responsive.' },
    { title: 'QA Bug Processor', desc: 'Processes bugs reported by the QA Tester. Auto-resolves known false positives: Next.js script count variations, known redirect pages, Organization schema presence, placeholder content on intentionally thin pages.' },
    { title: 'Daemon Task Resolver', desc: 'Picks up tasks from the Autonomous Daemon\'s task queue. Most daemon tasks (cold-start latency, health check failures) are resolved by warm-up pings, which the Builder executes automatically.' },
    { title: 'Bug Hunter', desc: 'Scans 85+ Cloudflare Workers for issues: HTTP errors, missing health endpoints, unexpected responses. Skips unbound workers (404s from same-account routing) to eliminate false positives.' },
    { title: 'Thin Page Fixer', desc: 'Reads thin product pages from GitHub via Contents API, generates comprehensive content using Engine Runtime AI, and pushes the improved page back to GitHub. Automated content generation.' },
    { title: 'Upgrade Scanner', desc: 'Checks Workers for outdated patterns, missing features, or configuration drift. Identifies upgrade opportunities across the fleet.' },
    { title: 'Self-Reporter', desc: 'Logs all activities to Shared Brain and posts milestones to MoltBook. Generates daily briefing summaries with statistics and anomaly detection.' },
    { title: 'Daily Briefing', desc: 'Comprehensive daily report at 8am CST: warmup counts, bugs found vs resolved, daemon tasks completed, fleet health score, and anomalies detected.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/health', desc: 'Health check endpoint returning worker status, last run times, and error counts.', auth: false },
    { method: 'GET', path: '/stats', desc: 'Detailed statistics: total warmups, bugs processed, pages fixed, daemon tasks resolved.', auth: true },
    { method: 'POST', path: '/trigger/warmup', desc: 'Manually trigger a worker warm-up cycle outside the scheduled cron.', auth: true },
    { method: 'POST', path: '/trigger/qa', desc: 'Manually trigger QA bug processing cycle.', auth: true },
    { method: 'POST', path: '/trigger/hunt', desc: 'Manually trigger a full fleet bug hunt scan.', auth: true },
    { method: 'GET', path: '/logs', desc: 'View recent operation logs with filtering by module, status, and time range.', auth: true },
  ],

  userGuide: [
    {
      title: 'Understanding the Cron Schedule',
      id: 'cron-schedule',
      content: [
        'The Builder operates on 4 cron schedules, each serving a different purpose. The */5 warmup runs every 5 minutes, pinging critical workers to prevent cold-start latency. This is the most frequent operation and accounts for most of the daily activity.',
        'The */30 cycle handles QA bug processing, daemon task resolution, and targeted fixes. It reads from the QA tester\'s bug database and the daemon\'s task queue, processing items that match auto-resolution criteria.',
        'The 4-hour full audit does deep scanning: checking all 85+ Workers for errors, hunting for broken endpoints, scanning for upgrade opportunities, and generating detailed reports.',
        'The daily briefing at 8am CST compiles all activity into a summary report posted to Shared Brain and MoltBook.',
      ],
    },
    {
      title: 'False Positive Management',
      id: 'false-positives',
      content: [
        'The QA Bug Processor maintains a set of known false positive patterns. These include: Next.js apps having variable script counts (not a bug), redirect pages returning expected behavior, Organization JSON-LD being valid schema, and known placeholder content on stub pages.',
        'When a new false positive pattern is identified, add it to the auto-resolve rules. This prevents the same non-issue from being flagged in future QA runs.',
        'All auto-resolved bugs are logged with the resolution reason, so you can audit the decisions and refine the rules over time.',
      ],
    },
    {
      title: 'Thin Page Fixing',
      id: 'thin-pages',
      content: [
        'The Thin Page Fixer identifies product pages with insufficient content (under a configurable character threshold). It reads the current page source from GitHub, sends the product context to Engine Runtime for AI content generation, and pushes the enhanced page back to GitHub.',
        'Generated content follows the site\'s ProductDoc pattern with overview, features, API documentation, user guides, and FAQs. All content is domain-accurate thanks to Engine Runtime\'s 632K+ doctrines.',
        'After pushing to GitHub, the Vercel auto-deploy pipeline picks up the change and deploys to production. The entire fix-to-deploy cycle is fully automated.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Intelligent Bug Triage', desc: 'Classifies bugs by severity and auto-resolution potential. Known patterns are resolved immediately. Novel bugs are escalated with context for manual review.' },
    { capability: 'Content Generation', desc: 'Engine Runtime-powered page generation creates comprehensive product documentation from minimal seed content. Each generated page includes features, API docs, user guides, and FAQs.' },
    { capability: 'Anomaly Detection', desc: 'Identifies unusual patterns in fleet health: sudden response time increases, error rate spikes, or workers that stop responding. Correlates anomalies across services to identify root causes.' },
    { capability: 'Predictive Warming', desc: 'Learns which workers are most likely to go cold based on traffic patterns and pre-emptively warms them before latency alerts trigger.' },
  ],

  troubleshooting: [
    { issue: 'Warmups not reducing cold-start alerts', solution: 'Verify the critical worker list includes all workers monitored by the daemon. Check that the health endpoints return 200 — some workers may have broken health checks. Increase warmup frequency if the 5-minute interval isn\'t sufficient for low-traffic workers.' },
    { issue: 'QA bugs not being auto-resolved', solution: 'Check that the auto-resolve patterns match the bug format from the QA tester. Review the resolution logs for pattern match failures. Update rules if the QA tester changed its bug reporting format.' },
    { issue: 'Thin page fixes not deploying', solution: 'Verify the GITHUB_TOKEN has write permissions to the repository. Check that the target branch (main) is correct. Review the GitHub API response in logs for specific error messages. Ensure Vercel auto-deploy is configured for the repository.' },
    { issue: 'Bug hunt showing many false positives', solution: 'The bug hunter detects unbound workers as 404 errors. Add known unbound worker URLs to the skip list. Update the worker registry to exclude decommissioned workers.' },
  ],

  faq: [
    { q: 'Does the Builder modify code without approval?', a: 'The Builder only modifies thin pages — product pages identified as having insufficient content. All changes are pushed via GitHub commits with clear commit messages, so every change is visible in git history and can be reviewed or reverted.' },
    { q: 'How does it decide which bugs to auto-resolve?', a: 'Auto-resolution is based on pattern matching against known false positives. Only bugs matching pre-configured patterns are resolved automatically. Novel bugs are logged for manual review. You can customize the pattern rules.' },
    { q: 'Can I disable specific modules?', a: 'Yes. Each module (warmup, QA, daemon, hunt, thin-page, upgrade) can be enabled or disabled independently through the KV configuration. Disabling a module removes it from the cron execution without affecting others.' },
    { q: 'How much does it cost to run?', a: 'The Autonomous Builder runs on Cloudflare Workers free tier for the compute. D1 and KV usage are minimal. The main cost factor is Engine Runtime calls for thin page content generation — these use the free Claude proxy. Total incremental cost: effectively $0.' },
    { q: 'What happens if the Builder itself goes down?', a: 'Cloudflare Workers are highly available with automatic failover. If the Builder misses a cron cycle, it catches up on the next one. The daemon monitors the Builder\'s health and alerts if it stops responding.' },
  ],
}

export default function EchoAutonomousBuilderDocsPage() {
  return <ProductDoc {...data} />
}
