'use client';

/* ==============================================================================
   IMMORTALITY VAULT — create an account.
   The landing pricing sends a buyer to /app?plan=<slug>, which bounces to
   /login?redirect=... when they are signed out. Until this page existed the
   funnel dead-ended there: the login card offered no way to register, so every
   NEW customer who clicked "Choose Keeper" hit a wall and could never reach
   checkout. Same identity store as the login page (lib/firebase) so an account
   created here signs in there; same gold/black Vault chrome, never EPT's.
   See SPEC.md + scripts/verify-vault-separation.js.
   ============================================================================== */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cormorant_Garamond } from 'next/font/google';
import { signInWithGoogle, signInWithApple, signInWithGithub, signUpWithEmail } from '../../../lib/firebase';
import { useAuth } from '../../../lib/auth-context';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

const C = { bg: '#0a0807', card: '#14100c', gold: '#d4b483', goldDeep: '#b8934f', ivory: '#ece3d2', muted: '#9c9081', hair: 'rgba(212,180,131,0.16)', err: '#e0a08a' };
const APP = '/immortality-vault/app';
const MIN_PASSWORD = 8;

function friendly(code: string): string {
  if (code === 'auth/email-already-in-use') return 'There is already a vault for that email. Sign in instead.';
  if (code === 'auth/invalid-email') return 'That email address doesn’t look right.';
  if (code === 'auth/weak-password') return `Please choose a password of at least ${MIN_PASSWORD} characters.`;
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a moment and try again.';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return '';
  if (code === 'auth/account-exists-with-different-credential') return 'An account already exists for that email with a different sign-in method. Use the provider you originally signed up with.';
  if (code === 'auth/operation-not-allowed') return 'That sign-up method isn’t enabled yet. Please use Google, Apple, or email.';
  return 'Something went wrong creating your vault. Please try again.';
}

export default function VaultSignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* This page is statically exported, so anything computed during render
     sees no `window` and bakes in a bare path -- which silently dropped the
     ?redirect (and with it the chosen plan), landing a paying buyer in a free
     vault. Resolve it after mount instead. */
  const [signinHrefState, setSigninHrefState] = useState('/immortality-vault/login');
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('redirect');
    if (r && r.startsWith('/immortality-vault')) setSigninHrefState(`/immortality-vault/login?redirect=${encodeURIComponent(r)}`);
  }, []);

  /* Carry the chosen plan through. /app reads ?plan and opens checkout for the
     signed-in buyer, so losing it here would silently drop them into a free
     vault after they had already picked a paid one. Safe to read window here:
     this only runs from event handlers and effects, never during render. */
  function redirectTarget(): string {
    if (typeof window === 'undefined') return APP;
    const r = new URLSearchParams(window.location.search).get('redirect');
    return r && r.startsWith('/immortality-vault') ? r : APP;
  }

  useEffect(() => { if (!loading && user) router.push(redirectTarget()); }, [user, loading, router]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < MIN_PASSWORD) { setError(`Please choose a password of at least ${MIN_PASSWORD} characters.`); return; }
    if (password !== confirm) { setError('Those passwords don’t match.'); return; }
    setSubmitting(true);
    try { await signUpWithEmail(email, password); router.push(redirectTarget()); }
    catch (err: any) { setError(friendly(err?.code || '')); }
    finally { setSubmitting(false); }
  }

  async function oauth(fn: () => Promise<any>) {
    setError(''); setSubmitting(true);
    try { const u = await fn(); if (u) router.push(redirectTarget()); }
    catch (err: any) { const m = friendly(err?.code || ''); if (m) setError(m); }
    finally { setSubmitting(false); }
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '13px 15px', borderRadius: 12, background: '#0e0b09', border: `1px solid ${C.hair}`, color: C.ivory, fontSize: 15, outline: 'none' };

  return (
    <div style={{ background: C.bg, color: C.ivory, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 760, height: 520, background: `radial-gradient(ellipse at center, ${C.goldDeep}2e, transparent 68%)`, pointerEvents: 'none' }} />

      <Link href="/immortality-vault" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 30 }}>
        <span aria-hidden style={{ fontSize: 20, color: C.gold }}>&#9670;</span>
        <span className={serif.className} style={{ fontSize: 24, fontWeight: 600, letterSpacing: '0.05em', color: C.ivory }}>Immortality Vault</span>
      </Link>

      <div style={{ position: 'relative', width: '100%', maxWidth: 400, background: C.card, border: `1px solid ${C.hair}`, borderRadius: 20, padding: '34px 30px' }}>
        <h1 className={serif.className} style={{ fontSize: 28, fontWeight: 600, textAlign: 'center', margin: '0 0 6px', color: C.ivory }}>Begin their vault</h1>
        <p style={{ textAlign: 'center', color: C.muted, fontSize: 14.5, margin: '0 0 26px' }}>Create your account and start preserving them today.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <button onClick={() => oauth(signInWithGoogle)} disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '13px', borderRadius: 12, background: C.gold, color: C.bg, border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
            Continue with Google
          </button>
          <button onClick={() => oauth(signInWithApple)} disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '13px', borderRadius: 12, background: 'transparent', color: C.ivory, border: `1px solid ${C.hair}`, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
            Continue with Apple
          </button>
          <button onClick={() => oauth(signInWithGithub)} disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '13px', borderRadius: 12, background: 'transparent', color: C.ivory, border: `1px solid ${C.hair}`, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
            <svg aria-hidden viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            Continue with GitHub
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 18px', color: C.muted, fontSize: 12.5 }}>
          <span style={{ flex: 1, height: 1, background: C.hair }} /> or <span style={{ flex: 1, height: 1, background: C.hair }} />
        </div>

        <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="new-password" minLength={MIN_PASSWORD} />
          <input type="password" required placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} autoComplete="new-password" minLength={MIN_PASSWORD} />
          {error && <div style={{ color: C.err, fontSize: 13.5, lineHeight: 1.5 }}>{error}</div>}
          <button type="submit" disabled={submitting} style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'transparent', color: C.gold, border: `1px solid ${C.gold}`, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Creating your vault…' : 'Create my vault'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: C.muted, fontSize: 13, margin: '18px 0 0' }}>
          Already have a vault?{' '}
          <Link href={signinHrefState} style={{ color: C.gold, textDecoration: 'underline' }}>Sign in</Link>
        </p>
      </div>

      <Link href="/immortality-vault" style={{ position: 'relative', marginTop: 24, color: C.muted, fontSize: 13.5, textDecoration: 'none' }}>&larr; Back to the Vault</Link>
    </div>
  );
}
