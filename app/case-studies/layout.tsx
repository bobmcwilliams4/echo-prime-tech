import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies — Echo Prime Technologies',
  description: 'Real-world results: how companies use 5,500+ AI engines to cut title examination time 80%, reduce audit prep from 3 weeks to 2 days, and automate expert-level analysis across oil & gas, tax, legal, cybersecurity, and sales.',
  keywords: ['case studies', 'AI results', 'title intelligence', 'tax engines', 'legal AI', 'cybersecurity compliance', 'drilling optimization', 'AI sales agent', 'ROI', 'automation'],
  openGraph: {
    title: 'Case Studies — Echo Prime Technologies',
    description: 'Real-world results: 80% faster title examination, 98% audit defense rate, $150K/well savings. See what 5,500+ AI engines deliver.',
    url: 'https://echo-ept.com/case-studies',
    siteName: 'Echo Prime Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies — Echo Prime Technologies',
    description: 'Real-world results: 80% faster title examination, 98% audit defense rate, $150K/well savings.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/case-studies',
  },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
