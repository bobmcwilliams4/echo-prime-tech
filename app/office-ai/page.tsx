'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '../../components/TrialCTA';

/* ==============================================================================
   ECHO OFFICE AI — Complete AI Business Operations Platform
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-office-ai module system — 22 modules across invoicing, payroll,
   HR, inventory, CRM, analytics, fleet tracking, and more
   ============================================================================== */

const FEATURES = [
  { title: 'AI Invoicing & Billing', desc: 'Create professional invoices in seconds. Auto-calculate taxes, track payments, send reminders. Recurring billing, partial payments, and multi-currency support.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Payroll Management', desc: 'Federal and state tax calculations for all 50 states. Automated pay runs, overtime calculations, deductions, benefits, and year-end tax filing support.', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
  { title: 'HR & Employee Management', desc: 'Employee profiles, department org charts, time tracking with auto-overtime, leave management with carry-over, performance reviews, and onboarding workflows.', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { title: 'Inventory & Warehousing', desc: 'Multi-warehouse stock tracking, purchase orders, inter-warehouse transfers, stocktaking, barcode/SKU lookup, and AI demand forecasting from 90-day history.', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
  { title: 'CRM & Sales Pipeline', desc: 'Contact and company management, deal board grouped by stage, activity tracking, AI lead scoring with custom rules, and 4 analytics dashboards.', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605' },
  { title: 'Helpdesk & Ticketing', desc: 'Multi-channel ticket management with SLA tracking, auto-assignment, AI categorization, knowledge base integration, CSAT surveys, and automation rules.', icon: 'M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m0 0a3.765 3.765 0 010-2.528m2.268 4.796l-4.138 3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976l-4.138 3.448m0 0a9.027 9.027 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 7.288l-4.138 3.448m4.138-3.448A9.014 9.014 0 007.288 4.33m-2.958 2.958L8.468 10.74m-4.138-3.448a9.014 9.014 0 00-3.448 4.138' },
  { title: 'Booking & Scheduling', desc: 'Public booking pages with smart slot calculation, staff management, recurring appointments, waitlist with auto-notification, and AI no-show prediction.', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z' },
  { title: 'Contracts & E-Signatures', desc: 'Template builder with variable substitution, clause library, version control, sequential approval workflows, and token-based e-signatures with audit trail.', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' },
  { title: 'Forms & Surveys', desc: 'Drag-and-drop form builder with 12+ field types, quiz scoring, conditional logic, webhook integrations, response analytics, and AI question suggestions.', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z' },
  { title: 'Email Marketing', desc: 'Contact lists, email templates with variables, campaigns with A/B testing, open/click tracking, drip automations, and AI subject line optimization.', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
  { title: 'Document Management', desc: 'File upload to R2 cloud storage, nested folders, version history, share links with password protection, threaded comments, and AI auto-tagging.', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
  { title: 'Analytics Dashboard', desc: 'Real-time metrics across all modules — revenue, expenses, employee hours, inventory levels, customer pipeline, and growth trends. Exportable reports.', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
];

const COMPARISON = [
  { feature: 'All-in-one platform', echo: true, zoho: true, odoo: true, freshbooks: false },
  { feature: 'AI-powered features', echo: true, zoho: 'Basic', odoo: false, freshbooks: false },
  { feature: 'Invoicing & billing', echo: true, zoho: true, odoo: true, freshbooks: true },
  { feature: 'Full payroll (all 50 states)', echo: true, zoho: 'Add-on', odoo: 'Add-on', freshbooks: false },
  { feature: 'HR & performance reviews', echo: true, zoho: true, odoo: true, freshbooks: false },
  { feature: 'Inventory & warehousing', echo: true, zoho: true, odoo: true, freshbooks: false },
  { feature: 'CRM with AI lead scoring', echo: true, zoho: true, odoo: true, freshbooks: false },
  { feature: 'Helpdesk with SLA tracking', echo: true, zoho: 'Add-on', odoo: true, freshbooks: false },
  { feature: 'E-signatures built-in', echo: true, zoho: 'Add-on', odoo: false, freshbooks: false },
  { feature: 'Form builder', echo: true, zoho: true, odoo: false, freshbooks: false },
  { feature: 'Email marketing', echo: true, zoho: 'Add-on', odoo: true, freshbooks: false },
  { feature: 'Cloudflare edge hosting', echo: true, zoho: false, odoo: false, freshbooks: false },
  { feature: 'No per-module pricing', echo: true, zoho: false, odoo: false, freshbooks: false },
  { feature: 'Starting price/month', echo: '$49', zoho: '$45+', odoo: '$31+', freshbooks: '$19' },
];

const PRICING = [
  { name: 'Starter', price: 49, desc: 'Core business operations for small teams', features: ['5 users', 'Invoicing & billing', 'CRM (500 contacts)', 'Booking & scheduling', 'Forms & surveys', 'Document storage (5GB)', 'Basic analytics', 'Email support'] },
  { name: 'Business', price: 149, desc: 'Complete platform with all 22 modules', features: ['25 users', 'All Starter features', 'Payroll & HR', 'Inventory management', 'Helpdesk with SLA', 'Contracts & e-signatures', 'Email marketing', 'AI-powered features', '50GB storage', 'Priority support'], popular: true },
  { name: 'Enterprise', price: 399, desc: 'Unlimited scale with premium support', features: ['Unlimited users', 'All Business features', 'Unlimited storage', 'Custom integrations', 'Dedicated account manager', 'White-label option', 'SLA guarantee (99.9%)', 'Phone support', 'API access', 'Custom workflows'] },
];

const FAQS = [
  { q: 'How many modules are included in each plan?', a: 'The Starter plan includes 8 core modules (invoicing, CRM, booking, forms, documents, basic analytics, email sender, and surveys). The Business plan unlocks all 22 modules including payroll, HR, inventory, helpdesk, contracts, email marketing, and AI features. Enterprise includes everything plus custom integrations.' },
  { q: 'Can I use Office AI for just one function like invoicing?', a: 'Absolutely. Many customers start with just invoicing or CRM and gradually adopt more modules as they grow. You only pay for the tier, not per module. Even the Starter plan at $49/mo gives you 8 modules — far more value than standalone tools.' },
  { q: 'How does payroll handle different state tax rates?', a: 'Our payroll engine calculates federal, state, Social Security, Medicare, FUTA, and SUTA taxes for all 50 US states with progressive brackets. It handles pre-tax and post-tax deductions, benefits administration, and generates 941, W-2, and 1099 forms automatically.' },
  { q: 'Is there a data migration path from our current tools?', a: 'Yes. Most modules support CSV/JSON import for contacts, invoices, inventory, and employee records. Our team can assist with bulk migrations from QuickBooks, Zoho, FreshBooks, and other platforms. Enterprise customers get dedicated migration support.' },
  { q: 'How does AI lead scoring work in the CRM?', a: 'The AI analyzes contact engagement, activity recency, deal stage, email opens, and custom scoring rules you define. Each lead gets a 0-100 score. The Engine Runtime powers the scoring model, so it improves as your data grows. You can also create manual scoring rules based on industry, company size, or any field.' },
  { q: 'Can multiple businesses run on one account?', a: 'Yes. Office AI is multi-tenant by design. Each business operates in isolation with its own data, users, and settings. Enterprise customers can manage multiple businesses from a single admin dashboard with unified billing.' },
];

export default function OfficeAiPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isDark } = useTheme();

  return (
    <>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Office AI Platform - Echo Prime Technologies</h1>
          <p>Complete AI-powered business operations platform with 22 modules including invoicing, payroll, HR, inventory, CRM, helpdesk, contracts, email marketing, and more — all in one platform starting at $49/mo. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Office AI', href: '/office-ai' }]} />

      {/* ── Nav ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
          <Link href="/engines" className="hover:opacity-80">Engines</Link>
          <Link href="/pricing" className="hover:opacity-80">Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Sign In</Link>
        </div>
      </nav>

      <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
        {/* ── Hero ── */}
        <section className="relative py-24 px-4 overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at center, var(--ept-accent), transparent 70%)' }} />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>22 MODULES</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>ALL-IN-ONE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 gradient-text">Office AI Platform</h1>
            <p className="text-lg md:text-xl mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Complete AI-powered business operations — invoicing, payroll, HR, inventory, CRM, helpdesk, contracts, and 15 more modules in one platform.</p>
            <div className="flex items-center justify-center gap-8 mb-8 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
              <span>22 Modules</span><span>|</span><span>AI-Powered</span><span>|</span><span>From $49/mo</span>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Start Free Trial</Link>
              <Link href="/docs" className="px-8 py-3 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See All Modules</Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Everything Your Business Needs</h2>
            <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>12 core capabilities — no per-module pricing, no add-on fees</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <svg className="w-8 h-8 mb-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ── */}
        <section className="py-20 px-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Echo Office AI vs The Competition</h2>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
              <table className="w-full text-sm">
                <thead><tr style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Zoho One</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Odoo</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>FreshBooks</th>
                </tr></thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)' }}>
                      <td className="p-4 font-medium">{row.feature}</td>
                      {[row.echo, row.zoho, row.odoo, row.freshbooks].map((v, j) => (
                        <td key={j} className="p-4 text-center">{v === true ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : v === false ? <span style={{ color: 'var(--ept-text-muted)' }}>&#10007;</span> : <span style={{ color: 'var(--ept-text-secondary)' }}>{v}</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Flat Pricing</h2>
            <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-module fees. No per-user surprises. One price, everything included.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING.map((p, i) => (
                <div key={i} className={`p-8 rounded-2xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
                  {p.popular && <div className="text-xs font-bold uppercase mb-4 text-center" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
                  <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{p.desc}</p>
                  <div className="text-4xl font-extrabold mb-6">${p.price}<span className="text-base font-normal" style={{ color: 'var(--ept-text-muted)' }}>/mo</span></div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, j) => <li key={j} className="flex items-start gap-2 text-sm"><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span><span>{f}</span></li>)}
                  </ul>
                  <Link href="/pricing" className="block text-center px-6 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Get Started</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left font-semibold">
                    <span>{faq.q}</span>
                    <span className="ml-4 text-xl" style={{ color: 'var(--ept-accent)' }}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stop Paying for 10 Tools. Use One.</h2>
            <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Replace your invoicing, CRM, HR, helpdesk, and marketing tools with a single AI-powered platform that costs less than any one of them.</p>
            <div className="mb-6"><Link href="/pricing" className="inline-block px-10 py-4 rounded-xl font-semibold text-lg text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>View All Pricing</Link></div>
            <TrialCTA serviceId="echo-office-ai" tier="starter" productName="Echo Office AI" />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t py-8 px-4 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
        </footer>
      </div>
    </>
  );
}
