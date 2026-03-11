import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — AI Engines, Bots, Scrapers & More | Echo Prime Technologies',
  description: 'Transparent pricing for AI engines, custom bots, web scrapers, data pipelines, tax preparation, cybersecurity, and title intelligence. Annual billing saves 20%.',
  keywords: ['AI pricing', 'engine pricing', 'bot pricing', 'scraper pricing', 'AI service pricing', 'Echo Prime pricing'],
  openGraph: {
    title: 'Pricing — AI Engines, Bots, Scrapers & More',
    description: 'Transparent pricing for AI engines, bots, scrapers, pipelines, and more. Annual billing saves 20%.',
    url: 'https://echo-ept.com/pricing',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
