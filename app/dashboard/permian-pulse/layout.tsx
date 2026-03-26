import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Permian Pulse — Echo Prime Technologies',
  description: 'Competitive intelligence dashboard for the Permian Basin oilfield services market. Track competitors, analyze chemical product matrices, service areas, tech stacks, and reverse-engineering reports.',
  openGraph: {
    title: 'Permian Pulse — Echo Prime Technologies',
    description: 'Permian Basin competitive intelligence with competitor tracking and market analysis.',
    url: 'https://echo-ept.com/dashboard/permian-pulse',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
