import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Title Intelligence — AI Chain of Title | Echo Prime Technologies',
  description: '259,000+ deed records across 80 Texas counties. Automated chain-of-title analysis, gap detection, and runsheet generation. Built for landmen, abstractors, and title companies.',
  keywords: ['title intelligence', 'chain of title AI', 'deed records', 'Texas title search', 'landman AI', 'runsheet generator'],
  openGraph: {
    title: 'Title Intelligence — AI Chain of Title Analysis',
    description: '259K+ deed records across 80 Texas counties. Automated chain-of-title, gap detection, runsheet generation.',
    url: 'https://echo-ept.com/title-intelligence',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Title Intelligence — AI Chain of Title',
    description: '259K+ deed records, 80 Texas counties. Automated chain-of-title for landmen and title companies.',
  },
  alternates: { canonical: '/title-intelligence' },
};

export default function TitleIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
