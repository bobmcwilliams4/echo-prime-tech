import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — Enterprise AI Solutions | Echo Prime Technologies',
  description: 'Enterprise AI services: autonomous intelligence engines, voice synthesis, website development, collectibles grading, cybersecurity, penetration testing, and more. Built for industries that demand precision.',
  keywords: ['AI services', 'enterprise AI', 'intelligence engines', 'cybersecurity', 'voice synthesis', 'Echo Prime'],
  openGraph: {
    title: 'Enterprise AI Services',
    description: 'Autonomous intelligence engines, voice synthesis, cybersecurity, and more. Built for industries that demand precision.',
    url: 'https://echo-ept.com/services',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise AI Services',
    description: 'Autonomous intelligence engines, voice synthesis, cybersecurity, and more. Built for industries that demand precision.',
  },
  alternates: { canonical: '/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
