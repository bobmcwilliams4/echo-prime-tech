'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import {
  queryEngine,
  chatEngine,
  getUsage,
  registerUser,
  getPricing,
  getProfile,
  createCheckout,
  openCustomerPortal,
  downloadReport,
  isAuthenticated,
  getStoredUserId,
  getConfidenceColor,
  getConfidenceLabel,
  type QueryResponse,
  type UsageResponse,
  type PricingTier,
  type ProfileResponse,
} from '../../lib/engine-cloud-api';
import {
  queryMultiDomain,
  queryDoctrines,
  getRuntimeStats,
  getConfidenceBadge,
  type DoctrineResult,
  type QueryResponse as RuntimeQueryResponse,
} from '../../lib/engine-runtime-api';
import {
  brainGetContext,
  brainIngest,
  brainSearch,
  sentinelGetContext,
  sentinelStore,
  trinityDecide,
  swarmHealth,
  loadCortexStats,
  detectEmotion,
  buildPersonalityDirective,
  PERSONALITY_PROFILES,
  PERSONALITY_VOICE_MAP,
  type TrinityDecision,
  type CortexStats,
  type DetectedEmotion,
  type PersonalityProfile,
} from '../../lib/sentinel-cloud-api';

// ── Types ──

import {
  classifyQuery as agenticClassify,
  startStreamingSession,
  getDocument as getAgenticDocument,
  cancelSession as cancelAgenticSession,
  type ExecutionPlan,
  type SSECallbacks,
} from '../../lib/agentic-engine-api';
import AgenticProgressPanel, { type AgenticStepDisplay } from '../../components/AgenticProgressPanel';
import DocumentViewer from '../../components/DocumentViewer';

type SentinelMode = 'standard' | 'swarm' | 'echo_prime';
type AnalysisMode = 'FAST' | 'DEFENSE' | 'MEMO';

interface DomainPreset {
  label: string;
  icon: string;
  desc: string;
  domains: string[];
}

const DOMAIN_PRESETS: DomainPreset[] = [
  { label: 'Tax / CPA', icon: '📊', desc: 'Tax planning, compliance, audit defense', domains: ['TX', 'ACCT', 'TXLAW', 'TXRE', 'TXINS', 'FIN', 'INS'] },
  { label: 'Landman / Title', icon: '🗺️', desc: 'Chain of title, mineral rights, oil & gas', domains: ['LAND', 'LG', 'TXRE', 'OILGAS', 'PETRO'] },
  { label: 'Cybersecurity', icon: '🔒', desc: 'Threats, pentesting, forensics, compliance', domains: ['CYBER', 'MALWARE', 'PENTEST', 'REVENG', 'DFIR', 'NET', 'INTELL'] },
  { label: 'Engineering', icon: '⚙️', desc: 'Mechanical, structural, materials, welding', domains: ['MECH', 'AERO', 'CHEM', 'CONST', 'MAT', 'PIPE', 'STEEL', 'WELD', 'EE'] },
  { label: 'Legal', icon: '⚖️', desc: 'Business law, contracts, compliance', domains: ['LG', 'TXLAW', 'BIZ', 'ENT', 'COMP'] },
  { label: 'Medical / Health', icon: '🏥', desc: 'Clinical, research, compliance', domains: ['MED', 'NEURO', 'PSY', 'PHARMA', 'BIOMED'] },
  { label: 'Software / AI', icon: '💻', desc: 'Architecture, DevOps, ML, testing', domains: ['PROG', 'WEBAPP', 'DEVOPS', 'AIML', 'CLOUD', 'MOBILE', 'TEST'] },
  { label: 'Finance', icon: '💰', desc: 'Markets, valuation, strategy, commerce', domains: ['FIN', 'BIZ', 'DCOM', 'SAAS', 'ECOMM', 'ENT'] },
  { label: 'All Domains', icon: '🌐', desc: 'Search all 210 domains', domains: [] },
];

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  confidence?: string;
  sources?: number;
  cost?: number;
  remaining?: number;
  hash?: string;
  reportId?: string;
  reportAvailable?: boolean;
  domain?: string;
  domainCost?: number;
  // Extended metadata
  mode?: SentinelMode;
  trinity?: TrinityDecision;
  emotion?: DetectedEmotion;
  personality?: PersonalityProfile;
  voiceId?: string;
  // Engine doctrine results
  doctrineResults?: DoctrineResult[];
  domainsQueried?: string[];
}

// ── Sentinel Instance ID (stable to avoid hydration mismatch) ──
const SENTINEL_INSTANCE = 'sentinel_web_ept';

// ── Component ──

