import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dark Web Intelligence | Threat Monitoring & Breach Detection | Echo Prime Technologies',
  description: 'AI-powered dark web monitoring. Credential leak detection, paste site scanning, threat intelligence feeds, IOC extraction. Protect your organization from emerging threats.',
  openGraph: {
    title: 'Dark Web Intelligence | Echo Prime Technologies',
    description: 'AI-powered dark web monitoring, credential leak detection, and threat intelligence.',
  },
};

export default function DarkWebIntelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
