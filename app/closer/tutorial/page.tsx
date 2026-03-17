'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../lib/theme-context';
import { TUTORIALS, QUICK_REFERENCE, type Tutorial } from '../../../lib/closer-tutorial-data';

/* ═══════════════════════════════════════════════════════════════════════════
   CLOSER AI — INTERACTIVE TUTORIAL PAGE
   /closer/tutorial — Public, no auth required
   Designed for a 60-year-old sales rep who has never used AI software.
   ═══════════════════════════════════════════════════════════════════════════ */

// ── localStorage progress ──
const STORAGE_KEY = 'ept_tutorial_progress';
function getProgress(): Record<string, number[]> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p: Record<string, number[]>) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function isTutorialComplete(tutorialId: string, totalSteps: number, progress: Record<string, number[]>): boolean {
  return (progress[tutorialId]?.length || 0) >= totalSteps;
}

// ── Illustration mini-components for the full page ──

function KpiCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || 'var(--ept-text)', marginTop: 4 }}>{value}</div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ept-accent)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
    </div>
  );
}

function FlowStep({ icon, label, color }: { icon: string; label: string; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: color || 'var(--ept-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text)', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, color: '#fff', backgroundColor: color }}>{label}</span>
  );
}

// ── Tutorial step viewer component ──

