import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Center — Echo Prime Technologies',
  description: 'Manage sales email communications with a full-featured inbox, compose, reply, and search interface. Track email history tied to leads and campaigns for complete prospect communication records.',
  openGraph: {
    title: 'Email Center — Echo Prime Technologies',
    description: 'Full email client for sales communications with inbox management, compose, and lead-linked history.',
    url: 'https://echo-ept.com/closer/email',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
