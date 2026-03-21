import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Reviews — What People Say About Echo Prime Technologies',
  description: 'Read reviews from businesses using Echo Prime AI engines, Closer AI sales agent, Sentinel intelligence, and more. Real feedback from real users.',
  openGraph: {
    title: 'Customer Reviews — Echo Prime Technologies',
    description: 'Real reviews from businesses using AI engines, sales agents, and intelligence tools.',
    url: 'https://echo-ept.com/reviews',
  },
  twitter: {
    card: 'summary',
    title: 'Customer Reviews — Echo Prime Technologies',
    description: 'Real reviews from businesses using AI engines, sales agents, and intelligence tools.',
  },
  alternates: { canonical: '/reviews' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
