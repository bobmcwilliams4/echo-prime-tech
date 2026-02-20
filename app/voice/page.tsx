'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from '../../lib/theme-context';

// ─── Constants ───
const TTS_API = 'https://tts.echo-op.com';
const MAX_CLONE_SIZE = 50 * 1024 * 1024;
const MAX_TEXT_LENGTH = 50_000;
const ENGINE_VERSION = '3.0.0';

interface Voice { id: string; name: string; description: string; has_ref_audio: boolean; created: string; }
interface HealthData { status: string; model: string; sample_rate: number; voices_available: number; gpu: { name?: string; vram_free_gb?: number; vram_total_gb?: number; vram_used_pct?: number }; stats: { total_requests: number; total_audio_seconds: number; uptime_human: string; avg_generation_time_ms: number }; }
interface HistoryItem { id: string; text: string; voiceId: string; voiceName: string; timestamp: number; audioUrl: string; duration: number; genTime: number; }

type Section = 'tts' | 'projects' | 'cloning' | 'library' | 'sound-effects' | 'voice-design' | 'audio-isolation' | 'speech-to-speech' | 'api';

// ─── Shared components ───
function Slider({ label, value, onChange, min, max, step, unit, description }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit?: string; description?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{label}</label>
        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--ept-accent)' }}>{value.toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0)}{unit || ''}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-slider"
        style={{ background: `linear-gradient(to right, var(--ept-accent) 0%, var(--ept-accent) ${((value - min) / (max - min)) * 100}%, var(--ept-surface) ${((value - min) / (max - min)) * 100}%, var(--ept-surface) 100%)` }} />
      {description && <p className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{description}</p>}
    </div>
  );
}

