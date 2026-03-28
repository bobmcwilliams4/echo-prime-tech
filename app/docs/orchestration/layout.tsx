import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo AI Orchestrator Documentation | Echo Prime Technologies',
  description: 'Multi-model AI routing with 29 LLM workers, intelligent dispatch, and cost optimization. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['orchestration', 'echo prime', 'documentation', 'api', 'guide', 'orchestration'],
  openGraph: {
    title: 'Echo AI Orchestrator Docs — Echo Prime Technologies',
    description: 'Multi-model AI routing with 29 LLM workers, intelligent dispatch, and cost optimization.',
    url: 'https://echo-ept.com/docs/orchestration',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo AI Orchestrator Documentation',
    description: 'Multi-model AI routing with 29 LLM workers, intelligent dispatch, and cost optimization.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/orchestration',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
