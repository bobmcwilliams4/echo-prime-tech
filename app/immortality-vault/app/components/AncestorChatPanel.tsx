'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_CARD2, BG_INSET, BORDER, HAIR, IVORY, MUTED, EMOTION_ICONS } from '../lib/constants';
import { sendChat, synthesizeSpeech, getFamilyMembers, getVoiceProfiles, type ChatMessage, type FamilyMember } from '../lib/vault-api';
import { playAudioBlob } from '../lib/media';
import VaultIcon from './VaultIcon';

interface Props {
  userId: string;
}

type Mode = 'casual' | 'storytelling' | 'wisdom';

const MODE_META: Record<Mode, { label: string; icon: string; desc: string }> = {
  casual: { label: 'Casual', icon: 'chat', desc: 'Everyday conversation' },
  storytelling: { label: 'Storytelling', icon: 'education', desc: 'Hear their stories' },
  wisdom: { label: 'Wisdom', icon: 'wisdom', desc: 'Life lessons & advice' },
};

function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase(); }

export default function AncestorChatPanel({ userId }: Props) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [mode, setMode] = useState<Mode>('casual');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFamilyMembers(userId)
      .then(d => setMembers(d.members))
      .catch(() => {})
      .finally(() => setLoadingMembers(false));
  }, [userId]);

  const startChat = (member: FamilyMember, chatMode: Mode) => {
    setSelected(member);
    setMode(chatMode);
    setSessionId(undefined);
    setMessages([]);
  };

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading || !selected) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const modePrefix = mode === 'storytelling' ? 'Tell me a story about: ' : mode === 'wisdom' ? 'Share wisdom about: ' : '';
      const data = await sendChat(userId, `${modePrefix}${msg}`, sessionId, selected.id);
      if (data.session_id) setSessionId(data.session_id);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || "Let me think about that...",
        emotion: data.emotion,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  }, [input, loading, userId, selected, mode, sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // The ancestor speaks in the preserved person's OWN cloned voice when one
  // exists (vault.voice_profiles → registered with the TTS engine); Echo's
  // voice is only the fallback before a clone has been recorded.
  const cloneVoiceRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    getVoiceProfiles(userId)
      .then(d => {
        const ready = (d.profiles || []).find(p => p.clone_status === 'ready' && p.voice_id);
        cloneVoiceRef.current = ready?.voice_id;
      })
      .catch(() => { /* no clone yet — Echo's voice carries the words */ });
  }, [userId]);

  const speakMessage = async (text: string, emotion: string | undefined, idx: number) => {
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      const blob = await synthesizeSpeech(text, emotion, cloneVoiceRef.current);
      await playAudioBlob(blob);
    } catch { /* silent */ }
    setPlayingIdx(null);
  };

  // Member selector + mode picker
  if (!selected) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Ancestor Chat</h2>
        <p className="text-sm" style={{ color: MUTED }}>Choose a family member to have a conversation with their preserved consciousness.</p>

        {loadingMembers ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 rounded-full animate-spin mx-auto" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div className="mb-3 flex justify-center" style={{ color: GOLD_DEEP }}><VaultIcon name="ancestor" size={36} /></div>
            <div className="text-sm mb-4" style={{ color: MUTED }}>No family members yet. Add members in the Family Vault first.</div>
          </div>
        ) : (
          <>
            {/* Family member row */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {members.map(m => (
                <button
                  key={m.id}
                  onClick={() => startChat(m, mode)}
                  className="flex-shrink-0 w-24 text-center group"
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center transition group-hover:brightness-110"
                    style={{ background: BG_CARD2, border: `2px solid ${GOLD_DEEP}`, color: GOLD, fontSize: 18, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                    {initials(m.name)}
                  </div>
                  <div className="text-xs font-semibold truncate" style={{ color: IVORY }}>{m.name}</div>
                  <div className="text-[10px] truncate" style={{ color: MUTED }}>{m.relationship}</div>
                </button>
              ))}
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(MODE_META) as Mode[]).map(m => {
                const on = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="p-4 rounded-2xl text-center transition"
                    style={{
                      background: on ? 'rgba(245,196,81,0.10)' : BG_CARD,
                      border: `1px solid ${on ? 'rgba(245,196,81,0.4)' : BORDER}`,
                    }}
                  >
                    <div className="mb-1.5 flex justify-center" style={{ color: on ? ACCENT : MUTED }}><VaultIcon name={MODE_META[m].icon} size={22} /></div>
                    <div className="text-xs font-semibold" style={{ color: on ? ACCENT : IVORY }}>{MODE_META[m].label}</div>
                    <div className="text-[10px]" style={{ color: MUTED }}>{MODE_META[m].desc}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="rounded-t-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: `linear-gradient(135deg, ${BG_CARD2}, ${BG_INSET})`, border: `1px solid ${BORDER}`, borderBottom: 'none' }}>
          <button onClick={() => setSelected(null)} className="text-sm flex items-center" style={{ color: MUTED }} aria-label="Back"><VaultIcon name="arrow_left" size={18} /></button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BG_CARD, border: `1.5px solid ${GOLD_DEEP}`, color: GOLD, fontSize: 12, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{initials(selected.name)}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: IVORY }}>{selected.name}</div>
            <div className="text-[10px]" style={{ color: MUTED }}>{selected.relationship} &middot; {MODE_META[mode].label} mode</div>
          </div>
          {(selected.birth_date || selected.death_date) && (
            <div className="text-[10px] text-right flex-shrink-0" style={{ color: 'rgba(169,158,139,0.7)' }}>
              {selected.birth_date && <div>Born: {selected.birth_date}</div>}
              {selected.death_date && <div>Passed: {selected.death_date}</div>}
            </div>
          )}
        </div>
        {selected.bio && (
          <div className="px-4 py-2 text-xs italic" style={{ background: BG_INSET, color: MUTED, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${HAIR}` }}>
            {selected.bio.length > 150 ? selected.bio.slice(0, 150) + '...' : selected.bio}
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: BG_CARD, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={m.role === 'user'
                ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }
                : { background: BG_INSET, color: '#e6ddcc', border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  {m.role === 'assistant' && m.emotion && m.emotion !== 'neutral' && (
                    <span className="inline-flex align-middle mr-1.5" style={{ color: ACCENT }}><VaultIcon name={EMOTION_ICONS[m.emotion] || 'chat'} size={13} /></span>
                  )}
                  {m.content}
                </div>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(m.content, m.emotion, i)}
                    disabled={playingIdx !== null}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10"
                    style={{ color: ACCENT }}
                  >
                    {playingIdx === i ? (
                      <span className="block w-3 h-3 rounded-sm animate-pulse" style={{ background: ACCENT }} />
                    ) : (
                      <VaultIcon name="speaker" size={15} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 text-sm" style={{ background: BG_INSET, color: MUTED, border: `1px solid ${BORDER}` }}>
              <span className="animate-pulse">{selected.name} is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-3 rounded-b-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={`Talk to ${selected.name}...`}
          className="flex-1 bg-transparent border rounded-full px-4 py-2 text-sm placeholder-gray-500 outline-none transition"
          style={{ borderColor: BORDER, color: IVORY }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-5 py-2 rounded-full text-sm font-semibold transition disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
