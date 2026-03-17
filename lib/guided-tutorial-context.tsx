'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/* ─────────────────────────────────────────────────────────
   GUIDED TUTORIAL CONTEXT
   Controls the interactive walkthrough mode where the user
   interacts with real UI controls, one step at a time.
   Everything except the active element is greyed out.
───────────────────────────────────────────────────────── */

export interface GuidedStep {
  id: string;
  tutorialId: string;
  /** Page the user must be on */
  route: string;
  /** CSS selector for the target element */
  selector: string;
  /** What the user needs to do */
  action: 'click' | 'type' | 'select' | 'toggle' | 'observe';
  /** Instruction text shown in the tooltip */
  callout: string;
  /** For 'type' actions — example value to show */
  exampleValue?: string;
  /** For 'select' actions — which option to pick */
  selectValue?: string;
  /** Title shown in the tooltip header */
  title: string;
  /** Which step number within the tutorial (1-based) */
  stepNumber: number;
  /** Total steps in this tutorial */
  totalSteps: number;
  /** Additional allowed selectors (e.g. form container) */
  alsoAllow?: string[];
  /** If true, the step auto-completes after a short delay (for observe-only steps) */
  autoAdvance?: boolean;
  /** Delay in ms for auto-advance (default 3000) */
  autoAdvanceDelay?: number;
  /** Position hint for the tooltip */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTutorialState {
  /** Whether guided mode is active */
  active: boolean;
  /** Current step definition */
  currentStep: GuidedStep | null;
  /** Index into the current tutorial's steps */
  stepIndex: number;
  /** All steps for the current tutorial */
  steps: GuidedStep[];
  /** Tutorial ID currently running */
  tutorialId: string | null;
  /** Bounding rect of the target element (for overlay cutout) */
  targetRect: DOMRect | null;
  /** Start a guided tutorial */
  startGuided: (tutorialId: string) => void;
  /** Complete the current step and advance */
  completeStep: () => void;
  /** Go back one step */
  prevStep: () => void;
  /** Skip the entire tutorial */
  skipGuided: () => void;
  /** Check if a specific element is the current target */
  isTarget: (selector: string) => boolean;
  /** Check if an element is allowed to be interacted with */
  isAllowed: (selector: string) => boolean;
}

const GuidedTutorialContext = createContext<GuidedTutorialState>({
  active: false,
  currentStep: null,
  stepIndex: 0,
  steps: [],
  tutorialId: null,
  targetRect: null,
  startGuided: () => {},
  completeStep: () => {},
  prevStep: () => {},
  skipGuided: () => {},
  isTarget: () => false,
  isAllowed: () => false,
});

export function useGuidedTutorial() {
  return useContext(GuidedTutorialContext);
}

export function GuidedTutorialProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [tutorialId, setTutorialId] = useState<string | null>(null);
  const [steps, setSteps] = useState<GuidedStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number>(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = active && steps.length > 0 ? steps[stepIndex] || null : null;

  /* ── Track target element position ── */
  const updateTargetRect = useCallback(() => {
    if (!currentStep) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(currentStep.selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      // Scroll into view if needed
      if (rect.top < 80 || rect.bottom > window.innerHeight - 80) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Re-measure after scroll
        setTimeout(() => {
          const r2 = el.getBoundingClientRect();
          setTargetRect(r2);
        }, 400);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  /* ── Watch for target element position changes ── */
  useEffect(() => {
    if (!currentStep || !active) {
      setTargetRect(null);
      return;
    }

    // Navigate to the correct route if needed
    if (currentStep.route !== pathname) {
      router.push(currentStep.route);
      // Wait for navigation, then find element
      const t = setTimeout(() => updateTargetRect(), 600);
      return () => clearTimeout(t);
    }

    // Find and observe the target element
    const findAndObserve = () => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        updateTargetRect();
        // Use ResizeObserver to track size/position changes
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new ResizeObserver(() => {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(updateTargetRect);
        });
        observerRef.current.observe(el);
        // Also track scroll
        const scroller = document.querySelector('main');
        if (scroller) {
          const onScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateTargetRect);
          };
          scroller.addEventListener('scroll', onScroll, { passive: true });
          return () => scroller.removeEventListener('scroll', onScroll);
        }
      } else {
        // Element not found yet — retry
        const retry = setTimeout(findAndObserve, 300);
        return () => clearTimeout(retry);
      }
    };

    const cleanup = findAndObserve();
    return () => {
      if (typeof cleanup === 'function') cleanup();
      if (observerRef.current) observerRef.current.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [currentStep, active, pathname, router, updateTargetRect]);

  /* ── Auto-advance for observe steps ── */
  useEffect(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (currentStep?.autoAdvance && active) {
      autoAdvanceRef.current = setTimeout(() => {
        completeStep();
      }, currentStep.autoAdvanceDelay || 3000);
    }
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, active]);

  /* ── Block clicks outside target ── */
  useEffect(() => {
    if (!active || !currentStep) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Always allow clicking the guided overlay UI itself
      if (target.closest('[data-guided-ui]')) return;

      // Check if click is on the target element or its children
      const targetEl = document.querySelector(currentStep.selector);
      if (targetEl && (targetEl === target || targetEl.contains(target))) return;

      // Check also-allowed selectors
      if (currentStep.alsoAllow) {
        for (const sel of currentStep.alsoAllow) {
          const allowed = document.querySelector(sel);
          if (allowed && (allowed === target || allowed.contains(target))) return;
        }
      }

      // Block the click
      e.preventDefault();
      e.stopPropagation();
    };

    // Use capture phase to intercept before any other handlers
    document.addEventListener('click', handler, true);
    document.addEventListener('mousedown', handler, true);
    return () => {
      document.removeEventListener('click', handler, true);
      document.removeEventListener('mousedown', handler, true);
    };
  }, [active, currentStep]);

