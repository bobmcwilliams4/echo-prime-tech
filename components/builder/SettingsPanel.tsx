'use client';

import React from 'react';
import type { SiteSettings, ColorTheme, FontPairing } from '../../lib/builder/types';
import { COLOR_THEMES, FONT_PAIRINGS } from '../../lib/builder/types';

interface SettingsPanelProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: Partial<SiteSettings>) => void;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
};

const RADIUS_OPTIONS: { label: string; value: SiteSettings['borderRadius'] }[] = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'XL', value: 'xl' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '12px', color: COLORS.muted, marginBottom: '4px' }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: '6px',
          border: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.surface,
          color: COLORS.text,
          fontSize: '13px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

export default function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  return (
    <div style={{ padding: '0 12px' }}>
      {/* Site Info */}
      <div style={{ marginBottom: '20px', padding: '0 4px' }}>
        <SectionLabel>Site Info</SectionLabel>
        <InputField
          label="Site Title"
          value={settings.title}
          onChange={(title) => onUpdateSettings({ title })}
        />
        <InputField
          label="Description"
          value={settings.description}
          onChange={(description) => onUpdateSettings({ description })}
        />
      </div>

      {/* Color Theme */}
      <div style={{ marginBottom: '20px', padding: '0 4px' }}>
        <SectionLabel>Color Theme</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {COLOR_THEMES.map((theme) => {
            const isActive = settings.colorTheme.name === theme.name;
            return (
              <button
                key={theme.name}
                onClick={() => onUpdateSettings({ colorTheme: theme })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${isActive ? COLORS.accent : COLORS.border}`,
                  backgroundColor: isActive ? `${COLORS.accent}15` : COLORS.surface,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.primary }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.background }} />
                </div>
                <span style={{ fontSize: '11px', color: isActive ? COLORS.accent : COLORS.muted, fontWeight: isActive ? 600 : 400 }}>
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Pairing */}
      <div style={{ marginBottom: '20px', padding: '0 4px' }}>
        <SectionLabel>Font Pairing</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {FONT_PAIRINGS.map((fp) => {
            const isActive = settings.fontPairing.name === fp.name;
            return (
              <button
                key={fp.name}
                onClick={() => onUpdateSettings({ fontPairing: fp })}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${isActive ? COLORS.accent : COLORS.border}`,
                  backgroundColor: isActive ? `${COLORS.accent}15` : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '12px', color: isActive ? COLORS.accent : COLORS.text, fontWeight: isActive ? 600 : 400 }}>
                  {fp.name}
                </span>
                <span style={{ fontSize: '10px', color: COLORS.muted }}>
                  Aa
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Border Radius */}
      <div style={{ marginBottom: '20px', padding: '0 4px' }}>
        <SectionLabel>Border Radius</SectionLabel>
        <div style={{ display: 'flex', gap: '4px' }}>
          {RADIUS_OPTIONS.map((opt) => {
            const isActive = settings.borderRadius === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onUpdateSettings({ borderRadius: opt.value })}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: '6px',
                  border: `1px solid ${isActive ? COLORS.accent : COLORS.border}`,
                  backgroundColor: isActive ? `${COLORS.accent}22` : 'transparent',
                  color: isActive ? COLORS.accent : COLORS.muted,
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
