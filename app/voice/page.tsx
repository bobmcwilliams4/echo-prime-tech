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

type Section = 'tts' | 'projects' | 'cloning' | 'library' | 'sound-effects' | 'voice-design' | 'audio-isolation' | 'speech-to-speech' | 'transcribe' | 'dialogue' | 'dubbing' | 'api';

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
  { id: 'transcribe', label: 'Transcribe', icon: <><path d="M4 6h16M4 10h12M4 14h14M4 18h10" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /><circle cx="20" cy="16" r="3" strokeWidth="1.5" fill="none" stroke="currentColor" /><path d="M20 14v2l1.5 1" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /></> },
  { id: 'dialogue', label: 'Dialogue', icon: <><path d="M3 5h8v5H3zM13 5h8v5h-8zM3 14h8v5H3zM13 14h8v5h-8z" strokeWidth="1.5" fill="none" stroke="currentColor" rx="1" /></> },
  { id: 'dubbing', label: 'Dubbing', icon: <><path d="M2 12h4l3-9 4 18 3-9h4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" /><path d="M22 3l-4 4M22 7l-4-4" strokeWidth="1.5" strokeLinecap="round" fill="none" stroke="currentColor" /></> },
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
// PROJECTS (Audiobook Studio — ElevenLabs-Style)
// ═══════════════════════════════════════════════════════════════
const VOICE_COLORS = ['#6366f1','#f43f5e','#10b981','#f59e0b','#8b5cf6','#06b6d4','#ec4899','#84cc16','#ef4444','#14b8a6','#a855f7','#eab308'];
const EMOTIONS = ['neutral','laughs','whispers','sighs','sarcastic','excited','crying','curious','angry','scared','warm','serious','cheerful','dramatic','calm','storytelling','professional','commanding','tired','romantic'];

interface Paragraph { id: string; text: string; voiceId: string; speed: number; emotion: string; pauseAfterMs: number; locked: boolean; status: 'pending' | 'generating' | 'done' | 'error'; audioUrl?: string; audioBlob?: Blob; duration?: number; }
interface Project { id: string; name: string; paragraphs: Paragraph[]; defaultVoiceId: string; defaultSpeed: number; defaultEmotion: string; created: number; }

function getVoiceColor(voiceId: string, voices: Voice[]): string {
  const idx = voices.findIndex(v => v.id === voiceId);
  return VOICE_COLORS[idx >= 0 ? idx % VOICE_COLORS.length : 0];
}

