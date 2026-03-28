import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Workflow Automation Documentation — Visual Process Builder with AI',
  description: '200+ triggers, AI decision nodes, cross-product orchestration, human-in-the-loop approval, and durable execution. Automate any business process with visual workflows.',
  keywords: ['workflow automation', 'business process automation', 'AI workflows', 'visual workflow builder', 'no-code automation', 'enterprise automation'],
  openGraph: {
    title: 'Echo Workflow Automation Documentation',
    description: '200+ triggers, AI decision nodes, and durable execution. Automate any business process with visual workflows.',
    url: 'https://echo-ept.com/docs/workflow-automation',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Workflow Automation — Visual AI Process Builder',
    description: '200+ triggers, AI decision nodes, human-in-the-loop approval, and cross-product orchestration.',
  },
  alternates: { canonical: '/docs/workflow-automation' },
};

export default function WorkflowAutomationDocLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
