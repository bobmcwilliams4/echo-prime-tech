import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cybersecurity Intelligence — AI Threat Detection | Echo Prime Technologies',
  description: 'AI-powered penetration testing, dark web monitoring, credential auditing, and threat intelligence. Enterprise-grade security.',
  openGraph: { title: 'Cybersecurity Intelligence — AI Threat Detection', description: 'AI pentesting, dark web monitoring, credential auditing, threat intelligence.', url: 'https://echo-ept.com/security' },
  twitter: { card: 'summary_large_image', title: 'Cybersecurity Intelligence', description: 'AI pentesting, dark web monitoring, credential auditing. Enterprise-grade.' },
  alternates: { canonical: '/security' },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
