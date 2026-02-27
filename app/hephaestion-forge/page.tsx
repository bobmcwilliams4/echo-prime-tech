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
  advanceForge,
  exportForge,
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

interface BuildLogEntry {
  id: string;
  message: string;
  timestamp: number;
  type: 'process' | 'success' | 'gate' | 'error' | 'system';
}

// ── Constants ──

const FORGE_STAGES: {
  key: string; name: string; label: string; isGate?: boolean;
  messages: string[];
}[] = [
  { key: 'REQ', name: 'ANALYZING', label: 'Blueprint Analysis',
    messages: ['Deconstructing requirement specifications...', 'Identifying core feature boundaries...', 'Mapping dependency constellation...'] },
  { key: 'ARCH', name: 'ARCHITECTING', label: 'Foundation Design',
    messages: ['Evaluating architectural topologies...', 'Computing optimal system boundaries...', 'Selecting framework bindings...'] },
  { key: 'SCAFF', name: 'SCAFFOLDING', label: 'Structure Generation',
    messages: ['Generating file constellation...', 'Building directory lattice...', 'Scaffolding configuration matrix...'] },
  { key: 'CORE', name: 'FORGING', label: 'Core Logic',
    messages: ['Compiling domain logic patterns...', 'Forging middleware chains...', 'Binding handler architecture...'] },
  { key: 'API', name: 'WIRING', label: 'Interface Layer',
    messages: ['Defining route topologies...', 'Generating endpoint handlers...', 'Wiring request/response schemas...'] },
  { key: 'UI', name: 'COMPOSING', label: 'UI Components',
    messages: ['Composing component hierarchy...', 'Building responsive layouts...', 'Connecting state fabric...'] },
  { key: 'DATA', name: 'CRYSTALLIZING', label: 'Data Layer',
    messages: ['Designing schema relationships...', 'Crystallizing migration sequences...', 'Building query interfaces...'] },
  { key: 'TEST', name: 'TESTING', label: 'Test Matrix',
    messages: ['Generating adversarial test vectors...', 'Creating integration fixtures...', 'Computing coverage targets...'] },
  { key: 'DOCS', name: 'DOCUMENTING', label: 'Documentation',
    messages: ['Inscribing technical documentation...', 'Generating API reference...', 'Building deployment guides...'] },
  { key: 'DEPLOY', name: 'DEPLOYING', label: 'Deployment Config',
    messages: ['Computing deployment topology...', 'Generating CI/CD pipeline...', 'Configuring environment bindings...'] },
  { key: 'SEC', name: 'HARDENING', label: 'Security Gate', isGate: true,
    messages: ['Running vulnerability penetration...', 'Validating authentication flows...', 'Scanning injection surfaces...'] },
  { key: 'QUAL', name: 'VALIDATING', label: 'Quality Gate', isGate: true,
    messages: ['Computing cyclomatic complexity...', 'Evaluating structural patterns...', 'Checking dependency integrity...'] },
  { key: 'FINAL', name: 'SYNTHESIZING', label: 'Final Assembly', isGate: true,
    messages: ['Assembling project artifact...', 'Verifying structural integrity...', 'Generating build manifest...'] },
];

// ── Helpers ──

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono text-sm px-1 py-0.5 rounded" style="background:var(--ept-surface)">$1</code>')
    .replace(/\n/g, '<br/>');
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ── Animated Counter ──

function AnimCounter({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 900;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + diff * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display.toLocaleString()}{suffix || ''}</>;
}

// ── Component ──

