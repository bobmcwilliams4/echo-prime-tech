import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bot Factory — AI Social Media Bot Builder | Echo Prime Technologies',
  description: 'Build and manage AI-powered social media bots across 8 platforms. 14 personality presets, AI content generation, lead capture, OPSEC protection, and analytics.',
  keywords: ['social media bot', 'AI bot builder', 'social automation', 'lead generation bot', 'multi-platform bot', 'social media automation'],
  openGraph: {
    title: 'Bot Factory — AI Social Media Bot Builder',
    description: 'Build AI bots across 8 platforms with 14 personality presets, lead capture, and OPSEC protection.',
    url: 'https://echo-ept.com/bot-factory',
  },
  twitter: {
    card: 'summary',
    title: 'Bot Factory — AI Social Media Bots',
    description: '8 platforms, 14 personalities, AI content generation, lead capture. Build social media bots in minutes.',
  },
  alternates: { canonical: '/bot-factory' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
