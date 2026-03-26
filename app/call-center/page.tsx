'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

const HERO_STATS = [
  { label: 'Concurrent Calls', value: '10,000+', color: '#14b8a6' },
  { label: 'AI Response', value: '<1.5s', color: '#22c55e' },
  { label: 'Uptime', value: '99.99%', color: '#f59e0b' },
  { label: 'Cost Savings', value: '85%', color: '#a855f7' },
];

const FEATURES = [
  {
    title: 'Intelligent Queue Routing',
    desc: 'Skills-based, priority, round-robin, least-busy, and longest-idle routing strategies. AI matches callers to the perfect agent in milliseconds.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: '#14b8a6',
  },
  {
    title: 'AI Agents That Never Sleep',
    desc: 'Deploy 100+ AI agents per queue. Each handles natural conversations with ElevenLabs voices, objection handling, and appointment booking.',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: '#22c55e',
  },
  {
    title: 'Predictive Dialer',
    desc: 'Power, predictive, progressive, and preview dialing modes. Automatic pacing, DNC compliance, retry logic, and campaign scheduling.',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    color: '#3b82f6',
  },
  {
    title: 'Real-Time Wallboard',
    desc: 'Live monitoring dashboard with queue depth, agent status, SLA alerts, sentiment trends, callbacks pending, and voicemail counts.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: '#f59e0b',
  },
  {
    title: 'VIP Contact Management',
    desc: 'Auto-detect VIP callers, route to preferred agents, skip queues, and track lifetime value. 5-tier priority system with custom fields.',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    color: '#f59e0b',
  },
  {
    title: 'Smart IVR Builder',
    desc: 'Visual drag-and-drop IVR builder with AI-powered natural language understanding. Callers speak, AI routes — no more "Press 1 for..."',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    color: '#ec4899',
  },
  {
    title: 'Live Whisper & Takeover',
    desc: 'Supervisors whisper coaching instructions to AI agents in real-time. Seamless human takeover when needed — caller never knows.',
    icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
    color: '#8b5cf6',
  },
  {
    title: 'Smart Callbacks',
    desc: 'Callers press 1 to request a callback instead of waiting on hold. Auto-scheduled, priority-ranked, agent-preferred, with retry logic.',
    icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
    color: '#10b981',
  },
  {
    title: 'Voicemail with AI Transcription',
    desc: 'Automatic voicemail capture, AI transcription, sentiment analysis, urgency detection. Agents see summaries before calling back.',
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
    color: '#ef4444',
  },
  {
    title: 'Branching Script Engine',
    desc: 'Build conversation flows with branching logic. AI agents follow scripts dynamically based on caller responses. Track success rates per node.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    color: '#a855f7',
  },
  {
    title: 'CRM Webhooks',
    desc: 'Real-time event webhooks with HMAC signing. Push call events, dispositions, and recordings to Salesforce, HubSpot, or any CRM.',
    icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
    color: '#06b6d4',
  },
  {
    title: 'SLA Monitoring & Alerts',
    desc: 'Define SLA rules on queue wait, abandonment rate, sentiment, and handle time. Automatic breach detection with multi-channel alerts.',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    color: '#ef4444',
  },
  {
    title: 'TCPA Compliance Engine',
    desc: 'Automatic recording consent announcements, time-zone call restrictions, DNC list enforcement, and full compliance audit trail.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: '#22c55e',
  },
  {
    title: 'Sentiment Escalation',
    desc: 'AI monitors caller sentiment in real-time. When negativity spikes, automatically escalate to a human supervisor — before the caller hangs up.',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#f97316',
  },
  {
    title: 'Enterprise Analytics',
    desc: 'Conversion funnels, agent scorecards, hourly heatmaps, disposition breakdowns, sentiment trends, campaign ROI, and custom KPIs.',
    icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: '#06b6d4',
  },
  {
    title: 'Disposition Codes',
    desc: 'Customizable disposition codes with auto-actions: trigger callbacks, add to DNC, require notes. Seed with 12 industry-standard defaults.',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    color: '#64748b',
  },
  {
    title: 'Call Quality Scoring',
    desc: 'AI-powered quality rubrics with weighted multi-criteria scoring. Agent leaderboards, score distributions, and supervisor override. Seed default rubrics instantly.',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    color: '#eab308',
  },
  {
    title: 'Post-Call Surveys (NPS/CSAT)',
    desc: 'Send CSAT and NPS surveys via SMS, IVR, or email after calls. Real-time NPS breakdown (promoter/passive/detractor), response rates, and trend analysis.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    color: '#6366f1',
  },
  {
    title: 'Call Notes & Annotations',
    desc: 'Timestamped call notes with types: general, action item, follow-up, escalation, private. Pin important notes. Full-text search across all calls.',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    color: '#0ea5e9',
  },
  {
    title: 'Business Hours & Holidays',
    desc: 'Per-day operating hours with timezone support. Holiday overrides with recurring dates. After-hours overflow to voicemail, callback, or IVR.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#f59e0b',
  },
  {
    title: 'Agent Skill Routing',
    desc: 'Define skills with proficiency levels (1-10). Queues require specific skills. Route to best-matched agents with certified-first preference.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: '#8b5cf6',
  },
  {
    title: 'Canned Responses',
    desc: 'Quick-reply templates with keyboard shortcuts (/greet, /hold, /close). Category-organized, usage-tracked, with variable substitution.',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    color: '#ec4899',
  },
  {
    title: 'Full Audit Trail',
    desc: 'Every action logged: call events, agent changes, settings updates, API calls. Query by actor, resource, action type. Compliance dashboard with stats.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    color: '#64748b',
  },
  {
    title: 'SMS/MMS Omnichannel',
    desc: 'Handle SMS alongside calls in one unified view. Auto-create conversations, assign to agents, track sentiment. AI auto-replies with canned responses.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    color: '#06b6d4',
  },
  {
    title: 'Queue Announcements',
    desc: 'Position updates, wait-time estimates, callback offers, and custom messages with ElevenLabs TTS. Configurable intervals and triggers.',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
    color: '#f97316',
  },
  {
    title: 'Usage Billing',
    desc: 'Track call minutes, SMS, AI usage, recordings, and API calls per tenant. Auto-generate invoices with line items. Full billing history.',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    color: '#22c55e',
  },
  {
    title: 'Supervisor Dashboard',
    desc: 'Real-time supervisor view with monitor/whisper/barge/takeover modes. Configurable alerts for long holds, negative sentiment, escalations, and VIP calls.',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    color: '#8b5cf6',
  },
  {
    title: 'Agent Gamification',
    desc: 'Points, badges, leaderboards, and redeemable rewards. 8 rarities from Common to Legendary. Motivate agents with streaks, milestones, and competitions.',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    color: '#f59e0b',
  },
  {
    title: 'Call Volume Forecasting',
    desc: 'Predict call volumes by hour using historical patterns. Auto-calculate agents needed. Compare forecasts vs actuals for accuracy tracking.',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    color: '#3b82f6',
  },
  {
    title: 'Conference Calls',
    desc: 'Multi-party conferencing with mute, hold, and participant management. Up to 10 participants per conference. Full recording support.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: '#10b981',
  },
  {
    title: 'Number Masking & Caller ID',
    desc: 'Anonymous calling with proxy numbers. Per-queue and per-campaign caller ID profiles. Local presence dialing. Auto-expiring masks.',
    icon: 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88',
    color: '#64748b',
  },
  {
    title: 'Agent Knowledge Base',
    desc: 'Internal article library with categories, full-text search, version history, and helpfulness voting. Agents find answers instantly during live calls.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: '#06b6d4',
  },
  {
    title: 'Recording Analytics',
    desc: 'AI analyzes every recording: talk ratios, silence detection, overtalk count, keyword spotting, competitor mentions, sentiment timeline, compliance checks.',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    color: '#ef4444',
  },
  {
    title: 'Agent Coaching & Certifications',
    desc: 'Training modules with quizzes, role-plays, and call reviews. Track progress, award certifications, and link to gamification badges.',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    color: '#a855f7',
  },
  {
    title: 'Workflow Automation',
    desc: 'Build trigger-condition-action workflows: auto-tag calls, send SMS on abandonment, escalate on negative sentiment, notify on VIP detection. Zero code.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    color: '#f97316',
  },
];

