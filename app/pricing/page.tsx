'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service } from '../../lib/ept-api';

export default function PricingPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);

  useEffect(() => {
    getServices().then(d => { setServices(d.services); if (d.services.length > 0) setActiveService(d.services[0].id); }).catch(() => {});
  }, []);

  const current = services.find(s => s.id === activeService);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Pricing</div>
          <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Simple, transparent pricing</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Every service has clear tiers. No hidden fees. Scale up or down anytime.</p>
        </div>

        {/* Service tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {services.map(svc => (
            <button key={svc.id} onClick={() => setActiveService(svc.id)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{
              backgroundColor: activeService === svc.id ? 'var(--ept-accent)' : 'var(--ept-surface)',
              color: activeService === svc.id ? '#fff' : 'var(--ept-text-secondary)',
            }}>
              {svc.name}
            </button>
          ))}
        </div>

        {/* Pricing cards */}
        {current && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{current.name}</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>{current.tagline}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {current.pricing.map((tier, i) => (
                <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: tier.popular ? '0 0 30px var(--ept-accent-glow)' : 'none',
                }}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
                  )}
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
                  <div className="mb-6">
                    {tier.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price}</span>
                        <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={user ? '/services' : '/signup'} className="block text-center py-3 rounded-lg font-semibold text-sm transition-all" style={{
                    backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                    color: tier.popular ? '#fff' : 'var(--ept-accent)',
                    border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
                  }}>
                    {tier.custom ? 'Contact Sales' : 'Get Started'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> or email <a href="mailto:customerservice@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>customerservice@echo-op.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
