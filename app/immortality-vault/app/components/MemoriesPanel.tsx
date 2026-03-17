'use client';

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER, CATEGORIES, EMOTION_ICONS } from '../lib/constants';
import { getTypedMemories, storeTypedMemory, consolidateMemories, type TypedMemory, type MemoryType } from '../lib/vault-api';

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
        <h2 className="text-2xl font-bold text-white">Memories</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => { setConsolidating(true); try { await consolidateMemories(userId); await loadMemories(); } catch {} setConsolidating(false); }}
            disabled={consolidating}
            className="px-4 py-2 rounded-full text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-40"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            {consolidating ? 'Consolidating...' : 'Consolidate'}
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 rounded-full text-sm font-semibold text-white transition hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
          >
            + Add Memory
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
            className="w-full p-4 rounded-lg text-sm text-white placeholder-gray-600 resize-none outline-none focus:ring-1 focus:ring-purple-500"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}`, minHeight: 120 }}
            rows={5}
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="p-2 rounded-lg text-sm text-white outline-none"
              style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
            <select
              value={newMemoryType}
              onChange={e => setNewMemoryType(e.target.value as MemoryType)}
              className="p-2 rounded-lg text-sm text-white outline-none"
              style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
            >
              {(['biography','conversation','event','emotion','wisdom','relationship','achievement'] as MemoryType[]).map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <div className="flex gap-1.5">
              {emotions.map(e => (
                <button
                  key={e}
                  onClick={() => setNewEmotion(newEmotion === e ? '' : e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition"
                  style={{
                    background: newEmotion === e ? '#7c3aed30' : '#1e1e2e',
                    border: `1px solid ${newEmotion === e ? '#7c3aed' : BORDER}`,
                  }}
                  title={e}
                >
                  {EMOTION_ICONS[e] || e[0]}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={addMemory}
            disabled={!newContent.trim() || saving}
            className="px-5 py-2 rounded-full text-sm font-bold text-white disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
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
          className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter(null)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition"
            style={{
              background: !filter ? '#7c3aed30' : '#1e1e2e',
              border: `1px solid ${!filter ? '#7c3aed' : BORDER}`,
              color: !filter ? ACCENT : '#94a3b8',
            }}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(filter === c.id ? null : c.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap"
              style={{
                background: filter === c.id ? '#7c3aed30' : '#1e1e2e',
                border: `1px solid ${filter === c.id ? '#7c3aed' : BORDER}`,
                color: filter === c.id ? ACCENT : '#94a3b8',
              }}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-4xl mb-3">{'\u{1F4DD}'}</div>
          <div className="text-sm text-gray-400">
            {search ? 'No memories match your search.' : 'No memories yet. Start preserving your stories!'}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, mems]) => (
            <div key={month}>
              <div className="text-xs font-mono mb-3" style={{ color: ACCENT, letterSpacing: 2 }}>{month.toUpperCase()}</div>
              <div className="space-y-2 border-l-2 pl-4" style={{ borderColor: '#1e1e2e' }}>
                {mems.map(m => {
                  const cat = CATEGORIES.find(c => c.id === m.category);
                  return (
                    <div key={m.id} className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        {cat && <span className="text-sm">{cat.icon}</span>}
                        <span className="text-[10px] text-gray-500">{cat?.name || m.category}</span>
                        {m.emotion && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#ffffff10' }}>
                            {EMOTION_ICONS[m.emotion] || ''} {m.emotion}
                          </span>
                        )}
                        {'memory_type' in m && m.memory_type && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: '#7c3aed20', color: ACCENT }}>
                            {m.memory_type}
                          </span>
                        )}
                        {'importance' in m && m.importance > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: m.importance >= 8 ? '#fbbf2420' : '#ffffff10', color: m.importance >= 8 ? GOLD : '#94a3b8' }}>
                            imp:{m.importance}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-600 ml-auto">
                          {new Date(m.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{m.content}</p>
                      {'keywords' in m && m.keywords && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {m.keywords.split(',').filter(Boolean).slice(0, 8).map((kw: string) => (
                            <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#1e1e2e', color: '#94a3b8' }}>{kw.trim()}</span>
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
