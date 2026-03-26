import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Agentic Engine — Autonomous AI Agent Builder | Echo Prime Technologies',
  description: 'Build autonomous AI agents with tool use, self-directed execution, task queues, and multi-step reasoning. Deploy agents that work 24/7. From $49/mo.',
  openGraph: {
    title: 'Echo Agentic Engine — Autonomous AI Agent Builder',
    description: 'Build autonomous AI agents with tool use, self-directed execution, task queues, and multi-step reasoning.',
    url: 'https://echo-ept.com/agentic-engine',
  },
}

export default function AgenticEngineLayout({ children }: { children: React.ReactNode }) {
  return children
}
