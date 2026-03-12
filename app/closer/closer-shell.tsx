'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { chatWithEcho, submitBugReport } from '../../lib/closer-api';
import CloserTutorialPanel from '../../components/closer-tutorial-panel';
import { GuidedTutorialProvider } from '../../lib/guided-tutorial-context';
import GuidedOverlay from '../../components/guided-overlay';

/* ── Service Health Monitor ── */

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'checking';
  latency?: number;
}

const ECHO_CHAT_URL = 'https://echo-chat.bmcii1976.workers.dev';

function useServiceStatus(interval = 60000) {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'AI Chat', status: 'checking' },
    { name: 'Memory Cortex', status: 'checking' },
    { name: 'Voice AI', status: 'checking' },
  ]);

  const checkServices = useCallback(async () => {
    const results: ServiceStatus[] = [];

    // Check AI Chat (echo-chat worker /health)
    try {
      const t0 = Date.now();
      const res = await fetch(`${ECHO_CHAT_URL}/health`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        results.push({ name: 'AI Chat', status: data.status === 'healthy' ? 'online' : 'offline', latency: Date.now() - t0 });
      } else {
        results.push({ name: 'AI Chat', status: 'offline' });
      }
    } catch {
      results.push({ name: 'AI Chat', status: 'offline' });
    }

    // Check Memory Cortex (via echo-chat /cortex/status)
    try {
      const t0 = Date.now();
      const res = await fetch(`${ECHO_CHAT_URL}/cortex/status`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        const onlineCount = (data.cortex || []).filter((s: any) => s.status === 'up').length;
        results.push({ name: 'Memory Cortex', status: onlineCount > 0 ? 'online' : 'offline', latency: Date.now() - t0 });
      } else {
        results.push({ name: 'Memory Cortex', status: 'offline' });
      }
    } catch {
      results.push({ name: 'Memory Cortex', status: 'offline' });
    }

    // Check Voice AI (Echo Speak Cloud worker)
    try {
      const t0 = Date.now();
      const res = await fetch('https://echo-speak-cloud.bmcii1976.workers.dev/health', { signal: AbortSignal.timeout(8000) });
      results.push({ name: 'Voice AI', status: res.ok ? 'online' : 'offline', latency: Date.now() - t0 });
    } catch {
      results.push({ name: 'Voice AI', status: 'offline' });
    }

    setServices(results);
  }, []);

  useEffect(() => {
    checkServices();
    const id = setInterval(checkServices, interval);
    return () => clearInterval(id);
  }, [checkServices, interval]);

  return services;
}

/* ── Status Dot Component ── */

function StatusDot({ status, pulse }: { status: 'online' | 'offline' | 'checking'; pulse?: boolean }) {
  const color = status === 'online' ? '#10b981' : status === 'offline' ? '#ef4444' : '#f59e0b';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
      {pulse && status === 'online' && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: color, opacity: 0.4,
          animation: 'statusPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        }} />
      )}
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'block' }} />
    </span>
  );
}

