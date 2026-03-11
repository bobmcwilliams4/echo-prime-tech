'use client';

import React, { useState, useMemo } from 'react';
import type { SectionDefinition, SectionCategory } from '../../lib/builder/types';
import { SECTION_CATEGORY_LABELS } from '../../lib/builder/types';

interface SectionBrowserProps {
  onInsertSection: (html: string) => void;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
};

import { SECTION_CATALOG } from '../../lib/builder/section-catalog';

const ALL_CATEGORIES: (SectionCategory | 'all')[] = ['all', ...Object.keys(SECTION_CATEGORY_LABELS) as SectionCategory[]];

export default function SectionBrowser({ onInsertSection }: SectionBrowserProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    let results = SECTION_CATALOG;
    if (activeCategory !== 'all') {
      results = results.filter((s) => s.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
      );
    }
    return results;
  }, [search, activeCategory]);

  return (
    <div style={{ padding: '0 12px' }}>
      {/* Search */}
      <div style={{ padding: '0 4px 12px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sections..."
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.surface,
            color: COLORS.text,
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '0 4px 12px',
          scrollbarWidth: 'thin',
        }}
      >
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const label = cat === 'all' ? 'All' : SECTION_CATEGORY_LABELS[cat as SectionCategory];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: '20px',
                border: `1px solid ${isActive ? COLORS.accent : COLORS.border}`,
                backgroundColor: isActive ? `${COLORS.accent}22` : 'transparent',
                color: isActive ? COLORS.accent : COLORS.muted,
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Section grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '0 4px',
        }}
      >
        {filtered.map((section) => (
          <button
            key={section.id}
            onClick={() => onInsertSection(section.html)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: COLORS.surface,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s, transform 0.1s',
              padding: 0,
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
                height: '72px',
                background: section.thumbnail,
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            />
            {/* Info */}
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: COLORS.text, marginBottom: '4px' }}>
                {section.name}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: `${COLORS.accent}18`,
                  color: COLORS.accent,
                  fontSize: '10px',
                  fontWeight: 500,
                }}
              >
                {SECTION_CATEGORY_LABELS[section.category]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: COLORS.muted, fontSize: '13px' }}>
          No sections match your search.
        </div>
      )}
    </div>
  );
}
