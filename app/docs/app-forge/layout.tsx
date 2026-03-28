import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo App Forge Documentation | Echo Prime Technologies',
  description: 'Describe your app, we build it. Desktop, web, mobile, CLI — 16-stage AI pipeline with multi-LLM competitive generation. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['app-forge', 'echo prime', 'documentation', 'api', 'guide', 'app, forge'],
  openGraph: {
    title: 'Echo App Forge Docs — Echo Prime Technologies',
    description: 'Describe your app, we build it. Desktop, web, mobile, CLI — 16-stage AI pipeline with multi-LLM competitive generation.',
    url: 'https://echo-ept.com/docs/app-forge',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo App Forge Documentation',
    description: 'Describe your app, we build it. Desktop, web, mobile, CLI — 16-stage AI pipeline with multi-LLM competitive generation.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/app-forge',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
