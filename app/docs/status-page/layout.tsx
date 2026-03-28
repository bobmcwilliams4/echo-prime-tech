import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Status Page Documentation | Echo Prime Technologies',
  description: 'Public-facing service status — real-time uptime monitoring, incident management, and subscriber notifications. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['status-page', 'echo prime', 'documentation', 'api', 'guide', 'status, page'],
  openGraph: {
    title: 'Echo Status Page Docs — Echo Prime Technologies',
    description: 'Public-facing service status — real-time uptime monitoring, incident management, and subscriber notifications.',
    url: 'https://echo-ept.com/docs/status-page',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Status Page Documentation',
    description: 'Public-facing service status — real-time uptime monitoring, incident management, and subscriber notifications.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/status-page',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
