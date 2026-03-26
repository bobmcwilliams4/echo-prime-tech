import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sentinel AI Documentation — Echo Prime Technologies',
  description: 'Complete documentation for Sentinel AI — engine-backed intelligence with 5,486 engines, 611K+ doctrines, authority citations, and confidence stratification across law, tax, oilfield, landman, security, medical, financial, and engineering domains.',
  openGraph: {
    title: 'Sentinel AI Documentation — Echo Prime Technologies',
    description: 'Engine-backed intelligence with 5,486 engines, 611K+ doctrines, and authority citations. Professional documentation, API reference, and user guides.',
    url: 'https://echo-ept.com/docs/sentinel',
  },
}

export default function SentinelDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
