import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Script Builder — Echo Prime Technologies',
  description: 'Design AI sales conversation scripts with a visual state-machine builder. Define greeting, qualification, objection handling, and closing flows with configurable transitions, personalities, and industry-specific templates.',
  openGraph: {
    title: 'Script Builder — Echo Prime Technologies',
    description: 'Visual AI sales script builder with state machines, objection flows, and industry templates.',
    url: 'https://echo-ept.com/closer/scripts',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Script Builder — Echo Prime Technologies',
    description: 'Visual AI sales script builder with state machines, objection flows, and industry templates.',
  },
  alternates: { canonical: '/closer/scripts' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
