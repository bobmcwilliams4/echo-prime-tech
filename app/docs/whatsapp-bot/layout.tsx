import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WhatsApp Bot Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo WhatsApp Bot — WhatsApp Business automation with AI conversation handling, message templates, broadcast lists, catalog integration, and analytics.',
  openGraph: {
    title: 'WhatsApp Bot Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo WhatsApp Bot — WhatsApp Business automation with AI conversations, templates, and broadcast messaging.',
    url: 'https://echo-ept.com/docs/whatsapp-bot',
  },
}

export default function WhatsappBotDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