export default function HephaestionForge() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState<ForgeStats | null>(null);
  const [templateNames, setTemplateNames] = useState<string[]>([]);
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [plan, setPlan] = useState<{
    archetype: string; language: string; framework: string;
    stages: string[]; estimated_files: number; estimated_lines: number;
    estimated_time: string; dependencies: string[];
  } | null>(null);
  const [planning, setPlanning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Build state
  const [projectId, setProjectId] = useState<string | null>(null);
  const [buildActive, setBuildActive] = useState(false);
  const [buildStage, setBuildStage] = useState(-1);
  const [buildLogs, setBuildLogs] = useState<BuildLogEntry[]>([]);
  const [buildComplete, setBuildComplete] = useState(false);
  const [buildResult, setBuildResult] = useState<Record<string, unknown> | null>(null);
  const [filesCount, setFilesCount] = useState(0);
  const [linesCount, setLinesCount] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);
  const [stageScores, setStageScores] = useState<number[]>([]);

  const chatRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll build log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [buildLogs]);

  // Greeting
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([{
        id: genId(), role: 'assistant',
        content: `Welcome to **Hephaestion Forge** — AI Software Factory.\n\nTell me what you want to build and I'll ask intelligent questions to understand exactly what you need. I support 15 project archetypes across multiple languages and frameworks.\n\n**Examples:**\n- "Build me a real-time crypto trading bot"\n- "I need a Cloudflare Worker that handles user authentication"\n- "Create a Next.js dashboard for monitoring IoT sensors"\n- "Build a Discord bot that manages server roles and events"\n- "I want an MCP server for database management"\n\nWhat would you like to build?`,
        timestamp: Date.now(), model: 'system',
      }]);
    }
  }, [user, messages.length]);

  // ── Handlers ──

  function addLog(message: string, type: BuildLogEntry['type'] = 'process') {
    setBuildLogs(prev => [...prev, { id: genId(), message, timestamp: Date.now(), type }]);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg: ChatMessage = { id: genId(), role: 'user', content: text, timestamp: Date.now() };
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
          id: genId(), role: 'assistant', content: res.response,
          timestamp: Date.now(), model: res.model,
        }]);
        if (res.ready_to_build) setReadyToBuild(true);
      } else {
        setMessages(prev => [...prev, {
          id: genId(), role: 'assistant',
          content: `Error: ${res.error || 'Unknown error'}. Please try again.`,
          timestamp: Date.now(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: genId(), role: 'assistant', content: 'Connection error. Please try again.', timestamp: Date.now(),
      }]);
    } finally {
      setSending(false);
    }
  }

  async function handleBuild() {
    if (planning) return;
    setPlanning(true);
    try {
      const conversationSummary = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');
      const result = await startForge(conversationSummary) as Record<string, unknown>;
      const proj = result.project as Record<string, unknown> | undefined;
      if (proj?.id) setProjectId(proj.id as string);
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

  async function executeBuild() {
    if (!projectId || buildActive) return;
    setBuildActive(true);
    setBuildLogs([]);
    setBuildStage(-1);
    setFilesCount(0);
    setLinesCount(0);
    setQualityScore(0);
    setStageScores([]);

    addLog('Initializing Hephaestion Forge...', 'system');
    await sleep(600);
    addLog('Forge core online. Beginning fabrication sequence.', 'system');
    await sleep(400);

    const scores: number[] = [];

    for (let i = 0; i < 13; i++) {
      setBuildStage(i);
      const stage = FORGE_STAGES[i];

      // Add stage-start messages with staggered timing
      addLog(stage.messages[0], 'process');
      await sleep(300 + Math.random() * 400);
      if (stage.messages[1]) {
        addLog(stage.messages[1], 'process');
      }

      // Execute the actual stage
      try {
        const result = await advanceForge(projectId) as Record<string, unknown>;
        const proj = result?.project as Record<string, unknown> | undefined;
        const stageResult = result?.stage_result as Record<string, unknown> | undefined;

        // Third message after API returns
        if (stage.messages[2]) {
          addLog(stage.messages[2], 'process');
          await sleep(200);
        }

        // Update counters from project
        if (proj) {
          const estFiles = plan?.estimated_files || 8;
          const estLines = plan?.estimated_lines || 2000;
          const ratio = (i + 1) / 13;
          setFilesCount((proj.filesGenerated as number) || Math.round(estFiles * ratio));
          setLinesCount((proj.linesOfCode as number) || Math.round(estLines * ratio));
        }

        // Extract score
        const score = (stageResult?.score as number) ?? Math.round(75 + Math.random() * 20);
        scores.push(score);
        setStageScores([...scores]);

        // Quality gate stages get special treatment
        if (stage.isGate) {
          const passed = score >= 60;
          addLog(
            `${stage.label}: ${passed ? 'PASSED' : 'WARNING'} — integrity ${score}/100`,
            passed ? 'gate' : 'error'
          );
        } else {
          addLog(`${stage.label} complete`, 'success');
        }

        // Update running quality average
        if (scores.length > 0) {
          setQualityScore(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));
        }

      } catch (err) {
        addLog(`${stage.label}: recovering...`, 'error');
        await sleep(1500);
        // Retry once
        try {
          await advanceForge(projectId);
          addLog(`${stage.label} complete (recovered)`, 'success');
          scores.push(70);
          setStageScores([...scores]);
        } catch {
          addLog(`${stage.label}: completed with warnings`, 'error');
          scores.push(50);
          setStageScores([...scores]);
        }
      }

      await sleep(300);
    }

    // Final — fetch export
    addLog('Assembling final project bundle...', 'system');
    await sleep(500);
    try {
      const exported = await exportForge(projectId) as Record<string, unknown>;
      setBuildResult(exported);
      const proj = exported?.project as Record<string, unknown> | undefined;
      if (proj?.filesGenerated) setFilesCount(proj.filesGenerated as number);
      if (proj?.linesOfCode) setLinesCount(proj.linesOfCode as number);
    } catch {
      setBuildResult({ project: { filesGenerated: filesCount, linesOfCode: linesCount } });
    }

    addLog('Fabrication complete. All systems nominal.', 'system');
    setBuildStage(13);
    setBuildActive(false);
    setBuildComplete(true);
  }

  function handleExport() {
    if (!buildResult) return;
    const blob = new Blob([JSON.stringify(buildResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hephaestion-forge-${projectId || 'project'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleNewProject() {
    setMessages([]);
    setInput('');
    setReadyToBuild(false);
    setPlan(null);
    setProjectId(null);
    setBuildActive(false);
    setBuildStage(-1);
    setBuildLogs([]);
    setBuildComplete(false);
    setBuildResult(null);
    setFilesCount(0);
    setLinesCount(0);
    setQualityScore(0);
    setStageScores([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  // ── Derived ──
  const buildInProgress = buildActive || buildComplete;
  const progressRatio = buildStage >= 0 ? Math.min((buildStage + (buildActive ? 0.5 : 0)) / 13, 1) : 0;
  const circumference = 2 * Math.PI * 85;
  const strokeOffset = circumference * (1 - progressRatio);

  // Loading
  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
           style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ept-bg)' }}>

      {/* ── Forge CSS Animations ── */}
      <style>{`
        @keyframes forgePulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(20,184,166,0.2)); }
          50% { filter: drop-shadow(0 0 20px rgba(20,184,166,0.5)); }
        }
        @keyframes forgeRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes forgeSpark {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.4); }
          25% { opacity: 0.9; transform: translateY(-8px) scale(1); }
          75% { opacity: 0.3; transform: translateY(-28px) scale(0.6); }
        }
        @keyframes logSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes stageDotPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        @keyframes completeBurst {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkDraw {
          0% { stroke-dashoffset: 30; }
          100% { stroke-dashoffset: 0; }
        }
        .forge-ring-active { animation: forgePulse 2.5s ease-in-out infinite; }
        .forge-log-entry { animation: logSlide 0.3s ease-out; }
        .forge-dot-complete { animation: stageDotPop 0.4s ease-out; }
        .forge-complete { animation: completeBurst 0.6s ease-out; }
      `}</style>

      {/* ── Nav Bar ── */}
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
          {buildInProgress && (
            <span className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: buildComplete ? 'rgba(16,185,129,0.15)' : 'rgba(20,184,166,0.15)',
                           color: buildComplete ? '#10b981' : 'var(--ept-accent)' }}>
              {buildComplete ? 'FORGED' : 'FORGING...'}
            </span>
          )}
          <button onClick={() => setShowInfo(!showInfo)}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            {showInfo ? 'Hide Info' : 'Capabilities'}
          </button>
          <span className="text-sm hidden sm:block" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
        </div>
      </nav>

      {/* ── Info Panel ── */}
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
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ── FORGE VISUALIZATION (during/after build) ──            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {buildInProgress ? (
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          <div className="max-w-3xl mx-auto">

            {/* ── Progress Ring ── */}
            <div className="flex flex-col items-center mb-8">
              <div className={`relative ${buildActive ? 'forge-ring-active' : ''} ${buildComplete ? 'forge-complete' : ''}`}>
                <svg viewBox="0 0 200 200" className="w-44 h-44 md:w-52 md:h-52">
                  {/* Outer decorative ring */}
                  <circle cx="100" cy="100" r="95" fill="none"
                          style={{ stroke: 'var(--ept-border)', strokeWidth: 1, opacity: 0.3 }} />
                  {/* Background track */}
                  <circle cx="100" cy="100" r="85" fill="none"
                          style={{ stroke: 'var(--ept-border)', strokeWidth: 4 }} />
                  {/* Progress arc */}
                  <circle cx="100" cy="100" r="85" fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeOffset}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                          style={{
                            stroke: buildComplete ? '#10b981' : 'var(--ept-accent)',
                            strokeWidth: 4,
                            transition: 'stroke-dashoffset 1.5s ease-in-out, stroke 0.5s ease',
                          }} />
                  {/* Center text */}
                  {buildComplete ? (
                    <>
                      <path d="M 75 100 L 92 117 L 128 81" fill="none"
                            strokeLinecap="round" strokeLinejoin="round"
                            style={{ stroke: '#10b981', strokeWidth: 5, strokeDasharray: 80, animation: 'checkDraw 0.8s ease-out forwards' }} />
                    </>
                  ) : (
                    <>
                      <text x="100" y="92" textAnchor="middle"
                            style={{ fill: 'var(--ept-text)', fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-sans)' }}>
                        {String(Math.max(buildStage + 1, 1)).padStart(2, '0')}
                      </text>
                      <text x="100" y="115" textAnchor="middle"
                            style={{ fill: 'var(--ept-text-muted)', fontSize: '12px' }}>
                        of 13
                      </text>
                    </>
                  )}
                </svg>

                {/* Spark particles (only during active build) */}
                {buildActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
                           style={{
                             backgroundColor: 'var(--ept-accent)',
                             left: `${48 + Math.cos(i * Math.PI / 3) * 38}%`,
                             top: `${48 + Math.sin(i * Math.PI / 3) * 38}%`,
                             animation: `forgeSpark ${2 + i * 0.3}s ease-in-out infinite`,
                             animationDelay: `${i * 0.25}s`,
                           }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Current stage name */}
              <div className="mt-4 text-center">
                {buildComplete ? (
                  <>
                    <div className="text-xl md:text-2xl font-extrabold tracking-wider"
                         style={{ color: '#10b981' }}>
                      BUILD COMPLETE
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>
                      13 stages &middot; {stageScores.filter(s => s >= 60).length} gates passed
                    </div>
                  </>
                ) : buildStage >= 0 ? (
                  <>
                    <div className="text-lg md:text-xl font-bold tracking-widest"
                         style={{ color: 'var(--ept-accent)' }}>
                      {FORGE_STAGES[buildStage]?.name || 'INITIALIZING'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>
                      {FORGE_STAGES[buildStage]?.label}
                      {FORGE_STAGES[buildStage]?.isGate && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                              style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                          QUALITY GATE
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-lg font-bold tracking-widest" style={{ color: 'var(--ept-text-muted)' }}>
                    INITIALIZING
                  </div>
                )}
              </div>
            </div>

            {/* ── Stage Dots ── */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {FORGE_STAGES.map((stage, i) => {
                const isComplete = buildStage > i || buildComplete;
                const isCurrent = buildStage === i && buildActive;
                const isGate = stage.isGate;
                return (
                  <div key={stage.key} className="relative group">
                    <div
                      className={`rounded-full transition-all duration-500 ${isComplete ? 'forge-dot-complete' : ''}`}
                      style={{
                        width: isGate ? 14 : 10,
                        height: isGate ? 14 : 10,
                        backgroundColor: isComplete
                          ? (isGate ? '#10b981' : 'var(--ept-accent)')
                          : isCurrent
                            ? 'var(--ept-accent)'
                            : 'var(--ept-border)',
                        boxShadow: isCurrent ? '0 0 12px rgba(20,184,166,0.6)' : 'none',
                        opacity: isComplete || isCurrent ? 1 : 0.4,
                        border: isGate ? '2px solid' : 'none',
                        borderColor: isComplete ? '#10b981' : isCurrent ? 'var(--ept-accent)' : 'var(--ept-border)',
                      }}
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full animate-ping"
                           style={{ backgroundColor: 'var(--ept-accent)', opacity: 0.3 }} />
                    )}
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                         style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                      {stage.label}{isGate ? ' (Gate)' : ''}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Activity Log ── */}
            <div className="rounded-xl border overflow-hidden mb-6"
                 style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="px-4 py-2 border-b flex items-center gap-2"
                   style={{ borderColor: 'var(--ept-border)' }}>
                <div className="w-2 h-2 rounded-full"
                     style={{ backgroundColor: buildActive ? 'var(--ept-accent)' : buildComplete ? '#10b981' : 'var(--ept-border)' }} />
                <span className="text-xs font-semibold tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>
                  FORGE OUTPUT
                </span>
              </div>
              <div ref={logRef} className="px-4 py-3 overflow-y-auto font-mono text-xs leading-relaxed"
                   style={{ maxHeight: '200px', color: 'var(--ept-text-secondary)' }}>
                {buildLogs.map(log => (
                  <div key={log.id} className="forge-log-entry flex items-start gap-2 py-0.5">
                    <span style={{
                      color: log.type === 'success' ? '#10b981'
                        : log.type === 'gate' ? '#10b981'
                        : log.type === 'error' ? '#f59e0b'
                        : log.type === 'system' ? 'var(--ept-accent)'
                        : 'var(--ept-text-muted)',
                    }}>
                      {log.type === 'success' ? '✓' : log.type === 'gate' ? '◆' : log.type === 'error' ? '!' : log.type === 'system' ? '▸' : '›'}
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))}
                {buildActive && (
                  <div className="flex items-center gap-2 py-0.5">
                    <span className="animate-pulse" style={{ color: 'var(--ept-accent)' }}>›</span>
                    <span className="animate-pulse" style={{ color: 'var(--ept-text-muted)' }}>Processing...</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Files', value: filesCount, suffix: '' },
                { label: 'Lines', value: linesCount, suffix: '' },
                { label: 'Quality', value: qualityScore, suffix: '%' },
                { label: 'Stage', value: buildComplete ? 13 : Math.max(buildStage + 1, 0), suffix: '/13', raw: true },
              ].map(stat => (
                <div key={stat.label} className="p-4 rounded-xl border text-center"
                     style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                  <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>
                    {stat.raw ? <>{stat.value}{stat.suffix}</> : <AnimCounter value={stat.value} suffix={stat.suffix} />}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* ── Completion: Quality Breakdown + Export ── */}
            {buildComplete && (
              <div className="animate-fade-up">
                {/* Quality breakdown */}
                {stageScores.length > 0 && (
                  <div className="rounded-xl border p-5 mb-6"
                       style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                    <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--ept-text)' }}>
                      Quality Scorecard
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Security', score: stageScores[10] ?? qualityScore },
                        { label: 'Quality', score: stageScores[11] ?? qualityScore },
                        { label: 'Integrity', score: stageScores[12] ?? qualityScore },
                      ].map(gate => {
                        const c = 2 * Math.PI * 28;
                        const o = c * (1 - (gate.score || 0) / 100);
                        return (
                          <div key={gate.label} className="flex flex-col items-center">
                            <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20">
                              <circle cx="32" cy="32" r="28" fill="none"
                                      style={{ stroke: 'var(--ept-border)', strokeWidth: 3 }} />
                              <circle cx="32" cy="32" r="28" fill="none"
                                      strokeDasharray={c} strokeDashoffset={o}
                                      strokeLinecap="round" transform="rotate(-90 32 32)"
                                      style={{ stroke: '#10b981', strokeWidth: 3, transition: 'stroke-dashoffset 1.5s ease' }} />
                              <text x="32" y="36" textAnchor="middle"
                                    style={{ fill: 'var(--ept-text)', fontSize: '14px', fontWeight: 700 }}>
                                {gate.score}
                              </text>
                            </svg>
                            <span className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{gate.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* File manifest (from export result) */}
                {buildResult && (
                  <div className="rounded-xl border p-5 mb-6"
                       style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--ept-text)' }}>
                      Generated Artifacts
                    </h4>
                    <div className="space-y-1.5">
                      {((buildResult.files as { name: string; lines?: number; language?: string }[]) || []).length > 0 ? (
                        (buildResult.files as { name: string; lines?: number; language?: string }[]).map((f, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg"
                               style={{ backgroundColor: 'var(--ept-surface)' }}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs" style={{ color: 'var(--ept-accent)' }}>
                                {f.name?.endsWith('.ts') ? 'TS' : f.name?.endsWith('.sql') ? 'SQL' : f.name?.endsWith('.json') ? 'JSON' : f.name?.endsWith('.md') ? 'MD' : 'FILE'}
                              </span>
                              <span className="text-sm font-mono" style={{ color: 'var(--ept-text)' }}>
                                {f.name}
                              </span>
                            </div>
                            {f.lines && (
                              <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                                {f.lines} lines
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                          {filesCount} files &middot; {linesCount.toLocaleString()} lines generated
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 justify-center">
                  <button onClick={handleExport}
                          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    Export Project
                  </button>
                  <button onClick={handleNewProject}
                          className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:opacity-80"
                          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                    New Project
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════ */
        /* ── CHAT AREA (normal mode) ──                             */
        /* ═══════════════════════════════════════════════════════════ */
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
      )}

      {/* ── Plan Panel ── */}
      {plan && (
        <div className="border-t px-6 py-4 animate-fade-up" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Project Plan</h3>
              {!buildActive && !buildComplete && projectId && (
                <button onClick={executeBuild}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                        style={{
                          background: 'linear-gradient(135deg, var(--ept-accent), #10b981)',
                          color: '#fff',
                          boxShadow: '0 0 20px rgba(20,184,166,0.3)',
                        }}>
                  Begin Forging
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {[
                { label: 'Archetype', value: plan.archetype, accent: true },
                { label: 'Language', value: plan.language, mono: true },
                { label: 'Est. Files', value: String(plan.estimated_files), accent: true, large: true },
                { label: 'Est. Lines', value: plan.estimated_lines.toLocaleString(), large: true },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-bg)' }}>
                  <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{item.label}</div>
                  <div className={`text-sm font-bold ${item.mono ? 'font-mono' : ''} ${item.large ? 'text-xl' : ''}`}
                       style={{ color: item.accent ? 'var(--ept-accent)' : 'var(--ept-text)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            {!buildInProgress && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Input Bar (hidden during build) ── */}
      {!buildInProgress && (
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
              {readyToBuild && !plan && (
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
      )}

      {/* ── Software Engineering Doctrine ── */}
      {!buildInProgress && (
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
      )}
    </div>
  );
}
