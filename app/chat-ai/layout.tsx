import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Chat AI — Multi-Personality Conversational AI Platform | Echo Prime Technologies',
  description: 'Deploy AI chat with 14 personalities, 5 LLM backends, voice synthesis, and 2,600+ knowledge engines. Enterprise-grade conversational AI from $29/mo.',
  openGraph: {
    title: 'Echo Chat AI — Multi-Personality Conversational AI',
    description: 'Deploy AI chat with 14 personalities, 5 LLM backends, voice synthesis, and 2,600+ knowledge engines.',
    url: 'https://echo-ept.com/chat-ai',
  },
}

export default function ChatAiLayout({ children }: { children: React.ReactNode }) {
  return children
}
