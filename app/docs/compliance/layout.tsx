import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Compliance Documentation | Echo Prime Technologies',
  description: 'Enterprise compliance automation — SOC 2, HIPAA, GDPR, ISO 27001 — with AI gap analysis and auto-populated controls. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['compliance', 'echo prime', 'documentation', 'api', 'guide', 'compliance'],
  openGraph: {
    title: 'Echo Compliance Docs — Echo Prime Technologies',
    description: 'Enterprise compliance automation — SOC 2, HIPAA, GDPR, ISO 27001 — with AI gap analysis and auto-populated controls.',
    url: 'https://echo-ept.com/docs/compliance',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Compliance Documentation',
    description: 'Enterprise compliance automation — SOC 2, HIPAA, GDPR, ISO 27001 — with AI gap analysis and auto-populated controls.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/compliance',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
