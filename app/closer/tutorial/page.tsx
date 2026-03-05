'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../lib/theme-context';

/* ══════════════════════════════════════════════════════════════════════════════
   MOCKUP UI ILLUSTRATION COMPONENTS
   These render styled div-based mockups that look like miniature screenshots
   of the actual Closer platform pages, with numbered callouts.
   ══════════════════════════════════════════════════════════════════════════════ */

// ── Shared illustration primitives ──

function MockCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', padding: '10px 12px', ...style }}>
      {children}
    </div>
  );
}

function Callout({ n, x, y, color = '#14b8a6' }: { n: number; x: string; y: string; color?: string }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 22, height: 22, borderRadius: '50%', backgroundColor: color, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: `0 0 0 3px ${color}40, 0 2px 8px rgba(0,0,0,0.3)`, lineHeight: 1 }}>
      {n}
    </div>
  );
}

function MockBtn({ children, accent, small }: { children: React.ReactNode; accent?: boolean; small?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: small ? '3px 8px' : '5px 12px', borderRadius: 6, fontSize: small ? 9 : 10, fontWeight: 700, backgroundColor: accent ? 'var(--ept-accent)' : 'var(--ept-surface)', color: accent ? '#fff' : 'var(--ept-text-muted)', border: accent ? 'none' : '1px solid var(--ept-border)', whiteSpace: 'nowrap' as const }}>
      {children}
    </span>
  );
}

function IllustrationFrame({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ position: 'relative', borderRadius: 12, border: '1px solid var(--ept-border)', overflow: 'hidden', backgroundColor: 'var(--ept-bg)', padding: 16 }}>
        {children}
      </div>
      <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 6, textAlign: 'center', fontStyle: 'italic' }}>{caption}</p>
    </div>
  );
}

