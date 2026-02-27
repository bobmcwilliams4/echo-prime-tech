'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import {
  getHealth, getStats, getArchetypes, getPipeline, planProject, buildProject,
  reviewCode, chat, getTemplates, getLanguages,
  type HealthResponse, type ForgeStats, type Archetype, type PipelineStage,
  type BuildResult, type ProjectPlan, type CodeReview, type ConversationMessage,
} from '../../lib/hephaestion-forge-api';

// ── Constants ──

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
  { id: 'build', label: 'Build Project', icon: '◎' },
  { id: 'review', label: 'Code Review', icon: '✦' },
  { id: 'chat', label: 'AI Chat', icon: '⟨⟩' },
  { id: 'archetypes', label: 'Archetypes', icon: '⬡' },
  { id: 'pipeline', label: 'Pipeline', icon: '▸▸' },
] as const;

type TabId = typeof TABS[number]['id'];

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', Python: '#3572A5', Rust: '#DEA584', Go: '#00ADD8',
  Solidity: '#AA6746', 'C/C++': '#555555', Swift: '#F05138', Kotlin: '#A97BFF',
};

// ── Helpers ──

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

export default function HephaestionForgePage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<ForgeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Data
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [templates, setTemplates] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [languages, setLanguages] = useState<any>(null);

  // Build state
  const [buildDesc, setBuildDesc] = useState('');
  const [buildArch, setBuildArch] = useState('');
  const [buildLang, setBuildLang] = useState('');
  const [buildPlan, setBuildPlan] = useState<ProjectPlan | null>(null);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [buildStep, setBuildStep] = useState<'describe' | 'plan' | 'building' | 'complete'>('describe');

  // Review state
  const [reviewCodeText, setReviewCodeText] = useState('');
  const [reviewLang, setReviewLang] = useState('typescript');
  const [reviewResult, setReviewResult] = useState<CodeReview | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string; artifacts?: { name: string; type: string; content: string }[] }[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Archetype browser
  const [expandedArch, setExpandedArch] = useState<string | null>(null);
  const [archFilter, setArchFilter] = useState('');

  // Load data
  useEffect(() => {
    getHealth().then(setHealth).catch(() => {});
    getStats().then(setStats).catch(() => {});
    getArchetypes().then(r => setArchetypes(r.archetypes || [])).catch(() => {});
    getPipeline().then(r => setPipeline(r.stages || [])).catch(() => {});
    getTemplates().then(r => setTemplates(r.templates || [])).catch(() => {});
    getLanguages().then(setLanguages).catch(() => {});
  }, []);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handlers
  const handlePlan = async () => {
    if (!buildDesc.trim()) return;
    setLoading(true); setBuildPlan(null); setBuildResult(null);
    try {
      const plan = await planProject(buildDesc, buildArch || undefined, buildLang || undefined);
      setBuildPlan(plan);
      setBuildStep('plan');
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleBuild = async () => {
    if (!buildPlan) return;
    setLoading(true); setBuildResult(null); setBuildStep('building');
    try {
      const result = await buildProject(buildPlan);
      setBuildResult(result);
      setBuildStep('complete');
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleReview = async () => {
    if (!reviewCodeText.trim()) return;
    setLoading(true); setReviewResult(null);
    try {
      const result = await reviewCode(reviewCodeText, reviewLang);
      setReviewResult(result);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const result = await chat(userMsg, chatMessages.length > 0 ? chatMessages.map(m => `${m.role}: ${m.content}`).join('\n') : undefined);
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.content || JSON.stringify(result), artifacts: result.artifacts }]);
    } catch { setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error processing request. Please try again.' }]); }
    setLoading(false);
  };

  // Group pipeline by phase
  const phaseGroups = pipeline.reduce<Record<string, PipelineStage[]>>((acc, s) => {
    (acc[s.phase] = acc[s.phase] || []).push(s);
    return acc;
  }, {});

  const filteredArchetypes = archFilter ? archetypes.filter(a => `${a.name} ${a.description} ${a.stack?.join(' ')} ${a.default_language}`.toLowerCase().includes(archFilter.toLowerCase())) : archetypes;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ept-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, borderRight: '1px solid var(--ept-border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'var(--ept-bg-alt)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={32} height={32} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: -0.3 }}>Echo Prime</span>
        </Link>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--ept-accent)', marginBottom: 12 }}>Hephaestion Forge v2.1</div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', marginBottom: 2, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13,
              fontWeight: activeTab === t.id ? 600 : 400, background: activeTab === t.id ? 'var(--ept-accent-glow)' : 'transparent', color: activeTab === t.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{t.icon}</span>{t.label}
          </button>
        ))}
        <div style={{ marginTop: 24, padding: 12, borderRadius: 8, background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', fontSize: 11 }}>
          <StatusBadge ok={health?.status === 'healthy'} label={health ? 'Forge Online' : 'Checking...'} />
          <div style={{ marginTop: 8, color: 'var(--ept-text-muted)' }}>{health ? `${health.archetypes} archetypes | ${health.languages} languages` : 'Loading...'}</div>
          <div style={{ marginTop: 4, color: 'var(--ept-text-muted)' }}>{health ? `${health.pipeline_stages}-stage pipeline | ${health.quality_gates} gates` : ''}</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 40px', maxWidth: 1200 }}>

        {/* ═══ DASHBOARD ═══ */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Hephaestion Forge</h1>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 14, marginBottom: 32 }}>AI-Powered Software Factory — describe what you want to build, and the forge generates production-ready code with full test coverage and documentation.</p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Archetypes', value: health?.archetypes || stats?.archetypes?.length || 15, icon: '◎', color: '#3b82f6' },
                { label: 'Pipeline Stages', value: health?.pipeline_stages || stats?.pipeline_stages || 13, icon: '▸▸', color: '#8b5cf6' },
                { label: 'Quality Gates', value: health?.quality_gates || stats?.quality_gates || 6, icon: '✦', color: '#f59e0b' },
                { label: 'Languages', value: health?.languages || languages?.languages?.length || 5, icon: '⟨⟩', color: '#22c55e' },
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

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
              <button onClick={() => setActiveTab('build')} style={{ padding: 24, borderRadius: 12, border: '2px solid #3b82f6', background: '#3b82f622', color: '#3b82f6', fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>◎</div>
                <div>Build a Project</div>
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, opacity: 0.8 }}>Describe → Plan → Build → Deploy</div>
              </button>
              <button onClick={() => setActiveTab('review')} style={{ padding: 24, borderRadius: 12, border: '2px solid #22c55e', background: '#22c55e22', color: '#22c55e', fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✦</div>
                <div>Code Review</div>
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, opacity: 0.8 }}>Paste code for quality analysis</div>
              </button>
              <button onClick={() => setActiveTab('chat')} style={{ padding: 24, borderRadius: 12, border: '2px solid #a855f7', background: '#a855f722', color: '#a855f7', fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⟨⟩</div>
                <div>AI Code Chat</div>
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, opacity: 0.8 }}>Conversational code generation</div>
              </button>
            </div>

            {/* Languages */}
            {languages?.languages && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Supported Languages & Frameworks</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {languages.languages.map((lang: string) => (
                    <div key={lang} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 16 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: LANG_COLORS[lang] || 'var(--ept-text)' }}>{lang}</div>
                      {languages.frameworks?.[lang] && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                          {languages.frameworks[lang].map((f: string) => (
                            <span key={f} style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--ept-bg)', color: 'var(--ept-text-muted)', fontSize: 10 }}>{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Capabilities */}
            {stats?.capabilities && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 12 }}>Capabilities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {stats.capabilities.map(c => (
                    <span key={c} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', background: 'var(--ept-card-bg)', fontSize: 11, color: 'var(--ept-text)' }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ BUILD PROJECT ═══ */}
        {activeTab === 'build' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Build a Project</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Describe your project in natural language. The forge will plan the architecture, generate code, run quality gates, and package for delivery.</p>

            {/* Progress Steps */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
              {['describe', 'plan', 'building', 'complete'].map((step, i) => (
                <div key={step} style={{ flex: 1, height: 4, borderRadius: 2, background: ['describe', 'plan', 'building', 'complete'].indexOf(buildStep) >= i ? 'var(--ept-accent)' : 'var(--ept-border)' }} />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Input */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                {buildStep === 'describe' && (
                  <>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Step 1: Describe Your Project</h3>
                    <textarea value={buildDesc} onChange={e => setBuildDesc(e.target.value)}
                      placeholder="Describe what you want to build in plain English.&#10;&#10;Example: 'Build a REST API with Hono for managing a todo list. It should have CRUD endpoints, D1 database storage, authentication with JWT tokens, and deploy to Cloudflare Workers.'"
                      style={{ width: '100%', minHeight: 160, padding: 12, borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>Archetype (optional)</label>
                        <select value={buildArch} onChange={e => setBuildArch(e.target.value)}
                          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13 }}>
                          <option value="">Auto-detect</option>
                          {archetypes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>Language (optional)</label>
                        <select value={buildLang} onChange={e => setBuildLang(e.target.value)}
                          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13 }}>
                          <option value="">Auto-detect</option>
                          {(languages?.languages || ['TypeScript', 'Python', 'Rust', 'Go', 'Solidity']).map((l: string) => <option key={l} value={l.toLowerCase()}>{l}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <ActionButton label="Generate Plan" onClick={handlePlan} loading={loading} />
                    </div>
                  </>
                )}

                {buildStep === 'plan' && buildPlan && (
                  <>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Step 2: Review Plan</h3>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, fontSize: 12 }}>
                        <span style={{ color: 'var(--ept-text-muted)' }}>Archetype: </span><span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{buildPlan.archetype}</span>
                      </div>
                      <div style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, fontSize: 12 }}>
                        <span style={{ color: 'var(--ept-text-muted)' }}>Language: </span><span style={{ fontWeight: 600, color: LANG_COLORS[buildPlan.language] || 'var(--ept-text)' }}>{buildPlan.language}</span>
                      </div>
                      {buildPlan.framework && (
                        <div style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, fontSize: 12 }}>
                          <span style={{ color: 'var(--ept-text-muted)' }}>Framework: </span><span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{buildPlan.framework}</span>
                        </div>
                      )}
                      <div style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, fontSize: 12 }}>
                        <span style={{ color: 'var(--ept-text-muted)' }}>Estimated: </span><span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{buildPlan.estimated_files} files, {buildPlan.estimated_lines?.toLocaleString()} lines</span>
                      </div>
                      {buildPlan.estimated_time && (
                        <div style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, fontSize: 12 }}>
                          <span style={{ color: 'var(--ept-text-muted)' }}>Time: </span><span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{buildPlan.estimated_time}</span>
                        </div>
                      )}
                      {buildPlan.architecture && (
                        <div style={{ padding: '8px 12px', background: 'var(--ept-bg)', borderRadius: 6, fontSize: 12 }}>
                          <span style={{ color: 'var(--ept-text-muted)' }}>Architecture: </span><span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{buildPlan.architecture}</span>
                        </div>
                      )}
                    </div>
                    {buildPlan.stages?.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 6 }}>Build Stages</div>
                        {buildPlan.stages.map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12 }}>
                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--ept-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                            <span style={{ color: 'var(--ept-text)' }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {buildPlan.dependencies?.length > 0 && (
                      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {buildPlan.dependencies.map((d, i) => (
                          <span key={i} style={{ padding: '3px 8px', borderRadius: 4, background: 'var(--ept-bg)', color: 'var(--ept-text-muted)', fontSize: 10 }}>{d}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <ActionButton label="Execute Build" onClick={handleBuild} loading={loading} color="#22c55e" />
                      <button onClick={() => { setBuildStep('describe'); setBuildPlan(null); }}
                        style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'transparent', color: 'var(--ept-text)', fontSize: 13, cursor: 'pointer' }}>Back</button>
                    </div>
                  </>
                )}

                {buildStep === 'building' && (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 8 }}>Building...</div>
                    <div style={{ fontSize: 13, color: 'var(--ept-text-muted)' }}>The forge is generating your project through the {health?.pipeline_stages || 13}-stage pipeline.</div>
                    <div style={{ marginTop: 16, height: 4, background: 'var(--ept-border)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--ept-accent)', width: '60%', borderRadius: 2, animation: 'pulse 2s infinite' }} />
                    </div>
                  </div>
                )}

                {buildStep === 'complete' && (
                  <>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#22c55e', marginBottom: 16 }}>Build Complete</h3>
                    <button onClick={() => { setBuildStep('describe'); setBuildPlan(null); setBuildResult(null); setBuildDesc(''); }}
                      style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--ept-accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Start New Build
                    </button>
                  </>
                )}
              </div>

              {/* Results */}
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Build Output</h3>
                {!buildResult ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>
                    {buildStep === 'describe' ? 'Describe your project to start the build pipeline.' :
                     buildStep === 'plan' ? 'Review the plan and click Execute Build.' :
                     buildStep === 'building' ? 'Build in progress...' : ''}
                  </div>
                ) : (
                  <div>
                    {/* Summary stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                      <div style={{ textAlign: 'center', padding: 12, background: 'var(--ept-bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{buildResult.files_generated}</div>
                        <div style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>Files</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: 12, background: 'var(--ept-bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#8b5cf6' }}>{buildResult.lines_of_code?.toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>Lines</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: 12, background: 'var(--ept-bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: buildResult.quality_score >= 80 ? '#22c55e' : '#f59e0b' }}>{buildResult.quality_score}</div>
                        <div style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>Quality</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'grid', gap: 6, marginBottom: 16 }}>
                      <div style={{ padding: '6px 10px', background: 'var(--ept-bg)', borderRadius: 4, fontSize: 12 }}>
                        <span style={{ color: 'var(--ept-text-muted)' }}>Test Coverage: </span><span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{buildResult.test_coverage}%</span>
                      </div>
                      <div style={{ padding: '6px 10px', background: 'var(--ept-bg)', borderRadius: 4, fontSize: 12 }}>
                        <span style={{ color: 'var(--ept-text-muted)' }}>Stages Completed: </span><span style={{ fontWeight: 600, color: 'var(--ept-text)' }}>{buildResult.stages_completed}/{health?.pipeline_stages || 13}</span>
                      </div>
                    </div>

                    {/* Artifacts */}
                    {buildResult.artifacts?.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 8 }}>Generated Artifacts</div>
                        {buildResult.artifacts.map((a, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid var(--ept-border)', fontSize: 12 }}>
                            <span style={{ color: 'var(--ept-text)' }}>{a.name}</span>
                            <span style={{ color: 'var(--ept-text-muted)' }}>{a.type} | {a.size ? `${(a.size / 1024).toFixed(1)}KB` : '—'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Warnings */}
                    {buildResult.warnings?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>Warnings</div>
                        {buildResult.warnings.map((w, i) => (
                          <div key={i} style={{ padding: '4px 8px', fontSize: 11, color: '#f59e0b', background: '#f59e0b11', borderRadius: 4, marginBottom: 4 }}>{w}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CODE REVIEW ═══ */}
        {activeTab === 'review' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Code Review</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>Paste your code for automated quality analysis, security scanning, and improvement suggestions.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)' }}>Code Input</h3>
                  <select value={reviewLang} onChange={e => setReviewLang(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 12 }}>
                    {['typescript', 'python', 'rust', 'go', 'javascript', 'solidity'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <textarea value={reviewCodeText} onChange={e => setReviewCodeText(e.target.value)}
                  placeholder="Paste your code here for review..."
                  style={{ width: '100%', minHeight: 300, padding: 12, borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 12, fontFamily: 'monospace', resize: 'vertical', tabSize: 2 }} />
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <ActionButton label="Review Code" onClick={handleReview} loading={loading} color="#22c55e" />
                  <button onClick={() => { setReviewCodeText(''); setReviewResult(null); }}
                    style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'transparent', color: 'var(--ept-text)', fontSize: 13, cursor: 'pointer' }}>Clear</button>
                </div>
              </div>

              <div style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 16 }}>Review Results</h3>
                {!reviewResult ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>Paste code and click Review to get analysis.</div>
                ) : (
                  <div>
                    {/* Quality Score */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                      <div style={{ textAlign: 'center', flex: 1, padding: 16, borderRadius: 8, background: 'var(--ept-bg)' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: reviewResult.quality_score >= 80 ? '#22c55e' : reviewResult.quality_score >= 60 ? '#f59e0b' : '#ef4444' }}>
                          {reviewResult.quality_score}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Quality Score</div>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1, padding: 16, borderRadius: 8, background: 'var(--ept-bg)' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--ept-text)' }}>{reviewResult.complexity || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>Complexity</div>
                      </div>
                    </div>

                    {/* Issues */}
                    {reviewResult.issues?.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)', marginBottom: 8 }}>Issues ({reviewResult.issues.length})</div>
                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                          {reviewResult.issues.map((issue, i) => (
                            <div key={i} style={{ padding: '8px 10px', borderBottom: '1px solid var(--ept-border)', fontSize: 12 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600, color: issue.severity === 'error' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                                  {issue.severity?.toUpperCase()} {issue.line ? `L${issue.line}` : ''}
                                </span>
                              </div>
                              <div style={{ color: 'var(--ept-text)', marginTop: 2 }}>{issue.message}</div>
                              {issue.suggestion && <div style={{ color: '#22c55e', marginTop: 2, fontStyle: 'italic' }}>{issue.suggestion}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {reviewResult.recommendations?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 6 }}>Recommendations</div>
                        {reviewResult.recommendations.map((r, i) => (
                          <div key={i} style={{ padding: '6px 10px', fontSize: 12, color: 'var(--ept-text)', borderBottom: '1px solid var(--ept-border)' }}>{r}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI CHAT ═══ */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>AI Code Chat</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 16 }}>Conversational code generation — describe what you need, iterate on the output, refine until perfect.</p>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: '12px 12px 0 0' }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>
                  Start a conversation. Ask the forge to write code, explain concepts, debug issues, or plan architecture.
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                    background: msg.role === 'user' ? 'var(--ept-accent)' : 'var(--ept-bg)', color: msg.role === 'user' ? '#fff' : 'var(--ept-text)' }}>
                    {msg.content.split('\n').map((line, j) => <div key={j}>{line || <br />}</div>)}
                  </div>
                  {msg.artifacts?.map((a, j) => (
                    <div key={j} style={{ marginTop: 8, maxWidth: '80%', padding: 12, borderRadius: 8, background: 'var(--ept-bg)', border: '1px solid var(--ept-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 4 }}>{a.name} ({a.type})</div>
                      <pre style={{ fontSize: 11, color: 'var(--ept-text)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{a.content?.substring(0, 500)}{(a.content?.length || 0) > 500 ? '...' : ''}</pre>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div style={{ display: 'flex', gap: 8, padding: 12, background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderTop: 'none', borderRadius: '0 0 12px 12px' }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChat()}
                placeholder="Type your message... (Enter to send)"
                style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13 }} />
              <ActionButton label="Send" onClick={handleChat} loading={loading} />
              {chatMessages.length > 0 && (
                <button onClick={() => setChatMessages([])}
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'transparent', color: 'var(--ept-text-muted)', fontSize: 12, cursor: 'pointer' }}>Clear</button>
              )}
            </div>
          </div>
        )}

        {/* ═══ ARCHETYPES ═══ */}
        {activeTab === 'archetypes' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Project Archetypes</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 20 }}>15 battle-tested project templates. Each defines architecture, dependencies, patterns, and quality gates for its domain.</p>

            <input type="text" value={archFilter} onChange={e => setArchFilter(e.target.value)} placeholder="Search archetypes, stacks, languages..."
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--ept-border)', background: 'var(--ept-bg)', color: 'var(--ept-text)', fontSize: 13, width: 400, marginBottom: 20 }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 12 }}>
              {filteredArchetypes.map(a => (
                <div key={a.id} onClick={() => setExpandedArch(expandedArch === a.id ? null : a.id)}
                  style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ept-text)' }}>{a.name}</div>
                    <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, background: LANG_COLORS[a.default_language] ? `${LANG_COLORS[a.default_language]}22` : 'var(--ept-bg)', color: LANG_COLORS[a.default_language] || 'var(--ept-text-muted)', fontWeight: 600 }}>{a.default_language}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 8, lineHeight: 1.4 }}>{a.description}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {a.stack?.map((s, i) => (
                      <span key={i} style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--ept-bg)', color: 'var(--ept-text-muted)', fontSize: 10 }}>{s}</span>
                    ))}
                  </div>
                  {expandedArch === a.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--ept-border)' }}>
                      {a.estimated_time && <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginBottom: 4 }}>Estimated build time: <b>{a.estimated_time}</b></div>}
                      {a.stages?.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-accent)', marginBottom: 4 }}>Pipeline Stages</div>
                          {a.stages.map((s, i) => (
                            <div key={i} style={{ fontSize: 11, color: 'var(--ept-text)', padding: '2px 0' }}>{i + 1}. {s}</div>
                          ))}
                        </div>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setActiveTab('build'); setBuildArch(a.id); }}
                        style={{ marginTop: 12, padding: '8px 16px', borderRadius: 6, border: 'none', background: 'var(--ept-accent)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Build with this Archetype
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PIPELINE ═══ */}
        {activeTab === 'pipeline' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Build Pipeline</h2>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, marginBottom: 24 }}>{health?.pipeline_stages || 13}-stage automated pipeline with {health?.quality_gates || 6} quality gates. Every project passes through all stages.</p>

            {/* Phase colors */}
            {(() => {
              const phaseColors: Record<string, string> = { ANALYSIS: '#3b82f6', SCAFFOLDING: '#8b5cf6', GENERATION: '#f59e0b', QUALITY: '#22c55e', DELIVERY: '#06b6d4' };
              return Object.entries(phaseGroups).map(([phase, stagesInPhase]) => (
                <div key={phase} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: phaseColors[phase] || 'var(--ept-accent)' }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: phaseColors[phase] || 'var(--ept-accent)', textTransform: 'uppercase', letterSpacing: 1 }}>{phase}</span>
                    <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>({stagesInPhase.length} stages)</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 8, marginLeft: 24 }}>
                    {stagesInPhase.map(s => (
                      <div key={s.id} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 8, padding: 12, borderLeft: `3px solid ${phaseColors[phase] || 'var(--ept-accent)'}` }}>
                        <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--ept-text)' }}>{s.id}. {s.name}</div>
                        {s.description && <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 4 }}>{s.description}</div>}
                        {s.quality_gate && <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 4, fontWeight: 600 }}>Gate: {s.quality_gate}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}

            {pipeline.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--ept-text-muted)', fontSize: 13 }}>Loading pipeline stages...</div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
