'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import {
  getAdminAnalytics, getAdminUsers, getAdminUserDetail,
  updateUserRole, grantUserServices, revokeUserService, updateUserSettings,
  AdminAnalytics, AdminUserDetail, Service,
} from '../../lib/ept-api';
import {
  getRevenueSummary, listTransactions, listInvoices,
  type PayPalSummary, type PayPalTransaction, type PayPalInvoice,
} from '../../lib/paypal-api';

type UserRow = { uid: string; email: string; display_name: string; photo_url: string; role: string; created_at: string; last_login: string; subscribed_services: string | null };

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, role, signOut } = useAuth();
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'settings'>('overview');
  const [paypalSummary, setPaypalSummary] = useState<PayPalSummary | null>(null);
  const [recentTxns, setRecentTxns] = useState<PayPalTransaction[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<PayPalInvoice[]>([]);

  // User edit modal
  const [editUser, setEditUser] = useState<AdminUserDetail | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editRole, setEditRole] = useState('user');
  const [editServices, setEditServices] = useState<Record<string, boolean>>({});
  const [editSentinelMode, setEditSentinelMode] = useState('standard');
  const [editSentinelQueries, setEditSentinelQueries] = useState('100');
  const [editSentinelVoice, setEditSentinelVoice] = useState('true');
  const [editSentinelMemory, setEditSentinelMemory] = useState('true');
  const [editCustomTier, setEditCustomTier] = useState('free');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editTrustLevel, setEditTrustLevel] = useState('1');
  const [editBloodline, setEditBloodline] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && (!user || role !== 'owner')) router.push('/dashboard');
  }, [user, loading, role, router]);

  const refreshData = useCallback(() => {
    if (role === 'owner') {
      getAdminAnalytics().then(setAnalytics).catch(() => {});
      getAdminUsers().then(d => setUsers(d.users || [])).catch(() => {});
      getRevenueSummary(30).then(setPaypalSummary).catch(() => {});
      listTransactions({ limit: 5 }).then(d => setRecentTxns(d.transactions || [])).catch(() => {});
      listInvoices('SENT', 10).then(d => setPendingInvoices((d.invoices || []).filter((inv: PayPalInvoice) => inv.status === 'SENT' || inv.status === 'DRAFT'))).catch(() => {});
    }
  }, [role]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  const openUserEdit = async (uid: string) => {
    setEditLoading(true);
    setEditUser(null);
    setSaveMessage('');
    try {
      const detail = await getAdminUserDetail(uid);
      setEditUser(detail);
      setEditRole(detail.user.role);

      // Build service checkbox state from active subscriptions
      const svcMap: Record<string, boolean> = {};
      for (const svc of detail.services) {
        const sub = detail.subscriptions.find(s => s.service_id === svc.id && s.status === 'active');
        svcMap[svc.id] = !!sub;
      }
      setEditServices(svcMap);

      // Load grants
      setEditSentinelMode(detail.grants.sentinel_mode || 'standard');
      setEditSentinelQueries(detail.grants.sentinel_queries_limit || '100');
      setEditSentinelVoice(detail.grants.sentinel_voice || 'true');
      setEditSentinelMemory(detail.grants.sentinel_memory || 'true');
      setEditCustomTier(detail.grants.custom_tier || 'free');
      setEditDisplayName(detail.user.display_name || '');
      setEditTrustLevel(detail.grants.trust_level || '1');
      setEditBloodline(detail.grants.is_bloodline === 'true');
      setEditNotes(detail.grants.notes || '');
    } catch (err) {
      console.error('Failed to load user detail:', err);
    } finally {
      setEditLoading(false);
    }
  };

  const saveUserEdit = async () => {
    if (!editUser) return;
    setEditSaving(true);
    setSaveMessage('');
    const uid = editUser.user.uid;

    try {
      // 1. Update role if changed
      if (editRole !== editUser.user.role) {
        await updateUserRole(uid, editRole);
      }

      // 2. Grant new services
      const toGrant = Object.entries(editServices)
        .filter(([id, checked]) => {
          const wasSub = editUser.subscriptions.some(s => s.service_id === id && s.status === 'active');
          return checked && !wasSub;
        })
        .map(([id]) => id);
      if (toGrant.length > 0) await grantUserServices(uid, toGrant);

      // 3. Revoke removed services
      const toRevoke = Object.entries(editServices)
        .filter(([id, checked]) => {
          const wasSub = editUser.subscriptions.some(s => s.service_id === id && s.status === 'active');
          return !checked && wasSub;
        })
        .map(([id]) => id);
      for (const sid of toRevoke) await revokeUserService(uid, sid);

      // 4. Update settings (includes display_name, trust_level, bloodline)
      await updateUserSettings(uid, {
        display_name: editDisplayName,
        sentinel_mode: editSentinelMode,
        sentinel_queries_limit: editSentinelQueries,
        sentinel_voice: editSentinelVoice,
        sentinel_memory: editSentinelMemory,
        custom_tier: editCustomTier,
        trust_level: editTrustLevel,
        is_bloodline: editBloodline ? 'true' : 'false',
        notes: editNotes,
      });

      setSaveMessage('Saved successfully');
      refreshData();
      // Refresh the modal data
      const detail = await getAdminUserDetail(uid);
      setEditUser(detail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSaveMessage(`Error: ${msg}`);
    } finally {
      setEditSaving(false);
    }
  };

  const grantAllServices = () => {
    if (!editUser) return;
    const all: Record<string, boolean> = {};
    for (const svc of editUser.services) all[svc.id] = true;
    setEditServices(all);
  };

  const revokeAllServices = () => {
    if (!editUser) return;
    const none: Record<string, boolean> = {};
    for (const svc of editUser.services) none[svc.id] = false;
    setEditServices(none);
  };

  if (loading || !user || role !== 'owner') return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const serviceName = (id: string) => analytics?.services?.find((s: Service) => s.id === id)?.name || id;
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const filteredUsers = searchQuery
    ? users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.uid?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[140px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/payments" className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: 'var(--ept-accent)' }}>Payments</Link>
          <Link href="/admin/invoices" className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: 'var(--ept-accent)' }}>Invoices</Link>
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

            {/* Revenue Section */}
            {paypalSummary && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: 'var(--ept-text)' }}>Revenue (30 days)</h3>
                  <Link href="/admin/payments" className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Full Dashboard</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Revenue', value: fmt(paypalSummary.revenue.total), sub: `${paypalSummary.revenue.transaction_count} txns` },
                    { label: 'Net Revenue', value: fmt(paypalSummary.net_revenue), sub: `After ${fmt(paypalSummary.fees.total)} fees` },
                    { label: 'Refunds', value: fmt(paypalSummary.refunds.total), sub: `${paypalSummary.refunds.count} refunds` },
                    { label: 'Active Subs', value: String(paypalSummary.subscriptions.active), sub: `${fmt(paypalSummary.subscriptions.mrr)} MRR` },
                  ].map((card, i) => (
                    <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                      <p className="text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{card.label}</p>
                      <p className="text-2xl font-extrabold font-mono gradient-text">{card.value}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{card.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outstanding Invoices */}
            {pendingInvoices.length > 0 && (
              <div className="p-4 rounded-xl border mb-8 flex items-center justify-between" style={{ borderColor: 'var(--ept-accent)', backgroundColor: isDark ? '#0a1f1f' : '#f0fdfa' }}>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--ept-accent)' }}>
                    {pendingInvoices.length} Outstanding Invoice{pendingInvoices.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                    {fmt(pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0))} awaiting payment
                  </p>
                </div>
                <Link href="/admin/invoices" className="px-4 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>View Invoices</Link>
              </div>
            )}

            {/* Recent Transactions */}
            {recentTxns.length > 0 && (
              <div className="rounded-xl border overflow-hidden mb-8" style={{ borderColor: 'var(--ept-card-border)' }}>
                <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--ept-text)' }}>Recent Transactions</h3>
                  <Link href="/admin/payments" className="text-xs" style={{ color: 'var(--ept-accent)' }}>View All</Link>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                      {['Type', 'Amount', 'Status', 'Customer', 'Date'].map(h => (
                        <th key={h} className="px-4 py-2 text-left font-medium" style={{ color: 'var(--ept-text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentTxns.map(tx => (
                      <tr key={tx.id} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded font-medium ${tx.type === 'REFUND' ? 'bg-red-500/10 text-red-400' : tx.type === 'CAPTURE' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{tx.type}</span>
                        </td>
                        <td className="px-4 py-2 font-medium font-mono" style={{ color: 'var(--ept-text)' }}>{fmt(tx.amount)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded font-medium ${tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{tx.status}</span>
                        </td>
                        <td className="px-4 py-2" style={{ color: 'var(--ept-text-secondary)' }}>{tx.customer_email || '—'}</td>
                        <td className="px-4 py-2" style={{ color: 'var(--ept-text-muted)' }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
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
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--ept-text)' }}>{u.display_name || u.email?.split('@')[0] || u.email}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--ept-text-muted)' }}>{u.email}</p>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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

            <div className="mt-8">
              <h3 className="font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Integrations</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/admin/zoho" className="card-hover p-5 rounded-xl border flex items-center gap-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold" style={{ backgroundColor: isDark ? '#1a2332' : '#f0f4f8', color: 'var(--ept-accent)' }}>Z</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Zoho CRM</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Lead sync, intelligence, analytics</p>
                  </div>
                </Link>
                <Link href="/admin/payments" className="card-hover p-5 rounded-xl border flex items-center gap-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold" style={{ backgroundColor: isDark ? '#1a2332' : '#f0f4f8', color: 'var(--ept-accent)' }}>$</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>PayPal / Stripe</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Payments, invoices, subscriptions</p>
                  </div>
                </Link>
                <Link href="/admin/invoices" className="card-hover p-5 rounded-xl border flex items-center gap-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold" style={{ backgroundColor: isDark ? '#1a2332' : '#f0f4f8', color: 'var(--ept-accent)' }}>&#x1F4C4;</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Invoices</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Generate, send, track invoices</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div>
            {/* Search bar */}
            <div className="mb-4 flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search users by name, email, or uid..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
              />
              <span className="text-xs font-mono px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Services</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Last Login</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={i} className="border-t cursor-pointer transition-colors" style={{ borderColor: 'var(--ept-border)' }}
                      onClick={() => openUserEdit(u.uid)}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ept-surface)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {u.photo_url ? <img src={u.photo_url} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{(u.display_name || u.email || '?')[0].toUpperCase()}</div>}
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{u.display_name || u.email?.split('@')[0] || 'Unknown'}</p>
                            <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{
                          backgroundColor: u.role === 'owner' ? 'var(--ept-accent)' : u.role === 'admin' ? '#7c3aed' : 'var(--ept-surface)',
                          color: u.role === 'owner' || u.role === 'admin' ? '#fff' : 'var(--ept-text-secondary)',
                        }}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {u.subscribed_services ? u.subscribed_services.split(',').map((s, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{serviceName(s)}</span>
                          )) : <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>None</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>{u.last_login ? new Date(u.last_login + 'Z').toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div className="p-8 text-center text-sm" style={{ color: 'var(--ept-text-muted)' }}>{searchQuery ? 'No matching users' : 'No users yet'}</div>}
            </div>
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
                  <p className="text-sm font-mono" style={{ color: 'var(--ept-text)' }}>https://ept-api.echo-op.com</p>
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

      {/* ═══════ User Edit Modal ═══════ */}
      {(editUser || editLoading) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={e => { if (e.target === e.currentTarget) { setEditUser(null); setEditLoading(false); } }}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            {editLoading ? (
              <div className="p-12 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
              </div>
            ) : editUser && (
              <>
                {/* Modal Header */}
                <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="flex items-center gap-3">
                    {editUser.user.photo_url ? (
                      <img src={editUser.user.photo_url} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                        {(editUser.user.display_name || editUser.user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-extrabold" style={{ color: 'var(--ept-text)' }}>{editUser.user.display_name || editUser.user.email?.split('@')[0] || 'Unknown'}</h2>
                        {editUser.grants.is_bloodline === 'true' && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>BLOODLINE</span>
                        )}
                        {editUser.grants.trust_level && parseInt(editUser.grants.trust_level) >= 8 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: '#22c55e', color: '#fff' }}>TL{editUser.grants.trust_level}</span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{editUser.user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditUser(null)} className="text-xl px-2 py-1 rounded-lg hover:opacity-70" style={{ color: 'var(--ept-text-muted)' }}>&times;</button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Info Bar */}
                  <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span>UID: <span className="font-mono">{editUser.user.uid.slice(0, 12)}...</span></span>
                    <span>Joined: {editUser.user.created_at ? new Date(editUser.user.created_at + 'Z').toLocaleDateString() : '-'}</span>
                    <span>Last Login: {editUser.user.last_login ? new Date(editUser.user.last_login + 'Z').toLocaleString() : '-'}</span>
                    {editUser.user.stripe_customer_id && <span>Stripe: <span className="font-mono">{editUser.user.stripe_customer_id.slice(0, 14)}...</span></span>}
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Display Name</label>
                    <input
                      type="text"
                      value={editDisplayName}
                      onChange={e => setEditDisplayName(e.target.value)}
                      placeholder={editUser?.user.email ? `Defaults to ${editUser.user.email.split('@')[0]}` : 'Full name...'}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>

                  {/* Trust Level & Bloodline */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Trust Level</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(lvl => (
                          <button key={lvl} onClick={() => setEditTrustLevel(lvl)} className="w-9 h-9 rounded-lg text-sm font-bold transition-all" style={{
                            backgroundColor: editTrustLevel === lvl ? 'var(--ept-accent)' : 'var(--ept-surface)',
                            color: editTrustLevel === lvl ? '#fff' : 'var(--ept-text-secondary)',
                            borderWidth: '1px',
                            borderColor: editTrustLevel === lvl ? 'transparent' : 'var(--ept-border)',
                          }}>{lvl}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Bloodline</label>
                      <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all" style={{
                        backgroundColor: editBloodline ? 'var(--ept-accent-glow)' : 'var(--ept-surface)',
                        borderColor: editBloodline ? 'var(--ept-accent)' : 'var(--ept-border)',
                      }}>
                        <input type="checkbox" checked={editBloodline} onChange={e => setEditBloodline(e.target.checked)} className="w-5 h-5 rounded" style={{ accentColor: 'var(--ept-accent)' }} />
                        <div>
                          <span className="text-sm font-bold block" style={{ color: editBloodline ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>
                            {editBloodline ? 'McWilliams Dynasty' : 'Standard'}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                            {editBloodline ? 'Full sovereign access' : 'Regular user'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Role</label>
                    <div className="flex gap-2">
                      {['user', 'admin', 'owner'].map(r => (
                        <button key={r} onClick={() => setEditRole(r)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all" style={{
                          backgroundColor: editRole === r ? (r === 'owner' ? 'var(--ept-accent)' : r === 'admin' ? '#7c3aed' : 'var(--ept-surface)') : 'var(--ept-surface)',
                          color: editRole === r ? '#fff' : 'var(--ept-text-secondary)',
                          borderWidth: '1px',
                          borderColor: editRole === r ? 'transparent' : 'var(--ept-border)',
                        }}>{r}</button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Tier */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Access Tier</label>
                    <div className="flex flex-wrap gap-2">
                      {['free', 'starter', 'professional', 'enterprise', 'sovereign'].map(t => (
                        <button key={t} onClick={() => setEditCustomTier(t)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all" style={{
                          backgroundColor: editCustomTier === t ? 'var(--ept-accent)' : 'var(--ept-surface)',
                          color: editCustomTier === t ? '#fff' : 'var(--ept-text-secondary)',
                          borderWidth: '1px',
                          borderColor: editCustomTier === t ? 'transparent' : 'var(--ept-border)',
                        }}>{t === 'sovereign' ? 'Sovereign (Full)' : t}</button>
                      ))}
                    </div>
                  </div>

                  {/* Service Access */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Service Access</label>
                      <div className="flex gap-2">
                        <button onClick={grantAllServices} className="text-xs px-2.5 py-1 rounded-md font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Grant All</button>
                        <button onClick={revokeAllServices} className="text-xs px-2.5 py-1 rounded-md font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Revoke All</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {editUser.services.map(svc => {
                        const checked = editServices[svc.id] || false;
                        const sub = editUser.subscriptions.find(s => s.service_id === svc.id && s.status === 'active');
                        const isPaid = sub && sub.stripe_subscription_id && sub.tier !== 'owner-grant';
                        return (
                          <label key={svc.id} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all" style={{
                            backgroundColor: checked ? 'var(--ept-accent-glow)' : 'var(--ept-surface)',
                            borderColor: checked ? 'var(--ept-accent)' : 'var(--ept-border)',
                          }}>
                            <input type="checkbox" checked={checked} onChange={e => setEditServices(prev => ({ ...prev, [svc.id]: e.target.checked }))} className="w-4 h-4 rounded accent-current" style={{ accentColor: 'var(--ept-accent)' }} />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium block" style={{ color: 'var(--ept-text)' }}>{svc.icon} {svc.name}</span>
                              {isPaid && <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Paid ({sub.tier})</span>}
                              {sub && sub.tier === 'owner-grant' && <span className="text-xs" style={{ color: 'var(--ept-accent)' }}>Owner Granted</span>}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sentinel AI Configuration */}
                  <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                      <span style={{ color: 'var(--ept-accent)' }}>&#x2B21;</span> Sentinel AI Configuration
                    </h3>

                    {/* Mode */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Mode</label>
                      <div className="flex gap-2">
                        {[
                          { id: 'standard', label: 'Standard', desc: 'Single AI, basic queries' },
                          { id: 'swarm', label: 'Swarm', desc: 'Multi-agent orchestration' },
                          { id: 'echo_prime', label: 'Echo Prime', desc: 'Full sovereign-level access' },
                        ].map(m => (
                          <button key={m.id} onClick={() => setEditSentinelMode(m.id)} className="flex-1 p-3 rounded-lg text-left transition-all" style={{
                            backgroundColor: editSentinelMode === m.id ? 'var(--ept-accent)' : 'var(--ept-card-bg)',
                            color: editSentinelMode === m.id ? '#fff' : 'var(--ept-text-secondary)',
                            borderWidth: '1px',
                            borderColor: editSentinelMode === m.id ? 'transparent' : 'var(--ept-border)',
                          }}>
                            <span className="text-sm font-medium block">{m.label}</span>
                            <span className="text-xs opacity-70">{m.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Queries Limit */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Queries / Month</label>
                      <div className="flex gap-2">
                        {['50', '100', '500', '1000', 'unlimited'].map(q => (
                          <button key={q} onClick={() => setEditSentinelQueries(q)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{
                            backgroundColor: editSentinelQueries === q ? 'var(--ept-accent)' : 'var(--ept-card-bg)',
                            color: editSentinelQueries === q ? '#fff' : 'var(--ept-text-secondary)',
                            borderWidth: '1px',
                            borderColor: editSentinelQueries === q ? 'transparent' : 'var(--ept-border)',
                          }}>{q === 'unlimited' ? '\u221E' : q}</button>
                        ))}
                      </div>
                    </div>

                    {/* Voice & Memory Toggles */}
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editSentinelVoice === 'true'} onChange={e => setEditSentinelVoice(e.target.checked ? 'true' : 'false')} className="w-4 h-4 rounded" style={{ accentColor: 'var(--ept-accent)' }} />
                        <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Voice Output (TTS)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editSentinelMemory === 'true'} onChange={e => setEditSentinelMemory(e.target.checked ? 'true' : 'false')} className="w-4 h-4 rounded" style={{ accentColor: 'var(--ept-accent)' }} />
                        <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Memory Cortex</span>
                      </label>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Admin Notes</label>
                    <textarea
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      placeholder="Private notes about this user..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--ept-border)' }}>
                  <div>
                    {saveMessage && (
                      <span className="text-sm font-medium" style={{ color: saveMessage.startsWith('Error') ? '#ef4444' : '#22c55e' }}>{saveMessage}</span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditUser(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Cancel</button>
                    <button onClick={saveUserEdit} disabled={editSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all" style={{
                      backgroundColor: editSaving ? 'var(--ept-surface)' : 'var(--ept-accent)',
                      color: '#fff',
                      opacity: editSaving ? 0.6 : 1,
                    }}>
                      {editSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
