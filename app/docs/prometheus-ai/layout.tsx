import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Prometheus AI Documentation | Echo Prime Technologies',
  description: 'Advanced AI surveillance and threat intelligence platform. Real-time behavioral analysis, anomaly detection, and incident response across every camera feed, access point, and sensor in your environment. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['prometheus-ai', 'echo prime', 'documentation', 'api', 'guide', 'prometheus, ai'],
  openGraph: {
    title: 'Echo Prometheus AI Docs — Echo Prime Technologies',
    description: 'Advanced AI surveillance and threat intelligence platform. Real-time behavioral analysis, anomaly detection, and incident response across every camera feed, access point, and sensor in your environment.',
    url: 'https://echo-ept.com/docs/prometheus-ai',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Prometheus AI Documentation',
    description: 'Advanced AI surveillance and threat intelligence platform. Real-time behavioral analysis, anomaly detection, and incident response across every camera feed, access point, and sensor in your environment.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/prometheus-ai',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
