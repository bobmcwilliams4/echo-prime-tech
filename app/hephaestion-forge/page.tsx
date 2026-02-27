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
  getTemplates,
  startForge,
  type ConsultMessage,
  type ForgeStats,
} from '../../lib/hephaestion-forge-api';

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

export default function HephaestionForge() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState<ForgeStats | null>(null);
  const [templateNames, setTemplateNames] = useState<string[]>([]);
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [plan, setPlan] = useState<{ archetype: string; language: string; framework: string; stages: string[]; estimated_files: number; estimated_lines: number; estimated_time: string; dependencies: string[] } | null>(null);
  const [planning, setPlanning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // Load stats + archetypes
  useEffect(() => {
    if (user) {
      getStats().then(setStats).catch(() => {});
      getTemplates().then(d => setTemplateNames((d.templates || []).map((t: { name: string }) => t.name))).catch(() => {});
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
        content: `Welcome to **Hephaestion Forge** — AI Software Factory.\n\nTell me what you want to build and I'll ask intelligent questions to understand exactly what you need. I support 15 project archetypes across multiple languages and frameworks.\n\n**Examples:**\n- "Build me a real-time crypto trading bot"\n- "I need a Cloudflare Worker that handles user authentication"\n- "Create a Next.js dashboard for monitoring IoT sensors"\n- "Build a Discord bot that manages server roles and events"\n- "I want an MCP server for database management"\n\nWhat would you like to build?`,
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
        if (res.ready_to_build) setReadyToBuild(true);
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

  async function handleBuild() {
    if (planning) return;
    setPlanning(true);
    try {
      const conversationSummary = messages
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join('\n');
      const result = await startForge(conversationSummary) as Record<string, unknown>;
      setPlan({
        archetype: (result.archetype as string) ?? 'Custom',
        language: (result.language as string) ?? 'TypeScript',
        framework: (result.framework as string) ?? 'Hono',
        stages: (result.stages as string[]) ?? [],
        estimated_files: (result.estimated_files as number) ?? 8,
        estimated_lines: (result.estimated_lines as number) ?? 2000,
        estimated_time: (result.estimated_time as string) ?? '2-4 hours',
        dependencies: (result.dependencies as string[]) ?? [],
      });
    } catch {
      setPlan(null);
    } finally {
      setPlanning(false);
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
              HEPHAESTION FORGE
            </span>
            {stats && (
              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                {stats.archetypes?.length || 15} archetypes &middot; {stats.languages?.length || 8} languages
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
              { label: 'Archetypes', value: stats?.archetypes?.length || 15 },
              { label: 'Pipeline Stages', value: stats?.pipeline_stages || 13 },
              { label: 'Quality Gates', value: stats?.quality_gates || 6 },
              { label: 'Languages', value: stats?.languages?.length || 8 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {templateNames.length > 0 && (
            <div className="max-w-5xl mx-auto mt-4 flex flex-wrap gap-2">
              {templateNames.map(name => (
                <span key={name} className="text-xs px-2 py-1 rounded border"
                      style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                  {name}
                </span>
              ))}
            </div>
          )}
          {stats?.languages && stats.languages.length > 0 && (
            <div className="max-w-5xl mx-auto mt-3 flex flex-wrap gap-2">
              {stats.languages.map(lang => (
                <span key={lang} className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>
                  {lang}
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

      {/* Project Plan Result */}
      {plan && (
        <div className="border-t px-6 py-4 animate-fade-up" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Project Plan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Archetype</div>
                <div className="text-sm font-bold" style={{ color: 'var(--ept-accent)' }}>{plan.archetype}</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Language</div>
                <div className="text-sm font-bold font-mono" style={{ color: 'var(--ept-text)' }}>{plan.language}</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Est. Files</div>
                <div className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>{plan.estimated_files}</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Est. Lines</div>
                <div className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>{plan.estimated_lines?.toLocaleString()}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Framework</div>
                <div className="text-sm" style={{ color: 'var(--ept-text)' }}>{plan.framework}</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Timeline</div>
                <div className="text-sm" style={{ color: 'var(--ept-text)' }}>{plan.estimated_time}</div>
              </div>
            </div>
            {plan.stages?.length > 0 && (
              <div className="mt-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                <strong>Stages:</strong> {plan.stages.join(' → ')}
              </div>
            )}
            {plan.dependencies?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {plan.dependencies.map(dep => (
                  <span key={dep} className="text-[10px] font-mono px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
                    {dep}
                  </span>
                ))}
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
                placeholder="Describe what you want to build..."
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
            {readyToBuild && (
              <button
                onClick={handleBuild}
                disabled={planning}
                className="px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: '#10b981', color: '#fff' }}>
                {planning ? 'Planning...' : 'Start Build'}
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

      {/* ─── Software Engineering Doctrine ─── */}
      <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px' }}>
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--ept-text)' }}>Software Architecture Doctrine</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>Query engineering doctrine for best practices on architecture, DevOps, testing, and cloud infrastructure.</p>
          <EngineQueryPanel
            domains={['PROG', 'WEBAPP', 'DEVOPS', 'AIML', 'CLOUD', 'MOBILE', 'SAAS', 'TEST']}
            title="Software Doctrine Search"
            placeholder="Ask about architecture patterns, CI/CD, testing strategies, cloud design..."
            exampleQueries={[
              'Microservices vs monolith trade-offs',
              'CI/CD pipeline security best practices',
              'React performance optimization patterns',
              'Kubernetes horizontal pod autoscaling',
            ]}
            showStats
          />
        </div>
      </div>
    </div>
  );
}
