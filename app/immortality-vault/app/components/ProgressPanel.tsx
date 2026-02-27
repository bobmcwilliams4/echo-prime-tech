'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER, CATEGORIES } from '../lib/constants';
import { getCoverage, getGaps, getGamificationStats, type CoverageCategory, type GapQuestion, type GamificationStats } from '../lib/vault-api';

interface Props {
  userId: string;
  onNavigate: (panel: string) => void;
}

const MILESTONES = [
  { pct: 25, label: 'Foundation Laid', icon: '\u{1F331}' },
  { pct: 50, label: 'Half Complete', icon: '\u{1F3D7}\u{FE0F}' },
  { pct: 75, label: 'Almost There', icon: '\u{1F680}' },
  { pct: 100, label: 'Immortal', icon: '\u{1F451}' },
];

export default function ProgressPanel({ userId, onNavigate }: Props) {
  const [coverage, setCoverage] = useState<CoverageCategory[]>([]);
  const [gaps, setGaps] = useState<GapQuestion[]>([]);
  const [gamification, setGamification] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCoverage(userId).then(d => setCoverage(d.categories || [])).catch(() => {}),
      getGaps(userId).then(d => setGaps(d.gaps || [])).catch(() => {}),
      getGamificationStats(userId).then(setGamification).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  const totalAnswered = coverage.reduce((s, c) => s + c.answered, 0);
  const totalQuestions = coverage.reduce((s, c) => s + c.total, 0);
  const overallPct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Progress & Coverage</h2>

      {/* Circular Score */}
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(${ACCENT} ${overallPct * 3.6}deg, #1e1e2e ${overallPct * 3.6}deg)`,
            }}
          >
            <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center" style={{ background: BG_CARD }}>
              <div className="text-3xl font-black" style={{ color: ACCENT }}>{overallPct}%</div>
              <div className="text-[10px] text-gray-500">Interview Coverage</div>
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
              <div className="text-xl mb-1" style={{ opacity: reached ? 1 : 0.3 }}>
                {reached ? m.icon : '\u{1F512}'}
              </div>
              <div className="text-[10px]" style={{ color: reached ? GOLD : '#64748b' }}>{m.pct}%</div>
              <div className="text-[9px] text-gray-600">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Per-Category Bars */}
      <div className="p-5 rounded-xl space-y-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="text-sm font-semibold text-white mb-2">Category Coverage</h3>
        {coverage.map(c => {
          const cat = CATEGORIES.find(ct => ct.id === c.category);
          return (
            <div key={c.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{cat?.icon || ''} {cat?.name || c.category}</span>
                <span className="text-xs font-mono" style={{ color: c.percentage >= 75 ? '#34d399' : c.percentage >= 50 ? GOLD : '#94a3b8' }}>
                  {c.answered}/{c.total} ({c.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${c.percentage}%`,
                    background: c.percentage >= 75 ? '#34d399' : c.percentage >= 50 ? GOLD : ACCENT,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Interviews', value: gamification?.total_interviews ?? totalAnswered, icon: '\u{1F399}\u{FE0F}' },
          { label: 'Memories', value: gamification?.total_memories ?? 0, icon: '\u{1F9E0}' },
          { label: 'Consciousness', value: `${gamification?.consciousness_score ?? 0}%`, icon: '\u{2728}' },
          { label: 'Achievements', value: gamification?.achievements?.length ?? 0, icon: '\u{1F3C6}' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-lg mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Gap Recommendations */}
      {gaps.length > 0 && (
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-semibold text-white mb-3">Recommended Next Steps</h3>
          <div className="space-y-2">
            {gaps.slice(0, 5).map(g => {
              const cat = CATEGORIES.find(c => c.id === g.category);
              return (
                <div key={g.category} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#0a0a0f' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cat?.icon || ''}</span>
                    <div>
                      <div className="text-xs text-white">{cat?.name || g.category}</div>
                      <div className="text-[10px] text-gray-500">{g.questions.length} unanswered questions</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('interview')}
                    className="px-3 py-1 rounded-full text-[10px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
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
