import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Immortality Vault Documentation — User Manual & AI Guide | Echo Prime Tech',
  description: 'Complete documentation for Echo Immortality Vault — digital legacy preservation with voice cloning, personality capture, memory archiving, and interactive AI avatar creation.',
  openGraph: {
    title: 'Immortality Vault Documentation — User Manual & AI Guide | Echo Prime Tech',
    description: 'Complete documentation for Echo Immortality Vault — digital legacy preservation, voice cloning, personality capture, and interactive AI avatar creation.',
    url: 'https://echo-ept.com/docs/immortality-vault',
  },
}

export default function ImmortalityVaultDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
