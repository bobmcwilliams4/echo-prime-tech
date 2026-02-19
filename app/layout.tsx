import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import EchoPrimeChat from '../components/echo-prime-chat';

export const metadata: Metadata = {
  title: 'Echo Prime Technologies | Autonomous Intelligence Systems',
  description: 'Enterprise AI infrastructure, autonomous intelligence engines, and next-generation data systems. Built for industries that demand precision.',
  keywords: ['AI', 'autonomous systems', 'intelligence engines', 'enterprise AI', 'data infrastructure'],
  openGraph: {
    title: 'Echo Prime Technologies',
    description: 'Autonomous Intelligence Systems',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <EchoPrimeChat />
        </AuthProvider>
      </body>
    </html>
  );
}
