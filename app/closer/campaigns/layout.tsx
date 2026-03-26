import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaign Manager — Echo Prime Technologies',
  description: 'Create and manage AI sales campaigns with configurable scripts, call schedules, concurrency limits, and lead assignments. Track campaign performance with real-time stats on connections, qualifications, and appointments.',
  openGraph: {
    title: 'Campaign Manager — Echo Prime Technologies',
    description: 'Build and manage AI-powered outbound sales campaigns with scripts, schedules, and lead targeting.',
    url: 'https://echo-ept.com/closer/campaigns',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campaign Manager — Echo Prime Technologies',
    description: 'Build and manage AI-powered outbound sales campaigns with scripts, schedules, and lead targeting.',
  },
  alternates: { canonical: '/closer/campaigns' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
