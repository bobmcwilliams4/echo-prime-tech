'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getAdminAnalytics, getAdminUsers, AdminAnalytics, Service } from '../../lib/ept-api';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, role, signOut } = useAuth();
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<Array<{ uid: string; email: string; display_name: string; photo_url: string; role: string; created_at: string; last_login: string; subscribed_services: string | null }>>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'settings'>('overview');

  useEffect(() => {
    if (!loading && (!user || role !== 'owner')) router.push('/dashboard');
  }, [user, loading, role, router]);

  useEffect(() => {
    if (role === 'owner') {
      getAdminAnalytics().then(setAnalytics).catch(() => {});
      getAdminUsers().then(d => setUsers(d.users || [])).catch(() => {});
    }
  }, [role]);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  if (loading || !user || role !== 'owner') return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const serviceName = (id: string) => analytics?.services?.find((s: Service) => s.id === id)?.name || id;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[140px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>User View</Link>
          <button onClick={handleSignOut} className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Sign Out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Owner Dashboard</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>{user.email} &middot; Real-time platform analytics</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--ept-surface)' }}>
          {(['overview', 'users', 'services', 'settings'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all" style={{
              backgroundColor: activeTab === tab ? 'var(--ept-accent)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--ept-text-secondary)',
            }}>{tab}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && analytics && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users', value: analytics.total_users },
                { label: 'Active Subscriptions', value: analytics.total_subscriptions },
                { label: 'New This Week', value: analytics.new_this_week },
                { label: 'New Today', value: analytics.new_today },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Subscriptions by service */}
              <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Subscriptions by Service</h3>
                {analytics.subscriptions_by_service.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No subscriptions yet</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.subscriptions_by_service.map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{serviceName(s.service_id)}</span>
                        <span className="text-sm font-bold font-mono px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent signups */}
              <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Recent Users</h3>
                {analytics.recent_users.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No users yet</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {analytics.recent_users.slice(0, 10).map((u, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {u.photo_url ? (
                          <img src={u.photo_url} alt="" className="w-7 h-7 rounded-full" />
                        ) : (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{(u.display_name || u.email || '?')[0].toUpperCase()}</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--ept-text)' }}>{u.display_name || u.email}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--ept-text-muted)' }}>{u.email}</p>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* All service links */}
            <div className="mt-8">
              <h3 className="font-bold mb-4" style={{ color: 'var(--ept-text)' }}>All Services</h3>
              <div className="grid md:grid-cols-4 gap-3">
                {(analytics.services || []).map((svc: Service, i: number) => (
                  <Link key={i} href={svc.url || '#'} className="card-hover p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                    <span className="text-xl" style={{ color: 'var(--ept-accent)' }}>{svc.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{svc.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Services</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.photo_url ? <img src={u.photo_url} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{(u.display_name || u.email || '?')[0].toUpperCase()}</div>}
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{u.display_name || 'Unknown'}</p>
                          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: u.role === 'owner' ? 'var(--ept-accent)' : 'var(--ept-surface)', color: u.role === 'owner' ? '#fff' : 'var(--ept-text-secondary)' }}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {u.subscribed_services ? u.subscribed_services.split(',').map((s, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{serviceName(s)}</span>
                        )) : <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>None</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>{u.last_login ? new Date(u.last_login + 'Z').toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="p-8 text-center text-sm" style={{ color: 'var(--ept-text-muted)' }}>No users yet</div>}
          </div>
        )}

        {/* Services tab */}
        {activeTab === 'services' && analytics && (
          <div className="space-y-4">
            <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Integration teams can update service info, pricing, and features via the API: <code className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>PUT /api/admin/services/:id</code></p>
            {(analytics.services || []).map((svc: Service, i: number) => (
              <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{svc.icon} {svc.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{svc.tagline}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{svc.status}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {svc.pricing?.map((t, j) => (
                    <div key={j} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                      {t.tier}: {t.price !== null ? `$${t.price}/mo` : 'Custom'}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>Contact: {svc.team_contact}</p>
              </div>
            ))}
          </div>
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Platform Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Owner Email</label>
                  <p className="text-sm font-mono" style={{ color: 'var(--ept-text)' }}>{user.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>API Endpoint</label>
                  <p className="text-sm font-mono" style={{ color: 'var(--ept-text)' }}>https://ept-api.bmcii1976.workers.dev</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Support Emails</label>
                  <p className="text-sm" style={{ color: 'var(--ept-text)' }}>bob@echo-op.com &middot; customerservice@echo-op.com</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Team Integration API</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Teams can update their service pricing and info via authenticated API calls:</p>
              <pre className="text-xs p-4 rounded-lg overflow-x-auto font-mono" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{`PUT /api/admin/services/{service_id}
Authorization: Bearer <firebase-token>

{
  "name": "Updated Service Name",
  "tagline": "New tagline",
  "description": "Updated description",
  "pricing": [
    { "tier": "Starter", "price": 99, "interval": "month", "features": ["Feature 1", "Feature 2"] }
  ]
}`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
