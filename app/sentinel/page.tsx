'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { chatSentinelBrain } from '../../lib/sentinel-brain-api';
import {
  brainIngest,
  detectEmotion,
  buildPersonalityDirective,
  PERSONALITY_PROFILES,
  isCommander,
} from '../../lib/sentinel-cloud-api';

// Lazy-load 3D scene (no SSR — WebGL)
const NebulaCoreScene = dynamic(
  () => import('../../components/three/NebulaCoreScene'),
  { ssr: false }
);

// ── Types ──

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  personality?: string;
  emotion?: string;
  provider?: string;
  latency?: number;
  voicePlayed?: boolean;
}

interface PipelineEvent {
  pipeline: string;
  data: Record<string, string>;
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

// ── Constants ──

const AGENT_URL = 'https://echo-sentinel-agent.bmcii1976.workers.dev';
const ECHO_CHAT_URL = 'https://echo-chat.bmcii1976.workers.dev';
const MODEL_HOST_URL = 'https://echo-model-host.bmcii1976.workers.dev';
const STORAGE_KEY = 'sentinel_chat_v2';
const MAX_STORED = 100;

const DOMAIN_CHIPS = [
  { label: 'Tax', icon: '📊', hint: 'Tax planning, audit defense, compliance', model: 'taxlaw' },
  { label: 'Landman', icon: '🗺️', hint: 'Title chain, mineral rights, leases', model: 'landman' },
  { label: 'Legal', icon: '⚖️', hint: 'Contracts, litigation, compliance', model: 'legal' },
  { label: 'Cyber', icon: '🔒', hint: 'Threats, pentesting, forensics', model: 'cyber' },
  { label: 'Engineering', icon: '⚙️', hint: 'Mechanical, structural, design', model: 'engineering' },
  { label: 'Medical', icon: '🏥', hint: 'Clinical, research, pharmacology', model: 'medical' },
  { label: 'Oil & Gas', icon: '🛢️', hint: 'Drilling, production, completions', model: 'oilgas' },
  { label: 'Finance', icon: '💰', hint: 'Markets, valuation, accounting', model: 'auto' },
  { label: 'Software', icon: '💻', hint: 'Architecture, DevOps, AI/ML', model: 'software' },
  { label: 'Intelligence', icon: '🕵️', hint: 'OSINT, reconnaissance, research', model: 'auto' },
];

const FINE_TUNED_MODELS = [
  { id: 'auto', label: 'Auto (Sentinel Brain)', desc: 'Claude Opus 4.6 + Groq fallback' },
  { id: 'landman', label: 'Landman / TitleHound', desc: 'Chain of title, mineral rights, title examination' },
  { id: 'taxlaw', label: 'Tax Law', desc: 'IRC, partnerships, oil & gas taxation' },
  { id: 'legal', label: 'Legal', desc: 'Contracts, litigation, regulatory compliance' },
  { id: 'realestate', label: 'Real Estate', desc: 'Property law, title issues, zoning' },
  { id: 'cyber', label: 'Cybersecurity', desc: 'Threat analysis, incident response' },
  { id: 'medical', label: 'Medical', desc: 'Clinical analysis, pharmacology' },
  { id: 'engineering', label: 'Engineering', desc: 'Mechanical, structural, design' },
  { id: 'energy', label: 'Energy', desc: 'Nuclear, renewable, grid systems' },
  { id: 'software', label: 'Software', desc: 'Architecture, DevOps, AI/ML' },
  { id: 'oilgas', label: 'Oil & Gas', desc: 'Drilling, production, completions' },
];

// ── Helpers ──

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Message[];
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_STORED)));
  } catch { /* quota exceeded */ }
}

function detectPipelineReady(text: string): PipelineEvent | null {
  const match = text.match(/\[PIPELINE_READY:(\w+)\]\s*(\{.*?\})/);
  if (!match) return null;
  try {
    return { pipeline: match[1], data: JSON.parse(match[2]) };
  } catch {
    return null;
  }
}

