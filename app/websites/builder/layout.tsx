import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Website Builder — Echo Prime Technologies',
  description: 'Build professional websites in minutes with the Echo Prime AI Website Builder. Choose from 20 industry templates, customize with drag-and-drop sections, and deploy instantly with AI-powered content generation.',
  openGraph: {
    title: 'AI Website Builder — Echo Prime Technologies',
    description: '20 industry templates, AI content generation, and drag-and-drop editing. Build and deploy professional websites in minutes.',
    url: 'https://echo-ept.com/websites/builder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Website Builder — Echo Prime Technologies',
    description: '20 industry templates, AI content generation, and drag-and-drop editing. Build and deploy professional websites in minutes.',
  },
  alternates: { canonical: '/websites/builder' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
