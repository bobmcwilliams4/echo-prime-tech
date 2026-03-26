import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Contracts — AI-Powered Contract Management & E-Signatures | Echo Prime Tech',
  description: 'Draft, negotiate, sign, and manage contracts with AI risk analysis, clause suggestions, e-signatures, version control, and renewal automation. Starting at $19/mo.',
  keywords: ['contract management', 'e-signatures', 'document signing', 'CLM', 'contract lifecycle', 'AI contracts', 'clause library'],
  openGraph: {
    title: 'Echo Contracts — AI-Powered Contract Management & E-Signatures',
    description: 'Complete contract lifecycle management with AI risk analysis and unlimited e-signatures.',
    url: 'https://echo-ept.com/contracts',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Contracts — AI Contract Management & E-Signatures',
    description: 'AI risk analysis, clause library, unlimited e-signatures, version control, and renewal automation. Starts at $19/mo.',
  },
  alternates: { canonical: '/contracts' },
};

export default function ContractsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
