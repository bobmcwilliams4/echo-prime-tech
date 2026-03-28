import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo SDK Gateway Documentation | Echo Prime Technologies',
  description: 'The single entry point for the entire Echo ecosystem — unified auth, intelligent routing, rate limiting, and client SDKs for every Worker and service in the fleet. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['sdk-gateway', 'echo prime', 'documentation', 'api', 'guide', 'sdk, gateway'],
  openGraph: {
    title: 'Echo SDK Gateway Docs — Echo Prime Technologies',
    description: 'The single entry point for the entire Echo ecosystem — unified auth, intelligent routing, rate limiting, and client SDKs for every Worker and service in the fleet.',
    url: 'https://echo-ept.com/docs/sdk-gateway',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo SDK Gateway Documentation',
    description: 'The single entry point for the entire Echo ecosystem — unified auth, intelligent routing, rate limiting, and client SDKs for every Worker and service in the fleet.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/sdk-gateway',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
