'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../../lib/theme-context';
import { useAuth } from '../../../lib/auth-context';
import { API, BG_DARK, BG_CARD, BG_CARD2, BORDER, HAIR, ACCENT, GOLD, GOLD_BRIGHT, IVORY, MUTED, NAV_ITEMS } from './lib/constants';
import { createUser, getStats, startCheckout, type ConsentCaptureScope, type VaultStats } from './lib/vault-api';
import VaultIcon from './components/VaultIcon';

const PLAN_SLUGS = ['keeper', 'legacy', 'dynasty'];
import DashboardPanel from './components/DashboardPanel';
import InterviewPanel from './components/InterviewPanel';
import ChatPanel from './components/ChatPanel';
import AncestorChatPanel from './components/AncestorChatPanel';
import RecordPanel from './components/RecordPanel';
import VoicePanel from './components/VoicePanel';
import MemoriesPanel from './components/MemoriesPanel';
import ProgressPanel from './components/ProgressPanel';
import BriefingPanel from './components/BriefingPanel';
import FamilyPanel from './components/FamilyPanel';
import BloodlinePanel from './components/BloodlinePanel';
import FaceTimePanel from './components/FaceTimePanel';
import SettingsPanel from './components/SettingsPanel';
import PersonalityPanel from './components/PersonalityPanel';
import FairySprite from './components/FairySprite';
import EchoChatWidget from './components/EchoChatWidget';
import ConsentGate from './components/ConsentGate';

/* ─── Onboarding Modal ───────────────────────────────────────────────── */

function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const slides = [
    { icon: 'crystal', title: 'Welcome to Your Immortality Vault', text: 'Preserve your memories, voice, and wisdom for future generations. Your digital legacy starts here.' },
    { icon: 'interview', title: 'Tell Your Story', text: 'Answer interview questions across 12 life categories. Each answer enriches your digital consciousness.' },
    { icon: 'voice', title: 'Clone Your Voice', text: 'Record 10 voice prompts and we\'ll create an AI voice clone. Your loved ones will hear your actual voice.' },
  ];
  const slide = slides[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl text-center" style={{ background: `radial-gradient(120% 90% at 50% 0%, ${BG_CARD2}, ${BG_CARD})`, border: `1px solid ${BORDER}`, boxShadow: `0 24px 70px -20px rgba(0,0,0,0.8), 0 0 40px -24px ${ACCENT}` }}>
        <div className="mb-5 flex justify-center">
          <span className="flex items-center justify-center rounded-full" style={{ width: 74, height: 74, color: ACCENT, background: 'rgba(245,196,81,0.08)', border: `1px solid ${BORDER}`, boxShadow: `0 0 34px -10px ${ACCENT}` }}>
            <VaultIcon name={slide.icon} size={34} />
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: IVORY }}>{slide.title}</h3>
        <p className="text-sm mb-6" style={{ color: MUTED, lineHeight: 1.6 }}>{slide.text}</p>
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div key={i} className="rounded-full transition-all" style={{ width: i === step ? 20 : 8, height: 8, background: i === step ? ACCENT : 'rgba(245,196,81,0.2)' }} />
          ))}
        </div>
        <button
          onClick={() => (step < slides.length - 1 ? setStep(step + 1) : onComplete())}
          className="px-7 py-2.5 rounded-full text-sm font-semibold transition hover:brightness-110"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a', boxShadow: `0 8px 26px -10px ${ACCENT}` }}
        >
          {step < slides.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}

/* ─── Main App Page ───────────────────────────────────────────────────── */