function Projects({ voices, voiceId }: { voices: Voice[]; voiceId: string }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === 'undefined') return [];
    try { const saved = localStorage.getItem('echo-speak-projects'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [rendering, setRendering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cancelRef = useRef(false);

  // Persist projects to localStorage (without blobs/urls which can't be serialized)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stripped = projects.map(pr => ({
      ...pr, paragraphs: pr.paragraphs.map(p => ({ ...p, audioUrl: undefined, audioBlob: undefined, status: p.status === 'generating' ? 'pending' as const : p.status === 'done' ? 'pending' as const : p.status })),
    }));
    try { localStorage.setItem('echo-speak-projects', JSON.stringify(stripped)); } catch {}
  }, [projects]);

  const syncProject = (updated: Project) => {
    setActiveProject(updated);
    setProjects(prev => prev.map(pr => pr.id === updated.id ? updated : pr));
  };

  const createProject = (name: string, text: string) => {
    const paragraphs = text.split(/\n{2,}|\r\n{2,}/).map(p => p.trim()).filter(p => p.length > 10);
    if (paragraphs.length === 0) return;
    const project: Project = {
      id: String(Date.now()), name, defaultVoiceId: voiceId, defaultSpeed: 1.0, defaultEmotion: 'neutral', created: Date.now(),
      paragraphs: paragraphs.map((p, i) => ({ id: `p-${Date.now()}-${i}`, text: p, voiceId, speed: 1.0, emotion: 'neutral', pauseAfterMs: 500, locked: false, status: 'pending' as const })),
    };
    setProjects(prev => [project, ...prev]);
    setActiveProject(project);
    setShowImport(false);
    setImportText('');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject?.id === id) setActiveProject(null);
  };

  const importFile = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.txt,.epub,.pdf';
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
    syncProject(updated);
  };

  const deleteParagraph = (id: string) => {
    if (!activeProject) return;
    const updated = { ...activeProject, paragraphs: activeProject.paragraphs.filter(p => p.id !== id) };
    syncProject(updated);
  };

  const moveParagraph = (id: string, direction: -1 | 1) => {
    if (!activeProject) return;
    const idx = activeProject.paragraphs.findIndex(p => p.id === id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= activeProject.paragraphs.length) return;
    const arr = [...activeProject.paragraphs];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    syncProject({ ...activeProject, paragraphs: arr });
  };

  const applyDefaultsToAll = () => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      paragraphs: activeProject.paragraphs.map(p => p.locked ? p : { ...p, voiceId: activeProject.defaultVoiceId, speed: activeProject.defaultSpeed, emotion: activeProject.defaultEmotion }),
    };
    syncProject(updated);
  };

  const generateParagraph = async (p: Paragraph) => {
    if (!p.text.trim() || !activeProject || p.locked) return;
    updateParagraph(p.id, { status: 'generating' });
    try {
      const body: Record<string, unknown> = { text: p.text.trim(), voice_id: p.voiceId, speed: p.speed, exaggeration: 0.3, cfg_weight: 0.5, output_format: 'wav' };
      if (p.emotion && p.emotion !== 'neutral') body.instruct = p.emotion;
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
    cancelRef.current = false;
    for (let i = 0; i < activeProject.paragraphs.length; i++) {
      if (cancelRef.current) break;
      const p = activeProject.paragraphs[i];
      if (p.text.trim() && p.status !== 'done' && !p.locked) {
        setCurrentIdx(i);
        await generateParagraph(p);
      }
    }
    setGeneratingAll(false);
  };

  const playParagraph = (p: Paragraph) => {
    if (!p.audioUrl) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (playingId === p.id) { setPlayingId(null); return; }
    audioRef.current = new Audio(p.audioUrl);
    audioRef.current.onended = () => setPlayingId(null);
    audioRef.current.play();
    setPlayingId(p.id);
  };

  const stopPlayback = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlayingId(null);
  };

  const playAll = async () => {
    if (!activeProject) return;
    if (playingId) { stopPlayback(); return; }
    const withAudio = activeProject.paragraphs.filter(p => p.audioUrl);
    for (const p of withAudio) {
      setPlayingId(p.id);
      await new Promise<void>(resolve => {
        const a = new Audio(p.audioUrl!);
        a.onended = () => {
          // Pause after paragraph
          setTimeout(() => resolve(), p.pauseAfterMs || 0);
        };
        a.onerror = () => resolve();
        a.play();
        audioRef.current = a;
      });
      if (!audioRef.current) break; // stopped
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

  const renderSingleFile = async () => {
    if (!activeProject) return;
    const withAudio = activeProject.paragraphs.filter(p => p.audioBlob);
    if (withAudio.length === 0) return;
    setRendering(true);
    try {
      // Use Web Audio API to concatenate with pauses
      const ctx = new AudioContext({ sampleRate: 24000 });
      const buffers: AudioBuffer[] = [];
      for (const p of activeProject.paragraphs) {
        if (p.audioBlob) {
          const arrBuf = await p.audioBlob.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrBuf);
          buffers.push(decoded);
          // Add silence for pause
          if (p.pauseAfterMs > 0) {
            const silSamples = Math.floor(24000 * p.pauseAfterMs / 1000);
            const silBuf = ctx.createBuffer(1, silSamples, 24000);
            buffers.push(silBuf);
          }
        }
      }
      const totalLength = buffers.reduce((s, b) => s + b.length, 0);
      const output = ctx.createBuffer(1, totalLength, 24000);
      const channel = output.getChannelData(0);
      let offset = 0;
      for (const buf of buffers) {
        channel.set(buf.getChannelData(0), offset);
        offset += buf.length;
      }
      // Encode to WAV
      const wavLength = 44 + totalLength * 2;
      const wavBuf = new ArrayBuffer(wavLength);
      const view = new DataView(wavBuf);
      const writeStr = (off: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
      writeStr(0, 'RIFF'); view.setUint32(4, wavLength - 8, true); writeStr(8, 'WAVE');
      writeStr(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
      view.setUint32(24, 24000, true); view.setUint32(28, 48000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
      writeStr(36, 'data'); view.setUint32(40, totalLength * 2, true);
      const samples = channel;
      let pos = 44;
      for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        pos += 2;
      }
      const blob = new Blob([wavBuf], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProject.name.replace(/\s+/g, '_')}_complete.wav`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      ctx.close();
    } catch (err) {
      alert('Render failed: ' + (err instanceof Error ? err.message : String(err)));
    }
    setRendering(false);
  };

  const totalDuration = activeProject?.paragraphs.reduce((s, p) => s + (p.duration || 0), 0) || 0;
  const completedCount = activeProject?.paragraphs.filter(p => p.status === 'done').length || 0;
  const lockedCount = activeProject?.paragraphs.filter(p => p.locked).length || 0;
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
          <p className="text-[10px] mb-2" style={{ color: 'var(--ept-text-muted)' }}>Separate paragraphs with blank lines. Each paragraph becomes a separate audio segment with its own voice, speed, emotion, and pause settings.</p>
          <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={12}
            className="w-full rounded-lg p-3 text-sm leading-relaxed resize-y border-0 outline-none font-mono"
            style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', minHeight: '200px' }}
            placeholder="Paste your text here...\n\nEach paragraph separated by a blank line becomes a separate segment.\n\nYou can assign different voices to each one." />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                {importText.split(/\n{2,}/).filter(p => p.trim().length > 10).length} paragraphs · {importText.length.toLocaleString()} chars
              </span>
              <button onClick={importFile} className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Upload .txt</button>
              <button onClick={importUrl} className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Import URL</button>
            </div>
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
            <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Create audiobooks and long-form audio with per-line voice, speed, emotion, and pause control.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={importFile} className="px-3 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Import File
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
            <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Create a project to start building audiobooks. Assign different voices, speeds, and emotions to each paragraph — just like ElevenLabs.</p>
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
              <div key={p.id} className="rounded-xl border p-4 transition-all hover:scale-[1.002] group"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setActiveProject(p)}>
                    <div className="flex -space-x-1">
                      {[...new Set(p.paragraphs.map(pp => pp.voiceId))].slice(0, 4).map((vid, vi) => (
                        <div key={vi} className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: getVoiceColor(vid, voices), borderColor: 'var(--ept-card-bg)' }} />
                      ))}
                    </div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{new Date(p.created).toLocaleDateString()}</span>
                    <button onClick={() => deleteProject(p.id)} className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-xs px-1.5 py-0.5 rounded"
                      style={{ color: '#ef4444' }} title="Delete project">x</button>
                  </div>
                </div>
                <div className="flex gap-4 mt-1.5 text-[10px] font-mono cursor-pointer" onClick={() => setActiveProject(p)} style={{ color: 'var(--ept-text-muted)' }}>
                  <span>{p.paragraphs.length} paragraphs</span>
                  <span>{p.paragraphs.filter(pp => pp.status === 'done').length}/{p.paragraphs.length} generated</span>
                  <span>{p.paragraphs.reduce((s, pp) => s + pp.text.length, 0).toLocaleString()} chars</span>
                  <span>{[...new Set(p.paragraphs.map(pp => pp.voiceId))].length} voices</span>
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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveProject(null)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--ept-text-muted)' }} aria-label="Back">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{activeProject.name}</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-3 text-[10px] font-mono mr-2" style={{ color: 'var(--ept-text-muted)' }}>
            <span>{activeProject.paragraphs.length} lines</span>
            <span>{totalChars.toLocaleString()} chars</span>
            <span>{completedCount}/{activeProject.paragraphs.length} done</span>
            {lockedCount > 0 && <span>{lockedCount} locked</span>}
            <span>{Math.floor(totalDuration / 60)}m {Math.floor(totalDuration % 60)}s</span>
          </div>
          <button onClick={playAll} disabled={completedCount === 0} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-30"
            style={{ borderColor: 'var(--ept-border)', color: playingId ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>
            {playingId ? 'Stop' : 'Play All'}
          </button>
          <button onClick={renderSingleFile} disabled={completedCount === 0 || rendering} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-30"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            {rendering ? 'Rendering...' : 'Render & Download'}
          </button>
          <button onClick={downloadAll} disabled={completedCount === 0} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-30"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Download Chapters</button>
          {generatingAll ? (
            <button onClick={() => cancelRef.current = true} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
              Cancel ({currentIdx + 1}/{activeProject.paragraphs.length})
            </button>
          ) : (
            <button onClick={generateAll} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Generate All
            </button>
          )}
        </div>
      </div>

      {/* Progress bar during generation */}
      {generatingAll && (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
          <div className="h-full rounded-full transition-all duration-300" style={{
            backgroundColor: 'var(--ept-accent)',
            width: `${((currentIdx + 1) / activeProject.paragraphs.length) * 100}%`,
          }} />
        </div>
      )}

      {/* Default settings bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border flex-wrap" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0" style={{ color: 'var(--ept-text-muted)' }}>Defaults:</span>
        <select value={activeProject.defaultVoiceId} onChange={e => {
          syncProject({ ...activeProject, defaultVoiceId: e.target.value });
        }} className="rounded-lg px-2 py-1 text-xs border-0 outline-none" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text)' }}>
          {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <div className="flex items-center gap-1">
          <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Speed</span>
          <input type="range" value={activeProject.defaultSpeed} onChange={e => {
            syncProject({ ...activeProject, defaultSpeed: parseFloat(e.target.value) });
          }} min={0.5} max={2.0} step={0.05} className="w-16 h-1 accent-current" style={{ color: 'var(--ept-accent)' }} />
          <span className="text-[10px] font-mono w-8" style={{ color: 'var(--ept-text-muted)' }}>{activeProject.defaultSpeed.toFixed(2)}</span>
        </div>
        <select value={activeProject.defaultEmotion} onChange={e => {
          syncProject({ ...activeProject, defaultEmotion: e.target.value });
        }} className="rounded-lg px-2 py-1 text-xs border-0 outline-none" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text)' }}>
          {EMOTIONS.map(em => <option key={em} value={em}>{em}</option>)}
        </select>
        <button onClick={applyDefaultsToAll} className="text-[10px] px-2 py-1 rounded border hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
          title="Apply defaults to all unlocked paragraphs">Apply to All</button>
      </div>

      {/* Paragraph list */}
      <div className="space-y-1.5">
        {activeProject.paragraphs.map((p, i) => {
          const color = getVoiceColor(p.voiceId, voices);
          const isExpanded = expandedId === p.id;
          return (
            <div key={p.id} className="rounded-xl border transition-all" style={{
              backgroundColor: playingId === p.id ? 'var(--ept-accent-glow)' : 'var(--ept-card-bg)',
              borderColor: playingId === p.id ? 'var(--ept-accent)' : p.locked ? color + '40' : 'var(--ept-card-border)',
              borderLeftWidth: '3px',
              borderLeftColor: color,
              opacity: p.locked ? 0.85 : 1,
            }}>
              {/* Compact header row */}
              <div className="flex items-center gap-2 px-3 py-2">
                {/* Voice color orb + number */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono w-5 text-center" style={{ color: 'var(--ept-text-muted)' }}>{i + 1}</span>
                </div>

                {/* Voice selector */}
                <select value={p.voiceId} onChange={e => updateParagraph(p.id, { voiceId: e.target.value })}
                  disabled={p.locked}
                  className="rounded px-1.5 py-0.5 text-[11px] border-0 outline-none shrink-0" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)', maxWidth: '100px' }}>
                  {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>

                {/* Speed */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <span className="text-[9px]" style={{ color: 'var(--ept-text-muted)' }}>spd</span>
                  <input type="range" value={p.speed} onChange={e => updateParagraph(p.id, { speed: parseFloat(e.target.value) })}
                    disabled={p.locked} min={0.5} max={2.0} step={0.05} className="w-12 h-1 accent-current" style={{ color }} />
                  <span className="text-[9px] font-mono w-6" style={{ color: 'var(--ept-text-muted)' }}>{p.speed.toFixed(1)}</span>
                </div>

                {/* Emotion */}
                <select value={p.emotion} onChange={e => updateParagraph(p.id, { emotion: e.target.value })}
                  disabled={p.locked}
                  className="rounded px-1 py-0.5 text-[10px] border-0 outline-none shrink-0" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)', maxWidth: '85px' }}>
                  {EMOTIONS.map(em => <option key={em} value={em}>{em}</option>)}
                </select>

                {/* Pause after */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <span className="text-[9px]" style={{ color: 'var(--ept-text-muted)' }}>pause</span>
                  <input type="range" value={p.pauseAfterMs} onChange={e => updateParagraph(p.id, { pauseAfterMs: parseInt(e.target.value) })}
                    disabled={p.locked} min={0} max={3000} step={100} className="w-10 h-1 accent-current" style={{ color }} />
                  <span className="text-[9px] font-mono w-8" style={{ color: 'var(--ept-text-muted)' }}>{(p.pauseAfterMs / 1000).toFixed(1)}s</span>
                </div>

                {/* Duration */}
                {p.duration != null && <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--ept-text-muted)' }}>{p.duration.toFixed(1)}s</span>}

                {/* Status */}
                <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{
                    backgroundColor: p.status === 'done' ? 'rgba(34,197,94,0.12)' : p.status === 'generating' ? 'var(--ept-accent-glow)' : p.status === 'error' ? 'rgba(239,68,68,0.12)' : 'transparent',
                    color: p.status === 'done' ? '#22c55e' : p.status === 'generating' ? 'var(--ept-accent)' : p.status === 'error' ? '#ef4444' : 'var(--ept-text-muted)',
                  }}>{p.status === 'done' ? '\u2713' : p.status === 'generating' ? '\u25CB' : p.status === 'error' ? '!' : ''}</span>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {p.audioUrl && (
                    <button onClick={() => playParagraph(p)} aria-label="Play" title="Play"
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: playingId === p.id ? 'var(--ept-accent)' : 'var(--ept-surface)', color: playingId === p.id ? '#fff' : 'var(--ept-text-secondary)' }}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">{playingId === p.id ? <><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></> : <path d="M8 5.14v14l11-7-11-7z" />}</svg>
                    </button>
                  )}
                  {p.status !== 'generating' && !p.locked && (
                    <button onClick={() => generateParagraph(p)} aria-label="Generate" title={p.status === 'done' ? 'Regenerate' : 'Generate'}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>
                    </button>
                  )}
                  {/* Lock toggle */}
                  <button onClick={() => updateParagraph(p.id, { locked: !p.locked })} aria-label={p.locked ? 'Unlock' : 'Lock'} title={p.locked ? 'Unlock' : 'Lock'}
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: p.locked ? color + '20' : 'var(--ept-surface)', color: p.locked ? color : 'var(--ept-text-muted)' }}>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{p.locked ? <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></> : <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 019.9-1" /></>}</svg>
                  </button>
                  {/* Expand/collapse */}
                  <button onClick={() => setExpandedId(isExpanded ? null : p.id)} aria-label="Expand" title="Edit text"
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: isExpanded ? 'var(--ept-accent-glow)' : 'var(--ept-surface)', color: isExpanded ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
                    <svg className="w-3 h-3 transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : '' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {/* Move & delete */}
                  {!p.locked && (
                    <>
                      <button onClick={() => moveParagraph(p.id, -1)} disabled={i === 0} aria-label="Move up" title="Move up"
                        className="w-5 h-5 rounded flex items-center justify-center disabled:opacity-20"
                        style={{ color: 'var(--ept-text-muted)' }}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                      </button>
                      <button onClick={() => moveParagraph(p.id, 1)} disabled={i === activeProject.paragraphs.length - 1} aria-label="Move down" title="Move down"
                        className="w-5 h-5 rounded flex items-center justify-center disabled:opacity-20"
                        style={{ color: 'var(--ept-text-muted)' }}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                      </button>
                      <button onClick={() => deleteParagraph(p.id)} aria-label="Delete" title="Delete paragraph"
                        className="w-5 h-5 rounded flex items-center justify-center hover:opacity-100 opacity-40"
                        style={{ color: '#ef4444' }}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Text preview (collapsed) */}
              {!isExpanded && (
                <div className="px-3 pb-2 cursor-pointer" onClick={() => setExpandedId(p.id)}>
                  <p className="text-[12px] leading-relaxed truncate" style={{ color: p.locked ? 'var(--ept-text-muted)' : 'var(--ept-text-secondary)' }}>{p.text}</p>
                </div>
              )}

              {/* Expanded text editor */}
              {isExpanded && (
                <div className="px-3 pb-3">
                  <textarea value={p.text} onChange={e => updateParagraph(p.id, { text: e.target.value })}
                    disabled={p.locked}
                    className="w-full rounded-lg p-2.5 text-[13px] leading-relaxed resize-y border-0 outline-none"
                    style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', minHeight: '80px' }}
                    rows={Math.max(3, Math.ceil(p.text.length / 80))} />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{p.text.length} chars</span>
                    {p.status === 'generating' && <span className="text-[10px] animate-pulse" style={{ color: 'var(--ept-accent)' }}>Generating...</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add paragraph */}
      <button onClick={() => {
        if (!activeProject) return;
        const newP: Paragraph = { id: `p-${Date.now()}`, text: '', voiceId: activeProject.defaultVoiceId, speed: activeProject.defaultSpeed, emotion: activeProject.defaultEmotion, pauseAfterMs: 500, locked: false, status: 'pending' };
        const updated = { ...activeProject, paragraphs: [...activeProject.paragraphs, newP] };
        syncProject(updated);
        setExpandedId(newP.id);
      }} className="w-full py-3 rounded-xl border-2 border-dashed text-xs font-medium"
        style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>+ Add Paragraph</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SAMPLE VOICE CARDS
// ═══════════════════════════════════════════════════════════════
const SAMPLE_VOICE_COLORS: Record<string, string> = {
  commander: '#6366f1', lanny_owens: '#f59e0b', steven: '#10b981', phone_call: '#8b5cf6',
  default: '#06b6d4', ryan: '#f43f5e', luna: '#ec4899',
};
const SAMPLE_VOICE_ICONS: Record<string, string> = {
  commander: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  lanny_owens: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
  steven: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  phone_call: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
};

function SampleVoiceCards({ voices, setVoiceId, deleteVoice }: { voices: Voice[]; setVoiceId: (v: string) => void; deleteVoice: (id: string) => void }) {
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const queueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const drainQueue = async (voiceId: string) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setPlayingId(voiceId);
    while (queueRef.current.length > 0) {
      const url = queueRef.current.shift()!;
      try {
        const a = new Audio(url);
        await new Promise<void>((res, rej) => { a.onended = () => { URL.revokeObjectURL(url); res(); }; a.onerror = () => { URL.revokeObjectURL(url); rej(); }; a.play().catch(rej); });
      } catch { /* next */ }
    }
    isPlayingRef.current = false;
    setPlayingId(null);
  };

  const previewVoice = async (voiceId: string, voiceName: string) => {
    if (abortRef.current) abortRef.current.abort();
    queueRef.current = [];
    isPlayingRef.current = false;
    setPreviewingId(voiceId); setPlayingId(null);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const text = `Hi, I'm ${voiceName}. This is what I sound like when I speak.`;
      // Use single /tts endpoint instead of /tts/chunked — eliminates choppy gaps between sentences
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice_id: voiceId, speed: 0.95, output_format: 'wav' }),
        signal: ctrl.signal,
      });
      if (!res.ok) { setPreviewingId(null); return; }
      const blob = await res.blob();
      if (blob.size < 100) { setPreviewingId(null); return; }
      const url = URL.createObjectURL(blob);
      setPlayingId(voiceId);
      isPlayingRef.current = true;
      const audio = new Audio(url);
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); reject(); };
        audio.play().catch(reject);
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
    } finally {
      isPlayingRef.current = false;
      setPreviewingId(null);
      setPlayingId(null);
    }
  };

  const clonedVoices = voices.filter(v => v.has_ref_audio || ['commander', 'lanny_owens', 'steven', 'phone_call'].includes(v.id));
  const builtinIds = ['default', 'ryan', 'luna'];

  return (
    <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Voice Library</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
          {voices.length} voices
        </span>
      </div>
      <div className="space-y-2">
        {voices.map(v => {
          const color = SAMPLE_VOICE_COLORS[v.id] || '#6366f1';
          const isSample = !builtinIds.includes(v.id);
          return (
            <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.005]"
              style={{ backgroundColor: 'var(--ept-surface)' }}>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative"
                style={{ backgroundColor: `${color}15` }}>
                {SAMPLE_VOICE_ICONS[v.id] ? (
                  <svg className="w-5 h-5" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={SAMPLE_VOICE_ICONS[v.id]} />
                  </svg>
                ) : (
                  <span className="text-sm font-bold" style={{ color }}>{v.name[0]}</span>
                )}
                {playingId === v.id && (
                  <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: color, borderTopColor: 'transparent' }} />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold truncate" style={{ color: 'var(--ept-text)' }}>{v.name}</span>
                  {isSample && v.has_ref_audio && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: `${color}15`, color }}>clone</span>
                  )}
                  {!isSample && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>built-in</span>
                  )}
                </div>
                <div className="text-[10px] truncate" style={{ color: 'var(--ept-text-muted)' }}>{v.description}</div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => previewVoice(v.id, v.name)} disabled={previewingId === v.id}
                  className="p-1.5 rounded-lg transition-all disabled:opacity-40" style={{ backgroundColor: `${color}15` }}
                  title="Preview voice">
                  {previewingId === v.id ? (
                    <svg className="w-4 h-4 animate-spin" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M6.34 6.34L3.51 3.51" strokeLinecap="round" /></svg>
                  ) : playingId === v.id ? (
                    <svg className="w-4 h-4" style={{ color }} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                  ) : (
                    <svg className="w-4 h-4" style={{ color }} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                  )}
                </button>
                <button onClick={() => { setVoiceId(v.id); }}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                  style={{ backgroundColor: `${color}15`, color }}
                  title="Use this voice">
                  Use
                </button>
                {v.id !== 'default' && !builtinIds.includes(v.id) && (
                  <button onClick={() => deleteVoice(v.id)}
                    className="p-1.5 rounded-lg text-[10px] transition-all hover:bg-red-500/10"
                    style={{ color: '#ef4444' }} title="Delete voice">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VOICE CLONING
// ═══════════════════════════════════════════════════════════════
function VoiceCloning({ voices, setVoices, setVoiceId }: { voices: Voice[]; setVoices: (v: Voice[]) => void; setVoiceId: (v: string) => void }) {
  const [cloneName, setCloneName] = useState('');
  const [cloneDesc, setCloneDesc] = useState('');
  const [cloneFiles, setCloneFiles] = useState<File[]>([]);
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
    const srcs: File[] = cloneFiles.length > 0 ? cloneFiles : (recordedBlob ? [new File([recordedBlob], 'recording.webm', { type: 'audio/webm' })] : []);
    if (srcs.length === 0 || !cloneName.trim() || cloning) return;
    setCloning(true); setCloneResult(null);
    try {
      const form = new FormData();
      srcs.forEach(f => form.append('files', f));
      form.append('name', cloneName.trim()); form.append('description', cloneDesc.trim());
      const res = await fetch(`${TTS_API}/voices/clone`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCloneResult(`Voice "${data.name}" created from ${data.source_files} file(s)! Duration: ${data.ref_duration_s}s`);
      setVoiceId(data.id);
      fetch(`${TTS_API}/voices`).then(r => r.json()).then(setVoices).catch(() => {});
      setCloneName(''); setCloneDesc(''); setCloneFiles([]); setRecordedBlob(null);
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
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Upload multiple audio files for the best clone quality. More samples = better voice match.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <input type="text" placeholder="Voice name (e.g., 'My Narrator')" value={cloneName} onChange={e => setCloneName(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />
          <input type="text" placeholder="Description (optional)" value={cloneDesc} onChange={e => setCloneDesc(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />

          <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-opacity-80"
            style={{ borderColor: cloneFiles.length > 0 ? 'var(--ept-accent)' : 'var(--ept-border)', backgroundColor: cloneFiles.length > 0 ? 'var(--ept-accent-glow)' : 'transparent' }}>
            <input type="file" accept="audio/*" multiple className="hidden" onChange={e => {
              const newFiles = Array.from(e.target.files || []);
              const oversized = newFiles.find(f => f.size > MAX_CLONE_SIZE);
              if (oversized) { setCloneResult(`Error: "${oversized.name}" too large (${(oversized.size / 1024 / 1024).toFixed(1)}MB). Max 50MB per file.`); return; }
              setCloneFiles(prev => [...prev, ...newFiles]); setRecordedBlob(null); setCloneResult(null);
              e.target.value = '';
            }} />
            {cloneFiles.length > 0 ? (
              <div className="text-center w-full">
                <svg className="w-6 h-6 mx-auto mb-1" style={{ color: 'var(--ept-accent)' }} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                <div className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{cloneFiles.length} file{cloneFiles.length > 1 ? 's' : ''} selected</div>
                <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{(cloneFiles.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1)} MB total — click to add more</div>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ept-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" /></svg>
                <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Drop audio files or click</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--ept-text-muted)' }}>WAV, MP3, M4A, OGG, FLAC — multiple files for better clones</div>
              </div>
            )}
          </label>
          {cloneFiles.length > 0 && (
            <div className="space-y-1">
              {cloneFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <span className="truncate flex-1" style={{ color: 'var(--ept-text-secondary)' }}>{f.name} ({(f.size / 1024 / 1024).toFixed(1)}MB)</span>
                  <button onClick={(e) => { e.preventDefault(); setCloneFiles(prev => prev.filter((_, j) => j !== i)); }} className="ml-2 hover:opacity-80" style={{ color: 'var(--ept-text-muted)' }}>&times;</button>
                </div>
              ))}
            </div>
          )}

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

          <button onClick={cloneVoice} disabled={cloning || (cloneFiles.length === 0 && !recordedBlob) || !cloneName.trim()}
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

        {/* Sample + Cloned voices */}
        <div className="space-y-4">
          {/* Sample Voices */}
          <SampleVoiceCards voices={voices} setVoiceId={setVoiceId} deleteVoice={deleteVoice} />
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Tips</span>
            <div className="mt-3 space-y-2 text-[11px]" style={{ color: 'var(--ept-text-secondary)' }}>
              {['Upload multiple files for best results', 'Use 10-30 seconds of clean speech per file', 'Minimize background noise', 'Speak naturally and consistently', 'WAV at 24kHz+ gives best results'].map((t, i) => (
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

  const [previewError, setPreviewError] = useState<string | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const playingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const preview = async (vid: string) => {
    // Abort any existing preview
    if (abortRef.current) abortRef.current.abort();
    audioQueueRef.current = [];
    playingRef.current = false;
    setPreviewId(vid); setPreviewError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Use single /tts endpoint — eliminates choppy gaps between sentence chunks
      const res = await fetch(`${TTS_API}/tts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello, this is a preview of my voice. I can speak naturally and clearly.', voice_id: vid, speed: 0.95, output_format: 'wav' }),
        signal: controller.signal,
      });
      if (!res.ok) {
        setPreviewError(`TTS error: ${res.status}`); setPreviewId(null); return;
      }
      const blob = await res.blob();
      if (blob.size < 100) { setPreviewError('Empty audio'); setPreviewId(null); return; }
      const url = URL.createObjectURL(blob);
      playingRef.current = true;
      const audio = new Audio(url);
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); reject(new Error('playback error')); };
        audio.play().catch(reject);
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setPreviewError(e instanceof Error ? e.message : 'Preview failed');
    } finally {
      playingRef.current = false;
      setPreviewId(null);
    }
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
      {previewError && (
        <div className="rounded-lg px-4 py-2 text-xs font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {previewError}
        </div>
      )}
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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('male');
  const [age, setAge] = useState('adult');
  const [accent, setAccent] = useState('american');
  const [tone, setTone] = useState('neutral');
  const [sampleText, setSampleText] = useState('Hello, I\'m testing this new designed voice. It captures my unique character and speaking style perfectly.');
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [labelKey, setLabelKey] = useState('');
  const [labelVal, setLabelVal] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedVoice, setSavedVoice] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewOnly, setPreviewOnly] = useState(false);

  const AGES = [
    { value: 'child', label: 'Child' }, { value: 'teen', label: 'Teen' },
    { value: 'adult', label: 'Adult' }, { value: 'middle_aged', label: 'Middle-aged' },
    { value: 'elderly', label: 'Elderly' },
  ];
  const ACCENTS = [
    { value: 'american', label: 'American' }, { value: 'british', label: 'British' },
    { value: 'australian', label: 'Australian' }, { value: 'southern', label: 'Southern US' },
    { value: 'texan', label: 'Texan' }, { value: 'new_york', label: 'New York' },
    { value: 'irish', label: 'Irish' }, { value: 'scottish', label: 'Scottish' },
    { value: 'indian', label: 'Indian' }, { value: 'french', label: 'French' },
    { value: 'german', label: 'German' }, { value: 'spanish', label: 'Spanish' },
    { value: 'japanese', label: 'Japanese' }, { value: 'korean', label: 'Korean' },
  ];
  const TONES = [
    { value: 'neutral', label: 'Neutral' }, { value: 'warm', label: 'Warm' },
    { value: 'authoritative', label: 'Authoritative' }, { value: 'gentle', label: 'Gentle' },
    { value: 'energetic', label: 'Energetic' }, { value: 'serious', label: 'Serious' },
    { value: 'raspy', label: 'Raspy' }, { value: 'deep', label: 'Deep' },
    { value: 'breathy', label: 'Breathy' }, { value: 'crisp', label: 'Crisp' },
  ];

  const generatePreview = async () => {
    setGenerating(true); setError(null); setPreviewOnly(true);
    try {
      const fd = new FormData();
      fd.append('gender', gender); fd.append('age', age);
      fd.append('accent', accent); fd.append('tone', tone);
      fd.append('sample_text', sampleText || 'Hello, I am testing this new designed voice.');
      const res = await fetch(`${TTS_API}/voice-design/advanced`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      new Audio(url).play();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Preview failed'); } finally { setGenerating(false); }
  };

  const createAndSave = async () => {
    if (!name.trim()) { setError('Please enter a name for your voice'); return; }
    setSaving(true); setError(null);
    try {
      const res = await fetch(`${TTS_API}/voice-design/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), gender, age, accent, tone, sample_text: sampleText || undefined, labels }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSavedVoice({ id: data.id, name: data.name });
      // Play the preview
      if (data.preview_audio_b64) {
        const bytes = Uint8Array.from(atob(data.preview_audio_b64), c => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: 'audio/wav' });
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        new Audio(url).play();
      }
      // Refresh voice list
      try {
        const vRes = await fetch(`${TTS_API}/voices`);
        if (vRes.ok) setVoices(await vRes.json());
      } catch { /* non-critical */ }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Voice creation failed'); } finally { setSaving(false); }
  };

  const addLabel = () => {
    if (labelKey.trim() && labelVal.trim()) {
      setLabels(prev => ({ ...prev, [labelKey.trim()]: labelVal.trim() }));
      setLabelKey(''); setLabelVal('');
    }
  };
  const removeLabel = (key: string) => setLabels(prev => { const n = { ...prev }; delete n[key]; return n; });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Voice Design</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>
          Create a unique AI voice by describing its characteristics. Preview it, then save it to your voice library for use in any project.
        </p>
      </div>

      {error && <div className="rounded-lg px-4 py-2.5 text-xs font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

      {savedVoice && (
        <div className="rounded-xl border p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}>
            <svg className="w-5 h-5" style={{ color: '#10b981' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: '#10b981' }}>Voice &quot;{savedVoice.name}&quot; created!</div>
            <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>ID: {savedVoice.id} — Now available in all voice selectors</div>
          </div>
          {previewUrl && (
            <button onClick={() => new Audio(previewUrl).play()} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>Play
            </button>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Column 1: Description + Name */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent-glow)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Describe Your Voice</span>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Voice Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Midnight Narrator, Sarah the Teacher..."
                className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none focus:ring-1"
                style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', borderColor: 'var(--ept-border)', '--tw-ring-color': 'var(--ept-accent)' } as React.CSSProperties} />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                placeholder="Describe the voice in natural language: e.g. 'A warm, deep male voice with a slight Southern drawl. Speaks slowly and deliberately, like a storyteller around a campfire. Has a rich, velvety quality with hints of aged whiskey.'"
                className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none focus:ring-1 resize-none"
                style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', borderColor: 'var(--ept-border)', '--tw-ring-color': 'var(--ept-accent)' } as React.CSSProperties} />
              <div className="text-[10px] mt-0.5 text-right" style={{ color: 'var(--ept-text-muted)' }}>{description.length}/500</div>
            </div>

            {/* Structured params */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Gender</label>
                <div className="flex gap-1.5">
                  {(['male', 'female', 'neutral'] as const).map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      className="flex-1 py-2 rounded-lg text-[11px] font-medium capitalize transition-all"
                      style={{ backgroundColor: gender === g ? 'var(--ept-accent)' : 'var(--ept-surface)', color: gender === g ? '#fff' : 'var(--ept-text-secondary)' }}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Age</label>
                <select value={age} onChange={e => setAge(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}>
                  {AGES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Accent</label>
                <select value={accent} onChange={e => setAccent(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}>
                  {ACCENTS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}>
                  {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            {/* Sample text */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Preview Text</label>
              <textarea value={sampleText} onChange={e => setSampleText(e.target.value)} rows={2}
                className="w-full rounded-lg px-3 py-2 text-xs border outline-none resize-none"
                style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', borderColor: 'var(--ept-border)' }} />
            </div>

            {/* Labels / Tags */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Labels (optional)</label>
              {Object.keys(labels).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Object.entries(labels).map(([k, v]) => (
                    <span key={k} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                      {k}: {v}
                      <button onClick={() => removeLabel(k)} className="ml-0.5 hover:opacity-70">&times;</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5">
                <input type="text" value={labelKey} onChange={e => setLabelKey(e.target.value)} placeholder="Key (e.g. use_case)"
                  className="flex-1 rounded-lg px-2 py-1.5 text-[11px] border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />
                <input type="text" value={labelVal} onChange={e => setLabelVal(e.target.value)} placeholder="Value (e.g. podcast)"
                  className="flex-1 rounded-lg px-2 py-1.5 text-[11px] border-0 outline-none" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}
                  onKeyDown={e => e.key === 'Enter' && addLabel()} />
                <button onClick={addLabel} className="px-3 py-1.5 rounded-lg text-[11px] font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>Add</button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <button onClick={generatePreview} disabled={generating || saving}
                className="flex-1 py-2.5 rounded-lg text-xs font-semibold disabled:opacity-40 border transition-all"
                style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'transparent' }}>
                {generating ? 'Generating...' : 'Preview Voice'}
              </button>
              <button onClick={createAndSave} disabled={generating || saving || !name.trim()}
                className="flex-1 py-2.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-all"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                {saving ? 'Creating Voice...' : 'Create & Save to Library'}
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Preview card */}
        <div className="space-y-5">
          <div className="rounded-xl border p-5 flex flex-col items-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 relative" style={{ backgroundColor: gender === 'female' ? 'rgba(244,63,94,0.1)' : gender === 'neutral' ? 'rgba(139,92,246,0.1)' : 'rgba(99,102,241,0.1)' }}>
              <svg className="w-10 h-10" style={{ color: gender === 'female' ? '#f43f5e' : gender === 'neutral' ? '#8b5cf6' : '#6366f1' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
              </svg>
              {(generating || saving) && (
                <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
              )}
            </div>

            <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--ept-text)' }}>
              {name || 'Unnamed Voice'}
            </div>

            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {[gender, AGES.find(a => a.value === age)?.label || age, ACCENTS.find(a => a.value === accent)?.label || accent, TONES.find(t => t.value === tone)?.label || tone].map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{tag}</span>
              ))}
            </div>

            {description && (
              <p className="text-[11px] text-center mb-3 leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                &ldquo;{description.length > 120 ? description.slice(0, 120) + '...' : description}&rdquo;
              </p>
            )}

            {previewUrl && (
              <div className="w-full space-y-2">
                <Waveform audioUrl={previewUrl} isPlaying={false} />
                <button onClick={() => { const a = new Audio(previewUrl); a.play(); }}
                  className="w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                  Play Preview
                </button>
              </div>
            )}

            {!previewUrl && !generating && (
              <p className="text-[10px] text-center mt-2" style={{ color: 'var(--ept-text-muted)' }}>
                Configure parameters and click Preview or Create to hear your designed voice.
              </p>
            )}
          </div>

          {/* Quick templates */}
          <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Quick Templates</div>
            {[
              { name: 'Campfire Storyteller', desc: 'Warm, deep voice with a slow Southern drawl. Rich and velvety, like a storyteller around a campfire.', g: 'male' as const, age: 'middle_aged', acc: 'southern', tone: 'warm' },
              { name: 'News Anchor', desc: 'Crisp, authoritative, professional. Clear American diction with confident delivery.', g: 'female' as const, age: 'adult', acc: 'american', tone: 'authoritative' },
              { name: 'Gentle Teacher', desc: 'Soft, patient, encouraging voice. Speaks clearly and warmly, perfect for educational content.', g: 'female' as const, age: 'adult', acc: 'british', tone: 'gentle' },
              { name: 'Action Narrator', desc: 'Energetic, dramatic male voice. Commands attention with intensity and excitement.', g: 'male' as const, age: 'adult', acc: 'american', tone: 'energetic' },
            ].map(t => (
              <button key={t.name} onClick={() => { setName(t.name); setDescription(t.desc); setGender(t.g); setAge(t.age); setAccent(t.acc); setTone(t.tone); setSavedVoice(null); setPreviewUrl(null); }}
                className="w-full text-left px-3 py-2 rounded-lg text-[11px] transition-all hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{t.name}</span>
                <span className="block text-[10px] mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{t.desc.slice(0, 60)}...</span>
              </button>
            ))}
          </div>
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
// ═══════════════════════════════════════════════════════════════
// TRANSCRIBE (Speech to Text)
// ═══════════════════════════════════════════════════════════════
function Transcribe() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('');
  const [wordTimestamps, setWordTimestamps] = useState(false);
  const [result, setResult] = useState<{ text: string; segments: { start: number; end: number; text: string; words?: { word: string; start: number; end: number }[] }[]; language: string; duration: number; processing_time_ms: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const transcribe = async () => {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    const form = new FormData();
    form.append('file', file);
    if (language) form.append('language', language);
    form.append('word_timestamps', String(wordTimestamps));
    try {
      const res = await fetch(`${TTS_API}/transcribe`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      setResult(await res.json());
    } catch (e: unknown) { setError((e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Speech to Text</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Transcribe audio with Whisper large-v3. Word-level timestamps, auto language detection.</p>
      </div>
      <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Upload Audio File</span>
            <input type="file" accept="audio/*,.wav,.mp3,.flac,.ogg,.m4a" onChange={e => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium cursor-pointer"
              style={{ color: 'var(--ept-text)' }} />
          </label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Language (auto-detect if empty)</label>
              <input type="text" placeholder="en, es, fr, de, ja..." value={language} onChange={e => setLanguage(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: 'var(--ept-bg)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
            </div>
            <label className="flex items-center gap-2 pb-2 cursor-pointer">
              <input type="checkbox" checked={wordTimestamps} onChange={e => setWordTimestamps(e.target.checked)} className="accent-teal-500" />
              <span className="text-xs" style={{ color: 'var(--ept-text-secondary)' }}>Word timestamps</span>
            </label>
          </div>
          <button onClick={transcribe} disabled={!file || loading}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-40"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {loading ? 'Transcribing...' : 'Transcribe'}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {result && (
          <div className="space-y-3 pt-2">
            <div className="flex gap-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
              <span>Language: <strong style={{ color: 'var(--ept-accent)' }}>{result.language}</strong></span>
              <span>Duration: <strong>{result.duration}s</strong></span>
              <span>Processing: <strong>{result.processing_time_ms}ms</strong></span>
            </div>
            <div className="p-4 rounded-lg text-sm whitespace-pre-wrap" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>{result.text}</div>
            {result.segments.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium" style={{ color: 'var(--ept-accent)' }}>Segments ({result.segments.length})</summary>
                <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                  {result.segments.map((seg, i) => (
                    <div key={i} className="flex gap-2 text-xs py-1 px-2 rounded" style={{ backgroundColor: 'var(--ept-bg)' }}>
                      <span className="font-mono shrink-0" style={{ color: 'var(--ept-accent)' }}>{seg.start.toFixed(1)}s</span>
                      <span style={{ color: 'var(--ept-text)' }}>{seg.text}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
            <button onClick={() => navigator.clipboard.writeText(result.text)} className="text-xs px-3 py-1 rounded border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Copy Text</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DIALOGUE STUDIO (multi-speaker)
// ═══════════════════════════════════════════════════════════════
function DialogueStudio({ voices, voiceId, setVoiceId }: { voices: Voice[]; voiceId: string; setVoiceId: (v: string) => void }) {
  const [script, setScript] = useState('');
  const [lines, setLines] = useState<{ speaker: string; voice_id: string; text: string; emotion?: string }[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pauseMs, setPauseMs] = useState(400);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const parseScript = async () => {
    if (!script.trim()) return;
    try {
      const form = new FormData();
      form.append('text', script);
      const res = await fetch(`${TTS_API}/dialogue/parse`, { method: 'POST', body: form });
      if (res.ok) { const data = await res.json(); setLines(data.lines); }
    } catch { /* parse locally as fallback */
      const parsed = script.trim().split('\n').filter(l => l.trim()).map(l => {
        const [speaker, ...rest] = l.split(':');
        return { speaker: speaker?.trim() || 'Narrator', voice_id: voiceId, text: rest.join(':').trim() || l };
      });
      setLines(parsed);
    }
  };

  const generate = async () => {
    if (lines.length === 0) return;
    setLoading(true); setError(''); setAudioUrl(null);
    try {
      const res = await fetch(`${TTS_API}/dialogue`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, pause_between_ms: pauseMs, output_format: 'wav' }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e: unknown) { setError((e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Dialogue Studio</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Create multi-speaker conversations. Format: Speaker Name: dialogue text</p>
      </div>
      <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
        <textarea value={script} onChange={e => setScript(e.target.value)} rows={8} placeholder={'Echo: Welcome to Echo Speak.\nCommander: Good to see you, Echo.\nEcho: Let me show you what I can do.\nCommander: I\'m ready. Show me everything.'}
          className="w-full px-4 py-3 rounded-lg text-sm resize-none border" style={{ backgroundColor: 'var(--ept-bg)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
        <div className="flex gap-3 items-center">
          <button onClick={parseScript} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>Parse Script</button>
          <Slider label="Pause between lines" value={pauseMs} onChange={setPauseMs} min={0} max={2000} step={100} unit="ms" />
        </div>
        {lines.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{lines.length} lines parsed</div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {lines.map((line, i) => (
                <div key={i} className="flex items-center gap-2 text-sm py-1.5 px-3 rounded" style={{ backgroundColor: 'var(--ept-bg)' }}>
                  <span className="font-semibold shrink-0 w-24 truncate" style={{ color: 'var(--ept-accent)' }}>{line.speaker}</span>
                  <select value={line.voice_id} onChange={e => { const updated = [...lines]; updated[i] = { ...line, voice_id: e.target.value }; setLines(updated); }}
                    className="text-xs px-2 py-1 rounded border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                  <span className="flex-1 truncate" style={{ color: 'var(--ept-text)' }}>{line.text}</span>
                </div>
              ))}
            </div>
            <button onClick={generate} disabled={loading}
              className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-40 mt-2"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              {loading ? 'Generating Dialogue...' : `Generate ${lines.length} Lines`}
            </button>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {audioUrl && (
          <div className="flex items-center gap-3 pt-2">
            <audio ref={audioRef} src={audioUrl} controls className="flex-1" />
            <a href={audioUrl} download="dialogue.wav" className="text-xs px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Download</a>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DUBBING STUDIO
// ═══════════════════════════════════════════════════════════════
function DubbingStudio({ voices }: { voices: Voice[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState('es');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');

  const languages = [
    { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }, { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' }, { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' }, { code: 'ko', name: 'Korean' }, { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }, { code: 'ru', name: 'Russian' }, { code: 'nl', name: 'Dutch' },
  ];

  const dub = async () => {
    if (!file) return;
    setLoading(true); setError(''); setAudioUrl(null); setTranscript('');
    const form = new FormData();
    form.append('file', file);
    form.append('target_lang', targetLang);
    try {
      const res = await fetch(`${TTS_API}/dub`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setTranscript(res.headers.get('X-Source-Text') || '');
    } catch (e: unknown) { setError((e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Dubbing Studio</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Upload audio in one language, get it dubbed in another. Auto transcription + translation + TTS.</p>
      </div>
      <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
        <label className="block">
          <span className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Upload Audio</span>
          <input type="file" accept="audio/*,.wav,.mp3" onChange={e => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium cursor-pointer"
            style={{ color: 'var(--ept-text)' }} />
        </label>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Target Language</label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {languages.map(l => (
              <button key={l.code} onClick={() => setTargetLang(l.code)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all border"
                style={{
                  backgroundColor: targetLang === l.code ? 'var(--ept-accent-glow)' : 'var(--ept-bg)',
                  borderColor: targetLang === l.code ? 'var(--ept-accent)' : 'var(--ept-border)',
                  color: targetLang === l.code ? 'var(--ept-accent)' : 'var(--ept-text-secondary)',
                }}>{l.name}</button>
            ))}
          </div>
        </div>
        <button onClick={dub} disabled={!file || loading}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-40"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          {loading ? 'Dubbing...' : 'Dub Audio'}
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {transcript && (
          <div className="text-xs p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text-muted)' }}>
            <span className="font-medium">Source transcript:</span> {transcript}
          </div>
        )}
        {audioUrl && (
          <div className="flex items-center gap-3">
            <audio src={audioUrl} controls className="flex-1" />
            <a href={audioUrl} download={`dubbed_${targetLang}.wav`} className="text-xs px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Download</a>
          </div>
        )}
      </div>
    </div>
  );
}

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
          {section === 'transcribe' && <Transcribe />}
          {section === 'dialogue' && <DialogueStudio voices={voices} voiceId={voiceId} setVoiceId={setVoiceId} />}
          {section === 'dubbing' && <DubbingStudio voices={voices} />}
          {section === 'api' && <ApiDocs />}
        </main>
      </div>
    </div>
  );
}
