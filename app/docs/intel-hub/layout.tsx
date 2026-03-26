import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Intel Hub Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Intel Hub — threat intelligence platform with IOC tracking, breach monitoring, geofencing alerts, and dark web surveillance integration.',
  openGraph: {
    title: 'Intel Hub Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Intel Hub — threat intelligence with IOC tracking, breach monitoring, geofencing, and dark web surveillance.',
    url: 'https://echo-ept.com/docs/intel-hub',
  },
}

export default function IntelHubDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
