'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { getSettings, updateSetting } from '../../../lib/business-api';
import {
  LayoutDashboard, FileText, ClipboardList, CalendarDays, Users,
  Receipt, BarChart3, ArrowLeftRight, CreditCard, Settings2,
  Clock, DollarSign, Package, Wrench, Star, Truck,
  Phone, Headphones, Calculator, Bot, Blocks, Save, CheckCircle, Handshake,
} from 'lucide-react';

/* ── Module Registry ── */

interface ModuleDef {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  section: string;
  alwaysOn?: boolean;
}

const MODULES: ModuleDef[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Business overview, KPIs, recent activity', icon: <LayoutDashboard className="w-5 h-5" />, section: 'Main', alwaysOn: true },
  { id: 'invoices', label: 'Invoices', description: 'Create, send, and track invoices', icon: <FileText className="w-5 h-5" />, section: 'Main' },
  { id: 'quotes', label: 'Quotes', description: 'Generate quotes and convert to invoices', icon: <ClipboardList className="w-5 h-5" />, section: 'Main' },
  { id: 'bookings', label: 'Bookings', description: 'Schedule and manage appointments', icon: <CalendarDays className="w-5 h-5" />, section: 'Main' },
  { id: 'customers', label: 'Customers', description: 'Customer CRM and contact management', icon: <Users className="w-5 h-5" />, section: 'Main' },
  { id: 'expenses', label: 'Expenses', description: 'Track business expenses and receipts', icon: <Receipt className="w-5 h-5" />, section: 'Finance' },
  { id: 'analytics', label: 'Analytics', description: 'Revenue reports, trends, and insights', icon: <BarChart3 className="w-5 h-5" />, section: 'Finance' },
  { id: 'ar-ap', label: 'AR / AP', description: 'Accounts receivable and payable aging', icon: <ArrowLeftRight className="w-5 h-5" />, section: 'Finance' },
  { id: 'payments', label: 'Payments', description: 'Record and track payment collection', icon: <CreditCard className="w-5 h-5" />, section: 'Finance' },
  { id: 'employees', label: 'Employees', description: 'Staff management and roles', icon: <Settings2 className="w-5 h-5" />, section: 'Team' },
  { id: 'hours', label: 'Hours', description: 'Time tracking and timesheets', icon: <Clock className="w-5 h-5" />, section: 'Team' },
  { id: 'payroll', label: 'Payroll', description: 'Payroll runs and pay calculation', icon: <DollarSign className="w-5 h-5" />, section: 'Team' },
  { id: 'inventory', label: 'Inventory', description: 'Track supplies, materials, stock levels', icon: <Package className="w-5 h-5" />, section: 'Operations' },
  { id: 'services', label: 'Services', description: 'Service catalog and pricing', icon: <Wrench className="w-5 h-5" />, section: 'Operations' },
  { id: 'reviews', label: 'Reviews', description: 'Customer reviews and ratings', icon: <Star className="w-5 h-5" />, section: 'Operations' },
  { id: 'driver-routing', label: 'Driver Routing', description: 'Route planning and dispatch', icon: <Truck className="w-5 h-5" />, section: 'Operations' },
  { id: 'sales-calls', label: 'Sales Calls', description: 'AI-powered outbound sales calls', icon: <Phone className="w-5 h-5" />, section: 'Sales & Support' },
  { id: 'phone-support', label: 'Phone Support', description: 'AI phone receptionist and support', icon: <Headphones className="w-5 h-5" />, section: 'Sales & Support' },
  { id: 'taxes', label: 'Taxes', description: 'Tax calculation and reporting', icon: <Calculator className="w-5 h-5" />, section: 'Sales & Support' },
  { id: 'commissions', label: 'Commissions', description: 'Sales rep tracking and commission payouts', icon: <Handshake className="w-5 h-5" />, section: 'Sales & Support' },
  { id: 'ai-assistant', label: 'AI Assistant', description: 'Ask AI about your business data', icon: <Bot className="w-5 h-5" />, section: 'AI' },
  { id: 'modules', label: 'Modules', description: 'Enable/disable dashboard modules', icon: <Blocks className="w-5 h-5" />, section: 'AI', alwaysOn: true },
];

/* ── Business Type Presets ── */

interface Preset {
  label: string;
  description: string;
  emoji: string;
  modules: string[];
}

