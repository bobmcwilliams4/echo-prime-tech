'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithGoogle, signInWithApple, signInWithEmail, resetPassword, setupRecaptcha, sendSmsCode, verifySmsCode } from '../../lib/firebase';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';

type AuthTab = 'email' | 'phone';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const [tab, setTab] = useState<AuthTab>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendSms = async () => {
    setError('');
    if (!phone || phone.length < 10) { setError('Enter a valid phone number with country code (e.g. +1...)'); return; }
    const formatted = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`;
    setSubmitting(true);
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      await sendSmsCode(formatted, verifier);
      setSmsSent(true);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Include country code (e.g. +1...)');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else {
        setError('Failed to send SMS. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySms = async () => {
    setError('');
    if (!smsCode || smsCode.length < 6) { setError('Enter the 6-digit code.'); return; }
    setSubmitting(true);
    try {
      const u = await verifySmsCode(smsCode);
      if (u) router.push('/dashboard');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-verification-code') {
        setError('Invalid code. Please try again.');
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const u = await signInWithGoogle();
      if (u) router.push('/dashboard');
    } catch {
      setError('Google sign-in failed.');
    }
  };

  const handleApple = async () => {
    setError('');
    try {
      const u = await signInWithApple();
      if (u) router.push('/dashboard');
    } catch {
      setError('Apple sign-in failed.');
    }
  };

  const handleReset = async () => {
    if (!email) { setError('Enter your email first.'); return; }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch {
      setError('Could not send reset email.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} /></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 mesh-bg relative" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="absolute inset-0" style={{ background: 'var(--ept-hero-gradient)' }} />
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-10">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[200px] md:w-[260px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>

        {/* Card */}
        <div className="rounded-2xl border p-8 glow-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h1 className="text-2xl font-extrabold text-center mb-1" style={{ color: 'var(--ept-text)' }}>Welcome back</h1>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--ept-text-muted)' }}>Sign in to your account</p>

          {/* Social buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:border-opacity-60" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-surface)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button onClick={handleApple} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:border-opacity-60" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-surface)' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--ept-border)' }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--ept-border)' }} />
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-6 border" style={{ borderColor: 'var(--ept-border)' }}>
            {(['email', 'phone'] as AuthTab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSmsSent(false); }}
                className="flex-1 py-2.5 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: tab === t ? 'var(--ept-accent)' : 'var(--ept-surface)',
                  color: tab === t ? '#fff' : 'var(--ept-text-muted)',
                }}
              >
                {t === 'email' ? 'Email' : 'Phone'}
              </button>
            ))}
          </div>

          {/* Email form */}
          {tab === 'email' && (
            <form onSubmit={handleEmail} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors pr-12"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {resetSent && <p className="text-sm text-center" style={{ color: 'var(--ept-accent)' }}>Password reset email sent.</p>}

              <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>

              <button type="button" onClick={handleReset} className="w-full text-center text-xs font-medium hover:underline" style={{ color: 'var(--ept-text-muted)' }}>
                Forgot your password?
              </button>
            </form>
          )}

          {/* Phone form */}
          {tab === 'phone' && (
            <div className="flex flex-col gap-4">
              {!smsSent ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Phone Number</label>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                      placeholder="+1 (555) 123-4567"
                    />
                    <p className="text-xs mt-1.5" style={{ color: 'var(--ept-text-muted)' }}>Include country code. US numbers default to +1.</p>
                  </div>

                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                  <button onClick={handleSendSms} disabled={submitting} className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    {submitting ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-2">
                    <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      Code sent to <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`}</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Verification Code</label>
                    <input
                      type="text" value={smsCode} onChange={e => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors text-center font-mono text-lg tracking-[0.5em]"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                  <button onClick={handleVerifySms} disabled={submitting} className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    {submitting ? 'Verifying...' : 'Verify & Sign In'}
                  </button>

                  <button onClick={() => { setSmsSent(false); setSmsCode(''); setError(''); }} className="w-full text-center text-xs font-medium hover:underline" style={{ color: 'var(--ept-text-muted)' }}>
                    Use a different number
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Recaptcha container (invisible) */}
        <div id="recaptcha-container" ref={recaptchaRef} />

        {/* Sign up link */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--ept-text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold hover:underline" style={{ color: 'var(--ept-accent)' }}>Create one</Link>
        </p>

        {/* Back to home */}
        <p className="text-center text-xs mt-4">
          <Link href="/" className="hover:underline" style={{ color: 'var(--ept-text-muted)' }}>Back to home</Link>
        </p>
      </div>
    </div>
  );
}
