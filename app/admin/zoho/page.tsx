'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import {
  getZohoConnection,
  disconnectZoho,
  getZohoStats,
  runFullSync,
  syncZohoToCloser,
  syncCloserToZoho,
  getOAuthUrl,
  checkHealth,
} from '@/lib/zoho-api';

export default function ZohoIntegrationPage() {
  const { isDark, toggle } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [connection, setConnection] = useState<Record<string, unknown> | null>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [syncResult, setSyncResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [conn, st, h] = await Promise.all([
        getZohoConnection().catch(() => ({ connected: false })),
        getZohoStats().catch(() => ({})),
        checkHealth().catch(() => ({ status: 'error' })),
      ]);
      setConnection(conn);
      setStats(st);
      setHealth(h);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadAll();
  }, [user, loadAll]);

  async function handleFullSync() {
    setSyncing(true);
    setSyncResult(null);
    setError('');
    try {
      const result = await runFullSync();
      setSyncResult(result);
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
    setSyncing(false);
  }

  async function handleDirectionSync(dir: 'zoho-to-closer' | 'closer-to-zoho') {
    setSyncing(true);
    setSyncResult(null);
    setError('');
    try {
      const result = dir === 'zoho-to-closer' ? await syncZohoToCloser() : await syncCloserToZoho();
      setSyncResult(result);
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
    setSyncing(false);
  }

  async function handleDisconnect() {
    if (!confirm('Disconnect Zoho CRM? This will remove the OAuth connection.')) return;
    try {
      await disconnectZoho();
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const isConnected = connection && (connection as { connected?: boolean }).connected;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-3">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime"
            width={120}
            height={32}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
          <span style={{ color: 'var(--ept-text-muted)' }}>/</span>
          <span className="font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Admin</span>
          <span style={{ color: 'var(--ept-text-muted)' }}>/</span>
          <span className="font-semibold" style={{ color: 'var(--ept-accent)' }}>Zoho CRM</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Back to Admin
          </button>
          <button onClick={toggle} className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Zoho CRM Integration</h1>
            <p className="mt-1" style={{ color: 'var(--ept-text-secondary)' }}>
              Connect Zoho CRM to sync leads with Closer AI and access 5,400+ intelligence engines.
            </p>
          </div>
          <button onClick={loadAll} className="text-sm px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            {/* Connection Status */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Connection Status</h2>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: isConnected ? '#22c55e' : '#ef4444' }} />
                  <span className="text-sm font-medium" style={{ color: isConnected ? '#22c55e' : '#ef4444' }}>
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>

              {isConnected ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs uppercase font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Organization</span>
                      <p className="font-medium" style={{ color: 'var(--ept-text)' }}>{(connection as Record<string, unknown>).org_name as string || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Domain</span>
                      <p className="font-medium" style={{ color: 'var(--ept-text)' }}>{(connection as Record<string, unknown>).org_domain as string || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Connected</span>
                      <p className="font-medium" style={{ color: 'var(--ept-text)' }}>
                        {(connection as Record<string, unknown>).connected_at ? new Date((connection as Record<string, unknown>).connected_at as string).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                    <button onClick={handleDisconnect} className="text-sm px-4 py-2 rounded-lg border" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
                    Connect your Zoho CRM account to enable bidirectional lead sync, AI intelligence, and engine-powered analysis.
                  </p>
                  <a
                    href={getOAuthUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
                    style={{ backgroundColor: 'var(--ept-accent)' }}
                  >
                    Connect Zoho CRM
                  </a>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Zoho Leads', value: (stats as Record<string, unknown>)?.total_leads || '0' },
                { label: 'Synced Leads', value: (stats as Record<string, unknown>)?.total_syncs || '0' },
                { label: 'Total Syncs', value: (stats as Record<string, unknown>)?.sync_count || '0' },
                { label: 'Engines Available', value: '5,400+' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-xs uppercase font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{String(s.value)}</div>
                </div>
              ))}
            </div>

            {/* Sync Controls */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Lead Sync</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
                Sync leads bidirectionally between Zoho CRM and Echo Prime Closer AI. New leads are created; existing leads are skipped by deduplication.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFullSync}
                  disabled={syncing || !isConnected}
                  className="px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--ept-accent)' }}
                >
                  {syncing ? 'Syncing...' : 'Full Bidirectional Sync'}
                </button>
                <button
                  onClick={() => handleDirectionSync('zoho-to-closer')}
                  disabled={syncing || !isConnected}
                  className="px-4 py-3 rounded-xl font-semibold border disabled:opacity-50"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  Zoho → Closer
                </button>
                <button
                  onClick={() => handleDirectionSync('closer-to-zoho')}
                  disabled={syncing || !isConnected}
                  className="px-4 py-3 rounded-xl font-semibold border disabled:opacity-50"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  Closer → Zoho
                </button>
              </div>

              {syncResult && (
                <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Sync Result</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {'zoho_to_closer' in syncResult && (
                      <div>
                        <span className="text-xs uppercase font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Zoho → Closer</span>
                        <p style={{ color: 'var(--ept-text)' }}>{String((syncResult as Record<string, Record<string, unknown>>).zoho_to_closer?.synced ?? 0)} synced</p>
                      </div>
                    )}
                    {'closer_to_zoho' in syncResult && (
                      <div>
                        <span className="text-xs uppercase font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Closer → Zoho</span>
                        <p style={{ color: 'var(--ept-text)' }}>{String((syncResult as Record<string, Record<string, unknown>>).closer_to_zoho?.synced ?? 0)} synced</p>
                      </div>
                    )}
                    {'duration_ms' in syncResult && (
                      <div>
                        <span className="text-xs uppercase font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Duration</span>
                        <p style={{ color: 'var(--ept-text)' }}>{String(syncResult.duration_ms)}ms</p>
                      </div>
                    )}
                    {'synced' in syncResult && (
                      <div>
                        <span className="text-xs uppercase font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Synced</span>
                        <p style={{ color: 'var(--ept-text)' }}>{String(syncResult.synced)} leads</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* System Health */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>System Health</h2>
              <div className="space-y-2">
                {[
                  { name: 'Integration Worker', ok: (health as Record<string, unknown>)?.status === 'ok' },
                  { name: 'D1 Database', ok: (health as Record<string, Record<string, unknown>>)?.dependencies?.d1 === 'ok' },
                  { name: 'KV Cache', ok: (health as Record<string, Record<string, unknown>>)?.dependencies?.kv === 'ok' },
                  { name: 'Zoho Connection', ok: isConnected },
                  { name: 'Echo Prime Cloud', ok: true },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.ok ? '#22c55e' : '#ef4444' }} />
                    <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{c.name}</span>
                    <span className="ml-auto text-xs font-medium" style={{ color: c.ok ? '#22c55e' : '#ef4444' }}>
                      {c.ok ? 'Healthy' : 'Down'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zoho Extension Info */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Zoho CRM Extension</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
                Install the Echo Prime Intelligence extension in your Zoho CRM to get AI-powered insights directly in your CRM records.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>Right Panel Widget</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>AI lead scoring, engine intelligence, and insights for every CRM record.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>List View Sync</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Bidirectional lead sync between Zoho and Closer AI from the list view.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>Top Bar Dashboard</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Quick access to sync status, health checks, and engine intelligence.</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                  Extension available at Zoho Marketplace or install from your Zoho CRM &rarr; Settings &rarr; Marketplace &rarr; All &rarr; Search &quot;Echo Prime&quot;
                </p>
              </div>
            </div>

            {/* API Endpoints Reference */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>API Reference</h2>
              <div className="space-y-2 font-mono text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                {[
                  ['GET', '/health', 'Worker health check'],
                  ['GET', '/stats', 'Sync statistics'],
                  ['GET', '/api/connection', 'Connection status'],
                  ['POST', '/api/sync/full', 'Full bidirectional sync'],
                  ['POST', '/api/sync/zoho-to-closer', 'One-way sync Zoho→Closer'],
                  ['POST', '/api/sync/closer-to-zoho', 'One-way sync Closer→Zoho'],
                  ['POST', '/api/intelligence/analyze', 'Engine intelligence query'],
                  ['POST', '/api/intelligence/score', 'Lead scoring'],
                  ['POST', '/webhook/zoho', 'Zoho webhook receiver'],
                ].map(([method, path, desc]) => (
                  <div key={path} className="flex items-center gap-3 py-1.5 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{
                      backgroundColor: method === 'GET' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                      color: method === 'GET' ? '#22c55e' : '#3b82f6',
                    }}>{method}</span>
                    <span style={{ color: 'var(--ept-text)' }}>{path}</span>
                    <span className="ml-auto" style={{ color: 'var(--ept-text-muted)' }}>{desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                Base URL: <code className="font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)' }}>https://echo-zoho-integration.bmcii1976.workers.dev</code>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
