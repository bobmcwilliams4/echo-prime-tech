import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Plans & Enterprise Tiers | Echo Prime Technologies',
  description: 'Flexible pricing for AI intelligence engines, voice synthesis, cybersecurity, and enterprise solutions. Starter, Professional, and Enterprise tiers with custom deployment options.',
  keywords: ['AI pricing', 'enterprise plans', 'Echo Prime pricing', 'AI subscription', 'intelligence engine pricing'],
  openGraph: {
    title: 'Pricing — Plans & Enterprise Tiers',
    description: 'Flexible pricing for AI intelligence engines, voice synthesis, cybersecurity, and enterprise solutions.',
    url: 'https://echo-ept.com/pricing',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
