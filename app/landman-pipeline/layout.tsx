import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landman Pipeline — AI Title Intelligence & Chain of Title | Echo Prime Technologies',
  description: 'AI-powered title examination pipeline for oil & gas land professionals. Automated chain of title, run sheets, division orders, and gap analysis across 80+ Texas counties.',
  keywords: ['landman software', 'title examination', 'chain of title', 'oil gas title', 'run sheet', 'division order', 'mineral rights'],
  openGraph: {
    title: 'Landman Pipeline — AI Title Intelligence & Chain of Title',
    description: 'AI title examination for oil & gas land professionals. Chain of title, run sheets, gap analysis across 80+ counties.',
    url: 'https://echo-ept.com/landman-pipeline',
  },
  twitter: {
    card: 'summary',
    title: 'Landman Pipeline — AI Title Intelligence',
    description: 'Automated chain of title, run sheets, division orders for oil & gas. 80+ Texas counties covered.',
  },
  alternates: { canonical: '/landman-pipeline' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
