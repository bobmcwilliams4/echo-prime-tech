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

// ── Section definitions ──
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
  { type: 'cylinder', desc: 'Cylindrical geometry — shafts, pins, rollers, tubes', params: 'radius, height' },
  { type: 'box', desc: 'Rectangular prism — plates, blocks, brackets, housings', params: 'width, height, depth' },
  { type: 'sphere', desc: 'Spherical geometry — ball joints, bearings, domes', params: 'radius' },
  { type: 'ring', desc: 'Toroidal ring — seals, gaskets, jewelry, bearings', params: 'outer_radius, inner_radius, height' },
  { type: 'cone', desc: 'Conical geometry — nozzles, funnels, tapers', params: 'radius, height' },
  { type: 'torus', desc: 'Full torus — O-rings, handles, bezels', params: 'major_radius, minor_radius' },
  { type: 'pendant', desc: 'Pendant/medallion — decorative, structural bosses', params: 'width, height, depth' },
  { type: 'enclosure', desc: 'Hollow box enclosure — housings, PCB cases, shells', params: 'width, height, depth, wall_thickness' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/health', desc: 'Service health and capabilities' },
  { method: 'GET', path: '/stats', desc: 'Material and primitive statistics' },
  { method: 'GET', path: '/materials', desc: 'List all 20 engineering materials' },
  { method: 'GET', path: '/materials/:id', desc: 'Material detail by ID' },
  { method: 'POST', path: '/materials/compare', desc: 'Side-by-side material comparison' },
  { method: 'POST', path: '/materials/select', desc: 'AI-recommended material selection' },
  { method: 'POST', path: '/primitives/create', desc: 'Create parametric primitive' },
  { method: 'POST', path: '/assembly/create', desc: 'Create multi-part assembly' },
  { method: 'POST', path: '/bom/generate', desc: 'Bill of Materials with costing' },
  { method: 'POST', path: '/export/scad', desc: 'Export to OpenSCAD format' },
  { method: 'POST', path: '/engineering/stress', desc: 'Von Mises stress analysis' },
  { method: 'POST', path: '/engineering/pressure', desc: 'Lamé thick-wall pressure analysis' },
  { method: 'POST', path: '/engineering/tolerance', desc: 'Statistical tolerance stackup' },
  { method: 'POST', path: '/engineering/weight', desc: 'Weight calculation' },
  { method: 'POST', path: '/dfm/analyze', desc: 'Design-for-Manufacturing analysis' },
  { method: 'POST', path: '/tools/ring-size', desc: 'Ring size calculator' },
];

