import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Speak Cloud Documentation — Voice AI & Text-to-Speech API',
  description: '69+ cloned voices, real-time TTS/STT, 4-layer emotion engine, and multi-provider routing across ElevenLabs, Edge TTS, and Cartesia. Complete API reference, voice cloning guide, and integration docs.',
  keywords: ['Echo Speak Cloud', 'Voice AI', 'text-to-speech API', 'TTS', 'STT', 'speech-to-text', 'voice cloning', 'ElevenLabs', 'Edge TTS', 'Cartesia', 'emotion engine', 'AI voices', 'Echo Prime Technologies'],
  openGraph: {
    title: 'Echo Speak Cloud Documentation — Voice AI & Text-to-Speech API',
    description: '69+ cloned voices, real-time TTS/STT, 4-layer emotion engine, multi-provider routing via ElevenLabs, Edge TTS & Cartesia.',
    url: 'https://echo-ept.com/docs/voice',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Speak Cloud Documentation — Voice AI & Text-to-Speech API',
    description: '69+ cloned voices, real-time TTS/STT, 4-layer emotion engine, multi-provider routing via ElevenLabs, Edge TTS & Cartesia.',
  },
  alternates: { canonical: '/docs/voice' },
};

export default function VoiceDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
