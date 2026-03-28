import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Landman Pipeline Documentation | Echo Prime Technologies',
  description: 'AI-powered title intelligence for oil & gas land professionals — chain of title investigation, division order calculation, mineral rights research, and title defect detection backed by 22 LM-series engines and live county record integration. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['landman-pipeline', 'echo prime', 'documentation', 'api', 'guide', 'landman, pipeline'],
  openGraph: {
    title: 'Echo Landman Pipeline Docs — Echo Prime Technologies',
    description: 'AI-powered title intelligence for oil & gas land professionals — chain of title investigation, division order calculation, mineral rights research, and title defect detection backed by 22 LM-series engines and live county record integration.',
    url: 'https://echo-ept.com/docs/landman-pipeline',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Landman Pipeline Documentation',
    description: 'AI-powered title intelligence for oil & gas land professionals — chain of title investigation, division order calculation, mineral rights research, and title defect detection backed by 22 LM-series engines and live county record integration.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/landman-pipeline',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
