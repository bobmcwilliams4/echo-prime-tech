import type { Metadata } from 'next';
import CloserShell from './closer-shell';

export const metadata: Metadata = {
  title: 'AI Sales Agent (Closer AI) | Echo Prime Technologies',
  description: 'Autonomous AI voice closer with real-time conversation, CRM pipeline, lead scoring, and 24/7 availability. Replace SDR teams with AI that never sleeps. $299-$999/mo.',
  keywords: ['AI sales agent', 'AI closer', 'voice AI', 'sales automation', 'CRM AI', 'lead generation AI', 'AI SDR'],
  openGraph: {
    title: 'AI Sales Agent (Closer AI)',
    description: 'Autonomous AI voice closer with CRM, lead scoring, and 24/7 availability. Replace SDR teams with AI.',
    url: 'https://echo-ept.com/closer',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/closer' },
};

export default function CloserLayout({ children }: { children: React.ReactNode }) {
  return <CloserShell>{children}</CloserShell>;
}
