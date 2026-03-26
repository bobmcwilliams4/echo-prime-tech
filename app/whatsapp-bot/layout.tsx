import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo WhatsApp Bot — AI-Powered WhatsApp Business Automation | Echo Prime Technologies',
  description: 'Deploy an AI-powered WhatsApp business bot with 14 personalities, lead capture, broadcast scheduling, product catalogs, and 2,600+ knowledge engines. From $49/mo.',
  openGraph: {
    title: 'Echo WhatsApp Bot — AI-Powered WhatsApp Business Automation',
    description: 'Deploy an AI-powered WhatsApp business bot with 14 personalities, lead capture, broadcast scheduling, and 2,600+ knowledge engines.',
    url: 'https://echo-ept.com/whatsapp-bot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo WhatsApp Bot — AI-Powered WhatsApp Business Automation',
    description: 'Deploy an AI-powered WhatsApp business bot with 14 personalities, lead capture, broadcast scheduling, and 2,600+ knowledge engines.',
  },
  alternates: { canonical: '/whatsapp-bot' },
}

export default function WhatsAppBotLayout({ children }: { children: React.ReactNode }) {
  return children
}