const NAV_ITEMS = [
  { href: '/closer', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard', exact: true },
  { href: '/closer/leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Leads' },
  { href: '/closer/calls', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Calls' },
  { href: '/closer/calls/live', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z', label: 'Live Calls' },
  { href: '/closer/campaigns', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', label: 'Campaigns' },
  { href: '/closer/scripts', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Scripts' },
  { href: '/closer/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Appointments' },
  { href: '/closer/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Analytics' },
  { href: '/closer/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
  { href: '/closer/tutorial', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Tutorial' },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function CloserShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const services = useServiceStatus(60000);

  // Public paths that don't require auth — render children directly without shell
  const PUBLIC_PATHS = ['/closer', '/closer/tutorial', '/closer/demo'];
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicPath) router.push('/login');
  }, [user, loading, router, pathname, isPublicPath]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // For public pages when not authenticated, render children directly (no sidebar/header)
  if (!loading && !user && isPublicPath) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const currentPage = NAV_ITEMS.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href) && n.href !== '/closer') || NAV_ITEMS[0];

  return (
    <GuidedTutorialProvider>
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className="relative z-30 flex flex-col border-r transition-all duration-200 ease-out"
        style={{ width: sidebarOpen ? 220 : 64, borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
      >
        <div className="flex items-center justify-center border-b" style={{ height: 64, borderColor: 'var(--ept-border)' }}>
          <Link href="/" title="Back to Dashboard">
            <img src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="EPT" style={{ height: sidebarOpen ? 40 : 32, width: 'auto', transition: 'height 0.2s ease' }} />
          </Link>
        </div>
        <Link href="/dashboard" title={!sidebarOpen ? 'Back to Dashboard' : undefined} className="flex items-center gap-3 mx-2 mt-2 mb-1 rounded-xl text-sm transition-all duration-150" style={{ padding: '8px 12px', color: 'var(--ept-text-muted)', backgroundColor: 'transparent' }}>
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="truncate transition-all duration-200 whitespace-nowrap" style={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0, overflow: 'hidden', fontSize: 12 }}>Main Dashboard</span>
        </Link>
        <div className="mx-3 my-1" style={{ height: 1, backgroundColor: 'var(--ept-border)' }} />
        <nav className="flex-1 py-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== '/closer';
            return (
              <Link key={item.href} href={item.href} title={!sidebarOpen ? item.label : undefined} className="flex items-center gap-3 mx-2 my-0.5 rounded-xl text-sm transition-all duration-150" style={{ padding: '10px 12px', color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)', backgroundColor: active ? 'var(--ept-accent-glow)' : 'transparent', fontWeight: active ? 600 : 400 }}>
                <NavIcon d={item.icon} />
                <span className="truncate transition-all duration-200" style={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0, overflow: 'hidden' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t py-3 px-3" style={{ borderColor: 'var(--ept-border)' }}>
          {sidebarOpen ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] uppercase tracking-[0.12em]" style={{ color: 'var(--ept-text-muted)' }}>Powered by</p>
              <p className="gradient-text text-[11px] font-semibold tracking-wider whitespace-nowrap">ECHO PRIME TECHNOLOGIES</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <img src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="EPT" style={{ height: 18, width: 'auto', opacity: 0.4 }} />
            </div>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 border-b" style={{ height: 64, borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <div className="flex items-center gap-4">
            <Link href="/"><img src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" style={{ height: 32, width: 'auto' }} /></Link>
            <div style={{ width: 1, height: 24, backgroundColor: 'var(--ept-border)' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ept-text-muted)' }}>AI Sales Agent</h1>
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>{currentPage.label}</span>
            <div style={{ width: 1, height: 20, backgroundColor: 'var(--ept-border)' }} />
            <div className="flex items-center gap-3">
              {services.map(svc => (
                <div key={svc.name} className="flex items-center gap-1.5" title={svc.latency ? `${svc.name}: ${svc.latency}ms` : svc.name}>
                  <StatusDot status={svc.status} pulse={svc.status === 'online'} />
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{
                    color: svc.status === 'online' ? '#10b981' : svc.status === 'offline' ? '#ef4444' : '#f59e0b',
                  }}>
                    {svc.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all hover:opacity-70" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }} title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}>
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="var(--ept-accent)" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="var(--ept-accent)" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
            <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-lg border" style={{ borderColor: 'var(--ept-border)' }} />
            ) : (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <button onClick={handleSignOut} className="text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-opacity hover:opacity-70" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Sign Out</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      {/* Echo Prime AI Copilot Widget */}
      <EchoPrimeCopilot />
      {/* Tutorial Side Panel — floating ? button on all authenticated pages */}
      <CloserTutorialPanel />
      {/* Guided Tutorial Overlay — spotlight + tooltip + click-blocking */}
      <GuidedOverlay />

      <style>{`
        @keyframes statusPing {
          0% { transform: scale(1); opacity: 0.4; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes echoBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
    </GuidedTutorialProvider>
  );
}

/* ── Echo Prime AI Copilot Floating Widget ── */

interface EchoMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function EchoPrimeCopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<EchoMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    setLoading(true);
    try {
      const data: any = await chatWithEcho(text);
      const reply = data?.response || data?.message || data?.content || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
      // Bug report escalation detection
      const escalationPhrases = /\b(report|escalat|technical team|filed a bug|bug report|support ticket|engineering team)\b/i;
      if (escalationPhrases.test(reply)) {
        submitBugReport(text, reply).catch(() => {});
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}`, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Echo Prime AI"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 50,
          width: 52, height: 52, borderRadius: 16,
          backgroundColor: 'var(--ept-accent)', color: '#fff',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.35)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; }}
      >
        EP
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 50,
        width: 380, maxHeight: 520,
        borderRadius: 16, overflow: 'hidden',
        border: '1px solid var(--ept-border)',
        backgroundColor: 'var(--ept-card-bg)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--ept-border)',
        backgroundColor: 'var(--ept-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            backgroundColor: 'var(--ept-accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
          }}>EP</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ept-text)' }}>Echo Prime</div>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Sales Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', color: 'var(--ept-text-muted)', cursor: 'pointer', padding: 4 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 12, minHeight: 300, maxHeight: 360 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>&#9889;</div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-secondary)', marginBottom: 4 }}>Echo Prime AI</p>
            <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', lineHeight: 1.6 }}>
              Your AI-powered sales intelligence. Ask about leads, scripts, call strategies, objection handling, or anything CRM.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '8px 12px', borderRadius: 12,
              fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap',
              backgroundColor: msg.role === 'user' ? 'var(--ept-accent)' : 'var(--ept-surface)',
              color: msg.role === 'user' ? '#fff' : 'var(--ept-text)',
              border: msg.role === 'assistant' ? '1px solid var(--ept-border)' : 'none',
            }}>
              {msg.content}
            </div>
            <span style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 2, padding: '0 4px' }}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: 'var(--ept-accent)', opacity: 0.6,
                animation: `echoBounce 1s ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px', borderTop: '1px solid var(--ept-border)',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask Echo Prime anything..."
          style={{
            flex: 1, padding: '8px 12px', fontSize: 12,
            color: 'var(--ept-text)', backgroundColor: 'var(--ept-surface)',
            border: '1px solid var(--ept-border)', borderRadius: 10,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 34, height: 34, borderRadius: 10, border: 'none',
            backgroundColor: 'var(--ept-accent)', color: '#fff',
            cursor: loading || !input.trim() ? 'default' : 'pointer',
            opacity: loading || !input.trim() ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.15s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  );
}
