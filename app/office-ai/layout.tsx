import type { Metadata } from 'next';
import OfficeAIShell from './office-ai-shell';

export const metadata: Metadata = {
  title: 'AI Office Assistant | Echo Prime Technologies',
  description: 'Complete AI-powered business operations platform — payroll, invoicing, inventory, CRM, analytics, and more.',
};

export default function OfficeAILayout({ children }: { children: React.ReactNode }) {
  return <OfficeAIShell>{children}</OfficeAIShell>;
}
