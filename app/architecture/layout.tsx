import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Architecture — Echo Prime Technologies',
  description: 'Full stack transparency. Explore our 7-layer architecture: Cloudflare Workers, 5,500+ AI engines, 64K+ GOLD doctrine blocks, autonomous self-healing infrastructure. Every technology documented and open-source.',
  keywords: ['architecture', 'tech stack', 'cloudflare workers', 'edge computing', 'AI engines', 'autonomous infrastructure', 'serverless', 'doctrine blocks', 'transparent stack'],
  openGraph: {
    title: 'Architecture — Echo Prime Technologies',
    description: 'Full stack transparency. 7-layer edge architecture, 144+ Workers, 5,500+ AI engines, autonomous self-healing infrastructure.',
    url: 'https://echo-ept.com/architecture',
    siteName: 'Echo Prime Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architecture — Echo Prime Technologies',
    description: 'Full stack transparency. 7-layer edge architecture, 144+ Workers, 5,500+ AI engines.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/architecture',
  },
};

export default function ArchitectureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
