import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Echo Prime Technologies',
  description: 'Sign in to your Echo Prime Technologies account to access intelligence engines, voice studio, and enterprise AI services.',
  openGraph: {
    title: 'Sign In — Echo Prime Technologies',
    url: 'https://echo-ept.com/login',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In — Echo Prime Technologies',
    description: 'Sign in to your Echo Prime Technologies account to access intelligence engines, voice studio, and enterprise AI services.',
  },
  alternates: { canonical: '/login' },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
