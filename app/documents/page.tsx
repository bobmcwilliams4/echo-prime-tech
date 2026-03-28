'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'F', title: 'Folder Organization', desc: 'Nested folders with color coding, path-based navigation, and drag-and-drop' },
  { icon: 'U', title: 'Secure Upload', desc: 'Upload any file type with automatic extension detection and MIME type handling' },
  { icon: 'V', title: 'Version History', desc: 'Every update creates a new version — view, compare, and restore previous versions' },
  { icon: 'S', title: 'Share Links', desc: 'Generate public share links with view/download permissions, passwords, and expiry dates' },
  { icon: 'T', title: 'Trash & Recovery', desc: 'Deleted files go to trash with 30-day auto-purge — restore anytime before then' },
  { icon: 'C', title: 'File Comments', desc: 'Threaded comments on any file — discuss changes, leave feedback, and collaborate' },
  { icon: 'R', title: 'R2 Cloud Storage', desc: 'Files stored on Cloudflare R2 — fast global access, zero egress fees' },
  { icon: 'A', title: 'AI Summarization', desc: 'Auto-summarize documents into bullet points using AI engines' },
  { icon: 'G', title: 'Auto-Tagging', desc: 'AI suggests relevant tags based on file name, type, and content' },
  { icon: 'Q', title: 'Storage Quotas', desc: 'Per-tenant storage limits with real-time usage tracking and alerts' },
  { icon: 'D', title: 'Download Limits', desc: 'Set max downloads on share links — perfect for paid content or time-limited access' },
  { icon: 'P', title: 'Full API', desc: 'REST API for every operation — integrate with any app or workflow automation' },
];

const COMPARE = [
  ['Feature', 'Echo Docs', 'Google Drive', 'Dropbox'],
  ['Cloud storage', 'R2 (zero egress)', 'Google Cloud', 'AWS S3'],
  ['Version history', 'All plans', '30 days', 'Plus+'],
  ['Share links', 'Yes (with limits)', 'Yes', 'Yes'],
  ['Password-protected shares', 'Yes', 'No', 'Professional'],
  ['Download limits on shares', 'Yes', 'No', 'No'],
  ['File comments', 'Yes', 'Yes', 'Yes'],
  ['AI summarization', 'Built-in', 'No', 'No'],
  ['AI auto-tagging', 'Built-in', 'No', 'No'],
  ['Trash recovery', '30 days', '30 days', '120 days'],
  ['API access', 'All plans', 'Yes', 'Business+'],
  ['Multi-tenant', 'Yes', 'No', 'No'],
  ['Starting price', '$12/mo', 'Free/100MB', '$11.99/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$12', per: '/mo', features: ['5 GB storage', '5,000 files', 'Version history', 'Share links', 'File comments', 'Folder organization'] },
  { name: 'Pro', price: '$29', per: '/mo', features: ['50 GB storage', '50,000 files', 'AI summarization', 'AI auto-tagging', 'Password-protected shares', 'Priority support'], popular: true },
  { name: 'Business', price: '$79', per: '/mo', features: ['500 GB storage', 'Unlimited files', 'Download limits on shares', 'Multi-tenant', 'Full API access', 'Dedicated support'] },
];

const FAQS = [
  { q: 'How much storage do I get?', a: 'Starter includes 5 GB, Growth includes 50 GB, and Enterprise includes 500 GB. All storage runs on Cloudflare R2 with global edge distribution — no egress fees regardless of how much you download.' },
  { q: 'Can I share files externally?', a: 'Yes. Generate public sharing links with optional password protection and expiration dates. Track who accessed shared links with view counts and timestamps.' },
  { q: 'How does version history work?', a: 'Every file upload creates a new version. See the complete history, compare versions, and restore any previous version with one click. Version history is unlimited on Growth and Enterprise plans.' },
  { q: 'Can AI summarize my documents?', a: 'Yes. Upload any PDF, DOCX, or text file and get an AI-generated summary, key points extraction, and content classification. Summaries are searchable alongside the original document.' },
  { q: 'What file types are supported?', a: 'All file types are supported for storage and sharing. Preview is available for PDF, images (PNG, JPG, SVG), text files, Markdown, CSV, and common document formats. Other types download directly.' },
  { q: 'Is there an API?', a: 'Yes. Full REST API for programmatic file upload, download, search, and management. Use it to integrate document storage into any application or workflow.' },
];

export default function DocumentsPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Documents', href: '/documents' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Document Manager</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Upload. Organize. Share. AI-powered cloud file management.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=documents&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>File Management Made Simple</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Yes' || cell.startsWith('Built') || cell.startsWith('All') || cell.startsWith('R2')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=documents&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
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
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--ept-text)' }}>Ready to Organize Your Documents?</h2>
        <p className="text-center mb-6" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered document management with cloud storage. No credit card required.</p>
        <TrialCTA serviceId="echo-documents" tier="starter" productName="Echo Documents" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
