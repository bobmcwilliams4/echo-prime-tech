import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Link Shortener Documentation | Echo Prime Technologies',
  description: 'Sub-millisecond KV-cached redirects with click analytics, custom domains, and bulk operations — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['link-shortener', 'echo prime', 'documentation', 'api', 'guide', 'link, shortener'],
  openGraph: {
    title: 'Echo Link Shortener Docs — Echo Prime Technologies',
    description: 'Sub-millisecond KV-cached redirects with click analytics, custom domains, and bulk operations',
    url: 'https://echo-ept.com/docs/link-shortener',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Link Shortener Documentation',
    description: 'Sub-millisecond KV-cached redirects with click analytics, custom domains, and bulk operations',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/link-shortener',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
