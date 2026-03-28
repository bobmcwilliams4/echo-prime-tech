'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { q: 'What voices are available?', a: '69 cloned voices across multiple languages using ElevenLabs multilingual_v2 model. Each voice has distinct personality traits — from authoritative CEO to warm customer service. Custom voice cloning available on Professional plans.' },
  { q: 'How does multi-provider routing work?', a: 'Speak Cloud automatically routes between ElevenLabs (highest quality), Edge TTS (lowest cost), and local GPU inference (zero cost on BRAVO). Quota-aware blending ensures you never hit rate limits while optimizing for quality and cost.' },
  { q: 'Can I use emotion-aware voice synthesis?', a: 'Yes. The 4-layer emotion engine analyzes text sentiment, context, and conversation history to adjust voice parameters — pace, pitch, emphasis, and emotion. A support response sounds empathetic; a sales pitch sounds confident.' },
  { q: 'What about latency?', a: 'Edge TTS delivers sub-200ms first-byte. ElevenLabs streams in 300-500ms. Local GPU inference on dedicated hardware achieves 100-150ms. All providers stream audio chunks for instant playback.' },
  { q: 'Is there speech-to-text too?', a: 'Yes. Whisper-based STT is available for transcription and voice commands. Combined with TTS, you get full duplex voice AI — listen, understand, and speak back in real-time.' },
]

const features = [
  { title: '69 Cloned Voices', desc: 'Professional voice clones using ElevenLabs multilingual_v2. Each voice calibrated for specific use cases — sales, support, education, entertainment.' },
  { title: 'Multi-Provider Routing', desc: 'Automatic routing between ElevenLabs, Edge TTS, and local GPU. Quota-aware blending optimizes cost while maintaining quality thresholds.' },
  { title: '4-Layer Emotion Engine', desc: 'Text sentiment analysis, conversation context, speaker persona, and audience adaptation. Voices sound natural because they react to what they are saying.' },
  { title: 'Real-Time Streaming', desc: 'Audio chunks stream as they generate. No waiting for full synthesis. Sub-200ms first-byte on Edge TTS, 300ms on ElevenLabs.' },
  { title: 'Persona Switching', desc: '14 AI personalities with distinct voice profiles. Switch personas mid-conversation — each with calibrated voice parameters and speaking style.' },
  { title: 'Custom Voice Cloning', desc: 'Upload voice samples and create custom clones. Minimum 30 seconds of clean audio. Supports 29 languages with multilingual_v2.' },
  { title: 'Speech-to-Text (STT)', desc: 'Whisper-based transcription for voice commands, dictation, and meeting notes. Combined with TTS for full voice AI pipelines.' },
  { title: 'SSML Support', desc: 'Fine-grained control with Speech Synthesis Markup Language. Adjust pauses, emphasis, pronunciation, and prosody at the word level.' },
  { title: 'Audio Formats', desc: 'Output in MP3, WAV, OGG, PCM, and raw audio. Configurable sample rates from 8kHz (phone) to 48kHz (studio quality).' },
  { title: 'Pronunciation Dictionary', desc: 'Custom pronunciation rules for brand names, technical terms, and domain-specific vocabulary. Never mispronounce a product name again.' },
  { title: 'Voice Analytics', desc: 'Track usage per voice, provider costs, latency percentiles, and quality scores. Optimize your voice strategy with real data.' },
  { title: 'Webhook & API', desc: 'REST API for on-demand synthesis. Webhooks for async generation. SDK for TypeScript, Python, and browser integration.' },
]

const comparison = [
  { feature: 'Voice clones', echo: '69 pre-built + custom', elevenlabs: 'Custom only', amazon: '2 neural voices', google: '4 WaveNet voices' },
  { feature: 'Emotion detection', echo: '4-layer AI engine', elevenlabs: 'Style control', amazon: 'SSML only', google: 'SSML only' },
  { feature: 'Multi-provider', echo: '3 providers auto-route', elevenlabs: 'Single', amazon: 'Single', google: 'Single' },
  { feature: 'Local GPU option', echo: 'Zero-cost inference', elevenlabs: 'No', amazon: 'No', google: 'No' },
  { feature: 'Persona switching', echo: '14 personalities', elevenlabs: 'No', amazon: 'No', google: 'No' },
  { feature: 'Streaming', echo: 'Chunk streaming', elevenlabs: 'Yes', amazon: 'Yes', google: 'Yes' },
  { feature: 'STT included', echo: 'Whisper built-in', elevenlabs: 'No', amazon: 'Transcribe (separate)', google: 'STT (separate)' },
  { feature: 'Languages', echo: '29 languages', elevenlabs: '29 languages', amazon: '33 languages', google: '40+ languages' },
  { feature: 'Custom pronunciation', echo: 'Dictionary + SSML', elevenlabs: 'Pronunciation dict', amazon: 'SSML lexicon', google: 'SSML' },
  { feature: 'Managed infrastructure', echo: 'Cloudflare edge', elevenlabs: 'Cloud', amazon: 'AWS', google: 'GCP' },
  { feature: 'Starting price', echo: '$19/mo', elevenlabs: '$5/mo (limited)', amazon: 'Pay per char', google: 'Pay per char' },
]

export default function SpeakCloudPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#8b5cf6'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Speak Cloud', href: '/speak-cloud' }]} />
      <FaqSchema faqs={faqs} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Speak Cloud</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>AI voice synthesis with 69 cloned voices, 4-layer emotion engine, and multi-provider routing. ElevenLabs quality, Edge TTS speed, local GPU cost — all from one API.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=speak-cloud&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Voice AI That Sounds Human</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>ElevenLabs</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Amazon Polly</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Google TTS</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.elevenlabs}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.amazon}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.google}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$19', period: '/mo', features: ['50K characters/mo', '10 voice clones', 'Edge TTS + ElevenLabs', 'Streaming audio', 'REST API', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$79', period: '/mo', features: ['500K characters/mo', 'All 69 voices + custom', 'All 3 providers', 'Emotion engine', 'Persona switching', 'SSML support', 'STT transcription', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$249', period: '/mo', features: ['Unlimited characters', 'Unlimited custom voices', 'Dedicated GPU allocation', 'Voice analytics', 'Pronunciation dictionary', 'Webhook integration', 'SLA guarantee', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=speak-cloud&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.q} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.q}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.a}</p></details>))}
        </section>
      </div>
    </>
  )
}
