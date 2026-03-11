'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';

interface BuilderTopBarProps {
  gjs: any;
  onPublish: () => void;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
};

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEVICE_MAP: { type: DeviceType; icon: string; width: string }[] = [
  { type: 'desktop', icon: '\u{1F5A5}', width: '' },
  { type: 'tablet', icon: '\u{1F4F1}', width: '768px' },
  { type: 'mobile', icon: '\u{1F4F1}', width: '375px' },
];

export default function BuilderTopBar({ gjs, onPublish }: BuilderTopBarProps) {
  const [activeDevice, setActiveDevice] = React.useState<DeviceType>('desktop');

  const switchDevice = useCallback(
    (device: DeviceType) => {
      setActiveDevice(device);
      if (!gjs) return;
      const entry = DEVICE_MAP.find((d) => d.type === device);
      if (entry?.width) {
        gjs.setDevice(device === 'tablet' ? 'Tablet' : 'Mobile portrait');
      } else {
        gjs.setDevice('Desktop');
      }
    },
    [gjs],
  );

  const handleUndo = useCallback(() => gjs?.UndoManager?.undo(), [gjs]);
  const handleRedo = useCallback(() => gjs?.UndoManager?.redo(), [gjs]);

  const handleClear = useCallback(() => {
    if (!gjs) return;
    if (window.confirm('Clear entire canvas? This cannot be undone.')) {
      gjs.DomComponents.clear();
      gjs.CssComposer.clear();
    }
  }, [gjs]);

  const handleExportHtml = useCallback(() => {
    if (!gjs) return;
    const html = gjs.getHtml();
    const css = gjs.getCss();
    const full = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [gjs]);

  const handlePreview = useCallback(() => {
    if (!gjs) return;
    const html = gjs.getHtml();
    const css = gjs.getCss();
    const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>${css}</style></head><body>${html}</body></html>`;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(full);
      win.document.close();
    }
  }, [gjs]);

  const btnBase: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.surface,
    color: COLORS.muted,
    cursor: 'pointer',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'background-color 0.15s, color 0.15s',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
        padding: '0 16px',
        backgroundColor: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/websites" style={{ color: COLORS.muted, textDecoration: 'none', fontSize: '14px' }}>
          \u2190 Back
        </Link>
        <span
          style={{
            padding: '3px 10px',
            borderRadius: '4px',
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.accent,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          Website Builder
        </span>
      </div>

      {/* Center */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {DEVICE_MAP.map((d) => (
          <button
            key={d.type}
            onClick={() => switchDevice(d.type)}
            title={d.type.charAt(0).toUpperCase() + d.type.slice(1)}
            style={{
              ...btnBase,
              backgroundColor: activeDevice === d.type ? COLORS.surface : 'transparent',
              color: activeDevice === d.type ? COLORS.accent : COLORS.muted,
              border: activeDevice === d.type ? `1px solid ${COLORS.accent}44` : `1px solid transparent`,
            }}
          >
            {d.icon}
          </button>
        ))}
        <div style={{ width: '1px', height: '24px', backgroundColor: COLORS.border, margin: '0 4px' }} />
        <button onClick={handleUndo} style={btnBase} title="Undo">
          \u21A9
        </button>
        <button onClick={handleRedo} style={btnBase} title="Redo">
          \u21AA
        </button>
        <button onClick={handleClear} style={{ ...btnBase, color: '#ef4444' }} title="Clear Canvas">
          \u2715
        </button>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={handleExportHtml} style={btnBase}>
          Export HTML
        </button>
        <button onClick={handlePreview} style={btnBase}>
          Preview
        </button>
        <button
          onClick={onPublish}
          style={{
            ...btnBase,
            backgroundColor: COLORS.accent,
            color: '#0f1219',
            fontWeight: 700,
            border: `1px solid ${COLORS.accent}`,
          }}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
