import type { Metadata } from 'next';
import CloserShell from './closer-shell';

export const metadata: Metadata = {
  title: 'Closer — AI Sales Agent & Voice Closer | Echo Prime Technologies',
  description: 'Autonomous AI voice sales agent with real-time STT, LLM reasoning, and natural TTS. Full CRM, lead pipeline, script engine, campaign orchestration. White-label SaaS from $299/mo.',
  keywords: ['AI sales agent', 'AI voice closer', 'sales automation', 'AI CRM', 'lead management', 'voice AI sales', 'white label sales agent', 'Echo Prime'],
  openGraph: {
    title: 'AI Sales Agent — Autonomous Voice Closer',
    description: 'AI voice sales agent with STT, LLM reasoning, natural TTS. Full CRM, lead pipeline, scripts. White-label SaaS from $299/mo.',
    url: 'https://echo-ept.com/closer',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/closer' },
};

export default function CloserLayout({ children }: { children: React.ReactNode }) {
  return <CloserShell>{children}</CloserShell>;
}
