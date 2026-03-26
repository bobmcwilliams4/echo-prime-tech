import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo Speak Cloud — AI Voice Synthesis & TTS Platform | Echo Prime Tech',
  description: 'Multi-provider voice synthesis with 69 cloned voices, emotion detection, persona switching, and real-time text-to-speech. ElevenLabs, Edge TTS, and local GPU inference.',
  keywords: ['text to speech API', 'voice synthesis', 'AI voice', 'TTS platform', 'voice cloning', 'ElevenLabs alternative'],
  openGraph: { title: 'Echo Speak Cloud — AI Voice Synthesis', description: 'Multi-provider TTS with 69 cloned voices, emotion-aware synthesis, and sub-second latency on the global edge.', url: 'https://echo-ept.com/speak-cloud' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
