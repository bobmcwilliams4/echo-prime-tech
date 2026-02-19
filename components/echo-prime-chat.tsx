'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/auth-context';
import { usePathname } from 'next/navigation';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  emotion?: string;
}

const CLOSER_API = 'https://billymc-api.bmcii1976.workers.dev';
const EPT_API = 'https://ept-api.bmcii1976.workers.dev';

function getPageContext(pathname: string): { service: string; label: string; api: string; endpoint: string } {
  if (pathname.startsWith('/closer')) {
    const sub = pathname.replace('/closer', '').replace('/', '');
    return {
      service: 'ai-closer',
      label: sub ? `AI Sales Agent — ${sub.charAt(0).toUpperCase() + sub.slice(1)}` : 'AI Sales Agent',
      api: CLOSER_API,
      endpoint: '/chat',
    };
  }
  return {
    service: 'platform',
    label: 'Echo Prime',
    api: EPT_API,
    endpoint: '/api/chat',
  };
}

function detectEmotion(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(great|excellent|perfect|awesome|nice|congrat|well done|impressive)\b/.test(lower)) return 'positive';
  if (/\b(sorry|unfortunately|issue|problem|error|fail|broken)\b/.test(lower)) return 'concern';
  if (/\b(warning|careful|caution|risk|danger|alert)\b/.test(lower)) return 'alert';
  if (/\b(let me|analyzing|processing|checking|looking into)\b/.test(lower)) return 'thinking';
  return 'neutral';
}

const EMOTION_COLORS: Record<string, string> = {
  positive: '#10b981',
  concern: '#f59e0b',
  alert: '#ef4444',
  thinking: '#6366f1',
  neutral: 'var(--ept-accent)',
};

