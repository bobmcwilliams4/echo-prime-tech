import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Project Management — Echo Prime Technologies',
  description: 'AI-powered project management with Kanban boards, sprint planning, time tracking, burndown charts, and AI task estimation. Free tier available. Team plan $15/month.',
  keywords: ['project management', 'AI project management', 'Kanban boards', 'Jira alternative', 'sprint planning', 'task management', 'Linear alternative'],
  openGraph: {
    title: 'AI Project Management — Echo Prime Technologies',
    description: 'AI-powered project management with Kanban boards, sprint planning, time tracking, burndown charts, and AI task estimation.',
    url: 'https://echo-ept.com/project-management',
  },
};

export default function ProjectManagementLayout({ children }: { children: React.ReactNode }) {
  return children;
}
