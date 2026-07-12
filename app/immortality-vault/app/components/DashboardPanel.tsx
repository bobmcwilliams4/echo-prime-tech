'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_CARD2, BG_INSET, BORDER, HAIR, IVORY, MUTED, LEVEL_THRESHOLDS } from '../lib/constants';
import { getGamificationStats, checkAchievements, getConsciousnessState, setConsciousnessState, getFamilyMembers, getChatSessions, type GamificationStats, type ConsciousnessStateResponse, type ConsciousnessStateType } from '../lib/vault-api';
import VaultIcon from './VaultIcon';
import MoreFromEcho from './MoreFromEcho';

interface Props {
  userId: string;
  stats: { memories?: number; interviews?: number; family_members?: number; chat_sessions?: number } | null;
  onNavigate: (panel: string) => void;
}

export default function DashboardPanel({ userId, stats, onNavigate }: Props) {
  const [gamification, setGamification] = useState<GamificationStats | null>(null);
  const [consciousness, setConsciousness] = useState<ConsciousnessStateResponse | null>(null);
  const [stateChanging, setStateChanging] = useState(false);
  // User-scoped Family + Chat counts (the `stats` prop is the platform-wide total).
  const [familyCount, setFamilyCount] = useState<number | null>(null);
  const [chatCount, setChatCount] = useState<number | null>(null);

  useEffect(() => {
    getGamificationStats(userId).then(setGamification).catch(() => {});
    checkAchievements(userId).catch(() => {});
    getConsciousnessState(userId).then(setConsciousness).catch(() => {});
    getFamilyMembers(userId).then(r => setFamilyCount(r.members.length)).catch(() => setFamilyCount(0));
    getChatSessions(userId).then(r => setChatCount(r.sessions.length)).catch(() => setChatCount(0));
  }, [userId]);

  const handleStateChange = async (newState: ConsciousnessStateType) => {
    if (stateChanging || consciousness?.state === newState) return;
    setStateChanging(true);
    try {
      await setConsciousnessState(userId, newState);
      const updated = await getConsciousnessState(userId);
      setConsciousness(updated);
    } catch { /* empty */ }
    setStateChanging(false);
  };

  const score = consciousness?.score?.overall ?? gamification?.consciousness_score ?? Math.min(100, Math.round(((stats?.memories || 0) + (stats?.interviews || 0) * 3) / 2));
  const level = gamification?.level ?? LEVEL_THRESHOLDS.filter(l => score >= l.min).pop()?.label ?? 'Newcomer';
  const levelColor = LEVEL_THRESHOLDS.filter(l => score >= l.min).pop()?.color ?? MUTED;
  const points = gamification?.total_points ?? 0;

  const statCards = [
    { label: 'Memories', value: gamification?.total_memories ?? stats?.memories ?? 0, icon: 'crystal' },
    { label: 'Interviews', value: gamification?.total_interviews ?? stats?.interviews ?? 0, icon: 'interview' },
    { label: 'Family Members', value: familyCount ?? 0, icon: 'family_vault' },
    { label: 'Chat Sessions', value: chatCount ?? 0, icon: 'chat' },
  ];

  const quickActions = [
    { panel: 'interview', icon: 'interview', title: 'Start Interview', desc: 'Answer questions to build your autobiography' },
    { panel: 'chat', icon: 'chat', title: 'Chat with Consciousness', desc: 'Talk to your preserved self' },
    { panel: 'record', icon: 'record', title: 'Record Video', desc: 'Capture selfie video for FaceTime' },
    { panel: 'voice', icon: 'voice', title: 'Clone Your Voice', desc: 'Record prompts for voice synthesis' },
    { panel: 'briefing', icon: 'briefing', title: 'Daily Briefing', desc: 'Your personalized daily greeting' },
    { panel: 'ancestor', icon: 'ancestor', title: 'Ancestor Chat', desc: 'Talk to a preserved family member' },
  ];

  const interviewPct = Math.min(100, ((gamification?.total_interviews ?? stats?.interviews ?? 0) / 80) * 100);
  const memoryPct = Math.min(100, ((gamification?.total_memories ?? stats?.memories ?? 0) / 50) * 100);
  const voicePct = gamification?.voice_clone_status === 'active' ? 100 : 0;
  const achievePct = Math.min(100, (points / 500) * 100);

  const breakdownBars = [
    { label: 'Personality Confidence (40%)', pct: consciousness?.score?.personality_confidence ?? interviewPct },
    { label: 'Trait Coverage (30%)', pct: consciousness?.score?.trait_coverage ?? memoryPct },
    { label: 'Session Depth (20%)', pct: consciousness?.score?.session_depth ?? voicePct },
    { label: 'Memory Richness (10%)', pct: consciousness?.score?.memory_richness ?? achievePct },
  ];

  const card: React.CSSProperties = { background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16 };

  return (
    <div className="space-y-6">
      {/* ── Hero / atmosphere band (gold-on-black Grok art drops into the bg slot) ── */}
      <section
        className="relative overflow-hidden rounded-2xl"
        style={{
          border: `1px solid ${BORDER}`,
          backgroundImage: `linear-gradient(105deg, ${BG_CARD} 8%, rgba(20,16,12,0.72) 46%, rgba(20,16,12,0.30) 100%), url('/immortality-vault/hero-ember.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative px-6 md:px-9 py-8 md:py-11" style={{ maxWidth: 640 }}>
          <div className="flex items-center gap-2 mb-3 text-[11px] uppercase" style={{ letterSpacing: '0.24em', color: GOLD_DEEP }}>
            <span style={{ width: 22, height: 1, background: GOLD_DEEP }} /> Immortality Vault
          </div>
          <h2 className="text-2xl md:text-[34px] font-semibold leading-tight mb-2" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Your legacy, kept in the light.
          </h2>
          <p className="text-sm mb-5" style={{ color: MUTED, lineHeight: 1.65, maxWidth: 470 }}>
            Every memory, every word, and one day your very voice — preserved with care for the generations who come after you.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('interview')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition hover:brightness-110 inline-flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a', boxShadow: `0 10px 30px -12px ${ACCENT}` }}
            >
              <VaultIcon name="interview" size={16} /> Continue Your Story
            </button>
            <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-2" style={{ background: `${levelColor}1e`, color: levelColor, border: `1px solid ${levelColor}44` }}>
              <VaultIcon name="values" size={13} /> {level}{points > 0 ? ` · ${points} XP` : ''}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="p-4 rounded-2xl transition hover:brightness-110" style={card}>
            <div className="mb-2" style={{ color: ACCENT }}><VaultIcon name={s.icon} size={22} /></div>
            <div className="text-3xl font-bold" style={{ color: IVORY }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map(a => (
          <button
            key={a.panel}
            onClick={() => onNavigate(a.panel)}
            className="group p-5 rounded-2xl text-left transition hover:-translate-y-0.5"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="mb-3 inline-flex items-center justify-center rounded-xl transition" style={{ width: 40, height: 40, color: ACCENT, background: 'rgba(245,196,81,0.08)', border: `1px solid ${HAIR}` }}>
              <VaultIcon name={a.icon} size={20} />
            </div>
            <div className="text-sm font-semibold" style={{ color: IVORY }}>{a.title}</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{a.desc}</div>
          </button>
        ))}
      </div>

      {/* ── Consciousness Score ── */}
      <div className="p-6 rounded-2xl" style={card}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold" style={{ color: IVORY }}>Consciousness Completeness</span>
          <span className="text-2xl font-bold" style={{ color: ACCENT }}>{score}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: BG_INSET, border: `1px solid ${HAIR}` }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD}, ${GOLD_BRIGHT})`, boxShadow: `0 0 16px -3px ${ACCENT}` }} />
        </div>

        <div className="mt-5 space-y-3">
          {breakdownBars.map(b => (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: MUTED }}>{b.label}</span>
                <span className="text-xs font-mono" style={{ color: ACCENT }}>{Math.round(b.pct)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BG_INSET }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${b.pct}%`, background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Consciousness State Controls */}
        <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${HAIR}` }}>
          <div className="text-xs mb-3" style={{ color: MUTED }}>Consciousness State</div>
          <div className="flex flex-wrap gap-2">
            {([
              { state: 'DORMANT' as const, icon: 'clock', label: 'Dormant', desc: 'Paused — not learning' },
              { state: 'LEARNING' as const, icon: 'education', label: 'Learning', desc: 'Absorbing new memories' },
              { state: 'ACTIVE' as const, icon: 'spark', label: 'Active', desc: 'Full consciousness' },
              { state: 'INTERVIEWING' as const, icon: 'interview', label: 'Interviewing', desc: 'Deep biography mode' },
              { state: 'CONVERSING' as const, icon: 'chat', label: 'Conversing', desc: 'Live conversation' },
            ]).map(s => {
              const active = consciousness?.state === s.state;
              return (
                <button
                  key={s.state}
                  onClick={() => handleStateChange(s.state)}
                  disabled={stateChanging}
                  className="px-3 py-1.5 rounded-lg text-xs transition hover:brightness-110 disabled:opacity-40 inline-flex items-center gap-1.5"
                  style={{
                    background: active ? 'rgba(245,196,81,0.14)' : BG_INSET,
                    border: `1px solid ${active ? 'rgba(245,196,81,0.4)' : BORDER}`,
                    color: active ? ACCENT : MUTED,
                  }}
                  title={s.desc}
                >
                  <VaultIcon name={s.icon} size={13} /> {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Achievements ── */}
      {gamification && gamification.available_achievements && gamification.available_achievements.length > 0 && (
        <div className="p-6 rounded-2xl" style={card}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: IVORY }}>Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gamification.available_achievements.map(a => {
              const unlocked = gamification.achievements.some(u => u.achievement_type === a.type);
              return (
                <div
                  key={a.type}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: unlocked ? 'rgba(245,196,81,0.09)' : BG_INSET,
                    border: `1px solid ${unlocked ? 'rgba(245,196,81,0.34)' : BORDER}`,
                    opacity: unlocked ? 1 : 0.55,
                  }}
                >
                  <div className="mb-1.5 flex justify-center" style={{ color: unlocked ? ACCENT : MUTED }}>
                    <VaultIcon name={unlocked ? 'trophy' : 'lock'} size={20} />
                  </div>
                  <div className="text-xs font-semibold" style={{ color: unlocked ? ACCENT : MUTED }}>{a.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: MUTED }}>{a.points} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── More from Echo Prime (quiet, dismissible cross-promo) ── */}
      <MoreFromEcho />
    </div>
  );
}
