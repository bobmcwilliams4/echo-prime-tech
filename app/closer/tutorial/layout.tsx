import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Closer AI Tutorial — Learn the AI Sales Platform | Echo Prime Technologies',
  description: 'Step-by-step interactive tutorials for Closer AI. 8 tutorials covering setup, voice settings, scripts, leads, campaigns, calls, analytics, and full workflows.',
  keywords: ['Closer AI tutorial', 'sales AI guide', 'AI CRM tutorial', 'Closer setup'],
  openGraph: {
    title: 'Closer AI Tutorial — Master AI Sales in Minutes',
    description: '8 interactive tutorials covering every aspect of Closer AI from setup to advanced workflows.',
    url: 'https://echo-ept.com/closer/tutorial',
  },
  twitter: {
    card: 'summary',
    title: 'Closer AI Tutorial — Echo Prime Technologies',
    description: '8 interactive tutorials covering every aspect of Closer AI.',
  },
  alternates: { canonical: '/closer/tutorial' },
};

export default function CloserTutorialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
