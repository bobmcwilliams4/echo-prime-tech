import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EchoCAD Documentation — User Manual & AI Guide | Echo Prime Tech',
  description: 'Complete documentation for EchoCAD — AI-powered CAD automation for engineering drawings, parametric modeling, BOM generation, and DXF/DWG/STEP file processing.',
  openGraph: {
    title: 'EchoCAD Documentation — User Manual & AI Guide | Echo Prime Tech',
    description: 'Complete documentation for EchoCAD — AI-powered CAD automation, parametric modeling, BOM generation, and engineering drawing processing.',
    url: 'https://echo-ept.com/docs/echocad',
  },
}

export default function EchocadDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
