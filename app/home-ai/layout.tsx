import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Home AI — Smart Home Intelligence & Automation | Echo Prime Technologies',
  description: 'AI-powered smart home platform. Control 40+ device brands, optimize energy, manage security, screen calls, and automate your household with predictive intelligence.',
  keywords: ['smart home AI', 'home automation', 'IoT', 'energy optimization', 'smart security', 'voice control', 'Echo Home AI'],
  openGraph: {
    title: 'Echo Home AI — Smart Home Intelligence & Automation',
    description: 'AI-powered smart home platform with predictive automation, energy optimization, and contextual security.',
    url: 'https://echo-ept.com/home-ai',
    type: 'website',
  },
  alternates: { canonical: 'https://echo-ept.com/home-ai' },
};

export default function HomeAILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
