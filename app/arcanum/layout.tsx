import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanum — Sovereign Build Template Library | Echo Prime Technologies',
  description: '194+ sovereign build templates and megaprompts for AI systems, Workers, bots, and engines. Search, combine, and deploy proven architectures instantly.',
  keywords: ['build templates', 'AI templates', 'megaprompt library', 'sovereign prompts', 'Cloudflare Worker templates', 'AI architecture'],
  openGraph: {
    title: 'Arcanum — Sovereign Build Template Library',
    description: '194+ sovereign build templates for AI systems. Search, combine, and deploy proven architectures.',
    url: 'https://echo-ept.com/arcanum',
  },
  twitter: {
    card: 'summary',
    title: 'Arcanum — Build Template Library',
    description: '194+ sovereign megaprompts and build templates for AI systems, Workers, bots, and engines.',
  },
  alternates: { canonical: '/arcanum' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
