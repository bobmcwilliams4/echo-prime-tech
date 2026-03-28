'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import FaqSchema from '@/components/FaqSchema';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'S', title: 'Draw-to-Sign', desc: 'Signers draw their signature on an HTML5 Canvas right in the browser. Touch-optimized for mobile. Legally binding with IP and timestamp audit.' },
  { icon: 'M', title: 'Multi-Signer Workflows', desc: 'Add unlimited signers with roles — signer, approver, viewer, or CC. Set signing order for sequential workflows or send to all at once.' },
  { icon: 'B', title: 'Branded Signing Pages', desc: 'Custom logo, brand colors, and messaging on every signing page. Your brand, your experience — no third-party branding.' },
  { icon: 'T', title: 'Reusable Templates', desc: 'Create templates with pre-configured fields and signer roles. Clone for every new document. Bulk send to 50 recipients at once.' },
  { icon: 'F', title: 'Field Types', desc: 'Signature, initials, text input, date picker, checkbox, dropdown, and attachment fields. Assign fields to specific signers.' },
  { icon: 'A', title: 'Audit Trail & Certificates', desc: 'Every action recorded — created, sent, viewed, signed, declined. IP addresses and timestamps. Downloadable completion certificates.' },
  { icon: 'R', title: 'Auto-Reminders', desc: 'Automatic email reminders for unsigned documents. Configurable reminder intervals. Manual remind-all with one click.' },
  { icon: 'E', title: 'Expiration & Voiding', desc: 'Set document expiration dates. Void sent documents with a reason. Expired documents auto-update status via daily cron.' },
  { icon: 'N', title: 'Instant Notifications', desc: 'Email notifications when documents are sent, viewed, signed, or declined. Owner notified the moment all signatures are collected.' },
  { icon: 'C', title: 'Contact Management', desc: 'Automatic contact book built from signer data. Track total documents and last signed date per contact.' },
  { icon: 'D', title: 'Analytics Dashboard', desc: 'Track envelopes created, sent, completed, declined, and expired. Signature collection rates and trend analytics.' },
  { icon: 'X', title: 'Decline with Reason', desc: 'Signers can decline with an optional reason. Owner is notified immediately. Full decline audit trail recorded.' },
];

