'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { getEmployees, createEmployee, updateEmployee, type Employee } from '../../../../lib/business-api';
import { formatCurrency, formatDate, formatPhone } from '../../../../lib/business-utils';
import { Users, Plus, Search, Phone, Mail, Edit, UserCircle, X, Briefcase } from 'lucide-react';

const ROLE_BADGE_MAP: Record<string, string> = {
  admin: 'badge-purple',
  manager: 'badge-info',
  engineer: 'badge-success',
  technician: 'badge-success',
  support: 'badge-warning',
  sales: 'badge-warning',
  lead: 'badge-warning',
  worker: 'badge-success',
};

function getRoleBadge(role: string): string {
  return ROLE_BADGE_MAP[role] || 'badge-neutral';
}

const EMPTY_EMPLOYEE: Partial<Employee> = {
  first_name: '', last_name: '', email: '', phone: '', role: 'engineer',
  hourly_rate: 0, hire_date: new Date().toISOString().split('T')[0], status: 'active', notes: '',
};

export default function EmployeesPage() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Employee>>(EMPTY_EMPLOYEE);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadEmployees = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getEmployees();
      setEmployees(data.employees || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load employees');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { if (user) loadEmployees(); }, [user, loadEmployees]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (editId) {
        await updateEmployee(editId, form);
      } else {
        await createEmployee(form);
      }
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY_EMPLOYEE);
      loadEmployees();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditId(emp.id);
    setForm({ ...emp });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setForm(EMPTY_EMPLOYEE);
    setShowModal(true);
  };

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const filteredEmployees = employees.filter(emp => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      emp.first_name.toLowerCase().includes(term) ||
      emp.last_name.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.role.toLowerCase().includes(term)
    );
  });

  const activeCount = employees.filter(e => e.status === 'active').length;

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
            <Users className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} />
            Employees
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            {employees.length} total &middot; {activeCount} active
          </p>
        </div>
        <button onClick={handleAdd} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-sm underline">dismiss</button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ept-text-muted)' }} />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            <UserCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            {searchTerm ? (
              <p>No employees matching &quot;{searchTerm}&quot;.</p>
            ) : (
              <>
                <p>No employees found.</p>
                <button onClick={handleAdd} className="underline mt-1 text-sm" style={{ color: 'var(--ept-accent)' }}>Add one</button>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left hidden md:table-cell">Role</th>
                  <th className="text-left hidden md:table-cell">Status</th>
                  <th className="text-left hidden lg:table-cell">Contact</th>
                  <th className="text-left hidden lg:table-cell">Rate</th>
                  <th className="text-left hidden xl:table-cell">Hired</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => {
                  const badge = getRoleBadge(emp.role);
                  const statusBadge = emp.status === 'active' ? 'badge-success' : 'badge-neutral';
                  return (
                    <tr key={emp.id}>
                      <td style={{ color: 'var(--ept-text)' }}>
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--ept-text-muted)' }} />
                          <div>
                            <div className="font-medium">{emp.first_name} {emp.last_name}</div>
                            {emp.phone && (
                              <div className="text-xs flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                                <Phone className="w-3 h-3" /> {formatPhone(emp.phone)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell">
                        <span className={`badge ${badge}`}>{emp.role}</span>
                      </td>
                      <td className="hidden md:table-cell">
                        <span className={`badge ${statusBadge}`}>{emp.status}</span>
                      </td>
                      <td className="hidden lg:table-cell">
                        {emp.email && (
                          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                            <Mail className="w-3 h-3" /> {emp.email}
                          </div>
                        )}
                      </td>
                      <td className="hidden lg:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatCurrency(emp.hourly_rate)}/hr</td>
                      <td className="hidden xl:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(emp.hire_date)}</td>
                      <td className="text-right">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-1.5 rounded-md hover:opacity-80 transition-opacity"
                          title="Edit"
                          style={{ color: 'var(--ept-accent)' }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-lg mx-4 p-6 rounded-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                {editId ? <Edit className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} /> : <Plus className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} />}
                {editId ? 'Edit Employee' : 'Add Employee'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:opacity-70">
                <X className="w-4 h-4" style={{ color: 'var(--ept-text-muted)' }} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>First Name *</label>
                  <input value={form.first_name || ''} onChange={e => updateForm('first_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Last Name *</label>
                  <input value={form.last_name || ''} onChange={e => updateForm('last_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Email</label>
                  <input type="email" value={form.email || ''} onChange={e => updateForm('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Phone</label>
                  <input value={form.phone || ''} onChange={e => updateForm('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Role</label>
                  <select value={form.role || 'engineer'} onChange={e => updateForm('role', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="engineer">Engineer</option>
                    <option value="technician">Technician</option>
                    <option value="support">Support</option>
                    <option value="sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Hourly Rate ($)</label>
                  <input type="number" step="0.01" value={form.hourly_rate || 0} onChange={e => updateForm('hourly_rate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Hire Date</label>
                  <input type="date" value={form.hire_date || ''} onChange={e => updateForm('hire_date', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Status</label>
                  <select value={form.status || 'active'} onChange={e => updateForm('status', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
                <textarea value={form.notes || ''} onChange={e => updateForm('notes', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.first_name || !form.last_name} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
