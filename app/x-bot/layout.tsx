import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'X/Twitter AI Bot | Autonomous Social Media Presence | Echo Prime Technologies',
  description: 'AI-powered X/Twitter bot with autonomous posting, mention monitoring, 14 AI personalities, and Grok image generation. Build your brand on autopilot.',
  openGraph: {
    title: 'X/Twitter AI Bot | Echo Prime Technologies',
    description: 'Autonomous X/Twitter bot with AI content generation, 14 personalities, and Grok images.',
    url: 'https://echo-ept.com/x-bot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'X/Twitter AI Bot | Echo Prime Technologies',
    description: 'Autonomous X/Twitter bot with AI content generation, 14 personalities, and Grok images.',
  },
  alternates: { canonical: '/x-bot' },
};

export default function XBotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
