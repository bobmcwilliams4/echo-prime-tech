import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security — Echo Prime Technologies',
  description: 'Enterprise-grade security: autonomous threat detection, penetration testing, zero-trust architecture, SOC 2 infrastructure, OWASP Top 10 compliance. 69 security tools across 20 categories protecting your data at the edge.',
  keywords: ['AI security', 'penetration testing', 'threat detection', 'zero trust', 'SOC 2', 'OWASP', 'cybersecurity', 'edge security', 'autonomous patrol', 'compliance', 'data privacy', 'encryption'],
  openGraph: {
    title: 'Security — Echo Prime Technologies',
    description: 'Enterprise-grade security: 69 autonomous tools, zero-trust architecture, SOC 2 infrastructure, OWASP Top 10 compliance.',
    url: 'https://echo-ept.com/security',
    siteName: 'Echo Prime Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security — Echo Prime Technologies',
    description: 'Enterprise-grade security: 69 autonomous tools, zero-trust architecture, SOC 2 infrastructure.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/security',
  },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
