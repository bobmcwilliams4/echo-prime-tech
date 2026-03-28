'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

/* ==============================================================================
   ECHO DOCUMENT DELIVERY — Universal Print/PDF/Email/SMS Document Pipeline
   Backend: echo-document-delivery.bmcii1976.workers.dev (7 endpoints, 1 D1 table, R2, v1.0)
   ============================================================================== */

const FEATURES = [
  { title: 'Branded HTML Documents', desc: 'Generate self-contained HTML documents with your company logo, colors, and contact information. Invoices, estimates, receipts, and custom reports — all fully branded.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Client-Side PDF Generation', desc: 'One-click PDF export via html2pdf.js. No server-side rendering required — zero compute cost. Print-optimized CSS ensures professional output every time.', icon: 'M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z' },
  { title: 'Email Delivery via Resend', desc: 'Send documents directly to clients via email. Resend API integration with delivery tracking, open detection, and branded email templates.', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
  { title: 'SMS Delivery via Twilio', desc: 'Send document links via SMS to clients who prefer mobile. Twilio integration with delivery confirmation and link shortening.', icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3' },
  { title: 'Token-Based Public Viewing', desc: 'Every document gets a unique access token. Share with clients via URL — no login required. View counts tracked automatically.', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.813a4.5 4.5 0 00-6.364-6.364L4.5 8.688a4.5 4.5 0 006.364 6.364l4.5-4.5' },
  { title: 'R2 Cloud Storage', desc: 'All documents stored in Cloudflare R2 organized by tenant/year/month/type. Instant retrieval, zero egress fees, and automatic lifecycle management.', icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z' },
  { title: 'Company Branding Settings', desc: 'Configure your company name, logo URL, address, phone, email, and accent color via D1 settings. No code changes needed — update branding at any time.', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
  { title: 'Delivery History & Tracking', desc: 'Full audit trail of every document generated, viewed, emailed, or SMS-sent. Filter by type, date, and delivery channel. Export for compliance.', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
];

const COMPARISON = [
  { feature: 'HTML document generation', echo: true, docusign: false, pandadoc: false, stripe: 'Invoices only' },
  { feature: 'Client-side PDF (zero cost)', echo: true, docusign: false, pandadoc: false, stripe: false },
  { feature: 'Email delivery', echo: true, docusign: true, pandadoc: true, stripe: true },
  { feature: 'SMS delivery', echo: true, docusign: false, pandadoc: false, stripe: false },
  { feature: 'Token-based public viewing', echo: true, docusign: true, pandadoc: true, stripe: 'Link only' },
  { feature: 'Custom company branding', echo: true, docusign: 'Enterprise', pandadoc: true, stripe: 'Limited' },
  { feature: 'R2 cloud storage', echo: true, docusign: 'Own cloud', pandadoc: 'Own cloud', stripe: false },
  { feature: 'View tracking', echo: true, docusign: true, pandadoc: true, stripe: false },
  { feature: 'API access', echo: '7 endpoints', docusign: 'Enterprise', pandadoc: 'All plans', stripe: 'Full API' },
  { feature: 'Monthly cost', echo: '$19', docusign: '$25+', pandadoc: '$35+', stripe: '2.9% + $0.30' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    desc: 'For small businesses and freelancers',
    features: ['100 documents/month', 'PDF generation', 'Email delivery', 'Token-based sharing', 'View tracking', 'Company branding'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Business',
    price: '$59',
    period: '/mo',
    desc: 'Full document delivery suite',
    features: ['1,000 documents/month', 'PDF + Email + SMS delivery', 'Custom branding', 'R2 cloud storage', 'Delivery history', 'API access (7 endpoints)', 'Bulk generation', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/mo',
    desc: 'High-volume document operations',
    features: ['Unlimited documents', 'Everything in Business', 'White-label documents', 'Custom templates', 'Webhook notifications', 'Multi-tenant support', 'Dedicated support', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQS = [
  { q: 'How does PDF generation work without a server?', a: 'We use html2pdf.js for client-side rendering. The browser converts the branded HTML document to PDF locally — zero server compute cost, instant generation, and your data never leaves the client for PDF conversion.' },
  { q: 'What email provider do you use?', a: 'Resend — a modern email API built for developers. 100 emails/day on the free tier, with delivery tracking, open detection, and high deliverability. Your documents arrive in inboxes, not spam folders.' },
  { q: 'Can I customize the document template?', a: 'Yes. Company branding (name, logo, address, phone, email, accent color) is configurable via settings API. The document template is a self-contained HTML file with print-optimized CSS. Enterprise plans support fully custom templates.' },
  { q: 'How does token-based sharing work?', a: 'Every generated document gets a unique URL with an access token. Share the URL with your client — they can view the full document without logging in. View counts are tracked automatically for your records.' },
  { q: 'Where are documents stored?', a: 'Cloudflare R2 with organized paths: tenant/year/month/type/. Zero egress fees, global edge distribution, and automatic lifecycle management. Documents are retrievable instantly via their unique slug.' },
  { q: 'Can I send documents via SMS?', a: 'Yes. Twilio integration sends a short link to the document via SMS. The recipient taps the link to view the branded document in their mobile browser. Delivery confirmation is tracked.' },
];

export default function DocumentDeliveryPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Document Delivery', href: '/document-delivery' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/sdk" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>SDK</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>7 API Endpoints</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>4 Delivery Channels</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>R2 Storage</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Zero-Cost PDF</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">
          <span className="gradient-text">Document Delivery</span><br />Print. PDF. Email. SMS.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
          Generate branded invoices, estimates, and reports. Deliver via PDF download, email, or SMS. Token-based sharing with view tracking. All stored in Cloudflare R2.
        </p>
        <div className="flex gap-4 justify-center animate-fade-up-delay-2">
          <Link href="/checkout?service=document-delivery&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/sdk/docs" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>API Docs</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Delivery Channels', value: '4' },
            { label: 'API Endpoints', value: '7' },
            { label: 'PDF Cost', value: '$0' },
            { label: 'Storage', value: 'R2' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Every Way to Deliver a Document</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(13,115,119,0.1)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `2px solid var(--ept-border)` }}>
                <th className="text-left p-3" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                <th className="text-center p-3 font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Docs</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>DocuSign</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>PandaDoc</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Stripe</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid var(--ept-border)` }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.docusign, row.pandadoc, row.stripe].map((val, j) => (
                    <td key={j} className="text-center p-3">
                      {val === true ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : val === false ? <span style={{ color: 'var(--ept-text-muted)' }}>&#10007;</span> : <span style={{ color: 'var(--ept-text-muted)' }}>{val}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING.map((p) => (
            <div key={p.name} className={`p-8 rounded-2xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              {p.popular && <div className="text-xs font-bold mb-4 px-3 py-1 rounded-full inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{p.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=document-delivery&tier=${p.name.toLowerCase()}`} className="block text-center w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-text)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button className="w-full text-left p-5 flex justify-between items-center" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{faq.q}</span>
                <span style={{ color: 'var(--ept-text-muted)' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <div className="px-5 pb-5 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Documents That Deliver Themselves</h2>
        <p className="text-lg mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Print, PDF, email, SMS — one API for every delivery channel. Zero-cost PDF generation. Professional branding.</p>
        <TrialCTA serviceId="echo-document-delivery" tier="starter" productName="Echo Document Delivery" />
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-muted)' }}>Support</Link>
        </div>
      </footer>
    </div>
  );
}
