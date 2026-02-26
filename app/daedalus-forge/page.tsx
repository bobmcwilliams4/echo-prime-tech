'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import {
  getHealth,
  getStats,
  type HealthResponse,
  type ForgeStats,
} from '../../lib/daedalus-forge-api';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '⚒' },
  { id: 'guilds', label: 'Guilds', icon: '⛊' },
  { id: 'pipeline', label: 'Pipeline', icon: '▸▸' },
  { id: 'domains', label: 'Domains', icon: '◉' },
  { id: 'council', label: 'Trinity Council', icon: '⟁' },
  { id: 'standards', label: 'Standards', icon: '✓' },
  { id: 'api', label: 'API Reference', icon: '⟨⟩' },
] as const;

const GUILDS = [
  { name: 'Materials Guild', agents: 6, domain: 'Material Science', desc: 'Alloy selection, composite design, polymer formulation, material testing, certification, and degradation analysis.' },
  { name: 'Structural Guild', agents: 6, domain: 'Structural Engineering', desc: 'FEA analysis, load path optimization, fatigue life prediction, weld design, connection detailing.' },
  { name: 'Thermal Guild', agents: 5, domain: 'Thermal Systems', desc: 'Heat transfer analysis, cooling system design, thermal stress prediction, insulation optimization.' },
  { name: 'Process Guild', agents: 6, domain: 'Manufacturing Process', desc: 'Machining parameters, casting simulation, forging design, additive manufacturing, injection molding.' },
  { name: 'Quality Guild', agents: 6, domain: 'Quality Assurance', desc: 'Statistical process control, dimensional inspection, NDT planning, root cause analysis, CAPA management.' },
  { name: 'Automation Guild', agents: 5, domain: 'Industrial Automation', desc: 'PLC programming, SCADA design, robot path planning, conveyor optimization, safety interlock logic.' },
  { name: 'Electrical Guild', agents: 5, domain: 'Electrical Systems', desc: 'Power distribution, motor selection, VFD sizing, grounding design, arc flash analysis.' },
  { name: 'Safety Guild', agents: 5, domain: 'Industrial Safety', desc: 'HAZOP analysis, LOPA assessment, SIL determination, emergency response, PPE specification.' },
  { name: 'Supply Chain Guild', agents: 5, domain: 'Procurement & Logistics', desc: 'Vendor evaluation, lead time optimization, inventory modeling, cost reduction, alternate sourcing.' },
  { name: 'Design Guild', agents: 6, domain: 'Product Design', desc: 'DFM review, tolerance analysis, GD&T application, prototype planning, design validation.' },
  { name: 'Maintenance Guild', agents: 5, domain: 'Reliability Engineering', desc: 'RCM analysis, PM scheduling, vibration analysis, oil analysis, condition monitoring.' },
  { name: 'Environmental Guild', agents: 4, domain: 'Environmental Compliance', desc: 'Emissions modeling, waste management, water treatment, regulatory compliance, sustainability metrics.' },
  { name: 'Metrology Guild', agents: 5, domain: 'Precision Measurement', desc: 'CMM programming, gauge R&R, calibration management, uncertainty analysis, surface finish specification.' },
  { name: 'Simulation Guild', agents: 5, domain: 'Digital Twin', desc: 'CFD analysis, multibody dynamics, discrete event simulation, process modeling, virtual commissioning.' },
  { name: 'Commissioning Guild', agents: 6, domain: 'Project Delivery', desc: 'FAT/SAT planning, punch list management, startup sequencing, performance testing, handover documentation.' },
];

const PIPELINE_PHASES = [
  { phase: 'DISCOVERY', stages: ['Requirements Capture', 'Feasibility Analysis', 'Concept Selection', 'Risk Assessment', 'Project Charter'], color: '#3b82f6' },
  { phase: 'DESIGN', stages: ['Preliminary Design', 'Material Selection', 'Structural Analysis', 'Thermal Analysis', 'Detail Design', 'DFM Review', 'Design Freeze'], color: '#8b5cf6' },
  { phase: 'VALIDATION', stages: ['Prototype Planning', 'Simulation Suite', 'Design FMEA', 'Tolerance Analysis', 'Standards Compliance', 'Council Review'], color: '#f59e0b' },
  { phase: 'MANUFACTURING', stages: ['Process Planning', 'Tooling Design', 'First Article', 'SPC Setup', 'Production Ramp', 'Quality Gates'], color: '#22c55e' },
  { phase: 'DELIVERY', stages: ['Final Inspection', 'Documentation Pack', 'FAT Execution', 'Packaging', 'Logistics', 'SAT Support'], color: '#06b6d4' },
];

