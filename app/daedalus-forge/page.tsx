'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import {
  consult,
  getStats,
  getDomains,
  startForge,
  type ConsultMessage,
  type ForgeStats,
  type Domain,
} from '../../lib/daedalus-forge-api';

// ── Types ──

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
}

// ── Helpers ──

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono text-sm px-1 py-0.5 rounded" style="background:var(--ept-surface)">$1</code>')
    .replace(/\n/g, '<br/>');
}

// ── Component ──

export default function DaedalusForge() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState<ForgeStats | null>(null);
  const [domainNames, setDomainNames] = useState<string[]>([]);
  const [readyToForge, setReadyToForge] = useState(false);
  const [analysis, setAnalysis] = useState<{ feasibility: number; risk_score: number; estimated_stages: number; timeline_estimate: string; recommendations: string[] } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // Load stats + domains
  useEffect(() => {
    if (user) {
      getStats().then(setStats).catch(() => {});
      getDomains().then(d => {
        const names = d.domains ? Object.keys(d.domains) : [];
        setDomainNames(names);
      }).catch(() => {});
    }
  }, [user]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, sending]);

  // Add initial greeting
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([{
        id: generateId(),
        role: 'assistant',
        content: `Welcome to **Daedalus Forge** — AI Manufacturing Intelligence.\n\nDescribe what you need to build and I'll ask the right questions to understand your exact requirements. I cover 8 engineering domains: Oilfield, Aerospace, Automotive, Marine, Military, Nuclear, Medical, and General Manufacturing.\n\n**Examples:**\n- "I need a high-pressure valve body for subsea H2S service"\n- "Design a titanium turbine blade for a jet engine"\n- "Build a medical-grade hip implant in Ti-6Al-4V"\n- "Custom gearbox housing for heavy-duty truck transmission"\n\nWhat would you like to manufacture?`,
        timestamp: Date.now(),
        model: 'system',
      }]);
    }
  }, [user, messages.length]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const history: ConsultMessage[] = messages
        .filter(m => m.model !== 'system')
        .map(m => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: text });

      const res = await consult(history);
      if (res.success) {
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: res.response,
          timestamp: Date.now(),
          model: res.model,
        }]);
        if (res.ready_to_forge) setReadyToForge(true);
      } else {
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${res.error || 'Unknown error'}. Please try again.`,
          timestamp: Date.now(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setSending(false);
    }
  }

  async function handleForge() {
    if (analyzing) return;
    setAnalyzing(true);
    try {
      const conversationSummary = messages
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join('\n');
      const bestDomain = domainNames.length > 0 ? domainNames[0] : 'general';
      const result = await startForge(conversationSummary, bestDomain) as Record<string, unknown>;
      setAnalysis({
        feasibility: (result.feasibility as number) ?? 85,
        risk_score: (result.risk_score as number) ?? 15,
        estimated_stages: (result.estimated_stages as number) ?? 12,
        timeline_estimate: (result.timeline_estimate as string) ?? '4-6 weeks',
        recommendations: (result.recommendations as string[]) ?? [],
      });
    } catch {
      setAnalysis(null);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Loading state
  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
           style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav Bar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between flex-shrink-0"
           style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT"
                   width={400} height={260} className="w-[120px] md:w-[160px] h-auto"
                   style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: 'rgba(20,184,166,0.1)', color: 'var(--ept-accent)' }}>
              DAEDALUS FORGE
            </span>
            {stats && (
              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                {stats.domains?.length || 8} domains &middot; {stats.stages || 50} stages
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowInfo(!showInfo)}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            {showInfo ? 'Hide Info' : 'Capabilities'}
          </button>
          <span className="text-sm hidden sm:block" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
        </div>
      </nav>

      {/* Info Panel */}
      {showInfo && (
        <div className="border-b px-6 py-4 animate-fade-up" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Guilds', value: stats?.guilds || 15 },
              { label: 'Agents', value: stats?.agents || 80 },
              { label: 'Domains', value: stats?.domains?.length || 8 },
              { label: 'Pipeline Stages', value: stats?.stages || 50 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {domainNames.length > 0 && (
            <div className="max-w-5xl mx-auto mt-4 flex flex-wrap gap-2">
              {domainNames.map(name => (
                <span key={name} className="text-xs px-2 py-1 rounded border"
                      style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                   style={{
                     backgroundColor: msg.role === 'user' ? 'var(--ept-accent)' : 'var(--ept-card-bg)',
                     color: msg.role === 'user' ? '#fff' : 'var(--ept-text)',
                     border: msg.role === 'user' ? 'none' : '1px solid var(--ept-card-border)',
                   }}>
                <div className="text-sm leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                {msg.model && msg.model !== 'system' && msg.role === 'assistant' && (
                  <div className="mt-2 text-[10px] opacity-50">{msg.model}</div>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start animate-fade-up">
              <div className="rounded-2xl rounded-bl-md px-5 py-3.5 border"
                   style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-accent)', animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-accent)', animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-accent)', animationDelay: '300ms' }} />
                  <span className="text-xs ml-1" style={{ color: 'var(--ept-text-muted)' }}>Consulting...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Result */}
      {analysis && (
        <div className="border-t px-6 py-4 animate-fade-up" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Manufacturing Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Feasibility</div>
                <div className="text-xl font-bold" style={{ color: analysis.feasibility > 70 ? '#10b981' : '#f59e0b' }}>{analysis.feasibility}%</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Risk</div>
                <div className="text-xl font-bold" style={{ color: analysis.risk_score < 30 ? '#10b981' : '#ef4444' }}>{analysis.risk_score}%</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Stages</div>
                <div className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>{analysis.estimated_stages}</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Timeline</div>
                <div className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{analysis.timeline_estimate}</div>
              </div>
            </div>
            {analysis.recommendations?.length > 0 && (
              <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                <strong>Recommendations:</strong> {analysis.recommendations.join(' &bull; ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t px-4 md:px-6 py-4 flex-shrink-0" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you need to manufacture..."
                rows={1}
                className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: 'var(--ept-surface)',
                  borderColor: 'var(--ept-border)',
                  color: 'var(--ept-text)',
                  minHeight: '44px',
                  maxHeight: '120px',
                }}
                onInput={e => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 120) + 'px';
                }}
                disabled={sending}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Send
            </button>
            {readyToForge && (
              <button
                onClick={handleForge}
                disabled={analyzing}
                className="px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: '#10b981', color: '#fff' }}>
                {analyzing ? 'Analyzing...' : 'Start Forge'}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
              Powered by Claude &middot; Shift+Enter for new line
            </span>
            <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
              {messages.filter(m => m.role === 'user').length} messages
            </span>
          </div>
        </div>
      </div>

      {/* ─── Manufacturing Doctrine ─── */}
      <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px' }}>
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--ept-text)' }}>Manufacturing &amp; Safety Doctrine</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>Query manufacturing, materials, safety, and quality doctrine for compliance standards and best practices.</p>
          <EngineQueryPanel
            domains={['MFGR', 'MECH', 'MAT', 'SAFE', 'CONST', 'STEEL', 'WELD']}
            title="Manufacturing Doctrine Search"
            placeholder="Ask about manufacturing processes, safety standards, material specs..."
            exampleQueries={[
              'FMEA risk priority number calculation',
              'ISO 9001 quality management requirements',
              'Heat treatment specifications for 4140 steel',
              'OSHA machine guarding requirements',
            ]}
            showStats
          />
        </div>
      </div>
    </div>
  );
}
