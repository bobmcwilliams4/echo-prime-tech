'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

/* ==============================================================================
   DAEDALUS — Conversational CAD → Manufacturing Intelligence
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: daedalus-forge.bmcii1976.workers.dev v2.1.0
   Ladder: Daedalus Design (drafting / FEA / BOM / drawing standards)
        →  Daedalus Forge (DFM / CNC / compliance / quoting)
   50-stage design→manufacturing pipeline, 12 materials, 6 CNC machines.
   NOTE: AI outputs (GD&T, FEA, compliance verdicts, quotes) require review by a
   qualified engineer. Daedalus is not a PE-stamped deliverable; quotes are indicative.
   ============================================================================== */

const FEATURES = [
  { title: 'AI Drafting', desc: 'Describe a part in plain English and Daedalus generates fully dimensioned 2D drawings — ready to review, adjust, and approve in minutes.', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { title: 'Parametric Design Generation', desc: 'Define your constraints — load, envelope, weight, material — and the AI generates parametric geometry that satisfies every spec simultaneously.', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
  { title: 'Built-in FEA', desc: 'Static, dynamic, and thermal analysis inside the design loop. Surface high-stress regions and validate deflection and factor of safety before you commit.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'GD&T & Tolerance Optimization', desc: 'Apply GD&T and statistical tolerance analysis across every dimension — tighten where function demands it, loosen where it saves cost. Every verdict is engineer-reviewable.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'DFM Review', desc: 'Design-for-manufacturability analysis flags thin walls, unreachable features, tool-access problems, and costly setups before a part ever hits the shop floor.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'CNC Toolpaths', desc: 'Generate optimized G-code for all 6 supported machine types — lathe, 3/4/5-axis mill, wire EDM, and plasma — validated against machine kinematics.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { title: 'Material Selection', desc: 'Describe your service conditions and get ranked material recommendations across 12 materials — carbon steel through Inconel and titanium — with cost and machinability.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { title: 'Drawing-Standards Compliance', desc: 'Auto-enforce ASME Y14.5, ISO 128, DIN, or your company standard. Every drawing checks out before it leaves Daedalus — no manual review pass required.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: 'Indicative Manufacturing Quotes', desc: 'Turn an approved design into a costed, manufacturable estimate — material, machine time, setups, and finishing — so you can quote a job in minutes. Quotes are indicative, not binding.', icon: 'M9 7h6m-6 4h6m-6 4h4m1 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: '3D-Solid → 2D Shop Drawings', desc: 'Import any 3D solid and generate fully annotated 2D shop drawings — section, detail, and auxiliary views — then export to STEP, DXF, IGES, or PDF.', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
];

const COMPARISON = [
  { feature: 'AI drafting from plain-English description', echo: true, fusion: false, solidworks: false, manual: false },
  { feature: 'Parametric constraint solver', echo: true, fusion: 'Basic', solidworks: true, manual: false },
  { feature: 'Built-in FEA (static / dynamic / thermal)', echo: true, fusion: 'Limited', solidworks: 'Add-on', manual: false },
  { feature: 'GD&T + tolerance optimization AI', echo: true, fusion: false, solidworks: false, manual: 'By hand' },
  { feature: 'DFM manufacturability review', echo: true, fusion: 'Partial', solidworks: 'Add-on', manual: 'By hand' },
  { feature: 'CNC toolpath / G-code generation', echo: true, fusion: true, solidworks: 'CAM add-on', manual: false },
  { feature: 'Material selection AI', echo: true, fusion: false, solidworks: false, manual: false },
  { feature: 'Drawing-standards auto-enforcement', echo: true, fusion: 'Partial', solidworks: 'Partial', manual: 'By hand' },
  { feature: 'Indicative manufacturing quote', echo: true, fusion: false, solidworks: false, manual: 'By hand' },
  { feature: 'Design → manufacturing in one platform', echo: true, fusion: 'Partial', solidworks: 'Partial', manual: false },
];

const PRICING = [
  {
    tier: 'Design', price: 149, popular: false,
    features: ['40 design credits/mo', 'AI drafting: plain-English → dimensioned 2D drawings', 'Parametric design generation', 'Built-in FEA (static/dynamic/thermal)', 'Tolerance optimization + BOM generation', 'Drawing-standards compliance (ASME Y14.5 / ISO 128 / DIN)', '3D-solid → annotated 2D shop drawings', 'STEP/DXF export'],
    cta: 'Start Free Trial', href: '/checkout?service=daedalus-forge&tier=design',
  },
  {
    tier: 'Pro', price: 449, popular: true,
    features: ['120 design credits/mo', 'Everything in Design', 'Full 50-stage design→manufacturing pipeline', 'All 12 materials (carbon steel → Inconel/Titanium)', 'All 6 CNC machines (lathe, 3/4/5-axis mill, wire EDM, plasma)', 'DFM review + CNC toolpaths', 'Indicative manufacturing quotes', 'API access', 'Priority support'],
    cta: 'Get Pro', href: '/checkout?service=daedalus-forge&tier=pro',
  },
  {
    tier: 'Compliance', price: 1299, popular: false,
    features: ['Everything in Pro', 'Oil & gas + aerospace domains', 'API 6A / NACE MR0175 compliance gates', 'Audit-trail exports', 'Full material + supplier cross-reference', 'Priority engineering support'],
    cta: 'Start Free Trial', href: '/checkout?service=daedalus-forge&tier=compliance',
  },
  {
    tier: 'Enterprise', price: 0, popular: false,
    features: ['Unlimited designs', 'Private / air-gapped deployment', 'Custom materials & machines', 'Supplier integration', 'SLA guarantees', 'Integration engineering'],
    cta: 'Contact Sales', href: '/checkout?service=daedalus-forge&tier=enterprise',
  },
];

const FAQS = [
  { q: 'What exactly does Daedalus do?', a: 'Daedalus turns a plain-English description of a part into a complete engineering package: dimensioned 2D drawings, GD&T, a built-in FEA pass, a DFM (manufacturability) review, material selection, CNC toolpaths, drawing-standards compliance, and an indicative manufacturing quote. It spans two workflow moments — Daedalus Design gets you a compliant drawing; Daedalus Forge gets you a quoted, manufacturable part — inside one platform, so you never hand files between a CAD tool, a CAM tool, and a quoting spreadsheet.' },
  { q: 'Is the AI output ready to send to a machine shop as-is?', a: 'No — and by design. Every AI-generated GD&T callout, FEA result, compliance verdict, and quote is meant to be reviewed and approved by a qualified engineer before it is released. Daedalus is a force-multiplier for your engineering judgment, not a replacement for it. Its output is not a PE-stamped deliverable, and all quotes are indicative rather than binding. Think of it as a very fast senior drafter and estimator whose work your engineer signs off on at every gate.' },
  { q: 'Which materials and machines are supported?', a: 'The current release covers 12 materials — carbon steel, stainless steel, aluminum alloys, titanium, copper alloys, HDPE/PP/ABS polymers, carbon fiber composites, fiberglass, technical ceramics, tool steel, nickel superalloys (Inconel), and magnesium alloys — each with mechanical properties, machinability ratings, and supplier data. CNC toolpaths generate for 6 machine types: lathe, 3-axis mill, 4-axis mill, 5-axis mill, wire EDM, and plasma. Toolpaths are validated against each machine\'s kinematics before output.' },
  { q: 'How does the manufacturing quote work?', a: 'Once a design is approved, Daedalus estimates material cost, machine time, setups, tooling, and finishing to produce an indicative manufacturing quote in minutes rather than the hours a manual estimate takes. Quotes are transparent — you see every line item and can override any assumption. Because inputs like stock pricing and shop rates vary, quotes are indicative and should be confirmed by your estimator before you commit to a customer.' },
  { q: 'What compliance standards are covered?', a: 'Daedalus Design enforces drawing standards (ASME Y14.5, ISO 128, DIN, or your company standard) on every drawing. The Compliance tier adds oil & gas and aerospace gates — API 6A and NACE MR0175 — with audit-trail exports and full material + supplier cross-reference, targeted at regulated procurement. As with every other output, compliance verdicts are engineer-reviewable, not a substitute for your certifying authority.' },
  { q: 'How does Daedalus fit alongside SolidWorks or Fusion 360?', a: 'Daedalus complements them. Import a 3D solid (STEP, IGES, DXF, or SolidWorks native) and Daedalus produces annotated 2D shop drawings, FEA, DFM, toolpaths, and a quote — or start from a plain-English description and export STEP/DXF back into your existing tools. Most shops use Daedalus to collapse the drafting → analysis → DFM → quoting handoffs that normally span three tools and several people into one reviewed workflow.' },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: 'var(--ept-accent)' }} className="font-bold">Yes</span>;
  if (value === false) return <span style={{ color: 'var(--ept-text-muted)' }}>No</span>;
  return <span style={{ color: 'var(--ept-text-secondary)' }}>{value}</span>;
}

export default function DaedalusForgePage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Daedalus Forge', href: '/daedalus-forge' }]} />
      <FaqSchema faqs={FAQS} />

      {/* ── Nav ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/engines" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/pricing" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=daedalus-forge&tier=design" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 animate-fade-up" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>Conversational CAD → Manufacturing</div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text animate-fade-up">Daedalus</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>Describe a part. Get a compliant drawing and a quoted, manufacturable part.</p>
        <p className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
          Describe a part in plain English and Daedalus returns dimensioned drawings, GD&amp;T, FEA, a DFM review,
          material selection, CNC toolpaths, compliance gates, and an indicative manufacturing quote — from
          <span style={{ color: 'var(--ept-text)' }}> Daedalus Design</span> (drafting &amp; analysis) through
          <span style={{ color: 'var(--ept-text)' }}> Daedalus Forge</span> (manufacturing &amp; quoting).
        </p>
        <p className="text-sm mt-5 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-muted)' }}>
          Your engineer approves every gate. AI-generated GD&amp;T, FEA, compliance verdicts, and quotes require
          review by a qualified engineer — Daedalus is not a PE-stamped deliverable, and all quotes are indicative.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up-delay-3">
          <Link href="/checkout?service=daedalus-forge&tier=design" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#pricing" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">Plain-English → 2D Drawings</span>
          <span className="text-sm">Built-in FEA + DFM</span>
          <span className="text-sm">12 Materials</span>
          <span className="text-sm">6 CNC Machine Types</span>
          <span className="text-sm">Indicative Quotes</span>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>From a plain-English description to a reviewed, quoted, manufacturable part — in three steps.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Describe or Import', desc: 'Type a description of your part, or import an existing 3D solid (STEP, IGES, DXF, or SolidWorks native). Daedalus Design drafts dimensioned 2D drawings with GD&T and enforces your drawing standard.' },
            { step: '2', title: 'Analyze & Review', desc: 'Built-in FEA, tolerance optimization, material selection, and a DFM manufacturability review run automatically. Your engineer reviews and approves each gate — nothing advances unsigned.' },
            { step: '3', title: 'Quote & Manufacture', desc: 'Daedalus Forge generates CNC toolpaths for your machine and an indicative manufacturing quote — material, machine time, setups, and finishing — so you can price and cut the job with confidence.' },
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>From Blank Canvas to Quoted Part</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Ten purpose-built capabilities span the full design→manufacturing workflow — drafting, analysis, DFM, toolpaths, and quoting — each output engineer-reviewable.</p>
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
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Fusion 360 and SolidWorks are drafting and CAD tools. Manual drafting + quoting spans three tools and several people. Daedalus is one reviewed workflow from description to quote.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Capability</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Daedalus</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Fusion 360</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>SolidWorks</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Manual drafting + quoting</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.echo} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.fusion} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.solidworks} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.manual} /></td>
                </tr>
              ))}
              <tr className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>Starting Price</td>
                <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>$149/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$85/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$99/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Engineer hrs/part</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Competitor pricing based on published 2025 subscription rates and reflects CAD/CAM authoring only — DFM, compliance, and quoting are separate tools or manual effort. Daedalus covers the full design→manufacturing workflow in one subscription.</p>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y py-12 px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {[
            { value: '50', label: 'Pipeline Stages' },
            { value: '12', label: 'Materials' },
            { value: '6', label: 'CNC Machines' },
            { value: 'Minutes', label: 'To an Indicative Quote' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Built for the People Who Cut Metal</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Whether you draft it, quote it, or machine it — Daedalus meets you at both workflow moments: the compliant drawing and the quoted, manufacturable part.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'CNC Job Shops', desc: 'Turn an RFQ into an indicative quote in minutes — DFM review, toolpaths, and cost estimate — so you bid more jobs without tying up a senior programmer on every drawing.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            { title: 'Hardware Startups', desc: 'Go from a plain-English idea to a dimensioned, FEA-validated, manufacturable drawing without hiring a full drafting team — then export STEP/DXF to your fab partner.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { title: 'Mechanical Engineers & Consultants', desc: 'Let the AI handle routine drafting, GD&T, and BOM extraction while you keep engineering judgment and sign off on every gate. Ship standards-compliant drawings faster.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { title: 'Oil & Gas + Aerospace Suppliers', desc: 'The Compliance tier adds API 6A and NACE MR0175 gates, audit-trail exports, and full material + supplier cross-reference for regulated procurement — engineer-reviewed at every step.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Design, then Forge</h2>
        <p className="text-center mb-3 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Start at <span style={{ color: 'var(--ept-text)' }}>Daedalus Design</span> for drafting, FEA, and drawing standards. Step up to <span style={{ color: 'var(--ept-text)' }}>Pro</span> for the full design→manufacturing pipeline with DFM, toolpaths, and quotes. <span style={{ color: 'var(--ept-text)' }}>Compliance</span> adds oil &amp; gas and aerospace gates.</p>
        <p className="text-sm text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Every AI-generated GD&amp;T, FEA result, compliance verdict, and quote requires review by a qualified engineer. Daedalus is not a PE-stamped deliverable, and all quotes are indicative — your engineer approves every gate.</p>
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
                    <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${plan.price.toLocaleString()}</span>
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
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>Describe Your First Part</h3>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Start your free trial today. No credit card required for the first 14 days. Go from a plain-English
            description to a reviewed drawing and an indicative quote — with your engineer approving every gate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/checkout?service=daedalus-forge&tier=design" className="px-8 py-4 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
            <a href="mailto:bob@echo-op.com" className="px-8 py-4 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Schedule a Demo</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8" style={{ color: 'var(--ept-text-muted)' }}>
            <span className="text-xs">14-day free trial</span>
            <span className="text-xs">No credit card required</span>
            <span className="text-xs">Cancel anytime</span>
            <span className="text-xs">Engineer-reviewed output</span>
          </div>
        </div>
      </section>

    </div>
  );
}
