import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Permian Basin Intelligence Documentation | Echo Prime Technologies',
  description: 'Comprehensive Permian Basin oil and gas intelligence powered by 20+ drilling engines and 632K+ doctrine records — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['permian', 'echo prime', 'documentation', 'api', 'guide', 'permian'],
  openGraph: {
    title: 'Permian Basin Intelligence Docs — Echo Prime Technologies',
    description: 'Comprehensive Permian Basin oil and gas intelligence powered by 20+ drilling engines and 632K+ doctrine records',
    url: 'https://echo-ept.com/docs/permian',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Permian Basin Intelligence Documentation',
    description: 'Comprehensive Permian Basin oil and gas intelligence powered by 20+ drilling engines and 632K+ doctrine records',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/permian',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
