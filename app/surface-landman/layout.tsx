import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Surface Landman — AI-Powered Surface Rights Acquisition | Echo Prime Technologies',
  description: 'AI-powered surface landman platform for ROW acquisition, easement tracking, chain of title with AI gap detection, AI outbound calling, document generation, and field landman dispatch. Built for transmission line corridors, utility easements, and pipeline ROW projects.',
  keywords: [
    'surface landman',
    'ROW acquisition',
    'right of way',
    'easement tracking',
    'surface rights',
    'transmission line corridor',
    'utility easement',
    'chain of title',
    'landowner outreach',
    'AI landman',
    'surface rights acquisition',
    'pipeline ROW',
    'field landman dispatch',
    'AI document generation',
    'easement deed',
    'ROW agreement',
    'title opinion',
    'damage assessment',
  ],
  openGraph: {
    title: 'Echo Surface Landman — AI-Powered Surface Rights Acquisition',
    description: 'Manage ROW projects, track easements, run chain of title with AI gap detection, auto-generate documents, and deploy AI calling agents for landowner outreach. Built for transmission lines, utility corridors, and pipeline ROW.',
    url: 'https://echo-ept.com/surface-landman',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Surface Landman' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Surface Landman — AI Surface Rights Acquisition',
    description: 'ROW management, easement tracking, chain of title, AI calling, document generation. The complete surface landman platform.',
  },
  alternates: { canonical: '/surface-landman' },
};

export default function SurfaceLandmanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
