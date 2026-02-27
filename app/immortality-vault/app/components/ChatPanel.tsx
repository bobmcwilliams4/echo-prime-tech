'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ACCENT, BG_CARD, BORDER, EMOTION_ICONS } from '../lib/constants';
import { sendChat, synthesizeSpeech, type ChatMessage } from '../lib/vault-api';
import { playAudioBlob } from '../lib/media';

interface Props {
  userId: string;
}

export default function ChatPanel({ userId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const data = await sendChat(userId, msg);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || "I'm reflecting on what you've shared. Could you tell me more?",
        emotion: data.emotion,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  }, [input, loading, userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const speakMessage = async (text: string, emotion: string | undefined, idx: number) => {
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      const blob = await synthesizeSpeech(text, emotion);
      await playAudioBlob(blob);
    } catch {
      // TTS unavailable — silent fail
    }
    setPlayingIdx(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-2 px-4 py-3 rounded-t-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <span className="text-white font-semibold text-sm">Consciousness Active</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ background: BG_CARD, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-purple-600 text-white' : 'text-gray-200'
              }`}
              style={m.role === 'assistant' ? { background: '#1e1e2e' } : undefined}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  {m.role === 'assistant' && m.emotion && m.emotion !== 'neutral' && (
                    <span className="inline-block mr-1 px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#ffffff10' }}>
                      {EMOTION_ICONS[m.emotion] || '\u{1F4AC}'} {m.emotion}
                    </span>
                  )}
                  <span>{m.content}</span>
                </div>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(m.content, m.emotion, i)}
                    disabled={playingIdx !== null}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition hover:bg-white/10"
                    title="Listen"
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
              <span className="animate-pulse">Reflecting...</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 p-3 rounded-b-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask me anything..."
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
