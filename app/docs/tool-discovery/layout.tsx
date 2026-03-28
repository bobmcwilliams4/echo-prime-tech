import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Tool Discovery Documentation | Echo Prime Technologies',
  description: 'Discover, search, and execute 37,475+ MCP tools across 1,873 servers. Semantic capability matching, automatic tool recommendation, and a unified execution proxy — the index for the entire Echo tool ecosystem. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['tool-discovery', 'echo prime', 'documentation', 'api', 'guide', 'tool, discovery'],
  openGraph: {
    title: 'Echo Tool Discovery Docs — Echo Prime Technologies',
    description: 'Discover, search, and execute 37,475+ MCP tools across 1,873 servers. Semantic capability matching, automatic tool recommendation, and a unified execution proxy — the index for the entire Echo tool ecosystem.',
    url: 'https://echo-ept.com/docs/tool-discovery',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Tool Discovery Documentation',
    description: 'Discover, search, and execute 37,475+ MCP tools across 1,873 servers. Semantic capability matching, automatic tool recommendation, and a unified execution proxy — the index for the entire Echo tool ecosystem.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/tool-discovery',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