function StepCalloutList({ items, color = '#14b8a6' }: { items: string[]; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, marginBottom: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: color, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
          <span style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.5 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1: DASHBOARD ILLUSTRATIONS
// ══════════════════════════════════════════════════════════════════════════════

function DashboardIllustrations() {
  return (
    <>
      {/* Illustration 1: KPI Cards Overview */}
      <IllustrationFrame caption="Dashboard KPI cards show real-time metrics at the top of your screen">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, position: 'relative' }}>
          <Callout n={1} x="2%" y="-4px" />
          {[
            { label: 'Leads Today', value: '47', change: '+12%', up: true },
            { label: 'Calls Made', value: '183', change: '+28%', up: true },
            { label: 'Appointments', value: '9', change: '+3', up: true },
            { label: 'Daily Spend', value: '$54.30', change: 'On budget', up: true },
          ].map((kpi, i) => (
            <MockCard key={i}>
              <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ept-text)' }}>{kpi.value}</div>
              <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 600, marginTop: 2 }}>{kpi.change}</div>
            </MockCard>
          ))}
        </div>
      </IllustrationFrame>

      {/* Illustration 2: Activity Feed */}
      <IllustrationFrame caption="The activity feed shows live call events as they happen">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, position: 'relative' }}>
          <Callout n={2} x="64%" y="-4px" />
          {/* Chart area placeholder */}
          <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', padding: 12, minHeight: 100 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Calls This Week</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
              {[40, 65, 55, 80, 70, 90, 45].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: i === 5 ? 'var(--ept-accent)' : 'var(--ept-border)', borderRadius: 3, height: `${h}%`, transition: 'height 0.3s' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} style={{ fontSize: 8, color: 'var(--ept-text-muted)', flex: 1, textAlign: 'center' }}>{d}</span>
              ))}
            </div>
          </div>
          {/* Activity feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 2 }}>Live Activity</div>
            {[
              { icon: '📞', text: 'Call completed with John D.', time: '2m ago', color: '#22c55e' },
              { icon: '📅', text: 'Appointment booked — Sarah M.', time: '5m ago', color: '#3b82f6' },
              { icon: '📞', text: 'Call in progress...', time: 'now', color: '#f59e0b' },
              { icon: '❌', text: 'Voicemail — Mike R.', time: '8m ago', color: '#94a3b8' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 6, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <span style={{ fontSize: 12 }}>{a.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, color: 'var(--ept-text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{a.text}</div>
                  <div style={{ fontSize: 8, color: a.color }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IllustrationFrame>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2: LEADS ILLUSTRATIONS
// ══════════════════════════════════════════════════════════════════════════════

function LeadsIllustrations() {
  return (
    <>
      {/* Illustration 1: Lead List with Filters */}
      <IllustrationFrame caption="The leads page shows all your prospects with powerful filtering">
        <div style={{ position: 'relative' }}>
          <Callout n={1} x="0%" y="-2px" />
          <Callout n={2} x="75%" y="-2px" />
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', fontSize: 10, color: 'var(--ept-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                🔍 <span>Search leads...</span>
              </div>
              <MockBtn small>Status ▾</MockBtn>
              <MockBtn small>Source ▾</MockBtn>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <MockBtn accent>+ Add Lead</MockBtn>
              <MockBtn>📤 Import CSV</MockBtn>
            </div>
          </div>
          {/* Lead table */}
          <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px', gap: 0, padding: '6px 10px', backgroundColor: 'var(--ept-surface)', borderBottom: '1px solid var(--ept-border)' }}>
              {['Name', 'Phone', 'Status', 'Source', 'Actions'].map(h => (
                <span key={h} style={{ fontSize: 9, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {[
              { name: 'Sarah Mitchell', phone: '(432) 555-0142', status: 'Qualified', source: 'CSV Import', sColor: '#22c55e' },
              { name: 'James Rodriguez', phone: '(915) 555-0198', status: 'New', source: 'Manual', sColor: '#3b82f6' },
              { name: 'Emily Chen', phone: '(214) 555-0267', status: 'Contacted', source: 'CSV Import', sColor: '#f59e0b' },
              { name: 'Mike O\'Brien', phone: '(806) 555-0331', status: 'Appointment Set', source: 'Inbound', sColor: '#a855f7' },
            ].map((lead, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px', gap: 0, padding: '8px 10px', borderBottom: i < 3 ? '1px solid var(--ept-border)' : 'none', backgroundColor: i === 0 ? 'rgba(20,184,166,0.04)' : 'transparent' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text)' }}>{lead.name}</span>
                <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', fontFamily: 'monospace' }}>{lead.phone}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: lead.sColor, backgroundColor: `${lead.sColor}15`, padding: '2px 6px', borderRadius: 4, display: 'inline-block', width: 'fit-content' }}>{lead.status}</span>
                <span style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>{lead.source}</span>
                <span style={{ fontSize: 9, color: 'var(--ept-accent)', fontWeight: 600 }}>View →</span>
              </div>
            ))}
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 2: Lead Detail Panel with Call Button */}
      <IllustrationFrame caption="Click any lead to expand details — use 'Call with AI Agent' to start an AI call instantly">
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Callout n={3} x="52%" y="38%" color="#22c55e" />
          {/* Left: Lead info */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 6 }}>Sarah Mitchell</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Phone', value: '(432) 555-0142' },
                { label: 'Email', value: 'sarah.m@example.com' },
                { label: 'Company', value: 'Mitchell Consulting' },
                { label: 'Status', value: 'Qualified' },
                { label: 'Source', value: 'CSV Import' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', width: 60, flexShrink: 0, fontWeight: 600 }}>{f.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--ept-text)' }}>{f.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <MockBtn small>✏️ Edit</MockBtn>
              <MockBtn small>🚫 DNC</MockBtn>
            </div>
          </div>
          {/* Right: Call with AI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📞</div>
              <div style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: 'var(--ept-accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-block', cursor: 'pointer' }}>
                Call with AI Agent
              </div>
              <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 6, lineHeight: 1.4 }}>
                AI will call this lead using your<br />selected script and voice preset
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 2 }}>Call History</div>
            <div style={{ padding: '6px 8px', borderRadius: 6, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', fontSize: 9, color: 'var(--ept-text-muted)' }}>
              Feb 28 — Qualified, follow-up scheduled
            </div>
            <div style={{ padding: '6px 8px', borderRadius: 6, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', fontSize: 9, color: 'var(--ept-text-muted)' }}>
              Feb 25 — First contact, showed interest
            </div>
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 3: CSV Import */}
      <IllustrationFrame caption="Import leads in bulk via CSV — map your columns to Closer fields">
        <div style={{ position: 'relative', textAlign: 'center', padding: '10px 0' }}>
          <Callout n={4} x="38%" y="-4px" />
          <div style={{ border: '2px dashed var(--ept-border)', borderRadius: 12, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ept-text)' }}>Drag your CSV file here or click to browse</div>
            <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', marginTop: 4 }}>Columns: first_name, last_name, phone, email, company, source</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <MockBtn accent>Upload & Import</MockBtn>
            <MockBtn>Download Template</MockBtn>
          </div>
        </div>
      </IllustrationFrame>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3: CALLING / LIVE CALLS ILLUSTRATIONS
// ══════════════════════════════════════════════════════════════════════════════

function CallingIllustrations() {
  return (
    <>
      {/* Illustration 1: Live Call Monitor */}
      <IllustrationFrame caption="Monitor active AI calls in real-time — see transcripts, sentiment, and controls">
        <div style={{ position: 'relative' }}>
          <Callout n={1} x="0%" y="-2px" />
          <div style={{ padding: 12, borderRadius: 8, border: '2px solid #22c55e', backgroundColor: 'rgba(34,197,94,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ept-text)' }}>Active Call — Sarah Mitchell</span>
                <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>02:34</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <MockBtn small>🔇 Mute AI</MockBtn>
                <MockBtn small>🎯 Takeover</MockBtn>
                <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700, backgroundColor: '#ef4444', color: '#fff' }}>End Call</span>
              </div>
            </div>
            {/* Transcript */}
            <div style={{ borderRadius: 6, backgroundColor: 'var(--ept-surface)', padding: 8, maxHeight: 90, overflow: 'hidden' }}>
              <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', fontWeight: 600, marginBottom: 4 }}>Live Transcript</div>
              {[
                { speaker: 'AI', text: 'Hi Sarah, this is Alex from Echo Prime. How are you today?', color: 'var(--ept-accent)' },
                { speaker: 'Sarah', text: "I'm doing well, thanks. What's this about?", color: '#a855f7' },
                { speaker: 'AI', text: "Great to hear! I'm reaching out because we help businesses like yours automate their sales outreach...", color: 'var(--ept-accent)' },
              ].map((line, i) => (
                <div key={i} style={{ marginBottom: 4, fontSize: 10, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700, color: line.color }}>{line.speaker}: </span>
                  <span style={{ color: 'var(--ept-text-secondary)' }}>{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 2: Whisper Coaching */}
      <IllustrationFrame caption="Send real-time whisper messages to coach the AI mid-call — the prospect can't hear you">
        <div style={{ position: 'relative' }}>
          <Callout n={2} x="0%" y="50%" color="#f59e0b" />
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>💬 Whisper to AI (prospect cannot hear)</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ept-accent)', backgroundColor: 'var(--ept-bg)', fontSize: 10, color: 'var(--ept-text)', fontStyle: 'italic' }}>
                Ask about their current vendor and contract end date
              </div>
              <MockBtn accent>Send</MockBtn>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {['Ask about budget', 'Mention free trial', 'Book appointment now', 'Handle price objection'].map(q => (
                <span key={q} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 8, fontWeight: 600, backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', cursor: 'pointer' }}>{q}</span>
              ))}
            </div>
          </div>
        </div>
      </IllustrationFrame>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4: CAMPAIGNS ILLUSTRATIONS
// ══════════════════════════════════════════════════════════════════════════════

function CampaignsIllustrations() {
  return (
    <>
      {/* Illustration 1: Campaign Cards */}
      <IllustrationFrame caption="Each campaign shows its status, lead count, and conversion metrics at a glance">
        <div style={{ position: 'relative' }}>
          <Callout n={1} x="85%" y="-4px" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ept-text)' }}>Your Campaigns</div>
            <MockBtn accent>+ New Campaign</MockBtn>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { name: 'Q1 Insurance Outreach', status: 'Active', leads: 1240, called: 890, appts: 47, color: '#22c55e' },
              { name: 'Solar Panel Promo', status: 'Paused', leads: 500, called: 320, appts: 18, color: '#f59e0b' },
            ].map((c, i) => (
              <MockCard key={i} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ept-text)' }}>{c.name}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: c.color, backgroundColor: `${c.color}15`, padding: '2px 6px', borderRadius: 4 }}>{c.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <div><div style={{ fontSize: 8, color: 'var(--ept-text-muted)' }}>Leads</div><div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ept-text)' }}>{c.leads}</div></div>
                  <div><div style={{ fontSize: 8, color: 'var(--ept-text-muted)' }}>Called</div><div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ept-text)' }}>{c.called}</div></div>
                  <div><div style={{ fontSize: 8, color: 'var(--ept-text-muted)' }}>Appts</div><div style={{ fontSize: 14, fontWeight: 800, color: '#22c55e' }}>{c.appts}</div></div>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                  <MockBtn small accent>Assign Leads</MockBtn>
                  <MockBtn small>Edit</MockBtn>
                  <MockBtn small>Stats</MockBtn>
                </div>
              </MockCard>
            ))}
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 2: Create Campaign Form */}
      <IllustrationFrame caption="Set up a new campaign — choose a name, script, schedule, and daily call limit">
        <div style={{ position: 'relative', maxWidth: 340, margin: '0 auto' }}>
          <Callout n={2} x="-4%" y="-2px" />
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 10 }}>Create New Campaign</div>
          {[
            { label: 'Campaign Name', placeholder: 'e.g. Q1 Insurance Outreach' },
            { label: 'Sales Script', placeholder: 'Select a script...' },
            { label: 'Daily Call Limit', placeholder: '200' },
            { label: 'Calling Hours', placeholder: '9:00 AM — 5:00 PM CST' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', marginBottom: 3, letterSpacing: '0.05em' }}>{f.label}</div>
              <div style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 10, color: 'var(--ept-text-muted)' }}>{f.placeholder}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}>
            <MockBtn>Cancel</MockBtn>
            <MockBtn accent>Create Campaign</MockBtn>
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 3: Assign Leads Modal */}
      <IllustrationFrame caption="Assign leads to campaigns — search, filter, select individually or all at once">
        <div style={{ position: 'relative' }}>
          <Callout n={3} x="0%" y="-2px" color="#3b82f6" />
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 6 }}>Assign Leads to: Q1 Insurance Outreach</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', fontSize: 10, color: 'var(--ept-text-muted)', flex: 1, maxWidth: 200 }}>🔍 Search leads...</div>
            <MockBtn small>Select All (47)</MockBtn>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Sarah Mitchell — (432) 555-0142 — Qualified', 'James Rodriguez — (915) 555-0198 — New', 'Emily Chen — (214) 555-0267 — New'].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, backgroundColor: i < 2 ? 'rgba(20,184,166,0.06)' : 'transparent', border: '1px solid var(--ept-border)' }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${i < 2 ? 'var(--ept-accent)' : 'var(--ept-border)'}`, backgroundColor: i < 2 ? 'var(--ept-accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i < 2 && <span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }}>✓</span>}
                </div>
                <span style={{ fontSize: 10, color: 'var(--ept-text)' }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}>
            <span style={{ fontSize: 10, color: 'var(--ept-accent)', fontWeight: 700, marginRight: 'auto' }}>2 leads selected</span>
            <MockBtn>Cancel</MockBtn>
            <MockBtn accent>Assign 2 Leads</MockBtn>
          </div>
        </div>
      </IllustrationFrame>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 5: SCRIPTS ILLUSTRATIONS
