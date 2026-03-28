import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Title Intelligence Documentation — Landman & Chain of Title Platform | Echo Prime Tech',
  description: 'Complete documentation for Echo Prime Title Intelligence: automated chain of title research, mineral rights analysis, gap detection, run sheet generation, and county records API across 254 Texas counties.',
  keywords: ['title intelligence', 'chain of title', 'mineral rights', 'landman software', 'run sheet', 'gap detection', 'Texas county records', 'NMA calculator', 'oil and gas title', 'Echo Prime documentation', 'title examination', 'probate heirship'],
  openGraph: {
    title: 'Title Intelligence Documentation — Echo Prime Technologies',
    description: 'Complete guide to AI-powered chain of title research, mineral rights analysis, 59 instrument types, gap detection, and run sheet generation across 98+ Texas counties.',
    url: 'https://echo-ept.com/docs/title-intelligence',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Title Intelligence Documentation — Echo Prime Technologies',
    description: 'AI-powered chain of title research, mineral rights analysis, and run sheet generation across 98+ Texas counties.',
  },
  alternates: { canonical: '/docs/title-intelligence' },
}

export default function TitleIntelligenceDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
