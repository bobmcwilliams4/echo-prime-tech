'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import {
  getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, restockItem,
  type InventoryItem,
} from '../../../../lib/business-api';
import { formatCurrency } from '../../../../lib/business-utils';
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, RefreshCw, X } from 'lucide-react';

const CATEGORIES = ['all', 'hardware', 'software', 'networking', 'peripherals', 'cables', 'office', 'other'] as const;

const EMPTY_ITEM: Partial<InventoryItem> = {
  name: '', category: 'hardware', unit: 'each', quantity: 0,
  reorder_level: 5, unit_cost: 0, vendor: '', notes: '',
};

export default function InventoryPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<InventoryItem>>(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState(0);
  const [restockCost, setRestockCost] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const res = await getInventory(categoryFilter !== 'all' ? categoryFilter : undefined);
      setItems(res.items || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    } finally {
      setLoadingData(false);
    }
  }, [categoryFilter]);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (editId) {
        await updateInventoryItem(editId, form);
      } else {
        await createInventoryItem(form);
      }
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY_ITEM);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditId(item.id);
    setForm({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryItem(id);
      setDeleteConfirm(null);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleRestock = async () => {
    if (!restockId || restockQty <= 0) return;
    try {
      setSaving(true);
      setError('');
      await restockItem(restockId, { quantity: restockQty, cost_per_unit: restockCost });
      setRestockId(null);
      setRestockQty(0);
      setRestockCost(0);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Restock failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setEditId(null);
    setForm(EMPTY_ITEM);
    setShowModal(true);
  };

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const lowStockCount = items.filter(i => i.quantity <= i.reorder_level).length;
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unit_cost, 0);

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--ept-text)' }}>
            <Package className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} />
            Inventory
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            {items.length} items &middot; {formatCurrency(totalValue)} total value
            {lowStockCount > 0 && (
              <span style={{ color: '#ef4444' }}> &middot; <AlertTriangle className="w-3 h-3 inline" /> {lowStockCount} low stock</span>
            )}
          </p>
        </div>
        <button onClick={handleAdd} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-sm underline">dismiss</button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${
              categoryFilter === c ? 'btn-glow' : 'btn-outline'
            }`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No inventory items found.</p>
            <button onClick={handleAdd} className="underline mt-1 text-sm" style={{ color: 'var(--ept-accent)' }}>Add one</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-left hidden md:table-cell">Category</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center hidden md:table-cell">Reorder At</th>
                  <th className="text-right hidden lg:table-cell">Unit Cost</th>
                  <th className="text-right hidden lg:table-cell">Value</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const isLow = item.quantity <= item.reorder_level;
                  return (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--ept-text)' }}>
                        <div className="font-medium">{item.name}</div>
                        {item.vendor && <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{item.vendor}</div>}
                      </td>
                      <td className="hidden md:table-cell">
                        <span className="badge badge-info">{item.category}</span>
                      </td>
                      <td className="text-center">
                        <span className="font-semibold" style={{ color: isLow ? '#ef4444' : 'var(--ept-text)' }}>
                          {item.quantity}
                        </span>
                        <span className="text-xs ml-1" style={{ color: 'var(--ept-text-muted)' }}>{item.unit}</span>
                        {isLow && (
                          <div className="text-xs font-medium flex items-center justify-center gap-1" style={{ color: '#ef4444' }}>
                            <AlertTriangle className="w-3 h-3" /> LOW
                          </div>
                        )}
                      </td>
                      <td className="text-center hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{item.reorder_level}</td>
                      <td className="text-right hidden lg:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatCurrency(item.unit_cost)}</td>
                      <td className="text-right hidden lg:table-cell font-medium" style={{ color: 'var(--ept-text)' }}>{formatCurrency(item.quantity * item.unit_cost)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setRestockId(item.id); setRestockQty(0); setRestockCost(item.unit_cost); }}
                            className="p-1.5 rounded-md hover:opacity-80 transition-opacity"
                            title="Restock"
                            style={{ color: '#22c55e' }}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-md hover:opacity-80 transition-opacity"
                            title="Edit"
                            style={{ color: 'var(--ept-accent)' }}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-1.5 rounded-md hover:opacity-80 transition-opacity"
                            title="Delete"
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setDeleteConfirm(null)}>
          <div className="glass-card w-full max-w-sm mx-4 p-6 rounded-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                <Trash2 className="w-5 h-5" style={{ color: '#ef4444' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Delete Item?</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setRestockId(null)}>
          <div className="glass-card w-full max-w-sm mx-4 p-6 rounded-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                <RefreshCw className="w-5 h-5" style={{ color: '#22c55e' }} /> Restock Item
              </h3>
              <button onClick={() => setRestockId(null)} className="p-1 rounded hover:opacity-70">
                <X className="w-4 h-4" style={{ color: 'var(--ept-text-muted)' }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Quantity to Add *</label>
                <input type="number" min="1" value={restockQty || ''} onChange={e => setRestockQty(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Cost Per Unit</label>
                <input type="number" step="0.01" value={restockCost || ''} onChange={e => setRestockCost(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              {restockQty > 0 && restockCost > 0 && (
                <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                  Total restock cost: <span className="font-medium" style={{ color: 'var(--ept-text)' }}>{formatCurrency(restockQty * restockCost)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setRestockId(null)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleRestock} disabled={saving || restockQty <= 0} className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: '#22c55e', color: '#fff' }}>
                {saving ? 'Restocking...' : 'Restock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-lg mx-4 p-6 rounded-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                {editId ? <Edit className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} /> : <Plus className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} />}
                {editId ? 'Edit Item' : 'Add Item'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:opacity-70">
                <X className="w-4 h-4" style={{ color: 'var(--ept-text-muted)' }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Name *</label>
                <input value={form.name || ''} onChange={e => updateForm('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Category</label>
                  <select value={form.category || 'hardware'} onChange={e => updateForm('category', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    {CATEGORIES.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Unit</label>
                  <select value={form.unit || 'each'} onChange={e => updateForm('unit', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    <option value="each">Each</option>
                    <option value="box">Box</option>
                    <option value="case">Case</option>
                    <option value="gallon">Gallon</option>
                    <option value="liter">Liter</option>
                    <option value="roll">Roll</option>
                    <option value="pack">Pack</option>
                    <option value="pair">Pair</option>
                    <option value="license">License</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Quantity</label>
                  <input type="number" min="0" value={form.quantity || 0} onChange={e => updateForm('quantity', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Reorder Level</label>
                  <input type="number" min="0" value={form.reorder_level || 0} onChange={e => updateForm('reorder_level', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Unit Cost</label>
                  <input type="number" step="0.01" value={form.unit_cost || ''} onChange={e => updateForm('unit_cost', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Vendor</label>
                <input value={form.vendor || ''} onChange={e => updateForm('vendor', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
                <textarea value={form.notes || ''} onChange={e => updateForm('notes', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
