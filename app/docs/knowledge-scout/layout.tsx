import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Knowledge Scout Documentation | Echo Prime Technologies',
  description: 'Autonomous knowledge discovery agent that scans Reddit, HackerNews, ArXiv, RSS feeds, and GitHub — finding 5-15 AI and tech breakthroughs every day before the rest of the world notices. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['knowledge-scout', 'echo prime', 'documentation', 'api', 'guide', 'knowledge, scout'],
  openGraph: {
    title: 'Echo Knowledge Scout Docs — Echo Prime Technologies',
    description: 'Autonomous knowledge discovery agent that scans Reddit, HackerNews, ArXiv, RSS feeds, and GitHub — finding 5-15 AI and tech breakthroughs every day before the rest of the world notices.',
    url: 'https://echo-ept.com/docs/knowledge-scout',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Knowledge Scout Documentation',
    description: 'Autonomous knowledge discovery agent that scans Reddit, HackerNews, ArXiv, RSS feeds, and GitHub — finding 5-15 AI and tech breakthroughs every day before the rest of the world notices.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/knowledge-scout',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