// ══════════════════════════════════════════════════════════════════════════════

function ScriptsIllustrations() {
  return (
    <>
      {/* Illustration 1: Visual Script Builder */}
      <IllustrationFrame caption="Build conversation flows visually — no coding required. Each step is a phase of the call.">
        <div style={{ position: 'relative' }}>
          <Callout n={1} x="0%" y="-2px" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ept-text)' }}>Insurance Outbound Script</div>
              <div style={{ fontSize: 9, color: 'var(--ept-text-muted)' }}>Personality: Friendly Professional</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <MockBtn>Use Template</MockBtn>
              <MockBtn accent>Save Script</MockBtn>
            </div>
          </div>

          {/* Steps accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { name: 'Greeting', expanded: true, prompt: 'Introduce yourself warmly. Ask how they are doing today. Build rapport before moving to business.' },
              { name: 'Consent Check', expanded: false, prompt: '' },
              { name: 'Discovery', expanded: false, prompt: '' },
              { name: 'Qualification', expanded: false, prompt: '' },
              { name: 'Booking', expanded: false, prompt: '' },
            ].map((step, i) => (
              <div key={i} style={{ borderRadius: 8, border: '1px solid var(--ept-border)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', backgroundColor: i === 0 ? 'rgba(20,184,166,0.04)' : 'var(--ept-surface)' }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--ept-accent)', width: 18 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ept-text)', flex: 1 }}>{step.name}</span>
                  <span style={{ fontSize: 9, color: 'var(--ept-text-muted)' }}>{step.expanded ? '▼' : '▶'}</span>
                </div>
                {step.expanded && (
                  <div style={{ padding: '8px 10px', borderTop: '1px solid var(--ept-border)' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ept-text-muted)', marginBottom: 4 }}>AI INSTRUCTIONS</div>
                    <div style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-bg)', fontSize: 10, color: 'var(--ept-text-secondary)', lineHeight: 1.4, minHeight: 36 }}>
                      {step.prompt}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 9, fontWeight: 700, color: 'var(--ept-text-muted)' }}>TRANSITIONS</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <span style={{ fontSize: 9, color: 'var(--ept-text-muted)' }}>IF</span>
                      <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>prospect agrees to continue</span>
                      <span style={{ fontSize: 9, color: 'var(--ept-text-muted)' }}>→ GO TO</span>
                      <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, backgroundColor: 'rgba(20,184,166,0.1)', color: 'var(--ept-accent)', fontWeight: 700 }}>Consent Check</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 2: Personality Presets */}
      <IllustrationFrame caption="Choose a personality preset or create a custom persona for your AI agent">
        <div style={{ position: 'relative' }}>
          <Callout n={2} x="0%" y="-2px" color="#ec4899" />
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>AI Personality</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { name: 'Friendly Professional', emoji: '😊', selected: true },
              { name: 'Consultative Expert', emoji: '🧠', selected: false },
              { name: 'High-Energy Closer', emoji: '🔥', selected: false },
              { name: 'Custom', emoji: '✏️', selected: false },
            ].map((p, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 8, border: p.selected ? '2px solid var(--ept-accent)' : '1px solid var(--ept-border)', backgroundColor: p.selected ? 'rgba(20,184,166,0.06)' : 'var(--ept-surface)', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{p.emoji}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: p.selected ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </IllustrationFrame>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 6: SETTINGS ILLUSTRATIONS
// ══════════════════════════════════════════════════════════════════════════════

function SettingsIllustrations() {
  return (
    <>
      {/* Illustration 1: Voice Selection */}
      <IllustrationFrame caption="Select your AI voice from 8 presets — click Preview to hear each one before choosing">
        <div style={{ position: 'relative' }}>
          <Callout n={1} x="0%" y="-2px" />
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Voice Presets</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {[
              { name: 'Professional Male', sel: true },
              { name: 'Professional Female', sel: false },
              { name: 'Warm Male', sel: false },
              { name: 'Warm Female', sel: false },
            ].map((v, i) => (
              <div key={i} style={{ padding: 8, borderRadius: 8, border: v.sel ? '2px solid var(--ept-accent)' : '1px solid var(--ept-border)', backgroundColor: v.sel ? 'rgba(20,184,166,0.06)' : 'var(--ept-surface)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>{v.name}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>▶ Preview</span>
                  {!v.sel && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Select</span>}
                  {v.sel && <span style={{ fontSize: 8, color: 'var(--ept-accent)', fontWeight: 700 }}>✓ Active</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 2: Caller ID + Business Hours */}
      <IllustrationFrame caption="Set your caller ID display name and configure business hours per day">
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Callout n={2} x="0%" y="-2px" color="#3b82f6" />
          <Callout n={3} x="52%" y="-2px" color="#f59e0b" />
          {/* Caller ID */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>Caller ID Display</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--ept-accent)', backgroundColor: 'var(--ept-bg)', fontSize: 10, color: 'var(--ept-text)' }}>
                Echo Prime Sales
              </div>
              <MockBtn accent small>Save</MockBtn>
            </div>
            <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 4 }}>This name appears on the prospect&apos;s phone when your AI calls</div>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)' }}>Max Call Duration</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--ept-accent)' }}>15 min</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: 'var(--ept-border)', position: 'relative' }}>
                <div style={{ width: '50%', height: '100%', borderRadius: 2, backgroundColor: 'var(--ept-accent)' }} />
              </div>
            </div>
          </div>
          {/* Business Hours */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>Business Hours</div>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: i < 5 ? '1px solid var(--ept-border)' : 'none' }}>
                <div style={{ width: 20, height: 12, borderRadius: 6, backgroundColor: i < 5 ? 'var(--ept-accent)' : 'var(--ept-border)', position: 'relative' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 1, left: i < 5 ? 9 : 1, transition: 'left 0.2s' }} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: i < 5 ? 'var(--ept-text)' : 'var(--ept-text-muted)', width: 54 }}>{day}</span>
                <span style={{ fontSize: 9, color: i < 5 ? 'var(--ept-text-muted)' : '#ef4444', fontStyle: i < 5 ? 'normal' : 'italic' }}>
                  {i < 5 ? '9:00 — 17:00' : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </IllustrationFrame>

      {/* Illustration 3: Voice Cloning Upload */}
      <IllustrationFrame caption="Upload audio samples to create a custom AI voice clone of yourself or a team member">
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Callout n={4} x="0%" y="-2px" color="#a855f7" />
          <div style={{ border: '2px dashed var(--ept-border)', borderRadius: 12, padding: 16, marginBottom: 10 }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🎙️</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ept-text)' }}>Drag audio files or click to upload</div>
            <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 2 }}>WAV, MP3, M4A — 3-5 files, 30-60 seconds each</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {['recording_sample_1.wav — 1.2 MB', 'recording_sample_2.mp3 — 0.8 MB'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <span style={{ fontSize: 11 }}>🎙️</span>
                <span style={{ fontSize: 10, color: 'var(--ept-text)', flex: 1, textAlign: 'left' }}>{f}</span>
                <span style={{ fontSize: 12, color: '#ef4444', cursor: 'pointer' }}>×</span>
              </div>
            ))}
          </div>
          <MockBtn accent>Submit 2 Samples for Cloning</MockBtn>
        </div>
      </IllustrationFrame>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 7: APPOINTMENTS ILLUSTRATION
