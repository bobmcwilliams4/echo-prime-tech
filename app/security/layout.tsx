import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cybersecurity — Autonomous Defense Systems | Echo Prime Technologies',
  description: 'Enterprise cybersecurity powered by AI: threat intelligence, SIEM orchestration, zero-trust architecture, incident response automation, compliance monitoring, and adversarial defense across 16 security domains.',
  keywords: ['cybersecurity', 'AI security', 'threat intelligence', 'SIEM', 'zero trust', 'incident response', 'Echo Prime'],
  openGraph: {
    title: 'Cybersecurity — Autonomous Defense Systems',
    description: 'Enterprise cybersecurity powered by AI across 16 security domains. Threat intelligence, SIEM, zero-trust, and more.',
    url: 'https://echo-ept.com/security',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/security' },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
