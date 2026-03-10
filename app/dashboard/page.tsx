'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getProfile, getServices, Service } from '../../lib/ept-api';
import {
  isAuthenticated as hasEngineKey,
  getUsage,
  getProfile as getEngineProfile,
  type UsageResponse,
  type ProfileResponse as EngineProfile,
} from '../../lib/engine-cloud-api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, role, subscriptions, signOut } = useAuth();
  const { isDark } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [engineUsage, setEngineUsage] = useState<UsageResponse | null>(null);
  const [engineProfile, setEngineProfile] = useState<EngineProfile | null>(null);
  const [commanderMode, setCommanderMode] = useState(false);
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');
  const isAdmin = role === 'owner' || user?.email?.toLowerCase() === 'bmcii1976@gmail.com';
  const BGAT_BASE = 'https://bgat.echo-op.com';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    getServices().then(d => setServices(d.services)).catch(() => {});
  }, []);

  // Load Sentinel AI usage
  useEffect(() => {
    if (hasEngineKey()) {
      getUsage().then(setEngineUsage).catch(() => {});
      getEngineProfile().then(setEngineProfile).catch(() => {});
    }
  }, []);

  // Commander detection
  useEffect(() => {
    if (role === 'owner') setCommanderMode(true);
  }, [user]);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const subscribedServices = services.filter(s => subscriptions.includes(s.id));
  const availableServices = services.filter(s => !subscriptions.includes(s.id));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          {role === 'owner' && <Link href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Admin</Link>}
          {isAdmin && (
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--ept-border)' }}>
              <button onClick={() => setViewMode('user')} className="text-[11px] font-semibold px-3 py-1.5 transition-colors" style={{ backgroundColor: viewMode === 'user' ? 'var(--ept-accent)' : 'transparent', color: viewMode === 'user' ? '#fff' : 'var(--ept-text-muted)' }}>User</button>
              <button onClick={() => setViewMode('admin')} className="text-[11px] font-semibold px-3 py-1.5 transition-colors" style={{ backgroundColor: viewMode === 'admin' ? 'var(--ept-accent)' : 'transparent', color: viewMode === 'admin' ? '#fff' : 'var(--ept-text-muted)' }}>Dev</button>
            </div>
          )}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{user.displayName || user.email?.split('@')[0]}</p>
            <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</p>
          </div>
          {user.photoURL ? <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border" style={{ borderColor: 'var(--ept-border)' }} /> : <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{(user.displayName || user.email || 'U')[0].toUpperCase()}</div>}
          <button onClick={handleSignOut} className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Sign Out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Welcome, <span className="gradient-text">{user.displayName || user.email?.split('@')[0] || 'there'}</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Your Echo Prime Technologies dashboard. Manage your active services below.</p>
        </div>

        {/* ── Sentinel AI — always visible ── */}
        <div className="mb-10">
          <Link href="/sentinel" className="block p-6 rounded-2xl border group transition-all hover:shadow-lg" style={{ backgroundColor: isDark ? '#0c0c1a' : '#f0f0ff', borderColor: isDark ? '#2d2d5e' : '#c7c7f0', boxShadow: isDark ? '0 0 30px rgba(99,102,241,0.08)' : 'none' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}>
                  S
                </div>
                <div>
                  <h2 className="text-xl font-extrabold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                    Sentinel AI
                    {commanderMode && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>COMMANDER</span>}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <div className="text-lg font-extrabold font-mono" style={{ color: '#818cf8' }}>{engineProfile?.tier || (hasEngineKey() ? '—' : 'Free')}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Plan</div>
              </div>
              <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>
                  {commanderMode ? '∞' : engineUsage ? `${engineUsage.queries}` : '0'}
                </div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Queries Used</div>
              </div>
              <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <div className="text-lg font-extrabold font-mono" style={{ color: commanderMode ? '#f59e0b' : engineUsage && engineUsage.remaining < 5 ? '#ef4444' : '#10b981' }}>
                  {commanderMode ? '∞' : engineUsage ? `${engineUsage.remaining}` : '3'}
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

        {/* ── BGAT Water Intel ── */}
        {isAdmin && viewMode === 'admin' ? (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--ept-text)' }}>BGAT Water Intel — Developer Panel</h2>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }}>DEV ACCESS</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Backend API', status: 'Live', desc: 'FastAPI v0.6.0 — 30 routes', color: '#10b981' },
                { label: 'Workers', status: '5 Deployed', desc: 'PDF · Export · Gateway · Map · Alerts', color: '#6366f1' },
                { label: 'Frontend', status: 'Integrated', desc: '7 pages in BGAT website', color: '#f59e0b' },
              ].map(c => (
                <div key={c.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{c.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.status}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Dashboard', desc: 'Stats, alerts overview, quick links', href: '/dashboard.html', icon: '📊' },
                { name: 'Wells Database', desc: 'Search & manage well records', href: '/wells.html', icon: '🛢️' },
                { name: 'Formation Map', desc: 'Google Maps + ion heatmap', href: '/map.html', icon: '🗺️' },
                { name: 'Alerts', desc: 'Variance detection & acknowledgment', href: '/alerts.html', icon: '🔔' },
                { name: 'Upload PDF', desc: 'Ingest water analysis reports', href: '/upload.html', icon: '📄' },
                { name: 'Data Query', desc: 'Formation & radius-based search', href: '/query.html', icon: '🔍' },
              ].map(p => (
                <a key={p.name} href={BGAT_BASE + p.href} target="_blank" rel="noopener noreferrer" className="card-hover p-5 rounded-xl border flex items-start gap-4 group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--ept-surface)' }}>{p.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <div className="relative p-6 rounded-2xl border" style={{ backgroundColor: isDark ? '#0d1117' : '#fdf8f0', borderColor: isDark ? '#30363d' : '#e8d5b5', opacity: 0.85 }}>
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>🚧 UNDER CONSTRUCTION</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, #C8952E, #9A7023)', color: '#fff' }}>B</div>
                <div>
                  <h3 className="text-lg font-extrabold" style={{ color: 'var(--ept-text)' }}>BGAT Water Intel Platform</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Permian Basin water chemistry intelligence</p>
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
                Real-time water analysis, formation mapping, variance detection alerts, and PDF ingestion for the Permian Basin oilfield chemical treatment industry. Coming soon.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Water Analysis', 'Formation Maps', 'Variance Alerts', 'PDF Ingestion', '$150/Well Annual'].map(t => (
                  <span key={t} className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)', border: '1px solid var(--ept-border)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subscribed Services */}
        {subscribedServices.length > 0 ? (
          <div className="mb-12">
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
          <div className="mb-12 p-10 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>No active services yet</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Choose the services you want to activate to get started.</p>
            <Link href="/services" className="inline-flex px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Browse Services</Link>
          </div>
        )}

        {/* Available to add */}
        {availableServices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Available Services</h2>
              <Link href="/services" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Manage All</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {availableServices.map((svc, i) => (
                <div key={i} className="p-4 rounded-xl border opacity-60 hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg" style={{ color: 'var(--ept-accent)' }}>{svc.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{svc.name}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>From ${svc.pricing?.[0]?.price || '—'}/mo</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