function stripPipelineTokens(text: string): string {
  return text.replace(/\[PIPELINE_READY:\w+\]\s*\{.*?\}/g, '').trim();
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Main Component ──

export default function SentinelPage() {
  const router = useRouter();
  const { user, loading, role } = useAuth();
  const { isDark, toggle } = useTheme();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // Model state
  const [selectedModel, setSelectedModel] = useState('auto');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [lastSearchResults, setLastSearchResults] = useState<SearchResult[]>([]);
  const [lastToolsUsed, setLastToolsUsed] = useState<string[]>([]);

  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [listening, setListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const commander = user ? isCommander(user.email || '') : false;

  // ── Close model dropdown on outside click ──
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!modelDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [modelDropdownOpen]);

  // ── Auth guard ──
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // ── Load messages from localStorage ──
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) setMessages(stored);
  }, []);

  // ── Persist messages ──
  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  // ── Auto-scroll ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Speech recognition setup ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      }
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  // ── Voice playback ──
  const playVoice = useCallback(async (text: string, msgId: string) => {
    if (voicePlaying) return;
    setVoicePlaying(true);
    try {
      const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/\[.*?\]/g, '').slice(0, 2000);
      const res = await fetch(`${ECHO_CHAT_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          personality: 'EP',
          emotion: 'neutral',
          provider: 'elevenlabs',
        }),
      });
      if (!res.ok) throw new Error(`TTS error: ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      let audioUrl: string;
      if (contentType.includes('audio') || contentType.includes('octet-stream')) {
        // TTS returns raw audio bytes (MP3)
        const blob = await res.blob();
        audioUrl = URL.createObjectURL(blob);
      } else {
        // Fallback: JSON response with base64
        const data = await res.json();
        if (!data.audio_base64) throw new Error('No audio data');
        audioUrl = `data:${data.content_type || 'audio/mpeg'};base64,${data.audio_base64}`;
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setVoicePlaying(false);
        if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setVoicePlaying(false);
        if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, voicePlayed: true } : m));
    } catch {
      setVoicePlaying(false);
    }
  }, [voicePlaying]);

  // ── Toggle microphone ──
  const toggleMic = useCallback(() => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening]);

  // ── Send message ──
  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;

    setInput('');
    setSending(true);
    setLastSearchResults([]);
    setLastToolsUsed([]);

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: msg,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);

    const history = messages.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    const personality = PERSONALITY_PROFILES['EP'] || Object.values(PERSONALITY_PROFILES)[0];
    const systemPrompt = buildPersonalityDirective(personality);

    let responseText = '';
    let provider = 'echo-chat';
    let latency = 0;
    const startTime = Date.now();

    const showThinking = () => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '...') return prev;
        return [...prev, {
          id: 'thinking',
          role: 'assistant' as const,
          content: '...',
          timestamp: Date.now(),
        }];
      });
    };

    if (selectedModel !== 'auto') {
      // ── Fine-tuned model path (still direct) ──
      showThinking();
      try {
        const modelRes = await fetch(`${MODEL_HOST_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026' },
          signal: AbortSignal.timeout(20000),
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content: msg },
            ],
            max_tokens: 2048,
            temperature: 0.7,
          }),
        });
        if (modelRes.ok) {
          const modelData = await modelRes.json();
          const choice = modelData.choices?.[0];
          responseText = choice?.message?.content || choice?.text || '';
          const modelMeta = FINE_TUNED_MODELS.find(m => m.id === selectedModel);
          provider = `${modelMeta?.label || selectedModel} (fine-tuned)`;
          latency = modelData.timing?.total_seconds ? modelData.timing.total_seconds * 1000 : (Date.now() - startTime);
        }
      } catch { /* fall through */ }
    }

    if (!responseText) {
      // ── Step 1: Get enriched context from Agent (search + knowledge + files) ──
      let enrichedSystemPrompt = systemPrompt;
      showThinking();
      try {
        const agentRes = await fetch(`${AGENT_URL}/agent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({ message: msg }),
        });
        if (agentRes.ok) {
          const agentData = await agentRes.json();
          if (agentData.enriched_context) {
            enrichedSystemPrompt = agentData.enriched_context;
          }
          if (agentData.search_results?.length) setLastSearchResults(agentData.search_results);
          if (agentData.knowledge_results?.length) {
            setLastSearchResults(prev => [...prev, ...agentData.knowledge_results]);
          }
          if (agentData.tools_used?.length) setLastToolsUsed(agentData.tools_used);
        }
      } catch { /* agent down — continue with base prompt */ }

      // ── Step 2: Try Sentinel Brain (Claude Opus 4.6 via tunnel) ──
      try {
        const brainResult = await chatSentinelBrain(msg, enrichedSystemPrompt, history, (status) => {
          if (status === 'processing') showThinking();
        });
        if (brainResult.response && brainResult.response.length > 10) {
          responseText = brainResult.response;
          provider = `sentinel-brain → opus-4.6`;
          latency = brainResult.duration_ms;
        }
      } catch { /* brain down — proceed to cloud fallbacks */ }

      // ── Step 3: Echo Chat with full context (primary cloud fallback) ──
      if (!responseText) {
        try {
          const chatRes = await fetch(`${ECHO_CHAT_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026',
            },
            signal: AbortSignal.timeout(30000),
            body: JSON.stringify({
              message: msg,
              user_id: user?.uid || 'sentinel_web',
              site_id: 'echo-ept',
              system_prompt: enrichedSystemPrompt,
              history: history.slice(-6),
              personality: 'EP',
              max_tokens: 2048,
            }),
          });
          if (chatRes.ok) {
            const chatData = await chatRes.json();
            responseText = chatData.response || chatData.message || '';
            provider = `echo-chat → ${chatData.llm_provider || chatData.model || 'auto'}`;
            latency = chatData.latency_ms || (Date.now() - startTime);
          }
        } catch { /* fall through */ }
      }

      // ── Step 4: Groq fast fallback ──
      if (!responseText) {
        try {
          const groqRes = await fetch(`${ECHO_CHAT_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026',
            },
            signal: AbortSignal.timeout(15000),
            body: JSON.stringify({
              message: msg,
              user_id: user?.uid || 'sentinel_web',
              site_id: 'echo-ept',
              system_prompt: enrichedSystemPrompt,
              history: history.slice(-4),
              model: 'groq',
              personality: 'EP',
              max_tokens: 2048,
            }),
          });
          if (groqRes.ok) {
            const groqData = await groqRes.json();
            responseText = groqData.response || groqData.message || '';
            provider = 'echo-chat → groq';
          }
        } catch { /* fall through */ }
      }

      // ── Step 5: Absolute last resort ──
      if (!responseText) {
        responseText = 'I\'m experiencing connectivity issues with my backend services. Please try again in a moment, or try selecting a specific model from the dropdown above.';
        provider = 'offline';
      }
    }

    latency = latency || (Date.now() - startTime);

    setMessages(prev => prev.filter(m => m.id !== 'thinking'));

    const pipeline = detectPipelineReady(responseText);
    const cleanResponse = stripPipelineTokens(responseText);

    let emotion = 'neutral';
    try {
      const detected = detectEmotion(cleanResponse);
      emotion = detected.dominant;
    } catch { /* ignore */ }

    const assistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: cleanResponse,
      timestamp: Date.now(),
      personality: 'Echo Prime',
      emotion,
      provider,
      latency,
    };

    setMessages(prev => [...prev, assistantMsg]);

    if (voiceEnabled && cleanResponse.length < 2000) {
      playVoice(cleanResponse, assistantMsg.id);
    }

    if (pipeline) {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'system',
        content: `Pipeline triggered: ${pipeline.pipeline} with data: ${JSON.stringify(pipeline.data)}`,
        timestamp: Date.now(),
      }]);
    }

    brainIngest('sentinel_chat', `[user] ${msg}`, 5, ['sentinel', 'chat']).catch(() => {});
    brainIngest('sentinel_chat', `[assistant] ${cleanResponse.slice(0, 500)}`, 5, ['sentinel', 'chat']).catch(() => {});

    setSending(false);
  }, [input, sending, messages, selectedModel, voiceEnabled, playVoice]);

  // ── Clear chat ──
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // ── Handle keyboard ──
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // ── Handle domain chip click ──
  const handleChipClick = useCallback((label: string) => {
    const chip = DOMAIN_CHIPS.find(c => c.label === label);
    if (chip && chip.model !== 'auto') {
      setSelectedModel(chip.model);
    }
    const starters: Record<string, string> = {
      'Tax': 'I need help with a tax question. ',
      'Landman': 'I need a title chain analysis. ',
      'Legal': 'I have a legal question. ',
      'Cyber': 'I need cybersecurity analysis. ',
      'Engineering': 'I have an engineering question. ',
      'Medical': 'I have a medical question. ',
      'Oil & Gas': 'I need oilfield operations analysis. ',
      'Finance': 'I have a finance question. ',
      'Software': 'I need software engineering help. ',
      'Intelligence': 'I need intelligence research. ',
    };
    setInput(starters[label] || `I need help with ${label}. `);
    inputRef.current?.focus();
  }, []);

  // ── Loading / Auth check ──
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#050508' }}>
      {/* ── 3D Nebula Orb Background ── */}
      <div className="absolute inset-0 z-0">
        <NebulaCoreScene
          isSpeaking={voicePlaying}
          isThinking={sending}
        />
      </div>

      {/* ── Gradient overlay for readability ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: hasMessages
            ? 'linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, rgba(5,5,8,0.7) 30%, rgba(5,5,8,0.85) 60%, rgba(5,5,8,0.95) 100%)'
            : 'linear-gradient(to bottom, rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.3) 50%, rgba(5,5,8,0.7) 100%)',
        }}
      />

      {/* ── Nav Bar ── */}
      <header
        className="relative z-10 border-b px-4 md:px-6 py-3 flex items-center justify-between shrink-0"
        style={{
          borderColor: 'rgba(30,41,59,0.5)',
          backgroundColor: 'rgba(5,5,8,0.6)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="Echo Prime"
              width={32}
              height={32}
              style={{ mixBlendMode: 'screen' }}
            />
          </Link>
          <h1 className="text-lg font-bold text-white">
            Sentinel AI
          </h1>
          {commander && (
            <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              CMDR
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Model selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
              style={{
                borderColor: selectedModel !== 'auto' ? 'var(--ept-accent)' : 'rgba(100,116,139,0.4)',
                backgroundColor: selectedModel !== 'auto' ? 'var(--ept-accent)' : 'rgba(15,23,42,0.6)',
                color: selectedModel !== 'auto' ? '#fff' : '#94a3b8',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              {FINE_TUNED_MODELS.find(m => m.id === selectedModel)?.label || 'Auto'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {modelDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-64 rounded-xl border shadow-xl overflow-hidden z-50"
                style={{ backgroundColor: 'rgba(12,18,32,0.95)', borderColor: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(16px)' }}
              >
                <div className="p-2 text-xs font-semibold border-b" style={{ color: '#64748b', borderColor: 'rgba(30,41,59,0.4)' }}>
                  Fine-Tuned Models (Qwen2.5-7B)
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {FINE_TUNED_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setModelDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between hover:bg-white/5"
                      style={{
                        backgroundColor: selectedModel === m.id ? 'rgba(20,184,166,0.1)' : 'transparent',
                        color: '#e2e8f0',
                      }}
                    >
                      <div>
                        <div className="font-medium">{m.label}</div>
                        <div className="text-xs" style={{ color: '#64748b' }}>{m.desc}</div>
                      </div>
                      {selectedModel === m.id && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--ept-accent)' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Voice toggle */}
          <button
            onClick={() => {
              if (voicePlaying && audioRef.current) {
                audioRef.current.pause();
                setVoicePlaying(false);
              }
              setVoiceEnabled(v => !v);
            }}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: voiceEnabled ? 'var(--ept-accent)' : 'transparent',
              color: voiceEnabled ? '#fff' : '#94a3b8',
            }}
            title={voiceEnabled ? 'Voice ON' : 'Voice OFF'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              {voiceEnabled ? (
                <>
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </>
              ) : (
                <path d="M23 9l-6 6M17 9l6 6" />
              )}
            </svg>
          </button>
          {/* Clear */}
          <button
            onClick={clearChat}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#94a3b8' }}
            title="Clear chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
          {/* Theme */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#94a3b8' }}
            title="Toggle theme"
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Chat Area ── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 py-6" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Welcome screen with orb visible behind */}
          {!hasMessages && (
            <div className="text-center pt-[28vh] pb-8 animate-fade-up">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-3 gradient-text">
                Sentinel AI
              </h2>
              <p className="text-lg mb-10" style={{ color: '#94a3b8' }}>
                Expert analysis across 210 knowledge domains
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {DOMAIN_CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => handleChipClick(chip.label)}
                    className="px-3 py-2 rounded-xl border text-sm transition-all hover:scale-105"
                    style={{
                      borderColor: selectedModel === chip.model ? 'var(--ept-accent)' : 'rgba(30,41,59,0.5)',
                      backgroundColor: selectedModel === chip.model ? 'var(--ept-accent)' : 'rgba(12,18,32,0.6)',
                      color: selectedModel === chip.model ? '#fff' : '#e2e8f0',
                      backdropFilter: 'blur(8px)',
                    }}
                    title={`${chip.hint}${chip.model !== 'auto' ? ` — Fine-tuned ${chip.model} model` : ''}`}
                  >
                    <span className="mr-1">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'system' ? (
                <div
                  className="w-full text-center text-xs py-2 px-4 rounded-lg"
                  style={{ backgroundColor: 'rgba(15,23,42,0.6)', color: '#64748b', backdropFilter: 'blur(8px)' }}
                >
                  {msg.content}
                </div>
              ) : msg.role === 'user' ? (
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className="text-xs mt-1 opacity-60">{formatTime(msg.timestamp)}</div>
                </div>
              ) : (
                <div className="max-w-[85%] space-y-1">
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                    <span className="font-semibold" style={{ color: 'var(--ept-accent)' }}>
                      {msg.personality || 'Echo Prime'}
                    </span>
                    {msg.emotion && msg.emotion !== 'neutral' && (
                      <span className="opacity-70">{msg.emotion}</span>
                    )}
                    {msg.provider && (
                      <span className="opacity-50">{msg.provider}</span>
                    )}
                    {msg.latency && (
                      <span className="opacity-50">{(msg.latency / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-md border"
                    style={{
                      backgroundColor: 'rgba(12,18,32,0.7)',
                      borderColor: 'rgba(30,41,59,0.4)',
                      color: '#e2e8f0',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {msg.content === '...' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)', animationDelay: '0.2s' }} />
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)', animationDelay: '0.4s' }} />
                      </div>
                    ) : (
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    )}
                  </div>
                  {msg.content !== '...' && (
                    <div className="flex items-center gap-2 px-1">
                      <button
                        onClick={() => playVoice(msg.content, msg.id)}
                        disabled={voicePlaying}
                        className="text-xs flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: '#64748b' }}
                        title="Play voice"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        {msg.voicePlayed ? 'Replay' : 'Listen'}
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: '#64748b' }}
                        title="Copy"
                      >
                        Copy
                      </button>
                      <span className="text-xs opacity-40" style={{ color: '#64748b' }}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Search results panel — collapsible sources */}
          {lastSearchResults.length > 0 && (
            <details
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: 'rgba(12,18,32,0.6)',
                borderColor: 'rgba(30,41,59,0.4)',
                backdropFilter: 'blur(8px)',
              }}
              open
            >
              <summary className="flex items-center gap-2 text-xs font-semibold cursor-pointer px-4 py-3 select-none" style={{ color: 'var(--ept-accent)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Sources ({lastSearchResults.length})
                {lastToolsUsed.length > 0 && (
                  <span className="ml-auto opacity-60 font-normal flex items-center gap-1.5">
                    {lastToolsUsed.includes('web_search') && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>Web</span>}
                    {lastToolsUsed.includes('engine_query') && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#a78bfa' }}>Engines</span>}
                    {lastToolsUsed.includes('knowledge_search') && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>Knowledge</span>}
                  </span>
                )}
              </summary>
              <div className="px-4 pb-3 space-y-2.5 border-t" style={{ borderColor: 'rgba(30,41,59,0.3)' }}>
                {lastSearchResults.map((r, i) => (
                  <div key={i} className="text-xs space-y-0.5 pt-2">
                    <div className="flex items-start gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 mt-0.5" style={{
                        backgroundColor: r.source === 'web' ? 'rgba(59,130,246,0.15)' :
                          r.source.startsWith('engine') ? 'rgba(168,85,247,0.15)' :
                          r.source.startsWith('knowledge') ? 'rgba(34,197,94,0.15)' :
                          'rgba(20,184,166,0.15)',
                        color: r.source === 'web' ? '#60a5fa' :
                          r.source.startsWith('engine') ? '#a78bfa' :
                          r.source.startsWith('knowledge') ? '#4ade80' :
                          'var(--ept-accent)',
                      }}>
                        {r.source.length > 25 ? r.source.slice(0, 25) + '...' : r.source}
                      </span>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline leading-snug" style={{ color: '#e2e8f0' }}>
                          {r.title}
                        </a>
                      ) : (
                        <span className="font-medium leading-snug" style={{ color: '#e2e8f0' }}>{r.title}</span>
                      )}
                    </div>
                    {r.snippet && (
                      <p className="pl-0.5 leading-relaxed" style={{ color: '#94a3b8' }}>
                        {r.snippet.slice(0, 250)}{r.snippet.length > 250 ? '...' : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </details>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ── Input Area ── */}
      <footer
        className="relative z-10 border-t px-4 md:px-8 py-3 shrink-0"
        style={{
          borderColor: 'rgba(30,41,59,0.5)',
          backgroundColor: 'rgba(5,5,8,0.8)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-2 rounded-xl border px-3 py-2"
            style={{
              backgroundColor: 'rgba(15,23,42,0.6)',
              borderColor: sending ? 'var(--ept-accent)' : 'rgba(30,41,59,0.5)',
            }}
          >
            {/* Mic button */}
            <button
              onClick={toggleMic}
              className="p-2 rounded-lg transition-colors shrink-0"
              style={{
                backgroundColor: listening ? '#ef4444' : 'transparent',
                color: listening ? '#fff' : '#94a3b8',
              }}
              title={listening ? 'Stop listening' : 'Voice input'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder={sending ? 'Analyzing...' : 'Ask anything across 210 domains...'}
              disabled={sending}
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm py-1.5"
              style={{ color: '#e2e8f0', minHeight: '24px', maxHeight: '160px' }}
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className="p-2 rounded-lg transition-all shrink-0"
              style={{
                backgroundColor: input.trim() && !sending ? 'var(--ept-accent)' : 'transparent',
                color: input.trim() && !sending ? '#fff' : '#64748b',
                opacity: input.trim() && !sending ? 1 : 0.4,
              }}
              title="Send"
            >
              {sending ? (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-2 text-xs px-1" style={{ color: '#64748b' }}>
            <span>
              {selectedModel !== 'auto' && (
                <span style={{ color: 'var(--ept-accent)' }}>
                  {FINE_TUNED_MODELS.find(m => m.id === selectedModel)?.label || selectedModel}
                </span>
              )}
              {selectedModel !== 'auto' && voiceEnabled && ' · '}
              {voiceEnabled && (
                <span style={{ color: 'var(--ept-accent)' }}>Voice ON</span>
              )}
              {voicePlaying && ' — Speaking...'}
              {listening && (
                <span style={{ color: '#ef4444' }}> Listening...</span>
              )}
            </span>
            <span>
              {messages.filter(m => m.role === 'user').length} queries this session
            </span>
          </div>
        </div>
      </footer>

      {/* ─── Upgrade Banner + Cross-Sell (below chat) ─── */}
      <div className="px-4 pb-6 space-y-4" style={{ backgroundColor: 'var(--ept-bg)' }}>
        {/* Upgrade CTA */}
        <div className="max-w-3xl mx-auto p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>
            Unlock Unlimited Queries &amp; Priority Models
          </p>
          <p className="text-xs mb-3" style={{ color: 'var(--ept-text-muted)' }}>
            Free tier: 50 queries/day &middot; Pro: unlimited queries, custom engines, voice &middot; Business: API access, team seats, SLA
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/pricing" className="px-5 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              View Plans &amp; Pricing
            </Link>
            <Link href="/signup" className="px-5 py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Cross-sell */}
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Also from Echo Prime</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'AI Sales Agent', price: '$299/mo', href: '/closer' },
              { title: 'Intelligence Engines', price: '$199/mo', href: '/engines' },
              { title: 'Title Intelligence', price: '$200/mo', href: '/title-intelligence' },
              { title: 'Data Pipelines', price: '$199/mo', href: '/pipelines' },
            ].map((p, i) => (
              <Link key={i} href={p.href} className="p-3 rounded-lg border text-center transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <p className="text-xs font-bold" style={{ color: 'var(--ept-text)' }}>{p.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--ept-accent)' }}>{p.price} &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
