'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: '📄', title: 'Invoice Creation', desc: 'Generate professional branded invoices with line items, taxes, discounts, and notes. Export print-ready PDFs in seconds.' },
  { icon: '🎨', title: 'Custom Templates', desc: 'Choose from pre-built templates or design your own. Add your logo, colors, payment terms, and footer text to every invoice.' },
  { icon: '🔄', title: 'Recurring Invoices', desc: 'Set up automatic billing on weekly, monthly, quarterly, or yearly schedules. Auto-generate and send invoices without lifting a finger.' },
  { icon: '💳', title: 'Payment Tracking', desc: 'Record payments by card, bank transfer, PayPal, check, cash, or crypto. Partial payments tracked with running balance.' },
  { icon: '🌍', title: 'Multi-Currency', desc: 'Invoice clients in any currency. Set default currency per client or per project. Automatic exchange rate references.' },
  { icon: '🧮', title: 'Tax Calculations', desc: 'Configurable tax rates per client, region, or line item. Auto-calculate sales tax, VAT, or GST on every invoice.' },
  { icon: '⏰', title: 'Late Payment Reminders', desc: 'Automatic overdue detection with reminder emails at 7, 14, and 30 days past due. Never chase payments manually again.' },
  { icon: '🔗', title: 'Client Portal', desc: 'Clients view invoices, download PDFs, and track payment history through a branded self-service portal.' },
];

const FAQS = [
  { q: 'How do I create my first invoice?', a: 'Add a client, enter line items with quantities and rates, set your tax rate, and hit send. The system generates a professional PDF and emails it directly to your client. The entire process takes under two minutes.' },
  { q: 'Can I set up recurring invoices?', a: 'Yes. Choose a client, define line items, pick a frequency (weekly, monthly, quarterly, or yearly), and set a start date. Invoices are automatically generated and sent on schedule. Pause or cancel anytime.' },
  { q: 'Which currencies are supported?', a: 'All major world currencies including USD, EUR, GBP, CAD, AUD, JPY, and 50+ others. Set a default currency per client so every invoice uses the right denomination automatically.' },
  { q: 'How does payment tracking work?', a: 'When a client pays, record the payment amount, method, and reference number. The system tracks partial payments, updates the balance, and marks invoices as paid when the full amount is received.' },
  { q: 'Will clients get automatic reminders for overdue invoices?', a: 'Yes. Our daily automation checks all outstanding invoices and sends polite reminder emails at configurable intervals — typically 7, 14, and 30 days past the due date. You can customize the reminder schedule and message.' },
  { q: 'Is my financial data secure?', a: 'All data is encrypted in transit and at rest on Cloudflare infrastructure. API access requires authentication. We never share, sell, or access your financial data for any purpose other than providing the service.' },
];

const TIERS = [
  { name: 'Free', price: 0, features: ['5 clients', '10 invoices/month', 'PDF generation', 'Payment tracking', 'Email sending', 'Basic dashboard'], cta: 'Get Started Free', popular: false },
  { name: 'Pro', price: 19, features: ['Unlimited clients', 'Unlimited invoices', 'Recurring invoices', 'Multi-currency', 'Custom templates', 'Late payment reminders', 'Client portal', 'Tax calculations', 'Aging reports', 'Priority support'], cta: 'Start Free Trial', popular: true },
];

export default function InvoicePage() {
  const { isDark } = useTheme();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/services' }, { name: 'Invoicing', href: '/invoice' }]} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Login</Link>
          <Link href="/checkout?service=invoicing&tier=pro" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section data-tutorial="inv-hero" className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI-POWERED INVOICING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Send Invoices.<br />
          <span className="gradient-text">Get Paid Faster.</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Professional invoices, recurring billing, multi-currency support, and automatic late payment reminders. Everything you need to get paid on time, every time.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=invoicing&tier=pro" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Free tier available. No credit card required.</p>
      </section>

      {/* Features */}
      <section id="features" data-tutorial="inv-features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Get Paid</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section data-tutorial="inv-pricing" className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Start free. Upgrade when you need more power.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {TIERS.map((tier) => (
            <div key={tier.name} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: tier.popular ? 2 : 1 }}>
              {tier.popular && <div className="text-xs font-bold mb-3 text-center" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{tier.price === 0 ? 'Free' : `$${tier.price}`}</span>
                {tier.price > 0 && <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span>}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=invoicing&tier=${tier.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: tier.popular ? '#fff' : 'var(--ept-text)' }}>{tier.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Ready to Streamline Your Invoicing?</h2>
        <p className="mb-6 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Join thousands of businesses that get paid faster with Echo Invoicing.</p>
        <TrialCTA serviceId="echo-invoicing" tier="pro" productName="Echo Invoicing" />
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <Link href="/" style={{ color: 'var(--ept-text-secondary)' }}>Home</Link>
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/blog" style={{ color: 'var(--ept-text-secondary)' }}>Blog</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-secondary)' }}>Support</Link>
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-secondary)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-secondary)' }}>Terms</Link>
        </div>
        &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
      </footer>
    </div>
  );
}
