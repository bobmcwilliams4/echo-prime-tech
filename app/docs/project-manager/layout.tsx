import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Project Manager Documentation | Echo Prime Technologies',
  description: 'AI-powered project management — Kanban boards, sprint planning, time tracking, milestones, and velocity analytics. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['project-manager', 'echo prime', 'documentation', 'api', 'guide', 'project, manager'],
  openGraph: {
    title: 'Echo Project Manager Docs — Echo Prime Technologies',
    description: 'AI-powered project management — Kanban boards, sprint planning, time tracking, milestones, and velocity analytics.',
    url: 'https://echo-ept.com/docs/project-manager',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Project Manager Documentation',
    description: 'AI-powered project management — Kanban boards, sprint planning, time tracking, milestones, and velocity analytics.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/project-manager',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
