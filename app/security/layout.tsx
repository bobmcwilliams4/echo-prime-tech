import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cyber Defense & Security Monitoring | Echo Prime Technologies',
  description: '24/7 threat monitoring, incident response, security architecture review, compliance assessment, and vulnerability management. Enterprise-grade cybersecurity. $499-$2,999/mo.',
  keywords: ['cybersecurity', 'threat monitoring', 'incident response', 'penetration testing', 'security audit', 'vulnerability management'],
  openGraph: {
    title: 'Cyber Defense & Security Monitoring',
    description: '24/7 threat monitoring, incident response, and vulnerability management. Enterprise-grade cybersecurity.',
    url: 'https://echo-ept.com/security',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/security' },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
