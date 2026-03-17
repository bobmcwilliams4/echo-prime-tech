'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../../lib/theme-context';

function SuccessContent() {
  const { isDark } = useTheme();
  const params = useSearchParams();
  const method = params.get('method') || 'stripe';
  const invoiceId = params.get('invoice_id');
  const orderId = params.get('order_id');
  const captureId = params.get('capture_id');
  const amount = params.get('amount');
  const status = params.get('status');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">
          {method === 'invoice' ? '\u{1F4E7}' : '\u{2705}'}
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
          {method === 'invoice' ? 'Invoice Sent' : 'Payment Successful'}
        </h1>

        <p className="text-sm mb-2" style={{ color: 'var(--ept-text-secondary)' }}>
          {method === 'invoice'
            ? 'A detailed invoice has been sent to your email via PayPal. Payment is due within 30 days.'
            : method === 'paypal'
              ? 'Your PayPal payment has been processed. Your subscription is now active.'
              : 'Your subscription is now active. You have full access to your selected services.'}
        </p>

        {invoiceId && (
          <p className="text-xs font-mono mb-4" style={{ color: 'var(--ept-text-muted)' }}>
            Invoice ID: {invoiceId}
          </p>
        )}

        {orderId && (
          <p className="text-xs font-mono mb-1" style={{ color: 'var(--ept-text-muted)' }}>
            Order: {orderId}{captureId ? ` | Capture: ${captureId}` : ''}{status ? ` | Status: ${status}` : ''}
          </p>
        )}

        {amount && (
          <div className="inline-block px-4 py-2 rounded-lg mb-6" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
            <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--ept-accent)' }}>${parseFloat(amount).toLocaleString()}</span>
            <span className="text-xs ml-1" style={{ color: 'var(--ept-text-muted)' }}>
              {method === 'invoice' ? 'invoiced' : 'charged'}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3 items-center">
          <Link href="/dashboard" className="px-8 py-3 rounded-lg font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Go to Dashboard
          </Link>
          <Link href="/sentinel" className="text-sm underline" style={{ color: 'var(--ept-accent)' }}>
            Open Sentinel AI
          </Link>
        </div>

        <div className="mt-10 p-4 rounded-lg text-xs" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
          <p className="font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Need help?</p>
          <p>Email <a href="mailto:customerservice@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>customerservice@echo-op.com</a> or <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>bob@echo-op.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
