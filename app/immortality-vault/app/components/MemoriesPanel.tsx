'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED, CATEGORIES, EMOTION_ICONS } from '../lib/constants';
import { getTypedMemories, storeTypedMemory, consolidateMemories, updateMemory, type TypedMemory, type MemoryType } from '../lib/vault-api';
import VaultIcon, { CATEGORY_ICON } from './VaultIcon';

const goldBtn = `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`;

interface Props {
  userId: string;
}

export default function MemoriesPanel({ userId }: Props) {
  const [memories, setMemories] = useState<TypedMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('early_life');
  const [newEmotion, setNewEmotion] = useState('');
  const [saving, setSaving] = useState(false);
  const [newMemoryType, setNewMemoryType] = useState<MemoryType>('biography');
  const [typeFilter, setTypeFilter] = useState<MemoryType | null>(null);
  const [consolidating, setConsolidating] = useState(false);

  /* ── P3 slice 3: inline memory edit ── */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [showOriginalId, setShowOriginalId] = useState<string | null>(null);

  const beginEdit = (m: TypedMemory) => {
    setEditingId(m.id);
    setEditContent(m.content);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditError(null);
  };

  const saveEdit = async (m: TypedMemory) => {
    const next = editContent.trim();
    if (!next || next === m.content) { cancelEdit(); return; }
    setEditSaving(true);
    setEditError(null);
    try {
      await updateMemory(userId, m.id, next);
      // Reflect the persisted edit locally so the correction shows immediately
      // and the original stays available, independent of list-endpoint lag.
      setMemories(prev => prev.map(x =>
        x.id === m.id
          ? { ...x, content: next, original_content: x.original_content ?? x.content, edited: true, edited_at: new Date().toISOString() }
          : x,
      ));
      cancelEdit();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Could not save your edit. Please try again.');
    }
    setEditSaving(false);
  };

  const loadMemories = async () => {
    setLoading(true);
    try {
      const data = await getTypedMemories(userId, { memoryType: typeFilter || undefined, category: filter || undefined, limit: 100 });
      setMemories(data.memories || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { loadMemories(); }, [userId, filter, typeFilter]);

  const addMemory = async () => {
    if (!newContent.trim()) return;
    setSaving(true);
    try {
      await storeTypedMemory(userId, newContent.trim(), { memoryType: newMemoryType, category: newCategory, emotion: newEmotion || undefined });
      await loadMemories();
      setNewContent('');
      setNewEmotion('');
      setShowAdd(false);
    } catch { /* empty */ }
    setSaving(false);
  };

  // Group by month
  const grouped = memories
    .filter(m => !search || m.content.toLowerCase().includes(search.toLowerCase()))
    .reduce<Record<string, TypedMemory[]>>((acc, m) => {
      const key = new Date(m.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      (acc[key] = acc[key] || []).push(m);
      return acc;
    }, {});

  const emotions = ['joy', 'love', 'nostalgia', 'pride', 'wisdom', 'humor', 'sadness', 'concern'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Memories</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => { setConsolidating(true); try { await consolidateMemories(userId); await loadMemories(); } catch {} setConsolidating(false); }}
            disabled={consolidating}
            className="px-4 py-2 rounded-full text-sm font-semibold transition hover:brightness-110 disabled:opacity-40"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: IVORY }}
          >
            {consolidating ? 'Consolidating...' : 'Consolidate'}
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition hover:brightness-110 inline-flex items-center gap-1.5"
            style={{ background: goldBtn, color: '#20160a' }}
          >
            <VaultIcon name="plus" size={15} /> Add Memory
          </button>
        </div>
      </div>

      {/* Add Memory Form */}
      {showAdd && (
        <div className="p-5 rounded-xl space-y-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Write your memory... Include as many details as you remember."
            className="w-full p-4 rounded-lg text-sm placeholder-gray-600 resize-none outline-none focus:ring-1 focus:ring-amber-400/40"
            style={{ background: BG_INSET, border: `1px solid ${BORDER}`, minHeight: 120, color: IVORY }}
            rows={5}
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="p-2 rounded-lg text-sm outline-none"
              style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={newMemoryType}
              onChange={e => setNewMemoryType(e.target.value as MemoryType)}
              className="p-2 rounded-lg text-sm outline-none"
              style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}
            >
              {(['biography','conversation','event','emotion','wisdom','relationship','achievement'] as MemoryType[]).map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <div className="flex gap-1.5">
              {emotions.map(e => {
                const on = newEmotion === e;
                return (
                  <button
                    key={e}
                    onClick={() => setNewEmotion(on ? '' : e)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition"
                    style={{
                      background: on ? 'rgba(245,196,81,0.16)' : BG_INSET,
                      border: `1px solid ${on ? ACCENT : BORDER}`,
                      color: on ? ACCENT : MUTED,
                    }}
                    title={e}
                  >
                    <VaultIcon name={EMOTION_ICONS[e] || 'spark'} size={16} />
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={addMemory}
            disabled={!newContent.trim() || saving}
            className="px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-40"
            style={{ background: goldBtn, color: '#20160a' }}
          >
            {saving ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      )}

      {/* Search + Category Filter */}
      <div className="space-y-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search memories..."
          className="w-full p-3 rounded-lg text-sm placeholder-gray-600 outline-none focus:ring-1 focus:ring-amber-400/40"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: IVORY }}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter(null)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition"
            style={{
              background: !filter ? 'rgba(245,196,81,0.16)' : BG_INSET,
              border: `1px solid ${!filter ? ACCENT : BORDER}`,
              color: !filter ? ACCENT : MUTED,
            }}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(filter === c.id ? null : c.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap inline-flex items-center gap-1.5"
              style={{
                background: filter === c.id ? 'rgba(245,196,81,0.16)' : BG_INSET,
                border: `1px solid ${filter === c.id ? ACCENT : BORDER}`,
                color: filter === c.id ? ACCENT : MUTED,
              }}
            >
              <VaultIcon name={CATEGORY_ICON[c.id] || 'spark'} size={13} /> {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 rounded-full animate-spin mx-auto" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-3 flex justify-center" style={{ color: GOLD }}><VaultIcon name="crystal" size={34} /></div>
          <div className="text-sm" style={{ color: MUTED }}>
            {search ? 'No memories match your search.' : 'No memories yet. Start preserving your stories!'}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, mems]) => (
            <div key={month}>
              <div className="text-xs font-mono mb-3" style={{ color: ACCENT, letterSpacing: 2 }}>{month.toUpperCase()}</div>
              <div className="space-y-2 border-l-2 pl-4" style={{ borderColor: HAIR }}>
                {mems.map(m => {
                  const cat = CATEGORIES.find(c => c.id === m.category);
                  return (
                    <div key={m.id} className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        {cat && <span style={{ color: GOLD_DEEP, display: 'flex' }}><VaultIcon name={CATEGORY_ICON[cat.id] || 'spark'} size={14} /></span>}
                        <span className="text-[10px]" style={{ color: MUTED }}>{cat?.name || m.category}</span>
                        {m.emotion && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded inline-flex items-center gap-1" style={{ background: 'rgba(245,196,81,0.10)', color: MUTED }}>
                            <VaultIcon name={EMOTION_ICONS[m.emotion] || 'spark'} size={11} /> {m.emotion}
                          </span>
                        )}
                        {'memory_type' in m && m.memory_type && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(245,196,81,0.14)', color: ACCENT }}>
                            {m.memory_type}
                          </span>
                        )}
                        {'importance' in m && m.importance > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: m.importance >= 8 ? 'rgba(251,191,36,0.16)' : 'rgba(245,196,81,0.08)', color: m.importance >= 8 ? GOLD : MUTED }}>
                            imp:{m.importance}
                          </span>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                          {m.edited && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono inline-flex items-center gap-1" style={{ background: 'rgba(245,196,81,0.10)', color: MUTED }} title={m.edited_at ? `Edited ${new Date(m.edited_at).toLocaleDateString()}` : 'Edited'}>
                              <VaultIcon name="edit" size={10} /> edited
                            </span>
                          )}
                          <span className="text-[10px]" style={{ color: 'rgba(169,158,139,0.7)' }}>
                            {new Date(m.created_at).toLocaleDateString()}
                          </span>
                          {editingId !== m.id && (
                            <button
                              onClick={() => beginEdit(m)}
                              className="flex items-center justify-center rounded-md transition hover:brightness-125"
                              style={{ width: 24, height: 24, background: BG_INSET, border: `1px solid ${BORDER}`, color: MUTED }}
                              title="Edit this memory"
                              aria-label="Edit this memory"
                            >
                              <VaultIcon name="edit" size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {editingId === m.id ? (
                        <div className="space-y-2">
                          <label htmlFor={`edit-${m.id}`} className="sr-only">Edit memory text</label>
                          <textarea
                            id={`edit-${m.id}`}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="w-full p-3 rounded-lg text-sm leading-relaxed resize-none outline-none focus:ring-1 focus:ring-amber-400/40"
                            style={{ background: BG_INSET, border: `1px solid ${BORDER}`, minHeight: 100, color: IVORY }}
                            rows={4}
                            autoFocus
                          />
                          {editError && (
                            <p className="text-xs" role="alert" style={{ color: '#e6a07a' }}>{editError}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveEdit(m)}
                              disabled={editSaving || !editContent.trim() || editContent.trim() === m.content}
                              className="px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-40"
                              style={{ background: goldBtn, color: '#20160a' }}
                            >
                              <VaultIcon name="check" size={13} /> {editSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={editSaving}
                              className="px-4 py-1.5 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40"
                              style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: MUTED }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed" style={{ color: '#d6cbb6' }}>{m.content}</p>
                          {m.edited && m.original_content && (
                            <div className="mt-2">
                              <button
                                onClick={() => setShowOriginalId(showOriginalId === m.id ? null : m.id)}
                                className="text-[11px] inline-flex items-center gap-1 transition hover:brightness-125"
                                style={{ color: MUTED }}
                                aria-expanded={showOriginalId === m.id}
                              >
                                <VaultIcon name="history" size={12} /> {showOriginalId === m.id ? 'Hide original' : 'View original'}
                              </button>
                              {showOriginalId === m.id && (
                                <p className="text-xs leading-relaxed mt-1.5 pl-3 border-l" style={{ color: MUTED, borderColor: HAIR, fontStyle: 'italic' }}>
                                  {m.original_content}
                                </p>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {'keywords' in m && m.keywords && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {m.keywords.split(',').filter(Boolean).slice(0, 8).map((kw: string) => (
                            <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: BG_INSET, color: MUTED }}>{kw.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