const SCALE_COMPARISON = [
  { metric: 'Concurrent Calls', closer: '50', callCenter: '10,000+' },
  { metric: 'AI Agents', closer: '1-5', callCenter: 'Unlimited' },
  { metric: 'Queue Strategies', closer: 'Basic', callCenter: '5 strategies' },
  { metric: 'IVR Builder', closer: 'No', callCenter: 'Visual + AI NLU' },
  { metric: 'Predictive Dialer', closer: 'Power only', callCenter: '4 modes' },
  { metric: 'Live Wallboard', closer: 'Basic stats', callCenter: 'Full wallboard + SLA' },
  { metric: 'VIP Routing', closer: 'No', callCenter: '5-tier priority + preferred agent' },
  { metric: 'Callbacks', closer: 'No', callCenter: 'Auto-scheduled + press-1' },
  { metric: 'Voicemail + Transcription', closer: 'No', callCenter: 'AI transcription + urgency' },
  { metric: 'Script Engine', closer: 'Basic script', callCenter: 'Branching flows + tracking' },
  { metric: 'CRM Webhooks', closer: 'No', callCenter: 'HMAC-signed real-time' },
  { metric: 'SLA Alerts', closer: 'No', callCenter: 'Multi-metric + multi-channel' },
  { metric: 'TCPA Compliance', closer: 'DNC only', callCenter: 'Full audit trail' },
  { metric: 'Sentiment Escalation', closer: 'No', callCenter: 'Auto-supervisor transfer' },
  { metric: 'Disposition Codes', closer: 'Basic', callCenter: 'Custom + auto-actions' },
  { metric: 'Recording Storage', closer: '30 days', callCenter: 'Unlimited (R2)' },
  { metric: 'Whisper/Takeover', closer: 'Yes', callCenter: 'Yes + supervisor view' },
  { metric: 'Multi-Queue', closer: 'No', callCenter: 'Yes, unlimited' },
  { metric: 'Skills-Based Routing', closer: 'No', callCenter: 'Yes' },
  { metric: 'Campaign Management', closer: 'Basic', callCenter: 'Full predictive' },
  { metric: 'Bulk Operations', closer: 'No', callCenter: 'Leads, DNC, dispositions' },
  { metric: 'Agent Schedules', closer: 'No', callCenter: 'Weekly + breaks' },
  { metric: 'Call Quality Scoring', closer: 'No', callCenter: 'AI rubrics + leaderboard' },
  { metric: 'Post-Call Surveys', closer: 'No', callCenter: 'NPS + CSAT + custom' },
  { metric: 'Call Notes', closer: 'No', callCenter: 'Timestamped + searchable' },
  { metric: 'Business Hours', closer: 'No', callCenter: 'Per-day + holidays + overflow' },
  { metric: 'Agent Skill Routing', closer: 'No', callCenter: 'Proficiency-based + certified' },
  { metric: 'Canned Responses', closer: 'No', callCenter: 'Shortcuts + categories + tracking' },
  { metric: 'Audit Log', closer: 'No', callCenter: 'Full compliance trail' },
  { metric: 'SMS/MMS Channel', closer: 'No', callCenter: 'Omnichannel + auto-assign' },
  { metric: 'Queue Announcements', closer: 'No', callCenter: 'TTS + position + callback offer' },
  { metric: 'Usage Billing', closer: 'No', callCenter: 'Metered + invoices' },
  { metric: 'Supervisor Dashboard', closer: 'No', callCenter: 'Monitor/whisper/barge/takeover' },
  { metric: 'Gamification', closer: 'No', callCenter: 'Points + badges + rewards' },
  { metric: 'Call Forecasting', closer: 'No', callCenter: 'Historical patterns + staffing' },
  { metric: 'Conference Calls', closer: 'No', callCenter: 'Multi-party (10 participants)' },
  { metric: 'Number Masking', closer: 'No', callCenter: 'Proxy + caller ID profiles' },
  { metric: 'Knowledge Base', closer: 'No', callCenter: 'Versioned articles + search' },
  { metric: 'Recording Analytics', closer: 'No', callCenter: 'Talk ratios + keyword spotting' },
  { metric: 'Agent Coaching', closer: 'No', callCenter: 'Modules + quizzes + certs' },
  { metric: 'Workflow Automation', closer: 'No', callCenter: 'Triggers + conditions + actions' },
  { metric: 'API Endpoints', closer: '~20', callCenter: '230+ REST endpoints' },
];

