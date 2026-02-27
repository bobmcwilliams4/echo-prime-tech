'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import {
  getHealth,
  getStats,
  getMaterials,
  analyzeStress,
  analyzeDFM,
  type Material,
  type HealthResponse,
  type StatsResponse,
  type StressResult,
  type DFMResult,
} from '../../lib/echocad-api';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'materials', label: 'Materials DB', icon: '⬡' },
  { id: 'primitives', label: 'Primitives', icon: '△' },
  { id: 'engineering', label: 'Engineering', icon: '⚙' },
  { id: 'dfm', label: 'DFM Analysis', icon: '✦' },
  { id: 'export', label: 'Export', icon: '↗' },
  { id: 'api', label: 'API Reference', icon: '⟨⟩' },
] as const;

const PRIMITIVE_TYPES = [
  { type: 'cylinder', desc: 'Cylindrical geometry — shafts, pins, rollers, tubes', params: 'diameter, height' },
  { type: 'box', desc: 'Rectangular prism — plates, blocks, brackets, housings', params: 'width, height, depth' },
  { type: 'sphere', desc: 'Spherical geometry — ball joints, bearings, domes', params: 'diameter' },
  { type: 'ring', desc: 'Toroidal ring — seals, gaskets, jewelry, bearings', params: 'outer_diameter, inner_diameter, height' },
  { type: 'cone', desc: 'Conical geometry — nozzles, funnels, tapers', params: 'diameter, height' },
  { type: 'torus', desc: 'Full torus — O-rings, handles, bezels', params: 'major_diameter, minor_diameter' },
  { type: 'pendant', desc: 'Pendant/medallion — decorative, structural bosses', params: 'loop_diameter, wire_diameter, body_length' },
  { type: 'enclosure', desc: 'Hollow box enclosure — housings, PCB cases, shells', params: 'width, height, depth, wall_thickness' },
  { type: 'hex', desc: 'Hexagonal prism — hex bolts, nuts, standoffs', params: 'across_flats, height' },
  { type: 'pipe', desc: 'Hollow cylinder — tubing, conduit, pressure vessels', params: 'outer_diameter, inner_diameter, length' },
  { type: 'flange', desc: 'Flat ring plate — pipe flanges, mounting plates', params: 'outer_diameter, inner_diameter, thickness, bolt_circle, bolt_count' },
  { type: 'i_beam', desc: 'Structural I/H beam — frames, structural members', params: 'height, width, flange_thickness, web_thickness, length' },
  { type: 'channel', desc: 'C-channel structural member', params: 'height, width, thickness, length' },
  { type: 'slot', desc: 'Elongated hole / keyway geometry', params: 'length, width, depth' },
  { type: 'thread_profile', desc: 'Threaded fastener profile — bolts, screws', params: 'major_diameter, pitch, length' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/', desc: 'Service info with full capability listing' },
  { method: 'GET', path: '/health', desc: 'Status, version, timestamp' },
  { method: 'GET', path: '/stats', desc: 'Material count, primitive types, calculator list' },
  { method: 'GET', path: '/materials', desc: 'All 38 materials (filterable by ?category=)' },
  { method: 'GET', path: '/materials/:id', desc: 'Single material detail (case-insensitive)' },
  { method: 'POST', path: '/materials/compare', desc: 'Side-by-side material comparison' },
  { method: 'POST', path: '/materials/select', desc: 'Filter materials by requirements' },
  { method: 'POST', path: '/primitives/create', desc: 'Create parametric primitive with volume/weight' },
  { method: 'POST', path: '/assembly/create', desc: 'Multi-part assembly with BOM' },
  { method: 'POST', path: '/assembly/bom', desc: 'BOM from parts array' },
  { method: 'POST', path: '/boolean/union', desc: 'CSG union of parts' },
  { method: 'POST', path: '/boolean/difference', desc: 'CSG difference of parts' },
  { method: 'POST', path: '/boolean/intersection', desc: 'CSG intersection of parts' },
  { method: 'POST', path: '/engineering/stress', desc: 'Von Mises stress analysis' },
  { method: 'POST', path: '/engineering/pressure', desc: 'Lame thick-wall pressure vessel' },
  { method: 'POST', path: '/engineering/tolerance', desc: 'RSS statistical tolerance stackup' },
  { method: 'POST', path: '/engineering/dfm', desc: 'DFM scoring (0-100, grade A-F)' },
  { method: 'POST', path: '/engineering/fatigue', desc: 'Goodman fatigue life analysis' },
  { method: 'POST', path: '/engineering/thermal', desc: 'Cylindrical thermal analysis' },
  { method: 'POST', path: '/engineering/thread', desc: 'Thread analysis (ISO/UNC/UNF/ACME/NPT)' },
  { method: 'POST', path: '/engineering/safety-factor', desc: 'Multi-mode safety factor' },
  { method: 'POST', path: '/engineering/beam', desc: 'Euler-Bernoulli beam deflection' },
  { method: 'POST', path: '/engineering/weld', desc: 'AWS D1.1 weld capacity' },
  { method: 'POST', path: '/engineering/bolt', desc: 'VDI 2230 bolt preload' },
  { method: 'POST', path: '/engineering/weight', desc: 'Weight calculation' },
  { method: 'POST', path: '/quality/nace', desc: 'NACE MR0175 sour service compliance' },
  { method: 'POST', path: '/quality/fmea', desc: 'FMEA analysis (RPN scoring)' },
  { method: 'POST', path: '/quality/inspection', desc: 'GD&T inspection plan' },
  { method: 'POST', path: '/manufacturing/cnc', desc: 'CNC G-code estimation' },
  { method: 'POST', path: '/manufacturing/cost', desc: 'Manufacturing cost estimation' },
  { method: 'POST', path: '/manufacturing/tooling', desc: 'Tool selection' },
  { method: 'POST', path: '/manufacturing/process-plan', desc: 'Full process plan' },
  { method: 'POST', path: '/export/scad', desc: 'OpenSCAD export' },
  { method: 'POST', path: '/export/stl', desc: 'ASCII STL mesh' },
  { method: 'POST', path: '/export/dxf', desc: 'DXF 2D drawing' },
  { method: 'POST', path: '/export/gcode', desc: 'G-code generation' },
  { method: 'POST', path: '/export/bom', desc: 'Bill of Materials with costing' },
  { method: 'POST', path: '/export/drawing', desc: 'Engineering drawing package' },
  { method: 'POST', path: '/ai/text-to-cad', desc: 'Natural language to geometry' },
  { method: 'POST', path: '/ai/copilot', desc: 'Engineering Q&A' },
  { method: 'POST', path: '/ai/optimize', desc: 'AI design optimization' },
  { method: 'POST', path: '/ai/standards-check', desc: 'Standards compliance check' },
  { method: 'POST', path: '/projects', desc: 'Create/list projects (D1)' },
  { method: 'GET', path: '/tools/ring-size', desc: 'Ring size lookup (US 3-14)' },
];

export default function EchoCADPage() {
  const { isDark, toggle } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialFilter, setMaterialFilter] = useState('');
  const [stressResult, setStressResult] = useState<StressResult | null>(null);
  const [stressForm, setStressForm] = useState({ force: '10000', area: '100', material: 'aisi-4130' });
  const [stressError, setStressError] = useState('');
  const [dfmResult, setDfmResult] = useState<DFMResult | null>(null);
  const [dfmForm, setDfmForm] = useState({ material: 'al-6061-t6', tolerances: 'standard', surface_finish_ra: '3.2' });
  const [dfmError, setDfmError] = useState('');
  const [loading, setLoading] = useState('');

  useEffect(() => {
    getHealth().then(setHealth).catch(() => {});
    getStats().then(setStats).catch(() => {});
    getMaterials().then(setMaterials).catch(() => {});
  }, []);

  async function runStress() {
    setLoading('stress');
    setStressError('');
    try {
      const r = await analyzeStress(parseFloat(stressForm.force), parseFloat(stressForm.area), stressForm.material);
      setStressResult(r);
    } catch (e) {
      setStressError((e as Error).message);
      setStressResult(null);
    }
    setLoading('');
  }

  async function runDFM() {
    setLoading('dfm');
    setDfmError('');
    try {
      const r = await analyzeDFM({
        material: dfmForm.material,
        tolerances: dfmForm.tolerances,
        surface_finish_ra: parseFloat(dfmForm.surface_finish_ra),
      });
      setDfmResult(r);
    } catch (e) {
      setDfmError((e as Error).message);
      setDfmResult(null);
    }
    setLoading('');
  }

  const filteredMaterials = materials.filter(m =>
    !materialFilter ||
    m.name.toLowerCase().includes(materialFilter.toLowerCase()) ||
    m.category.toLowerCase().includes(materialFilter.toLowerCase()) ||
    m.id.toLowerCase().includes(materialFilter.toLowerCase())
  );

  const materialCount = stats?.materials || materials.length || 38;
  const primitiveCount = stats?.primitiveTypes?.length || 15;
  const calcCount = stats?.engineeringCalcs?.length || 12;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ept-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, borderRight: '1px solid var(--ept-border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'var(--ept-bg-alt)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={32} height={32} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: -0.3 }}>Echo Prime</span>
        </Link>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--ept-accent)', marginBottom: 12 }}>EchoCAD v2.0</div>
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
          <button onClick={toggle} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 8, cursor: 'pointer', fontSize: 12, background: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
            {isDark ? '☀ Day Mode' : '☾ Night Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 1000 }}>

        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 40 }}>◈</span>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--ept-text)', letterSpacing: -0.8, margin: 0 }}>EchoCAD</h1>
                <p style={{ color: 'var(--ept-accent)', fontSize: 14, fontWeight: 500, margin: 0 }}>AI-Native Parametric CAD Engine v2.0</p>
              </div>
            </div>
            <div className="accent-line" style={{ margin: '16px 0 24px' }} />
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ept-text-secondary)', marginBottom: 24 }}>
              Cloud-native parametric CAD engine running on Cloudflare&apos;s global edge network. {materialCount} engineering-grade materials with 17 properties each, {primitiveCount} primitive types with volume/weight/SCAD calculations, {calcCount} engineering calculators, AI-powered design optimization, and 6 export formats — all accessible via REST API from 300+ global locations.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Materials', value: materialCount, unit: 'alloys' },
                { label: 'Calculators', value: calcCount, unit: 'analyses' },
                { label: 'Primitives', value: primitiveCount, unit: 'types' },
                { label: 'Status', value: health?.status === 'ok' ? 'LIVE' : '...', unit: 'edge' },
              ].map(c => (
                <div key={c.label} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-accent)' }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 }}>{c.unit}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text-secondary)', marginTop: 4 }}>{c.label}</div>
                </div>
              ))}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 16 }}>Key Capabilities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { title: 'Materials Intelligence', desc: `${materialCount} engineering materials across 13 categories — steel, aluminum, titanium, copper, nickel, specialty, precious, and oilfield alloys. Each with 17 properties including NACE compliance.` },
                { title: 'Parametric Primitives', desc: `${primitiveCount} primitive types — cylinder, box, sphere, ring, cone, torus, pendant, enclosure, hex, pipe, flange, I-beam, channel, slot, and thread profile.` },
                { title: 'Engineering Analysis', desc: `${calcCount} calculators: Von Mises stress, Lame pressure vessel, tolerance stackup, DFM scoring, Goodman fatigue, thermal analysis, thread analysis, beam deflection, weld capacity, bolt preload.` },
                { title: 'AI-Powered Design', desc: 'Text-to-CAD natural language geometry generation, engineering copilot Q&A, AI design optimization, and automated standards compliance checking.' },
                { title: 'Multi-Format Export', desc: 'OpenSCAD CSG, ASCII STL mesh, DXF 2D drawing, G-code CNC, Bill of Materials with costing, and engineering drawing packages.' },
                { title: 'Quality & Manufacturing', desc: 'NACE MR0175 sour service compliance, FMEA analysis, GD&T inspection plans, CNC estimation, cost analysis, and full process planning.' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--ept-surface)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MATERIALS */}
        {activeSection === 'materials' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Materials Database</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>{materialCount} engineering-grade materials with 17 mechanical, thermal, and manufacturing properties each.</p>
            <input placeholder="Filter by name, category, or ID..." value={materialFilter} onChange={e => setMaterialFilter(e.target.value)} style={{
              width: '100%', padding: '10px 14px', marginBottom: 20, border: '1px solid var(--ept-border)', borderRadius: 8, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13,
            }} />
            <div style={{ display: 'grid', gap: 10 }}>
              {filteredMaterials.map(m => (
                <div key={m.id} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)' }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ept-accent)', fontWeight: 500 }}>{m.category} — {m.id}</div>
                    <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 4 }}>
                      Density: {m.density_g_cm3} g/cm3 · Yield: {m.yield_mpa} MPa · Tensile: {m.tensile_mpa} MPa · HRC: {m.hardness_hrc} · E: {m.elastic_modulus_gpa} GPa
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 2 }}>
                      {m.nace_compliant && <span style={{ color: '#22c55e', fontWeight: 600, marginRight: 8 }}>NACE</span>}
                      {m.applications?.slice(0, 3).join(' · ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--ept-text-secondary)' }}>
                    <div style={{ fontWeight: 600 }}>${m.cost_usd_kg}/kg</div>
                    <div style={{ color: 'var(--ept-text-muted)' }}>Machinability: {m.machinability_rating}%</div>
                  </div>
                </div>
              ))}
              {filteredMaterials.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 14 }}>
                  {materials.length === 0 ? 'Loading materials...' : 'No materials match your filter.'}
                </div>
              )}
            </div>
          </section>
        )}

        {/* PRIMITIVES */}
        {activeSection === 'primitives' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Primitive Types</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>{primitiveCount} parametric geometry primitives with automatic volume, weight, surface area, bounding box, and OpenSCAD code generation.</p>
            <div style={{ display: 'grid', gap: 12 }}>
              {PRIMITIVE_TYPES.map(p => (
                <div key={p.type} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', textTransform: 'capitalize' }}>{p.type.replace('_', ' ')}</div>
                    <code style={{ fontSize: 11, color: 'var(--ept-accent)', background: 'var(--ept-code-bg)', padding: '4px 10px', borderRadius: 6 }}>{p.params}</code>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', marginTop: 6, lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ENGINEERING */}
        {activeSection === 'engineering' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Engineering Analysis</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>{calcCount} real-time engineering calculators — Von Mises stress, Lame pressure, Goodman fatigue, tolerance stackup, beam deflection, thread analysis, and more.</p>

            <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 16 }}>Von Mises Stress Analysis — Live Demo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Force (N)</label>
                  <input value={stressForm.force} onChange={e => setStressForm(f => ({ ...f, force: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Area (mm2)</label>
                  <input value={stressForm.area} onChange={e => setStressForm(f => ({ ...f, area: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Material</label>
                  <select value={stressForm.material} onChange={e => setStressForm(f => ({ ...f, material: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }}>
                    {materials.length > 0 ? materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>) : <option value="aisi-4130">AISI 4130</option>}
                  </select>
                </div>
                <button onClick={runStress} disabled={loading === 'stress'} style={{ padding: '8px 20px', background: 'var(--ept-accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, opacity: loading === 'stress' ? 0.6 : 1 }}>
                  {loading === 'stress' ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>

              {stressError && (
                <div style={{ marginTop: 12, padding: '8px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 6, fontSize: 13, color: '#ef4444' }}>{stressError}</div>
              )}

              {stressResult && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--ept-surface)', borderRadius: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ept-accent)' }}>{stressResult.vonMises_mpa?.toFixed(1)}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Von Mises (MPa)</div></div>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ept-text)' }}>{stressResult.yield_mpa}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Yield (MPa)</div></div>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: (stressResult.safetyFactor ?? 0) >= 2 ? '#22c55e' : '#ef4444' }}>{stressResult.safetyFactor?.toFixed(2)}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Safety Factor</div></div>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: stressResult.status === 'PASS' ? '#22c55e' : '#ef4444' }}>{stressResult.status}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Verdict</div></div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { title: 'Lame Pressure Analysis', desc: 'Thick-wall pressure vessel analysis using Lame equations. Calculates hoop stress, radial stress, burst pressure, and safety factor.' },
                { title: 'Goodman Fatigue Life', desc: 'Fatigue analysis using Goodman criterion. Endurance limit, Goodman ratio, estimated cycles to failure.' },
                { title: 'Tolerance Stackup', desc: 'Statistical RSS tolerance analysis for multi-dimension assemblies. Worst-case and statistical bounds with Cpk capability.' },
                { title: 'Thread Analysis', desc: 'ISO metric, UNC, UNF, ACME, and NPT thread calculations. Tensile area, stripping strength, recommended torque.' },
                { title: 'Beam Deflection', desc: 'Euler-Bernoulli beam analysis for simply supported and cantilever beams. Max deflection, max stress, bending moment.' },
                { title: 'Weld Capacity', desc: 'AWS D1.1 weld sizing and capacity analysis. Throat area, load capacity, utilization ratio.' },
                { title: 'Bolt Preload', desc: 'VDI 2230 bolt/joint analysis. Clamp force, embedment loss, joint separation, fatigue safety factor.' },
                { title: 'Material Comparison', desc: 'Side-by-side comparison of material properties. Strength-to-weight, cost-to-performance, and machinability ranking.' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--ept-surface)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DFM */}
        {activeSection === 'dfm' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Design for Manufacturing</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>Automated DFM analysis with scoring (0-100), grade (A-F), cost multiplier estimation, and optimization recommendations.</p>

            <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 16 }}>DFM Analysis — Live Demo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Material</label>
                  <select value={dfmForm.material} onChange={e => setDfmForm(f => ({ ...f, material: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }}>
                    {materials.length > 0 ? materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>) : <option value="al-6061-t6">Al 6061-T6</option>}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Tolerances</label>
                  <select value={dfmForm.tolerances} onChange={e => setDfmForm(f => ({ ...f, tolerances: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }}>
                    <option value="standard">Standard</option>
                    <option value="precision">Precision</option>
                    <option value="ultra-precision">Ultra-Precision</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Surface Finish Ra (um)</label>
                  <input value={dfmForm.surface_finish_ra} onChange={e => setDfmForm(f => ({ ...f, surface_finish_ra: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }} />
                </div>
                <button onClick={runDFM} disabled={loading === 'dfm'} style={{ padding: '8px 20px', background: 'var(--ept-accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, opacity: loading === 'dfm' ? 0.6 : 1 }}>
                  {loading === 'dfm' ? 'Analyzing...' : 'Run DFM'}
                </button>
              </div>

              {dfmError && (
                <div style={{ marginTop: 12, padding: '8px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 6, fontSize: 13, color: '#ef4444' }}>{dfmError}</div>
              )}

              {dfmResult && (
                <div style={{ padding: 16, background: 'var(--ept-surface)', borderRadius: 8, marginTop: 16 }}>
                  <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
                    <div><span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>SCORE</span><div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-accent)' }}>{dfmResult.score}/100</div></div>
                    <div><span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>GRADE</span><div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)' }}>{dfmResult.grade}</div></div>
                    <div><span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>COST MULT.</span><div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text-secondary)' }}>{dfmResult.estimatedCostMultiplier}x</div></div>
                  </div>
                  {dfmResult.processRecommendation && (
                    <div style={{ fontSize: 13, color: 'var(--ept-accent)', marginBottom: 12 }}>Process: {dfmResult.processRecommendation}</div>
                  )}
                  {dfmResult.issues?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Issues Found:</div>
                      {dfmResult.issues.map((issue: string, idx: number) => <div key={idx} style={{ fontSize: 12, color: 'var(--ept-text-secondary)', paddingLeft: 12 }}>- {issue}</div>)}
                    </div>
                  )}
                  {dfmResult.suggestions?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 4 }}>Suggestions:</div>
                      {dfmResult.suggestions.map((sug: string, idx: number) => <div key={idx} style={{ fontSize: 12, color: 'var(--ept-text-secondary)', paddingLeft: 12 }}>- {sug}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ background: 'var(--ept-surface)', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>DFM Scoring Categories</div>
              <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.8 }}>
                <strong>Material Score</strong> — Machinability rating and material difficulty factor. High-machinability alloys score better.<br/>
                <strong>Feature Complexity</strong> — Number and type of manufacturing features. Simple geometries score highest.<br/>
                <strong>Tolerance Grade</strong> — Standard tolerances score well; precision and ultra-precision reduce score and increase cost multiplier.<br/>
                <strong>Surface Finish</strong> — Ra value impact on manufacturing difficulty. Lower Ra = higher cost, finer finish required.<br/>
                <strong>Overall Grade</strong> — A (90-100), B (75-89), C (60-74), D (40-59), F (&lt;40). Cost multiplier ranges from 1.0x to 3.5x+.
              </div>
            </div>
          </section>
        )}

        {/* EXPORT */}
        {activeSection === 'export' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Export & Integration</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>6 export formats for downstream manufacturing and CAD workflows.</p>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { title: 'OpenSCAD Export', desc: 'Full CSG tree with module definitions, material annotations, and coordinate transforms. Generates union/difference/intersection operations for multi-part assemblies.', code: 'POST /export/scad' },
                { title: 'STL Mesh Export', desc: 'ASCII STL format with triangulated mesh output. Compatible with all 3D printing slicers and CAD packages.', code: 'POST /export/stl' },
                { title: 'DXF 2D Drawing', desc: 'DXF R12 format 2D drawing exchange. Profiles, sections, and dimension annotations for CNC and laser cutting.', code: 'POST /export/dxf' },
                { title: 'G-code Generation', desc: 'CNC machine code with operations, tool changes, feeds/speeds, and cycle time estimation.', code: 'POST /export/gcode' },
                { title: 'Bill of Materials', desc: 'Detailed BOM with per-part breakdown: type, material, volume, weight, and material cost. Assembly totals included.', code: 'POST /export/bom' },
                { title: 'Engineering Drawing', desc: 'Complete drawing package with dimensions, tolerances, material callouts, and revision blocks.', code: 'POST /export/drawing' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '18px 22px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{f.desc}</div>
                  <code style={{ fontSize: 11, color: 'var(--ept-accent)', background: 'var(--ept-code-bg)', padding: '6px 10px', borderRadius: 6, display: 'inline-block' }}>{f.code}</code>
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
              Base URL: <code style={{ color: 'var(--ept-accent)', background: 'var(--ept-code-bg)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>https://echocad.bmcii1976.workers.dev</code>
            </p>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 12, marginBottom: 20 }}>{API_ENDPOINTS.length} endpoints. All POST endpoints accept JSON. No authentication required for read endpoints.</p>
            <div style={{ display: 'grid', gap: 6 }}>
              {API_ENDPOINTS.map(e => (
                <div key={`${e.method}-${e.path}`} style={{ display: 'grid', gridTemplateColumns: '70px 240px 1fr', gap: 12, alignItems: 'center', padding: '8px 14px', background: 'var(--ept-surface)', borderRadius: 8 }}>
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