  /* ── Detect step completion ── */
  useEffect(() => {
    if (!active || !currentStep || currentStep.action === 'observe') return;

    const el = document.querySelector(currentStep.selector) as HTMLElement;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    if (currentStep.action === 'click') {
      const onClick = () => {
        setTimeout(() => completeStep(), 300);
      };
      el.addEventListener('click', onClick);
      cleanup = () => el.removeEventListener('click', onClick);
    } else if (currentStep.action === 'type') {
      const onInput = (e: Event) => {
        const input = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (input.value && input.value.length >= 2) {
          setTimeout(() => completeStep(), 500);
        }
      };
      el.addEventListener('input', onInput);
      cleanup = () => el.removeEventListener('input', onInput);
    } else if (currentStep.action === 'select') {
      const onChange = () => {
        setTimeout(() => completeStep(), 300);
      };
      el.addEventListener('change', onChange);
      cleanup = () => el.removeEventListener('change', onChange);
    } else if (currentStep.action === 'toggle') {
      const onClick = () => {
        setTimeout(() => completeStep(), 300);
      };
      el.addEventListener('click', onClick);
      cleanup = () => el.removeEventListener('click', onClick);
    }

    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, currentStep, stepIndex]);

  const startGuided = useCallback(async (id: string) => {
    const { getGuidedSteps } = await import('./guided-steps');
    const tutorialSteps = getGuidedSteps(id);
    if (tutorialSteps.length === 0) return;
    setTutorialId(id);
    setSteps(tutorialSteps);
    setStepIndex(0);
    setActive(true);
  }, []);

  const completeStep = useCallback(() => {
    setStepIndex(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        // Tutorial complete
        setActive(false);
        setTutorialId(null);
        setSteps([]);
        setTargetRect(null);
        // Mark completed in localStorage
        if (tutorialId) {
          try {
            const progress = JSON.parse(localStorage.getItem('ept_tutorial_progress') || '{}');
            progress[tutorialId] = { completed: true, completedAt: new Date().toISOString() };
            localStorage.setItem('ept_tutorial_progress', JSON.stringify(progress));
          } catch {}
        }
        return 0;
      }
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length, tutorialId]);

  const prevStep = useCallback(() => {
    setStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const skipGuided = useCallback(() => {
    setActive(false);
    setTutorialId(null);
    setSteps([]);
    setStepIndex(0);
    setTargetRect(null);
  }, []);

  const isTarget = useCallback((selector: string) => {
    return active && currentStep?.selector === selector;
  }, [active, currentStep]);

  const isAllowed = useCallback((selector: string) => {
    if (!active || !currentStep) return true;
    if (currentStep.selector === selector) return true;
    if (currentStep.alsoAllow?.includes(selector)) return true;
    return false;
  }, [active, currentStep]);

  return (
    <GuidedTutorialContext.Provider value={{
      active, currentStep, stepIndex, steps, tutorialId, targetRect,
      startGuided, completeStep, prevStep, skipGuided, isTarget, isAllowed,
    }}>
      {children}
    </GuidedTutorialContext.Provider>
  );
}
