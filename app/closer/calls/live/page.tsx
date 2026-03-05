'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { getCalls, whisperToAI, takeoverCall, muteAI, endCall, VOICE_WS_URL } from '../../../../lib/closer-api';

/* ─── Types ─── */
interface ActiveCall {
  id: string;
  lead_id: string;
  lead_name?: string;
  lead_phone?: string;
  lead_email?: string;
  lead_company?: string;
  lead_status?: string;
  lead_priority?: string;
  lead_tags?: string[];
  lead_notes?: string;
  campaign_id?: string;
  campaign_name?: string;
  direction: 'inbound' | 'outbound';
  status: string;
  sentiment?: string;
  script_state?: string;
  duration_seconds?: number;
  created_at: string;
}

interface TranscriptLine {
  id: string;
  speaker: 'ai' | 'lead';
  text: string;
  isFinal: boolean;
  timestamp: string;
}

interface WSMessage {
  type: 'call_info' | 'transcript' | 'state_change' | 'sentiment_update' | 'call_ended';
  data: any;
}

/* ─── Constants ─── */
const SCRIPT_STATES = [
  'GREETING',
  'CONSENT_CHECK',
  'DISCOVERY',
  'QUALIFICATION',
  'BOOKING',
  'OBJECTION_HANDLER',
  'WARM_GOODBYE',
] as const;

const SENTIMENT_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  very_positive: { color: '#10b981', label: 'Very Positive', icon: '++' },
  positive: { color: '#34d399', label: 'Positive', icon: '+' },
  neutral: { color: '#6b7280', label: 'Neutral', icon: '~' },
  negative: { color: '#f59e0b', label: 'Negative', icon: '-' },
  very_negative: { color: '#ef4444', label: 'Very Negative', icon: '--' },
};

const DEMO_CALLS: ActiveCall[] = [
  {
    id: 'demo-call-001',
    lead_id: 'lead-001',
    lead_name: 'Sarah Johnson',
    lead_phone: '+1 (432) 555-0142',
    lead_email: 'sarah.johnson@petrocorp.com',
    lead_company: 'PetroCorp Energy',
    lead_status: 'qualified',
    lead_priority: 'high',
    lead_tags: ['enterprise', 'oil-gas', 'decision-maker'],
    lead_notes: 'VP of Operations. Interested in automation suite. Budget approved for Q1.',
    direction: 'outbound',
    status: 'in_progress',
    sentiment: 'positive',
    script_state: 'QUALIFICATION',
    created_at: new Date(Date.now() - 187000).toISOString(),
  },
  {
    id: 'demo-call-002',
    lead_id: 'lead-002',
    lead_name: 'Mike Reynolds',
    lead_phone: '+1 (915) 555-0298',
    lead_email: 'mreynolds@basintech.io',
    lead_company: 'Basin Technologies',
    lead_status: 'new',
    lead_priority: 'medium',
    lead_tags: ['startup', 'saas'],
    lead_notes: 'Inbound from website form. Wants pricing details.',
    direction: 'inbound',
    status: 'in_progress',
    sentiment: 'neutral',
    script_state: 'DISCOVERY',
    created_at: new Date(Date.now() - 93000).toISOString(),
  },
];

