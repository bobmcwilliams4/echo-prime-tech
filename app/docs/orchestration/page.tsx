'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo AI Orchestrator',
  tagline: 'Multi-model AI routing with 29 LLM workers, intelligent dispatch, and cost optimization.',
  accent: '#8b5cf6',
  productUrl: '/orchestration',
  workerUrl: 'https://echo-ai-orchestrator.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo AI Orchestrator is a unified inference gateway that routes AI requests across 29 LLM workers, including models from OpenAI, Anthropic, Google, Meta, Mistral, Groq, Cerebras, and locally-hosted adapters on the Echo Prime cluster. Instead of hard-coding a single model provider into your application, the Orchestrator intelligently selects the best model for each request based on task type, cost constraints, latency requirements, and quality targets.',
    'Every request flows through a routing pipeline that evaluates the prompt complexity, required capabilities (code generation, reasoning, creative writing, data extraction), token budget, and your configured preferences. The Orchestrator maintains real-time health scores for each provider, automatically failing over to backup models when a provider experiences degradation or outages. Response caching with semantic similarity matching eliminates redundant API calls, reducing costs by 15-40% for typical workloads.',
    'Built entirely on Cloudflare Workers, the Orchestrator processes requests at the edge with sub-10ms routing overhead. A comprehensive analytics dashboard tracks token usage, cost per model, latency percentiles, cache hit rates, and quality scores across all providers. Whether you are building a chatbot, a document processing pipeline, or an AI-powered product, the Orchestrator gives you access to the entire LLM ecosystem through a single, reliable API.',
  ],
  gettingStarted: [
    { step: 1, title: 'Get Your API Key', desc: 'Sign up at echo-ept.com and navigate to Settings > API Keys. Generate a new key with the orchestration scope enabled. This single key authenticates all requests to the Orchestrator regardless of which downstream model handles the request.' },
    { step: 2, title: 'Send Your First Request', desc: 'The Orchestrator exposes an OpenAI-compatible /chat/completions endpoint. Point your existing OpenAI SDK or HTTP client at https://echo-ai-orchestrator.bmcii1976.workers.dev and set your Echo API key. Your existing code works without changes.' },
    { step: 3, title: 'Configure Routing Preferences', desc: 'By default, the Orchestrator uses auto-routing which selects the best model per request. Override this by setting a preferred model, cost ceiling, latency target, or quality minimum in the routing configuration. Rules can be set globally or per-request via headers.' },
    { step: 4, title: 'Review Usage Analytics', desc: 'Open the Orchestration dashboard to see real-time metrics: requests per minute, token usage by model, cost breakdown, latency distribution, cache hit rate, and error rates. Identify optimization opportunities like switching low-complexity requests to cheaper models.' },
    { step: 5, title: 'Set Up Fallback Chains', desc: 'Configure ordered fallback chains so if your primary model is unavailable or exceeds latency thresholds, the request automatically routes to the next model in the chain. Set per-chain retry policies, timeout thresholds, and quality gates.' },
  ],
  features: [
    { title: '29 LLM Workers', desc: 'Access to 29 model endpoints spanning GPT-4.1, Claude Opus 4, Gemini 2.5 Pro, Llama 3.3, Mistral Large, Qwen 3, DeepSeek V3, Groq-accelerated inference, Cerebras fast inference, and locally-hosted fine-tuned adapters on the Echo BRAVO node. New models added within 48 hours of release.' },
    { title: 'Smart Model Routing', desc: 'AI-powered routing engine that analyzes each prompt to determine the optimal model. Code generation routes to code-specialized models, creative tasks to high-temperature creative models, structured extraction to instruction-following models. Routing decisions logged for transparency.' },
    { title: 'Cost Optimization', desc: 'Automatic cost optimization that routes requests to the cheapest model capable of meeting your quality threshold. Set a maximum cost per 1K tokens or a monthly budget cap. The system tracks spend in real time and alerts when approaching limits.' },
    { title: 'Queue Management', desc: 'Intelligent request queuing with priority levels (critical, standard, batch). Critical requests bypass the queue for immediate processing. Batch requests are queued and processed during low-traffic periods at reduced cost. Queue depth and wait times visible in the dashboard.' },
    { title: 'Fallback Chains', desc: 'Define ordered lists of models to try when the primary choice fails. Fallback triggers include HTTP errors, timeout exceeded, rate limit hit, or quality score below threshold. Each fallback attempt is logged with the reason for escalation.' },
    { title: 'Load Balancing', desc: 'Distributes requests across multiple instances of the same model provider to maximize throughput. Weighted round-robin with health-check awareness ensures unhealthy instances are removed from rotation automatically and restored when recovered.' },
    { title: 'Response Caching', desc: 'Semantic caching layer that stores responses keyed by prompt similarity. When a new request is sufficiently similar to a cached prompt (configurable similarity threshold), the cached response is returned in under 5ms. Cache TTL, size limits, and invalidation rules are fully configurable.' },
    { title: 'Token Tracking', desc: 'Precise token counting for every request and response across all providers. Tracks prompt tokens, completion tokens, total tokens, and cost per request. Historical data retained for 90 days with exportable reports for billing reconciliation.' },
    { title: 'Provider Health Monitoring', desc: 'Continuous health checks against all 29 providers measuring latency, error rate, and throughput. Unhealthy providers are automatically deprioritized in routing decisions. Status page shows real-time provider health with 7-day uptime history.' },
    { title: 'A/B Testing', desc: 'Run controlled experiments comparing model performance on identical prompts. Define test groups, traffic splits, and evaluation metrics (latency, cost, user satisfaction). Statistical significance calculated automatically. Results exportable for analysis.' },
    { title: 'Custom Routing Rules', desc: 'Define granular routing rules based on prompt content, user tier, request metadata, time of day, or custom headers. Rules support regex matching, JSON path extraction, and boolean logic. Useful for routing enterprise customers to premium models while free-tier users get cost-optimized models.' },
    { title: 'Usage Analytics', desc: 'Comprehensive analytics covering requests per second, tokens per model, cost per day, latency percentiles (p50, p95, p99), cache efficiency, error rates by provider, and routing decision breakdowns. Dashboards update in real time with configurable alert thresholds.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/chat/completions', desc: 'OpenAI-compatible chat completion endpoint. Accepts messages array, model preference (or "auto" for smart routing), temperature, max_tokens, and optional routing overrides. Returns streamed or non-streamed responses with usage metadata including model used, tokens, cost, and latency.', auth: true },
    { method: 'GET', path: '/models', desc: 'List all available models with current status, capabilities, pricing, context window size, and health score. Filter by provider, capability (code, reasoning, creative, extraction), or price range. Includes real-time availability indicators.', auth: true },
    { method: 'GET', path: '/usage', desc: 'Retrieve usage statistics for your account. Supports date range, model filter, and granularity (hourly, daily, monthly). Returns token counts, request counts, cost breakdown, average latency, cache hit rate, and error rate per model.', auth: true },
    { method: 'POST', path: '/routes/configure', desc: 'Create or update custom routing rules. Body includes rule name, match conditions (prompt regex, headers, user tier), target model or model list, fallback chain, and priority. Rules are evaluated in priority order with first-match semantics.', auth: true },
    { method: 'GET', path: '/health', desc: 'Returns Orchestrator system health including uptime, active connections, queue depth, cache size, and per-provider health scores. Used for monitoring integration and automated alerting.', auth: false },
    { method: 'GET', path: '/queue/status', desc: 'View current queue state including total queued requests, queue depth by priority level, estimated wait time, and processing rate. Useful for adaptive request management in high-traffic scenarios.', auth: true },
  ],
  userGuide: [
    {
      title: 'Configuring Smart Routing',
      id: 'smart-routing',
      content: [
        'By default, every request sent to the Orchestrator with model set to "auto" triggers the smart routing engine. The engine analyzes the prompt to determine its primary task type: code generation, analytical reasoning, creative writing, data extraction, summarization, translation, or general conversation.',
        'Each task type has a ranked list of preferred models based on benchmark performance, cost efficiency, and historical quality scores from your own usage. You can override these rankings in Settings > Routing > Model Preferences. Drag models to reorder priority per task type.',
        'For latency-sensitive applications, enable the "fastest available" routing mode which prioritizes models with the lowest current p95 latency regardless of cost. For cost-sensitive batch processing, enable "cheapest capable" mode which uses the least expensive model that exceeds your minimum quality threshold.',
        'Custom routing rules take precedence over smart routing. If a request matches a custom rule, that rule determines the model. If no custom rule matches, smart routing handles the decision. This layered approach gives you precise control where needed and intelligent defaults everywhere else.',
      ],
    },
    {
      title: 'Managing Costs and Budgets',
      id: 'cost-management',
      content: [
        'The Orchestrator provides multiple cost control mechanisms. Set a per-request maximum cost to prevent expensive requests from exceeding a threshold. Set a daily or monthly budget cap to limit total spend across all requests. When a budget cap is reached, requests are either rejected with a 429 status or downgraded to a cheaper model depending on your configuration.',
        'The Cost Analytics panel shows your spend broken down by model, task type, user, and time period. Identify your most expensive operations and evaluate whether a cheaper model could handle them. The A/B testing feature makes it easy to validate cost-reduction decisions without risking quality.',
        'Response caching is one of the most effective cost reduction tools. For workloads with repetitive prompts (customer support, FAQ bots, template generation), cache hit rates of 30-60% are common, directly reducing your inference costs by the same percentage.',
      ],
    },
    {
      title: 'Setting Up Fallback Chains',
      id: 'fallback-chains',
      content: [
        'Fallback chains ensure your application remains operational even when a provider experiences an outage. Navigate to Settings > Fallback Chains to create a new chain. Each chain consists of an ordered list of models and trigger conditions.',
        'Trigger conditions include: HTTP 5xx errors (provider outage), latency exceeding a threshold (provider degradation), rate limit exceeded (429 responses), and quality score below minimum (response validation). When any trigger fires, the request is automatically retried with the next model in the chain.',
        'Best practice is to create chains with models from different providers. For example: Claude Opus 4 (Anthropic) followed by GPT-4.1 (OpenAI) followed by Gemini 2.5 Pro (Google). This protects against single-provider outages. The Orchestrator logs every fallback event with the original provider, trigger reason, and fallback model used.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Prompt Complexity Analysis', desc: 'Analyzes incoming prompts in real time to estimate computational requirements, identify required capabilities (tool use, code execution, multi-step reasoning, image understanding), and predict which models will produce the highest quality output. Analysis adds less than 2ms to request latency.' },
    { capability: 'Adaptive Quality Scoring', desc: 'Continuously evaluates response quality using automated metrics including coherence, instruction following, factual consistency, and format compliance. Quality scores feed back into routing decisions, automatically deprioritizing models that produce lower quality responses for specific task types.' },
    { capability: 'Semantic Cache Matching', desc: 'Uses embedding-based similarity matching to identify when new prompts are semantically equivalent to cached prompts, even when worded differently. A configurable similarity threshold (default 0.95) controls the tradeoff between cache hit rate and response precision.' },
    { capability: 'Predictive Load Management', desc: 'Forecasts request volume using historical patterns and proactively warms up provider connections, pre-allocates queue capacity, and adjusts routing weights before traffic spikes arrive. Reduces cold-start latency by 40-60% during predictable traffic surges.' },
  ],
  troubleshooting: [
    { issue: 'Requests returning 429 Too Many Requests', solution: 'This indicates either your account rate limit or a downstream provider rate limit has been reached. Check the response headers for X-RateLimit-Remaining and X-RateLimit-Reset. If the error is from a downstream provider, the Orchestrator should fallback automatically unless fallback chains are not configured. Set up fallback chains to prevent provider rate limits from affecting your application.' },
    { issue: 'Responses slower than expected', solution: 'Check the Orchestrator dashboard for current provider latencies. If a specific provider is slow, verify it is not your primary routing target for most requests. Enable the "fastest available" routing mode for latency-critical paths. Also check if response caching is enabled, as cache hits return in under 5ms and significantly reduce average latency.' },
    { issue: 'Model routing to unexpected provider', solution: 'Review your custom routing rules in Settings > Routing Rules. Custom rules take precedence over smart routing, so a broad regex match might be catching requests you did not intend. Check the routing decision log (visible per-request in the API response headers as X-Route-Decision) to see which rule or routing logic was applied.' },
    { issue: 'Cache returning stale responses', solution: 'Reduce the cache TTL in Settings > Cache Configuration. The default TTL is 24 hours which works well for stable knowledge queries but may be too long for time-sensitive content. You can also send requests with the X-Cache-Control: no-cache header to bypass the cache for specific requests without disabling it globally.' },
  ],
  faq: [
    { q: 'Is the API compatible with the OpenAI SDK?', a: 'Yes. The /chat/completions endpoint is fully compatible with the OpenAI Python and Node.js SDKs. Change the base_url to the Orchestrator URL and set your Echo API key. Streaming, function calling, JSON mode, and vision inputs all work identically. No code changes required beyond the URL and key.' },
    { q: 'How is pricing calculated?', a: 'You pay the underlying provider cost plus a small orchestration fee (currently 5% of provider cost). The Orchestrator dashboard shows both components separately. There are no minimum fees, no per-request charges beyond the token costs, and no charges for cached responses. Budget caps apply to the total (provider + orchestration fee).' },
    { q: 'Can I force a specific model instead of using auto-routing?', a: 'Yes. Set the model parameter to any specific model ID (e.g., "claude-opus-4", "gpt-4.1", "llama-3.3-70b") and the request will be sent directly to that provider. Auto-routing only activates when model is set to "auto" or omitted entirely.' },
    { q: 'What happens if all models in my fallback chain are unavailable?', a: 'If every model in the chain fails, the request returns a 503 Service Unavailable with a detailed error body listing each attempted model and its failure reason. Configure alert webhooks to be notified immediately when a full chain exhaustion occurs so you can take manual action.' },
    { q: 'How long are usage analytics retained?', a: 'Detailed per-request logs are retained for 30 days. Aggregated hourly metrics are retained for 90 days. Daily and monthly summaries are retained indefinitely. You can export any time range as CSV or JSON via the API or dashboard for long-term archival in your own systems.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }
