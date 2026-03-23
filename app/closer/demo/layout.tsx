import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Closer AI Demo — Try the AI Sales Agent | Echo Prime Technologies',
  description: 'Experience Closer AI live. Talk to our ElevenLabs-powered voice AI sales agent. Real-time conversation with emotion detection and personality routing.',
  keywords: ['AI sales demo', 'Closer AI', 'voice AI demo', 'sales agent demo', 'conversational AI'],
  openGraph: {
    title: 'Closer AI Demo — Talk to Our AI Sales Agent',
    description: 'Experience Closer AI live with ElevenLabs voice synthesis and real-time conversation.',
    url: 'https://echo-ept.com/closer/demo',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Closer AI Demo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Closer AI Demo — Echo Prime Technologies',
    description: 'Talk to our AI sales agent. Real-time voice conversation with emotion detection.',
  },
  alternates: { canonical: '/closer/demo' },
};

export default function CloserDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
