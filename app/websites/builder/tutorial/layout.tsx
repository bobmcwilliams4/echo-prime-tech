import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website Builder Tutorial — Echo Prime Technologies',
  description: 'Step-by-step interactive tutorials for the Echo Prime AI Website Builder. 11 tutorials covering 57 steps across all 16 builder features, from templates to deployment.',
  openGraph: {
    title: 'Website Builder Tutorial — Echo Prime Technologies',
    description: 'Interactive step-by-step guides covering all 16 features of the Echo Prime AI Website Builder.',
    url: 'https://echo-ept.com/websites/builder/tutorial',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
