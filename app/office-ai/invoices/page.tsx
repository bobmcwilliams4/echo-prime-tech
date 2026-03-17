'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import {
  getInvoices, createInvoice, sendInvoice, voidInvoice, createPayment,
  addInvoiceItem, getCustomers, getInvoice,
  type Invoice, type InvoiceItem, type Customer, type Payment,
} from '../../../lib/business-api';
import {
  formatCurrency, formatDate, getStatusBadge, generateInvoiceNumber,
  SERVICE_CATALOG, SERVICE_CATEGORIES, type ServiceCatalogItem,
} from '../../../lib/business-utils';
import InvoicePreview from '../../../components/business/InvoicePreview';
import {
  Plus, Send, Ban, CreditCard, Eye, Printer, X, Sparkles, ChevronDown,
  Search, AlertTriangle, FileText, ArrowLeft,
} from 'lucide-react';

const STATUSES = ['all', 'draft', 'sent', 'partial', 'paid', 'overdue', 'void'] as const;
const PAYMENT_METHODS = ['cash', 'check', 'card', 'debit', 'venmo', 'zelle', 'paypal', 'bank_transfer'];
const PAYMENT_TERMS = ['due_on_receipt', 'net_15', 'net_30', 'net_45', 'net_60'];

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

function getDueDate(terms: string): string {
  const now = new Date();
  const days = terms === 'due_on_receipt' ? 0 : parseInt(terms.replace('net_', '')) || 30;
  now.setDate(now.getDate() + days);
  return now.toISOString().split('T')[0];
}

