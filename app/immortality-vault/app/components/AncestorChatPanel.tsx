'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ACCENT, BG_CARD, BORDER, EMOTION_ICONS } from '../lib/constants';
import { sendChat, synthesizeSpeech, getFamilyMembers, type ChatMessage, type FamilyMember } from '../lib/vault-api';
import { playAudioBlob } from '../lib/media';

interface Props {
  userId: string;
}

type Mode = 'casual' | 'storytelling' | 'wisdom';

const MODE_META: Record<Mode, { label: string; icon: string; desc: string }> = {
  casual: { label: 'Casual', icon: '\u{1F4AC}', desc: 'Everyday conversation' },
  storytelling: { label: 'Storytelling', icon: '\u{1F4D6}', desc: 'Hear their stories' },
  wisdom: { label: 'Wisdom', icon: '\u{1F9E0}', desc: 'Life lessons & advice' },
};

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
    setMessages([{
      role: 'assistant',
      content: chatMode === 'storytelling'
        ? `Hello, it's ${member.name} here. What story would you like to hear?`
        : chatMode === 'wisdom'
        ? `This is ${member.name}. What wisdom would you like me to share today?`
        : `Hey there! It's ${member.name}. What's on your mind?`,
      emotion: 'warmth',
    }]);
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

  const speakMessage = async (text: string, emotion: string | undefined, idx: number) => {
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      const blob = await synthesizeSpeech(text, emotion);
      await playAudioBlob(blob);
    } catch { /* silent */ }
    setPlayingIdx(null);
  };

  // Member selector + mode picker
  if (!selected) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Ancestor Chat</h2>
        <p className="text-sm text-gray-400">Choose a family member to have a conversation with their preserved consciousness.</p>

        {loadingMembers ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 rounded-xl text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-4xl mb-3">{'\u{1F54A}\u{FE0F}'}</div>
            <div className="text-sm text-gray-400 mb-4">No family members yet. Add members in the Family Vault first.</div>
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
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl transition group-hover:ring-2 group-hover:ring-purple-500" style={{ background: '#1e1e2e', border: `2px solid ${BORDER}` }}>
                    {'\u{1F464}'}
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{m.name}</div>
                  <div className="text-[10px] text-gray-500 truncate">{m.relationship}</div>
                </button>
              ))}
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(MODE_META) as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="p-4 rounded-xl text-center transition"
                  style={{
                    background: mode === m ? '#7c3aed20' : BG_CARD,
                    border: `1px solid ${mode === m ? '#7c3aed60' : BORDER}`,
                  }}
                >
                  <div className="text-2xl mb-1">{MODE_META[m].icon}</div>
                  <div className="text-xs font-bold text-white">{MODE_META[m].label}</div>
                  <div className="text-[10px] text-gray-500">{MODE_META[m].desc}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 px-4 py-3 rounded-t-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
        <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white text-sm">&larr;</button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: '#ffffff20' }}>{'\u{1F464}'}</div>
        <div>
          <div className="text-white font-semibold text-sm">{selected.name}</div>
          <div className="text-white/60 text-[10px]">{selected.relationship} &middot; {MODE_META[mode].label} mode</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: BG_CARD, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-purple-600 text-white' : 'text-gray-200'}`}
              style={m.role === 'assistant' ? { background: '#1e1e2e' } : undefined}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  {m.role === 'assistant' && m.emotion && m.emotion !== 'neutral' && (
                    <span className="mr-1">{EMOTION_ICONS[m.emotion] || '\u{1F4AC}'}</span>
                  )}
                  {m.content}
                </div>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(m.content, m.emotion, i)}
                    disabled={playingIdx !== null}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10"
                  >
                    {playingIdx === i ? (
                      <span className="block w-3 h-3 rounded-sm animate-pulse" style={{ background: ACCENT }} />
                    ) : (
                      <span className="text-xs">{'\u{1F50A}'}</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 text-sm text-gray-400" style={{ background: '#1e1e2e' }}>
              <span className="animate-pulse">{selected.name} is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-3 rounded-b-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={`Talk to ${selected.name}...`}
          className="flex-1 bg-transparent border rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition"
          style={{ borderColor: BORDER }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-5 py-2 rounded-full text-sm font-semibold text-white transition disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
