import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Email Marketing Documentation — AI-Powered Campaigns & Automation',
  description: 'AI-driven email campaigns with smart segmentation, automated sequences, deliverability optimization, A/B testing, and conversion tracking. CAN-SPAM and GDPR compliant.',
  keywords: ['email marketing', 'AI email', 'email automation', 'email campaigns', 'deliverability', 'email segmentation', 'A/B testing'],
  openGraph: {
    title: 'Echo Email Marketing Documentation',
    description: 'AI-powered email campaigns with smart segmentation, automated sequences, and conversion tracking.',
    url: 'https://echo-ept.com/docs/email-marketing',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Email Marketing — AI-Powered Campaigns',
    description: 'Smart segmentation, automated sequences, deliverability optimization, and AI content generation.',
  },
  alternates: { canonical: '/docs/email-marketing' },
};

export default function EmailMarketingDocLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
