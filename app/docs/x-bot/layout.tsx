import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo X Bot Documentation | Echo Prime Technologies',
  description: 'Autonomous X/Twitter presence — AI-generated posts, engagement tracking, follower growth, and brand monitoring. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['x-bot', 'echo prime', 'documentation', 'api', 'guide', 'x, bot'],
  openGraph: {
    title: 'Echo X Bot Docs — Echo Prime Technologies',
    description: 'Autonomous X/Twitter presence — AI-generated posts, engagement tracking, follower growth, and brand monitoring.',
    url: 'https://echo-ept.com/docs/x-bot',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo X Bot Documentation',
    description: 'Autonomous X/Twitter presence — AI-generated posts, engagement tracking, follower growth, and brand monitoring.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/x-bot',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
