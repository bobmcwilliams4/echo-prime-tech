import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Settings — Echo Prime Technologies',
  description: 'Configure your business profile, tax rates, accepted payment methods, and operating hours. Centralized settings that apply across all Office AI modules.',
  openGraph: {
    title: 'Business Settings — Echo Prime Technologies',
    description: 'Configure business profile, tax rates, payment methods, and operating hours.',
    url: 'https://echo-ept.com/office-ai/settings',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
