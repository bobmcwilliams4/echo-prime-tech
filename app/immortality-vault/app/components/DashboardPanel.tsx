'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER, LEVEL_THRESHOLDS } from '../lib/constants';
import { getGamificationStats, checkAchievements, type GamificationStats } from '../lib/vault-api';

interface Props {
  userId: string;
  stats: { memories?: number; interviews?: number; family_members?: number; chat_sessions?: number } | null;
  onNavigate: (panel: string) => void;
}

export default function DashboardPanel({ userId, stats, onNavigate }: Props) {
  const [gamification, setGamification] = useState<GamificationStats | null>(null);

  useEffect(() => {
    getGamificationStats(userId).then(setGamification).catch(() => {});
    checkAchievements(userId).catch(() => {});
  }, [userId]);

  const score = gamification?.consciousness_score ?? Math.min(100, Math.round(((stats?.memories || 0) + (stats?.interviews || 0) * 3) / 2));
  const level = gamification?.level ?? LEVEL_THRESHOLDS.filter(l => score >= l.min).pop()?.label ?? 'Newcomer';
  const levelColor = LEVEL_THRESHOLDS.filter(l => score >= l.min).pop()?.color ?? '#94a3b8';
  const points = gamification?.total_points ?? 0;

  const statCards = [
    { label: 'Memories', value: gamification?.total_memories ?? stats?.memories ?? 0, icon: '\u{1F9E0}', color: ACCENT },
    { label: 'Interviews', value: gamification?.total_interviews ?? stats?.interviews ?? 0, icon: '\u{1F399}\u{FE0F}', color: '#60a5fa' },
    { label: 'Family Members', value: stats?.family_members ?? 0, icon: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}', color: '#f472b6' },
    { label: 'Chat Sessions', value: stats?.chat_sessions ?? 0, icon: '\u{1F4AC}', color: '#34d399' },
  ];

  const quickActions = [
    { panel: 'interview', icon: '\u{1F399}\u{FE0F}', title: 'Start Interview', desc: 'Answer questions to build your autobiography', gradient: 'linear-gradient(135deg, #7c3aed20, #a855f720)', border: '#7c3aed40' },
    { panel: 'chat', icon: '\u{1F4AC}', title: 'Chat with Consciousness', desc: 'Talk to your preserved self', gradient: 'linear-gradient(135deg, #60a5fa20, #3b82f620)', border: '#60a5fa40' },
    { panel: 'record', icon: '\u{1F4F9}', title: 'Record Video', desc: 'Capture selfie video for FaceTime', gradient: 'linear-gradient(135deg, #f472b620, #ec489920)', border: '#f472b640' },
    { panel: 'voice', icon: '\u{1F3A4}', title: 'Clone Your Voice', desc: 'Record 10 prompts for voice synthesis', gradient: 'linear-gradient(135deg, #34d39920, #10b98120)', border: '#34d39940' },
    { panel: 'briefing', icon: '\u{2600}\u{FE0F}', title: 'Daily Briefing', desc: 'Your personalized daily greeting', gradient: 'linear-gradient(135deg, #fbbf2420, #f59e0b20)', border: '#fbbf2440' },
    { panel: 'ancestor', icon: '\u{1F54A}\u{FE0F}', title: 'Ancestor Chat', desc: 'Talk to a preserved family member', gradient: 'linear-gradient(135deg, #e879f920, #d946ef20)', border: '#e879f940' },
  ];

  // Consciousness score breakdown bars
  const interviewPct = Math.min(100, ((gamification?.total_interviews ?? stats?.interviews ?? 0) / 80) * 100);
  const memoryPct = Math.min(100, ((gamification?.total_memories ?? stats?.memories ?? 0) / 50) * 100);
  const voicePct = gamification?.voice_clone_status === 'active' ? 100 : 0;
  const achievePct = Math.min(100, (points / 500) * 100);

  const breakdownBars = [
    { label: 'Interviews (40%)', pct: interviewPct, color: '#60a5fa' },
    { label: 'Memories (30%)', pct: memoryPct, color: ACCENT },
    { label: 'Voice Clone (20%)', pct: voicePct, color: '#34d399' },
    { label: 'Achievements (10%)', pct: achievePct, color: GOLD },
  ];

  return (
    <div className="space-y-6">
      {/* Level Badge + Score */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Immortality Vault</h2>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${levelColor}20`, color: levelColor, border: `1px solid ${levelColor}40` }}>
            {level}
          </div>
          {points > 0 && (
            <div className="text-xs font-mono text-gray-400">{points} XP</div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map(a => (
          <button
            key={a.panel}
            onClick={() => onNavigate(a.panel)}
            className="p-5 rounded-xl text-left transition hover:scale-[1.02]"
            style={{ background: a.gradient, border: `1px solid ${a.border}` }}
          >
            <div className="text-xl mb-2">{a.icon}</div>
            <div className="text-sm font-bold text-white">{a.title}</div>
            <div className="text-xs text-gray-400">{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Consciousness Score */}
      <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Consciousness Completeness</span>
          <span className="text-2xl font-black" style={{ color: ACCENT }}>{score}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, background: `linear-gradient(90deg, #7c3aed, ${ACCENT}, ${GOLD})` }}
          />
        </div>

        {/* Breakdown Bars */}
        <div className="mt-4 space-y-2">
          {breakdownBars.map(b => (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{b.label}</span>
                <span className="text-xs font-mono" style={{ color: b.color }}>{Math.round(b.pct)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${b.pct}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {gamification && gamification.available_achievements && gamification.available_achievements.length > 0 && (
        <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-semibold text-white mb-4">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gamification.available_achievements.map(a => {
              const unlocked = gamification.achievements.some(u => u.achievement_type === a.type);
              return (
                <div
                  key={a.type}
                  className="p-3 rounded-lg text-center"
                  style={{
                    background: unlocked ? `${GOLD}15` : '#0a0a0f',
                    border: `1px solid ${unlocked ? `${GOLD}40` : BORDER}`,
                    opacity: unlocked ? 1 : 0.5,
                  }}
                >
                  <div className="text-lg mb-1">{unlocked ? '\u{1F3C6}' : '\u{1F512}'}</div>
                  <div className="text-xs font-bold" style={{ color: unlocked ? GOLD : '#64748b' }}>{a.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{a.points} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
