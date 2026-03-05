'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import {
  listInvoices,
  createInvoice,
  sendInvoice,
  remindInvoice,
  cancelInvoice,
  type PayPalInvoice,
} from '@/lib/paypal-api';

interface LineItem {
  name: string;
  quantity: number;
  unit_price: number;
  description?: string;
}

export default function InvoicesPage() {
  const { user, loading, role } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  const [invoices, setInvoices] = useState<PayPalInvoice[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create form state
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ name: '', quantity: 1, unit_price: 0 }]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && role !== 'owner') router.push('/');
  }, [user, loading, role, router]);

  useEffect(() => {
    if (!user || role !== 'owner') return;
    loadInvoices();
  }, [user, role, statusFilter]);

  async function loadInvoices() {
    setLoadingData(true);
    try {
      const data = await listInvoices(statusFilter || undefined, 50);
      setInvoices(data.invoices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoadingData(false);
    }
  }

  function addItem() {
    setItems([...items, { name: '', quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setItems(updated);
  }

  async function handleCreate() {
    if (!customerEmail || items.some(i => !i.name || i.unit_price <= 0)) {
      setError('Customer email and valid line items required');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const result = await createInvoice({
        customer_email: customerEmail,
        customer_name: customerName || undefined,
        items,
        note: note || undefined,
        due_date: dueDate || undefined,
        auto_send: true,
      });
      setSuccess(`Invoice ${result.invoice_id} created and sent — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.amount)}`);
      setShowCreate(false);
      setCustomerEmail('');
      setCustomerName('');
      setNote('');
      setDueDate('');
      setItems([{ name: '', quantity: 1, unit_price: 0 }]);
      loadInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setCreating(false);
    }
  }

  async function handleAction(id: string, action: 'send' | 'remind' | 'cancel') {
    try {
      if (action === 'send') await sendInvoice(id);
      else if (action === 'remind') await remindInvoice(id);
      else if (action === 'cancel') await cancelInvoice(id);
      setSuccess(`Invoice ${action} successful`);
      loadInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} invoice`);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const total = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const statusColor: Record<string, string> = {
    DRAFT: 'bg-gray-500/10 text-gray-400',
    SENT: 'bg-blue-500/10 text-blue-400',
    PAID: 'bg-green-500/10 text-green-400',
    CANCELLED: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={120} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          </Link>
          <span className="text-sm font-mono" style={{ color: 'var(--ept-text-muted)' }}>/admin/invoices</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>Admin</Link>
          <Link href="/admin/payments" className="text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--ept-accent)' }}>Payments</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Invoices</h1>
            <p className="mt-1" style={{ color: 'var(--ept-text-secondary)' }}>Create and manage PayPal invoices.</p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            {showCreate ? 'Cancel' : '+ New Invoice'}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-xl border mb-4" style={{ borderColor: '#ef4444', color: '#ef4444', backgroundColor: isDark ? '#1c1017' : '#fef2f2' }}>
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">x</button>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl border mb-4" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: isDark ? '#0a1f1f' : '#f0fdfa' }}>
            {success}
            <button onClick={() => setSuccess('')} className="float-right font-bold">x</button>
          </div>
        )}

        {/* Create Invoice Form */}
        {showCreate && (
          <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>New Invoice</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Customer Email *</label>
                <input
                  type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Customer Name</label>
                <input
                  type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Due Date</label>
                <input
                  type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Note</label>
                <input
                  type="text" value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Thank you for your business"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                />
              </div>
            </div>

            {/* Line Items */}
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Line Items</h3>
            <div className="space-y-2 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)}
                    placeholder="Item name" className="flex-1 px-3 py-2 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                  <input
                    type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                    min={1} className="w-20 px-3 py-2 rounded-lg border text-sm text-center"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>$</span>
                    <input
                      type="number" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)}
                      min={0} step={0.01} className="w-28 pl-7 pr-3 py-2 rounded-lg border text-sm"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                  <span className="text-sm w-20 text-right font-medium" style={{ color: 'var(--ept-text)' }}>{fmt(item.quantity * item.unit_price)}</span>
                  <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 text-sm px-2" title="Remove">x</button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={addItem} className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>+ Add Item</button>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Total: {fmt(total)}</span>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  {creating ? 'Creating...' : 'Create & Send Invoice'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 mb-4">
          {['', 'DRAFT', 'SENT', 'PAID', 'CANCELLED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: statusFilter === s ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: statusFilter === s ? '#fff' : 'var(--ept-text-secondary)',
              }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* Invoice List */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                {['Invoice', 'Customer', 'Amount', 'Status', 'Due', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--ept-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center" style={{ color: 'var(--ept-text-muted)' }}>Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center" style={{ color: 'var(--ept-text-muted)' }}>No invoices found</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--ept-text-secondary)' }}>{inv.paypal_id?.slice(0, 16) || `#${inv.id}`}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: 'var(--ept-text)' }}>{inv.customer_name || inv.customer_email}</p>
                    {inv.customer_name && <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{inv.customer_email}</p>}
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--ept-text)' }}>{fmt(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[inv.status] || 'bg-gray-500/10 text-gray-400'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--ept-text-muted)' }}>{inv.due_date || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--ept-text-muted)' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {inv.status === 'DRAFT' && inv.paypal_id && (
                        <button onClick={() => handleAction(inv.paypal_id, 'send')} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--ept-accent)' }}>Send</button>
                      )}
                      {inv.status === 'SENT' && inv.paypal_id && (
                        <button onClick={() => handleAction(inv.paypal_id, 'remind')} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--ept-accent)' }}>Remind</button>
                      )}
                      {['DRAFT', 'SENT'].includes(inv.status) && inv.paypal_id && (
                        <button onClick={() => handleAction(inv.paypal_id, 'cancel')} className="text-xs px-2 py-1 rounded text-red-400">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
