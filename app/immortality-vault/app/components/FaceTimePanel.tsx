'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED, BG_DARK } from '../lib/constants';
import { getFaceTimeReadiness, type FaceTimeReadiness } from '../lib/vault-api';
import VaultIcon from './VaultIcon';

interface Props {
  userId: string;
  onNavigate: (panel: string) => void;
}

export default function FaceTimePanel({ userId, onNavigate }: Props) {
  const [readiness, setReadiness] = useState<FaceTimeReadiness | null>(null);

  useEffect(() => {
    getFaceTimeReadiness(userId).then(setReadiness).catch(() => {});
  }, [userId]);

  const score = readiness?.readiness_score ?? readiness?.score ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>FaceTime Video Calling</h2>
      <div className="p-px rounded-2xl" style={{ background: `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD_BRIGHT}, ${GOLD_DEEP})` }}>
        <div className="p-8 rounded-[15px] text-center" style={{ background: BG_DARK }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a', letterSpacing: '0.14em' }}>
            COMING 2026
          </div>
          <h3 className="text-2xl font-semibold mb-3" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Ultra-Realistic Video Calls</h3>
          <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: MUTED, lineHeight: 1.65 }}>
            See your loved one&apos;s face again. Our biometric capture system uses your selfie-camera recordings
            to build a photorealistic digital avatar that moves, speaks, and reacts exactly like you.
          </p>

          {/* Readiness Score */}
          <div className="max-w-sm mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: MUTED }}>FaceTime Readiness</span>
              <span className="text-lg font-bold" style={{ color: score >= 70 ? '#34d399' : score >= 40 ? GOLD : '#f87171' }}>
                {score}%
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: BG_INSET, border: `1px solid ${HAIR}` }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${score}%`, background: score >= 70 ? '#34d399' : score >= 40 ? `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})` : '#f87171' }}
              />
            </div>
            {readiness?.missing && readiness.missing.length > 0 && (
              <div className="mt-3 text-left">
                <div className="text-xs mb-1" style={{ color: MUTED }}>Still needed:</div>
                {readiness.missing.map(m => (
                  <div key={m} className="text-[10px] flex items-center gap-1.5" style={{ color: 'rgba(169,158,139,0.8)' }}>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: GOLD_DEEP, display: 'inline-block' }} /> {m.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => onNavigate('record')}
              className="mt-4 px-5 py-2 rounded-full text-xs font-semibold"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
            >
              Record Video to Improve Score
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Face Mesh', icon: 'facetime' },
              { label: 'Lip Sync', icon: 'speaker' },
              { label: 'Emotions', icon: 'emo_joy' },
              { label: 'Mannerisms', icon: 'spark' },
              { label: 'Body Pose', icon: 'personality' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: BG_INSET, border: `1px solid ${BORDER}` }}>
                <span style={{ color: ACCENT, display: 'flex' }}><VaultIcon name={p.icon} size={14} /></span>
                <span style={{ color: MUTED }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
