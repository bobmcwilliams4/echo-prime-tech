'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ProductTutorialButton from '../../components/product-tutorial-button';
import {
  vaultCredentials,
  vaultCredential,
  vaultSearch,
  vaultKeychain,
  vaultBackups,
  vaultStats,
  vaultAudit,
  VaultCredential,
  VaultStats,
  VaultBackup,
  VaultAuditEntry,
} from '../../lib/ept-api';

type Tab = 'credentials' | 'keychain' | 'backups' | 'stats' | 'audit';

// Auth check uses role from API (server-enforced), not client-side email list
const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function VaultPage() {
  const router = useRouter();
  const { user, loading, role } = useAuth();
  const { isDark } = useTheme();
  const [masterPassword, setMasterPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [tab, setTab] = useState<Tab>('credentials');
  const [mpInput, setMpInput] = useState('');
  const lastActivity = useRef(Date.now());

  // Session timeout
  useEffect(() => {
    if (!unlocked) return;
    const check = setInterval(() => {
      if (Date.now() - lastActivity.current > SESSION_TIMEOUT_MS) {
        handleLock();
      }
    }, 30000);
    return () => clearInterval(check);
  }, [unlocked]);

  const resetTimer = useCallback(() => { lastActivity.current = Date.now(); }, []);

  useEffect(() => {
    if (!unlocked) return;
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    return () => events.forEach(e => window.removeEventListener(e, resetTimer));
  }, [unlocked, resetTimer]);

  // Redirect non-commanders
  useEffect(() => {
    if (!loading && user && role !== 'owner') {
      router.push('/dashboard');
    }
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleUnlock = async () => {
    if (!mpInput.trim()) return;
    setUnlockError('');
    try {
      await vaultStats(mpInput);
      setMasterPassword(mpInput);
      setUnlocked(true);
      setMpInput('');
      lastActivity.current = Date.now();
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : 'Failed to unlock vault');
    }
  };

  const handleLock = () => {
    setMasterPassword('');
    setUnlocked(false);
    setMpInput('');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#00ff88', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (role !== 'owner') return null;

  // Lock screen
  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="mb-8 text-center">
          <div className="text-5xl mb-4" style={{ filter: 'drop-shadow(0 0 20px #00ff88)' }}>&#128274;</div>
          <h1 className="text-2xl font-bold text-white mb-1">Commander Vault</h1>
          <p className="text-sm text-gray-500">AES-256-GCM encrypted credential store</p>
        </div>
        <div className="w-full max-w-sm space-y-4 px-6">
          <input
            type="password"
            value={mpInput}
            onChange={e => setMpInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            placeholder="Master password"
            className="w-full px-4 py-3 rounded-xl text-sm font-mono bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
            autoFocus
          />
          <button onClick={handleUnlock} className="w-full py-3 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-500 text-white transition-all">
            Unlock Vault
          </button>
          {unlockError && <p className="text-red-400 text-xs text-center">{unlockError}</p>}
        </div>
        <Link href="/" className="mt-12 text-xs text-gray-600 hover:text-gray-400">&larr; Back to home</Link>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'credentials', label: 'Credentials', icon: '\uD83D\uDD11' },
    { id: 'keychain', label: 'Keychain', icon: '\uD83D\uDD17' },
    { id: 'backups', label: 'Backups', icon: '\uD83D\uDCBE' },
    { id: 'stats', label: 'Stats', icon: '\uD83D\uDCCA' },
    { id: 'audit', label: 'Audit', icon: '\uD83D\uDCCB' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0f', color: '#e0e0e0' }}>
      <ProductTutorialButton tutorialId="vault" productName="Digital Vault" />
      {/* Top bar */}
      <nav data-tutorial="dvault-hero" className="border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: '#1a1a2e', backgroundColor: '#0d0d14' }}>
        <div className="flex items-center gap-4">
          <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[120px] h-auto" style={{ mixBlendMode: 'screen' }} priority /></Link>
          <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: '#00ff8820', color: '#00ff88' }}>VAULT</span>
        </div>
        <div data-tutorial="dvault-sharing" className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-500">{user.email}</span>
          <button onClick={handleLock} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 transition-all">
            &#128274; Lock
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div data-tutorial="dvault-upload" className="border-b px-6 py-2 flex gap-1 overflow-x-auto" style={{ borderColor: '#1a1a2e' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap" style={{
            backgroundColor: tab === t.id ? '#00ff8820' : 'transparent',
            color: tab === t.id ? '#00ff88' : '#666',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div data-tutorial="dvault-browser" className="max-w-7xl mx-auto px-6 py-8">
        {tab === 'credentials' && <CredentialsTab masterPassword={masterPassword} />}
        {tab === 'keychain' && <KeychainTab masterPassword={masterPassword} />}
        {tab === 'backups' && <BackupsTab masterPassword={masterPassword} />}
        {tab === 'stats' && <StatsTab masterPassword={masterPassword} />}
        {tab === 'audit' && <AuditTab masterPassword={masterPassword} />}
      </div>
    </div>
  );
}

// ─── Credentials Tab ───

function CredentialsTab({ masterPassword }: { masterPassword: string }) {
  const [creds, setCreds] = useState<VaultCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [revealed, setRevealed] = useState<{ service: string; username: string; password: string } | null>(null);
  const [revealing, setRevealing] = useState<string | null>(null);

  useEffect(() => {
    vaultCredentials(masterPassword).then(d => { setCreds(d.credentials); setLoading(false); }).catch(() => setLoading(false));
  }, [masterPassword]);

  const handleSearch = async () => {
    if (!search.trim()) {
      vaultCredentials(masterPassword).then(d => setCreds(d.credentials)).catch(() => {});
      return;
    }
    try {
      const d = await vaultSearch(masterPassword, search);
      setCreds(d.results);
    } catch {}
  };

  const handleReveal = async (service: string) => {
    if (revealed?.service === service) { setRevealed(null); return; }
    setRevealing(service);
    try {
      const d = await vaultCredential(masterPassword, service);
      setRevealed(d);
    } catch {}
    setRevealing(null);
  };

  const strengthColor = (s: number) => {
    if (s >= 80) return '#00ff88';
    if (s >= 60) return '#88ff00';
    if (s >= 40) return '#ffaa00';
    return '#ff4444';
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search credentials..." className="flex-1 px-4 py-2.5 rounded-xl text-sm font-mono bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-green-500" />
        <button onClick={handleSearch} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-500 text-white">Search</button>
      </div>
      <div className="text-xs text-gray-500 mb-4">{creds.length} credentials</div>
      <div className="space-y-2">
        {creds.map((cr, i) => (
          <div key={i} className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: '#111118', borderColor: '#1a1a2e' }}>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono font-bold text-white truncate">{cr.service}</div>
              <div className="text-xs text-gray-500 font-mono truncate">{cr.username || '—'}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${cr.strength}%`, backgroundColor: strengthColor(cr.strength) }} />
              </div>
              <span className="text-xs font-mono w-8 text-right" style={{ color: strengthColor(cr.strength) }}>{cr.strength}</span>
            </div>
            <button onClick={() => handleReveal(cr.service)} disabled={revealing === cr.service} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{
              backgroundColor: revealed?.service === cr.service ? '#ff444420' : '#00ff8820',
              color: revealed?.service === cr.service ? '#ff4444' : '#00ff88',
            }}>
              {revealing === cr.service ? '...' : revealed?.service === cr.service ? 'Hide' : 'Reveal'}
            </button>
          </div>
        ))}
      </div>
      {revealed && (
        <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: '#1a0a0a', borderColor: '#ff444440' }}>
          <div className="text-xs text-red-400 font-semibold mb-2">REVEALED CREDENTIAL</div>
          <div className="grid grid-cols-3 gap-4 text-sm font-mono">
            <div><span className="text-gray-500 text-xs">Service</span><div className="text-white">{revealed.service}</div></div>
            <div><span className="text-gray-500 text-xs">Username</span><div className="text-white">{revealed.username}</div></div>
            <div>
              <span className="text-gray-500 text-xs">Password</span>
              <div className="text-green-400 break-all select-all cursor-text">{revealed.password}</div>
            </div>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(revealed.password); }} className="mt-3 text-xs px-3 py-1 rounded bg-gray-800 text-gray-400 hover:text-white">Copy Password</button>
        </div>
      )}
    </div>
  );
}

// ─── Keychain Tab ───

function KeychainTab({ masterPassword }: { masterPassword: string }) {
  const [keys, setKeys] = useState<{ name: string; masked_value: string; length?: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    vaultKeychain(masterPassword).then(d => { setKeys(d.keys); setLoading(false); }).catch(() => setLoading(false));
  }, [masterPassword]);

  if (loading) return <Loader />;

  const filtered = filter ? keys.filter(k => k.name.toLowerCase().includes(filter.toLowerCase())) : keys;

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter keys..." className="w-full px-4 py-2.5 rounded-xl text-sm font-mono bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 mb-4" />
      <div className="text-xs text-gray-500 mb-4">{filtered.length} API keys</div>
      <div className="space-y-1">
        {filtered.map((k, i) => (
          <div key={i} className="p-3 rounded-lg border flex items-center justify-between" style={{ backgroundColor: '#111118', borderColor: '#1a1a2e' }}>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono font-bold text-green-400">{k.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-600 truncate max-w-[200px]">{k.masked_value}</span>
              {k.length && <span className="text-xs text-gray-700">{k.length}ch</span>}
              <button onClick={() => navigator.clipboard.writeText(k.name)} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-500 hover:text-white">Copy Name</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Backups Tab ───

function BackupsTab({ masterPassword }: { masterPassword: string }) {
  const [backups, setBackups] = useState<VaultBackup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vaultBackups(masterPassword).then(d => { setBackups(d.backups); setLoading(false); }).catch(() => setLoading(false));
  }, [masterPassword]);

  if (loading) return <Loader />;

  const formatSize = (b: number) => {
    if (b > 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
    if (b > 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${b} B`;
  };

  return (
    <div>
      <div className="text-xs text-gray-500 mb-4">{backups.length} backup files</div>
      <div className="space-y-1">
        {backups.map((b, i) => (
          <div key={i} className="p-3 rounded-lg border flex items-center justify-between" style={{ backgroundColor: '#111118', borderColor: '#1a1a2e' }}>
            <div className="text-xs font-mono text-white truncate flex-1">{b.key.replace('SECURE_VAULT/', '')}</div>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
              <span>{formatSize(b.size)}</span>
              <span>{b.uploaded ? new Date(b.uploaded).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Tab ───

function StatsTab({ masterPassword }: { masterPassword: string }) {
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vaultStats(masterPassword).then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, [masterPassword]);

  if (loading) return <Loader />;
  if (!stats) return <div className="text-gray-500 text-sm">Failed to load stats</div>;

  const statCards = [
    { label: 'Total Credentials', value: stats.total_credentials, color: '#00ff88' },
    { label: 'Backups', value: stats.total_backups, color: '#00aaff' },
    { label: 'Storage', value: `${stats.storage_used_mb} MB`, color: '#ff88ff' },
    { label: 'Last Sync', value: stats.last_sync ? new Date(stats.last_sync).toLocaleString() : '—', color: '#ffaa00' },
  ];

  return (
    <div data-tutorial="dvault-pricing">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="p-5 rounded-xl border text-center" style={{ backgroundColor: '#111118', borderColor: '#1a1a2e' }}>
            <div className="text-2xl font-extrabold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {stats.strength_distribution && (
        <div>
          <h3 className="text-sm font-bold text-white mb-4">Password Strength Distribution</h3>
          <div className="flex gap-2">
            {Object.entries(stats.strength_distribution).map(([level, count]) => {
              const colors: Record<string, string> = { weak: '#ff4444', fair: '#ffaa00', good: '#88ff00', strong: '#00ff88', excellent: '#00ffff' };
              const total = Object.values(stats.strength_distribution).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? (count / total * 100) : 0;
              return (
                <div key={level} className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: '#111118' }}>
                  <div className="text-lg font-bold font-mono" style={{ color: colors[level] || '#fff' }}>{count}</div>
                  <div className="text-xs text-gray-500 capitalize">{level}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: colors[level] || '#fff' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Audit Tab ───

function AuditTab({ masterPassword }: { masterPassword: string }) {
  const [entries, setEntries] = useState<VaultAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vaultAudit(masterPassword).then(d => { setEntries(d.entries); setLoading(false); }).catch(() => setLoading(false));
  }, [masterPassword]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="text-xs text-gray-500 mb-4">{entries.length} audit entries (current session)</div>
      <div className="space-y-1">
        {entries.map((e, i) => (
          <div key={i} className="p-3 rounded-lg border flex items-center gap-4" style={{ backgroundColor: '#111118', borderColor: '#1a1a2e' }}>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{
              backgroundColor: e.action.includes('reveal') ? '#ff444420' : '#00ff8820',
              color: e.action.includes('reveal') ? '#ff4444' : '#00ff88',
            }}>{e.action}</span>
            <span className="text-xs font-mono text-gray-400 flex-1 truncate">{e.service}</span>
            <span className="text-xs font-mono text-gray-600">{e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : ''}</span>
            <span className="text-xs font-mono text-gray-700">{e.ip}</span>
          </div>
        ))}
      </div>
      {entries.length === 0 && <div className="text-sm text-gray-600 text-center py-8">No audit entries yet</div>}
    </div>
  );
}

// ─── Loader ───

function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#00ff88', borderTopColor: 'transparent' }} />
    </div>
  );
}