// ══════════════════════════════════════════════════════════════════════════════

function AppointmentsIllustrations() {
  return (
    <IllustrationFrame caption="View all booked appointments — each links back to the lead's full profile and call history">
      <div style={{ position: 'relative' }}>
        <Callout n={1} x="0%" y="-2px" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ept-text)' }}>Upcoming Appointments</div>
          <MockBtn accent>+ Book Manual</MockBtn>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'Sarah Mitchell', date: 'Mar 5, 2026', time: '10:00 AM', type: 'Discovery Call', interest: 'High' },
            { name: 'Mike O\'Brien', date: 'Mar 5, 2026', time: '2:30 PM', type: 'Follow-Up', interest: 'Medium' },
            { name: 'Lisa Park', date: 'Mar 6, 2026', time: '11:00 AM', type: 'Demo', interest: 'High' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>📅</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ept-text)' }}>{a.name}</div>
                <div style={{ fontSize: 9, color: 'var(--ept-text-muted)' }}>{a.date} at {a.time} — {a.type}</div>
              </div>
              <span style={{ fontSize: 8, fontWeight: 700, color: a.interest === 'High' ? '#22c55e' : '#f59e0b', backgroundColor: a.interest === 'High' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>{a.interest}</span>
              <MockBtn small>View Lead</MockBtn>
            </div>
          ))}
        </div>
      </div>
    </IllustrationFrame>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 8: ANALYTICS ILLUSTRATION
