'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import {
  getQuotes, createQuote, sendQuote, approveQuote, convertQuoteToInvoice,
  deleteQuote, getCustomers,
  type Quote, type Customer,
} from '../../../../lib/business-api';
import {
  formatCurrency, formatDate, getStatusBadge, generateQuoteNumber,
  SERVICE_CATALOG, SERVICE_CATEGORIES, type ServiceCatalogItem,
} from '../../../../lib/business-utils';
import {
  Plus, Send, Check, FileText, X, Sparkles, ChevronDown,
  Search, AlertTriangle, ArrowLeft, ClipboardList, Trash2, ArrowRight, Eye,
} from 'lucide-react';

const STATUSES = ['all', 'draft', 'sent', 'approved', 'rejected', 'expired', 'converted'] as const;
const VALIDITY_PERIODS = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
  { label: '90 days', days: 90 },
];

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

function getValidUntil(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function QuotesPage() {
  const { user, loading } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [saving, setSaving] = useState(false);
  const [detailQuote, setDetailQuote] = useState<Quote | null>(null);

  // Create form
  const [formCustomer, setFormCustomer] = useState('');
  const [formValidity, setFormValidity] = useState(30);
  const [formTaxRate, setFormTaxRate] = useState(8.25);
  const [formDiscount, setFormDiscount] = useState(0);
  const [formNotes, setFormNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [quoteNum] = useState(generateQuoteNumber);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('');

  // Ask Claude
  const [claudeQuery, setClaudeQuery] = useState('');
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [claudeResult, setClaudeResult] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [qRes, cRes] = await Promise.all([
        getQuotes(statusFilter !== 'all' ? statusFilter : undefined),
        getCustomers(),
      ]);
      setQuotes(qRes.quotes || []);
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
    setFormValidity(30);
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
      await createQuote({
        customer_id: formCustomer,
        issue_date: today,
        valid_until: getValidUntil(formValidity),
        subtotal,
        tax_rate: formTaxRate,
        tax_amount: taxAmount,
        discount: formDiscount,
        total,
        notes: formNotes,
        items: lineItems.filter(li => li.description && li.quantity > 0).map(li => ({
          id: '', quote_id: '', description: li.description, quantity: li.quantity, unit_price: li.unit_price, total: li.quantity * li.unit_price,
        })),
      });
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
    try { await sendQuote(id); loadData(); setDetailQuote(null); setView('list'); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Send failed'); }
  };

  const handleApprove = async (id: string) => {
    try { await approveQuote(id); loadData(); setDetailQuote(null); setView('list'); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Approve failed'); }
  };

  const handleConvert = async (id: string) => {
    try { await convertQuoteToInvoice(id); loadData(); setDetailQuote(null); setView('list'); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Convert failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteQuote(id); loadData(); setDetailQuote(null); setView('list'); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Delete failed'); }
  };

  const handleAskClaude = async () => {
    if (!claudeQuery.trim()) return;
    setClaudeLoading(true);
    setClaudeResult('');
    try {
      const resp = await fetch('https://echo-chat.bmcii1976.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: 'echo-ept',
          personality: 'nexus',
          user_id: 'commander',
          session_id: 'quote-ai-' + Date.now(),
          message: `You are a quote/estimate generator for Echo Prime Technologies. The Commander describes a prospective project. Analyze the description and generate DETAILED line items for a quote/estimate.

SERVICE CATALOG (use these prices as baseline, adjust based on complexity):
${SERVICE_CATALOG.map(s => `- ${s.name}: $${s.basePrice} (${s.category})`).join('\n')}

For each line item, output EXACTLY this JSON format (array):
[{"description": "Feature name — detailed description of what will be built", "quantity": 1, "unit_price": 2500}]

Only output the JSON array, nothing else. Be thorough — list every feature, integration, and component separately. Use realistic prices based on the catalog above.

PROJECT DESCRIPTION: ${claudeQuery}`,
        }),
      });
      const data = await resp.json();
      const content = data.reply || data.response || '';
      setClaudeResult(content);
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

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  // ── CREATE VIEW ──
  if (view === 'create') {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { resetForm(); setView('list'); }} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Quotes
          </button>
          <button
            onClick={handleCreate}
            disabled={saving || !formCustomer || lineItems.length === 0}
            className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            {saving ? 'Creating...' : 'Create Quote'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg border flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <AlertTriangle className="w-4 h-4 shrink-0" />{error}
            <button onClick={() => setError('')} className="ml-auto text-xs underline">dismiss</button>
          </div>
        )}

        {/* Quote Details */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} />
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Quote Details</h3>
            <span className="text-xs font-mono ml-auto" style={{ color: 'var(--ept-accent)' }}>{quoteNum}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Customer *</label>
              <select value={formCustomer} onChange={e => setFormCustomer(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Valid For</label>
              <select value={formValidity} onChange={e => setFormValidity(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                {VALIDITY_PERIODS.map(p => <option key={p.days} value={p.days}>{p.label}</option>)}
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
            Describe the project scope and Claude will generate detailed estimate line items with pricing.
          </p>
          <div className="flex gap-2">
            <input
              value={claudeQuery}
              onChange={e => setClaudeQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskClaude()}
              placeholder='e.g. "Client wants a Next.js website with AI chatbot, 3 social media bots, and security audit"'
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

          {lineItems.length > 0 && (
            <div className="pt-3 space-y-1 text-sm" style={{ borderTop: '1px solid var(--ept-border)' }}>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Subtotal</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Tax ({formTaxRate}%)</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(taxAmount)}</span></div>
              {formDiscount > 0 && <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Discount</span><span style={{ color: 'var(--ept-success)' }}>-{formatCurrency(formDiscount)}</span></div>}
              <div className="flex justify-between font-bold text-base pt-1" style={{ borderTop: '1px solid var(--ept-border)' }}>
                <span style={{ color: 'var(--ept-text)' }}>Estimated Total</span>
                <span style={{ color: 'var(--ept-accent)' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="glass-card p-5">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes / Scope of Work</label>
          <textarea
            value={formNotes}
            onChange={e => setFormNotes(e.target.value)}
            rows={4}
            placeholder="Describe scope, assumptions, exclusions, timeline..."
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
        </div>
      </div>
    );
  }

  // ── DETAIL VIEW ──
  if (view === 'detail' && detailQuote) {
    const sc = getStatusBadge(detailQuote.status);
    const isExpired = detailQuote.valid_until && new Date(detailQuote.valid_until) < new Date();
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setDetailQuote(null); setView('list'); }} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Quotes
          </button>
          <div className="flex gap-2">
            {detailQuote.status === 'draft' && (
              <button onClick={() => handleSend(detailQuote.id)} className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                <Send className="w-4 h-4" /> Send to Client
              </button>
            )}
            {detailQuote.status === 'sent' && !isExpired && (
              <button onClick={() => handleApprove(detailQuote.id)} className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-success)', color: '#fff' }}>
                <Check className="w-4 h-4" /> Mark Approved
              </button>
            )}
            {detailQuote.status === 'approved' && (
              <button onClick={() => handleConvert(detailQuote.id)} className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                <ArrowRight className="w-4 h-4" /> Convert to Invoice
              </button>
            )}
            {['draft', 'rejected', 'expired'].includes(detailQuote.status) && (
              <button onClick={() => handleDelete(detailQuote.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--ept-danger)' }}>
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Quote {detailQuote.quote_number}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--ept-text-secondary)' }}>
                {detailQuote.customer_name || 'Unknown Customer'}
              </p>
            </div>
            <span className={sc.className}>{sc.label}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>Issue Date</div>
              <div style={{ color: 'var(--ept-text)' }}>{formatDate(detailQuote.issue_date)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>Valid Until</div>
              <div style={{ color: isExpired ? 'var(--ept-danger)' : 'var(--ept-text)' }}>
                {formatDate(detailQuote.valid_until)} {isExpired && '(Expired)'}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>Total</div>
              <div className="text-lg font-bold" style={{ color: 'var(--ept-accent)' }}>{formatCurrency(detailQuote.total)}</div>
            </div>
          </div>

          {detailQuote.items && detailQuote.items.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Rate</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {detailQuote.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--ept-text)' }}>{item.description}</td>
                    <td style={{ textAlign: 'center', color: 'var(--ept-text-secondary)' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', color: 'var(--ept-text-secondary)' }}>{formatCurrency(item.unit_price)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--ept-text)' }} className="font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-end mt-4">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Subtotal</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(detailQuote.subtotal)}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Tax ({detailQuote.tax_rate}%)</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(detailQuote.tax_amount)}</span></div>
              {detailQuote.discount > 0 && <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Discount</span><span style={{ color: 'var(--ept-success)' }}>-{formatCurrency(detailQuote.discount)}</span></div>}
              <div className="flex justify-between font-bold text-base pt-1" style={{ borderTop: '2px solid var(--ept-border)' }}>
                <span style={{ color: 'var(--ept-text)' }}>Total</span>
                <span style={{ color: 'var(--ept-accent)' }}>{formatCurrency(detailQuote.total)}</span>
              </div>
            </div>
          </div>

          {detailQuote.notes && (
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--ept-border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes / Scope</div>
              <div className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ept-text-secondary)' }}>{detailQuote.notes}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>Quotes & Estimates</h1>
        <button
          onClick={() => { resetForm(); setView('create'); }}
          className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          <Plus className="w-4 h-4" /> Create Quote
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
        ) : quotes.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>No quotes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quote #</th>
                  <th>Customer</th>
                  <th className="hidden md:table-cell">Date</th>
                  <th className="hidden lg:table-cell">Valid Until</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => {
                  const badge = getStatusBadge(q.status);
                  return (
                    <tr key={q.id} onClick={() => { setDetailQuote(q); setView('detail'); }} style={{ cursor: 'pointer' }}>
                      <td className="font-mono text-xs" style={{ color: 'var(--ept-accent)' }}>{q.quote_number}</td>
                      <td style={{ color: 'var(--ept-text)' }}>{q.customer_name || 'Unknown'}</td>
                      <td className="hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(q.issue_date)}</td>
                      <td className="hidden lg:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(q.valid_until)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--ept-text)' }} className="font-medium">{formatCurrency(q.total)}</td>
                      <td><span className={badge.className}>{badge.label}</span></td>
                      <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setDetailQuote(q); setView('detail'); }} title="View" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-text-muted)' }}><Eye className="w-4 h-4" /></button>
                          {q.status === 'draft' && <button onClick={() => handleSend(q.id)} title="Send" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-accent)' }}><Send className="w-4 h-4" /></button>}
                          {q.status === 'sent' && <button onClick={() => handleApprove(q.id)} title="Approve" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-success)' }}><Check className="w-4 h-4" /></button>}
                          {q.status === 'approved' && <button onClick={() => handleConvert(q.id)} title="Convert to Invoice" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-accent)' }}><ArrowRight className="w-4 h-4" /></button>}
                          {['draft', 'rejected', 'expired'].includes(q.status) && <button onClick={() => handleDelete(q.id)} title="Delete" className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ept-danger)' }}><Trash2 className="w-4 h-4" /></button>}
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
    </div>
  );
}
