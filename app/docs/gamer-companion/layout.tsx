import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gamer Companion Documentation — User Manual & AI Guide | Echo Prime Tech',
  description: 'Complete documentation for Echo Gamer Companion — AI-powered gaming assistant with real-time overlay, strategy coaching, performance analytics, and opponent profiling.',
  openGraph: {
    title: 'Gamer Companion Documentation — User Manual & AI Guide | Echo Prime Tech',
    description: 'Complete documentation for Echo Gamer Companion — AI-powered gaming assistant with real-time overlay, strategy coaching, and performance analytics.',
    url: 'https://echo-ept.com/docs/gamer-companion',
  },
}

export default function GamerCompanionDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
