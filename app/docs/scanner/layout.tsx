import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Scanner Documentation — Security Scanning Manual | Echo Prime Tech',
  description: 'Complete documentation for Echo Scanner (343 Scanner): worker health monitoring, vulnerability assessment, SSL/TLS certificate monitoring, DNS verification, port scanning, and real-time alerting across 200+ Cloudflare Workers.',
  keywords: ['security scanner', 'vulnerability assessment', 'worker health monitoring', 'SSL monitoring', 'DNS verification', 'port scanning', 'MITRE ATT&CK', 'Echo Scanner'],
  openGraph: {
    title: 'Echo Scanner Documentation — Echo Prime Technologies',
    description: 'AI-powered security scanning with 12 parallel analyzers, worker health monitoring across 200+ Workers, and MITRE ATT&CK mapping. Complete developer manual.',
    url: 'https://echo-ept.com/docs/scanner',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Scanner Documentation — Echo Prime Technologies',
    description: 'AI-powered security scanning across 200+ Workers. Complete developer manual for Echo Scanner.',
  },
  alternates: { canonical: '/docs/scanner' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
