import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer CRM — Echo Prime Technologies',
  description: 'Full customer relationship management for residential and commercial clients. Store contacts, manage payment terms, and track customer history in one unified CRM.',
  openGraph: {
    title: 'Customer CRM — Echo Prime Technologies',
    description: 'Unified CRM for managing residential and commercial customer contacts and history.',
    url: 'https://echo-ept.com/office-ai/customers',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
