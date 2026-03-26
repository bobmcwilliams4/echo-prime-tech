import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Knowledge Base — AI-Powered Docs & Wiki | Echo Prime Technology',
  description: 'Create AI-powered documentation and help centers with article generation, version history, full-text search, and reader feedback. Starting at $15/month.',
  keywords: ['knowledge base', 'documentation', 'wiki', 'help center', 'AI docs', 'knowledge management'],
};

export default function KnowledgeBaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