export default function EchoCADPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialFilter, setMaterialFilter] = useState('');
  const [stressResult, setStressResult] = useState<StressResult | null>(null);
  const [stressForm, setStressForm] = useState({ force: '10000', area: '100', material: 'steel_1018' });
  const [dfmResult, setDfmResult] = useState<DFMResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => {});
    getStats().then(setStats).catch(() => {});
    getMaterials().then(r => setMaterials(r.materials || [])).catch(() => {});
  }, []);

  async function runStress() {
    setLoading(true);
    try {
      const r = await analyzeStress(parseFloat(stressForm.force), parseFloat(stressForm.area), stressForm.material);
      setStressResult(r);
    } catch { setStressResult(null); }
    setLoading(false);
  }

  async function runDFM() {
    setLoading(true);
    try {
      const r = await analyzeDFM('cylinder', 'aluminum_6061', { radius: 25, height: 100 });
      setDfmResult(r);
    } catch { setDfmResult(null); }
    setLoading(false);
  }

  const filteredMaterials = materials.filter(m =>
    !materialFilter || m.name.toLowerCase().includes(materialFilter.toLowerCase()) || m.category.toLowerCase().includes(materialFilter.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ept-bg)' }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 260, borderRight: '1px solid var(--ept-border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'var(--ept-bg-alt)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <Image src={theme === 'dark' ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={32} height={32} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: -0.3 }}>Echo Prime</span>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--ept-accent)', marginBottom: 12 }}>EchoCAD</div>

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

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--ept-border)', marginTop: 24 }}>
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
              <span style={{ fontSize: 40 }}>◈</span>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--ept-text)', letterSpacing: -0.8, margin: 0 }}>EchoCAD</h1>
                <p style={{ color: 'var(--ept-accent)', fontSize: 14, fontWeight: 500, margin: 0 }}>AI-Native Parametric CAD Engine</p>
              </div>
            </div>
            <div className="accent-line" style={{ margin: '16px 0 24px' }} />
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ept-text-secondary)', marginBottom: 24 }}>
              Cloud-native parametric CAD engine running on Cloudflare&apos;s global edge network. 20 engineering-grade materials with full mechanical properties, 8 primitive types with volume/weight calculations, OpenSCAD code generation, BOM costing, and real-time engineering analysis — Von Mises stress, Lamé pressure vessel, statistical tolerance stackup, and DFM scoring.
            </p>

            {/* Status cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Materials', value: health?.materials || 20, unit: 'alloys' },
                { label: 'Categories', value: health?.categories || 10, unit: 'classes' },
                { label: 'Primitives', value: health?.primitives || 8, unit: 'types' },
                { label: 'Status', value: health?.status === 'operational' ? 'LIVE' : '...', unit: 'edge' },
              ].map(c => (
                <div key={c.label} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-accent)' }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 }}>{c.unit}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text-secondary)', marginTop: 4 }}>{c.label}</div>
                </div>
              ))}
            </div>

            {/* Key Features */}
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 16 }}>Key Capabilities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { title: 'Materials Intelligence', desc: '20 engineering materials with density, yield/tensile strength, elongation, hardness, thermal conductivity, machinability rating, and cost per kg.' },
                { title: 'Parametric Primitives', desc: '8 primitive types — cylinder, box, sphere, ring, cone, torus, pendant, enclosure — with automatic volume and weight calculations.' },
                { title: 'Engineering Analysis', desc: 'Von Mises stress analysis, Lamé thick-wall pressure vessel analysis, RSS tolerance stackup, and automated weight estimation.' },
                { title: 'DFM Optimization', desc: 'Design-for-Manufacturing scoring with issue detection, recommendations for wall thickness, aspect ratio, undercuts, and feature accessibility.' },
                { title: 'OpenSCAD Export', desc: 'Automatic generation of OpenSCAD code for any assembly. CSG operations, material annotations, and print-ready geometry.' },
                { title: 'BOM Generation', desc: 'Full Bill of Materials with per-part volume, weight, material cost, and assembly totals. Ready for procurement.' },
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
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>20 engineering-grade materials with full mechanical, thermal, and manufacturing properties.</p>

            <input placeholder="Filter by name or category..." value={materialFilter} onChange={e => setMaterialFilter(e.target.value)} style={{
              width: '100%', padding: '10px 14px', marginBottom: 20, border: '1px solid var(--ept-border)', borderRadius: 8, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13,
            }} />

            <div style={{ display: 'grid', gap: 10 }}>
              {filteredMaterials.map(m => (
                <div key={m.id} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)' }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ept-accent)', fontWeight: 500 }}>{m.category} — {m.id}</div>
                    <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 4 }}>
                      Density: {m.density} g/cm³ · Yield: {m.yield_strength} MPa · Tensile: {m.tensile_strength} MPa · Hardness: {m.hardness}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--ept-text-secondary)' }}>
                    <div>${m.cost_per_kg}/kg</div>
                    <div style={{ color: 'var(--ept-text-muted)' }}>{m.machinability}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PRIMITIVES */}
        {activeSection === 'primitives' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Primitive Types</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>8 parametric geometry primitives with automatic volume, weight, and OpenSCAD code generation.</p>

            <div style={{ display: 'grid', gap: 12 }}>
              {PRIMITIVE_TYPES.map(p => (
                <div key={p.type} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', textTransform: 'capitalize' }}>{p.type}</div>
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
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>Real-time Von Mises stress, Lamé pressure vessel, and tolerance stackup analysis.</p>

            <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 16 }}>Stress Analysis — Live Demo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Force (N)</label>
                  <input value={stressForm.force} onChange={e => setStressForm(f => ({ ...f, force: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Area (mm²)</label>
                  <input value={stressForm.area} onChange={e => setStressForm(f => ({ ...f, area: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 4 }}>Material</label>
                  <select value={stressForm.material} onChange={e => setStressForm(f => ({ ...f, material: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 6, background: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13 }}>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <button onClick={runStress} disabled={loading} style={{ padding: '8px 20px', background: 'var(--ept-accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  {loading ? '...' : 'Analyze'}
                </button>
              </div>

              {stressResult && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--ept-surface)', borderRadius: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ept-accent)' }}>{stressResult.applied_stress_mpa?.toFixed(1)}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Applied (MPa)</div></div>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ept-text)' }}>{stressResult.yield_strength_mpa}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Yield (MPa)</div></div>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: stressResult.safety_factor >= 2 ? '#22c55e' : '#ef4444' }}>{stressResult.safety_factor?.toFixed(2)}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Safety Factor</div></div>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: stressResult.verdict === 'SAFE' ? '#22c55e' : '#ef4444' }}>{stressResult.verdict}</div><div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Verdict</div></div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { title: 'Lamé Pressure Analysis', desc: 'Thick-wall pressure vessel analysis using Lamé equations. Calculates hoop stress, radial stress, von Mises equivalent, and safety factor.' },
                { title: 'Tolerance Stackup', desc: 'Statistical RSS tolerance analysis for multi-dimension assemblies. Worst-case and statistical min/max bounds.' },
                { title: 'Weight Estimation', desc: 'Automatic weight calculation from geometry volume and material density. Supports all 20 materials and 8 primitives.' },
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
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>Automated DFM analysis with issue detection, scoring, and optimization recommendations.</p>

            <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', margin: 0 }}>DFM Demo — Aluminum 6061 Cylinder (R25 H100)</h3>
                <button onClick={runDFM} disabled={loading} style={{ padding: '8px 20px', background: 'var(--ept-accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  {loading ? 'Analyzing...' : 'Run DFM'}
                </button>
              </div>

              {dfmResult && (
                <div style={{ padding: 16, background: 'var(--ept-surface)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                    <div><span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>SCORE</span><div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-accent)' }}>{dfmResult.score}/100</div></div>
                    <div><span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>GRADE</span><div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)' }}>{dfmResult.grade}</div></div>
                  </div>
                  {dfmResult.issues?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Issues Found:</div>
                      {dfmResult.issues.map((i, idx) => <div key={idx} style={{ fontSize: 12, color: 'var(--ept-text-secondary)', paddingLeft: 12 }}>• {i}</div>)}
                    </div>
                  )}
                  {dfmResult.recommendations?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 4 }}>Recommendations:</div>
                      {dfmResult.recommendations.map((r, idx) => <div key={idx} style={{ fontSize: 12, color: 'var(--ept-text-secondary)', paddingLeft: 12 }}>• {r}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ background: 'var(--ept-surface)', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>DFM Check Categories</div>
              <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.8 }}>
                <strong>Wall Thickness</strong> — Minimum 1mm for metals, 2mm for plastics. Flag undersize walls that risk warping or cracking.<br/>
                <strong>Aspect Ratio</strong> — Height-to-width ratio under 10:1. High ratios cause instability during machining, printing, or casting.<br/>
                <strong>Feature Accessibility</strong> — Internal features must be reachable by tooling. Deep pockets, narrow slots, and undercuts flagged.<br/>
                <strong>Draft Angles</strong> — Cast and molded parts require minimum 1° draft. Missing draft = stuck parts and die damage.<br/>
                <strong>Material Compatibility</strong> — Flag material/process mismatches. Titanium + FDM printing, brittle alloy + thin wall, etc.
              </div>
            </div>
          </section>
        )}

        {/* EXPORT */}
        {activeSection === 'export' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Export & Integration</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>Export assemblies as OpenSCAD code or structured BOM data for downstream manufacturing workflows.</p>

            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { title: 'OpenSCAD Export', desc: 'Full CSG tree with module definitions, material annotations, and coordinate transforms. Compatible with OpenSCAD 2024+. Generates union/difference/intersection operations for multi-part assemblies.', code: 'POST /export/scad → { scad: "module assembly() { ... }", parts: 5 }' },
                { title: 'BOM Generation', desc: 'Detailed Bill of Materials with per-part breakdown: primitive type, material, volume (cm³), weight (kg), and material cost (USD). Assembly totals included.', code: 'POST /bom/generate → { total_weight_kg, total_cost_usd, entries: [...] }' },
                { title: 'Assembly Projects', desc: 'Save and manage assemblies in KV storage. Named projects with creation timestamps, part lists, and metadata. Retrieve by ID for iterative refinement.', code: 'POST /assembly/create → { id, name, parts, created }' },
                { title: 'Material Selection', desc: 'AI-guided material recommendation based on application requirements: strength, temperature, corrosion resistance, cost constraints, and machinability needs.', code: 'POST /materials/select → { recommendations: Material[] }' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '18px 22px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{f.desc}</div>
                  <code style={{ fontSize: 11, color: 'var(--ept-accent)', background: 'var(--ept-code-bg)', padding: '6px 10px', borderRadius: 6, display: 'block' }}>{f.code}</code>
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
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 12, marginBottom: 20 }}>All POST endpoints accept JSON bodies. Responses are JSON. No authentication required for read endpoints.</p>

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
