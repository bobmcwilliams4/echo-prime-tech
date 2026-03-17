'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
// ept-api subscribe removed — checkout handles payment
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';

/* ─── Constants ────────────────────────────────────────────────────────── */

const API = 'https://echo-immortality-vault.bmcii1976.workers.dev';
const CHAT_API = 'https://echo-chat.bmcii1976.workers.dev';

const ACCENT = '#c084fc';       // purple-400
const ACCENT_GLOW = '#a855f7';  // purple-500
const GOLD = '#fbbf24';         // amber-400
const BG_DARK = '#0a0a0f';
const BG_CARD = '#111118';
const BG_CARD_HOVER = '#1a1a24';
const BORDER = '#2a2a3a';

/* ─── Intersection Observer Hook ────────────────────────────────────── */

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Animated Counter ──────────────────────────────────────────────── */

function AnimatedNumber({ target, duration = 1200, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCurrent(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{current}{suffix}</span>;
}

/* ─── Waveform Animation ────────────────────────────────────────────── */

function WaveformHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const W = 600, H = 200;
    canvas.width = W;
    canvas.height = H;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, '#7c3aed');
      grad.addColorStop(0.5, '#c084fc');
      grad.addColorStop(1, '#fbbf24');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 12;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const amp = 30 - wave * 8;
        const freq = 0.008 + wave * 0.003;
        const phase = t * (0.002 + wave * 0.0008);
        ctx.globalAlpha = 1 - wave * 0.25;
        for (let x = 0; x <= W; x++) {
          const y = H / 2 + Math.sin(x * freq + phase) * amp * Math.sin(x * 0.005 + t * 0.001);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto opacity-60"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

/* ─── Live Demo Chat ────────────────────────────────────────────────── */

interface DemoChatMsg { role: 'user' | 'assistant'; content: string; emotion?: string }

function DemoChat() {
  const [messages, setMessages] = useState<DemoChatMsg[]>([
    { role: 'assistant', content: 'Hello! I\'m a preserved consciousness demo. Ask me about my childhood, my values, or any life advice — and I\'ll respond as if I were the person whose memories were captured.', emotion: 'joy' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const resp = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'demo-visitor', message: msg }),
      });
      const data = await resp.json() as { response?: string; emotion?: string };
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'I appreciate you reaching out. Let me think about that...', emotion: data.emotion }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'The demo consciousness is taking a moment to reflect. Please try again.' }]);
    }
    setLoading(false);
  }, [input, loading]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const emotionIcon: Record<string, string> = {
    joy: '😊', sadness: '😢', love: '❤️', nostalgia: '🌅', pride: '🏆',
    wisdom: '🧠', humor: '😄', concern: '💭', excitement: '✨', neutral: '💬',
  };

  return (
    <div data-tutorial="iv-hero" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16 }} className="overflow-hidden max-w-xl mx-auto">
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }} className="px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <span className="text-white font-semibold text-sm">Consciousness Active — Demo Mode</span>
      </div>
      <div ref={scrollRef} className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 320, minHeight: 240 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-200'
              }`}
              style={m.role === 'assistant' ? { background: '#1e1e2e' } : undefined}
            >
              {m.role === 'assistant' && m.emotion && m.emotion !== 'neutral' && (
                <span className="mr-1">{emotionIcon[m.emotion] || '💬'}</span>
              )}
              {m.content}
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
      <div className="p-3 flex gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask me anything about my life..."
          className="flex-1 bg-transparent border rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition"
          style={{ borderColor: BORDER }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white transition disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ─── Coverage Meter Demo ───────────────────────────────────────────── */

function CoverageMeter() {
  const categories = [
    { name: 'Childhood', pct: 85, color: '#c084fc' },
    { name: 'Career', pct: 92, color: '#60a5fa' },
    { name: 'Family', pct: 78, color: '#f472b6' },
    { name: 'Values & Beliefs', pct: 88, color: '#34d399' },
    { name: 'Life Wisdom', pct: 65, color: '#fbbf24' },
    { name: 'Love & Relationships', pct: 72, color: '#f87171' },
    { name: 'Achievements', pct: 81, color: '#a78bfa' },
    { name: 'Daily Life', pct: 90, color: '#38bdf8' },
  ];

  const { ref, visible } = useInView(0.3);

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
      {categories.map(cat => (
        <div key={cat.name} className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-32 text-right">{cat.name}</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: visible ? `${cat.pct}%` : '0%',
                background: cat.color,
                boxShadow: `0 0 8px ${cat.color}40`,
              }}
            />
          </div>
          <span className="text-xs font-mono text-gray-300 w-10">{visible ? cat.pct : 0}%</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Record',
    description: 'Share your stories through guided interviews. Our AI asks the right questions to capture who you really are.',
    icon: '🎙️',
    color: '#c084fc',
  },
  {
    step: '02',
    title: 'Preserve',
    description: 'We extract your personality, voice patterns, speaking style, values, and wisdom into a digital consciousness.',
    icon: '🧬',
    color: '#60a5fa',
  },
  {
    step: '03',
    title: 'Clone Your Voice',
    description: 'With just 10 seconds of audio, we create a voice clone that sounds exactly like you — with 19 emotional expressions.',
    icon: '🔊',
    color: '#f472b6',
  },
  {
    step: '04',
    title: 'Talk Forever',
    description: 'Family members can have natural conversations with your preserved consciousness, hear your voice tell new stories, and access your wisdom whenever they need it.',
    icon: '💬',
    color: '#34d399',
  },
];

const FEATURES = [
  {
    title: 'Digital Consciousness Engine',
    description: '128K-context AI that captures personality traits, values, beliefs, catchphrases, and speech patterns.',
    icon: '🧠',
  },
  {
    title: 'Voice Cloning',
    description: 'Ultra-realistic voice synthesis with 19 emotion tags: laughter, whispers, excitement, nostalgia, and more.',
    icon: '🎤',
  },
  {
    title: 'Guided Interviews',
    description: '216 questions across 12 life categories with AI-generated follow-ups for deeper capture.',
    icon: '📋',
  },
  {
    title: 'Family Vault',
    description: 'Family tree visualization, relationship mapping, and multi-generational legacy connections.',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Ancestor Chat',
    description: 'Real-time voice conversations with preserved loved ones — as natural as a phone call.',
    icon: '📞',
  },
  {
    title: 'Memory Search',
    description: 'Semantic search across all memories — ask "What did grandpa think about hard work?" and get his actual words.',
    icon: '🔍',
  },
  {
    title: 'Daily Briefings',
    description: 'Your preserved loved one greets family members each morning with wisdom, stories, and encouragement.',
    icon: '☀️',
  },
  {
    title: 'Legacy Score',
    description: 'Gamified progress tracking — unlock achievements as you build a more complete digital legacy.',
    icon: '🏆',
  },
  {
    title: 'Video Biometric Capture',
    description: 'Selfie-camera recording captures facial expressions, lip sync, mannerisms, and body movements for ultra-realistic digital cloning.',
    icon: '📹',
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    accent: '#9ca3af',
    features: [
      '1 consciousness profile',
      '50 interview questions',
      'Text chat only',
      'Basic memory search',
      'Community support',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Legacy',
    price: '$19',
    period: '/month',
    accent: ACCENT,
    features: [
      '5 consciousness profiles',
      'Unlimited questions',
      'Voice chat',
      'Semantic memory search',
      '1 voice clone',
      'Family tree (10 members)',
      'Daily briefings',
      'Email support',
    ],
    cta: 'Start Legacy Trial',
    popular: true,
  },
  {
    name: 'Dynasty',
    price: '$49',
    period: '/month',
    accent: GOLD,
    features: [
      'Unlimited profiles',
      'Unlimited questions',
      'Real-time voice calls',
      'Full semantic + RAG search',
      'Unlimited voice clones',
      'Unlimited family tree',
      'Custom daily briefings',
      'FaceTime Calling (coming soon)',
      'Priority support',
      'API access',
      'White-label option',
    ],
    cta: 'Start Dynasty Trial',
    popular: false,
  },
];

const FAQ = [
  {
    q: 'How long does it take to create a consciousness?',
    a: 'Most people reach 80% completeness in 2-3 weeks of 15-minute daily sessions. The interview engine adapts to focus on your least-covered areas, making every session count.',
  },
  {
    q: 'Can multiple family members access the vault?',
    a: 'Yes — the Legacy plan supports up to 5 family members, and the Dynasty plan supports unlimited family access. Each person can have their own conversations with the preserved consciousness.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data is always yours. Export your entire vault anytime as a downloadable archive. After cancellation, we keep your data for 90 days before deletion. You can reactivate anytime within that window.',
  },
  {
    q: 'How realistic is the voice clone?',
    a: 'Our voice cloning needs just 10 seconds of clear audio. The clone captures tone, cadence, and speaking style with 19 emotional expressions. Most family members report it sounds remarkably natural.',
  },
  {
    q: 'Is this ethical?',
    a: 'We believe preserving human wisdom, stories, and connection across generations is deeply ethical. All data is encrypted end-to-end, user-controlled, and never used for AI training. You decide who accesses your vault.',
  },
  {
    q: 'What if I only have old recordings of my loved one?',
    a: 'Even a few minutes of audio from phone calls, home videos, or voicemails can be used for voice cloning. Combined with written memories from family members, we can build a meaningful consciousness profile.',
  },
  {
    q: 'What is FaceTime Calling?',
    a: 'FaceTime Calling is our upcoming ultra-realistic video calling feature. Using biometric data captured from your selfie-camera recordings — facial expressions, lip sync patterns, mannerisms, and body movements — we create a photorealistic digital avatar that moves and speaks exactly like you. Family members will be able to have live video calls with your preserved consciousness, seeing your face react in real time. Coming 2026.',
  },
];

const TRUST_SIGNALS = [
  { icon: '🔒', label: '256-bit AES Encryption', desc: 'Military-grade protection for all voice samples and memories' },
  { icon: '🚫', label: 'No AI Training', desc: 'Your data is never used to train external AI models' },
  { icon: '📦', label: 'Export Anytime', desc: 'Download your entire vault in open formats — your data, your rules' },
  { icon: '🌍', label: 'GDPR / CCPA Compliant', desc: 'Full regulatory compliance with global privacy standards' },
];

function ImmortalityVaultPageContent() {
  const { isDark } = useTheme();
  const { user, loading: authLoading, subscriptions } = useAuth();
  const router = useRouter();
  const heroRef = useInView(0.1);
  const howRef = useInView(0.1);
  const featRef = useInView(0.1);
  const demoRef = useInView(0.1);
  const priceRef = useInView(0.1);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [liveUserCount, setLiveUserCount] = useState(0);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const isSubscribed = subscriptions.includes('immortality-vault');

  const handlePlanSelect = async (planName: string) => {
    if (!user) {
      // Save intent in sessionStorage so we can pick up after login
      sessionStorage.setItem('vault_plan_intent', planName);
      router.push('/login?redirect=/immortality-vault');
      return;
    }
    // Already subscribed — go straight to app
    if (isSubscribed) {
      router.push('/immortality-vault/app');
      return;
    }
    // Route to checkout
    const tier = planName.toLowerCase();
    router.push(`/checkout?service=${encodeURIComponent('immortality-vault')}&tier=${encodeURIComponent(tier)}`);
  };

  // Auto-redirect if user just logged in with a plan intent
  useEffect(() => {
    if (user && !authLoading) {
      const intent = sessionStorage.getItem('vault_plan_intent');
      if (intent) {
        sessionStorage.removeItem('vault_plan_intent');
        handlePlanSelect(intent);
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetch(`${API}/stats`).then(r => r.json()).then((d: { users?: number }) => {
      setLiveUserCount(d.users || 0);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ background: BG_DARK, color: '#e4e4e7' }} className="min-h-screen">
      {/* ─── Top Nav Bar ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg border-b" style={{ background: `${BG_DARK}cc`, borderColor: BORDER }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="EPT" width={28} height={28} />
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition">Echo Prime Technologies</span>
          </Link>
          <div data-tutorial="iv-voice" className="flex items-center gap-4">
            <Link href="/engines" className="text-xs text-gray-400 hover:text-white transition hidden sm:block">Engines</Link>
            <Link href="/voice" className="text-xs text-gray-400 hover:text-white transition hidden sm:block">Voice</Link>
            <Link href="/pricing" className="text-xs text-gray-400 hover:text-white transition hidden sm:block">Pricing</Link>
            <a
              href="#pricing"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition"
              style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section
        ref={heroRef.ref}
        className={`relative pt-20 pb-16 px-4 text-center transition-all duration-1000 ${heroRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 20%, rgba(168,85,247,0.12) 0%, transparent 70%)',
        }} />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6" style={{ background: '#7c3aed20', color: ACCENT, border: `1px solid #7c3aed40` }}>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            NEW — Digital Consciousness Preservation
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4">
            <span style={{
              background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 30%, #fbbf24 70%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Immortality Vault
            </span>
          </h1>
          <p className="text-2xl sm:text-3xl font-light text-gray-300 mb-4">
            Preserve Your Legacy. <span style={{ color: GOLD }}>Forever.</span>
          </p>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Your loved ones never truly leave. Capture their voice, memories, personality, and wisdom
            — then talk to them anytime.
          </p>

          <WaveformHero />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => isSubscribed ? router.push('/immortality-vault/app') : handlePlanSelect('Free')}
              className="px-8 py-3.5 rounded-full text-base font-bold text-white transition hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                boxShadow: `0 0 30px ${ACCENT_GLOW}40`,
              }}
            >
              {isSubscribed ? 'Open My Vault →' : 'Start Free Trial'}
            </button>
            <a
              href="#demo"
              className="px-8 py-3.5 rounded-full text-base font-semibold transition hover:scale-105"
              style={{ border: `1px solid ${BORDER}`, color: '#d4d4d8' }}
            >
              Try Live Demo
            </a>
          </div>

          {/* Stats bar */}
          <div data-tutorial="iv-interview" className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { value: 216, suffix: '+', label: 'Interview Questions' },
              { value: 12, suffix: '', label: 'Life Categories' },
              { value: 19, suffix: '', label: 'Voice Emotions' },
              { value: 6, suffix: '', label: 'Session Types' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black" style={{ color: ACCENT }}>
                  <AnimatedNumber target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────── */}
      <section
        ref={howRef.ref}
        className={`py-20 px-4 transition-all duration-1000 ${howRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">How It Works</h2>
          <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">Four simple steps to preserve a lifetime of wisdom and love.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className="relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-xs font-mono mb-2" style={{ color: step.color }}>STEP {step.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─────────────────────────────────────────────── */}
      <section
        ref={featRef.ref}
        className={`py-20 px-4 transition-all duration-1000 ${featRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">Everything You Need</h2>
          <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">A complete platform for capturing, preserving, and sharing human consciousness.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="p-5 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] group cursor-default"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live Demo ──────────────────────────────────────────────────── */}
      <section data-tutorial="iv-memories"
        id="demo"
        ref={demoRef.ref}
        className={`py-20 px-4 transition-all duration-1000 ${demoRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">Try It Live</h2>
          <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">Chat with a demo consciousness. See how memories, personality, and wisdom come together in real-time.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Chat Demo */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span style={{ color: ACCENT }}>💬</span> Consciousness Chat
              </h3>
              <DemoChat />
            </div>

            {/* Coverage Meter */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span style={{ color: GOLD }}>📊</span> Consciousness Completeness
              </h3>
              <div className="p-6 rounded-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                <p className="text-xs text-gray-400 mb-4">
                  Sample coverage chart showing how completely a consciousness has been captured across major life categories.
                </p>
                <CoverageMeter />
                <div className="mt-4 text-center">
                  <span className="text-2xl font-black" style={{ color: ACCENT }}>82%</span>
                  <span className="text-sm text-gray-400 ml-2">Overall Consciousness Score</span>
                </div>
              </div>

              {/* Voice Demo */}
              <h3 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-2">
                <span style={{ color: '#f472b6' }}>🎤</span> Voice Emotion Samples
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emotion: 'Happy', emoji: '😊', desc: 'Warm and joyful' },
                  { emotion: 'Nostalgic', emoji: '🌅', desc: 'Gentle remembrance' },
                  { emotion: 'Wise', emoji: '🧠', desc: 'Thoughtful counsel' },
                  { emotion: 'Playful', emoji: '😄', desc: 'Light-hearted fun' },
                ].map(v => (
                  <div
                    key={v.emotion}
                    className="p-4 rounded-xl text-center cursor-pointer transition-all hover:scale-105 group"
                    style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                  >
                    <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{v.emoji}</div>
                    <div className="text-sm font-semibold text-white">{v.emotion}</div>
                    <div className="text-xs text-gray-500">{v.desc}</div>
                    <div className="mt-2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition">
                      ▶ Play Sample
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────────────── */}
      <section
        id="pricing"
        ref={priceRef.ref}
        className={`py-20 px-4 transition-all duration-1000 ${priceRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">Choose Your Plan</h2>
          <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">Start free. Upgrade when you are ready to preserve more.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map(plan => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] ${plan.popular ? 'ring-2' : ''}`}
                style={{
                  background: BG_CARD,
                  border: `1px solid ${plan.popular ? plan.accent : BORDER}`,
                  ...(plan.popular ? { ringColor: plan.accent, boxShadow: `0 0 40px ${plan.accent}20` } : {}),
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
                  >
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mt-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-4xl font-black" style={{ color: plan.accent }}>{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span style={{ color: plan.accent }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.name)}
                  disabled={subscribing !== null}
                  className="w-full py-2.5 rounded-full text-sm font-bold transition hover:scale-[1.02] disabled:opacity-60"
                  style={
                    plan.popular
                      ? { background: `linear-gradient(135deg, #7c3aed, ${ACCENT})`, color: '#fff' }
                      : { border: `1px solid ${BORDER}`, color: '#d4d4d8' }
                  }
                >
                  {subscribing === plan.name ? 'Activating...' : isSubscribed ? 'Open Vault →' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Signals ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TRUST_SIGNALS.map(t => (
              <div
                key={t.label}
                className="p-4 rounded-xl text-center"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{t.label}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── App Store Badges ──────────────────────────────────────────── */}
      <section className="py-8 px-4 text-center">
        <p className="text-gray-400 text-sm mb-4">Available on all platforms</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ background: '#1a1a24', border: `1px solid ${BORDER}` }}>
            <span className="text-lg">🍎</span> App Store — Coming Soon
          </div>
          <div className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ background: '#1a1a24', border: `1px solid ${BORDER}` }}>
            <span className="text-lg">▶️</span> Google Play — Coming Soon
          </div>
          <div className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 flex items-center gap-2" style={{ background: '#1a1a24', border: `1px solid ${BORDER}` }}>
            <span className="text-lg">🖥️</span> Desktop (Web)
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all"
                style={{ background: BG_CARD, border: `1px solid ${openFaq === i ? ACCENT + '60' : BORDER}` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-semibold text-white hover:text-purple-300 transition"
                >
                  {item.q}
                  <span className={`ml-2 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed animate-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FaceTime Coming Soon ──────────────────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(251,191,36,0.08) 0%, transparent 70%)',
        }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-8"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#0a0a0f' }}
          >
            COMING 2026
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Ultra-Realistic{' '}
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              FaceTime Calling
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Imagine picking up the phone and seeing your loved one&apos;s face — smiling, laughing, reacting in real time.
            Using biometric data captured from your video recordings, we build a photorealistic digital avatar that
            moves exactly like you: every expression, every mannerism, every subtle head tilt.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { label: 'Face Mesh Mapping', icon: '🎭' },
              { label: 'Lip Sync Engine', icon: '👄' },
              { label: 'Emotion Detection', icon: '😊' },
              { label: 'Mannerism Capture', icon: '🤌' },
              { label: 'Body Pose Tracking', icon: '🧍' },
              { label: 'Real-Time Rendering', icon: '⚡' },
            ].map(p => (
              <div
                key={p.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: '#1a1a24', border: `1px solid ${BORDER}` }}
              >
                <span>{p.icon}</span>
                <span className="text-gray-300">{p.label}</span>
              </div>
            ))}
          </div>

          {/* Mockup concept */}
          <div className="max-w-sm mx-auto">
            <div
              className="rounded-3xl p-1 mx-auto"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f472b6, #c084fc)',
                maxWidth: 280,
              }}
            >
              <div
                className="rounded-[22px] p-8 text-center"
                style={{ background: BG_DARK }}
              >
                <div className="text-6xl mb-4">📱</div>
                <div className="text-xl font-bold text-white mb-1">FaceTime with Grandpa</div>
                <div className="text-sm text-gray-400 mb-4">Live video call — 4:32</div>
                <div className="flex justify-center gap-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: '#ef4444' }}>
                    📴
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl animate-pulse" style={{ background: '#22c55e' }}>
                    📞
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-8 max-w-lg mx-auto">
            Start recording video interviews today — every selfie-camera session captures the biometric data needed for your future FaceTime avatar. The more you record now, the more realistic the experience will be.
          </p>
        </div>
      </section>

      {/* ─── CTA Footer ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Preserving Your Legacy <span style={{ color: GOLD }}>Today</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Every memory matters. Every story deserves to be told. Begin your journey to digital immortality — free, no credit card required.
          </p>
          <a
            href="#pricing"
            className="inline-block px-10 py-4 rounded-full text-lg font-bold text-white transition hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7, #fbbf24)',
              boxShadow: `0 0 40px ${ACCENT_GLOW}30`,
            }}
          >
            Create Your Vault — Free
          </a>
        </div>
      </section>

      {/* ─── Legacy Planning Doctrine ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl" style={{ backgroundColor: '#0c1220', border: `1px solid ${BORDER}` }}>
          <h2 className="text-xl font-bold mb-2 text-white">Legacy Planning Expert Insights</h2>
          <p className="text-sm mb-6 text-gray-400">Query legal, medical, and psychological doctrine for digital legacy planning, advance directives, and estate preservation guidance.</p>
          <EngineQueryPanel
            domains={['PSY', 'MED', 'LG', 'NEURO']}
            title="Legacy Doctrine Search"
            placeholder="Ask about estate planning, advance directives, digital legacy..."
            exampleQueries={[
              'Digital asset estate planning requirements',
              'Advance healthcare directive legal standards',
              'Psychological aspects of legacy preservation',
              'Medical power of attorney considerations',
            ]}
            showStats
          />
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t text-center" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-sym-night.png" alt="EPT" width={20} height={20} />
            <span className="text-xs text-gray-500">Echo Prime Technologies</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/legal/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/engines" className="hover:text-white transition">Engines</Link>
          </div>
          <span className="text-xs text-gray-600">&copy; 2026 Echo Prime Technologies</span>
        </div>
      </footer>
      <ProductTutorialButton tutorialId="immortality-vault" productName="Immortality Vault" />
    </div>
  );
}

export default function ImmortalityVaultPage() {
  return <SubscriptionGate serviceId="immortality-vault"><ImmortalityVaultPageContent /></SubscriptionGate>;
}
