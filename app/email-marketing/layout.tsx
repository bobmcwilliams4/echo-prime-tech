import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Email Marketing — AI-Powered Email Campaigns | Echo Prime Technology',
  description: 'Send AI-powered email campaigns with automated subject lines, content generation, A/B testing, and real-time analytics. Starting at $15/month.',
  keywords: ['email marketing', 'AI email', 'email campaigns', 'automation', 'newsletter', 'A/B testing'],
  openGraph: {
    title: 'Echo Email Marketing — AI-Powered Email Campaigns',
    description: 'Send AI-powered email campaigns with automated subject lines, content generation, A/B testing, and real-time analytics.',
    url: 'https://echo-ept.com/email-marketing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Email Marketing — AI-Powered Email Campaigns',
    description: 'Send AI-powered email campaigns with automated subject lines, content generation, A/B testing, and real-time analytics.',
  },
  alternates: { canonical: '/email-marketing' },
};

export default function EmailMarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
