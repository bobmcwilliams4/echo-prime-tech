import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDK Pricing — Developer Plans | Echo Prime Technologies',
  description: 'Echo SDK pricing: Free (100 queries/day), Pro ($49/mo, 10K queries), Enterprise ($199/mo, unlimited). Access 5,486+ engines, 170K+ knowledge chunks, and 64+ endpoints.',
  keywords: ['SDK pricing', 'API pricing', 'developer plans', 'Echo SDK cost', 'AI API pricing'],
  openGraph: {
    title: 'SDK Pricing — Start Free, Scale as You Grow',
    description: 'Free tier with 100 queries/day. Pro from $49/mo. Enterprise unlimited.',
    url: 'https://echo-ept.com/sdk/pricing',
  },
  twitter: {
    card: 'summary',
    title: 'SDK Pricing — Echo Prime Technologies',
    description: 'Free tier with 100 queries/day. Pro from $49/mo. Enterprise unlimited.',
  },
  alternates: { canonical: '/sdk/pricing' },
};

export default function SDKPricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
