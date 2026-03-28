'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FAQS = [
  { q: 'What is Echo Business Manager?', a: 'Echo Business Manager is now Echo Office AI — a complete AI-powered business operations platform with 22 modules including phone systems, invoicing, CRM, employee management, bookings, and analytics all in one place.' },
  { q: 'How many businesses can I manage from one account?', a: 'Starter supports 1 business, Professional supports 3, and Enterprise offers unlimited businesses. Each business gets its own dashboard, phone lines, analytics, and customer data — fully isolated.' },
  { q: 'Does it include AI phone answering?', a: 'Yes. Every plan includes AI phone answering that greets callers, takes messages, routes calls, and transcribes voicemails. Professional and Enterprise plans add full conversational AI with outbound calling capabilities.' },
  { q: 'Can I replace my current invoicing and booking software?', a: 'Absolutely. Echo Office AI includes invoicing with payment tracking, online booking with calendar sync, and expense management — eliminating the need for separate subscriptions to QuickBooks, Calendly, or similar tools.' },
  { q: 'Is there employee management built in?', a: 'Yes. Professional and Enterprise plans include employee profiles, timesheets, scheduling, and performance tracking. Enterprise adds payroll integration and employee reviews.' },
  { q: 'How does pricing compare to buying separate tools?', a: 'Most businesses pay $200-500/mo for separate phone, invoicing, booking, and CRM tools. Echo Office AI starts at $49/mo for all of them integrated under one AI-powered platform — saving 60-80% on average.' },
];

export default function BusinessManagerRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/office-ai');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Echo Business Manager - Echo Prime Technologies</h1>
          <p>Echo Business Manager is now Echo Office AI — a complete AI-powered business operations platform with 22 modules including phone systems, invoicing, CRM, employee management, bookings, and analytics. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Business Manager', href: '/business-manager' }]} />
      <FaqSchema faqs={FAQS} />
      <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Redirecting to Echo Office AI...</p>

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
