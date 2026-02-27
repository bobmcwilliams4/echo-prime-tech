'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import {
  getHealth, getStats, getGuilds, getDomains, getStages, getTemplates,
  analyzeProject, runQualityCheck, getCouncilVerdict, getStandards,
  type HealthResponse, type ForgeStats, type Guild, type Domain,
  type ManufacturingStage, type AnalysisResult, type QualityReport,
  type CouncilVerdict, type ProjectTemplate,
} from '../../lib/daedalus-forge-api';

// ── Constants ──

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚒' },
  { id: 'analyze', label: 'Analyze Project', icon: '◉' },
  { id: 'quality', label: 'Quality Check', icon: '✓' },
  { id: 'council', label: 'Trinity Council', icon: '⟁' },
  { id: 'guilds', label: 'Guilds', icon: '⛊' },
  { id: 'standards', label: 'Standards', icon: '▣' },
] as const;

type TabId = typeof TABS[number]['id'];

const DOMAINS = [
  { id: 'OILFIELD', label: 'Oil & Gas', icon: '⛽', color: '#f59e0b' },
  { id: 'AEROSPACE', label: 'Aerospace', icon: '✈', color: '#3b82f6' },
  { id: 'AUTOMOTIVE', label: 'Automotive', icon: '⚙', color: '#ef4444' },
  { id: 'MARINE', label: 'Marine', icon: '⚓', color: '#06b6d4' },
  { id: 'MILITARY', label: 'Military', icon: '⛊', color: '#22c55e' },
  { id: 'NUCLEAR', label: 'Nuclear', icon: '☢', color: '#a855f7' },
  { id: 'MEDICAL', label: 'Medical', icon: '⊕', color: '#ec4899' },
  { id: 'GENERAL', label: 'General', icon: '⬡', color: '#6b7280' },
];

// ── Helpers ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResultCard({ title, data, color }: { title: string; data: Record<string, any>; color?: string }) {
  return (
    <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20, marginTop: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: color || 'var(--ept-accent)', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {Object.entries(data).filter(([,v]) => v !== undefined && v !== null && typeof v !== 'object').map(([k, v]) => (
          <div key={k} style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--ept-text-muted)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}: </span>
            <span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{typeof v === 'number' ? v.toFixed(1) : String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ ok, label }: { ok: boolean | null; label: string }) {
  const c = ok === null ? '#888' : ok ? '#22c55e' : '#ef4444';
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: c }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{label}</span>;
}

function ActionButton({ label, onClick, loading, color, disabled }: { label: string; onClick: () => void; loading?: boolean; color?: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading || disabled}
      style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: color || 'var(--ept-accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: loading || disabled ? 'not-allowed' : 'pointer', opacity: loading || disabled ? 0.6 : 1 }}>
      {loading ? 'Processing...' : label}
    </button>
  );
}

// ── Main Component ──

