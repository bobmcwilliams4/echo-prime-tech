import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Waitlist Documentation | Echo Prime Technologies',
  description: 'Viral referral waitlists with position tracking, milestone rewards, and embeddable signup widgets — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['waitlist', 'echo prime', 'documentation', 'api', 'guide', 'waitlist'],
  openGraph: {
    title: 'Echo Waitlist Docs — Echo Prime Technologies',
    description: 'Viral referral waitlists with position tracking, milestone rewards, and embeddable signup widgets',
    url: 'https://echo-ept.com/docs/waitlist',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Waitlist Documentation',
    description: 'Viral referral waitlists with position tracking, milestone rewards, and embeddable signup widgets',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/waitlist',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
