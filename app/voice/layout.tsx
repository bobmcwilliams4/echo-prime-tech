import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voice Studio — AI Text-to-Speech & Cloning | Echo Prime Technologies',
  description: 'Professional AI voice synthesis with 40+ endpoints. Text-to-speech, voice cloning, speech-to-text, audio isolation, emotion tags, SSML, batch processing, and real-time WebSocket streaming.',
  keywords: ['AI voice', 'text-to-speech', 'voice cloning', 'TTS', 'speech synthesis', 'Echo Prime', 'voice studio'],
  openGraph: {
    title: 'Voice Studio — AI Text-to-Speech & Cloning',
    description: 'Professional AI voice synthesis with 40+ endpoints. TTS, cloning, STT, emotion tags, and real-time streaming.',
    url: 'https://echo-ept.com/voice',
  },
};

export default function VoiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
