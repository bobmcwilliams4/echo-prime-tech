import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Surveillance & Monitoring | Smart Security Intelligence | Echo Prime Technologies',
  description: 'AI-powered surveillance and monitoring solutions. Real-time threat detection, anomaly analysis, video analytics, and automated incident response for enterprise security.',
  openGraph: {
    title: 'AI Surveillance & Monitoring | Echo Prime Technologies',
    description: 'AI-powered surveillance with real-time threat detection and automated incident response.',
    url: 'https://echo-ept.com/surveillance',
  },
  alternates: { canonical: '/surveillance' },
};

export default function SurveillanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
