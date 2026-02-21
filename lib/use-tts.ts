'use client';

import { useRef, useState, useCallback } from 'react';

const TTS_API = 'https://tts.echo-op.com';

interface UseTTSOptions {
  voiceId?: string;
  speed?: number;
}

interface UseTTSReturn {
  isReading: boolean;
  progress: number; // 0-100
  currentChunk: number;
  totalChunks: number;
  startReading: (text: string) => void;
  stopReading: () => void;
}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const { voiceId = 'default', speed = 1.0 } = options;

  const [isReading, setIsReading] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [progress, setProgress] = useState(0);

  const queueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const drainQueue = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    while (queueRef.current.length > 0) {
      const url = queueRef.current.shift()!;
      try {
        const a = new Audio(url);
        currentAudioRef.current = a;
        await new Promise<void>((resolve, reject) => {
          a.onended = () => { URL.revokeObjectURL(url); currentAudioRef.current = null; resolve(); };
          a.onerror = () => { URL.revokeObjectURL(url); currentAudioRef.current = null; reject(); };
          a.play().catch(reject);
        });
        setCurrentChunk(c => {
          const next = c + 1;
          setProgress(totalChunks > 0 ? Math.round((next / totalChunks) * 100) : 0);
          return next;
        });
      } catch { /* continue to next chunk */ }
    }
    isPlayingRef.current = false;
    setIsReading(false);
    setProgress(100);
  }, [totalChunks]);

  const stopReading = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
    queueRef.current = [];
    isPlayingRef.current = false;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsReading(false);
    setProgress(0);
    setCurrentChunk(0);
    setTotalChunks(0);
  }, []);

  const startReading = useCallback((text: string) => {
    // Stop any current reading
    stopReading();

    if (!text.trim()) return;

    setIsReading(true);
    setProgress(0);
    setCurrentChunk(0);
    setTotalChunks(0);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    (async () => {
      try {
        const res = await fetch(`${TTS_API}/tts/chunked`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice_id: voiceId, speed, output_format: 'wav' }),
          signal: ctrl.signal,
        });

        if (!res.ok) { setIsReading(false); return; }
        const reader = res.body?.getReader();
        if (!reader) { setIsReading(false); return; }

        const dec = new TextDecoder();
        let buf = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const parts = buf.split('\n\n');
          buf = parts.pop() || '';
          for (const part of parts) {
            const m = part.match(/^data:\s*(.+)$/m);
            if (!m) continue;
            try {
              const evt = JSON.parse(m[1]);
              if (evt.done) break;
              if (evt.error) continue;
              if (evt.total) setTotalChunks(evt.total);
              if (evt.audio_b64) {
                const bytes = Uint8Array.from(atob(evt.audio_b64), c => c.charCodeAt(0));
                const blob = new Blob([bytes], { type: 'audio/wav' });
                queueRef.current.push(URL.createObjectURL(blob));
                if (!isPlayingRef.current) drainQueue();
              }
            } catch { /* skip malformed */ }
          }
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setIsReading(false);
      }
    })();
  }, [voiceId, speed, stopReading, drainQueue]);

  return { isReading, progress, currentChunk, totalChunks, startReading, stopReading };
}