function Waveform({ audioUrl, isPlaying }: { audioUrl: string | null; isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const barsRef = useRef<number[]>(Array.from({ length: 80 }, () => Math.random() * 0.3));
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const bars = barsRef.current, barW = w / bars.length;
      for (let i = 0; i < bars.length; i++) {
        if (isPlaying) { bars[i] += (Math.random() - 0.5) * 0.15; bars[i] = Math.max(0.05, Math.min(1, bars[i])); }
        else if (audioUrl) { bars[i] += (0.15 - bars[i]) * 0.05; }
        else { bars[i] += (0.03 - bars[i]) * 0.08; }
        const barH = bars[i] * h, x = i * barW;
        const g = ctx.createLinearGradient(0, h / 2 - barH / 2, 0, h / 2 + barH / 2);
        g.addColorStop(0, isPlaying ? 'rgba(20, 184, 166, 0.9)' : 'rgba(20, 184, 166, 0.3)');
        g.addColorStop(0.5, isPlaying ? 'rgba(13, 115, 119, 1)' : 'rgba(13, 115, 119, 0.5)');
        g.addColorStop(1, isPlaying ? 'rgba(20, 184, 166, 0.9)' : 'rgba(20, 184, 166, 0.3)');
        ctx.fillStyle = g;
        ctx.fillRect(x + 0.5, h / 2 - barH / 2, barW - 1, barH);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(animRef.current);
  }, [audioUrl, isPlaying]);
  return <canvas ref={canvasRef} width={800} height={80} className="w-full h-[80px] rounded-lg" />;
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════
const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'tts', label: 'Text to Speech', icon: <><path d="M6 4v16" strokeWidth="2" strokeLinecap="round" fill="none" stroke="currentColor" /><path d="M6 12l12-7v14l-12-7z" fill="currentColor" opacity="0.2" /><path d="M6 12l12-7v14l-12-7z" strokeWidth="1.5" fill="none" stroke="currentColor" strokeLinejoin="round" /></> },
  { id: 'projects', label: 'Projects', icon: <><path d="M4 4h16v2H4zM4 9h16v2H4zM4 14h11v2H4zM4 19h8v2H4z" fill="currentColor" opacity="0.15" /><path d="M4 5h16M4 10h16M4 15h11M4 20h8" strokeWidth="1.8" strokeLinecap="round" fill="none" stroke="currentColor" /></> },
  { id: 'cloning', label: 'Voice Cloning', icon: <><circle cx="9" cy="7" r="3.5" strokeWidth="1.5" fill="none" stroke="currentColor" /><path d="M3 21v-1a6 6 0 016-6h0a6 6 0 016 6v1" strokeWidth="1.5" fill="none" stroke="currentColor" /><path d="M18 8v6M15 11h6" strokeWidth="1.8" strokeLinecap="round" fill="none" stroke="currentColor" /></> },
  { id: 'library', label: 'Voice Library', icon: <><path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" strokeWidth="1.5" fill="none" stroke="currentColor" /><path d="M19 10v1a7 7 0 01-14 0v-1" strokeWidth="1.5" fill="none" stroke="currentColor" strokeLinecap="round" /><path d="M12 18v3" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /><path d="M8 21h8" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /></> },
  { id: 'sound-effects', label: 'Sound Effects', icon: <><path d="M2 14h2v-4h2v6h2V8h2v10h2V6h2v12h2V10h2v8h2v-6h2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" /></> },
  { id: 'voice-design', label: 'Voice Design', icon: <><circle cx="12" cy="12" r="3" strokeWidth="1.5" fill="none" stroke="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /></> },
  { id: 'audio-isolation', label: 'Audio Isolation', icon: <><path d="M3 18v-6a9 9 0 0118 0v6" strokeWidth="1.5" fill="none" stroke="currentColor" /><rect x="17" y="14" width="4" height="6" rx="1.5" strokeWidth="1.5" fill="none" stroke="currentColor" /><rect x="3" y="14" width="4" height="6" rx="1.5" strokeWidth="1.5" fill="none" stroke="currentColor" /></> },
  { id: 'speech-to-speech', label: 'Speech to Speech', icon: <><path d="M5 8a3 3 0 013-3h0a3 3 0 013 3v2a3 3 0 01-3 3h0a3 3 0 01-3-3V8z" strokeWidth="1.5" fill="none" stroke="currentColor" /><path d="M12 10h2" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /><path d="M16 8a3 3 0 013-3h0a3 3 0 013 3v2a3 3 0 01-3 3h0a3 3 0 01-3-3V8z" strokeWidth="1.5" fill="none" stroke="currentColor" /><path d="M8 13v2a3 3 0 003 3h2a3 3 0 003-3v-2" strokeWidth="1.5" fill="none" stroke="currentColor" strokeLinecap="round" /></> },
  { id: 'api', label: 'API', icon: <><path d="M7 8l-4 4 4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" /><path d="M17 8l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" /><path d="M14 4l-4 16" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /></> },
];

function Sidebar({ active, onSelect, health }: { active: Section; onSelect: (s: Section) => void; health: HealthData | null }) {
  return (
    <aside className="w-[220px] min-h-screen border-r flex flex-col shrink-0" style={{ backgroundColor: 'var(--ept-bg-alt)', borderColor: 'var(--ept-border)' }}>
      <div className="flex-1 py-3">
        <div className="px-4 mb-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ept-text-muted)' }}>Voice Studio</div>
        </div>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => onSelect(s.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: active === s.id ? 'var(--ept-accent-glow)' : 'transparent',
              color: active === s.id ? 'var(--ept-accent)' : 'var(--ept-text-secondary)',
              borderRight: active === s.id ? '2px solid var(--ept-accent)' : '2px solid transparent',
            }}>
            <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
            {s.label}
          </button>
        ))}
      </div>
      {/* System status */}
      <div className="p-4 border-t text-[10px] font-mono space-y-1" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: health ? '#22c55e' : '#ef4444' }} />
          <span>{health ? 'Online' : 'Offline'}</span>
        </div>
        {health && <>
          <div>{health.gpu?.name?.replace('NVIDIA GeForce ', '') || 'CPU'}</div>
          <div>{health.gpu?.vram_free_gb?.toFixed(1)}GB free / {health.gpu?.vram_total_gb?.toFixed(1)}GB</div>
          <div>Uptime: {health.stats?.uptime_human}</div>
          <div>Cost: $0.00</div>
        </>}
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEXT TO SPEECH
// ═══════════════════════════════════════════════════════════════
function TextToSpeech({ voices, voiceId, setVoiceId, history, setHistory }: {
  voices: Voice[]; voiceId: string; setVoiceId: (v: string) => void;
  history: HistoryItem[]; setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}) {
  const [text, setText] = useState('Welcome to Echo Prime Technologies. Our voice synthesis engine delivers studio-quality speech with zero latency, unlimited usage, and complete privacy.');
  const [speed, setSpeed] = useState(0.9);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [style, setStyle] = useState(0.35);
  const [outputFormat, setOutputFormat] = useState('wav');
  const [generating, setGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [genTime, setGenTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generate = useCallback(async () => {
    if (!text.trim() || generating) return;
    setGenerating(true); setError(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null); setAudioBlob(null); setDuration(null); setGenTime(null);
    try {
      const t0 = Date.now();
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), voice_id: voiceId, speed, exaggeration: style, cfg_weight: similarity, output_format: outputFormat, preprocess: true, normalize: true, use_cache: true }),
      });
      if (!res.ok) throw new Error(`Generation failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const dur = parseFloat(res.headers.get('X-TTS-Duration') || '0');
      const gt = Date.now() - t0;
      setAudioUrl(url); setAudioBlob(blob); setDuration(dur); setGenTime(gt);
      const voice = voices.find(v => v.id === voiceId);
      setHistory(prev => [{ id: String(Date.now()), text: text.trim().slice(0, 100), voiceId, voiceName: voice?.name || voiceId, timestamp: Date.now(), audioUrl: url, duration: dur, genTime: gt }, ...prev].slice(0, 50));
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Unknown error'); } finally { setGenerating(false); }
  }, [text, voiceId, speed, style, similarity, outputFormat, generating, audioUrl, voices, setHistory]);

  const togglePlay = useCallback(() => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onplay = () => setIsPlaying(true);
    }
    if (isPlaying) audioRef.current.pause(); else { audioRef.current.src = audioUrl; audioRef.current.play(); }
  }, [audioUrl, isPlaying]);

  const download = useCallback(() => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a'); a.href = url;
    a.download = `echo-tts-${voiceId}-${Date.now()}.${outputFormat}`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [audioBlob, voiceId, outputFormat]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); generate(); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [generate]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-5 h-full">
      <div className="space-y-4">
        {/* Text input */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Input Text</span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{text.length.toLocaleString()} / 50,000</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste text... Supports [emotion] tags and SSML markup."
            rows={5} maxLength={50000}
            className="w-full rounded-lg p-3 text-sm leading-relaxed resize-y border-0 outline-none"
            style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', minHeight: '120px' }} />
          <div className="mt-2">
            <div className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>Emotion Tags (click to insert — these modify the voice)</div>
            <div className="flex flex-wrap gap-1">
              {['[whispers]', '[excited]', '[serious]', '[sarcastic]', '[curious]', '[angry]', '[sad]', '[happy]', '[fearful]', '[surprised]'].map(tag => (
                <button key={tag} onClick={() => setText(t => t + ' ' + tag)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{tag}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {['[laughs]', '[sighs]', '[crying]', '[gasps]', '[clears throat]'].map(tag => (
                <button key={tag} onClick={() => setText(t => t + ' ' + tag)}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: 'rgb(168,85,247)' }}>{tag}</button>
              ))}
              {['[pause]', '[short pause]', '[long pause]'].map(tag => (
                <button key={tag} onClick={() => setText(t => t + ' ' + tag)}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: 'rgb(245,158,11)' }}>{tag}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--ept-text-muted)' }}>Voice</label>
            <select value={voiceId} onChange={e => setVoiceId(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none cursor-pointer"
              style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', borderColor: 'var(--ept-border)' }}>
              {voices.map(v => <option key={v.id} value={v.id}>{v.name} {v.has_ref_audio ? '(cloned)' : ''}</option>)}
              {voices.length === 0 && <option value="default">Default Voice</option>}
            </select>
          </div>
          <div className="w-24">
            <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--ept-text-muted)' }}>Format</label>
            <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none cursor-pointer"
              style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', borderColor: 'var(--ept-border)' }}>
              <option value="wav">WAV</option><option value="mp3">MP3</option><option value="ogg">OGG</option><option value="flac">FLAC</option><option value="opus">OPUS</option><option value="aac">AAC</option><option value="pcm">PCM</option>
            </select>
          </div>
          <button onClick={generate} disabled={generating || !text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-40"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {generating ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 60" /></svg>Generating...</> :
              <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>Generate</>}
          </button>
        </div>

        {/* Output */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Output</span>
            {genTime != null && duration != null && (
              <div className="flex gap-3 text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                <span>{duration.toFixed(1)}s audio</span><span>{(genTime / 1000).toFixed(1)}s gen</span><span>{(genTime / 1000 / Math.max(duration, 0.01)).toFixed(2)}x RTF</span>
              </div>
            )}
          </div>
          <Waveform audioUrl={audioUrl} isPlaying={isPlaying} />
          <div className="mt-3 flex items-center gap-2">
            <button onClick={togglePlay} disabled={!audioUrl} aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ backgroundColor: audioUrl ? 'var(--ept-accent)' : 'var(--ept-surface)', color: '#fff' }}>
              {isPlaying ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg> :
                <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>}
            </button>
            <button onClick={download} disabled={!audioBlob} aria-label="Download"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border disabled:opacity-30"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Download
            </button>
          </div>
          {error && <div className="mt-3 p-2.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>{error}</div>}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>History</span>
            <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
              {history.map(h => (
                <div key={h.id} className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'var(--ept-surface)' }}
                  onClick={() => { setAudioUrl(h.audioUrl); setDuration(h.duration); setGenTime(h.genTime); }}>
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--ept-accent)' }} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate" style={{ color: 'var(--ept-text)' }}>{h.text}...</div>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{h.voiceName} · {h.duration.toFixed(1)}s · {new Date(h.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right settings panel */}
      <div className="space-y-4">
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Voice Settings</span>
          <div className="mt-4 space-y-4">
            <Slider label="Stability" value={stability} onChange={setStability} min={0} max={1} step={0.05} description="Higher = more consistent, Lower = more expressive" />
            <Slider label="Clarity + Similarity" value={similarity} onChange={setSimilarity} min={0} max={1} step={0.05} description="How closely to match the voice style" />
            <Slider label="Style Exaggeration" value={style} onChange={setStyle} min={0} max={1} step={0.05} description="Amplify the voice style. Higher = more dramatic" />
            <Slider label="Speed" value={speed} onChange={setSpeed} min={0.25} max={3.0} step={0.05} unit="x" description="Playback speed (0.25x to 3x)" />
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Presets</span>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              { name: 'Natural', stab: 0.5, sim: 0.75, sty: 0.35, spd: 0.9 },
              { name: 'Stable', stab: 0.8, sim: 0.8, sty: 0.15, spd: 0.9 },
              { name: 'Expressive', stab: 0.3, sim: 0.7, sty: 0.7, spd: 0.95 },
              { name: 'Narrator', stab: 0.6, sim: 0.8, sty: 0.25, spd: 0.85 },
              { name: 'Dramatic', stab: 0.35, sim: 0.65, sty: 0.85, spd: 0.82 },
              { name: 'Fast', stab: 0.5, sim: 0.75, sty: 0.3, spd: 1.2 },
            ].map(p => (
              <button key={p.name} onClick={() => { setStability(p.stab); setSimilarity(p.sim); setStyle(p.sty); setSpeed(p.spd); }}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all hover:scale-[1.02]"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-surface)' }}>{p.name}</button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Model Info</span>
          <div className="mt-3 space-y-1.5 text-[11px] font-mono">
            {[['Engine', 'ECHO TTS PRIME v3.0'], ['Model', 'Chatterbox Turbo'], ['Params', '350M'], ['Sample Rate', '24kHz'], ['License', 'MIT (Open Source)'], ['API Cost', '$0.00 (self-hosted)'], ['Emotion Tags', '19 supported'], ['Output Formats', '7 (WAV/MP3/OGG/FLAC/OPUS/AAC/PCM)'], ['Effects', 'Reverb, Echo, EQ, Pitch, Age'], ['Features', 'SSML, Cache, Normalize, Watermark']].map(([k, v], i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="shrink-0" style={{ color: 'var(--ept-text-muted)' }}>{k}</span>
                <span className="text-right" style={{ color: 'var(--ept-text-secondary)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>v3.0 Capabilities</span>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {[
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/><path d="M3 12c0-3.3 1.7-6.2 4.3-7.9M20.7 4.1C18.2 5.8 16.5 8.7 16.5 12s1.7 6.2 4.2 7.9M7.3 19.9C4.8 18.2 3 15.3 3 12"/><path d="M9 2.5c.9-.3 1.9-.5 3-.5s2.1.2 3 .5M9 21.5c.9.3 1.9.5 3 .5s2.1-.2 3-.5"/></svg>, label: 'Emotion Tags', desc: '19 voice modifiers'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h2v-4h2v6h2V8h2v10h2V6h2v12h2V10h2v8h2v-6h2"/></svg>, label: 'Audio Effects', desc: 'Reverb, echo, EQ'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="4" height="20" rx="1"/><circle cx="6" cy="8" r="1.5" fill="currentColor"/><rect x="16" y="2" width="4" height="20" rx="1"/><circle cx="18" cy="16" r="1.5" fill="currentColor"/></svg>, label: 'Pitch Shift', desc: '-12 to +12 semitones'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M7 8c-1.1-.6-2-1.7-2-3s.9-2.4 2-3M17 8c1.1-.6 2-1.7 2-3s-.9-2.4-2-3"/></svg>, label: 'Voice Age', desc: 'Child to elderly'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/><path d="M7 12h10" strokeDasharray="2 2"/></svg>, label: 'SSML Support', desc: 'Markup language'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, label: 'Audio Cache', desc: 'Instant replay'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h4l3-9 6 18 3-9h4"/></svg>, label: 'Normalize', desc: 'Broadcast LUFS'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>, label: 'Watermark', desc: 'Inaudible embed'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10"/><path d="M3 15l4-4 3 3 4-4 4 4 3-3"/><path d="M1 19h22"/></svg>, label: '7 Formats', desc: 'WAV to OPUS'},
              {icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/><path d="M12 5v14"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>, label: 'WebSocket', desc: 'Real-time stream'},
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg text-[10px]" style={{ backgroundColor: 'var(--ept-surface)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--ept-accent)' }}>{c.icon}</span>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>{c.label}</div>
                  <div style={{ color: 'var(--ept-text-muted)' }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS (Audiobook Studio)
// ═══════════════════════════════════════════════════════════════
interface Paragraph { id: string; text: string; voiceId: string; status: 'pending' | 'generating' | 'done' | 'error'; audioUrl?: string; audioBlob?: Blob; duration?: number; }
interface Project { id: string; name: string; paragraphs: Paragraph[]; defaultVoiceId: string; defaultSpeed: number; created: number; }

function Projects({ voices, voiceId }: { voices: Voice[]; voiceId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const createProject = (name: string, text: string) => {
    const paragraphs = text.split(/\n{2,}|\r\n{2,}/).map(p => p.trim()).filter(p => p.length > 10);
    if (paragraphs.length === 0) return;
    const project: Project = {
      id: String(Date.now()), name, defaultVoiceId: voiceId, defaultSpeed: 0.88, created: Date.now(),
      paragraphs: paragraphs.map((p, i) => ({ id: `p-${Date.now()}-${i}`, text: p, voiceId, status: 'pending' as const })),
    };
    setProjects(prev => [project, ...prev]);
    setActiveProject(project);
    setShowImport(false);
    setImportText('');
  };

  const importFile = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.txt';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      setImportText(text);
      setShowImport(true);
    };
    input.click();
  };

  const importUrl = async () => {
    const url = prompt('Enter URL to import text from:');
    if (!url) return;
    try {
      const res = await fetch(`https://r.jina.ai/${url}`, { headers: { Accept: 'text/plain' } });
      if (res.ok) { setImportText(await res.text()); setShowImport(true); }
    } catch { alert('Failed to fetch URL content'); }
  };

  const updateParagraph = (id: string, updates: Partial<Paragraph>) => {
    if (!activeProject) return;
    const updated = { ...activeProject, paragraphs: activeProject.paragraphs.map(p => p.id === id ? { ...p, ...updates } : p) };
    setActiveProject(updated);
    setProjects(prev => prev.map(pr => pr.id === updated.id ? updated : pr));
  };

  const generateParagraph = async (p: Paragraph) => {
    if (!p.text.trim() || !activeProject) return;
    updateParagraph(p.id, { status: 'generating' });
    try {
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: p.text.trim(), voice_id: p.voiceId, speed: activeProject.defaultSpeed, exaggeration: 0.3, cfg_weight: 0.5, output_format: 'wav' }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      updateParagraph(p.id, { status: 'done', audioUrl: url, audioBlob: blob, duration: parseFloat(res.headers.get('X-TTS-Duration') || '0') });
    } catch { updateParagraph(p.id, { status: 'error' }); }
  };

  const generateAll = async () => {
    if (!activeProject) return;
    setGeneratingAll(true);
    for (let i = 0; i < activeProject.paragraphs.length; i++) {
      const p = activeProject.paragraphs[i];
      if (p.text.trim() && p.status !== 'done') {
        setCurrentIdx(i);
        await generateParagraph(p);
      }
    }
    setGeneratingAll(false);
  };

  const playParagraph = (p: Paragraph) => {
    if (!p.audioUrl) return;
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(p.audioUrl);
    audioRef.current.onended = () => setPlayingId(null);
    audioRef.current.play();
    setPlayingId(p.id);
  };

  const playAll = async () => {
    if (!activeProject) return;
    const withAudio = activeProject.paragraphs.filter(p => p.audioUrl);
    for (const p of withAudio) {
      setPlayingId(p.id);
      await new Promise<void>(resolve => {
        const a = new Audio(p.audioUrl!);
        a.onended = () => resolve();
        a.onerror = () => resolve();
        a.play();
        audioRef.current = a;
      });
    }
    setPlayingId(null);
  };

  const downloadAll = () => {
    if (!activeProject) return;
    activeProject.paragraphs.filter(p => p.audioBlob).forEach((p, i) => {
      const url = URL.createObjectURL(p.audioBlob!);
      const a = document.createElement('a'); a.href = url;
      a.download = `${activeProject.name.replace(/\s+/g, '_')}_${String(i + 1).padStart(3, '0')}.wav`;
      setTimeout(() => { a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }, i * 200);
    });
  };

  const totalDuration = activeProject?.paragraphs.reduce((s, p) => s + (p.duration || 0), 0) || 0;
  const completedCount = activeProject?.paragraphs.filter(p => p.status === 'done').length || 0;
  const totalChars = activeProject?.paragraphs.reduce((s, p) => s + p.text.length, 0) || 0;

  // Import modal
  if (showImport) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>New Project</h2>
          <button onClick={() => setShowImport(false)} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--ept-text-muted)' }}>Cancel</button>
        </div>
        <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Project Name</label>
          <input id="project-name" type="text" placeholder="My Audiobook" defaultValue="Untitled Project"
            className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none mb-4"
            style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />
          <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Paste or Edit Text</label>
          <p className="text-[10px] mb-2" style={{ color: 'var(--ept-text-muted)' }}>Separate paragraphs with blank lines. Each paragraph becomes a separate audio segment with its own voice assignment.</p>
          <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={12}
            className="w-full rounded-lg p-3 text-sm leading-relaxed resize-y border-0 outline-none font-mono"
            style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', minHeight: '200px' }} />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
              {importText.split(/\n{2,}/).filter(p => p.trim().length > 10).length} paragraphs · {importText.length.toLocaleString()} chars
            </span>
            <button onClick={() => {
              const nameEl = document.getElementById('project-name') as HTMLInputElement;
              createProject(nameEl?.value || 'Untitled', importText);
            }} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Create Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Project list
  if (!activeProject) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Projects</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Create long-form audio with multi-voice, paragraph-by-paragraph control.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={importFile} className="px-3 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Import .txt
            </button>
            <button onClick={importUrl} className="px-3 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Import URL
            </button>
            <button onClick={() => setShowImport(true)} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              + New Project
            </button>
          </div>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--ept-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>No projects yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Create a project to start generating long-form audio with multiple voices.</p>
            <div className="flex gap-2 justify-center mt-4">
              <button onClick={() => setShowImport(true)} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Create Project
              </button>
              <button onClick={importFile} className="px-4 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                Import File
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map(p => (
              <div key={p.id} onClick={() => setActiveProject(p)} className="rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.005]"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{new Date(p.created).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-4 mt-1.5 text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                  <span>{p.paragraphs.length} paragraphs</span>
                  <span>{p.paragraphs.filter(pp => pp.status === 'done').length}/{p.paragraphs.length} generated</span>
                  <span>{p.paragraphs.reduce((s, pp) => s + pp.text.length, 0).toLocaleString()} chars</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active project editor
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveProject(null)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--ept-text-muted)' }} aria-label="Back">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{activeProject.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-3 text-[10px] font-mono mr-3" style={{ color: 'var(--ept-text-muted)' }}>
            <span>{activeProject.paragraphs.length} paragraphs</span>
            <span>{totalChars.toLocaleString()} chars</span>
            <span>{completedCount}/{activeProject.paragraphs.length} done</span>
            <span>{Math.floor(totalDuration / 60)}m {Math.floor(totalDuration % 60)}s</span>
          </div>
          <button onClick={playAll} disabled={completedCount === 0} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-30"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Play All</button>
          <button onClick={downloadAll} disabled={completedCount === 0} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-30"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Download All</button>
          <button onClick={generateAll} disabled={generatingAll}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {generatingAll ? `Generating ${currentIdx + 1}/${activeProject.paragraphs.length}...` : 'Generate All'}
          </button>
        </div>
      </div>

      {/* Default voice selector */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0" style={{ color: 'var(--ept-text-muted)' }}>Default Voice:</span>
        <select value={activeProject.defaultVoiceId} onChange={e => {
          const updated = { ...activeProject, defaultVoiceId: e.target.value };
          setActiveProject(updated);
          setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        }} className="flex-1 rounded-lg px-2 py-1 text-xs border-0 outline-none" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text)' }}>
          {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0" style={{ color: 'var(--ept-text-muted)' }}>Speed:</span>
        <input type="number" value={activeProject.defaultSpeed} onChange={e => {
          const updated = { ...activeProject, defaultSpeed: parseFloat(e.target.value) || 0.88 };
          setActiveProject(updated);
          setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        }} min={0.5} max={2.0} step={0.05} className="w-16 rounded-lg px-2 py-1 text-xs font-mono border-0 outline-none" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text)' }} />
      </div>

      {/* Paragraph list */}
      <div className="space-y-2">
        {activeProject.paragraphs.map((p, i) => (
          <div key={p.id} className="rounded-xl border p-4 transition-all" style={{
            backgroundColor: playingId === p.id ? 'var(--ept-accent-glow)' : 'var(--ept-card-bg)',
            borderColor: playingId === p.id ? 'var(--ept-accent)' : 'var(--ept-card-border)',
          }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: p.status === 'done' ? 'rgba(34,197,94,0.12)' : p.status === 'generating' ? 'var(--ept-accent-glow)' : p.status === 'error' ? 'rgba(239,68,68,0.12)' : 'var(--ept-surface)',
                    color: p.status === 'done' ? '#22c55e' : p.status === 'generating' ? 'var(--ept-accent)' : p.status === 'error' ? '#ef4444' : 'var(--ept-text-muted)',
                  }}>{p.status === 'done' ? '\u2713' : p.status === 'generating' ? '\u25CB' : p.status === 'error' ? '!' : String(i + 1)}</span>
                <select value={p.voiceId} onChange={e => updateParagraph(p.id, { voiceId: e.target.value })}
                  className="rounded-md px-2 py-0.5 text-[11px] border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                  {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
                {p.duration != null && <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{p.duration.toFixed(1)}s</span>}
              </div>
              <div className="flex items-center gap-1.5">
                {p.audioUrl && (
                  <button onClick={() => playParagraph(p)} aria-label="Play paragraph"
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: playingId === p.id ? 'var(--ept-accent)' : 'var(--ept-surface)', color: playingId === p.id ? '#fff' : 'var(--ept-text-secondary)' }}>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                  </button>
                )}
                {p.status !== 'generating' && (
                  <button onClick={() => generateParagraph(p)} aria-label="Regenerate"
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>
                  </button>
                )}
              </div>
            </div>
            <textarea value={p.text} onChange={e => updateParagraph(p.id, { text: e.target.value })}
              className="w-full rounded-lg p-2.5 text-[13px] leading-relaxed resize-none border-0 outline-none"
              style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', minHeight: '60px' }}
              rows={Math.max(2, Math.ceil(p.text.length / 100))} />
            {p.status === 'generating' && <div className="mt-1 text-[10px] animate-pulse" style={{ color: 'var(--ept-accent)' }}>Generating audio...</div>}
          </div>
        ))}
      </div>

      {/* Add paragraph */}
      <button onClick={() => {
        if (!activeProject) return;
        const newP: Paragraph = { id: `p-${Date.now()}`, text: '', voiceId: activeProject.defaultVoiceId, status: 'pending' };
        const updated = { ...activeProject, paragraphs: [...activeProject.paragraphs, newP] };
        setActiveProject(updated);
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      }} className="w-full py-3 rounded-xl border-2 border-dashed text-xs font-medium"
        style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>+ Add Paragraph</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VOICE CLONING
