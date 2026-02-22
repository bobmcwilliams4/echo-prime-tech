import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Orchestration — Multi-Engine Intelligence | Echo Prime Technologies',
  description: 'Orchestrate 900+ AI engines across 65 domains with swarm intelligence, Trinity Council consensus, real-time telemetry, and autonomous task routing. Enterprise-grade multi-agent coordination.',
  keywords: ['AI orchestration', 'multi-agent', 'swarm intelligence', 'engine coordination', 'enterprise AI', 'Echo Prime'],
  openGraph: {
    title: 'AI Orchestration — Multi-Engine Intelligence',
    description: 'Orchestrate 900+ AI engines with swarm intelligence and Trinity Council consensus.',
    url: 'https://echo-ept.com/orchestration',
  },
};

export default function OrchestrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
