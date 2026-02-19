'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

const TEMPLATES = [
  { name: 'SaaS Landing', preview: 'Modern SaaS product page with hero, features, pricing, and CTA sections', category: 'Business' },
  { name: 'Portfolio', preview: 'Clean portfolio with project gallery, about section, and contact form', category: 'Creative' },
  { name: 'E-Commerce', preview: 'Full storefront with product grid, cart, and checkout flow', category: 'Commerce' },
  { name: 'Restaurant', preview: 'Menu showcase, reservation system, location map, and photo gallery', category: 'Local' },
  { name: 'Blog', preview: 'Content-first layout with categories, search, and newsletter signup', category: 'Content' },
  { name: 'Agency', preview: 'Service showcase, team profiles, case studies, and client testimonials', category: 'Business' },
  { name: 'Real Estate', preview: 'Property listings, virtual tours, agent profiles, and MLS integration', category: 'Industry' },
  { name: 'Medical', preview: 'HIPAA-aware practice site with appointment booking and patient portal', category: 'Industry' },
  { name: 'Dashboard', preview: 'Admin panel with charts, tables, KPIs, and data visualization', category: 'App' },
];

const FEATURES = [
  { title: 'Drag & Drop Builder', desc: 'Visual editor with 100+ blocks — headers, heroes, features, pricing, testimonials, footers, and more. No code required.' },
  { title: 'AI Content Generation', desc: 'Describe what you want and AI writes the copy, picks images, and suggests layouts. Edit anything after.' },
  { title: 'Responsive by Default', desc: 'Every template adapts to desktop, tablet, and mobile automatically. Fine-tune breakpoints in the editor.' },
  { title: 'Custom Code Access', desc: 'Drop into HTML/CSS/JS when you need full control. React components, custom animations, third-party integrations.' },
  { title: 'Edge Deployed', desc: 'Every site deploys to Cloudflare\'s global edge network — sub-50ms loads worldwide. Zero cold starts.' },
  { title: 'Custom Domains & SSL', desc: 'Connect any domain with automatic SSL provisioning. DNS management built in.' },
  { title: 'Real-Time Analytics', desc: 'See visitors, page views, bounce rates, and conversions without third-party scripts slowing your site.' },
  { title: 'E-Commerce Ready', desc: 'Product catalogs, shopping carts, Stripe checkout, inventory management — all built in.' },
];

export default function WebsitesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setIsDark(h < 6 || h >= 18);
    document.documentElement.classList.toggle('dark', h < 6 || h >= 18);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ backgroundColor: 'var(--ept-accent-glow)', borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--ept-accent)' }} /> Website Creation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>
            Build websites that<br /><span className="gradient-text">outperform everything.</span>
          </h1>
          <p className="mt-6 text-lg max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            AI-powered drag-and-drop builder. 50+ templates. Edge-deployed globally. From idea to live site in minutes, not months.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? '/websites/builder' : '/signup'} className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Start Building Free
            </Link>
            <Link href="/pricing" className="px-8 py-4 rounded-xl border font-semibold text-lg" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Start with a template</h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Every template is fully customizable. Or start from a blank canvas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!user) { router.push('/signup'); return; }
                  router.push(`/websites/builder?template=${encodeURIComponent(t.name)}`);
                }}
                className="card-hover rounded-xl border overflow-hidden text-left transition-all hover:border-[var(--ept-accent)]"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="h-40 flex items-center justify-center relative group" style={{ backgroundColor: 'var(--ept-bg)' }}>
                  <span className="text-4xl opacity-20">◇</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <span className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Use Template</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{t.category}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{t.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Everything you need</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to build?</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>Start with our free builder. Upgrade when you need more.</p>
        <Link href={user ? '/websites/builder' : '/signup'} className="inline-flex px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          Launch Builder
        </Link>
      </section>
    </div>
  );
}
