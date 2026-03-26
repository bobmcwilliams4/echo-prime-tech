import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Workflow Automation — AI-Powered Zapier Alternative | Echo Prime Technology',
  description: 'Automate your business with multi-step workflows connecting 18+ Echo services. Webhook triggers, scheduled runs, conditional logic, AI steps, and a visual builder. Starting at $19/month.',
  keywords: ['workflow automation', 'Zapier alternative', 'business automation', 'integrations', 'API workflows', 'no-code automation'],
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Workflow Automation — AI-Powered Zapier Alternative | Echo Prime Technology',
    description: 'Automate your business with multi-step workflows connecting 18+ Echo services. Webhook triggers, scheduled runs, conditional logic, AI steps, and a visual builder. Starting at $19/month.',
  },
  alternates: { canonical: '/workflow-automation' },
};

export default function WorkflowAutomationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
