'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';
import { getServices, Service } from '../lib/ept-api';

interface SubscriptionGateProps {
  serviceId: string;
  children: React.ReactNode;
}

export default function SubscriptionGate({ serviceId, children }: SubscriptionGateProps) {
  const router = useRouter();
  const { user, loading, subscriptions, role } = useAuth();
  const { isDark } = useTheme();
  const [service, setService] = useState<Service | null>(null);

  const isOwner = role === 'owner';
  const hasAccess = isOwner || subscriptions.includes(serviceId);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !hasAccess) {
      getServices().then(d => {
        const svc = d.services.find((s: Service) => s.id === serviceId);
        if (svc) setService(svc);
      }).catch(() => {});
    }
  }, [user, hasAccess, serviceId]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!hasAccess) {
    const tier = service?.pricing?.[0]?.tier?.toLowerCase() || 'starter';
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
          <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Dashboard</Link>
        </nav>

        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
            {service?.icon || '\uD83D\uDD12'}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
            {service?.name || 'Premium Service'}
          </h1>

          <p className="text-sm mb-2" style={{ color: 'var(--ept-accent)' }}>
            {service?.tagline || 'Subscription required'}
          </p>

          <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
            {service?.description || 'This is a premium service. Subscribe to unlock full access.'}
          </p>

          {service?.pricing && service.pricing.length > 0 && (
            <div className="inline-flex items-baseline gap-1 px-5 py-3 rounded-xl mb-8" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Starting at</span>
              <span className="text-3xl font-extrabold font-mono gradient-text">${service.pricing[0].price}</span>
              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>/{service.pricing[0].interval}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 items-center">
            <Link
              href={`/checkout?service=${encodeURIComponent(serviceId)}&tier=${encodeURIComponent(tier)}`}
              className="px-10 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              Subscribe Now
            </Link>
            <Link href="/pricing" className="text-sm underline" style={{ color: 'var(--ept-accent)' }}>
              View All Plans
            </Link>
          </div>

          <div className="mt-12 p-4 rounded-lg text-xs" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Need help?</p>
            <p>Email <a href="mailto:customerservice@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>customerservice@echo-op.com</a></p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
