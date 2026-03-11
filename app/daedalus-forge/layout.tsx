import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daedalus Forge — Manufacturing AI | Echo Prime Technologies',
  description: 'AI manufacturing platform with CNC programming, stress analysis, DFM scoring, and cost estimation. 50-stage pipeline, 15 guilds, 8 industry verticals.',
  keywords: ['manufacturing AI', 'CNC programming', 'stress analysis', 'DFM scoring', 'Daedalus Forge', 'engineering AI'],
  openGraph: {
    title: 'Daedalus Forge — Manufacturing AI',
    description: 'AI manufacturing: CNC programming, stress analysis, DFM scoring, cost estimation. 8 industry verticals.',
    url: 'https://echo-ept.com/daedalus-forge',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/daedalus-forge' },
};

export default function DaedalusForgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
