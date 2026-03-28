import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Reddit Bot Documentation | Echo Prime Technologies',
  description: 'Autonomous Reddit engagement — AI-powered community participation, lead generation, and brand monitoring across targeted subreddits. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['reddit', 'echo prime', 'documentation', 'api', 'guide', 'reddit'],
  openGraph: {
    title: 'Echo Reddit Bot Docs — Echo Prime Technologies',
    description: 'Autonomous Reddit engagement — AI-powered community participation, lead generation, and brand monitoring across targeted subreddits.',
    url: 'https://echo-ept.com/docs/reddit',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Reddit Bot Documentation',
    description: 'Autonomous Reddit engagement — AI-powered community participation, lead generation, and brand monitoring across targeted subreddits.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/reddit',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
