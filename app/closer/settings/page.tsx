'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getSettings, updateSettings, getMe } from '../../../lib/closer-api';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'business' | 'voice' | 'calling' | 'integrations';

interface BusinessInfo {
  company_name: string;
  owner_name: string;
  industry: string;
  phone: string;
  email: string;
  website: string;
}

interface VoicePreset {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
}

interface DaySchedule {
  active: boolean;
  start: string;
  end: string;
}

interface CallingSettings {
  twilio_phone: string;
  caller_id: string;
  recording_enabled: boolean;
  max_call_duration: number;
  timezone: string;
  business_hours: Record<string, DaySchedule>;
  dnc_compliance: boolean;
}

interface IntegrationStatus {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  last_synced: string | null;
}

interface SettingsData {
  business: BusinessInfo;
  voice: { selected_preset: string; speed: number; pitch: number };
  calling: CallingSettings;
  integrations: IntegrationStatus[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'business', label: 'Business Info', icon: <IconBuilding /> },
  { id: 'voice', label: 'AI Voice', icon: <IconMic /> },
  { id: 'calling', label: 'Calling', icon: <IconPhone /> },
  { id: 'integrations', label: 'Integrations', icon: <IconPlug /> },
];

const VOICE_PRESETS: VoicePreset[] = [
  { id: 'prof_male', name: 'Echo - Professional Male', description: 'Authoritative and clear, ideal for B2B outreach', gender: 'male' },
  { id: 'prof_female', name: 'Alice - Professional Female', description: 'Clear British accent, confident and polished, great for corporate sales', gender: 'female' },
  { id: 'warm_male', name: 'Bobby - Warm Male', description: 'Friendly and approachable, perfect for relationship building', gender: 'male' },
  { id: 'warm_female', name: 'Jessica - Warm Female', description: 'Playful, bright, and warm — builds trust quickly', gender: 'female' },
  { id: 'energy_male', name: 'Prometheus - Energetic Male', description: 'High energy and motivating, great for event and promo calls', gender: 'male' },
  { id: 'energy_female', name: 'Laura - Energetic Female', description: 'Upbeat and enthusiastic, ideal for appointment setting', gender: 'female' },
  { id: 'calm_male', name: 'Echo - Calm Male', description: 'Measured and reassuring, suited for consultative selling', gender: 'male' },
  { id: 'calm_female', name: 'Catherine - Calm Female', description: 'Welsh accent, soothing and patient, excellent for complex discussions', gender: 'female' },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Phoenix', 'America/Anchorage', 'Pacific/Honolulu', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo',
];

const SPEAK_CLOUD_URL = 'https://echo-speak-cloud.bmcii1976.workers.dev';

const VOICE_ID_MAP: Record<string, string> = {
  prof_male: 'keDMh3sQlEXKM4EQxvvi',      // Echo - sovereign AI commander
  prof_female: 'Xb7hH8MSUJpSbSDYk0k2',     // Alice - clear British educator
  warm_male: 'B5SCR8VDENzUF0L4eZY8',        // Bobby - Commander voice clone
  warm_female: 'cgSgspJ2msm6clMCkdW9',      // Jessica - playful, bright, warm
  energy_male: 'WSd8ZDUcldL8KQKxz1KN',      // Prometheus - security specialist
  energy_female: 'FGY2WhTYpPnrIDTdsKH5',    // Laura - enthusiast, quirky
  calm_male: 'keDMh3sQlEXKM4EQxvvi',        // Echo - measured, reassuring
  calm_female: 'MbmnAUd2tPCEOBK6D9Qd',      // Catherine - CZJ Welsh clone
};

const DEFAULT_HOURS: Record<string, DaySchedule> = Object.fromEntries(
  DAYS.map(d => [d, { active: !['saturday', 'sunday'].includes(d), start: '09:00', end: '17:00' }])
);

