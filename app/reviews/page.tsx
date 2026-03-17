'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { getPublicReviews, submitPublicReview, type Review } from '../../lib/business-api';

export default function ReviewsPage() {
  const { isDark } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      const data = await getPublicReviews();
      setReviews(data.reviews || []);
    } catch {
      setError('Unable to load reviews right now.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    try {
      setSubmitting(true);
      setSubmitError('');
      await submitPublicReview({
        reviewer_name: name.trim(),
        rating,
        text: text.trim(),
        service_type: serviceType.trim() || undefined,
      });
      setSubmitted(true);
      setName('');
      setRating(5);
      setText('');
      setServiceType('');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            Customer Reviews
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            See what our customers are saying about Echo Prime Technologies. Real feedback from real clients.
          </p>
        </div>

        {/* Summary Stats */}
        {reviews.length > 0 && (
          <div className="p-6 rounded-xl border mb-10 flex flex-col md:flex-row items-center gap-8" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            {/* Average */}
            <div className="text-center md:border-r md:pr-8" style={{ borderColor: 'var(--ept-border)' }}>
              <div className="text-5xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{avgRating.toFixed(1)}</div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ color: s <= Math.round(avgRating) ? '#eab308' : 'var(--ept-text-muted)', fontSize: '1.25rem' }}>&#9733;</span>
                ))}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
            {/* Breakdown */}
            <div className="flex-1 w-full space-y-1.5">
              {ratingCounts.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-right font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{star}</span>
                  <span style={{ color: '#eab308', fontSize: '0.75rem' }}>&#9733;</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#eab308' }} />
                  </div>
                  <span className="w-8 text-right" style={{ color: 'var(--ept-text-muted)' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write a Review CTA */}
        <div className="text-center mb-10">
          <button
            onClick={() => { setShowForm(true); setSubmitted(false); }}
            className="px-6 py-3 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Write a Review
          </button>
        </div>

        {/* Review Submission Form */}
        {showForm && (
          <div className="p-6 rounded-xl border mb-10" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3" style={{ color: '#22c55e' }}>&#10003;</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>Thank you for your review!</h3>
                <p style={{ color: 'var(--ept-text-secondary)' }}>Your review has been submitted and will appear after approval.</p>
                <button onClick={() => setShowForm(false)} className="mt-4 px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--ept-text)' }}>Leave a Review</h3>

                {submitError && (
                  <div className="p-3 rounded-lg mb-4 border text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Your Name *</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      maxLength={100}
                      placeholder="John Smith"
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Service Received</label>
                    <input
                      value={serviceType}
                      onChange={e => setServiceType(e.target.value)}
                      maxLength={100}
                      placeholder="e.g. AI Engine Integration, Tax Prep"
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ept-text-muted)' }}>Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        style={{
                          color: star <= (hoverRating || rating) ? '#eab308' : 'var(--ept-text-muted)',
                          fontSize: '2rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0 2px',
                          lineHeight: 1,
                        }}
                      >
                        &#9733;
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Your Review *</label>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required
                    maxLength={2000}
                    rows={4}
                    placeholder="Tell us about your experience..."
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                  <div className="text-xs mt-1 text-right" style={{ color: 'var(--ept-text-muted)' }}>{text.length}/2000</div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Cancel</button>
                  <button type="submit" disabled={submitting || !name.trim() || !text.trim()} className="px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div className="text-center py-16" style={{ color: 'var(--ept-text-muted)' }}>{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-2" style={{ color: 'var(--ept-text-secondary)' }}>No reviews yet.</p>
            <p style={{ color: 'var(--ept-text-muted)' }}>Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{review.reviewer_name}</span>
                      {review.featured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
                          Featured
                        </span>
                      )}
                    </div>
                    {review.service_type && (
                      <div className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{review.service_type}</div>
                    )}
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} style={{ color: s <= review.rating ? '#eab308' : 'var(--ept-text-muted)', fontSize: '0.875rem' }}>&#9733;</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{review.text}</p>
                {review.date && (
                  <div className="text-xs mt-3" style={{ color: 'var(--ept-text-muted)' }}>
                    {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t px-6 py-8 mt-16" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</div>
          <div className="flex gap-4 text-sm">
            <Link href="/about" style={{ color: 'var(--ept-text-secondary)' }}>About</Link>
            <Link href="/legal/privacy" style={{ color: 'var(--ept-text-secondary)' }}>Privacy</Link>
            <Link href="/legal/terms" style={{ color: 'var(--ept-text-secondary)' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
