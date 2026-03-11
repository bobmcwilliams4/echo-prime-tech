import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom AI Bots — Discord, X, Telegram, LinkedIn | Echo Prime Technologies',
  description: '29 bot templates across 5 categories. Social media, trading, business automation, monitoring, and custom bots with 14 AI personalities. $499-$1,499.',
  keywords: ['AI bots', 'Discord bot', 'Twitter bot', 'Telegram bot', 'trading bot', 'social media bot', 'custom AI bot'],
  openGraph: {
    title: 'Custom AI Bots — Discord, X, Telegram, LinkedIn',
    description: '29 bot templates with 14 AI personalities. Social media, trading, business automation. $499-$1,499.',
    url: 'https://echo-ept.com/bots',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/bots' },
};

export default function BotsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
