'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED, BG_DARK } from '../lib/constants';
import { uploadVideo, getVideoList, submitBiometric, type VideoMeta } from '../lib/vault-api';
import VaultIcon from './VaultIcon';
import { startCamera, stopCamera, createMediaRecorder, createAnalyser, getAudioLevel, formatDuration, formatBytes, type RecorderHandle } from '../lib/media';

interface Props {
  userId: string;
}

type RecordState = 'idle' | 'previewing' | 'recording' | 'reviewing' | 'uploading';

export default function RecordPanel({ userId }: Props) {
  const [state, setState] = useState<RecordState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videos, setVideos] = useState<VideoMeta[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const reviewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<RecorderHandle | null>(null);
  const analyserRef = useRef<{ analyser: AnalyserNode; ctx: AudioContext } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const levelRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  // Load video history
  useEffect(() => {
    getVideoList(userId).then(d => setVideos(d.videos)).catch(() => {}).finally(() => setLoadingVideos(false));
  }, [userId]);

  // Cleanup on unmount
  useEffect(() => () => {
    stopCamera(streamRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (levelRef.current) cancelAnimationFrame(levelRef.current);
    analyserRef.current?.ctx.close();
  }, []);

  const startPreview = async () => {
    setError(null);
    try {
      if (!videoRef.current) return;
      const stream = await startCamera(videoRef.current, 'user', true);
      streamRef.current = stream;
      analyserRef.current = createAnalyser(stream);
      setState('previewing');

      // Audio level loop
      const updateLevel = () => {
        if (analyserRef.current) setAudioLevel(getAudioLevel(analyserRef.current.analyser));
        levelRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      setError('Camera access denied. Please allow camera and microphone permissions.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    setDuration(0);
    const handle = createMediaRecorder(streamRef.current);
    recorderRef.current = handle;
    setState('recording');
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  };

  const stopRecording = async () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (!recorderRef.current) return;
    const blob = await recorderRef.current.stop();
    setRecordedBlob(blob);
    setState('reviewing');
    // Stop camera
    stopCamera(streamRef.current);
    streamRef.current = null;
    if (levelRef.current) { cancelAnimationFrame(levelRef.current); levelRef.current = null; }
    analyserRef.current?.ctx.close();
    analyserRef.current = null;

    // Set review video
    if (reviewVideoRef.current) {
      reviewVideoRef.current.src = URL.createObjectURL(blob);
    }
  };

  const retake = async () => {
    setRecordedBlob(null);
    setState('idle');
  };

  const upload = async () => {
    if (!recordedBlob) return;
    setState('uploading');
    try {
      const meta = await uploadVideo(userId, recordedBlob);
      setVideos(prev => [meta, ...prev]);
      // Fire-and-forget: trigger biometric analysis on the uploaded video
      submitBiometric(meta.id, [
        { capture_type: 'facial_video', data_json: JSON.stringify({ duration: meta.duration_seconds, source: 'selfie_camera' }), confidence: 0.8 },
      ]).catch(() => {});
      setRecordedBlob(null);
      setState('idle');
    } catch {
      setError('Upload failed. Please try again.');
      setState('reviewing');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Record Video</h2>
      <p className="text-sm" style={{ color: MUTED }}>Record selfie videos to capture your facial expressions, mannerisms, and voice for FaceTime reconstruction.</p>

      {error && (
        <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: '#7f1d1d20', border: '1px solid #7f1d1d40' }}>
          {error}
        </div>
      )}

      {/* Recording Area */}
      <div className="p-px rounded-2xl" style={{ background: state === 'recording' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : `linear-gradient(135deg, ${GOLD_DEEP}, ${GOLD_BRIGHT})` }}>
        <div className="rounded-[14px] overflow-hidden relative" style={{ background: BG_DARK, aspectRatio: '16/9' }}>
          {/* Camera preview */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ display: (state === 'previewing' || state === 'recording') ? 'block' : 'none', transform: 'scaleX(-1)' }}
          />

          {/* Review playback */}
          <video
            ref={reviewVideoRef}
            controls
            playsInline
            className="w-full h-full object-cover"
            style={{ display: state === 'reviewing' ? 'block' : 'none' }}
          />

          {/* Idle state */}
          {state === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="mb-4" style={{ color: GOLD_DEEP }}><VaultIcon name="record" size={44} /></div>
              <button
                onClick={startPreview}
                className="px-6 py-3 rounded-full text-sm font-semibold transition hover:brightness-110"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
              >
                Start Camera
              </button>
            </div>
          )}

          {/* Uploading overlay */}
          {state === 'uploading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
              <div className="w-8 h-8 rounded-full animate-spin mb-3" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
              <div className="text-sm" style={{ color: IVORY }}>Uploading to vault...</div>
            </div>
          )}

          {/* Face guide overlay */}
          {(state === 'previewing' || state === 'recording') && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <ellipse cx="50" cy="42" rx="18" ry="24" fill="none" stroke="rgba(245,196,81,0.45)" strokeWidth="0.5" strokeDasharray="2,2" />
            </svg>
          )}

          {/* Recording indicator */}
          {state === 'recording' && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-mono text-sm">{formatDuration(duration)}</span>
            </div>
          )}

          {/* Audio level meter */}
          {(state === 'previewing' || state === 'recording') && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                <span style={{ color: GOLD_BRIGHT, display: 'flex' }}><VaultIcon name="mic" size={14} /></span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{ width: `${audioLevel * 100}%`, background: audioLevel > 0.7 ? '#ef4444' : audioLevel > 0.3 ? '#34d399' : GOLD }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {state === 'previewing' && (
          <>
            <button onClick={() => { stopCamera(streamRef.current); streamRef.current = null; setState('idle'); }} className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
              Cancel
            </button>
            <button onClick={startRecording} className="px-8 py-2.5 rounded-full text-sm font-bold text-white inline-flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-white" /> Start Recording
            </button>
          </>
        )}
        {state === 'recording' && (
          <button onClick={stopRecording} className="px-8 py-2.5 rounded-full text-sm font-bold text-white animate-pulse inline-flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <span className="w-2.5 h-2.5 rounded-sm bg-white" /> Stop Recording ({formatDuration(duration)})
          </button>
        )}
        {state === 'reviewing' && (
          <>
            <button onClick={retake} className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
              Retake
            </button>
            <button onClick={upload} className="px-8 py-2.5 rounded-full text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}>
              Upload to Vault
            </button>
          </>
        )}
      </div>

      {/* Recording History */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: IVORY }}>Recording History</h3>
        {loadingVideos ? (
          <div className="w-6 h-6 rounded-full animate-spin mx-auto" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
        ) : videos.length === 0 ? (
          <div className="text-center py-6 rounded-xl text-sm" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: MUTED }}>
            No recordings yet. Start recording to build your FaceTime profile.
          </div>
        ) : (
          <div className="space-y-2">
            {videos.map(v => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-3">
                  <div style={{ color: ACCENT, display: 'flex' }}><VaultIcon name="record" size={20} /></div>
                  <div>
                    <div className="text-xs" style={{ color: IVORY }}>{formatDuration(v.duration_seconds || 0)}</div>
                    <div className="text-[10px]" style={{ color: MUTED }}>{new Date(v.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-[10px]" style={{ color: MUTED }}>{formatBytes(v.file_size || 0)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
