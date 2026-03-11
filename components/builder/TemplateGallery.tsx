'use client';

import React, { useState, useMemo } from 'react';
import type { TemplateDefinition, TemplateCategory } from '../../lib/builder/types';
import { TEMPLATE_CATEGORY_LABELS } from '../../lib/builder/types';

interface TemplateGalleryProps {
  onSelectTemplate: (html: string) => void;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
};

import { TEMPLATE_CATALOG } from '../../lib/builder/template-catalog';

const ALL_CATEGORIES: (TemplateCategory | 'all')[] = ['all', ...Object.keys(TEMPLATE_CATEGORY_LABELS) as TemplateCategory[]];

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return TEMPLATE_CATALOG;
    return TEMPLATE_CATALOG.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div style={{ padding: '0 12px' }}>
      {/* Category filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          padding: '0 4px 14px',
          scrollbarWidth: 'thin',
        }}
      >
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const label = cat === 'all' ? 'All' : TEMPLATE_CATEGORY_LABELS[cat as TemplateCategory];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? `${COLORS.accent}22` : 'transparent',
                color: isActive ? COLORS.accent : COLORS.muted,
                fontSize: '12px',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Template grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '0 4px',
        }}
      >
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: COLORS.surface,
              transition: 'border-color 0.2s, transform 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = COLORS.accent;
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = COLORS.border;
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                height: '90px',
                background: tmpl.thumbnail,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#e2e8f0',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                {TEMPLATE_CATEGORY_LABELS[tmpl.category]}
              </span>
            </div>
            {/* Info */}
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: COLORS.text, marginBottom: '4px' }}>
                {tmpl.name}
              </div>
              <div style={{ fontSize: '11px', color: COLORS.muted, lineHeight: 1.4, marginBottom: '10px' }}>
                {tmpl.description}
              </div>
              <button
                onClick={() => onSelectTemplate(tmpl.html)}
                style={{
                  width: '100%',
                  padding: '7px 0',
                  borderRadius: '6px',
                  border: `1px solid ${COLORS.accent}`,
                  backgroundColor: 'transparent',
                  color: COLORS.accent,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = COLORS.accent;
                  (e.currentTarget as HTMLElement).style.color = '#0f1219';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = COLORS.accent;
                }}
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.muted, fontSize: '13px' }}>
          No templates in this category.
        </div>
      )}
    </div>
  );
}
