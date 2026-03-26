import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Project Manager — AI-Powered Project Management | Echo Prime Technologies',
  description: 'AI-powered project management with Kanban boards, sprint planning, task estimation, time tracking, and team analytics. Built on Cloudflare Workers.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
