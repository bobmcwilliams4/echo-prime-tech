import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lead Management — Echo Prime Technologies',
  description: 'Manage your entire sales pipeline with AI-powered lead management. Import leads in bulk, categorize by status and priority, initiate AI voice calls directly, and track engagement across every touchpoint.',
  openGraph: {
    title: 'Lead Management — Echo Prime Technologies',
    description: 'AI-powered lead management with bulk import, categorization, and one-click AI calling.',
    url: 'https://echo-ept.com/closer/leads',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
