'use client';

/* Immortality Vault — family listening room.
 * A private invite link (?token=…) opens the preserved person's answered
 * stories, read-only, no account needed. Self-contained: no EPT links. */

import { useEffect, useState } from 'react';
import { getListenStories, synthesizeSpeech, type ListenStory } from '../app/lib/vault-api';
import { playAudioBlob } from '../app/lib/media';

const GOLD = '#d4b483';
const BG = '#0a0a0f';
const CARD = '#111116';
const BORDER = '#26262e';

export default function ListenPage() {
  const [stories, setStories] = useState<ListenStory[]>([]);
  const [person, setPerson] = useState('');
  const [listener, setListener] = useState<string | undefined>();
  const [state, setState] = useState<'loading' | 'ready' | 'invalid'>('loading');
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { setState('invalid'); return; }
    getListenStories(token)
      .then(d => { setStories(d.stories || []); setPerson(d.person); setListener(d.listener); setState('ready'); })
      .catch(() => setState('invalid'));
  }, []);

  const speak = async (s: ListenStory, idx: number) => {
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      const blob = await synthesizeSpeech(s.answer.slice(0, 1200));
      await playAudioBlob(blob);
    } catch { /* voice offline — the words remain */ }
    setPlayingIdx(null);
  };

  return (
    <div className="min-h-screen" style={{ background: BG, color: '#e4e4e7' }}>
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <div className="text-xs font-mono mb-3" style={{ color: GOLD, letterSpacing: 4 }}>THE IMMORTALITY VAULT</div>
          {state === 'ready' && (
            <>
              <h1 className="text-3xl font-light text-white mb-2">{person}&rsquo;s Stories</h1>
              <p className="text-sm" style={{ color: '#a1a1aa' }}>
                {listener ? `Welcome, ${listener}. ` : ''}These memories were preserved so you could keep them forever.
                {stories.length > 0 && ` ${stories.length} stories and counting.`}
              </p>
            </>
          )}
        </div>

        {state === 'loading' && (
          <div className="text-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: GOLD, borderTopColor: 'transparent' }} />
          </div>
        )}

        {state === 'invalid' && (
          <div className="text-center py-16 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-white mb-1">This invitation link isn&rsquo;t valid.</p>
            <p className="text-sm" style={{ color: '#a1a1aa' }}>Ask your family member to send you a fresh invite from their Vault.</p>
          </div>
        )}

        {state === 'ready' && stories.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-white mb-1">The first stories are still being told.</p>
            <p className="text-sm" style={{ color: '#a1a1aa' }}>Check back soon — every interview adds more.</p>
          </div>
        )}

        <div className="space-y-5">
          {stories.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}` }}>
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="text-[11px] font-mono" style={{ color: GOLD, letterSpacing: 2 }}>
                  {(s.category || 'memory').replace('_', ' ').toUpperCase()}
                </div>
                <div className="text-[11px]" style={{ color: '#71717a' }}>
                  {s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}
                </div>
              </div>
              <p className="text-sm italic mb-3" style={{ color: '#a1a1aa' }}>&ldquo;{s.question}&rdquo;</p>
              <p className="text-base text-white font-light leading-relaxed whitespace-pre-wrap">{s.answer}</p>
              <button
                onClick={() => speak(s, i)}
                disabled={playingIdx !== null}
                className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold transition hover:scale-[1.02] disabled:opacity-40"
                style={{ border: `1px solid ${BORDER}`, color: GOLD }}
              >
                {playingIdx === i ? 'Playing…' : 'Hear this story'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-[11px]" style={{ color: '#52525b' }}>
          Preserved forever in the Immortality Vault.
        </div>
      </div>
    </div>
  );
}
