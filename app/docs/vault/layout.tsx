import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Vault Documentation | Echo Prime Technologies',
  description: 'Encrypted credential management — secure storage, rotation, and runtime access for 1,527+ API keys, tokens, and secrets. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['vault', 'echo prime', 'documentation', 'api', 'guide', 'vault'],
  openGraph: {
    title: 'Echo Vault Docs — Echo Prime Technologies',
    description: 'Encrypted credential management — secure storage, rotation, and runtime access for 1,527+ API keys, tokens, and secrets.',
    url: 'https://echo-ept.com/docs/vault',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Vault Documentation',
    description: 'Encrypted credential management — secure storage, rotation, and runtime access for 1,527+ API keys, tokens, and secrets.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/vault',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
