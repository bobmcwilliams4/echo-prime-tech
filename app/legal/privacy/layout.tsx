import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Echo Prime Technologies',
  description: 'Echo Prime Technologies privacy policy. How we collect, use, and protect your data. CCPA compliance, data rights, and third-party services.',
  openGraph: {
    title: 'Privacy Policy — Echo Prime Technologies',
    description: 'How we collect, use, and protect your data.',
    url: 'https://echo-ept.com/legal/privacy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Echo Prime Technologies',
    description: 'How we collect, use, and protect your data.',
  },
  alternates: { canonical: '/legal/privacy' },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
