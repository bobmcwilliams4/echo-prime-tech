'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import FaqSchema from '@/components/FaqSchema';
import TrialCTA from '@/components/TrialCTA';
import { EngineQueryPanel } from '@/components/EngineQueryPanel';

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

const HERO_STATS = [
  { label: 'Active Projects', value: '500+', color: '#14b8a6' },
  { label: 'Tracts Managed', value: '125K+', color: '#22c55e' },
  { label: 'AI Calls/Month', value: '50K+', color: '#f59e0b' },
  { label: 'Docs Generated', value: '250K+', color: '#a855f7' },
];

const FEATURES = [
  {
    title: 'ROW Project Management',
    desc: 'Full lifecycle management for transmission line corridors, pipeline ROW, and utility easement projects. Track every parcel from identification through acquisition to construction release.',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    color: '#14b8a6',
  },
  {
    title: 'Easement Tracking',
    desc: 'Track permanent easements, temporary construction easements, access roads, wire zones, and guy wire anchors. Status workflows from pending through executed to recorded.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    color: '#22c55e',
  },
  {
    title: 'Chain of Title + AI Gap Detection',
    desc: 'Run surface chain of title from patent to present. AI analyzes the chain for gaps, breaks, missing conveyances, undischarged liens, and unresolved probates that could block acquisition.',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    color: '#3b82f6',
  },
  {
    title: 'AI Outbound Calling (ConvAI)',
    desc: 'Deploy ElevenLabs Conversational AI agents that call landowners, introduce the project, answer questions, handle objections, and schedule appointments with field landmen.',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    color: '#f59e0b',
  },
  {
    title: 'Appointment Scheduling',
    desc: 'AI agents book meetings with landowners directly on field landman calendars. Auto-assign by region, availability, and language. Confirmation via SMS and email.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: '#ec4899',
  },
  {
    title: 'Field Landman Dispatch',
    desc: 'Assign field landmen to tracts based on geography, workload, and expertise. Track field visit status, meeting outcomes, and follow-up actions. GPS check-in/out.',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    color: '#8b5cf6',
  },
  {
    title: 'Landowner CRM',
    desc: 'Complete contact management with owner details, tract associations, communication history, call recordings, sentiment tracking, and negotiation notes. Family tree mapping for heir property.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: '#06b6d4',
  },
  {
    title: 'AI Document Generation',
    desc: 'Auto-generate 6 document types: offer letters, ROW agreements, easement deeds, title opinions, damage assessments, and contact letters. Populated from project + tract + owner data.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: '#10b981',
  },
  {
    title: 'Call Queue Builder',
    desc: 'Build targeted call lists by project, tract status, owner type, or geography. Priority queuing for holdouts and deadline-critical parcels. DNC compliance built in.',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    color: '#f97316',
  },
  {
    title: 'Project Dashboard + Analytics',
    desc: 'Real-time dashboards showing acquisition progress by project, region, and status. Parcel completion rates, call metrics, cost-per-acquisition, and timeline projections.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: '#3b82f6',
  },
  {
    title: 'Title Issue Tracking',
    desc: 'Flag and track title defects: cloud on title, missing heirs, boundary disputes, unrecorded conveyances, tax sale issues. Assign curative actions with deadlines and responsible parties.',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    color: '#ef4444',
  },
  {
    title: 'Weekly Digest Reports',
    desc: 'Automated weekly reports for project managers and clients: acquisition status, call activity, field visit summaries, document execution rates, and upcoming deadlines.',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: '#a855f7',
  },
  {
    title: 'Damage Assessment Module',
    desc: 'Track crop damages, timber removal, fencing, grading, and restoration obligations. Calculate compensation based on local appraisal data and landowner-specific factors.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#eab308',
  },
  {
    title: 'GIS / Parcel Map Integration',
    desc: 'Overlay project corridors on parcel maps. Visualize acquisition status by tract. Export shapefiles for engineering teams. Integrate with county GIS data feeds.',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    color: '#64748b',
  },
  {
    title: 'Eminent Domain Tracking',
    desc: 'When negotiation fails, track condemnation proceedings: filing dates, hearing schedules, offer vs. award, commissioners court outcomes, and appeal status.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: '#ef4444',
  },
  {
    title: 'Multi-Language Support',
    desc: 'AI calling agents and document templates in English and Spanish. Critical for South Texas and border-region projects where bilingual outreach drives acquisition rates.',
    icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
    color: '#06b6d4',
  },
];

