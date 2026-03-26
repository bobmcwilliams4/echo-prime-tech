'use client'

import ProductDoc from '@/components/ProductDoc'

const data = {
  name: 'Echo A/B Testing',
  tagline: 'AI-powered experimentation platform — test anything, measure everything, ship with confidence.',
  accent: '#7c3aed',
  productUrl: '/ab-testing',
  workerUrl: 'https://echo-ab-testing-engine.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo A/B Testing is a full-stack experimentation platform that replaces Optimizely, VWO, and LaunchDarkly with a single, AI-enhanced system running on Cloudflare\'s global edge network. Every experiment — from a button color change to a complete checkout flow redesign — is served at the edge with sub-millisecond assignment latency and zero flicker. The platform handles client-side visual experiments, server-side feature flags, multivariate tests, and multi-page funnel experiments through a unified interface that makes experimentation accessible to product managers and engineers alike.',
    'What sets Echo A/B Testing apart is the AI layer that sits on top of rigorous statistical methodology. The system automatically determines optimal sample sizes, detects when experiments reach statistical significance using both frequentist and Bayesian methods, identifies interaction effects between concurrent experiments, and surfaces revenue attribution insights that connect experiment variants to actual business outcomes. No more waiting weeks for inconclusive results — the AI-powered adaptive traffic allocation pushes more visitors toward winning variants as confidence builds, maximizing the business value of every test.',
    'The platform integrates deeply with your analytics stack through a lightweight SDK (3KB gzipped), server-side SDKs for Node.js, Python, Go, and Ruby, and a REST API for custom implementations. Experiments sync with your existing analytics tools (GA4, Mixpanel, Amplitude, Segment) so all experiment data lives alongside your behavioral data. Heatmaps and session recording integration provide qualitative context for quantitative results, helping teams understand not just what happened, but why.',
  ],

  gettingStarted: [
    { step: 1, title: 'Install the SDK', desc: 'Add the Echo A/B Testing SDK to your website or application. The client-side snippet is a single script tag (3KB gzipped) that loads asynchronously. For server-side experiments, install the SDK for your language: npm install @echo/ab-testing, pip install echo-ab-testing, or go get echo-ab-testing. Configure your project key from the dashboard.' },
    { step: 2, title: 'Create Your First Experiment', desc: 'From the dashboard, click New Experiment and choose your type: Visual (point-and-click editor), Code (SDK-driven variants), or Feature Flag (boolean or multivariate). Define your variants, set traffic allocation percentages, and select your target audience.' },
    { step: 3, title: 'Define Success Metrics', desc: 'Attach primary and secondary metrics to your experiment. Choose from built-in metrics (conversion rate, revenue per visitor, bounce rate, session duration) or define custom events. Set your minimum detectable effect size and the AI will calculate the required sample size and estimated duration.' },
    { step: 4, title: 'Configure Targeting Rules', desc: 'Define who sees the experiment using targeting rules: URL patterns, device type, geographic region, user attributes, cookie values, or custom JavaScript conditions. Combine rules with AND/OR logic. Use mutual exclusion groups to prevent visitors from entering conflicting experiments simultaneously.' },
    { step: 5, title: 'Launch & Monitor', desc: 'Review the experiment summary, confirm targeting and metrics, then launch. The real-time dashboard shows variant performance, sample sizes, statistical significance, and projected winner. The AI sends automated alerts when significance is reached or if anomalies are detected (e.g., tracking errors, sample ratio mismatch).' },
  ],

  features: [
    { title: 'Visual Editor', desc: 'Point-and-click visual editor for creating experiments without writing code. Change text, colors, images, layouts, and element visibility directly on your live site. Supports complex DOM manipulations, CSS injection, and JavaScript-powered changes. Changes are applied at the edge with zero flicker through anti-flicker technology.' },
    { title: 'Multivariate Testing', desc: 'Test multiple variables simultaneously to find the optimal combination. A multivariate test on a landing page might test 3 headlines, 2 hero images, and 2 CTA colors — yielding 12 combinations. The system uses fractional factorial design to reduce the required sample size while still detecting interaction effects between variables.' },
    { title: 'Statistical Significance Engine', desc: 'Dual-methodology statistical engine runs both frequentist (sequential testing with alpha spending) and Bayesian analysis in parallel. Real-time p-values, confidence intervals, credible intervals, and probability-to-be-best calculations. Automatic correction for multiple comparisons and peeking bias through always-valid confidence sequences.' },
    { title: 'Audience Targeting', desc: 'Granular audience segmentation for targeted experiments. Target by URL, device, browser, OS, geographic location, referral source, user attributes (plan type, signup date, usage tier), cookies, and custom JavaScript conditions. Audiences can be reused across experiments and combined with AND/OR/NOT logic.' },
    { title: 'Feature Flags', desc: 'Production-grade feature flag system with instant rollout/rollback, percentage-based gradual rollout, user-targeted overrides, and scheduled activation. Feature flags can be boolean (on/off) or multivariate (string, number, JSON) for configuration-driven features. Kill switches for instant emergency rollback.' },
    { title: 'Server-Side Experiments', desc: 'Run experiments in your backend code for changes that cannot be made client-side: pricing logic, algorithm variants, API response modifications, recommendation models. Server-side SDKs provide consistent bucketing with zero latency overhead. Supports edge-side rendering integration with Cloudflare Workers.' },
    { title: 'Revenue Attribution', desc: 'Track the revenue impact of every experiment variant with end-to-end attribution. The system links experiment assignments to conversion events and revenue transactions across sessions and devices. See revenue per visitor, average order value, and lifetime value projections for each variant to make decisions based on business impact, not just conversion rate.' },
    { title: 'Heatmaps', desc: 'Built-in heatmap visualization showing click patterns, scroll depth, mouse movement, and attention zones for each experiment variant. Compare heatmaps side-by-side to understand behavioral differences between variants. Heatmap data is collected automatically for all experiments with no additional setup required.' },
    { title: 'Session Recording Integration', desc: 'Replay individual visitor sessions segmented by experiment variant. Watch how users interact with each variant to understand the qualitative "why" behind quantitative results. Sessions are tagged with experiment metadata for easy filtering and automatically sampled to manage data volume.' },
    { title: 'Bayesian Analysis', desc: 'Full Bayesian statistical framework that provides intuitive results: "Variant B has a 94.2% probability of being better than Control" rather than abstract p-values. Includes expected loss calculations that quantify the cost of choosing the wrong variant, helping teams make risk-aware decisions even before reaching traditional significance thresholds.' },
    { title: 'Adaptive Traffic Allocation', desc: 'AI-powered multi-armed bandit mode that automatically shifts traffic toward better-performing variants as data accumulates. Maximizes conversions during the experiment by reducing exposure to underperforming variants while still collecting enough data for statistical rigor. Configurable exploration/exploitation ratio.' },
    { title: 'Experiment Scheduling', desc: 'Schedule experiments to start and stop at specific dates and times. Run time-limited promotions, coordinate experiments with marketing campaigns, and automatically archive completed experiments. Recurring experiment schedules for periodic testing (e.g., weekly homepage variant rotation).' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/experiments', desc: 'Create a new experiment with name, type (ab/mvt/feature-flag), variants, traffic allocation, targeting rules, and success metrics. Returns the experiment ID and SDK configuration.', auth: true },
    { method: 'GET', path: '/api/experiments', desc: 'List all experiments with filtering by status (draft/running/paused/completed), type, and date range. Includes summary statistics for running experiments.', auth: true },
    { method: 'GET', path: '/api/experiments/:id/results', desc: 'Retrieve full statistical results for an experiment including variant performance, significance levels, confidence intervals, Bayesian probabilities, and revenue attribution.', auth: true },
    { method: 'POST', path: '/api/decide', desc: 'Client/server SDK decision endpoint. Given a visitor ID and experiment key, returns the assigned variant with feature flag values. Sub-5ms response time from edge locations.', auth: true },
    { method: 'POST', path: '/api/track', desc: 'Track a conversion event for a visitor. Accepts event name, revenue value, and custom properties. Events are attributed to the visitor\'s active experiment assignments.', auth: true },
    { method: 'PUT', path: '/api/experiments/:id/status', desc: 'Update experiment status: start, pause, resume, or complete. Pausing freezes traffic allocation; completing locks results and archives the experiment. Supports scheduled status changes.', auth: true },
    { method: 'GET', path: '/api/flags/:key', desc: 'Evaluate a feature flag for a given user context. Returns the flag value (boolean, string, number, or JSON) based on targeting rules and rollout percentage. Cached at the edge.', auth: true },
    { method: 'GET', path: '/api/heatmaps/:experimentId', desc: 'Retrieve heatmap data for an experiment variant including click coordinates, scroll depth distribution, and attention zones. Supports filtering by device type and date range.', auth: true },
  ],

  userGuide: [
    {
      title: 'Creating Experiments',
      id: 'creating-experiments',
      content: [
        'From the dashboard, click New Experiment to start the creation wizard. Choose your experiment type: Visual Editor for point-and-click changes to your live site, Code Experiment for SDK-driven server or client-side changes, or Feature Flag for boolean or multivariate toggles. Each type follows the same workflow but differs in how variants are defined.',
        'For visual experiments, the editor loads your live site in an iframe where you can click any element to modify it. Change text content, CSS properties, images, element visibility, and DOM structure. Each change is recorded as a mutation that the SDK replays at runtime. Preview each variant on different device sizes before proceeding to targeting and metrics.',
        'For code experiments and feature flags, define your variants in the dashboard and reference them in your application code using the SDK. The SDK provides a consistent assignment for each visitor across sessions and devices. Variants can be simple labels (control vs. treatment) or structured values (JSON objects for complex configuration changes). The dashboard provides code snippets in every supported language.',
      ],
    },
    {
      title: 'Statistical Methodology',
      id: 'statistical-methodology',
      content: [
        'Echo A/B Testing uses sequential testing with alpha spending functions as the default frequentist methodology. Unlike fixed-horizon tests that require you to wait for a predetermined sample size, sequential testing lets you check results at any time without inflating false positive rates. The system displays always-valid confidence intervals that maintain their coverage guarantee regardless of when you peek.',
        'The Bayesian engine runs in parallel, providing complementary insights. Where frequentist analysis tells you whether to reject the null hypothesis, Bayesian analysis tells you the probability that each variant is best and the expected loss from choosing each option. This is particularly valuable for business decisions where the cost of a wrong choice matters — an experiment where the expected loss of the leading variant is $0.02/visitor might be safe to call even before frequentist significance is reached.',
        'For multivariate tests, the system detects interaction effects between variables using a hierarchical model. If changing the headline has a different effect depending on which hero image is shown, the system will surface this interaction and recommend the optimal combination rather than naively combining individual winners. Sample size calculations account for the increased complexity of multivariate designs.',
      ],
    },
    {
      title: 'Feature Flags & Rollouts',
      id: 'feature-flags',
      content: [
        'Feature flags decouple deployment from release. Deploy your code to production behind a flag, then control who sees it from the dashboard — no redeployment required. Boolean flags toggle features on/off, while multivariate flags return different values (strings, numbers, JSON objects) based on targeting rules, enabling configuration-driven behavior changes.',
        'Gradual rollouts let you release a feature to an increasing percentage of users over time: 1% on Monday to catch critical bugs, 10% on Wednesday for broader validation, 50% on Friday, 100% the following Monday. If issues arise at any stage, roll back instantly from the dashboard. Rollout percentages are sticky — a user who was included at 10% remains included at 50%.',
        'Targeting rules on feature flags support user-level overrides (force a flag value for specific user IDs), attribute-based targeting (enable for premium users only), and environment-based rules (enabled in staging, disabled in production). Flags are evaluated at the edge with sub-millisecond latency, so they are safe to use in hot code paths including API response generation and page rendering.',
      ],
    },
    {
      title: 'Analytics Integration',
      id: 'analytics-integration',
      content: [
        'Echo A/B Testing integrates with your existing analytics stack so experiment data enriches your behavioral analysis. Native integrations are available for Google Analytics 4, Mixpanel, Amplitude, Segment, Heap, and Rudderstack. Once connected, experiment variant assignments are automatically sent as properties on every event, enabling you to segment any report by experiment variant in your analytics tool.',
        'Revenue attribution connects experiment assignments to transaction events across the full customer journey. The system supports both same-session attribution (visitor converts during the experiment) and multi-session attribution (visitor returns later to convert). Configurable attribution windows (7-day, 14-day, 30-day) and models (first-touch, last-touch, linear) let you match your existing analytics methodology.',
        'Custom event tracking via the SDK or API lets you define metrics specific to your business. Track any interaction — button clicks, form completions, feature usage, error rates, page load times — and attach it as a primary or secondary metric to any experiment. Custom metrics support numeric values for continuous variables like revenue, load time, and engagement score, not just binary conversion events.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Automated Sample Size Calculation', desc: 'Input your baseline conversion rate and minimum detectable effect, and the AI calculates the exact sample size and estimated experiment duration based on your current traffic volume. Accounts for multiple variants, multiple metrics, and the statistical power you need. Updates the estimate dynamically as actual traffic data comes in during the experiment.' },
    { capability: 'Anomaly Detection', desc: 'Continuous monitoring detects experiment anomalies in real-time: sample ratio mismatch (unequal variant assignment indicating a bucketing bug), tracking discrepancies (conversion events without corresponding assignment events), sudden performance drops suggesting site issues, and novelty effects that inflate early results. Automated alerts with root cause suggestions prevent bad data from corrupting your results.' },
    { capability: 'Interaction Effect Discovery', desc: 'When multiple experiments run concurrently, the AI monitors for interaction effects — cases where the impact of one experiment depends on the variant assigned in another. If a pricing page experiment interacts with a homepage experiment, the system alerts you and recommends mutual exclusion or a combined multivariate test to isolate effects.' },
    { capability: 'Winner Prediction', desc: 'Before an experiment reaches formal statistical significance, the AI provides a projected winner with confidence trajectory. The projection uses early data patterns, Bayesian updating, and historical experiment performance to estimate when significance will be reached and which variant is likely to win — helping teams plan their roadmap before experiments formally conclude.' },
    { capability: 'Segment Discovery', desc: 'After an experiment concludes, the AI automatically analyzes results across dozens of segments (device type, geography, traffic source, user attributes) to discover hidden winners. An experiment that shows no overall winner might have a strong winner among mobile users or new visitors. Segment discoveries are ranked by statistical confidence and business impact.' },
    { capability: 'Experiment Ideation', desc: 'Based on heatmap data, session recordings, conversion funnel analysis, and historical experiment results, the AI suggests new experiment ideas prioritized by projected impact. Suggestions include specific hypotheses, recommended variants, and expected effect sizes based on similar experiments in the system\'s training data.' },
  ],

  troubleshooting: [
    { issue: 'Visitors are seeing a flash of original content before the variant loads (flicker)', solution: 'Ensure the anti-flicker snippet is installed in the <head> of your page before any render-blocking resources. The snippet hides the page for up to 300ms while the SDK loads and applies changes. If flicker persists, check that the SDK script is loading from the nearest edge location — verify the script URL uses your project-specific CDN subdomain, not the generic API endpoint.' },
    { issue: 'Experiment results show a sample ratio mismatch warning', solution: 'A sample ratio mismatch means the actual traffic split between variants deviates significantly from the configured allocation. Common causes: bot traffic being assigned but not converting (enable bot filtering), redirected variants losing visitors on slow connections (use client-side changes instead), or sticky bucketing cookies being cleared. Investigate the timestamp when the mismatch began to identify the trigger.' },
    { issue: 'Feature flag evaluations are returning the default value instead of targeted values', solution: 'Verify that the user context passed to the SDK includes all attributes referenced in your targeting rules. If targeting by plan type but the SDK receives an empty plan attribute, the rule will not match and the default value is returned. Check the Flag Evaluation Log in the dashboard to see exactly which rules were evaluated and why they did not match for a specific user.' },
    { issue: 'Revenue attribution shows much lower numbers than my analytics platform', solution: 'Check the attribution window configuration — the default is 7 days, which may be shorter than your analytics tool. Verify that the revenue tracking event includes the correct numeric value and currency. For multi-session attribution, ensure the visitor ID is persistent across sessions (cookie-based ID is recommended over session-only IDs). Cross-device attribution requires authenticated user IDs passed to both the SDK and revenue tracking events.' },
  ],

  faq: [
    { q: 'How does Echo A/B Testing prevent flicker on visual experiments?', a: 'The anti-flicker snippet installed in your page <head> hides the page body for up to 300ms while the SDK loads and applies variant changes. Because the SDK is served from Cloudflare\'s edge network (300+ locations), it typically loads in under 50ms. Changes are applied before the page becomes visible, so visitors never see the original content flash. Server-side experiments and feature flags have zero flicker by design since changes are applied before HTML is sent to the browser.' },
    { q: 'Can I run multiple experiments on the same page simultaneously?', a: 'Yes. The platform supports concurrent experiments with automatic interaction monitoring. By default, experiments on the same page are allowed to overlap — a visitor can be in multiple experiments simultaneously. If you need to prevent overlap, create a mutual exclusion group: visitors assigned to one experiment in the group are excluded from all others. The AI monitors for interaction effects between concurrent experiments and alerts you if one experiment is contaminating another\'s results.' },
    { q: 'What happens to visitors already in an experiment if I pause or stop it?', a: 'Pausing an experiment freezes new visitor assignments but continues tracking conversions from visitors already assigned. This ensures you capture the full conversion window for visitors who saw the experiment. Stopping an experiment ends all tracking and can optionally persist the winning variant for all future visitors (useful for promoting a winner to production). Visitor assignments are stored for 90 days to support long attribution windows.' },
    { q: 'How does server-side experimentation work with caching?', a: 'Server-side experiments are compatible with CDN caching through cache key variation. The SDK generates a consistent variant assignment based on visitor ID, which can be used as a cache key suffix (e.g., page.html?variant=B). For Cloudflare Workers, the SDK integrates directly with the Workers runtime to perform edge-side assignment and serve cached variants without origin round-trips. Cache hit rates remain high because variant distribution is deterministic.' },
    { q: 'Is the statistical methodology suitable for low-traffic sites?', a: 'Yes. For low-traffic sites, the Bayesian engine is recommended over frequentist methods because it provides actionable insights with smaller sample sizes. The system will estimate required duration based on your actual traffic and warn if an experiment would take unreasonably long (>90 days). For very low traffic, consider testing larger changes with bigger expected effect sizes, using composite metrics that combine multiple signals, or running sequential tests instead of concurrent ones.' },
  ],
}

export default function ABTestingDocsPage() {
  return <ProductDoc {...data} />
}
