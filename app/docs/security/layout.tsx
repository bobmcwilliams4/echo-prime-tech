import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Security Suite Documentation — Echo Prime Technologies',
  description: 'Complete documentation for Echo Security Suite — AI-powered vulnerability scanning, penetration testing, dark web monitoring, threat intelligence, and compliance automation.',
  openGraph: {
    title: 'Echo Security Suite Documentation — Echo Prime Technologies',
    description: 'AI-powered cybersecurity platform with vulnerability scanning, penetration testing, dark web monitoring, OSINT, and compliance checking.',
    url: 'https://echo-ept.com/docs/security',
  },
}

export default function SecurityDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
