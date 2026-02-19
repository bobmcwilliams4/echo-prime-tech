'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getCalls, getCall, getCallEvents } from '../../../lib/closer-api';

/* ─── Types ─── */
interface CallEvent {
  id: string;
  call_id: string;
  event_type: string;
  speaker: string;
  content: string;
  timestamp: string;
  latency_ms?: number;
}

interface CallRecord {
  id: string;
  lead_id: string;
  lead_name?: string;
  lead_phone?: string;
  campaign_id?: string;
  campaign_name?: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'in_progress' | 'failed' | 'no_answer' | 'busy' | 'voicemail';
  disposition?: string;
  sentiment?: string;
  duration_seconds?: number;
  transcript_summary?: string;
  coaching_notes?: string;
  cost_total?: number;
  cost_twilio?: number;
  cost_stt?: number;
  cost_llm?: number;
  cost_tts?: number;
  recording_url?: string;
  created_at: string;
  ended_at?: string;
}

/* ─── Constants ─── */
const STATUS_COLORS: Record<string, string> = {
  completed: '#10b981',
  in_progress: '#3b82f6',
  failed: '#ef4444',
  no_answer: '#6b7280',
  busy: '#f59e0b',
  voicemail: '#8b5cf6',
};

const DISPOSITION_COLORS: Record<string, string> = {
  appointment_booked: '#10b981',
  interested: '#3b82f6',
  callback: '#f59e0b',
  not_interested: '#6b7280',
};

const DIRECTION_OPTIONS = [
  { value: 'all', label: 'All Directions' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'failed', label: 'Failed' },
  { value: 'no_answer', label: 'No Answer' },
  { value: 'busy', label: 'Busy' },
  { value: 'voicemail', label: 'Voicemail' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

/* ─── Formatting Helpers ─── */
function formatDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(Math.floor(s)).padStart(2, '0')}`;
}

function formatCost(amount?: number): string {
  if (amount === undefined || amount === null) return '$0.00';
  return `$${amount.toFixed(2)}`;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  if (isNaN(then)) return dateStr;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: days > 365 ? 'numeric' : undefined,
  });
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDispositionLabel(disposition: string): string {
  return disposition.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDateRangeStart(range: string): string | undefined {
  const now = new Date();
  if (range === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return start.toISOString();
  }
  if (range === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return start.toISOString();
  }
  if (range === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return start.toISOString();
  }
  return undefined;
}

/* ─── SVG Icons ─── */
function InboundIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function OutboundIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.2s ease',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        color: 'var(--ept-text-muted)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ept-text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/* ─── Select component (styled) ─── */
function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor: 'var(--ept-surface)',
        color: 'var(--ept-text)',
        border: '1px solid var(--ept-border)',
        borderRadius: 8,
        padding: '6px 28px 6px 10px',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || '#6b7280';
  const isActive = status === 'in_progress';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '3px 8px',
        borderRadius: 6,
        backgroundColor: `${color}18`,
        color: color,
      }}
    >
      {isActive && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: color,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}
      {formatStatusLabel(status)}
    </span>
  );
}

/* ─── Disposition Badge ─── */
function DispositionBadge({ disposition }: { disposition: string }) {
  const color = DISPOSITION_COLORS[disposition] || '#6b7280';
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '3px 8px',
        borderRadius: 6,
        backgroundColor: `${color}18`,
        color: color,
      }}
    >
      {formatDispositionLabel(disposition)}
    </span>
  );
}

/* ─── Sentiment Indicator ─── */
function SentimentIndicator({ sentiment }: { sentiment: string }) {
  const sentimentConfig: Record<string, { color: string; label: string }> = {
    positive: { color: '#10b981', label: '+' },
    neutral: { color: '#6b7280', label: '~' },
    negative: { color: '#ef4444', label: '-' },
  };
  const config = sentimentConfig[sentiment] || sentimentConfig.neutral;

  return (
    <span
      title={`Sentiment: ${sentiment}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: `${config.color}18`,
        color: config.color,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {config.label}
    </span>
  );
}

