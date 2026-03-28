import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Feature Flags Documentation | Echo Prime Technologies',
  description: 'Boolean, percentage, and segment-based feature flag management with A/B testing, gradual rollouts, and kill switches. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['feature-flags', 'echo prime', 'documentation', 'api', 'guide', 'feature, flags'],
  openGraph: {
    title: 'Echo Feature Flags Docs — Echo Prime Technologies',
    description: 'Boolean, percentage, and segment-based feature flag management with A/B testing, gradual rollouts, and kill switches.',
    url: 'https://echo-ept.com/docs/feature-flags',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Feature Flags Documentation',
    description: 'Boolean, percentage, and segment-based feature flag management with A/B testing, gradual rollouts, and kill switches.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/feature-flags',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
