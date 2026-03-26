import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Drive Intelligence — AI File System Analysis | Echo Prime Tech',
  description: 'AI-powered file system analysis, duplicate detection, smart categorization, storage optimization, and compliance scanning. Turn unstructured drives into organized intelligence.',
  keywords: ['file analysis', 'drive intelligence', 'duplicate detection', 'storage optimization', 'ai file management', 'data organization', 'echo prime'],
  openGraph: {
    title: 'Echo Drive Intelligence — AI File System Analysis',
    description: 'AI-powered file analysis, duplicate detection, smart categorization, and storage optimization.',
    url: 'https://echo-ept.com/drive-intelligence',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Drive Intelligence — AI File System Analysis',
    description: 'Turn unstructured drives into organized intelligence with AI.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/drive-intelligence',
  },
}

export default function DriveIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return children
}
