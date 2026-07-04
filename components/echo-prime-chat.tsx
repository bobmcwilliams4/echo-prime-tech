'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/auth-context';
import { usePathname } from 'next/navigation';
import { openclawEnrich } from '../lib/echo-sdk-client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  emotion?: string;
}

// 2026-07-03 prod sweep: echo-chat worker /chat 500s and echo-speak-cloud is
// dead (locked CF account). Chat now rides the canonical Echo Sentinel Chat
// runtime (Commander directive 2026-07-02: ONE chat runtime, N personas) and
// TTS rides the sovereign FORGE voice via the auth-less SDK-gate proxy.
const SENTINEL_CHAT_API = 'https://sentinel.echo-op.com';
const SENTINEL_PERSONA = 'echo_ept';
const TTS_API = 'https://forge.echo-op.com/sentinel/tts';
const EPT_API = 'https://ept-api.echo-op.com';
const CHAT_STORAGE_KEY = 'ept_chat_history';
const TRIAL_STORAGE_KEY = 'ept_trial_grants';
const LEAD_STORAGE_KEY = 'ept_lead_info';
const MAX_STORED_MESSAGES = 100;

interface LeadInfo {
  name: string;
  email: string;
  capturedAt: number;
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/engines': 'Engine Catalog',
  '/voice': 'Voice Studio',
  '/security': 'Cyber Defense',
  '/services': 'Professional Services',
  '/tax-returns': 'AI Tax Preparation',
  '/sentinel': 'Sentinel AI',
  '/pricing': 'Pricing',
  '/dashboard': 'Dashboard',
  '/admin': 'Admin',
  '/closer': 'AI Sales Agent',
  '/echocad': 'EchoCAD',
  '/daedalus-forge': 'Daedalus Forge',
  '/hephaestion-forge': 'Hephaestion Forge',
  '/grading': 'AI Collectibles Grading',
  '/immortality-vault': 'Immortality Vault',
  '/knowledge': 'Knowledge Systems',
  '/title-intelligence': 'Title Intelligence',
  '/orchestration': 'Orchestration',
  '/pentesting': 'Penetration Testing',
  '/sandbox': 'AI Sandbox',
  '/bots': 'Custom Bot Factory',
  '/scrapers': 'Scraper & Harvester Factory',
  '/pipelines': 'Data Pipelines',
  '/rewards': 'Rewards Program',
  '/dark-web-intel': 'Dark Web Intelligence',
  '/crypto-trading': 'Crypto Trading',
  '/price-alerts': 'Price & Market Alerts',
  '/reddit': 'Reddit Intelligence',
  '/x-bot': 'X/Twitter Bot',
  '/linkedin': 'LinkedIn AI Engine',
  '/payments': 'Payment Processing',
  '/scanner': 'Security Scanner',
  '/office-ai': 'Office AI Assistant',
  '/ecommerce': 'Ecommerce Store',
  '/websites': 'Website Builder',
  '/county-records': 'County Records Search',
  '/vault': 'Digital Vault',
  '/bree-assistant': 'Bree AI Assistant',
  '/sec-intel': 'Security Intelligence',
  '/sdk': 'Echo SDK Gateway',
  '/about': 'About',
  '/support': 'Support',
  '/login': 'Login',
  '/signup': 'Sign Up',
};

/* Product-specific concierge capabilities — defines what the AI can help with per page */
const CONCIERGE_CAPABILITIES: Record<string, string> = {
  '/closer': 'You are the AI Sales Agent concierge. Help with: managing leads, creating campaigns, writing scripts, analyzing call performance, scheduling follow-ups, optimizing close rates, and managing the full sales pipeline.',
  '/tax-returns': 'You are the Tax AI concierge. Help with: tax preparation questions, document upload guidance, deduction optimization, filing status advice, estimated tax calculations, IRS form explanations, and tax deadline reminders.',
  '/office-ai': 'You are the Office AI concierge. Help with: scheduling appointments, managing invoices, payroll questions, expense tracking, employee management, customer bookings, inventory management, and accounting tasks.',
  '/bree-assistant': 'You are the Bree AI concierge. Help with: appointment booking, service scheduling, customer inquiries, business hours, pricing questions, employee availability, maintenance scheduling, and general business operations.',
  '/grading': 'You are the Collectibles Grading concierge. Help with: grading submissions, condition assessment questions, market valuations, CGC/PSA scale explanations, eBay listing guidance, and collection management.',
  '/title-intelligence': 'You are the Title Intelligence concierge. Help with: chain of title searches, mineral rights questions, deed interpretation, county record lookups, fractional interest calculations, and Texas property law.',
  '/security': 'You are the Cyber Defense concierge. Help with: threat assessments, security monitoring setup, incident response planning, compliance questions, vulnerability management, and security architecture review.',
  '/pentesting': 'You are the Penetration Testing concierge. Help with: scoping engagements, methodology questions, report interpretation, remediation guidance, compliance requirements, and security assessment scheduling.',
  '/payments': 'You are the Payments concierge. Help with: payment processing, invoice creation, PayPal/Stripe integration, billing questions, refund processing, and payment link generation.',
  '/sentinel': 'You are the Sentinel AI concierge. Help with: domain-specific intelligence queries, engine routing, knowledge search, document analysis, and multi-domain research across 5,477 engines.',
  '/engines': 'You are the Engine Catalog concierge. Help with: finding the right engine for a use case, understanding engine domains, doctrine explanations, API integration, and pricing questions.',
  '/sdk': 'You are the SDK Gateway concierge. Help with: API integration, endpoint documentation, authentication setup, code examples, rate limits, and developer onboarding.',
  '/voice': 'You are the Voice Studio concierge. Help with: text-to-speech setup, voice cloning questions, audio quality optimization, language support, and integration guidance.',
  '/crypto-trading': 'You are the Crypto Trading concierge. Help with: trading strategies, market analysis, portfolio management, risk assessment, and exchange integration.',
  '/ecommerce': 'You are the Ecommerce concierge. Help with: product listing, order management, inventory tracking, shipping setup, and storefront customization.',
  '/immortality-vault': 'You are the Immortality Vault concierge. Help with: guided interviews, memory preservation, voice cloning setup, family sharing, and digital legacy planning.',
};

