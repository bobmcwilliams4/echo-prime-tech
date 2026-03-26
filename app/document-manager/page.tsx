'use client';

import FaqSchema from '../../components/FaqSchema';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FEATURES = [
  { icon: '📁', title: 'Folder Hierarchy', desc: 'Organize documents in nested folders with drag-and-drop. Unlimited depth, custom icons, and starred folders for quick access.' },
  { icon: '🔄', title: 'Version Control', desc: 'Every edit creates a new version. Compare diffs, restore any previous version, and see who changed what and when. Never lose work again.' },
  { icon: '👥', title: 'Real-Time Collaboration', desc: 'Multiple users editing the same document simultaneously with live cursors, presence indicators, and inline comments with threaded replies.' },
  { icon: '📝', title: 'Templates Library', desc: 'Start from 100+ professional templates — SOPs, contracts, proposals, meeting notes, and more. Create custom templates your team reuses.' },
  { icon: '🤖', title: 'AI Summarization', desc: 'One-click AI summaries of any document. Extract key points, action items, and decisions from lengthy docs in seconds.' },
  { icon: '🔒', title: 'Access Control', desc: 'Granular permissions at folder and document level. Viewer, editor, commenter, and admin roles. Share externally with password-protected links.' },
  { icon: '📊', title: 'Audit Trail', desc: 'Complete history of every view, edit, download, and share. Know exactly who accessed what and when for compliance reporting.' },
  { icon: '🔍', title: 'Full-Text Search', desc: 'Search across all documents by content, title, tag, or author. AI-powered semantic search finds relevant docs even when keywords don\'t match exactly.' },
  { icon: '🏷️', title: 'Tags & Metadata', desc: 'Tag documents with custom labels, departments, projects, or status. Filter and sort by any combination of tags for instant retrieval.' },
  { icon: '⚡', title: 'Approval Workflows', desc: 'Route documents through review and approval chains. Sequential or parallel approvals with deadline tracking and automatic reminders.' },
  { icon: '📤', title: 'Import & Export', desc: 'Import from Google Docs, Notion, Confluence, Word, and PDF. Export to PDF, DOCX, HTML, or Markdown with formatting preserved.' },
  { icon: '🔗', title: 'Integrations', desc: 'Connect with Slack, Teams, email, and 50+ tools. Auto-attach documents to projects, tickets, and conversations.' },
];

const COMPARISON = [
  { feature: 'Folder Hierarchy', echo: true, gdocs: true, notion: true, confluence: true },
  { feature: 'Version Control', echo: true, gdocs: true, notion: true, confluence: true },
  { feature: 'Real-Time Collaboration', echo: true, gdocs: true, notion: true, confluence: true },
  { feature: 'AI Summarization', echo: true, gdocs: true, notion: true, confluence: false },
  { feature: 'Granular Permissions', echo: true, gdocs: true, notion: true, confluence: true },
  { feature: 'Full-Text Search', echo: true, gdocs: true, notion: true, confluence: true },
  { feature: 'Semantic Search (AI)', echo: true, gdocs: false, notion: true, confluence: false },
  { feature: 'Approval Workflows', echo: true, gdocs: false, notion: false, confluence: true },
  { feature: 'Audit Trail', echo: true, gdocs: false, notion: true, confluence: true },
  { feature: 'Templates Library', echo: true, gdocs: true, notion: true, confluence: true },
  { feature: 'Offline Access', echo: true, gdocs: true, notion: false, confluence: false },
  { feature: 'Starting Price', echo: '$5/user', gdocs: '$6/user', notion: '$8/user', confluence: '$6/user' },
];

