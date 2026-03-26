'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/appointments'); }, [router]);
  return <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Redirecting to Appointments...</p></div>;
}
