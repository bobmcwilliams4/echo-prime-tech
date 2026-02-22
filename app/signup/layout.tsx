import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | Echo Prime Technologies',
  description: 'Create your Echo Prime Technologies account. Access 900+ intelligence engines, voice synthesis, cybersecurity tools, and enterprise AI infrastructure.',
  openGraph: {
    title: 'Create Account — Echo Prime Technologies',
    url: 'https://echo-ept.com/signup',
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
