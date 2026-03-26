import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Web Analytics — Privacy-First Website Analytics | Echo Prime Technology',
  description: 'Cookie-free, GDPR-compliant website analytics. Lightweight script, real-time dashboard, UTM tracking, goal conversions, and public share links. Starting at $9/mo.',
  openGraph: {
    title: 'Echo Web Analytics — Privacy-First Website Analytics',
    description: 'The Plausible alternative on Cloudflare. No cookies, no consent banners, full insights.',
    url: 'https://echo-ept.com/web-analytics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Web Analytics — Privacy-First Website Analytics',
    description: 'The Plausible alternative on Cloudflare. No cookies, no consent banners, full insights.',
  },
  alternates: { canonical: '/web-analytics' },
};

export default function WebAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
