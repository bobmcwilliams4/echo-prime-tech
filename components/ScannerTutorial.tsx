'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SCANNER_TUTORIALS, SCANNER_QUICK_REF, type Tutorial, type TutorialStep, type QuickRefCard } from '../lib/scanner-tutorial-data';

// ─── localStorage helpers ───
const STORAGE_KEY = 'scanner_tutorial_progress';

function getProgress(): Record<string, number[]> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p: Record<string, number[]>) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// ─── Scanner accent ───
const CYAN = '#06b6d4';

// ─── Illustration Renderers ───
function IllFrame({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div style={{ border: '1px solid var(--ept-card-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ padding: '12px 14px', backgroundColor: 'var(--ept-surface)', minHeight: 80 }}>{children}</div>
      {caption && <div style={{ padding: '6px 14px', fontSize: 11, color: 'var(--ept-text-muted)', borderTop: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>{caption}</div>}
    </div>
  );
}

function DashboardMockup({ config }: { config: Record<string, unknown> }) {
  const stats = config.stats as { label: string; value: string }[];
  return (
    <div>
      {typeof config.title === 'string' && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{String(config.title)}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: 8 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: 8, borderRadius: 8, backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: CYAN }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormMockup({ config }: { config: Record<string, unknown> }) {
  const fields = config.fields as { label: string; value?: string; placeholder?: string }[];
  const button = config.button as string | undefined;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {typeof config.title === 'string' && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 2 }}>{String(config.title)}</div>}
      {fields.map((f, i) => (
        <div key={i}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--ept-text-secondary)', marginBottom: 2 }}>{f.label}</div>
          <div style={{
            padding: '5px 8px', borderRadius: 6, fontSize: 10,
            backgroundColor: 'var(--ept-surface)', border: '1.5px solid var(--ept-border)',
            color: f.value ? 'var(--ept-text)' : 'var(--ept-text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {f.value || f.placeholder || ''}
          </div>
        </div>
      ))}
      {button && (
        <div style={{ padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 600, backgroundColor: CYAN, color: '#fff', textAlign: 'center', marginTop: 2 }}>
          {button}
        </div>
      )}
    </div>
  );
}

function TableMockup({ config }: { config: Record<string, unknown> }) {
  const headers = config.headers as string[];
  const rows = config.rows as string[][];
  const filterLabel = config.filterLabel as string | undefined;
  return (
    <div>
      {filterLabel && (
        <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 9, border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)', marginBottom: 6, backgroundColor: 'var(--ept-card-bg)' }}>
          {filterLabel} ▾
        </div>
      )}
      <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--ept-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${headers.length}, 1fr)`, backgroundColor: 'var(--ept-surface)', borderBottom: '1px solid var(--ept-border)' }}>
          {headers.map((h, i) => <div key={i} style={{ padding: '4px 6px', fontSize: 8, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>{h}</div>)}
        </div>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${headers.length}, 1fr)`, borderBottom: ri < rows.length - 1 ? '1px solid var(--ept-border)' : 'none', backgroundColor: 'var(--ept-card-bg)' }}>
            {row.map((c, ci) => <div key={ci} style={{ padding: '4px 6px', fontSize: 9, color: 'var(--ept-text)' }}>{c}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowDiagram({ config }: { config: Record<string, unknown> }) {
  const nodes = config.nodes as string[];
  return (
    <div>
      {typeof config.title === 'string' && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{String(config.title)}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ textAlign: 'center', padding: '8px 6px', borderRadius: 8, backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', minWidth: 56 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ept-text)' }}>{n}</div>
            </div>
            {i < nodes.length - 1 && <div style={{ color: 'var(--ept-text-muted)', fontSize: 14 }}>→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartMockup({ config }: { config: Record<string, unknown> }) {
  const type = config.type as string;
  if (type === 'bar') {
    const data = config.data as { label: string; value: number }[];
    const max = Math.max(...data.map(d => d.value));
    return (
      <div>
        {typeof config.title === 'string' && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{String(config.title)}</div>}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: Math.max(4, (d.value / max) * 44), backgroundColor: CYAN, borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
              <div style={{ fontSize: 7, color: 'var(--ept-text-muted)', marginTop: 2 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === 'scale') {
    const ranges = config.ranges as { label: string; color: string; description: string }[];
    return (
      <div>
        {typeof config.title === 'string' && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{String(config.title)}</div>}
        <div style={{ display: 'flex', gap: 4 }}>
          {ranges.map((r, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 8, borderRadius: 4, backgroundColor: r.color, marginBottom: 4 }} />
              <div style={{ fontSize: 9, fontWeight: 700, color: r.color }}>{r.label}</div>
              <div style={{ fontSize: 7, color: 'var(--ept-text-muted)', marginTop: 1 }}>{r.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function ModalMockup({ config }: { config: Record<string, unknown> }) {
  const title = config.title as string;
  const fields = config.fields as { label: string; value: string }[] | undefined;
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', overflow: 'hidden' }}>
      <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)' }}>{title}</div>
      </div>
      {fields && (
        <div style={{ padding: '6px 10px' }}>
          {fields.map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 9, borderBottom: i < fields.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>
              <span style={{ color: 'var(--ept-text-muted)', fontWeight: 600 }}>{f.label}</span>
              <span style={{ color: 'var(--ept-text)', fontWeight: 500 }}>{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsMockup({ config }: { config: Record<string, unknown> }) {
  const options = config.options as { label: string; description: string; selected: boolean }[];
  return (
    <div>
      {typeof config.title === 'string' && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>{String(config.title)}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {options.map((o, i) => (
          <div key={i} style={{
            padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8,
            border: `1.5px solid ${o.selected ? CYAN : 'var(--ept-border)'}`,
            backgroundColor: o.selected ? 'rgba(6,182,212,0.08)' : 'var(--ept-card-bg)',
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${o.selected ? CYAN : 'var(--ept-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {o.selected && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: CYAN }} />}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: o.selected ? 700 : 400, color: 'var(--ept-text)' }}>{o.label}</div>
              <div style={{ fontSize: 8, color: 'var(--ept-text-muted)' }}>{o.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveMockup({ config }: { config: Record<string, unknown> }) {
  const items = config.items as { label: string; status: string }[];
  const statusColor = (s: string) => s === 'complete' ? '#10b981' : s === 'running' ? CYAN : 'var(--ept-text-muted)';
  return (
    <div style={{ borderRadius: 8, border: `1px solid ${CYAN}`, backgroundColor: 'var(--ept-card-bg)', overflow: 'hidden' }}>
      {typeof config.title === 'string' && (
        <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--ept-border)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: CYAN, animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)' }}>{String(config.title)}</span>
        </div>
      )}
      <div style={{ padding: '6px 10px' }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', fontSize: 9 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              backgroundColor: statusColor(it.status),
              animation: it.status === 'running' ? 'pulse 1.5s infinite' : 'none',
            }} />
            <span style={{ color: 'var(--ept-text)', flex: 1 }}>{it.label}</span>
            <span style={{ color: statusColor(it.status), fontSize: 8, textTransform: 'uppercase', fontWeight: 600 }}>{it.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step illustration router ───
function StepIllustration({ step }: { step: TutorialStep }) {
  const cfg = step.illustrationConfig || {};
  switch (step.illustrationType) {
    case 'dashboard': return <DashboardMockup config={cfg} />;
    case 'form':      return <FormMockup config={cfg} />;
    case 'table':     return <TableMockup config={cfg} />;
    case 'flow':      return <FlowDiagram config={cfg} />;
    case 'chart':     return <ChartMockup config={cfg} />;
    case 'modal':     return <ModalMockup config={cfg} />;
    case 'settings':  return <SettingsMockup config={cfg} />;
    case 'live':      return <LiveMockup config={cfg} />;
    default:          return null;
  }
}

// ─── Main Component ───
export default function ScannerTutorial() {
  const [open, setOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const [view, setView] = useState<'list' | 'quickref' | 'tutorial'>('list');
  const [lightboxStep, setLightboxStep] = useState<TutorialStep | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { setProgress(getProgress()); }, []);

  useEffect(() => {
    if (!open || view !== 'tutorial' || !selectedTutorial) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentStep(s => Math.min(s + 1, selectedTutorial.steps.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentStep(s => Math.max(s - 1, 0));
      } else if (e.key === 'Escape') {
        if (lightboxStep) setLightboxStep(null);
        else setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, view, selectedTutorial, lightboxStep]);

  const markStepComplete = useCallback((tutId: string, stepIdx: number) => {
    setProgress(prev => {
      const next = { ...prev };
      if (!next[tutId]) next[tutId] = [];
      if (!next[tutId].includes(stepIdx)) next[tutId] = [...next[tutId], stepIdx];
      saveProgress(next);
      return next;
    });
  }, []);

  const isTutorialComplete = (tutId: string) => {
    const tut = SCANNER_TUTORIALS.find(t => t.id === tutId);
    if (!tut) return false;
    return (progress[tutId] || []).length >= tut.steps.length;
  };

  const goNext = () => {
    if (!selectedTutorial) return;
    markStepComplete(selectedTutorial.id, currentStep);
    if (currentStep < selectedTutorial.steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const goPrev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const openTutorial = (tut: Tutorial) => {
    setSelectedTutorial(tut);
    setCurrentStep(0);
    setView('tutorial');
  };

  const step = selectedTutorial?.steps[currentStep];

  return (
    <>
      {/* Floating ? Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Scanner Tutorials & Help"
          style={{
            position: 'fixed', right: 16, bottom: 80, zIndex: 9998,
            width: 44, height: 44, borderRadius: '50%',
            backgroundColor: CYAN, color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(6,182,212,0.4)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ?
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed', right: 0, top: 0, bottom: 0,
            width: isMobile ? '100%' : 380,
            zIndex: 9999, backgroundColor: 'var(--ept-bg)',
            borderLeft: '1px solid var(--ept-border)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
            animation: isMobile ? 'slideUp 0.25s ease-out' : 'slideIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ept-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--ept-card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {view === 'tutorial' && (
                <button onClick={() => { setView('list'); setSelectedTutorial(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ept-text-secondary)', padding: 0 }}>←</button>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>
                {view === 'tutorial' && selectedTutorial ? selectedTutorial.title : 'REVENG Scanner Tutorials'}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ept-text-muted)', padding: '0 4px' }}>×</button>
          </div>

          {/* Tab Bar */}
          {view !== 'tutorial' && (
            <div style={{ display: 'flex', borderBottom: '1px solid var(--ept-border)' }}>
              {(['list', 'quickref'] as const).map(tab => (
                <button key={tab} onClick={() => setView(tab)} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: view === tab ? 700 : 400,
                  color: view === tab ? CYAN : 'var(--ept-text-muted)',
                  borderBottom: view === tab ? `2px solid ${CYAN}` : '2px solid transparent',
                  backgroundColor: 'transparent', border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid',
                  cursor: 'pointer',
                }}>
                  {tab === 'list' ? 'Tutorials' : 'Quick Reference'}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {/* Tutorial List */}
            {view === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SCANNER_TUTORIALS.map(tut => {
                  const done = progress[tut.id] || [];
                  const total = tut.steps.length;
                  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
                  const complete = isTutorialComplete(tut.id);
                  return (
                    <button
                      key={tut.id}
                      onClick={() => openTutorial(tut)}
                      style={{
                        padding: '10px 12px', borderRadius: 8, textAlign: 'left',
                        border: `1px solid ${complete ? '#10b981' : 'var(--ept-border)'}`,
                        backgroundColor: 'var(--ept-card-bg)', cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{tut.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)' }}>{tut.title}</div>
                            <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', marginTop: 1 }}>{tut.subtitle}</div>
                          </div>
                        </div>
                        {complete && <span style={{ fontSize: 14, color: '#10b981' }}>✓</span>}
                      </div>
                      <div style={{ marginTop: 8, height: 3, borderRadius: 2, backgroundColor: 'var(--ept-surface)' }}>
                        <div style={{ height: '100%', borderRadius: 2, backgroundColor: complete ? '#10b981' : CYAN, width: `${pct}%`, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{done.length}/{total} steps</span>
                        <span>{tut.estimatedMinutes} min</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Reference */}
            {view === 'quickref' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SCANNER_QUICK_REF.map((qr: QuickRefCard, qi: number) => (
                  <div key={qi} style={{ borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ept-text)' }}>{qr.title}</span>
                    </div>
                    <div style={{ padding: '6px 12px' }}>
                      {qr.items.map((item, ii) => (
                        <div key={ii} style={{ padding: '5px 0', borderBottom: ii < qr.items.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: CYAN }}>{item.label}</div>
                          <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 1 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tutorial Steps */}
            {view === 'tutorial' && selectedTutorial && step && (
              <div>
                {/* Step dots */}
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 14 }}>
                  {selectedTutorial.steps.map((_, i) => {
                    const isComplete = (progress[selectedTutorial.id] || []).includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        style={{
                          width: i === currentStep ? 20 : 8, height: 8, borderRadius: 4,
                          backgroundColor: i === currentStep ? CYAN : isComplete ? '#10b981' : 'var(--ept-surface)',
                          border: `1px solid ${i === currentStep ? CYAN : isComplete ? '#10b981' : 'var(--ept-border)'}`,
                          cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Step counter */}
                <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', textAlign: 'center', marginBottom: 12 }}>
                  Step {currentStep + 1} of {selectedTutorial.steps.length}
                </div>

                {/* Step title */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', margin: '0 0 8px' }}>{step.title}</h3>

                {/* Illustration (click to enlarge) */}
                {step.illustrationType && (
                  <div onClick={() => setLightboxStep(step)} style={{ cursor: 'zoom-in' }} title="Click to enlarge">
                    <IllFrame caption={step.illustrationType}>
                      <StepIllustration step={step} />
                    </IllFrame>
                  </div>
                )}

                {/* Description callout */}
                <div style={{
                  padding: '10px 14px', borderRadius: 8, marginTop: 10,
                  backgroundColor: 'rgba(6,182,212,0.06)',
                  borderLeft: `3px solid ${CYAN}`,
                }}>
                  <div style={{ fontSize: 12, color: 'var(--ept-text)', lineHeight: 1.5 }}>{step.description}</div>
                </div>

                {/* Callout */}
                {step.callout && (
                  <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 6, backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <div style={{ fontSize: 10, color: 'var(--ept-text-secondary)', lineHeight: 1.4 }}>{step.callout}</div>
                  </div>
                )}

                {/* Example value */}
                {step.exampleValue && (
                  <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                    <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginBottom: 2 }}>Example:</div>
                    <div className="font-mono" style={{ fontSize: 11, color: CYAN }}>{step.exampleValue}</div>
                  </div>
                )}

                {/* Target link */}
                {step.target && (
                  <a
                    href={step.target}
                    style={{
                      display: 'block', marginTop: 8, padding: '6px 10px', borderRadius: 6,
                      fontSize: 10, color: CYAN, textDecoration: 'none', textAlign: 'center',
                      border: `1px solid ${CYAN}`, backgroundColor: 'rgba(6,182,212,0.06)',
                    }}
                  >
                    Go to this page →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer nav */}
          {view === 'tutorial' && selectedTutorial && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--ept-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--ept-card-bg)' }}>
              <button
                onClick={goPrev}
                disabled={currentStep === 0}
                style={{
                  padding: '6px 16px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)',
                  color: currentStep === 0 ? 'var(--ept-text-muted)' : 'var(--ept-text)',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>
              <button
                onClick={goNext}
                style={{
                  padding: '6px 16px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  border: 'none',
                  backgroundColor: currentStep === selectedTutorial.steps.length - 1 ? '#10b981' : CYAN,
                  color: '#fff', cursor: 'pointer',
                }}
              >
                {currentStep === selectedTutorial.steps.length - 1 ? 'Complete ✓' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxStep && (
        <div
          onClick={() => setLightboxStep(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, cursor: 'zoom-out',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 520, padding: 24, borderRadius: 16,
              backgroundColor: 'var(--ept-bg)', border: '1px solid var(--ept-border)',
              cursor: 'default',
            }}
          >
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 12 }}>{lightboxStep.title}</h4>
            <StepIllustration step={lightboxStep} />
            <button
              onClick={() => setLightboxStep(null)}
              style={{
                marginTop: 16, width: '100%', padding: '8px 0', borderRadius: 8,
                border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)',
                color: 'var(--ept-text)', fontSize: 12, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
