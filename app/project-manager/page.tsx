'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectManagerRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/project-management'); }, [router]);
  return <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Redirecting to Project Management...</p></div>;
}
