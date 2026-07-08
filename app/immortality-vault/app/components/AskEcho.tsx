'use client';

/* Immortality Vault — "Ask Echo anything".
   Echo the guide converses: the user types OR speaks a question, Echo answers
   in his own voice (grounded vault_guide persona) and the reply is shown +
   spoken. Distinct from the preserved-person chat. Every reply is a single
   request (no request storm); speech is always kicked off by the Send gesture,
   so browser autoplay never blocks Echo's voice. */

import { useCallback, useRef, useState, useEffect } from 'react';
import { askGuide, synthesizeSpeech, type ChatMessage } from '../lib/vault-api';
import { GOLD, BORDER, BG_CARD } from '../lib/constants';

const IVORY = '#ece3d2';
const MUTED = '#9c9081';

function Icon({ path, size = 18 }: { path: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {path}
    </svg>
  );
}
const MicIcon = <><path d="M12 3a2.6 2.6 0 0 0-2.6 2.6v5.8a2.6 2.6 0 0 0 5.2 0V5.6A2.6 2.6 0 0 0 12 3Z" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21" /></>;
const SendIcon = <><path d="M12 20V5" /><path d="M5 12l7-7 7 7" /></>;
const SpeakerIcon = <><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M17 8a5 5 0 0 1 0 8" /></>;
const SparkIcon = <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />;

interface Turn { role: 'user' | 'echo'; text: string; }

export default function AskEcho() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [sttOk, setSttOk] = useState(true);
  const sessionRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastUrl = useRef<string | null>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSttOk(false); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e: any) => {
      const t = e.results?.[0]?.[0]?.transcript;
      if (t) setQ(prev => (prev ? prev.trimEnd() + ' ' : '') + t.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => { try { rec.stop(); } catch { /* noop */ } };
  }, []);

  // Clean up audio + blob URL on unmount.
  useEffect(() => () => {
    try { audioRef.current?.pause(); } catch { /* noop */ }
    if (lastUrl.current) { try { URL.revokeObjectURL(lastUrl.current); } catch { /* noop */ } }
  }, []);

  const speak = useCallback(async (text: string) => {
    setSpeaking(true);
    try {
      const blob = await synthesizeSpeech(text, 'warmth');
      if (!audioRef.current) { audioRef.current = new Audio(); }
      const a = audioRef.current;
      if (lastUrl.current) { try { URL.revokeObjectURL(lastUrl.current); } catch { /* noop */ } }
      const url = URL.createObjectURL(blob);
      lastUrl.current = url;
      a.src = url;
      await a.play(); // called on the Send/replay gesture → allowed
    } catch { /* voice is a bonus; the text is always shown */ }
    setSpeaking(false);
  }, []);

  const toggleMic = () => {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) { try { rec.stop(); } catch { /* noop */ } setListening(false); }
    else { try { rec.start(); setListening(true); } catch { /* already running */ } }
  };

  const send = useCallback(async () => {
    const question = q.trim();
    if (!question || busy) return;
    setBusy(true);
    setQ('');
    try { recRef.current?.stop(); } catch { /* noop */ }
    setTurns(prev => [...prev, { role: 'user', text: question }]);
    const history: ChatMessage[] = turns.slice(-8).map(t => ({ role: t.role === 'user' ? 'user' : 'assistant', content: t.text }));
    try {
      const r = await askGuide(question, history, sessionRef.current || undefined);
      sessionRef.current = r.session_id;
      setTurns(prev => [...prev, { role: 'echo', text: r.answer }]);
      speak(r.answer);
    } catch {
      setTurns(prev => [...prev, { role: 'echo', text: 'I had trouble answering just then — please try again in a moment.' }]);
    }
    setBusy(false);
  }, [q, busy, turns, speak]);

  return (
    <div style={{ maxWidth: 640, margin: '28px auto 0' }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto', padding: '11px 20px', borderRadius: 999, border: `1px solid ${GOLD}55`, background: 'transparent', color: GOLD, fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}
        >
          <span style={{ color: GOLD, display: 'flex' }}><Icon path={SparkIcon} size={17} /></span>
          Ask Echo anything
        </button>
      ) : (
        <div style={{ background: BG_CARD, border: `1px solid ${GOLD}33`, borderRadius: 18, padding: '18px 18px 16px', boxShadow: '0 10px 40px rgba(0,0,0,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: GOLD, fontSize: 14, fontWeight: 600, letterSpacing: '0.02em' }}>
              <Icon path={SparkIcon} size={16} /> Ask Echo
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'transparent', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>&#215;</button>
          </div>

          {turns.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14, maxHeight: 320, overflowY: 'auto' }}>
              {turns.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: t.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '86%', padding: '10px 14px', borderRadius: 14, fontSize: 14.5, lineHeight: 1.55,
                    background: t.role === 'user' ? `${GOLD}1c` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${t.role === 'user' ? GOLD + '3a' : BORDER}`,
                    color: t.role === 'user' ? IVORY : IVORY }}>
                    {t.role === 'echo' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Echo</div>
                    )}
                    <span>{t.text}</span>
                    {t.role === 'echo' && (
                      <button onClick={() => speak(t.text)} disabled={speaking} title="Hear it again"
                        style={{ marginLeft: 8, verticalAlign: 'middle', background: 'transparent', border: 'none', color: GOLD, cursor: 'pointer', opacity: speaking ? 0.5 : 0.85, display: 'inline-flex' }}>
                        <Icon path={SpeakerIcon} size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <textarea
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about the Vault, the process, or who made it…"
              rows={1}
              style={{ flex: 1, resize: 'none', background: 'rgba(0,0,0,0.25)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '11px 13px', color: IVORY, fontSize: 14.5, lineHeight: 1.4, outline: 'none', fontFamily: 'inherit' }}
            />
            {sttOk && (
              <button onClick={toggleMic} title={listening ? 'Stop' : 'Speak your question'}
                style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${listening ? GOLD : BORDER}`, background: listening ? GOLD : 'transparent', color: listening ? '#0a0807' : GOLD }}>
                <Icon path={MicIcon} size={19} />
              </button>
            )}
            <button onClick={send} disabled={busy || !q.trim()} title="Send"
              style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, cursor: busy || !q.trim() ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: GOLD, color: '#0a0807', opacity: busy || !q.trim() ? 0.45 : 1 }}>
              <Icon path={busy ? <path d="M12 3a9 9 0 1 0 9 9" /> : SendIcon} size={19} />
            </button>
          </div>
          {busy && <div style={{ marginTop: 8, fontSize: 12.5, color: MUTED }}>Echo is thinking…</div>}
        </div>
      )}
    </div>
  );
}
