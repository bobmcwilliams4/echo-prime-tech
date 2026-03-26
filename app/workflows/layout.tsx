import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Workflow Automation — Echo Prime Technologies',
  description: 'Visual workflow builder with drag-and-drop steps, cron scheduling, webhook triggers, AI analysis actions, and multi-step execution. Automate any business process. Free tier available.',
  keywords: ['workflow automation', 'AI automation', 'business process automation', 'Zapier alternative', 'no-code automation', 'webhook workflows'],
  openGraph: {
    title: 'AI Workflow Automation — Echo Prime Technologies',
    description: 'Visual workflow builder with drag-and-drop steps, cron scheduling, webhook triggers, and AI analysis actions.',
    url: 'https://echo-ept.com/workflows',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Workflow Automation — Echo Prime Technologies',
    description: 'Visual workflow builder with drag-and-drop steps, cron scheduling, webhook triggers, and AI analysis actions.',
  },
  alternates: { canonical: '/workflows' },
};

export default function WorkflowsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
