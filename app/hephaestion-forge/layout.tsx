import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hephaestion Forge — AI Code Factory | Echo Prime Technologies',
  description: 'AI code factory that builds complete applications from descriptions. 13-stage pipeline, 15 archetypes, multi-LLM validation, and quality gates. Production-ready code.',
  keywords: ['AI code generation', 'code factory', 'AI software builder', 'automated coding', 'Hephaestion Forge'],
  openGraph: {
    title: 'Hephaestion Forge — AI Code Factory',
    description: 'AI code factory: 13-stage pipeline, 15 archetypes, multi-LLM validation. Production-ready applications.',
    url: 'https://echo-ept.com/hephaestion-forge',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/hephaestion-forge' },
};

export default function HephaestionForgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
