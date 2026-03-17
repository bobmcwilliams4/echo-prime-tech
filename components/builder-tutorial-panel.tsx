'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  TUTORIALS,
  QUICK_REFERENCE,
  CONTEXT_TRIGGERS,
  type Tutorial,
  type TutorialStep,
} from '../lib/builder-tutorial-data';

/* ── localStorage helpers ── */
const PROGRESS_KEY = 'builder_tutorial_progress';
const DISMISSED_KEY = 'builder_tutorial_dismissed';
const CONTEXT_SEEN_KEY = 'builder_context_seen';

function getProgress(): Record<string, number[]> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}
function setProgress(p: Record<string, number[]>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}
function getDismissed(): boolean {
  return localStorage.getItem(DISMISSED_KEY) === '1';
}
function getContextSeen(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(CONTEXT_SEEN_KEY) || '{}'); } catch { return {}; }
}
function markContextSeen(route: string) {
  const s = getContextSeen(); s[route] = true;
  localStorage.setItem(CONTEXT_SEEN_KEY, JSON.stringify(s));
}

/* ── Theme ── */
const C = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  accentFade: 'rgba(201,169,78,.12)',
  text: '#e2e8f0',
  muted: '#9ca3af',
  danger: '#ef4444',
};

/* ── Illustration sub-components ── */

function IllFrame({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: C.surface }}>
      {children}
      {caption && (
        <div style={{ padding: '6px 10px', fontSize: 10, color: C.muted, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function DashboardPanels({ panels }: { panels: { label: string; value: string; trend?: string }[] }) {
  return (
    <IllFrame caption="Builder Dashboard">
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(panels.length, 3)}, 1fr)`, gap: 1, background: C.border }}>
        {panels.map((p, i) => (
          <div key={i} style={{ padding: '12px 10px', background: C.bg, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>{p.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{p.value}</div>
            {p.trend && <div style={{ fontSize: 9, color: p.trend.startsWith('+') ? '#22c55e' : p.trend.startsWith('-') ? C.danger : C.muted }}>{p.trend}</div>}
          </div>
        ))}
      </div>
    </IllFrame>
  );
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <IllFrame caption="Workflow">
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 12, overflowX: 'auto' }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 600,
              background: i === 0 ? C.accent : C.bg, color: i === 0 ? '#fff' : C.text,
              border: `1px solid ${i === 0 ? C.accent : C.border}`, whiteSpace: 'nowrap',
            }}>{s}</div>
            {i < steps.length - 1 && <span style={{ color: C.muted, fontSize: 12 }}>&rarr;</span>}
          </React.Fragment>
        ))}
      </div>
    </IllFrame>
  );
}

function FormMockup({ fields }: { fields: { label: string; type: string; placeholder?: string }[] }) {
  return (
    <IllFrame caption="Form Preview">
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {fields.map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>{f.label}</div>
            {f.type === 'textarea' ? (
              <div style={{ height: 36, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, padding: '4px 8px', fontSize: 10, color: '#64748b' }}>{f.placeholder || ''}</div>
            ) : f.type === 'select' ? (
              <div style={{ height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, padding: '4px 8px', fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>{f.placeholder || 'Select...'}</span><span>&#9662;</span></div>
            ) : (
              <div style={{ height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, padding: '4px 8px', fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center' }}>{f.placeholder || ''}</div>
            )}
          </div>
        ))}
      </div>
    </IllFrame>
  );
}

function TableMockup({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <IllFrame caption="Data Table">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 10, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: '6px 8px', textAlign: 'left', color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((cell, ci) => (
                  <td key={ci} style={{ padding: '5px 8px', color: C.text, borderBottom: `1px solid ${C.border}` }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </IllFrame>
  );
}

function BarChartSimple({ label, items }: { label?: string; items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <IllFrame caption={label || 'Chart'}>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: C.muted, width: 50, textAlign: 'right', flexShrink: 0 }}>{it.label}</span>
            <div style={{ flex: 1, height: 14, background: C.bg, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(it.value / max) * 100}%`, height: '100%', background: C.accent, borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 9, color: C.text, width: 28, flexShrink: 0 }}>{it.value}</span>
          </div>
        ))}
      </div>
    </IllFrame>
  );
}

