import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Live Chat Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Live Chat — embeddable customer support chat with real-time messaging, AI auto-responses, agent management, customizable widgets, canned responses, visitor tracking, and conversation analytics.',
  openGraph: {
    title: 'Echo Live Chat Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Live Chat — embeddable customer support chat with real-time messaging, AI auto-responses, agent management, customizable widgets, and conversation analytics.',
    url: 'https://echo-ept.com/docs/live-chat',
  },
}

export default function LiveChatDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
