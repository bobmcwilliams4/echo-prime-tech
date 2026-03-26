import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Call History — Echo Prime Technologies',
  description: 'Review all AI Closer calls with full transcripts, sentiment analysis, coaching notes, and cost breakdowns. Filter by status, disposition, campaign, and direction for detailed call insights.',
  openGraph: {
    title: 'Call History — Echo Prime Technologies',
    description: 'Browse AI sales call history with transcripts, sentiment analysis, and cost tracking.',
    url: 'https://echo-ept.com/closer/calls',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
