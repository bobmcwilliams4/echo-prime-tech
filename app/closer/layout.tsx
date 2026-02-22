import type { Metadata } from 'next';
import CloserShell from './closer-shell';

export const metadata: Metadata = {
  title: 'Closer — AI Sales Agent Platform | Echo Prime Technologies',
  description: 'AI-powered sales agent platform with lead management, automated calls, campaign orchestration, script generation, and real-time analytics. Close more deals with autonomous intelligence.',
  keywords: ['AI sales agent', 'sales automation', 'lead management', 'AI closer', 'sales intelligence', 'Echo Prime'],
  openGraph: {
    title: 'Closer — AI Sales Agent Platform',
    description: 'AI-powered sales agent platform. Lead management, automated calls, campaigns, and real-time analytics.',
    url: 'https://echo-ept.com/closer',
  },
};

export default function CloserLayout({ children }: { children: React.ReactNode }) {
  return <CloserShell>{children}</CloserShell>;
}
