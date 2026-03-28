import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prometheus AI — AI Surveillance & Monitoring Intelligence | Echo Prime Technologies',
  description: 'AI-powered surveillance and monitoring platform. Real-time video analytics, facial recognition, license plate reading, anomaly detection, and perimeter defense.',
  keywords: ['AI surveillance', 'video analytics', 'facial recognition', 'security monitoring', 'anomaly detection', 'CCTV AI'],
  openGraph: {
    title: 'Prometheus AI — AI Surveillance & Monitoring Intelligence',
    description: 'AI surveillance platform with real-time video analytics, facial recognition, and anomaly detection.',
    url: 'https://echo-ept.com/prometheus-ai',
  },
  twitter: {
    card: 'summary',
    title: 'Prometheus AI — AI Surveillance Platform',
    description: 'Real-time video analytics, facial recognition, license plate reading, and perimeter defense.',
  },
  alternates: { canonical: '/prometheus-ai' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