export default function SentinelPage() {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('FAST');
  const [sentinelMode, setSentinelMode] = useState<SentinelMode>('standard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [cortexStats, setCortexStats] = useState<CortexStats | null>(null);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);
  const [memorySearch, setMemorySearch] = useState('');
  const [memoryResults, setMemoryResults] = useState<{ content: string; timestamp: string }[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [personality, setPersonality] = useState<string>('EP');
  const [showPersonalities, setShowPersonalities] = useState(false);
  const [swarmOnline, setSwarmOnline] = useState(false);
  const [commanderMode, setCommanderMode] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showDomainSelector, setShowDomainSelector] = useState(false);
  const [showDoctrineDetail, setShowDoctrineDetail] = useState<string | null>(null);
  // ── Agentic Mode State ──
  const [agenticMode, setAgenticMode] = useState(false);
  const [agenticSession, setAgenticSession] = useState<string | null>(null);
  const [agenticSteps, setAgenticSteps] = useState<AgenticStepDisplay[]>([]);
  const [agenticPlan, setAgenticPlan] = useState<ExecutionPlan | null>(null);
  const [agenticStatus, setAgenticStatus] = useState<string>('idle');
  const [agenticElapsed, setAgenticElapsed] = useState(0);
  const [agenticDocument, setAgenticDocument] = useState<string | null>(null);
  const [agenticAbort, setAgenticAbort] = useState<(() => void) | null>(null);
  const agenticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const agenticStartTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Auth check ──
  useEffect(() => {
    const hasKey = isAuthenticated();
    setApiKeyReady(hasKey);
    if (!hasKey) setShowSetup(true);
  }, []);

  // ── Load usage + profile ──
  useEffect(() => {
    if (apiKeyReady) {
      getUsage().then(setUsage).catch(() => {});
      getProfile().then(setProfile).catch(() => {});
    }
  }, [apiKeyReady]);

  // ── Commander detection ──
  useEffect(() => {
    if (role === 'owner') {
      setCommanderMode(true);
    }
  }, [user]);

  // ── Cortex stats ──
  useEffect(() => {
    if (apiKeyReady) {
      const playerId = getStoredUserId() || 'anon';
      loadCortexStats(playerId).then(setCortexStats).catch(() => {});
    }
  }, [apiKeyReady]);

  // ── Swarm health ──
  useEffect(() => {
    swarmHealth().then(h => setSwarmOnline(h.status === 'ok' || h.trinity_available)).catch(() => {});
  }, []);

  // ── Stripe upgrade return ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('upgraded') === 'true') {
        setTimeout(() => {
          getProfile().then(setProfile).catch(() => {});
          getUsage().then(setUsage).catch(() => {});
        }, 2000);
        setMessages(prev => [...prev, { id: `upgrade_${Date.now()}`, role: 'system', content: 'Subscription activated! Your plan has been upgraded.', timestamp: Date.now() }]);
        window.history.replaceState({}, '', '/sentinel');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load pricing ──
  useEffect(() => {
    getPricing().then(p => setPricingTiers(p.tiers)).catch(() => {});
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Welcome ──
  useEffect(() => {
    if (apiKeyReady && messages.length === 0) {
      setMessages([{
        id: 'welcome', role: 'system', timestamp: Date.now(),
        content: commanderMode
          ? 'COMMANDER MODE ACTIVE. Authority 11.0. Unlimited queries. All engines unlocked.\n\n2,632 engines. 210 domains. 186K+ doctrine blocks. Standard, Swarm, and Echo Prime modes online.\nDomain selector active. Memory cortex connected. Voice output available.'
          : 'Sentinel Intelligence Engine online. 2,632 engines. 210 domains. 186K+ doctrine blocks. Zero hallucination.\n\nThis AI is court-defensible — every response grounded in pre-compiled doctrine blocks with deterministic hashing.\n\nSelect your domain in the sidebar (Tax/CPA, Landman, Engineering, Legal, Medical, Cybersecurity, etc.) for targeted engine intelligence. Or ask anything across all 210 domains.\n\nModes: Standard (doctrine), Swarm (Trinity Council), Echo Prime (personality + memory).',
      }]);
    }
  }, [apiKeyReady, commanderMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-register ──
  const handleAutoRegister = useCallback(async () => {
    if (!user?.email) return;
    try {
      await registerUser(user.email, user.displayName || undefined);
      setApiKeyReady(true);
      setShowSetup(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('UNIQUE constraint')) {
        setMessages(prev => [...prev, { id: `err_${Date.now()}`, role: 'system', content: 'Email already registered. Contact support@echo-ept.com for a key reset.', timestamp: Date.now() }]);
      }
    }
  }, [user]);

  // ── Voice playback via Echo Speak (tts.echo-op.com) ──
  const playVoice = useCallback(async (text: string, voice: string) => {
    try {
      // Strip markdown formatting for cleaner TTS
      const cleanText = text
        .replace(/#{1,6}\s/g, '')           // headers
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')  // bold/italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // links
        .replace(/```[\s\S]*?```/g, '')      // code blocks
        .replace(/`([^`]+)`/g, '$1')        // inline code
        .replace(/^[-*]\s/gm, '')           // bullet points
        .replace(/\n{2,}/g, '. ')           // paragraph breaks → pause
        .replace(/---/g, '')                // horizontal rules
        .slice(0, 2000);

      const res = await fetch('https://tts.echo-op.com/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice_id: voice || 'default', output_format: 'wav' }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
    } catch { /* non-critical — TTS failure should never block UI */ }
  }, []);

  // ── Memory search ──
  const handleMemorySearch = useCallback(async () => {
    if (!memorySearch.trim()) return;
    try {
      const res = await brainSearch(memorySearch, 10);
      setMemoryResults((res?.results || []).map(r => ({ content: r.content, timestamp: r.timestamp })));
    } catch {
      setMemoryResults([]);
    }
  }, [memorySearch]);

  // ── Start Agentic Deep Analysis ──
  const startAgenticAnalysis = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !apiKeyReady) return;

    // Add user message to chat
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Enter agentic mode
    setAgenticMode(true);
    setAgenticSession(null);
    setAgenticSteps([]);
    setAgenticPlan(null);
    setAgenticStatus('planning');
    setAgenticElapsed(0);
    setAgenticDocument(null);
    agenticStartTimeRef.current = Date.now();

    // Start elapsed timer
    if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
    agenticTimerRef.current = setInterval(() => {
      setAgenticElapsed(Date.now() - agenticStartTimeRef.current);
    }, 500);

    const callbacks: SSECallbacks = {
      onPlan: (plan) => {
        setAgenticPlan(plan);
        setAgenticStatus('executing');
        // Initialize steps from plan
        setAgenticSteps(plan.steps.map(s => ({
          id: s.id,
          name: s.name,
          type: s.type as AgenticStepDisplay['type'],
          status: 'pending',
          duration_ms: 0,
        })));
      },
      onStepStart: (step) => {
        setAgenticSteps(prev => prev.map(s =>
          s.id === step.step_id ? { ...s, status: 'running' } : s
        ));
      },
      onStepComplete: (step) => {
        setAgenticSteps(prev => prev.map(s =>
          s.id === step.step_id ? { ...s, status: 'complete', duration_ms: step.duration_ms, summary: step.summary } : s
        ));
      },
      onStepFailed: (step) => {
        setAgenticSteps(prev => prev.map(s =>
          s.id === step.step_id ? { ...s, status: 'failed', error: step.error } : s
        ));
      },
      onValidation: () => {
        setAgenticStatus('validating');
      },
      onDocumentReady: async (data) => {
        setAgenticStatus('complete');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        try {
          const html = await getAgenticDocument(data.session_id);
          setAgenticDocument(html);
        } catch { /* document fetch failed — user can retry */ }
      },
      onError: (error) => {
        setAgenticStatus('failed');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: `Agentic analysis failed: ${error}`, timestamp: Date.now() }]);
      },
      onDone: (data) => {
        setAgenticSession(data.session_id);
        if (data.status === 'complete') {
          setAgenticStatus('complete');
        } else if (data.status === 'failed') {
          setAgenticStatus('failed');
        }
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
      },
    };

    try {
      const { sessionPromise, abort } = startStreamingSession(text, selectedDomains, callbacks);
      setAgenticAbort(() => abort);
      const sessionId = await sessionPromise;
      setAgenticSession(sessionId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (!msg.includes('aborted')) {
        setAgenticStatus('failed');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: `Agentic session failed: ${msg}`, timestamp: Date.now() }]);
      }
    }
  }, [input, loading, apiKeyReady, selectedDomains]);

  const cancelAgentic = useCallback(() => {
    if (agenticAbort) agenticAbort();
    if (agenticSession) cancelAgenticSession(agenticSession).catch(() => {});
    setAgenticStatus('cancelled');
    if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
  }, [agenticAbort, agenticSession]);

  const closeAgenticMode = useCallback(() => {
    setAgenticMode(false);
    setAgenticDocument(null);
    setAgenticSteps([]);
    setAgenticPlan(null);
    setAgenticStatus('idle');
    setAgenticSession(null);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
    };
  }, []);

  // ── Send message ──
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !apiKeyReady) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const emotion = detectEmotion(text);
    const activeProfile = PERSONALITY_PROFILES[personality];
    const voiceId = PERSONALITY_VOICE_MAP[personality] || 'echo_prime';

    try {
      let assistantMsg: Message;

      // ── Domain-specific doctrine query (runs for ALL modes when domains selected) ──
      let doctrineResults: DoctrineResult[] = [];
      let domainsQueried: string[] = [];
      if (selectedDomains.length > 0) {
        try {
          const docRes = await queryMultiDomain(text, selectedDomains, 5);
          if (docRes.ok && docRes.results?.length > 0) {
            doctrineResults = docRes.results;
            domainsQueried = selectedDomains;
          }
        } catch { /* doctrine enrichment is additive — proceed without */ }
      } else {
        // No preset selected — do cross-domain search to auto-detect relevant domains
        try {
          const docRes = await queryDoctrines(text, undefined, 3);
          if (docRes.ok && docRes.results?.length > 0) {
            doctrineResults = docRes.results;
            domainsQueried = [...new Set(docRes.results.map(r => r.domain))];
          }
        } catch { /* proceed without */ }
      }

      // Build doctrine context string for injection into all modes
      const doctrineContext = doctrineResults.length > 0
        ? `\n\n[DOCTRINE ENGINE RESULTS — ${domainsQueried.join(', ')}]:\n` +
          doctrineResults.slice(0, 3).map(d =>
            `• ${d.topic} (${d.confidence}, ${d.domain}): ${d.conclusion.slice(0, 300)}`
          ).join('\n')
        : '';

      if (sentinelMode === 'swarm') {
        // ── Swarm Mode: Trinity Council + Memory + Doctrine ──
        let memoryContext = '';
        try {
          const ctx = await brainGetContext(SENTINEL_INSTANCE, text);
          if (ctx.context_window) memoryContext = ctx.context_window;
          if (cortexStats) setCortexStats({ ...cortexStats, contextInjected: true });
        } catch { /* proceed without memory */ }

        const queryWithContext = [
          memoryContext ? `[MEMORY CONTEXT: ${memoryContext.slice(0, 500)}]` : '',
          doctrineContext,
          text,
        ].filter(Boolean).join('\n\n');
        const decision = await trinityDecide(queryWithContext);
        const responseContent = decision?.reasoning_synthesis || decision?.consensus || 'Trinity Council returned no consensus. Try rephrasing your question.';

        assistantMsg = {
          id: `a_${Date.now()}`, role: 'assistant', timestamp: Date.now(),
          content: responseContent,
          mode: 'swarm',
          trinity: decision,
          emotion,
          voiceId,
          doctrineResults: doctrineResults.length > 0 ? doctrineResults : undefined,
          domainsQueried: domainsQueried.length > 0 ? domainsQueried : undefined,
        };

        // Store swarm response to memory
        brainIngest(SENTINEL_INSTANCE, `Q: ${text}\nA [SWARM]: ${(responseContent || '').slice(0, 500)}`, 6, ['sentinel', 'swarm', 'trinity']).catch(() => {});
      } else if (sentinelMode === 'echo_prime') {
        // ── Echo Prime Mode: Personality + Memory + Doctrine + LLM Chat ──
        const personalityDirective = buildPersonalityDirective(activeProfile, emotion);

        // Inject memory context
        let memoryContext = '';
        try {
          const ctx = await brainGetContext(SENTINEL_INSTANCE, text);
          if (ctx.context_window) memoryContext = ctx.context_window;
          if (cortexStats) setCortexStats({ ...cortexStats, contextInjected: true });
        } catch { /* proceed without memory */ }

        // Build system prompt: personality + memory + doctrine context
        const systemPrompt = [
          personalityDirective,
          memoryContext ? `\n\n[MEMORY CONTEXT — previous interactions with this user]:\n${memoryContext.slice(0, 800)}` : '',
          doctrineContext,
          '\n\nProvide insightful, personality-driven responses. Use markdown for structure. When doctrine results are provided, cite them authoritatively and explain their relevance.',
        ].filter(Boolean).join('');

        // Build conversation history for context continuity
        const history = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-6)
          .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

        // Route through /api/chat (LLM with personality system prompt)
        const result = await chatEngine(text, systemPrompt, history);

        assistantMsg = {
          id: `a_${Date.now()}`, role: 'assistant', timestamp: Date.now(),
          content: result.response,
          confidence: 'DISCLOSURE',
          sources: result.has_doctrine_context ? 1 : 0,
          cost: commanderMode ? 0 : result.usage.cost,
          remaining: commanderMode ? 999999 : result.usage.remaining,
          domain: domainsQueried.length > 0 ? domainsQueried.join(' + ') : 'Echo Prime Intelligence',
          mode: 'echo_prime',
          emotion,
          personality: activeProfile,
          voiceId,
          doctrineResults: doctrineResults.length > 0 ? doctrineResults : undefined,
          domainsQueried: domainsQueried.length > 0 ? domainsQueried : undefined,
        };

        // Store to memory
        brainIngest(SENTINEL_INSTANCE, `Q: ${text}\nA [ECHO_PRIME]: ${(result.response || '').slice(0, 500)}`, 5, ['sentinel', 'echo_prime', 'personality']).catch(() => {});
      } else {
        // ── Standard Mode: Direct engine query + Memory + Doctrine ──
        let memoryContext = '';
        try {
          const ctx = await brainGetContext(SENTINEL_INSTANCE, text);
          if (ctx.context_window) memoryContext = ctx.context_window;
          if (cortexStats) setCortexStats({ ...cortexStats, contextInjected: true });
        } catch { /* proceed without memory */ }

        const result = await queryEngine(
          memoryContext ? `[CONTEXT: ${memoryContext.slice(0, 500)}]\n\n${text}` : text,
          analysisMode
        );

        // Merge doctrine results: engine cloud results + runtime doctrine results
        const mergedDoctrines = doctrineResults.length > 0 ? doctrineResults : undefined;

        assistantMsg = {
          id: `a_${Date.now()}`, role: 'assistant', timestamp: Date.now(),
          content: result.summary || result.analysis,
          confidence: result.confidence,
          sources: result.sources_cited + (doctrineResults.length || 0),
          cost: commanderMode ? 0 : result.usage.cost,
          remaining: commanderMode ? 999999 : result.usage.remaining,
          hash: result.determinism_hash,
          reportId: result.report_id,
          reportAvailable: result.report_available,
          domain: domainsQueried.length > 0 ? domainsQueried.join(' + ') : result.domain,
          domainCost: result.domain_cost,
          mode: 'standard',
          emotion,
          voiceId,
          doctrineResults: mergedDoctrines,
          domainsQueried: domainsQueried.length > 0 ? domainsQueried : undefined,
        };

        // Store to memory
        brainIngest(SENTINEL_INSTANCE, `Q: ${text}\nA: ${(result.summary || result.analysis).slice(0, 500)}`, 5, ['sentinel', 'standard']).catch(() => {});
      }

      setMessages(prev => [...prev, assistantMsg]);

      // Update usage
      if (usage && assistantMsg.cost !== undefined && !commanderMode) {
        setUsage({
          ...usage,
          queries: usage.queries + 1,
          remaining: assistantMsg.remaining ?? usage.remaining,
          total_cost: usage.total_cost + (assistantMsg.cost || 0),
        });
      }

      // Auto-play voice
      if (voiceEnabled && assistantMsg.content) {
        playVoice(assistantMsg.content, voiceId);
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      const errorMsg = msg === 'unauthorized' ? 'API key expired. Please re-register.'
        : msg === 'rate_limit_exceeded' ? 'Monthly limit reached. Upgrade your plan.'
        : msg.includes('domain_restricted') ? 'This domain requires a paid plan.'
        : `Error: ${msg}`;

      setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: errorMsg, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, apiKeyReady, analysisMode, sentinelMode, usage, personality, voiceEnabled, commanderMode, cortexStats, playVoice, selectedDomains, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Helpers ──

  const modeColors: Record<SentinelMode, string> = {
    standard: '#6366f1',
    swarm: '#f59e0b',
    echo_prime: '#a855f7',
  };

  const modeLabels: Record<SentinelMode, string> = {
    standard: 'Standard',
    swarm: 'Swarm',
    echo_prime: 'Echo Prime',
  };

  // ── Render ──

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0f', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* ═══ Sidebar ═══ */}
      {sidebarOpen && (
        <div style={{ width: 290, borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', backgroundColor: '#0f1117', flexShrink: 0, overflowY: 'auto' }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)', boxShadow: '0 0 16px #6366f144' }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Sentinel</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Intelligence Engine</div>
              </div>
            </Link>
            {commanderMode && (
              <div style={{ marginTop: 8, padding: '4px 10px', borderRadius: 6, backgroundColor: '#f59e0b15', border: '1px solid #f59e0b40', fontSize: 11, fontWeight: 700, color: '#f59e0b', textAlign: 'center' }}>
                COMMANDER — UNLIMITED
              </div>
            )}
          </div>

          {/* Sentinel Mode Selector */}
          <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</div>
            {(['standard', 'swarm', 'echo_prime'] as SentinelMode[]).map(m => (
              <button key={m} onClick={() => setSentinelMode(m)} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', marginBottom: 4,
                borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: sentinelMode === m ? 600 : 400,
                color: sentinelMode === m ? '#f1f5f9' : '#94a3b8',
                backgroundColor: sentinelMode === m ? '#1e293b' : 'transparent',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: modeColors[m], opacity: sentinelMode === m ? 1 : 0.4 }} />
                <div>
                  <div>{modeLabels[m]}</div>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 400 }}>
                    {m === 'standard' && 'Doctrine engine'}
                    {m === 'swarm' && (swarmOnline ? 'Trinity Council' : 'Trinity offline')}
                    {m === 'echo_prime' && 'Personality + Memory'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Analysis Mode (for standard + echo_prime) */}
          {sentinelMode !== 'swarm' && (
            <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analysis</div>
              {(['FAST', 'DEFENSE', 'MEMO'] as AnalysisMode[]).map(m => (
                <button key={m} onClick={() => setAnalysisMode(m)} style={{
                  display: 'block', width: '100%', padding: '7px 12px', marginBottom: 3, borderRadius: 8,
                  border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12,
                  fontWeight: analysisMode === m ? 600 : 400,
                  color: analysisMode === m ? '#f1f5f9' : '#94a3b8',
                  backgroundColor: analysisMode === m ? '#1e293b' : 'transparent',
                }}>
                  {m === 'FAST' && '⚡ Fast'}
                  {m === 'DEFENSE' && '🛡️ Defense'}
                  {m === 'MEMO' && '📋 Memo'}
                </button>
              ))}
            </div>
          )}

          {/* Domain Selector — Engine Intelligence Focus */}
          <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
            <button onClick={() => setShowDomainSelector(!showDomainSelector)} style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Engine Domains</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {selectedDomains.length > 0 && (
                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, backgroundColor: '#6366f120', color: '#818cf8', fontWeight: 700 }}>
                      {selectedDomains.length}
                    </span>
                  )}
                  <span style={{ fontSize: 10 }}>{showDomainSelector ? '▲' : '▼'}</span>
                </div>
              </div>
              {activePreset && (
                <div style={{ fontSize: 12, color: '#818cf8', fontWeight: 600, marginTop: 2 }}>
                  {DOMAIN_PRESETS.find(p => p.label === activePreset)?.icon} {activePreset}
                </div>
              )}
              {!activePreset && selectedDomains.length === 0 && (
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>All domains (general)</div>
              )}
            </button>
            {showDomainSelector && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>Select your professional domain for targeted engine queries:</div>
                <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                  {DOMAIN_PRESETS.map(preset => {
                    const isActive = activePreset === preset.label;
                    return (
                      <button key={preset.label} onClick={() => {
                        if (isActive) {
                          setSelectedDomains([]);
                          setActivePreset(null);
                        } else {
                          setSelectedDomains(preset.domains);
                          setActivePreset(preset.label);
                        }
                      }} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 8, width: '100%', padding: '8px 10px', marginBottom: 3,
                        borderRadius: 8, border: `1px solid ${isActive ? '#6366f140' : 'transparent'}`, cursor: 'pointer', textAlign: 'left',
                        backgroundColor: isActive ? '#6366f110' : 'transparent',
                      }}>
                        <span style={{ fontSize: 16, lineHeight: '20px', flexShrink: 0 }}>{preset.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#818cf8' : '#e2e8f0' }}>{preset.label}</div>
                          <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.3 }}>{preset.desc}</div>
                          {isActive && preset.domains.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                              {preset.domains.map(d => (
                                <span key={d} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: '#1e293b', color: '#94a3b8', fontFamily: 'monospace' }}>{d}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {isActive && <span style={{ fontSize: 12, color: '#818cf8', flexShrink: 0 }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Personality Selector (Echo Prime mode) */}
          {sentinelMode === 'echo_prime' && (
            <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
              <button onClick={() => setShowPersonalities(!showPersonalities)} style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Personality</span>
                  <span style={{ fontSize: 10 }}>{showPersonalities ? '▲' : '▼'}</span>
                </div>
                <div style={{ fontSize: 13, color: '#a855f7', fontWeight: 600 }}>
                  {PERSONALITY_PROFILES[personality]?.name || 'Echo Prime'}
                </div>
              </button>
              {showPersonalities && (
                <div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto' }}>
                  {Object.values(PERSONALITY_PROFILES).map(p => (
                    <button key={p.id} onClick={() => { setPersonality(p.id); setShowPersonalities(false); }} style={{
                      display: 'block', width: '100%', padding: '6px 10px', marginBottom: 2, borderRadius: 6,
                      border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12,
                      color: personality === p.id ? '#a855f7' : '#94a3b8',
                      backgroundColor: personality === p.id ? '#a855f710' : 'transparent',
                    }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: '#475569' }}>{p.tone}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Memory Cortex Panel */}
          <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
            <button onClick={() => setMemoryPanelOpen(!memoryPanelOpen)} style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Memory Cortex</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {cortexStats?.contextInjected && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 2s infinite' }} />}
                  <span style={{ fontSize: 10 }}>{memoryPanelOpen ? '▲' : '▼'}</span>
                </div>
              </div>
            </button>
            {memoryPanelOpen && cortexStats && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                  {[
                    { label: 'Brain', value: cortexStats.sharedBrainMemories },
                    { label: 'Sentinel', value: cortexStats.sentinelMemories },
                    { label: 'Relationship', value: `L${cortexStats.relationshipLevel}` },
                    { label: 'Recent', value: cortexStats.recentExtractions },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '6px 8px', borderRadius: 6, backgroundColor: '#1e293b', fontSize: 11 }}>
                      <div style={{ color: '#64748b' }}>{s.label}</div>
                      <div style={{ color: '#f1f5f9', fontWeight: 600, fontFamily: 'monospace' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {/* Memory Search */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <input
                    id="memory-search"
                    name="memory-search"
                    value={memorySearch}
                    onChange={e => setMemorySearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleMemorySearch()}
                    placeholder="Search memory..."
                    autoComplete="off"
                    style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #334155', backgroundColor: '#0f1117', color: '#e2e8f0', fontSize: 11, outline: 'none' }}
                  />
                  <button onClick={handleMemorySearch} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', backgroundColor: '#6366f1', color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                    Go
                  </button>
                </div>
                {memoryResults.length > 0 && (
                  <div style={{ marginTop: 6, maxHeight: 120, overflowY: 'auto' }}>
                    {memoryResults.map((r, i) => (
                      <div key={i} style={{ padding: '4px 6px', borderRadius: 4, backgroundColor: '#1e293b', marginBottom: 3, fontSize: 10, color: '#94a3b8', lineHeight: 1.4 }}>
                        {r.content.slice(0, 120)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Usage Stats */}
          {usage && !commanderMode && (
            <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usage — {usage.month}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{usage.queries} / {usage.limit} queries</div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: '#1e293b', marginBottom: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(100, (usage.queries / usage.limit) * 100)}%`, backgroundColor: usage.queries / usage.limit > 0.9 ? '#ef4444' : '#6366f1', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Tier: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{usage.tier.toUpperCase()}</span></div>
            </div>
          )}

          {/* Actions */}
          <div style={{ padding: '12px', flex: 1 }}>
            <button onClick={() => setShowPricing(true)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', cursor: 'pointer', fontSize: 12, color: '#94a3b8', backgroundColor: 'transparent', marginBottom: 6, textAlign: 'left' }}>
              {profile?.tier === 'free' ? '⬆ Upgrade' : '📊 Manage Plan'}
            </button>
            <Link href="/engines" style={{ display: 'block', width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', fontSize: 12, color: '#94a3b8', textDecoration: 'none', marginBottom: 6, textAlign: 'left' }}>
              ⚡ Engine Catalog
            </Link>
            <button onClick={() => setMessages([])} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', cursor: 'pointer', fontSize: 12, color: '#94a3b8', backgroundColor: 'transparent', textAlign: 'left' }}>
              🗑️ Clear
            </button>
          </div>

          {/* User info */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', fontSize: 11, color: '#64748b' }}>
            {user?.email || (apiKeyReady ? 'Authenticated' : 'Not signed in')}
          </div>
        </div>
      )}

      {/* ═══ Main Chat Area ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1117' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
              Sentinel — 2,632 Engines
            </span>
            {activePreset && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, backgroundColor: '#6366f115', color: '#818cf8', fontWeight: 600, border: '1px solid #6366f130' }}>
                {DOMAIN_PRESETS.find(p => p.label === activePreset)?.icon} {activePreset}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {commanderMode && (
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: '#f59e0b15', color: '#f59e0b', fontWeight: 700, border: '1px solid #f59e0b30' }}>COMMANDER</span>
            )}
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: `${modeColors[sentinelMode]}15`, color: modeColors[sentinelMode], fontWeight: 600 }}>
              {modeLabels[sentinelMode].toUpperCase()}
            </span>
            {sentinelMode !== 'swarm' && (
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: '#1e1b4b', color: '#818cf8', fontWeight: 600 }}>{analysisMode}</span>
            )}
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: '#0f2a1a', color: '#10b981', fontWeight: 600 }}>🔒 ENCRYPTED</span>
          </div>
        </div>

        {/* Messages / Agentic Mode */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>

            {/* ═══ Agentic Deep Analysis Panel ═══ */}
            {agenticMode && (
              <div style={{ marginBottom: 24 }}>
                <AgenticProgressPanel
                  plan={agenticPlan}
                  steps={agenticSteps}
                  status={agenticStatus}
                  elapsed={agenticElapsed}
                  onCancel={cancelAgentic}
                />
                {agenticStatus === 'complete' && !agenticDocument && agenticSession && (
                  <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, backgroundColor: '#111827', border: '1px solid #1e293b', fontSize: 13, color: '#94a3b8' }}>
                    Analysis complete. Loading document...
                    <button onClick={async () => {
                      try {
                        const html = await getAgenticDocument(agenticSession);
                        setAgenticDocument(html);
                      } catch { /* retry manually */ }
                    }} style={{ marginLeft: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid #334155', backgroundColor: 'transparent', color: '#818cf8', cursor: 'pointer', fontSize: 12 }}>
                      Retry
                    </button>
                  </div>
                )}
                {['complete', 'failed', 'cancelled'].includes(agenticStatus) && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button onClick={closeAgenticMode} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      Back to Chat
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ═══ Document Viewer Overlay ═══ */}
            {agenticDocument && agenticSession && (
              <DocumentViewer
                html={agenticDocument}
                sessionId={agenticSession}
                onClose={() => setAgenticDocument(null)}
              />
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 20 }}>
                {msg.role === 'user' ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: commanderMode ? '#f59e0b' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: commanderMode ? '#0a0a0f' : '#f1f5f9', flexShrink: 0 }}>
                      {commanderMode ? '★' : (user?.displayName?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: commanderMode ? '#f59e0b' : '#f1f5f9', marginBottom: 4 }}>{commanderMode ? 'Commander' : 'You'}</div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    </div>
                  </div>
                ) : msg.role === 'assistant' ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: msg.mode === 'swarm'
                        ? 'radial-gradient(circle at 35% 35%, #f59e0b, #78350f)'
                        : msg.mode === 'echo_prime'
                          ? 'radial-gradient(circle at 35% 35%, #a855f7, #3b0764)'
                          : 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)',
                      boxShadow: `0 0 12px ${modeColors[msg.mode || 'standard']}33`,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: modeColors[msg.mode || 'standard'] }}>
                          {msg.mode === 'swarm' ? 'Trinity Council' : msg.mode === 'echo_prime' ? (msg.personality?.name || 'Echo Prime') : 'Sentinel'}
                        </span>
                        {msg.confidence && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, backgroundColor: getConfidenceColor(msg.confidence) + '22', color: getConfidenceColor(msg.confidence), fontWeight: 600 }}>
                            {getConfidenceLabel(msg.confidence)}
                          </span>
                        )}
                        {msg.emotion && msg.emotion.dominant !== 'neutral' && (
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: '#a855f715', color: '#c084fc' }}>
                            {msg.emotion.dominant}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.7, whiteSpace: 'pre-wrap', backgroundColor: '#111827', borderRadius: 12, padding: '16px 20px', border: `1px solid ${msg.mode === 'swarm' ? '#f59e0b20' : '#1e293b'}` }}>
                        {msg.content}

                        {/* Trinity votes */}
                        {msg.trinity && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>
                              Trinity Council — Consensus: {((msg.trinity.consensus_score || 0) * 100).toFixed(0)}% ({msg.trinity.harmony_level || 'unknown'})
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {(msg.trinity.votes || []).map((v, i) => (
                                <div key={i} style={{ padding: '4px 8px', borderRadius: 6, backgroundColor: '#1e293b', fontSize: 10, color: '#94a3b8' }}>
                                  <span style={{ fontWeight: 600, color: '#f59e0b' }}>{v.model}</span>: {v.decision.slice(0, 60)}
                                  <span style={{ color: '#64748b' }}> ({(v.confidence * 100).toFixed(0)}%)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Doctrine citations */}
                        {msg.doctrineResults && msg.doctrineResults.length > 0 && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                            <button onClick={() => setShowDoctrineDetail(showDoctrineDetail === msg.id ? null : msg.id)} style={{
                              display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8' }}>
                                {msg.doctrineResults.length} Doctrine{msg.doctrineResults.length > 1 ? 's' : ''} Cited
                              </span>
                              {msg.domainsQueried && (
                                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, backgroundColor: '#1e293b', color: '#94a3b8', fontFamily: 'monospace' }}>
                                  {msg.domainsQueried.join(', ')}
                                </span>
                              )}
                              <span style={{ fontSize: 10, color: '#475569' }}>{showDoctrineDetail === msg.id ? '▲' : '▼'}</span>
                            </button>
                            {showDoctrineDetail === msg.id && (
                              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {msg.doctrineResults.map((doc, di) => {
                                  const badge = getConfidenceBadge(doc.confidence);
                                  return (
                                    <div key={di} style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{doc.topic}</span>
                                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: badge.color + '20', color: badge.color, fontWeight: 700 }}>
                                          {badge.label}
                                        </span>
                                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: '#1e293b', color: '#64748b', fontFamily: 'monospace' }}>
                                          {doc.domain}
                                        </span>
                                        {doc.score > 0 && (
                                          <span style={{ fontSize: 9, color: '#475569', marginLeft: 'auto' }}>
                                            {(doc.score * 100).toFixed(0)}% match
                                          </span>
                                        )}
                                      </div>
                                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{doc.conclusion}</div>
                                      {doc.reasoning && (
                                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4, lineHeight: 1.4, borderTop: '1px solid #1e293b40', paddingTop: 4 }}>
                                          {doc.reasoning.slice(0, 200)}{doc.reasoning.length > 200 ? '...' : ''}
                                        </div>
                                      )}
                                      {doc.authority && doc.authority.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                                          {doc.authority.slice(0, 3).map((a, ai) => (
                                            <span key={ai} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: '#1e293b', color: '#64748b' }}>
                                              {a.slice(0, 60)}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Report download */}
                        {msg.reportAvailable && msg.reportId && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                            <button onClick={async () => {
                              try {
                                const report = await downloadReport(msg.reportId!);
                                const blob = new Blob([report], { type: 'text/markdown' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url; a.download = `report-${msg.reportId}.md`; a.click();
                                URL.revokeObjectURL(url);
                              } catch { alert('Download failed.'); }
                            }} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #6366f1', backgroundColor: '#6366f110', color: '#818cf8', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                              Download Report
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Metadata bar */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, fontSize: 10, color: '#475569' }}>
                        {msg.domain && msg.domain !== 'GENERAL' && msg.domain !== 'LLM_FALLBACK' && (
                          <span style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: '#1e293b', color: '#94a3b8' }}>{msg.domain.replace(/_/g, ' ')}</span>
                        )}
                        {msg.sources !== undefined && msg.sources > 0 && <span>{msg.sources} sources</span>}
                        {msg.domainCost !== undefined && msg.domainCost > 0 && !commanderMode && <span>${msg.domainCost.toFixed(2)}/q</span>}
                        {msg.remaining !== undefined && !commanderMode && <span>{msg.remaining} left</span>}
                        {msg.hash && <span title="Determinism hash">#{msg.hash}</span>}
                        {msg.personality && <span style={{ color: '#c084fc' }}>{msg.personality.name}</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: '#1e293b44', border: '1px solid #334155', fontSize: 13, color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0, animation: 'pulse 2s infinite',
                  background: sentinelMode === 'swarm' ? 'radial-gradient(circle at 35% 35%, #f59e0b, #78350f)' : 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: modeColors[sentinelMode], marginBottom: 4 }}>
                    {sentinelMode === 'swarm' ? 'Trinity Council' : 'Sentinel'}
                  </div>
                  <div style={{ padding: '16px 20px', borderRadius: 12, backgroundColor: '#111827', border: '1px solid #1e293b', fontSize: 13, color: '#64748b' }}>
                    {sentinelMode === 'swarm' ? 'SAGE, NYX, and THORNE are deliberating...'
                      : activePreset ? `Querying ${activePreset} engines across ${selectedDomains.length} domains...`
                      : 'Analyzing across 2,632 engines...'}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ═══ Input Area ═══ */}
        <div style={{ borderTop: '1px solid #1e293b', padding: '14px 24px', backgroundColor: '#0f1117' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {apiKeyReady ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                {/* Voice toggle */}
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} title={voiceEnabled ? 'Voice ON' : 'Voice OFF'} style={{
                  width: 38, height: 38, borderRadius: 10, border: `1px solid ${voiceEnabled ? '#a855f7' : '#334155'}`,
                  backgroundColor: voiceEnabled ? '#a855f710' : 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={voiceEnabled ? '#a855f7' : '#64748b'} strokeWidth="2" strokeLinecap="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    {voiceEnabled && <>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </>}
                  </svg>
                </button>
                <textarea
                  ref={inputRef}
                  id="sentinel-input"
                  name="sentinel-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    sentinelMode === 'swarm' ? 'Ask the Trinity Council...'
                    : activePreset ? `Ask about ${activePreset.toLowerCase()}...`
                    : 'Ask anything — tax, legal, cybersecurity, engineering...'
                  }
                  disabled={loading}
                  rows={1}
                  autoComplete="off"
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none', resize: 'none', lineHeight: 1.5, minHeight: 40, maxHeight: 200, fontFamily: 'inherit' }}
                  onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 200) + 'px'; }}
                />
                {/* Deep Analysis button — visible when Landman preset or relevant domains active */}
                {(activePreset === 'Landman / Title' || selectedDomains.some(d => ['LAND', 'LG', 'OILGAS'].includes(d))) && (
                  <button
                    onClick={startAgenticAnalysis}
                    disabled={loading || !input.trim() || agenticMode}
                    title="Deep Analysis — multi-step agentic orchestration"
                    style={{
                      height: 38, padding: '0 14px', borderRadius: 10, border: '1px solid #14b8a6',
                      cursor: loading || !input.trim() || agenticMode ? 'default' : 'pointer',
                      backgroundColor: loading || !input.trim() || agenticMode ? '#1e293b' : '#0d9488',
                      color: '#fff', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Deep Analysis
                  </button>
                )}
                <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
                  width: 38, height: 38, borderRadius: 10, border: 'none',
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  backgroundColor: loading || !input.trim() ? '#1e293b' : modeColors[sentinelMode],
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
                  Try 3 free queries. Court-defensible AI. No credit card required.
                </p>
                {user?.email ? (
                  <button onClick={handleAutoRegister} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', backgroundColor: '#6366f1', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                    Activate Free Plan — {user.email}
                  </button>
                ) : (
                  <Link href="/login" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: 10, backgroundColor: '#6366f1', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                    Sign In to Get Started
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Pricing Modal ═══ */}
      {showPricing && (
        <div onClick={() => setShowPricing(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#111827', borderRadius: 16, border: '1px solid #1e293b', padding: 32, maxWidth: 960, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
              {profile?.tier === 'free' ? 'Upgrade Your Plan' : 'Manage Your Plan'}
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
              932 engines. 65 domains. Court-defensible. Replaces $300-500/hour professionals.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {pricingTiers.map(tier => {
                const tierKey = tier.name.toLowerCase();
                const isCurrentTier = profile?.tier === tierKey;
                const isFree = tier.price === 0;
                return (
                  <div key={tier.name} style={{ padding: 20, borderRadius: 12, border: `2px solid ${isCurrentTier ? '#10b981' : tier.popular ? '#6366f1' : '#334155'}`, position: 'relative' }}>
                    {isCurrentTier && (
                      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#10b981', backgroundColor: '#111827', padding: '2px 10px', borderRadius: 4, border: '1px solid #10b981', textTransform: 'uppercase' }}>Current</div>
                    )}
                    {tier.popular && !isCurrentTier && (
                      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#818cf8', backgroundColor: '#111827', padding: '2px 10px', borderRadius: 4, border: '1px solid #6366f1', textTransform: 'uppercase' }}>Popular</div>
                    )}
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginTop: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginTop: 8 }}>
                      {isFree ? 'Free' : `$${tier.price}`}
                      {!isFree && <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>/mo</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{tier.queries.toLocaleString()} queries/month</div>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: 14 }}>
                      {(tier.features || []).map((f, i) => (
                        <li key={i} style={{ fontSize: 11, color: '#94a3b8', padding: '2px 0', display: 'flex', gap: 6 }}>
                          <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 14 }}>
                      {isCurrentTier ? (
                        <div style={{ padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#10b981' }}>Active</div>
                      ) : isFree ? (
                        <div style={{ padding: '8px 0', textAlign: 'center', fontSize: 12, color: '#64748b' }}>Included</div>
                      ) : (
                        <button disabled={upgrading !== null} onClick={async () => {
                          setUpgrading(tierKey);
                          try {
                            const { checkout_url } = await createCheckout(tierKey as 'professional' | 'business' | 'enterprise');
                            window.location.href = checkout_url;
                          } catch { setUpgrading(null); }
                        }} style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: 'none', cursor: upgrading ? 'wait' : 'pointer', fontSize: 12, fontWeight: 600, color: '#fff', backgroundColor: tier.popular ? '#6366f1' : '#334155' }}>
                          {upgrading === tierKey ? 'Redirecting...' : `Upgrade`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={() => setShowPricing(false)} style={{ padding: '8px 24px', borderRadius: 8, border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
