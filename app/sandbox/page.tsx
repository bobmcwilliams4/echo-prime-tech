'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

const SANDBOX_API = 'https://echo-security-sandbox.bmcii1976.workers.dev';

interface Challenge {
  id: string; category: string; title: string; difficulty: string;
  points: number; description: string; endpoint: string;
  owasp: string; mitre: string; tools: string[]; hint?: string;
}

interface SolvedEntry { challenge_id: string; solved_at: string; points: number; }
interface DefenseResult { checks?: any[]; findings?: any[]; grade?: string; tests?: any[]; records?: any; }
interface RequestLog { method: string; url: string; body?: string; status?: number; response?: string; time?: number; }

const CATEGORY_META: Record<string, { icon: string; label: string; color: string }> = {
  injection: { icon: '💉', label: 'Injection', color: '#ef4444' },
  xss: { icon: '🔀', label: 'Cross-Site Scripting', color: '#f97316' },
  auth: { icon: '🔐', label: 'Authentication', color: '#eab308' },
  ssrf: { icon: '🌐', label: 'SSRF', color: '#22c55e' },
  access: { icon: '🚪', label: 'Access Control', color: '#3b82f6' },
  traversal: { icon: '📁', label: 'Path Traversal', color: '#8b5cf6' },
  crypto: { icon: '🔑', label: 'Cryptography', color: '#ec4899' },
  upload: { icon: '📤', label: 'File Upload', color: '#14b8a6' },
  api: { icon: '⚡', label: 'API Security', color: '#06b6d4' },
  misconfig: { icon: '⚙️', label: 'Misconfiguration', color: '#f43f5e' },
};

const DIFF_COLORS: Record<string, string> = { beginner: '#22c55e', intermediate: '#eab308', advanced: '#ef4444' };

