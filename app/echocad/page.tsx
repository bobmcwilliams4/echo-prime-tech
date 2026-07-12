'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

/* ==============================================================================
   ECHOCAD — AI-Powered CAD Automation
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echocad.bmcii1976.workers.dev v2.0.0
   Automated CAD drafting, design optimization, and engineering analysis
   ============================================================================== */

const FEATURES = [
  { title: 'AI Drafting Assistant', desc: 'Describe your part in plain English and watch EchoCAD generate fully dimensioned drawings. Review, adjust, and approve — in minutes, not hours.', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { title: 'Parametric Design Generation', desc: 'Define your constraints — load requirements, envelope dimensions, weight targets — and let the AI generate parametric models that satisfy every spec simultaneously.', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
  { title: 'Structural Analysis', desc: 'Built-in FEA for static, dynamic, and thermal loads. Identify high-stress regions, get redesign suggestions, and validate designs without leaving the EchoCAD environment.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Tolerance Optimization', desc: 'Statistical tolerance analysis across all dimensions. AI recommendations tighten where it matters and loosen where it saves cost — without compromising function or fit.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'BOM Generation', desc: 'Automatic bill of materials extracted directly from your assembly. Material grades, standard hardware, custom parts, and supplier cross-references — structured and export-ready.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { title: 'Drawing Standards Compliance', desc: 'Auto-enforce ASME Y14.5, ISO 128, DIN, or your company drawing standard. Every drawing checks out before it leaves EchoCAD — no manual review required.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: '3D-to-2D Projection', desc: 'Import any 3D solid model and generate fully annotated 2D shop drawings in your chosen projection standard. Section views, details, and auxiliary views auto-generated.', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { title: 'Revision Management', desc: 'Full revision history with comparison views, approval workflows, ECO tracking, and audit-ready change logs. Never lose a drawing version or wonder who approved what.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Material Selection AI', desc: 'Describe your application conditions and receive ranked material recommendations with cost estimates, machinability ratings, and supplier availability data.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { title: 'Export to DXF / DWG / STEP', desc: 'One-click export to every major format. DXF and DWG for 2D workflows, STEP and IGES for 3D interchange, PDF for shop distribution, and SVG for documentation.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
];

const COMPARISON = [
  { feature: 'AI drafting from text description', echo: true, autocad: false, solidworks: false, fusion: false },
  { feature: 'Parametric constraint solver', echo: true, autocad: false, solidworks: true, fusion: 'Basic' },
  { feature: 'Built-in FEA / structural analysis', echo: true, autocad: false, solidworks: 'Add-on', fusion: 'Limited' },
  { feature: 'Tolerance optimization AI', echo: true, autocad: false, solidworks: false, fusion: false },
  { feature: 'Automatic BOM extraction', echo: true, autocad: false, solidworks: true, fusion: true },
  { feature: 'Drawing standards auto-enforcement', echo: true, autocad: 'Manual', solidworks: 'Partial', fusion: 'Partial' },
  { feature: 'Material selection AI', echo: true, autocad: false, solidworks: false, fusion: false },
  { feature: 'Revision management', echo: true, autocad: 'Basic', solidworks: true, fusion: true },
  { feature: 'Browser-based (no install)', echo: true, autocad: 'Partial', solidworks: false, fusion: true },
  { feature: 'Export DXF / DWG / STEP', echo: true, autocad: true, solidworks: true, fusion: true },
];

const PRICING = [
  {
    tier: 'Personal', price: 29, popular: false,
    features: ['5 active projects', 'AI drafting assistant', 'DXF / DWG export', 'Basic revision history', 'Community support'],
    cta: 'Start Free Trial', href: '/checkout?service=echocad&tier=personal',
  },
  {
    tier: 'Professional', price: 79, popular: true,
    features: ['Unlimited projects', 'Parametric design generation', 'Structural analysis (FEA)', 'Tolerance optimization', 'BOM generation', 'STEP / IGES export', 'Priority support'],
    cta: 'Get Professional', href: '/checkout?service=echocad&tier=professional',
  },
  {
    tier: 'Team', price: 149, popular: false,
    features: ['Everything in Professional', 'Up to 10 users', 'Shared project library', 'Approval workflows', 'ECO tracking', 'Drawing standards config', 'Team admin dashboard'],
    cta: 'Start Free Trial', href: '/checkout?service=echocad&tier=team',
  },
  {
    tier: 'Enterprise', price: 0, popular: false,
    features: ['Unlimited users', 'On-premise option', 'SSO / SAML', 'Custom drawing standards', 'API access', 'Dedicated support engineer', 'SLA guarantee'],
    cta: 'Contact Sales', href: 'mailto:bob@echo-op.com',
  },
];

const FAQS = [
  { q: 'Which file formats does EchoCAD support?', a: 'EchoCAD imports and exports all major CAD formats. Import: STEP (.stp/.step), IGES (.igs/.iges), DXF, DWG (AutoCAD 2000 through 2024), STL, OBJ, and SolidWorks native (.sldprt/.sldasm up to 2024). Export: DXF, DWG, STEP, IGES, PDF, SVG, and STL. We are adding Parasolid (.x_t) and CATIA V5 (.CATPart) import in Q3 2026.' },
  { q: 'How accurate is the AI drafting assistant?', a: 'For standard mechanical parts — brackets, plates, shafts, housings — the AI produces fully correct geometry with proper dimensioning on the first pass approximately 85% of the time. Complex organic shapes or unusual assemblies may require 1-2 iterations. All AI-generated geometry is editable parametrically. The AI improves continuously as it learns from engineer corrections across all accounts (with anonymized data only).' },
  { q: 'Can I use EchoCAD alongside my existing AutoCAD or SolidWorks license?', a: 'Yes. EchoCAD is designed to augment your existing tools, not replace them. Common workflows: use EchoCAD\'s AI assistant to generate initial designs quickly, then refine them in SolidWorks. Or use EchoCAD for tolerance analysis and BOM generation on DWG files from AutoCAD. Our import/export ensures files move cleanly between systems without manual conversion steps.' },
  { q: 'Does the structural analysis replace dedicated FEA software like ANSYS?', a: 'EchoCAD\'s built-in FEA is optimized for quick design validation — identifying major stress concentrations, checking deflection limits, and confirming factor of safety. For complex multiphysics simulations, non-linear materials, or certification-grade analysis (aerospace, pressure vessels), you should still use ANSYS, Abaqus, or equivalent. EchoCAD tells you if your design is in the right ballpark; dedicated FEA tells you if it will pass the certification test.' },
  { q: 'How does revision management and approval workflow work?', a: 'Every save creates a numbered revision with a diff view showing what changed geometrically and dimensionally. Approval workflows let you route drawings through your defined approval chain (designer → checker → approver) with electronic signatures and timestamps. ECO (Engineering Change Orders) link to affected drawings automatically. All records are audit-trail ready for ISO 9001 and AS9100 compliance. Revision history is retained indefinitely — there is no storage cap on revision data.' },
  { q: 'Is EchoCAD browser-based or does it require installation?', a: 'EchoCAD runs fully in the browser — Chrome, Edge, and Firefox are supported. No installation required for the core platform. A lightweight desktop companion app (Windows and macOS) is available for Professional and above; it enables local file system access, background rendering for large assemblies, and offline mode for up to 72 hours. Most users work exclusively in the browser and never need the desktop app.' },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: 'var(--ept-accent)' }} className="font-bold">Yes</span>;
  if (value === false) return <span style={{ color: 'var(--ept-text-muted)' }}>No</span>;
  return <span style={{ color: 'var(--ept-text-secondary)' }}>{value}</span>;
}

export default function EchoCADPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>EchoCAD - Echo Prime Technologies</h1>
          <p>AI-powered CAD automation platform featuring AI drafting, parametric design generation, structural analysis, tolerance optimization, and export to DXF/DWG/STEP formats. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'EchoCAD', href: '/echocad' }]} />
      <FaqSchema faqs={FAQS} />

      {/* ── Nav ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/engines" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/pricing" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/daedalus-forge" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Rebrand Banner ── */}
      <div className="px-6 py-4 border-b" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-accent)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            EchoCAD is now <span style={{ color: 'var(--ept-accent)' }}>Daedalus Design</span> — the drafting &amp; design tier of the Daedalus engineering platform.
          </span>
          <Link href="/daedalus-forge" className="px-4 py-2 rounded-lg text-sm font-semibold shrink-0" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Go to Daedalus
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 animate-fade-up" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>v2.0.0 — Browser-Native CAD Platform</div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text animate-fade-up">EchoCAD</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>AI-Powered CAD Automation</p>
        <p className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
          Describe your part. EchoCAD drafts it. Validate, optimize, and export — without fighting legacy software.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up-delay-3">
          <Link href="/daedalus-forge" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#pricing" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">10 Core Features</span>
          <span className="text-sm">DXF / DWG / STEP Export</span>
          <span className="text-sm">Built-in FEA</span>
          <span className="text-sm">No Installation Required</span>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>From a text description to a production-ready drawing — in three steps.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Describe or Import', desc: 'Type a description of your part, upload an existing file (STEP, DXF, DWG, SolidWorks), or start from a parametric template. EchoCAD handles all three entry points.' },
            { step: '2', title: 'AI Optimizes & Analyzes', desc: 'The AI checks your geometry against structural requirements, applies tolerance optimization, enforces your drawing standard, and generates the BOM — all before you ask.' },
            { step: '3', title: 'Review, Approve & Export', desc: 'Review the AI-generated drawing, make adjustments, route through your approval workflow, and export to DXF, DWG, STEP, or PDF in one click.' },
          ].map((s, i) => (
            <div key={i} className="text-center p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-extrabold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{s.step}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Everything an Engineer Needs</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Ten purpose-built AI features that cover the full engineering design workflow — from blank canvas to approved drawing.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitor Comparison ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>AutoCAD and SolidWorks are drafting tools. EchoCAD is an engineering intelligence platform built around AI from the start.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Capability</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>EchoCAD</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>AutoCAD</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>SolidWorks</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Fusion 360</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.echo} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.autocad} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.solidworks} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.fusion} /></td>
                </tr>
              ))}
              <tr className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>Starting Price</td>
                <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>$29/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$220/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$99/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$85/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Competitor pricing based on published 2025 subscription rates. SolidWorks price reflects SOLIDWORKS Standard subscription. AutoCAD reflects single-app subscription.</p>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y py-12 px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '85%', label: 'First-Pass Accuracy' },
            { value: '10x', label: 'Faster Than Manual Drafting' },
            { value: '12+', label: 'Supported File Formats' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Built for Every Engineering Team</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>From solo consultants to 200-person engineering departments — EchoCAD scales to your workflow.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Mechanical Engineers', desc: 'Design faster with AI drafting, validate with built-in FEA, and produce standards-compliant drawings without a separate checker.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            { title: 'Manufacturing Engineers', desc: 'Generate DXF files for CNC, extract BOMs for procurement, and keep revision history synchronized with your change management process.', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
            { title: 'Design Consultants', desc: 'Move faster on client projects. EchoCAD\'s AI handles the routine drafting so you can focus on engineering judgment and client value.', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { title: 'Engineering Teams', desc: 'Shared project libraries, parallel review workflows, and team-wide drawing standards enforcement — EchoCAD keeps every engineer on the same page.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-7 h-7 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No seat traps. No feature paywalls. Cancel anytime.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING.map((plan, i) => (
            <div key={i} className="relative p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: plan.popular ? 2 : 1 }}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</span>
              )}
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{plan.tier}</h3>
              <div className="mb-4">
                {plan.price > 0 ? (
                  <>
                    <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${plan.price}</span>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/mo</span>
                  </>
                ) : (
                  <span className="text-xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Custom</span>
                )}
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              {plan.href.startsWith('mailto:') ? (
                <a href={plan.href} className="block text-center px-6 py-3 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>{plan.cta}</a>
              ) : (
                <Link href={plan.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: plan.popular ? '#fff' : 'var(--ept-text)' }}>{plan.cta}</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <svg className={`w-5 h-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-10 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>Stop Fighting Your CAD Software. Start Engineering.</h3>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Free 14-day trial on Personal and Professional tiers. No credit card required. Import your existing files on day one.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/daedalus-forge" className="px-8 py-4 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
            <a href="mailto:bob@echo-op.com" className="px-8 py-4 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Schedule a Demo</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8" style={{ color: 'var(--ept-text-muted)' }}>
            <span className="text-xs">14-day free trial</span>
            <span className="text-xs">No credit card required</span>
            <span className="text-xs">Import existing CAD files</span>
            <span className="text-xs">Cancel anytime</span>
          </div>
        </div>
      </section>

    </div>
  );
}
