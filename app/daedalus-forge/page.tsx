'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

/* ==============================================================================
   DAEDALUS FORGE — AI Manufacturing Intelligence
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: daedalus-forge.bmcii1976.workers.dev v2.1.0
   50 pipeline stages, 5 checkpoints, 15 guilds, 1200 agents, 8 domains,
   12 materials, 6 CNC machines
   ============================================================================== */

const FEATURES = [
  { title: 'Production Line Optimization', desc: 'AI-driven scheduling across 50 pipeline stages. Reduce bottlenecks, maximize throughput, and cut idle time by up to 40%.', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { title: 'Quality Control AI', desc: 'Real-time defect detection across 12 material types. Vision models and sensor fusion catch sub-millimeter deviations before they reach the floor.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Supply Chain Intelligence', desc: 'Predict supplier delays, optimize inventory levels, and auto-trigger purchase orders when thresholds are crossed across all 15 guilds.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Material Science Analysis', desc: 'Deep analysis across 12 supported materials — metals, polymers, composites, and ceramics. Property lookups, substitution recommendations, and failure prediction.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { title: 'CNC Program Generation', desc: 'Auto-generate G-code for all 6 supported CNC machine types. Import CAD files, define tolerances, and get production-ready programs in seconds.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { title: 'Predictive Maintenance', desc: 'Sensor telemetry feeds 1,200 trained agents that predict equipment failures 72+ hours in advance. Slash unplanned downtime across all 8 operational domains.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Digital Twin Simulation', desc: 'Build live digital twins of your entire production environment. Simulate process changes, test new materials, and validate line reconfigurations before touching the floor.', icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
  { title: 'Energy Optimization', desc: 'Monitor power draw across every machine and stage. AI scheduling shifts high-consumption tasks to off-peak windows — measurable savings from month one.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636-6.364l.707.707M12 21v-1m6.364-1.636l-.707-.707M6.343 17.657l-.707.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'Compliance Automation', desc: 'ISO 9001, AS9100, IATF 16949, and FDA 21 CFR Part 11 compliance tracking. Auto-generate audit trails, NCR reports, and corrective action workflows at every checkpoint.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: 'Worker Safety Monitoring', desc: 'Computer vision and wearable integration detect unsafe conditions, PPE violations, and ergonomic risk in real time across all active production zones.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

const COMPARISON = [
  { feature: 'AI-generated CNC programs', echo: true, mes: false, siemens: false, sap: false },
  { feature: 'Digital twin simulation', echo: true, mes: false, siemens: 'Add-on', sap: 'Add-on' },
  { feature: 'Predictive maintenance AI', echo: true, mes: false, siemens: 'Partial', sap: 'Partial' },
  { feature: 'Material science analysis', echo: true, mes: false, siemens: false, sap: false },
  { feature: 'Worker safety monitoring', echo: true, mes: false, siemens: 'Add-on', sap: false },
  { feature: 'Energy optimization AI', echo: true, mes: false, siemens: false, sap: false },
  { feature: 'Compliance automation', echo: true, mes: 'Manual', siemens: true, sap: true },
  { feature: 'Supply chain intelligence', echo: true, mes: false, siemens: 'Partial', sap: true },
  { feature: 'No per-seat licensing', echo: true, mes: false, siemens: false, sap: false },
  { feature: 'Cloud-native deployment', echo: true, mes: false, siemens: 'Partial', sap: 'Partial' },
];

const PRICING = [
  {
    tier: 'Starter', price: 199, popular: false,
    features: ['Up to 2 production lines', '5 pipeline stages', '3 material types', 'Quality control AI', 'Basic compliance reports', 'Email support'],
    cta: 'Start Free Trial', href: '/checkout?service=daedalus-forge&tier=starter',
  },
  {
    tier: 'Professional', price: 499, popular: true,
    features: ['Up to 10 production lines', '25 pipeline stages', 'All 12 material types', 'CNC program generation', 'Predictive maintenance', 'Digital twin (1 facility)', 'Energy optimization', 'Priority support'],
    cta: 'Get Professional', href: '/checkout?service=daedalus-forge&tier=professional',
  },
  {
    tier: 'Enterprise', price: 999, popular: false,
    features: ['Unlimited production lines', 'All 50 pipeline stages', '5 checkpoints', '15 guilds + 1,200 agents', 'Worker safety monitoring', 'Compliance automation', 'Multi-facility digital twins', 'Dedicated account manager'],
    cta: 'Start Free Trial', href: '/checkout?service=daedalus-forge&tier=enterprise',
  },
  {
    tier: 'Custom', price: 0, popular: false,
    features: ['On-premise deployment', 'Air-gapped environments', 'Custom agent training', 'SLA guarantees', 'White-label options', 'Integration engineering'],
    cta: 'Contact Sales', href: 'mailto:bob@echo-op.com',
  },
];

const FAQS = [
  { q: 'Does Daedalus Forge replace our existing MES?', a: 'Not necessarily. Daedalus Forge is designed to layer on top of existing MES platforms like Siemens Opcenter, Plex, or custom systems via our REST API and OPC-UA connectors. You can run in augmentation mode — gaining AI capabilities without a full rip-and-replace — or migrate fully to Daedalus Forge as your primary system. Most customers start in augmentation mode and migrate over 6-12 months.' },
  { q: 'Which materials are supported?', a: 'The current v2.1.0 release supports 12 material categories: carbon steel, stainless steel, aluminum alloys, titanium, copper alloys, HDPE/PP/ABS polymers, carbon fiber composites, fiberglass, technical ceramics, tool steel, nickel superalloys, and magnesium alloys. Material profiles include mechanical properties, machinability ratings, thermal characteristics, and supplier databases. New material types are added each quarter.' },
  { q: 'How does the CNC program generation work?', a: 'Import your CAD files (STEP, IGES, DXF, or SolidWorks native), define your material, tolerance requirements, and surface finish specs. Daedalus Forge analyzes the geometry and generates optimized G-code for your specific machine type — lathe, 3-axis mill, 4-axis mill, 5-axis mill, EDM, or plasma cutter. Programs are validated against your machine\'s kinematics before output. Average generation time is under 90 seconds for most parts.' },
  { q: 'What compliance standards are covered?', a: 'Out of the box: ISO 9001:2015, AS9100D (aerospace), IATF 16949 (automotive), FDA 21 CFR Part 11 (medical devices), OSHA 1910 (worker safety), and ISO 14001 (environmental). Compliance workflows auto-generate NCR reports, CAPA records, control plans, and audit-ready documentation at each of the 5 pipeline checkpoints. Custom standards can be configured for defense (CMMC) and nuclear (10 CFR 50) contracts.' },
  { q: 'How many agents are running at once?', a: 'The Enterprise tier runs up to 1,200 concurrent AI agents distributed across your 15 guilds — each guild being a logical grouping of related manufacturing processes (e.g., machining guild, assembly guild, inspection guild, logistics guild). Agents communicate via an internal message bus and escalate decisions through the checkpoint hierarchy. Starter and Professional tiers run scaled-down agent pools appropriate for their pipeline stage count.' },
  { q: 'What does integration with existing equipment look like?', a: 'Daedalus Forge connects via OPC-UA, MQTT, Modbus TCP/IP, and direct machine APIs for major CNC brands (Fanuc, Siemens, Heidenhain, Mitsubishi). For legacy machines without network interfaces, we provide edge gateway hardware ($299 one-time) that bridges serial/analog signals to our cloud platform. Most customers complete equipment integration within 2-4 weeks with our onboarding engineering team.' },
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
          <Link href="/checkout?service=daedalus-forge&tier=starter" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 animate-fade-up" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>v2.1.0 — 1,200 Agents Live</div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text animate-fade-up">Daedalus Forge</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>AI Manufacturing Intelligence</p>
        <p className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
          50 pipeline stages. 15 guilds. 1,200 agents. The manufacturing AI your competitors wish they had built first.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up-delay-3">
          <Link href="/checkout?service=daedalus-forge&tier=starter" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#pricing" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">50 Pipeline Stages</span>
          <span className="text-sm">1,200 AI Agents</span>
          <span className="text-sm">15 Guilds</span>
          <span className="text-sm">8 Operational Domains</span>
          <span className="text-sm">6 CNC Machine Types</span>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Connect your equipment. Configure your guilds. Let 1,200 agents run your operation.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Connect Your Equipment', desc: 'Link CNC machines, sensors, and PLCs via OPC-UA, MQTT, or Modbus. Legacy machines use our edge gateway. Most facilities complete integration in under 2 weeks.' },
            { step: '2', title: 'Configure Your Guilds', desc: 'Map your production processes to guilds — machining, assembly, inspection, logistics, and more. Define pipeline stages, checkpoints, and approval flows for your specific operation.' },
            { step: '3', title: 'Agents Take Over', desc: 'Your 1,200 AI agents monitor every stage, predict failures, optimize schedules, generate CNC programs, and enforce compliance — 24/7, without manual intervention.' },
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Every Layer of Manufacturing Intelligence</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>From raw material intake to final inspection — Daedalus Forge covers all 8 operational domains with purpose-built AI.</p>
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
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Traditional MES platforms were built before AI existed. Daedalus Forge was built for the AI era from the ground up.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Capability</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Daedalus Forge</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Traditional MES</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Siemens Opcenter</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>SAP Manufacturing</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.echo} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.mes} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.siemens} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.sap} /></td>
                </tr>
              ))}
              <tr className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>Starting Price</td>
                <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>$199/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$50K+ impl.</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$200K+ license</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$500K+ suite</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Competitor pricing reflects typical implementation + license costs. Daedalus Forge is subscription-based with no implementation fees for standard deployments.</p>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y py-12 px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {[
            { value: '50', label: 'Pipeline Stages' },
            { value: '1,200', label: 'AI Agents' },
            { value: '15', label: 'Guilds' },
            { value: '12', label: 'Material Types' },
            { value: '99.95%', label: 'Uptime SLA' },
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Built for Every Manufacturing Vertical</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Eight operational domains cover the full range of discrete and process manufacturing environments.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Aerospace & Defense', desc: 'AS9100D compliance, titanium and superalloy machining, 5-axis CNC generation, and full traceability from raw stock to certified part.', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
            { title: 'Automotive', desc: 'IATF 16949 workflows, PPAP documentation, high-volume press and stamping optimization, and just-in-time supply chain management.', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' },
            { title: 'Medical Devices', desc: 'FDA 21 CFR Part 11 electronic records, ISO 13485 quality management, cleanroom environment monitoring, and device history record automation.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { title: 'Industrial Equipment', desc: 'Heavy fabrication, weld inspection AI, structural analysis integration, and multi-site production coordination across large job shops.', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
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
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-seat licensing. No implementation surprise fees. Scale from job shop to enterprise.</p>
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
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>Ready to Put 1,200 Agents to Work?</h3>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Start your free trial today. No credit card required for the first 14 days. Full access to Professional tier features.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/checkout?service=daedalus-forge&tier=starter" className="px-8 py-4 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
            <a href="mailto:bob@echo-op.com" className="px-8 py-4 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Schedule a Demo</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8" style={{ color: 'var(--ept-text-muted)' }}>
            <span className="text-xs">14-day free trial</span>
            <span className="text-xs">No credit card required</span>
            <span className="text-xs">Cancel anytime</span>
            <span className="text-xs">SOC 2 Type II</span>
          </div>
        </div>
      </section>

    </div>
  );
}
