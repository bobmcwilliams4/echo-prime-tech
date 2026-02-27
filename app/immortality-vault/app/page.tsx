'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../../lib/theme-context';
import { useAuth } from '../../../lib/auth-context';
import { API, BG_DARK, BG_CARD, BORDER, NAV_ITEMS } from './lib/constants';
import { createUser, getStats, type VaultStats } from './lib/vault-api';
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
import FaceTimePanel from './components/FaceTimePanel';
import SettingsPanel from './components/SettingsPanel';

/* ─── Onboarding Modal ───────────────────────────────────────────────── */

function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const slides = [
    { icon: '\u{1F3DB}\u{FE0F}', title: 'Welcome to Your Immortality Vault', text: 'Preserve your memories, voice, and wisdom for future generations. Your digital legacy starts here.' },
    { icon: '\u{1F399}\u{FE0F}', title: 'Tell Your Story', text: 'Answer interview questions across 12 life categories. Each answer enriches your digital consciousness.' },
    { icon: '\u{1F3A4}', title: 'Clone Your Voice', text: 'Record 10 voice prompts and we\'ll create an AI voice clone. Your loved ones will hear your actual voice.' },
  ];
  const slide = slides[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-5xl mb-4">{slide.icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{slide.title}</h3>
        <p className="text-sm text-gray-400 mb-6">{slide.text}</p>
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: i === step ? '#c084fc' : '#2a2a3a' }} />
          ))}
        </div>
        {step < slides.length - 1 ? (
          <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #c084fc)' }}>
            Next
          </button>
        ) : (
          <button onClick={onComplete} className="px-6 py-2.5 rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #c084fc)' }}>
            Get Started
          </button>
        )}
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
  const [vaultUserId, setVaultUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/immortality-vault');
    }
  }, [user, authLoading, router]);

  // Create or get vault user + load stats
  useEffect(() => {
    if (!user) return;
    const userId = user.uid;
    setVaultUserId(userId);

    createUser(userId, user.displayName || user.email || 'User', user.email || '').catch(() => {});
    getStats().then(setStats).catch(() => {});

    // Check onboarding
    if (typeof window !== 'undefined' && !localStorage.getItem('vault_onboarded')) {
      setShowOnboarding(true);
    }
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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG_DARK }}>
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const renderPanel = () => {
    if (!vaultUserId) return null;
    switch (activePanel) {
      case 'dashboard': return <DashboardPanel userId={vaultUserId} stats={stats} onNavigate={handleNavigate} />;
      case 'interview': return <InterviewPanel userId={vaultUserId} />;
      case 'chat': return <ChatPanel userId={vaultUserId} />;
      case 'ancestor': return <AncestorChatPanel userId={vaultUserId} />;
      case 'record': return <RecordPanel userId={vaultUserId} />;
      case 'voice': return <VoicePanel userId={vaultUserId} />;
      case 'memories': return <MemoriesPanel userId={vaultUserId} />;
      case 'progress': return <ProgressPanel userId={vaultUserId} onNavigate={handleNavigate} />;
      case 'briefing': return <BriefingPanel userId={vaultUserId} onNavigate={handleNavigate} />;
      case 'family': return <FamilyPanel userId={vaultUserId} />;
      case 'facetime': return <FaceTimePanel userId={vaultUserId} onNavigate={handleNavigate} />;
      case 'settings': return <SettingsPanel userId={vaultUserId} userEmail={user.email || ''} />;
      default: return <DashboardPanel userId={vaultUserId} stats={stats} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: BG_DARK, color: '#e4e4e7' }}>
      {/* Onboarding */}
      {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-56' : 'w-0 md:w-16'} overflow-hidden`}
        style={{ background: BG_CARD, borderRight: `1px solid ${BORDER}` }}
      >
        <div className="p-4 flex items-center gap-2 border-b" style={{ borderColor: BORDER }}>
          <Link href="/immortality-vault" className="flex items-center gap-2">
            <Image src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="EPT" width={24} height={24} />
            {sidebarOpen && <span className="text-xs font-bold text-white whitespace-nowrap">Immortality Vault</span>}
          </Link>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                activePanel === item.id ? 'text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={activePanel === item.id ? { background: '#7c3aed20' } : undefined}
              title={item.label}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-gray-600 text-center truncate">
              {user.email}
            </div>
          </div>
        )}
      </aside>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <main className="flex-1 min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 backdrop-blur-lg border-b px-4 md:px-6 h-14 flex items-center justify-between" style={{ background: `${BG_DARK}cc`, borderColor: BORDER }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition">
            {sidebarOpen ? '\u{2715}' : '\u{2630}'}
          </button>
          <div className="text-sm font-semibold text-white">
            {NAV_ITEMS.find(n => n.id === activePanel)?.icon} {NAV_ITEMS.find(n => n.id === activePanel)?.label}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/immortality-vault" className="text-xs text-gray-400 hover:text-white transition">
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
