'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Feature Flags',
  tagline: 'Boolean, percentage, and segment-based feature flag management with A/B testing, gradual rollouts, and kill switches.',
  accent: '#14b8a6',
  productUrl: '/feature-flags',
  workerUrl: 'https://echo-feature-flags.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Feature Flags gives product and engineering teams precise control over every feature in production without code deployments. Define boolean toggles, percentage-based rollouts, and user-segment rules from a central dashboard, then evaluate flags at runtime in your application with a lightweight SDK or direct API call. Changes take effect globally in under 100ms with no redeployment required.',
    'The flag evaluation engine supports six targeting strategies: boolean on/off, percentage of all users, percentage of a specific segment, individual user allowlists, attribute-based rules, and time-bounded activation windows. Combine multiple strategies into layered rules for complex gradual rollouts — for example, enable for internal users immediately, roll out to 10% of beta testers after 24 hours, then expand to 50% of all users if error rates stay below threshold.',
    'Every flag change is recorded in an immutable audit log with timestamp, actor, previous state, and new state. Kill switches let you disable any feature globally in one click with no code required — critical for incident response. A/B test mode routes users into named variants and tracks conversion events per variant so product teams can make data-driven decisions on feature promotion.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your First Flag', desc: 'POST to /flags with a key, name, and type (boolean, percentage, or segment). The flag key is how your application references the flag at evaluation time — choose something descriptive like "new-checkout-flow" or "ai-recommendations-v2".' },
    { step: 2, title: 'Install the SDK', desc: 'Add the Echo Feature Flags SDK to your application. Initialize with your API key and project ID. The SDK caches flag states locally and refreshes from the Worker on a configurable polling interval — typically 30 seconds.' },
    { step: 3, title: 'Evaluate Flags in Code', desc: 'Call isEnabled("flag-key", context) anywhere in your application. Pass a context object with user ID, email, role, or any custom attributes used by your targeting rules. The SDK returns a boolean result instantly from cache.' },
    { step: 4, title: 'Configure Targeting Rules', desc: 'In the dashboard or via the API, add targeting rules to your flag. Start with a 5% percentage rollout, monitor error rates and conversion metrics, then gradually increase the percentage as confidence grows.' },
    { step: 5, title: 'Set Up A/B Testing', desc: 'Enable A/B mode on any flag to route users into named variants. Track conversion events with POST /analytics. Review per-variant conversion rates in the /analytics endpoint to determine the winning variant before full rollout.' },
  ],

  features: [
    { title: 'Boolean Flags', desc: 'Simple on/off toggles for shipping incomplete features safely, controlling access to beta features, enabling maintenance modes, and managing third-party integrations without code changes.' },
    { title: 'Percentage Rollouts', desc: 'Gradually expose features to an increasing percentage of users with deterministic user assignment — the same user always gets the same result for a given flag and percentage, ensuring a consistent experience across sessions.' },
    { title: 'User Segment Targeting', desc: 'Define named segments based on user attributes — plan type, region, company size, account age, or any custom property. Target flags to specific segments for controlled beta testing and early access programs.' },
    { title: 'A/B Testing', desc: 'Route users into named variants and track conversion events per variant. Variant assignment is sticky — users stay in their assigned variant until the test concludes. Statistical significance calculator built into the analytics dashboard.' },
    { title: 'Gradual Rollouts', desc: 'Schedule percentage increases over time with automatic promotion triggers based on error rate thresholds, conversion rate targets, or manual approval gates. Pause or reverse a rollout instantly if metrics degrade.' },
    { title: 'Kill Switches', desc: 'Designate any flag as a kill switch for instant global disable with a single toggle click. Kill switches are evaluated first in the rule chain and bypass all other targeting logic — essential for incident response.' },
    { title: 'Audit Log', desc: 'Immutable append-only log of every flag change with timestamp, actor identity, previous state, new state, and change reason. Filter by flag, actor, or date range. Export for compliance and post-incident review.' },
    { title: 'SDK Integration', desc: 'Lightweight JavaScript/TypeScript SDK with local caching, background refresh, and streaming updates. Evaluation happens in-process from cache — zero latency for flag checks in production request paths.' },
    { title: 'Environment Isolation', desc: 'Separate flag states per environment — development, staging, production. Promote flag configurations from staging to production with a single action. Prevent accidental production flag changes from local development.' },
    { title: 'Webhook Notifications', desc: 'Subscribe to flag change events with webhooks. Notify Slack channels, trigger CI/CD pipelines, or invalidate application caches automatically when flag states change in production.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/flags', desc: 'Create a new feature flag with key, name, description, type (boolean/percentage/segment), default value, and optional targeting rules. Returns the created flag with ID and current evaluation state.', auth: true },
    { method: 'GET', path: '/flags', desc: 'List all feature flags with current state, rule count, evaluation count, last changed timestamp, and owner. Filterable by type, state, and tag. Includes per-flag evaluation statistics for the last 30 days.', auth: true },
    { method: 'GET', path: '/flags/:key/evaluate', desc: 'Evaluate a single flag for a given user context. Pass context as query parameters or request body. Returns a boolean result, the matching rule, and the variant name for A/B tests. Public endpoint — no auth required for SDK calls.', auth: false },
    { method: 'POST', path: '/flags/:key/toggle', desc: 'Toggle a boolean flag on or off globally, bypassing all targeting rules. Logs the action to the audit log with the authenticated actor identity and optional reason string.', auth: true },
    { method: 'GET', path: '/audit-log', desc: 'Retrieve the full audit log with filtering by flag key, actor, event type, and date range. Paginated with cursor navigation. Each entry includes before/after state for complete change history.', auth: true },
    { method: 'POST', path: '/segments', desc: 'Create a named user segment with attribute-based rules (equals, contains, in, regex). Segments are reusable across multiple flags and update automatically when rule conditions change.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Retrieve flag evaluation analytics — total evaluations, true/false ratios, per-variant counts for A/B tests, unique user counts, and conversion rates for flags with tracked events.', auth: true },
  ],

  userGuide: [
    {
      title: 'Creating and Managing Flags',
      id: 'managing-flags',
      content: [
        'Create flags from the dashboard or via the POST /flags API. Every flag requires a unique key (lowercase, hyphen-separated, no spaces), a human-readable name, and a type. The flag key is permanent — it is what your application code references and cannot be changed after creation without a code deployment.',
        'Boolean flags are the simplest type: on or off globally. Percentage flags enable a feature for a deterministic fraction of users — the same user always gets the same result for a given percentage, so their experience is consistent across page loads and sessions. Segment flags evaluate targeting rules against user attribute context passed at evaluation time.',
        'Organize flags with tags and owners. Tags let you filter the dashboard by product area, sprint, or team. Owner assignment routes audit log notifications and creates accountability for flag lifecycle — flags should be cleaned up after their feature is fully rolled out or permanently disabled.',
      ],
    },
    {
      title: 'Percentage Rollouts',
      id: 'percentage-rollouts',
      content: [
        'Percentage rollouts use a deterministic hash of the user ID and flag key to assign users to the enabled cohort. This means: 1) the same user always gets the same result for a given percentage, 2) adding a new user to your system does not change existing users\' assignments, and 3) you can safely pause and resume a rollout without changing which users see the feature.',
        'Start gradual rollouts at 1% and monitor error rates in your observability stack for 30–60 minutes. If metrics are healthy, advance to 5%, then 10%, 25%, 50%, and finally 100%. The dashboard supports quick-increment buttons for common rollout percentages. Each increment is logged to the audit trail with the actor identity.',
        'For staged rollouts with automatic safeguards, configure error rate thresholds in the rollout settings. If your application\'s error rate exceeds the threshold after a percentage increase, the rollout automatically pauses and sends a webhook notification. Resume manually after investigating — or revert to the previous percentage with a single click.',
      ],
    },
    {
      title: 'A/B Testing',
      id: 'ab-testing',
      content: [
        'Enable A/B mode when creating or editing a flag to split traffic between named variants. Variants are defined as an array of names with traffic weights that must sum to 100 — for example, ["control", "variant-a", "variant-b"] with weights [50, 25, 25]. User assignment to variants uses the same deterministic hash approach as percentage flags for consistent user experiences.',
        'Track conversion events by calling POST /analytics/event with the user ID, flag key, variant name, and event type. The analytics dashboard calculates per-variant conversion rates and runs a chi-squared significance test to determine when you have enough data to declare a winner. Typical tests require 1,000+ conversions per variant for statistical significance.',
        'When your test reaches significance, promote the winning variant by updating the flag to 100% of that variant, then archive the test flag. Document the result in the flag description for future reference. Clean up dead flags monthly — stale flags create code debt and obscure your active test surface.',
      ],
    },
    {
      title: 'Kill Switches',
      id: 'kill-switches',
      content: [
        'A kill switch is a boolean flag designated for emergency use. In an incident, a kill switch lets you disable a misbehaving feature globally in under 5 seconds — no deployment, no rollback, no engineer required beyond the person with dashboard access. Every production service that ships new features should have a corresponding kill switch.',
        'Configure kill switches with a clear naming convention: "disable-{feature}" or "{feature}-kill-switch". Add the switch to your runbook so on-call engineers know exactly which flags to toggle during an incident involving that feature. Set kill switches to the off (enabled=false) state as their default so they are safe to activate from any state.',
        'After an incident, use the audit log to document exactly when the kill switch was activated, who activated it, and what the impact was. Kill switches should be temporary — re-enable the feature after the root cause is fixed and verify normal operation before removing the flag from your code.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Rollout Risk Scoring', desc: 'Analyzes a proposed percentage increase against your flag\'s historical evaluation patterns and current application error metrics to score the risk of the rollout step. Flags high-risk increases before you commit them.' },
    { capability: 'Stale Flag Detection', desc: 'Monitors flag evaluation patterns over time. Flags that have been at 100% or 0% for more than 30 days with no rule changes are identified as candidates for code removal, reducing dead-code accumulation in your codebase.' },
    { capability: 'Segment Suggestion', desc: 'Analyzes your user attribute data to suggest effective targeting segments for new flags. If you are testing a feature for enterprise customers, the AI identifies the attribute combination that best distinguishes enterprise accounts from your user base.' },
    { capability: 'A/B Test Duration Estimation', desc: 'Given your daily active user count, current conversion rate, and target minimum detectable effect, estimates the number of days your A/B test needs to run to reach statistical significance. Prevents premature test conclusions.' },
  ],

  troubleshooting: [
    { issue: 'Flag evaluates differently across sessions for the same user', solution: 'This usually means the user context passed to the evaluation endpoint is inconsistent — check that the user ID is identical across all calls. User ID is the primary input to the deterministic hash. If your application uses different ID formats (numeric vs UUID) in different contexts, the evaluation results will differ.' },
    { issue: 'Segment rules not matching expected users', solution: 'Use the flag evaluation endpoint directly with a test context object matching the user attributes you expect to match. The response includes the matched rule for debugging. Verify attribute names in your rules match exactly what your application sends — including case and data type (string vs number).' },
    { issue: 'SDK not picking up flag changes', solution: 'The SDK caches flag states and refreshes on the configured polling interval (default 30s). For immediate propagation, call flags.refresh() manually after making changes in the dashboard. For streaming updates without polling latency, configure the SDK to use the SSE streaming endpoint instead of polling.' },
    { issue: 'Audit log entries missing actor information', solution: 'Audit log entries are attributed to the API key or user token used to make the change. If actor shows as "unknown", the flag change was made with an API key that is not associated with a named user. Create named API keys per team member in the dashboard for full attribution.' },
  ],

  faq: [
    { q: 'How is Echo Feature Flags priced compared to LaunchDarkly or Flagsmith?', a: 'Echo Feature Flags is priced at $19/month (Starter), $49/month (Pro), and $149/month (Business) — flat rates with no per-seat or per-evaluation charges. LaunchDarkly starts at $10/seat/month and scales to thousands per month at team size. Flagsmith cloud pricing is similar. Echo Feature Flags is 3–10x cheaper at scale for product teams.' },
    { q: 'How fast is flag evaluation in production?', a: 'The SDK evaluates flags from a local cache — evaluation time is under 1ms and does not add latency to your request path. The cache is refreshed every 30 seconds (configurable) in the background. For the REST API without the SDK, evaluation adds one Cloudflare Worker round-trip — typically 20–50ms from any global region.' },
    { q: 'Can I use feature flags with server-side rendering?', a: 'Yes. For SSR environments, evaluate flags server-side using the REST API or SDK in server mode with the user context derived from the session. The SDK\'s server mode supports synchronous flag evaluation without a DOM or browser environment. Pass evaluated flag values to the client as props to avoid hydration mismatches.' },
    { q: 'How many flags and segments can I create?', a: 'Starter plans include up to 50 flags and 10 segments. Pro plans support up to 500 flags and 100 segments. Business plans are unlimited. All plans support unlimited flag evaluations — there are no per-evaluation charges at any tier.' },
    { q: 'Is there an SDK for languages other than JavaScript?', a: 'The initial release includes a JavaScript/TypeScript SDK compatible with Node.js, browsers, and edge runtimes. Python, Go, and Ruby SDKs are on the roadmap. Any language can integrate via the REST API with a simple HTTP client — the /evaluate endpoint is public and requires only the flag key and user context.' },
  ],
}

export default function EchoFeatureFlagsDocsPage() {
  return <ProductDoc {...data} />
}
