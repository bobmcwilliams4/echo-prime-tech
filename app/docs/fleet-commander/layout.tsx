import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Fleet Commander Documentation | Echo Prime Technologies',
  description: 'Unified command and control for 200+ Cloudflare Workers. Fleet-wide deployment coordination, health monitoring, service discovery, and automated failure recovery — all from one interface. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['fleet-commander', 'echo prime', 'documentation', 'api', 'guide', 'fleet, commander'],
  openGraph: {
    title: 'Echo Fleet Commander Docs — Echo Prime Technologies',
    description: 'Unified command and control for 200+ Cloudflare Workers. Fleet-wide deployment coordination, health monitoring, service discovery, and automated failure recovery — all from one interface.',
    url: 'https://echo-ept.com/docs/fleet-commander',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Fleet Commander Documentation',
    description: 'Unified command and control for 200+ Cloudflare Workers. Fleet-wide deployment coordination, health monitoring, service discovery, and automated failure recovery — all from one interface.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/fleet-commander',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
