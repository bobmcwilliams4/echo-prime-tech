import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Prompt Forge — AI Prompt Management & Optimization Platform | Echo Prime Technologies',
  description: 'Manage, version, optimize, and A/B test AI prompts with 20 enhancement techniques and semantic search. Enterprise prompt engineering from $19/mo.',
  openGraph: {
    title: 'Echo Prompt Forge — AI Prompt Management Platform',
    description: 'Manage, version, optimize, and A/B test AI prompts with 20 enhancement techniques and semantic search.',
    url: 'https://echo-ept.com/prompt-forge',
  },
}

export default function PromptForgeLayout({ children }: { children: React.ReactNode }) {
  return children
}
