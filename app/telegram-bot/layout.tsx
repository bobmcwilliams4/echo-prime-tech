import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Telegram Bot — AI-Powered Telegram Business Bot | Echo Prime Technologies',
  description: 'Deploy an AI Telegram bot with 32 personalities, 18 commands, voice STT, inline keyboards, and 2,600+ knowledge engines. Perfect for crypto, finance, and community. From $29/mo.',
  openGraph: {
    title: 'Echo Telegram Bot — AI-Powered Telegram Business Bot',
    description: 'Deploy an AI Telegram bot with 32 personalities, 18 commands, voice STT, and 2,600+ knowledge engines.',
    url: 'https://echo-ept.com/telegram-bot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Telegram Bot — AI-Powered Telegram Business Bot',
    description: 'Deploy an AI Telegram bot with 32 personalities, 18 commands, voice STT, and 2,600+ knowledge engines.',
  },
  alternates: { canonical: '/telegram-bot' },
}

export default function TelegramBotLayout({ children }: { children: React.ReactNode }) {
  return children
}
