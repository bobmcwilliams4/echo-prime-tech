'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import {
  getHealth, getStats, getMaterials, compareMaterials,
  createPrimitive, analyzeStress, analyzeDFM, analyzeFatigue,
  analyzePressure, analyzeTolerances, analyzeThread, analyzeBeam,
  analyzeWeld, analyzeBolt, analyzeThermal, calculateWeight,
  exportSCAD, exportBOM, exportSTL, checkNACE, textToCAD, aiCopilot,
  estimateCost,
  type Material, type HealthResponse, type StatsResponse, type StressResult, type DFMResult,
} from '../../lib/echocad-api';

// ── Constants ──

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'materials', label: 'Materials', icon: '⬡' },
  { id: 'design', label: 'Design Studio', icon: '△' },
  { id: 'engineering', label: 'Engineering', icon: '⚙' },
  { id: 'manufacturing', label: 'Manufacturing', icon: '⚒' },
  { id: 'ai', label: 'AI Copilot', icon: '✦' },
] as const;

type TabId = typeof TABS[number]['id'];

const CALC_TYPES = [
  { id: 'stress', label: 'Stress Analysis', icon: '⟐', desc: 'Von Mises yield criterion' },
  { id: 'pressure', label: 'Pressure Vessel', icon: '◎', desc: 'Lame thick-wall equations' },
  { id: 'fatigue', label: 'Fatigue Life', icon: '∿', desc: 'Goodman criterion' },
  { id: 'beam', label: 'Beam Deflection', icon: '═', desc: 'Euler-Bernoulli' },
  { id: 'thread', label: 'Thread Analysis', icon: '⊘', desc: 'ISO/UNC/UNF/ACME/NPT' },
  { id: 'weld', label: 'Weld Sizing', icon: '⋈', desc: 'AWS D1.1 capacity' },
  { id: 'bolt', label: 'Bolt Preload', icon: '⊕', desc: 'VDI 2230 analysis' },
  { id: 'tolerance', label: 'Tolerance Stack', icon: '⊞', desc: 'RSS statistical stackup' },
  { id: 'dfm', label: 'DFM Score', icon: '✦', desc: 'Manufacturability 0-100' },
  { id: 'thermal', label: 'Thermal', icon: '◐', desc: 'Cylindrical conduction' },
  { id: 'weight', label: 'Weight Calc', icon: '▤', desc: 'Volume × density' },
  { id: 'nace', label: 'NACE Check', icon: '⛊', desc: 'Sour service compliance' },
];

const PRIMITIVE_TYPES = [
  { type: 'cylinder', label: 'Cylinder', icon: '⬤', params: ['diameter', 'height'] },
  { type: 'box', label: 'Box', icon: '▬', params: ['width', 'height', 'depth'] },
  { type: 'sphere', label: 'Sphere', icon: '◉', params: ['diameter'] },
  { type: 'ring', label: 'Ring', icon: '◎', params: ['outer_diameter', 'inner_diameter', 'height'] },
  { type: 'cone', label: 'Cone', icon: '▲', params: ['diameter', 'height'] },
  { type: 'torus', label: 'Torus', icon: '◌', params: ['major_diameter', 'minor_diameter'] },
  { type: 'pipe', label: 'Pipe', icon: '∥', params: ['outer_diameter', 'inner_diameter', 'length'] },
  { type: 'hex', label: 'Hex', icon: '⬡', params: ['across_flats', 'height'] },
  { type: 'flange', label: 'Flange', icon: '⊝', params: ['outer_diameter', 'inner_diameter', 'thickness'] },
  { type: 'i_beam', label: 'I-Beam', icon: 'Ⅱ', params: ['height', 'width', 'flange_thickness', 'web_thickness', 'length'] },
  { type: 'enclosure', label: 'Enclosure', icon: '▣', params: ['width', 'height', 'depth', 'wall_thickness'] },
  { type: 'channel', label: 'Channel', icon: '⊏', params: ['height', 'width', 'thickness', 'length'] },
  { type: 'slot', label: 'Slot', icon: '▭', params: ['length', 'width', 'depth'] },
  { type: 'thread_profile', label: 'Thread', icon: '⊘', params: ['major_diameter', 'pitch', 'length'] },
  { type: 'pendant', label: 'Pendant', icon: '◈', params: ['loop_diameter', 'wire_diameter', 'body_length'] },
];

const MATERIAL_CATEGORIES = ['all', 'steel', 'aluminum', 'titanium', 'copper', 'nickel', 'polymer', 'specialty', 'precious', 'oilfield'];

