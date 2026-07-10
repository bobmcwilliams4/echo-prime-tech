'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ACCENT, BG_CARD, BORDER, CATEGORIES, GOLD } from '../lib/constants';
import {
  selectNextQuestion, answerQuestion, extractTraits, synthesizeSpeech, transcribeAudio, getCoverage,
  type InterviewQuestion, type CoverageCategory,
} from '../lib/vault-api';
import { playAudioBlob, createMediaRecorder, stopCamera, type RecorderHandle } from '../lib/media';
import CameraPiP from './CameraPiP';
import AskEcho from './AskEcho';
import VaultIcon, { CATEGORY_ICON } from './VaultIcon';

const iconLabel = { display: 'inline-flex', alignItems: 'center', gap: 7 } as const;

/** Interview mode: null = welcome screen; 'auto' = Echo picks the subjects
 *  (the default — one Start button); a category id = the user jumped to it. */
type Mode = null | 'auto' | string;

interface Props {
  userId: string;
}

/* Thin gold coverage bar used on subject tiles and above the question. */
function CoverageBar({ pct, height = 4 }: { pct: number; height?: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: '#1c1c22', height }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: `linear-gradient(90deg, ${GOLD}99, ${GOLD})` }}
      />
    </div>
  );
}

export default function InterviewPanel({ userId }: Props) {
  const [mode, setMode] = useState<Mode>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [focus, setFocus] = useState<{ category: string; answered: number; target: number } | null>(null);
  const [coverage, setCoverage] = useState<CoverageCategory[]>([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const spokenFor = useRef<string | null>(null);

  // ── STT: Echo hears the user ──────────────────────────────────────────────
  // Two paths: (1) the browser Web Speech API (free, on-device) where it works
  // reliably — desktop Chrome, Android; (2) a MediaRecorder → Whisper fallback
  // for iOS Safari, where webkitSpeechRecognition exists but is unreliable/silent.
  // We pick 'record' on iOS or when Web Speech is absent so a phone can always
  // answer by voice. (Commander 2026-07-10: STT was dead on his iPhone.)
  const [listening, setListening] = useState(false);      // speech-mode active
  const [recording, setRecording] = useState(false);      // record-mode capturing
  const [transcribing, setTranscribing] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);
  const [sttMode, setSttMode] = useState<'speech' | 'record'>('speech');
  const [needsTap, setNeedsTap] = useState(false);
  const recognitionRef = useRef<any>(null);
  const recorderRef = useRef<RecorderHandle | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioPrimed = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<any>(null);
  const lastUrlRef = useRef<string | null>(null);

  const loadCoverage = useCallback(() => {
    getCoverage(userId).then(d => setCoverage(d.categories || [])).catch(() => { /* non-fatal */ });
  }, [userId]);

  useEffect(() => { loadCoverage(); }, [loadCoverage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const canRecord = typeof navigator.mediaDevices?.getUserMedia === 'function'
      && typeof (window as any).MediaRecorder !== 'undefined';

    if (SR && !isIOS) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (e: any) => {
        let finalText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        }
        if (finalText.trim()) setAnswer(prev => (prev ? prev.trimEnd() + ' ' : '') + finalText.trim());
      };
      rec.onend = () => setListening(false);
      rec.onerror = (ev: any) => {
        setListening(false);
        // Browser blocked Web Speech → fall back to record→Whisper so voice still works.
        if (ev && ['not-allowed', 'service-not-allowed', 'language-not-supported'].includes(ev.error) && canRecord) {
          setSttMode('record');
        }
      };
      recognitionRef.current = rec;
      setSttMode('speech');
      setSttSupported(true);
    } else if (canRecord) {
      setSttMode('record');   // iOS Safari + any browser without Web Speech
      setSttSupported(true);
    } else {
      setSttSupported(false);
    }
    return () => { try { recognitionRef.current?.stop(); } catch { /* noop */ } };
  }, []);

  // Record-mode: capture a clip, then transcribe server-side (Whisper).
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const handle = createMediaRecorder(stream, true);
      recorderRef.current = handle;
      handle.recorder.start();
      setRecording(true);
    } catch {
      setRecording(false);   // mic permission denied — user can type instead
    }
  };

  const stopRecordingAndTranscribe = async () => {
    const handle = recorderRef.current;
    if (!handle) return;
    setRecording(false);
    setTranscribing(true);
    try {
      const blob = await handle.stop();
      stopCamera(streamRef.current); streamRef.current = null;
      const ext = handle.mimeType.includes('mp4') ? 'm4a' : 'webm';
      const text = await transcribeAudio(blob, `answer.${ext}`);
      if (text) setAnswer(prev => (prev ? prev.trimEnd() + ' ' : '') + text);
    } catch { /* transient — user can retry or type */ }
    setTranscribing(false);
  };

  const toggleMic = () => {
    if (transcribing) return;
    if (sttMode === 'record') {
      if (recording) stopRecordingAndTranscribe(); else startRecording();
      return;
    }
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) { try { rec.stop(); } catch { /* noop */ } setListening(false); }
    else { try { rec.start(); setListening(true); } catch { /* already started */ } }
  };

  const stopMic = () => {
    if (sttMode === 'record') {
      if (recording) stopRecordingAndTranscribe();
      return;
    }
    const rec = recognitionRef.current;
    if (rec && listening) { try { rec.stop(); } catch { /* noop */ } }
    setListening(false);
  };

  const micActive = listening || recording;

  // One persistent, gesture-unlocked <audio> element. Unlocking it inside a click
  // (even with a silent source) lets us set .src later and play — the reliable
  // pattern across browsers, incl. iOS Safari where an async fetch before play()
  // otherwise breaks the gesture requirement.
  const getAudioEl = () => {
    if (!audioRef.current && typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      // iOS Safari: keep inline so a programmatic play() isn't blocked/hijacked.
      audioRef.current.setAttribute('playsinline', '');
      (audioRef.current as any).playsInline = true;
    }
    return audioRef.current;
  };

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      try {
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AC) audioCtxRef.current = new AC();
      } catch { /* no WebAudio — HTMLAudio path still available */ }
    }
    return audioCtxRef.current;
  };

  // Call inside a user gesture to unlock audio playback on mobile.
  const primeAudio = () => {
    // Resume a WebAudio context too — iOS ties autoplay permission to it, and a
    // resumed context can keep PLAYING through it after async fetches (the gap
    // that otherwise re-locks <audio>.play() on iOS Safari).
    try { getAudioCtx()?.resume?.(); } catch { /* noop */ }
    if (audioPrimed.current) return;
    const a = getAudioEl();
    if (!a) return;
    a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    a.volume = 0;
    a.play().then(() => { audioPrimed.current = true; a.volume = 1; }).catch(() => { /* still locked → 'Tap to hear Echo' fallback shows */ });
  };

  // Decode + play through the (gesture-resumed) AudioContext. On iOS Safari this
  // is more reliable than <audio>.play() after an async fetch: a running context
  // is allowed to keep producing sound without a fresh gesture.
  const playViaWebAudio = async (blob: Blob) => {
    const ctx = getAudioCtx();
    if (!ctx) throw new Error('webaudio-unavailable');
    try { await ctx.resume?.(); } catch { /* noop */ }
    if (ctx.state !== 'running') throw new Error('webaudio-suspended');
    const raw = await blob.arrayBuffer();
    // Safari's callback-style decodeAudioData — promisify defensively.
    const audioBuf: AudioBuffer = await new Promise((resolve, reject) => {
      const p = ctx.decodeAudioData(raw, resolve, reject);
      if (p && typeof p.then === 'function') p.then(resolve, reject);
    });
    const src = ctx.createBufferSource();
    src.buffer = audioBuf;
    src.connect(ctx.destination);
    src.start(0);
  };

  const speakQuestion = useCallback(async (q: InterviewQuestion) => {
    setSpeaking(true);
    try {
      // Synthesize (retry once — the TTS service can hiccup on a cold start).
      let blob: Blob;
      try {
        blob = await synthesizeSpeech(q.question, 'warmth');
      } catch {
        blob = await synthesizeSpeech(q.question, 'warmth');
      }
      // Playback ladder: WebAudio (most reliable post-fetch on iOS) → the
      // persistent unlocked <audio> element → one-tap fallback. Never silent
      // without showing the gold "Tap to hear Echo" button.
      try {
        await playViaWebAudio(blob);
        setNeedsTap(false);
      } catch {
        const a = getAudioEl();
        if (!a) { await playAudioBlob(blob); setNeedsTap(false); setSpeaking(false); return; }
        a.volume = 1;
        if (lastUrlRef.current) { try { URL.revokeObjectURL(lastUrlRef.current); } catch { /* noop */ } }
        const url = URL.createObjectURL(blob);
        lastUrlRef.current = url;
        a.src = url;
        await a.play();
        setNeedsTap(false);
      }
    } catch {
      // Autoplay blocked or synthesis failed twice → surface the one-tap
      // "Hear Echo" button instead of failing silently.
      setNeedsTap(true);
    }
    setSpeaking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read each new question aloud (free sovereign TTS) — Commander directive
  // 2026-07-03: the interviewer speaks, the user just answers.
  useEffect(() => {
    if (voiceOn && question && spokenFor.current !== question.question_id) {
      spokenFor.current = question.question_id;
      speakQuestion(question);
    }
  }, [question, voiceOn, speakQuestion]);

  // Cleanup on unmount: stop audio, free the last blob URL, stop the mic.
  useEffect(() => () => {
    try { audioRef.current?.pause(); } catch { /* noop */ }
    if (lastUrlRef.current) { try { URL.revokeObjectURL(lastUrlRef.current); } catch { /* noop */ } }
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    try { stopCamera(streamRef.current); } catch { /* noop */ }
    try { audioCtxRef.current?.close?.(); } catch { /* noop */ }
  }, []);

  /** Fetch the next question. mode 'auto' → Echo picks the subject and covers
   *  it deeply (100+ answers) before moving on; a category id → user's jump. */
  const fetchNext = async (m: Exclude<Mode, null>) => {
    setLoading(true);
    try {
      const next = await selectNextQuestion(userId, m === 'auto' ? undefined : m);
      setQuestion(next.question);
      setFocus({ category: next.focusCategory, answered: next.answered, target: next.target });
    } catch (err) {
      console.error('Failed to load question:', err);
    }
    setLoading(false);
  };

  const startInterview = async (m: Exclude<Mode, null>) => {
    primeAudio(); // unlock TTS playback on this gesture
    setMode(m);
    await fetchNext(m);
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !question || !mode) return;
    stopMic();
    setLoading(true);
    try {
      await answerQuestion(userId, question.question_id, answer.trim(), question.category || focus?.category);
      // Fire-and-forget: extract personality traits from the answer via AI
      extractTraits(userId, answer.trim(), 'interview').catch(() => {});
      setSubmitted(true);
      setAnswer('');
      setFocus(f => (f ? { ...f, answered: f.answered + 1 } : f));
      loadCoverage();
      setTimeout(() => {
        setSubmitted(false);
        fetchNext(mode);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit:', err);
    }
    setLoading(false);
  };

  if (mode && question) {
    const generated = question.question_id.startsWith('gen_');
    const focusCat = CATEGORIES.find(c => c.id === (focus?.category || question.category));
    const focusPct = focus ? Math.min(100, Math.round((100 * focus.answered) / Math.max(1, focus.target))) : 0;
    return (
      <div className="space-y-6">
        <CameraPiP />
        <div className="flex items-center justify-between">
          <button onClick={() => { setMode(null); setQuestion(null); setFocus(null); loadCoverage(); }} className="text-sm" style={{ color: ACCENT }}>
            &larr; Pause Interview
          </button>
          <button
            onClick={() => setVoiceOn(v => !v)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ border: `1px solid ${BORDER}`, color: voiceOn ? GOLD : '#71717a' }}
            title="Read questions aloud"
          >
            <span style={iconLabel}><VaultIcon name="speaker" size={14} />{voiceOn ? 'Voice On' : 'Voice Off'}</span>
          </button>
        </div>

        {/* The subject Echo is exploring now, with deep-coverage progress. */}
        <div className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono flex items-center gap-2" style={{ color: GOLD, letterSpacing: 2 }}>
              <VaultIcon name={CATEGORY_ICON[focus?.category || question.category] || 'spark'} size={16} />
              {(focusCat?.name || question.category).toUpperCase()}
            </div>
            {focus && (
              <div className="text-xs" style={{ color: '#a1a1aa' }}>
                {focus.answered} of {focus.target} memories preserved
              </div>
            )}
          </div>
          <CoverageBar pct={focusPct} />
          <p className="text-[11px] mt-2" style={{ color: '#71717a' }}>
            Echo chooses each subject and explores it deeply before moving to the next chapter of your story.
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono" style={{ color: ACCENT, letterSpacing: 2 }}>
              QUESTION {focus ? focus.answered + 1 : ''}
            </div>
            {generated && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: '#1e1033', color: GOLD, border: `1px solid ${BORDER}` }}>
                <span style={iconLabel}><VaultIcon name="spark" size={11} /> written just for you</span>
              </span>
            )}
          </div>
          <p className="text-xl text-white font-light italic leading-relaxed mb-3">
            &ldquo;{question.question}&rdquo;
          </p>
          <button
            onClick={() => { primeAudio(); if (question) speakQuestion(question); }}
            disabled={speaking}
            className="text-sm mb-4 px-4 py-2 rounded-full font-semibold disabled:opacity-40 transition hover:scale-[1.02]"
            style={needsTap
              ? { background: GOLD, color: '#0a0a0f', border: 'none', boxShadow: `0 0 20px ${GOLD}66` }
              : { border: `1px solid ${BORDER}`, color: '#d4d4d8' }}
          >
            <span style={iconLabel}><VaultIcon name="speaker" size={16} />{speaking ? 'Echo is speaking…' : needsTap ? 'Tap to hear Echo' : 'Hear it again'}</span>
          </button>
          {question.video_instructions && (
            <div className="text-xs text-gray-500 mb-4 p-3 rounded-lg" style={{ background: '#0a0a0f' }}>
              <span style={iconLabel}><VaultIcon name="camera" size={14} /> {question.video_instructions}</span>
            </div>
          )}
          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-2 flex justify-center" style={{ color: GOLD }}><VaultIcon name="spark" size={34} /></div>
              <div className="text-sm" style={{ color: GOLD }}>Memory preserved. Echo is choosing the next question&hellip;</div>
            </div>
          ) : (
            <>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Speak or type your story... Take your time, every detail matters."
                className="w-full p-4 rounded-lg text-sm text-white placeholder-gray-600 resize-none outline-none focus:ring-1 focus:ring-purple-500"
                style={{ background: '#0a0a0f', border: `1px solid ${micActive ? '#ef4444' : BORDER}`, minHeight: 180 }}
                rows={8}
              />
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {sttSupported && (
                  <button
                    onClick={toggleMic}
                    disabled={transcribing}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold transition hover:scale-[1.02] disabled:opacity-60"
                    style={{ border: `1px solid ${micActive ? '#ef4444' : BORDER}`, color: micActive ? '#ef4444' : GOLD, background: micActive ? 'rgba(239,68,68,0.08)' : 'transparent' }}
                    title="Answer out loud — Echo is listening"
                  >
                    <span style={iconLabel}>
                      <VaultIcon name="mic" size={16} />
                      {transcribing ? 'Transcribing…' : recording ? 'Recording… tap to stop' : listening ? 'Listening… tap to stop' : 'Speak your answer'}
                    </span>
                  </button>
                )}
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition hover:scale-[1.02] disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
                >
                  {loading ? 'Saving...' : 'Preserve Memory \u{2192}'}
                </button>
              </div>
              {listening && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Echo is listening &mdash; speak naturally; your words appear above.</p>}
              {recording && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Recording your answer &mdash; tap the mic again when you&rsquo;re done and Echo will write it down.</p>}
              {transcribing && <p className="text-xs mt-2 text-gray-400">Writing down what you said&hellip;</p>}
              {!sttSupported && <p className="text-xs mt-2 text-gray-500">Voice answering isn&rsquo;t supported in this browser &mdash; you can type your answer.</p>}
            </>
          )}
        </div>
      </div>
    );
  }

  const coverageFor = (id: string) => coverage.find(c => c.category === id);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Biography Interview</h2>
      <p className="text-sm text-gray-400">
        Echo interviews you like a lifelong biographer &mdash; he asks every question out loud, chooses each
        subject himself, and explores it deeply before moving on. Just press start and talk.
      </p>

      <button
        onClick={() => startInterview('auto')}
        disabled={loading}
        className="w-full py-5 rounded-2xl text-lg font-bold transition hover:scale-[1.01] disabled:opacity-50"
        style={{ background: `linear-gradient(135deg, ${GOLD}, #b8935f)`, color: '#0a0a0f', boxShadow: `0 0 40px ${GOLD}33` }}
      >
        <span style={{ ...iconLabel, justifyContent: 'center' }}>
          <VaultIcon name="mic" size={20} />
          {loading ? 'Echo is preparing your first question…' : 'Start Interview'}
        </span>
      </button>

      {/* Your story's chapters — Echo covers each toward its target; tap one to jump there. */}
      <div>
        <div className="text-xs font-mono mb-3" style={{ color: '#a1a1aa', letterSpacing: 2 }}>
          YOUR STORY&rsquo;S COVERAGE
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const cov = coverageFor(cat.id);
            const answered = cov?.answered_total ?? cov?.answered ?? 0;
            const target = cov?.target ?? 100;
            const pct = cov?.coverage_pct ?? Math.min(100, Math.round((100 * answered) / Math.max(1, target)));
            return (
              <button
                key={cat.id}
                onClick={() => startInterview(cat.id)}
                disabled={loading}
                className="p-4 rounded-xl text-left transition hover:scale-[1.03] hover:border-purple-500"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                title={`${answered} of ${target} preserved — tap to focus this subject`}
              >
                <div className="mb-2 flex items-center gap-2" style={{ color: GOLD }}>
                  <VaultIcon name={CATEGORY_ICON[cat.id] || 'spark'} size={22} />
                  <span className="text-sm font-semibold text-white">{cat.name}</span>
                </div>
                <CoverageBar pct={pct} height={5} />
                <div className="text-[11px] mt-1.5" style={{ color: '#71717a' }}>
                  {answered} of {target} &middot; {pct}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
        </div>
      )}

      {/* Echo converses — ask him anything about the Vault, the process, or who made it. */}
      <AskEcho />
    </div>
  );
}
