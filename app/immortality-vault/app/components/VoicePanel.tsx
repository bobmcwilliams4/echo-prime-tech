'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED, BG_DARK } from '../lib/constants';
import { synthesizeSpeech, getVoiceProfiles, createVoiceProfile, getCloneStatus, type VoiceProfile } from '../lib/vault-api';
import VaultIcon from './VaultIcon';
import { startAudioStream, stopCamera, createMediaRecorder, createAnalyser, drawWaveform, formatDuration, playAudioBlob, type RecorderHandle } from '../lib/media';

interface Props {
  userId: string;
}

const VOICE_PROMPTS = [
  { id: 'intro', label: 'Introduction', text: 'Introduce yourself naturally. Say your name, where you are from, and what matters most to you in life.', minSec: 10, category: 'Identity' },
  { id: 'story', label: 'Storytelling', text: 'Tell a favorite memory in your own words. Describe where you were, who was there, and how it made you feel.', minSec: 15, category: 'Narrative' },
  { id: 'emotion', label: 'Emotional Range', text: 'Talk about something that makes you proud, then something that worries you. Let your voice show the contrast.', minSec: 10, category: 'Emotion' },
  { id: 'numbers', label: 'Numbers & Dates', text: 'Say your birth date, your address, and a phone number you know by heart. Speak clearly and at a natural pace.', minSec: 8, category: 'Precision' },
  { id: 'questions', label: 'Questions', text: 'Ask a few questions the way you normally would in everyday conversation. Use your natural tone and rhythm.', minSec: 8, category: 'Intonation' },
  { id: 'daily', label: 'Daily Speech', text: 'Talk through a typical morning routine. Describe what you do, what you say to the people around you.', minSec: 10, category: 'Natural' },
  { id: 'wisdom', label: 'Wisdom', text: 'Share a piece of advice or life lesson you would pass on to someone you love. Speak from the heart.', minSec: 12, category: 'Tone' },
  { id: 'excited', label: 'Excitement', text: 'Talk about something that truly excites you. Let your energy and enthusiasm come through naturally.', minSec: 8, category: 'Energy' },
  { id: 'calm', label: 'Calm & Soothing', text: 'Speak softly and gently, as if comforting someone. Say something reassuring in your most soothing voice.', minSec: 10, category: 'Warmth' },
  { id: 'long', label: 'Long Passage', text: 'Read a paragraph from your favorite book, poem, or speech. Choose something meaningful that shows your natural reading voice.', minSec: 20, category: 'Extended' },
];