export default function VaultAppPage() {
  const { isDark } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activePanel, setActivePanel] = useState('dashboard');
  const [vaultProfileState, setVaultProfileState] = useState<{ userId: string; status: 'ready' | 'error' } | null>(null);
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // Redirect if not logged in — preserve a ?plan so checkout resumes after login.
  useEffect(() => {
    if (!authLoading && !user) {
      const plan = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plan') : null;
      const back = '/immortality-vault/app' + (plan ? `?plan=${plan}` : '');
      router.push(`/immortality-vault/login?redirect=${encodeURIComponent(back)}`);
    }
  }, [user, authLoading, router]);

  // If we arrived with ?plan (from the landing pricing), open checkout for the
  // logged-in buyer and redirect to the secure checkout URL.
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    const plan = new URLSearchParams(window.location.search).get('plan');
    if (!plan || !PLAN_SLUGS.includes(plan)) return;
    setCheckingOut(true);
    const origin = window.location.origin;
    startCheckout(plan, user.email || '',
      `${origin}/immortality-vault/app?welcome=1`,
      `${origin}/immortality-vault#pricing`)
      .then(r => { if (r?.url) { window.location.href = r.url; } else { setCheckingOut(false); } })
      .catch(() => setCheckingOut(false));
  }, [user]);

  // Create or get vault user + load stats
  useEffect(() => {
    if (!user) {
      setVaultProfileState(null);
      return;
    }
    let cancelled = false;
    const userId = user.uid;
    setVaultProfileState(null);

    createUser(userId, user.displayName || user.email || 'User', user.email || '')
      .then(() => { if (!cancelled) setVaultProfileState({ userId, status: 'ready' }); })
      .catch(() => { if (!cancelled) setVaultProfileState({ userId, status: 'error' }); });
    getStats().then(setStats).catch(() => {});

    // Check onboarding
    if (typeof window !== 'undefined' && !localStorage.getItem('vault_onboarded')) {
      setShowOnboarding(true);
    }

    return () => { cancelled = true; };
  }, [user]);

  const handleNavigate = (panel: string) => {
    setActivePanel(panel);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const completeOnboarding = () => {
    if (typeof window !== 'undefined') localStorage.setItem('vault_onboarded', '1');
    setShowOnboarding(false);
  };

  if (authLoading || !user || checkingOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: BG_DARK }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid #d4b48355', borderTopColor: '#d4b483' }} />
        {checkingOut && <div style={{ color: '#d4b483', fontSize: 15, letterSpacing: '0.02em' }}>Taking you to secure checkout…</div>}
      </div>
    );
  }

  const vaultUserId = user.uid;
  const vaultProfileStatus = vaultProfileState?.userId === vaultUserId ? vaultProfileState.status : 'loading';

  const renderPanel = () => {
    const gateCapture = (mediaScope: ConsentCaptureScope, panel: ReactNode) => (
      <ConsentGate
        key={`${vaultUserId}:${mediaScope}`}
        userId={vaultUserId}
        mediaScope={mediaScope}
        consenterName={user.displayName || user.email || 'User'}
        consenterEmail={user.email || ''}
        profileStatus={vaultProfileStatus}
      >
        {panel}
      </ConsentGate>
    );
    switch (activePanel) {
      case 'dashboard': return <DashboardPanel userId={vaultUserId} stats={stats} onNavigate={handleNavigate} />;
      case 'interview': return gateCapture('any', <InterviewPanel userId={vaultUserId} />);
      case 'chat': return <ChatPanel userId={vaultUserId} />;
      case 'ancestor': return <AncestorChatPanel userId={vaultUserId} />;
      case 'record': return gateCapture('any', <RecordPanel userId={vaultUserId} />);
      case 'voice': return gateCapture('voice', <VoicePanel userId={vaultUserId} />);
      case 'memories': return <MemoriesPanel userId={vaultUserId} />;
      case 'progress': return <ProgressPanel userId={vaultUserId} onNavigate={handleNavigate} />;
      case 'personality': return <PersonalityPanel userId={vaultUserId} />;
      case 'briefing': return <BriefingPanel userId={vaultUserId} onNavigate={handleNavigate} />;
      case 'family': return <FamilyPanel userId={vaultUserId} />;
      case 'bloodline': return <BloodlinePanel userId={vaultUserId} />;
      case 'facetime': return <FaceTimePanel userId={vaultUserId} onNavigate={handleNavigate} />;
      case 'settings': return <SettingsPanel userId={vaultUserId} userEmail={user.email || ''} />;
      default: return <DashboardPanel userId={vaultUserId} stats={stats} onNavigate={handleNavigate} />;
    }
  };

  const activeNav = NAV_ITEMS.find(n => n.id === activePanel);

  return (
    <div className="min-h-screen flex" style={{ background: BG_DARK, color: IVORY }}>
      {/* Golden sprite from the intro film, drifting across now and then */}
      <FairySprite />

      {/* Echo Prime AI — the floating Sentinel-Chat guide, on every panel */}
      <EchoChatWidget />

      {/* Onboarding */}
      {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-60' : 'w-0 md:w-16'} overflow-hidden`}
        style={{ background: `linear-gradient(180deg, ${BG_CARD2}, ${BG_CARD})`, borderRight: `1px solid ${BORDER}` }}
      >
        <div className="px-4 h-14 flex items-center gap-2.5 border-b" style={{ borderColor: HAIR }}>
          <Link href="/immortality-vault" className="flex items-center gap-2.5">
            <Image src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="Immortality Vault" width={24} height={24} />
            {sidebarOpen && <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: IVORY, letterSpacing: '0.02em' }}>Immortality&nbsp;Vault</span>}
          </Link>
        </div>
        <nav className="p-2.5 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 108px)' }}>
          {NAV_ITEMS.map(item => {
            const active = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  background: active ? 'rgba(245,196,81,0.10)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(245,196,81,0.28)' : 'transparent'}`,
                  color: active ? ACCENT : MUTED,
                  fontWeight: active ? 600 : 500,
                }}
                title={item.label}
              >
                <span className="flex-shrink-0 flex items-center transition-colors" style={{ color: active ? ACCENT : MUTED }}>
                  <VaultIcon name={item.icon} size={19} strokeWidth={active ? 1.7 : 1.5} />
                </span>
                {sidebarOpen && <span className="whitespace-nowrap truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-[11px] text-center truncate" style={{ color: 'rgba(169,158,139,0.6)' }}>
              {user.email}
            </div>
          </div>
        )}
      </aside>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <main className="flex-1 min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 backdrop-blur-lg border-b px-4 md:px-6 h-14 flex items-center justify-between" style={{ background: `${BG_DARK}cc`, borderColor: HAIR }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="transition-colors" style={{ color: MUTED }} aria-label="Toggle menu">
            <VaultIcon name={sidebarOpen ? 'close' : 'menu'} size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: IVORY }}>
            <span style={{ color: ACCENT, display: 'flex' }}><VaultIcon name={activeNav?.icon || 'spark'} size={17} /></span>
            {activeNav?.label}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/immortality-vault" className="text-xs transition-colors hover:brightness-125" style={{ color: MUTED }}>
              &larr; Product Page
            </Link>
          </div>
        </header>

        {/* Panel Content */}
        <div className="p-4 md:p-8 max-w-5xl">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
