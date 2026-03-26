import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Document Manager Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Document Manager — AI-powered document storage, semantic search, version control, OCR processing, and automated classification for enterprise teams.',
  openGraph: {
    title: 'Document Manager Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Document Manager — AI document storage, semantic search, version control, and automated classification.',
    url: 'https://echo-ept.com/docs/document-manager',
  },
}

export default function DocumentManagerDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
