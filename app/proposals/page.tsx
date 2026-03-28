'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'A', title: 'AI Content Generation', desc: 'Describe your project and AI generates a complete proposal with executive summary, scope, timeline, and pricing — ready to customize' },
  { icon: 'T', title: 'Branded Templates', desc: 'Create reusable templates with your logo, colors, and standard sections. Clone and customize for each client in seconds' },
  { icon: 'P', title: 'Interactive Pricing Tables', desc: 'Professional pricing with line items, quantities, discounts, and tax calculations. Clients see exactly what they are paying for' },
  { icon: 'S', title: 'E-Signatures', desc: 'Clients accept proposals with a legally binding signature — drawn right in the browser. Name, IP, and timestamp recorded' },
  { icon: 'V', title: 'View Analytics', desc: 'See when clients open your proposal, how long they spend on each section, and how many times they return' },
  { icon: 'C', title: 'Client Portal', desc: 'Beautiful branded proposal pages clients can view, comment on, accept, or decline — no login required' },
  { icon: 'R', title: 'Version Control', desc: 'Revise proposals and track every version. Clients always see the latest — previous versions are archived' },
  { icon: 'B', title: 'Content Blocks', desc: 'Build a library of reusable content blocks — text, images, testimonials, timelines, FAQ sections — drag and drop into any proposal' },
  { icon: 'N', title: 'Instant Notifications', desc: 'Get emailed the moment a client accepts, declines, or comments on your proposal. Never miss a deal' },
  { icon: 'D', title: 'Win Rate Analytics', desc: 'Track proposals sent vs. accepted, average deal size, pipeline value, and win rate trends over time' },
  { icon: 'L', title: 'Client Comments', desc: 'Clients can ask questions and leave comments directly on the proposal. Negotiate without leaving the document' },
  { icon: 'X', title: 'Clone & Revise', desc: 'Clone any proposal as a starting point. Revise sent proposals with tracked version numbers. Keep your pipeline moving' },
];

const COMPARE = [
  ['Feature', 'Echo Proposals', 'PandaDoc', 'Proposify'],
  ['AI content generation', 'All plans', 'Business+', 'No'],
  ['AI pricing suggestions', 'All plans', 'No', 'No'],
  ['E-signatures', 'All plans', 'All plans', 'All plans'],
  ['View analytics', 'All plans', 'Business+', 'All plans'],
  ['Custom branding', 'All plans', 'Business+', 'All plans'],
  ['Reusable templates', 'All plans', 'All plans', 'All plans'],
  ['Content block library', 'All plans', 'Business+', 'No'],
  ['Client comments', 'All plans', 'All plans', 'Team+'],
  ['Version control', 'All plans', 'Business+', 'Team+'],
  ['Pricing tables', 'All plans', 'All plans', 'All plans'],
  ['API access', 'All plans', 'Enterprise', 'Enterprise'],
  ['Data export', 'All plans', 'Business+', 'Team+'],
  ['Starting price', '$19/mo', '$35/mo', '$29/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$19', per: '/mo', features: ['Unlimited proposals', 'AI content generation', 'AI pricing suggestions', 'E-signatures', 'View analytics', '5 templates', 'Content blocks', 'Client portal'] },
  { name: 'Growth', price: '$49', per: '/mo', features: ['Everything in Starter', 'Unlimited templates', 'Custom branding', 'Version control', 'Client comments', 'Win rate analytics', 'API access', 'Priority support'], popular: true },
  { name: 'Scale', price: '$129', per: '/mo', features: ['Everything in Growth', 'White-label', 'Custom domains', 'Webhook integrations', 'Bulk export', 'Team management', 'Dedicated support', 'SLA guarantee'] },
];

const FAQS = [
  { q: 'How does AI content generation work for proposals?', a: 'Describe your project scope, client, and deliverables, and our AI generates a complete proposal draft with executive summary, scope of work, timeline, pricing table, and terms. You customize and send in minutes instead of hours.' },
  { q: 'Are e-signatures legally binding?', a: 'Yes. Echo Proposals captures the signer\'s drawn signature, full name, IP address, and timestamp — meeting the requirements of the ESIGN Act and UETA. Every signed proposal generates a tamper-proof audit trail.' },
  { q: 'Can clients comment on proposals without creating an account?', a: 'Yes. Clients receive a unique link to their branded proposal page where they can view, comment, ask questions, or accept — no login or signup required. This reduces friction and speeds up the sales cycle.' },
  { q: 'How does view analytics help me close more deals?', a: 'You see exactly when a client opens your proposal, how long they spend on each section, and how many times they return. If a client re-reads the pricing section three times, you know it\'s time for a follow-up call.' },
  { q: 'Can I use my own branding on proposals?', a: 'Yes. Upload your logo, set your brand colors, and create reusable branded templates. Growth and Scale plans include custom domains so proposals appear under your-company.com, not ours.' },
  { q: 'How does Echo Proposals compare to PandaDoc or Proposify?', a: 'Echo Proposals includes AI content generation, AI pricing suggestions, e-signatures, view analytics, and version control on all plans starting at $19/mo. PandaDoc starts at $35/mo and locks most AI features behind Business+ tiers.' },
];

export default function ProposalsPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Proposals', href: '/proposals' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=proposals&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Proposals</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Create proposals that close. Powered by AI.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=proposals&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Create Your First Proposal</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>From Blank Page to Signed Deal in Minutes</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Most proposals take hours to create and days to close. Echo Proposals uses AI to generate professional content, builds interactive pricing tables, sends branded proposals with e-signature, and tracks every client interaction. Know the moment they open, accept, or have questions — and close faster.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>3x</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Faster proposal creation with AI-generated content</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>42%</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Higher close rates with view tracking and follow-ups</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>0</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Paper or PDF attachments — everything is interactive online</p>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything to Win More Deals</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell.startsWith('All') || cell.startsWith('Everything') || cell.startsWith('$19') || cell.startsWith('Unlimited')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=proposals&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Close More Deals?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>AI-generated proposals with e-signatures, view tracking, and interactive pricing.</p>
        <TrialCTA serviceId="echo-proposals" tier="starter" productName="Echo Proposals" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
