'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service } from '../../lib/ept-api';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

const FAQS = [
  { q: 'How do I activate a service after signing up?', a: 'Simply select the services you want from the grid above and click Continue to Checkout. Once payment is confirmed, your service is live immediately — no setup delay, no manual provisioning.' },
  { q: 'Can I add or remove services later?', a: 'Yes. You can change your active services anytime from your dashboard. Adding a service routes you through checkout; removing one takes effect at the end of your current billing cycle.' },
  { q: 'Do services integrate with each other?', a: 'Absolutely. Our services are built on a unified platform. Data flows between Intelligence Engines, Title Intelligence, AI Closer, Sentinel, and every other product automatically. The more services you activate, the smarter your stack becomes.' },
  { q: 'Is there a discount for bundling multiple services?', a: 'Yes. Contact us for custom enterprise bundle pricing when you need 3 or more services. Bundle discounts can save 15-30% compared to individual subscriptions.' },
  { q: 'What kind of support do I get?', a: 'All plans include email support with 24-hour response times. Growth and Enterprise tiers include priority support with 2-hour response. Enterprise clients get a dedicated account manager.' },
  { q: 'Can I try a service before committing?', a: 'Many services offer free tiers or 14-day trials. Sentinel AI, Price Alerts, and the Gamer Companion all have free plans so you can experience the platform before upgrading.' },
];

export default function ServicesPage() {
  const router = useRouter();
  const { user, loading, role, subscriptions } = useAuth();
  const { isDark } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const newCount = Array.from(selected).filter(id => !subscriptions.includes(id)).length;

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

  const handleSave = () => {
    if (selected.size === 0) return;
    // Find the first newly-selected service (not already subscribed)
    const newServices = Array.from(selected).filter(id => !subscriptions.includes(id));
    if (newServices.length === 0) {
      // All selected are already subscribed — just go to dashboard
      router.push(role === 'owner' ? '/admin' : '/dashboard');
      return;
    }
    // Route to checkout with the first new service
    const svc = services.find(s => s.id === newServices[0]);
    const tier = svc?.pricing?.[0]?.tier?.toLowerCase() || 'starter';
    router.push(`/checkout?service=${encodeURIComponent(newServices[0])}&tier=${encodeURIComponent(tier)}`);
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]} />
      <FaqSchema faqs={FAQS} />
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <ProductTutorialButton tutorialId="services" productName="Professional Services" />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
          {role === 'owner' && <Link href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Admin</Link>}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div data-tutorial="services-hero" className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Choose Your Services</h1>
          <p className="mt-4 text-lg" style={{ color: 'var(--ept-text-secondary)' }}>Select the services you want to activate. You can change these anytime from your dashboard.</p>
        </div>

        <div data-tutorial="services-grid" className="grid md:grid-cols-2 gap-4 mb-10">
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

        <div data-tutorial="services-contact" className="text-center">
          <button onClick={handleSave} disabled={selected.size === 0} className="px-10 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-40" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            {newCount > 0 ? `Continue to Checkout` : `Go to Dashboard`}
          </button>
          <p className="mt-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            <Link href="/pricing" className="underline hover:opacity-80">View detailed pricing</Link> for all services
          </p>
        </div>
      </div>

      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Professional Services Engine
        </h2>
        <EngineQueryPanel
          domains={['BUS']}
          title="Ask the Professional Services Engine"
          placeholder="Ask about consulting, project management..."
          exampleQueries={['How to scope a software consulting engagement', 'Best practices for SOW writing', 'Project estimation techniques']}
        />
      </section>

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
