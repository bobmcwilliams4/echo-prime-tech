import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zoho CRM Integration — Echo Prime Technologies',
  description: 'Connect Zoho CRM to Echo Prime for bidirectional lead sync with Closer AI. Manage OAuth connections, run full syncs, monitor system health, and access 5,486+ intelligence engines.',
  openGraph: {
    title: 'Zoho CRM Integration — Echo Prime Technologies',
    description: 'Bidirectional Zoho CRM and Closer AI lead sync with AI-powered intelligence and engine analysis.',
    url: 'https://echo-ept.com/admin/zoho',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoho CRM Integration — Echo Prime Technologies',
    description: 'Bidirectional Zoho CRM and Closer AI lead sync with AI-powered intelligence and engine analysis.',
  },
  alternates: { canonical: '/admin/zoho' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
