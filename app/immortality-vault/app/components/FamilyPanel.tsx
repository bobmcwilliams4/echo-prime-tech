'use client';

import { useState, useEffect } from 'react';
import { ACCENT, BG_CARD, BORDER } from '../lib/constants';
import { getFamilyMembers, addFamilyMember, deleteFamilyMember, type FamilyMember } from '../lib/vault-api';

interface Props {
  userId: string;
}

export default function FamilyPanel({ userId }: Props) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newBio, setNewBio] = useState('');

  useEffect(() => {
    getFamilyMembers(userId)
      .then(d => setMembers(d.members))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const addMember = async () => {
    if (!newName.trim() || !newRelation.trim()) return;
    try {
      const data = await addFamilyMember(userId, {
        name: newName.trim(),
        relationship: newRelation.trim(),
        bio: newBio.trim() || undefined,
      });
      setMembers(prev => [...prev, data]);
      setNewName('');
      setNewRelation('');
      setNewBio('');
      setShowAdd(false);
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const removeMember = async (id: string) => {
    try {
      await deleteFamilyMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch { /* empty */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Family Vault</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white transition hover:scale-[1.02]"
          style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
        >
          + Add Member
        </button>
      </div>

      {showAdd && (
        <div className="p-5 rounded-xl space-y-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Full name"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
          />
          <input
            value={newRelation}
            onChange={e => setNewRelation(e.target.value)}
            placeholder="Relationship (e.g., Grandfather, Mother, Son)"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
          />
          <textarea
            value={newBio}
            onChange={e => setNewBio(e.target.value)}
            placeholder="Short biography (optional)"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
            rows={3}
          />
          <button onClick={addMember} className="px-5 py-2 rounded-full text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}>
            Save Member
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-4xl mb-3">{'\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}'}</div>
          <div className="text-sm text-gray-400">No family members yet. Start building your family tree!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <div key={m.id} className="p-5 rounded-xl group relative" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <button
                onClick={() => removeMember(m.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition"
              >
                &times;
              </button>
              <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-xl" style={{ background: '#1e1e2e', border: `2px solid ${BORDER}` }}>
                {'\u{1F464}'}
              </div>
              <div className="text-base font-bold text-white">{m.name}</div>
              <div className="text-xs mb-2" style={{ color: ACCENT }}>{m.relationship}</div>
              {m.bio && <div className="text-xs text-gray-400">{m.bio}</div>}
              {m.birth_date && <div className="text-[10px] text-gray-600 mt-1">Born: {m.birth_date}</div>}
              {m.death_date && <div className="text-[10px] text-gray-600">Passed: {m.death_date}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
