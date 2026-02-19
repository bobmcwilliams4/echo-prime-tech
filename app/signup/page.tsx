'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithGoogle, signInWithApple, signUpWithEmail } from '../../lib/firebase';
import { useAuth } from '../../lib/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setIsDark(h < 6 || h >= 18);
    document.documentElement.classList.toggle('dark', h < 6 || h >= 18);
  }, []);

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 8 characters.');
      } else {
        setError('Sign up failed. Please try again.');
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

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} /></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 mesh-bg relative" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="absolute inset-0" style={{ background: 'var(--ept-hero-gradient)' }} />
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-10">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={400} height={260}
            className="w-[200px] md:w-[260px] h-auto"
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
            priority
          />
        </Link>

        {/* Card */}
        <div className="rounded-2xl border p-8 glow-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h1 className="text-2xl font-extrabold text-center mb-1" style={{ color: 'var(--ept-text)' }}>Create your account</h1>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--ept-text-muted)' }}>Get started with Echo Prime Technologies</p>

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

          {/* Email form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Company</label>
                <input
                  type="text" value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  placeholder="Optional"
                />
              </div>
            </div>
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
                  placeholder="Min 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Confirm Password</label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
                style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                placeholder="Repeat your password"
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="submit" disabled={submitting}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center mt-4" style={{ color: 'var(--ept-text-muted)' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--ept-text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--ept-accent)' }}>Sign in</Link>
        </p>

        {/* Back to home */}
        <p className="text-center text-xs mt-4">
          <Link href="/" className="hover:underline" style={{ color: 'var(--ept-text-muted)' }}>Back to home</Link>
        </p>
      </div>
    </div>
  );
}
