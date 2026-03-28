'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'What models can I deploy?', answer: 'Any ONNX, PyTorch, TensorFlow, or GGUF model. Pre-optimized support for Llama, Mistral, Qwen, Whisper, Stable Diffusion, and popular open-source models. Upload your fine-tuned models or choose from our model marketplace.' },
  { question: 'How does auto-scaling work?', answer: 'GPU instances scale from 0 to N based on request queue depth. Scale-to-zero means you pay nothing when idle. Burst scaling handles traffic spikes in under 30 seconds. Configure min/max instances and concurrency per model.' },
  { question: 'Can I do A/B testing between models?', answer: 'Yes. Route traffic between model versions with configurable percentages. Compare latency, accuracy, and user feedback side-by-side. Automatically promote the winning model after statistical significance is reached.' },
  { question: 'What about LoRA adapters?', answer: 'First-class LoRA support. Upload base model once, then hot-swap LoRA adapters per request. Run 10+ specialized models on one GPU. Perfect for multi-tenant or multi-domain deployments.' },
]

const features = [
  { title: 'One-Click Deploy', desc: 'Upload a model, configure inference parameters, and deploy to the global edge. Support for ONNX, PyTorch, TensorFlow, and GGUF formats.' },
  { title: 'Multi-GPU Inference', desc: 'Automatic model sharding across GPUs for large models. Tensor parallelism and pipeline parallelism for optimal throughput.' },
  { title: 'Auto-Scaling', desc: 'Scale from 0 to N GPU instances based on demand. Scale-to-zero when idle. Burst scaling in under 30 seconds for traffic spikes.' },
  { title: 'LoRA Hot-Swap', desc: 'Load base model once, swap LoRA adapters per request. Run 10+ specialized models on one GPU with sub-millisecond switching.' },
  { title: 'Model Versioning', desc: 'Track every model version with metadata, metrics, and lineage. Roll back to any previous version instantly.' },
  { title: 'A/B Testing', desc: 'Split traffic between model versions. Compare latency, accuracy, and quality. Auto-promote winners after statistical significance.' },
  { title: 'Streaming Inference', desc: 'Server-sent events for token-by-token LLM streaming. Sub-100ms time-to-first-token on optimized models.' },
  { title: 'Batch Processing', desc: 'Queue large inference jobs for async processing. Dynamic batching groups requests for GPU efficiency.' },
  { title: 'Model Marketplace', desc: 'Browse pre-optimized open-source models ready for one-click deployment. Llama, Mistral, Qwen, Whisper, and more.' },
  { title: 'Real-Time Analytics', desc: 'Latency percentiles, throughput, error rates, GPU utilization, and cost per inference — all in real-time dashboards.' },
  { title: 'Custom Endpoints', desc: 'Define custom pre/post-processing pipelines. Transform inputs, validate outputs, and add business logic around inference.' },
  { title: 'OpenAI-Compatible API', desc: 'Drop-in replacement for OpenAI API format. Switch your application to self-hosted models without code changes.' },
]

const comparison = [
  { feature: 'Scale-to-zero', echo: 'Yes (pay nothing idle)', replicate: 'Cold starts', runpod: 'Serverless option', hf: 'No' },
  { feature: 'LoRA hot-swap', echo: 'Per-request adapters', replicate: 'No', runpod: 'Manual', hf: 'No' },
  { feature: 'A/B testing', echo: 'Built-in traffic split', replicate: 'No', runpod: 'No', hf: 'No' },
  { feature: 'Model versioning', echo: 'Full lineage', replicate: 'Versions', runpod: 'Manual', hf: 'Hub versions' },
  { feature: 'Streaming', echo: 'SSE token streaming', replicate: 'Webhook', runpod: 'Yes', hf: 'Yes' },
  { feature: 'Dynamic batching', echo: 'Automatic', replicate: 'No', runpod: 'vLLM support', hf: 'TGI batching' },
  { feature: 'OpenAI-compatible', echo: 'Drop-in replacement', replicate: 'Custom API', runpod: 'vLLM endpoints', hf: 'TGI compatible' },
  { feature: 'Custom pipelines', echo: 'Pre/post processing', replicate: 'Cog models', runpod: 'Handlers', hf: 'Custom endpoints' },
  { feature: 'Analytics', echo: 'Real-time dashboard', replicate: 'Basic logs', runpod: 'Basic metrics', hf: 'Limited' },
  { feature: 'Infrastructure', echo: 'Cloudflare + GPU', replicate: 'Cloud', runpod: 'Cloud GPUs', hf: 'AWS/GCP' },
  { feature: 'Starting price', echo: '$0.10/hr GPU', replicate: '$0.10/hr', runpod: '$0.20/hr', hf: '$0.06/hr' },
]

export default function ModelHostPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#06b6d4'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Model Host', href: '/model-host' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Model Host</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Deploy AI models to the global edge with auto-scaling, LoRA hot-swap, A/B testing, and OpenAI-compatible APIs. Scale-to-zero means you only pay when inference runs.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=model-host&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Production ML Infrastructure</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Replicate</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>RunPod</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>HuggingFace</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.replicate}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.runpod}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.hf}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['2 deployed models', '100 GPU-hours included', 'Auto-scaling', 'OpenAI-compatible API', 'Model marketplace', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$149', period: '/mo', features: ['10 deployed models', '500 GPU-hours included', 'LoRA hot-swap', 'A/B testing', 'Model versioning', 'Streaming inference', 'Real-time analytics', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$499', period: '/mo', features: ['Unlimited models', '2,000 GPU-hours included', 'Multi-GPU sharding', 'Custom pipelines', 'Batch processing', 'Dynamic batching', 'SLA guarantee', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=model-host&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.question} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.question}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.answer}</p></details>))}
        </section>
      </div>
    </>
  )
}
