import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Title Intelligence — Chain of Title Search | Echo Prime Technologies',
  description: 'AI-powered chain of title analysis across 80+ Texas counties. 259,000+ indexed deed records, automated mineral rights tracing, gap detection, and fractional interest calculations. From $200/mo.',
  keywords: ['title intelligence', 'chain of title', 'mineral rights', 'deed records', 'Texas county records', 'oil and gas title search', 'ShadowGlass', 'landman AI', 'Echo Prime'],
  openGraph: {
    title: 'AI Title Intelligence — Chain of Title Search',
    description: '80+ Texas counties, 259K+ deed records. AI-powered mineral rights tracing, gap detection, and chain of title analysis.',
    url: 'https://echo-ept.com/title-intelligence',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/title-intelligence' },
};

export default function TitleIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
