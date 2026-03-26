import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Call Center Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Call Center — AI-powered call center with IVR builder, smart call routing, queue management, real-time analytics, quality scoring, workforce optimization, and multi-channel support. API reference, user guides, and troubleshooting.',
  openGraph: {
    title: 'Echo Call Center Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Call Center — AI-powered call center with IVR builder, smart call routing, queue management, real-time analytics, and workforce optimization.',
    url: 'https://echo-ept.com/docs/call-center',
  },
}

export default function CallCenterDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