const DOMAINS_LIST = [
  { id: 'aerospace', name: 'Aerospace & Defense', standards: ['AS9100', 'NADCAP', 'MIL-STD'], desc: 'Aircraft structures, propulsion, avionics, defense systems' },
  { id: 'automotive', name: 'Automotive', standards: ['IATF 16949', 'APQP', 'PPAP'], desc: 'Powertrain, chassis, body, EV battery systems' },
  { id: 'oil_gas', name: 'Oil & Gas', standards: ['API', 'ASME', 'NACE'], desc: 'Upstream equipment, refinery, pipeline, subsea systems' },
  { id: 'medical', name: 'Medical Devices', standards: ['ISO 13485', 'FDA 21 CFR', 'IEC 60601'], desc: 'Implants, instruments, diagnostics, Class I-III devices' },
  { id: 'heavy_industry', name: 'Heavy Industry', standards: ['ISO 9001', 'OSHA', 'ANSI'], desc: 'Mining, construction, material handling, heavy machinery' },
  { id: 'electronics', name: 'Electronics & Semiconductor', standards: ['IPC', 'JEDEC', 'ISO 14644'], desc: 'PCB assembly, cleanroom, packaging, testing' },
  { id: 'power_gen', name: 'Power Generation', standards: ['ASME BPVC', 'IEEE', 'NERC'], desc: 'Turbines, boilers, nuclear, renewable systems' },
  { id: 'consumer', name: 'Consumer Products', standards: ['UL', 'CE', 'FCC'], desc: 'Appliances, furniture, packaging, mass production' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/health', desc: 'Forge status, guild count, agent count' },
  { method: 'GET', path: '/stats', desc: 'Full forge statistics and capabilities' },
  { method: 'GET', path: '/guilds', desc: 'All 15 guilds with agent rosters' },
  { method: 'GET', path: '/domains', desc: '8 engineering domains with standards' },
  { method: 'GET', path: '/pipeline/stages', desc: '50-stage manufacturing pipeline' },
  { method: 'GET', path: '/templates', desc: 'Project templates by domain' },
  { method: 'GET', path: '/standards', desc: 'Industry standards catalog' },
  { method: 'POST', path: '/analyze', desc: 'Manufacturing feasibility analysis' },
  { method: 'POST', path: '/quality/check', desc: 'Quality gate inspection' },
  { method: 'POST', path: '/council/review', desc: 'Trinity Council verdict' },
  { method: 'GET', path: '/materials/standards/:id', desc: 'Material-specific standards' },
];

export default function DaedalusForgePage() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<ForgeStats | null>(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => {});
    getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ept-bg)' }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 260, borderRight: '1px solid var(--ept-border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'var(--ept-bg-alt)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <Image src={theme === 'dark' ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={32} height={32} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: -0.3 }}>Echo Prime</span>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--ept-accent)', marginBottom: 12 }}>Daedalus Forge</div>

        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', marginBottom: 2, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
            background: activeSection === s.id ? 'var(--ept-accent-glow)' : 'transparent',
            color: activeSection === s.id ? 'var(--ept-accent)' : 'var(--ept-text-secondary)',
          }}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{s.icon}</span>
            {s.label}
          </button>
        ))}

        <div style={{ paddingTop: 24, borderTop: '1px solid var(--ept-border)', marginTop: 24 }}>
          <button onClick={toggleTheme} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 8, cursor: 'pointer', fontSize: 12, background: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
            {theme === 'dark' ? '☀ Day Mode' : '☾ Night Mode'}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 1000 }}>

        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 40 }}>⚒</span>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--ept-text)', letterSpacing: -0.8, margin: 0 }}>Daedalus Forge</h1>
                <p style={{ color: 'var(--ept-accent)', fontSize: 14, fontWeight: 500, margin: 0 }}>AI Manufacturing Intelligence Platform</p>
              </div>
            </div>
            <div className="accent-line" style={{ margin: '16px 0 24px' }} />
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ept-text-secondary)', marginBottom: 24 }}>
              Industrial-grade AI manufacturing intelligence running on Cloudflare&apos;s global edge. 50-stage manufacturing pipeline orchestrated by 15 specialized guilds with 80 AI agents across 8 engineering domains. Governed by the Trinity Council — SAGE (strategy), NYX (risk), and THORNE (quality) — ensuring every manufacturing decision meets industry standards.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 32 }}>
              {[
                { label: 'Guilds', value: health?.guilds || 15 },
                { label: 'Agents', value: health?.agents || 80 },
                { label: 'Domains', value: health?.domains || 8 },
                { label: 'Stages', value: health?.stages || 50 },
                { label: 'Status', value: health?.status === 'operational' ? 'LIVE' : '...' },
              ].map(c => (
                <div key={c.label} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '18px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ept-accent)' }}>{c.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-secondary)', marginTop: 4 }}>{c.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 16 }}>Platform Architecture</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { title: 'Guild System', desc: '15 specialized guilds, each with 4-6 AI agents trained on domain-specific manufacturing knowledge. Materials, structural, thermal, quality, automation, and 10 more.' },
                { title: '50-Stage Pipeline', desc: 'From requirements capture through commissioning. 5 phases: Discovery, Design, Validation, Manufacturing, Delivery. Each stage has defined inputs, outputs, and quality gates.' },
                { title: 'Trinity Council', desc: 'Three AI advisors — SAGE (strategic feasibility), NYX (risk & failure modes), THORNE (quality & standards) — provide consensus verdicts on critical manufacturing decisions.' },
                { title: 'Industry Standards', desc: 'Built-in compliance for AS9100, IATF 16949, ISO 13485, API, ASME BPVC, IPC, and dozens more. Domain-specific standard selection and gap analysis.' },
                { title: 'Quality Gates', desc: 'Automated quality checkpoints at every pipeline phase. Statistical process control, dimensional verification, NDT planning, and non-conformance tracking.' },
                { title: 'Domain Intelligence', desc: '8 engineering domains — aerospace, automotive, oil & gas, medical, heavy industry, electronics, power generation, and consumer products.' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--ept-surface)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GUILDS */}
        {activeSection === 'guilds' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Manufacturing Guilds</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>15 specialized guilds with {GUILDS.reduce((s, g) => s + g.agents, 0)} AI agents covering the full manufacturing lifecycle.</p>

            <div style={{ display: 'grid', gap: 10 }}>
              {GUILDS.map(g => (
                <div key={g.name} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)' }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ept-accent)', fontWeight: 500 }}>{g.domain}</div>
                    <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 4, lineHeight: 1.5 }}>{g.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ept-accent)' }}>{g.agents}</div>
                    <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>agents</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PIPELINE */}
        {activeSection === 'pipeline' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>50-Stage Manufacturing Pipeline</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>End-to-end manufacturing lifecycle in 5 phases with quality gates at every transition.</p>

            <div style={{ display: 'grid', gap: 20 }}>
              {PIPELINE_PHASES.map((p, i) => (
                <div key={p.phase} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ept-text)' }}>{p.phase}</div>
                      <div style={{ fontSize: 12, color: 'var(--ept-text-muted)' }}>{p.stages.length} stages</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {p.stages.map(s => (
                      <span key={s} style={{ fontSize: 12, padding: '5px 12px', background: `${p.color}15`, border: `1px solid ${p.color}30`, borderRadius: 20, color: p.color, fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DOMAINS */}
        {activeSection === 'domains' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Engineering Domains</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>8 industry verticals with domain-specific manufacturing knowledge, standards, and agent specialization.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {DOMAINS_LIST.map(d => (
                <div key={d.id} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ept-text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>{d.desc}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {d.standards.map(s => (
                      <span key={s} style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', background: 'var(--ept-accent-glow)', border: '1px solid var(--ept-accent)', borderRadius: 4, color: 'var(--ept-accent)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TRINITY COUNCIL */}
        {activeSection === 'council' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Trinity Council</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>Three AI advisors govern critical manufacturing decisions through independent analysis and consensus voting.</p>

            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { name: 'SAGE', role: 'Strategic Advisor', color: '#3b82f6', desc: 'Evaluates manufacturing feasibility, market viability, resource requirements, and strategic alignment. SAGE considers the business case — can this be manufactured profitably at scale? What supply chain risks exist? Is the timeline realistic?', expertise: ['Manufacturing feasibility', 'Cost modeling', 'Supply chain analysis', 'Strategic planning', 'Resource allocation'] },
                { name: 'NYX', role: 'Risk Analyst', color: '#ef4444', desc: 'Identifies failure modes, safety hazards, regulatory risks, and quality threats. NYX runs mental FMEA on every design decision — what can go wrong, how bad is it, and how do we prevent it? Pessimistic by design, essential by function.', expertise: ['FMEA analysis', 'HAZOP studies', 'Regulatory compliance', 'Failure prediction', 'Safety assessment'] },
                { name: 'THORNE', role: 'Quality Guardian', color: '#22c55e', desc: 'Enforces quality standards, dimensional accuracy, process capability, and conformance requirements. THORNE ensures every part meets spec — statistical process control, GD&T verification, and industry standard compliance.', expertise: ['Quality assurance', 'SPC analysis', 'Standards compliance', 'Dimensional control', 'Process capability'] },
              ].map(c => (
                <div key={c.name} style={{ background: 'var(--ept-card-bg)', border: `1px solid ${c.color}40`, borderRadius: 12, padding: '24px', borderLeft: `4px solid ${c.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: c.color }}>{c.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ept-text)' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>{c.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>{c.desc}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {c.expertise.map(e => (
                      <span key={e} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--ept-surface)', borderRadius: 20, color: 'var(--ept-text-muted)' }}>{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, background: 'var(--ept-surface)', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Consensus Protocol</div>
              <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.7 }}>
                All three advisors independently analyze every decision. If 2 of 3 agree, the consensus carries. If all 3 disagree, the decision is escalated with full reasoning from each advisor. Confidence scores (0-100) accompany every recommendation. Decisions below 70% confidence are flagged for human review.
              </div>
            </div>
          </section>
        )}

        {/* STANDARDS */}
        {activeSection === 'standards' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Industry Standards</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>Built-in compliance checking against major manufacturing and quality standards.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { std: 'AS9100D', org: 'SAE/IAQG', desc: 'Aerospace quality management system requirements.' },
                { std: 'IATF 16949', org: 'IATF', desc: 'Automotive quality management system requirements.' },
                { std: 'ISO 13485', org: 'ISO', desc: 'Medical devices quality management systems.' },
                { std: 'ASME BPVC', org: 'ASME', desc: 'Boiler and pressure vessel code.' },
                { std: 'API 6A/6D', org: 'API', desc: 'Wellhead and christmas tree equipment.' },
                { std: 'NADCAP', org: 'PRI', desc: 'Special process accreditation (heat treat, NDT, etc).' },
                { std: 'IPC-A-610', org: 'IPC', desc: 'Acceptability of electronic assemblies.' },
                { std: 'ISO 14644', org: 'ISO', desc: 'Cleanroom and associated controlled environments.' },
                { std: 'NACE MR0175', org: 'NACE', desc: 'Sulfide stress cracking resistant materials.' },
                { std: 'MIL-STD-810', org: 'DoD', desc: 'Environmental engineering considerations.' },
              ].map(s => (
                <div key={s.std} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-accent)' }}>{s.std}</span>
                    <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{s.org}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ept-text-secondary)', marginTop: 4 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* API REFERENCE */}
        {activeSection === 'api' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>API Reference</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 8 }}>
              Base URL: <code style={{ color: 'var(--ept-accent)', background: 'var(--ept-code-bg)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>https://daedalus-forge.bmcii1976.workers.dev</code>
            </p>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 12, marginBottom: 20 }}>All POST endpoints accept JSON bodies and require X-Echo-API-Key for write operations.</p>

            <div style={{ display: 'grid', gap: 8 }}>
              {API_ENDPOINTS.map(e => (
                <div key={e.path} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 2fr', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'var(--ept-surface)', borderRadius: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: e.method === 'GET' ? '#22c55e' : '#3b82f6', background: e.method === 'GET' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', padding: '3px 8px', borderRadius: 4, textAlign: 'center' }}>{e.method}</span>
                  <code style={{ fontSize: 12, color: 'var(--ept-text)', fontFamily: "'JetBrains Mono', monospace" }}>{e.path}</code>
                  <span style={{ fontSize: 12, color: 'var(--ept-text-secondary)' }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
