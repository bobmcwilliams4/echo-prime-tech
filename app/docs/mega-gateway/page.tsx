'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Mega Gateway',
  tagline: 'Universal MCP tool proxy aggregating 37,475+ tools across 1,873 servers through a single API',
  accent: '#ef4444',
  productUrl: '/mega-gateway',
  workerUrl: 'echo-mega-gateway-cloud.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Mega Gateway is a unified proxy for the Model Context Protocol ecosystem, aggregating 37,475+ tools from 1,873 registered MCP servers behind a single authenticated API. Search for any tool by name or capability, execute it with normalized parameters, and receive structured results — all without managing individual server connections.',
    'Every tool in the catalog is indexed with category tags, parameter schemas, usage statistics, and health status. Fuzzy search returns semantically relevant tools even when you do not know the exact tool name. Tool execution is proxied through the gateway with automatic parameter validation, response normalization, and error wrapping.',
    'Rate limiting and response caching protect downstream servers while delivering sub-100ms responses for cached tool calls. Usage analytics surface your most-used tools, identify failing tools, and recommend alternatives when a tool is unavailable. The gateway is the single integration point for any AI system that needs to call external tools.',
  ],
  gettingStarted: [
    { step: 1, title: 'Get your API key', desc: 'Sign in to echo-ept.com/mega-gateway and generate an API key from the Keys tab. Include it as X-Echo-API-Key in every request header. Keys are scoped to specific tool categories for security.' },
    { step: 2, title: 'Search for tools', desc: 'GET /tools/search?q=your+query to find tools by name, description, or category. Results include tool ID, parameter schema, usage count, and health status. Use category filters to narrow results to your domain.' },
    { step: 3, title: 'Execute a tool', desc: 'POST to /tools/execute with the tool_id and a parameters object matching the tool schema. The gateway validates parameters, routes to the healthiest server, and returns a normalized response envelope.' },
    { step: 4, title: 'Review execution results', desc: 'Responses include the tool output, execution duration, server health at time of call, and a usage_id for audit logging. Error responses include the original server error and suggested alternative tools.' },
    { step: 5, title: 'Set up response caching', desc: 'Add cache_ttl (in seconds) to your execute request for idempotent tool calls. Cached responses are served instantly and count at 10% against your rate limit quota, dramatically extending effective throughput.' },
  ],
  features: [
    { title: '37,475+ Tools Indexed', desc: 'The largest MCP tool registry available. Every tool includes a full parameter schema, example calls, return type definitions, and health history. Updated continuously as servers register and push updates.' },
    { title: 'Tool Search with Fuzzy Matching', desc: 'BM25 plus semantic search finds tools by name, description, or intended use. Queries like "send email" return all email-capable tools ranked by relevance and real-time health score.' },
    { title: 'Tool Execution Proxy', desc: 'Execute any indexed tool through the gateway API without connecting to individual MCP servers. The gateway handles authentication, protocol translation, timeout management, and response normalization.' },
    { title: 'Server Health Monitoring', desc: 'Each of the 1,873 registered servers is health-checked every 60 seconds. Degraded servers are deprioritized in search results. Critically unhealthy servers are excluded from execution routing automatically.' },
    { title: 'Rate Limiting', desc: 'Per-API-key rate limiting with configurable tiers: Free (100 req/min), Pro (1,000 req/min), Enterprise (10,000 req/min). Cached responses count at 10% against quota for efficient high-volume workflows.' },
    { title: 'Response Caching', desc: 'Idempotent tool calls can be cached at the gateway for 1 second to 24 hours. Cache hit rates exceed 60% for common tool patterns, dramatically reducing latency and downstream server load.' },
    { title: 'Tool Categorization', desc: 'All tools are tagged with primary and secondary categories: Communication, Data, Files, Web, Code, AI, Databases, APIs, Automation, and 40+ subcategories. Filter searches and scope API keys by category.' },
    { title: 'Usage Analytics', desc: 'Per-key dashboards show call volume, top tools, error rates by tool and server, average latency percentiles, and cost estimates. Aggregate analytics identify the most popular tools across the ecosystem.' },
    { title: 'Bulk Tool Discovery', desc: 'GET /tools/discover with a task description returns a ranked list of tool chains — sequences of tools that together accomplish your goal. Ideal for building multi-step AI workflows and agent pipelines.' },
    { title: 'Tool Comparison', desc: 'Compare up to 5 tools side-by-side on parameter schema, return types, latency percentiles, error rates, and usage popularity to select the best tool for your specific use case and reliability requirements.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/tools/search', desc: 'Search the tool registry by query string, category, server, or tag. Returns ranked tool list with schemas, health status, and usage statistics.', auth: true },
    { method: 'POST', path: '/tools/execute', desc: 'Execute a tool by ID with a parameters object. Optionally set cache_ttl and async flag. Returns tool output and execution metadata including server health.', auth: true },
    { method: 'GET', path: '/servers', desc: 'List all registered MCP servers with health status, tool count, last heartbeat timestamp, and uptime statistics over 7 and 30 day windows.', auth: true },
    { method: 'GET', path: '/tools/:id', desc: 'Retrieve full tool definition: name, description, server, parameter schema with types and examples, return type, and usage history over 30 days.', auth: true },
    { method: 'GET', path: '/categories', desc: 'List all tool categories with tool counts, subcategory breakdown, and top 5 tools per category by usage volume.', auth: false },
    { method: 'GET', path: '/stats', desc: 'Return gateway-wide statistics: total tools, active servers, calls per minute, cache hit rate, and p50/p95/p99 latency percentiles.', auth: false },
  ],
  userGuide: [
    {
      title: 'Searching Tools',
      id: 'searching',
      content: [
        'Tool search supports natural-language queries. You do not need to know exact tool names — describe what you want to accomplish. The search engine combines keyword matching with semantic similarity to surface tools that match your intent across different servers and naming conventions.',
        'Add category to your search to narrow results: GET /tools/search?q=parse+document&category=Files returns only file-processing tools. Chain multiple categories with comma separation. Use server= to restrict results to a specific MCP server you trust.',
        'Health filtering is on by default — degraded tools are deprioritized and critically unhealthy tools are hidden. Pass include_unhealthy=true to see all tools including those on unstable servers. Useful for debugging when a preferred tool is temporarily unavailable.',
      ],
    },
    {
      title: 'Executing Tools',
      id: 'executing',
      content: [
        'Every tool execution goes through three phases: parameter validation against the tool JSON Schema, routing to the healthiest server offering that tool, and response normalization into a consistent envelope. If parameter validation fails, you receive a detailed error listing each invalid field with correction hints.',
        'For long-running tools, set async: true in your execute request. You receive a job_id immediately and can poll GET /jobs/:id for status and results. Async jobs run for up to 5 minutes before timeout with partial results available if the tool supports streaming.',
        'Cache frequently-called idempotent tools to reduce latency and server load. Set cache_ttl in seconds (1–86400). The cache key is the tool ID plus a hash of the normalized parameters. Changing any parameter value bypasses the cache and executes fresh.',
      ],
    },
    {
      title: 'Server Management',
      id: 'servers',
      content: [
        'If you operate MCP servers, register them via POST /servers/register with your server URL, tool list, and auth configuration. The gateway begins health-checking your server and indexing your tools within 60 seconds of successful registration.',
        'Monitor your registered servers via GET /servers?owner=my-key. The response includes current health status, total calls routed this month, error rate, and p95 latency. Configure alert thresholds to receive webhooks when health degrades below your SLA.',
        'Server deregistration removes all tools from the index and stops health checking. Active tool executions in flight when deregistration occurs complete normally. Deregistration takes effect within 2 minutes and is reversible within 24 hours of accidental removal.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Intelligent Tool Selection', desc: 'Given a natural-language task description, the AI recommends the optimal tool or tool chain from the full catalog, considering tool health, latency percentiles, capability match, and your historical usage patterns.' },
    { capability: 'Parameter Auto-Fill', desc: 'For tools with well-defined schemas, the AI infers parameter values from natural-language context. Submit a task description alongside a tool ID and receive a pre-filled parameter object ready for review and execution.' },
    { capability: 'Tool Chain Recommendation', desc: 'The /tools/discover endpoint analyzes your task, identifies multi-step workflows, and returns ordered tool chains with data flow mappings showing how outputs from one tool feed as inputs to the next.' },
    { capability: 'Usage Pattern Optimization', desc: 'Analytics models identify inefficient tool usage patterns — redundant calls, unnecessary serialization, suboptimal caching opportunities — and surface optimization recommendations in the usage dashboard.' },
  ],
  troubleshooting: [
    { issue: 'Tool execution returns 404 not found', solution: 'Verify the tool ID is correct via GET /tools/:id. Tool IDs are stable but servers occasionally retire tools. Search for the capability again — a replacement tool may be available on a different server with a new ID.' },
    { issue: 'Rate limit exceeded errors', solution: 'Check your current quota usage via GET /keys/usage. Enable response caching for idempotent calls to reduce effective rate by up to 10x. Upgrade to Pro or Enterprise for higher rate limits.' },
    { issue: 'Tool returns unexpected response format', solution: 'The gateway normalizes all responses into { result, metadata, error } envelopes. If the raw tool output is malformed, the error field contains the original response. Report persistent normalization failures via the /feedback endpoint.' },
    { issue: 'Search returning irrelevant tools', solution: 'Add category filters to constrain the search domain. Use exact:true for precise name matching. If a specific tool is not appearing, verify it is on a healthy server via GET /servers — tools on critically unhealthy servers are excluded from default search results.' },
  ],
  faq: [
    { q: 'How is the 37,475 tool count determined?', a: 'Every registered MCP server tool manifest is crawled and indexed at registration time and on every update heartbeat. The count reflects distinct tool IDs across all healthy and degraded servers. Retired tools are excluded from the count.' },
    { q: 'Can I register my own MCP server?', a: 'Yes. Any MCP-compatible server can register via POST /servers/register. Free tier allows 1 server and 50 tools. Pro allows 10 servers and unlimited tools. Enterprise tier has no server or tool count limits.' },
    { q: 'What happens if the target MCP server is down during execution?', a: 'The gateway automatically retries on a secondary server offering the same tool if one exists. If no secondary is available, the call fails with a 503 and the cached response (if any) is returned instead with a cache_hit: true flag.' },
    { q: 'Are tool executions logged?', a: 'Execution logs include timestamp, tool ID, parameter hash (not values for privacy), response time, and HTTP status. Parameter values are never logged. Logs are retained for 30 days and exportable via the audit endpoint.' },
    { q: 'Is the gateway available globally?', a: 'Yes. The Mega Gateway runs on Cloudflare Workers at the edge, so requests are automatically routed to the nearest point of presence. Execution latency from Europe and Asia-Pacific is typically under 50ms for cached responses.' },
  ],
}

export default function MegaGatewayDocsPage() {
  return <ProductDoc {...data} />
}
