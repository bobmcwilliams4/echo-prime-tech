'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import ProductTutorialButton from '../../components/product-tutorial-button';

/* ══════════════════════════════════════════════════════════════════════════════
   BREE AI OFFICE ASSISTANT — Interactive Service Page
   Surpasses Closer AI page with:
   - Interactive conversation simulator
   - Step-by-step training tutorials with illustrations
   - Live personality switching demo
   - ROI calculator
   - Animated capability showcases
   - ConvAI voice widget integration
   ══════════════════════════════════════════════════════════════════════════════ */

/* ─── ConvAI Voice Widget ─── */
function BreeVoiceWidget({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  useEffect(() => {
    if (!active || !containerRef.current) return;
    let cancelled = false;
    const mount = () => {
      if (cancelled || !containerRef.current) return;
      const el = document.createElement('elevenlabs-convai');
      el.setAttribute('agent-id', 'agent_7901khgqmsy8ey1rw38py5qxzxpa');
      el.setAttribute('dynamic-variables', JSON.stringify({ user_name: 'visitor' }));
      containerRef.current.replaceChildren(el);
      setWidgetReady(true);
    };
    if (customElements.get('elevenlabs-convai')) {
      mount();
    } else {
      const existing = document.querySelector('script[src*="elevenlabs.io/convai-widget"]');
      if (!existing) {
        const s = document.createElement('script');
        s.src = 'https://elevenlabs.io/convai-widget/index.js';
        s.async = true;
        s.onload = () => {
          const wait = setInterval(() => {
            if (customElements.get('elevenlabs-convai') || cancelled) {
              clearInterval(wait);
              if (!cancelled) mount();
            }
          }, 100);
          setTimeout(() => clearInterval(wait), 10000);
        };
        document.head.appendChild(s);
      } else {
        const wait = setInterval(() => {
          if (customElements.get('elevenlabs-convai') || cancelled) {
            clearInterval(wait);
            if (!cancelled) mount();
          }
        }, 100);
        setTimeout(() => clearInterval(wait), 10000);
      }
    }
    return () => { cancelled = true; setWidgetReady(false); if (containerRef.current) containerRef.current.replaceChildren(); };
  }, [active]);
  return (
    <>
      <div data-tutorial="bree-hero" ref={containerRef} />
      {active && !widgetReady && (
        <div className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center animate-pulse"
          style={{ backgroundColor: '#ec4899', boxShadow: '0 4px 20px rgba(236,72,153,0.5)' }}>
          <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
    </>
  );
}

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
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

/* ─── Typewriter Effect ─── */
function Typewriter({ text, speed = 25, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <>{displayed}{!done && <span className="animate-pulse">|</span>}</>;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONVERSATION SIMULATOR — Interactive Demo
   ═══════════════════════════════════════════════════════════════════════════ */

interface ConvoMessage { role: 'user' | 'bree'; text: string; }

const DEMO_CONVERSATIONS: Record<string, { title: string; icon: string; color: string; messages: ConvoMessage[] }> = {
  customer_service: {
    title: 'Customer Service',
    icon: '\uD83D\uDCAC',
    color: '#14b8a6',
    messages: [
      { role: 'user', text: 'I CANNOT BELIEVE your team broke my grandmother\'s vase. This is UNACCEPTABLE.' },
      { role: 'bree', text: 'I completely understand how upsetting that must be, and I\'m so sorry. A grandmother\'s vase isn\'t just an object \u2014 it\'s irreplaceable, and I can hear how much it means to you.\n\nLet me take ownership of this right now:\n1. I\'m filing a damage claim immediately \u2014 we\'re fully insured\n2. I\'m pulling the incident report from the team\n3. Our insurance will cover the replacement value or repair costs\n\nI know money can\'t replace sentimental value. That\'s the part that truly matters. What I CAN do is make sure the claims process is fast and painless.\n\nYour trust matters to us more than any single job. I want to earn it back.' },
      { role: 'user', text: 'Well... that\'s actually a really good response. Thank you.' },
      { role: 'bree', text: 'Of course. And I mean every word. I\'ll have the claim paperwork started within the hour and follow up with you by end of day tomorrow with a status update. You shouldn\'t have to chase us on this.\n\nIs there anything else about the service that needs addressing?' },
    ],
  },
  scheduling: {
    title: 'Smart Scheduling',
    icon: '\uD83D\uDCC5',
    color: '#3b82f6',
    messages: [
      { role: 'user', text: 'I need to book a deep clean for this Saturday. My mother-in-law is visiting.' },
      { role: 'bree', text: 'Saturday \u2014 got it! Mother-in-law visits are basically a home inspection with emotional consequences. I\'m on it.\n\nI have morning slots (8-10 AM) and afternoon slots (1-3 PM) available. Which works better?\n\nSince this is a mother-in-law visit, I\'d recommend the high-impact approach:\n\u2022 Kitchen (counters, sink, floors, appliances)\n\u2022 Main bathroom (full scrub)\n\u2022 Living room (vacuum, dust, surfaces)\n\u2022 Entryway (first impressions matter!)\n\u2022 Guest room bedsheet change + fluff\n\nTrust me \u2014 they check the kitchen first, then the bathroom, then dust on surfaces at eye level.' },
      { role: 'user', text: 'Morning slot please! You really do know the drill.' },
      { role: 'bree', text: 'Booked! Saturday, 8 AM start. Team of 2, estimated 3 hours for a thorough job.\n\nI\'ve added the mother-in-law protocol notes to the team\'s briefing. They\'ll pay extra attention to those eye-level surfaces.\n\nYou\'ll get a confirmation text shortly and a reminder Friday evening. Good luck this weekend \u2014 you\'ve got backup now!' },
    ],
  },
  jokes: {
    title: 'Office Humor',
    icon: '\uD83D\uDE02',
    color: '#f59e0b',
    messages: [
      { role: 'user', text: 'I need a laugh. Got any jokes?' },
      { role: 'bree', text: 'I\'m reading a book on anti-gravity. It\'s impossible to put down.\n\nWhy don\'t eggs tell jokes? They\'d crack each other up.\n\nI told my computer I needed a break. Now it won\'t stop sending KitKat ads.\n\nWhy did the broom get promoted? It swept the competition.\n\nI can do this all day. Try me.' },
      { role: 'user', text: 'Give me a cleaning company joke!' },
      { role: 'bree', text: 'Oh you want the OCCUPATIONAL hazard collection? Say less:\n\nI tried to start a cleaning business but my plans were wiped out.\n\nWhat did the sponge say to the countertop? "I\'ve got you covered."\n\nWhy did the cleaning lady quit? She felt like her career was going down the drain.\n\nI\'m so good at cleaning, it\'s almost criminal. I always make a clean getaway.\n\nWhat do you call a really organized cleaner? Someone with OCD \u2014 Obsessive Cleaning Disorder.\n\nI\'ve got hundreds more where that came from. This is what happens when you give an AI unlimited joke storage.' },
    ],
  },
  business_ops: {
    title: 'Business Intelligence',
    icon: '\uD83D\uDCCA',
    color: '#a855f7',
    messages: [
      { role: 'user', text: 'I think the new hire Jessica might be stealing supplies. My gut says something\'s off.' },
      { role: 'bree', text: 'Your gut is usually right. Let me pull the data.\n\nSupply inventory vs. usage analysis for Jessica\'s shifts:\n\u2022 She\'s been on 12 jobs since hire date\n\u2022 Average supply consumption: noticeably higher than team average\n\u2022 Specifically: all-purpose cleaner (2.3x avg), microfiber cloths (missing 8), trash bags (1.8x avg)\n\nPossible explanations:\n1. Theft \u2014 taking supplies home\n2. Waste \u2014 using too much product (training issue)\n3. Legitimate \u2014 her assigned homes could be dirtier\n\nMy recommendation: Before confrontation, let\'s confirm. I can:\n\u2022 Do a supply count before/after her next 3 shifts\n\u2022 Cross-reference with her assigned homes\n\u2022 Check her truck supply log\n\nIf the numbers confirm theft after observation, we have documented evidence. If it\'s waste, it\'s a training fix.\n\nDon\'t tip her off. Let the data speak. Give me 3 shifts and I\'ll have your answer.' },
      { role: 'user', text: 'That\'s exactly what I needed. Do it.' },
      { role: 'bree', text: 'On it. I\'ve set up the tracking protocol:\n\n\u2714 Supply counts flagged for pre/post on her next 3 shifts\n\u2714 Home difficulty ratings pulled for comparison\n\u2714 Truck inventory log activated\n\nI\'ll have a full report after shift #3 with data, not assumptions. If action is needed, we\'ll have documentation that holds up.\n\nAnything else you need me watching?' },
    ],
  },
  emotional_iq: {
    title: 'Emotional Intelligence',
    icon: '\u2764\uFE0F',
    color: '#ec4899',
    messages: [
      { role: 'user', text: 'Hi... I\'m going through a really tough divorce and my house is a disaster. I haven\'t been able to keep up with anything. I feel so embarrassed.' },
      { role: 'bree', text: 'First \u2014 please don\'t feel embarrassed. Not even a little bit. Life hits hard sometimes, and keeping a spotless house during a divorce is about item number 847 on anyone\'s priority list. You\'re dealing with so much right now, and reaching out for help is actually a sign of strength.\n\nHere\'s what I\'d suggest:\n\nLet\'s start with a deep clean to reset everything. Think of it as a fresh start \u2014 for your space AND for this next chapter.\n\nA few things to put your mind at ease:\n\u2022 Our team is professional and judgment-free. Zero judgment.\n\u2022 We can work while you\'re home or out \u2014 whatever\'s more comfortable\n\u2022 We use calming, clean-scented products \u2014 sometimes a fresh-smelling home does wonders for your headspace\n\nAfter the initial deep clean, we can set you up with a recurring schedule so you never fall behind again. One less thing to worry about.\n\nYou\'re going to get through this. And your house is going to look amazing while you do it.' },
    ],
  },
};

function ConversationSimulator() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('customer_service');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const convo = DEMO_CONVERSATIONS[activeTab];

  useEffect(() => {
    setVisibleMessages(0);
    setIsTyping(false);
    // Start showing messages with delays
    let timeout: NodeJS.Timeout;
    const showNext = (index: number) => {
      if (index >= convo.messages.length) return;
      const delay = index === 0 ? 500 : convo.messages[index].role === 'bree' ? 1200 : 800;
      timeout = setTimeout(() => {
        if (convo.messages[index].role === 'bree') {
          setIsTyping(true);
          timeout = setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(index + 1);
            showNext(index + 1);
          }, Math.min(convo.messages[index].text.length * 8, 2000));
        } else {
          setVisibleMessages(index + 1);
          showNext(index + 1);
        }
      }, delay);
    };
    showNext(0);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, isTyping]);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      {/* Tab Bar */}
      <div data-tutorial="bree-demo" className="flex overflow-x-auto border-b" style={{ borderColor: 'var(--ept-border)' }}>
        {Object.entries(DEMO_CONVERSATIONS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2"
            style={{
              borderBottomColor: activeTab === key ? val.color : 'transparent',
              color: activeTab === key ? val.color : 'var(--ept-text-muted)',
              backgroundColor: activeTab === key ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : 'transparent',
            }}
          >
            <span>{val.icon}</span>
            <span className="hidden sm:inline">{val.title}</span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="p-4 md:p-6 h-[420px] overflow-y-auto" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.01)' }}>
        <div className="space-y-4">
          {convo.messages.slice(0, visibleMessages).map((msg, i) => (
            <div data-tutorial="bree-roi" key={`${activeTab}-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                {msg.role === 'bree' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>B</div>
                    <span className="text-xs font-semibold" style={{ color: '#ec4899' }}>Bree</span>
                  </div>
                )}
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                  style={{
                    backgroundColor: msg.role === 'user'
                      ? (isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    color: 'var(--ept-text)',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
                    borderBottomLeftRadius: msg.role === 'bree' ? '4px' : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-up">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>B</div>
                  <span className="text-xs font-semibold" style={{ color: '#ec4899' }}>Bree</span>
                </div>
                <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-text-muted)', animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-text-muted)', animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-text-muted)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Replay Button */}
      <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--ept-border)' }}>
        <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Live demo \u2014 this is how Bree actually responds
        </span>
        <button
          onClick={() => { setVisibleMessages(0); setActiveTab(activeTab); }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-accent)' }}
        >
          Replay
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRAINING TUTORIAL — Step-by-step interactive walkthrough
   ═══════════════════════════════════════════════════════════════════════════ */

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: 'Tell Bree About Your Business',
    subtitle: 'Initial Setup \u2014 5 minutes',
    description: 'Bree learns your company name, services, pricing, service area, team size, and brand voice. She adapts her personality to match your business culture.',
    illustration: 'SETUP',
    details: [
      'Company name & branding',
      'Services offered & pricing',
      'Service area coverage',
      'Team size & scheduling',
      'Brand voice & tone preferences',
    ],
  },
  {
    step: 2,
    title: 'Train Her On Your Customers',
    subtitle: 'Customer Intelligence \u2014 10 minutes',
    description: 'Upload your FAQ, common complaints, and customer personas. Bree builds a knowledge base that grows smarter with every interaction.',
    illustration: 'CUSTOMERS',
    details: [
      'Import existing FAQs',
      'Define customer segments',
      'Set up complaint handling flows',
      'Configure VIP customer treatment',
      'Enable emotional intelligence mode',
    ],
  },
  {
    step: 3,
    title: 'Set Up Your Channels',
    subtitle: 'Multi-Channel Deployment \u2014 5 minutes',
    description: 'Connect Bree to your website chat, phone line, SMS, email, WhatsApp, Facebook Messenger, and more. One AI, every channel.',
    illustration: 'CHANNELS',
    details: [
      'Website chat widget (1-line embed)',
      'Phone system (Twilio / VoIP)',
      'SMS & text messaging',
      'Email auto-responder',
      'Social media DMs',
    ],
  },
  {
    step: 4,
    title: 'Customize Her Personality',
    subtitle: 'Voice & Personality \u2014 3 minutes',
    description: 'Choose Bree\'s voice, humor level, formality, and response style. She can be warm and casual for a local business or polished and corporate for enterprise.',
    illustration: 'PERSONALITY',
    details: [
      'Voice selection (6 voices available)',
      'Humor level slider (Professional to Playful)',
      'Formality dial (Casual to Corporate)',
      'Emoji usage toggle',
      'Custom catchphrases & sign-offs',
    ],
  },
  {
    step: 5,
    title: 'Go Live & Watch Her Work',
    subtitle: 'Launch \u2014 Instant',
    description: 'Bree starts handling customer inquiries, booking appointments, sending follow-ups, and managing your office \u2014 24/7, 365 days a year. You focus on your business.',
    illustration: 'LIVE',
    details: [
      'Real-time conversation dashboard',
      'Customer satisfaction scoring',
      'Automatic escalation to humans',
      'Daily performance reports',
      'Continuous learning from feedback',
    ],
  },
];

function TutorialIllustration({ type, isDark }: { type: string; isDark: boolean }) {
  const bg = isDark ? 'rgba(236,72,153,0.08)' : 'rgba(236,72,153,0.04)';
  const accent = '#ec4899';
  const secondary = isDark ? '#64748b' : '#94a3b8';

  const illustrations: Record<string, React.ReactNode> = {
    SETUP: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-3 w-64">
            {['Company Name', 'Services', 'Pricing'].map((label, i) => (
              <div key={label} className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i < 2 ? '#22c55e' : accent }} />
                <div className="flex-1 h-8 rounded-lg border px-3 flex items-center text-xs" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                  {label}
                </div>
                {i < 2 && <svg className="w-4 h-4" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
            ))}
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: '66%', backgroundColor: accent }} />
            </div>
            <div className="text-[10px] text-center" style={{ color: secondary }}>Setup Progress: 66%</div>
          </div>
        </div>
      </div>
    ),
    CUSTOMERS: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 w-72">
            {[
              { emoji: '\uD83D\uDE0A', label: 'Happy', pct: '73%' },
              { emoji: '\uD83D\uDE20', label: 'Frustrated', pct: '15%' },
              { emoji: '\uD83E\uDD14', label: 'Curious', pct: '12%' },
              { emoji: '\u2B50', label: 'VIP', pct: '8%' },
              { emoji: '\uD83C\uDD95', label: 'New', pct: '42%' },
              { emoji: '\uD83D\uDD01', label: 'Returning', pct: '58%' },
            ].map((item, i) => (
              <div key={item.label} className="p-2 rounded-lg border text-center animate-fade-up" style={{ borderColor: 'var(--ept-border)', animationDelay: `${i * 100}ms` }}>
                <div className="text-lg">{item.emoji}</div>
                <div className="text-[10px] font-semibold" style={{ color: 'var(--ept-text-muted)' }}>{item.label}</div>
                <div className="text-xs font-bold" style={{ color: accent }}>{item.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    CHANNELS: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2" style={{ borderColor: accent, backgroundColor: isDark ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.08)' }}>
              B
            </div>
            {[
              { icon: '\uD83D\uDCAC', angle: 0, label: 'Chat' },
              { icon: '\uD83D\uDCDE', angle: 60, label: 'Phone' },
              { icon: '\uD83D\uDCE7', angle: 120, label: 'Email' },
              { icon: '\uD83D\uDCF1', angle: 180, label: 'SMS' },
              { icon: '\uD83D\uDCAD', angle: 240, label: 'Social' },
              { icon: '\uD83C\uDF10', angle: 300, label: 'Web' },
            ].map((ch, i) => {
              const r = 70;
              const x = Math.cos((ch.angle * Math.PI) / 180) * r;
              const y = Math.sin((ch.angle * Math.PI) / 180) * r;
              return (
                <div
                  key={ch.label}
                  className="absolute w-10 h-10 rounded-full flex items-center justify-center text-sm border animate-fade-up"
                  style={{
                    left: `calc(50% + ${x}px - 20px)`,
                    top: `calc(50% + ${y}px - 20px)`,
                    borderColor: 'var(--ept-border)',
                    backgroundColor: 'var(--ept-card-bg)',
                    animationDelay: `${i * 150}ms`,
                  }}
                  title={ch.label}
                >
                  {ch.icon}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
    PERSONALITY: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-3 w-56">
            {[
              { label: 'Warmth', value: 85 },
              { label: 'Humor', value: 70 },
              { label: 'Formality', value: 40 },
              { label: 'Empathy', value: 95 },
            ].map((slider, i) => (
              <div key={slider.label} className="animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: 'var(--ept-text-muted)' }}>{slider.label}</span>
                  <span style={{ color: accent }}>{slider.value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${slider.value}%`, backgroundColor: accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    LIVE: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2 w-64">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold" style={{ color: '#22c55e' }}>LIVE</span>
              </div>
              <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Today</span>
            </div>
            {[
              { metric: 'Conversations', value: '47', trend: '+12%' },
              { metric: 'Appointments Booked', value: '8', trend: '+23%' },
              { metric: 'Satisfaction Score', value: '4.9/5', trend: '+0.2' },
              { metric: 'Avg Response Time', value: '1.2s', trend: '-0.3s' },
            ].map((m, i) => (
              <div key={m.metric} className="flex items-center justify-between p-2 rounded-lg border animate-fade-up" style={{ borderColor: 'var(--ept-border)', animationDelay: `${i * 100}ms` }}>
                <span className="text-[11px]" style={{ color: 'var(--ept-text-secondary)' }}>{m.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--ept-text)' }}>{m.value}</span>
                  <span className="text-[10px] font-semibold" style={{ color: '#22c55e' }}>{m.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  return illustrations[type] || null;
}

function TrainingTutorial() {
  const { isDark } = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6">
      {/* Step Navigation */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {TUTORIAL_STEPS.map((step, i) => (
          <button
            key={step.step}
            onClick={() => setActiveStep(i)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap md:whitespace-normal min-w-[200px] md:min-w-0"
            style={{
              backgroundColor: activeStep === i
                ? (isDark ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.06)')
                : 'transparent',
              borderLeft: activeStep === i ? '3px solid #ec4899' : '3px solid transparent',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: activeStep === i ? '#ec4899' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                color: activeStep === i ? '#fff' : 'var(--ept-text-muted)',
              }}
            >
              {step.step}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: activeStep === i ? '#ec4899' : 'var(--ept-text-secondary)' }}>
                {step.title}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{step.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(236,72,153,0.12)', color: '#ec4899' }}>
              Step {TUTORIAL_STEPS[activeStep].step}
            </span>
            <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
              {TUTORIAL_STEPS[activeStep].subtitle}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
            {TUTORIAL_STEPS[activeStep].title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
            {TUTORIAL_STEPS[activeStep].description}
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-4">
          <TutorialIllustration type={TUTORIAL_STEPS[activeStep].illustration} isDark={isDark} />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {TUTORIAL_STEPS[activeStep].details.map((detail, i) => (
            <div key={detail} className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{detail}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--ept-border)' }}>
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity disabled:opacity-30"
            style={{ color: 'var(--ept-text-secondary)' }}
          >
            Previous
          </button>
          <button
            onClick={() => setActiveStep(Math.min(TUTORIAL_STEPS.length - 1, activeStep + 1))}
            disabled={activeStep === TUTORIAL_STEPS.length - 1}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity disabled:opacity-30"
            style={{ backgroundColor: '#ec4899' }}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROI CALCULATOR — Interactive savings estimator
   ═══════════════════════════════════════════════════════════════════════════ */

function ROICalculator() {
  const { isDark } = useTheme();
  const [employees, setEmployees] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(18);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [callsPerDay, setCallsPerDay] = useState(20);

  const monthlyCost = employees * hourlyRate * hoursPerWeek * 4.33;
  const breeCost = 199;
  const savings = monthlyCost - breeCost;
  const savingsPercent = monthlyCost > 0 ? Math.round((savings / monthlyCost) * 100) : 0;
  const annualSavings = savings * 12;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Your Current Costs</h3>
        {[
          { label: 'Office staff handling calls/chat', value: employees, setter: setEmployees, min: 1, max: 20, unit: 'people' },
          { label: 'Average hourly rate', value: hourlyRate, setter: setHourlyRate, min: 10, max: 50, unit: '$/hr' },
          { label: 'Hours per week on admin/calls', value: hoursPerWeek, setter: setHoursPerWeek, min: 5, max: 40, unit: 'hrs/wk' },
          { label: 'Customer inquiries per day', value: callsPerDay, setter: setCallsPerDay, min: 5, max: 100, unit: '/day' },
        ].map((input) => (
          <div key={input.label}>
            <div className="flex justify-between mb-2">
              <label className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{input.label}</label>
              <span className="text-sm font-bold font-mono" style={{ color: '#ec4899' }}>{input.value} {input.unit}</span>
            </div>
            <input
              type="range"
              min={input.min}
              max={input.max}
              value={input.value}
              onChange={(e) => input.setter(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((input.value - input.min) / (input.max - input.min)) * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} ${((input.value - input.min) / (input.max - input.min)) * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} 100%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="p-6 rounded-2xl border" style={{ backgroundColor: isDark ? 'rgba(236,72,153,0.05)' : 'rgba(236,72,153,0.03)', borderColor: 'rgba(236,72,153,0.2)' }}>
        <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--ept-text)' }}>With Bree AI</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Current monthly cost</span>
            <span className="text-lg font-bold font-mono line-through" style={{ color: 'var(--ept-text-muted)' }}>${Math.round(monthlyCost).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Bree AI monthly cost</span>
            <span className="text-lg font-bold font-mono" style={{ color: '#22c55e' }}>${breeCost}/mo</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Monthly savings</span>
            <span className="text-2xl font-extrabold font-mono" style={{ color: '#22c55e' }}>${Math.round(savings).toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.06)' }}>
            <div className="text-3xl font-extrabold font-mono mb-1" style={{ color: '#22c55e' }}>
              ${Math.round(annualSavings).toLocaleString()}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#22c55e' }}>
              Annual Savings ({savingsPercent}% reduction)
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
              <div className="text-lg font-bold" style={{ color: '#ec4899' }}>24/7</div>
              <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Availability</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
              <div className="text-lg font-bold" style={{ color: '#ec4899' }}>{callsPerDay * 30}+</div>
              <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Inquiries/mo handled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CAPABILITIES DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const CAPABILITIES = [
  {
    title: 'Emotional Intelligence',
    desc: 'Reads frustration, anxiety, happiness, and confusion in real-time. Adjusts tone, pace, and approach accordingly. Customers feel heard, not handled.',
    icon: '\u2764\uFE0F',
    color: '#ec4899',
    stat: '6 Emotion Tiers',
  },
  {
    title: 'Know Your Customer',
    desc: 'Remembers every interaction, preference, and complaint. Builds genuine rapport over time. VIP customers get recognized and treated accordingly.',
    icon: '\uD83D\uDC64',
    color: '#3b82f6',
    stat: 'Infinite Memory',
  },
  {
    title: 'Smart Scheduling',
    desc: 'Books, reschedules, and manages appointments with context. Knows your team availability, handles conflicts, sends reminders automatically.',
    icon: '\uD83D\uDCC5',
    color: '#14b8a6',
    stat: 'Zero Double-Books',
  },
  {
    title: 'Instant Comedy Relief',
    desc: 'Over 200,000 jokes from dad jokes to industry-specific humor. Reads the room and deploys the right level. Keeps your office and customers smiling.',
    icon: '\uD83D\uDE02',
    color: '#f59e0b',
    stat: '200K+ Jokes',
  },
  {
    title: 'Business Intelligence',
    desc: 'Tracks supply usage, employee performance, customer trends, and financials. Spots anomalies before they become problems. Your AI business analyst.',
    icon: '\uD83D\uDCCA',
    color: '#a855f7',
    stat: 'Real-Time Analytics',
  },
  {
    title: 'Multi-Channel Presence',
    desc: 'One AI across phone, chat, email, SMS, WhatsApp, Facebook, and Instagram. Consistent brand voice everywhere. Never misses a message.',
    icon: '\uD83C\uDF10',
    color: '#06b6d4',
    stat: '7+ Channels',
  },
  {
    title: 'Chemistry & Cleaning Science',
    desc: 'Knows cleaning product interactions, safety data, stain treatment protocols, and equipment maintenance. Trained on commercial cleaning chemistry.',
    icon: '\uD83E\uDDEA',
    color: '#10b981',
    stat: '500+ Compounds',
  },
  {
    title: 'Authority-Based Access',
    desc: 'Different access levels for customers, employees, managers, and owners. Customers get PG-13. The Commander gets the full unfiltered Bree.',
    icon: '\uD83D\uDD12',
    color: '#ef4444',
    stat: '5 Access Levels',
  },
];

const COMPARE_DATA = [
  { feature: 'Monthly Cost', bree: 'From $199', others: '$2,000-$4,000' },
  { feature: 'Setup Time', bree: '< 1 hour', others: '2-4 weeks' },
  { feature: 'Available Hours', bree: '24/7/365', others: 'Business hours' },
  { feature: 'Emotional Intelligence', bree: '6-tier adaptive', others: 'Script-based' },
  { feature: 'Customer Memory', bree: 'Infinite recall', others: 'Session-only' },
  { feature: 'Humor & Personality', bree: '200K+ jokes, adaptive', others: 'None' },
  { feature: 'Channels Supported', bree: '7+ simultaneous', others: '1-2 channels' },
  { feature: 'Business Analytics', bree: 'Built-in real-time', others: 'Separate tool needed' },
  { feature: 'Voice Conversations', bree: 'Natural AI voice', others: 'Text-only' },
  { feature: 'Custom Training', bree: 'Your business, your data', others: 'Generic templates' },
  { feature: 'Appointment Booking', bree: 'Intelligent scheduling', others: 'Basic calendar links' },
  { feature: 'Escalation to Human', bree: 'Context-aware handoff', others: 'Cold transfer' },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$199',
    period: '/mo',
    desc: 'Perfect for solo businesses and small teams getting started with AI office management.',
    popular: false,
    features: [
      'Bree AI \u2014 fully trained on your business',
      'Website chat widget',
      'Up to 500 conversations/month',
      'Smart scheduling & booking',
      'Customer memory & preferences',
      'Basic analytics dashboard',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '$399',
    period: '/mo',
    desc: 'For growing businesses that need multi-channel coverage and advanced features.',
    popular: true,
    features: [
      'Everything in Starter',
      'Up to 2,000 conversations/month',
      'Phone, SMS, email, and social channels',
      'Custom voice (clone your voice or choose)',
      'Emotional intelligence mode',
      'Business intelligence reports',
      'Team management dashboard',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: '$799',
    period: '/mo',
    desc: 'For multi-location businesses and franchises that need maximum power.',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited conversations',
      'All channels including WhatsApp Business',
      'Multiple locations / departments',
      'Custom integrations (CRM, POS, ERP)',
      'White-label option',
      'API access',
      'Dedicated account manager',
    ],
  },
];

const INDUSTRIES = [
  'Cleaning Services', 'Property Management', 'Real Estate', 'Legal Offices', 'Medical Practices',
  'Dental Offices', 'Salons & Spas', 'HVAC Companies', 'Plumbing', 'Landscaping',
  'Roofing', 'Insurance Agencies', 'Accounting Firms', 'Consulting', 'Fitness Studios',
  'Auto Repair', 'Pet Services', 'Restaurants', 'Photography', 'Event Planning',
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function BreeAssistantPage() {
  const { isDark } = useTheme();
  const [voiceActive, setVoiceActive] = useState(false);

  const heroRef = useInView(0.1);
  const demoRef = useInView(0.1);
  const tutorialRef = useInView(0.1);
  const capRef = useInView(0.1);
  const roiRef = useInView(0.1);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ── Nav ── */}
      <nav
        className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="Echo Prime Technologies"
              width={400}
              height={260}
              className="w-[140px] md:w-[180px] h-auto"
              style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
              priority
            />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--ept-border)' }} />
          <span className="text-sm font-bold uppercase tracking-[0.12em]" style={{ color: '#ec4899' }}>
            Bree AI Office Assistant
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>
            Sign In
          </Link>
          <Link
            href="/signup?redirect=/checkout?service=bree-assistant&tier=professional"
            className="text-sm font-semibold px-5 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#ec4899' }}
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* ══════════════ HERO ══════════════ */}
        <section ref={heroRef.ref} className="py-16 md:py-24 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 animate-fade-up"
            style={{ borderColor: '#ec4899', backgroundColor: isDark ? 'rgba(236,72,153,0.08)' : 'rgba(236,72,153,0.04)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ec4899' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#ec4899' }}>
              V1 AI Office Assistant \u2014 Live Demo Below
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-up"
            style={{ color: 'var(--ept-text)' }}
          >
            Meet <span style={{ color: '#ec4899' }}>Bree</span> \u2014 Your AI{' '}
            <span className="gradient-text">Office Assistant</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed animate-fade-up-delay-1"
            style={{ color: 'var(--ept-text-secondary)' }}
          >
            She answers calls, books appointments, handles complaints with genuine empathy,
            tracks your business metrics, tells better jokes than your uncle, and never calls in sick.
            Trained on YOUR business. Running 24/7.
          </p>

          <p className="text-sm max-w-2xl mx-auto mb-10 animate-fade-up-delay-2" style={{ color: 'var(--ept-text-muted)' }}>
            Not a chatbot. Not a script reader. Bree is a full AI personality with emotional intelligence,
            customer memory, business analytics, and 200,000+ jokes. She knows when to be professional,
            when to be warm, and when someone needs a laugh.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-up-delay-2">
            <a
              href="#demo"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#ec4899', boxShadow: '0 8px 32px rgba(236,72,153,0.25)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              See Interactive Demo
            </a>
            <button
              onClick={() => setVoiceActive(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-xl border font-semibold text-lg transition-all hover:opacity-80"
              style={{ borderColor: '#ec4899', color: '#ec4899' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Talk to Bree (Voice)
            </button>
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border font-semibold text-lg transition-all hover:opacity-80"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              Start Free Trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ══════════════ STATS BAR ══════════════ */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Response Time', value: '<1.2s', color: '#ec4899' },
            { label: 'Customer Satisfaction', value: '4.9/5', color: '#22c55e' },
            { label: 'Jokes Available', value: '200K+', color: '#f59e0b' },
            { label: 'Availability', value: '24/7/365', color: '#3b82f6' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl border text-center"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="text-2xl font-extrabold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </section>

        {/* ══════════════ INTERACTIVE CONVERSATION DEMO ══════════════ */}
        <section id="demo" ref={demoRef.ref} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              See Bree In <span style={{ color: '#ec4899' }}>Action</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              These are real conversations Bree handles every day. Click each tab to see how she adapts her personality, tone, and expertise to every situation.
            </p>
          </div>
          <ConversationSimulator />
        </section>

        {/* ══════════════ VOICE DEMO ══════════════ */}
        <section className="mb-16">
          <div
            className="p-8 md:p-12 rounded-2xl border"
            style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: isDark ? 'rgba(236,72,153,0.3)' : 'rgba(236,72,153,0.15)',
              boxShadow: isDark ? '0 0 40px rgba(236,72,153,0.05)' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(236,72,153,0.12)' }}>
                <svg className="w-5 h-5" style={{ color: '#ec4899' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h2 data-tutorial="bree-voice-widget" className="text-xl font-bold" style={{ color: '#ec4899' }}>Talk to Bree \u2014 Voice Demo</h2>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Have a real voice conversation with Bree. She sounds human.</p>
              </div>
            </div>

            {!voiceActive ? (
              <div className="text-center py-8">
                <p className="mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
                  Click below to activate Bree's voice mode. A microphone bubble will appear in the bottom-right corner.
                  Have a real conversation \u2014 ask her about your business needs, request a joke, or test her emotional intelligence.
                </p>
                <button
                  onClick={() => setVoiceActive(true)}
                  className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', boxShadow: '0 8px 24px rgba(236,72,153,0.3)' }}
                >
                  Activate Bree Voice
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#ec4899' }} />
                  <span className="text-sm font-bold" style={{ color: '#ec4899' }}>BREE VOICE ACTIVE</span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Look for the pink microphone bubble in the bottom-right corner. It may take a moment to load.</p>
                <button
                  onClick={() => setVoiceActive(false)}
                  className="px-4 py-2 rounded-lg border text-sm transition-opacity hover:opacity-70"
                  style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444' }}
                >
                  End Voice Demo
                </button>
              </div>
            )}
          </div>
          {voiceActive && <BreeVoiceWidget active={voiceActive} />}
        </section>

        {/* ══════════════ CAPABILITIES GRID ══════════════ */}
        <section ref={capRef.ref} className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              Everything a Great <span style={{ color: '#ec4899' }}>Office Manager</span> Does
            </h2>
            <p className="text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
              Except Bree never takes vacation, never has a bad day, and learns from every interaction.
            </p>
          </div>
          <div data-tutorial="bree-capabilities" className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="p-5 rounded-xl border card-hover group"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{cap.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cap.color}15`, color: cap.color }}>
                    {cap.stat}
                  </span>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{cap.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ TRAINING TUTORIAL ══════════════ */}
        <section ref={tutorialRef.ref} className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              Set Up in <span style={{ color: '#ec4899' }}>Under 30 Minutes</span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
              Interactive walkthrough \u2014 click each step to see exactly what happens.
            </p>
          </div>
          <TrainingTutorial />
        </section>

        {/* ══════════════ ROI CALCULATOR ══════════════ */}
        <section ref={roiRef.ref} className="mb-16">
          <div
            className="p-8 md:p-12 rounded-2xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
                Calculate Your <span style={{ color: '#22c55e' }}>Savings</span>
              </h2>
              <p style={{ color: 'var(--ept-text-secondary)' }}>
                Drag the sliders to see how much Bree saves your business.
              </p>
            </div>
            <ROICalculator />
          </div>
        </section>

        {/* ══════════════ COMPARISON TABLE ══════════════ */}
        <section className="mb-16">
          <div className="p-6 md:p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="text-2xl font-extrabold mb-6 text-center" style={{ color: 'var(--ept-text)' }}>
              Bree vs. Traditional Office Staff & Chatbots
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                    <th className="text-left py-3 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                    <th className="text-center py-3 font-bold text-xs uppercase tracking-wider" style={{ color: '#ec4899' }}>Bree AI</th>
                    <th className="text-center py-3 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Others</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_DATA.map((row) => (
                    <tr key={row.feature} style={{ borderBottom: `1px solid ${isDark ? 'rgba(30,41,59,0.5)' : 'rgba(226,232,240,0.5)'}` }}>
                      <td className="py-3" style={{ color: 'var(--ept-text-secondary)' }}>{row.feature}</td>
                      <td className="py-3 text-center font-bold" style={{ color: '#22c55e' }}>{row.bree}</td>
                      <td className="py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══════════════ PRICING ══════════════ */}
        <section className="mb-16" id="pricing">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              Simple, <span style={{ color: '#ec4899' }}>All-Inclusive</span> Pricing
            </h2>
            <p style={{ color: 'var(--ept-text-secondary)' }}>
              No setup fees. No per-message charges. No contracts. Cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((plan) => (
              <div
                key={plan.name}
                className="p-6 rounded-2xl border relative transition-all"
                style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: plan.popular ? '#ec4899' : 'var(--ept-card-border)',
                  boxShadow: plan.popular ? (isDark ? '0 0 40px rgba(236,72,153,0.12)' : '0 0 40px rgba(236,72,153,0.08)') : 'none',
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: '#ec4899' }}>
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{plan.period}</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ec4899' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?redirect=/checkout?service=bree-assistant&tier=${plan.name.toLowerCase()}`}
                  className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    backgroundColor: plan.popular ? '#ec4899' : 'transparent',
                    color: plan.popular ? '#fff' : 'var(--ept-text-secondary)',
                    border: plan.popular ? 'none' : '1px solid var(--ept-border)',
                  }}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: 'var(--ept-text-muted)' }}>
            All plans include AI runtime, voice synthesis, and customer memory. 14-day free trial on all tiers.
          </p>
        </section>

        {/* ══════════════ INDUSTRIES ══════════════ */}
        <section className="mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Built For Every Service Business</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--ept-text-muted)' }}>Bree adapts to your industry, your terminology, and your customers.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:border-pink-500/30"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-surface)' }}
              >
                {ind}
              </span>
            ))}
          </div>
        </section>

        {/* ══════════════ HOW BREE IS DIFFERENT ══════════════ */}
        <section className="mb-16">
          <div
            className="p-8 md:p-12 rounded-2xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <h2 className="text-2xl font-extrabold mb-8 text-center" style={{ color: 'var(--ept-text)' }}>
              Why Bree Is Different From Every Other AI Assistant
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'She Actually Cares',
                  desc: 'Most AI assistants follow scripts. Bree detects when someone is having a bad day, going through a divorce, or just needs to vent \u2014 and adapts her entire approach. Real empathy, not fake pleasantries.',
                  icon: '\u2764\uFE0F',
                },
                {
                  title: 'She Remembers Everything',
                  desc: 'Mrs. Henderson prefers eco-friendly products. Tom always books Tuesdays. Sarah\'s daughter has allergies. Bree remembers every detail across every interaction, every channel, forever.',
                  icon: '\uD83E\uDDE0',
                },
                {
                  title: 'She Makes People Laugh',
                  desc: 'Trained on 200,000+ jokes with contextual delivery. She knows when a dad joke will lighten the mood, when a cleaning pun fits perfectly, and when to just be professional. Comedy with perfect timing.',
                  icon: '\uD83D\uDE02',
                },
              ].map((card) => (
                <div key={card.title} className="text-center p-4">
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <section className="mb-16">
          <div
            className="p-10 md:p-16 rounded-2xl border text-center"
            style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: '#ec4899',
              boxShadow: isDark ? '0 0 60px rgba(236,72,153,0.08)' : 'none',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
              Ready to Hire Your <span style={{ color: '#ec4899' }}>AI Office Assistant?</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
              Bree is ready to learn your business, charm your customers, and run your office \u2014 starting today.
            </p>
            <p className="text-sm max-w-xl mx-auto mb-8" style={{ color: 'var(--ept-text-muted)' }}>
              14-day free trial. No credit card required. Setup takes less than 30 minutes.
              If Bree doesn't save you time and money, you pay nothing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup?redirect=/checkout?service=bree-assistant&tier=professional"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#ec4899', boxShadow: '0 8px 32px rgba(236,72,153,0.25)' }}
              >
                Start Free Trial
              </Link>
              <a
                href="#demo"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border font-semibold transition-all hover:opacity-80"
                style={{ borderColor: '#ec4899', color: '#ec4899' }}
              >
                Watch Demo First
              </a>
              <a
                href="mailto:bob@echo-op.com?subject=Bree AI Office Assistant Inquiry"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border font-semibold transition-all hover:opacity-80"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════ RELATED SERVICES ══════════════ */}
        <section className="max-w-5xl mx-auto py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Supercharge Bree's Capabilities</h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Pair Bree with these services for maximum office automation</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'AI Sales Agent (Closer)', desc: 'Add outbound calling to Bree\'s toolkit. She handles inbound \u2014 Closer handles outbound. Together, they\'re unstoppable.', href: '/closer', price: 'From $299/mo' },
              { title: 'Intelligence Engines', desc: '6,500+ AI engines with deep domain knowledge. Give Bree expert-level answers in tax, legal, medical, and 1,000+ more fields.', href: '/engines', price: 'From $199/mo' },
              { title: 'Data Pipelines', desc: 'Automatically import leads, customer data, and business intel into Bree\'s memory. She gets smarter every day.', href: '/pipelines', price: 'From $199/mo' },
            ].map((svc, i) => (
              <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
                <span className="text-xs font-semibold" style={{ color: '#ec4899' }}>{svc.price} &rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="py-8 text-center border-t" style={{ borderColor: 'var(--ept-border)' }}>
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved. | <Link href="/legal" className="underline">Terms</Link> | <Link href="/legal" className="underline">Privacy</Link>
          </p>
        </footer>
      </div>
      <ProductTutorialButton tutorialId="bree-assistant" productName="Bree AI Assistant" />
    </div>
  );
}