export default function SandboxPage() {
  const [tab, setTab] = useState<'challenges' | 'defense' | 'logs'>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sessionId, setSessionId] = useState('');
  const [solved, setSolved] = useState<SolvedEntry[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [flagInput, setFlagInput] = useState('');
  const [flagResult, setFlagResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');

  // HTTP Request Builder
  const [reqMethod, setReqMethod] = useState('GET');
  const [reqUrl, setReqUrl] = useState('');
  const [reqBody, setReqBody] = useState('');
  const [reqHeaders, setReqHeaders] = useState('');
  const [response, setResponse] = useState('');
  const [responseStatus, setResponseStatus] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<RequestLog[]>([]);

  // Defense Scanner
  const [defenseUrl, setDefenseUrl] = useState('https://echo-ept.com');
  const [defenseDomain, setDefenseDomain] = useState('echo-ept.com');
  const [defenseType, setDefenseType] = useState<'headers' | 'ssl' | 'dns' | 'scan' | 'waf'>('headers');
  const [defenseResult, setDefenseResult] = useState<DefenseResult | null>(null);
  const [defenseLoading, setDefenseLoading] = useState(false);

  const responseRef = useRef<HTMLPreElement>(null);

  // ─── Init ───
  useEffect(() => {
    (async () => {
      try {
        const [chRes, sessRes] = await Promise.all([
          fetch(`${SANDBOX_API}/challenges`).then(r => r.json()),
          fetch(`${SANDBOX_API}/session/start`, { method: 'POST' }).then(r => r.json()),
        ]);
        setChallenges(chRes.challenges || []);
        setMaxPoints(chRes.total_points || 0);
        setSessionId(sessRes.session_id || '');
      } catch {}
    })();
  }, []);

  // ─── Load progress ───
  const refreshProgress = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${SANDBOX_API}/progress/${sessionId}`).then(r => r.json());
      setSolved(res.solved || []);
      setTotalPoints(res.total_points || 0);
    } catch {}
  }, [sessionId]);

  useEffect(() => { refreshProgress(); }, [refreshProgress]);

  // ─── Send HTTP Request ───
  const sendRequest = async () => {
    if (!reqUrl) return;
    setLoading(true);
    setFlagResult(null);
    const fullUrl = reqUrl.startsWith('http') ? reqUrl : `${SANDBOX_API}${reqUrl.startsWith('/') ? '' : '/'}${reqUrl}`;
    const start = performance.now();
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (reqHeaders.trim()) {
        reqHeaders.split('\n').forEach(line => {
          const [k, ...v] = line.split(':');
          if (k && v.length) headers[k.trim()] = v.join(':').trim();
        });
      }
      const opts: RequestInit = { method: reqMethod, headers };
      if (['POST', 'PUT', 'PATCH'].includes(reqMethod) && reqBody) opts.body = reqBody;
      const res = await fetch(fullUrl, opts);
      const elapsed = Math.round(performance.now() - start);
      const text = await res.text();
      let formatted = text;
      try { formatted = JSON.stringify(JSON.parse(text), null, 2); } catch {}
      setResponse(formatted);
      setResponseStatus(res.status);
      setResponseTime(elapsed);
      setLogs(prev => [{ method: reqMethod, url: fullUrl, body: reqBody || undefined, status: res.status, response: formatted.slice(0, 500), time: elapsed }, ...prev.slice(0, 99)]);
    } catch (e: any) {
      setResponse(`Error: ${e.message}`);
      setResponseStatus(0);
      setResponseTime(Math.round(performance.now() - start));
    }
    setLoading(false);
  };

  // ─── Submit Flag ───
  const submitFlag = async () => {
    if (!selectedChallenge || !flagInput) return;
    try {
      const res = await fetch(`${SANDBOX_API}/challenge/${selectedChallenge.id}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag: flagInput, session_id: sessionId }),
      }).then(r => r.json());
      setFlagResult(res);
      if (res.correct) { refreshProgress(); setFlagInput(''); }
    } catch {}
  };

  // ─── Load Hint ───
  const loadHint = async () => {
    if (!selectedChallenge) return;
    try {
      const res = await fetch(`${SANDBOX_API}/hint/${selectedChallenge.id}`).then(r => r.json());
      setHint(res.hint || 'No hint available');
      setShowHint(true);
    } catch {}
  };

  // ─── Defense Scanner ───
  const runDefenseScan = async () => {
    setDefenseLoading(true);
    setDefenseResult(null);
    try {
      const body = defenseType === 'dns' ? { domain: defenseDomain } : { url: defenseUrl };
      const res = await fetch(`${SANDBOX_API}/defense/${defenseType}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      }).then(r => r.json());
      setDefenseResult(res);
    } catch (e: any) {
      setDefenseResult({ findings: [{ severity: 'ERROR', finding: e.message }] });
    }
    setDefenseLoading(false);
  };

  // ─── Filter challenges ───
  const filtered = selectedCategory === 'all' ? challenges : challenges.filter(ch => ch.category === selectedCategory);
  const solvedIds = new Set(solved.map(s => s.challenge_id));
  const categories = ['all', ...new Set(challenges.map(ch => ch.category))];
  const completionPct = challenges.length > 0 ? Math.round((solved.length / challenges.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e17', color: '#e5e7eb', fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}>
      {/* ─── Top Bar ─── */}
      <div style={{ background: 'linear-gradient(90deg, #0f1724, #111d2e)', borderBottom: '1px solid #1e3a5f', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: '#6ee7b7', textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>ECHO PRIME</Link>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ color: '#00ff88', fontWeight: 700, fontSize: 16 }}>SECURITY SANDBOX</span>
          <span style={{ color: '#475569', fontSize: 12 }}>v1.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#6ee7b7', fontSize: 20 }}>🏆</span>
            <span style={{ color: '#6ee7b7', fontWeight: 700, fontSize: 18 }}>{totalPoints}</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>/ {maxPoints} pts</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#38bdf8', fontSize: 20 }}>🎯</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{solved.length}/{challenges.length}</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>solved</span>
          </div>
          <div style={{ width: 120, height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${completionPct}%`, height: '100%', background: 'linear-gradient(90deg, #00ff88, #38bdf8)', borderRadius: 3, transition: 'width 0.5s' }} />
          </div>
          <span style={{ color: '#64748b', fontSize: 12 }}>{completionPct}%</span>
        </div>
      </div>

      {/* ─── Tab Bar ─── */}
      <div style={{ display: 'flex', gap: 2, padding: '0 24px', background: '#0d1117', borderBottom: '1px solid #1e293b' }}>
        {(['challenges', 'defense', 'logs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 24px', background: tab === t ? '#111827' : 'transparent', color: tab === t ? '#00ff88' : '#64748b',
            border: 'none', borderBottom: tab === t ? '2px solid #00ff88' : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: tab === t ? 700 : 400, textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {t === 'challenges' ? '🎯 Challenges' : t === 'defense' ? '🛡️ Defense Scanner' : '📋 Request Log'}
          </button>
        ))}
      </div>

      {tab === 'challenges' && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
          {/* ─── Category Sidebar ─── */}
          <div style={{ background: '#0d1117', borderRight: '1px solid #1e293b', overflowY: 'auto', padding: '12px 0' }}>
            {categories.map(cat => {
              const meta = cat === 'all' ? { icon: '📋', label: 'All Challenges', color: '#6ee7b7' } : CATEGORY_META[cat] || { icon: '❓', label: cat, color: '#64748b' };
              const count = cat === 'all' ? challenges.length : challenges.filter(ch => ch.category === cat).length;
              const catSolved = cat === 'all' ? solved.length : challenges.filter(ch => ch.category === cat && solvedIds.has(ch.id)).length;
              return (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                  width: '100%', padding: '10px 16px', background: selectedCategory === cat ? '#111827' : 'transparent',
                  border: 'none', borderLeft: selectedCategory === cat ? `3px solid ${meta.color}` : '3px solid transparent',
                  color: selectedCategory === cat ? meta.color : '#94a3b8', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>{meta.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: selectedCategory === cat ? 700 : 400 }}>{meta.label}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{catSolved}/{count}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ─── Challenge List + Detail ─── */}
          <div style={{ overflowY: 'auto', borderRight: '1px solid #1e293b' }}>
            {filtered.map(ch => {
              const isSolved = solvedIds.has(ch.id);
              const meta = CATEGORY_META[ch.category] || { icon: '❓', label: ch.category, color: '#64748b' };
              return (
                <button key={ch.id} onClick={() => { setSelectedChallenge(ch); setReqUrl(ch.endpoint); setReqMethod('GET'); setFlagResult(null); setShowHint(false); setFlagInput(''); }} style={{
                  width: '100%', padding: '14px 16px', background: selectedChallenge?.id === ch.id ? '#111827' : 'transparent',
                  border: 'none', borderBottom: '1px solid #1e293b', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit', opacity: isSolved ? 0.6 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{isSolved ? '✅' : meta.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: isSolved ? '#6ee7b7' : '#e5e7eb', fontWeight: 600, fontSize: 14 }}>{ch.title}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 11 }}>
                        <span style={{ color: DIFF_COLORS[ch.difficulty], background: `${DIFF_COLORS[ch.difficulty]}15`, padding: '1px 6px', borderRadius: 4 }}>{ch.difficulty}</span>
                        <span style={{ color: '#eab308' }}>{ch.points} pts</span>
                        <span style={{ color: '#64748b' }}>{ch.owasp}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ─── Right Panel: Challenge Detail + HTTP Builder ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selectedChallenge ? (
              <>
                {/* Challenge Info */}
                <div style={{ padding: 16, borderBottom: '1px solid #1e293b', overflowY: 'auto', maxHeight: '35%' }}>
                  <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 16 }}>{selectedChallenge.title}</h3>
                  <div style={{ display: 'flex', gap: 8, margin: '8px 0', flexWrap: 'wrap' }}>
                    <span style={{ background: '#1e293b', color: DIFF_COLORS[selectedChallenge.difficulty], padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{selectedChallenge.difficulty}</span>
                    <span style={{ background: '#1e293b', color: '#eab308', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{selectedChallenge.points} pts</span>
                    <span style={{ background: '#1e293b', color: '#f87171', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{selectedChallenge.owasp}</span>
                    <span style={{ background: '#1e293b', color: '#a78bfa', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{selectedChallenge.mitre}</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: '8px 0' }}>{selectedChallenge.description}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {selectedChallenge.tools.map(t => (
                      <span key={t} style={{ background: '#0f172a', border: '1px solid #1e3a5f', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{t}</span>
                    ))}
                  </div>
                  {/* Hint */}
                  <div style={{ marginTop: 8 }}>
                    {!showHint ? (
                      <button onClick={loadHint} style={{ background: 'none', border: '1px solid #374151', color: '#eab308', cursor: 'pointer', padding: '4px 12px', borderRadius: 4, fontFamily: 'inherit', fontSize: 12 }}>💡 Show Hint (-50% pts)</button>
                    ) : (
                      <div style={{ background: '#1a1a2e', border: '1px solid #eab30830', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#eab308' }}>💡 {hint}</div>
                    )}
                  </div>
                  {/* Flag Submission */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <input value={flagInput} onChange={e => setFlagInput(e.target.value)} placeholder="FLAG{...}" onKeyDown={e => e.key === 'Enter' && submitFlag()}
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #1e3a5f', color: '#e5e7eb', padding: '8px 12px', borderRadius: 6, fontFamily: 'inherit', fontSize: 13 }} />
                    <button onClick={submitFlag} style={{ background: 'linear-gradient(135deg, #00ff88, #00cc66)', color: '#000', border: 'none', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 13 }}>Submit Flag</button>
                  </div>
                  {flagResult && (
                    <div style={{ marginTop: 8, padding: '6px 12px', borderRadius: 6, fontSize: 13, background: flagResult.correct ? '#00ff8815' : '#ef444415', color: flagResult.correct ? '#00ff88' : '#ef4444', border: `1px solid ${flagResult.correct ? '#00ff8830' : '#ef444430'}` }}>
                      {flagResult.correct ? '🎉' : '❌'} {flagResult.message}
                    </div>
                  )}
                </div>

                {/* HTTP Request Builder */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '8px 16px', background: '#0d1117', borderBottom: '1px solid #1e293b', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select value={reqMethod} onChange={e => setReqMethod(e.target.value)} style={{ background: '#1e293b', color: reqMethod === 'GET' ? '#22c55e' : reqMethod === 'POST' ? '#eab308' : '#ef4444', border: '1px solid #374151', padding: '6px 8px', borderRadius: 4, fontFamily: 'inherit', fontSize: 12, fontWeight: 700 }}>
                      {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input value={reqUrl} onChange={e => setReqUrl(e.target.value)} placeholder="/vuln/sqli/basic?id=1" onKeyDown={e => e.key === 'Enter' && sendRequest()}
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #1e3a5f', color: '#e5e7eb', padding: '6px 12px', borderRadius: 4, fontFamily: 'inherit', fontSize: 13 }} />
                    <button onClick={sendRequest} disabled={loading} style={{ background: loading ? '#374151' : 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', padding: '6px 20px', borderRadius: 4, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700 }}>
                      {loading ? '⏳' : '▶ Send'}
                    </button>
                  </div>
                  {/* Body & Headers */}
                  {['POST', 'PUT', 'PATCH'].includes(reqMethod) && (
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e293b' }}>
                      <textarea value={reqBody} onChange={e => setReqBody(e.target.value)} placeholder='{"key": "value"}' rows={3}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #1e3a5f', color: '#e5e7eb', padding: '8px', borderRadius: 4, fontFamily: 'inherit', fontSize: 12, resize: 'vertical' }} />
                    </div>
                  )}
                  {/* Headers input */}
                  <div style={{ padding: '4px 16px', borderBottom: '1px solid #1e293b' }}>
                    <input value={reqHeaders} onChange={e => setReqHeaders(e.target.value)} placeholder="Authorization: Bearer xxx" style={{ width: '100%', background: '#0f172a', border: '1px solid #1e3a5f', color: '#e5e7eb', padding: '4px 8px', borderRadius: 4, fontFamily: 'inherit', fontSize: 11 }} />
                  </div>
                  {/* Response */}
                  <div style={{ flex: 1, overflowY: 'auto', background: '#0a0e17' }}>
                    {responseStatus > 0 && (
                      <div style={{ padding: '4px 16px', background: '#0d1117', borderBottom: '1px solid #1e293b', display: 'flex', gap: 16, fontSize: 12 }}>
                        <span style={{ color: responseStatus < 300 ? '#22c55e' : responseStatus < 400 ? '#eab308' : '#ef4444', fontWeight: 700 }}>HTTP {responseStatus}</span>
                        <span style={{ color: '#64748b' }}>{responseTime}ms</span>
                      </div>
                    )}
                    <pre ref={responseRef} style={{ padding: 16, margin: 0, fontSize: 12, color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                      {response || 'Send a request to see the response here...'}
                    </pre>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                  <div>Select a challenge to begin</div>
                  <div style={{ fontSize: 12, marginTop: 8, color: '#374151' }}>{challenges.length} challenges across {Object.keys(CATEGORY_META).length} categories</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'defense' && (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ color: '#38bdf8', margin: '0 0 8px 0', fontSize: 22 }}>🛡️ Defense Scanner</h2>
          <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: 14 }}>Test your infrastructure security posture. Scan any URL for vulnerabilities, misconfigurations, and security header issues.</p>

          {/* Scanner Type Selection */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {([
              { key: 'headers', label: '🔒 Headers', desc: 'Security headers analysis' },
              { key: 'ssl', label: '🔐 SSL/TLS', desc: 'Certificate & protocol check' },
              { key: 'dns', label: '🌐 DNS', desc: 'DNS records & email security' },
              { key: 'scan', label: '🔍 Vuln Scan', desc: 'Vulnerability assessment' },
              { key: 'waf', label: '🛡️ WAF Test', desc: 'Firewall bypass testing' },
            ] as const).map(({ key, label, desc }) => (
              <button key={key} onClick={() => setDefenseType(key)} style={{
                padding: '10px 16px', background: defenseType === key ? '#1e3a5f' : '#111827',
                border: `1px solid ${defenseType === key ? '#38bdf8' : '#1e293b'}`, borderRadius: 8, cursor: 'pointer',
                color: defenseType === key ? '#38bdf8' : '#94a3b8', fontFamily: 'inherit', textAlign: 'left',
              }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{desc}</div>
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {defenseType === 'dns' ? (
              <input value={defenseDomain} onChange={e => setDefenseDomain(e.target.value)} placeholder="echo-ept.com" style={{ flex: 1, background: '#0f172a', border: '1px solid #1e3a5f', color: '#e5e7eb', padding: '10px 16px', borderRadius: 8, fontFamily: 'inherit', fontSize: 14 }} />
            ) : (
              <input value={defenseUrl} onChange={e => setDefenseUrl(e.target.value)} placeholder="https://echo-ept.com" style={{ flex: 1, background: '#0f172a', border: '1px solid #1e3a5f', color: '#e5e7eb', padding: '10px 16px', borderRadius: 8, fontFamily: 'inherit', fontSize: 14 }} />
            )}
            <button onClick={runDefenseScan} disabled={defenseLoading} style={{
              background: defenseLoading ? '#374151' : 'linear-gradient(135deg, #38bdf8, #6366f1)', color: '#fff', border: 'none',
              padding: '10px 28px', borderRadius: 8, cursor: defenseLoading ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
            }}>
              {defenseLoading ? '⏳ Scanning...' : '🔍 Scan'}
            </button>
          </div>

          {/* Results */}
          {defenseResult && (
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 12, overflow: 'hidden' }}>
              {/* Grade */}
              {defenseResult.grade && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 900,
                    background: defenseResult.grade === 'A+' || defenseResult.grade === 'A' ? '#00ff8820' : defenseResult.grade === 'B' ? '#eab30820' : '#ef444420',
                    color: defenseResult.grade === 'A+' || defenseResult.grade === 'A' ? '#00ff88' : defenseResult.grade === 'B' ? '#eab308' : '#ef4444',
                    border: `2px solid ${defenseResult.grade === 'A+' || defenseResult.grade === 'A' ? '#00ff88' : defenseResult.grade === 'B' ? '#eab308' : '#ef4444'}`,
                  }}>
                    {defenseResult.grade}
                  </div>
                  <div>
                    <div style={{ color: '#e5e7eb', fontWeight: 700, fontSize: 16 }}>Security Grade</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>
                      {defenseResult.grade === 'A+' || defenseResult.grade === 'A' ? 'Excellent security posture' : defenseResult.grade === 'B' ? 'Good, but room for improvement' : 'Needs attention'}
                    </div>
                  </div>
                </div>
              )}

              {/* Checks / Findings */}
              <div style={{ padding: 16 }}>
                {(defenseResult.checks || defenseResult.findings || defenseResult.tests || []).map((item: any, i: number) => (
                  <div key={i} style={{
                    padding: '10px 16px', marginBottom: 8, borderRadius: 8,
                    background: (item.status === 'pass' || item.blocked) ? '#00ff8808' : item.status === 'fail' || item.severity === 'HIGH' ? '#ef444408' : '#eab30808',
                    border: `1px solid ${(item.status === 'pass' || item.blocked) ? '#00ff8820' : item.status === 'fail' || item.severity === 'HIGH' ? '#ef444420' : '#eab30820'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{(item.status === 'pass' || item.blocked) ? '✅' : item.status === 'fail' || item.severity === 'HIGH' ? '❌' : '⚠️'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 13 }}>{item.name || item.check || item.finding || item.test}</div>
                        <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{item.value || item.detail || item.remediation || item.verdict || ''}</div>
                      </div>
                      {item.severity && <span style={{ color: item.severity === 'HIGH' ? '#ef4444' : item.severity === 'MEDIUM' ? '#eab308' : '#64748b', fontSize: 11, fontWeight: 700 }}>{item.severity}</span>}
                    </div>
                  </div>
                ))}

                {/* DNS Records */}
                {defenseResult.records && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ color: '#38bdf8', margin: '0 0 8px 0' }}>DNS Records</h4>
                    {Object.entries(defenseResult.records).map(([type, records]: [string, any]) => (
                      <div key={type} style={{ marginBottom: 8 }}>
                        <div style={{ color: '#eab308', fontWeight: 700, fontSize: 12 }}>{type}</div>
                        {(records as any[]).length > 0 ? (records as any[]).map((r: any, i: number) => (
                          <div key={i} style={{ color: '#94a3b8', fontSize: 12, paddingLeft: 16 }}>{r.data || JSON.stringify(r)}</div>
                        )) : <div style={{ color: '#475569', fontSize: 12, paddingLeft: 16 }}>No records</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Scan Targets */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ color: '#64748b', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px 0' }}>Quick Scan — Our Infrastructure</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'echo-ept.com', url: 'https://echo-ept.com', domain: 'echo-ept.com' },
                { label: 'echo-op.com', url: 'https://echo-op.com', domain: 'echo-op.com' },
                { label: 'Swarm Brain', url: 'https://echo-swarm-brain.bmcii1976.workers.dev', domain: 'echo-swarm-brain.bmcii1976.workers.dev' },
                { label: 'Memory Prime', url: 'https://echo-memory-prime.bmcii1976.workers.dev', domain: 'echo-memory-prime.bmcii1976.workers.dev' },
                { label: 'Shared Brain', url: 'https://echo-shared-brain.bmcii1976.workers.dev', domain: 'echo-shared-brain.bmcii1976.workers.dev' },
                { label: 'ShadowGlass', url: 'https://shadowglass-v8-warpspeed.bmcii1976.workers.dev', domain: 'shadowglass-v8-warpspeed.bmcii1976.workers.dev' },
                { label: 'Forge-X', url: 'https://forge-x-cloud.bmcii1976.workers.dev', domain: 'forge-x-cloud.bmcii1976.workers.dev' },
                { label: 'EPT API', url: 'https://ept-api.bmcii1976.workers.dev', domain: 'ept-api.bmcii1976.workers.dev' },
              ].map(target => (
                <button key={target.label} onClick={() => { setDefenseUrl(target.url); setDefenseDomain(target.domain); }} style={{
                  background: '#0f172a', border: '1px solid #1e3a5f', color: '#38bdf8', padding: '6px 12px',
                  borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
                }}>
                  {target.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'logs' && (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ color: '#94a3b8', margin: 0, fontSize: 18 }}>📋 Request Log ({logs.length})</h2>
            <button onClick={() => setLogs([])} style={{ background: '#1e293b', border: '1px solid #374151', color: '#ef4444', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>Clear</button>
          </div>
          {logs.length === 0 ? (
            <div style={{ color: '#475569', textAlign: 'center', padding: 40, fontSize: 14 }}>No requests yet. Start testing challenges!</div>
          ) : logs.map((log, i) => (
            <div key={i} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8, padding: '12px 16px', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <span style={{ color: log.method === 'GET' ? '#22c55e' : '#eab308', fontWeight: 700, fontSize: 12, minWidth: 50 }}>{log.method}</span>
                <span style={{ color: log.status && log.status < 300 ? '#22c55e' : log.status && log.status < 400 ? '#eab308' : '#ef4444', fontWeight: 700, fontSize: 12 }}>{log.status || '???'}</span>
                <span style={{ color: '#94a3b8', fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.url}</span>
                <span style={{ color: '#475569', fontSize: 11 }}>{log.time}ms</span>
              </div>
              {log.response && (
                <pre style={{ margin: 0, fontSize: 11, color: '#64748b', whiteSpace: 'pre-wrap', maxHeight: 100, overflow: 'hidden' }}>{log.response}</pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Security Doctrine Hints ─── */}
      <div style={{ padding: '0 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: '#0c1220', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 12 }}>Security Doctrine Knowledge Base</h3>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Search security doctrine for hints, learning material, and deep technical knowledge about vulnerabilities and exploitation techniques.</p>
          <EngineQueryPanel
            domains={['CYBER', 'MALWARE', 'REVENG']}
            title="CTF Knowledge Base"
            placeholder="Search security doctrine for hints and learning material..."
            exampleQueries={[
              'Cross-site scripting prevention methods',
              'Buffer overflow exploitation techniques',
              'SQL injection detection and bypass',
            ]}
            showStats={false}
          />
        </div>
      </div>
    </div>
  );
}
