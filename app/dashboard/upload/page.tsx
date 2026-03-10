'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../lib/auth-context';
import { useTheme } from '../../../lib/theme-context';

const BGAT_API = 'https://bgat-api-gateway.bmcii1976.workers.dev';
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/tiff'];
const ADMIN_EMAILS = ['bmcii1976@gmail.com', 'jonathon@blackgoldasset.com'];

interface UploadResult {
  well_name?: string;
  sample_date?: string;
  lab_id?: string;
  tds?: number;
  sample_ph?: number;
  chloride?: number;
  ion_balance_pct?: number;
  well_id?: string;
  sample_id?: string;
}

type UploadMode = 'file' | 'scan';

export default function UploadReportPage() {
  const router = useRouter();
  const { user, loading, role } = useAuth();
  const { isDark } = useTheme();

  const [mode, setMode] = useState<UploadMode>('file');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadResult[]>([]);

  // Scan mode state
  const [scanning, setScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = role === 'owner' || ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && !isAdmin) router.push('/dashboard');
  }, [user, loading, isAdmin, router]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraStream]);

  const getBgatToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('bgat_token');
  };

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    setResult(null);
    setProgress(0);
    setUploading(true);

    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      }

      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 8, 90));
      }, 200);

      const token = getBgatToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BGAT_API}/api/v1/samples/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Upload failed (${res.status})`);
      }

      const data: UploadResult = await res.json();
      setResult(data);
      setUploadHistory(prev => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }, [uploadFile]);

  // Scanner / Camera functions
  const startCamera = async () => {
    setError(null);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setCameraStream(stream);
      setScanning(true);
      // Wait for ref to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      setError('Camera access denied. Check browser permissions or use File Upload instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setScanning(false);
  };

  const uploadScannedImage = async () => {
    if (!capturedImage) return;
    // Convert data URL to blob
    const res = await fetch(capturedImage);
    const blob = await res.blob();
    const file = new File([blob], `scan-${Date.now()}.png`, { type: 'image/png' });
    uploadFile(file);
  };

  const scanFromDevice = () => {
    // Use file input with capture attribute for mobile scanner/camera
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.setAttribute('accept', 'image/*,application/pdf');
      fileInputRef.current.click();
    }
  };

  const resetUpload = () => {
    setResult(null);
    setError(null);
    setProgress(0);
    setCapturedImage(null);
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs font-semibold px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>
            Upload Water Analysis Report
          </h1>
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Upload PDF reports or scan documents directly from your device. Reports are parsed automatically and stored in the BGAT Water Intel database.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-xl overflow-hidden border mb-8 w-fit" style={{ borderColor: 'var(--ept-border)' }}>
          <button
            onClick={() => { setMode('file'); resetUpload(); stopCamera(); }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ backgroundColor: mode === 'file' ? 'var(--ept-accent)' : 'transparent', color: mode === 'file' ? '#fff' : 'var(--ept-text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            File Upload
          </button>
          <button
            onClick={() => { setMode('scan'); resetUpload(); }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ backgroundColor: mode === 'scan' ? 'var(--ept-accent)' : 'transparent', color: mode === 'scan' ? '#fff' : 'var(--ept-text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
            Scan / Camera
          </button>
        </div>

        {/* File Upload Mode */}
        {mode === 'file' && !result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all"
            style={{
              borderColor: dragOver ? 'var(--ept-accent)' : 'var(--ept-border)',
              backgroundColor: dragOver ? (isDark ? '#0d7377' + '10' : '#0d7377' + '08') : 'var(--ept-card-bg)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading ? (
              <div>
                <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
                <p className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Uploading & Parsing...</p>
                <div className="w-64 mx-auto h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: 'var(--ept-accent)' }} />
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>{progress}%</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <svg className="w-8 h-8" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                </div>
                <p className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>
                  {dragOver ? 'Drop your file here' : 'Drag & drop your report'}
                </p>
                <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                  or click to browse files
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['PDF', 'PNG', 'JPG', 'TIFF'].map(f => (
                    <span key={f} className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)', border: '1px solid var(--ept-border)' }}>{f}</span>
                  ))}
                  <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ color: 'var(--ept-text-muted)' }}>Max 20MB</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Scan / Camera Mode */}
        {mode === 'scan' && !result && (
          <div className="space-y-6">
            {/* Action buttons */}
            {!scanning && !capturedImage && (
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={startCamera}
                  className="p-8 rounded-2xl border text-center group card-hover"
                  style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <svg className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ept-text)' }}>Live Camera</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Open camera to photograph a report. Best for quick captures with your phone or tablet.</p>
                </button>

                <button
                  onClick={scanFromDevice}
                  className="p-8 rounded-2xl border text-center group card-hover"
                  style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <svg className="w-7 h-7" style={{ color: '#6366f1' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.159 48.159 0 018.5 0m-8.5 0V6.75a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V7.5" /></svg>
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--ept-text)' }}>Scanner / Device</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Capture from your computer&apos;s scanner, flatbed, or connected imaging device.</p>
                </button>
              </div>
            )}

            {/* Live camera view */}
            {scanning && (
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--ept-card-border)' }}>
                <div className="relative bg-black">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-[500px] object-contain" />
                  {/* Scan guide overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-[10%] border-2 border-dashed rounded-xl" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                        Align report within frame
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 p-4" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                  <button onClick={capturePhoto} className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    📸 Capture
                  </button>
                  <button onClick={stopCamera} className="px-5 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Captured image preview */}
            {capturedImage && (
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--ept-card-border)' }}>
                <div className="bg-black p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={capturedImage} alt="Scanned report" className="w-full max-h-[500px] object-contain rounded-lg" />
                </div>
                <div className="flex gap-3 p-4" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                  {uploading ? (
                    <div className="flex-1 flex items-center justify-center gap-3 py-3">
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Processing scan...</span>
                    </div>
                  ) : (
                    <>
                      <button onClick={uploadScannedImage} className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                        Upload & Parse
                      </button>
                      <button onClick={() => { setCapturedImage(null); startCamera(); }} className="px-5 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                        Retake
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Hidden file input for scanner/device capture */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl border flex items-start gap-3" style={{ backgroundColor: isDark ? '#7f1d1d20' : '#fef2f2', borderColor: isDark ? '#991b1b' : '#fecaca' }}>
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>Upload Failed</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{error}</p>
              <button onClick={resetUpload} className="text-xs font-semibold mt-2" style={{ color: 'var(--ept-accent)' }}>Try Again</button>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: isDark ? '#05200e' : '#f0fdf4', borderColor: isDark ? '#166534' : '#bbf7d0' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#10b981' }}>Report Parsed Successfully</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Data extracted and stored in the BGAT Water Intel database</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Well', value: result.well_name || '—' },
                  { label: 'Sample Date', value: result.sample_date || '—' },
                  { label: 'Lab ID', value: result.lab_id || '—' },
                  { label: 'TDS (mg/L)', value: result.tds != null ? result.tds.toLocaleString() : '—' },
                  { label: 'pH', value: result.sample_ph != null ? result.sample_ph.toFixed(2) : '—' },
                  { label: 'Chloride (mg/L)', value: result.chloride != null ? result.chloride.toLocaleString() : '—' },
                ].map(f => (
                  <div key={f.label} className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>{f.label}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: 'var(--ept-text)' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              {result.ion_balance_pct != null && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Ion Balance:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full`} style={{
                    backgroundColor: result.ion_balance_pct < 5 ? '#10b98120' : result.ion_balance_pct < 10 ? '#f59e0b20' : '#ef444420',
                    color: result.ion_balance_pct < 5 ? '#10b981' : result.ion_balance_pct < 10 ? '#f59e0b' : '#ef4444',
                  }}>{result.ion_balance_pct.toFixed(2)}%</span>
                  <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
                    {result.ion_balance_pct < 5 ? 'Good' : result.ion_balance_pct < 10 ? 'Flag' : 'Likely lab error'}
                  </span>
                </div>
              )}
              <div className="flex gap-3 mt-5">
                {result.well_id && (
                  <a href={`https://bgat.echo-op.com/well-detail.html?id=${result.well_id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    View Well →
                  </a>
                )}
                <button onClick={resetUpload} className="text-xs font-semibold px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                  Upload Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supported Formats */}
        <div className="mt-10 p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Supported Report Formats</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'DownHole SAT', status: 'Supported', color: '#10b981', desc: 'Full 19-field extraction + 12-row scale sweep' },
              { name: 'Stim-Lab', status: 'Planned', color: '#f59e0b', desc: 'Coming in next release' },
              { name: 'Core Labs', status: 'Planned', color: '#f59e0b', desc: 'Coming in next release' },
              { name: 'SGS', status: 'Planned', color: '#f59e0b', desc: 'Coming in next release' },
            ].map(f => (
              <div key={f.name} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{f.name}</span>
                  <p className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${f.color}20`, color: f.color }}>{f.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="mt-8 p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Session Upload History</h3>
            <div className="space-y-2">
              {uploadHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">✅</span>
                    <div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{h.well_name || 'Unknown Well'}</span>
                      <span className="text-xs ml-2" style={{ color: 'var(--ept-text-muted)' }}>{h.sample_date || ''}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>TDS: {h.tds?.toLocaleString() || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-5 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Tips for Best Results</h4>
          <ul className="space-y-2">
            {[
              'PDF reports give the best extraction accuracy — prefer digital PDFs over scans when possible',
              'When scanning, lay the report flat and ensure good lighting with no shadows',
              'For multi-page reports, upload the full PDF — the parser handles all pages',
              'On mobile, use the Scanner/Device option to capture directly from your camera',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                <span style={{ color: 'var(--ept-accent)' }}>•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
