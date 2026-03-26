import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Intelligence Engines Documentation — Engine User Manual | Echo Prime Tech',
  description: 'Complete documentation for the Echo Prime Intelligence Engine system: 5,486 domain-expert engines, 611K+ doctrine blocks, confidence stratification, cross-domain routing, and API reference across law, tax, oilfield, finance, security, medical, and engineering.',
  keywords: ['intelligence engines', 'doctrine system', 'engine API', 'tax engines', 'legal AI', 'landman engines', 'Echo Prime documentation', 'confidence stratification'],
  openGraph: {
    title: 'Intelligence Engines Documentation — Echo Prime Technologies',
    description: 'Complete guide to 5,486 doctrine-hardened AI engines with 611K+ doctrine blocks. API reference, confidence levels, cross-domain queries, and the doctrine system explained.',
    url: 'https://echo-ept.com/docs/engines',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intelligence Engines Documentation — Echo Prime Technologies',
    description: 'Complete guide to 5,486 doctrine-hardened AI engines across 200+ domains with 611K+ doctrine blocks.',
  },
  alternates: { canonical: '/docs/engines' },
}

export default function EngineDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
