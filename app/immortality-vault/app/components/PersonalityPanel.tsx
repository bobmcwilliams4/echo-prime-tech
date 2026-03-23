'use client';

import { useState, useEffect, useMemo } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER } from '../lib/constants';
import {
  getPersonalityProfile,
  getConsciousnessState,
  type PersonalityProfileResponse,
  type ConsciousnessStateResponse,
  type TraitCategory,
  type PersonalityTrait,
} from '../lib/vault-api';

interface Props {
  userId: string;
}

const CATEGORY_META: Record<TraitCategory, { label: string; icon: string; color: string }> = {
  communication_style: { label: 'Communication', icon: '\u{1F4AC}', color: '#60a5fa' },
  emotional_disposition: { label: 'Emotional', icon: '\u{2764}\u{FE0F}', color: '#f472b6' },
  values_beliefs: { label: 'Values & Beliefs', icon: '\u{2B50}', color: '#fbbf24' },
  humor_style: { label: 'Humor', icon: '\u{1F604}', color: '#34d399' },
  decision_making: { label: 'Decisions', icon: '\u{1F9E0}', color: '#a78bfa' },
  social_behavior: { label: 'Social', icon: '\u{1F465}', color: '#f97316' },
  intellectual_traits: { label: 'Intellect', icon: '\u{1F4DA}', color: '#06b6d4' },
  lifestyle_preferences: { label: 'Lifestyle', icon: '\u{2600}\u{FE0F}', color: '#84cc16' },
};

const CATEGORY_ORDER: TraitCategory[] = [
  'communication_style',
  'emotional_disposition',
  'values_beliefs',
  'humor_style',
  'decision_making',
  'social_behavior',
  'intellectual_traits',
  'lifestyle_preferences',
];