export default function InvoicesPage() {
  const { user, loading } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [showPayment, setShowPayment] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);

  // Create form
  const [formCustomer, setFormCustomer] = useState('');
  const [formTerms, setFormTerms] = useState('net_30');
  const [formTaxRate, setFormTaxRate] = useState(8.25);
  const [formDiscount, setFormDiscount] = useState(0);
  const [formNotes, setFormNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [invoiceNum] = useState(generateInvoiceNumber);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('');

  // Ask Claude
  const [claudeQuery, setClaudeQuery] = useState('');
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [claudeResult, setClaudeResult] = useState('');

  // Payment form
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState('card');
  const [payRef, setPayRef] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [iRes, cRes] = await Promise.all([
        getInvoices(statusFilter !== 'all' ? statusFilter : undefined),
        getCustomers(),
      ]);
      setInvoices(iRes.invoices || []);
      setCustomers(cRes.customers || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    } finally {
      setLoadingData(false);
    }
  }, [statusFilter]);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const selectedCustomer = customers.find(c => c.id === formCustomer);
  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unit_price, 0);
  const taxAmount = subtotal * (formTaxRate / 100);
  const total = subtotal + taxAmount - formDiscount;
  const today = new Date().toISOString().split('T')[0];

  const addLine = () => setLineItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0 }]);
  const removeLine = (idx: number) => setLineItems(prev => prev.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map((li, i) => i === idx ? { ...li, [field]: value } : li));
  };

  const addFromCatalog = (item: ServiceCatalogItem) => {
    setLineItems(prev => [...prev, { description: item.name + ' — ' + item.description, quantity: 1, unit_price: item.basePrice }]);
    setCatalogOpen(false);
    setCatalogFilter('');
  };

  const filteredCatalog = SERVICE_CATALOG.filter(s => {
    if (catalogCategory && s.category !== catalogCategory) return false;
    if (catalogFilter) {
      const q = catalogFilter.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    }
    return true;
  });

  const resetForm = () => {
    setFormCustomer('');
    setFormTerms('net_30');
    setFormTaxRate(8.25);
    setFormDiscount(0);
    setFormNotes('');
    setLineItems([]);
    setClaudeQuery('');
    setClaudeResult('');
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      setError('');
      const inv = await createInvoice({
        customer_id: formCustomer,
        payment_terms: formTerms,
        tax_rate: formTaxRate,
        discount: formDiscount,
        notes: formNotes,
      });
      for (const li of lineItems) {
        if (li.description && li.quantity > 0) {
          await addInvoiceItem(inv.id, { description: li.description, quantity: li.quantity, unit_price: li.unit_price });
        }
      }
      resetForm();
      setView('list');
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (id: string) => {
    try { await sendInvoice(id); loadData(); setDetailInvoice(null); setView('list'); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Send failed'); }
  };

  const handleVoid = async (id: string) => {
    try { await voidInvoice(id); loadData(); setDetailInvoice(null); setView('list'); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Void failed'); }
  };

  const handleRecordPayment = async () => {
    if (!showPayment) return;
    try {
      setSaving(true);
      await createPayment({ invoice_id: showPayment.id, amount: payAmount, method: payMethod, reference: payRef, date: new Date().toISOString().split('T')[0] });
      setShowPayment(null);
      setPayAmount(0);
      setPayMethod('card');
      setPayRef('');
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetail = async (inv: Invoice) => {
    try {
      const detail = await getInvoice(inv.id);
      setDetailInvoice(detail);
    } catch {
      setDetailInvoice(inv);
    }
    setView('detail');
  };

  const handleAskClaude = async () => {
    if (!claudeQuery.trim()) return;
    setClaudeLoading(true);
    setClaudeResult('');
    try {
      // Use Echo Chat to analyze the project and generate line items
      const resp = await fetch('https://echo-chat.bmcii1976.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: 'echo-ept',
          personality: 'nexus',
          user_id: 'commander',
          session_id: 'invoice-ai-' + Date.now(),
          message: `You are an invoice line-item generator for Echo Prime Technologies. The Commander describes a project they built for a client. Analyze the description and generate DETAILED line items for an invoice.

SERVICE CATALOG (use these prices as baseline, adjust based on complexity):
${SERVICE_CATALOG.map(s => `- ${s.name}: $${s.basePrice} (${s.category})`).join('\n')}

For each line item, output EXACTLY this JSON format (array):
[{"description": "Feature name — detailed description of what was built", "quantity": 1, "unit_price": 2500}]

Only output the JSON array, nothing else. Be thorough — list every feature, integration, and component separately. Use realistic prices based on the catalog above. If features go beyond the catalog, price them based on complexity and industry standards.

PROJECT DESCRIPTION: ${claudeQuery}`,
        }),
      });
      const data = await resp.json();
      const content = data.reply || data.response || '';
      setClaudeResult(content);

      // Try to parse JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const items: LineItem[] = JSON.parse(jsonMatch[0]);
        if (Array.isArray(items) && items.length > 0) {
          setLineItems(prev => [...prev, ...items.map((it: LineItem) => ({
            description: it.description || '',
            quantity: it.quantity || 1,
            unit_price: it.unit_price || 0,
          }))]);
        }
      }
    } catch (e: unknown) {
      setClaudeResult('Error: ' + (e instanceof Error ? e.message : 'AI request failed'));
    } finally {
      setClaudeLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  // ── CREATE VIEW (side-by-side: form + live preview) ──
  if (view === 'create') {
    return (
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { resetForm(); setView('list'); }} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Invoices
          </button>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn-outline inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm no-print">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || !formCustomer || lineItems.length === 0}
              className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 no-print"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              {saving ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg border flex items-center gap-2 text-sm no-print" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <AlertTriangle className="w-4 h-4 shrink-0" />{error}
            <button onClick={() => setError('')} className="ml-auto text-xs underline">dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-4 no-print">
            {/* Customer & Terms */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Invoice Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Customer *</label>
                  <select value={formCustomer} onChange={e => setFormCustomer(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    <option value="">Select customer...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Payment Terms</label>
                  <select value={formTerms} onChange={e => setFormTerms(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Tax Rate (%)</label>
                  <input type="number" step="0.01" value={formTaxRate} onChange={e => setFormTaxRate(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Discount ($)</label>
                  <input type="number" step="0.01" value={formDiscount} onChange={e => setFormDiscount(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>
            </div>

            {/* Ask Claude AI */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Ask Claude</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(20,184,166,0.15)', color: 'var(--ept-accent)' }}>AI</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                Describe the project you built and Claude will generate detailed line items with pricing.
              </p>
              <div className="flex gap-2">
                <input
                  value={claudeQuery}
                  onChange={e => setClaudeQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskClaude()}
                  placeholder='e.g. "I built profinishusa.com — Next.js website with AI chatbot, Twilio phone integration, 3 social media bots"'
                  className="flex-1 px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                />
                <button
                  onClick={handleAskClaude}
                  disabled={claudeLoading || !claudeQuery.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 shrink-0"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  {claudeLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>
              </div>
              {claudeResult && (
                <div className="text-xs p-3 rounded-lg max-h-32 overflow-y-auto" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                  {claudeResult.startsWith('Error:') ? (
                    <span style={{ color: 'var(--ept-danger)' }}>{claudeResult}</span>
                  ) : (
                    <span>Line items added from AI analysis.</span>
                  )}
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Line Items</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setCatalogOpen(!catalogOpen)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border"
                      style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}
                    >
                      <FileText className="w-3 h-3" /> Service Catalog <ChevronDown className="w-3 h-3" />
                    </button>

                    {catalogOpen && (
                      <div className="absolute right-0 top-full mt-1 w-96 max-h-80 overflow-y-auto rounded-xl border shadow-xl z-30" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}>
                        <div className="sticky top-0 p-3 space-y-2" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5" style={{ color: 'var(--ept-text-muted)' }} />
                            <input
                              value={catalogFilter}
                              onChange={e => setCatalogFilter(e.target.value)}
                              placeholder="Search services..."
                              className="w-full pl-9 pr-3 py-2 rounded-lg border text-xs"
                              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-1 overflow-x-auto">
                            <button onClick={() => setCatalogCategory('')} className={`px-2 py-1 rounded text-xs whitespace-nowrap ${!catalogCategory ? 'font-semibold' : ''}`} style={{ color: !catalogCategory ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>All</button>
                            {SERVICE_CATEGORIES.map(cat => (
                              <button key={cat} onClick={() => setCatalogCategory(cat)} className={`px-2 py-1 rounded text-xs whitespace-nowrap ${catalogCategory === cat ? 'font-semibold' : ''}`} style={{ color: catalogCategory === cat ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>{cat}</button>
                            ))}
                          </div>
                        </div>
                        <div className="p-2">
                          {filteredCatalog.map((item, i) => (
                            <button
                              key={i}
                              onClick={() => addFromCatalog(item)}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs hover:opacity-80 transition-opacity"
                              style={{ color: 'var(--ept-text)' }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 mr-2">
                                  <div className="font-medium">{item.name}</div>
                                  <div style={{ color: 'var(--ept-text-muted)' }}>{item.description}</div>
                                </div>
                                <div className="font-semibold shrink-0" style={{ color: 'var(--ept-accent)' }}>{formatCurrency(item.basePrice)}</div>
                              </div>
                            </button>
                          ))}
                          {filteredCatalog.length === 0 && (
                            <div className="text-center py-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>No services match your search.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={addLine} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: 'var(--ept-accent)' }}>
                    <Plus className="w-3 h-3" /> Custom Item
                  </button>
                </div>
              </div>

              {lineItems.length === 0 ? (
                <div className="text-center py-6 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                  Add items from the Service Catalog, use Ask Claude, or add custom items.
                </div>
              ) : (
                <div className="space-y-2">
                  {lineItems.map((li, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <div className="flex-1">
                        <input
                          placeholder="Description"
                          value={li.description}
                          onChange={e => updateLine(idx, 'description', e.target.value)}
                          className="w-full px-2 py-1.5 rounded border text-sm bg-transparent"
                          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          min={1}
                          value={li.quantity}
                          onChange={e => updateLine(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-1.5 rounded border text-sm text-center bg-transparent"
                          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          step="0.01"
                          value={li.unit_price}
                          onChange={e => updateLine(idx, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 rounded border text-sm text-right bg-transparent"
                          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                        />
                      </div>
                      <div className="w-24 text-right text-sm font-medium py-1.5" style={{ color: 'var(--ept-text)' }}>
                        {formatCurrency(li.quantity * li.unit_price)}
                      </div>
                      <button onClick={() => removeLine(idx)} className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-danger)' }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals summary */}
              {lineItems.length > 0 && (
                <div className="pt-3 space-y-1 text-sm" style={{ borderTop: '1px solid var(--ept-border)' }}>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Subtotal</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Tax ({formTaxRate}%)</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(taxAmount)}</span></div>
                  {formDiscount > 0 && <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Discount</span><span style={{ color: 'var(--ept-success)' }}>-{formatCurrency(formDiscount)}</span></div>}
                  <div className="flex justify-between font-bold text-base pt-1" style={{ borderTop: '1px solid var(--ept-border)' }}>
                    <span style={{ color: 'var(--ept-text)' }}>Total</span>
                    <span style={{ color: 'var(--ept-accent)' }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="glass-card p-5">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
              <textarea
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                rows={3}
                placeholder="Additional notes for the client..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
              />
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="print-only-full">
            <div className="text-sm font-semibold mb-3 uppercase tracking-wider no-print" style={{ color: 'var(--ept-text-muted)' }}>
              Live Preview
            </div>
            <InvoicePreview
              invoiceNumber={invoiceNum}
              customerName={selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : ''}
              customerEmail={selectedCustomer?.email}
              customerPhone={selectedCustomer?.phone}
              customerAddress={selectedCustomer?.address}
              issueDate={today}
              dueDate={getDueDate(formTerms)}
              paymentTerms={formTerms}
              lineItems={lineItems}
              taxRate={formTaxRate}
              discount={formDiscount}
              notes={formNotes}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── DETAIL VIEW ──
  if (view === 'detail' && detailInvoice) {
    const sc = getStatusBadge(detailInvoice.status);
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between no-print">
          <button onClick={() => { setDetailInvoice(null); setView('list'); }} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Invoices
          </button>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn-outline inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm">
              <Printer className="w-4 h-4" /> Print
            </button>
            {detailInvoice.status === 'draft' && (
              <button onClick={() => handleSend(detailInvoice.id)} className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                <Send className="w-4 h-4" /> Send
              </button>
            )}
            {['sent', 'partial', 'overdue'].includes(detailInvoice.status) && (
              <button onClick={() => { setShowPayment(detailInvoice); setPayAmount(detailInvoice.total - detailInvoice.amount_paid); }} className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-success)', color: '#fff' }}>
                <CreditCard className="w-4 h-4" /> Record Payment
              </button>
            )}
            {detailInvoice.status !== 'void' && detailInvoice.status !== 'paid' && (
              <button onClick={() => handleVoid(detailInvoice.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--ept-danger)' }}>
                <Ban className="w-4 h-4" /> Void
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 no-print">
          <h1 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Invoice {detailInvoice.invoice_number}</h1>
          <span className={sc.className}>{sc.label}</span>
        </div>

        {/* Payment history */}
        {detailInvoice.payments && detailInvoice.payments.length > 0 && (
          <div className="glass-card p-5 no-print">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Payment History</h3>
            <div className="space-y-2">
              {detailInvoice.payments.map((p: Payment, i: number) => (
                <div key={i} className="flex justify-between text-sm py-1" style={{ borderBottom: '1px solid var(--ept-border)' }}>
                  <span style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(p.date)} — {p.method}{p.reference ? ` (${p.reference})` : ''}</span>
                  <span className="font-medium" style={{ color: 'var(--ept-success)' }}>{formatCurrency(p.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-1">
                <span style={{ color: 'var(--ept-text)' }}>Balance</span>
                <span style={{ color: detailInvoice.total - detailInvoice.amount_paid > 0 ? 'var(--ept-danger)' : 'var(--ept-success)' }}>
                  {formatCurrency(detailInvoice.total - detailInvoice.amount_paid)}
                </span>
              </div>
            </div>
          </div>
        )}

        <InvoicePreview
          invoiceNumber={detailInvoice.invoice_number}
          customerName={detailInvoice.customer_name || ''}
          issueDate={detailInvoice.issue_date}
          dueDate={detailInvoice.due_date}
          paymentTerms={detailInvoice.payment_terms}
          lineItems={(detailInvoice.items || []).map((it: InvoiceItem) => ({ description: it.description, quantity: it.quantity, unit_price: it.unit_price }))}
          taxRate={detailInvoice.tax_rate}
          discount={detailInvoice.discount}
          notes={detailInvoice.notes}
        />
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>Invoices</h1>
        <button
          onClick={() => { resetForm(); setView('create'); }}
          className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
          <button onClick={() => setError('')} className="ml-auto text-xs underline">dismiss</button>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STATUSES.map(s => {
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors" style={{
              backgroundColor: active ? 'var(--ept-accent)' : 'transparent',
              color: active ? '#fff' : 'var(--ept-text-secondary)',
              borderColor: active ? 'var(--ept-accent)' : 'var(--ept-border)',
            }}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} /></div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>No invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th className="hidden md:table-cell">Date</th>
                  <th className="hidden lg:table-cell">Due Date</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const badge = getStatusBadge(inv.status);
                  return (
                    <tr key={inv.id} onClick={() => handleViewDetail(inv)} style={{ cursor: 'pointer' }}>
                      <td className="font-mono text-xs" style={{ color: 'var(--ept-accent)' }}>{inv.invoice_number}</td>
                      <td style={{ color: 'var(--ept-text)' }}>{inv.customer_name || 'Unknown'}</td>
                      <td className="hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(inv.issue_date)}</td>
                      <td className="hidden lg:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(inv.due_date)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--ept-text)' }} className="font-medium">{formatCurrency(inv.total)}</td>
                      <td><span className={badge.className}>{badge.label}</span></td>
                      <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleViewDetail(inv)} title="View" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-text-muted)' }}><Eye className="w-4 h-4" /></button>
                          {inv.status === 'draft' && <button onClick={() => handleSend(inv.id)} title="Send" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-accent)' }}><Send className="w-4 h-4" /></button>}
                          {['sent', 'partial', 'overdue'].includes(inv.status) && <button onClick={() => { setShowPayment(inv); setPayAmount(inv.total - inv.amount_paid); }} title="Payment" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-success)' }}><CreditCard className="w-4 h-4" /></button>}
                          {inv.status !== 'void' && inv.status !== 'paid' && <button onClick={() => handleVoid(inv.id)} title="Void" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-danger)' }}><Ban className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowPayment(null)}>
          <div className="w-full max-w-sm mx-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--ept-text)' }}>Record Payment</h3>
            <div className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
              Invoice {showPayment.invoice_number} — Balance: {formatCurrency(showPayment.total - showPayment.amount_paid)}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Amount</label>
                <input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Method</label>
                <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Reference #</label>
                <input value={payRef} onChange={e => setPayRef(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowPayment(null)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleRecordPayment} disabled={saving || payAmount <= 0} className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: 'var(--ept-success)', color: '#fff' }}>
                {saving ? 'Saving...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
