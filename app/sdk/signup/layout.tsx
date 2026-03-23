import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Your SDK API Key | Echo Prime Technologies',
  description: 'Create your Echo SDK API key instantly. Choose your plan, generate a key, and start querying 5,486+ AI engines in minutes.',
  keywords: ['SDK signup', 'API key', 'Echo SDK registration', 'developer signup'],
  openGraph: {
    title: 'Get Your SDK API Key — Start Building Now',
    description: 'Create your Echo SDK API key instantly and start querying 5,486+ AI engines.',
    url: 'https://echo-ept.com/sdk/signup',
  },
  twitter: {
    card: 'summary',
    title: 'Get Your SDK API Key — Echo Prime Technologies',
    description: 'Create your API key instantly and start querying 5,486+ AI engines.',
  },
  alternates: { canonical: '/sdk/signup' },
};

export default function SDKSignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
