import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Email Sender Documentation | Echo Prime Technologies',
  description: 'Transactional email delivery with AI-optimized subject lines, template engine, and full delivery tracking. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['email-sender', 'echo prime', 'documentation', 'api', 'guide', 'email, sender'],
  openGraph: {
    title: 'Echo Email Sender Docs — Echo Prime Technologies',
    description: 'Transactional email delivery with AI-optimized subject lines, template engine, and full delivery tracking.',
    url: 'https://echo-ept.com/docs/email-sender',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Email Sender Documentation',
    description: 'Transactional email delivery with AI-optimized subject lines, template engine, and full delivery tracking.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/email-sender',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
