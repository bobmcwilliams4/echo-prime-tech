import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Data Room Documentation | Echo Prime Technologies',
  description: 'AI-powered virtual data room for secure document sharing, due diligence, and deal management. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['data-room', 'echo prime', 'documentation', 'api', 'guide', 'data, room'],
  openGraph: {
    title: 'Echo Data Room Docs — Echo Prime Technologies',
    description: 'AI-powered virtual data room for secure document sharing, due diligence, and deal management.',
    url: 'https://echo-ept.com/docs/data-room',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Data Room Documentation',
    description: 'AI-powered virtual data room for secure document sharing, due diligence, and deal management.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/data-room',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
