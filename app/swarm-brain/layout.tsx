import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Swarm Brain — Multi-Agent AI Orchestration | Echo Prime Tech',
  description: 'Orchestrate fleets of AI agents with 129 endpoints. Task delegation, swarm intelligence, competitive execution, and cross-agent memory — all on the global edge.',
  keywords: ['multi-agent ai', 'swarm intelligence', 'ai orchestration', 'agent coordination', 'task delegation', 'ai fleet management', 'echo prime'],
  openGraph: {
    title: 'Echo Swarm Brain — Multi-Agent AI Orchestration',
    description: 'Orchestrate fleets of AI agents with 129 endpoints. Swarm intelligence on the global edge.',
    url: 'https://echo-ept.com/swarm-brain',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Swarm Brain — Multi-Agent AI Orchestration',
    description: 'Orchestrate fleets of AI agents with swarm intelligence and competitive execution.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/swarm-brain',
  },
}

export default function SwarmBrainLayout({ children }: { children: React.ReactNode }) {
  return children
}
