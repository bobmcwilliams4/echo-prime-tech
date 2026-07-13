'use client';

/* ==============================================================================
   ECHO CHAT WIDGET — the floating Echo Prime guide for the Immortality Vault.
   A black + gold chat bubble (bottom-right) on every panel of the app shell.
   ONE runtime: Echo Sentinel Chat (sentinel.echo-op.com). We POST to /answer
   with an inline "Echo" persona + a business_knowledge context tool describing
   the Vault, so answers are on-brand and grounded even though this tenant runs
   engine_id:"NONE" + chat_fallback. Custom fetch (no external <script>) keeps it
   safe under the static-export CSP. Crafted SVG icons — never emoji.
   ============================================================================== */

import { useEffect, useRef, useState } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_CARD2, BG_INSET, BORDER, HAIR, IVORY, MUTED } from '../lib/constants';

const SENTINEL_URL = 'https://sentinel.echo-op.com/answer';

/* Grounding the guide: passed as a context tool on every turn so Echo answers
   about THIS product accurately (Sentinel has no IV corpus of its own). */
const VAULT_KNOWLEDGE =
  'The Immortality Vault is a product by Echo Prime Technologies that preserves a person forever — ' +
  'their real voice (re-created from even a short recording), their stories and memories (gathered through ' +
  'gentle guided interview sessions where Echo asks a couple of questions each day), their personality and ' +
  'mannerisms, and their face and expressions (from on-camera answers). Families can later talk with the ' +
  'preserved person in their own voice, and — as released — face to face. It also traces the whole family ' +
  'bloodline back through the generations, each fact carried with the record that proves it, and can create a ' +
  'memorial narrated in the person\'s own voice. Every recording and memory is encrypted and family-controlled — ' +
  'never sold, never shared. Plans: Keeper ($29/mo, preserve one person), Legacy ($79/mo, up to 5 vaults with ' +
  'daily auto-interviews and biometric capture), Dynasty ($199/mo, unlimited vaults, face-to-face calls, custom ' +
  'memorial films). It was created by Bobby Don McWilliams II for his father, who has Alzheimer\'s, to preserve ' +
  'him before the disease takes his memories.';

const PERSONA = {
  name: 'Echo',
  role: 'Immortality Vault guide',
  tone: 'warm, reverent, plain-spoken',
  greeting: 'I\'m Echo. Ask me anything about your Vault — how it works, preserving a voice, the family bloodline, or the plans.',
  accent_color: '#f5c451',
};

interface Msg { role: 'user' | 'assistant'; content: string }

/* A crafted line-icon chat glyph (no emoji). */
function ChatGlyph({ size = 24, color = '#20160a' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.9 8.9 0 0 1-3.8-.9L3 21l1.9-5.7A8.9 8.9 0 0 1 4 11.5 8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
      <path d="M8.5 10.5h7M8.5 13.5h4.5" />
    </svg>
  );
}
function CloseGlyph({ size = 18, color = '#a99e8b' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function SendGlyph({ size = 18, color = '#20160a' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12l16-8-6 16-3-6-7-2Z" />
    </svg>
  );
}

export default function EchoChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', content: PERSONA.greeting }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const sessionRef = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sessionRef.current) {
      sessionRef.current = `iv-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    }
  }, []);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy, open]);

  const send = async () => {
    const question = input.trim();
    if (!question || busy) return;
    const history = msgs.map(m => ({ role: m.role, content: m.content }));
    setMsgs(prev => [...prev, { role: 'user', content: question }]);
    setInput('');
    setBusy(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000); // Sentinel can take ~45s
    try {
      const res = await fetch(SENTINEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question,
          persona: PERSONA,
          history,
          chat_fallback: true,
          engine_id: 'NONE',
          session_id: sessionRef.current,
          context_tools: [{ name: 'business_knowledge', summary: VAULT_KNOWLEDGE }],
        }),
      });
      if (!res.ok) throw new Error(`Sentinel ${res.status}`);
      const data = await res.json().catch(() => ({}));
      const answer = (data && typeof data.answer === 'string' && data.answer.trim())
        ? data.answer.trim()
        : 'I couldn\'t reach my thoughts just then — please ask me again in a moment.';
      setMsgs(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again in a moment.' }]);
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); }
  };

  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 70, fontFamily: `'Segoe UI', system-ui, sans-serif` }}>
      {open && (
        <div
          style={{
            width: 'min(90vw, 370px)', height: 'min(70vh, 520px)', marginBottom: 12,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: `linear-gradient(180deg, ${BG_CARD2}, ${BG_CARD})`,
            border: `1px solid ${BORDER}`, borderRadius: 18,
            boxShadow: `0 24px 70px -18px rgba(0,0,0,0.85), 0 0 44px -26px ${ACCENT}`,
          }}
        >
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 15px', borderBottom: `1px solid ${HAIR}`, background: BG_INSET }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(120% 120% at 30% 20%, ${GOLD_BRIGHT}, ${GOLD_DEEP})` }}>
              <ChatGlyph size={18} color="#20160a" />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: IVORY, fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>Echo</div>
              <div style={{ color: MUTED, fontSize: 11.5 }}>Your Immortality Vault guide</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}>
              <CloseGlyph />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '86%' }}>
                <div style={{
                  padding: '9px 13px', borderRadius: 14, fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                  ...(m.role === 'user'
                    ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a', borderBottomRightRadius: 5 }
                    : { background: BG_CARD2, color: IVORY, border: `1px solid ${BORDER}`, borderBottomLeftRadius: 5 }),
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '86%' }}>
                <div style={{ padding: '9px 13px', borderRadius: 14, borderBottomLeftRadius: 5, fontSize: 13.5, color: MUTED, background: BG_CARD2, border: `1px solid ${BORDER}`, fontStyle: 'italic' }}>
                  Echo is reflecting…
                </div>
              </div>
            )}
          </div>

          {/* input */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: 12, borderTop: `1px solid ${HAIR}` }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Ask Echo about your Vault…"
              style={{
                flex: 1, resize: 'none', maxHeight: 90, minHeight: 40, padding: '10px 12px',
                background: BG_INSET, border: `1px solid ${BORDER}`, borderRadius: 12,
                color: IVORY, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
              }}
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              aria-label="Send"
              style={{
                flexShrink: 0, width: 42, height: 42, borderRadius: 12, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: GOLD, cursor: busy || !input.trim() ? 'default' : 'pointer',
                opacity: busy || !input.trim() ? 0.45 : 1, transition: 'opacity .15s',
              }}
            >
              <SendGlyph />
            </button>
          </div>
        </div>
      )}

      {/* launcher bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Hide Echo chat' : 'Chat with Echo'}
        style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 58, height: 58, borderRadius: '50%', border: `1px solid ${GOLD_DEEP}`, cursor: 'pointer',
          background: `radial-gradient(130% 130% at 30% 20%, ${GOLD_BRIGHT}, ${GOLD})`,
          boxShadow: `0 12px 34px -10px rgba(0,0,0,0.7), 0 0 30px -8px ${ACCENT}`,
          float: 'right',
        }}
      >
        {open ? <CloseGlyph size={22} color="#20160a" /> : <ChatGlyph size={26} color="#20160a" />}
      </button>
    </div>
  );
}