export default function EchoPrimeChat() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ctx = getPageContext(pathname);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = ctx.service === 'ai-closer'
        ? "I'm Echo Prime — your AI command center. I have full access to your leads, calls, campaigns, and pipeline data. Ask me anything about your sales operation."
        : "I'm Echo Prime — the sovereign intelligence behind Echo Prime Technologies. I can help you with any of our services, answer technical questions, or guide you through the platform. What do you need?";
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcome,
        timestamp: Date.now(),
        emotion: 'neutral',
      }]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener('ended', () => setTtsPlaying(false));
    audioRef.current.addEventListener('error', () => setTtsPlaying(false));
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', () => setTtsPlaying(false));
        audioRef.current.removeEventListener('error', () => setTtsPlaying(false));
      }
    };
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const { auth } = await import('../lib/firebase');
      return auth.currentUser ? await auth.currentUser.getIdToken() : null;
    } catch {
      return null;
    }
  }, []);

  const playTTS = useCallback(async (text: string, em: string) => {
    if (!ttsEnabled || !audioRef.current) return;

    try {
      const token = await getToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${EPT_API}/api/tts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, emotion: em }),
      });

      if (!res.ok) return;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Stop any currently playing audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.src = url;
      setTtsPlaying(true);
      await audioRef.current.play();

      // Clean up blob URL after playback
      audioRef.current.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
    } catch {
      setTtsPlaying(false);
    }
  }, [ttsEnabled, getToken]);

  const stopTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTtsPlaying(false);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = await getToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body: Record<string, string> = { message: text };
      if (ctx.service !== 'ai-closer') {
        body.page = pathname;
        body.service_context = ctx.service;
      }

      const res = await fetch(`${ctx.api}${ctx.endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      const reply = data.reply || data.response || data.message || 'No response.';
      const em = data.emotion || detectEmotion(reply);
      setEmotion(em);

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
        emotion: em,
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Auto-play TTS for the response
      playTTS(reply, em);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `e_${Date.now()}`,
        role: 'assistant',
        content: `Connection error: ${err.message}. Make sure you're signed in.`,
        timestamp: Date.now(),
        emotion: 'concern',
      }]);
      setEmotion('concern');
    } finally {
      setLoading(false);
    }
  }, [input, loading, ctx, pathname, getToken, playTTS]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setEmotion('neutral');
    stopTTS();
  };

  const orbColor = EMOTION_COLORS[emotion] || 'var(--ept-accent)';

  return (
    <>
      {/* Floating Orb Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          background: `radial-gradient(circle at 35% 35%, ${orbColor}, rgba(0,0,0,0.8))`,
          boxShadow: `0 0 20px ${orbColor}44, 0 0 40px ${orbColor}22, 0 4px 16px rgba(0,0,0,0.3)`,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'scale(0.9) rotate(180deg)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open Echo Prime AI'}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : ttsPlaying ? (
          /* Animated sound wave icon when TTS is playing */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M12 6v12" style={{ animation: 'soundWave 0.6s ease-in-out infinite alternate' }} />
            <path d="M8 9v6" style={{ animation: 'soundWave 0.6s ease-in-out 0.1s infinite alternate' }} />
            <path d="M16 9v6" style={{ animation: 'soundWave 0.6s ease-in-out 0.2s infinite alternate' }} />
            <path d="M4 11v2" style={{ animation: 'soundWave 0.6s ease-in-out 0.3s infinite alternate' }} />
            <path d="M20 11v2" style={{ animation: 'soundWave 0.6s ease-in-out 0.15s infinite alternate' }} />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            width: 400,
            maxWidth: 'calc(100vw - 48px)',
            height: 520,
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: 16,
            overflow: 'hidden',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--ept-card-bg)',
            border: '1px solid var(--ept-card-border)',
            boxShadow: `0 0 30px ${orbColor}15, 0 8px 32px rgba(0,0,0,0.25)`,
            animation: 'fadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--ept-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `linear-gradient(135deg, var(--ept-surface), var(--ept-card-bg))`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${orbColor}, rgba(0,0,0,0.7))`,
                boxShadow: `0 0 12px ${orbColor}44`,
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', lineHeight: 1.2 }}>
                  Echo Prime
                </div>
                <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', lineHeight: 1.2 }}>
                  {ctx.label} {loading && '— thinking...'} {ttsPlaying && '— speaking...'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* TTS Toggle */}
              <button
                onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsPlaying) stopTTS(); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                  color: ttsEnabled ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                  fontSize: 11, transition: 'color 0.2s',
                }}
                title={ttsEnabled ? 'Mute voice' : 'Enable voice'}
              >
                {ttsEnabled ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </button>
              {/* Stop TTS */}
              {ttsPlaying && (
                <button onClick={stopTTS} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                  color: '#ef4444', fontSize: 11,
                }} title="Stop speaking">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              )}
              {/* Clear Chat */}
              <button onClick={clearChat} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                color: 'var(--ept-text-muted)', fontSize: 11,
              }} title="Clear chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: msg.role === 'user' ? '#fff' : 'var(--ept-text)',
                  backgroundColor: msg.role === 'user'
                    ? 'var(--ept-accent)'
                    : 'var(--ept-surface)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--ept-border)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 3, paddingLeft: 4, alignItems: 'center' }}>
                    {msg.emotion && msg.emotion !== 'neutral' && (
                      <span style={{
                        fontSize: 10,
                        color: EMOTION_COLORS[msg.emotion] || 'var(--ept-text-muted)',
                        textTransform: 'capitalize',
                      }}>
                        {msg.emotion}
                      </span>
                    )}
                    {/* Replay TTS button */}
                    {ttsEnabled && msg.id !== 'welcome' && (
                      <button
                        onClick={() => playTTS(msg.content, msg.emotion || 'neutral')}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                          color: 'var(--ept-text-muted)', opacity: 0.6, transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                        title="Replay voice"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{
                display: 'flex',
                gap: 4,
                padding: '10px 14px',
                alignSelf: 'flex-start',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--ept-accent)', opacity: 0.6, animation: 'pulse 1.2s ease-in-out infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--ept-accent)', opacity: 0.6, animation: 'pulse 1.2s ease-in-out 0.2s infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--ept-accent)', opacity: 0.6, animation: 'pulse 1.2s ease-in-out 0.4s infinite' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 14px',
            borderTop: '1px solid var(--ept-border)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            backgroundColor: 'var(--ept-card-bg)',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ctx.service === 'ai-closer' ? 'Ask about leads, calls, pipeline...' : 'Ask Echo Prime anything...'}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--ept-border)',
                backgroundColor: 'var(--ept-surface)',
                color: 'var(--ept-text)',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--ept-accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--ept-border)'}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: 'none',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                backgroundColor: loading || !input.trim() ? 'var(--ept-surface)' : 'var(--ept-accent)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: loading || !input.trim() ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Sign in prompt if no user */}
          {!user && (
            <div style={{
              position: 'absolute',
              inset: 0,
              top: 52,
              backgroundColor: 'var(--ept-card-bg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 24,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, var(--ept-accent), rgba(0,0,0,0.7))`,
                boxShadow: '0 0 20px var(--ept-accent-glow)',
              }} />
              <p style={{ color: 'var(--ept-text)', fontWeight: 600, fontSize: 15 }}>Sign in to chat with Echo Prime</p>
              <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, textAlign: 'center' }}>
                Get AI-powered assistance across all Echo Prime Technologies services.
              </p>
              <a href="/login" style={{
                padding: '10px 24px',
                borderRadius: 10,
                backgroundColor: 'var(--ept-accent)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
              }}>
                Sign In
              </a>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes soundWave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.2); }
        }
      `}</style>
    </>
  );
}
