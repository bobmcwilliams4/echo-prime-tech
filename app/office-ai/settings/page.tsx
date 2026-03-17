'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getSettings, updateSetting, type BusinessSettings } from '../../../lib/business-api';
import {
  Settings,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  Receipt,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const PAYMENT_METHODS = ['cash', 'check', 'card', 'zelle', 'venmo', 'paypal', 'ach'];

const DEFAULT_HOURS: Record<string, { open: string; close: string; closed: boolean }> = {};
DAYS.forEach(d => { DEFAULT_HOURS[d] = { open: '08:00', close: '17:00', closed: d === 'sunday' }; });

const DEFAULT_SETTINGS: BusinessSettings = {
  company_name: '', phone: '', email: '', address: '', tax_rate: 0, tax_id: '',
  payment_methods: ['cash', 'check', 'card'],
  business_hours: DEFAULT_HOURS,
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getSettings();
      setSettings({
        company_name: data.company_name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        tax_rate: data.tax_rate || 0,
        tax_id: data.tax_id || '',
        payment_methods: data.payment_methods || ['cash', 'check', 'card'],
        business_hours: data.business_hours || DEFAULT_HOURS,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { if (user) loadSettings(); }, [user, loadSettings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSaved(false);
      await Promise.all([
        updateSetting('company_name', settings.company_name),
        updateSetting('phone', settings.phone),
        updateSetting('email', settings.email),
        updateSetting('address', settings.address),
        updateSetting('tax_rate', settings.tax_rate),
        updateSetting('tax_id', settings.tax_id),
        updateSetting('payment_methods', settings.payment_methods),
        updateSetting('business_hours', settings.business_hours),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof BusinessSettings, value: unknown) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const togglePaymentMethod = (method: string) => {
    setSettings(prev => {
      const methods = prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method];
      return { ...prev, payment_methods: methods };
    });
  };

  const updateHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: { ...prev.business_hours[day], [field]: value },
      },
    }));
  };

  if (loadingData) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
        <Settings size={28} style={{ color: 'var(--ept-accent)' }} />
        Settings
      </h1>
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
          <Settings size={28} style={{ color: 'var(--ept-accent)' }} />
          Settings
        </h1>
        {saved && (
          <span className="text-sm font-medium flex items-center gap-1" style={{ color: '#22c55e' }}>
            <CheckCircle size={16} />
            Saved!
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <AlertCircle size={18} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="underline text-sm">dismiss</button>
        </div>
      )}

      {/* Company Info */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
          <Building2 size={16} style={{ color: 'var(--ept-accent)' }} />
          Company Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
              <Building2 size={12} />
              Company Name
            </label>
            <input value={settings.company_name} onChange={e => updateField('company_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
              <Phone size={12} />
              Phone
            </label>
            <input value={settings.phone} onChange={e => updateField('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
              <Mail size={12} />
              Email
            </label>
            <input type="email" value={settings.email} onChange={e => updateField('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
              <MapPin size={12} />
              Address
            </label>
            <input value={settings.address} onChange={e => updateField('address', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
              <Receipt size={12} />
              Tax Rate (%)
            </label>
            <input type="number" step="0.01" min="0" max="100" value={settings.tax_rate} onChange={e => updateField('tax_rate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
              <Receipt size={12} />
              Tax ID / EIN
            </label>
            <input value={settings.tax_id} onChange={e => updateField('tax_id', e.target.value)} placeholder="XX-XXXXXXX" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="glass-card p-5 space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
          <CreditCard size={16} style={{ color: 'var(--ept-accent)' }} />
          Accepted Payment Methods
        </h2>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map(method => {
            const active = settings.payment_methods.includes(method);
            return (
              <button
                key={method}
                onClick={() => togglePaymentMethod(method)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${active ? 'btn-glow' : 'btn-outline'}`}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Hours */}
      <div className="glass-card p-5 space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
          <Clock size={16} style={{ color: 'var(--ept-accent)' }} />
          Business Hours
        </h2>
        <div className="space-y-2">
          {DAYS.map(day => {
            const hours = settings.business_hours[day] || { open: '08:00', close: '17:00', closed: false };
            return (
              <div key={day} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium capitalize" style={{ color: 'var(--ept-text)' }}>{day}</div>
                <label className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={hours.closed}
                    onChange={e => updateHours(day, 'closed', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Closed</span>
                </label>
                {!hours.closed && (
                  <>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={e => updateHours(day, 'open', e.target.value)}
                      className="px-2 py-1.5 rounded-lg border text-sm"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                    <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={e => updateHours(day, 'close', e.target.value)}
                      className="px-2 py-1.5 rounded-lg border text-sm"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-glow flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
