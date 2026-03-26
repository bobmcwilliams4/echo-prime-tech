import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Store | Echo Prime Technologies',
  description: 'Purchase AI intelligence engines, security tools, data pipelines, and professional services from Echo Prime Technologies.',
  openGraph: {
    title: 'Echo Prime Store',
    description: 'AI-powered tools and services built in Midland, Texas.',
    url: 'https://echo-ept.com/ecommerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Prime Store',
    description: 'AI-powered tools and services built in Midland, Texas.',
  },
  alternates: { canonical: '/ecommerce' },
};

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
