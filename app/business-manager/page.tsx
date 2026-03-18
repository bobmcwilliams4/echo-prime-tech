'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessManagerRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/office-ai');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Redirecting to Echo Office AI...</p>
    </div>
  );
}