export default function DaedalusForgePage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<ForgeStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Data
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [stages, setStages] = useState<ManufacturingStage[]>([]);
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [standards, setStandards] = useState<any[]>([]);

  // Analyze state
  const [analyzeDesc, setAnalyzeDesc] = useState('');
  const [analyzeDomain, setAnalyzeDomain] = useState('GENERAL');
  const [analyzeResult, setAnalyzeResult] = useState<AnalysisResult | null>(null);

  // Quality state
  const [qcProject, setQcProject] = useState('');
  const [qcStage, setQcStage] = useState('');
  const [qcResult, setQcResult] = useState<QualityReport | null>(null);

  // Council state
  const [councilProject, setCouncilProject] = useState('');
  const [councilContext, setCouncilContext] = useState('');
  const [councilResult, setCouncilResult] = useState<CouncilVerdict | null>(null);

  // Guild browser
  const [expandedGuild, setExpandedGuild] = useState<string | null>(null);
  const [guildFilter, setGuildFilter] = useState('');

  // Standards
  const [standardsDomain, setStandardsDomain] = useState('');

  // Load data
  useEffect(() => {
    getHealth().then(setHealth).catch(() => {});
    getStats().then(setStats).catch(() => {});
    getGuilds().then(r => setGuilds(r.guilds || [])).catch(() => {});
    getDomains().then(r => setDomains(r.domains || [])).catch(() => {});
    getStages().then(r => setStages(r.stages || [])).catch(() => {});
    getTemplates().then(r => setTemplates(r.templates || [])).catch(() => {});
  }, []);

  // Handlers
  const handleAnalyze = async () => {
    if (!analyzeDesc.trim()) return;
    setLoading(true); setAnalyzeResult(null);
    try {
      const result = await analyzeProject(analyzeDesc, analyzeDomain);
      setAnalyzeResult(result);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleQualityCheck = async () => {
    if (!qcProject.trim()) return;
    setLoading(true); setQcResult(null);
    try {
      const result = await runQualityCheck(qcProject, qcStage || 'design_review', {});
      setQcResult(result);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleCouncilReview = async () => {
    if (!councilProject.trim()) return;
    setLoading(true); setCouncilResult(null);
    try {
      const result = await getCouncilVerdict(councilProject, councilContext);
      setCouncilResult(result);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleLoadStandards = async () => {
    setLoading(true);
    try {
      const result = await getStandards(standardsDomain || undefined);
      setStandards(result.standards || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  // Group stages by phase
  const phaseGroups = stages.reduce<Record<string, ManufacturingStage[]>>((acc, s) => {
    (acc[s.phase] = acc[s.phase] || []).push(s);
    return acc;
  }, {});

  const filteredGuilds = guildFilter ? guilds.filter(g => `${g.name} ${g.domain} ${g.specialization} ${g.capabilities?.join(' ')}`.toLowerCase().includes(guildFilter.toLowerCase())) : guilds;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ept-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, borderRight: '1px solid var(--ept-border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'var(--ept-bg-alt)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={32} height={32} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: -0.3 }}>Echo Prime</span>
        </Link>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--ept-accent)', marginBottom: 12 }}>Daedalus Forge v2.1</div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', marginBottom: 2, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13,
              fontWeight: activeTab === t.id ? 600 : 400, background: activeTab === t.id ? 'var(--ept-accent-glow)' : 'transparent', color: activeTab === t.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{t.icon}</span>{t.label}
          </button>
        ))}
        <div style={{ marginTop: 24, padding: 12, borderRadius: 8, background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', fontSize: 11 }}>
          <StatusBadge ok={health?.status === 'operational'} label={health ? 'Forge Online' : 'Checking...'} />
          <div style={{ marginTop: 8, color: 'var(--ept-text-muted)' }}>{health ? `${health.guilds} guilds | ${health.agents} agents` : 'Loading...'}</div>
          <div style={{ marginTop: 4, color: 'var(--ept-text-muted)' }}>{health ? `${health.stages} pipeline stages` : ''}</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 40px', maxWidth: 1200 }}>

        {/* ═══ DASHBOARD ═══ */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Daedalus Forge</h1>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 14, marginBottom: 32 }}>AI Manufacturing Intelligence Platform — 15 guilds, 1,200 agents, 50-stage pipeline across 8 engineering domains.</p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Guilds', value: health?.guilds || 15, icon: '⛊', color: '#3b82f6' },
                { label: 'Agents', value: health?.agents || 1200, icon: '⬡', color: '#8b5cf6' },
                { label: 'Pipeline Stages', value: health?.stages || 50, icon: '▸▸', color: '#f59e0b' },
                { label: 'Domains', value: health?.domains || 8, icon: '◉', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</span>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Domain Cards */}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Engineering Domains</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
              {DOMAINS.map(d => (
                <button key={d.id} onClick={() => { setActiveTab('analyze'); setAnalyzeDomain(d.id); }}
                  style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 16, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{d.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: d.color }}>{d.label}</div>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <button onClick={() => setActiveTab('analyze')} style={{ padding: 20, borderRadius: 12, border: '2px solid #3b82f6', background: '#3b82f622', color: '#3b82f6', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Analyze a Project
              </button>
              <button onClick={() => setActiveTab('quality')} style={{ padding: 20, borderRadius: 12, border: '2px solid #22c55e', background: '#22c55e22', color: '#22c55e', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Run Quality Check
              </button>
              <button onClick={() => setActiveTab('council')} style={{ padding: 20, borderRadius: 12, border: '2px solid #a855f7', background: '#a855f722', color: '#a855f7', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Trinity Council Review
              </button>
            </div>

            {/* Templates */}
            {templates.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Project Templates</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                  {templates.map(t => (
                    <div key={t.id} onClick={() => { setActiveTab('analyze'); setAnalyzeDesc(t.description); setAnalyzeDomain(t.domain); }}
                      style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 16, cursor: 'pointer' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ept-text)' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 4 }}>{t.domain} | {t.stages} stages</div>
                      <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 4 }}>{t.description?.substring(0, 80)}{t.description?.length > 80 ? '...' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ ANALYZE PROJECT ═══ */}
        {activeTab === 'analyze' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Manufacturing Feasibility Analysis</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Describe your manufacturing project and get AI-powered feasibility analysis, risk assessment, and recommendations.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Input */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Project Description</h3>

                {/* Domain selector */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {DOMAINS.map(d => (
                    <button key={d.id} onClick={() => setAnalyzeDomain(d.id)}
                      style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${analyzeDomain === d.id ? d.color : 'var(--ept-border)'}`, fontSize: 11, cursor: 'pointer',
                        background: analyzeDomain === d.id ? `${d.color}22` : 'var(--ept-bg)', color: analyzeDomain === d.id ? d.color : 'var(--ept-text-muted)', fontWeight: analyzeDomain === d.id ? 600 : 400 }}>
                      {d.icon} {d.label}
                    </button>
                  ))}
                </div>

                <textarea value={analyzeDesc} onChange={e => setAnalyzeDesc(e.target.value)}
                  placeholder="Describe the part or assembly to be manufactured. Include materials, tolerances, quantities, and any special requirements.&#10;&#10;Example: 'Design and manufacture a subsea valve body from Super Duplex 2507 with 5,000 PSI rating, NACE MR0175 compliant, quantities of 50 units, tight ID bore tolerance ±0.002 inch'"
                  style={{ width: '100%', minHeight: 160, padding: 12, borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }} />

                <div style={{ marginTop: 12 }}>
                  <ActionButton label="Analyze Feasibility" onClick={handleAnalyze} loading={loading} />
                </div>
              </div>

              {/* Results */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Analysis Results</h3>
                {!analyzeResult ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>Describe a project and click Analyze to get feasibility results.</div>
                ) : (
                  <div>
                    {/* Feasibility Score */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                      <div style={{ textAlign: 'center', flex: 1, padding: 16, borderRadius: 8, background: 'var(--ept-bg)' }}>
                        <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Feasibility</div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: analyzeResult.feasibility >= 80 ? '#22c55e' : analyzeResult.feasibility >= 50 ? '#f59e0b' : '#ef4444' }}>
                          {analyzeResult.feasibility}%
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1, padding: 16, borderRadius: 8, background: 'var(--ept-bg)' }}>
                        <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Risk Score</div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: analyzeResult.risk_score <= 30 ? '#22c55e' : analyzeResult.risk_score <= 60 ? '#f59e0b' : '#ef4444' }}>
                          {analyzeResult.risk_score}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1, padding: 16, borderRadius: 8, background: 'var(--ept-bg)' }}>
                        <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Est. Stages</div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--ept-accent)' }}>{analyzeResult.estimated_stages}</div>
                      </div>
                    </div>

                    {/* Details */}
                    {analyzeResult.timeline_estimate && (
                      <div style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, marginBottom: 12, fontSize: 12 }}>
                        <span style={{ color: 'var(--ept-text-muted)' }}>Timeline: </span>
                        <span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{analyzeResult.timeline_estimate}</span>
                      </div>
                    )}

                    {analyzeResult.recommendations?.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 6 }}>Recommendations</div>
                        {analyzeResult.recommendations.map((r, i) => (
                          <div key={i} style={{ padding: '6px 10px', fontSize: 12, color: 'var(--ept-text)', borderBottom: '1px solid var(--ept-border)' }}>{r}</div>
                        ))}
                      </div>
                    )}

                    {analyzeResult.materials_suggested?.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', marginBottom: 6 }}>Suggested Materials</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {analyzeResult.materials_suggested.map((m, i) => (
                            <span key={i} style={{ padding: '4px 10px', borderRadius: 12, background: '#3b82f622', color: '#3b82f6', fontSize: 11 }}>{m}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analyzeResult.standards_applicable?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>Applicable Standards</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {analyzeResult.standards_applicable.map((s, i) => (
                            <span key={i} style={{ padding: '4px 10px', borderRadius: 12, background: '#f59e0b22', color: '#f59e0b', fontSize: 11 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ QUALITY CHECK ═══ */}
        {activeTab === 'quality' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Quality Gate Inspection</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Run quality checks against manufacturing standards. Validate materials, processes, and compliance at any pipeline stage.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Quality Check Parameters</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>Project Name</label>
                    <input value={qcProject} onChange={e => setQcProject(e.target.value)} placeholder="e.g., Subsea Valve Body Assembly"
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>Pipeline Stage</label>
                    <select value={qcStage} onChange={e => setQcStage(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13 }}>
                      <option value="">Select stage...</option>
                      <option value="design_review">Design Review</option>
                      <option value="material_cert">Material Certification</option>
                      <option value="first_article">First Article Inspection</option>
                      <option value="in_process">In-Process Inspection</option>
                      <option value="final_inspection">Final Inspection</option>
                      <option value="ndt_testing">NDT Testing</option>
                      <option value="pressure_test">Pressure Test</option>
                      <option value="dimensional">Dimensional Audit</option>
                    </select>
                  </div>
                  <ActionButton label="Run Quality Check" onClick={handleQualityCheck} loading={loading} color="#22c55e" />
                </div>
              </div>

              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Quality Report</h3>
                {!qcResult ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>Enter project details and run a quality check.</div>
                ) : (
                  <div>
                    {/* Pass/Fail */}
                    <div style={{ textAlign: 'center', padding: 16, borderRadius: 8, marginBottom: 16, background: qcResult.pass ? '#22c55e22' : '#ef444422' }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: qcResult.pass ? '#22c55e' : '#ef4444' }}>{qcResult.pass ? 'PASS' : 'FAIL'}</div>
                      <div style={{ fontSize: 14, color: 'var(--ept-text)', marginTop: 4 }}>Score: {qcResult.score}/100</div>
                    </div>

                    {/* Checks */}
                    {qcResult.checks?.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 8 }}>Inspection Checks</div>
                        {qcResult.checks.map((c, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', borderBottom: '1px solid var(--ept-border)', fontSize: 12 }}>
                            <span style={{ color: 'var(--ept-text)' }}>{c.name}</span>
                            <span style={{ fontWeight: 600, color: c.status === 'pass' ? '#22c55e' : c.status === 'fail' ? '#ef4444' : '#f59e0b' }}>{c.status.toUpperCase()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Non-conformances */}
                    {qcResult.non_conformances?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 6 }}>Non-Conformances</div>
                        {qcResult.non_conformances.map((nc, i) => (
                          <div key={i} style={{ padding: '6px 10px', fontSize: 12, color: '#ef4444', background: '#ef444411', borderRadius: 4, marginBottom: 4 }}>{nc}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pipeline Visualization */}
            {stages.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>50-Stage Manufacturing Pipeline</h3>
                {Object.entries(phaseGroups).map(([phase, stagesInPhase]) => (
                  <div key={phase} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ept-accent)', marginBottom: 8, textTransform: 'uppercase' }}>{phase}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {stagesInPhase.map(s => (
                        <span key={s.id} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', background: 'var(--ept-card-bg)', fontSize: 11, color: 'var(--ept-text)' }}>
                          {s.id}. {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ TRINITY COUNCIL ═══ */}
        {activeTab === 'council' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Trinity Council Review</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Submit your manufacturing project for review by the Trinity Council — three AI advisors with distinct perspectives.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Submit for Review</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>Project Name</label>
                    <input value={councilProject} onChange={e => setCouncilProject(e.target.value)} placeholder="e.g., Titanium Landing Gear Bracket"
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>Context / Requirements</label>
                    <textarea value={councilContext} onChange={e => setCouncilContext(e.target.value)}
                      placeholder="Provide manufacturing context: materials, processes, tolerances, standards, concerns..."
                      style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                  <ActionButton label="Request Council Review" onClick={handleCouncilReview} loading={loading} color="#a855f7" />
                </div>
              </div>

              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Council Verdict</h3>
                {!councilResult ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>Submit a project for Trinity Council deliberation.</div>
                ) : (
                  <div>
                    {/* Three Voices */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                      {[
                        { name: 'SAGE', data: councilResult.sage, color: '#8b5cf6', icon: '🟣' },
                        { name: 'NYX', data: councilResult.nyx, color: '#ec4899', icon: '🟤' },
                        { name: 'THORNE', data: councilResult.thorne, color: '#f59e0b', icon: '🟠' },
                      ].map(v => (
                        <div key={v.name} style={{ padding: 12, borderRadius: 8, border: `2px solid ${v.color}`, background: `${v.color}11` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: v.color, marginBottom: 8 }}>{v.icon} {v.name}</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>{v.data?.confidence ? `${v.data.confidence}%` : '—'}</div>
                          <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', lineHeight: 1.4 }}>{v.data?.recommendation || 'Deliberating...'}</div>
                        </div>
                      ))}
                    </div>

                    {/* Consensus */}
                    <div style={{ textAlign: 'center', padding: 16, borderRadius: 8, background: 'var(--ept-bg)', border: '2px solid var(--ept-accent)' }}>
                      <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginBottom: 4 }}>CONSENSUS</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-accent)' }}>{councilResult.consensus}</div>
                      {councilResult.final_verdict && (
                        <div style={{ fontSize: 12, color: 'var(--ept-text)', marginTop: 8, lineHeight: 1.5 }}>{councilResult.final_verdict}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ GUILDS ═══ */}
        {activeTab === 'guilds' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Manufacturing Guilds</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 20 }}>15 specialized guilds with {health?.agents || 1200} AI agents covering every aspect of manufacturing engineering.</p>

            <input type="text" value={guildFilter} onChange={e => setGuildFilter(e.target.value)} placeholder="Search guilds, domains, capabilities..."
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, width: 400, marginBottom: 20 }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 12 }}>
              {filteredGuilds.map(g => (
                <div key={g.name} onClick={() => setExpandedGuild(expandedGuild === g.name ? null : g.name)}
                  style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ept-text)' }}>{g.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{g.domain} | {g.agents} agents</div>
                    </div>
                    <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, background: 'var(--ept-accent-glow)', color: 'var(--ept-accent)', fontWeight: 600 }}>{g.agents}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 8 }}>{g.specialization}</div>
                  {expandedGuild === g.name && g.capabilities?.length > 0 && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--ept-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 6 }}>Capabilities</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {g.capabilities.map((c, i) => (
                          <span key={i} style={{ padding: '3px 8px', borderRadius: 4, background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 10 }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STANDARDS ═══ */}
        {activeTab === 'standards' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Industry Standards</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 20 }}>Browse manufacturing and engineering standards by domain.</p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <button onClick={() => { setStandardsDomain(''); handleLoadStandards(); }}
                style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid var(--ept-border)', fontSize: 12, cursor: 'pointer', background: !standardsDomain ? 'var(--ept-accent)' : 'var(--ept-bg)', color: !standardsDomain ? '#fff' : 'var(--ept-text-muted)' }}>All</button>
              {DOMAINS.map(d => (
                <button key={d.id} onClick={() => { setStandardsDomain(d.id); }}
                  style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid var(--ept-border)', fontSize: 12, cursor: 'pointer',
                    background: standardsDomain === d.id ? d.color : 'var(--ept-bg)', color: standardsDomain === d.id ? '#fff' : 'var(--ept-text-muted)' }}>
                  {d.icon} {d.label}
                </button>
              ))}
              <ActionButton label="Load Standards" onClick={handleLoadStandards} loading={loading} color="#3b82f6" />
            </div>

            {standards.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {standards.map((s, i) => (
                  <div key={i} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ept-accent)' }}>{s.id || s.name}</div>
                    {s.name && s.name !== s.id && <div style={{ fontSize: 12, color: 'var(--ept-text)', marginTop: 4 }}>{s.name}</div>}
                    {s.domain && <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 4 }}>{s.domain}</div>}
                    {s.description && <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 4, lineHeight: 1.4 }}>{s.description}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>Select a domain and click Load Standards to browse.</div>
            )}

            {/* Domain reference cards */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Domain Reference</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {domains.map(d => (
                  <div key={d.id} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ept-text)' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 4 }}>{d.description}</div>
                    {d.standards?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                        {d.standards.map((s, i) => (
                          <span key={i} style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--ept-bg)', color: 'var(--ept-accent)', fontSize: 10, fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
