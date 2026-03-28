import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo LinkedIn Bot Documentation | Echo Prime Technologies',
  description: 'Autonomous LinkedIn presence — AI-generated professional posts, connection growth, and lead generation. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['linkedin', 'echo prime', 'documentation', 'api', 'guide', 'linkedin'],
  openGraph: {
    title: 'Echo LinkedIn Bot Docs — Echo Prime Technologies',
    description: 'Autonomous LinkedIn presence — AI-generated professional posts, connection growth, and lead generation.',
    url: 'https://echo-ept.com/docs/linkedin',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo LinkedIn Bot Documentation',
    description: 'Autonomous LinkedIn presence — AI-generated professional posts, connection growth, and lead generation.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/linkedin',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
