import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Echo Prime Technologies — Founded in Midland, TX',
  description: 'Built by Bobby Don McWilliams II, a 30-year oilfield veteran turned AI architect. 14 months of 20-hour days. Zero VC funding. 5,400+ engines across 940+ domains.',
  keywords: ['Echo Prime Technologies', 'Bobby McWilliams', 'AI company', 'Midland Texas', 'AI startup', 'oilfield AI'],
  openGraph: {
    title: 'About Echo Prime Technologies',
    description: 'Built by a 30-year oilfield veteran. 14 months, zero VC. 5,400+ AI engines across 940+ domains.',
    url: 'https://echo-ept.com/about',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
