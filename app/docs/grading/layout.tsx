import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Grading AI Documentation | Echo Prime Technologies',
  description: 'AI-powered collectibles authentication and grading for sports cards, comics, coins, and more — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['grading', 'echo prime', 'documentation', 'api', 'guide', 'grading'],
  openGraph: {
    title: 'Echo Grading AI Docs — Echo Prime Technologies',
    description: 'AI-powered collectibles authentication and grading for sports cards, comics, coins, and more',
    url: 'https://echo-ept.com/docs/grading',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Grading AI Documentation',
    description: 'AI-powered collectibles authentication and grading for sports cards, comics, coins, and more',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/grading',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
