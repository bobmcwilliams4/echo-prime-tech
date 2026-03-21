import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'County Records — AI-Powered Deed & Title Search | Echo Prime Technologies',
  description: '259,000+ deed records across 80+ Texas counties. AI-powered search by grantor, grantee, section, block, and survey. Chain-of-title analysis in seconds.',
  openGraph: { title: 'County Records — 259,000+ Texas Deed Records', description: 'AI-powered deed search across 80+ Texas counties. Grantor/grantee, legal descriptions, chain-of-title.', url: 'https://echo-ept.com/county-records' },
  twitter: { card: 'summary_large_image', title: 'County Records — 259,000+ Texas Deed Records', description: 'AI-powered deed search across 80+ Texas counties.' },
  alternates: { canonical: '/county-records' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
