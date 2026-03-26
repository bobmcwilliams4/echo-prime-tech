import type { Metadata } from 'next';
import OfficeAIShell from './office-ai-shell';

export const metadata: Metadata = {
  title: 'Office AI Platform | Echo Prime Technologies',
  description: 'Complete AI business operations with 22 modules: invoicing, payroll, HR, inventory, CRM, analytics, document management, and fleet tracking.',
  keywords: ['AI office', 'business automation', 'AI invoicing', 'AI payroll', 'AI CRM', 'business operations platform', 'Echo Prime'],
  openGraph: {
    title: 'Office AI Platform — Echo Prime Technologies',
    description: 'Complete AI business operations with 22 modules: invoicing, payroll, HR, inventory, CRM, analytics, and more.',
    url: 'https://echo-ept.com/office-ai',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies Office AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Office AI Platform | Echo Prime Technologies',
    description: 'Complete AI business operations with 22 modules: invoicing, payroll, HR, inventory, CRM, analytics.',
  },
  alternates: { canonical: '/office-ai' },
};

export default function OfficeAILayout({ children }: { children: React.ReactNode }) {
  return <OfficeAIShell>{children}</OfficeAIShell>;
}
