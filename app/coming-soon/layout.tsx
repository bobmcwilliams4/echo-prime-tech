import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon | Echo Prime Technologies',
  description: 'New AI products and features are coming soon to Echo Prime Technologies. Stay tuned for announcements.',
  openGraph: {
    title: 'Coming Soon — Echo Prime Technologies',
    description: 'New AI products and features are coming soon.',
    url: 'https://echo-ept.com/coming-soon',
  },
  twitter: {
    card: 'summary',
    title: 'Coming Soon — Echo Prime Technologies',
    description: 'New AI products and features are coming soon.',
  },
  alternates: { canonical: '/coming-soon' },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
