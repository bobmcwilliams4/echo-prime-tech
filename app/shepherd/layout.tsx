import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Shepherd AI — Church & Ministry Management Platform | Echo Prime Technologies',
  description: 'AI-powered church management with sermon preparation, congregation care, small group coordination, volunteer scheduling, and 9 denomination configurations.',
  keywords: ['church management', 'ministry AI', 'sermon preparation', 'congregation care', 'church software', 'Echo Shepherd AI'],
  openGraph: {
    title: 'Echo Shepherd AI — Church & Ministry Management Platform',
    description: 'AI-powered church management with sermon prep, congregation care, volunteer scheduling, and denomination-specific configurations.',
    url: 'https://echo-ept.com/shepherd',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Shepherd AI — Church & Ministry Management Platform',
    description: 'AI-powered church management with sermon prep, congregation care, volunteer scheduling, and denomination-specific configurations.',
  },
  alternates: { canonical: 'https://echo-ept.com/shepherd' },
};

export default function ShepherdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
