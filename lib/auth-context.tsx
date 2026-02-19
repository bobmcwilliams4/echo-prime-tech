'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { EPTUser, onAuthChange, signOut as fbSignOut } from './firebase';
import { syncUser } from './ept-api';

interface AuthContextType {
  user: EPTUser | null;
  loading: boolean;
  role: 'owner' | 'user' | null;
  subscriptions: string[];
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, role: null, subscriptions: [], signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EPTUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'owner' | 'user' | null>(null);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        try {
          const sync = await syncUser();
          setRole(sync.role as 'owner' | 'user');
          setSubscriptions(sync.subscriptions || []);
        } catch {
          setRole(u.email === 'bmcii1976@gmail.com' ? 'owner' : 'user');
        }
      } else {
        setRole(null);
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
    setSubscriptions([]);
  };

  return <AuthContext.Provider value={{ user, loading, role, subscriptions, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
