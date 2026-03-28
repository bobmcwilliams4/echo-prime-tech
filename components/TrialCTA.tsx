'use client';

import { useState } from 'react';
import { startTrial, type TrialResponse } from '@/lib/trial-api';

interface TrialCTAProps {
  serviceId: string;
  tier?: string;
  productName?: string;
}

export default function TrialCTA({ serviceId, tier = 'starter', productName }: TrialCTAProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrialResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setError('Please enter a valid email'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await startTrial({ email, service_id: serviceId, tier });
      setResult(res);
      if (!res.ok) setError(res.error || 'Failed to start trial');
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  if (result?.ok) {
    return (
      <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}>
        <div className="text-2xl mb-2">&#10003;</div>
        <p className="font-semibold text-lg" style={{ color: 'var(--ept-text)' }}>Trial started!</p>
        <p style={{ color: 'var(--ept-text-secondary)' }}>
          Check <strong>{email}</strong> for your welcome email.
          Your 14-day free trial of {productName || serviceId} is active.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>Start your 14-day free trial</p>
      <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>No credit card required. Full access to all features.</p>
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
          {loading ? 'Starting...' : 'Start Free Trial'}
        </button>
      </form>
      {error && <p className="text-sm mt-2" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}
