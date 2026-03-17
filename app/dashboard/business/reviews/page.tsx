'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { getReviews, createReview, approveReview, deleteReview, type Review } from '../../../../lib/business-api';
import { formatDate, getStatusBadge } from '../../../../lib/business-utils';
import {
  Star,
  Plus,
  MessageSquare,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
} from 'lucide-react';

const EMPTY_REVIEW: Partial<Review> = {
  reviewer_name: '', rating: 5, text: '', service_type: '', status: 'pending',
};

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Review>>(EMPTY_REVIEW);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getReviews(filter || undefined);
      setReviews(data.reviews || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reviews');
    } finally {
      setLoadingData(false);
    }
  }, [filter]);

  useEffect(() => { if (user) loadReviews(); }, [user, loadReviews]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await createReview(form);
      setShowModal(false);
      setForm(EMPTY_REVIEW);
      loadReviews();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setError('');
      await approveReview(id);
      loadReviews();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Approve failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      setDeleteConfirm(null);
      loadReviews();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleAdd = () => {
    setForm(EMPTY_REVIEW);
    setShowModal(true);
  };

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              size={interactive ? 22 : 14}
              fill={star <= rating ? '#eab308' : 'none'}
              stroke={star <= rating ? '#eab308' : 'var(--ept-text-muted)'}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>
          <MessageSquare size={28} className="inline-block mr-2 -mt-1" style={{ color: 'var(--ept-accent)' }} />
          Reviews
        </h1>
        <button onClick={handleAdd} className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} />
          Add Review
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <AlertCircle size={18} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="underline text-sm">dismiss</button>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={16} style={{ color: 'var(--ept-text-muted)' }} />
        {['', 'pending', 'approved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${filter === f ? 'btn-glow' : 'btn-outline'}`}
          >
            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {loadingData ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-card p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            <MessageSquare size={32} className="mx-auto mb-3 opacity-40" />
            No reviews found.{' '}
            <button onClick={handleAdd} className="underline" style={{ color: 'var(--ept-accent)' }}>Add one</button>
          </div>
        ) : (
          reviews.map(review => {
            const badge = getStatusBadge(review.status);
            return (
              <div key={review.id} className="glass-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{review.reviewer_name}</span>
                      {renderStars(review.rating)}
                      {review.featured && (
                        <span className="badge badge-warning flex items-center gap-1">
                          <Star size={10} fill="#eab308" stroke="#eab308" />
                          Featured
                        </span>
                      )}
                    </div>
                    {review.service_type && (
                      <div className="text-xs mb-2" style={{ color: 'var(--ept-text-muted)' }}>Service: {review.service_type}</div>
                    )}
                    <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{review.text}</p>
                    <div className="text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>{review.date ? formatDate(review.date) : ''}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={badge.className}>{badge.label}</span>
                    {review.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="btn-outline flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium"
                        style={{ color: '#22c55e', borderColor: 'rgba(34,197,94,0.3)' }}
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(review.id)}
                      className="btn-outline flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium"
                      style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setDeleteConfirm(null)}>
          <div className="glass-card w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-2">
              <Trash2 size={20} style={{ color: '#ef4444' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Delete Review?</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                <Plus size={20} style={{ color: 'var(--ept-accent)' }} />
                Add Review
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: 'var(--ept-text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Reviewer Name *</label>
                <input value={form.reviewer_name || ''} onChange={e => updateForm('reviewer_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ept-text-muted)' }}>Rating *</label>
                {renderStars(form.rating || 5, true, (r) => updateForm('rating', r))}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Service Type</label>
                <input value={form.service_type || ''} onChange={e => updateForm('service_type', e.target.value)} placeholder="e.g. Website Build, AI Chatbot, Security Audit" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Review Text *</label>
                <textarea value={form.text || ''} onChange={e => updateForm('text', e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.reviewer_name || !form.text} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
