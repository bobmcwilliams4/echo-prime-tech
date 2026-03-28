'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/blog'); }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Redirecting to Blog...</p>
    </div>
  );
}
