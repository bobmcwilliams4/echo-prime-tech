import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Bot Fleet Documentation — Echo Prime Technologies',
  description: 'Complete documentation for Echo Bot Fleet — autonomous AI bots across 8 platforms with AI-powered content generation, engagement automation, scheduling, and cross-platform coordination.',
  openGraph: {
    title: 'Echo Bot Fleet Documentation — Echo Prime Technologies',
    description: 'Autonomous AI bots across Discord, X/Twitter, LinkedIn, Reddit, Telegram, Slack, WhatsApp, and Instagram with AI content generation and cross-platform coordination.',
    url: 'https://echo-ept.com/docs/bots',
  },
}

export default function BotsDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
