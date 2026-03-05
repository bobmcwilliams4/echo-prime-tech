'use client';

import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, createCheckout, Service } from '../../lib/ept-api';
import { createOrder, createInvoice } from '../../lib/paypal-api';

// ── Tax rates by US state (simplified — major states) ──
const STATE_TAX_RATES: Record<string, number> = {
  TX: 0.0825, CA: 0.0725, NY: 0.08, FL: 0.06, IL: 0.0625,
  PA: 0.06, OH: 0.0575, GA: 0.04, NC: 0.0475, MI: 0.06,
  NJ: 0.06625, VA: 0.053, WA: 0.065, AZ: 0.056, MA: 0.0625,
  TN: 0.07, IN: 0.07, MO: 0.04225, MD: 0.06, WI: 0.05,
  CO: 0.029, MN: 0.06875, SC: 0.06, AL: 0.04, LA: 0.0445,
  KY: 0.06, OR: 0, MT: 0, NH: 0, DE: 0, AK: 0,
};

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

interface BillingInfo {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  taxId: string;
}

const inputStyle = {
  backgroundColor: 'var(--ept-surface)',
  border: '1px solid var(--ept-border)',
  color: 'var(--ept-text)',
  outline: 'none',
};

// ── Billing form extracted to prevent parent re-renders from stealing focus ──
function BillingForm({ billing, onChange }: { billing: BillingInfo; onChange: (field: keyof BillingInfo, value: string) => void }) {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)' }}>
      <h2 className="text-base font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Billing Information</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Company Name <span style={{ color: 'var(--ept-text-muted)' }}>(optional)</span></label>
          <input type="text" value={billing.companyName} onChange={e => onChange('companyName', e.target.value)} placeholder="Acme Corporation" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Contact Name *</label>
          <input type="text" value={billing.contactName} onChange={e => onChange('contactName', e.target.value)} placeholder="John Smith" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Email *</label>
          <input type="email" value={billing.email} onChange={e => onChange('email', e.target.value)} placeholder="billing@company.com" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Phone <span style={{ color: 'var(--ept-text-muted)' }}>(optional)</span></label>
          <input type="tel" value={billing.phone} onChange={e => onChange('phone', e.target.value)} placeholder="(432) 555-0100" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Tax ID / EIN <span style={{ color: 'var(--ept-text-muted)' }}>(optional)</span></label>
          <input type="text" value={billing.taxId} onChange={e => onChange('taxId', e.target.value)} placeholder="XX-XXXXXXX" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Address Line 1 *</label>
          <input type="text" value={billing.addressLine1} onChange={e => onChange('addressLine1', e.target.value)} placeholder="123 Main Street, Suite 400" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Address Line 2</label>
          <input type="text" value={billing.addressLine2} onChange={e => onChange('addressLine2', e.target.value)} placeholder="Building B" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>City *</label>
          <input type="text" value={billing.city} onChange={e => onChange('city', e.target.value)} placeholder="Midland" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>State *</label>
            <select value={billing.state} onChange={e => onChange('state', e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
              {US_STATES.map(s => <option key={s.code} value={s.code}>{s.code}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>ZIP *</label>
            <input type="text" value={billing.zip} onChange={e => onChange('zip', e.target.value)} placeholder="79701" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Param reader: isolated in Suspense so it doesn't re-mount the form ──
function ParamReader({ onParams }: { onParams: (serviceId: string, tier: string) => void }) {
  const params = useSearchParams();
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      onParams(params.get('service') || '', params.get('tier') || '');
    }
  }, [params, onParams]);
  return null;
}

function CheckoutContent({ initialServiceId, initialTier }: { initialServiceId: string; initialTier: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isDark } = useTheme();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [payMethod, setPayMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [invoiceNumber] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    return `EPT-${y}${m}-${seq}`;
  });

  const [billing, setBilling] = useState<BillingInfo>({
    companyName: '', contactName: '', email: '', phone: '',
    addressLine1: '', addressLine2: '', city: '', state: 'TX',
    zip: '', country: 'US', taxId: '',
  });

  // Load services once
  useEffect(() => {
    getServices()
      .then(d => setServices(d.services))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Pre-fill email from auth — only once
  const prefilled = useRef(false);
  useEffect(() => {
    if (!prefilled.current && user?.email) {
      prefilled.current = true;
      setBilling(b => ({ ...b, email: user.email!, contactName: user.displayName || b.contactName }));
    }
  }, [user]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/checkout?service=${encodeURIComponent(initialServiceId)}&tier=${encodeURIComponent(initialTier)}`);
    }
  }, [authLoading, user, router, initialServiceId, initialTier]);

  // Find selected service & tier — memoized by ID, not by object reference
  const selectedService = useMemo(
    () => services.find(s => s.id === initialServiceId) || null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [services.length, initialServiceId]
  );
  const selectedTier = useMemo(
    () => selectedService?.pricing.find(p => p.tier.toLowerCase() === initialTier.toLowerCase()) || null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedService?.id, initialTier]
  );

  // Calculate invoice — only recalculates when state (tax) changes, not on every keystroke
  const invoice = useMemo(() => {
    if (!selectedService || !selectedTier || selectedTier.price === null) return null;

    const subtotal = selectedTier.price;
    const taxRate = STATE_TAX_RATES[billing.state] || 0;
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    return {
      number: invoiceNumber,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [{
        description: `${selectedService.name} — ${selectedTier.tier} Plan`,
        interval: selectedTier.interval,
        quantity: 1,
        unitPrice: subtotal,
        total: subtotal,
      }],
      subtotal,
      taxRate,
      taxRateDisplay: `${(taxRate * 100).toFixed(2)}%`,
      taxAmount,
      total,
      stateName: US_STATES.find(s => s.code === billing.state)?.name || billing.state,
    };
  }, [selectedService?.id, selectedTier?.tier, billing.state, invoiceNumber]);

  const updateBilling = useCallback((field: keyof BillingInfo, value: string) => {
    setBilling(b => ({ ...b, [field]: value }));
  }, []);

  const validateBilling = (): string | null => {
    if (!billing.contactName.trim()) return 'Contact name is required';
    if (!billing.email.trim()) return 'Email is required';
    if (!billing.addressLine1.trim()) return 'Billing address is required';
    if (!billing.city.trim()) return 'City is required';
    if (!billing.state) return 'State is required';
    if (!billing.zip.trim()) return 'ZIP code is required';
    return null;
  };

  const handleCheckout = async () => {
    const validationError = validateBilling();
    if (validationError) { setError(validationError); return; }
    if (!invoice || !selectedService || !selectedTier) return;

    setError('');
    setProcessing(true);

    try {
      if (payMethod === 'stripe') {
        const { url } = await createCheckout(initialServiceId, selectedTier.tier.toLowerCase());
        window.location.href = url;
      } else {
        if (billing.companyName || billing.taxId) {
          const result = await createInvoice({
            customer_email: billing.email,
            customer_name: billing.companyName || billing.contactName,
            items: [{
              name: `${selectedService.name} — ${selectedTier.tier} Plan`,
              quantity: 1,
              unit_price: invoice.subtotal,
              description: `${selectedTier.interval === 'month' ? 'Monthly' : 'Annual'} subscription. ${selectedTier.features?.join(', ') || ''}`,
            },
            ...(invoice.taxAmount > 0 ? [{
              name: `Sales Tax (${invoice.taxRateDisplay} — ${invoice.stateName})`,
              quantity: 1,
              unit_price: invoice.taxAmount,
              description: 'Applicable state sales tax',
            }] : []),
            ],
            note: `Invoice for ${billing.companyName || billing.contactName}${billing.taxId ? ` | Tax ID: ${billing.taxId}` : ''}`,
            auto_send: true,
          });
          if (result.success) {
            router.push(`/checkout/success?method=invoice&invoice_id=${result.invoice_id}&amount=${invoice.total}`);
          }
        } else {
          const result = await createOrder({
            amount: invoice.total,
            currency: 'USD',
            description: `${selectedService.name} — ${selectedTier.tier} Plan`,
            return_url: `${window.location.origin}/checkout/success?method=paypal`,
            cancel_url: window.location.href,
          });
          if (result.approval_url) {
            window.location.href = result.approval_url;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!selectedService || !selectedTier) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        </nav>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>No plan selected</h1>
          <p className="mb-6" style={{ color: 'var(--ept-text-secondary)' }}>Select a plan from our pricing page to proceed.</p>
          <Link href="/pricing" className="px-6 py-3 rounded-lg font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>View Pricing</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <Link href="/pricing" className="hover:underline">Back to Pricing</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Checkout</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>
          Complete your purchase for {selectedService.name} — {selectedTier.tier}
        </p>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT: Billing Form (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Payment Method */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)' }}>
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {(['stripe', 'paypal'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => setPayMethod(method)}
                    className="p-4 rounded-lg border-2 text-center transition-all"
                    style={{
                      borderColor: payMethod === method ? 'var(--ept-accent)' : 'var(--ept-border)',
                      backgroundColor: payMethod === method ? (isDark ? '#0d737710' : '#0d737708') : 'transparent',
                    }}
                  >
                    <div className="text-lg font-bold mb-1" style={{ color: payMethod === method ? 'var(--ept-accent)' : 'var(--ept-text)' }}>
                      {method === 'stripe' ? 'Credit Card' : 'PayPal'}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      {method === 'stripe' ? 'Visa, Mastercard, Amex' : 'PayPal or Invoice'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <BillingForm billing={billing} onChange={updateBilling} />
          </div>

          {/* RIGHT: Invoice Preview (2 cols) */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 p-6 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold" style={{ color: 'var(--ept-text)' }}>Invoice Preview</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
                  {invoice?.number || '---'}
                </span>
              </div>

              <div className="text-xs mb-4 pb-4" style={{ borderBottom: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                <div className="font-bold" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies LLC</div>
                <div>Midland, TX 79701</div>
                <div>bob@echo-op.com</div>
                <div>EIN: Available on request</div>
              </div>

              <div className="text-xs mb-4 pb-4" style={{ borderBottom: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                <div className="font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Bill To:</div>
                <div style={{ color: 'var(--ept-text)' }}>{billing.companyName || billing.contactName || '\u2014'}</div>
                {billing.addressLine1 && <div>{billing.addressLine1}</div>}
                {(billing.city || billing.state) && <div>{billing.city}{billing.city && billing.state ? ', ' : ''}{billing.state} {billing.zip}</div>}
                {billing.email && <div>{billing.email}</div>}
                {billing.taxId && <div>Tax ID: {billing.taxId}</div>}
              </div>

              <div className="flex justify-between text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                <div>Date: {invoice?.date || '\u2014'}</div>
                <div>Due: {invoice?.dueDate || '\u2014'}</div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider pb-2 mb-2" style={{ borderBottom: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                {invoice?.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 text-xs" style={{ color: 'var(--ept-text)' }}>
                    <div>
                      <div className="font-medium">{item.description}</div>
                      <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
                        {item.quantity} x ${item.unitPrice.toLocaleString()} / {item.interval}
                      </div>
                    </div>
                    <span className="font-mono">${item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--ept-border)' }}>
                <div className="flex justify-between text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                  <span>Subtotal</span>
                  <span className="font-mono">${invoice?.subtotal.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                  <span>Sales Tax ({invoice?.taxRateDisplay || '0%'} — {invoice?.stateName || ''})</span>
                  <span className="font-mono">${invoice?.taxAmount.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2" style={{ borderTop: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>
                  <span>Total Due</span>
                  <span className="font-mono text-lg" style={{ color: 'var(--ept-accent)' }}>${invoice?.total.toLocaleString() || '0'}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}>
                  {error}
                </div>
              )}
              <button
                onClick={handleCheckout}
                disabled={processing || !invoice}
                className="w-full mt-6 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: processing ? 'wait' : 'pointer' }}
              >
                {processing
                  ? 'Processing...'
                  : payMethod === 'stripe'
                    ? `Pay $${invoice?.total.toLocaleString() || '0'} with Card`
                    : (billing.companyName || billing.taxId)
                      ? `Send Invoice \u2014 $${invoice?.total.toLocaleString() || '0'}`
                      : `Pay $${invoice?.total.toLocaleString() || '0'} with PayPal`
                }
              </button>

              <p className="text-[10px] mt-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>
                {payMethod === 'stripe' ? 'Secure payment via Stripe. Your card details are never stored on our servers.' : (billing.companyName || billing.taxId) ? 'A PayPal invoice will be sent to your email. Pay within 30 days.' : 'You will be redirected to PayPal to complete payment.'}
              </p>

              <div className="mt-4 pt-4 text-[10px] space-y-1" style={{ borderTop: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                <p>By completing this purchase, you agree to the Echo Prime Technologies <Link href="/legal/terms" className="underline" style={{ color: 'var(--ept-accent)' }}>Terms of Service</Link> and <Link href="/legal/privacy" className="underline" style={{ color: 'var(--ept-accent)' }}>Privacy Policy</Link>.</p>
                <p>Subscriptions renew automatically. Cancel anytime from your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [serviceId, setServiceId] = useState('');
  const [tier, setTier] = useState('');
  const [ready, setReady] = useState(false);

  const handleParams = useCallback((s: string, t: string) => {
    setServiceId(s);
    setTier(t);
    setReady(true);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ParamReader onParams={handleParams} />
      </Suspense>
      {ready ? (
        <CheckoutContent initialServiceId={serviceId} initialTier={tier} />
      ) : (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
        </div>
      )}
    </>
  );
}