// ═══════════════════════════════════════════════════════════════
function VoiceCloning({ voices, setVoices, setVoiceId }: { voices: Voice[]; setVoices: (v: Voice[]) => void; setVoiceId: (v: string) => void }) {
  const [cloneName, setCloneName] = useState('');
  const [cloneDesc, setCloneDesc] = useState('');
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [cloning, setCloning] = useState(false);
  const [cloneResult, setCloneResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = () => { setRecordedBlob(new Blob(chunksRef.current, { type: 'audio/webm' })); stream.getTracks().forEach(t => t.stop()); };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true); setRecordDuration(0);
      timerRef.current = setInterval(() => setRecordDuration(d => d + 1), 1000);
    } catch { setCloneResult('Error: Microphone access denied'); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const cloneVoice = async () => {
    const src = cloneFile || (recordedBlob ? new File([recordedBlob], 'recording.webm', { type: 'audio/webm' }) : null);
    if (!src || !cloneName.trim() || cloning) return;
    setCloning(true); setCloneResult(null);
    try {
      const form = new FormData();
      form.append('audio', src); form.append('name', cloneName.trim()); form.append('description', cloneDesc.trim());
      const res = await fetch(`${TTS_API}/voices/clone`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCloneResult(`Voice "${data.name}" created! Duration: ${data.duration_seconds}s`);
      setVoiceId(data.voice_id);
      fetch(`${TTS_API}/voices`).then(r => r.json()).then(setVoices).catch(() => {});
      setCloneName(''); setCloneDesc(''); setCloneFile(null); setRecordedBlob(null);
    } catch (e: unknown) { setCloneResult(`Error: ${e instanceof Error ? e.message : 'Clone failed'}`); } finally { setCloning(false); }
  };

  const deleteVoice = async (id: string) => {
    if (id === 'default') return;
    await fetch(`${TTS_API}/voices/${id}`, { method: 'DELETE' }).catch(() => {});
    fetch(`${TTS_API}/voices`).then(r => r.json()).then(setVoices).catch(() => {});
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Instant Voice Cloning</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Upload 5-30 seconds of clean speech to create an instant voice clone.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <input type="text" placeholder="Voice name (e.g., 'My Narrator')" value={cloneName} onChange={e => setCloneName(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />
          <input type="text" placeholder="Description (optional)" value={cloneDesc} onChange={e => setCloneDesc(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />

          <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-opacity-80"
            style={{ borderColor: cloneFile ? 'var(--ept-accent)' : 'var(--ept-border)', backgroundColor: cloneFile ? 'var(--ept-accent-glow)' : 'transparent' }}>
            <input type="file" accept="audio/*" className="hidden" onChange={e => {
              const file = e.target.files?.[0] || null;
              if (file && file.size > MAX_CLONE_SIZE) { setCloneResult(`Error: File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 50MB.`); return; }
              setCloneFile(file); setRecordedBlob(null); setCloneResult(null);
            }} />
            {cloneFile ? (
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto mb-1" style={{ color: 'var(--ept-accent)' }} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                <div className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{cloneFile.name}</div>
                <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{(cloneFile.size / 1024 / 1024).toFixed(1)} MB</div>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ept-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" /></svg>
                <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Drop audio file or click</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--ept-text-muted)' }}>WAV, MP3, M4A, OGG, FLAC</div>
              </div>
            )}
          </label>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--ept-border)' }} />
            <span className="text-[10px] font-medium" style={{ color: 'var(--ept-text-muted)' }}>OR RECORD</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--ept-border)' }} />
          </div>

          <button onClick={isRecording ? stopRecording : startRecording}
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: isRecording ? '#ef4444' : 'var(--ept-surface)', color: isRecording ? '#fff' : 'var(--ept-text-secondary)' }}>
            {isRecording ? <><span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />Stop ({recordDuration}s)</> :
              <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg>Record from Microphone</>}
          </button>
          {recordedBlob && !isRecording && <div className="text-[10px] text-center" style={{ color: 'var(--ept-accent)' }}>Recording ready ({recordDuration}s)</div>}

          <button onClick={cloneVoice} disabled={cloning || (!cloneFile && !recordedBlob) || !cloneName.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-bold disabled:opacity-40"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {cloning ? 'Cloning...' : 'Clone Voice'}
          </button>

          {cloneResult && (
            <div className="p-3 rounded-lg text-xs"
              style={{ backgroundColor: cloneResult.startsWith('Error') ? 'rgba(239,68,68,0.1)' : 'var(--ept-accent-glow)', color: cloneResult.startsWith('Error') ? '#ef4444' : 'var(--ept-accent)' }}>
              {cloneResult}
            </div>
          )}
        </div>

        {/* Existing cloned voices */}
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Your Cloned Voices</span>
            <div className="mt-3 space-y-2">
              {voices.filter(v => v.has_ref_audio).map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{v.name[0]}</div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--ept-text)' }}>{v.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{v.description}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteVoice(v.id)} className="text-[10px] px-2 py-0.5 rounded" style={{ color: '#ef4444' }}>Delete</button>
                </div>
              ))}
              {voices.filter(v => v.has_ref_audio).length === 0 && (
                <div className="text-center py-6 text-xs" style={{ color: 'var(--ept-text-muted)' }}>No cloned voices yet</div>
              )}
            </div>
          </div>
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Tips</span>
            <div className="mt-3 space-y-2 text-[11px]" style={{ color: 'var(--ept-text-secondary)' }}>
              {['Use 10-30 seconds of clean speech', 'Minimize background noise', 'Speak naturally and consistently', 'WAV at 24kHz+ gives best results', 'Higher quality audio = better clone'].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: 'var(--ept-accent)' }}>{'\u2713'}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VOICE LIBRARY
