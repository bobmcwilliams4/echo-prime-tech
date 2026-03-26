import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Newsletter — Email Newsletter Platform | Echo Prime Technology',
  description: 'Launch your newsletter in minutes. Subscriber management, email campaigns, open/click tracking, drip automations, embeddable subscribe forms, RSS feeds, and AI content generation. Starting at $14/mo.',
  openGraph: {
    title: 'Echo Newsletter — Email Newsletter Platform',
    description: 'The Substack alternative that costs 90% less. AI-powered newsletter publishing with full analytics.',
    url: 'https://echo-ept.com/newsletter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Newsletter — Email Newsletter Platform',
    description: 'The Substack alternative that costs 90% less. AI-powered newsletter publishing with full analytics.',
  },
  alternates: { canonical: '/newsletter' },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
