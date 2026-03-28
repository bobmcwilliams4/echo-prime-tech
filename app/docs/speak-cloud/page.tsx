"use client"

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Speak Cloud',
  tagline: 'Multi-provider text-to-speech and speech-to-text — ElevenLabs, Edge TTS, and Cartesia with quota-aware blending.',
  accent: '#7c3aed',
  productUrl: '/speak-cloud',
  workerUrl: 'https://echo-speak-cloud.bmcii1976.workers.dev',
  version: '2.0.0',
  overview: [
    'Echo Speak Cloud provides a unified TTS/STT API routing across ElevenLabs (premium cloned voices), Microsoft Edge TTS (free, 300+ voices), and Cartesia (ultra-low latency). Automatic provider selection based on quality, quota, and cost.',
    'Voice cloning is first-class. Upload a sample and create a cloned voice profile using ElevenLabs multilingual_v2 model. Cloned voices work across all Echo products: Chat, Bots, Call Center, Immortality Vault.',
    'Quota-aware blending tracks usage across providers and falls back to free providers when premium quota is exhausted, ensuring voice capabilities are always available.',
  ],
  gettingStarted: [
    { step: 1, title: 'Configure Providers', desc: 'Add API keys for ElevenLabs and optionally Cartesia. Edge TTS is free and available immediately.' },
    { step: 2, title: 'Test Voices', desc: 'Try /speak with different providers. Browse voices via /voices endpoint.' },
    { step: 3, title: 'Clone a Voice', desc: 'Upload 30+ second audio sample via /clone. Uses multilingual_v2 model.' },
    { step: 4, title: 'Set Quotas', desc: 'Configure monthly character quotas per provider with automatic fallback.' },
    { step: 5, title: 'Integrate', desc: 'Use /speak from any Echo service. Chat, Call Center, and Bots use Speak Cloud via service bindings.' },
  ],
  features: [
    { title: 'Multi-Provider TTS', desc: 'ElevenLabs (premium, cloned), Edge TTS (free, 300+ voices, 75+ languages), Cartesia (ultra-low latency). Unified API.' },
    { title: 'Voice Cloning', desc: 'Create cloned voice profiles from audio samples using ElevenLabs multilingual_v2. Available across all Echo products.' },
    { title: 'Quota-Aware Blending', desc: 'Automatic provider selection based on quota, quality, and cost. Premium first, free fallback when exhausted.' },
    { title: 'Speech-to-Text', desc: 'Audio transcription via Whisper-compatible API. Multiple formats and languages.' },
    { title: 'Voice Catalog', desc: '300+ voices with previews. Filter by language, gender, age, style.' },
    { title: 'Streaming Audio', desc: 'Real-time streaming for low-latency playback.' },
    { title: 'SSML Support', desc: 'Fine-grained control over pronunciation, pauses, emphasis, and prosody.' },
    { title: 'Usage Analytics', desc: 'Character usage per provider, voice, and service. Cost projections and quota tracking.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/speak', desc: 'Convert text to speech with provider, voice, and format selection.', auth: true },
    { method: 'POST', path: '/transcribe', desc: 'Convert audio to text. Multiple input formats.', auth: true },
    { method: 'GET', path: '/voices', desc: 'List voices across all providers with metadata.', auth: false },
    { method: 'POST', path: '/clone', desc: 'Create cloned voice from audio sample.', auth: true },
    { method: 'GET', path: '/quota', desc: 'Quota usage per provider with remaining characters.', auth: true },
    { method: 'GET', path: '/health', desc: 'Provider health status with latency metrics.', auth: false },
  ],
  userGuide: [
    { title: 'Voice Cloning', id: 'cloning', content: ['Provide 30-60 second clean audio. Only target voice, no background noise.', 'CRITICAL: Use multilingual_v2 model. The v3 model produces empty audio.', 'Cloned voices work best in the same language as the sample.'] },
    { title: 'Provider Strategy', id: 'providers', content: ['ElevenLabs: Highest quality, cloning. Customer-facing audio.', 'Edge TTS: Free, 300+ voices. Notifications and high-volume.', 'Cartesia: Ultra-low latency. Real-time conversation and phone calls.'] },
    { title: 'Echo Integration', id: 'integration', content: ['Echo Chat uses Speak Cloud for voice responses with emotion-aware parameters.', 'Echo Call Center uses it for IVR, announcements, and AI agent responses.', 'Immortality Vault uses cloning to preserve voices.'] },
  ],
  aiCapabilities: [
    { capability: 'Emotion-Aware Synthesis', desc: 'Adjusts voice parameters (speed, pitch, emphasis) based on emotional context.' },
    { capability: 'Smart Provider Routing', desc: 'Selects optimal provider based on content, language, quality, quota, and latency.' },
    { capability: 'Voice Matching', desc: 'Finds closest stock voice when cloning unavailable or quota exhausted.' },
    { capability: 'Pronunciation Correction', desc: 'Fixes TTS errors for technical terms and domain vocabulary.' },
  ],
  troubleshooting: [
    { issue: 'Empty audio from cloned voice', solution: 'Ensure multilingual_v2 model (not v3). Re-clone with correct model.' },
    { issue: 'Edge TTS errors', solution: 'Rate limiting. Auto-retries with backoff. Check voice ID availability.' },
    { issue: 'High latency', solution: 'Enable streaming. Use Cartesia for latency-sensitive apps.' },
    { issue: 'Quota exhausted', solution: 'Review usage analytics. Set daily limits. Auto-fallback at 10% remaining.' },
  ],
  faq: [
    { q: 'Is Edge TTS free?', a: 'Yes. No API key, no billing, no character limits. Uses Microsoft public endpoint.' },
    { q: 'Own ElevenLabs account?', a: 'Yes. Add your API key. Your voices, clones, and quota available through Speak Cloud.' },
    { q: 'Audio formats?', a: 'Output: MP3, WAV, OGG, PCM. Input: MP3, WAV, FLAC, OGG, WebM.' },
    { q: 'Clone limits?', a: 'Per ElevenLabs tier. Free: 1, Starter: 3, Pro: 30+. Min 30-second sample.' },
    { q: 'Real-time support?', a: 'Yes. Streaming achieves sub-200ms time-to-first-audio with Cartesia or ElevenLabs Turbo.' },
  ],
}

export default function EchoSpeakCloudDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/speak-cloud' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
