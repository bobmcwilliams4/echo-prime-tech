import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Forge Documentation | Echo Prime Technologies',
  description: '20 auto-enhancement techniques, semantic search, version control, A/B testing, and a marketplace of 194+ sovereign templates. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['prompt-forge', 'echo prime', 'documentation', 'api', 'guide', 'prompt, forge'],
  openGraph: {
    title: 'Prompt Forge Docs — Echo Prime Technologies',
    description: '20 auto-enhancement techniques, semantic search, version control, A/B testing, and a marketplace of 194+ sovereign templates.',
    url: 'https://echo-ept.com/docs/prompt-forge',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Prompt Forge Documentation',
    description: '20 auto-enhancement techniques, semantic search, version control, A/B testing, and a marketplace of 194+ sovereign templates.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/prompt-forge',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
