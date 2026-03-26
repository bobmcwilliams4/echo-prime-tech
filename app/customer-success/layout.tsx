import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Success Platform — Echo Prime Tech',
  description: 'AI-powered customer health scoring, retention playbooks, onboarding automation, and expansion tracking. Replace Gainsight at 1/10th the cost.',
  openGraph: {
    title: 'Customer Success Platform — Echo Prime Tech',
    description: 'AI-powered customer health scoring, retention playbooks, onboarding automation, and expansion tracking.',
    url: 'https://echo-ept.com/customer-success',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Success Platform — Echo Prime Tech',
    description: 'AI-powered customer health scoring, retention playbooks, onboarding automation, and expansion tracking.',
  },
  alternates: { canonical: '/customer-success' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
