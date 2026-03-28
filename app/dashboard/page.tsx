'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service } from '../../lib/ept-api';
import {
  isAuthenticated as hasEngineKey,
  getUsage,
  getProfile as getEngineProfile,
  type UsageResponse,
  type ProfileResponse as EngineProfile,
} from '../../lib/engine-cloud-api';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { getTrialStatus, type TrialInfo } from '../../lib/trial-api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, role, displayName, trustLevel, subscriptions, signOut } = useAuth();
  const { isDark } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [engineUsage, setEngineUsage] = useState<UsageResponse | null>(null);
  const [engineProfile, setEngineProfile] = useState<EngineProfile | null>(null);
  const [commanderMode, setCommanderMode] = useState(false);
  const [trials, setTrials] = useState<TrialInfo[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    getServices().then(d => setServices(d.services)).catch(() => {});
  }, []);

  useEffect(() => {
    if (hasEngineKey()) {
      getUsage().then(setEngineUsage).catch(() => {});
      getEngineProfile().then(setEngineProfile).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (role === 'owner') setCommanderMode(true);
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      getTrialStatus(user.email).then(r => { if (r.ok && r.trials) setTrials(r.trials); }).catch(() => {});
    }
  }, [user]);

  const [viewMode, setViewMode] = useState<'owner' | 'user'>('owner');
  const showOwnerContent = commanderMode && viewMode === 'owner';

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const subscribedServices = services.filter(s => subscriptions.includes(s.id));
  const availableServices = services.filter(s => !subscriptions.includes(s.id));

  return (
    <div className="px-6 py-8 max-w-5xl">
      {/* ── Header ── */}
      <div className="mb-8 flex items-start justify-between" data-tutorial="dashboard-welcome">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Welcome, <span className="gradient-text">{displayName || user.email?.split('@')[0] || 'there'}</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Your Echo Prime Technologies control center.</p>
          {trustLevel && (
            <p className="mt-1 text-[11px] font-bold" style={{ color: 'var(--ept-accent)' }}>
              Trust Level {trustLevel.level} — {trustLevel.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {commanderMode && (
            <button
              onClick={() => setViewMode(v => v === 'owner' ? 'user' : 'owner')}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all"
              style={{
                backgroundColor: viewMode === 'owner' ? '#ef444418' : 'var(--ept-surface)',
                borderColor: viewMode === 'owner' ? '#ef444440' : 'var(--ept-border)',
                color: viewMode === 'owner' ? '#ef4444' : 'var(--ept-text-muted)',
              }}
            >
              {viewMode === 'owner' ? 'OWNER VIEW' : 'USER VIEW'}
            </button>
          )}
          {role === 'owner' && (
            <Link href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Admin
            </Link>
          )}
          <button onClick={handleSignOut} className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Permian Pulse — owner only ── */}
      {showOwnerContent && (
        <div className="mb-6" data-tutorial="dashboard-permian">
          <Link href="/dashboard/permian-pulse" className="block p-5 rounded-2xl border group transition-all hover:shadow-lg" style={{ backgroundColor: isDark ? '#0c1a0c' : '#f0fff0', borderColor: isDark ? '#2d5e2d' : '#c7f0c7' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>P</div>
                <div>
                  <h2 className="text-lg font-extrabold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                    Permian Pulse
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ef444420', color: '#ef4444', border: '1px solid #ef444440' }}>OWNER</span>
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Competitive intelligence — 24 oilfield chemical companies. Live data.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color: '#10b981' }}>
                Open
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── Sentinel AI — always visible ── */}
      <div className="mb-8" data-tutorial="dashboard-sentinel">
        <Link href="/sentinel" className="block p-6 rounded-2xl border group transition-all hover:shadow-lg" style={{ backgroundColor: isDark ? '#0c0c1a' : '#f0f0ff', borderColor: isDark ? '#2d2d5e' : '#c7c7f0', boxShadow: isDark ? '0 0 30px rgba(99,102,241,0.08)' : 'none' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}>
                S
              </div>
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                  Sentinel AI
                  {showOwnerContent && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>COMMANDER</span>}
                </h2>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                  932 engines. 65 domains. Court-defensible doctrine intelligence.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color: '#818cf8' }}>
              Open
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </div>
          </div>

          {/* Usage stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-tutorial="dashboard-usage">
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: '#818cf8' }}>{engineProfile?.tier || (hasEngineKey() ? '—' : 'Free')}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Plan</div>
            </div>
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>
                {showOwnerContent ? '\u221E' : engineUsage ? `${engineUsage.queries}` : '0'}
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Queries Used</div>
            </div>
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: commanderMode ? '#f59e0b' : engineUsage && engineUsage.remaining < 5 ? '#ef4444' : '#10b981' }}>
                {showOwnerContent ? '\u221E' : engineUsage ? `${engineUsage.remaining}` : '3'}
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Remaining</div>
            </div>
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>3</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Modes</div>
            </div>
          </div>

          {/* Mode badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: 'Standard', desc: 'Doctrine analysis', color: '#10b981' },
              { label: 'Swarm', desc: 'Trinity Council', color: '#6366f1' },
              { label: 'Echo Prime', desc: 'Personality + Memory', color: '#a855f7' },
            ].map(m => (
              <span key={m.label} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${m.color}15`, color: m.color, border: `1px solid ${m.color}30` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                {m.label}
              </span>
            ))}
            {!hasEngineKey() && (
              <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                3 free queries — no credit card
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Active Trials */}
      {trials.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Your Trials</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {trials.map(t => (
              <div key={t.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.days_remaining <= 3 ? '#ef444460' : 'var(--ept-card-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{t.product_name}</h3>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{t.tier} tier — free trial</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                    backgroundColor: t.expired ? '#ef444418' : t.days_remaining <= 3 ? '#f59e0b18' : '#10b98118',
                    color: t.expired ? '#ef4444' : t.days_remaining <= 3 ? '#f59e0b' : '#10b981',
                    border: `1px solid ${t.expired ? '#ef444440' : t.days_remaining <= 3 ? '#f59e0b40' : '#10b98140'}`,
                  }}>
                    {t.expired ? 'Expired' : `${t.days_remaining} days left`}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${Math.max(5, ((14 - t.days_remaining) / 14) * 100)}%`,
                    backgroundColor: t.expired ? '#ef4444' : t.days_remaining <= 3 ? '#f59e0b' : 'var(--ept-accent)',
                  }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={t.product_url} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    Open Product
                  </Link>
                  <a href={t.api_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                    API
                  </a>
                  <Link href={`/checkout?service=${t.service_id}&tier=${t.tier}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: t.days_remaining <= 3 ? '#f59e0b' : 'var(--ept-surface)', color: t.days_remaining <= 3 ? '#fff' : 'var(--ept-text-secondary)' }}>
                    {t.expired ? 'Reactivate' : 'Upgrade'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscribed Services */}
      <div data-tutorial="dashboard-services">
        {subscribedServices.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Your Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribedServices.map((svc, i) => (
                <Link key={i} href={svc.url || '#'} className="card-hover p-6 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{svc.icon}</div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>Active</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{svc.name}</h3>
                  <p className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>{svc.tagline}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color: 'var(--ept-accent)' }}>
                    Open
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10 p-10 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>No active services yet</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Choose the services you want to activate to get started.</p>
            <Link href="/services" className="inline-flex px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Browse Services</Link>
          </div>
        )}
      </div>

      {/* Available to add */}
      {availableServices.length > 0 && (
        <div data-tutorial="dashboard-available">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Available Services</h2>
            <Link href="/services" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Manage All</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableServices.map((svc, i) => (
              <div key={i} className="p-4 rounded-xl border opacity-60 hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" style={{ color: 'var(--ept-accent)' }}>{svc.icon}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{svc.name}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>From ${svc.pricing?.[0]?.price || '\u2014'}/mo</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tutorial Button */}
      <ProductTutorialButton tutorialId="dashboard" productName="Dashboard" />
    </div>
  );
}
