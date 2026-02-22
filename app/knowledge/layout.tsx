import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knowledge Systems — Doctrine Intelligence | Echo Prime Technologies',
  description: 'Enterprise knowledge management with doctrine-hardened intelligence. 30,000+ doctrine blocks, semantic search, vector embeddings, and court-defensible reasoning across 65 verticals.',
  keywords: ['knowledge management', 'doctrine intelligence', 'semantic search', 'vector embeddings', 'enterprise knowledge', 'Echo Prime'],
  openGraph: {
    title: 'Knowledge Systems — Doctrine Intelligence',
    description: '30,000+ doctrine blocks with semantic search and court-defensible reasoning across 65 verticals.',
    url: 'https://echo-ept.com/knowledge',
  },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
