'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { EPTUser, onAuthChange, signOut as fbSignOut, handleRedirectResult } from './firebase';
import { syncUser, getProfile } from './ept-api';

interface AuthContextType {
  user: EPTUser | null;
  loading: boolean;
  role: 'owner' | 'user' | null;
  displayName: string | null;
  trustLevel: { level: number; title: string } | null;
  subscriptions: string[];
  grants: Record<string, string>;
  signOut: () => Promise<void>;
}

const TRUST_LEVELS: Record<string, { level: number; title: string }> = {
  owner: { level: 11, title: 'Sovereign Architect' },
};

// Commander accounts: full owner access to every EPT service, unconditionally
// (Commander directive 2026-07-02). Enforced client-side so it holds even when
// the ept-api sync call fails or the backend loses its owner mapping.
const SOVEREIGN_EMAILS = ['bmcii1976@gmail.com'];
const isSovereign = (email?: string | null) =>
  !!email && SOVEREIGN_EMAILS.includes(email.toLowerCase());

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, role: null, displayName: null, trustLevel: null, subscriptions: [], grants: {}, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EPTUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'owner' | 'user' | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [trustLevel, setTrustLevel] = useState<{ level: number; title: string } | null>(null);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [grants, setGrants] = useState<Record<string, string>>({});

  useEffect(() => {
    handleRedirectResult().catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        // The Immortality Vault is a standalone product: it provisions its own
        // users via vault-api and never uses EPT roles/subscriptions. Skip the
        // EPT `user/sync` call there entirely — it hits a retired worker
        // (ept-api…workers.dev → 500 + CORS) and only added console noise.
        const onVaultRoute = typeof window !== 'undefined'
          && window.location.pathname.startsWith('/immortality-vault');
        if (onVaultRoute) {
          const vaultRole = isSovereign(u.email) ? 'owner' : 'user';
          setRole(vaultRole);
          setTrustLevel(TRUST_LEVELS[vaultRole] || null);
          setDisplayName(u.displayName || null);
          setLoading(false);
          return;
        }
        try {
          const sync = await syncUser();
          const userRole = isSovereign(u.email) ? 'owner' : (sync.role as 'owner' | 'user');
          setRole(userRole);
          setSubscriptions(sync.subscriptions || []);
          setGrants(sync.grants || {});
          setTrustLevel(TRUST_LEVELS[userRole] || null);
          // Fetch display_name from profile API (backend stores edited names)
          try {
            const profile = await getProfile();
            if (profile.display_name) {
              setDisplayName(profile.display_name);
            } else {
              setDisplayName(u.displayName || null);
            }
          } catch {
            setDisplayName(u.displayName || null);
          }
        } catch {
          const fallbackRole = isSovereign(u.email) ? 'owner' : 'user';
          setRole(fallbackRole);
          setTrustLevel(TRUST_LEVELS[fallbackRole] || null);
          setDisplayName(u.displayName || null);
        }
      } else {
        setRole(null);
        setDisplayName(null);
        setTrustLevel(null);
        setSubscriptions([]);
        setGrants({});
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signOut = async () => {
    await fbSignOut();
    setUser(null);
    setRole(null);
    setDisplayName(null);
    setTrustLevel(null);
    setSubscriptions([]);
    setGrants({});
  };

  return <AuthContext.Provider value={{ user, loading, role, displayName, trustLevel, subscriptions, grants, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