const DEMO_TRANSCRIPT: TranscriptLine[] = [
  { id: 't-001', speaker: 'ai', text: 'Good afternoon, Sarah! This is Echo from Echo Prime Technologies. How are you doing today?', isFinal: true, timestamp: new Date(Date.now() - 180000).toISOString() },
  { id: 't-002', speaker: 'lead', text: "Hi Echo! I'm doing well, thanks for calling back.", isFinal: true, timestamp: new Date(Date.now() - 172000).toISOString() },
  { id: 't-003', speaker: 'ai', text: "Great to hear! I wanted to follow up on your interest in our automation platform. You mentioned you're looking at streamlining field operations for your West Texas sites. Is that still a priority for Q1?", isFinal: true, timestamp: new Date(Date.now() - 160000).toISOString() },
  { id: 't-004', speaker: 'lead', text: "Absolutely. We've actually expanded the scope. We're now looking at 12 field sites instead of the original 5. Our COO approved additional budget last week.", isFinal: true, timestamp: new Date(Date.now() - 145000).toISOString() },
  { id: 't-005', speaker: 'ai', text: "That's fantastic news! With 12 sites, you'd definitely benefit from our Enterprise tier which includes dedicated support, custom integrations, and priority SLA. Can I walk you through the Enterprise pricing structure?", isFinal: true, timestamp: new Date(Date.now() - 130000).toISOString() },
  { id: 't-006', speaker: 'lead', text: 'Yes, please. Also, can you tell me about the implementation timeline? We need everything operational by end of March.', isFinal: true, timestamp: new Date(Date.now() - 118000).toISOString() },
  { id: 't-007', speaker: 'ai', text: "For 12 sites, our typical Enterprise deployment takes 2-3 weeks with parallel site configuration. Given your March deadline, we could have you fully operational by March 15th if we start the onboarding process this week. I'll send over a detailed implementation timeline after our call.", isFinal: true, timestamp: new Date(Date.now() - 100000).toISOString() },
  { id: 't-008', speaker: 'lead', text: "That works perfectly. What's the pricing looking like for the Enterprise tier at 12 sites?", isFinal: true, timestamp: new Date(Date.now() - 88000).toISOString() },
];

