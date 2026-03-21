import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — AI Engines, Sales Agents & Enterprise AI | Echo Prime Technologies',
  description: 'Transparent pricing for AI intelligence engines, autonomous sales agents, data pipelines, title intelligence, tax preparation, and cybersecurity. Start free, scale as you grow.',
  keywords: ['AI pricing', 'enterprise AI pricing', 'AI sales agent cost', 'intelligence engine pricing', 'Echo Prime pricing'],
  openGraph: {
    title: 'Echo Prime Technologies — Pricing',
    description: 'Transparent pricing for AI engines, sales agents, pipelines, and enterprise intelligence. Start free.',
    url: 'https://echo-ept.com/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Prime Technologies — Pricing',
    description: 'AI engines from $49/mo. Sales agents from $299/mo. Start free, scale as you grow.',
  },
  alternates: { canonical: '/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
