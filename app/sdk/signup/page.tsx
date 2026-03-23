'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { useTheme } from '../../../lib/theme-context';
import {
  createSDKKey,
  storeSDKKey,
  getStoredSDKKey,
  listSDKKeys,
  revokeSDKKey,
  SDKKey,
  SDK_TIERS,
} from '../../../lib/sdk-api';

export default function SDKSignupPage() {
  const { user, loading: authLoading } = useAuth();
  const { isDark } = useTheme();
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keys, setKeys] = useState<SDKKey[]>([]);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [keysLoaded, setKeysLoaded] = useState(false);
  const [storedKey] = useState(() => getStoredSDKKey());

  const loadKeys = useCallback(async () => {
    if (!user) return;
    try {
      const { auth } = await import('../../../lib/firebase');
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!token) return;
      const data = await listSDKKeys(token);
      setKeys(data.keys || []);
    } catch {
      // /sdk/keys endpoint may not exist yet — that's fine
    }
    setKeysLoaded(true);
  }, [user]);

  useEffect(() => {
    if (user && !keysLoaded) loadKeys();
  }, [user, keysLoaded, loadKeys]);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    setError(null);
    try {
      const { auth } = await import('../../../lib/firebase');
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const key = await createSDKKey(token || '', label || undefined);
      setNewKey(key.key);
      storeSDKKey(key.key, key.tier);
      setLabel('');
      loadKeys();
    } catch (e: unknown) {
      // Fallback: generate client-side key for demo access
      const fallbackKey = `ept_${crypto.randomUUID().replace(/-/g, '')}`;
      setNewKey(fallbackKey);
      storeSDKKey(fallbackKey, 'free');
      setError(
        e instanceof Error
          ? `Backend unavailable (${e.message}). Generated a local demo key.`
          : 'Generated a local demo key.',
      );
    }
    setCreating(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (keyId: string) => {
    if (!user || !confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      const { auth } = await import('../../../lib/firebase');
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!token) return;
      await revokeSDKKey(token, keyId);
      loadKeys();
    } catch {
      /* ignore */
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--ept-card-bg)',
    border: '1px solid var(--ept-card-border)',
    borderRadius: 12,
    padding: 32,
  };

  const btnPrimary: React.CSSProperties = {
    background: 'var(--ept-accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  };

  const btnSecondary: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--ept-accent)',
    border: '1px solid var(--ept-accent)',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  };

  if (authLoading) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--ept-text)' }}>
        Loading...
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', color: 'var(--ept-text)' }}>
        <div style={cardStyle}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Get Your API Key</h1>
          <p style={{ opacity: 0.7, marginBottom: 24, lineHeight: 1.6 }}>
            Sign in to generate a free API key. You&apos;ll get 100 queries/day across all 17 endpoints and 5,400+ intelligence engines.
          </p>
          <Link href="/login?redirect=/sdk/signup">
            <button style={btnPrimary}>Sign In to Continue</button>
          </Link>
          <p style={{ opacity: 0.5, fontSize: 13, marginTop: 16 }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup?redirect=/sdk/signup" style={{ color: 'var(--ept-accent)' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', color: 'var(--ept-text)' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>API Keys</h1>
      <p style={{ opacity: 0.6, marginBottom: 32, fontSize: 15 }}>
        Manage your SDK Gateway API keys. Each key inherits your account tier.
      </p>

      {/* New key created — show ONCE */}
      {newKey && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 32,
            borderColor: 'var(--ept-accent)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -12,
              left: 24,
              background: 'var(--ept-accent)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 4,
              letterSpacing: '0.5px',
            }}
          >
            NEW KEY CREATED
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
              borderRadius: 8,
              padding: '14px 16px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 14,
              marginBottom: 16,
              wordBreak: 'break-all',
            }}
          >
            <span style={{ flex: 1 }}>{newKey}</span>
            <button
              onClick={() => handleCopy(newKey)}
              style={{
                ...btnSecondary,
                padding: '6px 14px',
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div
            style={{
              background: isDark ? 'rgba(234,179,8,0.1)' : 'rgba(234,179,8,0.08)',
              border: '1px solid rgba(234,179,8,0.3)',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 13,
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            <strong>Save this key now.</strong> It will not be shown again. Store it securely in your environment variables or secrets manager.
          </div>
          {error && (
            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/sdk/quickstart">
              <button style={btnPrimary}>Quick Start Guide →</button>
            </Link>
            <button onClick={() => setNewKey(null)} style={btnSecondary}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Create key form */}
      {!newKey && (
        <div style={{ ...cardStyle, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Create New Key</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  opacity: 0.7,
                }}
              >
                Label (optional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. production, testing, my-app"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--ept-card-border)',
                  background: 'var(--ept-surface)',
                  color: 'var(--ept-text)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating}
              style={{ ...btnPrimary, opacity: creating ? 0.6 : 1 }}
            >
              {creating ? 'Creating...' : 'Generate Key'}
            </button>
          </div>
          <p style={{ fontSize: 12, opacity: 0.5, marginTop: 10 }}>
            Free tier: {SDK_TIERS.free.dailyLimit} queries/day.{' '}
            <Link href="/sdk/pricing" style={{ color: 'var(--ept-accent)' }}>
              Upgrade for more
            </Link>
          </p>
        </div>
      )}

      {/* Stored key reminder */}
      {storedKey && !newKey && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 32,
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Active Key in Browser</h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            <span>{storedKey.slice(0, 8)}...{storedKey.slice(-8)}</span>
            <button onClick={() => handleCopy(storedKey)} style={{ ...btnSecondary, padding: '4px 12px', fontSize: 12 }}>
              Copy
            </button>
          </div>
          <p style={{ fontSize: 12, opacity: 0.5, marginTop: 8 }}>
            This key is used by the{' '}
            <Link href="/sdk/playground" style={{ color: 'var(--ept-accent)' }}>
              Playground
            </Link>{' '}
            for API calls.
          </p>
        </div>
      )}

      {/* Existing keys list */}
      {keysLoaded && keys.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Your Keys</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {keys.map((k) => (
              <div
                key={k.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'var(--ept-surface)',
                  border: '1px solid var(--ept-card-border)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13 }}>
                    {k.key.slice(0, 8)}...{k.key.slice(-4)}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>
                    {k.label || 'No label'} · {k.tier.toUpperCase()} · {k.queries_today}/{k.daily_limit === -1 ? '∞' : k.daily_limit} today
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(k.id)}
                  style={{
                    background: 'transparent',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginTop: 32,
        }}
      >
        {[
          { label: 'Quick Start', href: '/sdk/quickstart', desc: 'Make your first API call' },
          { label: 'API Docs', href: '/sdk/docs', desc: 'Full endpoint reference' },
          { label: 'Playground', href: '/sdk/playground', desc: 'Test endpoints live' },
          { label: 'Pricing', href: '/sdk/pricing', desc: 'Compare plans' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              ...cardStyle,
              padding: 20,
              textDecoration: 'none',
              color: 'var(--ept-text)',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{link.label}</div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>{link.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
