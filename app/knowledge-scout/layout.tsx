import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knowledge Scout — AI Research & Discovery Agent | Echo Prime Technologies',
  description: 'AI-powered research agent that monitors 7+ sources (GitHub, Reddit, arXiv, Hacker News, RSS) for emerging trends, tools, and breakthroughs. Automated daily reports.',
  keywords: ['AI research agent', 'knowledge discovery', 'trend monitoring', 'tech intelligence', 'automated research', 'AI scout'],
  openGraph: {
    title: 'Knowledge Scout — AI Research & Discovery Agent',
    description: 'AI research agent monitoring 7+ sources for emerging trends, tools, and breakthroughs with automated daily reports.',
    url: 'https://echo-ept.com/knowledge-scout',
  },
  twitter: {
    card: 'summary',
    title: 'Knowledge Scout — AI Research Agent',
    description: 'Monitor GitHub, Reddit, arXiv, HN for emerging AI trends. Automated daily intelligence reports.',
  },
  alternates: { canonical: '/knowledge-scout' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
