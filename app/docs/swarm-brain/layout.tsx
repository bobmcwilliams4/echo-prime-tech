import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swarm Brain Documentation — Multi-Agent AI Orchestration Platform',
  description: '129 API endpoints for multi-agent coordination. Competitive execution, shared memory, fleet management, and autonomous agent orchestration on Cloudflare Workers.',
  keywords: ['multi-agent AI', 'swarm intelligence', 'agent orchestration', 'competitive execution', 'AI fleet management', 'Swarm Brain', 'MoltBook'],
  openGraph: {
    title: 'Swarm Brain Documentation — Multi-Agent AI Orchestration',
    description: '129 endpoints for agent coordination. Competitive execution, shared memory, fleet management, and autonomous orchestration.',
    url: 'https://echo-ept.com/docs/swarm-brain',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swarm Brain — Multi-Agent AI Orchestration',
    description: '129 API endpoints. Competitive execution, shared memory, fleet management. The most comprehensive agent orchestration API.',
  },
  alternates: { canonical: '/docs/swarm-brain' },
};

export default function SwarmBrainDocLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