const PRESETS: Record<string, Preset> = {
  cleaning: {
    label: 'Cleaning / Field Service',
    description: 'Bookings, routing, teams, inventory',
    emoji: '🧹',
    modules: ['invoices', 'quotes', 'bookings', 'customers', 'expenses', 'analytics', 'payments', 'employees', 'hours', 'payroll', 'inventory', 'services', 'reviews', 'driver-routing', 'phone-support', 'ai-assistant', 'commissions'],
  },
  tech: {
    label: 'Tech / Software',
    description: 'Invoices, customers, analytics',
    emoji: '💻',
    modules: ['invoices', 'quotes', 'customers', 'expenses', 'analytics', 'ar-ap', 'payments', 'employees', 'services', 'taxes', 'ai-assistant', 'commissions'],
  },
  construction: {
    label: 'Construction / Trades',
    description: 'Quotes, inventory, hours, payroll',
    emoji: '🔨',
    modules: ['invoices', 'quotes', 'bookings', 'customers', 'expenses', 'analytics', 'payments', 'employees', 'hours', 'payroll', 'inventory', 'services', 'reviews', 'ai-assistant', 'commissions'],
  },
  property: {
    label: 'Property Management',
    description: 'Bookings, routing, analytics, AR/AP',
    emoji: '🏠',
    modules: ['invoices', 'bookings', 'customers', 'expenses', 'analytics', 'ar-ap', 'payments', 'employees', 'hours', 'inventory', 'services', 'reviews', 'driver-routing', 'phone-support', 'ai-assistant', 'commissions'],
  },
  professional: {
    label: 'Professional Services',
    description: 'Invoices, quotes, hours, analytics',
    emoji: '💼',
    modules: ['invoices', 'quotes', 'customers', 'expenses', 'analytics', 'ar-ap', 'payments', 'employees', 'hours', 'services', 'taxes', 'ai-assistant', 'commissions'],
  },
  retail: {
    label: 'Retail / Restaurant',
    description: 'Inventory, POS, reviews, payroll',
    emoji: '🛍️',
    modules: ['invoices', 'customers', 'expenses', 'analytics', 'payments', 'employees', 'hours', 'payroll', 'inventory', 'services', 'reviews', 'taxes', 'ai-assistant', 'commissions'],
  },
  veterinary: {
    label: 'Veterinary / Pet Care',
    description: 'Bookings, customers, inventory, reviews',
    emoji: '🐾',
    modules: ['invoices', 'quotes', 'bookings', 'customers', 'expenses', 'analytics', 'payments', 'employees', 'hours', 'payroll', 'inventory', 'services', 'reviews', 'phone-support', 'ai-assistant', 'commissions'],
  },
  pool: {
    label: 'Pool / Water Service',
    description: 'Routes, chemicals, scheduling, invoicing',
    emoji: '🏊',
    modules: ['invoices', 'bookings', 'customers', 'expenses', 'analytics', 'payments', 'employees', 'hours', 'inventory', 'services', 'reviews', 'driver-routing', 'phone-support', 'ai-assistant', 'commissions'],
  },
  custom: {
    label: 'Custom Setup',
    description: 'Pick exactly what you need',
    emoji: '⚙️',
    modules: MODULES.filter(m => !m.alwaysOn).map(m => m.id),
  },
};

export default function ModulesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enabled, setEnabled] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFirstSetup, setIsFirstSetup] = useState(false);

  const loadModules = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getSettings();
      const mods = (data as any).enabled_modules;
      if (mods && Array.isArray(mods) && mods.length > 0) {
        setEnabled(new Set(mods));
      } else {
        // First time — show setup mode
        setIsFirstSetup(true);
        setEnabled(new Set(MODULES.filter(m => !m.alwaysOn).map(m => m.id)));
      }
    } catch {
      setIsFirstSetup(true);
      setEnabled(new Set(MODULES.filter(m => !m.alwaysOn).map(m => m.id)));
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { if (user) loadModules(); }, [user, loadModules]);

  const toggle = (id: string) => {
    const mod = MODULES.find(m => m.id === id);
    if (mod?.alwaysOn) return;
    setEnabled(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSaved(false);
  };

  const applyPreset = (key: string) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setEnabled(new Set(preset.modules));
    setSaved(false);
  };

  const saveModules = async () => {
    setSaving(true);
    try {
      await updateSetting('enabled_modules', JSON.stringify(Array.from(enabled)));
      setSaved(true);
      setIsFirstSetup(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || loadingData) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const sections = [...new Set(MODULES.map(m => m.section))];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>
            {isFirstSetup ? 'Welcome — Set Up Your Dashboard' : 'Manage Modules'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            {isFirstSetup
              ? 'Choose a business type below or pick individual modules. You can change this anytime.'
              : 'Enable or disable modules to customize your Office AI dashboard.'}
          </p>
        </div>
        <button
          onClick={saveModules}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{ backgroundColor: saved ? '#10b981' : 'var(--ept-accent)', color: '#fff', opacity: saving ? 0.6 : 1 }}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</>}
        </button>
      </div>

      {/* Business Type Presets */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Quick Setup — Business Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="p-4 rounded-xl border text-left transition-all hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="text-2xl mb-2">{preset.emoji}</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{preset.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{preset.description}</div>
              <div className="text-[10px] mt-2 font-mono" style={{ color: 'var(--ept-accent)' }}>{preset.modules.length} modules</div>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Modules */}
      {sections.map(section => (
        <div key={section}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>{section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MODULES.filter(m => m.section === section).map(mod => {
              const isOn = mod.alwaysOn || enabled.has(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() => toggle(mod.id)}
                  disabled={mod.alwaysOn}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all text-left"
                  style={{
                    backgroundColor: isOn ? 'var(--ept-card-bg)' : 'var(--ept-bg)',
                    borderColor: isOn ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                    opacity: mod.alwaysOn ? 0.6 : 1,
                    cursor: mod.alwaysOn ? 'default' : 'pointer',
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{
                    backgroundColor: isOn ? 'rgba(20,184,166,0.15)' : 'var(--ept-surface)',
                    color: isOn ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                  }}>
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
                      {mod.label}
                      {mod.alwaysOn && <span className="ml-2 text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Always On</span>}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{mod.description}</div>
                  </div>
                  <div className="shrink-0 w-10 h-6 rounded-full relative transition-all" style={{
                    backgroundColor: isOn ? 'var(--ept-accent)' : 'var(--ept-surface)',
                    border: `1px solid ${isOn ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
                  }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{
                      left: isOn ? 'calc(100% - 20px)' : '2px',
                    }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={saveModules}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all"
          style={{ backgroundColor: saved ? '#10b981' : 'var(--ept-accent)', color: '#fff', opacity: saving ? 0.6 : 1 }}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Module Configuration'}</>}
        </button>
      </div>
    </div>
  );
}
