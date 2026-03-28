'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../lib/theme-context';

/* ══════════════════════════════════════════════════════════════════════
   CONVAI WIDGET — ElevenLabs Voice AI Demo (same agent as echo-op.com/ai-sdr)
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
   STATIC DEMO DATA — Realistic insurance CRM for Midland TX agency
   ══════════════════════════════════════════════════════════════════════ */

const DEMO_LEADS = [
  { id: 'demo-1', name: 'Jennifer Martinez', phone: '(432) 555-8901', status: 'appointment_set', source: 'Facebook Ad', created_at: '2026-03-04T09:15:00Z' },
  { id: 'demo-2', name: 'Robert Chen', phone: '(432) 555-7234', status: 'qualified', source: 'Website', created_at: '2026-03-04T08:42:00Z' },
  { id: 'demo-3', name: 'Maria Gonzalez', phone: '(432) 555-3456', status: 'contacted', source: 'Referral', created_at: '2026-03-04T07:20:00Z' },
  { id: 'demo-4', name: 'David Thompson', phone: '(432) 555-6789', status: 'new', source: 'Google Ad', created_at: '2026-03-03T16:30:00Z' },
  { id: 'demo-5', name: 'Lisa Williams', phone: '(432) 555-2345', status: 'converted', source: 'Cold List', created_at: '2026-03-03T14:10:00Z' },
];

const DEMO_CALLS = [
  { id: 'call-1', lead_name: 'Jennifer Martinez', duration_seconds: 247, disposition: 'appointment_booked', cost: 0.82, created_at: '2026-03-04T09:18:00Z' },
  { id: 'call-2', lead_name: 'Robert Chen', duration_seconds: 185, disposition: 'interested', cost: 0.61, created_at: '2026-03-04T08:45:00Z' },
  { id: 'call-3', lead_name: 'Unknown Caller', duration_seconds: 32, disposition: 'voicemail', cost: 0.11, created_at: '2026-03-04T07:55:00Z' },
  { id: 'call-4', lead_name: 'David Thompson', duration_seconds: 94, disposition: 'callback', cost: 0.31, created_at: '2026-03-03T16:35:00Z' },
  { id: 'call-5', lead_name: 'Lisa Williams', duration_seconds: 312, disposition: 'appointment_booked', cost: 1.04, created_at: '2026-03-03T14:15:00Z' },
];

const DEMO_CAMPAIGNS = [
  { id: 'camp-1', name: 'Q1 Auto Insurance Blitz', status: 'active', leads_count: 847, calls_made: 312, appointments: 28, conversion: 8.9 },
  { id: 'camp-2', name: 'Home Insurance Renewals', status: 'active', leads_count: 1243, calls_made: 589, appointments: 47, conversion: 7.9 },
  { id: 'camp-3', name: 'Life Insurance Warm Leads', status: 'paused', leads_count: 456, calls_made: 201, appointments: 31, conversion: 15.4 },
];

const DEMO_STATS = {
  leads_today: 47,
  calls_made: 182,
  appointments_set: 14,
  cost_today: 58.34,
  avg_call_duration: 142,
  conversion_rate: 7.6,
  total_leads: 2536,
  active_campaigns: 2,
};

/* ══════════════════════════════════════════════════════════════════════
   AI SDR PRODUCT DATA — Replicated from echo-op.com/ai-sdr
   ══════════════════════════════════════════════════════════════════════ */

const SDR_STATS = [
  { label: 'Response Time', value: '<2s', color: '#14b8a6' },
  { label: 'Availability', value: '24/7/365', color: '#22c55e' },
  { label: 'Cost vs Human SDR', value: '90% Less', color: '#f59e0b' },
  { label: 'Calls Simultaneously', value: 'Unlimited', color: '#a855f7' },
];

const SDR_FEATURES = [
  { title: 'Natural Voice AI', desc: 'ElevenLabs v3 with emotional expression — laughs, sighs, pauses. Callers can\'t tell it\'s AI.', icon: '🎙️' },
  { title: 'Smart Qualification', desc: 'Multi-phase discovery framework identifies decision makers, pain points, budget, and timeline.', icon: '🎯' },
  { title: 'Objection Handling', desc: 'Trained on 7+ objection categories with natural, non-scripted responses that build rapport.', icon: '🛡️' },
  { title: 'Appointment Booking', desc: 'Qualified leads get booked directly with your team. Unqualified get a warm handoff.', icon: '📅' },
  { title: 'CRM Integration', desc: 'Every call logged with qualification score, pain points, and next steps. Plug into any CRM.', icon: '🔗' },
  { title: 'Industry Trained', desc: 'Custom-built for your vertical — oilfield, insurance, solar, real estate, SaaS, and more.', icon: '🏭' },
];

