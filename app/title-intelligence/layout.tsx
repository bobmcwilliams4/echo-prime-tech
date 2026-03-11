import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Title Intelligence — AI Chain of Title Search | Echo Prime Technologies',
  description: 'AI-powered chain of title search across 80+ Texas counties with 259,000+ indexed deed records. Automated mineral rights analysis, gap detection, and fractional interest calculations.',
  keywords: ['title intelligence', 'chain of title', 'mineral rights', 'deed search', 'oil and gas title', 'land records AI', 'Texas county records'],
  openGraph: {
    title: 'Title Intelligence — AI Chain of Title Search',
    description: 'AI-powered title search across 80+ Texas counties. 259,000+ deed records. Gap detection and mineral rights analysis.',
    url: 'https://echo-ept.com/title-intelligence',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/title-intelligence' },
};

export default function TitleIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
