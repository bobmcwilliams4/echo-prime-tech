'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { closerFetch, getDashboardStats } from '../../lib/closer-api';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import TrialCTA from '@/components/TrialCTA';

/* ══════════════════════════════════════════════════════════════════════
   CONVAI WIDGET — ElevenLabs Voice AI Demo
   ══════════════════════════════════════════════════════════════════════ */

function ConvAIWidget({ agentId, userName }: { agentId: string; userName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const load = () => {
      if (!customElements.get('elevenlabs-convai')) {
        const s = document.createElement('script');
        s.src = 'https://elevenlabs.io/convai-widget/index.js';
        s.async = true;
        document.head.appendChild(s);
      }
      if (containerRef.current) {
        const safeAgentId = agentId.replace(/[^a-zA-Z0-9_\-]/g, '');
        const safeName = (userName || 'visitor').replace(/[<>"'&]/g, '');
        const dynVars = JSON.stringify({ user_name: safeName });
        const el = document.createElement('elevenlabs-convai');
        el.setAttribute('agent-id', safeAgentId);
        el.setAttribute('dynamic-variables', dynVars);
        containerRef.current.replaceChildren(el);
      }
    };
    const t = setTimeout(load, 100);
    return () => { clearTimeout(t); if (containerRef.current) containerRef.current.replaceChildren(); };
  }, [agentId, userName]);
  return <div ref={containerRef} />;
}

/* ══════════════════════════════════════════════════════════════════════
   LANDING PAGE — Public, no auth required
   ══════════════════════════════════════════════════════════════════════ */

const LANDING_STATS = [
  { label: 'Response Time', value: '<2s', color: '#14b8a6' },
  { label: 'Availability', value: '24/7/365', color: '#22c55e' },
  { label: 'Cost Reduction', value: '90%', color: '#f59e0b' },
  { label: 'Simultaneous Calls', value: 'Unlimited', color: '#a855f7' },
];

const LANDING_FEATURES = [
  { title: 'Natural Voice AI', desc: 'ElevenLabs v3 with emotional expression — laughs, sighs, pauses. Callers can\'t tell it\'s AI.', icon: '\uD83C\uDFA4' },
  { title: 'Smart Qualification', desc: 'Multi-phase discovery framework identifies decision makers, pain points, budget, and timeline.', icon: '\uD83C\uDFAF' },
  { title: 'Objection Handling', desc: 'Trained on 7+ objection categories with natural, non-scripted responses that build rapport.', icon: '\uD83D\uDEE1\uFE0F' },
  { title: 'Appointment Booking', desc: 'Qualified leads get booked directly with your team. Unqualified get a warm handoff.', icon: '\uD83D\uDCC5' },
  { title: 'CRM Integration', desc: 'Every call logged with qualification score, pain points, and next steps. Plug into any CRM.', icon: '\uD83D\uDD17' },
  { title: 'Full Analytics', desc: 'Real-time dashboards showing call performance, conversion rates, cost breakdown, and ROI.', icon: '\uD83D\uDCCA' },
  { title: 'Campaign Orchestration', desc: 'Create and manage calling campaigns with custom scripts, pacing, and scheduling.', icon: '\uD83D\uDE80' },
  { title: 'Industry Trained', desc: 'Custom-built for your vertical — oilfield, insurance, solar, real estate, SaaS, and more.', icon: '\uD83C\uDFED' },
];

const COMPARE = [
  { feature: 'Setup Cost', us: '$0', them: '$5,000+' },
  { feature: 'Monthly Cost', us: 'From $299', them: '$1,000-$2,000' },
  { feature: 'Response Speed', us: 'Instant', them: 'Minutes' },
  { feature: 'Available Hours', us: '24/7/365', them: 'Business hours' },
  { feature: 'Simultaneous Calls', us: 'Unlimited', them: '1 per agent' },
  { feature: 'Voice Quality', us: 'Human-like AI', them: 'Text-only AI' },
  { feature: 'Objection Handling', us: 'Dynamic AI', them: 'Script-based' },
  { feature: 'Setup Time', us: '24 hours', them: '1-2 weeks' },
  { feature: 'Hidden Fees', us: 'None — all-inclusive', them: 'Per-minute charges' },
  { feature: 'Your Own Website', us: 'Included', them: 'Not included' },
  { feature: 'Contract Required', us: 'No — cancel anytime', them: '6-12 months' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$299',
    period: '/mo',
    desc: 'Perfect for solo agents and small teams getting started with AI calling.',
    popular: false,
    features: [
      'AI voice agent — your industry, your script',
      'Up to 500 calls per month',
      'Your own branded website',
      'Lead qualification dashboard',
      'Call recordings & transcripts',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$499',
    period: '/mo',
    desc: 'For growing businesses that need volume and customization.',
    popular: true,
    features: [
      'Everything in Starter',
      'Up to 2,000 calls per month',
      'Custom voice clone (your voice or chosen voice)',
      'CRM integration (any platform)',
      'Appointment booking to your calendar',
      'Detailed analytics & ROI tracking',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: '$999',
    period: '/mo',
    desc: 'For teams and agencies that need maximum power and flexibility.',
    popular: false,
    features: [
      'Everything in Growth',
      'Unlimited calls',
      'Multiple AI agents / campaigns',
      'Custom domain (yourbusiness.com)',
      'API access for custom integrations',
      'White-label option',
      'Dedicated account manager',
    ],
  },
];

function CloserLandingPage() {
  const { isDark } = useTheme();
  const [demoActive, setDemoActive] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{name:'Home',href:'/'},{name:'Products',href:'/services'},{name:'AI Closer',href:'/closer'}]} />
      <ProductTutorialButton tutorialId="settings" productName="Closer AI" />
      {/* Nav */}
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
          <span className="text-sm font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--ept-text-muted)' }}>
            AI Sales Agent
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg"
            style={{ color: 'var(--ept-text-secondary)' }}
          >
            Sign In
          </Link>
          <Link
            href="/checkout?service=ai-closer&tier=professional"
            className="text-sm font-semibold px-5 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="py-16 md:py-24 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 animate-fade-up"
            style={{ borderColor: 'var(--ept-accent)', backgroundColor: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(13,115,119,0.06)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>
              Live Demo Available
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-up"
            style={{ color: 'var(--ept-text)' }}
          >
            Your AI Sales Agent That{' '}
            <span className="gradient-text">Closes Deals</span>{' '}
            24/7
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1"
            style={{ color: 'var(--ept-text-secondary)' }}
          >
            Qualify leads, handle objections, and book appointments automatically — with a voice so natural
            callers won't know it's AI. Deploy in 24 hours. No contracts. No per-minute fees.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up-delay-2">
            <button
              onClick={() => setDemoActive(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: 'var(--ept-accent)', boxShadow: `0 8px 32px ${isDark ? 'rgba(20,184,166,0.25)' : 'rgba(13,115,119,0.2)'}` }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Try Live Demo
            </button>
            <Link
              href="/checkout?service=closer&tier=starter"
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

        {/* Stats Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {LANDING_STATS.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl border text-center"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="text-2xl font-extrabold font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Live Demo Section */}
        <section className="mb-16">
          <div
            className="p-8 md:p-12 rounded-2xl border"
            style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: isDark ? 'rgba(20,184,166,0.3)' : 'rgba(13,115,119,0.2)',
              boxShadow: isDark ? '0 0 40px rgba(20,184,166,0.05)' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)' }}
              >
                <svg className="w-5 h-5" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#22c55e' }}>Try It Now — Live Demo</h2>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Talk to our AI SDR. This is the actual product.</p>
              </div>
            </div>

            {!demoActive ? (
              <div className="text-center py-8">
                <p className="mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
                  Click below to activate the AI Sales Agent. A microphone bubble will appear in the bottom-right corner.
                  Click it and have a real conversation — the AI will qualify you as a lead and try to book you an appointment.
                </p>
                <button
                  onClick={() => setDemoActive(true)}
                  className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                    boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                  }}
                >
                  Start Live Demo
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold" style={{ color: '#22c55e' }}>AI SDR ACTIVE</span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                  Click the microphone bubble in the bottom-right corner to start talking.
                </p>
                <button
                  onClick={() => setDemoActive(false)}
                  className="px-4 py-2 rounded-lg border text-sm transition-opacity hover:opacity-70"
                  style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444' }}
                >
                  End Demo
                </button>
              </div>
            )}
          </div>
          {demoActive && <ConvAIWidget agentId="agent_7901khgqmsy8ey1rw38py5qxzxpa" userName="visitor" />}
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              Everything Your Sales Team Needs
            </h2>
            <p className="text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
              A complete AI-powered sales platform, not just a dialer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LANDING_FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl border card-hover"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="mb-16">
          <div
            className="p-8 md:p-12 rounded-2xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
                Powerful <span className="gradient-text">Dashboard</span>
              </h2>
              <p style={{ color: 'var(--ept-text-secondary)' }}>
                Full visibility into every lead, call, campaign, and dollar spent.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Lead Management', desc: 'Import, track, and manage your entire pipeline. Priority scoring, status tracking, full call history per lead.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                { title: 'Call Analytics', desc: 'Every call recorded, transcribed, and scored. See disposition, sentiment, cost breakdown, and coaching notes.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { title: 'Campaign Control', desc: 'Create automated calling campaigns with custom scripts, pacing controls, scheduling, and real-time monitoring.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(13,115,119,0.08)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{card.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-16">
          <div
            className="p-6 md:p-8 rounded-2xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <h2 className="text-2xl font-extrabold mb-6 text-center" style={{ color: 'var(--ept-text)' }}>
              Echo Prime vs Traditional AI Setters
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid var(--ept-border)` }}>
                    <th className="text-left py-3 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                    <th className="text-center py-3 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Echo Prime</th>
                    <th className="text-center py-3 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Competitors</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.feature} style={{ borderBottom: `1px solid ${isDark ? 'rgba(30,41,59,0.5)' : 'rgba(226,232,240,0.5)'}` }}>
                      <td className="py-3" style={{ color: 'var(--ept-text-secondary)' }}>{row.feature}</td>
                      <td className="py-3 text-center font-bold" style={{ color: '#22c55e' }}>{row.us}</td>
                      <td className="py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--ept-text-secondary)' }}>Four steps to your own AI sales agent.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Tell Us Your Business', desc: 'Industry, services, ideal customer, objections you hear. We handle the rest.' },
              { step: '2', title: 'We Build Your AI Agent', desc: 'Custom voice, custom scripts, your branding. Deployed within 24 hours.' },
              { step: '3', title: 'AI Calls Your Leads', desc: 'Your agent qualifies prospects, handles objections, and books appointments.' },
              { step: '4', title: 'You Close Deals', desc: 'Show up to pre-qualified appointments. AI did the hard part.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border"
                  style={{ borderColor: 'var(--ept-accent)', backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(13,115,119,0.06)' }}
                >
                  <span className="font-extrabold" style={{ color: 'var(--ept-accent)' }}>{item.step}</span>
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16" id="pricing">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              Simple, <span className="gradient-text">All-Inclusive</span> Pricing
            </h2>
            <p style={{ color: 'var(--ept-text-secondary)' }}>
              $0 setup. No hidden fees. No per-minute charges. Cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className="p-6 rounded-2xl border relative transition-all"
                style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: plan.popular ? (isDark ? '0 0 40px rgba(20,184,166,0.12)' : '0 0 40px rgba(13,115,119,0.08)') : 'none',
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: 'var(--ept-accent)' }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{plan.period}</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?service=closer&tier=${plan.name.toLowerCase()}`}
                  className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    backgroundColor: plan.popular ? 'var(--ept-accent)' : 'transparent',
                    color: plan.popular ? '#fff' : 'var(--ept-text-secondary)',
                    border: plan.popular ? 'none' : '1px solid var(--ept-border)',
                  }}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: 'var(--ept-text-muted)' }}>
            All plans include hosting, AI runtime, call minutes, and voice synthesis. No surprise charges.
          </p>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Built For Your Industry</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Oil & Gas', 'Insurance', 'Solar', 'Real Estate', 'Roofing', 'HVAC', 'Legal', 'Medical', 'SaaS', 'Coaching', 'Financial Services', 'Home Services'].map((ind) => (
              <span
                key={ind}
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-surface)' }}
              >
                {ind}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16" id="faq">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p style={{ color: 'var(--ept-text-secondary)' }}>
              Everything you need to know about Echo Closer AI.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border overflow-hidden"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-sm select-none"
                  style={{ color: 'var(--ept-text)' }}
                >
                  {faq.q}
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    style={{ color: 'var(--ept-text-muted)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>
            Ready to <span className="gradient-text">Close More Deals?</span>
          </h2>
          <p className="text-center text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Get your own AI Sales Agent deployed in 24 hours. $0 setup, no contracts, everything included.
          </p>
          <TrialCTA serviceId="echo-closer" tier="starter" productName="Echo Closer AI" />
        </section>

        {/* Related Services */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Supercharge Your Sales Stack</h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Pair Closer AI with these services for maximum pipeline velocity</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Data Pipelines', desc: 'Feed fresh leads directly into Closer. Autonomous extraction from 50+ data sources, running 24/7.', href: '/pipelines', price: 'From $199/mo' },
              { title: 'Intelligence Engines', desc: '5,486+ AI engines with deep domain knowledge. Arm your AI closer with industry-specific expertise.', href: '/engines', price: 'From $199/mo' },
              { title: 'Sentinel AI', desc: 'Monitor call quality, track lead conversion, and get real-time alerts on sales performance.', href: '/sentinel', price: 'Free tier available' },
            ].map((svc, i) => (
              <a key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
                <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center border-t" style={{ borderColor: 'var(--ept-border)' }}>
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   DASHBOARD — Authenticated users only
   ══════════════════════════════════════════════════════════════════════ */

interface DashboardStats {
  leads_today: number;
  calls_made: number;
  appointments_set: number;
  cost_today: number;
}

interface Lead {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  status: string;
  source: string;
  created_at: string;
}

interface Call {
  id: string;
  lead_name: string;
  duration_seconds: number;
  disposition: string;
  cost: number;
  created_at: string;
}

const LEAD_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new:              { bg: 'rgba(20,184,166,0.12)', text: '#14b8a6' },
  contacted:        { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  qualified:        { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  appointment_set:  { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e' },
  converted:        { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  lost:             { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
  dnc:              { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444' },
};

const DISPOSITION_COLORS: Record<string, { bg: string; text: string }> = {
  appointment_booked: { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e' },
  interested:         { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  callback:           { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  not_interested:     { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
  voicemail:          { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
};

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCost(amount: number): string {
  return `$${(amount || 0).toFixed(2)}`;
}

function formatLabel(raw: string): string {
  return raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function StatusBadge({ value, colorMap }: { value: string; colorMap: Record<string, { bg: string; text: string }> }) {
  const colors = colorMap[value] || { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' };
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {formatLabel(value)}
    </span>
  );
}

function CloserDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [callsLoading, setCallsLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data: any) => setStats({
        leads_today: data.leads_today ?? 0,
        calls_made: data.calls_made ?? 0,
        appointments_set: data.appointments_set ?? 0,
        cost_today: data.cost_today ?? 0,
      }))
      .catch(() => setStats({ leads_today: 0, calls_made: 0, appointments_set: 0, cost_today: 0 }))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    closerFetch('/leads?limit=5&sort=created_at:desc')
      .then((data: any) => setLeads(Array.isArray(data) ? data : data?.leads ?? data?.data ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLeadsLoading(false));
  }, []);

  useEffect(() => {
    closerFetch('/calls?limit=5&sort=created_at:desc')
      .then((data: any) => setCalls(Array.isArray(data) ? data : data?.calls ?? data?.data ?? []))
      .catch(() => setCalls([]))
      .finally(() => setCallsLoading(false));
  }, []);

  const kpis = [
    { label: 'Leads Today',       value: statsLoading ? '...' : String(stats?.leads_today ?? 0) },
    { label: 'Calls Made',        value: statsLoading ? '...' : String(stats?.calls_made ?? 0) },
    { label: 'Appointments Set',  value: statsLoading ? '...' : String(stats?.appointments_set ?? 0) },
    { label: 'Cost Today',        value: statsLoading ? '...' : formatCost(stats?.cost_today ?? 0) },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
          AI Sales Agent <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          Real-time overview of your leads, calls, and campaign performance.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <div className="text-2xl font-extrabold font-mono gradient-text">{kpi.value}</div>
            <div className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>Recent Leads</h2>
            <Link href="/closer/leads" className="text-[11px] font-semibold" style={{ color: 'var(--ept-accent)' }}>View All</Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
            {leadsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
              </div>
            ) : leads.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No leads yet — import or add your first lead.</p>
                <Link href="/closer/leads" className="inline-block mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Add Lead</Link>
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between px-6 py-3" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{`${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{lead.phone || '\u2014'}</span>
                      {lead.source && <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>via {lead.source}</span>}
                    </div>
                  </div>
                  <StatusBadge value={lead.status || 'new'} colorMap={LEAD_STATUS_COLORS} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>Recent Calls</h2>
            <Link href="/closer/calls" className="text-[11px] font-semibold" style={{ color: 'var(--ept-accent)' }}>View All</Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
            {callsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
              </div>
            ) : calls.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No calls yet — start a campaign to begin dialing.</p>
                <Link href="/closer/campaigns" className="inline-block mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Start Campaign</Link>
              </div>
            ) : (
              calls.map((call) => (
                <div key={call.id} className="flex items-center justify-between px-6 py-3" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{call.lead_name || 'Unknown'}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{formatDuration(call.duration_seconds)}</span>
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{formatCost(call.cost)}</span>
                    </div>
                  </div>
                  <StatusBadge value={call.disposition || 'voicemail'} colorMap={DISPOSITION_COLORS} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-text)' }}>Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Add Lead', desc: 'Import a list or manually add a new prospect to your pipeline.', href: '/closer/leads', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
            { title: 'Start Campaign', desc: 'Create a calling campaign to automate outreach at scale.', href: '/closer/campaigns', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
            { title: 'View Analytics', desc: 'Dive into call performance, conversion rates, and cost breakdown.', href: '/closer/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          ].map((action, i) => (
            <Link key={i} href={action.href} className="card-hover p-6 rounded-xl border block group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--ept-accent-glow)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              </div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{action.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{action.desc}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>
                Go
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px 24px' }}>
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--ept-text)' }}>Business Intelligence Doctrine</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>Query business, digital commerce, and finance doctrine for sales strategies and market intelligence.</p>
          <EngineQueryPanel
            domains={['BIZ']}
            title="Sales Doctrine Search"
            placeholder="Ask about sales methodology, lead qualification, objection handling..."
            exampleQueries={[
              'BANT vs MEDDIC qualification frameworks',
              'SaaS pricing strategy best practices',
              'Cold outreach and prospecting cadence',
              'SPIN selling discovery methodology',
            ]}
            showStats
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN EXPORT — Route to landing or dashboard based on auth
   ══════════════════════════════════════════════════════════════════════ */

function CloserPageContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!user) {
    return <CloserLandingPage />;
  }

  return <CloserDashboard />;
}

const FAQS = [
  { q: 'How does the AI voice work?', a: 'Echo Closer uses a real-time STT → LLM → TTS pipeline. The AI listens via speech-to-text, processes the response through a language model with your sales script and product knowledge, and speaks back with natural text-to-speech. Full conversations in under 2 seconds latency.' },
  { q: 'Can I customize the sales scripts?', a: 'Yes. Build multi-step sales scripts with a state-machine editor. Define stages (intro, qualification, pitch, objection handling, close), transition rules, and AI behavior per stage. The AI follows your script while adapting naturally to the conversation.' },
  { q: 'What CRM features are included?', a: 'Full lead pipeline with stages, notes, call recordings, sentiment analysis, and automatic follow-up scheduling. Import leads via CSV, API, or webhook. Lead scoring based on conversation engagement and buying signals.' },
  { q: 'Can the AI handle objections?', a: 'Yes. Train the AI with your objection-handling playbook. It recognizes common objections (price, timing, competitor, authority) and responds with your proven rebuttals. Escalates to a human agent when confidence is low.' },
  { q: 'Is it white-label ready?', a: 'Yes. Full multi-tenant SaaS architecture. Custom branding, custom domain, API access, and per-tenant configuration. Resell under your own brand with custom pricing.' },
  { q: 'What does it cost?', a: 'Starter at $99/mo (100 calls), Growth at $299/mo (500 calls, CRM, analytics), and Enterprise at $799/mo (unlimited calls, white-label, API, dedicated support). Per-minute pricing available for high-volume users.' },
];

export default function CloserPage() {
  return <SubscriptionGate serviceId="ai-closer"><CloserPageContent /></SubscriptionGate>;
}
