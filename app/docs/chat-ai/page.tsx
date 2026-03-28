"use client"

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Chat AI',
  tagline: 'Multi-personality conversational AI — 14 personas, emotion engine, voice synthesis, and engine-backed domain expertise.',
  accent: '#8b5cf6',
  productUrl: '/chat-ai',
  workerUrl: 'https://echo-chat.bmcii1976.workers.dev',
  version: '3.0.0',
  overview: [
    'Echo Chat AI is a conversational platform with 14 distinct personalities, each with unique communication styles, expertise, and emotional responses. From professional Sentinel to creative Bree to analytical Prometheus.',
    'Version 3.0 introduced the Emotion Engine: 4-layer emotional intelligence that detects sentiment, adjusts tone, modulates voice synthesis, and maintains continuity across conversations.',
    'Domain questions route through Engine Runtime with 5,500+ engines and 632K+ doctrines. Tax gets IRC citations, legal gets case law, oil and gas gets industry standards. AI formats this conversationally.',
  ],
  gettingStarted: [
    { step: 1, title: 'Choose Personality', desc: 'Sentinel for professional queries, Bree for creative work, Prometheus for analysis, Billy for casual chat.' },
    { step: 2, title: 'Start Chatting', desc: 'Via API or web interface at echo-ept.com/chat-ai. Personality responds in its unique voice.' },
    { step: 3, title: 'Enable Voice', desc: 'Activate via Speak Cloud integration. Each personality has preferred voice settings.' },
    { step: 4, title: 'Configure for Your App', desc: 'Set site_id for custom configuration: personality, engine access, conversation history.' },
    { step: 5, title: 'Review Analytics', desc: 'Monitor response quality, satisfaction, topics, and engine utilization.' },
  ],
  features: [
    { title: '14 Personalities', desc: 'Each has unique traits: communication style, expertise, humor, formality, emotional range. Fully configurable.' },
    { title: 'Emotion Engine', desc: '4-layer emotional intelligence: sentiment detection, tone adjustment, voice modulation, emotional continuity.' },
    { title: 'Engine-Backed Expertise', desc: 'Domain questions use Engine Runtime for real expertise with citations. Not LLM hallucinations.' },
    { title: 'Voice Synthesis', desc: 'Integrated with Speak Cloud. Per-personality voice. Emotion engine adjusts parameters in real-time.' },
    { title: 'Conversation Memory', desc: 'Persistent history with context window management across interactions.' },
    { title: 'Multi-Site Support', desc: 'Different personality and settings per site_id. One instance, multiple apps.' },
    { title: 'Streaming Responses', desc: 'Real-time token streaming for instant feedback.' },
    { title: 'Content Moderation', desc: 'Built-in filtering. Configurable safety levels per personality.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/chat', desc: 'Send message, get response from selected personality. Streaming and non-streaming.', auth: true },
    { method: 'GET', path: '/personalities', desc: 'List all personalities with traits and specialties.', auth: false },
    { method: 'GET', path: '/conversations/:id', desc: 'Retrieve conversation history.', auth: true },
    { method: 'POST', path: '/conversations', desc: 'Start new conversation with personality selection.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Message counts, response times, topic distribution, satisfaction.', auth: true },
    { method: 'POST', path: '/engine-query', desc: 'Direct engine query bypassing personality layer.', auth: true },
  ],
  userGuide: [
    { title: 'Choosing Personalities', id: 'personalities', content: ['Sentinel: Professional, authoritative. Routes through Engine Runtime.', 'Bree: Warm, creative. Brainstorming, customer-facing chatbots.', 'Prometheus: Analytical, precise. Research and structured thinking.', 'Billy: Casual, humorous. Entertainment and social engagement.'] },
    { title: 'Emotion Engine', id: 'emotion', content: ['Layer 1: Sentiment detection (positive, negative, frustrated, excited, confused).', 'Layer 2: Tone adjustment. Frustrated users get empathetic responses.', 'Layer 3: Voice modulation. Serious topics get slower pitch.', 'Layer 4: Emotional continuity. Gradual transitions, no abrupt mood switches.'] },
    { title: 'Engine Routing', id: 'engines', content: ['Domain questions auto-route to Engine Runtime via engine-router.ts.', 'Routing is automatic based on query classification.', 'Engine responses include citations formatted conversationally.'] },
  ],
  aiCapabilities: [
    { capability: 'Personality Blending', desc: 'Combine traits: Bree warmth with Sentinel expertise for friendly-authoritative support.' },
    { capability: 'Context-Aware Routing', desc: 'Auto-detects domain shifts and routes to appropriate engines.' },
    { capability: 'Conversation Summarization', desc: 'Generates summaries for handoff capturing decisions and action items.' },
    { capability: 'Adaptive Learning', desc: 'Adjusts parameters based on feedback and interaction patterns.' },
  ],
  troubleshooting: [
    { issue: 'Generic responses', solution: 'Use Sentinel for domain expertise. Check Engine Runtime service binding.' },
    { issue: 'Voice mismatch', solution: 'Verify Speak Cloud binding. Check personality voice settings and clone model.' },
    { issue: 'Context lost', solution: 'Include conversation_id in every request. Check D1 accessibility.' },
    { issue: 'Slow engine responses', solution: 'Engine queries take 10-50s. Use streaming mode for partial display.' },
  ],
  faq: [
    { q: 'Custom personalities?', a: 'Yes. Define traits, style, expertise, engines, voice. Available via custom personality ID.' },
    { q: 'vs ChatGPT?', a: 'Multiple real characters. Engine-backed expertise with citations. Emotion engine with voice.' },
    { q: 'Data storage?', a: 'Conversations in D1. Configurable retention. GDPR-compliant export and deletion.' },
    { q: 'Multiple languages?', a: 'Yes. All model-supported languages. Voice in 75+ languages via Edge TTS.' },
    { q: 'Latency?', a: 'Non-engine: 1-3s. Engine-backed: 10-50s (streaming shows partial immediately). Voice: 200ms-2s.' },
  ],
}

export default function EchoChatAIDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/chat-ai' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
