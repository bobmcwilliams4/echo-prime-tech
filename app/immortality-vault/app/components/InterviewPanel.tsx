'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ACCENT, BG_CARD, BORDER, CATEGORIES, GOLD } from '../lib/constants';
import {
  selectNextQuestion, answerQuestion, extractTraits, synthesizeSpeech, transcribeAudio, getCoverage,
  uploadVideo, type InterviewQuestion, type CoverageCategory,
} from '../lib/vault-api';
import { playAudioBlob, createMediaRecorder, stopCamera, type RecorderHandle } from '../lib/media';
import CameraPiP from './CameraPiP';
import AskEcho from './AskEcho';
import VaultIcon, { CATEGORY_ICON } from './VaultIcon';

const iconLabel = { display: 'inline-flex', alignItems: 'center', gap: 7 } as const;

/** Interview mode: null = welcome screen; 'auto' = Echo picks the subjects
 *  (the default — one Start button); a category id = the user jumped to it. */
type Mode = null | 'auto' | string;

/** Hands-free tuning: how long a pause ends the answer, and hard caps. */
const SILENCE_MS = 3000;        // pause this long after speaking → answer is done
const NEVER_SPOKE_MS = 60000;   // no speech at all for a minute → stop listening
const MAX_CAPTURE_MS = 4 * 60_000; // longest single answer capture

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
  const [handsFree, setHandsFree] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const spokenFor = useRef<string | null>(null);
  const modeRef = useRef<Mode>(null);
  const handsFreeRef = useRef(true);
  const answerRef = useRef('');

  // ── STT: Echo hears the user ──────────────────────────────────────────────
  // (1) Web Speech API live transcription where reliable (desktop Chrome,
  // Android); (2) MediaRecorder → Whisper everywhere else (iOS Safari). With
  // video answers ON, ONE combined camera+mic stream feeds both the video
  // memory and (in record mode) the transcription.
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
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

  // Hands-free machinery
  const silenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const captureStartRef = useRef(0);
  const lastSoundRef = useRef(0);
  const spokeRef = useRef(false);
  const capturingRef = useRef(false);
  const analyserCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { handsFreeRef.current = handsFree; }, [handsFree]);
  useEffect(() => { answerRef.current = answer; }, [answer]);

  const loadCoverage = useCallback(() => {
    getCoverage(userId).then(d => setCoverage(d.categories || [])).catch(() => { /* non-fatal */ });
  }, [userId]);

  useEffect(() => { loadCoverage(); }, [loadCoverage]);

  // ── Draft autosave: a half-told story must survive a reload ──────────────
  useEffect(() => {
    if (!question) return;
    try {
      const draft = localStorage.getItem(`vault_draft_${question.question_id}`);
      if (draft && !answer) setAnswer(draft);
    } catch { /* private mode */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.question_id]);

  useEffect(() => {
    if (!question) return;
    const t = setTimeout(() => {
      try {
        if (answer.trim()) localStorage.setItem(`vault_draft_${question.question_id}`, answer);
      } catch { /* full/private */ }
    }, 400);
    return () => clearTimeout(t);
  }, [answer, question]);

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
        spokeRef.current = true;
        lastSoundRef.current = Date.now();
        let finalText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        }
        if (finalText.trim()) setAnswer(prev => (prev ? prev.trimEnd() + ' ' : '') + finalText.trim());
      };
      rec.onend = () => setListening(false);
      rec.onerror = (ev: any) => {
        setListening(false);
        if (ev && ['not-allowed', 'service-not-allowed', 'language-not-supported'].includes(ev.error) && canRecord) {
          setSttMode('record');
        }
      };
      recognitionRef.current = rec;
      setSttMode('speech');
      setSttSupported(true);
    } else if (canRecord) {
      setSttMode('record');
      setSttSupported(true);
    } else {
      setSttSupported(false);
    }
    if (!canRecord) setVideoOn(false);
    return () => { try { recognitionRef.current?.stop(); } catch { /* noop */ } };
  }, []);

  // ── Audio out: the interviewer's voice ────────────────────────────────────
  const getAudioEl = () => {
    if (!audioRef.current && typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
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
      } catch { /* no WebAudio */ }
    }
    return audioCtxRef.current;
  };

  // MUST be called from within a user-gesture handler (the Start / "hear again"
  // button click). Creates the AudioContext during the gesture and AWAITS its
  // resume so the later TTS playback is already unlocked — the fix for the
  // browser autoplay policy silently swallowing Echo's voice. Idempotent + reused.
  const primeAudio = async () => {
    const ctx = getAudioCtx();
    try { if (ctx && ctx.state === 'suspended') await ctx.resume(); } catch { /* noop */ }
    if (audioPrimed.current) return;
    const a = getAudioEl();
    if (!a) return;
    a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    a.volume = 0;
    try { await a.play(); audioPrimed.current = true; a.volume = 1; } catch { /* still locked — element path retries under gesture */ }
  };

  // Plays a blob through the resumed AudioContext; resolves when PLAYBACK ENDS
  // (hands-free needs the end, not the start — the mic opens after Echo finishes).
  const playViaWebAudio = async (blob: Blob) => {
    const ctx = getAudioCtx();
    if (!ctx) throw new Error('webaudio-unavailable');
    try { await ctx.resume?.(); } catch { /* noop */ }
    if (ctx.state !== 'running') throw new Error('webaudio-suspended');
    const raw = await blob.arrayBuffer();
    const audioBuf: AudioBuffer = await new Promise((resolve, reject) => {
      const p = ctx.decodeAudioData(raw, resolve, reject);
      if (p && typeof p.then === 'function') p.then(resolve, reject);
    });
    await new Promise<void>((resolve) => {
      const src = ctx.createBufferSource();
      src.buffer = audioBuf;
      src.connect(ctx.destination);
      src.onended = () => resolve();
      src.start(0);
    });
  };

  const playViaElement = async (blob: Blob) => {
    const a = getAudioEl();
    if (!a) { await playAudioBlob(blob); return; }
    a.volume = 1;
    if (lastUrlRef.current) { try { URL.revokeObjectURL(lastUrlRef.current); } catch { /* noop */ } }
    const url = URL.createObjectURL(blob);
    lastUrlRef.current = url;
    a.src = url;
    await a.play();
    await new Promise<void>((resolve) => {
      const done = () => { a.removeEventListener('ended', done); a.removeEventListener('error', done); resolve(); };
      a.addEventListener('ended', done);
      a.addEventListener('error', done);
    });
  };

  const speakQuestion = useCallback(async (q: InterviewQuestion): Promise<boolean> => {
    setSpeaking(true);
    let ok = false;
    try {
      let blob: Blob;
      try {
        blob = await synthesizeSpeech(q.question, 'warmth');
      } catch {
        blob = await synthesizeSpeech(q.question, 'warmth'); // one retry
      }
      try {
        await playViaWebAudio(blob);
      } catch {
        await playViaElement(blob);
      }
      setNeedsTap(false);
      ok = true;
    } catch {
      setNeedsTap(true); // never silently missing — the gold tap button shows
    }
    setSpeaking(false);
    return ok;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Capture: Echo listens (and optionally films) ─────────────────────────
  const stopSilenceWatch = () => {
    if (silenceTimerRef.current) { clearInterval(silenceTimerRef.current); silenceTimerRef.current = null; }
    analyserCleanupRef.current?.();
    analyserCleanupRef.current = null;
  };

  const watchSilenceOnStream = (stream: MediaStream, onDone: () => void) => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    let srcNode: any, analyser: any;
    try {
      srcNode = ctx.createMediaStreamSource(stream);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      srcNode.connect(analyser);
    } catch { return; }
    const data = new Uint8Array(analyser.fftSize);
    analyserCleanupRef.current = () => { try { srcNode.disconnect(); } catch { /* noop */ } };
    silenceTimerRef.current = setInterval(() => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
      const rms = Math.sqrt(sum / data.length);
      const now = Date.now();
      if (rms > 0.035) { spokeRef.current = true; lastSoundRef.current = now; }
      const quietFor = now - lastSoundRef.current;
      if ((spokeRef.current && quietFor > SILENCE_MS)
        || (!spokeRef.current && now - captureStartRef.current > NEVER_SPOKE_MS)
        || (now - captureStartRef.current > MAX_CAPTURE_MS)) {
        onDone();
      }
    }, 200);
  };

  // Timestamp-based silence for speech mode without a stream (video off).
  const watchSilenceOnResults = (onDone: () => void) => {
    silenceTimerRef.current = setInterval(() => {
      const now = Date.now();
      const quietFor = now - lastSoundRef.current;
      if ((spokeRef.current && quietFor > SILENCE_MS)
        || (!spokeRef.current && now - captureStartRef.current > NEVER_SPOKE_MS)
        || (now - captureStartRef.current > MAX_CAPTURE_MS)) {
        onDone();
      }
    }, 250);
  };

  /** Start listening/recording for the current question. In hands-free the
   *  silence watcher auto-finishes; in manual mode the user taps to stop. */
  const beginCapture = async (auto: boolean) => {
    if (capturingRef.current || transcribing) return;
    capturingRef.current = true;
    spokeRef.current = false;
    captureStartRef.current = Date.now();
    lastSoundRef.current = Date.now();

    const wantVideo = videoOn;
    let stream: MediaStream | null = null;
    if (wantVideo || sttMode === 'record') {
      try {
        stream = await navigator.mediaDevices.getUserMedia(
          wantVideo
            ? { video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 540 } }, audio: true }
            : { audio: true });
      } catch {
        if (wantVideo) {
          // Camera refused — retry audio-only so the interview still flows.
          try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { /* mic refused too */ }
        }
      }
      if (!stream && sttMode === 'record') { capturingRef.current = false; return; }
    }

    if (stream) {
      streamRef.current = stream;
      const handle = createMediaRecorder(stream, !stream.getVideoTracks().length);
      recorderRef.current = handle;
      // createMediaRecorder already started it; only (re)start if somehow idle,
      // and never start an already-'recording' recorder (InvalidStateError).
      if (handle.recorder.state === 'inactive') handle.recorder.start(1000);
      setRecording(true);
      if (auto) watchSilenceOnStream(stream, () => { void finishCapture(true); });
    }
    if (sttMode === 'speech') {
      const rec = recognitionRef.current;
      try { rec?.start(); setListening(true); } catch { /* already started */ }
      if (auto && !stream) watchSilenceOnResults(() => { void finishCapture(true); });
    }
  };

  /** Stop capture; returns { text, videoBlob }. */
  const finishCapture = async (auto: boolean): Promise<void> => {
    if (!capturingRef.current) return;
    capturingRef.current = false;
    stopSilenceWatch();

    let videoBlob: Blob | null = null;
    let recordedBlob: Blob | null = null;
    const handle = recorderRef.current;
    recorderRef.current = null;

    if (sttMode === 'speech') {
      const rec = recognitionRef.current;
      try { rec?.stop(); } catch { /* noop */ }
      setListening(false);
    }
    if (handle) {
      setRecording(false);
      try {
        recordedBlob = await handle.stop();
        if (handle.mimeType.startsWith('video')) videoBlob = recordedBlob;
      } catch { /* recorder died — text may still exist */ }
    }
    stopCamera(streamRef.current);
    streamRef.current = null;

    let text = answerRef.current.trim();
    if (sttMode === 'record' && recordedBlob) {
      setTranscribing(true);
      try {
        const ext = handle && handle.mimeType.includes('mp4') ? 'm4a' : 'webm';
        const t = await transcribeAudio(recordedBlob, `answer.${ext}`);
        if (t) text = (text ? text + ' ' : '') + t;
        if (t) setAnswer(prev => (prev ? prev.trimEnd() + ' ' : '') + t);
      } catch { /* they can type */ }
      setTranscribing(false);
    }

    if (auto && handsFreeRef.current && modeRef.current && text) {
      await submitWith(text, videoBlob);
    } else if (videoBlob) {
      pendingVideoRef.current = videoBlob; // manual flow — attach on Preserve
    }
  };

  const pendingVideoRef = useRef<Blob | null>(null);

  const toggleMic = () => {
    if (transcribing) return;
    if (capturingRef.current) { void finishCapture(false); }
    else { void beginCapture(false); }
  };

  const micActive = listening || recording;

  // ── The conversation loop ─────────────────────────────────────────────────
  // Speak each new question aloud; in hands-free, open the mic when the voice
  // finishes so answering takes zero taps.
  useEffect(() => {
    if (!question || spokenFor.current === question.question_id) return;
    spokenFor.current = question.question_id;
    (async () => {
      if (voiceOn) await speakQuestion(question);
      if (handsFreeRef.current && modeRef.current && sttSupported) {
        void beginCapture(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, voiceOn, speakQuestion]);

  // Cleanup on unmount.
  useEffect(() => () => {
    stopSilenceWatch();
    try { audioRef.current?.pause(); } catch { /* noop */ }
    if (lastUrlRef.current) { try { URL.revokeObjectURL(lastUrlRef.current); } catch { /* noop */ } }
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    try { stopCamera(streamRef.current); } catch { /* noop */ }
    try { audioCtxRef.current?.close?.(); } catch { /* noop */ }
  }, []);

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
    await primeAudio(); // unlock audio inside the click gesture BEFORE any async work
    setMode(m);
    modeRef.current = m;
    await fetchNext(m);
  };

  const pauseInterview = () => {
    void finishCapture(false);
    stopSilenceWatch();
    setMode(null); setQuestion(null); setFocus(null);
    loadCoverage();
  };

  /** Preserve one answer (text + optional video), then advance the interview. */
  const submitWith = async (text: string, videoBlob?: Blob | null) => {
    if (!text.trim() || !question) return;
    const q = question;
    setLoading(true);
    try {
      let videoId: string | undefined;
      const vb = videoBlob ?? pendingVideoRef.current;
      pendingVideoRef.current = null;
      if (vb && vb.size > 20_000) {
        try {
          const meta = await uploadVideo(userId, vb, q.question_id);
          videoId = (meta as any)?.id;
        } catch { /* video is a bonus — never lose the words over it */ }
      }
      await answerQuestion(userId, q.question_id, text.trim(), q.category || focus?.category, videoId);
      extractTraits(userId, text.trim(), 'interview').catch(() => {});
      try { localStorage.removeItem(`vault_draft_${q.question_id}`); } catch { /* noop */ }
      setSubmitted(true);
      setAnswer('');
      setFocus(f => (f ? { ...f, answered: f.answered + 1 } : f));
      loadCoverage();
      setTimeout(() => {
        setSubmitted(false);
        if (modeRef.current) fetchNext(modeRef.current);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit:', err);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    await finishCapture(false);
    await submitWith(answerRef.current);
  };

  if (mode && question) {
    const generated = question.question_id.startsWith('gen_');
    const focusCat = CATEGORIES.find(c => c.id === (focus?.category || question.category));
    const focusPct = focus ? Math.min(100, Math.round((100 * focus.answered) / Math.max(1, focus.target))) : 0;
    return (
      <div className="space-y-6">
        <CameraPiP />
        <div className="flex items-center justify-between flex-wrap gap-2">
          <button onClick={pauseInterview} className="text-sm" style={{ color: ACCENT }}>
            &larr; Pause Interview
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHandsFree(h => !h)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ border: `1px solid ${BORDER}`, color: handsFree ? GOLD : '#71717a' }}
              title="Echo listens automatically after each question — no taps needed"
            >
              <span style={iconLabel}><VaultIcon name="mic" size={13} />{handsFree ? 'Hands-free On' : 'Hands-free Off'}</span>
            </button>
            <button
              onClick={() => setVideoOn(v => !v)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ border: `1px solid ${BORDER}`, color: videoOn ? GOLD : '#71717a' }}
              title="Also record video of your answers"
            >
              <span style={iconLabel}><VaultIcon name="camera" size={13} />{videoOn ? 'Video On' : 'Video Off'}</span>
            </button>
            <button
              onClick={() => setVoiceOn(v => !v)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ border: `1px solid ${BORDER}`, color: voiceOn ? GOLD : '#71717a' }}
              title="Read questions aloud"
            >
              <span style={iconLabel}><VaultIcon name="speaker" size={13} />{voiceOn ? 'Voice On' : 'Voice Off'}</span>
            </button>
          </div>
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
            onClick={async () => { await primeAudio(); if (question) void speakQuestion(question); }}
            disabled={speaking}
            className="text-sm mb-4 px-4 py-2 rounded-full font-semibold disabled:opacity-40 transition hover:scale-[1.02]"
            style={needsTap
              ? { background: GOLD, color: '#0a0a0f', border: 'none', boxShadow: `0 0 20px ${GOLD}66` }
              : { border: `1px solid ${BORDER}`, color: '#d4d4d8' }}
          >
            <span style={iconLabel}><VaultIcon name="speaker" size={16} />{speaking ? 'Echo is speaking…' : needsTap ? 'Tap to hear Echo' : 'Hear it again'}</span>
          </button>
          {question.video_instructions && (
            <div className="text-xs text-gray-500 mb-4 p-3 rounded-lg" style={{ background: '#0f0c09' }}>
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
                placeholder={handsFree
                  ? 'Just talk — Echo is listening and writes your story here. Pause when you’re done and he’ll preserve it.'
                  : 'Speak or type your story... Take your time, every detail matters.'}
                className="w-full p-4 rounded-lg text-sm text-white placeholder-gray-600 resize-none outline-none focus:ring-1 focus:ring-amber-400/40"
                style={{ background: '#0f0c09', border: `1px solid ${micActive ? '#ef4444' : BORDER}`, minHeight: 180 }}
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
                      {transcribing ? 'Transcribing…' : micActive ? 'Listening… tap to stop' : 'Speak your answer'}
                    </span>
                  </button>
                )}
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold transition hover:brightness-110 disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, #ffe08a)`, color: '#20160a' }}
                >
                  {loading ? 'Saving...' : 'Preserve Memory \u{2192}'}
                </button>
              </div>
              {micActive && handsFree && <p className="text-xs mt-2" style={{ color: GOLD }}>Echo is listening &mdash; when you finish speaking and pause, he preserves it and asks the next question.</p>}
              {micActive && !handsFree && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Echo is listening &mdash; tap the mic when you&rsquo;re done.</p>}
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
        subject himself, and explores it deeply before moving on. Just press start and talk: he listens,
        writes it down, preserves it, and asks the next question. No buttons needed.
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
                className="p-4 rounded-xl text-left transition hover:scale-[1.03] hover:border-amber-400"
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
          <div className="w-6 h-6 rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Echo converses — ask him anything about the Vault, the process, or who made it. */}
      <AskEcho />
    </div>
  );
}
