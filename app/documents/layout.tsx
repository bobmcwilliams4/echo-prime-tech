import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Document Manager — AI-Powered Cloud File Management | Echo Prime Technology',
  description: 'Manage, share, and collaborate on files with version history, folder organization, public sharing links, AI summarization, and R2 cloud storage. Starting at $12/month.',
  keywords: ['document management', 'file sharing', 'cloud storage', 'file manager', 'version control', 'Google Drive alternative'],
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Document Manager — AI-Powered Cloud File Management | Echo Prime Technology',
    description: 'Manage, share, and collaborate on files with version history, folder organization, public sharing links, AI summarization, and R2 cloud storage. Starting at $12/month.',
  },
  alternates: { canonical: '/documents' },
};

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
