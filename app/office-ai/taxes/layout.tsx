import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tax Calculator & Reporting — Echo Prime Technologies',
  description: 'Track quarterly estimated tax payments, monitor YTD revenue and expenses, and calculate effective tax rates. Stay on top of deadlines with payment status tracking.',
  openGraph: {
    title: 'Tax Calculator & Reporting — Echo Prime Technologies',
    description: 'Quarterly tax payment tracking with YTD calculations and deadline monitoring.',
    url: 'https://echo-ept.com/office-ai/taxes',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