// ── Helpers ──
const cs = (base: string, active: boolean) => active ? `${base} active` : base;
const fmt = (n: number, d = 2) => typeof n === 'number' ? n.toFixed(d) : '—';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResultCard({ title, data, color }: { title: string; data: Record<string, any>; color?: string }) {
  return (
    <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20, marginTop: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: color || 'var(--ept-accent)', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {Object.entries(data).filter(([,v]) => v !== undefined && v !== null).map(([k, v]) => (
          <div key={k} style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--ept-text-muted)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}: </span>
            <span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{typeof v === 'number' ? fmt(v) : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : Array.isArray(v) ? v.join(', ') : String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ ok, label }: { ok: boolean | null; label: string }) {
  const c = ok === null ? '#888' : ok ? '#22c55e' : '#ef4444';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: c }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
      {label}
    </span>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, outline: 'none' }} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, outline: 'none' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ActionButton({ label, onClick, loading, color, disabled }: { label: string; onClick: () => void; loading?: boolean; color?: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading || disabled}
      style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: color || 'var(--ept-accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: loading || disabled ? 'not-allowed' : 'pointer', opacity: loading || disabled ? 0.6 : 1, transition: 'all 0.2s' }}>
      {loading ? 'Processing...' : label}
    </button>
  );
}

// ── Main Component ──

