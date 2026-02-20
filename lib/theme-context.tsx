'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ept-theme');
    if (stored === 'dark' || stored === 'light') {
      setIsDark(stored === 'dark');
    } else {
      const h = new Date().getHours();
      setIsDark(h < 6 || h >= 18);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark(d => {
      const next = !d;
      localStorage.setItem('ept-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
