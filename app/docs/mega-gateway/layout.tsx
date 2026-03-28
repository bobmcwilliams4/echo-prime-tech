import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Mega Gateway Documentation | Echo Prime Technologies',
  description: 'Universal MCP tool proxy aggregating 37,475+ tools across 1,873 servers through a single API — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['mega-gateway', 'echo prime', 'documentation', 'api', 'guide', 'mega, gateway'],
  openGraph: {
    title: 'Echo Mega Gateway Docs — Echo Prime Technologies',
    description: 'Universal MCP tool proxy aggregating 37,475+ tools across 1,873 servers through a single API',
    url: 'https://echo-ept.com/docs/mega-gateway',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Mega Gateway Documentation',
    description: 'Universal MCP tool proxy aggregating 37,475+ tools across 1,873 servers through a single API',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/mega-gateway',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
