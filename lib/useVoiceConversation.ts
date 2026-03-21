'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// VOICE CONVERSATION HOOK — Real-time bidirectional voice via
// VoiceConversation Durable Object on echo-speak-cloud
// Echo Prime Technologies | Echo Speak Voice Provider
// ═══════════════════════════════════════════════════════════════

const SPEAK_CLOUD_URL = 'https://echo-speak-cloud.bmcii1976.workers.dev';
const SPEAK_CLOUD_WS = 'wss://echo-speak-cloud.bmcii1976.workers.dev';

export type ConversationState =
  | 'idle'
  | 'connecting'
  | 'ready'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

export type TurnEagerness = 'eager' | 'normal' | 'patient';

export interface VoiceConversationConfig {
  voice?: string;
  personality?: string;
  siteId?: string;
  userId?: string;
  turnEagerness?: TurnEagerness;
  fillerEnabled?: boolean;
  language?: string;
  systemPrompt?: string;
}

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
  emotion?: string;
  timestamp: number;
  isPartial?: boolean;
}

interface LatencyInfo {
  stt_ms?: number;
  llm_first_token_ms?: number;
  tts_first_audio_ms?: number;
  total_ms?: number;
}

export interface UseVoiceConversationReturn {
  state: ConversationState;
  transcript: TranscriptEntry[];
  currentResponse: string;
  vadScore: number;
  latency: LatencyInfo | null;
  sessionId: string | null;
  error: string | null;
  isMuted: boolean;
  start: (config?: VoiceConversationConfig) => Promise<void>;
  stop: () => void;
  sendText: (text: string) => void;
  interrupt: () => void;
  setEagerness: (eagerness: TurnEagerness) => void;
  toggleMute: () => void;
}

