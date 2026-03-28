import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Reviews Documentation | Echo Prime Technologies',
  description: 'AI-powered review management — collect, analyze, respond, and amplify your reputation. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['reviews', 'echo prime', 'documentation', 'api', 'guide', 'reviews'],
  openGraph: {
    title: 'Echo Reviews Docs — Echo Prime Technologies',
    description: 'AI-powered review management — collect, analyze, respond, and amplify your reputation.',
    url: 'https://echo-ept.com/docs/reviews',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Reviews Documentation',
    description: 'AI-powered review management — collect, analyze, respond, and amplify your reputation.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/reviews',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
