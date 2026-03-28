import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Customer Success Documentation | Echo Prime Technologies',
  description: 'AI-powered customer health scoring, retention playbooks, and churn prediction for SaaS teams. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['customer-success', 'echo prime', 'documentation', 'api', 'guide', 'customer, success'],
  openGraph: {
    title: 'Echo Customer Success Docs — Echo Prime Technologies',
    description: 'AI-powered customer health scoring, retention playbooks, and churn prediction for SaaS teams.',
    url: 'https://echo-ept.com/docs/customer-success',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Customer Success Documentation',
    description: 'AI-powered customer health scoring, retention playbooks, and churn prediction for SaaS teams.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/customer-success',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