/* ─── Helpers ─── */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(Math.floor(s)).padStart(2, '0')}`;
}

function formatTimestamp(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch {
    return '--:--:--';
  }
}

/* ─── SVG Icons ─── */
function PhoneRingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
      <path d="M17 16.95A7 7 0 015 12" />
      <path d="M19 12a7 7 0 01-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function PhoneOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67m-2.67-3.34a19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  );
}

function UserTakeoverIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function WhisperIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function EmptyCallsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ept-text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/* ─── Script State Progress Bar ─── */
function ScriptStateBar({ currentState }: { currentState: string }) {
  const currentIndex = SCRIPT_STATES.indexOf(currentState as typeof SCRIPT_STATES[number]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {SCRIPT_STATES.map((state, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          const dotColor = isActive
            ? 'var(--ept-accent)'
            : isCompleted
              ? 'var(--ept-accent)'
              : 'var(--ept-border)';
          const lineColor = isCompleted ? 'var(--ept-accent)' : 'var(--ept-border)';

          return (
            <div key={state} style={{ display: 'flex', alignItems: 'center', flex: idx < SCRIPT_STATES.length - 1 ? 1 : 'none' }}>
              <div
                style={{
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 0 8px ${dotColor}` : 'none',
                }}
              />
              {idx < SCRIPT_STATES.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: lineColor,
                    transition: 'background-color 0.3s ease',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {SCRIPT_STATES.map((state, idx) => {
          const isActive = idx === currentIndex;
          return (
            <span
              key={state}
              style={{
                fontSize: 8,
                fontWeight: isActive ? 700 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: isActive ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                textAlign: 'center',
                width: 0,
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              {state.replace(/_/g, ' ')}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sentiment Display ─── */
function SentimentDisplay({ level }: { level: string }) {
  const config = SENTIMENT_CONFIG[level] || SENTIMENT_CONFIG.neutral;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: `${config.color}20`,
          color: config.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {config.icon}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: config.color }}>{config.label}</div>
        <div
          style={{
            display: 'flex',
            gap: 2,
            marginTop: 3,
          }}
        >
          {Object.keys(SENTIMENT_CONFIG).map((key) => (
            <div
              key={key}
              style={{
                width: 16,
                height: 4,
                borderRadius: 2,
                backgroundColor: key === level ? SENTIMENT_CONFIG[key].color : 'var(--ept-border)',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Active Call Item (left panel) ─── */
function ActiveCallItem({
  call,
  isSelected,
  elapsed,
  onClick,
}: {
  call: ActiveCall;
  isSelected: boolean;
  elapsed: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      style={{
        padding: '12px 14px',
        cursor: 'pointer',
        borderBottom: '1px solid var(--ept-border)',
        backgroundColor: isSelected ? 'var(--ept-surface)' : 'transparent',
        borderLeft: isSelected ? '3px solid var(--ept-accent)' : '3px solid transparent',
        transition: 'all 0.15s ease',
      }}
      onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--ept-surface)'; }}
      onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>
          {call.lead_name || 'Unknown'}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor: '#3b82f618',
            color: '#3b82f6',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          LIVE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>
          {call.lead_company || call.lead_phone || 'No details'}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--ept-accent)',
          }}
        >
          {formatDuration(elapsed)}
        </span>
      </div>

      {call.script_state && (
        <div style={{ marginTop: 6 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--ept-text-muted)',
              backgroundColor: 'var(--ept-surface)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            {call.script_state.replace(/_/g, ' ')}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function LiveCallMonitorPage() {
  const { user, loading: authLoading } = useAuth();

  /* ─── State ─── */
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentState, setCurrentState] = useState<string>('GREETING');
  const [sentiment, setSentiment] = useState<string>('neutral');
  const [callInfo, setCallInfo] = useState<any>(null);
  const [aiMuted, setAiMuted] = useState(false);
  const [whisperText, setWhisperText] = useState('');
  const [whisperSending, setWhisperSending] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [endReason, setEndReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<Record<string, number>>({});

  const wsRef = useRef<WebSocket | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedCall = activeCalls.find((c) => c.id === selectedCallId) || null;

  /* ─── Fetch active calls ─── */
  const fetchActiveCalls = useCallback(async () => {
    try {
      const data = await getCalls('status=active&status=in_progress');
      const list: ActiveCall[] = Array.isArray(data) ? data : data?.calls ?? data?.results ?? [];
      if (list.length > 0) {
        setActiveCalls(list);
        setUsingDemo(false);
        if (!selectedCallId || !list.find((c) => c.id === selectedCallId)) {
          setSelectedCallId(list[0].id);
        }
      } else {
        setActiveCalls(DEMO_CALLS);
        setUsingDemo(true);
        if (!selectedCallId) {
          setSelectedCallId(DEMO_CALLS[0].id);
          setTranscript(DEMO_TRANSCRIPT);
          setCurrentState(DEMO_CALLS[0].script_state || 'GREETING');
          setSentiment(DEMO_CALLS[0].sentiment || 'neutral');
        }
      }
      setError(null);
    } catch {
      setActiveCalls(DEMO_CALLS);
      setUsingDemo(true);
      if (!selectedCallId) {
        setSelectedCallId(DEMO_CALLS[0].id);
        setTranscript(DEMO_TRANSCRIPT);
        setCurrentState(DEMO_CALLS[0].script_state || 'GREETING');
        setSentiment(DEMO_CALLS[0].sentiment || 'neutral');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCallId]);

  useEffect(() => {
    fetchActiveCalls();
    pollRef.current = setInterval(fetchActiveCalls, 15000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchActiveCalls]);

  /* ─── Call timer ─── */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = { ...prev };
        activeCalls.forEach((call) => {
          const startTime = new Date(call.created_at).getTime();
          const now = Date.now();
          next[call.id] = Math.floor((now - startTime) / 1000);
        });
        return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeCalls]);

  /* ─── WebSocket connection ─── */
  useEffect(() => {
    if (!selectedCallId || usingDemo) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setTranscript([]);
    setCallEnded(false);
    setEndReason(null);
    setAiMuted(false);

    try {
      const ws = new WebSocket(`${VOICE_WS_URL}/${selectedCallId}`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);

          switch (msg.type) {
            case 'call_info':
              setCallInfo(msg.data);
              if (msg.data.script_state) setCurrentState(msg.data.script_state);
              if (msg.data.sentiment) setSentiment(msg.data.sentiment);
              break;

            case 'transcript': {
              const line: TranscriptLine = {
                id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                speaker: msg.data.speaker,
                text: msg.data.text,
                isFinal: msg.data.isFinal,
                timestamp: msg.data.timestamp || new Date().toISOString(),
              };

              setTranscript((prev) => {
                if (!line.isFinal) {
                  const withoutInterim = prev.filter(
                    (t) => t.isFinal || t.speaker !== line.speaker
                  );
                  return [...withoutInterim, line];
                }
                const withoutInterim = prev.filter(
                  (t) => t.isFinal
                );
                return [...withoutInterim, line];
              });
              break;
            }

            case 'state_change':
              setCurrentState(msg.data.state);
              break;

            case 'sentiment_update':
              setSentiment(msg.data.level);
              break;

            case 'call_ended':
              setCallEnded(true);
              setEndReason(msg.data.reason || 'Call ended');
              break;
          }
        } catch {
          /* ignore non-JSON messages */
        }
      };

      ws.onerror = () => {
        /* WebSocket error — no action needed, onclose handles cleanup */
      };

      ws.onclose = () => {
        wsRef.current = null;
      };
    } catch {
      /* WebSocket creation failed */
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [selectedCallId, usingDemo]);

  /* ─── Auto-scroll transcript ─── */
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  /* ─── Select a different call ─── */
  const handleSelectCall = useCallback((callId: string) => {
    setSelectedCallId(callId);
    const call = [...activeCalls, ...DEMO_CALLS].find((c) => c.id === callId);
    if (call) {
      setCurrentState(call.script_state || 'GREETING');
      setSentiment(call.sentiment || 'neutral');
    }
    if (usingDemo && callId === DEMO_CALLS[0].id) {
      setTranscript(DEMO_TRANSCRIPT);
    } else if (usingDemo) {
      setTranscript([
        { id: 'd-001', speaker: 'ai', text: 'Hello Mike! Thanks for reaching out to Echo Prime Technologies. I saw you submitted a request on our website. How can I help you today?', isFinal: true, timestamp: new Date(Date.now() - 90000).toISOString() },
        { id: 'd-002', speaker: 'lead', text: "Hey, yeah. I'm looking for pricing on your engine platform. We're a small startup but growing fast.", isFinal: true, timestamp: new Date(Date.now() - 82000).toISOString() },
        { id: 'd-003', speaker: 'ai', text: "That's great to hear about your growth! Let me learn a bit more about your needs so I can point you to the best plan. What industry are you in, and roughly how many team members would be using the platform?", isFinal: true, timestamp: new Date(Date.now() - 70000).toISOString() },
      ]);
    }
    setCallEnded(false);
    setEndReason(null);
    setAiMuted(false);
  }, [activeCalls, usingDemo]);

  /* ─── Control handlers ─── */
  const handleWhisper = async () => {
    if (!selectedCallId || !whisperText.trim()) return;
    setWhisperSending(true);
    try {
      if (!usingDemo) {
        await whisperToAI(selectedCallId, whisperText.trim());
      }
      const whisperLine: TranscriptLine = {
        id: `whisper-${Date.now()}`,
        speaker: 'ai',
        text: `[WHISPER] ${whisperText.trim()}`,
        isFinal: true,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, whisperLine]);
      setWhisperText('');
    } catch {
      /* whisper failed */
    } finally {
      setWhisperSending(false);
    }
  };

  const handleTakeover = async () => {
    if (!selectedCallId) return;
    try {
      if (!usingDemo) {
        await takeoverCall(selectedCallId);
      }
      const line: TranscriptLine = {
        id: `sys-${Date.now()}`,
        speaker: 'ai',
        text: '[SYSTEM] Human agent has taken over the call.',
        isFinal: true,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, line]);
    } catch {
      /* takeover failed */
    }
  };

  const handleMuteToggle = async () => {
    if (!selectedCallId) return;
    const newMuted = !aiMuted;
    try {
      if (!usingDemo) {
        await muteAI(selectedCallId, newMuted);
      }
      setAiMuted(newMuted);
      const line: TranscriptLine = {
        id: `sys-${Date.now()}`,
        speaker: 'ai',
        text: `[SYSTEM] AI ${newMuted ? 'muted' : 'unmuted'}.`,
        isFinal: true,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, line]);
    } catch {
      /* mute toggle failed */
    }
  };

  const handleEndCall = async () => {
    if (!selectedCallId) return;
    try {
      if (!usingDemo) {
        await endCall(selectedCallId);
      }
      setCallEnded(true);
      setEndReason('Ended by agent');
    } catch {
      /* end call failed */
    }
  };

  /* ─── Loading / auth gate ─── */
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '2px solid var(--ept-accent)',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .live-transcript-scroll::-webkit-scrollbar { width: 4px; }
        .live-transcript-scroll::-webkit-scrollbar-track { background: transparent; }
        .live-transcript-scroll::-webkit-scrollbar-thumb { background: var(--ept-border); border-radius: 4px; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 'calc(100vh - 140px)' }}>
        {/* ─── Header ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid var(--ept-border)',
            backgroundColor: 'var(--ept-card-bg)',
            borderRadius: '12px 12px 0 0',
            border: '1px solid var(--ept-card-border)',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: 'var(--ept-accent)' }}>
              <PhoneRingIcon />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ept-text)', letterSpacing: '-0.01em' }}>
                Live Call Monitor
              </h2>
              <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 1 }}>
                {usingDemo ? 'Demo mode \u2014 showing sample data' : `${activeCalls.length} active call${activeCalls.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setLoading(true); fetchActiveCalls(); }}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid var(--ept-border)',
              backgroundColor: 'var(--ept-surface)',
              color: 'var(--ept-text-secondary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ─── Two-Column Layout ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            flex: 1,
            minHeight: 0,
            border: '1px solid var(--ept-card-border)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            overflow: 'hidden',
            backgroundColor: 'var(--ept-card-bg)',
          }}
        >
          {/* ─── LEFT PANEL: Active Calls List ─── */}
          <div
            style={{
              borderRight: '1px solid var(--ept-border)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--ept-border)',
                backgroundColor: 'var(--ept-surface)',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--ept-text-muted)',
                }}
              >
                Active Calls ({activeCalls.length})
              </span>
            </div>

            {loading && (
              <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '2px solid var(--ept-accent)',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              </div>
            )}

            {!loading && activeCalls.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  gap: 10,
                  flex: 1,
                }}
              >
                <EmptyCallsIcon />
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-secondary)', textAlign: 'center' }}>
                  No active calls
                </p>
                <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', textAlign: 'center' }}>
                  Start a campaign or initiate a call to begin monitoring.
                </p>
              </div>
            )}

            {!loading && activeCalls.map((call) => (
              <ActiveCallItem
                key={call.id}
                call={call}
                isSelected={call.id === selectedCallId}
                elapsed={elapsedSeconds[call.id] || 0}
                onClick={() => handleSelectCall(call.id)}
              />
            ))}
          </div>

          {/* ─── RIGHT PANEL: Live Call Detail ─── */}
          {selectedCall ? (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Call Header */}
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--ept-border)',
                  backgroundColor: 'var(--ept-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)' }}>
                      {selectedCall.lead_name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 1 }}>
                      {selectedCall.lead_company ? `${selectedCall.lead_company} \u2022 ` : ''}
                      {selectedCall.lead_phone || 'No phone'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Call Timer */}
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: callEnded ? 'var(--ept-text-muted)' : 'var(--ept-accent)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {formatDuration(elapsedSeconds[selectedCall.id] || 0)}
                  </div>
                  {!callEnded && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 4,
                        backgroundColor: '#10b98118',
                        color: '#10b981',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        }}
                      />
                      CONNECTED
                    </span>
                  )}
                  {callEnded && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 4,
                        backgroundColor: '#ef444418',
                        color: '#ef4444',
                      }}
                    >
                      ENDED {endReason ? `\u2014 ${endReason}` : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', flex: 1, minHeight: 0 }}>
                {/* ─── Center: Transcript + Controls ─── */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {/* Script State Progress */}
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--ept-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--ept-text-muted)',
                        }}
                      >
                        Script Progress
                      </span>
                      <SentimentDisplay level={sentiment} />
                    </div>
                    <ScriptStateBar currentState={currentState} />
                  </div>

                  {/* Transcript */}
                  <div
                    className="live-transcript-scroll"
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '12px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    {transcript.length === 0 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          color: 'var(--ept-text-muted)',
                          fontSize: 12,
                          fontStyle: 'italic',
                        }}
                      >
                        Waiting for conversation to begin...
                      </div>
                    )}

                    {transcript.map((line) => {
                      const isAI = line.speaker === 'ai';
                      const isSystem = line.text.startsWith('[SYSTEM]') || line.text.startsWith('[WHISPER]');
                      const isWhisper = line.text.startsWith('[WHISPER]');

                      return (
                        <div
                          key={line.id}
                          style={{
                            display: 'flex',
                            gap: 10,
                            padding: '8px 12px',
                            borderRadius: 8,
                            backgroundColor: isSystem
                              ? isWhisper ? 'var(--ept-accent)' + '10' : 'var(--ept-surface)'
                              : isAI
                                ? 'var(--ept-surface)'
                                : 'transparent',
                            borderLeft: isSystem
                              ? `3px solid ${isWhisper ? 'var(--ept-accent)' : 'var(--ept-text-muted)'}`
                              : '3px solid transparent',
                            opacity: line.isFinal ? 1 : 0.7,
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.06em',
                                  color: isSystem
                                    ? 'var(--ept-text-muted)'
                                    : isAI
                                      ? 'var(--ept-accent)'
                                      : 'var(--ept-text-secondary)',
                                  minWidth: 30,
                                }}
                              >
                                {isSystem ? 'SYS' : isAI ? 'AI' : 'LEAD'}
                              </span>
                              <span
                                style={{
                                  fontSize: 9,
                                  color: 'var(--ept-text-muted)',
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                              >
                                {formatTimestamp(line.timestamp)}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: 12,
                                lineHeight: 1.5,
                                color: 'var(--ept-text)',
                                fontStyle: line.isFinal ? 'normal' : 'italic',
                              }}
                            >
                              {isSystem ? line.text.replace(/^\[(SYSTEM|WHISPER)\]\s*/, '') : line.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={transcriptEndRef} />
                  </div>

                  {/* ─── Control Panel ─── */}
                  <div
                    style={{
                      padding: '12px 20px',
                      borderTop: '1px solid var(--ept-border)',
                      backgroundColor: 'var(--ept-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    {/* Whisper Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ color: 'var(--ept-text-muted)', flexShrink: 0 }}>
                        <WhisperIcon />
                      </div>
                      <input
                        type="text"
                        placeholder="Whisper to AI (only the AI hears this)..."
                        value={whisperText}
                        onChange={(e) => setWhisperText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleWhisper(); }}
                        disabled={callEnded}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--ept-border)',
                          backgroundColor: 'var(--ept-card-bg)',
                          color: 'var(--ept-text)',
                          fontSize: 12,
                          fontFamily: 'inherit',
                          outline: 'none',
                          opacity: callEnded ? 0.5 : 1,
                        }}
                      />
                      <button
                        onClick={handleWhisper}
                        disabled={callEnded || !whisperText.trim() || whisperSending}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: 'var(--ept-accent)',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: callEnded || !whisperText.trim() ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          opacity: callEnded || !whisperText.trim() ? 0.4 : 1,
                          transition: 'opacity 0.15s ease',
                        }}
                      >
                        <SendIcon />
                        {whisperSending ? 'Sending...' : 'Send'}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Take Over */}
                      <button
                        onClick={handleTakeover}
                        disabled={callEnded}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          border: '1px solid var(--ept-border)',
                          backgroundColor: 'var(--ept-card-bg)',
                          color: 'var(--ept-text)',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: callEnded ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          opacity: callEnded ? 0.4 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <UserTakeoverIcon />
                        Take Over
                      </button>

                      {/* Mute AI */}
                      <button
                        onClick={handleMuteToggle}
                        disabled={callEnded}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 8,
                          border: `1px solid ${aiMuted ? '#f59e0b40' : 'var(--ept-border)'}`,
                          backgroundColor: aiMuted ? '#f59e0b18' : 'var(--ept-card-bg)',
                          color: aiMuted ? '#f59e0b' : 'var(--ept-text)',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: callEnded ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          opacity: callEnded ? 0.4 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {aiMuted ? <MicOffIcon /> : <MicIcon />}
                        {aiMuted ? 'Unmute AI' : 'Mute AI'}
                      </button>

                      <div style={{ flex: 1 }} />

                      {/* End Call */}
                      <button
                        onClick={handleEndCall}
                        disabled={callEnded}
                        style={{
                          padding: '7px 18px',
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: callEnded ? '#6b728030' : '#ef4444',
                          color: callEnded ? '#6b7280' : '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: callEnded ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <PhoneOffIcon />
                        End Call
                      </button>
                    </div>
                  </div>
                </div>

                {/* ─── Right Sidebar: Lead Info ─── */}
                <div
                  style={{
                    borderLeft: '1px solid var(--ept-border)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Lead Name + Company Header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--ept-border)' }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--ept-text-muted)',
                      }}
                    >
                      Lead Info
                    </span>
                  </div>

                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Contact Fields */}
                    {[
                      { label: 'Name', value: selectedCall.lead_name },
                      { label: 'Phone', value: selectedCall.lead_phone, mono: true },
                      { label: 'Email', value: selectedCall.lead_email, mono: true },
                      { label: 'Company', value: selectedCall.lead_company },
                    ].map((field) =>
                      field.value ? (
                        <div key={field.label}>
                          <div
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: 'var(--ept-text-muted)',
                              marginBottom: 3,
                            }}
                          >
                            {field.label}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: 'var(--ept-text)',
                              fontFamily: field.mono ? "'JetBrains Mono', monospace" : 'inherit',
                            }}
                          >
                            {field.value}
                          </div>
                        </div>
                      ) : null
                    )}

                    {/* Status + Priority */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      {selectedCall.lead_status && (
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: 'var(--ept-text-muted)',
                              marginBottom: 3,
                            }}
                          >
                            Status
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              padding: '2px 8px',
                              borderRadius: 4,
                              backgroundColor: 'var(--ept-accent)' + '18',
                              color: 'var(--ept-accent)',
                            }}
                          >
                            {selectedCall.lead_status}
                          </span>
                        </div>
                      )}
                      {selectedCall.lead_priority && (
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: 'var(--ept-text-muted)',
                              marginBottom: 3,
                            }}
                          >
                            Priority
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              padding: '2px 8px',
                              borderRadius: 4,
                              backgroundColor:
                                selectedCall.lead_priority === 'high'
                                  ? '#ef444418'
                                  : selectedCall.lead_priority === 'medium'
                                    ? '#f59e0b18'
                                    : '#6b728018',
                              color:
                                selectedCall.lead_priority === 'high'
                                  ? '#ef4444'
                                  : selectedCall.lead_priority === 'medium'
                                    ? '#f59e0b'
                                    : '#6b7280',
                            }}
                          >
                            {selectedCall.lead_priority}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedCall.lead_tags && selectedCall.lead_tags.length > 0 && (
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--ept-text-muted)',
                            marginBottom: 5,
                          }}
                        >
                          Tags
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {selectedCall.lead_tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: 9,
                                fontWeight: 600,
                                padding: '2px 7px',
                                borderRadius: 4,
                                border: '1px solid var(--ept-border)',
                                color: 'var(--ept-text-secondary)',
                                backgroundColor: 'var(--ept-surface)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedCall.lead_notes && (
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--ept-text-muted)',
                            marginBottom: 5,
                          }}
                        >
                          Notes
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: 'var(--ept-text-secondary)',
                            padding: '8px 10px',
                            borderRadius: 6,
                            backgroundColor: 'var(--ept-surface)',
                            border: '1px solid var(--ept-border)',
                          }}
                        >
                          {selectedCall.lead_notes}
                        </div>
                      </div>
                    )}

                    {/* Campaign */}
                    {selectedCall.campaign_name && (
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--ept-text-muted)',
                            marginBottom: 3,
                          }}
                        >
                          Campaign
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ept-text)' }}>
                          {selectedCall.campaign_name}
                        </div>
                      </div>
                    )}

                    {/* Direction */}
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--ept-text-muted)',
                          marginBottom: 3,
                        }}
                      >
                        Direction
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: selectedCall.direction === 'inbound' ? '#10b981' : '#3b82f6',
                          }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'var(--ept-text)',
                            textTransform: 'capitalize',
                          }}
                        >
                          {selectedCall.direction}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ─── No Call Selected ─── */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: 40,
              }}
            >
              <EmptyCallsIcon />
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text-secondary)' }}>
                Select a call to monitor
              </p>
              <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', textAlign: 'center', maxWidth: 300 }}>
                Choose an active call from the left panel to view the live transcript, control the AI agent, and monitor call progress in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
