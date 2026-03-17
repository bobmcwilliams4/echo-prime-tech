'use client';

import { useState, useEffect } from 'react';
import { useGuidedTutorial, type GuidedStep } from '../lib/guided-tutorial-context';

/* ─────────────────────────────────────────────────────────
   PRODUCT TUTORIAL BUTTON
   Floating "?" button for any product page. Renders in the
   bottom-left corner. Click to start the guided tutorial
   for the current product. Shows progress + completion state.
───────────────────────────────────────────────────────── */

interface ProductTutorialButtonProps {
  /** Tutorial ID matching a key in guided-steps.ts */
  tutorialId: string;
  /** Display name of the product (shown in tooltip) */
  productName: string;
}

export default function ProductTutorialButton({ tutorialId, productName }: ProductTutorialButtonProps) {
  const { startGuided, active } = useGuidedTutorial();
  const [isComplete, setIsComplete] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('ept_tutorial_progress') || '{}');
      if (progress[tutorialId]?.completed) {
        setIsComplete(true);
      }
    } catch {}

    // Dynamically get step count
    import('../lib/guided-steps').then(mod => {
      const steps = mod.getGuidedSteps(tutorialId);
      setStepCount(steps.length);
    });
  }, [tutorialId]);

  // Show a tooltip briefly on first visit if tutorial not completed
  useEffect(() => {
    if (isComplete || active) return;
    const seen = localStorage.getItem(`ept_tutorial_seen_${tutorialId}`);
    if (!seen) {
      const t = setTimeout(() => {
        setShowTooltip(true);
        localStorage.setItem(`ept_tutorial_seen_${tutorialId}`, '1');
        const hide = setTimeout(() => setShowTooltip(false), 5000);
        return () => clearTimeout(hide);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [tutorialId, isComplete, active]);

  if (active) return null; // Hide when a tutorial is running
  if (stepCount === 0) return null; // No tutorial defined for this product

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* The "?" button */}
        <button
          onClick={() => startGuided(tutorialId)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2px solid ${isComplete ? '#10b981' : 'var(--ept-accent)'}`,
            backgroundColor: isComplete ? 'rgba(16,185,129,0.15)' : 'var(--ept-card-bg)',
            color: isComplete ? '#10b981' : 'var(--ept-accent)',
            fontSize: 22,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hovered
              ? '0 4px 20px rgba(20,184,166,0.4)'
              : '0 2px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            animation: !isComplete ? 'tutorialBtnPulse 3s ease-in-out infinite' : undefined,
          }}
          title={isComplete ? `${productName} tutorial completed` : `Start ${productName} tutorial`}
        >
          {isComplete ? (
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : '?'}
        </button>

        {/* Tooltip: shows on hover or first-visit auto-show */}
        {(hovered || showTooltip) && (
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              backgroundColor: 'var(--ept-card-bg)',
              border: '1px solid var(--ept-border)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              maxWidth: 220,
              animation: 'guidedFadeIn 0.2s ease-out',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 2 }}>
              {isComplete ? 'Tutorial Complete!' : 'Interactive Tutorial'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', lineHeight: 1.4 }}>
              {isComplete
                ? `You've completed the ${productName} walkthrough. Click to replay.`
                : `${stepCount}-step guided walkthrough of ${productName}. Click to start.`}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes tutorialBtnPulse {
          0%, 100% { box-shadow: 0 2px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(20,184,166,0.3); }
          50% { box-shadow: 0 2px 12px rgba(0,0,0,0.3), 0 0 0 8px rgba(20,184,166,0); }
        }
      `}</style>
    </>
  );
}
