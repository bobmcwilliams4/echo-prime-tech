import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Signatures — E-Signature & Document Signing | Echo Prime Technology',
  description: 'Send documents for legally binding e-signatures. Multi-signer workflows, sequential signing, branded pages, auto-reminders, audit trails, completion certificates, and bulk send. Starting at $9/mo.',
  openGraph: {
    title: 'Echo Signatures — E-Signature & Document Signing',
    description: 'Send documents for signature in minutes. Multi-signer workflows, branded signing pages, audit trails, and bulk send.',
    url: 'https://echo-ept.com/signatures',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Signatures — E-Signature & Document Signing',
    description: 'Send documents for signature in minutes. Multi-signer workflows, branded signing pages, audit trails, and bulk send.',
  },
  alternates: { canonical: '/signatures' },
};

export default function SignaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
