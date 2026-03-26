import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Echo Prime Technologies',
  description: 'Echo Prime Technologies cookie policy. Essential, functional, and analytics cookies used across our platform. Third-party services and opt-out information.',
  openGraph: {
    title: 'Cookie Policy — Echo Prime Technologies',
    description: 'Cookies used across the Echo Prime Technologies platform.',
    url: 'https://echo-ept.com/legal/cookies',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy — Echo Prime Technologies',
    description: 'Cookies used across the Echo Prime Technologies platform.',
  },
  alternates: { canonical: '/legal/cookies' },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
