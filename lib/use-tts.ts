'use client';

import { useRef, useState, useCallback } from 'react';
import { getApiBase } from './api-base';

// 2026-07-03: sdk1.echo-op.com is the key-gated GPT-connector gateway — the
// auth-less /sentinel/tts proxy is the SDK gate at forge.echo-op.com (verified
// live, returns RIFF WAV). getApiBase fallback kept for pages that override
// NEXT_PUBLIC_ECHO_SPEAK_BASE.
const TTS_API = process.env.NEXT_PUBLIC_ECHO_SPEAK_BASE
  || 'https://forge.echo-op.com/sentinel';

interface UseTTSOptions {
  voice?: string;
}

interface UseTTSReturn {
  isReading: boolean;
  progress: number;
  currentChunk: number;
  totalChunks: number;
  startReading: (text: string) => void;
  stopReading: () => void;
}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const { voice = 'echo' } = options;

  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopReading = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsReading(false);
    setProgress(0);
  }, []);

  const startReading = useCallback((text: string) => {
    stopReading();
    if (!text.trim()) return;

    setIsReading(true);
    setProgress(0);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    (async () => {
      try {
        const res = await fetch(`${TTS_API}/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice }),
          signal: ctrl.signal,
        });

        if (!res.ok) { setIsReading(false); return; }

        const audioData = await res.arrayBuffer();
        if (audioData.byteLength < 100) { setIsReading(false); return; }

        const blob = new Blob([audioData], { type: res.headers.get('content-type') || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          currentAudioRef.current = null;
          setIsReading(false);
          setProgress(100);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          currentAudioRef.current = null;
          setIsReading(false);
        };
        audio.ontimeupdate = () => {
          if (audio.duration > 0) {
            setProgress(Math.round((audio.currentTime / audio.duration) * 100));
          }
        };

        await audio.play();
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setIsReading(false);
      }
    })();
  }, [voice, stopReading]);

  return { isReading, progress, currentChunk: 0, totalChunks: 1, startReading, stopReading };
}