export function useVoiceConversation(
  defaultConfig?: VoiceConversationConfig
): UseVoiceConversationReturn {
  const [state, setState] = useState<ConversationState>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [vadScore, setVadScore] = useState(0);
  const [latency, setLatency] = useState<LatencyInfo | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const configRef = useRef<VoiceConversationConfig>(defaultConfig || {});
  const stateRef = useRef<ConversationState>('idle');

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ─── Audio Context ────────────────────────────────────────────

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext({ sampleRate: 44100 });
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // ─── Audio Playback Queue ─────────────────────────────────────

  const playNextChunk = useCallback(async () => {
    if (isPlayingRef.current) return;
    const chunk = playbackQueueRef.current.shift();
    if (!chunk) {
      if (stateRef.current === 'speaking') setState('ready');
      return;
    }

    isPlayingRef.current = true;
    try {
      const ctx = getAudioContext();
      const audioBuffer = await ctx.decodeAudioData(chunk.slice(0));
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNodeRef.current!);
      currentSourceRef.current = source;
      source.onended = () => {
        isPlayingRef.current = false;
        currentSourceRef.current = null;
        playNextChunk();
      };
      source.start();
    } catch {
      isPlayingRef.current = false;
      currentSourceRef.current = null;
      playNextChunk();
    }
  }, [getAudioContext]);

  const enqueueAudio = useCallback((base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    playbackQueueRef.current.push(bytes.buffer);
    if (!isPlayingRef.current) {
      setState('speaking');
      playNextChunk();
    }
  }, [playNextChunk]);

  const stopPlayback = useCallback(() => {
    playbackQueueRef.current = [];
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch { /* already stopped */ }
      currentSourceRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  // ─── Microphone Capture ───────────────────────────────────────

  const startMicrophone = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 16000 },
    });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/webm',
    });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = async (event) => {
      if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
        const buffer = await event.data.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        wsRef.current.send(JSON.stringify({ type: 'audio.chunk', audio: base64, format: 'webm' }));
      }
    };
    recorder.start(250);
  }, []);

  const stopMicrophone = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      try { mediaRecorderRef.current?.stop(); } catch { /* ignore */ }
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  // ─── WebSocket Message Handler ────────────────────────────────

  const handleServerMessage = useCallback((event: MessageEvent) => {
    let msg: Record<string, unknown>;
    try { msg = JSON.parse(event.data); } catch { return; }

    switch (msg.type) {
      case 'session.ready':
        setSessionId(msg.session_id as string);
        setState('ready');
        break;

      case 'transcript': {
        const text = msg.text as string;
        const isFinal = msg.is_final as boolean;
        if (isFinal && text.trim()) {
          setTranscript((prev) => [
            ...prev.filter((e) => !(e.role === 'user' && e.isPartial)),
            { role: 'user', text, timestamp: Date.now() },
          ]);
          setState('processing');
        } else if (text.trim()) {
          setTranscript((prev) => {
            const withoutPartials = prev.filter((e) => !(e.role === 'user' && e.isPartial));
            return [...withoutPartials, { role: 'user', text, timestamp: Date.now(), isPartial: true }];
          });
          setState('listening');
        }
        break;
      }

      case 'response.start':
        setCurrentResponse('');
        setState('processing');
        break;

      case 'response.token':
        setCurrentResponse((prev) => prev + (msg.token as string));
        break;

      case 'response.text': {
        const fullText = msg.text as string;
        const emotion = msg.emotion as string | undefined;
        setCurrentResponse('');
        setTranscript((prev) => [...prev, { role: 'assistant', text: fullText, emotion, timestamp: Date.now() }]);
        break;
      }

      case 'audio.chunk':
        enqueueAudio(msg.audio as string);
        break;

      case 'audio.end':
      case 'filler.text':
        if (msg.type === 'filler.text') setCurrentResponse(msg.text as string);
        break;

      case 'response.correction':
        break;

      case 'vad.score':
        setVadScore(msg.score as number);
        break;

      case 'latency':
        setLatency({
          stt_ms: msg.stt_ms as number | undefined,
          llm_first_token_ms: msg.llm_first_token_ms as number | undefined,
          tts_first_audio_ms: msg.tts_first_audio_ms as number | undefined,
          total_ms: msg.total_ms as number | undefined,
        });
        break;

      case 'session.ended':
        setState('idle');
        break;

      case 'error':
        setError(msg.message as string);
        setState('error');
        break;
    }
  }, [enqueueAudio]);

  // ─── Connection Management ────────────────────────────────────

  const start = useCallback(async (overrides?: VoiceConversationConfig) => {
    const cfg = { ...configRef.current, ...overrides };
    configRef.current = cfg;

    setState('connecting');
    setError(null);
    setTranscript([]);
    setCurrentResponse('');
    setSessionId(null);
    setVadScore(0);
    setLatency(null);

    try {
      getAudioContext();
      await startMicrophone();

      const wsSessionId = crypto.randomUUID();
      const wsUrl = `${SPEAK_CLOUD_WS}/ws/conversation?session_id=${wsSessionId}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'session.start',
          voice: cfg.voice || 'bree',
          personality: cfg.personality || 'bree',
          site_id: cfg.siteId || 'echo-ept.com',
          user_id: cfg.userId || 'anonymous',
          turn_eagerness: cfg.turnEagerness || 'normal',
          filler_enabled: cfg.fillerEnabled !== false,
          language: cfg.language || 'en',
          system_prompt: cfg.systemPrompt || undefined,
        }));
      };

      ws.onmessage = handleServerMessage;
      ws.onerror = () => { setError('Voice connection failed'); setState('error'); };
      ws.onclose = () => {
        if (stateRef.current !== 'idle' && stateRef.current !== 'error') setState('idle');
      };
    } catch (e) {
      setError((e as Error).message);
      setState('error');
      stopMicrophone();
    }
  }, [getAudioContext, startMicrophone, handleServerMessage, stopMicrophone]);

  const stop = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'session.end' }));
    }
    stopMicrophone();
    stopPlayback();
    wsRef.current?.close();
    wsRef.current = null;
    setState('idle');
    setSessionId(null);
  }, [stopMicrophone, stopPlayback]);

  const sendText = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text.input', text }));
      setTranscript((prev) => [...prev, { role: 'user', text, timestamp: Date.now() }]);
      setState('processing');
    }
  }, []);

  const interrupt = useCallback(() => {
    stopPlayback();
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'interrupt' }));
    }
    setState('ready');
  }, [stopPlayback]);

  const setEagerness = useCallback((eagerness: TurnEagerness) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'turn.config', eagerness }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !newMuted; });
      return newMuted;
    });
  }, []);

  useEffect(() => {
    return () => {
      stopMicrophone();
      stopPlayback();
      wsRef.current?.close();
      if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close();
    };
  }, [stopMicrophone, stopPlayback]);

  return {
    state, transcript, currentResponse, vadScore, latency,
    sessionId, error, isMuted,
    start, stop, sendText, interrupt, setEagerness, toggleMute,
  };
}

export default useVoiceConversation;
