import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Helpdesk Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Helpdesk — AI-powered customer support with ticket management, knowledge base, SLA tracking, auto-responses, and multi-channel support. API reference, user guides, and troubleshooting.',
  openGraph: {
    title: 'Echo Helpdesk Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Helpdesk — AI-powered customer support with ticket management, knowledge base, SLA tracking, auto-responses, and multi-channel support.',
    url: 'https://echo-ept.com/docs/helpdesk',
  },
}

export default function HelpdeskDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
