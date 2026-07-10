'use client';

import { useState, useEffect } from 'react';
import { ACCENT, BG_CARD, BORDER } from '../lib/constants';
import { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember, createFamilyInvite, type FamilyMember } from '../lib/vault-api';

interface Props {
  userId: string;
}

export default function FamilyPanel({ userId }: Props) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [invitedId, setInvitedId] = useState<string | null>(null);

  // Listening invite: a private link this family member can open — no account
  // needed — to read/hear the preserved stories.
  const inviteMember = async (memberId: string) => {
    try {
      const inv = await createFamilyInvite(memberId);
      await navigator.clipboard.writeText(inv.link);
      setInvitedId(memberId);
      setTimeout(() => setInvitedId(null), 2500);
    } catch { /* clipboard denied — nothing broke */ }
  };
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newDeathDate, setNewDeathDate] = useState('');
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [editName, setEditName] = useState('');
  const [editRelation, setEditRelation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editDeathDate, setEditDeathDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getFamilyMembers(userId)
      .then(d => setMembers(d.members))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const addMember = async () => {
    if (!newName.trim() || !newRelation.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = await addFamilyMember(userId, {
        name: newName.trim(),
        relationship: newRelation.trim(),
        bio: newBio.trim() || undefined,
        birth_date: newBirthDate || undefined,
        death_date: newDeathDate || undefined,
      });
      setMembers(prev => [...prev, data]);
      setNewName('');
      setNewRelation('');
      setNewBio('');
      setNewBirthDate('');
      setNewDeathDate('');
      setShowAdd(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add family member');
    } finally {
      setSubmitting(false);
    }
  };

  const removeMember = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFamilyMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch {
      setError('Failed to remove member');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (m: FamilyMember) => {
    setEditing(m);
    setEditName(m.name);
    setEditRelation(m.relationship);
    setEditBio(m.bio || '');
    setEditBirthDate(m.birth_date || '');
    setEditDeathDate(m.death_date || '');
    setError(null);
  };

  const saveEdit = async () => {
    if (!editing || !editName.trim() || !editRelation.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateFamilyMember(editing.id, {
        name: editName.trim(),
        relationship: editRelation.trim(),
        bio: editBio.trim() || undefined,
        birth_date: editBirthDate || undefined,
        death_date: editDeathDate || undefined,
      });
      setMembers(prev => prev.map(m => m.id === editing.id ? { ...m, ...updated } : m));
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md p-6 rounded-2xl space-y-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-1">Edit Family Member</h3>
            <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full name *"
              className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }} disabled={saving} />
            <input value={editRelation} onChange={e => setEditRelation(e.target.value)} placeholder="Relationship *"
              className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }} disabled={saving} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Birth Date</label>
                <input type="date" value={editBirthDate} onChange={e => setEditBirthDate(e.target.value)}
                  className="w-full p-3 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#0a0a0f', border: `1px solid ${BORDER}`, colorScheme: 'dark' }} disabled={saving} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Death Date</label>
                <input type="date" value={editDeathDate} onChange={e => setEditDeathDate(e.target.value)}
                  className="w-full p-3 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#0a0a0f', border: `1px solid ${BORDER}`, colorScheme: 'dark' }} disabled={saving} />
              </div>
            </div>
            <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Short biography"
              className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
              style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }} rows={3} disabled={saving} />
            <div className="flex items-center gap-3 pt-1">
              <button onClick={saveEdit} disabled={saving || !editName.trim() || !editRelation.trim()}
                className="px-5 py-2 rounded-full text-sm font-bold text-white transition disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(null)} disabled={saving}
                className="px-4 py-2 rounded-full text-sm text-gray-400 hover:text-white transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm text-red-300 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.08)' }}>
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-300">&times;</button>
        </div>
      )}

      {showAdd && (
        <div className="p-5 rounded-xl space-y-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Full name *"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
            disabled={submitting}
          />
          <input
            value={newRelation}
            onChange={e => setNewRelation(e.target.value)}
            placeholder="Relationship (e.g., Grandfather, Mother, Son) *"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
            disabled={submitting}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Birth Date</label>
              <input
                type="date"
                value={newBirthDate}
                onChange={e => setNewBirthDate(e.target.value)}
                className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                style={{ background: '#0a0a0f', border: `1px solid ${BORDER}`, colorScheme: 'dark' }}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Death Date</label>
              <input
                type="date"
                value={newDeathDate}
                onChange={e => setNewDeathDate(e.target.value)}
                className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                style={{ background: '#0a0a0f', border: `1px solid ${BORDER}`, colorScheme: 'dark' }}
                disabled={submitting}
              />
            </div>
          </div>
          <textarea
            value={newBio}
            onChange={e => setNewBio(e.target.value)}
            placeholder="Short biography (optional)"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
            rows={3}
            disabled={submitting}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={addMember}
              disabled={submitting || !newName.trim() || !newRelation.trim()}
              className="px-5 py-2 rounded-full text-sm font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
            >
              {submitting ? 'Saving...' : 'Save Member'}
            </button>
            <button
              onClick={() => { setShowAdd(false); setError(null); }}
              className="px-4 py-2 rounded-full text-sm text-gray-400 hover:text-white transition"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
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
            <div key={m.id} className="p-5 rounded-xl group relative cursor-pointer transition hover:border-purple-500/40" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              onClick={() => startEdit(m)}>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={e => { e.stopPropagation(); startEdit(m); }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-gray-500 hover:text-purple-400 hover:bg-purple-400/10"
                  title="Edit"
                >
                  {'\u{270F}\u{FE0F}'}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); removeMember(m.id); }}
                  disabled={deletingId === m.id}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-gray-600 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50"
                  title="Remove"
                >
                  {deletingId === m.id ? (
                    <span className="w-3 h-3 rounded-full border border-gray-500 border-t-transparent animate-spin inline-block" />
                  ) : (
                    <span>&times;</span>
                  )}
                </button>
              </div>
              <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-xl" style={{ background: '#1e1e2e', border: `2px solid ${BORDER}` }}>
                {'\u{1F464}'}
              </div>
              <div className="text-base font-bold text-white">{m.name}</div>
              <div className="text-xs mb-2" style={{ color: ACCENT }}>{m.relationship}</div>
              {m.bio && <div className="text-xs text-gray-400 line-clamp-2">{m.bio}</div>}
              {(m.birth_date || m.death_date) && (
                <div className="mt-2 pt-2 text-[10px] text-gray-600" style={{ borderTop: `1px solid ${BORDER}` }}>
                  {m.birth_date && <span>Born: {m.birth_date}</span>}
                  {m.birth_date && m.death_date && <span className="mx-1">&middot;</span>}
                  {m.death_date && <span>Passed: {m.death_date}</span>}
                </div>
              )}
              <button
                onClick={e => { e.stopPropagation(); inviteMember(m.id); }}
                className="mt-3 w-full py-1.5 rounded-full text-[11px] font-semibold transition hover:scale-[1.02]"
                style={{ border: `1px solid ${BORDER}`, color: invitedId === m.id ? '#4ade80' : '#d4b483' }}
                title="Copy a private link so they can listen to the preserved stories"
              >
                {invitedId === m.id ? 'Invite link copied' : 'Invite to listen'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
