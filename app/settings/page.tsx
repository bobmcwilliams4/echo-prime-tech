'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { getServices, Service } from '../../lib/ept-api';

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  apple: 'Apple',
  email: 'Email & Password',
  phone: 'Phone (SMS)',
  unknown: 'Unknown',
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, role, displayName, trustLevel, subscriptions, grants, signOut } = useAuth();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/settings');
  }, [user, loading, router]);

  useEffect(() => {
    getServices().then(d => setServices(d.services)).catch(() => {});
  }, []);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const subscribedServices = services.filter(s => subscriptions.includes(s.id));
  const monthlyTotal = subscribedServices.reduce((sum, svc) => {
    const monthly = svc.pricing?.find(p => p.interval === 'month' && typeof p.price === 'number');
    return sum + (monthly?.price || 0);
  }, 0);
  const isOwner = role === 'owner';

  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* ── Top nav ── */}
        <nav className="flex items-center justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--ept-border)' }}>
          <Link href="/" className="text-sm font-bold tracking-wide" style={{ color: 'var(--ept-text)' }}>
            Echo Prime Technologies
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              Sign Out
            </button>
          </div>
        </nav>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full border-2" style={{ borderColor: 'var(--ept-accent)' }} />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              {(displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black leading-tight" style={{ color: 'var(--ept-text)' }}>
              {displayName || user.email?.split('@')[0] || 'Account'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</p>
            {trustLevel && (
              <p className="mt-1 text-[11px] font-bold" style={{ color: 'var(--ept-accent)' }}>
                Trust Level {trustLevel.level} — {trustLevel.title}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── Profile card ── */}
          <div className="rounded-xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="mb-5 text-xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Profile</h2>
            <div className="grid gap-3">
              <div className="rounded-lg border px-4 py-3" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Email</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--ept-text)' }}>{user.email}</p>
              </div>
              <div className="rounded-lg border px-4 py-3" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Sign-in method</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--ept-text)' }}>{PROVIDER_LABELS[user.provider] || user.provider}</p>
              </div>
              <div className="rounded-lg border px-4 py-3" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Account type</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--ept-text)' }}>{isOwner ? 'Sovereign Architect (Owner)' : 'Customer'}</p>
              </div>
            </div>
          </div>

          {/* ── Billing card ── */}
          <div className="rounded-xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Billing</h2>
              <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Manage Plans
              </Link>
            </div>
            {subscribedServices.length > 0 ? (
              <>
                <div className="rounded-lg border px-4 py-3 mb-3" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Estimated monthly total</p>
                  <p className="text-2xl font-black mt-0.5" style={{ color: 'var(--ept-text)' }}>${monthlyTotal.toFixed(0)}<span className="text-sm font-medium" style={{ color: 'var(--ept-text-muted)' }}>/mo</span></p>
                </div>
                <div className="grid gap-2">
                  {subscribedServices.map(svc => (
                    <div key={svc.id} className="flex items-center justify-between rounded-lg border px-4 py-2.5" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                      <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{svc.name}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>Active</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border px-4 py-6 text-center" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ept-text-secondary)' }}>No active plan yet.</p>
                <Link href="/pricing" className="inline-flex text-xs font-bold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  Browse Plans
                </Link>
              </div>
            )}
            <p className="text-[11px] mt-4" style={{ color: 'var(--ept-text-muted)' }}>
              Invoice history is managed by our billing provider. For a receipt or billing question, contact{' '}
              <a href="mailto:contact@echo-op.com" style={{ color: 'var(--ept-accent)' }} className="font-semibold hover:underline">contact@echo-op.com</a>.
            </p>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="rounded-xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="mb-5 text-xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://app.echo-ept.com/settings"
              className="rounded-lg px-5 py-3 text-sm font-bold"
              style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              Open Account Console
            </a>
            <Link
              href="/pricing"
              className="rounded-lg border px-5 py-3 text-sm font-bold"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              Review Plans
            </Link>
            {isOwner && (
              <Link
                href="/admin"
                className="rounded-lg px-5 py-3 text-sm font-bold"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
              >
                Admin Console
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
