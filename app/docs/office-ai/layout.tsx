import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Office AI Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Office AI — AI-powered office suite with document generation, email management, meeting notes, task automation, and team collaboration. API reference, user guides, and troubleshooting.',
  openGraph: {
    title: 'Echo Office AI Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Office AI — AI-powered office suite with document generation, email management, meeting notes, task automation, and team collaboration.',
    url: 'https://echo-ept.com/docs/office-ai',
  },
}

export default function OfficeAiDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
