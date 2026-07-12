'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED, CATEGORIES } from '../lib/constants';
import { getCoverage, getGaps, getGamificationStats, getConsciousnessState, type CoverageCategory, type GapQuestion, type GamificationStats, type ConsciousnessStateResponse } from '../lib/vault-api';
import VaultIcon, { CATEGORY_ICON } from './VaultIcon';

interface Props {
  userId: string;
  onNavigate: (panel: string) => void;
}

const MILESTONES = [
  { pct: 25, label: 'Foundation Laid', icon: 'early_life' },
  { pct: 50, label: 'Half Complete', icon: 'progress' },
  { pct: 75, label: 'Almost There', icon: 'spark' },
  { pct: 100, label: 'Immortal', icon: 'trophy' },
];

export default function ProgressPanel({ userId, onNavigate }: Props) {
  const [coverage, setCoverage] = useState<CoverageCategory[]>([]);
  const [gaps, setGaps] = useState<GapQuestion[]>([]);
  const [gamification, setGamification] = useState<GamificationStats | null>(null);
  const [consciousness, setConsciousness] = useState<ConsciousnessStateResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCoverage(userId).then(d => setCoverage(d.categories || [])).catch(() => {}),
      getGaps(userId).then(d => setGaps(d.gaps || [])).catch(() => {}),
      getGamificationStats(userId).then(setGamification).catch(() => {}),
      getConsciousnessState(userId).then(setConsciousness).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 rounded-full animate-spin mx-auto" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
      </div>
    );
  }

  const totalAnswered = coverage.reduce((s, c) => s + c.answered, 0);
  const totalQuestions = coverage.reduce((s, c) => s + c.total, 0);
  const overallPct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  const scorePct = consciousness?.score?.overall ?? overallPct;
  const card: React.CSSProperties = { background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16 };

  const statCards = [
    { label: 'Total Interviews', value: gamification?.total_interviews ?? totalAnswered, icon: 'interview' },
    { label: 'Memories', value: gamification?.total_memories ?? 0, icon: 'crystal' },
    { label: 'Consciousness', value: `${consciousness?.score?.overall ?? gamification?.consciousness_score ?? 0}%`, icon: 'spark' },
    { label: 'Achievements', value: gamification?.achievements?.length ?? 0, icon: 'trophy' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Progress &amp; Coverage</h2>

      {/* Circular Score */}
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ background: `conic-gradient(${ACCENT} ${scorePct * 3.6}deg, ${BG_INSET} ${scorePct * 3.6}deg)`, boxShadow: `0 0 40px -14px ${ACCENT}` }}
          >
            <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center" style={{ background: BG_CARD, border: `1px solid ${HAIR}` }}>
              <div className="text-3xl font-bold" style={{ color: ACCENT }}>{scorePct}%</div>
              <div className="text-[10px]" style={{ color: MUTED }}>Consciousness Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="flex justify-between px-2">
        {MILESTONES.map(m => {
          const reached = overallPct >= m.pct;
          return (
            <div key={m.pct} className="text-center">
              <div className="mb-1.5 flex justify-center" style={{ color: reached ? GOLD : MUTED, opacity: reached ? 1 : 0.4 }}>
                <VaultIcon name={reached ? m.icon : 'lock'} size={22} />
              </div>
              <div className="text-[10px]" style={{ color: reached ? GOLD : MUTED }}>{m.pct}%</div>
              <div className="text-[9px]" style={{ color: 'rgba(169,158,139,0.7)' }}>{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Per-Category Bars */}
      <div className="p-5 rounded-2xl space-y-3" style={card}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: IVORY }}>Category Coverage</h3>
        {coverage.map(c => {
          const cat = CATEGORIES.find(ct => ct.id === c.category);
          return (
            <div key={c.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs inline-flex items-center gap-1.5" style={{ color: MUTED }}>
                  <span style={{ color: GOLD_DEEP, display: 'flex' }}><VaultIcon name={CATEGORY_ICON[c.category] || 'spark'} size={13} /></span>
                  {cat?.name || c.category}
                </span>
                <span className="text-xs font-mono" style={{ color: c.percentage >= 75 ? '#34d399' : c.percentage >= 50 ? GOLD : MUTED }}>
                  {c.answered}/{c.total} ({c.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: BG_INSET }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${c.percentage}%`, background: c.percentage >= 75 ? '#34d399' : `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="p-3 rounded-xl text-center" style={card}>
            <div className="mb-1.5 flex justify-center" style={{ color: ACCENT }}><VaultIcon name={s.icon} size={19} /></div>
            <div className="text-xl font-bold" style={{ color: IVORY }}>{s.value}</div>
            <div className="text-[10px]" style={{ color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Gap Recommendations */}
      {gaps.length > 0 && (
        <div className="p-5 rounded-2xl" style={card}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: IVORY }}>Recommended Next Steps</h3>
          <div className="space-y-2">
            {gaps.slice(0, 5).map(g => {
              const cat = CATEGORIES.find(c => c.id === g.category);
              return (
                <div key={g.category} className="flex items-center justify-between p-3 rounded-xl" style={{ background: BG_INSET }}>
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: ACCENT, display: 'flex' }}><VaultIcon name={CATEGORY_ICON[g.category] || 'spark'} size={17} /></span>
                    <div>
                      <div className="text-xs" style={{ color: IVORY }}>{cat?.name || g.category}</div>
                      <div className="text-[10px]" style={{ color: MUTED }}>{g.questions.length} unanswered questions</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('interview')}
                    className="px-3.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
                  >
                    Start
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