const COMPARISON = [
  { metric: 'Landowner Contact', manual: 'Phone book + door knocking', echo: 'AI calls + SMS + email campaigns' },
  { metric: 'Call Volume', manual: '20-30 calls/day per landman', echo: '500+ AI calls/day per project' },
  { metric: 'Chain of Title', manual: 'Manual courthouse research', echo: 'AI-powered with gap detection' },
  { metric: 'Document Generation', manual: 'Fill-in templates (hours)', echo: 'Auto-generated in seconds' },
  { metric: 'Appointment Scheduling', manual: 'Phone tag + sticky notes', echo: 'AI books directly on calendar' },
  { metric: 'Progress Tracking', manual: 'Spreadsheets + email', echo: 'Real-time dashboard + analytics' },
  { metric: 'Damage Calculations', manual: 'Manual spreadsheets', echo: 'Automated with local appraisal data' },
  { metric: 'Title Issue Tracking', manual: 'Paper files + notes', echo: 'Digital tracking + curative workflows' },
  { metric: 'Field Landman Dispatch', manual: 'Phone calls + text', echo: 'Automated assignment + GPS tracking' },
  { metric: 'Weekly Reporting', manual: '4-6 hours per report', echo: 'Auto-generated every Monday' },
  { metric: 'Holdout Identification', manual: 'End-of-project discovery', echo: 'AI flags early + escalates' },
  { metric: 'Cost Per Acquisition', manual: '$800-2,000/tract', echo: '$150-400/tract' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    desc: 'For independent landmen and small ROW firms getting started.',
    popular: false,
    features: [
      '1 active project',
      'Up to 50 tracts',
      'Chain of title (basic)',
      'Landowner CRM',
      'Document generation (3 types)',
      'Easement tracking',
      'Progress dashboard',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '$199',
    period: '/mo',
    desc: 'For ROW firms managing multiple projects with AI-powered outreach.',
    popular: true,
    features: [
      'Up to 10 active projects',
      'Up to 500 tracts',
      'Chain of title + AI gap detection',
      'AI outbound calling (500 calls/mo)',
      'Appointment scheduling',
      'Field landman dispatch',
      'All 6 document types',
      'Call queue builder',
      'Title issue tracking',
      'Damage assessment module',
      'Weekly digest reports',
      'GIS parcel overlay',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: '$499',
    period: '/mo',
    desc: 'For large ROW companies and utilities running corridor-scale projects.',
    popular: false,
    features: [
      'Unlimited projects',
      'Unlimited tracts',
      'Chain of title + AI gap detection',
      'AI outbound calling (unlimited)',
      'Custom AI voice + scripts',
      'Multi-language (EN/ES)',
      'Full document suite + custom templates',
      'Eminent domain tracking',
      'GIS integration + shapefile export',
      'Advanced analytics + forecasting',
      'Client portal access',
      'API access (all endpoints)',
      'Dedicated success manager',
      'Custom SLA guarantee',
    ],
  },
];

const USE_CASES = [
  { industry: 'Transmission Lines', desc: 'Manage 200+ mile corridors with thousands of tracts. AI calls landowners, schedules meetings, and tracks easement execution from survey to energization.', icon: '\u26A1' },
  { industry: 'Pipeline ROW', desc: 'Natural gas, crude, water, and CO2 pipeline projects. Track temporary construction easements, permanent easements, and restoration obligations across multiple counties.', icon: '\uD83D\uDEE2\uFE0F' },
  { industry: 'Utility Corridors', desc: 'Electric distribution, fiber optic, and water/sewer line projects. Manage municipal utility easements, crossing agreements, and franchise rights.', icon: '\uD83D\uDD0C' },
  { industry: 'Wind & Solar Farms', desc: 'Surface lease acquisition for renewable energy sites. Track option agreements, surface use agreements, access roads, and transmission interconnect ROW.', icon: '\u2600\uFE0F' },
  { industry: 'Road & Highway', desc: 'State DOT and county road projects. Manage fee simple acquisitions, temporary construction easements, drainage easements, and relocation assistance.', icon: '\uD83D\uDEE3\uFE0F' },
  { industry: 'Railroad ROW', desc: 'Track ROW acquisition for rail spur lines, crossings, and corridor expansion. Manage federal railroad crossing agreements and adjacent landowner easements.', icon: '\uD83D\uDE82' },
];

const FAQ_DATA = [
  { q: 'Is this for surface rights or mineral rights?', a: 'Surface rights only. Echo Surface Landman is built for ROW acquisition, easements, and surface use agreements for infrastructure projects like transmission lines, pipelines, and utility corridors. For mineral title work, see our Title Intelligence product.' },
  { q: 'How does the AI calling work?', a: 'We use ElevenLabs Conversational AI with custom scripts tuned for surface landman outreach. The AI agent introduces the project, answers common landowner questions, handles objections, and books appointments with your field landmen. All calls are recorded and transcribed.' },
  { q: 'What document types can it generate?', a: 'Six types out of the box: offer letters, ROW agreements, easement deeds, title opinions, damage assessments, and contact letters. Enterprise customers can add custom templates. All documents are populated from your project, tract, and owner data automatically.' },
  { q: 'Can it handle chain of title for surface rights?', a: 'Yes. The AI runs surface chain of title from patent to present, identifying gaps, breaks in the chain, unresolved probates, undischarged liens, and conveyances that may affect your ability to acquire the easement. Title issues are flagged for curative action.' },
  { q: 'How does it work with our field landmen?', a: 'The dispatch module assigns tracts to field landmen based on location, workload, and language skills. Field landmen get mobile notifications with tract details, owner info, and meeting times. GPS check-in/out tracks field visits automatically.' },
  { q: 'Does it integrate with county records?', a: 'Yes. We integrate with our County Records and Title Intelligence products for automated document retrieval and chain of title research. Available in 80+ Texas counties with nationwide expansion underway.' },
  { q: 'Can clients like Encore Electric see project progress?', a: 'Enterprise plans include a client portal where your clients (utilities, EPCs, developers) can view real-time acquisition progress, map overlays, and milestone reports without needing full system access.' },
  { q: 'What about eminent domain situations?', a: 'The Enterprise plan includes condemnation tracking for parcels where negotiation fails. Track filing dates, hearing schedules, commissioner offers, and appeal status. The system flags approaching deadlines and required notices.' },
];

/* ══════════════════════════════════════════════════════════════
   LIVE DASHBOARD DEMO (simulated)
   ══════════════════════════════════════════════════════════════ */

function LiveDashboardDemo() {
  const [data, setData] = useState({
    totalTracts: 847, acquired: 612, pending: 143, holdout: 28, condemned: 12, notContacted: 52,
    callsToday: 234, appointments: 18, fieldVisits: 9, docsGenerated: 47,
    completionPct: 72.3, avgCostPerTract: 287, weeklyProgress: 31, titleIssues: 14,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        totalTracts: prev.totalTracts,
        acquired: Math.min(prev.totalTracts, prev.acquired + (Math.random() > 0.85 ? 1 : 0)),
        pending: Math.max(0, prev.pending + (Math.random() > 0.7 ? -1 : Math.random() > 0.9 ? 1 : 0)),
        holdout: Math.max(0, prev.holdout + (Math.random() > 0.95 ? 1 : Math.random() > 0.9 ? -1 : 0)),
        condemned: prev.condemned + (Math.random() > 0.98 ? 1 : 0),
        notContacted: Math.max(0, prev.notContacted + (Math.random() > 0.8 ? -1 : 0)),
        callsToday: prev.callsToday + Math.floor(Math.random() * 4),
        appointments: prev.appointments + (Math.random() > 0.85 ? 1 : 0),
        fieldVisits: prev.fieldVisits + (Math.random() > 0.9 ? 1 : 0),
        docsGenerated: prev.docsGenerated + (Math.random() > 0.8 ? 1 : 0),
        completionPct: Math.min(100, prev.completionPct + (Math.random() - 0.3) * 0.2),
        avgCostPerTract: Math.max(150, prev.avgCostPerTract + (Math.random() - 0.5) * 10),
        weeklyProgress: Math.max(10, prev.weeklyProgress + Math.floor(Math.random() * 3) - 1),
        titleIssues: Math.max(0, prev.titleIssues + (Math.random() > 0.9 ? 1 : Math.random() > 0.7 ? -1 : 0)),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const cells = [
    { label: 'Total Tracts', value: data.totalTracts.toLocaleString(), color: '#14b8a6' },
    { label: 'Acquired', value: data.acquired.toLocaleString(), color: '#22c55e' },
    { label: 'Pending', value: data.pending.toLocaleString(), color: '#f59e0b' },
    { label: 'Holdout', value: data.holdout.toLocaleString(), color: '#ef4444' },
    { label: 'Condemned', value: data.condemned.toLocaleString(), color: '#64748b' },
    { label: 'Not Contacted', value: data.notContacted.toLocaleString(), color: '#8b5cf6' },
    { label: 'AI Calls Today', value: data.callsToday.toLocaleString(), color: '#3b82f6' },
    { label: 'Appointments', value: data.appointments.toLocaleString(), color: '#ec4899' },
    { label: 'Field Visits', value: data.fieldVisits.toLocaleString(), color: '#06b6d4' },
    { label: 'Docs Generated', value: data.docsGenerated.toLocaleString(), color: '#a855f7' },
    { label: 'Completion', value: `${data.completionPct.toFixed(1)}%`, color: data.completionPct >= 70 ? '#22c55e' : '#f59e0b' },
    { label: 'Avg $/Tract', value: `$${Math.round(data.avgCostPerTract)}`, color: '#10b981' },
    { label: 'Weekly Closes', value: data.weeklyProgress.toLocaleString(), color: '#14b8a6' },
    { label: 'Title Issues', value: data.titleIssues.toLocaleString(), color: data.titleIssues > 10 ? '#ef4444' : '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
      {cells.map(cell => (
        <div
          key={cell.label}
          className="p-3 rounded-lg border text-center"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}
        >
          <div className="font-mono font-extrabold text-lg md:text-2xl transition-all" style={{ color: cell.color }}>
            {cell.value}
          </div>
          <div className="text-[9px] uppercase tracking-wider mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */

export default function SurfaceLandmanPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Surface Landman', href: '/surface-landman' }]} />
      <FaqSchema faqs={FAQ_DATA} />

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
              width={400} height={260}
              className="w-[140px] md:w-[180px] h-auto"
              style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
              priority
            />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--ept-border)' }} />
          <span className="text-sm font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--ept-text-muted)' }}>
            Surface Landman
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/title-intelligence" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>
            Title Intelligence
          </Link>
          <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>
            Sign In
          </Link>
          <Link
            href="/checkout?service=surface-landman&tier=professional"
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
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>
              Surface Rights Acquisition
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-up"
            style={{ color: 'var(--ept-text)' }}
          >
            Echo Surface Landman{' '}
            <span className="gradient-text">AI-Powered ROW Acquisition</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1"
            style={{ color: 'var(--ept-text-secondary)' }}
          >
            The complete platform for transmission line corridors, pipeline ROW, and utility easement projects.
            AI calls landowners, schedules appointments, detects title gaps, generates documents, and tracks
            every parcel from first contact to recorded easement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up-delay-2">
            <Link
              href="/checkout?service=surface-landman&tier=professional"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: 'var(--ept-accent)', boxShadow: `0 8px 32px ${isDark ? 'rgba(20,184,166,0.25)' : 'rgba(13,115,119,0.2)'}` }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Trial
            </Link>
            <Link
              href="/title-intelligence"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border font-semibold text-lg transition-all hover:opacity-80"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              Need mineral title? Title Intelligence
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {HERO_STATS.map((stat) => (
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

        {/* Live Dashboard Demo */}
        <section className="mb-16">
          <div
            className="p-6 md:p-8 rounded-2xl border"
            style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: isDark ? 'rgba(20,184,166,0.3)' : 'rgba(13,115,119,0.2)',
              boxShadow: isDark ? '0 0 40px rgba(20,184,166,0.05)' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Live Project Dashboard</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
                simulated data
              </span>
            </div>
            <LiveDashboardDemo />
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            Everything You Need for{' '}
            <span className="gradient-text">Surface Rights Acquisition</span>
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            From first landowner contact to recorded easement deed. Built for ROW firms, utilities, and EPCs managing corridor-scale projects.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="p-5 rounded-xl border transition-all hover:shadow-lg"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${feat.color}15` }}
                >
                  <svg className="w-5 h-5" style={{ color: feat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            Manual Process vs <span className="gradient-text">Echo Surface Landman</span>
          </h2>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <div className="grid grid-cols-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <div className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Process</div>
              <div className="p-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: 'var(--ept-text-muted)' }}>Manual Landman</div>
              <div className="p-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: 'var(--ept-accent)' }}>Echo Surface Landman</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.metric}
                className="grid grid-cols-3 border-b last:border-0"
                style={{ borderColor: 'var(--ept-border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--ept-surface)' }}
              >
                <div className="p-3 text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{row.metric}</div>
                <div className="p-3 text-sm text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.manual}</div>
                <div className="p-3 text-sm text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            Built for Every ROW Project Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map(uc => (
              <div
                key={uc.industry}
                className="p-5 rounded-xl border"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{uc.icon}</span>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{uc.industry}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            From Corridor to{' '}
            <span className="gradient-text">Recorded Easement</span>
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Import Parcels', desc: 'Upload tract data from GIS, CSV, or county records. Auto-identify affected landowners and tract boundaries.' },
              { step: '2', title: 'AI Outreach', desc: 'AI agents call landowners, introduce the project, answer questions, and book appointments with your field team.' },
              { step: '3', title: 'Field Negotiation', desc: 'Field landmen meet landowners with pre-populated offer packets. Mobile app tracks visit outcomes and signatures.' },
              { step: '4', title: 'Document Execution', desc: 'Generate and execute easement deeds, ROW agreements, and damage settlements. E-sign or wet sign workflows.' },
              { step: '5', title: 'Record & Release', desc: 'Track recording at the county clerk. Release tracts for construction. Dashboard shows real-time project progress.' },
            ].map(s => (
              <div
                key={s.step}
                className="p-5 rounded-xl border text-center"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-extrabold"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  {s.step}
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16" id="pricing">
          <h2 className="text-3xl font-extrabold text-center mb-2" style={{ color: 'var(--ept-text)' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            No per-tract fees. No hidden charges. Cancel anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map(plan => (
              <div
                key={plan.name}
                className="p-6 rounded-2xl border relative"
                style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  borderWidth: plan.popular ? 2 : 1,
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-extrabold mb-1" style={{ color: 'var(--ept-text)' }}>{plan.name}</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--ept-text-muted)' }}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                      <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?service=surface-landman&tier=${plan.name.toLowerCase()}`}
                  className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: plan.popular ? 'var(--ept-accent)' : 'transparent',
                    color: plan.popular ? '#fff' : 'var(--ept-text-secondary)',
                    border: plan.popular ? 'none' : '1px solid var(--ept-border)',
                  }}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>
            Ready to Modernize Your ROW Acquisition?
          </h2>
          <p className="max-w-lg mx-auto mb-6 text-center" style={{ color: 'var(--ept-text-secondary)' }}>
            AI-powered landowner outreach, chain of title, and document generation.
            Start your free trial today — no credit card required.
          </p>
          <TrialCTA serviceId="echo-surface-landman" tier="professional" productName="Echo Surface Landman" />
        </section>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* API Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            Developer-First <span className="gradient-text">REST API</span>
          </h2>
          <p className="text-center mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Full API access for integrating surface landman workflows into your existing systems. Manage projects, tracts, owners, calls, and documents programmatically.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { category: 'Projects & Tracts', endpoints: ['POST /api/projects', 'GET /api/projects/:id/tracts', 'PUT /api/tracts/:id/status', 'POST /api/tracts/import/csv', 'GET /api/projects/:id/analytics'] },
              { category: 'Owners & Outreach', endpoints: ['GET /api/owners/:id', 'POST /api/call-queue/build', 'POST /api/calls/ai-outbound', 'GET /api/calls/:id/transcript', 'POST /api/appointments/schedule'] },
              { category: 'Documents & Title', endpoints: ['POST /api/documents/generate', 'GET /api/tracts/:id/chain-of-title', 'GET /api/tracts/:id/title-issues', 'POST /api/easements/:id/record', 'GET /api/reports/weekly-digest'] },
            ].map(group => (
              <div
                key={group.category}
                className="p-5 rounded-xl border"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ept-accent)' }}>{group.category}</h3>
                <div className="space-y-1.5">
                  {group.endpoints.map(ep => (
                    <div key={ep} className="font-mono text-[11px] px-2 py-1 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                      {ep}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Engine Query Panel */}
        <section className="mb-16">
          <EngineQueryPanel
            domain="LM"
            title="Ask the Landman Intelligence Engine"
            placeholder="Ask about surface rights, ROW acquisition, easement law..."
            exampleQueries={[
              'What are the required elements of a valid easement deed in Texas?',
              'How does a surface landman determine fair market value for a transmission line easement?',
              'What is the process for acquiring ROW through eminent domain in Texas?',
              'What title defects commonly block easement acquisition?',
            ]}
          />
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {FAQ_DATA.map(faq => (
              <div
                key={faq.q}
                className="p-5 rounded-xl border"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. Echo Surface Landman v1.0 — Built for ROW acquisition at scale on Cloudflare&apos;s global edge.
        </p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/title-intelligence" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Title Intelligence</Link>
          <Link href="/county-records" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>County Records</Link>
          <Link href="/permian" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Permian Basin</Link>
          <Link href="/pricing" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>All Products</Link>
          <Link href="/legal/privacy" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Privacy</Link>
          <Link href="/legal/terms" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}