export default function VoicePanel({ userId }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [samples, setSamples] = useState<Map<string, Blob>>(new Map());
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [testText, setTestText] = useState('');
  const [testPlaying, setTestPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cloneStatus, setCloneStatus] = useState<{ status: string; quality_score?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<RecorderHandle | null>(null);
  const analyserRef = useRef<{ analyser: AnalyserNode; ctx: AudioContext } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    getVoiceProfiles(userId).then(d => setProfiles(d.profiles)).catch(() => {});
  }, [userId]);

  useEffect(() => () => {
    stopCamera(streamRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    analyserRef.current?.ctx.close();
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await startAudioStream();
      streamRef.current = stream;
      analyserRef.current = createAnalyser(stream);
      const handle = createMediaRecorder(stream, true);
      recorderRef.current = handle;
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);

      // Waveform animation
      const drawLoop = () => {
        if (analyserRef.current && canvasRef.current) {
          drawWaveform(analyserRef.current.analyser, canvasRef.current);
        }
        animRef.current = requestAnimationFrame(drawLoop);
      };
      drawLoop();
    } catch {
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (!recorderRef.current) return;

    const blob = await recorderRef.current.stop();
    stopCamera(streamRef.current);
    streamRef.current = null;
    analyserRef.current?.ctx.close();
    analyserRef.current = null;
    setIsRecording(false);

    const prompt = VOICE_PROMPTS[currentIdx];
    if (duration < prompt.minSec) {
      setError(`Recording too short. Minimum ${prompt.minSec} seconds required.`);
      return;
    }

    setSamples(prev => new Map(prev).set(prompt.id, blob));
    if (currentIdx < VOICE_PROMPTS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  /* ── GAP 1: Upload all recorded samples to backend ─────────────── */
  const submitSamples = async () => {
    if (uploading || samples.size < 3) return;
    setUploading(true);
    setError(null);
    try {
      const blobs: Blob[] = [];
      const promptIds: string[] = [];
      samples.forEach((blob, id) => { blobs.push(blob); promptIds.push(id); });
      const profile = await createVoiceProfile(userId, blobs, promptIds);
      setProfiles(prev => [profile, ...prev]);
      setCloneStatus({ status: profile.clone_status });
      // Start polling clone status
      pollCloneStatus(profile.voice_id || profile.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload voice samples.');
    }
    setUploading(false);
  };

  /* ── GAP 2: Poll clone status until active or failed ─────────── */
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollCloneStatus = useCallback((voiceId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const s = await getCloneStatus(voiceId);
        setCloneStatus(s);
        if (s.status === 'active' || s.status === 'failed' || s.status === 'error') {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          // Refresh profiles list
          getVoiceProfiles(userId).then(d => setProfiles(d.profiles)).catch(() => {});
        }
      } catch {
        // Silently retry — polling is best-effort
      }
    }, 5000);
  }, [userId]);

  // Cleanup polling on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const testVoice = async () => {
    if (testPlaying) return;
    setTestPlaying(true);
    try {
      const blob = await synthesizeSpeech(testText);
      await playAudioBlob(blob);
    } catch {
      setError('Voice synthesis not available yet.');
    }
    setTestPlaying(false);
  };

  const prompt = VOICE_PROMPTS[currentIdx];
  const completedCount = samples.size;
  const totalDuration = Array.from(samples.values()).reduce((sum, b) => sum + (b.size / 16000), 0); // rough estimate

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Voice Clone Studio</h2>

      {/* Progress */}
      <div className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white font-semibold">Progress</span>
          <span className="text-sm font-mono" style={{ color: ACCENT }}>{completedCount}/{VOICE_PROMPTS.length}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: BG_INSET }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(completedCount / VOICE_PROMPTS.length) * 100}%`, background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})` }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-500">
          <span>{completedCount} samples recorded</span>
          <span>{completedCount === VOICE_PROMPTS.length ? 'All samples complete!' : `${VOICE_PROMPTS.length - completedCount} remaining`}</span>
        </div>
      </div>

      {/* Prompt Indicators */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {VOICE_PROMPTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => !isRecording && setCurrentIdx(i)}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition"
            style={{
              background: samples.has(p.id) ? 'rgba(52,211,153,0.19)' : i === currentIdx ? 'rgba(245,196,81,0.18)' : BG_INSET,
              border: `2px solid ${samples.has(p.id) ? '#34d399' : i === currentIdx ? ACCENT : BORDER}`,
              color: samples.has(p.id) ? '#34d399' : i === currentIdx ? ACCENT : MUTED,
            }}
          >
            {samples.has(p.id) ? '\u{2713}' : i + 1}
          </button>
        ))}
      </div>

      {/* Current Prompt Card */}
      <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono" style={{ color: ACCENT, letterSpacing: 2 }}>
            PROMPT {currentIdx + 1} &middot; {prompt.category.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">Min {prompt.minSec}s</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2">{prompt.label}</h3>
        <p className="text-sm text-gray-300 italic leading-relaxed">&ldquo;{prompt.text}&rdquo;</p>
        {samples.has(prompt.id) && (
          <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: '#34d399' }}>
            <VaultIcon name="check" size={14} /> Recorded
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: '#7f1d1d20', border: '1px solid #7f1d1d40' }}>
          {error}
        </div>
      )}

      {/* Waveform + Recording Controls */}
      <div className="text-center space-y-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={80}
          className="w-full rounded-lg"
          style={{ background: BG_INSET, display: isRecording ? 'block' : 'none' }}
        />

        {isRecording && (
          <div className="text-2xl font-mono text-white">{formatDuration(duration)}</div>
        )}

        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-16 h-16 rounded-full flex items-center justify-center transition hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a', boxShadow: `0 0 30px -4px ${ACCENT}` }}
              aria-label="Start recording"
            >
              <VaultIcon name="mic" size={26} />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full flex items-center justify-center transition hover:scale-105 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, boxShadow: `0 0 34px -2px ${ACCENT}` }}
              aria-label="Stop recording"
            >
              <div className="w-5 h-5 rounded-sm" style={{ background: '#20160a' }} />
            </button>
          )}
        </div>
      </div>

      {/* Submit Voice Samples */}
      {completedCount >= 3 && (
        <div className="p-5 rounded-xl text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-bold text-white mb-2">
            {completedCount === VOICE_PROMPTS.length ? 'All Samples Recorded!' : `${completedCount} Samples Ready`}
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            {completedCount < VOICE_PROMPTS.length
              ? `You can submit now or record the remaining ${VOICE_PROMPTS.length - completedCount} for better quality.`
              : 'Submit your voice samples to begin cloning.'}
          </p>

          {cloneStatus && (
            <div className="mb-4 flex items-center justify-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full" style={{
                background: cloneStatus.status === 'active' ? '#34d399'
                  : cloneStatus.status === 'failed' || cloneStatus.status === 'error' ? '#ef4444'
                  : '#fbbf24',
                animation: cloneStatus.status === 'pending' || cloneStatus.status === 'processing' ? 'pulse 1.5s infinite' : 'none',
              }} />
              <span style={{
                color: cloneStatus.status === 'active' ? '#34d399'
                  : cloneStatus.status === 'failed' || cloneStatus.status === 'error' ? '#ef4444'
                  : GOLD,
              }}>
                {cloneStatus.status === 'active' ? 'Voice Clone Active'
                  : cloneStatus.status === 'processing' ? 'Processing voice clone...'
                  : cloneStatus.status === 'pending' ? 'Queued for processing...'
                  : cloneStatus.status === 'failed' || cloneStatus.status === 'error' ? 'Clone failed — try re-recording'
                  : cloneStatus.status}
              </span>
              {cloneStatus.quality_score != null && (
                <span className="text-xs text-gray-500 ml-1">
                  Quality: {Math.round(cloneStatus.quality_score * 100)}%
                </span>
              )}
            </div>
          )}

          <button
            onClick={submitSamples}
            disabled={uploading || cloneStatus?.status === 'processing' || cloneStatus?.status === 'active'}
            className="px-8 py-3 rounded-full text-sm font-bold text-white transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a', boxShadow: `0 8px 26px -10px ${ACCENT}` }}
          >
            {uploading ? 'Uploading Samples...'
              : cloneStatus?.status === 'processing' ? 'Processing...'
              : cloneStatus?.status === 'active' ? 'Clone Active'
              : `Submit ${completedCount} Voice Samples`}
          </button>
        </div>
      )}

      {/* Test Voice */}
      {completedCount >= 3 && (
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-2" style={{ color: IVORY }}><span style={{ color: ACCENT, display: 'flex' }}><VaultIcon name="speaker" size={16} /></span> Test Your Voice Clone</h3>
          <input
            value={testText}
            onChange={e => setTestText(e.target.value)}
            className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none mb-3"
            style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}
          />
          <button
            onClick={testVoice}
            disabled={testPlaying}
            className="px-5 py-2 rounded-full text-sm font-bold text-white disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
          >
            {testPlaying ? 'Playing...' : 'Test Voice'}
          </button>
        </div>
      )}

      {/* Recording Tips */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: IVORY }}>Recording Tips</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: 'speaker', tip: 'Use a quiet room with minimal echo' },
            { icon: 'device', tip: 'Hold device 6-8 inches from mouth' },
            { icon: 'values', tip: 'Speak naturally at your normal pace' },
            { icon: 'spark', tip: 'Re-record any prompt you\'re unsure about' },
          ].map(t => (
            <div key={t.tip} className="flex items-start gap-2 text-xs" style={{ color: MUTED }}>
              <span className="flex-shrink-0" style={{ color: ACCENT }}><VaultIcon name={t.icon} size={15} /></span>
              <span>{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Profiles */}
      {profiles.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Voice Profiles</h3>
          <div className="space-y-2">
            {profiles.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-3">
                  <div style={{ color: ACCENT, display: 'flex' }}><VaultIcon name="voice" size={20} /></div>
                  <div>
                    <div className="text-xs" style={{ color: IVORY }}>{p.sample_count} samples</div>
                    <div className="text-[10px]" style={{ color: MUTED }}>Quality: {Math.round(p.quality_score * 100)}%</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                  background: p.clone_status === 'active' ? '#34d39920' : '#fbbf2420',
                  color: p.clone_status === 'active' ? '#34d399' : GOLD,
                }}>
                  {p.clone_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