const SDR_COMPARE = [
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

const INDUSTRIES = ['Oil & Gas', 'Insurance', 'Solar', 'Real Estate', 'Roofing', 'HVAC', 'Legal', 'Medical', 'SaaS', 'Coaching', 'Financial Services', 'Home Services'];

/* ══════════════════════════════════════════════════════════════════════
   TUTORIAL STEPS — Interactive walkthrough
   ══════════════════════════════════════════════════════════════════════ */

const TUTORIAL_STEPS = [
  {
    title: 'Your Dashboard at a Glance',
    section: 'dashboard',
    content: 'The dashboard gives you a real-time snapshot of your sales pipeline. See leads generated today, calls made, appointments booked, and daily costs — all updated live as your AI agent works.',
    tip: 'The KPI cards at the top update in real-time. Green numbers mean you\'re above your daily targets.',
  },
  {
    title: 'Managing Your Leads',
    section: 'leads',
    content: 'Every prospect flows through your lead pipeline. Import lists via CSV, add leads manually, or let your AI agent capture them from inbound calls. Each lead is tracked from first contact to conversion.',
    tip: 'Click any lead to see their full history — every call, every note, every objection handled.',
  },
  {
    title: 'AI-Powered Calling',
    section: 'calls',
    content: 'Your AI agent makes and receives calls 24/7. It qualifies leads using your custom script, handles objections naturally, and books appointments directly on your calendar. Every call is recorded and transcribed.',
    tip: 'The disposition column shows the outcome. "Appointment Booked" means the AI successfully closed for a meeting.',
  },
  {
    title: 'Campaign Management',
    section: 'campaigns',
    content: 'Organize your outreach into campaigns. Set daily call limits, choose calling hours, assign lead lists, and track conversion rates. Run multiple campaigns simultaneously — the AI handles them all.',
    tip: 'Pause campaigns anytime. The AI remembers where it left off and resumes seamlessly.',
  },
  {
    title: 'Live AI Demo',
    section: 'live-demo',
    content: 'Try the actual AI Sales Agent right now. Click "Start Live Demo" below and a microphone bubble will appear. Have a real conversation — the AI will qualify you as a lead, handle your objections, and try to book you an appointment.',
    tip: 'This is the exact same AI your prospects will talk to. Test it with tough objections — it handles them all.',
  },
  {
    title: 'Analytics & ROI',
    section: 'analytics',
    content: 'Track every dollar. See cost per call, cost per appointment, conversion rates by campaign, and AI performance metrics. Compare against human SDR costs to see your ROI.',
    tip: 'Most customers see 90% cost reduction vs human SDRs within the first month.',
  },
];

/* ══════════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ══════════════════════════════════════════════════════════════════════ */

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
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

/* ══════════════════════════════════════════════════════════════════════
   MAIN DEMO PAGE
   ══════════════════════════════════════════════════════════════════════ */

export default function CloserDemoPage() {
  const { isDark } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [demoActive, setDemoActive] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (section: string) => {
    sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    scrollToSection(TUTORIAL_STEPS[index].section);
  };

  const nextStep = () => {
    if (activeStep < TUTORIAL_STEPS.length - 1) {
      const next = activeStep + 1;
      setActiveStep(next);
      scrollToSection(TUTORIAL_STEPS[next].section);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      const prev = activeStep - 1;
      setActiveStep(prev);
      scrollToSection(TUTORIAL_STEPS[prev].section);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>AI Sales Agent Demo - Echo Prime Technologies</h1>
          <p>Interactive demo of the AI Closer platform featuring autonomous voice sales agents with ElevenLabs voice AI, CRM integration, and real-time call analytics. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      {/* Hero / Demo Mode Banner */}
      <div className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
                    AI Sales Agent <span className="gradient-text">Demo</span>
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                    Interactive demo — explore every feature of the AI Closer platform
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  DEMO MODE
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(20,184,166,0.12)', color: '#14b8a6' }}>
                  No login required
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
              >
                {showTutorial ? 'Hide' : 'Show'} Tutorial
              </button>
              <Link
                href="/closer"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--ept-accent)' }}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tutorial Navigation */}
        {showTutorial && (
          <div className="mb-8 p-5 rounded-2xl border animate-fade-up" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
                Guided Tour — Step {activeStep + 1} of {TUTORIAL_STEPS.length}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-30"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={nextStep}
                  disabled={activeStep === TUTORIAL_STEPS.length - 1}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-30"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Step pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {TUTORIAL_STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => handleStepClick(i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: i === activeStep ? 'var(--ept-accent)' : 'var(--ept-surface)',
                    color: i === activeStep ? '#fff' : 'var(--ept-text-secondary)',
                  }}
                >
                  {i + 1}. {step.title}
                </button>
              ))}
            </div>

            {/* Active step content */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                {TUTORIAL_STEPS[activeStep].title}
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-secondary)' }}>
                {TUTORIAL_STEPS[activeStep].content}
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="#14b8a6" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-xs" style={{ color: '#14b8a6' }}>
                  <strong>Pro tip:</strong> {TUTORIAL_STEPS[activeStep].tip}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION: Dashboard KPIs ── */}
        <div ref={el => { sectionRefs.current['dashboard'] = el; }} className="scroll-mt-24 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Leads Today', value: String(DEMO_STATS.leads_today) },
              { label: 'Calls Made', value: String(DEMO_STATS.calls_made) },
              { label: 'Appointments Set', value: String(DEMO_STATS.appointments_set) },
              { label: 'Cost Today', value: formatCost(DEMO_STATS.cost_today) },
            ].map((kpi, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border animate-fade-up"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl font-extrabold font-mono gradient-text">{kpi.value}</div>
                <div className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          {/* Secondary stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: 'Avg Call Duration', value: formatDuration(DEMO_STATS.avg_call_duration) },
              { label: 'Conversion Rate', value: `${DEMO_STATS.conversion_rate}%` },
              { label: 'Total Leads', value: DEMO_STATS.total_leads.toLocaleString() },
              { label: 'Active Campaigns', value: String(DEMO_STATS.active_campaigns) },
            ].map((kpi, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="text-lg font-bold font-mono" style={{ color: 'var(--ept-text)' }}>{kpi.value}</div>
                <div className="text-[10px] uppercase tracking-wider mt-0.5 font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION: Leads & Calls ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div ref={el => { sectionRefs.current['leads'] = el; }} className="scroll-mt-24 rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>Recent Leads</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(20,184,166,0.12)', color: '#14b8a6' }}>DEMO DATA</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
              {DEMO_LEADS.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between px-6 py-3" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{lead.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{lead.phone}</span>
                      <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>via {lead.source}</span>
                    </div>
                  </div>
                  <StatusBadge value={lead.status} colorMap={LEAD_STATUS_COLORS} />
                </div>
              ))}
            </div>
          </div>

          <div ref={el => { sectionRefs.current['calls'] = el; }} className="scroll-mt-24 rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>Recent Calls</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(20,184,166,0.12)', color: '#14b8a6' }}>DEMO DATA</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
              {DEMO_CALLS.map((call) => (
                <div key={call.id} className="flex items-center justify-between px-6 py-3" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{call.lead_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{formatDuration(call.duration_seconds)}</span>
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{formatCost(call.cost)}</span>
                    </div>
                  </div>
                  <StatusBadge value={call.disposition} colorMap={DISPOSITION_COLORS} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION: Campaigns ── */}
        <div ref={el => { sectionRefs.current['campaigns'] = el; }} className="scroll-mt-24 mb-8">
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>Campaigns</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(20,184,166,0.12)', color: '#14b8a6' }}>DEMO DATA</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Campaign</th>
                    <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Status</th>
                    <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Leads</th>
                    <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Calls</th>
                    <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Appts</th>
                    <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Conv %</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_CAMPAIGNS.map((camp) => (
                    <tr key={camp.id} className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                      <td className="px-6 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>{camp.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: camp.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                            color: camp.status === 'active' ? '#22c55e' : '#f59e0b',
                          }}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono" style={{ color: 'var(--ept-text-secondary)' }}>{camp.leads_count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center font-mono" style={{ color: 'var(--ept-text-secondary)' }}>{camp.calls_made}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold" style={{ color: '#22c55e' }}>{camp.appointments}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold" style={{ color: 'var(--ept-accent)' }}>{camp.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── SECTION: Live AI Demo ── */}
        <div ref={el => { sectionRefs.current['live-demo'] = el; }} className="scroll-mt-24 mb-8">
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: demoActive ? 'rgba(34,197,94,0.5)' : 'var(--ept-card-border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
                <svg className="w-5 h-5" fill="none" stroke="#22c55e" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-extrabold" style={{ color: '#22c55e' }}>Try It Now — Live AI Demo</h2>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Talk to the actual AI Sales Agent. This is the real product.</p>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {SDR_STATS.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl text-center border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                  <div className="text-lg font-extrabold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {!demoActive ? (
              <div className="text-center py-6">
                <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
                  Enter your name below, then click Start. A microphone bubble will appear in the bottom-right corner.
                  Click it and have a real conversation — the AI will qualify you as a lead and try to book you an appointment.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <input
                    type="text"
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full sm:w-48 px-4 py-3 rounded-xl border text-sm font-medium outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--ept-surface)',
                      borderColor: 'var(--ept-border)',
                      color: 'var(--ept-text)',
                      // @ts-ignore
                      '--tw-ring-color': 'var(--ept-accent)',
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && demoName.trim()) setDemoActive(true); }}
                  />
                  <button
                    onClick={() => setDemoActive(true)}
                    disabled={!demoName.trim()}
                    className="px-8 py-3 rounded-xl font-bold text-white text-lg shadow-lg transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#22c55e', boxShadow: '0 8px 25px rgba(34,197,94,0.3)' }}
                  >
                    🎙️ Start Live Demo
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold" style={{ color: '#22c55e' }}>AI SDR ACTIVE</span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                  Click the microphone bubble in the bottom-right corner to start talking.
                  The AI will introduce itself and begin qualifying you.
                </p>
                <button
                  onClick={() => setDemoActive(false)}
                  className="px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: 'rgba(239,68,68,0.5)', color: '#ef4444' }}
                >
                  End Demo
                </button>
              </div>
            )}
          </div>
        </div>

        {demoActive && <ConvAIWidget agentId="agent_7901khgqmsy8ey1rw38py5qxzxpa" userName={demoName.trim() || 'visitor'} />}

        {/* ── SECTION: Features Grid ── */}
        <div className="mb-8">
          <h2 className="text-lg font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            What Your AI Agent <span className="gradient-text">Does</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SDR_FEATURES.map((f) => (
              <div key={f.title} className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION: Comparison Table ── */}
        <div ref={el => { sectionRefs.current['analytics'] = el; }} className="scroll-mt-24 mb-8">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="text-lg font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
              Echo Prime vs <span style={{ color: 'var(--ept-text-muted)' }}>Traditional AI Setters</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <th className="text-left py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                    <th className="text-center py-3 text-[10px] uppercase tracking-wider font-bold" style={{ color: '#22c55e' }}>ECHO PRIME</th>
                    <th className="text-center py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ept-text-muted)' }}>COMPETITORS</th>
                  </tr>
                </thead>
                <tbody>
                  {SDR_COMPARE.map((row) => (
                    <tr key={row.feature} className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                      <td className="py-3" style={{ color: 'var(--ept-text-secondary)' }}>{row.feature}</td>
                      <td className="py-3 text-center font-bold" style={{ color: '#22c55e' }}>{row.us}</td>
                      <td className="py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── SECTION: How It Works ── */}
        <div className="mb-8">
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="text-lg font-extrabold mb-6 text-center" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'You Tell Us Your Business', desc: 'Industry, services, ideal customer, objections you hear. We handle the rest.' },
                { step: '2', title: 'We Build Your AI Agent', desc: 'Custom voice, custom scripts, your branding. Deployed to your own website within 24 hours.' },
                { step: '3', title: 'AI Calls Your Leads', desc: 'Your agent calls prospects, qualifies them, handles objections, and books appointments on your calendar.' },
                { step: '4', title: 'You Close Deals', desc: 'You show up to pre-qualified appointments. The AI did the hard part. You do what you do best.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 border"
                    style={{ backgroundColor: 'rgba(20,184,166,0.1)', borderColor: 'rgba(20,184,166,0.3)' }}
                  >
                    <span className="font-bold text-sm" style={{ color: 'var(--ept-accent)' }}>{item.step}</span>
                  </div>
                  <h3 className="font-bold text-xs mb-1" style={{ color: 'var(--ept-text)' }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION: Industries ── */}
        <div className="mb-8">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="text-lg font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Built For Your Industry</h2>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <span
                  key={ind}
                  className="px-3 py-1.5 rounded-lg text-sm border"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="p-8 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>
            Ready for Your Own <span className="gradient-text">AI Sales Agent</span>?
          </h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Get your own AI-powered closer deployed in 24 hours. Plans start at $299/mo — no contracts, cancel anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => { scrollToSection('live-demo'); if (demoName.trim()) setDemoActive(true); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--ept-accent)' }}
            >
              Try Live Demo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            <Link
              href="/closer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-colors"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              View Plans & Pricing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
