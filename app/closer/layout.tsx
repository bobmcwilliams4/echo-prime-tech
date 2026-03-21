import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Closer — Autonomous Sales Agent | Echo Prime Technologies',
  description: 'AI-powered sales agent that handles cold calls, follow-ups, and objections 24/7. Voice conversations under 2 seconds. Infinite memory. CRM integration. Replace your SDR team.',
  keywords: ['AI sales agent', 'autonomous sales', 'AI cold calling', 'sales automation', 'AI closer', 'SDR replacement', 'voice AI sales'],
  openGraph: {
    title: 'AI Closer — 24/7 Autonomous Sales Agent',
    description: 'AI sales agent with voice conversations under 2 seconds. Handles cold calls, follow-ups, and objection handling autonomously.',
    url: 'https://echo-ept.com/closer',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime AI Closer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Closer — 24/7 Autonomous Sales Agent',
    description: 'AI sales agent with voice conversations under 2 seconds. Cold calls, follow-ups, objection handling.',
  },
  alternates: { canonical: '/closer' },
};

export default function CloserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
