'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Model Host',
  tagline: 'Deploy and serve AI models at the edge with automatic scaling and inference optimization.',
  accent: '#0ea5e9',
  productUrl: '/model-host',
  workerUrl: 'https://echo-model-host.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Model Host is a production-grade AI model serving platform that deploys machine learning models to the Cloudflare edge network for ultra-low-latency inference. Upload a trained model, configure its serving parameters, and the platform handles versioning, scaling, caching, and traffic routing automatically — no infrastructure management required.',
    'The platform supports a wide range of model architectures including transformer-based language models, LoRA adapters, embedding models, classification heads, and custom ONNX models. Models are optimized for edge inference at deployment time through quantization, pruning, and runtime compilation. LoRA adapters can be hot-swapped without redeploying the base model, enabling rapid experimentation and A/B testing.',
    'Built for teams that need reliable, scalable AI inference without managing GPU clusters. Echo Model Host routes requests to the nearest edge location, caches repeated inference results, batches concurrent requests for throughput optimization, and meters usage at the per-request level for precise cost attribution.',
  ],
  gettingStarted: [
    { step: 1, title: 'Authenticate and Access', desc: 'Obtain your API key from the Echo Prime dashboard. All Model Host operations are accessed through the SDK Gateway at echo-sdk-gateway.bmcii1976.workers.dev with the X-Echo-API-Key header.' },
    { step: 2, title: 'Register a Model', desc: 'Use POST /models/deploy with your model artifact (ONNX, SafeTensors, or GGUF format), model metadata (name, version, architecture), and serving configuration (max batch size, timeout, memory limit). The platform validates, optimizes, and deploys the model to the edge network.' },
    { step: 3, title: 'Run Inference', desc: 'Send POST /inference with the model ID and input payload. The system routes the request to the nearest edge instance, runs inference, and returns the output. Response times are typically under 100ms for cached models at the edge.' },
    { step: 4, title: 'Load LoRA Adapters', desc: 'For fine-tuned variants, upload LoRA adapters via POST /adapters/load. Adapters are merged with the base model at runtime without redeployment. Multiple adapters can be registered per base model for A/B testing or per-customer customization.' },
    { step: 5, title: 'Monitor and Optimize', desc: 'Track inference latency, throughput, error rates, and cache hit ratios through GET /metrics. Use the usage dashboard to monitor per-model and per-adapter request volumes. Set up alerts for latency spikes or error rate increases.' },
  ],
  features: [
    { title: 'Edge Model Deployment', desc: 'Models are deployed to Cloudflare edge locations worldwide, reducing inference latency to single-digit milliseconds for cached requests. Cold-start times are minimized through pre-warming and model sharding across edge nodes.' },
    { title: 'Inference at the Edge', desc: 'Requests are routed to the nearest edge location with a warm model instance. The inference engine supports synchronous and asynchronous modes, streaming token generation for language models, and batched inference for throughput-sensitive workloads.' },
    { title: 'Auto-Scaling', desc: 'The platform automatically scales inference capacity based on request volume. During traffic spikes, additional edge instances are provisioned within seconds. During quiet periods, instances scale down to zero to eliminate idle costs.' },
    { title: 'LoRA Adapter Support', desc: 'Hot-swap fine-tuned LoRA adapters on base models without redeployment. Each adapter is loaded on-demand and cached at the edge. Supports adapter composition (stacking multiple adapters) and per-request adapter selection.' },
    { title: 'Model Versioning', desc: 'Every deployment creates a new version with an immutable snapshot of the model artifact and configuration. Roll back to any previous version instantly. Version aliases (latest, stable, canary) provide stable endpoints for consumers.' },
    { title: 'A/B Testing', desc: 'Split inference traffic between model versions or LoRA adapters using configurable traffic weights. Track performance metrics per variant to determine which model performs best before promoting to full traffic.' },
    { title: 'Inference Caching', desc: 'Identical inference requests are cached at the edge with configurable TTL. Cache keys are computed from the input hash and model version. Cache hit rates typically reach 40-60% for production workloads, dramatically reducing compute costs.' },
    { title: 'Batched Predictions', desc: 'Concurrent inference requests are automatically batched for GPU-optimized throughput. Configurable batch windows (1-100ms) trade latency for throughput. Batch sizes are adjusted dynamically based on request patterns.' },
    { title: 'Usage Metering', desc: 'Per-request metering tracks compute time, memory usage, cache hits, and token counts. Usage data is available in real time via the /usage endpoint and aggregated into daily/monthly reports for billing and cost attribution.' },
    { title: 'Model Registry', desc: 'A central catalog of all deployed models with metadata, version history, performance benchmarks, and usage statistics. Search and filter by architecture, task type, or custom tags. The registry serves as the source of truth for model governance.' },
    { title: 'GPU Routing', desc: 'For large models that exceed edge compute limits, requests are transparently routed to GPU-equipped inference nodes on BRAVO or cloud instances. Routing decisions are automatic based on model size, input complexity, and current edge capacity.' },
    { title: 'Latency Optimization', desc: 'The serving stack is optimized at every layer — model quantization, operator fusion, memory pooling, and connection reuse. P99 latency targets are configurable per model, with automatic alerts when targets are breached.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/models/deploy', desc: 'Deploy a new model or model version. Accepts the model artifact (multipart upload or R2 reference), metadata, and serving configuration. Returns the deployment status and model ID.', auth: true },
    { method: 'POST', path: '/inference', desc: 'Run inference on a deployed model. Accepts model_id (or alias), input payload, and optional parameters (temperature, max_tokens, adapter_id). Returns the model output with latency and usage metadata.', auth: true },
    { method: 'GET', path: '/models', desc: 'List all deployed models with their versions, status, and summary metrics. Supports filtering by architecture, task type, tag, and deployment status. Returns paginated results.', auth: true },
    { method: 'GET', path: '/metrics', desc: 'Retrieve inference metrics for a specific model or across all models. Returns latency percentiles, throughput, error rates, cache hit ratio, and usage counts over the specified time window.', auth: true },
    { method: 'POST', path: '/adapters/load', desc: 'Upload and register a LoRA adapter for a base model. Accepts the adapter weights (SafeTensors format), base model ID, and metadata. The adapter is cached at the edge for on-demand loading.', auth: true },
    { method: 'GET', path: '/usage', desc: 'Retrieve detailed usage data — request counts, compute time, token counts, and cache statistics — broken down by model, adapter, and time period. Used for billing reconciliation and cost optimization.', auth: true },
  ],
  userGuide: [
    {
      title: 'Deploying Your First Model',
      id: 'deploy',
      content: [
        'Model Host accepts models in ONNX, SafeTensors, and GGUF formats. Before deployment, ensure your model is exported in one of these formats with all required metadata (input/output shapes, tokenizer configuration for language models, and preprocessing parameters).',
        'Upload the model artifact via POST /models/deploy. For models larger than 100MB, upload to R2 first and provide the R2 object key in the deployment request. The platform validates the model format, runs optimization passes (quantization, operator fusion), and deploys to the edge network.',
        'After deployment, the model enters a warming phase where it is loaded into memory on edge nodes. This typically takes 10-30 seconds. Once warm, the model status changes to "serving" and inference requests are accepted. Monitor the deployment via GET /models/:id.',
        'Each deployment creates an immutable version. To update a model, deploy a new version and use the version alias system to shift traffic. The "latest" alias always points to the most recent version, while "stable" can be pinned to any version.',
      ],
    },
    {
      title: 'Working with LoRA Adapters',
      id: 'lora',
      content: [
        'LoRA (Low-Rank Adaptation) adapters allow you to fine-tune a base model for specific tasks without retraining or redeploying the full model. Upload your adapter weights via POST /adapters/load, specifying the base model ID and adapter metadata.',
        'At inference time, include the adapter_id parameter in your request. The platform loads the adapter and merges it with the base model at runtime. Adapter loading is cached — the first request incurs a small latency penalty (50-200ms) while subsequent requests use the cached merged weights.',
        'You can register multiple adapters per base model and switch between them on a per-request basis. This enables per-customer model customization, domain-specific fine-tuning, and rapid A/B testing of adapter variants without managing separate model deployments.',
      ],
    },
    {
      title: 'Optimizing Performance and Cost',
      id: 'optimization',
      content: [
        'Enable inference caching for workloads with repeated inputs. Caching eliminates compute costs for duplicate requests and reduces P99 latency. Configure the cache TTL based on how frequently your model outputs change — longer TTLs for stable models, shorter for frequently updated ones.',
        'Use batched inference mode for high-throughput workloads. Configure a batch window (1-100ms) that groups concurrent requests into a single batched inference call. Larger batch windows improve throughput but add latency. Start with 10ms and adjust based on your latency/throughput tradeoff.',
        'Monitor the /metrics endpoint to identify optimization opportunities. High cache miss rates suggest your input distribution is sparse — consider normalizing inputs before inference. High latency P99 may indicate cold starts — increase the pre-warming instance count. Usage metering data helps identify which models and adapters are most cost-effective.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Automatic Model Optimization', desc: 'Deployed models are automatically optimized for edge inference through quantization (FP16, INT8), operator fusion, and runtime compilation. Optimization is transparent — the model API contract remains identical while inference speed improves by 2-5x and memory usage drops by 50-75%.' },
    { capability: 'Intelligent Request Routing', desc: 'The routing engine analyzes each inference request to determine the optimal serving path — edge cache, edge compute, or GPU-accelerated backend. Routing decisions factor in model size, input complexity, current edge load, and target latency SLA to minimize cost while meeting performance targets.' },
    { capability: 'Adaptive Batch Sizing', desc: 'The batch inference engine dynamically adjusts batch sizes based on real-time request patterns. During traffic bursts, batch sizes increase to maximize GPU utilization. During steady-state traffic, batches are kept small to minimize latency. The system learns optimal batch parameters over time.' },
    { capability: 'Anomaly-Aware Scaling', desc: 'The auto-scaler uses time-series forecasting to predict traffic patterns and pre-provision capacity before demand spikes. Anomalous traffic patterns (sudden 10x increases) trigger emergency scaling with faster provisioning. The system distinguishes between organic growth and attack traffic.' },
  ],
  troubleshooting: [
    { issue: 'Model deployment fails with validation error', solution: 'Verify that the model artifact is in a supported format (ONNX, SafeTensors, GGUF) and includes all required metadata. For ONNX models, ensure the opset version is 13 or higher. For language models, confirm the tokenizer configuration is bundled with the artifact. Check the error response for the specific validation field that failed.' },
    { issue: 'Inference latency is higher than expected', solution: 'Check the cache hit ratio via GET /metrics — low cache hit rates mean most requests require fresh compute. Enable or extend the cache TTL. For cold-start latency, increase the pre-warming instance count in the model configuration. If latency is consistently high, the model may be too large for edge compute — enable GPU routing as a fallback.' },
    { issue: 'LoRA adapter loading fails or produces wrong output', solution: 'Ensure the adapter was trained against the exact base model version deployed on Model Host. Adapter/base model mismatches produce either loading errors or degraded output quality. Verify the adapter format is SafeTensors and the rank/alpha parameters match the training configuration.' },
    { issue: 'Usage metering shows unexpected high compute costs', solution: 'Review the per-model breakdown in GET /usage to identify which model is consuming the most compute. Check if inference caching is enabled — cache misses are significantly more expensive. Audit whether A/B testing configurations are routing traffic to an unoptimized model variant. Consider lowering the max_tokens parameter for language models to reduce per-request compute.' },
  ],
  faq: [
    { q: 'What model formats are supported?', a: 'Echo Model Host supports ONNX (opset 13+), SafeTensors, and GGUF formats. ONNX provides the broadest framework compatibility (PyTorch, TensorFlow, JAX exports). SafeTensors is recommended for transformer models. GGUF is supported for quantized language models. Custom formats can be converted using our provided conversion scripts.' },
    { q: 'What is the maximum model size?', a: 'Edge-only models are limited to 2GB after optimization. Models up to 70B parameters can be served through GPU-routed inference, where requests are transparently forwarded to GPU-equipped nodes. There is no hard upper limit for GPU-routed models, but larger models incur higher per-request costs.' },
    { q: 'How does pricing work?', a: 'Pricing is based on compute time (per-millisecond), memory usage, and request count. Cached inference requests are billed at a 90% discount since they require no compute. Free tier includes 10,000 inference requests per month. Pro and Enterprise tiers offer volume discounts and reserved capacity pricing.' },
    { q: 'Can I use Model Host for real-time streaming inference?', a: 'Yes. Language models support streaming token generation via Server-Sent Events (SSE). Set stream: true in the inference request to receive tokens as they are generated rather than waiting for the complete response. Streaming is compatible with inference caching for the full response.' },
    { q: 'How are models kept secure?', a: 'Model artifacts are encrypted at rest in R2 storage and in transit to edge nodes. Inference requests and responses are encrypted via TLS 1.3. Model weights are loaded into isolated memory spaces per customer — no cross-tenant model access is possible. API key authentication is required for all operations.' },
  ],
}

export default function Page() { return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/model-host' },
      ]} />
      <ProductDoc {...data} />
    </>
  ) }
