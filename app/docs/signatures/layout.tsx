import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Signatures Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Signatures — legally binding e-signature platform with multi-signer workflows, HTML5 Canvas signing, branded signing pages, bulk send, completion certificates, and full audit trails.',
  openGraph: {
    title: 'Echo Signatures Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Signatures — legally binding e-signature platform with multi-signer workflows, HTML5 Canvas signing, branded signing pages, bulk send, and completion certificates.',
    url: 'https://echo-ept.com/docs/signatures',
  },
}

export default function SignaturesDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
