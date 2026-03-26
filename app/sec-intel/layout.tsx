import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEC EDGAR Intelligence | AI Filing Analysis & Watchlists | Echo Prime Technologies',
  description: 'AI-powered SEC EDGAR filing analysis. Full-text search, company watchlists, automated alerts, and AI-driven analysis of 10-K, 10-Q, 8-K, and proxy filings.',
  openGraph: {
    title: 'SEC EDGAR Intelligence | Echo Prime Technologies',
    description: 'AI-powered SEC filing analysis with watchlists, alerts, and automated intelligence.',
    url: 'https://echo-ept.com/sec-intel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEC EDGAR Intelligence | Echo Prime Technologies',
    description: 'AI-powered SEC filing analysis with watchlists, alerts, and automated intelligence.',
  },
  alternates: { canonical: '/sec-intel' },
};

export default function SecIntelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
