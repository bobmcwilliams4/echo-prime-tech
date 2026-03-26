import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hephaestion Forge Documentation — User Manual & AI Guide | Echo Prime Tech',
  description: 'Complete documentation for Hephaestion Forge — AI software development factory with autonomous code generation, multi-agent architecture, GitHub integration, and Cloudflare Workers deployment.',
  openGraph: {
    title: 'Hephaestion Forge Documentation — User Manual & AI Guide | Echo Prime Tech',
    description: 'Complete documentation for Hephaestion Forge — AI software factory with autonomous code generation, multi-agent builds, and automated deployment.',
    url: 'https://echo-ept.com/docs/hephaestion-forge',
  },
}

export default function HephaestionForgeDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
