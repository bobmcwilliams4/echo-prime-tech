import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tool Discovery — MCP Tool Search & Integration | Echo Prime Technologies',
  description: 'Search and integrate from 37,475+ MCP tools across 1,873 servers. Semantic search, tool ratings, health monitoring, and one-click integration.',
  keywords: ['MCP tools', 'tool discovery', 'MCP server', 'AI tool search', 'model context protocol', 'tool integration'],
  openGraph: {
    title: 'Tool Discovery — MCP Tool Search & Integration',
    description: 'Search 37,475+ MCP tools across 1,873 servers with semantic search and one-click integration.',
    url: 'https://echo-ept.com/tool-discovery',
  },
  twitter: {
    card: 'summary',
    title: 'Tool Discovery — MCP Tool Search',
    description: '37,475+ MCP tools indexed. Semantic search, ratings, health monitoring, one-click integration.',
  },
  alternates: { canonical: '/tool-discovery' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
