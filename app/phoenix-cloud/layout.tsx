import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo Phoenix Cloud — Self-Healing Infrastructure & Auto-Recovery | Echo Prime Tech',
  description: 'AI-powered infrastructure that heals itself. Automatic error detection, root cause analysis, self-repair workflows, and zero-downtime recovery for your cloud services.',
  keywords: ['self-healing infrastructure', 'auto-recovery', 'AI ops', 'incident response', 'error detection', 'cloud reliability'],
  openGraph: { title: 'Echo Phoenix Cloud — Self-Healing Infrastructure', description: 'AI infrastructure that detects errors, diagnoses root causes, and repairs itself automatically.', url: 'https://echo-ept.com/phoenix-cloud' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
