'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InvoiceRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/invoicing'); }, [router]);
  return <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Redirecting to Invoicing...</p></div>;
}
