'use client';

import React from 'react';

interface BuilderSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
};

interface TabDef {
  id: string;
  label: string;
  icon: string;
}

const TABS: TabDef[] = [
  { id: 'ai', label: 'Echo Prime', icon: '\u2728' },
  { id: 'sections', label: 'Sections', icon: '\u25A6' },
  { id: 'templates', label: 'Templates', icon: '\u2B1A' },
  { id: 'assets', label: 'Assets', icon: '\u{1F5BC}' },
  { id: 'pages', label: 'Pages', icon: '\u{1F4C4}' },
  { id: 'settings', label: 'Settings', icon: '\u2699' },
];

export default function BuilderSidebar({ activeTab, onTabChange, children }: BuilderSidebarProps) {
  return (
    <div
      style={{
        width: '340px',
        minWidth: '340px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.bg,
        borderRight: `1px solid ${COLORS.border}`,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${COLORS.border}`,
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '10px 0 8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: isActive ? COLORS.accent : COLORS.muted,
                borderBottom: isActive ? `2px solid ${COLORS.accent}` : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
                fontSize: '10px',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.02em',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active tab header */}
      <div
        style={{
          padding: '12px 16px 8px',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 700,
            color: COLORS.text,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{TABS.find((t) => t.id === activeTab)?.icon}</span>
          {TABS.find((t) => t.id === activeTab)?.label}
        </h2>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '12px',
            color: COLORS.muted,
            lineHeight: 1.4,
          }}
        >
          {activeTab === 'ai' && 'Describe what you want, Echo Prime builds it.'}
          {activeTab === 'sections' && 'Drag pre-built sections onto your canvas.'}
          {activeTab === 'templates' && 'Start from a complete website template.'}
          {activeTab === 'assets' && 'Upload and manage images for your site.'}
          {activeTab === 'pages' && 'Manage pages and navigation.'}
          {activeTab === 'settings' && 'Site settings, colors, and fonts.'}
        </p>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 0 16px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export { TABS };
export type { TabDef };
