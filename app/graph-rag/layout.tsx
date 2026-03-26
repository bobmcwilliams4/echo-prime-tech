import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Graph RAG — Knowledge Graph AI Platform | Echo Prime Tech',
  description: 'GraphRAG with 312K+ nodes, 3.3M edges, and 101 domain clusters. Semantic search, cross-domain discovery, and citation-backed answers powered by knowledge graphs.',
  keywords: ['graph rag', 'knowledge graph', 'semantic search', 'vector database', 'ai retrieval', 'cross-domain discovery', 'echo prime'],
  openGraph: {
    title: 'Echo Graph RAG — Knowledge Graph AI Platform',
    description: 'GraphRAG with 312K+ nodes, 3.3M edges, and 101 domain clusters. Semantic search, cross-domain discovery, and citation-backed answers.',
    url: 'https://echo-ept.com/graph-rag',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Graph RAG — Knowledge Graph AI Platform',
    description: 'GraphRAG with 312K+ nodes and 101 domain clusters. Cross-domain AI retrieval.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/graph-rag',
  },
}

export default function GraphRagLayout({ children }: { children: React.ReactNode }) {
  return children
}
