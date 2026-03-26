import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Call Monitor — Echo Prime Technologies',
  description: 'Monitor AI Closer calls in real time with live transcription, sentiment tracking, and supervisor controls. Whisper coaching to the AI, take over calls, or mute the agent mid-conversation.',
  openGraph: {
    title: 'Live Call Monitor — Echo Prime Technologies',
    description: 'Real-time AI call monitoring with live transcription, whisper coaching, and takeover controls.',
    url: 'https://echo-ept.com/closer/calls/live',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
