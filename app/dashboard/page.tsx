'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';

interface LiveStats {
  total_engines: number;
  total_categories: number;
  total_doctrines: number;
  uptime_sla: string;
  response_ms: string;
  categories: { name: string; engines: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setIsDark(h < 6 || h >= 18);
    document.documentElement.classList.toggle('dark', h < 6 || h >= 18);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    fetch('https://echo-engine-runtime.bmcii1976.workers.dev/public-stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const topCategories = stats?.categories?.slice(0, 12) || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Top bar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={400} height={260}
            className="w-[160px] md:w-[200px] h-auto"
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{user.displayName || user.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</p>
          </div>
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border" style={{ borderColor: 'var(--ept-border)' }} />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <button onClick={handleSignOut} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Welcome, <span className="gradient-text">{user.displayName || user.email?.split('@')[0] || 'there'}</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Your Echo Prime Technologies dashboard. Access your intelligence engines, data pipelines, and analytics.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Engines Available', value: stats ? String(stats.total_engines) : '...' },
            { label: 'Industry Verticals', value: stats ? String(stats.total_categories) : '...' },
            { label: 'Knowledge Blocks', value: stats ? (stats.total_doctrines >= 1000 ? `${(stats.total_doctrines / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(stats.total_doctrines)) : '...' },
            { label: 'Platform Uptime', value: stats?.uptime_sla || '99.9%' },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { title: 'Query an Engine', desc: 'Send a question to any intelligence engine and get expert-level analysis.', cta: 'Coming Soon', icon: '⬡' },
            { title: 'Data Pipelines', desc: 'Monitor your autonomous data extraction and normalization pipelines.', cta: 'Coming Soon', icon: '◈' },
            { title: 'API Access', desc: 'Generate API keys and integrate Echo Prime engines into your applications.', cta: 'Coming Soon', icon: '◇' },
          ].map((action, i) => (
            <div key={i} className="card-hover p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl mb-3 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                {action.icon}
              </div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{action.title}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>{action.desc}</p>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                {action.cta}
              </span>
            </div>
          ))}
        </div>

        {/* Engine categories */}
        {topCategories.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Engine Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {topCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{cat.name}</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{cat.engines}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