const PRICING = [
  {
    name: 'Startup',
    price: '$499',
    period: '/mo',
    desc: 'For growing teams ready to scale their phone operations with AI.',
    popular: false,
    features: [
      'Up to 50 concurrent calls',
      '5 AI agents + 2 queues',
      'Power dialer',
      'Call recording (90 days)',
      'Callback scheduling',
      'Disposition codes',
      'Post-call CSAT surveys',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'Business',
    price: '$1,499',
    period: '/mo',
    desc: 'For established businesses handling serious call volume.',
    popular: true,
    features: [
      'Up to 500 concurrent calls',
      '50 AI agents + 10 queues',
      'All 4 dialer modes',
      'IVR builder + script engine',
      'Real-time wallboard + SLA alerts',
      'VIP routing (5 tiers)',
      'Callbacks + voicemail transcription',
      'CRM webhooks (HMAC-signed)',
      'TCPA compliance engine',
      'Sentiment escalation',
      'Call recording (unlimited)',
      'Whisper & takeover',
      'AI call quality scoring',
      'NPS + CSAT surveys',
      'Call notes & annotations',
      'Business hours + overflow routing',
      'Agent skill routing (proficiency)',
      'Canned responses (/shortcuts)',
      'SMS/MMS channel',
      'Queue announcements (TTS)',
      'Gamification + badges',
      'Conference calls',
      'Knowledge base + coaching',
      'Workflow automation',
      'Advanced analytics + heatmaps',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: '$4,999',
    period: '/mo',
    desc: 'For call centers and agencies that need unlimited scale and white-label.',
    popular: false,
    features: [
      '10,000+ concurrent calls',
      'Unlimited AI agents + queues',
      'Custom IVR + AI NLU',
      'Predictive dialer with pacing',
      'Multi-tenant white-label',
      'Custom voice cloning',
      'Full API (230+ endpoints)',
      'Custom webhook integrations',
      'Full TCPA + SOC 2 compliance',
      'Custom SLA rules + dashboards',
      'Agent scheduling + workforce mgmt',
      'Custom scoring rubrics + leaderboard',
      'NPS/CSAT/custom survey engine',
      'Business hours + holiday overrides',
      'Canned responses + shortcut engine',
      'Full audit log + compliance dashboard',
      'SMS/MMS omnichannel',
      'Queue announcements with TTS',
      'Metered billing + invoicing',
      'Supervisor dashboard (monitor/whisper/barge)',
      'Agent gamification + leaderboard',
      'Call volume forecasting + staffing',
      'Conference calls (10 participants)',
      'Number masking + caller ID profiles',
      'Internal knowledge base (versioned)',
      'Recording analytics (AI insights)',
      'Agent coaching + certifications',
      'Workflow automation engine',
      'Bulk operations + data import',
      'Dedicated success manager',
      'SLA guarantee (99.99%)',
    ],
  },
];

const USE_CASES = [
  { industry: 'Insurance', desc: 'Handle open enrollment surges with AI agents that quote policies, schedule appointments, and process claims intake — scaling from 50 to 5,000 calls overnight.', icon: '\uD83D\uDEE1\uFE0F' },
  { industry: 'Real Estate', desc: 'AI agents qualify buyers, schedule showings, and follow up with leads 24/7. Predictive dialer campaigns hit expired listings at scale.', icon: '\uD83C\uDFE0' },
  { industry: 'Healthcare', desc: 'HIPAA-ready call handling for appointment scheduling, prescription refills, nurse triage routing, and patient follow-up campaigns.', icon: '\uD83C\uDFE5' },
  { industry: 'Solar / Home Services', desc: 'Predictive dialer blasts through lead lists while AI agents qualify, handle objections, and book in-home appointments.', icon: '\u2600\uFE0F' },
  { industry: 'Collections', desc: 'AI agents handle sensitive payment conversations with compliance scripts, automatic recording, and disposition tracking.', icon: '\uD83D\uDCB0' },
  { industry: 'Political / Nonprofits', desc: 'Massive outbound campaigns for voter contact, donation drives, and event mobilization — 10,000+ calls per hour.', icon: '\uD83D\uDDF3\uFE0F' },
];

/* ══════════════════════════════════════════════════════════════
   LIVE WALLBOARD DEMO (simulated)
   ══════════════════════════════════════════════════════════════ */

function LiveWallboardDemo() {
  const [data, setData] = useState({
    inQueue: 12, active: 47, available: 8, busy: 39, away: 3,
    longestWait: 23, avgWait: 8, avgHandle: 194, sla: 94.2,
    todayCalls: 1847, sales: 127, abandoned: 31, sentiment: 0.72,
    callbacks: 5, voicemails: 3, slaAlerts: 0, qualityScore: 87.3, nps: 62, smsOpen: 8, supervisors: 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        inQueue: Math.max(0, prev.inQueue + Math.floor(Math.random() * 7) - 3),
        active: Math.max(20, prev.active + Math.floor(Math.random() * 5) - 2),
        available: Math.max(1, prev.available + Math.floor(Math.random() * 3) - 1),
        busy: Math.max(10, prev.busy + Math.floor(Math.random() * 3) - 1),
        away: Math.max(0, prev.away + Math.floor(Math.random() * 3) - 1),
        longestWait: Math.max(0, prev.longestWait + Math.floor(Math.random() * 11) - 5),
        avgWait: Math.max(1, prev.avgWait + Math.floor(Math.random() * 5) - 2),
        avgHandle: Math.max(60, prev.avgHandle + Math.floor(Math.random() * 21) - 10),
        sla: Math.min(100, Math.max(80, prev.sla + (Math.random() - 0.45) * 2)),
        todayCalls: prev.todayCalls + Math.floor(Math.random() * 4),
        sales: prev.sales + (Math.random() > 0.85 ? 1 : 0),
        abandoned: prev.abandoned + (Math.random() > 0.92 ? 1 : 0),
        sentiment: Math.min(1, Math.max(0, prev.sentiment + (Math.random() - 0.48) * 0.05)),
        callbacks: Math.max(0, prev.callbacks + (Math.random() > 0.7 ? 1 : Math.random() > 0.5 ? -1 : 0)),
        voicemails: Math.max(0, prev.voicemails + (Math.random() > 0.85 ? 1 : Math.random() > 0.6 ? -1 : 0)),
        slaAlerts: Math.max(0, prev.slaAlerts + (Math.random() > 0.95 ? 1 : Math.random() > 0.3 ? -1 : 0)),
        qualityScore: Math.min(100, Math.max(70, prev.qualityScore + (Math.random() - 0.45) * 1.5)),
        nps: Math.min(100, Math.max(20, prev.nps + Math.floor(Math.random() * 5) - 2)),
        smsOpen: Math.max(0, prev.smsOpen + (Math.random() > 0.6 ? 1 : Math.random() > 0.4 ? -1 : 0)),
        supervisors: Math.max(0, Math.min(5, prev.supervisors + (Math.random() > 0.85 ? 1 : Math.random() > 0.85 ? -1 : 0))),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (n: number) => n.toLocaleString();
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const cells = [
    { label: 'In Queue', value: fmt(data.inQueue), color: data.inQueue > 20 ? '#ef4444' : data.inQueue > 10 ? '#f59e0b' : '#22c55e', big: true },
    { label: 'Active Calls', value: fmt(data.active), color: '#14b8a6', big: true },
    { label: 'Agents Available', value: fmt(data.available), color: '#22c55e' },
    { label: 'Agents Busy', value: fmt(data.busy), color: '#f59e0b' },
    { label: 'Agents Away', value: fmt(data.away), color: '#64748b' },
    { label: 'Longest Wait', value: `${data.longestWait}s`, color: data.longestWait > 30 ? '#ef4444' : '#22c55e' },
    { label: 'Avg Wait', value: `${data.avgWait}s`, color: '#3b82f6' },
    { label: 'Avg Handle', value: fmtTime(data.avgHandle), color: '#8b5cf6' },
    { label: 'Service Level', value: `${data.sla.toFixed(1)}%`, color: data.sla >= 90 ? '#22c55e' : '#ef4444', big: true },
    { label: 'Today\'s Calls', value: fmt(data.todayCalls), color: '#14b8a6' },
    { label: 'Sales Today', value: fmt(data.sales), color: '#22c55e' },
    { label: 'Sentiment', value: `${(data.sentiment * 100).toFixed(0)}%`, color: data.sentiment > 0.6 ? '#22c55e' : '#f59e0b' },
    { label: 'Callbacks', value: fmt(data.callbacks), color: data.callbacks > 8 ? '#f59e0b' : '#3b82f6' },
    { label: 'Voicemails', value: fmt(data.voicemails), color: data.voicemails > 5 ? '#f59e0b' : '#8b5cf6' },
    { label: 'SLA Alerts', value: fmt(data.slaAlerts), color: data.slaAlerts > 0 ? '#ef4444' : '#22c55e' },
    { label: 'Avg Quality', value: `${data.qualityScore.toFixed(1)}`, color: data.qualityScore >= 85 ? '#22c55e' : data.qualityScore >= 70 ? '#f59e0b' : '#ef4444' },
    { label: 'NPS Score', value: `+${data.nps}`, color: data.nps >= 50 ? '#22c55e' : data.nps >= 30 ? '#f59e0b' : '#ef4444' },
    { label: 'SMS Open', value: fmt(data.smsOpen), color: data.smsOpen > 10 ? '#f59e0b' : '#06b6d4' },
    { label: 'Supervisors', value: fmt(data.supervisors), color: '#8b5cf6' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {cells.map(cell => (
        <div
          key={cell.label}
          className={`p-3 rounded-lg border text-center ${cell.big ? 'col-span-1' : ''}`}
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

export default function CallCenterPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Call Center', href: '/call-center' }]} />
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
            AI Call Center
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/closer" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>
            AI Closer (Solo)
          </Link>
          <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>
            Sign In
          </Link>
          <Link
            href="/checkout?service=call-center&tier=business"
            className="text-sm font-semibold px-5 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">

        {/* Hero */}
        <section data-tutorial="cc-hero" className="py-16 md:py-24 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 animate-fade-up"
            style={{ borderColor: 'var(--ept-accent)', backgroundColor: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(13,115,119,0.06)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>
              Enterprise Scale
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-up"
            style={{ color: 'var(--ept-text)' }}
          >
            AI Call Center That Handles{' '}
            <span className="gradient-text">Thousands of Calls</span>{' '}
            Simultaneously
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1"
            style={{ color: 'var(--ept-text-secondary)' }}
          >
            Deploy an army of AI agents that answer, qualify, route, and close calls 24/7.
            Intelligent queue management, predictive dialing, real-time wallboards, and
            enterprise analytics. Built on the same Closer AI engine — scaled to infinity.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up-delay-2">
            <Link
              href="/checkout?service=call-center&tier=business"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: 'var(--ept-accent)', boxShadow: `0 8px 32px ${isDark ? 'rgba(20,184,166,0.25)' : 'rgba(13,115,119,0.2)'}` }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Trial
            </Link>
            <Link
              href="/closer"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border font-semibold text-lg transition-all hover:opacity-80"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
            >
              Need fewer calls? Try AI Closer
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

        {/* Live Wallboard Demo */}
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
              <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Live Wallboard Demo</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
                simulated data
              </span>
            </div>
            <LiveWallboardDemo />
          </div>
        </section>

        {/* Features Grid */}
        <section data-tutorial="cc-features" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            Everything You Need to Run a{' '}
            <span className="gradient-text">World-Class Call Center</span>
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Built on Cloudflare's global edge network. Every feature designed for massive scale.
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

        {/* Closer vs Call Center Comparison */}
        <section data-tutorial="cc-comparison" className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            AI Closer vs AI Call Center
          </h2>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <div className="grid grid-cols-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <div className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Feature</div>
              <div className="p-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: 'var(--ept-text-muted)' }}>AI Closer</div>
              <div className="p-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: 'var(--ept-accent)' }}>AI Call Center</div>
            </div>
            {SCALE_COMPARISON.map((row, i) => (
              <div
                key={row.metric}
                className="grid grid-cols-3 border-b last:border-0"
                style={{ borderColor: 'var(--ept-border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--ept-surface)' }}
              >
                <div className="p-3 text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{row.metric}</div>
                <div className="p-3 text-sm text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.closer}</div>
                <div className="p-3 text-sm text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.callCenter}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            Built for Every Industry
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
            Up and Running in{' '}
            <span className="gradient-text">Under 24 Hours</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Connect Your Numbers', desc: 'Bring your Twilio numbers or we provision new ones. Port existing numbers seamlessly.' },
              { step: '2', title: 'Configure Queues & Agents', desc: 'Set up routing rules, deploy AI agents, configure IVR menus — all from the dashboard.' },
              { step: '3', title: 'Import Your Leads', desc: 'Upload CSV, connect your CRM, or push leads via API. Build outbound campaigns in minutes.' },
              { step: '4', title: 'Go Live', desc: 'Calls start flowing. AI agents handle the volume. Monitor everything from the real-time wallboard.' },
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
        <section data-tutorial="cc-pricing" className="mb-16" id="pricing">
          <h2 className="text-3xl font-extrabold text-center mb-2" style={{ color: 'var(--ept-text)' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            No per-minute fees. No hidden charges. Cancel anytime.
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
                  href={`/checkout?service=call-center&tier=${plan.name.toLowerCase()}`}
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
        <section className="mb-16">
          <div
            className="p-8 md:p-12 rounded-2xl text-center"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(59,130,246,0.08))'
                : 'linear-gradient(135deg, rgba(13,115,119,0.06), rgba(59,130,246,0.04))',
              border: `1px solid ${isDark ? 'rgba(20,184,166,0.2)' : 'rgba(13,115,119,0.15)'}`,
            }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
              Ready to Scale Your Call Operations?
            </h2>
            <p className="max-w-lg mx-auto mb-6" style={{ color: 'var(--ept-text-secondary)' }}>
              Deploy AI agents that handle thousands of calls simultaneously.
              Start your free trial today — no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/checkout?service=call-center&tier=business"
                className="px-8 py-4 rounded-xl font-semibold text-lg text-white"
                style={{ backgroundColor: 'var(--ept-accent)' }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/support"
                className="px-8 py-4 rounded-xl border font-semibold text-lg"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* API Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            Developer-First <span className="gradient-text">REST API</span>
          </h2>
          <p className="text-center mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            120+ API endpoints for complete programmatic control. Integrate with any CRM, build custom dashboards, or automate your entire call operation.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { category: 'Call Management', endpoints: ['POST /api/calls/inbound', 'POST /api/calls/outbound', 'POST /api/calls/:id/transfer', 'POST /api/calls/:id/whisper', 'POST /api/calls/bulk/disposition'] },
              { category: 'Queue & Agents', endpoints: ['GET /api/monitor/realtime', 'GET /api/monitor/live-calls', 'POST /api/agents/:id/status', 'POST /api/agents/:id/schedules/bulk', 'GET /api/analytics/heatmap'] },
              { category: 'Quality & Compliance', endpoints: ['POST /api/calls/:id/score', 'GET /api/quality/leaderboard', 'GET /api/audit-log', 'GET /api/business-hours/status', 'POST /api/agents/:id/skills'] },
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

        {/* FAQ */}
        <section data-tutorial="cc-faq" className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { q: 'Do I need my own Twilio account?', a: 'Yes, bring your own Twilio account and phone numbers. We handle all the routing logic, AI, and call management — Twilio handles the telephony.' },
              { q: 'Can AI agents handle complex conversations?', a: 'Absolutely. Our AI agents use the Echo Chat engine with branching scripts, objection handling, sentiment detection, and ElevenLabs voice cloning for natural conversations.' },
              { q: 'How does VIP routing work?', a: 'When a known VIP caller dials in, the system auto-detects them from your contacts database, skips the queue, and routes directly to their preferred agent.' },
              { q: 'What happens when all agents are busy?', a: 'Callers can opt for a callback by pressing 1 while on hold. The system auto-schedules the callback and dials them back when an agent is free.' },
              { q: 'Is this TCPA compliant?', a: 'Yes. The compliance engine enforces recording consent announcements, time-zone restrictions (no calls before 8am or after 9pm local), DNC enforcement, and maintains a full audit trail.' },
              { q: 'Can I integrate with my CRM?', a: 'Yes. Set up HMAC-signed webhooks that fire on any event — call completed, voicemail received, SLA breach, etc. Push real-time data to Salesforce, HubSpot, or any system.' },
              { q: 'How fast can I set up?', a: 'Most customers are live within 24 hours. Connect Twilio numbers, configure queues and AI agents, import leads, and start taking calls.' },
              { q: 'What is the AI Closer vs Call Center?', a: 'AI Closer is our solo sales agent — great for small teams handling up to 50 concurrent calls. AI Call Center is the enterprise version with unlimited scale, queues, VIP routing, and full compliance.' },
            ].map(faq => (
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
          &copy; {new Date().getFullYear()} Echo Prime Technologies. AI Call Center v3.4 — 65 tables, 230+ endpoints, built on Cloudflare&apos;s global edge.
        </p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/closer" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>AI Closer (Solo)</Link>
          <Link href="/pricing" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>All Products</Link>
          <Link href="/legal/privacy" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Privacy</Link>
          <Link href="/legal/terms" className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}
