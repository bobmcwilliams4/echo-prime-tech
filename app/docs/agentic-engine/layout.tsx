import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Agentic Engine Documentation | Echo Prime Technologies',
  description: 'Build autonomous AI agents with tool use, multi-step reasoning, and durable task queues — running 24/7 on the global edge. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['agentic-engine', 'echo prime', 'documentation', 'api', 'guide', 'agentic, engine'],
  openGraph: {
    title: 'Echo Agentic Engine Docs — Echo Prime Technologies',
    description: 'Build autonomous AI agents with tool use, multi-step reasoning, and durable task queues — running 24/7 on the global edge.',
    url: 'https://echo-ept.com/docs/agentic-engine',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Agentic Engine Documentation',
    description: 'Build autonomous AI agents with tool use, multi-step reasoning, and durable task queues — running 24/7 on the global edge.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/agentic-engine',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
