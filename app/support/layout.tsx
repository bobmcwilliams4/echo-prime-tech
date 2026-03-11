import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | Echo Prime Technologies',
  description: 'Get help with Echo Prime Technologies products and services. FAQ, documentation, and contact support for technical assistance.',
  openGraph: {
    title: 'Support — Echo Prime Technologies',
    description: 'Get help with Echo Prime Technologies products and services. FAQ, documentation, and contact support.',
    url: 'https://echo-ept.com/support',
  },
  alternates: { canonical: '/support' },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
