import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Closer AI Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Closer AI — AI-powered sales agent with 35+ persuasion techniques, objection handling, lead qualification, conversation AI, deal pipeline management, and performance analytics. API reference, user guides, and troubleshooting.',
  openGraph: {
    title: 'Echo Closer AI Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Closer AI — AI-powered sales agent with 35+ persuasion techniques, objection handling, lead qualification, and deal closing.',
    url: 'https://echo-ept.com/docs/closer',
  },
}

export default function CloserDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
