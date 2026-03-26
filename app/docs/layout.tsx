import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation Hub — Echo Prime Technologies',
  description: 'Complete documentation, user manuals, API references, and interactive tutorials for all Echo Prime products. Getting started guides, integration docs, and developer resources.',
  openGraph: {
    title: 'Documentation Hub — Echo Prime Technologies',
    description: 'Complete documentation, user manuals, API references, and interactive tutorials for all Echo Prime products.',
    url: 'https://echo-ept.com/docs',
  },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
