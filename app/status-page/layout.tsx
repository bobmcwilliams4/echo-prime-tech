import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Status Page — Beautiful Public Status Pages for Your Services | Echo Prime Technology',
  description: 'Create branded public status pages with real-time uptime monitoring, incident management, scheduled maintenance, and subscriber notifications. Starting at $9/month.',
  keywords: ['status page', 'uptime monitoring', 'incident management', 'service status', 'StatusPage alternative', 'BetterUptime alternative'],
  openGraph: {
    title: 'Echo Status Page — Beautiful Public Status Pages for Your Services',
    description: 'Create branded public status pages with real-time uptime monitoring, incident management, scheduled maintenance, and subscriber notifications. Starting at $9/month.',
    url: 'https://echo-ept.com/status-page',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Status Page — Beautiful Public Status Pages for Your Services | Echo Prime Technology',
    description: 'Create branded public status pages with real-time uptime monitoring, incident management, scheduled maintenance, and subscriber notifications. Starting at $9/month.',
  },
  alternates: { canonical: '/status-page' },
};

export default function StatusPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
