'use client';

import { usePathname } from 'next/navigation';
import { useGuidedTutorial } from '../lib/guided-tutorial-context';

/* ─────────────────────────────────────────────────────────
   GUIDED OVERLAY
   Visual spotlight + tooltip + step controls.
   Renders only when a guided tutorial is active.
   Click-blocking is handled by GuidedTutorialContext.
───────────────────────────────────────────────────────── */

export default function GuidedOverlay() {
  const pathname = usePathname();
  // Standalone Vault — no EPT tutorial overlay on its pages.
  if (pathname?.startsWith('/immortality-vault')) return null;
  return <GuidedOverlayInner />;
}

function GuidedOverlayInner() {
  const { active, currentStep, stepIndex, steps, targetRect, completeStep, prevStep, skipGuided } = useGuidedTutorial();

  if (!active || !currentStep) return null;

  const hasTarget = !!targetRect;
  const pad = 6; // padding around the target cutout

  // Calculate tooltip position
  const tooltip = computeTooltipPos(targetRect, currentStep.tooltipPosition);

  return (
    <div data-guided-ui style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
      {/* Dark overlay with cutout */}
      {hasTarget && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="guided-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - pad}
                y={targetRect.top - pad}
                width={targetRect.width + pad * 2}
                height={targetRect.height + pad * 2}
                rx="8"
                ry="8"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0" y="0" width="100%" height="100%"
            fill="rgba(0,0,0,0.55)"
            mask="url(#guided-mask)"
          />
        </svg>
      )}

      {/* Fallback: full dark overlay when target not found yet */}
      {!hasTarget && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div data-guided-ui style={{
            pointerEvents: 'auto', padding: '24px 32px', borderRadius: 16,
            backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)', textAlign: 'center', maxWidth: 340,
          }}>
            <div style={{ marginBottom: 12 }}>
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>Finding element...</div>
            <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 4 }}>{currentStep.callout}</div>
            <button
              data-guided-ui
              onClick={skipGuided}
              style={{
                marginTop: 12, padding: '6px 16px', borderRadius: 6, fontSize: 11,
                border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)',
                color: 'var(--ept-text-muted)', cursor: 'pointer', pointerEvents: 'auto',
              }}
            >
              Skip Tutorial
            </button>
          </div>
        </div>
      )}

      {/* Pulsing ring around target */}
      {hasTarget && (
        <div style={{
          position: 'absolute',
          left: targetRect.left - pad - 3,
          top: targetRect.top - pad - 3,
          width: targetRect.width + (pad + 3) * 2,
          height: targetRect.height + (pad + 3) * 2,
          borderRadius: 11,
          border: '2px solid var(--ept-accent)',
          animation: 'guidedPulse 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Tooltip / Callout */}
      {hasTarget && (
        <div
          data-guided-ui
          style={{
            position: 'absolute',
            left: tooltip.left,
            top: tooltip.top,
            width: 300,
            pointerEvents: 'auto',
            animation: 'guidedFadeIn 0.25s ease-out',
          }}
        >
          <div style={{
            borderRadius: 12, overflow: 'hidden',
            backgroundColor: 'var(--ept-card-bg)',
            border: '1px solid var(--ept-accent)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}>
            {/* Header */}
            <div style={{
              padding: '8px 14px',
              backgroundColor: 'var(--ept-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ActionBadge action={currentStep.action} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{currentStep.title}</span>
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {currentStep.stepNumber}/{currentStep.totalSteps}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '12px 14px' }}>
              <p style={{ fontSize: 12, color: 'var(--ept-text)', lineHeight: 1.55, margin: 0 }}>
                {currentStep.callout}
              </p>

              {/* Example value hint */}
              {currentStep.exampleValue && (
                <div style={{
                  marginTop: 8, padding: '5px 10px', borderRadius: 6,
                  backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: 'var(--ept-accent)',
                }}>
                  Try: {currentStep.exampleValue}
                </div>
              )}

              {/* Action hint */}
              <div style={{
                marginTop: 10, fontSize: 10, color: 'var(--ept-text-muted)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ept-accent)', animation: 'guidedBlink 1.2s infinite' }} />
                {actionHint(currentStep.action)}
              </div>
            </div>

            {/* Footer controls */}
            <div style={{
              padding: '8px 14px', borderTop: '1px solid var(--ept-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  data-guided-ui
                  onClick={prevStep}
                  disabled={stepIndex === 0}
                  style={{
                    padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                    border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)',
                    color: stepIndex === 0 ? 'var(--ept-text-muted)' : 'var(--ept-text)',
                    cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: stepIndex === 0 ? 0.5 : 1,
                  }}
                >
                  Back
                </button>
                {currentStep.action === 'observe' && (
                  <button
                    data-guided-ui
                    onClick={completeStep}
                    style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                      border: 'none', backgroundColor: 'var(--ept-accent)', color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
              <button
                data-guided-ui
                onClick={skipGuided}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 10,
                  border: 'none', backgroundColor: 'transparent',
                  color: 'var(--ept-text-muted)', cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Skip tutorial
              </button>
            </div>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 8 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: i === stepIndex ? 14 : 6, height: 6, borderRadius: 3,
                backgroundColor: i === stepIndex ? 'var(--ept-accent)' : i < stepIndex ? '#10b981' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.2s',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes guidedPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(20,184,166,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 8px rgba(20,184,166,0); }
        }
        @keyframes guidedFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes guidedBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ── Helpers ── */

function computeTooltipPos(
  rect: DOMRect | null,
  preferred?: 'top' | 'bottom' | 'left' | 'right'
): { left: number; top: number } {
  if (!rect) return { left: 40, top: 100 };
  const tooltipW = 300;
  const tooltipH = 200; // estimated
  const gap = 16;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  const pos = preferred || 'bottom';

  let left = 0;
  let top = 0;

  if (pos === 'bottom') {
    top = rect.bottom + gap;
    left = rect.left + rect.width / 2 - tooltipW / 2;
  } else if (pos === 'top') {
    top = rect.top - tooltipH - gap;
    left = rect.left + rect.width / 2 - tooltipW / 2;
  } else if (pos === 'right') {
    top = rect.top + rect.height / 2 - tooltipH / 2;
    left = rect.right + gap;
  } else {
    top = rect.top + rect.height / 2 - tooltipH / 2;
    left = rect.left - tooltipW - gap;
  }

  // Clamp to viewport
  if (left < 12) left = 12;
  if (left + tooltipW > vw - 12) left = vw - tooltipW - 12;
  if (top < 12) top = 12;
  if (top + tooltipH > vh - 12) {
    // Flip to top if overflowing bottom
    top = rect.top - tooltipH - gap;
    if (top < 12) top = 12;
  }

  return { left, top };
}

function ActionBadge({ action }: { action: string }) {
  const labels: Record<string, { text: string; bg: string }> = {
    click: { text: 'CLICK', bg: '#3b82f6' },
    type: { text: 'TYPE', bg: '#8b5cf6' },
    select: { text: 'SELECT', bg: '#f59e0b' },
    toggle: { text: 'TOGGLE', bg: '#10b981' },
    observe: { text: 'LOOK', bg: '#6b7280' },
  };
  const l = labels[action] || labels.observe;
  return (
    <span style={{
      fontSize: 8, fontWeight: 800, letterSpacing: '0.1em',
      padding: '2px 6px', borderRadius: 4,
      backgroundColor: l.bg, color: '#fff',
    }}>
      {l.text}
    </span>
  );
}

function actionHint(action: string): string {
  switch (action) {
    case 'click': return 'Click the highlighted element to continue';
    case 'type': return 'Type in the highlighted field to continue';
    case 'select': return 'Choose an option from the highlighted dropdown';
    case 'toggle': return 'Toggle the highlighted switch to continue';
    case 'observe': return 'Take a look, then click Next to continue';
    default: return 'Complete the action to continue';
  }
}
