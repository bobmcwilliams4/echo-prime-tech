import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Chat AI Documentation | Echo Prime Technologies',
  description: 'Multi-personality conversational AI — 14 personas, emotion engine, voice synthesis, and engine-backed domain expertise. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['chat-ai', 'echo prime', 'documentation', 'api', 'guide', 'chat, ai'],
  openGraph: {
    title: 'Echo Chat AI Docs — Echo Prime Technologies',
    description: 'Multi-personality conversational AI — 14 personas, emotion engine, voice synthesis, and engine-backed domain expertise.',
    url: 'https://echo-ept.com/docs/chat-ai',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Chat AI Documentation',
    description: 'Multi-personality conversational AI — 14 personas, emotion engine, voice synthesis, and engine-backed domain expertise.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/chat-ai',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
