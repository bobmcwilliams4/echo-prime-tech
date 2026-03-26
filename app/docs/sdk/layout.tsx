import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo SDK Gateway Documentation — Developer Manual | Echo Prime Tech',
  description: 'Complete documentation for the Echo SDK Gateway: unified API access to 130+ Workers, authentication, rate limiting, SDK libraries, and endpoint reference for the entire Echo ecosystem.',
  keywords: ['SDK gateway', 'API documentation', 'Echo Prime SDK', 'developer manual', 'REST API', 'intelligence engines API'],
  openGraph: {
    title: 'Echo SDK Gateway Documentation — Echo Prime Technologies',
    description: 'One API for the entire Echo ecosystem. Complete developer manual covering authentication, endpoints, SDKs, rate limits, and integration guides.',
    url: 'https://echo-ept.com/docs/sdk',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo SDK Gateway Documentation — Echo Prime Technologies',
    description: 'One API for 130+ Workers. Complete developer manual for the Echo SDK Gateway.',
  },
  alternates: { canonical: '/docs/sdk' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
