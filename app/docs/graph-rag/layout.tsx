import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GraphRAG Intelligence Documentation — Knowledge Graph + Vector Search',
  description: '312K+ nodes, 3.3M+ edges, 101 domain clusters. Hybrid graph traversal and vector search for cross-domain knowledge discovery with full citation chains.',
  keywords: ['GraphRAG', 'knowledge graph', 'vector search', 'RAG', 'graph database', 'entity extraction', 'citation chains', 'cross-domain search'],
  openGraph: {
    title: 'GraphRAG Intelligence Documentation',
    description: '312K+ nodes, 3.3M+ edges, 101 domain clusters. Cross-domain knowledge discovery with full citation chains.',
    url: 'https://echo-ept.com/docs/graph-rag',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GraphRAG Intelligence Documentation',
    description: '312K+ nodes, 3.3M+ edges. Hybrid graph + vector search for cross-domain knowledge discovery.',
  },
  alternates: { canonical: '/docs/graph-rag' },
};

export default function GraphRagDocLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
