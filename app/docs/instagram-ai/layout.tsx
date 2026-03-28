import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Instagram Bot Documentation | Echo Prime Technologies',
  description: 'Autonomous Instagram content management — AI-generated posts, story scheduling, hashtag optimization, and audience growth. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['instagram-ai', 'echo prime', 'documentation', 'api', 'guide', 'instagram, ai'],
  openGraph: {
    title: 'Echo Instagram Bot Docs — Echo Prime Technologies',
    description: 'Autonomous Instagram content management — AI-generated posts, story scheduling, hashtag optimization, and audience growth.',
    url: 'https://echo-ept.com/docs/instagram-ai',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Instagram Bot Documentation',
    description: 'Autonomous Instagram content management — AI-generated posts, story scheduling, hashtag optimization, and audience growth.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/instagram-ai',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
