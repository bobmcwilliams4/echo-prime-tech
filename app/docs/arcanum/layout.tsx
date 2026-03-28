import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Arcanum Documentation | Echo Prime Technologies',
  description: 'Sovereign prompt template library with 194+ indexed templates and build plans — the institutional memory of the Echo build system, where every completed build becomes a reusable asset. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['arcanum', 'echo prime', 'documentation', 'api', 'guide', 'arcanum'],
  openGraph: {
    title: 'Echo Arcanum Docs — Echo Prime Technologies',
    description: 'Sovereign prompt template library with 194+ indexed templates and build plans — the institutional memory of the Echo build system, where every completed build becomes a reusable asset.',
    url: 'https://echo-ept.com/docs/arcanum',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Arcanum Documentation',
    description: 'Sovereign prompt template library with 194+ indexed templates and build plans — the institutional memory of the Echo build system, where every completed build becomes a reusable asset.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/arcanum',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
