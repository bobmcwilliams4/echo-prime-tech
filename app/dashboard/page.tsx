'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { getProfile, getServices, Service } from '../../lib/ept-api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, role, subscriptions, signOut } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setIsDark(h < 6 || h >= 18);
    document.documentElement.classList.toggle('dark', h < 6 || h >= 18);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    getServices().then(d => setServices(d.services)).catch(() => {});
  }, []);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const subscribedServices = services.filter(s => subscriptions.includes(s.id));
  const availableServices = services.filter(s => !subscriptions.includes(s.id));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          {role === 'owner' && <Link href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Admin</Link>}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{user.displayName || user.email?.split('@')[0]}</p>
            <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</p>
          </div>
          {user.photoURL ? <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border" style={{ borderColor: 'var(--ept-border)' }} /> : <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{(user.displayName || user.email || 'U')[0].toUpperCase()}</div>}
          <button onClick={handleSignOut} className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Sign Out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Welcome, <span className="gradient-text">{user.displayName || user.email?.split('@')[0] || 'there'}</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Your Echo Prime Technologies dashboard. Manage your active services below.</p>
        </div>

        {/* Subscribed Services */}
        {subscribedServices.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Your Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribedServices.map((svc, i) => (
                <Link key={i} href={svc.url || '#'} className="card-hover p-6 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{svc.icon}</div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>Active</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{svc.name}</h3>
                  <p className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>{svc.tagline}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color: 'var(--ept-accent)' }}>
                    Open
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-12 p-10 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>No active services yet</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Choose the services you want to activate to get started.</p>
            <Link href="/services" className="inline-flex px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Browse Services</Link>
          </div>
        )}

        {/* Available to add */}
        {availableServices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Available Services</h2>
              <Link href="/services" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Manage All</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {availableServices.map((svc, i) => (
                <div key={i} className="p-4 rounded-xl border opacity-60 hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg" style={{ color: 'var(--ept-accent)' }}>{svc.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{svc.name}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>From ${svc.pricing?.[0]?.price || '—'}/mo</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