const TIERS = [
  { name: 'Starter', price: '$5', period: '/user/mo', desc: 'For small teams organizing documents.', features: ['Up to 25 users', '10 GB storage', 'Folder hierarchy', 'Version control', 'Real-time collaboration', 'Full-text search', 'Templates library', 'Email support'] },
  { name: 'Growth', price: '$12', period: '/user/mo', desc: 'For teams scaling with AI and workflows.', features: ['Unlimited users', '100 GB storage', 'AI summarization', 'Semantic search', 'Granular permissions', 'Approval workflows', 'Tags & metadata', 'Import/export', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$25', period: '/user/mo', desc: 'For organizations with compliance needs.', features: ['Everything in Growth', 'Unlimited storage', 'Complete audit trail', 'SSO integration', 'Advanced analytics', 'Custom branding', 'API access', 'Offline access', 'Dedicated account manager'] },
];

const FAQS = [
  { q: 'How does version control work?', a: 'Every time a document is saved, a new version is created automatically. You can view the full version history, compare any two versions side-by-side with highlighted diffs, and restore a previous version with one click. All versions are retained indefinitely on Growth and Enterprise plans.' },
  { q: 'Can multiple people edit a document at the same time?', a: 'Yes. Real-time collaboration lets multiple users edit simultaneously with live cursors showing who is editing where. Changes appear instantly for all editors. You can also leave inline comments with threaded replies and @mention teammates for feedback.' },
  { q: 'How does AI summarization work?', a: 'Click the summarize button on any document and AI generates a concise summary with key points, action items, and decisions. It works on documents of any length and supports multiple formats including meeting notes, contracts, reports, and technical specs. Available on Growth and Enterprise plans.' },
  { q: 'What file types can I import?', a: 'You can import Google Docs, Notion pages, Confluence spaces, Microsoft Word (.docx), PDF, plain text, Markdown, and HTML. Formatting, images, and tables are preserved during import. You can also drag-and-drop files directly into any folder.' },
  { q: 'How does this compare to Google Docs?', a: 'Google Docs (via Workspace at $6/user) excels at real-time editing but lacks approval workflows, audit trails, and semantic search. Echo Document Manager includes AI-powered summarization and search, document approval workflows, and compliance-grade audit trails — all starting at $5/user.' },
  { q: 'Is my data secure?', a: 'All documents are encrypted at rest (AES-256) and in transit (TLS 1.3). Granular access controls let you restrict who can view, edit, or share each document. The audit trail logs every access event for compliance. Enterprise plans include SSO, IP whitelisting, and data residency options.' },
];

export default function DocumentManagerPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'Document Manager', href: '/document-manager' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=document-manager&tier=growth" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>AI-Powered Document Management</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Organize Docs,<br /><span className="gradient-text">Find Anything</span></h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Version control, real-time collaboration, AI summarization, and approval workflows — everything your team needs to create, manage, and find documents instantly.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=document-manager&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Manage Documents</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How We Compare</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Full document management with AI, at a fraction of the cost.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th><th className="py-3 px-4 font-semibold">Google Docs</th><th className="py-3 px-4 font-semibold">Notion</th><th className="py-3 px-4 font-semibold">Confluence</th></tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.gdocs === 'boolean' ? (row.gdocs ? '✅' : '❌') : row.gdocs}</td>
                  <td className="py-3 px-4 text-center">{typeof row.notion === 'boolean' ? (row.notion ? '✅' : '❌') : row.notion}</td>
                  <td className="py-3 px-4 text-center">{typeof row.confluence === 'boolean' ? (row.confluence ? '✅' : '❌') : row.confluence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Per-User Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No contracts. No setup fees. Scale as your team grows.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <div key={i} className={`p-8 rounded-xl border ${t.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              {t.popular && <div className="text-xs font-bold uppercase mb-4 tracking-wider" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-2xl font-bold mb-1">{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold">{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.period}</span></div>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{t.desc}</p>
              <ul className="space-y-2 mb-8">
                {t.features.map((f, j) => (<li key={j} className="text-sm flex items-start gap-2"><span style={{ color: 'var(--ept-accent)' }}>✓</span><span>{f}</span></li>))}
              </ul>
              <Link href={`/checkout?service=document-manager&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Documents?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Join teams creating, collaborating, and finding documents faster with AI-powered document management.</p>
        <Link href="/checkout?service=document-manager&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </div>
  );
}
