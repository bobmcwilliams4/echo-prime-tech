import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDK Documentation — API Reference | Echo Prime Technologies',
  description: 'Complete API documentation for the Echo SDK. 64+ endpoints covering engines, knowledge, brain, doctrine, voice, tools, and more. Interactive examples with live responses.',
  keywords: ['SDK documentation', 'API reference', 'Echo SDK', 'developer docs', 'REST API'],
  openGraph: {
    title: 'SDK Documentation — API Reference',
    description: 'Complete API documentation for the Echo SDK. 64+ endpoints with interactive examples.',
    url: 'https://echo-ept.com/sdk/docs',
  },
  twitter: {
    card: 'summary',
    title: 'SDK Documentation — Echo Prime Technologies',
    description: 'Complete API documentation for the Echo SDK. 64+ endpoints with interactive examples.',
  },
  alternates: { canonical: '/sdk/docs' },
};

export default function SDKDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
