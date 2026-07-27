'use client';

/**
 * IntroSplash — first-visit cinematic intro for the Immortality Vault.
 *
 * Plays the ECHO-narrated intro film (public/immortality-vault/intro.mp4) once,
 * full-screen, the first time a visitor lands on any /immortality-vault route.
 * Gated by localStorage so it never replays for a returning visitor. Because
 * browsers block audio autoplay before a user gesture, it tries to play WITH
 * sound first, and on rejection falls back to muted autoplay + a prominent
 * "tap for sound" control so ECHO's voice is one tap away. Skippable, and it
 * dismisses itself when the film ends.
 *
 * Mounted in app/immortality-vault/layout.tsx so it wraps the marketing page
 * AND the /app entry. immortalityvault.app apex is host-rewritten to this
 * landing at / (HTTP 200 via prepare-host-roots + vercel.json) — not a 307 —
 * so the film still plays for brand-domain visitors.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { onAuthChange, isAuthRedirectPending } from '../../lib/firebase';

const SRC = '/immortality-vault/intro.mp4';
const POSTER = '/immortality-vault/intro-poster.jpg';
const GOLD = '#d4b483';

export default function IntroSplash() {
  // null = undecided (render nothing to avoid a flash for returning visitors)
  const [show, setShow] = useState<boolean | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pathname = usePathname();

  // Decide on mount (client only). Plays on every fresh load of the MARKETING
  // landing page (Commander directive), but is HARD-GATED so it can never play
  // over authentication or the app itself — that was the "Google login restarts
  // the intro" bug. Rules (root-cause fix, do not regress):
  //   1. LANDING ONLY — never on /login, /app, /listen, or any other child
  //      route. Sign-in and the vault app are working surfaces, not cinema.
  //   2. NEVER over an OAuth roundtrip — if a sign-in redirect is in flight
  //      (sessionStorage flag set by lib/firebase before signInWithRedirect),
  //      the return load goes straight to auth resolution, no intro.
  //   3. AUTH-RESOLVED ONLY — we wait for Firebase's first onAuthStateChanged
  //      before deciding. A signed-in visitor skips the intro entirely and goes
  //      straight in; only a genuinely signed-out visitor gets the film.
  //   4. Reduced-motion users are never ambushed.
  //   5. FRESH LOADS ONLY — the decision is made once per real page load; SPA
  //      navigation back to the landing page never replays it (layout stays
  //      mounted, decidedRef holds).
  const decidedRef = useRef(false);
  useEffect(() => {
    if (decidedRef.current) { setShow(false); return; }
    decidedRef.current = true;
    const isLanding = pathname === '/immortality-vault' || pathname === '/immortality-vault/';
    if (!isLanding || isAuthRedirectPending()) { setShow(false); return; }
    let reduced = false;
    try {
      reduced = typeof window !== 'undefined' && !!window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch { /* ignore */ }
    if (reduced) { setShow(false); return; }
    // Wait for the persisted session to resolve ONCE, then decide.
    let cancelled = false;
    const unsub = onAuthChange((user) => {
      if (!cancelled) setShow(!user);
      unsub();
    });
    return () => { cancelled = true; unsub(); };
  }, [pathname]);

  // Attempt playback once the overlay is showing.
  useEffect(() => {
    if (show !== true) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    const p = v.play();
    if (p && typeof p.then === 'function') {
      p.catch(() => {
        // Autoplay-with-sound blocked → mute, retry, and invite a tap to unmute.
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {/* give up silently; Skip still works */});
      });
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  function dismiss() {
    setLeaving(true);
    const v = videoRef.current;
    if (v) { try { v.pause(); } catch { /* ignore */ } }
    window.setTimeout(() => setShow(false), 650);
  }

  function unmute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    // A user gesture is present here, so this play() is allowed to carry sound.
    v.play().catch(() => {/* ignore */});
  }

  if (show !== true) return null;

  return (
    <div
      role="dialog"
      aria-label="Immortality Vault introduction"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.65s ease',
      }}
    >
      <video
        ref={videoRef}
        src={SRC}
        poster={POSTER}
        playsInline
        preload="auto"
        onEnded={dismiss}
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
      />

      {/* Skip */}
      <button
        onClick={dismiss}
        aria-label="Skip intro"
        style={{
          position: 'absolute',
          top: 'max(18px, env(safe-area-inset-top))',
          right: 'max(18px, env(safe-area-inset-right))',
          padding: '9px 18px',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: GOLD,
          background: 'rgba(0,0,0,0.45)',
          border: `1px solid ${GOLD}55`,
          borderRadius: '999px',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
        }}
      >
        Skip intro →
      </button>

      {/* Tap for sound (only when autoplay forced a mute) */}
      {muted && (
        <button
          onClick={unmute}
          aria-label="Turn on sound"
          style={{
            position: 'absolute',
            bottom: 'max(32px, env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 22px',
            fontSize: '15px',
            fontWeight: 600,
            color: '#000',
            background: GOLD,
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            boxShadow: `0 0 0 0 ${GOLD}`,
            animation: 'ivaultPulse 2s infinite',
          }}
        >
          <span style={{ fontSize: '18px' }}>🔊</span> Tap for sound
        </button>
      )}

      <style>{`
        @keyframes ivaultPulse {
          0%   { box-shadow: 0 0 0 0 ${GOLD}88; }
          70%  { box-shadow: 0 0 0 16px ${GOLD}00; }
          100% { box-shadow: 0 0 0 0 ${GOLD}00; }
        }
      `}</style>
    </div>
  );
}