/** SVG radar/spider chart for 8 trait categories */
function RadarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const cx = 150;
  const cy = 150;
  const r = 110;
  const n = data.length;
  const levels = 4;

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // top

  const point = (i: number, scale: number) => {
    const a = startAngle + i * angleStep;
    return { x: cx + r * scale * Math.cos(a), y: cy + r * scale * Math.sin(a) };
  };

  // Grid rings
  const gridRings = Array.from({ length: levels }, (_, l) => {
    const scale = (l + 1) / levels;
    const pts = Array.from({ length: n }, (_, i) => point(i, scale));
    return pts.map(p => `${p.x},${p.y}`).join(' ');
  });

  // Axes
  const axes = Array.from({ length: n }, (_, i) => point(i, 1));

  // Data polygon
  const dataPoints = data.map((d, i) => point(i, Math.max(0.05, d.value / 100)));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {gridRings.map((ring, i) => (
        <polygon key={i} points={ring} fill="none" stroke="#2a2a3a" strokeWidth={0.8} />
      ))}

      {/* Axes */}
      {axes.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2a2a3a" strokeWidth={0.5} />
      ))}

      {/* Data fill */}
      <polygon points={dataPolygon} fill={`${ACCENT}25`} stroke={ACCENT} strokeWidth={2} />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={data[i].color} stroke="#0a0a0f" strokeWidth={1.5} />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const labelR = r + 22;
        const a = startAngle + i * angleStep;
        const lx = cx + labelR * Math.cos(a);
        const ly = cy + labelR * Math.sin(a);
        const anchor = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle';
        return (
          <text key={i} x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize={9} fill="#94a3b8">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

function TraitBar({ trait, color }: { trait: PersonalityTrait; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-300 capitalize">{trait.trait_name.replace(/_/g, ' ')}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color }}>{trait.value}%</span>
          <span className="text-[10px] text-gray-600">{Math.round(trait.confidence * 100)}% conf</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${trait.value}%`, background: color, opacity: 0.6 + trait.confidence * 0.4 }} />
      </div>
    </div>
  );
}

export default function PersonalityPanel({ userId }: Props) {
  const [profile, setProfile] = useState<PersonalityProfileResponse | null>(null);
  const [consciousness, setConsciousness] = useState<ConsciousnessStateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState<TraitCategory | null>(null);

  useEffect(() => {
    Promise.all([
      getPersonalityProfile(userId).then(setProfile).catch(() => {}),
      getConsciousnessState(userId).then(setConsciousness).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [userId]);

  const radarData = useMemo(() => {
    if (!profile?.traits) return [];
    return CATEGORY_ORDER.map(cat => {
      const meta = CATEGORY_META[cat];
      const traits = profile.traits[cat] || [];
      const avg = traits.length > 0 ? Math.round(traits.reduce((s, t) => s + t.value, 0) / traits.length) : 0;
      return { label: meta.label, value: avg, color: meta.color };
    });
  }, [profile]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  const hasTrait = profile && Object.values(profile.traits || {}).some(arr => arr.length > 0);

  if (!hasTrait) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Personality Profile</h2>
        <div className="p-8 rounded-2xl text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-5xl mb-4">{'\u{1F9EC}'}</div>
          <h3 className="text-lg font-bold text-white mb-2">No Traits Extracted Yet</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Complete interviews and chat sessions to build your personality profile. Each interaction helps the AI understand who you are.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORY_ORDER.map(cat => {
              const meta = CATEGORY_META[cat];
              return (
                <div key={cat} className="p-3 rounded-lg" style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}>
                  <div className="text-lg mb-1">{meta.icon}</div>
                  <div className="text-[10px] text-gray-500">{meta.label}</div>
                  <div className="h-1 rounded-full mt-2" style={{ background: '#1e1e2e' }}>
                    <div className="h-full rounded-full" style={{ width: '0%', background: meta.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Personality Profile</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{profile?.sample_count ?? 0} samples</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}>
            {Math.round(profile?.confidence_score ?? 0)}% confidence
          </span>
        </div>
      </div>

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <div className="p-6 rounded-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-semibold text-white mb-2 text-center">Trait Radar</h3>
          <RadarChart data={radarData} />
        </div>
      )}

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORY_ORDER.map(cat => {
          const meta = CATEGORY_META[cat];
          const traits = profile?.traits[cat] || [];
          if (traits.length === 0) return null;
          const avg = Math.round(traits.reduce((s, t) => s + t.value, 0) / traits.length);
          const expanded = expandedCat === cat;

          return (
            <div key={cat} className="rounded-xl overflow-hidden" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <button
                onClick={() => setExpandedCat(expanded ? null : cat)}
                className="w-full flex items-center justify-between p-4 transition hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meta.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{meta.label}</div>
                    <div className="text-[10px] text-gray-500">{traits.length} trait{traits.length !== 1 ? 's' : ''} detected</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
                    <div className="h-full rounded-full" style={{ width: `${avg}%`, background: meta.color }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: meta.color }}>{avg}%</span>
                  <span className="text-xs text-gray-500">{expanded ? '\u25B2' : '\u25BC'}</span>
                </div>
              </button>
              {expanded && (
                <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: BORDER }}>
                  {traits.map(t => (
                    <TraitBar key={t.trait_name} trait={t} color={meta.color} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Voice Pattern */}
      {profile?.voice_pattern && (
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-semibold text-white mb-4">{'\u{1F3A4}'} Voice Pattern</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] text-gray-500">Formality</div>
              <div className="text-sm font-bold text-white">{Math.round(profile.voice_pattern.formality * 100)}%</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Speech Pace</div>
              <div className="text-sm font-bold text-white capitalize">{profile.voice_pattern.speech_pace}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Avg Sentence</div>
              <div className="text-sm font-bold text-white">{profile.voice_pattern.avg_sentence_length} words</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Contractions</div>
              <div className="text-sm font-bold text-white">{profile.voice_pattern.uses_contractions ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {profile.voice_pattern.favorite_phrases.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] text-gray-500 mb-2">Favorite Phrases</div>
              <div className="flex flex-wrap gap-2">
                {profile.voice_pattern.favorite_phrases.map(p => (
                  <span key={p} className="px-2 py-1 rounded-full text-[10px]" style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>
                    &ldquo;{p}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.voice_pattern.filler_words.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] text-gray-500 mb-2">Filler Words</div>
              <div className="flex flex-wrap gap-2">
                {profile.voice_pattern.filler_words.map(w => (
                  <span key={w} className="px-2 py-1 rounded-full text-[10px]" style={{ background: '#fbbf2415', color: GOLD, border: `1px solid ${GOLD}30` }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Emotional Profile */}
      {profile?.emotional_profile && (
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-semibold text-white mb-4">{'\u{2764}\u{FE0F}'} Emotional Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-gray-500">Baseline Mood</div>
              <div className="text-sm font-bold text-white capitalize">{profile.emotional_profile.baseline_mood}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Emotional Range</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
                  <div className="h-full rounded-full" style={{ width: `${profile.emotional_profile.emotional_range * 100}%`, background: '#f472b6' }} />
                </div>
                <span className="text-xs font-mono text-pink-400">{Math.round(profile.emotional_profile.emotional_range * 100)}%</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Coping Style</div>
              <div className="text-sm font-bold text-white capitalize">{profile.emotional_profile.coping_style}</div>
            </div>
          </div>

          {Object.keys(profile.emotional_profile.triggers || {}).length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] text-gray-500 mb-2">Emotional Triggers</div>
              <div className="space-y-1">
                {Object.entries(profile.emotional_profile.triggers).map(([trigger, response]) => (
                  <div key={trigger} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 capitalize">{trigger}:</span>
                    <span className="text-gray-300">{response}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consciousness State */}
      {consciousness && (
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-semibold text-white mb-3">{'\u{2728}'} Consciousness Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg text-center" style={{ background: '#0a0a0f' }}>
              <div className="text-lg font-bold" style={{ color: ACCENT }}>{consciousness.total_traits}</div>
              <div className="text-[10px] text-gray-500">Total Traits</div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: '#0a0a0f' }}>
              <div className="text-lg font-bold" style={{ color: '#60a5fa' }}>{consciousness.total_samples}</div>
              <div className="text-[10px] text-gray-500">Samples</div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: '#0a0a0f' }}>
              <div className="text-lg font-bold" style={{ color: '#34d399' }}>{consciousness.total_sessions}</div>
              <div className="text-[10px] text-gray-500">Sessions</div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: '#0a0a0f' }}>
              <div className="text-lg font-bold" style={{ color: GOLD }}>{Math.round(consciousness.personality_confidence * 100)}%</div>
              <div className="text-[10px] text-gray-500">Confidence</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