function TutorialViewer({ tutorial, progress, onProgress }: { tutorial: Tutorial; progress: Record<string, number[]>; onProgress: (p: Record<string, number[]>) => void }) {
  const [step, setStep] = useState(0);
  const current = tutorial.steps[step];
  const completed = progress[tutorial.id] || [];
  const isStepDone = completed.includes(step);
  const allDone = completed.length >= tutorial.steps.length;

  function markDone() {
    const next = { ...progress };
    if (!next[tutorial.id]) next[tutorial.id] = [];
    if (!next[tutorial.id].includes(step)) next[tutorial.id] = [...next[tutorial.id], step];
    onProgress(next);
    saveProgress(next);
    if (step < tutorial.steps.length - 1) setStep(step + 1);
  }

  return (
    <div>
      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {tutorial.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 700,
              backgroundColor: i === step ? 'var(--ept-accent)' : completed.includes(i) ? '#10b981' : 'var(--ept-surface)',
              color: i === step || completed.includes(i) ? '#fff' : 'var(--ept-text-muted)',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {completed.includes(i) && i !== step ? '✓' : i + 1}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div style={{ borderRadius: 12, border: '1px solid var(--ept-border)', overflow: 'hidden', backgroundColor: 'var(--ept-card-bg)' }}>
        {/* Step header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
          <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>
            Step {step + 1} of {tutorial.steps.length}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ept-text)', margin: 0 }}>{current.title}</h3>
        </div>

        {/* Callout */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ept-border)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--ept-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>?</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ept-text-secondary)', margin: 0 }}>{current.callout}</p>
          </div>
        </div>

        {/* Illustration area */}
        <div style={{ padding: '16px 20px' }}>
          <StepIllustration step={current} />
        </div>

        {/* Example value if present */}
        {current.exampleValue && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: 'var(--ept-surface)', border: '1px dashed var(--ept-border)' }}>
              <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Example: </span>
              <span style={{ fontSize: 13, color: 'var(--ept-accent)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{current.exampleValue}</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)', fontSize: 12, fontWeight: 600, cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          <button
            onClick={markDone}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: isStepDone ? '#10b981' : 'var(--ept-accent)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            {isStepDone ? '✓ Done' : step === tutorial.steps.length - 1 ? 'Complete Tutorial' : 'Got it — Next →'}
          </button>
        </div>
      </div>

      {/* Completion banner */}
      {allDone && (
        <div style={{ marginTop: 16, padding: '16px 20px', borderRadius: 12, backgroundColor: '#10b98120', border: '1px solid #10b98150', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>Tutorial Complete!</div>
            <div style={{ fontSize: 12, color: 'var(--ept-text-secondary)' }}>You&apos;ve completed all {tutorial.steps.length} steps in &quot;{tutorial.title}&quot;</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step illustration renderer ──

function StepIllustration({ step }: { step: import('../../../lib/closer-tutorial-data').TutorialStep }) {
  const cfg = step.illustrationConfig;
  const type = step.illustrationType;

  if (type === 'dashboard' && cfg.type === 'hero') {
    const kpis = cfg.kpis as { label: string; value: string; color?: string }[];
    const activity = cfg.activity as string[];
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {kpis.map((k, i) => <KpiCard key={i} label={k.label} value={k.value} color={k.color} />)}
        </div>
        {activity && activity.length > 0 && (
          <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', overflow: 'hidden' }}>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--ept-surface)', fontSize: 9, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live Activity</div>
            {activity.map((a, i) => (
              <div key={i} style={{ padding: '8px 10px', fontSize: 11, color: 'var(--ept-text-secondary)', borderTop: '1px solid var(--ept-border)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }} />
                {a}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === 'dashboard' && cfg.type === 'analytics') {
    const kpis = cfg.kpis as { label: string; value: string; color?: string }[];
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {kpis.map((k, i) => <KpiCard key={i} label={k.label} value={k.value} color={k.color} />)}
      </div>
    );
  }

  if (type === 'flow') {
    const steps = cfg.steps as { label: string; icon: string; desc: string; color?: string }[];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center', padding: '8px 0' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <FlowStep icon={s.icon} label={s.label} color={s.color} />
            {i < steps.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    const fields = cfg.fields as { label: string; value?: string; type?: string }[];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {fields.map((f, i) => (
          <div key={i}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{f.label}</label>
            {f.type === 'select' ? (
              <div style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 12, color: 'var(--ept-text)' }}>{f.value || 'Select...'} ▾</div>
            ) : f.type === 'textarea' ? (
              <div style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 12, color: 'var(--ept-text)', minHeight: 48, lineHeight: 1.5 }}>{f.value || ''}</div>
            ) : f.type === 'toggle' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: '#10b981', position: 'relative' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, right: 2 }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--ept-text-secondary)' }}>{f.value || 'Enabled'}</span>
              </div>
            ) : (
              <div style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 12, color: f.value ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>{f.value || 'Enter...'}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'settings') {
    const sections = cfg.sections as { label: string; desc: string; type?: string; value?: string }[];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sections?.map((s, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)' }}>{s.label}</div>
              <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', marginTop: 2 }}>{s.desc}</div>
            </div>
            {s.type === 'toggle' ? (
              <div style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: s.value === 'on' ? '#10b981' : 'var(--ept-border)', position: 'relative' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, right: s.value === 'on' ? 2 : 'auto', left: s.value === 'on' ? 'auto' : 2 }} />
              </div>
            ) : (
              <span style={{ fontSize: 11, color: 'var(--ept-accent)', fontWeight: 600 }}>{s.value || '→'}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    const columns = cfg.columns as string[];
    const rows = cfg.rows as string[][];
    return (
      <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, backgroundColor: 'var(--ept-surface)' }}>
          {columns.map((c, i) => (
            <div key={i} style={{ padding: '6px 10px', fontSize: 9, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', borderRight: i < columns.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>{c}</div>
          ))}
        </div>
        {rows?.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, borderTop: '1px solid var(--ept-border)' }}>
            {row.map((cell, ci) => (
              <div key={ci} style={{ padding: '8px 10px', fontSize: 11, color: 'var(--ept-text-secondary)', borderRight: ci < columns.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'modal') {
    const title = cfg.title as string;
    const fields = cfg.fields as { label: string; value?: string }[];
    const btn = cfg.button as string;
    return (
      <div style={{ borderRadius: 12, border: '1px solid var(--ept-border)', overflow: 'hidden', maxWidth: 340, margin: '0 auto' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ept-text)' }}>{title}</span>
          <span style={{ fontSize: 16, color: 'var(--ept-text-muted)', cursor: 'pointer' }}>×</span>
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fields?.map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              <div style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 12, color: f.value ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>{f.value || '...'}</div>
            </div>
          ))}
        </div>
        {btn && (
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--ept-border)' }}>
            <div style={{ padding: '8px 0', borderRadius: 8, backgroundColor: 'var(--ept-accent)', color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{btn}</div>
          </div>
        )}
      </div>
    );
  }

  if (type === 'chart') {
    const bars = cfg.bars as { label: string; value: number; color?: string }[];
    const chartType = cfg.type as string;
    if (chartType === 'dispositions') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {bars?.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', width: 70, textAlign: 'right', flexShrink: 0 }}>{b.label}</span>
              <div style={{ flex: 1, height: 16, borderRadius: 4, backgroundColor: 'var(--ept-surface)', overflow: 'hidden' }}>
                <div style={{ width: `${b.value}%`, height: '100%', borderRadius: 4, backgroundColor: b.color || 'var(--ept-accent)', transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text)', width: 30 }}>{b.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    if (chartType === 'hours') {
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80, padding: '0 4px' }}>
          {bars?.map((b, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ width: '100%', height: `${b.value}%`, borderRadius: 3, backgroundColor: b.color || 'var(--ept-accent)', minHeight: 4, transition: 'height 0.5s' }} />
              <span style={{ fontSize: 8, color: 'var(--ept-text-muted)' }}>{b.label}</span>
            </div>
          ))}
        </div>
      );
    }
    if (chartType === 'cost') {
      const items = cfg.items as { label: string; amount: string; pct: number }[];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <span style={{ fontSize: 12, color: 'var(--ept-text)' }}>{item.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ept-text)' }}>{item.amount}</span>
                <span style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>({item.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  if (type === 'live') {
    const calls = cfg.calls as { name: string; status: string; duration: string }[];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {calls?.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.status === 'active' ? '#10b981' : '#f59e0b', animation: c.status === 'active' ? 'pulse 2s infinite' : 'none' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)' }}>{c.name}</div>
                <div style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>{c.status === 'active' ? 'Call in progress...' : c.status}</div>
              </div>
            </div>
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'var(--ept-accent)' }}>{c.duration}</span>
          </div>
        ))}
      </div>
    );
  }

  // Fallback
  return (
    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--ept-text-muted)', fontSize: 12 }}>
      Interactive illustration for this step
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function TutorialPage() {
  const { isDark } = useTheme();
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const [showQuickRef, setShowQuickRef] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const tutorial = TUTORIALS.find(t => t.id === selectedTutorial);
  const totalSteps = TUTORIALS.reduce((sum, t) => sum + t.steps.length, 0);
  const completedSteps = Object.values(progress).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav bar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <img src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" style={{ height: 32, width: 'auto', mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--ept-border)' }} />
          <Link href="/closer" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Closer AI
          </Link>
          <span style={{ fontSize: 12, color: 'var(--ept-accent)', fontWeight: 700 }}>/ Tutorial</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/closer" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', textDecoration: 'none' }}>
            Open Closer AI →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero section */}
        {!selectedTutorial && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
                Learn Closer AI
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)', lineHeight: 1.7 }}>
                Step-by-step tutorials to get you from zero to your first booked appointment.
                Built for real salespeople — no tech jargon, just results.
              </p>
              {completedSteps > 0 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div style={{ width: 200, height: 6, borderRadius: 3, backgroundColor: 'var(--ept-surface)', overflow: 'hidden' }}>
                    <div style={{ width: `${(completedSteps / totalSteps) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: '#10b981', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)' }}>{completedSteps} / {totalSteps} steps</span>
                </div>
              )}
            </div>

            {/* Quick Reference toggle */}
            <div className="mb-8">
              <button
                onClick={() => setShowQuickRef(!showQuickRef)}
                className="w-full text-left p-4 rounded-xl border"
                style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 20 }}>⚡</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>Quick Reference</div>
                      <div style={{ fontSize: 12, color: 'var(--ept-text-muted)' }}>Common actions at a glance — where to find everything</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, color: 'var(--ept-text-muted)', transform: showQuickRef ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </div>
              </button>
              {showQuickRef && (
                <div className="mt-2 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
                    {['Action', 'Where', 'What to Do'].map(h => (
                      <div key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
                    ))}
                  </div>
                  {QUICK_REFERENCE.map((ref, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: i < QUICK_REFERENCE.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>
                      <div style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--ept-text)' }}>{ref.action}</div>
                      <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--ept-text-secondary)' }}>{ref.where}</div>
                      <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--ept-text-muted)' }}>{ref.howTo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended starting point */}
            {completedSteps === 0 && (
              <div className="mb-8 p-5 rounded-xl border" style={{ borderColor: 'var(--ept-accent)', backgroundColor: isDark ? '#14b8a610' : '#0d737710' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: 20 }}>🚀</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-accent)' }}>New to Closer? Start here.</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                  We recommend starting with Tutorial 1 (&quot;Welcome to Closer AI&quot;) for a 3-minute overview,
                  then jumping to Tutorial 8 (&quot;Full Workflow&quot;) which walks you through everything from setup to your first booked appointment.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTutorial('welcome')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Start Tutorial 1 →
                  </button>
                  <button
                    onClick={() => setSelectedTutorial('full-workflow')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border"
                    style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-card-bg)', cursor: 'pointer' }}
                  >
                    Jump to Full Workflow
                  </button>
                </div>
              </div>
            )}

            {/* Tutorial grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TUTORIALS.map((t, i) => {
                const done = isTutorialComplete(t.id, t.steps.length, progress);
                const stepsDone = progress[t.id]?.length || 0;
                const isWorkflow = t.id === 'full-workflow';
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTutorial(t.id)}
                    className={`text-left p-5 rounded-xl border transition-all hover:border-[var(--ept-accent)] ${isWorkflow ? 'md:col-span-2' : ''}`}
                    style={{
                      borderColor: done ? '#10b981' : 'var(--ept-border)',
                      backgroundColor: 'var(--ept-card-bg)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {done && (
                      <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>✓</div>
                    )}
                    <div className="flex items-start gap-4">
                      <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'var(--ept-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)' }}>TUTORIAL {i + 1}</span>
                          <span style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>· {t.steps.length} steps · ~{t.estimatedMinutes} min</span>
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>{t.title}</h3>
                        <p style={{ fontSize: 12, color: 'var(--ept-text-secondary)', lineHeight: 1.5, marginBottom: stepsDone > 0 ? 8 : 0 }}>{t.subtitle}</p>
                        {stepsDone > 0 && !done && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, maxWidth: 120, height: 4, borderRadius: 2, backgroundColor: 'var(--ept-surface)', overflow: 'hidden' }}>
                              <div style={{ width: `${(stepsDone / t.steps.length) * 100}%`, height: '100%', borderRadius: 2, backgroundColor: 'var(--ept-accent)' }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>{stepsDone}/{t.steps.length}</span>
                          </div>
                        )}
                        {t.route && (
                          <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                            Page: {t.route}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 text-center">
              <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', marginBottom: 12 }}>
                Need help? The <strong style={{ color: 'var(--ept-text-secondary)' }}>?</strong> button is always available inside Closer AI on every page.
              </p>
              <Link href="/closer" className="inline-block px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', textDecoration: 'none' }}>
                Open Closer AI →
              </Link>
            </div>
          </>
        )}

        {/* Tutorial detail view */}
        {tutorial && (
          <div>
            <button
              onClick={() => setSelectedTutorial(null)}
              className="mb-6 flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--ept-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ← Back to all tutorials
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: 'var(--ept-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{tutorial.icon}</div>
              <div>
                <h2 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{tutorial.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--ept-text-secondary)' }}>{tutorial.subtitle} · {tutorial.steps.length} steps · ~{tutorial.estimatedMinutes} min</p>
              </div>
            </div>

            {tutorial.route && (
              <div className="mb-6 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>This tutorial covers the</span>
                <Link href={tutorial.route} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-accent)', fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none' }}>{tutorial.route}</Link>
                <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>page</span>
              </div>
            )}

            <TutorialViewer tutorial={tutorial} progress={progress} onProgress={setProgress} />

            {/* Cross-links for full-workflow */}
            {tutorial.id === 'full-workflow' && (
              <div className="mt-8">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Detailed Tutorials</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TUTORIALS.filter(t => t.id !== 'full-workflow' && t.id !== 'welcome').map(t => {
                    const done = isTutorialComplete(t.id, t.steps.length, progress);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTutorial(t.id)}
                        className="p-3 rounded-lg border text-left"
                        style={{ borderColor: done ? '#10b981' : 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', cursor: 'pointer' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: 14 }}>{t.icon}</span>
                          {done && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text)' }}>{t.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>{t.steps.length} steps</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
