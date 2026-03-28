import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Vendor Manager Documentation | Echo Prime Technologies',
  description: 'AI-powered vendor lifecycle management — onboarding, contracts, performance scoring, risk assessment, and spend analytics. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['vendor-manager', 'echo prime', 'documentation', 'api', 'guide', 'vendor, manager'],
  openGraph: {
    title: 'Echo Vendor Manager Docs — Echo Prime Technologies',
    description: 'AI-powered vendor lifecycle management — onboarding, contracts, performance scoring, risk assessment, and spend analytics.',
    url: 'https://echo-ept.com/docs/vendor-manager',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Vendor Manager Documentation',
    description: 'AI-powered vendor lifecycle management — onboarding, contracts, performance scoring, risk assessment, and spend analytics.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/vendor-manager',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
