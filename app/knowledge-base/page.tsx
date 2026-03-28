'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: '📚', title: 'Article Management', desc: 'Create, edit, and organize articles with categories, tags, and ordering' },
  { icon: '🤖', title: 'AI Article Writer', desc: 'Generate complete knowledge base articles from a topic using AI' },
  { icon: '✨', title: 'AI Article Improver', desc: 'Enhance existing articles for clarity, completeness, and SEO' },
  { icon: '🔍', title: 'Full-Text Search', desc: 'Fast multi-term search across all published articles' },
  { icon: '📂', title: 'Nested Categories', desc: 'Organize content with parent/child category hierarchies' },
  { icon: '📝', title: 'Version History', desc: 'Every edit creates a version — track changes and roll back anytime' },
  { icon: '👍', title: 'Reader Feedback', desc: 'Built-in "Was this helpful?" widget with optional comments' },
  { icon: '🔗', title: 'SEO-Friendly URLs', desc: 'Auto-generated slugs, meta titles, descriptions, and excerpts' },
  { icon: '⭐', title: 'Featured Articles', desc: 'Pin important articles to the top of your knowledge base' },
  { icon: '📊', title: 'Analytics', desc: 'View counts, helpfulness rates, popular articles dashboard' },
  { icon: '🌐', title: 'Public & Private', desc: 'Control article visibility — public docs or internal wiki' },
  { icon: '🏢', title: 'Multi-Tenant', desc: 'Each customer gets their own isolated knowledge base' },
];

const COMPARE = [
  ['Feature', 'Echo KB', 'Zendesk Guide', 'HelpScout'],
  ['AI Article Writer', 'Yes', 'No', 'No'],
  ['AI Article Improver', 'Yes', 'No', 'No'],
  ['Version History', 'All plans', 'Professional+', 'Plus plan'],
  ['Full-Text Search', 'Yes', 'Yes', 'Yes'],
  ['Reader Feedback', 'Built-in', 'Yes', 'Yes'],
  ['API Access', 'All plans', 'Enterprise', 'Plus plan'],
  ['Custom Domain', 'Pro+', 'Yes', 'Plus plan'],
  ['SEO Meta Tags', 'Yes', 'Yes', 'Yes'],
  ['Nested Categories', 'Yes', 'Yes', 'Limited'],
  ['Multi-Tenant', 'Yes', 'No', 'No'],
  ['Webhooks', 'Yes', 'Enterprise', 'No'],
  ['Starting Price', '$15/mo', '$49/mo', '$20/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$15', per: '/mo', features: ['100 articles', 'AI article writer', 'Full-text search', 'Reader feedback', 'Version history', 'Public access'] },
  { name: 'Pro', price: '$39', per: '/mo', features: ['500 articles', 'AI article improver', 'Custom domain', 'Analytics', 'Nested categories', 'Priority support'], popular: true },
  { name: 'Business', price: '$99', per: '/mo', features: ['Unlimited articles', 'Multi-tenant', 'White-label', 'API access', 'Webhooks', 'Dedicated support'] },
];

const FAQS = [
  { q: 'Can AI write articles for me?', a: 'Yes. Provide a topic or outline and AI generates a complete knowledge base article with proper formatting, headers, and code examples. You review, edit, and publish. Average article generated in 30 seconds.' },
  { q: 'How does search work?', a: 'Full-text search across all articles with typo tolerance, synonym matching, and relevance ranking. Instant results as you type. Search analytics show what customers are looking for — including searches with zero results (content gaps).' },
  { q: 'Can I restrict access to certain articles?', a: 'Yes. Articles can be public (anyone), authenticated (logged-in users only), or role-based (specific user groups). Mix public and private articles in the same knowledge base.' },
  { q: 'Does it integrate with live chat?', a: 'Yes. When a customer asks a question in Echo Live Chat, the AI auto-suggests relevant knowledge base articles. Agents can insert article links into conversations with one click. Reduces average handle time by 35%.' },
  { q: 'Can I customize the look?', a: 'Custom CSS, logo, colors, and domain on all plans. Choose from grid or sidebar navigation layouts. The knowledge base inherits your brand identity and feels like part of your website.' },
  { q: 'How many articles can I create?', a: 'Starter includes 100 articles, Growth includes 1,000, and Enterprise is unlimited. Articles support rich text, images, video embeds, code blocks, callouts, and file attachments.' },
];

export default function KnowledgeBasePage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Knowledge Base', href: '/knowledge-base' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Knowledge Base</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered documentation. Help customers help themselves.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=knowledge-base&tier=starter"  className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Documentation Made Simple</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && cell === 'Yes' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=knowledge-base&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Help Customers Help Themselves</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered knowledge base with article generation, full-text search, and reader feedback. Free trial, no credit card required.</p>
        <TrialCTA serviceId="echo-knowledge-base" tier="starter" productName="Echo Knowledge Base" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
