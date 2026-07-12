/* Immortality Vault — Camera / Audio / Waveform Helpers */

/* ─── Camera ─────────────────────────────────────────────────────────── */

export async function startCamera(
  videoEl: HTMLVideoElement,
  facingMode: 'user' | 'environment' = 'user',
  withAudio = true,
): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: withAudio,
  });
  videoEl.srcObject = stream;
  await videoEl.play();
  return stream;
}

export function stopCamera(stream: MediaStream | null): void {
  if (!stream) return;
  stream.getTracks().forEach(t => t.stop());
}

/* ─── MediaRecorder ──────────────────────────────────────────────────── */

function pickMimeType(): string {
  const types = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'video/webm';
}

function pickAudioMime(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'audio/webm';
}

export interface RecorderHandle {
  recorder: MediaRecorder;
  stop: () => Promise<Blob>;
  mimeType: string;
}

export function createMediaRecorder(stream: MediaStream, audioOnly = false): RecorderHandle {
  const mimeType = audioOnly ? pickAudioMime() : pickMimeType();
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const blobPromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start(1000); // collect chunks every second

  return {
    recorder,
    mimeType,
    stop: async () => {
      recorder.stop();
      return blobPromise;
    },
  };
}

/* ─── Audio-Only Recording ───────────────────────────────────────────── */

export async function startAudioStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
    video: false,
  });
}

/* ─── Web Audio Analyser ─────────────────────────────────────────────── */

export function createAnalyser(stream: MediaStream): { analyser: AnalyserNode; ctx: AudioContext } {
  const ctx = new AudioContext();
  const src = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8;
  src.connect(analyser);
  return { analyser, ctx };
}

export function drawWaveform(analyser: AnalyserNode, canvas: HTMLCanvasElement, accentColor = '#f5c451'): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const bufLen = analyser.frequencyBinCount;
  const data = new Uint8Array(bufLen);
  analyser.getByteFrequencyData(data);

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const barW = Math.max(2, (w / bufLen) * 2.5);
  const gap = 1;
  let x = 0;

  for (let i = 0; i < bufLen; i++) {
    const barH = (data[i] / 255) * h;
    const gradient = ctx.createLinearGradient(0, h, 0, h - barH);
    gradient.addColorStop(0, accentColor);
    gradient.addColorStop(1, `${accentColor}40`);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, h - barH, barW, barH);
    x += barW + gap;
    if (x > w) break;
  }
}

export function getAudioLevel(analyser: AnalyserNode): number {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  return sum / (data.length * 255);
}

/* ─── Playback ───────────────────────────────────────────────────────── */

export function playAudioBlob(blob: Blob): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve(audio);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Audio playback failed'));
    };
    audio.play().catch(reject);
  });
}

export async function playAudioFromUrl(url: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => resolve(audio);
    audio.onerror = () => reject(new Error('Audio playback failed'));
    audio.play().catch(reject);
  });
}

/* ─── Utilities ──────────────────────────────────────────────────────── */

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
