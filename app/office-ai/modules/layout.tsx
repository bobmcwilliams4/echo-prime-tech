import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Module Manager — Echo Prime Technologies',
  description: 'Enable, disable, and configure Office AI modules to match your business needs. Choose from 22 modules across finance, operations, team management, and sales.',
  openGraph: {
    title: 'Module Manager — Echo Prime Technologies',
    description: 'Customize your Office AI platform by enabling the exact modules your business needs.',
    url: 'https://echo-ept.com/office-ai/modules',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
