import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEC Intelligence Documentation | Echo Prime Technologies',
  description: 'Real-time SEC filing surveillance, insider trading detection, and compliance analytics powered by AI. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['sec-intel', 'echo prime', 'documentation', 'api', 'guide', 'sec, intel'],
  openGraph: {
    title: 'SEC Intelligence Docs — Echo Prime Technologies',
    description: 'Real-time SEC filing surveillance, insider trading detection, and compliance analytics powered by AI.',
    url: 'https://echo-ept.com/docs/sec-intel',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'SEC Intelligence Documentation',
    description: 'Real-time SEC filing surveillance, insider trading detection, and compliance analytics powered by AI.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/sec-intel',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
