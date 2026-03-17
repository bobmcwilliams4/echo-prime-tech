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
  signOut: () => Promise<void>;
}

const TRUST_LEVELS: Record<string, { level: number; title: string }> = {
  owner: { level: 11, title: 'Sovereign Architect' },
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, role: null, displayName: null, trustLevel: null, subscriptions: [], signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EPTUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'owner' | 'user' | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [trustLevel, setTrustLevel] = useState<{ level: number; title: string } | null>(null);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    handleRedirectResult().catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        try {
          const sync = await syncUser();
          const userRole = sync.role as 'owner' | 'user';
          setRole(userRole);
          setSubscriptions(sync.subscriptions || []);
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
          setRole('user');
          setDisplayName(u.displayName || null);
        }
      } else {
        setRole(null);
        setDisplayName(null);
        setTrustLevel(null);
        setSubscriptions([]);
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
  };

  return <AuthContext.Provider value={{ user, loading, role, displayName, trustLevel, subscriptions, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