// ═══════════════════════════════════════════════════════════════
function VoiceLibrary({ voices, voiceId, setVoiceId, onNavigate }: { voices: Voice[]; voiceId: string; setVoiceId: (v: string) => void; onNavigate: (s: Section) => void }) {
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'cloned' | 'built-in'>('all');
  const filtered = voices.filter(v => {
    if (filter === 'cloned' && !v.has_ref_audio) return false;
    if (filter === 'built-in' && v.has_ref_audio) return false;
    return v.name.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
  });

  const preview = async (vid: string) => {
    setPreviewId(vid);
    try {
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello, this is a preview of my voice. I can speak naturally with clear intonation.', voice_id: vid, speed: 0.9, exaggeration: 0.35, cfg_weight: 0.5, output_format: 'wav' }),
      });
      if (res.ok) {
        const url = URL.createObjectURL(await res.blob());
        const a = new Audio(url);
        a.onended = () => { setPreviewId(null); URL.revokeObjectURL(url); };
        a.play();
      } else setPreviewId(null);
    } catch { setPreviewId(null); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Voice Library</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Browse, preview, and select voices for your projects.</p>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ept-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input type="text" placeholder="Search voices..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm border outline-none"
            style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', borderColor: 'var(--ept-border)' }} />
        </div>
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
          {(['all', 'cloned', 'built-in'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize"
              style={{ backgroundColor: filter === f ? 'var(--ept-card-bg)' : 'transparent', color: filter === f ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>{f}</button>
          ))}
        </div>
        <span className="text-xs font-mono self-center" style={{ color: 'var(--ept-text-muted)' }}>{filtered.length}</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(v => (
          <div key={v.id} className="rounded-xl border p-4 transition-all hover:scale-[1.01]"
            style={{ backgroundColor: voiceId === v.id ? 'var(--ept-accent-glow)' : 'var(--ept-card-bg)', borderColor: voiceId === v.id ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold"
                style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{v.name[0]}</div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{v.name}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: v.has_ref_audio ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
                  {v.has_ref_audio ? 'Cloned' : 'Built-in'}
                </div>
              </div>
            </div>
            <p className="text-[11px] mb-3 line-clamp-2" style={{ color: 'var(--ept-text-muted)' }}>{v.description}</p>
            <div className="flex gap-2">
              <button onClick={() => preview(v.id)} className="flex-1 py-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1"
                style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                {previewId === v.id ? <><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />Playing</> :
                  <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>Preview</>}
              </button>
              <button onClick={() => { setVoiceId(v.id); onNavigate('tts'); }} className="flex-1 py-1.5 rounded-md text-[11px] font-medium"
                style={{ backgroundColor: voiceId === v.id ? 'var(--ept-accent)' : 'var(--ept-accent-glow)', color: voiceId === v.id ? '#fff' : 'var(--ept-accent)' }}>
                {voiceId === v.id ? 'Selected' : 'Use Voice'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>{search ? 'No matches.' : 'No voices available.'}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SOUND EFFECTS
// ═══════════════════════════════════════════════════════════════
function SoundEffects() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [effects, setEffects] = useState<{ id: string; prompt: string; audioUrl: string; timestamp: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true); setError(null);
    try {
      // Use TTS as creative sound effect generator with description as text
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt.trim(), voice_id: 'default', speed: 1.0, exaggeration: 0.8, cfg_weight: 0.3, output_format: 'wav' }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const url = URL.createObjectURL(await res.blob());
      setEffects(prev => [{ id: String(Date.now()), prompt: prompt.trim(), audioUrl: url, timestamp: Date.now() }, ...prev]);
      setPrompt('');
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); } finally { setGenerating(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Sound Effects</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Describe a sound effect and generate it with AI. Powered by Chatterbox Turbo.</p>
      </div>
      <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Describe the sound</label>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., Dramatic cinematic trailer voice saying 'In a world...' with deep reverb"
          rows={3} className="w-full rounded-lg p-3 text-sm border-0 outline-none resize-y" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['Dramatic intro', 'Whispered narration', 'Excited announcement', 'Robot voice', 'Sarcastic commentary', 'Epic movie trailer'].map(s => (
            <button key={s} onClick={() => setPrompt(s)} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s}</button>
          ))}
        </div>
        <button onClick={generate} disabled={generating || !prompt.trim()} className="mt-3 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          {generating ? 'Generating...' : 'Generate'}
        </button>
        {error && <div className="mt-2 p-2 rounded-lg text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{error}</div>}
      </div>
      {effects.length > 0 && (
        <div className="space-y-2">
          {effects.map(fx => (
            <div key={fx.id} className="rounded-xl border p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <button onClick={() => new Audio(fx.audioUrl).play()} aria-label="Play"
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate" style={{ color: 'var(--ept-text)' }}>{fx.prompt}</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{new Date(fx.timestamp).toLocaleTimeString()}</div>
              </div>
              <a href={fx.audioUrl} download={`sfx-${fx.id}.wav`} className="text-[10px] font-medium px-2 py-1 rounded" style={{ color: 'var(--ept-accent)' }}>Download</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VOICE DESIGN
// ═══════════════════════════════════════════════════════════════
function VoiceDesign({ setVoices }: { setVoices: (v: Voice[]) => void }) {
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('male');
  const [age, setAge] = useState<'young' | 'middle' | 'old'>('middle');
  const [accent, setAccent] = useState('American');
  const [style, setStyle] = useState('Professional narrator');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generatePreview = async () => {
    setGenerating(true);
    try {
      const text = `Hello, I'm a ${age === 'young' ? 'young' : age === 'old' ? 'mature' : ''} ${gender} voice with a ${accent} accent. I specialize in ${style.toLowerCase()} delivery.`;
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice_id: 'default', speed: 0.9, exaggeration: 0.4, cfg_weight: 0.5, output_format: 'wav' }),
      });
      if (res.ok) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(await res.blob());
        setPreviewUrl(url);
        new Audio(url).play();
      }
    } catch { /* silent */ } finally { setGenerating(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Voice Design</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Design a custom voice by specifying characteristics. The AI will generate a voice matching your description.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl border p-5 space-y-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Gender</label>
            <div className="flex gap-2">
              {(['male', 'female', 'neutral'] as const).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{ backgroundColor: gender === g ? 'var(--ept-accent)' : 'var(--ept-surface)', color: gender === g ? '#fff' : 'var(--ept-text-secondary)' }}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Age</label>
            <div className="flex gap-2">
              {(['young', 'middle', 'old'] as const).map(a => (
                <button key={a} onClick={() => setAge(a)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{ backgroundColor: age === a ? 'var(--ept-accent)' : 'var(--ept-surface)', color: age === a ? '#fff' : 'var(--ept-text-secondary)' }}>
                  {a === 'middle' ? 'Middle-aged' : a === 'old' ? 'Mature' : 'Young'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Accent</label>
            <select value={accent} onChange={e => setAccent(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}>
              {['American', 'British', 'Australian', 'Southern US', 'New York', 'Irish', 'Scottish', 'Indian', 'German', 'French'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--ept-text-muted)' }}>Style</label>
            <select value={style} onChange={e => setStyle(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}>
              {['Professional narrator', 'Conversational', 'News anchor', 'Audiobook narrator', 'Podcast host', 'Documentary', 'Commercial', 'Character actor', 'ASMR whisper', 'Sports commentator'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button onClick={generatePreview} disabled={generating}
            className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {generating ? 'Generating Preview...' : 'Generate & Preview Voice'}
          </button>
        </div>

        <div className="rounded-xl border p-5 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--ept-accent-glow)' }}>
            <svg className="w-12 h-12" style={{ color: 'var(--ept-accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </div>
          <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
            {gender === 'neutral' ? 'Neutral' : gender === 'male' ? 'Male' : 'Female'}, {age === 'young' ? 'Young' : age === 'middle' ? 'Middle-aged' : 'Mature'}
          </div>
          <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{accent} · {style}</div>
          {previewUrl && (
            <button onClick={() => new Audio(previewUrl).play()} className="mt-4 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>Play Again
            </button>
          )}
          <p className="mt-4 text-[10px] text-center max-w-[200px]" style={{ color: 'var(--ept-text-muted)' }}>
            Voice design uses Chatterbox Turbo. Clone a real voice sample for the most accurate results.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUDIO ISOLATION
// ═══════════════════════════════════════════════════════════════
function AudioIsolation() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processTime, setProcessTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<'original' | 'cleaned' | null>(null);
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const processAudio = async () => {
    if (!file || processing) return;
    setProcessing(true); setError(null); setResultUrl(null); setResultBlob(null); setProcessTime(null);
    try {
      const t0 = Date.now();
      const form = new FormData();
      form.append('audio', file);
      form.append('output_format', 'wav');
      const res = await fetch(`${TTS_API}/audio-isolation`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Processing failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url); setResultBlob(blob); setProcessTime(Date.now() - t0);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Processing failed'); } finally { setProcessing(false); }
  };

  const play = (which: 'original' | 'cleaned') => {
    const url = which === 'original' ? origUrl : resultUrl;
    if (!url) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (isPlaying === which) { setIsPlaying(null); return; }
    const a = new Audio(url);
    a.onended = () => setIsPlaying(null);
    a.play();
    audioRef.current = a;
    setIsPlaying(which);
  };

  const download = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a'); a.href = url;
    a.download = `cleaned-${file?.name || 'audio'}.wav`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Audio Isolation</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Remove background noise, music, and interference from audio files. AI-powered spectral gating delivers studio-quality results.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upload panel */}
        <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-opacity-80"
            style={{ borderColor: file ? 'var(--ept-accent)' : 'var(--ept-border)', backgroundColor: file ? 'var(--ept-accent-glow)' : 'transparent' }}>
            <input type="file" accept="audio/*,video/*" className="hidden" onChange={e => {
              const f = e.target.files?.[0] || null;
              if (f && f.size > 500 * 1024 * 1024) { setError('File too large. Max 500MB.'); return; }
              setFile(f); setError(null);
              if (f) { setOrigUrl(URL.createObjectURL(f)); } else { setOrigUrl(null); }
              setResultUrl(null); setResultBlob(null);
            }} />
            {file ? (
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ept-accent)' }} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                <div className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{file.name}</div>
                <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--ept-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" /></svg>
                <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Drop audio or video file</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--ept-text-muted)' }}>WAV, MP3, M4A, OGG, FLAC, MP4, MKV, MOV — up to 500MB</div>
              </div>
            )}
          </label>
          <button onClick={processAudio} disabled={processing || !file}
            className="w-full py-3 rounded-lg text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {processing ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 60" /></svg>Processing...</> : 'Remove Background Noise'}
          </button>
          {error && <div className="p-2.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>{error}</div>}
        </div>

        {/* Results panel */}
        <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Result</span>
          {resultUrl ? (
            <div className="space-y-4">
              {processTime && <div className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>Processed in {(processTime / 1000).toFixed(1)}s</div>}
              <div className="flex gap-3">
                <button onClick={() => play('original')} disabled={!origUrl}
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border"
                  style={{ borderColor: isPlaying === 'original' ? 'var(--ept-accent)' : 'var(--ept-border)', color: isPlaying === 'original' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                  {isPlaying === 'original' ? 'Playing Original...' : 'Play Original'}
                </button>
                <button onClick={() => play('cleaned')}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: isPlaying === 'cleaned' ? 'var(--ept-accent)' : 'var(--ept-accent-glow)', color: isPlaying === 'cleaned' ? '#fff' : 'var(--ept-accent)' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                  {isPlaying === 'cleaned' ? 'Playing Cleaned...' : 'Play Cleaned'}
                </button>
              </div>
              <button onClick={download} className="w-full py-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Download Cleaned Audio
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 mb-3" style={{ color: 'var(--ept-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
              </svg>
              <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Upload audio to remove background noise</p>
            </div>
          )}
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--ept-surface)' }}>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>How It Works</span>
            <div className="mt-2 space-y-1.5 text-[11px]" style={{ color: 'var(--ept-text-secondary)' }}>
              {['Dual-pass spectral gating (stationary + non-stationary)', 'Removes hiss, hum, ambient noise, interference', 'Preserves voice clarity and natural tone', 'Works on audio and video files (audio extracted)', 'Self-hosted — your audio never leaves the server'].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: 'var(--ept-accent)' }}>{'\u2713'}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SPEECH TO SPEECH
// ═══════════════════════════════════════════════════════════════
function SpeechToSpeech({ voices, voiceId, setVoiceId }: { voices: Voice[]; voiceId: string; setVoiceId: (v: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const [exaggeration, setExaggeration] = useState(0.5);
  const [cfgWeight, setCfgWeight] = useState(0.5);
  const [speed, setSpeed] = useState(1.0);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processTime, setProcessTime] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = () => { setRecordedBlob(new Blob(chunksRef.current, { type: 'audio/webm' })); stream.getTracks().forEach(t => t.stop()); };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true); setRecordDuration(0);
      timerRef.current = setInterval(() => setRecordDuration(d => d + 1), 1000);
    } catch { setError('Microphone access denied'); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const convert = async () => {
    const src = file || (recordedBlob ? new File([recordedBlob], 'recording.webm', { type: 'audio/webm' }) : null);
    if (!src || processing) return;
    setProcessing(true); setError(null); setResultUrl(null); setResultBlob(null); setProcessTime(null);
    try {
      const t0 = Date.now();
      const form = new FormData();
      form.append('audio', src);
      form.append('exaggeration', String(exaggeration));
      form.append('cfg_weight', String(cfgWeight));
      form.append('speed', String(speed));
      form.append('output_format', 'wav');
      const res = await fetch(`${TTS_API}/speech-to-speech/${voiceId}`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Conversion failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url); setResultBlob(blob); setProcessTime(Date.now() - t0);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Conversion failed'); } finally { setProcessing(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Speech to Speech</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Transform audio from one voice to another. Upload speech or record your voice, then select a target voice.</p>
      </div>
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-4">
          {/* Source audio */}
          <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Source Audio</span>
            <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-opacity-80"
              style={{ borderColor: file ? 'var(--ept-accent)' : 'var(--ept-border)', backgroundColor: file ? 'var(--ept-accent-glow)' : 'transparent' }}>
              <input type="file" accept="audio/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0] || null;
                setFile(f); setRecordedBlob(null); setError(null); setResultUrl(null);
              }} />
              {file ? (
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1" style={{ color: 'var(--ept-accent)' }} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  <div className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{file.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ept-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" /></svg>
                  <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Drop audio file or click to upload</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--ept-text-muted)' }}>WAV, MP3, M4A, OGG, FLAC — max 5 min</div>
                </div>
              )}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--ept-border)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--ept-text-muted)' }}>OR RECORD</span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--ept-border)' }} />
            </div>
            <button onClick={isRecording ? stopRecording : startRecording}
              className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: isRecording ? '#ef4444' : 'var(--ept-surface)', color: isRecording ? '#fff' : 'var(--ept-text-secondary)' }}>
              {isRecording ? <><span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />Stop ({recordDuration}s)</> :
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg>Record from Microphone</>}
            </button>
            {recordedBlob && !isRecording && <div className="text-[10px] text-center" style={{ color: 'var(--ept-accent)' }}>Recording ready ({recordDuration}s)</div>}
          </div>

          {/* Target voice */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider block mb-3" style={{ color: 'var(--ept-text-muted)' }}>Target Voice</span>
            <select value={voiceId} onChange={e => setVoiceId(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none cursor-pointer"
              style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', borderColor: 'var(--ept-border)' }}>
              {voices.map(v => <option key={v.id} value={v.id}>{v.name} {v.has_ref_audio ? '(cloned)' : ''}</option>)}
            </select>
          </div>

          {/* Convert button */}
          <button onClick={convert} disabled={processing || (!file && !recordedBlob)}
            className="w-full py-3 rounded-lg text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {processing ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 60" /></svg>Converting Voice...</> : 'Convert to Target Voice'}
          </button>
          {error && <div className="p-2.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>{error}</div>}

          {/* Result */}
          {resultUrl && (
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Result</span>
                {processTime && <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{(processTime / 1000).toFixed(1)}s</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { if (resultUrl) new Audio(resultUrl).play(); }}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>Play
                </button>
                <button onClick={() => {
                  if (!resultBlob) return;
                  const url = URL.createObjectURL(resultBlob);
                  const a = document.createElement('a'); a.href = url; a.download = `converted-${voiceId}-${Date.now()}.wav`; a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }} className="flex-1 py-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings panel */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Conversion Settings</span>
            <div className="mt-4 space-y-4">
              <Slider label="Expressiveness" value={exaggeration} onChange={setExaggeration} min={0} max={1} step={0.05} description="Higher = more dramatic voice style" />
              <Slider label="Voice Match" value={cfgWeight} onChange={setCfgWeight} min={0} max={1} step={0.05} description="How closely to match target voice" />
              <Slider label="Speed" value={speed} onChange={setSpeed} min={0.5} max={2.0} step={0.05} unit="x" description="Output speech rate" />
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>How It Works</span>
            <div className="mt-3 space-y-1.5 text-[11px]" style={{ color: 'var(--ept-text-secondary)' }}>
              {['Upload source speech or record live', 'Select any voice as the target', 'AI regenerates speech in the target voice', 'Preserves rhythm and emotional tone', 'Works with cloned voices too'].map((t, i) => (
                <div key={i} className="flex items-start gap-2"><span style={{ color: 'var(--ept-accent)' }}>{'\u2713'}</span><span>{t}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// API DOCUMENTATION
// ═══════════════════════════════════════════════════════════════
function ApiDocs() {
  const [apiInfo, setApiInfo] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyText, setCopyText] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${TTS_API}/api-info`).then(r => r.json()).then(d => { setApiInfo(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopyText(code);
    setTimeout(() => setCopyText(null), 2000);
  };

  const [showAll, setShowAll] = useState(false);
  const coreEndpoints = [
    { method: 'POST', path: '/tts', desc: 'Generate speech with effects, cache, normalization', example: `curl -X POST ${TTS_API}/tts \\
  -H "Content-Type: application/json" \\
  -d '{"text":"[excited] Hello world!","voice_id":"default","speed":0.9,"preprocess":true,"normalize":true,"use_cache":true}' \\
  --output speech.wav` },
    { method: 'POST', path: '/tts/stream', desc: 'Streaming TTS (chunked transfer)', example: `curl -X POST ${TTS_API}/tts/stream \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Hello world","voice_id":"default"}' \\
  --output stream.wav` },
    { method: 'POST', path: '/tts/ssml', desc: 'SSML markup TTS', example: `curl -X POST ${TTS_API}/tts/ssml \\
  -H "Content-Type: application/json" \\
  -d '{"text":"<speak><prosody rate=\\"slow\\">Hello</prosody></speak>","voice_id":"default"}' \\
  --output ssml.wav` },
    { method: 'POST', path: '/tts/chapters', desc: 'Chapter-marked audio generation', example: `curl -X POST ${TTS_API}/tts/chapters \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Chapter text here","voice_id":"default"}' \\
  --output chapters.wav` },
    { method: 'POST', path: '/audio-isolation', desc: 'Remove background noise', example: `curl -X POST ${TTS_API}/audio-isolation \\
  -F "audio=@noisy.wav" \\
  -F "output_format=wav" \\
  --output cleaned.wav` },
    { method: 'POST', path: '/speech-to-speech/{voice_id}', desc: 'Voice conversion', example: `curl -X POST ${TTS_API}/speech-to-speech/default \\
  -F "audio=@source.wav" \\
  -F "exaggeration=0.5" \\
  --output converted.wav` },
    { method: 'POST', path: '/voices/clone', desc: 'Clone a voice from audio', example: `curl -X POST ${TTS_API}/voices/clone \\
  -F "audio=@sample.wav" \\
  -F "name=My Voice" \\
  -F "description=Custom clone"` },
    { method: 'POST', path: '/voices/compare', desc: 'A/B voice comparison', example: `curl -X POST ${TTS_API}/voices/compare \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Compare these voices","voice_ids":["default","my_clone"]}' \\
  --output compare.zip` },
  ];
  const advancedEndpoints = [
    { method: 'POST', path: '/voices/mix', desc: 'Blend multiple voice outputs', example: `curl -X POST ${TTS_API}/voices/mix \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Blended voice","voice_ids":["v1","v2"],"weights":[0.6,0.4]}'` },
    { method: 'GET', path: '/voices', desc: 'List all voices', example: `curl ${TTS_API}/voices` },
    { method: 'GET', path: '/models', desc: 'List available models', example: `curl ${TTS_API}/models` },
    { method: 'GET', path: '/history', desc: 'Generation history', example: `curl "${TTS_API}/history?page_size=20"` },
    { method: 'GET', path: '/emotion-tags', desc: 'List supported emotion tags', example: `curl ${TTS_API}/emotion-tags` },
    { method: 'GET', path: '/presets', desc: 'List voice presets', example: `curl ${TTS_API}/presets` },
    { method: 'POST', path: '/presets', desc: 'Save a voice preset', example: `curl -X POST ${TTS_API}/presets \\
  -H "Content-Type: application/json" \\
  -d '{"name":"narrator","speed":0.85,"exaggeration":0.3}'` },
    { method: 'GET', path: '/pronunciations', desc: 'Pronunciation dictionary', example: `curl ${TTS_API}/pronunciations` },
    { method: 'POST', path: '/pronunciations', desc: 'Add pronunciation rule', example: `curl -X POST ${TTS_API}/pronunciations \\
  -H "Content-Type: application/json" \\
  -d '{"word":"GHz","pronunciation":"gigahertz"}'` },
    { method: 'GET', path: '/cache/stats', desc: 'Audio cache statistics', example: `curl ${TTS_API}/cache/stats` },
    { method: 'DELETE', path: '/cache', desc: 'Clear audio cache', example: `curl -X DELETE ${TTS_API}/cache` },
    { method: 'GET', path: '/health', desc: 'Server health & GPU status', example: `curl ${TTS_API}/health` },
    { method: 'GET', path: '/health/deep', desc: 'Deep health with GPU verification', example: `curl ${TTS_API}/health/deep` },
    { method: 'GET', path: '/metrics', desc: 'Prometheus-format metrics', example: `curl ${TTS_API}/metrics` },
    { method: 'GET', path: '/stats', desc: 'Usage statistics', example: `curl ${TTS_API}/stats` },
    { method: 'POST', path: '/gpu/cleanup', desc: 'Free GPU memory', example: `curl -X POST ${TTS_API}/gpu/cleanup` },
    { method: 'WS', path: '/ws/tts', desc: 'WebSocket real-time TTS', example: `wscat -c ws://${TTS_API.replace('https://','')}:/ws/tts \\
  -x '{"text":"Hello","voice_id":"default"}'` },
  ];
  const endpoints = showAll ? [...coreEndpoints, ...advancedEndpoints] : coreEndpoints;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>API Documentation</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Full REST API for programmatic access. ElevenLabs-compatible endpoints available at /v1/* prefix. Self-hosted, zero cost, no rate limits.</p>
      </div>

      {/* Quick start */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Quick Start</span>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg p-3 font-mono text-xs overflow-x-auto" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}>
            <div style={{ color: 'var(--ept-text-muted)' }}># Base URL</div>
            <div style={{ color: 'var(--ept-accent)' }}>{TTS_API}</div>
            <br />
            <div style={{ color: 'var(--ept-text-muted)' }}># No API key required -- self-hosted</div>
            <div style={{ color: 'var(--ept-text-muted)' }}># No rate limits -- hardware is the limit</div>
            <div style={{ color: 'var(--ept-text-muted)' }}># Cost: $0.00 always</div>
            <br />
            <div style={{ color: 'var(--ept-text-muted)' }}># v3.0 features: emotion tags, SSML, effects, cache, 7 formats</div>
            <div style={{ color: 'var(--ept-text-muted)' }}># 35+ endpoints, WebSocket streaming, Prometheus metrics</div>
          </div>
          {loading ? <div className="text-xs animate-pulse" style={{ color: 'var(--ept-text-muted)' }}>Loading API info...</div> :
            apiInfo && <div className="flex flex-wrap gap-3 text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
              <span>v{(apiInfo as Record<string, string>).version || '3.0.0'}</span>
              <span>Model: Chatterbox Turbo</span>
              <span>24kHz</span>
              <span>19 Emotion Tags</span>
              <span>WAV/MP3/OGG/FLAC/OPUS/AAC/PCM</span>
            </div>}
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>{endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}</span>
          <button onClick={() => setShowAll(a => !a)} className="text-[11px] font-medium px-3 py-1 rounded-md transition-all"
            style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>
            {showAll ? 'Show Core' : `Show All (${coreEndpoints.length + advancedEndpoints.length})`}
          </button>
        </div>
        {endpoints.map((ep, i) => {
          const methodColors: Record<string, { bg: string; fg: string }> = {
            GET: { bg: 'rgba(34,197,94,0.12)', fg: '#22c55e' },
            POST: { bg: 'rgba(59,130,246,0.12)', fg: '#3b82f6' },
            DELETE: { bg: 'rgba(239,68,68,0.12)', fg: '#ef4444' },
            WS: { bg: 'rgba(168,85,247,0.12)', fg: '#a855f7' },
          };
          const mc = methodColors[ep.method] || methodColors.GET;
          return (
          <div key={i} className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                  style={{ backgroundColor: mc.bg, color: mc.fg }}>{ep.method}</span>
                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--ept-text)' }}>{ep.path}</span>
              </div>
              <span className="text-[11px]" style={{ color: 'var(--ept-text-muted)' }}>{ep.desc}</span>
            </div>
            <div className="px-4 pb-3">
              <div className="relative rounded-lg p-3 font-mono text-[11px] overflow-x-auto" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                <button onClick={() => copyCode(ep.example)}
                  className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-medium transition-all"
                  style={{ backgroundColor: 'var(--ept-card-bg)', color: copyText === ep.example ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
                  {copyText === ep.example ? 'Copied!' : 'Copy'}
                </button>
                <pre className="whitespace-pre-wrap">{ep.example}</pre>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* ElevenLabs compatibility */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>ElevenLabs API Compatibility</span>
        <p className="text-[11px] mt-2" style={{ color: 'var(--ept-text-secondary)' }}>
          Drop-in replacement endpoints available. Replace <code className="px-1 rounded" style={{ backgroundColor: 'var(--ept-surface)' }}>api.elevenlabs.io</code> with <code className="px-1 rounded" style={{ backgroundColor: 'var(--ept-surface)' }}>{TTS_API.replace('https://', '')}</code> for compatible integrations.
        </p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {[
            { from: 'POST /v1/text-to-speech/{id}', to: '/v1/text-to-speech/{voice_id}' },
            { from: 'POST /v1/audio-isolation', to: '/v1/audio-isolation' },
            { from: 'POST /v1/speech-to-speech/{id}', to: '/v1/speech-to-speech/{voice_id}' },
            { from: 'GET /v1/voices', to: '/v1/voices' },
            { from: 'GET /v1/models', to: '/v1/models' },
            { from: 'GET /v1/history', to: '/v1/history' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-surface)' }}>
              <span style={{ color: 'var(--ept-text-muted)' }}>{r.from}</span>
              <span style={{ color: 'var(--ept-accent)' }}>{'\u2192'}</span>
              <span style={{ color: 'var(--ept-accent)' }}>{r.to}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Echo TTS Prime vs ElevenLabs</span>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo TTS Prime</th>
                <th className="text-left py-2 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>ElevenLabs</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--ept-text-secondary)' }}>
              {[
                ['Pricing', '$0.00 (self-hosted)', '$5-$330+/mo'],
                ['Rate Limits', 'None (GPU-bound)', 'Tier-based'],
                ['Data Privacy', '100% local', 'Cloud-processed'],
                ['Voice Cloning', 'Instant (5-30s)', 'Instant + Professional'],
                ['Noise Removal', 'Spectral gating AI', 'AI Voice Isolator'],
                ['Emotion Tags', '19 tags (real audio mod)', '11 tags'],
                ['Audio Effects', 'Reverb, Echo, EQ, Pitch, Age', 'None (API only)'],
                ['Output Formats', '7 (WAV/MP3/OGG/FLAC/OPUS/AAC/PCM)', '4 (MP3/PCM/ulaw/FLAC)'],
                ['SSML', 'Supported', 'Partial'],
                ['Audio Cache', 'Built-in LRU', 'N/A'],
                ['WebSocket', 'Real-time streaming', 'Streaming API'],
                ['Latency', '~2-5s (RTX 4060)', '~75-300ms (cloud)'],
                ['Languages', 'English primary', '70+ languages'],
                ['API Compatible', 'Yes (/v1/* endpoints)', 'N/A (original)'],
                ['Model', 'Chatterbox Turbo (MIT)', 'Proprietary'],
              ].map(([feat, echo, eleven], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--ept-border)' }}>
                  <td className="py-2 pr-4 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{feat}</td>
                  <td className="py-2 pr-4">{echo}</td>
                  <td className="py-2">{eleven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function VoicePage() {
  const { isDark, toggle } = useTheme();
  const [section, setSection] = useState<Section>('tts');
  const [voiceId, setVoiceId] = useState('default');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [serverOffline, setServerOffline] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch(`${TTS_API}/voices`).then(r => r.json()).then((v: Voice[]) => {
      setVoices(v);
      if (v.length > 0) setVoiceId(v[0].id);
      setServerOffline(false);
    }).catch(() => setServerOffline(true));
    fetch(`${TTS_API}/health`).then(r => r.json()).then((h: HealthData) => { setHealth(h); setServerOffline(false); }).catch(() => setServerOffline(true));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Top nav */}
      <nav className="h-12 border-b flex items-center justify-between px-4 shrink-0 z-50" style={{ backgroundColor: 'var(--ept-bg-alt)', borderColor: 'var(--ept-border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(o => !o)} className="w-8 h-8 rounded-md flex items-center justify-center lg:hidden" style={{ color: 'var(--ept-text-secondary)' }} aria-label="Toggle sidebar">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[140px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
          </Link>
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
            Voice Studio
          </div>
        </div>
        <div className="flex items-center gap-3">
          {health && (
            <div className="hidden md:flex items-center gap-3 text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
              <span>{health.stats?.total_requests || 0} generations</span>
              <span>{Math.round(health.stats?.total_audio_seconds || 0)}s created</span>
              <span>{health.voices_available || 0} voices</span>
            </div>
          )}
          <button onClick={toggle} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }} aria-label="Toggle theme">
            {isDark ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar active={section} onSelect={s => { setSection(s); setSidebarOpen(false); }} health={health} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {serverOffline && (
            <div className="mb-4 p-3 rounded-lg border flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium" style={{ color: '#ef4444' }}>Voice Server Offline — generation unavailable</span>
            </div>
          )}
          {section === 'tts' && <TextToSpeech voices={voices} voiceId={voiceId} setVoiceId={setVoiceId} history={history} setHistory={setHistory} />}
          {section === 'projects' && <Projects voices={voices} voiceId={voiceId} />}
          {section === 'cloning' && <VoiceCloning voices={voices} setVoices={setVoices} setVoiceId={setVoiceId} />}
          {section === 'library' && <VoiceLibrary voices={voices} voiceId={voiceId} setVoiceId={setVoiceId} onNavigate={setSection} />}
          {section === 'sound-effects' && <SoundEffects />}
          {section === 'voice-design' && <VoiceDesign setVoices={setVoices} />}
          {section === 'audio-isolation' && <AudioIsolation />}
          {section === 'speech-to-speech' && <SpeechToSpeech voices={voices} voiceId={voiceId} setVoiceId={setVoiceId} />}
          {section === 'api' && <ApiDocs />}
        </main>
      </div>
    </div>
  );
}
