import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom AI Bots — Discord, X, Telegram, LinkedIn | Echo Prime Technologies',
  description: '29 bot templates, 14 AI personalities, social media bots, trading bots, business automation. Starting at $499.',
  openGraph: { title: 'Custom AI Bots — 29 Templates, 14 Personalities', description: '29 bot templates, 14 AI personalities. Social media, trading, business automation. Starting at $499.', url: 'https://echo-ept.com/bots' },
  twitter: { card: 'summary_large_image', title: 'Custom AI Bots — 29 Templates, 14 Personalities', description: '29 bot templates, 14 AI personalities. Starting at $499.' },
  alternates: { canonical: '/bots' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
