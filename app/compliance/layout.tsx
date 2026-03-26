import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Compliance — AI-Powered SOC2/HIPAA/GDPR Compliance Management',
  description: 'Automate compliance with AI. SOC2, HIPAA, GDPR, ISO 27001 frameworks with built-in controls, evidence tracking, risk register, vendor management, and audit readiness scoring. Vanta alternative starting at $49/mo.',
  openGraph: {
    title: 'Echo Compliance — AI Compliance Management',
    description: 'SOC2, HIPAA, GDPR & ISO 27001 compliance automation with AI gap analysis and audit readiness scoring.',
    url: 'https://echo-ept.com/compliance',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Compliance — AI Compliance Management',
    description: 'SOC2, HIPAA, GDPR & ISO 27001 compliance with AI gap analysis and audit readiness scoring. Starts at $49/mo.',
  },
  alternates: { canonical: '/compliance' },
};

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
