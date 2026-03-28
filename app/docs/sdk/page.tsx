'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo SDK Gateway',
  tagline: 'One API for the entire Echo ecosystem \u2014 engines, voices, knowledge, bots, memory, and 130+ products.',
  accent: '#14b8a6',
  productUrl: '/sdk',
  workerUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev',
  version: '2.0.0',
  overview: [
    'The Echo SDK Gateway is the single entry point to the entire ECHO ecosystem. Instead of managing individual Worker URLs, authentication schemes, and API contracts for each of our 130+ microservices, developers interact with one unified API that handles routing, authentication, rate limiting, and usage tracking behind the scenes. Every product \u2014 from Intelligence Engines and Voice AI to Knowledge Forge and Bot Fleet \u2014 is accessible through a consistent REST interface.',
    'Under the hood, the Gateway routes each request to the appropriate Cloudflare Worker using domain-aware routing logic. It validates API keys, enforces per-tier rate limits, logs usage telemetry for billing and analytics, and applies response caching where appropriate. The result is a developer experience that feels like calling a single cohesive API, even though the backend spans dozens of independently deployed services across the Cloudflare edge network.',
    'Whether you are building a tax research application that queries Intelligence Engines, a customer service bot that leverages Voice AI and Chat, or an internal tool that searches the Knowledge Forge, the SDK Gateway is your starting point. Official SDK libraries for JavaScript/TypeScript and Python handle authentication, retries, and type safety so you can focus on building your product rather than managing infrastructure.',
  ],
  gettingStarted: [
    { step: 1, title: 'Get Your API Key', desc: 'Sign up at echo-ept.com/sdk/signup. Your API key is generated instantly \u2014 no credit card required for the free tier. Store the key securely in an environment variable.' },
    { step: 2, title: 'Make Your First Request', desc: 'Use curl or any HTTP client to call GET /api/health with your API key in the X-Echo-API-Key header. A 200 response confirms your key is valid and the gateway is reachable.' },
    { step: 3, title: 'Explore Endpoints', desc: 'Browse the API Reference tab for the full endpoint catalog. Start with /api/engines/query to query an Intelligence Engine or /api/chat to interact with the AI chat system.' },
    { step: 4, title: 'Integrate the SDK', desc: 'Install the official SDK (npm install @echo-omega-prime/sdk or pip install echo-prime-sdk). The SDK handles authentication, retries, and typed responses automatically.' },
    { step: 5, title: 'Monitor Your Usage', desc: 'Call GET /api/usage to see your request counts, rate limit status, and per-endpoint breakdown. Set up alerts in your dashboard to avoid hitting limits unexpectedly.' },
  ],
  features: [
    { title: 'Unified API', desc: 'One base URL, one authentication scheme, one response format for all 130+ Echo products. No need to manage individual Worker URLs or service-specific auth tokens.' },
    { title: 'Authentication Management', desc: 'API key-based authentication with per-key scoping. Keys can be restricted to specific endpoints, IP ranges, or usage tiers. Rotate keys without downtime.' },
    { title: 'Rate Limiting', desc: 'Per-tier rate limits enforced at the edge with sub-millisecond overhead. Free: 100/day, Starter: 1,000/day, Pro: 10,000/day, Enterprise: unlimited. Burst limits protect against traffic spikes.' },
    { title: 'Usage Analytics', desc: 'Real-time dashboards showing request volume, latency percentiles, error rates, and per-endpoint breakdowns. Export data via API or CSV for custom reporting.' },
    { title: 'SDK Libraries', desc: 'Official TypeScript and Python SDKs with full type definitions, automatic retries with exponential backoff, request/response logging, and built-in error handling.' },
    { title: 'Endpoint Discovery', desc: 'GET /api/health returns a service catalog listing every available endpoint, its method, required parameters, and authentication requirements. Always up to date.' },
    { title: 'Webhook Relay', desc: 'Register webhook URLs to receive real-time notifications for engine completions, bot events, and system alerts. Payloads are signed with HMAC-SHA256 for verification.' },
    { title: 'Batch Requests', desc: 'Send up to 50 requests in a single batch call. The gateway executes them in parallel and returns all responses in one payload, reducing round trips and latency.' },
    { title: 'Error Handling', desc: 'Consistent error envelope across all endpoints: { success: false, error: string, code: number }. Detailed error messages with actionable fix suggestions.' },
    { title: 'Response Caching', desc: 'Intelligent caching for read-heavy endpoints like knowledge search and engine catalog queries. Cache headers and ETags let clients skip redundant requests.' },
    { title: 'API Versioning', desc: 'Versioned endpoints (v1, v2) ensure backward compatibility. Deprecated endpoints return sunset headers 90 days before removal. No surprise breaking changes.' },
    { title: 'Health Monitoring', desc: 'GET /api/health returns real-time status for the gateway and all downstream services. Integrates with external monitoring tools via standard health check protocols.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/engines/query', desc: 'Query an Intelligence Engine with natural language. Specify engine_id or let the router auto-detect the best domain. Returns doctrine-backed analysis with authority citations.', auth: true },
    { method: 'POST', path: '/api/tts', desc: 'Generate speech from text using 69+ cloned voices. Supports emotion control, provider selection (ElevenLabs, Edge TTS, Cartesia), and multiple output formats.', auth: true },
    { method: 'POST', path: '/api/chat', desc: 'Send a message to the AI chat system. Supports 14 personalities, conversation context, and engine-backed domain queries via Sentinel mode.', auth: true },
    { method: 'POST', path: '/api/knowledge/search', desc: 'Semantic search across the Knowledge Forge with 24,000+ indexed documents. Returns ranked chunks with similarity scores and source metadata.', auth: true },
    { method: 'GET', path: '/api/bots', desc: 'List all bots in your account with their platform connections, status, and configuration. Supports filtering by platform and status.', auth: true },
    { method: 'POST', path: '/api/memory', desc: 'Store or retrieve memory entries from the 9-pillar memory system. Supports semantic search, importance filtering, and cross-session persistence.', auth: true },
    { method: 'GET', path: '/api/tools', desc: 'Discover available MCP tools and their capabilities. Returns tool schemas, required parameters, and usage examples.', auth: true },
    { method: 'GET', path: '/api/health', desc: 'Gateway health check and service catalog. Returns status of all downstream services, uptime metrics, and available endpoints. No authentication required.' },
    { method: 'GET', path: '/api/usage', desc: 'Get your API usage statistics: total requests, per-endpoint breakdown, rate limit status, and billing period summary.', auth: true },
    { method: 'POST', path: '/api/keys', desc: 'Manage API keys: create, rotate, revoke, and scope keys to specific endpoints or IP ranges. Admin-level access required.', auth: true },
  ],
  userGuide: [
    { id: 'authentication', title: 'Authentication', content: [
      'All API requests require an API key passed via the X-Echo-API-Key header. Keys are generated on signup and can be managed from your dashboard or via the /api/keys endpoint.',
      'Keys are scoped by tier (Free, Starter, Pro, Enterprise) which determines your rate limits and accessible endpoints. Enterprise keys can be further scoped to specific endpoints or IP address ranges for security.',
      'Never expose your API key in client-side code, public repositories, or browser network requests. Use server-side proxies or environment variables. If a key is compromised, rotate it immediately via the dashboard \u2014 the old key is revoked instantly.',
    ]},
    { id: 'making-requests', title: 'Making Requests', content: [
      'All requests use standard HTTP methods (GET, POST, PUT, DELETE) with JSON request and response bodies. Set Content-Type: application/json for all POST/PUT requests.',
      'Every response follows a consistent envelope: { "success": true, "data": {...} } for successful requests and { "success": false, "error": "message", "code": 400 } for errors. Parse the success field first before accessing data.',
      'For large responses, the gateway supports pagination via limit and offset query parameters. Default page size is 20 items, maximum is 100. The response includes a total field for calculating page counts.',
    ]},
    { id: 'error-handling', title: 'Error Handling', content: [
      'HTTP status codes follow standard conventions: 200 for success, 400 for client errors, 401 for authentication failures, 403 for authorization failures, 429 for rate limits, and 500 for server errors.',
      'Rate limit errors (429) include a Retry-After header with the number of seconds to wait. Implement exponential backoff in your client code. The official SDKs handle this automatically with configurable retry counts.',
      'For transient 500 errors, retry with exponential backoff (1s, 2s, 4s, 8s). If the error persists after 3 retries, check the /api/health endpoint to verify the target service is operational.',
    ]},
    { id: 'rate-limits', title: 'Rate Limits', content: [
      'Rate limits are enforced per API key at two levels: daily request limit and per-minute burst limit. Free tier: 100 daily / 5 per minute. Starter: 1,000 daily / 30 per minute. Pro: 10,000 daily / 120 per minute. Enterprise: unlimited / custom burst.',
      'Every response includes rate limit headers: X-RateLimit-Limit (your daily max), X-RateLimit-Remaining (requests left today), and X-RateLimit-Reset (Unix timestamp when the limit resets at midnight UTC).',
      'Health checks (GET /api/health) and the service catalog are exempt from rate limiting. Batch requests count as one request against your limit regardless of how many sub-requests they contain.',
    ]},
    { id: 'sdk-libraries', title: 'SDK Libraries', content: [
      'The JavaScript/TypeScript SDK is available via npm: npm install @echo-omega-prime/sdk. It provides full type definitions, automatic retry logic, request/response interceptors, and streaming support for TTS endpoints.',
      'The Python SDK is available via pip: pip install echo-prime-sdk. It supports both synchronous and async clients, automatic pagination, and built-in logging. Compatible with Python 3.8+.',
      'Both SDKs are open source and accept contributions. For other languages, use the REST API directly \u2014 any HTTP client that can set headers and parse JSON will work. OpenAPI spec available at GET /api/openapi.json.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Smart Routing', desc: 'The gateway analyzes each request to determine the optimal downstream Worker. For engine queries, it detects the domain from the question text and routes to the best-matching engine cluster without requiring the caller to specify an engine ID.' },
    { capability: 'Auto-Retry with Backoff', desc: 'When a downstream Worker returns a transient error (502, 503, 504), the gateway automatically retries the request with exponential backoff. The caller receives a successful response transparently, improving effective uptime to 99.99%.' },
    { capability: 'Response Caching', desc: 'Frequently requested data (engine catalogs, knowledge search results, voice listings) is cached at the edge with configurable TTLs. Cache invalidation propagates globally in under 2 seconds. Reduces downstream load by 60%+ for read-heavy workloads.' },
    { capability: 'Request Optimization', desc: 'The gateway analyzes batch requests and parallelizes independent sub-requests across Workers. It also deduplicates identical concurrent requests, serving all callers from a single downstream call.' },
    { capability: 'Usage Prediction', desc: 'AI analyzes your usage patterns to predict when you will hit rate limits and suggests tier upgrades proactively. It also identifies underused endpoints and recommends cost optimizations based on your actual query patterns.' },
  ],
  troubleshooting: [
    { issue: 'Receiving 401 Unauthorized on every request', solution: 'Verify your API key is included in the X-Echo-API-Key header (not Authorization). Check for trailing whitespace or newlines in the key value. Generate a fresh key from your dashboard if the issue persists.' },
    { issue: 'Requests are slow (>5 seconds)', solution: 'Check which endpoint is slow by reviewing the X-Response-Time header. Engine queries on complex cross-domain topics can take 2-3 seconds. For faster responses, specify the engine_id directly instead of relying on auto-routing.' },
    { issue: 'Hitting rate limits unexpectedly', solution: 'Check GET /api/usage to see your per-endpoint breakdown. Batch requests count as one call. If a specific endpoint is consuming most of your quota, consider caching responses client-side or upgrading your tier.' },
    { issue: 'Batch request returns partial failures', solution: 'The batch endpoint returns individual success/error status for each sub-request. Check the responses array for any items with success: false. Retry only the failed items rather than the entire batch.' },
  ],
  faq: [
    { q: 'Is there a free tier?', a: 'Yes. The free tier provides 100 API requests per day across all endpoints with no credit card required. It includes access to all 5,486+ engines, knowledge search, and voice synthesis.' },
    { q: 'How do I get an API key?', a: 'Sign up at echo-ept.com/sdk/signup. Your API key is generated instantly and displayed on your dashboard. Store it securely in an environment variable \u2014 never expose it in client-side code.' },
    { q: 'Can I use the SDK with TypeScript?', a: 'Yes. The official @echo-omega-prime/sdk package ships with full TypeScript declarations and supports both ESM and CommonJS. Install via npm and import { EchoPrimeSDK } to get started with full autocompletion.' },
    { q: 'What happens when I hit the rate limit?', a: 'You receive an HTTP 429 response with a Retry-After header indicating seconds until your next allowed request. The official SDKs handle this automatically with exponential backoff and configurable retry counts.' },
    { q: 'Does the gateway support WebSocket or streaming?', a: 'The TTS endpoint supports chunked transfer encoding for audio streaming. Full WebSocket support for real-time engine queries and chat is on the roadmap for v2.1.' },
  ],
}

export default function SDKGatewayDocPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/sdk' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
