import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Feedback Board Documentation | Echo Prime Technologies',
  description: 'Public feedback management with upvoting, roadmaps, changelogs, and AI summarization — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['feedback-board', 'echo prime', 'documentation', 'api', 'guide', 'feedback, board'],
  openGraph: {
    title: 'Echo Feedback Board Docs — Echo Prime Technologies',
    description: 'Public feedback management with upvoting, roadmaps, changelogs, and AI summarization',
    url: 'https://echo-ept.com/docs/feedback-board',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Feedback Board Documentation',
    description: 'Public feedback management with upvoting, roadmaps, changelogs, and AI summarization',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/feedback-board',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
