import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Sandbox — CTF Challenges & Defense Testing | Echo Prime Technologies',
  description: 'Interactive cyber range with 27 CTF challenges across 10 categories: SQL injection, XSS, authentication bypass, SSRF, access control, and more. Plus defense scanning to test your own infrastructure.',
  keywords: ['CTF', 'security sandbox', 'cyber range', 'penetration testing practice', 'security challenges', 'Echo Prime'],
  openGraph: {
    title: 'Security Sandbox — CTF Challenges & Defense Testing',
    description: 'Interactive cyber range with 27 CTF challenges and defense scanning for your infrastructure.',
    url: 'https://echo-ept.com/sandbox',
  },
};

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
