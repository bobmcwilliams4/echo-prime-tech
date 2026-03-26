import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo CRM Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo CRM — AI-powered customer relationship management with contacts, deals, pipelines, lead scoring, automation, and analytics. API reference, user guides, and troubleshooting.',
  openGraph: {
    title: 'Echo CRM Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo CRM — AI-powered customer relationship management with contacts, deals, pipelines, lead scoring, automation, and analytics.',
    url: 'https://echo-ept.com/docs/crm',
  },
}

export default function CrmDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
