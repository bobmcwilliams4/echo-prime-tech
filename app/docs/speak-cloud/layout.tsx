import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Speak Cloud Documentation | Echo Prime Technologies',
  description: 'Multi-provider text-to-speech and speech-to-text — ElevenLabs, Edge TTS, and Cartesia with quota-aware blending. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['speak-cloud', 'echo prime', 'documentation', 'api', 'guide', 'speak, cloud'],
  openGraph: {
    title: 'Echo Speak Cloud Docs — Echo Prime Technologies',
    description: 'Multi-provider text-to-speech and speech-to-text — ElevenLabs, Edge TTS, and Cartesia with quota-aware blending.',
    url: 'https://echo-ept.com/docs/speak-cloud',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Speak Cloud Documentation',
    description: 'Multi-provider text-to-speech and speech-to-text — ElevenLabs, Edge TTS, and Cartesia with quota-aware blending.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/speak-cloud',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
