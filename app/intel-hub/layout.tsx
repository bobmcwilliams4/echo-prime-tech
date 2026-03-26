import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Intel Hub — Digital Intelligence & Monitoring | Echo Prime Technologies',
  description: 'Monitor devices, analyze network traffic, track app usage, and detect anomalies. Real-time alerts, keyword watchlist, kill switch, and 8-tab intelligence dashboard.',
  keywords: ['digital intelligence', 'device monitoring', 'network analysis', 'app tracking', 'anomaly detection', 'OSINT', 'parental monitoring', 'corporate security'],
  openGraph: {
    title: 'Echo Intel Hub — Digital Intelligence & Monitoring',
    description: 'Monitor devices, analyze traffic, track apps, and detect anomalies from one encrypted dashboard.',
    url: 'https://echo-ept.com/intel-hub',
    siteName: 'Echo Prime Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Intel Hub — Digital Intelligence & Monitoring',
    description: 'Monitor devices, analyze traffic, track apps, and detect anomalies from one encrypted dashboard.',
  },
  alternates: { canonical: 'https://echo-ept.com/intel-hub' },
};

export default function IntelHubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
