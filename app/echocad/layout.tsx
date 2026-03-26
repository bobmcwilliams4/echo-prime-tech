import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EchoCAD — AI-Native Parametric CAD Engine | Echo Prime Technologies',
  description: 'Cloud-native parametric CAD engine with 20 engineering materials, 8 primitive types, stress analysis, DFM optimization, BOM generation, and OpenSCAD export. Design smarter, build faster.',
  keywords: ['CAD', 'parametric design', 'engineering materials', 'stress analysis', 'DFM', 'BOM', 'OpenSCAD', 'AI CAD', 'Echo Prime'],
  openGraph: {
    title: 'EchoCAD — AI-Native Parametric CAD Engine',
    description: 'Cloud-native parametric CAD with materials intelligence, engineering analysis, and automated manufacturing prep.',
    url: 'https://echo-ept.com/echocad',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EchoCAD — AI-Native Parametric CAD Engine',
    description: 'Cloud-native parametric CAD with materials intelligence, engineering analysis, and automated manufacturing prep.',
  },
  alternates: { canonical: '/echocad' },
};

export default function EchoCADLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
