import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Surveillance (Prometheus) Documentation — Echo Prime Technologies',
  description: 'Complete documentation for Echo Surveillance (Prometheus) — AI-powered monitoring, social media intelligence, brand tracking, competitive intel, dark web monitoring, OSINT collection, and automated alert pipelines.',
  openGraph: {
    title: 'Echo Surveillance (Prometheus) Documentation — Echo Prime Technologies',
    description: 'AI-powered surveillance and intelligence gathering platform with real-time social media monitoring, sentiment analysis, competitive intelligence, dark web scanning, and OSINT capabilities.',
    url: 'https://echo-ept.com/docs/surveillance',
  },
}

export default function SurveillanceDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