// ══════════════════════════════════════════════════════════════════════════════

function AnalyticsIllustrations() {
  return (
    <IllustrationFrame caption="Track every metric — cost per call, conversion rates, and ROI vs human SDRs">
      <div style={{ position: 'relative' }}>
        <Callout n={1} x="0%" y="-2px" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Cost / Call', value: '$0.28' },
            { label: 'Cost / Appt', value: '$12.40' },
            { label: 'Conversion', value: '5.3%' },
            { label: 'Monthly Savings', value: '$3,740' },
          ].map((m, i) => (
            <MockCard key={i}>
              <div style={{ fontSize: 8, color: 'var(--ept-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: i === 3 ? '#22c55e' : 'var(--ept-text)' }}>{m.value}</div>
            </MockCard>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <MockCard>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>Conversion Funnel</div>
            {[
              { label: 'Leads Loaded', n: 1240, pct: 100 },
              { label: 'Calls Made', n: 890, pct: 72 },
              { label: 'Connected', n: 534, pct: 43 },
              { label: 'Qualified', n: 156, pct: 13 },
              { label: 'Appointments', n: 47, pct: 4 },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--ept-text-muted)', marginBottom: 1 }}>
                  <span>{f.label}</span><span>{f.n} ({f.pct}%)</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, backgroundColor: 'var(--ept-border)' }}>
                  <div style={{ width: `${f.pct}%`, height: '100%', borderRadius: 2, backgroundColor: 'var(--ept-accent)' }} />
                </div>
              </div>
            ))}
          </MockCard>
          <MockCard>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>AI vs Human SDR</div>
            {[
              { metric: 'Calls / Day', ai: '500+', human: '60-80' },
              { metric: 'Cost / Month', ai: '$400', human: '$4,000+' },
              { metric: 'Available Hours', ai: '24/7', human: '8hrs/day' },
              { metric: 'Consistency', ai: '100%', human: 'Variable' },
              { metric: 'Setup Time', ai: '30 min', human: '2 weeks' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, padding: '3px 0', borderBottom: i < 4 ? '1px solid var(--ept-border)' : 'none' }}>
                <span style={{ fontSize: 8, color: 'var(--ept-text-muted)', fontWeight: 600 }}>{r.metric}</span>
                <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>{r.ai}</span>
                <span style={{ fontSize: 8, color: 'var(--ept-text-muted)' }}>{r.human}</span>
              </div>
            ))}
          </MockCard>
        </div>
      </div>
    </IllustrationFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TUTORIAL SECTIONS DATA
   ══════════════════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  {
    id: 'dashboard',
    number: '01',
    title: 'Your Command Center',
    subtitle: 'The Dashboard',
    color: '#14b8a6',
    intro: 'When you log in, the dashboard shows a real-time snapshot of your sales operation. Four KPI cards across the top track leads, calls, appointments, and daily spend — all updating live.',
    Illustrations: DashboardIllustrations,
    steps: [
      'Check your 4 KPI cards at the top — green means you\'re above daily targets. Click any card to drill into details.',
      'Watch the activity feed on the right — it shows every call event in real-time (completed, in progress, voicemail, etc.).',
      'Use the weekly chart to spot calling patterns. If certain days perform better, adjust your campaign schedules to match.',
    ],
    tip: 'Set daily targets in Settings → Calling. The dashboard turns metrics green/red so you can see at a glance if your AI is on track.',
  },
  {
    id: 'leads',
    number: '02',
    title: 'Building Your Pipeline',
    subtitle: 'Lead Management',
    color: '#3b82f6',
    intro: 'Every prospect lives in your lead pipeline. Import them via CSV, add manually, or let your AI capture them from inbound calls. Each lead carries a full history of every interaction.',
    Illustrations: LeadsIllustrations,
    steps: [
      'Use the filter bar to narrow leads by status (New, Contacted, Qualified, etc.) or search by name/phone.',
      'Click "+ Add Lead" to manually create a lead, or "Import CSV" to upload a spreadsheet with hundreds of leads at once.',
      'Click any lead row to expand the detail panel — you\'ll see all their info, call history, and the "Call with AI Agent" button.',
      'Use the CSV import to bulk-upload leads. Download the template first to see the expected column format: first_name, last_name, phone, email, company, source.',
    ],
    tip: 'The AI automatically updates lead status after every call — New → Contacted → Qualified → Appointment Set. You can manually override any status.',
  },
  {
    id: 'calling',
    number: '03',
    title: 'AI-Powered Calling',
    subtitle: 'Live Calls & Monitoring',
    color: '#22c55e',
    intro: 'Your AI agent calls with a voice so natural that prospects can\'t tell it\'s AI. You can monitor every call live, whisper suggestions, or take over the conversation with one click.',
    Illustrations: CallingIllustrations,
    steps: [
      'Go to the Live Calls tab to see all active calls. Each shows the lead name, call duration, live transcript, and sentiment detection.',
      'Use the Whisper feature to send real-time coaching messages to the AI mid-call — the prospect cannot hear your whispers. Use the quick-send buttons for common instructions like "ask about budget" or "book appointment now."',
      'Click "Takeover" to seamlessly switch from AI to your own voice mid-call. The prospect won\'t notice the transition.',
      'After every call, the AI generates a summary with next steps. All calls are recorded and fully transcribed for review.',
    ],
    tip: 'Start by monitoring a few calls to see how the AI handles conversations. Use whisper coaching to refine its approach — it learns from your guidance.',
  },
  {
    id: 'campaigns',
    number: '04',
    title: 'Scale Your Outreach',
    subtitle: 'Campaign Management',
    color: '#a855f7',
    intro: 'Organize outreach into campaigns. Each has its own lead list, calling script, schedule, and metrics. Run multiple campaigns simultaneously.',
    Illustrations: CampaignsIllustrations,
    steps: [
      'Click "+ New Campaign" to create one. Give it a name, select a script, set daily call limits, and define calling hours.',
      'After creating, use "Assign Leads" to add leads from your pipeline. You can search, filter, select all, or pick individually.',
      'Monitor each campaign\'s stats — total leads, calls made, appointments booked, and conversion rate. Pause or resume any campaign instantly.',
      'A/B test scripts by creating two campaigns with the same leads but different scripts. Compare conversion rates after 100+ calls to see which performs better.',
    ],
    tip: 'Start small with a test campaign of 50-100 leads. Once your conversion rate looks good, scale up to thousands.',
  },
  {
    id: 'scripts',
    number: '05',
    title: 'Craft the Perfect Pitch',
    subtitle: 'Script Builder',
    color: '#ec4899',
    intro: 'The visual script builder lets you define each phase of the call — greeting, discovery, qualification, objection handling, and booking — all without writing any code.',
    Illustrations: ScriptsIllustrations,
    steps: [
      'Click "+ New Script" and choose a personality preset (Friendly Professional, Consultative Expert, High-Energy Closer, or Custom).',
      'Click "Use Default Template" to start with 7 pre-built conversation steps, then customize the AI instructions for each step.',
      'For each step, write natural-language instructions telling the AI what to say and how to behave. Example: "Ask about their current situation. Listen carefully and identify pain points."',
      'Set up transitions — IF/GO TO rules that tell the AI when to move to the next step. Example: IF "prospect agrees to continue" → GO TO "Discovery".',
      'Reorder steps with the up/down arrows, add new steps, or remove unnecessary ones. The AI follows steps in order unless a transition redirects it.',
    ],
    tip: 'Write instructions like you\'re coaching a human sales rep — "Be warm and genuine. Don\'t rush. If they mention a competitor, ask what they like and don\'t like about it."',
  },
  {
    id: 'appointments',
    number: '06',
    title: 'Never Miss a Meeting',
    subtitle: 'Appointments',
    color: '#f59e0b',
    intro: 'When the AI qualifies a lead, it books an appointment directly on your calendar. You control availability — the AI checks your schedule in real-time before confirming any slot.',
    Illustrations: AppointmentsIllustrations,
    steps: [
      'Set your available hours in Settings → Calling → Business Hours. Toggle each day on/off and set start/end times.',
      'View all booked appointments in the Appointments tab. Each shows the lead name, date/time, type, and interest level.',
      'Click "View Lead" on any appointment to see the full lead profile, call recordings, and transcript from the booking call.',
      'Use "Book Manual" to manually add appointments for leads you\'ve spoken with outside the platform.',
    ],
    tip: 'The AI checks 3 layers before booking: your weekly schedule, any blackout dates, and existing appointments. No double-booking ever.',
  },
  {
    id: 'analytics',
    number: '07',
    title: 'Measure Everything',
    subtitle: 'Analytics & ROI',
    color: '#10b981',
    intro: 'Track every dollar and every conversion. See cost per call, cost per appointment, conversion rates by campaign, and total ROI compared to human SDRs.',
    Illustrations: AnalyticsIllustrations,
    steps: [
      'The 4 top-level metrics show your most important numbers at a glance — cost per call, cost per appointment, overall conversion rate, and monthly savings vs hiring.',
      'The conversion funnel shows exactly where leads drop off: loaded → called → connected → qualified → booked. Optimize the stages with the lowest conversion.',
      'The AI vs Human SDR comparison shows hard numbers — your AI makes 500+ calls/day at $400/mo vs a human doing 60-80 calls at $4,000+/mo.',
      'Export reports as CSV for your team, investors, or clients. Use the date range picker to analyze specific time periods.',
    ],
    tip: 'The cost comparison report is your best sales tool. Show prospects exactly how much they save with AI vs hiring another rep.',
  },
  {
    id: 'settings',
    number: '08',
    title: 'Make It Yours',
    subtitle: 'Settings & Configuration',
    color: '#6366f1',
    intro: 'Configure every aspect of your AI agent — business info, voice selection, caller ID, business hours, integrations, and compliance settings.',
    Illustrations: SettingsIllustrations,
    steps: [
      'Go to the Voice tab and click "Preview" on any of the 8 voice presets to hear a sample. Click "Select" to choose the voice your AI will use on calls.',
      'Set your Caller ID display name — this is what appears on the prospect\'s phone. Click "Edit" next to the current name, type your business name, and click "Save."',
      'Configure Business Hours — toggle each day on/off and set the time window. The AI will only make calls during these hours in the selected timezone.',
      'To clone your own voice, go to the Voice tab, scroll to "Custom Voice Cloning," and drag in 3-5 audio recordings of yourself speaking (30-60 seconds each, WAV/MP3/M4A).',
    ],
    tip: 'Configure business hours and timezone FIRST — this ensures the AI only calls prospects during appropriate local hours. Nothing kills a lead faster than a 6 AM call.',
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN TUTORIAL PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export default function CloserTutorialPage() {
  const theme = useTheme();
  const isDark = theme?.isDark ?? false;
  const [activeSection, setActiveSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleExpand = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ── Top Nav ── */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/closer" className="flex items-center gap-2">
            <img src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={28} height={28} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
            <span className="font-bold text-sm" style={{ color: 'var(--ept-text)' }}>Closer</span>
          </Link>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(20,184,166,0.12)', color: '#14b8a6' }}>TUTORIAL</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/closer/demo" className="px-4 py-2 rounded-xl text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Try Live Demo</Link>
          <Link href="/closer" className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Get Started</Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 animate-fade-up" style={{ color: 'var(--ept-text)' }}>
          The Complete Guide to Your{' '}<span className="gradient-text">AI Sales Agent</span>
        </h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 animate-fade-up" style={{ color: 'var(--ept-text-secondary)', animationDelay: '100ms' }}>
          Step-by-step visual walkthroughs for every page in the platform.
          Set up, configure, and start closing in under 30 minutes.
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-1 max-w-xl mx-auto mb-2">
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => { setActiveSection(i); if (!expandedSections.has(i)) toggleExpand(i); }} className="flex-1 h-1.5 rounded-full transition-all duration-300" style={{ backgroundColor: i <= activeSection ? s.color : isDark ? '#1e293b' : '#e2e8f0', opacity: i === activeSection ? 1 : i < activeSection ? 0.5 : 0.3 }} title={s.title} />
          ))}
        </div>
        <p className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>Section {activeSection + 1} of {SECTIONS.length}</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {/* ── Section Navigation Chips ── */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => { setActiveSection(i); if (!expandedSections.has(i)) toggleExpand(i); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border"
              style={{ backgroundColor: i === activeSection ? `${s.color}15` : 'transparent', borderColor: i === activeSection ? `${s.color}40` : 'var(--ept-border)', color: i === activeSection ? s.color : 'var(--ept-text-muted)' }}>
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: i === activeSection ? s.color : 'var(--ept-surface)', color: i === activeSection ? '#fff' : 'var(--ept-text-muted)' }}>{s.number}</span>
              <span className="hidden sm:inline">{s.subtitle}</span>
            </button>
          ))}
        </div>

        {/* ── All Sections (accordion style) ── */}
        <div className="space-y-4">
          {SECTIONS.map((s, i) => {
            const isExpanded = expandedSections.has(i);
            const isActive = i === activeSection;
            const Illus = s.Illustrations;

            return (
              <div key={s.id} id={`section-${s.id}`} className="rounded-2xl border overflow-hidden transition-all duration-300" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: isActive ? `${s.color}40` : 'var(--ept-card-border)', boxShadow: isActive ? `0 0 30px ${s.color}10` : 'none' }}>
                {/* Header */}
                <button onClick={() => { setActiveSection(i); toggleExpand(i); }} className="w-full flex items-center gap-4 p-6 text-left">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                    <span className="font-extrabold text-sm" style={{ color: s.color }}>{s.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: s.color }}>{s.subtitle}</p>
                    <h2 className="text-lg font-extrabold" style={{ color: 'var(--ept-text)' }}>{s.title}</h2>
                  </div>
                  <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300" style={{ color: 'var(--ept-text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 animate-fade-up" style={{ animationDuration: '300ms' }}>
                    {/* Intro text */}
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{s.intro}</p>

                    {/* ILLUSTRATIONS — the actual visual walkthroughs */}
                    <Illus />

                    {/* Numbered step-by-step instructions linked to callouts */}
                    <div style={{ padding: 16, borderRadius: 12, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 4 }}>How to set it up</div>
                      <StepCalloutList items={s.steps} color={s.color} />
                    </div>

                    {/* Pro Tip */}
                    <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}20` }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke={s.color} viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: s.color }}>Pro Tip</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{s.tip}</p>
                      </div>
                    </div>

                    {/* Next Section Button */}
                    {i < SECTIONS.length - 1 && (
                      <div className="mt-6 flex justify-end">
                        <button onClick={(e) => { e.stopPropagation(); const next = i + 1; setActiveSection(next); if (!expandedSections.has(next)) toggleExpand(next); document.getElementById(`section-${SECTIONS[next].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: SECTIONS[i + 1].color, color: '#fff' }}>
                          Next: {SECTIONS[i + 1].subtitle}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Quick Start Checklist ── */}
        <div className="mt-12 p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Quick Start Checklist</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Get your AI agent making calls in under 30 minutes.</p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { step: 1, task: 'Sign up and create your account', time: '2 min', link: '/signup' },
              { step: 2, task: 'Go to Settings → Business Info and enter your company details', time: '2 min', link: '/closer/settings' },
              { step: 3, task: 'Go to Settings → AI Voice and pick a voice (click Preview to hear them)', time: '3 min', link: '/closer/settings' },
              { step: 4, task: 'Go to Settings → Calling and set your Caller ID, timezone, and business hours', time: '3 min', link: '/closer/settings' },
              { step: 5, task: 'Go to Scripts and create your first calling script (use a template to start)', time: '5 min', link: '/closer/scripts' },
              { step: 6, task: 'Go to Leads and import your lead list via CSV', time: '2 min', link: '/closer/leads' },
              { step: 7, task: 'Go to Campaigns, create a campaign, assign leads, and select your script', time: '3 min', link: '/closer/campaigns' },
              { step: 8, task: 'Test with a call to yourself, then launch the campaign', time: '3 min', link: '/closer/leads' },
            ].map((item) => (
              <Link key={item.step} href={item.link} className="flex items-center gap-3 p-3 rounded-xl border transition-colors" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(20,184,166,0.12)' }}>
                  <span className="text-xs font-bold" style={{ color: '#14b8a6' }}>{item.step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: 'var(--ept-text)' }}>{item.task}</p>
                </div>
                <span className="text-[10px] font-mono flex-shrink-0" style={{ color: 'var(--ept-text-muted)' }}>~{item.time}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-8 p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can prospects tell they\'re talking to an AI?', a: 'No. Our AI uses Cartesia Sonic 3 voice synthesis with natural pauses, filler words, and emotional responses. In blind tests, 94% of people couldn\'t distinguish it from a human.' },
              { q: 'What happens if the AI gets a question it can\'t answer?', a: 'It gracefully redirects the conversation back to qualifying and booking. If the prospect insists, it offers to have a team member follow up. Every unanswered question is logged.' },
              { q: 'Can I listen to calls in real-time?', a: 'Yes. The Live Calls tab lets you monitor any active call. You can whisper suggestions to the AI mid-call, or take over the conversation entirely with one click.' },
              { q: 'How much does it cost per call?', a: 'Typically $0.15-0.50 per call depending on duration. A 2-minute qualifying call costs about $0.30. Compare that to a human SDR at $4,000+/month.' },
              { q: 'Can I use my own phone number?', a: 'Yes. You can port your existing business number or we\'ll provision a new one in your area code. Caller ID shows your business name.' },
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-8 p-8 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Ready to <span className="gradient-text">Get Started</span>?</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Your AI sales agent is 30 minutes away from making its first call. No contracts, cancel anytime.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/closer/demo" className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Try Live Demo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
            </Link>
            <Link href="/closer" className="flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-colors" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Start Free Trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
