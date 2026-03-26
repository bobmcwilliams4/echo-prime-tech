import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Project Manager — AI-Powered Project Management | Echo Prime Technologies',
  description: 'AI-powered project management with Kanban boards, sprint planning, task estimation, time tracking, and team analytics. Built on Cloudflare Workers.',
  openGraph: {
    title: 'Echo Project Manager — AI-Powered Project Management',
    description: 'AI-powered project management with Kanban boards, sprint planning, Gantt charts, resource allocation, and team analytics.',
    url: 'https://echo-ept.com/project-manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Project Manager — AI-Powered Project Management',
    description: 'AI-powered project management with Kanban boards, sprint planning, Gantt charts, resource allocation, and team analytics.',
  },
  alternates: { canonical: '/project-manager' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
