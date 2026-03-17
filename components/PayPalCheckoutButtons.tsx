'use client';

import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';

const PAYPAL_WORKER = 'https://echo-paypal.bmcii1976.workers.dev';

interface PayPalCheckoutButtonsProps {
  amount: number;
  currency?: string;
  description: string;
  invoiceNumber?: string;
  billingEmail?: string;
  onSuccess: (details: { order_id: string; capture_id?: string; payer?: string; status: string }) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  style?: 'vertical' | 'horizontal';
}

async function getFirebaseToken(): Promise<string | null> {
  try {
    const { auth } = await import('../lib/firebase');
    if (auth.currentUser) return await auth.currentUser.getIdToken();
  } catch {}
  return null;
}

export default function PayPalCheckoutButtons({
  amount,
  currency = 'USD',
  description,
  invoiceNumber,
  billingEmail,
  onSuccess,
  onError,
  onCancel,
  style = 'vertical',
}: PayPalCheckoutButtonsProps) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sdkError, setSdkError] = useState('');

  useEffect(() => {
    fetch(`${PAYPAL_WORKER}/config`)
      .then(r => r.json())
      .then((data: { client_id?: string; mode?: string }) => {
        if (data.client_id) {
          setClientId(data.client_id);
        } else {
          setSdkError('PayPal configuration unavailable');
        }
      })
      .catch(() => setSdkError('Failed to load PayPal configuration'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
        <span className="ml-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Loading PayPal...</span>
      </div>
    );
  }

  if (sdkError || !clientId) {
    return (
      <div className="p-4 rounded-lg text-sm text-center" style={{ backgroundColor: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}>
        {sdkError || 'PayPal is not configured.'}
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency,
        intent: 'capture',
        components: 'buttons',
        enableFunding: 'venmo,paylater',
      }}
    >
      <div className="space-y-3">
        {/* PayPal Button */}
        <PayPalButtons
          fundingSource={FUNDING.PAYPAL}
          style={{
            layout: style,
            shape: 'rect',
            label: 'pay',
            height: 48,
          }}
          createOrder={async () => {
            const token = await getFirebaseToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${PAYPAL_WORKER}/orders`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                amount,
                currency,
                description,
                invoice_number: invoiceNumber,
                return_url: `${window.location.origin}/checkout/success?method=paypal`,
                cancel_url: window.location.href,
              }),
            });

            const data = await res.json() as { order_id?: string; error?: string };
            if (!res.ok || !data.order_id) {
              throw new Error(data.error || 'Failed to create PayPal order');
            }
            return data.order_id;
          }}
          onApprove={async (data) => {
            const token = await getFirebaseToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${PAYPAL_WORKER}/orders/${data.orderID}/capture`, {
              method: 'POST',
              headers,
            });

            const result = await res.json() as {
              success?: boolean;
              order_id?: string;
              capture_id?: string;
              payer?: string;
              status?: string;
              error?: string;
            };

            if (!res.ok || !result.success) {
              onError(result.error || 'Payment capture failed');
              return;
            }

            onSuccess({
              order_id: result.order_id || data.orderID,
              capture_id: result.capture_id,
              payer: result.payer,
              status: result.status || 'COMPLETED',
            });
          }}
          onCancel={() => onCancel?.()}
          onError={(err) => {
            onError(typeof err === 'string' ? err : 'PayPal payment failed. Please try again.');
          }}
        />

        {/* Venmo Button */}
        <PayPalButtons
          fundingSource={FUNDING.VENMO}
          style={{
            layout: style,
            shape: 'rect',
            label: 'pay' as const,
            height: 48,
          }}
          createOrder={async () => {
            const token = await getFirebaseToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${PAYPAL_WORKER}/orders`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ amount, currency, description }),
            });
            const data = await res.json() as { order_id?: string; error?: string };
            if (!res.ok || !data.order_id) throw new Error(data.error || 'Failed to create order');
            return data.order_id;
          }}
          onApprove={async (data) => {
            const token = await getFirebaseToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${PAYPAL_WORKER}/orders/${data.orderID}/capture`, { method: 'POST', headers });
            const result = await res.json() as { success?: boolean; order_id?: string; capture_id?: string; payer?: string; status?: string; error?: string };
            if (!res.ok || !result.success) { onError(result.error || 'Capture failed'); return; }
            onSuccess({ order_id: result.order_id || data.orderID, capture_id: result.capture_id, payer: result.payer, status: result.status || 'COMPLETED' });
          }}
          onCancel={() => onCancel?.()}
          onError={() => onError('Venmo payment failed.')}
        />

        {/* Pay Later Button */}
        <PayPalButtons
          fundingSource={FUNDING.PAYLATER}
          style={{
            layout: style,
            shape: 'rect',
            label: 'pay',
            height: 48,
          }}
          createOrder={async () => {
            const token = await getFirebaseToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${PAYPAL_WORKER}/orders`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ amount, currency, description }),
            });
            const data = await res.json() as { order_id?: string; error?: string };
            if (!res.ok || !data.order_id) throw new Error(data.error || 'Failed to create order');
            return data.order_id;
          }}
          onApprove={async (data) => {
            const token = await getFirebaseToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${PAYPAL_WORKER}/orders/${data.orderID}/capture`, { method: 'POST', headers });
            const result = await res.json() as { success?: boolean; order_id?: string; capture_id?: string; payer?: string; status?: string; error?: string };
            if (!res.ok || !result.success) { onError(result.error || 'Capture failed'); return; }
            onSuccess({ order_id: result.order_id || data.orderID, capture_id: result.capture_id, payer: result.payer, status: result.status || 'COMPLETED' });
          }}
          onCancel={() => onCancel?.()}
          onError={() => onError('Pay Later failed.')}
        />

        <p className="text-[10px] text-center mt-2" style={{ color: 'var(--ept-text-muted)' }}>
          Secure payment via PayPal. Pay with your PayPal balance, Venmo, credit/debit card, or Pay Later.
        </p>
      </div>
    </PayPalScriptProvider>
  );
}
