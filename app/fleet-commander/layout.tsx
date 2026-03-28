import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fleet Commander — AI Worker Fleet Management | Echo Prime Technologies',
  description: 'Manage and orchestrate 200+ Cloudflare Workers from one dashboard. Auto-scaling, health monitoring, deployment coordination, cost analytics, and service mesh.',
  keywords: ['fleet management', 'worker orchestration', 'Cloudflare Workers dashboard', 'microservice management', 'auto-scaling', 'deployment coordination'],
  openGraph: {
    title: 'Fleet Commander — AI Worker Fleet Management',
    description: 'Manage 200+ Cloudflare Workers from one dashboard with auto-scaling, health monitoring, and cost analytics.',
    url: 'https://echo-ept.com/fleet-commander',
  },
  twitter: {
    card: 'summary',
    title: 'Fleet Commander — Worker Fleet Management',
    description: 'Orchestrate 200+ Workers. Auto-scaling, health monitoring, deployment coordination, cost analytics.',
  },
  alternates: { canonical: '/fleet-commander' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
