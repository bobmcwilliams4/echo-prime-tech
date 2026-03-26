import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dark Web Intelligence Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Dark Web Intel — credential leak detection, dark web monitoring, threat actor tracking, and real-time breach alerts for enterprise security teams.',
  openGraph: {
    title: 'Dark Web Intelligence Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Dark Web Intel — credential leak detection, dark web monitoring, and real-time breach alerts.',
    url: 'https://echo-ept.com/docs/dark-web-intel',
  },
}

export default function DarkWebIntelDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
