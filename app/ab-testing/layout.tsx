import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo A/B Testing — AI-Powered Experimentation & Conversion Optimization | Echo Prime Technologies',
  description: 'Run split tests, multivariate experiments, and conversion optimization with AI-powered statistical analysis. Get results 10x faster than traditional tools. From $29/mo.',
  openGraph: {
    title: 'Echo A/B Testing — AI-Powered Experimentation Platform',
    description: 'Run split tests and conversion optimization with AI-powered statistical analysis.',
    url: 'https://echo-ept.com/ab-testing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo A/B Testing — AI-Powered Experimentation Platform',
    description: 'Run split tests and conversion optimization with AI-powered statistical analysis.',
  },
  alternates: { canonical: '/ab-testing' },
}

export default function AbTestingLayout({ children }: { children: React.ReactNode }) {
  return children
}
