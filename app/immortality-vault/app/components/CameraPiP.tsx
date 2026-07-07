'use client';

/* Immortality Vault — camera self-view (picture-in-picture, bottom-right).
   Shows the person what the camera sees while they're being interviewed, so
   they know they're on camera (their face, expressions, and mannerisms are part
   of what the Vault preserves). Video only — the mic stays free for STT. */

import { useEffect, useRef, useState } from 'react';
import { startCamera, stopCamera } from '../lib/media';
import { GOLD, BORDER } from '../lib/constants';

export default function CameraPiP() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function enable() {
      setError(false);
      try {
        if (!videoRef.current) return;
        const stream = await startCamera(videoRef.current, 'user', false);
        if (cancelled) { stopCamera(stream); return; }
        streamRef.current = stream;
      } catch {
        setError(true);
      }
    }
    if (on) enable();
    else { stopCamera(streamRef.current); streamRef.current = null; }
    return () => { cancelled = true; stopCamera(streamRef.current); streamRef.current = null; };
  }, [on]);

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50, width: 200 }}>
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `1px solid ${GOLD}55`, background: '#000', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', aspectRatio: '4 / 3' }}>
        <video ref={videoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: on && !error ? 'block' : 'none' }} />
        {(!on || error) && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#8a8172', fontSize: 12, textAlign: 'center', padding: 10 }}>
            <span style={{ fontSize: 22 }} aria-hidden>{error ? '\u{1F4F5}' : '\u{1F4F9}'}</span>
            {error ? 'Camera unavailable' : 'Camera off'}
          </div>
        )}
        {/* live dot */}
        {on && !error && (
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#fff', background: 'rgba(0,0,0,0.45)', padding: '3px 7px', borderRadius: 999 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'ivRec 1.6s infinite' }} /> On camera
          </div>
        )}
        <button
          onClick={() => setOn(v => !v)}
          title={on ? 'Turn camera off' : 'Turn camera on'}
          style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: '50%', border: `1px solid ${BORDER}`, background: 'rgba(0,0,0,0.55)', color: GOLD, cursor: 'pointer', fontSize: 13, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {on ? '\u{2715}' : '\u{1F4F9}'}
        </button>
      </div>
      <style>{`@keyframes ivRec { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }`}</style>
    </div>
  );
}
