import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knowledge Systems — Doctrine Intelligence | Echo Prime Technologies',
  description: 'Enterprise knowledge management with doctrine-hardened intelligence. 30,000+ doctrine blocks, semantic search, vector embeddings, and court-defensible reasoning across 65 verticals.',
  keywords: ['knowledge management', 'doctrine intelligence', 'semantic search', 'vector embeddings', 'enterprise knowledge', 'Echo Prime'],
  openGraph: {
    title: 'Knowledge Systems — Doctrine Intelligence',
    description: '30,000+ doctrine blocks with semantic search and court-defensible reasoning across 65 verticals.',
    url: 'https://echo-ept.com/knowledge',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knowledge Systems — Doctrine Intelligence',
    description: '30,000+ doctrine blocks with semantic search and court-defensible reasoning across 65 verticals.',
  },
  alternates: { canonical: '/knowledge' },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