function getPageContext(pathname: string): { service: string; label: string; siteId: string; page: string } {
  if (pathname.startsWith('/closer')) {
    const sub = pathname.replace('/closer', '').replace('/', '');
    return {
      service: 'ai-closer',
      label: sub ? `AI Sales Agent — ${sub.charAt(0).toUpperCase() + sub.slice(1)}` : 'AI Sales Agent',
      siteId: 'echo-ept.com',
      page: pathname,
    };
  }
  const label = PAGE_LABELS[pathname] || PAGE_LABELS[`/${pathname.split('/')[1]}`] || 'Echo Prime';
  return { service: 'platform', label, siteId: 'echo-ept.com', page: pathname };
}

function loadStoredMessages(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return [];
    const msgs: ChatMessage[] = JSON.parse(stored);
    const oneDay = 24 * 60 * 60 * 1000;
    return msgs.filter(m => Date.now() - m.timestamp < oneDay).slice(-MAX_STORED_MESSAGES);
  } catch { return []; }
}

function saveMessages(msgs: ChatMessage[]) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_STORED_MESSAGES)));
  } catch {}
}

function getTrialGrants(): Record<string, number> {
  try {
    const stored = localStorage.getItem(TRIAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function recordTrialGrant(serviceId: string) {
  try {
    const grants = getTrialGrants();
    grants[serviceId] = Date.now();
    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(grants));
  } catch {}
}

function getStoredLead(): LeadInfo | null {
  try {
    const stored = localStorage.getItem(LEAD_STORAGE_KEY);
    if (!stored) return null;
    const lead: LeadInfo = JSON.parse(stored);
    // Lead info valid for 30 days
    if (Date.now() - lead.capturedAt > 30 * 24 * 60 * 60 * 1000) return null;
    return lead;
  } catch { return null; }
}

function storeLead(name: string, email: string) {
  try {
    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify({ name, email, capturedAt: Date.now() }));
  } catch {}
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
  const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load stored lead info on mount
  useEffect(() => {
    const stored = getStoredLead();
    if (stored) setLeadInfo(stored);
  }, []);

  const ctx = getPageContext(pathname);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  // Load stored messages on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const stored = loadStoredMessages();
      if (stored.length > 0) {
        setMessages(stored);
      } else {
        const chatName = user?.displayName?.split(' ')[0] || leadInfo?.name?.split(' ')[0];
        const welcome = ctx.service === 'ai-closer'
          ? `${chatName ? `Hey ${chatName}! ` : ''}I'm Echo Prime — your AI command center. I have full access to your leads, calls, campaigns, and pipeline data. Ask me anything about your sales operation.`
          : `${chatName ? `Hey ${chatName}! ` : ''}I'm Echo Prime — the intelligence behind Echo Prime Technologies. I can help you explore our services, answer questions, or guide you through anything on the platform. What can I do for you?`;
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: welcome,
          timestamp: Date.now(),
          emotion: 'positive',
        }]);
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0 && messages[0].id !== 'welcome') {
      saveMessages(messages);
    } else if (messages.length > 1) {
      saveMessages(messages);
    }
  }, [messages]);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    const onEnded = () => setTtsPlaying(false);
    const onError = () => setTtsPlaying(false);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
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
      // Sovereign FORGE voice (echo-tts-v2 GPU) via the auth-less SDK-gate proxy.
      const res = await fetch(TTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 2000), voice: 'echo', emotion: em }),
      });
      if (!res.ok) return;

      const blob = await res.blob();
      if (blob.size < 100) return;
      const url = URL.createObjectURL(blob);

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = url;
      setTtsPlaying(true);
      await audioRef.current.play();

      audioRef.current.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
    } catch {
      setTtsPlaying(false);
    }
  }, [ttsEnabled]);

  const stopTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTtsPlaying(false);
    }
  }, []);

  const handleTrialGrant = useCallback(async (reply: string) => {
    const match = reply.match(/TRIAL_GRANT:(\S+)/);
    if (!match) return reply;
    const serviceId = match[1];
    recordTrialGrant(serviceId);
    try {
      const token = await getToken();
      if (token) {
        await fetch(`${EPT_API}/api/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ service_ids: [serviceId], trial: true }),
        });
      }
    } catch {}
    return reply.replace(/TRIAL_GRANT:\S+/g, '').trim();
  }, [getToken]);

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
      const displayName = user?.displayName || leadInfo?.name || undefined;

      // OpenClaw enrichment — fetch brain/engine/knowledge context in parallel
      const conciergePrompt = CONCIERGE_CAPABILITIES[pathname] || CONCIERGE_CAPABILITIES[`/${pathname.split('/')[1]}`] || '';
      let enrichment: { brainContext: string[]; engineDoctrines: string[]; knowledgeChunks: string[] } = {
        brainContext: [], engineDoctrines: [], knowledgeChunks: [],
      };
      try {
        const oc = await openclawEnrich(text);
        enrichment = { brainContext: oc.brainContext, engineDoctrines: oc.engineDoctrines, knowledgeChunks: oc.knowledgeChunks };
      } catch { /* enrichment is optional — degrade gracefully */ }

      // Tenant-side context rides as context_tools (Sentinel cites them first).
      const contextTools: { name: string; summary: string }[] = [{
        name: 'page_context',
        summary: `Visitor is on "${ctx.label}" (${ctx.page}) of echo-ept.com.${displayName ? ` Their name is ${displayName}.` : ''}${conciergePrompt ? ` ${conciergePrompt}` : ''}`,
      }];
      if (enrichment.knowledgeChunks.length > 0) {
        contextTools.push({ name: 'knowledge', summary: enrichment.knowledgeChunks.slice(0, 4).join('\n') });
      }
      if (enrichment.engineDoctrines.length > 0) {
        contextTools.push({ name: 'engine_doctrines', summary: enrichment.engineDoctrines.slice(0, 3).join('\n') });
      }

      const res = await fetch(`${SENTINEL_CHAT_API}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          persona: SENTINEL_PERSONA,
          engine_id: 'NONE',
          chat_fallback: true,
          session_id: sessionId,
          domain: 'echo-ept.com',
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          context_tools: contextTools,
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      let reply = data.answer || data.response || data.reply || 'No response.';
      const em = detectEmotion(reply);
      setEmotion(em);

      // Handle trial grants embedded in response
      reply = await handleTrialGrant(reply);

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
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => [...prev, {
        id: `e_${Date.now()}`,
        role: 'assistant',
        content: `Connection error: ${errMsg}. Make sure you're signed in.`,
        timestamp: Date.now(),
        emotion: 'concern',
      }]);
      setEmotion('concern');
    } finally {
      setLoading(false);
    }
  }, [input, loading, ctx, pathname, user, leadInfo, sessionId, messages, playTTS, handleTrialGrant]);

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
    try { localStorage.removeItem(CHAT_STORAGE_KEY); } catch {}
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

          {/* Lead capture for anonymous visitors */}
          {!user && !leadInfo && (
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
              <p style={{ color: 'var(--ept-text)', fontWeight: 600, fontSize: 15 }}>Chat with Echo Prime AI</p>
              <p style={{ color: 'var(--ept-text-muted)', fontSize: 13, textAlign: 'center', lineHeight: 1.5 }}>
                Get instant answers about our AI engines, bots, scrapers, and services. Just enter your info below.
              </p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!leadName.trim() || !leadEmail.trim()) return;
                setLeadSubmitting(true);
                const info: LeadInfo = { name: leadName.trim(), email: leadEmail.trim(), capturedAt: Date.now() };
                storeLead(info.name, info.email);
                setLeadInfo(info);
                // Send lead to ept-api
                try {
                  await fetch(`${EPT_API}/api/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: info.name, email: info.email, source: 'chat_widget', page: ctx.page }),
                  }).catch(() => {});
                } catch {}
                setLeadSubmitting(false);
              }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  placeholder="Your name"
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--ept-border)',
                    backgroundColor: 'var(--ept-surface)',
                    color: 'var(--ept-text)',
                    fontSize: 13,
                    outline: 'none',
                    width: '100%',
                  }}
                />
                <input
                  value={leadEmail}
                  onChange={e => setLeadEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--ept-border)',
                    backgroundColor: 'var(--ept-surface)',
                    color: 'var(--ept-text)',
                    fontSize: 13,
                    outline: 'none',
                    width: '100%',
                  }}
                />
                <button
                  type="submit"
                  disabled={leadSubmitting || !leadName.trim() || !leadEmail.trim()}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    backgroundColor: 'var(--ept-accent)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    border: 'none',
                    cursor: leadSubmitting ? 'default' : 'pointer',
                    opacity: leadSubmitting ? 0.7 : 1,
                  }}
                >
                  {leadSubmitting ? 'Starting...' : 'Start Chatting'}
                </button>
              </form>
              <a href="/login" style={{
                color: 'var(--ept-text-muted)',
                fontSize: 12,
                textDecoration: 'underline',
              }}>
                Already have an account? Sign in
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