function ModalMockup({ title, body, buttons }: { title: string; body?: string; buttons: string[] }) {
  return (
    <IllFrame caption="Dialog">
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>{title}</div>
        {body && <div style={{ fontSize: 10, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{body}</div>}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          {buttons.map((b, i) => (
            <div key={i} style={{
              padding: '5px 14px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: i === buttons.length - 1 ? C.accent : 'transparent',
              color: i === buttons.length - 1 ? '#fff' : C.muted,
              border: i === buttons.length - 1 ? 'none' : `1px solid ${C.border}`,
            }}>{b}</div>
          ))}
        </div>
      </div>
    </IllFrame>
  );
}

function SettingsSections({ sections }: { sections: { title: string; items: { label: string; value: string }[] }[] }) {
  return (
    <IllFrame caption="Settings">
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sections.map((sec, si) => (
          <div key={si}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 4 }}>{sec.title}</div>
            {sec.items.map((it, ii) => (
              <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                <span style={{ fontSize: 10, color: C.muted }}>{it.label}</span>
                <span style={{ fontSize: 10, color: C.text, fontWeight: 500 }}>{it.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </IllFrame>
  );
}

function LiveStatus({ status, label, metrics }: { status: string; label: string; metrics: { label: string; value: string }[] }) {
  const dotColor = status === 'active' ? '#22c55e' : status === 'warning' ? '#eab308' : C.muted;
  return (
    <IllFrame caption={label}>
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, display: 'inline-block', animation: status === 'active' ? 'pulse 2s infinite' : undefined }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'capitalize' }}>{status}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(metrics.length, 3)}, 1fr)`, gap: 8 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{m.value}</div>
              <div style={{ fontSize: 9, color: C.muted }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </IllFrame>
  );
}

/* ── Illustration Dispatcher ── */

function StepIllustration({ step }: { step: TutorialStep }) {
  const cfg = step.illustrationConfig as Record<string, unknown>;
  switch (step.illustrationType) {
    case 'dashboard':
      return <DashboardPanels panels={cfg.panels as { label: string; value: string; trend?: string }[]} />;
    case 'flow':
      return <FlowDiagram steps={cfg.steps as string[]} />;
    case 'form':
      return <FormMockup fields={cfg.fields as { label: string; type: string; placeholder?: string }[]} />;
    case 'table':
      return <TableMockup headers={cfg.headers as string[]} rows={cfg.rows as string[][]} />;
    case 'chart':
      return <BarChartSimple label={cfg.label as string | undefined} items={cfg.items as { label: string; value: number }[]} />;
    case 'modal':
      return <ModalMockup title={cfg.title as string} body={cfg.body as string | undefined} buttons={cfg.buttons as string[]} />;
    case 'settings':
      return <SettingsSections sections={cfg.sections as { title: string; items: { label: string; value: string }[] }[]} />;
    case 'live':
      return <LiveStatus status={cfg.status as string} label={cfg.label as string} metrics={cfg.metrics as { label: string; value: string }[]} />;
    default:
      return null;
  }
}

/* ── Main Component ── */

export default function BuilderTutorialPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'list' | 'quickref' | 'step'>('list');
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgressState] = useState<Record<string, number[]>>({});
  const [lightbox, setLightbox] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  /* load state */
  useEffect(() => {
    setProgressState(getProgress());
    setDismissed(getDismissed());
  }, []);

  /* context triggers — auto-open on first visit */
  useEffect(() => {
    if (!pathname) return;
    const trigger = CONTEXT_TRIGGERS[pathname];
    if (!trigger) return;
    const seen = getContextSeen();
    if (seen[pathname]) return;
    const tut = TUTORIALS.find(t => t.id === trigger.tutorialId);
    if (!tut) return;
    markContextSeen(pathname);
    setTimeout(() => {
      setActiveTutorial(tut);
      setActiveStep(trigger.stepIndex);
      setView('step');
      setOpen(true);
    }, 1500);
  }, [pathname]);

  /* keyboard nav */
  useEffect(() => {
    if (!open || view !== 'step' || !activeTutorial) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goPrev(); }
      if (e.key === 'Escape') { if (lightbox) setLightbox(false); else setView('list'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  /* helpers */
  const markStepComplete = useCallback((tutId: string, stepIdx: number) => {
    setProgressState(prev => {
      const next = { ...prev };
      if (!next[tutId]) next[tutId] = [];
      if (!next[tutId].includes(stepIdx)) next[tutId] = [...next[tutId], stepIdx];
      setProgress(next);
      return next;
    });
  }, []);

  const isTutorialComplete = useCallback((tutId: string) => {
    const tut = TUTORIALS.find(t => t.id === tutId);
    if (!tut) return false;
    return (progress[tutId]?.length || 0) >= tut.steps.length;
  }, [progress]);

  const goNext = useCallback(() => {
    if (!activeTutorial) return;
    markStepComplete(activeTutorial.id, activeStep);
    if (activeStep < activeTutorial.steps.length - 1) setActiveStep(activeStep + 1);
  }, [activeTutorial, activeStep, markStepComplete]);

  const goPrev = useCallback(() => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  }, [activeStep]);

  const openTutorial = useCallback((tut: Tutorial, stepIdx = 0) => {
    setActiveTutorial(tut);
    setActiveStep(stepIdx);
    setView('step');
  }, []);

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  /* only render on /websites/builder paths */
  if (!pathname?.startsWith('/websites/builder')) return null;

  const step = activeTutorial?.steps[activeStep];

  return (
    <>
      {/* ── Floating "?" Button ── */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setDismissed(false); localStorage.removeItem(DISMISSED_KEY); }}
          aria-label="Open builder tutorial"
          style={{
            position: 'fixed', right: 16, bottom: 140, zIndex: 10010,
            width: 44, height: 44, borderRadius: '50%',
            background: C.accent, color: '#fff', border: 'none',
            fontSize: 20, fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 4px 20px rgba(201,169,78,.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ?
        </button>
      )}

      {/* ── Side Panel ── */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: isMobile ? '100vw' : 380, maxWidth: '100vw',
            zIndex: 10011, display: 'flex', flexDirection: 'column',
            background: C.bg, borderLeft: `1px solid ${C.border}`,
            boxShadow: '-8px 0 40px rgba(0,0,0,.5)',
            animation: 'slideIn .2s ease-out',
          }}
        >
          {/* Header */}
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {view !== 'list' && (
                <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16, padding: 0 }}>&larr;</button>
              )}
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                {view === 'step' && activeTutorial ? activeTutorial.title : 'Builder Tutorials'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleDismiss} title="Dismiss" style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14, padding: '2px 6px' }}>&#x2715;</button>
            </div>
          </div>

          {/* Tab bar (list/quickref) */}
          {view !== 'step' && (
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              {(['list', 'quickref'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  style={{
                    flex: 1, padding: '8px 0', border: 'none', cursor: 'pointer',
                    background: 'transparent', fontSize: 12, fontWeight: view === tab ? 600 : 400,
                    color: view === tab ? C.accent : C.muted,
                    borderBottom: view === tab ? `2px solid ${C.accent}` : '2px solid transparent',
                  }}
                >
                  {tab === 'list' ? 'Tutorials' : 'Quick Ref'}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>

            {/* ── Tutorial List ── */}
            {view === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TUTORIALS.map(tut => {
                  const done = progress[tut.id]?.length || 0;
                  const total = tut.steps.length;
                  const complete = done >= total;
                  return (
                    <button
                      key={tut.id}
                      onClick={() => openTutorial(tut)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12,
                        borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface,
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'border-color .15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                    >
                      <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{tut.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{tut.title}</span>
                          {complete && <span style={{ color: '#22c55e', fontSize: 14 }}>&#10003;</span>}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{tut.subtitle}</div>
                        {/* progress bar */}
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.border }}>
                            <div style={{ width: `${(done / total) * 100}%`, height: '100%', borderRadius: 2, background: complete ? '#22c55e' : C.accent, transition: 'width .3s' }} />
                          </div>
                          <span style={{ fontSize: 10, color: C.muted }}>{done}/{total}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Quick Reference ── */}
            {view === 'quickref' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {QUICK_REFERENCE.map((qr, i) => (
                  <div key={i} style={{ padding: 10, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, marginBottom: 2 }}>{qr.action}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{qr.where}</div>
                    <div style={{ fontSize: 11, color: C.text, marginTop: 4 }}>{qr.howTo}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Step View ── */}
            {view === 'step' && activeTutorial && step && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* step dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  {activeTutorial.steps.map((_, i) => {
                    const completed = progress[activeTutorial.id]?.includes(i);
                    const active = i === activeStep;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        style={{
                          width: active ? 18 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
                          background: active ? C.accent : completed ? '#22c55e' : C.border,
                          transition: 'all .2s', padding: 0,
                        }}
                        title={`Step ${i + 1}`}
                      />
                    );
                  })}
                </div>

                {/* step counter */}
                <div style={{ fontSize: 11, color: C.muted, textAlign: 'center' }}>
                  Step {activeStep + 1} of {activeTutorial.steps.length} &middot; ~{activeTutorial.estimatedMinutes} min
                </div>

                {/* title */}
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, textAlign: 'center' }}>{step.title}</h3>

                {/* illustration */}
                <div
                  onClick={() => setLightbox(true)}
                  style={{ cursor: 'zoom-in', borderRadius: 10, overflow: 'hidden' }}
                  title="Click to enlarge"
                >
                  <StepIllustration step={step} />
                </div>

                {/* callout */}
                <div style={{ padding: '10px 14px', borderRadius: 8, background: C.accentFade, border: `1px solid ${C.accent}33`, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
                  {step.callout}
                </div>

                {/* example value */}
                {step.exampleValue && (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, fontSize: 11 }}>
                    <span style={{ color: C.muted }}>Example: </span>
                    <span style={{ color: C.accent, fontWeight: 600 }}>{step.exampleValue}</span>
                  </div>
                )}

                {/* target */}
                {step.target && (
                  <div style={{ fontSize: 11, color: C.muted, textAlign: 'center' }}>
                    Look for: <span style={{ color: C.accent }}>{step.target}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer (step view nav) */}
          {view === 'step' && activeTutorial && (
            <div style={{ padding: '10px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={goPrev}
                disabled={activeStep === 0}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${C.border}`,
                  background: 'transparent', color: activeStep === 0 ? '#333' : C.muted,
                  fontSize: 12, fontWeight: 600, cursor: activeStep === 0 ? 'default' : 'pointer',
                }}
              >
                &larr; Prev
              </button>
              <button
                onClick={() => {
                  markStepComplete(activeTutorial.id, activeStep);
                  if (activeStep < activeTutorial.steps.length - 1) {
                    setActiveStep(activeStep + 1);
                  } else {
                    setView('list');
                  }
                }}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  background: C.accent, color: '#fff',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {activeStep < activeTutorial.steps.length - 1 ? 'Next \u2192' : 'Complete \u2713'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Lightbox Overlay ── */}
      {lightbox && activeTutorial && step && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            background: 'rgba(0,0,0,.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 24,
            cursor: 'zoom-out', animation: 'fadeIn .15s',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, cursor: 'default' }}>
            <StepIllustration step={step} />
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: C.muted }}>
              {step.title} &middot; Click outside to close
            </div>
          </div>
        </div>
      )}

      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
    </>
  );
}
