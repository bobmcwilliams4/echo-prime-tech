import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Echo Prime Technologies',
  description: 'Echo Prime Technologies terms of service. Account registration, subscriptions, acceptable use, API/SDK usage, intellectual property, and liability.',
  openGraph: {
    title: 'Terms of Service — Echo Prime Technologies',
    description: 'Terms governing use of Echo Prime Technologies products and services.',
    url: 'https://echo-ept.com/legal/terms',
  },
  alternates: { canonical: '/legal/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