const COMPARE = [
  ['Feature', 'Echo Signatures', 'DocuSign', 'HelloSign', 'PandaDoc'],
  ['Draw-to-sign', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Multi-signer workflows', 'All plans', 'Standard+', 'All plans', 'Business+'],
  ['Sequential signing', 'All plans', 'Standard+', 'Standard+', 'Business+'],
  ['Branded signing pages', 'All plans', 'Business+', 'Standard+', 'Business+'],
  ['Reusable templates', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Auto-reminders', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Audit trail', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Completion certificates', 'All plans', 'All plans', 'Standard+', 'No'],
  ['Bulk send', 'All plans', 'Business+', 'Standard+', 'Business+'],
  ['Contact management', 'All plans', 'Standard+', 'No', 'All plans'],
  ['Custom fields', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['API access', 'All plans', 'Business+', 'Standard+', 'Business+'],
  ['Void documents', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Starting price', '$9/mo', '$25/mo', '$20/mo', '$35/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$9', per: '/mo', features: ['50 envelopes/mo', 'Unlimited signers', 'Draw-to-sign', 'Sequential signing', 'Auto-reminders', 'Audit trail', 'Branded pages', 'API access'] },
  { name: 'Growth', price: '$29', per: '/mo', features: ['Everything in Starter', '500 envelopes/mo', 'Reusable templates', 'Bulk send (50/batch)', 'Completion certificates', 'Contact management', 'Custom branding', 'Priority support'], popular: true },
  { name: 'Scale', price: '$79', per: '/mo', features: ['Everything in Growth', 'Unlimited envelopes', 'White-label', 'Custom domains', 'Webhook integrations', 'Team management', 'Dedicated support', 'SLA guarantee'] },
];

export default function SignaturesPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Digital Signatures', href: '/signatures' }]} />
      <FaqSchema faqs={[
        { q: 'Are these signatures legally binding?', a: 'Yes. Echo Signatures creates legally binding electronic signatures that comply with the ESIGN Act and UETA. Every signature includes a full audit trail with signer name, email, IP address, timestamp, and user agent.' },
        { q: 'How does sequential signing work?', a: 'When sequential mode is enabled, signers receive the document one at a time in the order you specify. The next signer is only notified after the previous one signs.' },
        { q: 'Can I send to multiple signers at once?', a: 'Yes. Add as many signers as you need with roles (signer, approver, viewer, CC). In parallel mode, all signers receive the document simultaneously.' },
        { q: 'What happens when all signers complete?', a: 'You receive an email notification. The envelope status changes to completed. A completion certificate is generated with the full audit trail.' },
        { q: 'How do reminders work?', a: 'Set a reminder interval (default 3 days). The system automatically emails unsigned signers when the interval passes. You can also manually trigger reminders.' },
        { q: 'Can signers decline?', a: 'Yes. Signers can decline with an optional reason. You are notified immediately, and the full decline is recorded in the audit trail.' },
      ]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=signatures&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Signatures</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Get documents signed in minutes, not days.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=signatures&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Send Your First Document</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Legally Binding E-Signatures for $9/month</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>DocuSign charges $25/month for basic e-signatures. Echo Signatures gives you multi-signer workflows, sequential signing, branded pages, auto-reminders, audit trails, and bulk send — starting at $9/month. No per-document fees. No hidden costs.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>64%</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Cheaper than DocuSign ($9 vs $25/mo)</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>2min</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Average time from send to signed</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>0</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Per-document fees on any plan</p>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Get Signed</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              {COMPARE[0].map((h, i) => <th key={i} className="px-4 py-3 text-left font-bold" style={{ color: 'var(--ept-text)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {COMPARE.slice(1).map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--ept-border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell.startsWith('All') || cell.startsWith('$9')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: t.popular ? 2 : 1 }}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.per}</span></div>
              <ul className="space-y-2 mb-6">{t.features.map((f) => <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=signatures&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Are these signatures legally binding?', a: 'Yes. Echo Signatures creates legally binding electronic signatures that comply with the ESIGN Act and UETA. Every signature includes a full audit trail with signer name, email, IP address, timestamp, and user agent.' },
            { q: 'How does sequential signing work?', a: 'When sequential mode is enabled, signers receive the document one at a time in the order you specify. The next signer is only notified after the previous one signs. This is ideal for approval chains.' },
            { q: 'Can I send to multiple signers at once?', a: 'Yes. Add as many signers as you need with roles (signer, approver, viewer, CC). In parallel mode, all signers receive the document simultaneously. In sequential mode, they sign in order.' },
            { q: 'What happens when all signers complete?', a: 'You receive an email notification. The envelope status changes to "completed." A completion certificate is generated with the full audit trail. All parties can download the certificate.' },
            { q: 'How do reminders work?', a: 'You set a reminder interval (default 3 days). The system automatically emails unsigned signers when the interval passes. You can also manually trigger reminders for all pending signers with one click.' },
            { q: 'Can signers decline?', a: 'Yes. Signers can decline with an optional reason. You are notified immediately, and the envelope status changes to "declined." The full decline is recorded in the audit trail.' },
          ].map((item) => (
            <details key={item.q} className="p-4 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center" style={{ color: 'var(--ept-text)' }}>{item.q}<span className="text-lg" style={{ color: 'var(--ept-text-muted)' }}>+</span></summary>
              <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Get Documents Signed?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Legally binding e-signatures with audit trails, auto-reminders, and branded pages.</p>
        <TrialCTA serviceId="echo-signatures" tier="starter" productName="Echo Signatures" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
