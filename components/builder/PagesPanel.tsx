'use client';

import React, { useState, useCallback } from 'react';
import type { BuilderPage } from '../../lib/builder/types';

interface PagesPanelProps {
  pages: BuilderPage[];
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
  onRenamePage: (pageId: string, name: string) => void;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
};

export default function PagesPanel({ pages, activePageId, onSelectPage, onAddPage, onDeletePage, onRenamePage }: PagesPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startRename = useCallback((page: BuilderPage) => {
    setEditingId(page.id);
    setEditValue(page.name);
  }, []);

  const commitRename = useCallback(() => {
    if (editingId && editValue.trim()) {
      onRenamePage(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  }, [editingId, editValue, onRenamePage]);

  return (
    <div style={{ padding: '0 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pages</span>
        <button
          onClick={onAddPage}
          style={{
            padding: '4px 12px',
            borderRadius: '6px',
            border: `1px solid ${COLORS.accent}`,
            backgroundColor: 'transparent',
            color: COLORS.accent,
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Page
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          const isEditing = editingId === page.id;

          return (
            <div
              key={page.id}
              onClick={() => !isEditing && onSelectPage(page.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${isActive ? COLORS.accent : COLORS.border}`,
                backgroundColor: isActive ? `${COLORS.accent}15` : COLORS.surface,
                cursor: isEditing ? 'default' : 'pointer',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '14px' }}>{page.isHome ? '\u{1F3E0}' : '\u{1F4C4}'}</span>
                {isEditing ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename();
                      if (e.key === 'Escape') { setEditingId(null); setEditValue(''); }
                    }}
                    style={{
                      flex: 1,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${COLORS.accent}`,
                      backgroundColor: COLORS.bg,
                      color: COLORS.text,
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? COLORS.text : COLORS.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {page.name}
                  </span>
                )}
              </div>

              {!isEditing && (
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); startRename(page); }}
                    title="Rename"
                    style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', fontSize: '11px', padding: '2px 4px' }}
                  >
                    &#9998;
                  </button>
                  {!page.isHome && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeletePage(page.id); }}
                      title="Delete"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', padding: '2px 4px' }}
                    >
                      &#10005;
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: COLORS.muted, fontSize: '13px' }}>
          No pages yet. Add one to get started.
        </div>
      )}

      <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: `${COLORS.accent}08`, border: `1px solid ${COLORS.accent}22` }}>
        <div style={{ fontSize: '11px', color: COLORS.accent, fontWeight: 600, marginBottom: '4px' }}>Tip</div>
        <div style={{ fontSize: '11px', color: COLORS.muted, lineHeight: 1.5 }}>
          Each page stores its own HTML. Switch between pages to edit different sections of your site.
        </div>
      </div>
    </div>
  );
}
