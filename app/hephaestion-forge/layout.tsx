import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hephaestion Forge — AI Program Builder & Code Forge | Echo Prime Technologies',
  description: '15 project archetypes, 13-stage build pipeline, 6 quality gates, multi-LLM swarm code generation. From concept to production-ready code in minutes. Conversational software engineering.',
  keywords: ['code generation', 'AI programming', 'software forge', 'project builder', 'quality gates', 'multi-LLM', 'Hephaestion Forge', 'Echo Prime'],
  openGraph: {
    title: 'Hephaestion Forge — AI Program Builder & Code Forge',
    description: '15 archetypes, 13-stage pipeline, 6 quality gates. Conversational software engineering at scale.',
    url: 'https://echo-ept.com/hephaestion-forge',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/hephaestion-forge' },
};

export default function HephaestionForgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
