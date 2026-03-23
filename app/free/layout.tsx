import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Tools — Start Building for Free | Echo Prime Technologies',
  description: 'Access 6 free AI products: Intelligence Engines, Knowledge Forge, Sentinel AI, SDK Playground, Dark Web Scanner, and News Intelligence. No credit card required.',
  keywords: ['free AI tools', 'free API', 'AI engines free tier', 'Echo Prime free', 'intelligence engines'],
  openGraph: {
    title: 'Free AI Tools — Start Building for Free',
    description: 'Access 6 free AI products with no credit card required. Intelligence Engines, Knowledge Forge, Sentinel AI, and more.',
    url: 'https://echo-ept.com/free',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Tools — Echo Prime Technologies',
    description: 'Access 6 free AI products with no credit card required. Intelligence Engines, Knowledge Forge, Sentinel AI, and more.',
  },
  alternates: { canonical: '/free' },
};

export default function FreeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
