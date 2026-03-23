import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies — AI Success Stories | Echo Prime Technologies',
  description: 'Real-world AI engine deployments across oil & gas, legal, financial services, cybersecurity, healthcare, and construction. See measurable results from production AI systems.',
  keywords: ['AI case studies', 'AI success stories', 'enterprise AI', 'oilfield AI', 'legal AI', 'Echo Prime'],
  openGraph: {
    title: 'Case Studies — AI Success Stories Across Industries',
    description: 'Real-world AI deployments with measurable results. Oil & gas, legal, financial, cybersecurity, healthcare, and construction.',
    url: 'https://echo-ept.com/case-studies',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies — Echo Prime Technologies',
    description: 'Real-world AI deployments with measurable results across 6 industries.',
  },
  alternates: { canonical: '/case-studies' },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
