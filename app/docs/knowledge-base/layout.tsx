import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Knowledge Base Documentation | Echo Prime Technologies',
  description: 'Self-service knowledge base platform with nested categories, SEO-optimized articles, full-text search, and AI article generation. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['knowledge-base', 'echo prime', 'documentation', 'api', 'guide', 'knowledge, base'],
  openGraph: {
    title: 'Echo Knowledge Base Docs — Echo Prime Technologies',
    description: 'Self-service knowledge base platform with nested categories, SEO-optimized articles, full-text search, and AI article generation.',
    url: 'https://echo-ept.com/docs/knowledge-base',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Knowledge Base Documentation',
    description: 'Self-service knowledge base platform with nested categories, SEO-optimized articles, full-text search, and AI article generation.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/knowledge-base',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
