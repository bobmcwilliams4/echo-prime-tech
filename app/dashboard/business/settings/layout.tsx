import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Settings — Echo Prime Technologies',
  description: 'Configure your business profile including company details, contact information, tax settings, accepted payment methods, and business hours for each day of the week.',
  openGraph: {
    title: 'Business Settings — Echo Prime Technologies',
    description: 'Business configuration for company profile, tax rates, payment methods, and operating hours.',
    url: 'https://echo-ept.com/dashboard/business/settings',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
