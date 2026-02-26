import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daedalus Forge — AI Manufacturing Intelligence | Echo Prime Technologies',
  description: '50-stage manufacturing pipeline with 15 guilds, 80 AI agents, and the Trinity Council (SAGE/NYX/THORNE). 8 engineering domains. Industry-standard quality gates. Cloud-native manufacturing intelligence.',
  keywords: ['manufacturing AI', 'quality control', 'engineering analysis', 'ISO standards', 'manufacturing pipeline', 'Daedalus Forge', 'Echo Prime'],
  openGraph: {
    title: 'Daedalus Forge — AI Manufacturing Intelligence',
    description: '50-stage manufacturing pipeline with 15 guilds, 80 AI agents, and Trinity Council governance.',
    url: 'https://echo-ept.com/daedalus-forge',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/daedalus-forge' },
};

export default function DaedalusForgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
