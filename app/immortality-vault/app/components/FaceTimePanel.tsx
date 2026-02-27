'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER, BG_DARK } from '../lib/constants';
import { getFaceTimeReadiness, type FaceTimeReadiness } from '../lib/vault-api';

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
      <h2 className="text-2xl font-bold text-white">FaceTime Video Calling</h2>
      <div className="p-1 rounded-2xl" style={{ background: `linear-gradient(135deg, ${GOLD}, #f472b6, ${ACCENT})` }}>
        <div className="p-8 rounded-[14px] text-center" style={{ background: BG_DARK }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6" style={{ background: `linear-gradient(135deg, ${GOLD}, #f59e0b)`, color: '#0a0a0f' }}>
            COMING 2026
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Ultra-Realistic Video Calls</h3>
          <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8">
            See your loved one&apos;s face again. Our biometric capture system uses your selfie-camera recordings
            to build a photorealistic digital avatar that moves, speaks, and reacts exactly like you.
          </p>

          {/* Readiness Score */}
          <div className="max-w-sm mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">FaceTime Readiness</span>
              <span className="text-lg font-bold" style={{ color: score >= 70 ? '#34d399' : score >= 40 ? GOLD : '#f87171' }}>
                {score}%
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${score}%`,
                  background: score >= 70 ? '#34d399' : score >= 40 ? GOLD : '#f87171',
                }}
              />
            </div>
            {readiness?.missing && readiness.missing.length > 0 && (
              <div className="mt-3 text-left">
                <div className="text-xs text-gray-500 mb-1">Still needed:</div>
                {readiness.missing.map(m => (
                  <div key={m} className="text-[10px] text-gray-600">{'\u{2022}'} {m.replace(/_/g, ' ')}</div>
                ))}
              </div>
            )}
            <button
              onClick={() => onNavigate('record')}
              className="mt-4 px-5 py-2 rounded-full text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
            >
              Record Video to Improve Score
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Face Mesh', icon: '\u{1F3AD}' },
              { label: 'Lip Sync', icon: '\u{1F444}' },
              { label: 'Emotions', icon: '\u{1F60A}' },
              { label: 'Mannerisms', icon: '\u{1F90C}' },
              { label: 'Body Pose', icon: '\u{1F9CD}' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: '#1a1a24', border: `1px solid ${BORDER}` }}>
                <span>{p.icon}</span>
                <span className="text-gray-400">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