export default function EchoCADPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  // Materials state
  const [matCategory, setMatCategory] = useState('all');
  const [matSearch, setMatSearch] = useState('');
  const [selectedMats, setSelectedMats] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [compareResult, setCompareResult] = useState<Record<string, any> | null>(null);
  const [expandedMat, setExpandedMat] = useState<string | null>(null);

  // Design state
  const [primType, setPrimType] = useState('cylinder');
  const [primName, setPrimName] = useState('');
  const [primDims, setPrimDims] = useState<Record<string, string>>({});
  const [primMaterial, setPrimMaterial] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [primResult, setPrimResult] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [createdParts, setCreatedParts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [exportResult, setExportResult] = useState<any>(null);

  // Engineering state
  const [activeCalc, setActiveCalc] = useState('stress');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [calcInputs, setCalcInputs] = useState<Record<string, string>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [calcResult, setCalcResult] = useState<any>(null);

  // Manufacturing state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mfgResult, setMfgResult] = useState<any>(null);

  // AI state
  const [aiPrompt, setAiPrompt] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiMode, setAiMode] = useState<'text-to-cad' | 'copilot'>('text-to-cad');
  const [copilotHistory, setCopilotHistory] = useState<{ role: string; content: string }[]>([]);

  // Load data
  useEffect(() => {
    getHealth().then(setHealth).catch(() => {});
    getStats().then(setStats).catch(() => {});
    getMaterials().then(setMaterials).catch(() => {});
  }, []);

  // Filtered materials
  const filteredMats = useMemo(() => {
    let m = materials;
    if (matCategory !== 'all') m = m.filter(mat => mat.category?.toLowerCase().includes(matCategory));
    if (matSearch) m = m.filter(mat => `${mat.name} ${mat.id} ${mat.category} ${mat.applications?.join(' ')}`.toLowerCase().includes(matSearch.toLowerCase()));
    return m;
  }, [materials, matCategory, matSearch]);

  // Get current primitive params
  const currentPrimitive = PRIMITIVE_TYPES.find(p => p.type === primType);

  // Compare materials handler
  const handleCompare = async () => {
    if (selectedMats.length < 2) return;
    setLoading(true);
    try {
      const result = await compareMaterials(selectedMats);
      setCompareResult(result);
    } catch { /* ignore */ }
    setLoading(false);
  };

  // Toggle material selection
  const toggleMat = (id: string) => {
    setSelectedMats(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  };

  // Create primitive handler
  const handleCreatePrimitive = async () => {
    if (!primName || !currentPrimitive) return;
    setLoading(true);
    try {
      const dims: Record<string, number> = {};
      currentPrimitive.params.forEach(p => { dims[p] = parseFloat(primDims[p] || '0'); });
      const result = await createPrimitive(primType, primName, dims, primMaterial || undefined);
      setPrimResult(result);
      setCreatedParts(prev => [...prev, { type: primType, name: primName, dimensions: dims, material: primMaterial || undefined }]);
    } catch { /* ignore */ }
    setLoading(false);
  };

  // Engineering calculator handler
  const handleCalc = async () => {
    setLoading(true);
    setCalcResult(null);
    try {
      const g = (k: string) => parseFloat(calcInputs[k] || '0');
      const s = (k: string) => calcInputs[k] || '';
      let result;
      switch (activeCalc) {
        case 'stress': result = await analyzeStress(g('force'), g('area'), s('material') || undefined); break;
        case 'pressure': result = await analyzePressure(g('pressure'), g('outer_diameter'), g('inner_diameter'), s('material') || undefined); break;
        case 'fatigue': result = await analyzeFatigue(g('stress_range'), g('mean_stress'), s('material') || undefined); break;
        case 'beam': result = await analyzeBeam({ length: g('length'), load: g('load'), support_type: s('support_type') || 'simply_supported', material: s('material') || 'aisi-4130', width: g('width') || undefined, height: g('height') || undefined }); break;
        case 'thread': result = await analyzeThread(s('size') || 'M10', g('pitch') || undefined, s('thread_type') || undefined, s('material') || undefined); break;
        case 'weld': result = await analyzeWeld({ type: s('weld_type') || 'fillet', size: g('size'), length: g('length'), electrode: s('electrode') || 'E70XX', load: g('load') || undefined }); break;
        case 'bolt': result = await analyzeBolt({ size: s('bolt_size') || 'M10', grade: s('grade') || '8.8', clamp_force: g('clamp_force') }); break;
        case 'tolerance': {
          const dims = (calcInputs['dimensions'] || '10:0.1,20:0.05,30:0.1').split(',').map(d => { const [n, t] = d.split(':'); return { nominal: parseFloat(n), tolerance: parseFloat(t) }; });
          result = await analyzeTolerances(dims); break;
        }
        case 'dfm': result = await analyzeDFM({ material: s('material') || undefined, features: s('features') ? s('features').split(',').map(f => f.trim()) : undefined, tolerances: s('tolerances') || undefined, surface_finish_ra: g('surface_finish') || undefined, quantity: g('quantity') || undefined }); break;
        case 'thermal': result = await analyzeThermal({ inner_radius_mm: g('inner_radius'), outer_radius_mm: g('outer_radius'), length_mm: g('length'), material: s('material') || undefined }); break;
        case 'weight': result = await calculateWeight(createdParts.length ? createdParts : [{ type: 'cylinder', name: 'sample', dimensions: { diameter: 50, height: 100 }, material: s('material') || 'aisi-4130' }]); break;
        case 'nace': result = await checkNACE(s('material') || 'aisi-316l-ss'); break;
      }
      setCalcResult(result);
    } catch (e) { setCalcResult({ error: String(e) }); }
    setLoading(false);
  };

  // Export handlers
  const handleExport = async (format: 'scad' | 'bom' | 'stl') => {
    if (!createdParts.length) return;
    setLoading(true);
    try {
      let result;
      if (format === 'scad') result = await exportSCAD(createdParts);
      else if (format === 'bom') result = await exportBOM(createdParts);
      else result = await exportSTL(createdParts);
      setExportResult(result);
    } catch { /* ignore */ }
    setLoading(false);
  };

  // Manufacturing cost handler
  const handleMfgCost = async () => {
    if (!createdParts.length) return;
    setLoading(true);
    try {
      const result = await estimateCost({ parts: createdParts, quantity: parseInt(calcInputs['mfg_qty'] || '100') });
      setMfgResult(result);
    } catch (e) { setMfgResult({ error: String(e) }); }
    setLoading(false);
  };

  // AI handler
  const handleAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setAiResult(null);
    try {
      if (aiMode === 'text-to-cad') {
        const result = await textToCAD(aiPrompt);
        setAiResult(result);
      } else {
        setCopilotHistory(prev => [...prev, { role: 'user', content: aiPrompt }]);
        const result = await aiCopilot(aiPrompt, createdParts.length ? JSON.stringify(createdParts) : undefined);
        setAiResult(result);
        setCopilotHistory(prev => [...prev, { role: 'assistant', content: typeof result === 'object' ? JSON.stringify(result) : String(result) }]);
      }
      setAiPrompt('');
    } catch (e) { setAiResult({ error: String(e) }); }
    setLoading(false);
  };

  // Calculator input fields config
  const calcFields: Record<string, { label: string; placeholder?: string; type?: string }[]> = {
    stress: [{ label: 'Force (N)' }, { label: 'Area (mm²)' }, { label: 'Material', placeholder: 'aisi-4130' }],
    pressure: [{ label: 'Pressure (MPa)' }, { label: 'Outer Diameter (mm)' }, { label: 'Inner Diameter (mm)' }, { label: 'Material', placeholder: 'aisi-4130' }],
    fatigue: [{ label: 'Stress Range (MPa)' }, { label: 'Mean Stress (MPa)' }, { label: 'Material', placeholder: 'ti-6al-4v' }],
    beam: [{ label: 'Length (mm)' }, { label: 'Load (N)' }, { label: 'Support Type', placeholder: 'simply_supported' }, { label: 'Material', placeholder: 'aisi-4130' }, { label: 'Width (mm)' }, { label: 'Height (mm)' }],
    thread: [{ label: 'Size', placeholder: 'M10' }, { label: 'Pitch' }, { label: 'Thread Type', placeholder: 'ISO' }, { label: 'Material' }],
    weld: [{ label: 'Weld Type', placeholder: 'fillet' }, { label: 'Size (mm)' }, { label: 'Length (mm)' }, { label: 'Electrode', placeholder: 'E70XX' }, { label: 'Load (N)' }],
    bolt: [{ label: 'Bolt Size', placeholder: 'M10' }, { label: 'Grade', placeholder: '8.8' }, { label: 'Clamp Force (N)' }],
    tolerance: [{ label: 'Dimensions', placeholder: '10:0.1,20:0.05,30:0.1' }],
    dfm: [{ label: 'Material', placeholder: 'al-6061-t6' }, { label: 'Features', placeholder: 'holes,threads,thin_walls' }, { label: 'Tolerances', placeholder: 'tight' }, { label: 'Surface Finish (Ra)' }, { label: 'Quantity' }],
    thermal: [{ label: 'Inner Radius (mm)' }, { label: 'Outer Radius (mm)' }, { label: 'Length (mm)' }, { label: 'Material' }],
    weight: [{ label: 'Material', placeholder: 'aisi-4130' }],
    nace: [{ label: 'Material', placeholder: 'aisi-316l-ss' }],
  };

  const getFieldKey = (label: string) => label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/_$/, '');

  // ── Render ──

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ept-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, borderRight: '1px solid var(--ept-border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'var(--ept-bg-alt)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={32} height={32} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: -0.3 }}>Echo Prime</span>
        </Link>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--ept-accent)', marginBottom: 12 }}>EchoCAD v2.0</div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', marginBottom: 2, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13,
              fontWeight: activeTab === t.id ? 600 : 400, background: activeTab === t.id ? 'var(--ept-accent-glow)' : 'transparent',
              color: activeTab === t.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
        <div style={{ marginTop: 24, padding: '12px', borderRadius: 8, background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', fontSize: 11 }}>
          <StatusBadge ok={health?.status === 'ok'} label={health ? 'API Online' : 'Checking...'} />
          <div style={{ marginTop: 8, color: 'var(--ept-text-muted)' }}>
            {stats ? `${stats.materials} materials | ${stats.primitiveTypes?.length || 15} primitives` : 'Loading...'}
          </div>
          <div style={{ marginTop: 4, color: 'var(--ept-text-muted)' }}>
            Parts in workspace: {createdParts.length}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 40px', maxWidth: 1200 }}>

        {/* ═══ DASHBOARD TAB ═══ */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>EchoCAD Engineering Workbench</h1>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 14, marginBottom: 32 }}>AI-native parametric CAD engine with 38 materials, 15 primitives, 12 calculators, and manufacturing intelligence.</p>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Materials', value: stats?.materials || 38, icon: '⬡', color: '#3b82f6' },
                { label: 'Primitives', value: stats?.primitiveTypes?.length || 15, icon: '△', color: '#8b5cf6' },
                { label: 'Calculators', value: stats?.engineeringCalcs?.length || 12, icon: '⚙', color: '#f59e0b' },
                { label: 'Export Formats', value: stats?.exportFormats?.length || 6, icon: '↗', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</span>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Capabilities */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>Engineering Calculators</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {CALC_TYPES.map(c => (
                    <button key={c.id} onClick={() => { setActiveTab('engineering'); setActiveCalc(c.id); }}
                      style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 11, cursor: 'pointer' }}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>AI Features</h3>
                {(stats?.aiFeatures || ['text-to-cad', 'copilot', 'optimize', 'standards-check']).map(f => (
                  <div key={f} style={{ padding: '8px 0', borderBottom: '1px solid var(--ept-border)', fontSize: 13, color: 'var(--ept-text)' }}>
                    <span style={{ color: 'var(--ept-accent)', marginRight: 8 }}>✦</span>{f.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </div>
                ))}
              </div>
            </div>

            {/* Workspace */}
            {createdParts.length > 0 && (
              <div style={{ marginTop: 24, background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>Workspace ({createdParts.length} parts)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {createdParts.map((p, i) => (
                    <div key={i} style={{ padding: 12, background: 'var(--ept-bg)', borderRadius: 8, fontSize: 12 }}>
                      <div style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{p.name}</div>
                      <div style={{ color: 'var(--ept-text-muted)' }}>{p.type} {p.material ? `| ${p.material}` : ''}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <ActionButton label="Export OpenSCAD" onClick={() => handleExport('scad')} loading={loading} color="#8b5cf6" />
                  <ActionButton label="Export BOM" onClick={() => handleExport('bom')} loading={loading} color="#22c55e" />
                  <ActionButton label="Export STL" onClick={() => handleExport('stl')} loading={loading} color="#3b82f6" />
                  <ActionButton label="Cost Estimate" onClick={handleMfgCost} loading={loading} color="#f59e0b" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ MATERIALS TAB ═══ */}
        {activeTab === 'materials' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Materials Database</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 20 }}>38 engineering alloys with 17 properties each. Click to expand, select up to 4 for comparison.</p>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="text" value={matSearch} onChange={e => setMatSearch(e.target.value)} placeholder="Search materials..."
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, width: 240 }} />
              {MATERIAL_CATEGORIES.map(c => (
                <button key={c} onClick={() => setMatCategory(c)}
                  style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid var(--ept-border)', fontSize: 12, cursor: 'pointer', fontWeight: matCategory === c ? 600 : 400,
                    background: matCategory === c ? 'var(--ept-accent)' : 'var(--ept-bg)', color: matCategory === c ? '#fff' : 'var(--ept-text-muted)' }}>
                  {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            {/* Selected for compare */}
            {selectedMats.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--ept-text-muted)' }}>Compare:</span>
                {selectedMats.map(id => (
                  <span key={id} style={{ padding: '4px 10px', borderRadius: 12, background: 'var(--ept-accent)', color: '#fff', fontSize: 11, cursor: 'pointer' }}
                    onClick={() => toggleMat(id)}>{id} ✕</span>
                ))}
                <ActionButton label={`Compare ${selectedMats.length}`} onClick={handleCompare} loading={loading} disabled={selectedMats.length < 2} />
              </div>
            )}

            {/* Compare Results */}
            {compareResult && (
              <div style={{ marginBottom: 24, background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 12 }}>Comparison Results</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '2px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>Property</th>
                      {Object.keys(compareResult).map(id => (
                        <th key={id} style={{ textAlign: 'right', padding: 8, borderBottom: '2px solid var(--ept-border)', color: 'var(--ept-accent)' }}>{id}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['density_g_cm3', 'yield_mpa', 'tensile_mpa', 'elongation_pct', 'hardness_hrc', 'elastic_modulus_gpa', 'thermal_conductivity_w_mk', 'melting_point_c', 'cost_usd_kg', 'machinability_rating'].map(prop => (
                      <tr key={prop}>
                        <td style={{ padding: 8, borderBottom: '1px solid var(--ept-border)', color: 'var(--ept-text)', textTransform: 'capitalize' }}>{prop.replace(/_/g, ' ')}</td>
                        {Object.values(compareResult).map((mat, i) => (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          <td key={i} style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid var(--ept-border)', color: 'var(--ept-text)', fontWeight: 500 }}>{mat ? fmt((mat as any)[prop]) : '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Materials Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {filteredMats.map(m => (
                <div key={m.id} onClick={() => setExpandedMat(expandedMat === m.id ? null : m.id)}
                  style={{ background: 'var(--ept-card-bg)', border: `1px solid ${selectedMats.includes(m.id) ? 'var(--ept-accent)' : 'var(--ept-border)'}`, borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ept-text)' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{m.category} | {m.id}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {m.nace_compliant && <span style={{ padding: '2px 6px', borderRadius: 4, background: '#22c55e22', color: '#22c55e', fontSize: 9, fontWeight: 600 }}>NACE</span>}
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: m.color, border: '1px solid var(--ept-border)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, fontSize: 11 }}>
                    <div><span style={{ color: 'var(--ept-text-muted)' }}>Yield:</span> <b>{m.yield_mpa} MPa</b></div>
                    <div><span style={{ color: 'var(--ept-text-muted)' }}>Density:</span> <b>{m.density_g_cm3}</b></div>
                    <div><span style={{ color: 'var(--ept-text-muted)' }}>Cost:</span> <b>${m.cost_usd_kg}/kg</b></div>
                  </div>
                  {expandedMat === m.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--ept-border)', fontSize: 11 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <div>Tensile: <b>{m.tensile_mpa} MPa</b></div>
                        <div>Elongation: <b>{m.elongation_pct}%</b></div>
                        <div>Hardness: <b>{m.hardness_hrc} HRC / {m.hardness_hb} HB</b></div>
                        <div>Elastic Mod: <b>{m.elastic_modulus_gpa} GPa</b></div>
                        <div>Thermal K: <b>{m.thermal_conductivity_w_mk} W/mK</b></div>
                        <div>Thermal Exp: <b>{m.thermal_expansion_um_mk} µm/mK</b></div>
                        <div>Melting: <b>{m.melting_point_c}°C</b></div>
                        <div>Max Service: <b>{m.max_service_temp_c}°C</b></div>
                        <div>Machinability: <b>{m.machinability_rating}%</b></div>
                        <div>Weldability: <b>{m.weldability}</b></div>
                        <div>Poisson: <b>{m.poisson_ratio}</b></div>
                      </div>
                      {m.applications?.length > 0 && (
                        <div style={{ marginTop: 8, color: 'var(--ept-text-muted)' }}>Uses: {m.applications.join(', ')}</div>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); toggleMat(m.id); }}
                        style={{ marginTop: 8, padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                          background: selectedMats.includes(m.id) ? '#ef4444' : 'var(--ept-accent)', color: '#fff' }}>
                        {selectedMats.includes(m.id) ? 'Remove from Compare' : 'Add to Compare'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {filteredMats.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)' }}>No materials match your search.</div>}
          </div>
        )}

        {/* ═══ DESIGN STUDIO TAB ═══ */}
        {activeTab === 'design' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Design Studio</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Create parametric primitives, build assemblies, export to OpenSCAD/STL/DXF.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Primitive Creator */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Create Primitive</h3>

                {/* Type selector */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {PRIMITIVE_TYPES.map(p => (
                    <button key={p.type} onClick={() => { setPrimType(p.type); setPrimDims({}); setPrimResult(null); }}
                      style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${primType === p.type ? 'var(--ept-accent)' : 'var(--ept-border)'}`, fontSize: 11, cursor: 'pointer',
                        background: primType === p.type ? 'var(--ept-accent-glow)' : 'var(--ept-bg)', color: primType === p.type ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <InputField label="Part Name" value={primName} onChange={setPrimName} placeholder={`my_${primType}`} />
                  {currentPrimitive?.params.map(param => (
                    <InputField key={param} label={`${param.replace(/_/g, ' ')} (mm)`} value={primDims[param] || ''} onChange={v => setPrimDims(prev => ({ ...prev, [param]: v }))} type="number" placeholder="0" />
                  ))}
                  <SelectField label="Material (optional)" value={primMaterial} onChange={setPrimMaterial}
                    options={[{ value: '', label: 'None' }, ...materials.slice(0, 20).map(m => ({ value: m.id, label: m.name }))]} />
                  <ActionButton label="Create Primitive" onClick={handleCreatePrimitive} loading={loading} />
                </div>

                {primResult && <ResultCard title="Created Part" data={typeof primResult === 'object' ? primResult : { result: primResult }} color="#22c55e" />}
              </div>

              {/* Workspace / Parts List */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Workspace Parts ({createdParts.length})</h3>
                {createdParts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>
                    No parts yet. Create primitives to build your design.
                  </div>
                ) : (
                  <>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                      {createdParts.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid var(--ept-border)' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ept-text)' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{p.type} {p.material ? `| ${p.material}` : ''} | {Object.entries(p.dimensions).map(([k, v]) => `${k}=${v}`).join(', ')}</div>
                          </div>
                          <button onClick={() => setCreatedParts(prev => prev.filter((_, j) => j !== i))}
                            style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: '#ef444422', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                      <ActionButton label="Export SCAD" onClick={() => handleExport('scad')} loading={loading} color="#8b5cf6" />
                      <ActionButton label="Export BOM" onClick={() => handleExport('bom')} loading={loading} color="#22c55e" />
                      <ActionButton label="Export STL" onClick={() => handleExport('stl')} loading={loading} color="#3b82f6" />
                      <button onClick={() => { setCreatedParts([]); setExportResult(null); }}
                        style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>Clear All</button>
                    </div>
                  </>
                )}

                {/* Export Result */}
                {exportResult && (
                  <div style={{ marginTop: 16, padding: 12, background: 'var(--ept-bg)', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 8 }}>Export Output</div>
                    <pre style={{ fontSize: 11, color: 'var(--ept-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {typeof exportResult === 'string' ? exportResult : JSON.stringify(exportResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ ENGINEERING TAB ═══ */}
        {activeTab === 'engineering' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Engineering Calculators</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>12 engineering analysis tools powered by real equations. Select a calculator and enter parameters.</p>

            {/* Calculator selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {CALC_TYPES.map(c => (
                <button key={c.id} onClick={() => { setActiveCalc(c.id); setCalcResult(null); setCalcInputs({}); }}
                  style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${activeCalc === c.id ? 'var(--ept-accent)' : 'var(--ept-border)'}`, cursor: 'pointer', fontSize: 12,
                    background: activeCalc === c.id ? 'var(--ept-accent-glow)' : 'var(--ept-bg)', color: activeCalc === c.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)', fontWeight: activeCalc === c.id ? 600 : 400 }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Input Form */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 4 }}>
                  {CALC_TYPES.find(c => c.id === activeCalc)?.icon} {CALC_TYPES.find(c => c.id === activeCalc)?.label}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginBottom: 16 }}>{CALC_TYPES.find(c => c.id === activeCalc)?.desc}</p>
                <div style={{ display: 'grid', gap: 12 }}>
                  {(calcFields[activeCalc] || []).map((f, i) => (
                    <InputField key={i} label={f.label} value={calcInputs[getFieldKey(f.label)] || ''} onChange={v => setCalcInputs(prev => ({ ...prev, [getFieldKey(f.label)]: v }))} placeholder={f.placeholder} />
                  ))}
                  <ActionButton label="Calculate" onClick={handleCalc} loading={loading} />
                </div>
              </div>

              {/* Results */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Results</h3>
                {!calcResult ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>Enter parameters and click Calculate to see results.</div>
                ) : calcResult.error ? (
                  <div style={{ padding: 16, background: '#ef444422', borderRadius: 8, color: '#ef4444', fontSize: 13 }}>{calcResult.error}</div>
                ) : (
                  <div>
                    {/* Status badge for pass/fail results */}
                    {calcResult.status && (
                      <div style={{ marginBottom: 12, padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 700, textAlign: 'center',
                        background: calcResult.status === 'PASS' || calcResult.status === 'SAFE' ? '#22c55e22' : calcResult.status === 'FAIL' || calcResult.status === 'YIELD' ? '#ef444422' : '#f59e0b22',
                        color: calcResult.status === 'PASS' || calcResult.status === 'SAFE' ? '#22c55e' : calcResult.status === 'FAIL' || calcResult.status === 'YIELD' ? '#ef4444' : '#f59e0b' }}>
                        {calcResult.status}
                      </div>
                    )}
                    {/* Grade for DFM */}
                    {calcResult.grade && (
                      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 40, fontWeight: 800, color: calcResult.grade === 'A' ? '#22c55e' : calcResult.grade === 'B' ? '#3b82f6' : calcResult.grade === 'C' ? '#f59e0b' : '#ef4444' }}>{calcResult.grade}</span>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)' }}>Score: {calcResult.score}/100</div>
                          <div style={{ fontSize: 12, color: 'var(--ept-text-muted)' }}>Cost Multiplier: {calcResult.estimatedCostMultiplier}x</div>
                        </div>
                      </div>
                    )}
                    {/* Safety Factor */}
                    {calcResult.safetyFactor && (
                      <div style={{ marginBottom: 12, padding: 12, borderRadius: 8, background: 'var(--ept-bg)', textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Safety Factor</div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: calcResult.safetyFactor >= 2 ? '#22c55e' : calcResult.safetyFactor >= 1 ? '#f59e0b' : '#ef4444' }}>{fmt(calcResult.safetyFactor)}</div>
                      </div>
                    )}
                    {/* All numeric/string results */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {Object.entries(calcResult).filter(([k, v]) => k !== 'status' && k !== 'grade' && k !== 'safetyFactor' && v !== undefined && v !== null && !Array.isArray(v) && typeof v !== 'object').map(([k, v]) => (
                        <div key={k} style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, fontSize: 12 }}>
                          <span style={{ color: 'var(--ept-text-muted)' }}>{k.replace(/_/g, ' ')}: </span>
                          <span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{typeof v === 'number' ? fmt(v) : String(v)}</span>
                        </div>
                      ))}
                    </div>
                    {/* Array results (issues, suggestions, etc.) */}
                    {Object.entries(calcResult).filter(([, v]) => Array.isArray(v) && v.length > 0).map(([k, v]) => (
                      <div key={k} style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 6, textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</div>
                        {(v as string[]).map((item, i) => (
                          <div key={i} style={{ padding: '6px 10px', fontSize: 12, color: 'var(--ept-text)', borderBottom: '1px solid var(--ept-border)' }}>
                            {typeof item === 'string' ? item : JSON.stringify(item)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ MANUFACTURING TAB ═══ */}
        {activeTab === 'manufacturing' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Manufacturing Intelligence</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Cost estimation, CNC operations, NACE compliance, and FMEA analysis.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Cost Estimator */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Cost Estimator</h3>
                {createdParts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 24, color: 'var(--ept-text-muted)', fontSize: 13 }}>Create parts in Design Studio first, then estimate manufacturing costs here.</div>
                ) : (
                  <>
                    <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginBottom: 12 }}>{createdParts.length} parts in workspace</div>
                    <InputField label="Production Quantity" value={calcInputs['mfg_qty'] || '100'} onChange={v => setCalcInputs(prev => ({ ...prev, mfg_qty: v }))} type="number" />
                    <div style={{ marginTop: 12 }}><ActionButton label="Estimate Cost" onClick={handleMfgCost} loading={loading} color="#f59e0b" /></div>
                  </>
                )}
                {mfgResult && <ResultCard title="Manufacturing Cost Estimate" data={mfgResult} color="#f59e0b" />}
              </div>

              {/* DFM Quick Check */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>DFM Quick Check</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  <InputField label="Material" value={calcInputs['dfm_mat'] || ''} onChange={v => setCalcInputs(prev => ({ ...prev, dfm_mat: v }))} placeholder="al-6061-t6" />
                  <InputField label="Features (comma-separated)" value={calcInputs['dfm_feat'] || ''} onChange={v => setCalcInputs(prev => ({ ...prev, dfm_feat: v }))} placeholder="holes,threads,thin_walls,undercuts" />
                  <InputField label="Surface Finish Ra (µm)" value={calcInputs['dfm_ra'] || ''} onChange={v => setCalcInputs(prev => ({ ...prev, dfm_ra: v }))} placeholder="1.6" type="number" />
                  <InputField label="Quantity" value={calcInputs['dfm_qty'] || ''} onChange={v => setCalcInputs(prev => ({ ...prev, dfm_qty: v }))} placeholder="100" type="number" />
                  <ActionButton label="Analyze DFM" onClick={async () => {
                    setLoading(true);
                    try {
                      const r = await analyzeDFM({ material: calcInputs['dfm_mat'] || undefined, features: calcInputs['dfm_feat'] ? calcInputs['dfm_feat'].split(',').map(f => f.trim()) : undefined, surface_finish_ra: parseFloat(calcInputs['dfm_ra']) || undefined, quantity: parseInt(calcInputs['dfm_qty']) || undefined });
                      setCalcResult(r);
                    } catch { /* ignore */ }
                    setLoading(false);
                  }} loading={loading} />
                </div>
                {calcResult?.grade && (
                  <div style={{ marginTop: 16, textAlign: 'center', padding: 16, background: 'var(--ept-bg)', borderRadius: 8 }}>
                    <span style={{ fontSize: 48, fontWeight: 800, color: calcResult.grade === 'A' ? '#22c55e' : calcResult.grade === 'B' ? '#3b82f6' : '#f59e0b' }}>{calcResult.grade}</span>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginTop: 4 }}>Score: {calcResult.score}/100</div>
                  </div>
                )}
              </div>

              {/* NACE Compliance */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>NACE MR0175 Compliance</h3>
                <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginBottom: 12 }}>Check sour service compliance per ISO 15156 / NACE MR0175.</p>
                <div style={{ display: 'grid', gap: 12 }}>
                  <SelectField label="Material" value={calcInputs['nace_mat'] || ''} onChange={v => setCalcInputs(prev => ({ ...prev, nace_mat: v }))}
                    options={[{ value: '', label: 'Select material' }, ...materials.filter(m => ['steel', 'stainless', 'nickel', 'oilfield'].some(c => m.category?.toLowerCase().includes(c))).map(m => ({ value: m.id, label: m.name }))]} />
                  <ActionButton label="Check NACE" onClick={async () => {
                    if (!calcInputs['nace_mat']) return;
                    setLoading(true);
                    try {
                      const r = await checkNACE(calcInputs['nace_mat']);
                      setMfgResult(r);
                    } catch { /* ignore */ }
                    setLoading(false);
                  }} loading={loading} color="#06b6d4" />
                </div>
                {mfgResult?.compliant !== undefined && (
                  <div style={{ marginTop: 16, textAlign: 'center', padding: 16, borderRadius: 8, background: mfgResult.compliant ? '#22c55e22' : '#ef444422' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: mfgResult.compliant ? '#22c55e' : '#ef4444' }}>{mfgResult.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}</div>
                    {mfgResult.notes && <div style={{ fontSize: 12, marginTop: 8, color: 'var(--ept-text)' }}>{typeof mfgResult.notes === 'string' ? mfgResult.notes : JSON.stringify(mfgResult.notes)}</div>}
                  </div>
                )}
              </div>

              {/* Material Quick Compare */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Quick Material Stats</h3>
                <div style={{ display: 'grid', gap: 4 }}>
                  {materials.filter(m => m.nace_compliant).slice(0, 8).map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 4, fontSize: 11, background: 'var(--ept-bg)' }}>
                      <span style={{ color: 'var(--ept-text)' }}>{m.name}</span>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>NACE {m.yield_mpa} MPa ${m.cost_usd_kg}/kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI COPILOT TAB ═══ */}
        {activeTab === 'ai' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>AI Engineering Copilot</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Natural language to CAD geometry, engineering Q&A, and design optimization.</p>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[{ id: 'text-to-cad' as const, label: 'Text to CAD', desc: 'Describe a part in natural language' }, { id: 'copilot' as const, label: 'Engineering Q&A', desc: 'Ask engineering questions' }].map(m => (
                <button key={m.id} onClick={() => { setAiMode(m.id); setAiResult(null); }}
                  style={{ flex: 1, padding: 16, borderRadius: 12, border: `2px solid ${aiMode === m.id ? 'var(--ept-accent)' : 'var(--ept-border)'}`, cursor: 'pointer',
                    background: aiMode === m.id ? 'var(--ept-accent-glow)' : 'var(--ept-card-bg)', textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: aiMode === m.id ? 'var(--ept-accent)' : 'var(--ept-text)' }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 4 }}>{m.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Input */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>
                  {aiMode === 'text-to-cad' ? 'Describe Your Part' : 'Ask a Question'}
                </h3>
                <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                  placeholder={aiMode === 'text-to-cad' ? 'e.g., "Create a flanged pipe fitting with 4-inch OD, 3-inch ID, 0.5-inch thick flange with 6 bolt holes on a 5-inch bolt circle, made from 316L stainless steel"' : 'e.g., "What material should I use for a pressure vessel operating at 350°C in sour service?"'}
                  style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }} />
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <ActionButton label={aiMode === 'text-to-cad' ? 'Generate CAD' : 'Ask Copilot'} onClick={handleAI} loading={loading} />
                </div>

                {/* Copilot History */}
                {aiMode === 'copilot' && copilotHistory.length > 0 && (
                  <div style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto' }}>
                    {copilotHistory.map((msg, i) => (
                      <div key={i} style={{ padding: 10, marginBottom: 8, borderRadius: 8, fontSize: 12,
                        background: msg.role === 'user' ? 'var(--ept-accent-glow)' : 'var(--ept-bg)', color: 'var(--ept-text)' }}>
                        <span style={{ fontWeight: 600, color: msg.role === 'user' ? 'var(--ept-accent)' : '#22c55e' }}>{msg.role === 'user' ? 'You' : 'Copilot'}: </span>
                        {msg.content.substring(0, 500)}{msg.content.length > 500 ? '...' : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Result */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>AI Output</h3>
                {!aiResult ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>
                    {aiMode === 'text-to-cad' ? 'Describe a part and the AI will generate parametric geometry.' : 'Ask an engineering question to get expert analysis.'}
                  </div>
                ) : aiResult.error ? (
                  <div style={{ padding: 16, background: '#ef444422', borderRadius: 8, color: '#ef4444', fontSize: 13 }}>{aiResult.error}</div>
                ) : (
                  <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                    <pre style={{ fontSize: 12, color: 'var(--ept-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 }}>
                      {typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
