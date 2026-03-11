'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="text-center max-w-md">
        <div className="text-6xl font-extrabold font-mono gradient-text mb-6">Error</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>
          Something went wrong
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--ept-text-muted)' }}>
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:opacity-90"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
