'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, BG_CARD, BG_INSET, BORDER, IVORY, MUTED, EMOTION_ICONS } from '../lib/constants';
import { sendChat, synthesizeSpeech, getConsciousnessState, type ChatMessage, type ConsciousnessStateType } from '../lib/vault-api';
import { playAudioBlob } from '../lib/media';
import VaultIcon from './VaultIcon';

interface Props {
  userId: string;
}

export default function ChatPanel({ userId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessStateType>('DORMANT');
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioCacheRef = useRef<Map<number, Blob>>(new Map());

  const speakFromBlob = useCallback(async (blob: Blob, idx: number) => {
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      await playAudioBlob(blob);
    } catch {
      // playback failed — silent
    }
    setPlayingIdx(null);
  }, [playingIdx]);

  const generateAndSpeak = useCallback(async (text: string, emotion: string | undefined, idx: number) => {
    const cached = audioCacheRef.current.get(idx);
    if (cached) {
      await speakFromBlob(cached, idx);
      return;
    }
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      const blob = await synthesizeSpeech(text, emotion);
      audioCacheRef.current.set(idx, blob);
      await playAudioBlob(blob);
    } catch {
      // TTS unavailable — silent fail
    }
    setPlayingIdx(null);
  }, [playingIdx, speakFromBlob]);

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    const userIdx = messages.length;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const data = await sendChat(userId, msg);
      const responseText = data.response || "I'm reflecting on what you've shared. Could you tell me more?";
      const emotion = data.emotion;
      const assistantIdx = userIdx + 1;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseText,
        emotion,
      }]);
      // Auto-play TTS for the new assistant message if enabled
      if (autoPlay) {
        synthesizeSpeech(responseText, emotion)
          .then(blob => {
            audioCacheRef.current.set(assistantIdx, blob);
            return playAudioBlob(blob);
          })
          .catch(() => {});
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  }, [input, loading, userId, messages.length, autoPlay]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    getConsciousnessState(userId).then(d => setConsciousnessState(d.state)).catch(() => {});
  }, [userId]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {(() => {
        const stateConfig: Record<ConsciousnessStateType, { color: string; pulse: boolean; label: string }> = {
          DORMANT: { color: '#a99e8b', pulse: false, label: 'Consciousness Dormant' },
          LEARNING: { color: '#e6c060', pulse: true, label: 'Learning...' },
          ACTIVE: { color: '#f5c451', pulse: true, label: 'Consciousness Active' },
          INTERVIEWING: { color: '#d8b25a', pulse: true, label: 'Interview Mode' },
          CONVERSING: { color: '#ffe08a', pulse: true, label: 'In Conversation' },
        };
        const cfg = stateConfig[consciousnessState];
        return (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${BG_CARD}, ${BG_INSET})`, border: `1px solid ${BORDER}`, borderBottom: 'none' }}>
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.pulse ? 'animate-pulse' : ''}`} style={{ background: cfg.color, boxShadow: `0 0 10px ${cfg.color}` }} />
            <span className="font-semibold text-sm" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
        );
      })()}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ background: BG_CARD, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}
      >
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
                    <span className="inline-flex items-center gap-1 mr-1 px-1.5 py-0.5 rounded text-[10px] align-middle" style={{ background: 'rgba(245,196,81,0.12)', color: ACCENT }}>
                      <VaultIcon name={EMOTION_ICONS[m.emotion] || 'chat'} size={11} /> {m.emotion}
                    </span>
                  )}
                  <span>{m.content}</span>
                </div>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => generateAndSpeak(m.content, m.emotion, i)}
                    disabled={playingIdx !== null}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition hover:bg-white/10"
                    style={{ color: ACCENT }}
                    title="Listen"
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
              <span className="animate-pulse">Reflecting...</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-3 rounded-b-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={() => setAutoPlay(p => !p)}
            className="flex items-center gap-1.5 text-[11px] rounded-full px-2.5 py-1 transition"
            style={{
              background: autoPlay ? 'rgba(245,196,81,0.14)' : 'transparent',
              border: `1px solid ${autoPlay ? ACCENT : BORDER}`,
              color: autoPlay ? ACCENT : MUTED,
            }}
            title={autoPlay ? 'Auto-play TTS is ON' : 'Auto-play TTS is OFF'}
          >
            <VaultIcon name={autoPlay ? 'speaker' : 'camera_off'} size={13} />
            Auto-play voice
          </button>
        </div>
        <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask me anything..."
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
    </div>
  );
}
