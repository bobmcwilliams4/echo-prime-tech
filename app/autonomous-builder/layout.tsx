import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Autonomous Builder — Self-Healing AI Infrastructure | Echo Prime Technologies',
  description: 'The execution engine for AI fleets: autonomous bug fixing, QA processing, worker warming, thin page repair, evolution scanning, and daily briefings. 25 service bindings, 4 cron cycles, zero human intervention.',
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Autonomous Builder — Self-Healing AI Infrastructure | Echo Prime Technologies',
    description: 'Self-healing AI infrastructure: autonomous bug fixing, QA processing, evolution scanning, and fleet management with zero human intervention.',
  },
  alternates: { canonical: '/autonomous-builder' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
