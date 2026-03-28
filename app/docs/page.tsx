'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTheme } from '@/lib/theme-context'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { q: 'Are the docs free?', a: 'Yes. All documentation, user manuals, and API references are freely available. No account required to browse.' },
  { q: 'How do interactive tutorials work?', a: 'Click the ? button on any product page to start a guided walkthrough. An overlay highlights each UI element while explaining what it does. 75+ tutorials cover every product.' },
  { q: 'Can I access API docs without a subscription?', a: 'API reference documentation is public. To make API calls you need an API key, available on the free tier (100 calls/day) or paid plans.' },
  { q: 'How often are docs updated?', a: 'Documentation is auto-generated and updated with every product release. API references are generated from OpenAPI specs.' },
  { q: 'Where can I get help if docs don\'t answer my question?', a: 'Use the Sentinel AI chat on any page for instant answers backed by our engine knowledge base. For human support, email support@echo-ept.com.' },
]

interface DocCategory {
  title: string
  icon: string
  desc: string
  items: { name: string; href: string; badge?: string }[]
}

const categories: DocCategory[] = [
  {
    title: 'Getting Started',
    icon: '🚀',
    desc: 'New to Echo Prime? Start here.',
    items: [
      { name: 'Platform Overview', href: '/about' },
      { name: 'Quick Start Guide', href: '/sdk/quickstart', badge: 'Popular' },
      { name: 'Pricing & Plans', href: '/pricing' },
      { name: 'Free Tier Guide', href: '/free' },
      { name: 'API Authentication', href: '/docs/sdk', badge: 'Docs' },
    ],
  },
  {
    title: 'AI Intelligence',
    icon: '🧠',
    desc: 'Engine-backed intelligence products.',
    items: [
      { name: 'Sentinel AI', href: '/docs/sentinel', badge: 'Docs' },
      { name: 'Intelligence Engines', href: '/docs/engines', badge: 'Docs' },
      { name: 'Knowledge Forge', href: '/knowledge' },
      { name: 'Knowledge Scout', href: '/docs/knowledge-scout', badge: 'Docs' },
      { name: 'Graph RAG', href: '/docs/graph-rag', badge: 'Docs' },
      { name: 'Forge Marketplace', href: '/docs/forge-marketplace', badge: 'Docs' },
      { name: 'Agentic Engine', href: '/agentic-engine' },
    ],
  },
  {
    title: 'Business Suite',
    icon: '💼',
    desc: 'CRM, invoicing, HR, and operations.',
    items: [
      { name: 'CRM', href: '/docs/crm', badge: 'Docs' },
      { name: 'Invoicing', href: '/docs/invoice', badge: 'Docs' },
      { name: 'Office AI', href: '/docs/office-ai', badge: 'Docs' },
      { name: 'Booking', href: '/docs/booking', badge: 'Docs' },
      { name: 'Expense Tracking', href: '/docs/expense', badge: 'Docs' },
      { name: 'Finance AI', href: '/docs/finance-ai', badge: 'Docs' },
      { name: 'HR Management', href: '/docs/hr', badge: 'Docs' },
      { name: 'Project Management', href: '/project-manager' },
      { name: 'Payroll', href: '/docs/payroll', badge: 'Docs' },
      { name: 'Contracts', href: '/docs/contracts', badge: 'Docs' },
      { name: 'Proposals', href: '/docs/proposals', badge: 'Docs' },
      { name: 'Compliance', href: '/docs/compliance', badge: 'Docs' },
      { name: 'Recruiting', href: '/docs/recruiting', badge: 'Docs' },
      { name: 'Calendar', href: '/docs/calendar', badge: 'Docs' },
      { name: 'Affiliate', href: '/docs/affiliate', badge: 'Docs' },
      { name: 'Inventory', href: '/docs/inventory', badge: 'Docs' },
      { name: 'Timesheet', href: '/docs/timesheet', badge: 'Docs' },
      { name: 'OKR Tracking', href: '/docs/okr', badge: 'Docs' },
    ],
  },
  {
    title: 'Marketing & Sales',
    icon: '📈',
    desc: 'Grow revenue with AI-powered tools.',
    items: [
      { name: 'Closer AI Sales', href: '/docs/closer', badge: 'Docs' },
      { name: 'A/B Testing', href: '/docs/ab-testing', badge: 'Docs' },
      { name: 'Email Marketing', href: '/docs/email-marketing', badge: 'Docs' },
      { name: 'Social Media', href: '/docs/social-media', badge: 'Docs' },
      { name: 'Live Chat', href: '/docs/live-chat', badge: 'Docs' },
      { name: 'Signatures', href: '/docs/signatures', badge: 'Docs' },
      { name: 'Newsletter', href: '/docs/newsletter', badge: 'Docs' },
      { name: 'Surveys', href: '/docs/surveys', badge: 'Docs' },
      { name: 'Forms', href: '/docs/forms', badge: 'Docs' },
      { name: 'LMS / Courses', href: '/docs/lms', badge: 'Docs' },
      { name: 'Feedback Board', href: '/docs/feedback-board', badge: 'Docs' },
      { name: 'Link Shortener', href: '/docs/link-shortener', badge: 'Docs' },
      { name: 'Waitlist', href: '/docs/waitlist', badge: 'Docs' },
      { name: 'Web Analytics', href: '/docs/web-analytics', badge: 'Docs' },
      { name: 'Reviews', href: '/docs/reviews', badge: 'Docs' },
    ],
  },
  {
    title: 'Communication',
    icon: '💬',
    desc: 'Bots, voice, and messaging.',
    items: [
      { name: 'Bot Fleet', href: '/docs/bots', badge: 'Docs' },
      { name: 'Bot Factory', href: '/docs/bot-factory', badge: 'Docs' },
      { name: 'Voice AI / TTS', href: '/docs/voice', badge: 'Docs' },
      { name: 'Telegram Bot', href: '/docs/telegram-bot', badge: 'Docs' },
      { name: 'WhatsApp Bot', href: '/docs/whatsapp-bot', badge: 'Docs' },
      { name: 'LinkedIn Bot', href: '/linkedin' },
      { name: 'X/Twitter Bot', href: '/x-bot' },
      { name: 'Speak Cloud', href: '/speak-cloud' },
      { name: 'Email Sender', href: '/docs/email-sender', badge: 'Docs' },
    ],
  },
  {
    title: 'Security & Intel',
    icon: '🔒',
    desc: 'Cybersecurity and intelligence.',
    items: [
      { name: 'Security Suite', href: '/docs/security', badge: 'Docs' },
      { name: 'Dark Web Intel', href: '/docs/dark-web-intel', badge: 'Docs' },
      { name: 'Pentesting', href: '/docs/pentesting', badge: 'Docs' },
      { name: 'Surveillance', href: '/docs/surveillance', badge: 'Docs' },
      { name: 'Prometheus AI', href: '/docs/prometheus-ai', badge: 'Docs' },
      { name: 'Intel Hub', href: '/docs/intel-hub', badge: 'Docs' },
      { name: 'Scanner', href: '/docs/scanner', badge: 'Docs' },
      { name: 'Vault', href: '/vault' },
    ],
  },
  {
    title: 'Industry Solutions',
    icon: '🏭',
    desc: 'Oil & gas, tax, legal, and more.',
    items: [
      { name: 'Permian Basin Intel', href: '/permian', badge: 'Flagship' },
      { name: 'Tax Returns', href: '/docs/tax-returns', badge: 'Docs' },
      { name: 'County Records', href: '/docs/county-records', badge: 'Docs' },
      { name: 'EchoCAD', href: '/docs/echocad', badge: 'Docs' },
      { name: 'Title Intelligence', href: '/docs/title-intelligence', badge: 'Docs' },
      { name: 'Landman Pipeline', href: '/docs/landman-pipeline', badge: 'Docs' },
      { name: 'Grading / Collectibles', href: '/grading' },
    ],
  },
  {
    title: 'Developer Tools',
    icon: '⚡',
    desc: 'APIs, SDKs, and integrations.',
    items: [
      { name: 'SDK Gateway', href: '/docs/sdk-gateway', badge: 'Docs' },
      { name: 'Hephaestion Forge', href: '/docs/hephaestion-forge', badge: 'Docs' },
      { name: 'Daedalus Forge', href: '/docs/daedalus-forge', badge: 'Docs' },
      { name: 'Swarm Brain', href: '/docs/swarm-brain', badge: 'Docs' },
      { name: 'Tool Discovery', href: '/docs/tool-discovery', badge: 'Docs' },
      { name: 'Arcanum Templates', href: '/docs/arcanum', badge: 'Docs' },
      { name: 'SDK Quickstart', href: '/sdk/quickstart' },
      { name: 'App Forge', href: '/app-forge' },
      { name: 'Prompt Forge', href: '/prompt-forge' },
      { name: 'Feature Flags', href: '/docs/feature-flags', badge: 'Docs' },
    ],
  },
  {
    title: 'Support & Operations',
    icon: '🛠️',
    desc: 'Helpdesk, workflows, and monitoring.',
    items: [
      { name: 'Helpdesk', href: '/docs/helpdesk', badge: 'Docs' },
      { name: 'Call Center', href: '/docs/call-center', badge: 'Docs' },
      { name: 'Incident Manager', href: '/docs/incident-manager', badge: 'Docs' },
      { name: 'Document Manager', href: '/docs/document-manager', badge: 'Docs' },
      { name: 'Workflow Automation', href: '/docs/workflow-automation', badge: 'Docs' },
      { name: 'Fleet Commander', href: '/docs/fleet-commander', badge: 'Docs' },
      { name: 'News Scraper', href: '/docs/news-scraper', badge: 'Docs' },
      { name: 'Knowledge Base', href: '/docs/knowledge-base', badge: 'Docs' },
      { name: 'Vendor Manager', href: '/vendor-manager' },
    ],
  },
  {
    title: 'Specialty Products',
    icon: '✨',
    desc: 'Unique AI-powered solutions.',
    items: [
      { name: 'Immortality Vault', href: '/docs/immortality-vault', badge: 'Docs' },
      { name: 'Home AI', href: '/docs/home-ai', badge: 'Docs' },
      { name: 'Shepherd AI (Church)', href: '/docs/shepherd', badge: 'Docs' },
      { name: 'Gamer Companion', href: '/docs/gamer-companion', badge: 'Docs' },
      { name: 'Coin Rewards', href: '/docs/coin-rewards', badge: 'Docs' },
      { name: 'Price Alerts', href: '/docs/price-alerts', badge: 'Docs' },
      { name: 'Podcast', href: '/docs/podcast', badge: 'Docs' },
      { name: 'QR Menu', href: '/docs/qr-menu', badge: 'Docs' },
      { name: 'Bree Assistant', href: '/bree-assistant' },
    ],
  },
]