const DEFAULT_SETTINGS: SettingsData = {
  business: { company_name: '', owner_name: '', industry: '', phone: '', email: '', website: '' },
  voice: { selected_preset: 'prof_male', speed: 1.0, pitch: 0.5 },
  calling: {
    twilio_phone: '', caller_id: '', recording_enabled: true, max_call_duration: 15,
    timezone: 'America/Chicago', business_hours: DEFAULT_HOURS, dnc_compliance: true,
  },
  integrations: [
    { id: 'elevenlabs', name: 'ElevenLabs', category: 'TTS', connected: true, last_synced: null },
    { id: 'deepgram', name: 'Deepgram', category: 'STT', connected: true, last_synced: null },
    { id: 'azure_ai', name: 'Azure AI', category: 'LLM', connected: true, last_synced: null },
    { id: 'twilio', name: 'Twilio', category: 'Voice', connected: false, last_synced: null },
    { id: 'crm', name: 'CRM', category: 'CRM', connected: false, last_synced: null },
    { id: 'calendar', name: 'Calendar', category: 'Calendar', connected: false, last_synced: null },
    { id: 'email', name: 'Email', category: 'Email', connected: false, last_synced: null },
  ],
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconPlug() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8v5a6 6 0 0 1-12 0V8z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CloserSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('business');
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [editingCallerId, setEditingCallerId] = useState(false);
  const [callerIdDraft, setCallerIdDraft] = useState('');
  const [cloneFiles, setCloneFiles] = useState<File[]>([]);
  const [cloneUploading, setCloneUploading] = useState(false);
  const [cloneDragOver, setCloneDragOver] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [s, me] = await Promise.allSettled([getSettings(), getMe()]);
        const sData = s.status === 'fulfilled' ? s.value : {};
        const meData = me.status === 'fulfilled' ? me.value : {};
        setSettings({
          business: {
            company_name: sData.company_name || meData.company_name || '',
            owner_name: sData.owner_name || meData.owner_name || '',
            industry: sData.industry || meData.industry || '',
            phone: sData.phone || '', email: sData.email || user.email || '',
            website: sData.website || '',
          },
          voice: {
            selected_preset: sData.voice_preset || 'prof_male',
            speed: sData.voice_speed ?? 1.0,
            pitch: sData.voice_pitch ?? 0.5,
          },
          calling: {
            twilio_phone: sData.twilio_phone || '',
            caller_id: sData.caller_id || '',
            recording_enabled: sData.recording_enabled ?? true,
            max_call_duration: sData.max_call_duration ?? 15,
            timezone: sData.timezone || 'America/Chicago',
            business_hours: sData.business_hours || DEFAULT_HOURS,
            dnc_compliance: sData.dnc_compliance ?? true,
          },
          integrations: sData.integrations || DEFAULT_SETTINGS.integrations,
        });
      } catch { /* fallback already set */ }
      setLoading(false);
    })();
  }, [user]);

  const save = useCallback(async (patch: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateSettings(patch);
      showToast('Settings saved');
    } catch {
      showToast('Failed to save');
    }
    setSaving(false);
  }, [showToast]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--ept-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  // ─── Tab: Business Info ───────────────────────────────────────────────────

  function BusinessTab() {
    const b = settings.business;
    const fields: { label: string; key: keyof BusinessInfo; type?: string }[] = [
      { label: 'Company Name', key: 'company_name' },
      { label: 'Owner Name', key: 'owner_name' },
      { label: 'Industry', key: 'industry' },
      { label: 'Phone', key: 'phone', type: 'tel' },
      { label: 'Email', key: 'email', type: 'email' },
      { label: 'Website', key: 'website', type: 'url' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ept-text)' }}>Business Information</h2>
          <button
            onClick={() => setEditingBusiness(!editingBusiness)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'transparent', color: 'var(--ept-accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            <IconEdit /> {editingBusiness ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {fields.map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              {editingBusiness ? (
                <input
                  type={f.type || 'text'}
                  value={b[f.key]}
                  onChange={e => setSettings(prev => ({ ...prev, business: { ...prev.business, [f.key]: e.target.value } }))}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 14, outline: 'none' }}
                />
              ) : (
                <span style={{ fontSize: 14, color: b[f.key] ? 'var(--ept-text)' : 'var(--ept-text-muted)', fontStyle: b[f.key] ? 'normal' : 'italic' }}>
                  {b[f.key] || 'Not set'}
                </span>
              )}
            </div>
          ))}
        </div>
        {editingBusiness && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button
              onClick={() => setEditingBusiness(false)}
              style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'transparent', color: 'var(--ept-text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >Cancel</button>
            <button
              disabled={saving}
              onClick={() => { save({ ...settings.business }); setEditingBusiness(false); }}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: saving ? 0.6 : 1 }}
            >{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        )}
      </div>
    );
  }

  // ─── Tab: AI Voice ────────────────────────────────────────────────────────

  function VoiceTab() {
    const v = settings.voice;

    const handlePreviewVoice = async (presetId: string, presetName: string) => {
      if (playingVoice === presetId) return;
      // Stop any current preview
      if (previewAudioRef.current) { previewAudioRef.current.pause(); previewAudioRef.current = null; }
      speechSynthesis.cancel();
      setPlayingVoice(presetId);

      const text = `Hi there! I'm ${presetName}, your AI sales agent. I'm here to help you close more deals.`;
      const voiceId = VOICE_ID_MAP[presetId] || VOICE_ID_MAP.prof_male;

      // Try cloud TTS (ElevenLabs via echo-speak-cloud)
      try {
        const res = await fetch(`${SPEAK_CLOUD_URL}/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice_id: voiceId, provider: 'elevenlabs', speed: v.speed }),
        });
        if (res.ok && res.headers.get('content-type')?.includes('audio')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          previewAudioRef.current = audio;
          audio.onended = () => { URL.revokeObjectURL(url); setPlayingVoice(null); previewAudioRef.current = null; };
          audio.onerror = () => { URL.revokeObjectURL(url); setPlayingVoice(null); previewAudioRef.current = null; };
          await audio.play();
          return;
        }
      } catch { /* cloud TTS unavailable, fall through */ }

      // Fallback: browser speechSynthesis
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = v.speed;
        utterance.pitch = presetId.includes('male') && !presetId.includes('female') ? 0.9 : 1.1;
        utterance.onend = () => setPlayingVoice(null);
        utterance.onerror = () => setPlayingVoice(null);
        speechSynthesis.speak(utterance);
      } catch { setPlayingVoice(null); }
    };

    const stopPreview = () => {
      if (previewAudioRef.current) { previewAudioRef.current.pause(); previewAudioRef.current = null; }
      speechSynthesis.cancel();
      setPlayingVoice(null);
    };

    const handleCloneFiles = (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter(f =>
        ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/mp3'].includes(f.type) ||
        f.name.endsWith('.wav') || f.name.endsWith('.mp3') || f.name.endsWith('.m4a')
      );
      if (valid.length === 0) { showToast('Only WAV, MP3, and M4A files are supported'); return; }
      setCloneFiles(prev => [...prev, ...valid].slice(0, 5));
    };

    const removeCloneFile = (idx: number) => {
      setCloneFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const submitCloneFiles = async () => {
      if (cloneFiles.length < 1) { showToast('Upload at least 1 audio sample'); return; }
      setCloneUploading(true);
      try {
        // Convert files to base64 for upload
        const filePayloads = await Promise.all(cloneFiles.map(f => new Promise<{ data: string; name: string; type: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve({ data: base64, name: f.name, type: f.type || 'audio/mpeg' });
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(f);
        })));

        const companyName = settings.business.company_name || 'Custom';
        const cloneName = `${companyName} Voice Clone`;
        const resp = await fetch(`${SPEAK_CLOUD_URL}/voices/clone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026' },
          body: JSON.stringify({ name: cloneName, description: `Voice clone for ${companyName}`, files: filePayloads }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ error: 'Clone failed' }));
          throw new Error((err as { error?: string }).error || `Clone failed (${resp.status})`);
        }

        const result = await resp.json() as { voice_id: string; name: string };
        // Save the cloned voice ID to settings
        await save({
          voice_clone_id: result.voice_id,
          voice_clone_name: result.name,
          voice_clone_request: { status: 'completed', voice_id: result.voice_id, completed_at: new Date().toISOString() },
        });
        showToast(`Voice cloned successfully! Voice ID: ${result.voice_id.substring(0, 8)}...`);
        setCloneFiles([]);
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Failed to clone voice');
      }
      setCloneUploading(false);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>Voice Presets</h2>
          <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', marginBottom: 14 }}>Select an AI voice personality for outbound calls. Click the play button to preview.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {VOICE_PRESETS.map(p => {
              const selected = v.selected_preset === p.id;
              const isPlaying = playingVoice === p.id;
              return (
                <div
                  key={p.id}
                  style={{
                    padding: 16, borderRadius: 12, border: selected ? '2px solid var(--ept-accent)' : '1px solid var(--ept-card-border)',
                    backgroundColor: selected ? 'rgba(20,184,166,0.06)' : 'var(--ept-card-bg)',
                    textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', transition: 'all 0.15s',
                  }}
                >
                  {selected && (
                    <span style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: 'var(--ept-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <IconCheck /> Selected
                    </span>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--ept-text-muted)', lineHeight: 1.4 }}>{p.description}</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <button
                      onClick={() => isPlaying ? stopPreview() : handlePreviewVoice(p.id, p.name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8,
                        border: '1px solid var(--ept-border)', backgroundColor: isPlaying ? 'var(--ept-accent)' : 'transparent',
                        color: isPlaying ? '#fff' : 'var(--ept-text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                      }}
                    >
                      {isPlaying ? (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg> Stop</>
                      ) : (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg> Preview</>
                      )}
                    </button>
                    {!selected && (
                      <button
                        onClick={() => {
                          setSettings(prev => ({ ...prev, voice: { ...prev.voice, selected_preset: p.id } }));
                          save({ voice_preset: p.id });
                        }}
                        style={{
                          padding: '5px 12px', borderRadius: 8, border: 'none',
                          backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        }}
                      >Select</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voice Cloning Upload */}
        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>Custom Voice Cloning</h3>
          <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
            Upload 3-5 audio samples of the target voice (each 30-60 seconds). Supported: WAV, MP3, M4A.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setCloneDragOver(true); }}
            onDragLeave={() => setCloneDragOver(false)}
            onDrop={e => { e.preventDefault(); setCloneDragOver(false); handleCloneFiles(e.dataTransfer.files); }}
            onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.wav,.mp3,.m4a'; inp.multiple = true; inp.onchange = () => handleCloneFiles(inp.files); inp.click(); }}
            style={{
              border: `2px dashed ${cloneDragOver ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
              borderRadius: 12, padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
              backgroundColor: cloneDragOver ? 'rgba(20,184,166,0.06)' : 'transparent',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={cloneDragOver ? 'var(--ept-accent)' : 'var(--ept-text-muted)'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)' }}>
              {cloneDragOver ? 'Drop audio files here' : 'Click or drag audio files to upload'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 4 }}>WAV, MP3, M4A — up to 5 files, 30-60 seconds each</div>
          </div>

          {/* File list */}
          {cloneFiles.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cloneFiles.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, backgroundColor: 'var(--ept-surface)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ept-accent)" strokeWidth={2}><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--ept-text)' }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                  <button
                    onClick={e => { e.stopPropagation(); removeCloneFile(i); }}
                    style={{ width: 24, height: 24, borderRadius: 6, border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >&times;</button>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button
                  onClick={() => setCloneFiles([])}
                  style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'transparent', color: 'var(--ept-text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                >Clear</button>
                <button
                  disabled={cloneUploading}
                  onClick={submitCloneFiles}
                  style={{ padding: '7px 16px', borderRadius: 8, border: 'none', backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, opacity: cloneUploading ? 0.6 : 1 }}
                >{cloneUploading ? 'Submitting...' : `Submit ${cloneFiles.length} Sample${cloneFiles.length > 1 ? 's' : ''}`}</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>Speaking Speed</label>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ept-accent)' }}>{v.speed.toFixed(1)}x</span>
            </div>
            <input
              type="range" min="0.5" max="2.0" step="0.1" value={v.speed}
              onChange={e => setSettings(prev => ({ ...prev, voice: { ...prev.voice, speed: parseFloat(e.target.value) } }))}
              onMouseUp={() => save({ voice_speed: v.speed })}
              onTouchEnd={() => save({ voice_speed: v.speed })}
              style={{ width: '100%', accentColor: 'var(--ept-accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ept-text-muted)' }}>
              <span>0.5x (Slow)</span><span>1.0x</span><span>2.0x (Fast)</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>Voice Pitch</label>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ept-accent)' }}>{v.pitch <= 0.33 ? 'Low' : v.pitch <= 0.66 ? 'Medium' : 'High'}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.05" value={v.pitch}
              onChange={e => setSettings(prev => ({ ...prev, voice: { ...prev.voice, pitch: parseFloat(e.target.value) } }))}
              onMouseUp={() => save({ voice_pitch: v.pitch })}
              onTouchEnd={() => save({ voice_pitch: v.pitch })}
              style={{ width: '100%', accentColor: 'var(--ept-accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ept-text-muted)' }}>
              <span>Low</span><span>Medium</span><span>High</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Tab: Calling ─────────────────────────────────────────────────────────

  function CallingTab() {
    const c = settings.calling;

    function maskPhone(phone: string): string {
      if (!phone || phone.length < 6) return phone || 'Not configured';
      return phone.slice(0, 4) + '****' + phone.slice(-2);
    }

    function updateCalling(patch: Partial<CallingSettings>) {
      setSettings(prev => ({ ...prev, calling: { ...prev.calling, ...patch } }));
    }

    function updateDaySchedule(day: string, patch: Partial<DaySchedule>) {
      setSettings(prev => ({
        ...prev,
        calling: {
          ...prev.calling,
          business_hours: { ...prev.calling.business_hours, [day]: { ...prev.calling.business_hours[day], ...patch } },
        },
      }));
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 14 }}>Twilio Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</label>
              <span style={{ fontSize: 14, color: 'var(--ept-text)', fontFamily: 'monospace' }}>{maskPhone(c.twilio_phone)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Caller ID Display</label>
              {editingCallerId ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={callerIdDraft}
                    onChange={e => setCallerIdDraft(e.target.value)}
                    placeholder="e.g. Your Company Name"
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13, outline: 'none', flex: 1, maxWidth: 220 }}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      updateCalling({ caller_id: callerIdDraft });
                      save({ caller_id: callerIdDraft });
                      setEditingCallerId(false);
                    }}
                    style={{ padding: '6px 12px', borderRadius: 8, border: 'none', backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                  >Save</button>
                  <button
                    onClick={() => setEditingCallerId(false)}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'transparent', color: 'var(--ept-text-muted)', cursor: 'pointer', fontSize: 12 }}
                  >Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: c.caller_id ? 'var(--ept-text)' : 'var(--ept-text-muted)', fontStyle: c.caller_id ? 'normal' : 'italic' }}>{c.caller_id || 'Default (click to change)'}</span>
                  <button
                    onClick={() => { setCallerIdDraft(c.caller_id || ''); setEditingCallerId(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'transparent', color: 'var(--ept-accent)', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                  ><IconEdit /> Edit</button>
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ToggleRow
              label="Call Recording"
              description="Record all outbound calls for quality review and compliance"
              value={c.recording_enabled}
              onChange={v => { updateCalling({ recording_enabled: v }); save({ recording_enabled: v }); }}
            />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>Max Call Duration</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ept-accent)' }}>{c.max_call_duration} min</span>
              </div>
              <input
                type="range" min="1" max="30" step="1" value={c.max_call_duration}
                onChange={e => updateCalling({ max_call_duration: parseInt(e.target.value) })}
                onMouseUp={() => save({ max_call_duration: c.max_call_duration })}
                onTouchEnd={() => save({ max_call_duration: c.max_call_duration })}
                style={{ width: '100%', accentColor: 'var(--ept-accent)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ept-text-muted)' }}>
                <span>1 min</span><span>15 min</span><span>30 min</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 14 }}>Business Hours</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Timezone</label>
            <select
              value={c.timezone}
              onChange={e => { updateCalling({ timezone: e.target.value }); save({ timezone: e.target.value }); }}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 13, outline: 'none', width: '100%', maxWidth: 300 }}
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DAYS.map(day => {
              const sched = c.business_hours[day] || { active: false, start: '09:00', end: '17:00' };
              return (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--ept-border)' }}>
                  <button
                    onClick={() => { updateDaySchedule(day, { active: !sched.active }); }}
                    style={{
                      width: 38, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                      backgroundColor: sched.active ? 'var(--ept-accent)' : 'var(--ept-border)',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 2, left: sched.active ? 18 : 2, width: 18, height: 18, borderRadius: '50%',
                      backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                  <span style={{ width: 80, fontSize: 13, fontWeight: 600, color: sched.active ? 'var(--ept-text)' : 'var(--ept-text-muted)', textTransform: 'capitalize' }}>{day}</span>
                  {sched.active ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="time" value={sched.start} onChange={e => updateDaySchedule(day, { start: e.target.value })}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 12 }} />
                      <span style={{ color: 'var(--ept-text-muted)', fontSize: 12 }}>to</span>
                      <input type="time" value={sched.end} onChange={e => updateDaySchedule(day, { end: e.target.value })}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', fontSize: 12 }} />
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--ept-text-muted)', fontStyle: 'italic' }}>Closed</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              disabled={saving}
              onClick={() => save({ business_hours: c.business_hours })}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: saving ? 0.6 : 1 }}
            >{saving ? 'Saving...' : 'Save Hours'}</button>
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <ToggleRow
            label="DNC Compliance"
            description="Automatically check numbers against the National Do Not Call Registry before placing calls"
            value={c.dnc_compliance}
            onChange={v => { updateCalling({ dnc_compliance: v }); save({ dnc_compliance: v }); }}
          />
        </div>
      </div>
    );
  }

  // ─── Tab: Integrations ────────────────────────────────────────────────────

  function IntegrationsTab() {
    const intg = settings.integrations;
    const iconMap: Record<string, string> = {
      twilio: '\u260E', deepgram: '\uD83C\uDF99', elevenlabs: '\uD83D\uDD0A', azure_ai: '\uD83E\uDDE0',
      crm: '\uD83D\uDCCB', calendar: '\uD83D\uDCC5', email: '\u2709',
    };
    const platformServices = new Set(['elevenlabs', 'deepgram', 'azure_ai']);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>Connected Services</h2>
          <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', marginBottom: 14 }}>Platform AI services are active by default. Connect your own business tools below.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {intg.map(item => {
            const isPlatform = platformServices.has(item.id);
            return (
              <div
                key={item.id}
                style={{
                  padding: 16, borderRadius: 12, backgroundColor: 'var(--ept-card-bg)', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.15s',
                  border: item.connected ? '1px solid var(--ept-accent)' : '1px solid var(--ept-card-border)',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'var(--ept-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {iconMap[item.id] || '\u2699'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.connected ? '#22c55e' : '#f59e0b', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: item.connected ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                      {item.connected ? (isPlatform ? 'Active (Platform)' : 'Connected') : 'Not Configured'}
                    </span>
                  </div>
                  {item.last_synced && (
                    <span style={{ fontSize: 11, color: 'var(--ept-text-muted)', display: 'block', marginTop: 2 }}>
                      Last synced: {new Date(item.last_synced).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {!item.connected && (
                  <button
                    onClick={() => showToast(`${item.name} integration setup coming soon`)}
                    style={{
                      padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600,
                      backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: 'pointer', flexShrink: 0,
                    }}
                  >Configure</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Toggle Row Component ─────────────────────────────────────────────────

  function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)' }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--ept-text-muted)', marginTop: 2, lineHeight: 1.4 }}>{description}</div>
        </div>
        <button
          onClick={() => onChange(!value)}
          style={{
            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, marginTop: 2,
            backgroundColor: value ? 'var(--ept-accent)' : 'var(--ept-border)',
          }}
        >
          <span style={{
            position: 'absolute', top: 2, left: value ? 22 : 2, width: 20, height: 20, borderRadius: '50%',
            backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  const tabContent: Record<TabId, React.ReactNode> = {
    business: BusinessTab(),
    voice: VoiceTab(),
    calling: CallingTab(),
    integrations: IntegrationsTab(),
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ept-text)', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', marginTop: 4 }}>Configure your Closer platform preferences and integrations</p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--ept-border)', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', fontSize: 13, fontWeight: 600,
              border: 'none', cursor: 'pointer', backgroundColor: 'transparent', position: 'relative', transition: 'color 0.15s',
              color: activeTab === tab.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--ept-accent)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tabContent[activeTab]}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          backgroundColor: toast.includes('Failed') ? '#ef4444' : 'var(--ept-accent)', color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 1000, animation: 'fadeIn 0.2s',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
