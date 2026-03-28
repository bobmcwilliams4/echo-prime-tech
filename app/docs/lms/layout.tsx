import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo LMS Documentation | Echo Prime Technologies',
  description: 'AI-powered learning management system — courses, quizzes, certifications, and threaded discussions at scale. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['lms', 'echo prime', 'documentation', 'api', 'guide', 'lms'],
  openGraph: {
    title: 'Echo LMS Docs — Echo Prime Technologies',
    description: 'AI-powered learning management system — courses, quizzes, certifications, and threaded discussions at scale.',
    url: 'https://echo-ept.com/docs/lms',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo LMS Documentation',
    description: 'AI-powered learning management system — courses, quizzes, certifications, and threaded discussions at scale.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/lms',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
