'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ACCENT, BG_CARD, BORDER, CATEGORIES, GOLD } from '../lib/constants';
import { selectQuestion, answerQuestion, extractTraits, synthesizeSpeech, transcribeAudio, type InterviewQuestion } from '../lib/vault-api';
import { playAudioBlob, createMediaRecorder, stopCamera, type RecorderHandle } from '../lib/media';
import CameraPiP from './CameraPiP';
import AskEcho from './AskEcho';
import VaultIcon, { CATEGORY_ICON } from './VaultIcon';

const iconLabel = { display: 'inline-flex', alignItems: 'center', gap: 7 } as const;

interface Props {
  userId: string;
}

export default function InterviewPanel({ userId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
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

  // Call inside a user gesture to unlock audio playback on mobile.
  const primeAudio = () => {
    // Resume a WebAudio context too — iOS ties autoplay permission to it, which
    // keeps the <audio> element's later play() calls allowed after the async
    // synthesize fetch (the gap that otherwise re-locks playback on iOS Safari).
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC && !audioCtxRef.current) audioCtxRef.current = new AC();
      audioCtxRef.current?.resume?.();
    } catch { /* noop */ }
    if (audioPrimed.current) return;
    const a = getAudioEl();
    if (!a) return;
    a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    a.volume = 0;
    a.play().then(() => { audioPrimed.current = true; a.volume = 1; }).catch(() => { /* still locked → 'Tap to hear Echo' fallback shows */ });
  };

  const speakQuestion = useCallback(async (q: InterviewQuestion) => {
    setSpeaking(true);
    try {
      const blob = await synthesizeSpeech(q.question, 'warmth');
      const a = getAudioEl();
      if (!a) { await playAudioBlob(blob); setNeedsTap(false); return; }
      a.volume = 1;
      if (lastUrlRef.current) { try { URL.revokeObjectURL(lastUrlRef.current); } catch { /* noop */ } }
      const url = URL.createObjectURL(blob);
      lastUrlRef.current = url;
      a.src = url;
      await a.play();
      setNeedsTap(false); // audio works — hide any tap prompt
    } catch (e: any) {
      // Autoplay blocked → surface a one-tap "Hear Echo" instead of failing silently.
      if (e && e.name === 'NotAllowedError') setNeedsTap(true);
    }
    setSpeaking(false);
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

  const startInterview = async (category: string) => {
    primeAudio(); // unlock TTS playback on this gesture
    setLoading(true);
    setSelectedCategory(category);
    try {
      const q = await selectQuestion(userId, category);
      setQuestion(q);
    } catch (err) {
      console.error('Failed to load question:', err);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !question || !selectedCategory) return;
    stopMic();
    setLoading(true);
    try {
      await answerQuestion(userId, question.question_id, answer.trim(), selectedCategory);
      // Fire-and-forget: extract personality traits from the answer via AI
      extractTraits(userId, answer.trim(), 'interview').catch(() => {});
      setSubmitted(true);
      setAnswer('');
      setTimeout(() => {
        setSubmitted(false);
        startInterview(selectedCategory);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit:', err);
    }
    setLoading(false);
  };

  if (selectedCategory && question) {
    const generated = question.question_id.startsWith('gen_');
    return (
      <div className="space-y-6">
        <CameraPiP />
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedCategory(null); setQuestion(null); }} className="text-sm" style={{ color: ACCENT }}>
            &larr; Back to Categories
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
        <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono" style={{ color: ACCENT, letterSpacing: 2 }}>
              {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {selectedCategory.toUpperCase().replace('_', ' ')}
            </div>
            {generated && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: '#1e1033', color: GOLD, border: `1px solid ${BORDER}` }}>
                {'\u{2728}'} written just for you
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
              {'\u{1F4F9}'} {question.video_instructions}
            </div>
          )}
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">{'\u{2705}'}</div>
              <div className="text-sm text-green-400">Memory preserved! Loading next question...</div>
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Biography Interview</h2>
      <p className="text-sm text-gray-400">Choose a life category to begin recording your story. The interviewer reads each question aloud — just talk.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => startInterview(cat.id)}
            disabled={loading}
            className="p-5 rounded-xl text-center transition hover:scale-[1.03] hover:border-purple-500"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="mb-3 flex justify-center" style={{ color: GOLD }}><VaultIcon name={CATEGORY_ICON[cat.id] || 'spark'} size={30} /></div>
            <div className="text-sm font-semibold text-white">{cat.name}</div>
          </button>
        ))}
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
