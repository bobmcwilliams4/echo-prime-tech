import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Management Documentation | Echo Prime Technologies',
  description: 'AI-powered Kanban boards, sprint planning, time tracking, and workload analytics for teams that ship. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['project-management', 'echo prime', 'documentation', 'api', 'guide', 'project, management'],
  openGraph: {
    title: 'Project Management Docs — Echo Prime Technologies',
    description: 'AI-powered Kanban boards, sprint planning, time tracking, and workload analytics for teams that ship.',
    url: 'https://echo-ept.com/docs/project-management',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Project Management Documentation',
    description: 'AI-powered Kanban boards, sprint planning, time tracking, and workload analytics for teams that ship.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/project-management',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
