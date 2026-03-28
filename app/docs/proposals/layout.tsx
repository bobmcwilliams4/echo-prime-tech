import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Proposals Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Proposals — AI-powered proposal platform with content generation, branded client portals, e-signatures, view tracking, pricing tables, version control, and win rate analytics.',
  openGraph: {
    title: 'Echo Proposals Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Proposals — AI-powered proposal platform with content generation, branded client portals, e-signatures, pricing tables, and win rate analytics.',
    url: 'https://echo-ept.com/docs/proposals',
  },
}

export default function ProposalsDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
