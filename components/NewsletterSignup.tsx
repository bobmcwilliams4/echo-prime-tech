'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/newsletter-api';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setError('Enter a valid email'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await subscribeToNewsletter(email);
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(res.error || 'Failed to subscribe');
      }
    } catch {
      setError('Network error — try again');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}>
        <div className="text-3xl mb-2">&#9993;</div>
        <p className="font-semibold text-lg" style={{ color: 'var(--ept-text)' }}>You&apos;re in!</p>
        <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
          We&apos;ll send AI insights, product updates, and industry intelligence to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>Get the Echo Intelligence Brief</p>
      <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
        Weekly AI insights, product launches, and automation strategies. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border text-sm"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          {loading ? 'Joining...' : 'Subscribe'}
        </button>
      </form>
      {error && <p className="text-sm mt-2" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}
