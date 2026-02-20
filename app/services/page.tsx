'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, subscribe, Service } from '../../lib/ept-api';

export default function ServicesPage() {
  const router = useRouter();
  const { user, loading, role, subscriptions } = useAuth();
  const { isDark } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    getServices().then(d => setServices(d.services)).catch(() => {});
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0) setSelected(new Set(subscriptions));
  }, [subscriptions]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (selected.size === 0) return;
    setSaving(true);
    try {
      await subscribe(Array.from(selected));
      router.push(role === 'owner' ? '/admin' : '/dashboard');
    } catch { setSaving(false); }
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
          {role === 'owner' && <Link href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Admin</Link>}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Choose Your Services</h1>
          <p className="mt-4 text-lg" style={{ color: 'var(--ept-text-secondary)' }}>Select the services you want to activate. You can change these anytime from your dashboard.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {services.map(svc => {
            const isSelected = selected.has(svc.id);
            return (
              <button key={svc.id} onClick={() => toggle(svc.id)} className="text-left p-6 rounded-xl border-2 transition-all" style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: isSelected ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: isSelected ? '0 0 20px var(--ept-accent-glow)' : 'none',
              }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{svc.icon}</div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? '' : ''}`} style={{ borderColor: isSelected ? 'var(--ept-accent)' : 'var(--ept-border)', backgroundColor: isSelected ? 'var(--ept-accent)' : 'transparent' }}>
                    {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{svc.name}</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--ept-accent)' }}>{svc.tagline}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{svc.description}</p>
                {svc.pricing && svc.pricing.length > 0 && (
                  <div className="mt-4 pt-3 border-t flex items-baseline gap-1" style={{ borderColor: 'var(--ept-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>From</span>
                    <span className="text-xl font-extrabold font-mono gradient-text">${svc.pricing[0].price}</span>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/mo</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <button onClick={handleSave} disabled={selected.size === 0 || saving} className="px-10 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-40" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {saving ? 'Activating...' : `Activate ${selected.size} Service${selected.size !== 1 ? 's' : ''}`}
          </button>
          <p className="mt-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            <Link href="/pricing" className="underline hover:opacity-80">View detailed pricing</Link> for all services
          </p>
        </div>
      </div>
    </div>
  );
}
