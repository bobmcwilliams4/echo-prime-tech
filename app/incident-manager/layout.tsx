import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Incident Manager — AI-Powered Incident Response & On-Call Management | Echo Prime Technologies',
  description: 'Manage incidents from detection to post-mortem with AI-powered escalation, timeline tracking, severity classification, and automated runbooks. From $19/mo.',
  openGraph: {
    title: 'Echo Incident Manager — AI-Powered Incident Response',
    description: 'Manage incidents from detection to post-mortem with AI-powered escalation, timeline tracking, and automated runbooks.',
    url: 'https://echo-ept.com/incident-manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Incident Manager — AI-Powered Incident Response',
    description: 'Manage incidents from detection to post-mortem with AI-powered escalation, timeline tracking, and automated runbooks.',
  },
  alternates: { canonical: '/incident-manager' },
}

export default function IncidentManagerLayout({ children }: { children: React.ReactNode }) {
  return children
}
