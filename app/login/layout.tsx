import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Echo Prime Technologies',
  description: 'Sign in to your Echo Prime Technologies account to access intelligence engines, voice studio, and enterprise AI services.',
  openGraph: {
    title: 'Sign In — Echo Prime Technologies',
    url: 'https://echo-ept.com/login',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
