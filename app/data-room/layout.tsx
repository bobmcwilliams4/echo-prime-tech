import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtual Data Room — Echo Prime Tech',
  description: 'AI-powered virtual data room for M&A, fundraising, and due diligence. Secure document sharing with NDA tracking, granular permissions, audit trails, and AI analysis.',
  openGraph: {
    title: 'Virtual Data Room — Echo Prime Tech',
    description: 'AI-powered virtual data room for M&A, fundraising, and due diligence.',
    url: 'https://echo-ept.com/data-room',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Data Room — Echo Prime Tech',
    description: 'AI-powered virtual data room for M&A, fundraising, and due diligence.',
  },
  alternates: { canonical: '/data-room' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
