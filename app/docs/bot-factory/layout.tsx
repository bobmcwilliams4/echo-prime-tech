import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Bot Factory Documentation | Echo Prime Technologies',
  description: 'Automated bot creation and lifecycle management across 8 platforms. From template to deployed bot in minutes — with AI-generated content, vault-secured credentials, cron scheduling, and engagement analytics. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['bot-factory', 'echo prime', 'documentation', 'api', 'guide', 'bot, factory'],
  openGraph: {
    title: 'Echo Bot Factory Docs — Echo Prime Technologies',
    description: 'Automated bot creation and lifecycle management across 8 platforms. From template to deployed bot in minutes — with AI-generated content, vault-secured credentials, cron scheduling, and engagement analytics.',
    url: 'https://echo-ept.com/docs/bot-factory',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Bot Factory Documentation',
    description: 'Automated bot creation and lifecycle management across 8 platforms. From template to deployed bot in minutes — with AI-generated content, vault-secured credentials, cron scheduling, and engagement analytics.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/bot-factory',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
