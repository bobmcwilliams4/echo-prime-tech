import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Telegram Bot Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Telegram Bot — Telegram community management with AI moderation, inline queries, broadcast channels, payment integration, and group analytics.',
  openGraph: {
    title: 'Telegram Bot Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Telegram Bot — Telegram community management, AI moderation, and broadcast messaging.',
    url: 'https://echo-ept.com/docs/telegram-bot',
  },
}

export default function TelegramBotDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