export default function DocsPage() {
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const dark = isDark

  const filtered = search.trim()
    ? categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          cat.title.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.items.length > 0)
    : categories

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Documentation', href: '/docs' }]} />
      <FaqSchema faqs={faqs} />
      <div style={{ minHeight: '100vh', background: 'var(--ept-bg)', color: 'var(--ept-text)' }}>

        {/* Nav */}
        <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <Link href="/" className="flex items-center gap-3">
            <Image src={dark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={120} height={32} style={{ mixBlendMode: dark ? 'screen' : 'multiply' }} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sdk/quickstart" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Quickstart</Link>
            <Link href="/blog" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Blog</Link>
            <Link href="/support" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Support</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ padding: '60px 20px 40px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Documentation Hub
          </h1>
          <p className="mt-4 text-lg" style={{ color: 'var(--ept-text-secondary)', maxWidth: 600, margin: '16px auto 0' }}>
            User manuals, API references, interactive tutorials, and getting started guides for every Echo Prime product.
          </p>

          {/* Search */}
          <div style={{ maxWidth: 500, margin: '32px auto 0' }}>
            <input
              type="text"
              placeholder="Search documentation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-base"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 flex-wrap">
            {[
              { value: '160+', label: 'Product Pages' },
              { value: '83', label: 'Full User Manuals' },
              { value: '142', label: 'Blog Articles' },
              { value: '10', label: 'Doc Categories' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section style={{ padding: '0 20px 40px', maxWidth: 900, margin: '0 auto' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'SDK Quickstart', href: '/sdk/quickstart', icon: '⚡' },
              { label: 'API Reference', href: '/sdk', icon: '📖' },
              { label: 'Tutorials (75)', href: '/knowledge', icon: '🎓' },
              { label: 'Changelog', href: '/changelog', icon: '📋' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="p-4 rounded-xl border text-center card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <span className="text-2xl">{link.icon}</span>
                <div className="text-sm font-semibold mt-2" style={{ color: 'var(--ept-text)' }}>{link.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Documentation Categories */}
        <section style={{ padding: '0 20px 60px', maxWidth: 1100, margin: '0 auto' }}>
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(cat => (
              <div key={cat.title} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{cat.title}</h2>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{cat.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(item => (
                    <Link key={item.name} href={item.href} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                      {item.name}
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{item.badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tutorial Banner */}
        <section style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Interactive Tutorials</h2>
            <p className="mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
              Every product page has a guided tutorial. Click the <strong>?</strong> button on any product page to start a step-by-step walkthrough with spotlight overlays.
            </p>
            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
              75 interactive tutorials covering: Intelligence Engines, Closer AI, CRM, Helpdesk, Tax Returns, Title Intelligence, Security, Pentesting, SDK, Voice AI, Bots, and 60+ more products.
            </p>
          </div>
        </section>

        {/* User Manuals Section */}
        <section style={{ padding: '40px 20px 60px', maxWidth: 900, margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>User Manuals</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Sentinel AI Manual', desc: '5,486 engines, confidence stratification, cross-domain intelligence.', href: '/docs/sentinel', icon: '🛡️' },
              { title: 'Closer AI Manual', desc: '35+ persuasion techniques, AI sales calls, pipeline analytics.', href: '/docs/closer', icon: '📞' },
              { title: 'SDK Developer Guide', desc: 'API authentication, endpoints, rate limits, webhooks, and code samples.', href: '/docs/sdk', icon: '🔧' },
              { title: 'Voice AI Manual', desc: '69 cloned voices, emotion engine, multi-provider TTS, streaming.', href: '/docs/voice', icon: '🎤' },
              { title: 'Bot Fleet Manual', desc: '9-platform bot fleet: Discord, LinkedIn, Telegram, X, Reddit, and more.', href: '/docs/bots', icon: '🤖' },
              { title: 'Security Suite', desc: 'Vulnerability scanning, pentesting, dark web monitoring, OSINT.', href: '/docs/security', icon: '🔒' },
            ].map(manual => (
              <Link key={manual.title} href={manual.href} className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <span className="text-3xl">{manual.icon}</span>
                <h3 className="text-base font-bold mt-3" style={{ color: 'var(--ept-text)' }}>{manual.title}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{manual.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '40px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
          {faqs.map(faq => (
            <details key={faq.q} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.q}</summary>
              <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.a}</p>
            </details>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
          <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. 160+ products. 83 user manuals. 646K+ doctrines.</p>
          <div className="flex justify-center gap-6 mt-3">
            <Link href="/" style={{ color: 'var(--ept-accent)' }}>Home</Link>
            <Link href="/blog" style={{ color: 'var(--ept-accent)' }}>Blog</Link>
            <Link href="/pricing" style={{ color: 'var(--ept-accent)' }}>Pricing</Link>
            <Link href="/support" style={{ color: 'var(--ept-accent)' }}>Support</Link>
          </div>
        </footer>
      </div>
    </>
  )
}
