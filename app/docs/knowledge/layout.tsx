import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Knowledge Forge Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Knowledge Forge — document ingestion, vector embeddings, semantic search, RAG pipeline integration, and multi-source knowledge base management.',
  openGraph: {
    title: 'Knowledge Forge Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Knowledge Forge — document ingestion, vector embeddings, semantic search, and RAG pipeline integration.',
    url: 'https://echo-ept.com/docs/knowledge',
  },
}

export default function KnowledgeDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
