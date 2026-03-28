import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Forms Documentation | Echo Prime Technologies',
  description: 'Advanced form builder with quiz scoring, webhooks, and AI question suggestions — 12+ field types, zero code required. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['forms', 'echo prime', 'documentation', 'api', 'guide', 'forms'],
  openGraph: {
    title: 'Echo Forms Docs — Echo Prime Technologies',
    description: 'Advanced form builder with quiz scoring, webhooks, and AI question suggestions — 12+ field types, zero code required.',
    url: 'https://echo-ept.com/docs/forms',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Forms Documentation',
    description: 'Advanced form builder with quiz scoring, webhooks, and AI question suggestions — 12+ field types, zero code required.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/forms',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
