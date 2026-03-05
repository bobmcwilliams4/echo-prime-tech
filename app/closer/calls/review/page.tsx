'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import { getCall, getCallEvents } from '../../../../lib/closer-api';

/* ─── Types ─── */
interface CallDetail {
  id: string;
  lead_id: string;
  lead_name?: string;
  lead_phone?: string;
  direction: 'inbound' | 'outbound';
  status: string;
  duration_seconds?: number;
  recording_url?: string;
  transcript?: string;
  sentiment?: string;
  summary?: string;
  script_id?: string;
  campaign_id?: string;
  outcome?: string;
  notes?: string;
  created_at: string;
  ended_at?: string;
}

interface CallEvent {
  id: string;
  type: string;
  timestamp: string;
  data?: Record<string, unknown>;
  speaker?: string;
  text?: string;
}

/* ─── Helpers ─── */
function formatDuration(seconds?: number): string {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function sentimentColor(s?: string): string {
  if (!s) return 'var(--ept-text-muted)';
  if (s === 'positive') return '#22c55e';
  if (s === 'negative') return '#ef4444';
  return '#f59e0b';
}

function statusBadge(status: string): { bg: string; text: string } {
  switch (status) {
    case 'completed': return { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' };
    case 'in_progress': return { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' };
    case 'failed': return { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' };
    case 'voicemail': return { bg: 'rgba(168,85,247,0.15)', text: '#a855f7' };
    case 'no_answer': return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' };
    default: return { bg: 'rgba(100,116,139,0.15)', text: '#64748b' };
  }
}

/* ─── Inner Component ─── */
function CallReviewInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const callId = searchParams.get('id') || '';

  const [call, setCall] = useState<CallDetail | null>(null);
  const [events, setEvents] = useState<CallEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transcript' | 'events' | 'notes'>('transcript');

  const loadCall = useCallback(async () => {
    if (!callId) return;
    setLoading(true);
    try {
      const [callData, eventsData] = await Promise.all([
        getCall(callId),
        getCallEvents(callId).catch(() => ({ events: [] })),
      ]);
      setCall(callData);
      setEvents(eventsData?.events || eventsData || []);
    } catch {
      /* call not found */
    } finally {
      setLoading(false);
    }
  }, [callId]);

  useEffect(() => {
    if (!authLoading && user) loadCall();
  }, [authLoading, user, loadCall]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!callId || !call) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-lg" style={{ color: 'var(--ept-text-secondary)' }}>Call not found</p>
        <button onClick={() => router.push('/closer/calls')} className="mt-4 px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          Back to Calls
        </button>
      </div>
    );
  }

  const badge = statusBadge(call.status);
  const transcriptLines = (call.transcript || '').split('\n').filter(Boolean);

  const TABS: { id: typeof activeTab; label: string }[] = [
    { id: 'transcript', label: 'Transcript' },
    { id: 'events', label: 'Events' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/closer/calls')} className="p-2 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
          &#8592;
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Call Review</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            {call.direction === 'outbound' ? 'Outbound' : 'Inbound'} &middot; {formatDate(call.created_at)}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: badge.bg, color: badge.text }}>
          {call.status.replace(/_/g, ' ').toUpperCase()}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Lead', value: call.lead_name || call.lead_id || '—' },
          { label: 'Phone', value: call.lead_phone || '—' },
          { label: 'Duration', value: formatDuration(call.duration_seconds) },
          { label: 'Sentiment', value: call.sentiment ? call.sentiment.charAt(0).toUpperCase() + call.sentiment.slice(1) : '—', color: sentimentColor(call.sentiment) },
        ].map((c) => (
          <div key={c.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>{c.label}</p>
            <p className="text-lg font-bold" style={{ color: c.color || 'var(--ept-text)' }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      {call.summary && (
        <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--ept-text-muted)' }}>AI Summary</h3>
          <p className="leading-relaxed" style={{ color: 'var(--ept-text)' }}>{call.summary}</p>
        </div>
      )}

      {/* Outcome */}
      {call.outcome && (
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Outcome</h3>
          <p className="font-medium" style={{ color: 'var(--ept-accent)' }}>{call.outcome}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--ept-card-bg)' : 'transparent',
              color: activeTab === tab.id ? 'var(--ept-text)' : 'var(--ept-text-muted)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        {activeTab === 'transcript' && (
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {transcriptLines.length === 0 ? (
              <p className="text-center py-12" style={{ color: 'var(--ept-text-muted)' }}>No transcript available</p>
            ) : (
              transcriptLines.map((line, i) => {
                const isAgent = line.toLowerCase().startsWith('agent:') || line.toLowerCase().startsWith('ai:');
                const isSystem = line.toLowerCase().startsWith('[');
                return (
                  <div key={i} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[75%] px-4 py-3 rounded-2xl text-sm"
                      style={{
                        backgroundColor: isSystem ? 'var(--ept-surface)' : isAgent ? 'var(--ept-accent)' : 'var(--ept-surface)',
                        color: isAgent ? '#fff' : isSystem ? 'var(--ept-text-muted)' : 'var(--ept-text)',
                      }}
                    >
                      {line}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-center py-12" style={{ color: 'var(--ept-text-muted)' }}>No events recorded</p>
            ) : (
              events.map((ev, i) => (
                <div key={ev.id || i} className="flex items-start gap-3 py-2 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--ept-accent)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{ev.type}</span>
                      <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {ev.text && <p className="text-sm mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{ev.text}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="p-6">
            <p className="leading-relaxed" style={{ color: call.notes ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>
              {call.notes || 'No notes for this call.'}
            </p>
          </div>
        )}
      </div>

      {/* Recording Player */}
      {call.recording_url && (
        <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--ept-text-muted)' }}>Recording</h3>
          <audio controls className="w-full" src={call.recording_url}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

/* ─── Page Wrapper (Suspense for useSearchParams) ─── */
export default function CallReviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <CallReviewInner />
    </Suspense>
  );
}
