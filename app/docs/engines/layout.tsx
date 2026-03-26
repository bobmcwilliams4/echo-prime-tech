import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Intelligence Engine Documentation — Echo Prime Technologies',
  description: 'Complete user guide for the Echo Prime Intelligence Engine system. Learn how 5,486+ doctrine-hardened engines work, query the API, understand confidence levels, and leverage 529K+ doctrine blocks across tax, legal, landman, security, medical, and 200+ domains.',
  keywords: ['intelligence engines', 'doctrine system', 'engine API', 'tax engines', 'legal AI', 'landman engines', 'Echo Prime documentation'],
  openGraph: {
    title: 'Intelligence Engine Documentation — Echo Prime Technologies',
    description: 'Complete guide to 5,486+ doctrine-hardened AI engines. API reference, confidence levels, cross-domain queries, and the doctrine system explained.',
    url: 'https://echo-ept.com/docs/engines',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intelligence Engine Documentation — Echo Prime Technologies',
    description: 'Complete guide to 5,486+ doctrine-hardened AI engines across 200+ domains.',
  },
  alternates: { canonical: '/docs/engines' },
}

export default function EngineDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