/* ─── Expanded Call Detail ─── */
function CallDetail({
  call,
  events,
  eventsLoading,
  eventsError,
}: {
  call: CallRecord;
  events: CallEvent[] | null;
  eventsLoading: boolean;
  eventsError: string | null;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ept-bg-alt)',
        borderTop: '1px solid var(--ept-border)',
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: 20,
      }}
    >
      {/* Left: Transcript */}
      <div>
        <h4
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--ept-text-muted)',
            marginBottom: 10,
          }}
        >
          Transcript
        </h4>

        {eventsLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0' }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid var(--ept-accent)',
                borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span style={{ fontSize: 12, color: 'var(--ept-text-muted)' }}>Loading transcript...</span>
          </div>
        )}

        {eventsError && (
          <div style={{ fontSize: 12, color: '#ef4444', padding: '8px 0' }}>{eventsError}</div>
        )}

        {events && events.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', padding: '8px 0', fontStyle: 'italic' }}>
            No transcript available for this call.
          </div>
        )}

        {events && events.length > 0 && (
          <div
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              paddingRight: 8,
            }}
          >
            {events
              .filter((e) => e.event_type === 'transcript' || e.event_type === 'speech')
              .map((evt) => {
                const isAgent = evt.speaker === 'agent' || evt.speaker === 'assistant';
                return (
                  <div
                    key={evt.id}
                    style={{
                      display: 'flex',
                      gap: 8,
                      padding: '6px 10px',
                      borderRadius: 8,
                      backgroundColor: isAgent ? 'var(--ept-accent-glow)' : 'var(--ept-surface)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: isAgent ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                        minWidth: 40,
                        paddingTop: 2,
                      }}
                    >
                      {isAgent ? 'Agent' : 'Lead'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--ept-text)', lineHeight: 1.5 }}>
                      {evt.content}
                    </span>
                  </div>
                );
              })}
          </div>
        )}

        {/* Summary */}
        {call.transcript_summary && (
          <div style={{ marginTop: 16 }}>
            <h4
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ept-text-muted)',
                marginBottom: 6,
              }}
            >
              Summary
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ept-text-secondary)' }}>
              {call.transcript_summary}
            </p>
          </div>
        )}

        {/* Recording placeholder */}
        {call.recording_url && (
          <div style={{ marginTop: 16 }}>
            <h4
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ept-text-muted)',
                marginBottom: 6,
              }}
            >
              Recording
            </h4>
            <audio
              controls
              src={call.recording_url}
              style={{ width: '100%', height: 32, borderRadius: 8 }}
            />
          </div>
        )}

        {/* Coaching Notes */}
        {call.coaching_notes && (
          <div style={{ marginTop: 16 }}>
            <h4
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ept-text-muted)',
                marginBottom: 6,
              }}
            >
              Coaching Notes
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ept-text-secondary)', fontStyle: 'italic' }}>
              {call.coaching_notes}
            </p>
          </div>
        )}
      </div>

      {/* Right: Cost & Meta */}
      <div
        style={{
          borderLeft: '1px solid var(--ept-border)',
          paddingLeft: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Cost Breakdown */}
        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ept-text-muted)',
              marginBottom: 8,
            }}
          >
            Cost Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Twilio', value: call.cost_twilio },
              { label: 'Speech-to-Text', value: call.cost_stt },
              { label: 'LLM Inference', value: call.cost_llm },
              { label: 'Text-to-Speech', value: call.cost_tts },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 0',
                }}
              >
                <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{row.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--ept-text-secondary)',
                  }}
                >
                  {formatCost(row.value)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderTop: '1px solid var(--ept-border)',
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ept-text)' }}>Total</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--ept-accent)',
                }}
              >
                {formatCost(call.cost_total)}
              </span>
            </div>
          </div>
        </div>

        {/* Call Metadata */}
        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ept-text-muted)',
              marginBottom: 8,
            }}
          >
            Details
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Call ID', value: call.id.slice(0, 12) + '...' },
              { label: 'Direction', value: call.direction },
              { label: 'Duration', value: formatDuration(call.duration_seconds) },
              { label: 'Started', value: call.created_at ? new Date(call.created_at).toLocaleString() : '--' },
              { label: 'Ended', value: call.ended_at ? new Date(call.ended_at).toLocaleString() : '--' },
              ...(call.campaign_name ? [{ label: 'Campaign', value: call.campaign_name }] : []),
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '3px 0',
                }}
              >
                <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{row.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--ept-text-secondary)',
                    textTransform: row.label === 'Direction' ? 'capitalize' : 'none',
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment */}
        {call.sentiment && (
          <div>
            <h4
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ept-text-muted)',
                marginBottom: 6,
              }}
            >
              Sentiment
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SentimentIndicator sentiment={call.sentiment} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--ept-text-secondary)',
                  textTransform: 'capitalize',
                }}
              >
                {call.sentiment}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Skeleton Loader ─── */
function CallRowSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        borderBottom: '1px solid var(--ept-border)',
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--ept-surface)' }} className="shimmer" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ width: 140, height: 12, borderRadius: 4, backgroundColor: 'var(--ept-surface)' }} className="shimmer" />
        <div style={{ width: 100, height: 10, borderRadius: 4, backgroundColor: 'var(--ept-surface)' }} className="shimmer" />
      </div>
      <div style={{ width: 50, height: 12, borderRadius: 4, backgroundColor: 'var(--ept-surface)' }} className="shimmer" />
      <div style={{ width: 70, height: 20, borderRadius: 6, backgroundColor: 'var(--ept-surface)' }} className="shimmer" />
      <div style={{ width: 50, height: 12, borderRadius: 4, backgroundColor: 'var(--ept-surface)' }} className="shimmer" />
      <div style={{ width: 60, height: 12, borderRadius: 4, backgroundColor: 'var(--ept-surface)' }} className="shimmer" />
    </div>
  );
}

/* ─── Main Page ─── */
export default function CallHistoryPage() {
  const { user } = useAuth();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Filters */
  const [directionFilter, setDirectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  /* Expanded call state */
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [callEvents, setCallEvents] = useState<Record<string, CallEvent[]>>({});
  const [eventsLoading, setEventsLoading] = useState<Record<string, boolean>>({});
  const [eventsError, setEventsError] = useState<Record<string, string | null>>({});

  /* Polling ref for in-progress detection */
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ─── Fetch calls ─── */
  const fetchCalls = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (directionFilter !== 'all') params.set('direction', directionFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const dateStart = getDateRangeStart(dateRange);
      if (dateStart) params.set('after', dateStart);
      params.set('limit', '100');

      const data = await getCalls(params.toString());
      const callList = Array.isArray(data) ? data : data?.calls ?? data?.results ?? [];
      setCalls(callList);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load calls');
    } finally {
      setLoading(false);
    }
  }, [directionFilter, statusFilter, dateRange]);

  useEffect(() => {
    setLoading(true);
    fetchCalls();
  }, [fetchCalls]);

  /* Poll for updates if any call is in_progress */
  useEffect(() => {
    const hasActive = calls.some((c) => c.status === 'in_progress');
    if (hasActive) {
      pollingRef.current = setInterval(fetchCalls, 10000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [calls, fetchCalls]);

  /* ─── Expand / Collapse ─── */
  const toggleExpand = async (callId: string) => {
    if (expandedCallId === callId) {
      setExpandedCallId(null);
      return;
    }

    setExpandedCallId(callId);

    /* Fetch events if not already loaded */
    if (!callEvents[callId]) {
      setEventsLoading((prev) => ({ ...prev, [callId]: true }));
      setEventsError((prev) => ({ ...prev, [callId]: null }));

      try {
        const data = await getCallEvents(callId);
        const eventList = Array.isArray(data) ? data : data?.events ?? data?.results ?? [];
        setCallEvents((prev) => ({ ...prev, [callId]: eventList }));
      } catch (err: any) {
        setEventsError((prev) => ({ ...prev, [callId]: err.message || 'Failed to load events' }));
      } finally {
        setEventsLoading((prev) => ({ ...prev, [callId]: false }));
      }
    }
  };

  /* ─── Filtered count ─── */
  const totalCount = calls.length;

  return (
    <>
      {/* Inline keyframe for pulse animation in status badge */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* ─── Header ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: 'var(--ept-text)',
                letterSpacing: '-0.01em',
              }}
            >
              Call History
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 2 }}>
              {loading ? 'Loading...' : `${totalCount} call${totalCount !== 1 ? 's' : ''} recorded`}
            </p>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => {
              setLoading(true);
              fetchCalls();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--ept-border)',
              backgroundColor: 'var(--ept-surface)',
              color: 'var(--ept-text-secondary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'opacity 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ─── Filter Bar ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid var(--ept-border)',
            backgroundColor: 'var(--ept-card-bg)',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ept-text-muted)',
              marginRight: 4,
            }}
          >
            Filters
          </span>
          <FilterSelect value={directionFilter} onChange={setDirectionFilter} options={DIRECTION_OPTIONS} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
          <FilterSelect value={dateRange} onChange={setDateRange} options={DATE_RANGE_OPTIONS} />

          {(directionFilter !== 'all' || statusFilter !== 'all' || dateRange !== 'all') && (
            <button
              onClick={() => {
                setDirectionFilter('all');
                setStatusFilter('all');
                setDateRange('all');
              }}
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--ept-accent)',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 6,
                transition: 'opacity 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Clear All
            </button>
          )}
        </div>

        {/* ─── Call List ─── */}
        <div
          style={{
            borderRadius: 12,
            border: '1px solid var(--ept-border)',
            backgroundColor: 'var(--ept-card-bg)',
            overflow: 'hidden',
          }}
        >
          {/* Error */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                backgroundColor: '#ef444415',
                borderBottom: '1px solid var(--ept-border)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>{error}</span>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchCalls();
                }}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#ef4444',
                  background: 'none',
                  border: '1px solid #ef444440',
                  borderRadius: 6,
                  padding: '3px 10px',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <CallRowSkeleton key={i} />
              ))}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && calls.length === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                gap: 12,
              }}
            >
              <PhoneIcon />
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text-secondary)' }}>
                No calls recorded yet
              </p>
              <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', textAlign: 'center', maxWidth: 320 }}>
                Start a campaign or make a manual call. All call history will appear here with transcripts, costs, and analytics.
              </p>
            </div>
          )}

          {/* Call Rows */}
          {!loading &&
            calls.map((call, idx) => {
              const isExpanded = expandedCallId === call.id;
              const isLast = idx === calls.length - 1;

              return (
                <div key={call.id}>
                  <div
                    onClick={() => toggleExpand(call.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand(call.id);
                      }
                    }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto auto auto',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 20px',
                      cursor: 'pointer',
                      borderBottom: isExpanded || !isLast ? '1px solid var(--ept-border)' : 'none',
                      backgroundColor: isExpanded ? 'var(--ept-surface)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--ept-bg-alt)';
                    }}
                    onMouseOut={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Left: Direction + Lead info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor:
                            call.direction === 'inbound' ? '#10b98115' : '#3b82f615',
                          flexShrink: 0,
                        }}
                      >
                        {call.direction === 'inbound' ? <InboundIcon /> : <OutboundIcon />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--ept-text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {call.lead_name || 'Unknown Contact'}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--ept-text-muted)',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {call.lead_phone || '--'}
                        </div>
                      </div>
                    </div>

                    {/* Center: Duration + Status + Sentiment */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: 'var(--ept-text)',
                          minWidth: 42,
                          textAlign: 'center',
                        }}
                      >
                        {formatDuration(call.duration_seconds)}
                      </span>
                      <StatusBadge status={call.status} />
                      {call.disposition && <DispositionBadge disposition={call.disposition} />}
                      {call.sentiment && <SentimentIndicator sentiment={call.sentiment} />}
                    </div>

                    {/* Cost */}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--ept-text-secondary)',
                        minWidth: 50,
                        textAlign: 'right',
                      }}
                    >
                      {formatCost(call.cost_total)}
                    </span>

                    {/* Timestamp */}
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--ept-text-muted)',
                        minWidth: 70,
                        textAlign: 'right',
                      }}
                    >
                      {formatRelativeTime(call.created_at)}
                    </span>

                    {/* Chevron */}
                    <ChevronIcon expanded={isExpanded} />
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <CallDetail
                      call={call}
                      events={callEvents[call.id] || null}
                      eventsLoading={eventsLoading[call.id] || false}
                      eventsError={eventsError[call.id] || null}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
