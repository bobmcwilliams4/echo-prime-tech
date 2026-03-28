import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Diagnostics Agent — Autonomous Code Quality Scanner | Echo Prime Technologies',
  description: 'Autonomous code quality scanner for 225+ GitHub repos. Detects 9 issue types, auto-fixes 3, rotating batch scans every 6 hours. Health endpoints, structured logging, CORS, auth middleware, and more.',
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Diagnostics Agent — Autonomous Code Quality Scanner | Echo Prime Technologies',
    description: 'Autonomous code quality scanner: 9 issue types, 3 auto-fixes, rotating batch scans across 225+ GitHub repos.',
  },
  alternates: { canonical: '/diagnostics' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
