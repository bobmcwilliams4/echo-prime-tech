'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/blog'); }, [router]);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <p>Redirecting...</p>
    </div>
  );
}
