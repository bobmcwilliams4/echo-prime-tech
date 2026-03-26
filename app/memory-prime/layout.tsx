import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo Memory Prime — Persistent AI Memory & Knowledge Management | Echo Prime Tech',
  description: 'Give your AI agents persistent memory across sessions. 9-pillar memory architecture with conversation history, facts, decisions, and cross-agent context sharing.',
  keywords: ['AI memory', 'persistent memory', 'AI context management', 'knowledge management', 'agent memory', 'conversation history'],
  openGraph: { title: 'Echo Memory Prime — Persistent AI Memory', description: '9-pillar memory architecture for AI agents. Facts, decisions, context — all persistent across sessions.', url: 'https://echo-ept.com/memory-prime' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
