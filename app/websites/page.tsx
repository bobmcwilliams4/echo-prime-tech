'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';

/* ─── Template Data ─────────────────────────────────────────── */
const TEMPLATES = [
  { name: 'SaaS Landing', category: 'Business', desc: 'Product page with hero, features, pricing, and CTA.', colors: ['#6366f1', '#818cf8', '#312e81'], sections: ['Hero', 'Features Grid', 'Pricing Table', 'CTA'] },
  { name: 'Portfolio', category: 'Creative', desc: 'Project gallery, about section, and contact form.', colors: ['#f59e0b', '#fbbf24', '#78350f'], sections: ['Intro', 'Project Gallery', 'About', 'Contact'] },
  { name: 'E-Commerce', category: 'Commerce', desc: 'Full storefront with product grid and checkout.', colors: ['#10b981', '#34d399', '#064e3b'], sections: ['Hero Banner', 'Product Grid', 'Categories', 'Cart'] },
  { name: 'Restaurant', category: 'Local', desc: 'Menu showcase, reservations, and photo gallery.', colors: ['#ef4444', '#f87171', '#7f1d1d'], sections: ['Hero', 'Menu', 'Reservations', 'Gallery'] },
  { name: 'Blog', category: 'Content', desc: 'Content-first layout with categories and newsletter.', colors: ['#8b5cf6', '#a78bfa', '#4c1d95'], sections: ['Header', 'Post Feed', 'Sidebar', 'Newsletter'] },
  { name: 'Agency', category: 'Business', desc: 'Services, case studies, team, and testimonials.', colors: ['#06b6d4', '#22d3ee', '#164e63'], sections: ['Hero', 'Services', 'Case Studies', 'Team'] },
  { name: 'Real Estate', category: 'Industry', desc: 'Property listings, virtual tours, agent profiles.', colors: ['#f97316', '#fb923c', '#7c2d12'], sections: ['Search', 'Listings', 'Agent Profiles', 'Contact'] },
  { name: 'Medical', category: 'Industry', desc: 'Practice site with appointment booking and portal.', colors: ['#0ea5e9', '#38bdf8', '#0c4a6e'], sections: ['Hero', 'Services', 'Doctors', 'Booking'] },
  { name: 'Dashboard', category: 'App', desc: 'Admin panel with charts, tables, and KPIs.', colors: ['#14b8a6', '#2dd4bf', '#134e4a'], sections: ['Sidebar', 'KPI Cards', 'Charts', 'Data Table'] },
  { name: 'Fitness', category: 'Local', desc: 'Gym membership, classes, and trainer profiles.', colors: ['#ec4899', '#f472b6', '#831843'], sections: ['Hero', 'Classes', 'Trainers', 'Membership'] },
  { name: 'Non-Profit', category: 'Cause', desc: 'Donations, volunteer signup, and impact stories.', colors: ['#84cc16', '#a3e635', '#365314'], sections: ['Mission', 'Impact', 'Donate', 'Events'] },
  { name: 'Landing Page', category: 'Marketing', desc: 'High-conversion page with lead capture.', colors: ['#a855f7', '#c084fc', '#581c87'], sections: ['Hero', 'Benefits', 'Social Proof', 'CTA Form'] },
  { name: 'Law Firm', category: 'Industry', desc: 'Practice areas, attorney bios, case results.', colors: ['#1e3a5f', '#2563eb', '#0f172a'], sections: ['Hero', 'Practice Areas', 'Attorneys', 'Contact'] },
  { name: 'Construction', category: 'Industry', desc: 'Project showcase, services, certifications.', colors: ['#d97706', '#f59e0b', '#451a03'], sections: ['Hero', 'Projects', 'Services', 'Quote Form'] },
  { name: 'Podcast', category: 'Content', desc: 'Episode player, show notes, and guest bios.', colors: ['#7c3aed', '#a78bfa', '#2e1065'], sections: ['Latest Episode', 'Archive', 'Guests', 'Subscribe'] },
  { name: 'Church', category: 'Cause', desc: 'Service schedule, sermons, events, and giving.', colors: ['#0369a1', '#38bdf8', '#082f49'], sections: ['Welcome', 'Services', 'Sermons', 'Give'] },
  { name: 'Photography', category: 'Creative', desc: 'Full-screen gallery, booking, and pricing.', colors: ['#171717', '#404040', '#0a0a0a'], sections: ['Gallery', 'About', 'Packages', 'Book'] },
  { name: 'Auto Shop', category: 'Local', desc: 'Services, appointment booking, and reviews.', colors: ['#dc2626', '#ef4444', '#450a0a'], sections: ['Hero', 'Services', 'Booking', 'Reviews'] },
  { name: 'Education', category: 'Industry', desc: 'Courses, enrollment, instructor bios.', colors: ['#059669', '#34d399', '#022c22'], sections: ['Programs', 'Courses', 'Faculty', 'Apply'] },
  { name: 'Event Venue', category: 'Local', desc: 'Venue tours, packages, and booking.', colors: ['#be185d', '#f472b6', '#500724'], sections: ['Gallery', 'Packages', 'Calendar', 'Contact'] },
];

const CATEGORIES = ['All', 'Business', 'Creative', 'Commerce', 'Local', 'Content', 'Industry', 'App', 'Cause', 'Marketing'];

/* ─── Stats ──────────────────────────────────────────────────── */
const STATS = [
  { value: '20+', label: 'Starter Templates' },
  { value: '5,486+', label: 'AI Engines' },
  { value: '<50ms', label: 'Global Load Time' },
  { value: '99.9%', label: 'Uptime SLA' },
];

/* ─── Features ──────────────────────────────────────────────── */
const FEATURES = [
  { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'AI Site Generation', desc: 'Describe your business in plain English. AI generates complete, production-ready pages with real copy, images, and layout — not just templates.' },
  { icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', title: 'Visual Drag & Drop', desc: '50+ section blocks — heroes, feature grids, pricing tables, testimonials, forms, footers. Click, drag, done.' },
  { icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', title: 'Responsive by Default', desc: 'Every template and block adapts to desktop, tablet, and mobile. Preview all breakpoints in the editor.' },
  { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', title: 'Edge Deployed', desc: 'Sites serve from 300+ global edge locations. Sub-50ms loads worldwide. No cold starts. Ever.' },
  { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Custom Domains & SSL', desc: 'Connect any domain with automatic SSL certificates. DNS management and HTTPS enforced out of the box.' },
  { icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', title: 'Full Code Access', desc: 'Drop into HTML, CSS, and JavaScript anytime. Embed third-party scripts, custom animations, anything.' },
  { icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z', title: 'E-Commerce Built In', desc: 'Product catalogs, Stripe checkout, shopping cart, and inventory — no plugins or third-party apps needed.' },
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Real-Time Analytics', desc: 'Visitors, page views, bounce rates, conversions — all built in. No third-party tracking scripts required.' },
];

/* ─── Process Steps ─────────────────────────────────────────── */
const PROCESS_STEPS = [
  { step: '01', title: 'Describe or Pick', desc: 'Tell AI what you need in plain English, or choose from 20+ professionally designed templates.' },
  { step: '02', title: 'Customize Visually', desc: 'Drag and drop sections. Edit text, colors, images. AI generates copy and suggests layouts.' },
  { step: '03', title: 'Preview & Optimize', desc: 'See your site on every device. Run performance checks. Get SEO recommendations from AI.' },
  { step: '04', title: 'Publish Globally', desc: 'One click to deploy across 300+ edge locations. Custom domain, SSL, and analytics included.' },
];

/* ─── Comparison ─────────────────────────────────────────────── */
const COMPARISON_FEATURES = [
  { feature: 'AI Content Generation', echo: true, wix: true, squarespace: true, webflow: false },
  { feature: 'AI Full-Page Generation', echo: true, wix: true, squarespace: false, webflow: false },
  { feature: '5,486+ Domain Intelligence Engines', echo: true, wix: false, squarespace: false, webflow: false },
  { feature: 'Edge Deployment (<50ms)', echo: true, wix: false, squarespace: false, webflow: false },
  { feature: 'No Vendor Lock-In (HTML Export)', echo: true, wix: false, squarespace: false, webflow: true },
  { feature: 'E-Commerce Built In', echo: true, wix: true, squarespace: true, webflow: true },
  { feature: 'Full Code Access', echo: true, wix: false, squarespace: false, webflow: true },
  { feature: 'White-Label / Agency Mode', echo: true, wix: false, squarespace: false, webflow: true },
  { feature: 'Free Tier Available', echo: true, wix: true, squarespace: false, webflow: true },
  { feature: 'Custom Domain on Free', echo: false, wix: false, squarespace: false, webflow: false },
];

/* ─── Portfolio ──────────────────────────────────────────────── */
const PORTFOLIO = [
  { name: 'Pro Finish USA', url: 'https://profinishusa.com', industry: 'Construction Services', desc: 'Full-service contractor website with bilingual support, AI chatbot, customer portal, and receipt OCR.', features: ['Bilingual EN/ES', 'AI Chatbot', 'Customer Portal', 'Receipt OCR', 'Service Booking'] },
  { name: 'Barking Lot', url: 'https://barkinglot.org', industry: 'Pet Services', desc: 'Dog daycare and boarding facility with online booking, photo galleries, and live cam integration.', features: ['Online Booking', 'Photo Gallery', 'Service Plans', 'Pet Profiles'] },
  { name: 'Right at Home BnB', url: 'https://rah-midland.com', industry: 'Hospitality', desc: 'Short-term rental showcase with booking integration, property tours, and guest reviews.', features: ['Property Showcase', 'Booking Integration', 'Photo Tours', 'Guest Reviews'] },
  { name: 'Legacy Gaming Enterprises', url: 'https://echo-lge.com', industry: 'Gaming & Entertainment', desc: 'Sweepstakes gaming platform with 50+ licensed games, player management, and compliance.', features: ['50+ Games', 'AI Chatbot', 'Payment Processing', 'Compliance'] },
  { name: "Bree's Gaming", url: 'https://brees.echo-lge.com', industry: 'Gaming Analytics', desc: 'AI-powered gambling analytics with multi-screen OCR and real-time voice assistant.', features: ['AI Analytics', 'Voice Assistant', 'Multi-Screen OCR', 'Real-Time'] },
  { name: 'Black Gold Asset Transfer', url: 'https://bgat.echo-op.com', industry: 'Oil & Gas', desc: 'Oilfield chemical supplier with 3D showcase, product catalog, and AI consulting.', features: ['3D Animation', 'AI Assistant', 'Product Catalog', 'Field Services'] },
  { name: 'Echo Omega Prime', url: 'https://echo-op.com', industry: 'AI Technology', desc: 'Operations dashboard for distributed AI infrastructure with 30+ cloud services.', features: ['Real-Time Dashboard', 'MoltBook Feed', 'Swarm Control', 'Multi-AI'] },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function FeatureIcon({ d }: { d: string }) {
  return (
    <svg className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function TemplatePreview({ colors, sections }: { colors: string[]; sections: string[] }) {
  return (
    <div data-tutorial="websites-hero" className="w-full h-full flex flex-col gap-1.5 p-3">
      <div className="flex items-center gap-1.5 pb-1.5 border-b" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
        </div>
        <div className="flex-1 h-3 rounded-sm mx-2" style={{ backgroundColor: 'var(--ept-surface)' }} />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {sections.map((s, i) => (
          <div
            key={s}
            className="rounded-sm flex items-center justify-center"
            style={{ flex: i === 0 ? 2 : 1, backgroundColor: colors[i % colors.length], opacity: 0.85 - i * 0.1 }}
          >
            <span className="text-[8px] font-semibold text-white/70 uppercase tracking-wider">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckIcon() {
  return <svg className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}

function XIcon() {
  return <svg className="w-5 h-5 opacity-30" style={{ color: 'var(--ept-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
}

/* ─── Main Page Content ─────────────────────────────────────── */
function WebsitesPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { isDark } = useTheme();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const filtered = categoryFilter === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === categoryFilter);
  const builderHref = user ? '/websites/builder' : '/signup?redirect=/websites/builder';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/engines" className="text-sm font-medium hidden sm:inline" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          {user ? (
            <Link href="/websites/builder" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Open Builder</Link>
          ) : (
            <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started Free</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto animate-fade-up relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ backgroundColor: 'var(--ept-accent-glow)', borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} /> Backed by 5,486+ AI Intelligence Engines
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight" style={{ color: 'var(--ept-text)' }}>
            Describe your business.<br />
            <span className="gradient-text">Get a website.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
            AI generates complete, production-ready websites from a description. Or start with 20+ templates and a visual drag-and-drop builder. Deployed to 300+ edge locations in one click.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={builderHref} className="px-8 py-4 rounded-xl font-semibold text-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Start Building Free
            </Link>
            <a href="#portfolio" className="px-8 py-4 rounded-xl border font-semibold text-lg transition-colors hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              See Our Work
            </a>
            <ReadAloudButton size="md" label="Listen" getText={() => {
              const sections = document.querySelectorAll('h1, h2, p');
              return Array.from(sections).map(s => s.textContent?.trim()).filter(Boolean).join('. ').slice(0, 3000);
            }} />
          </div>
          <p className="mt-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>No credit card required. Free tier includes all templates and HTML export.</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className="py-8 px-6 text-center" style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-xs font-medium mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Generation Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold mb-4 border" style={{ backgroundColor: 'var(--ept-accent-glow)', borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
                AI-POWERED
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>
                Tell AI what you need.<br />Get a complete website.
              </h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                Our AI doesn&apos;t just swap placeholder text on a template. It draws from 5,486+ specialized intelligence engines to generate industry-specific copy, SEO-optimized structure, and conversion-focused layouts tailored to your exact business.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Industry-aware copy from domain-specific AI engines',
                  'SEO structure and meta tags generated automatically',
                  'Conversion-optimized layouts based on your industry',
                  'Edit anything after generation — full drag-and-drop control',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={builderHref} className="inline-flex mt-8 px-6 py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Try AI Generation
              </Link>
            </div>
            {/* AI mockup */}
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>AI Site Generator</span>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <p className="text-sm italic" style={{ color: 'var(--ept-text-secondary)' }}>&quot;Build a website for a Midland, TX plumbing company called FastDrain Pros. Include emergency service booking, reviews section, and service area map.&quot;</p>
                </div>
                <div className="flex items-center gap-2 py-2">
                  <div className="h-1 rounded-full flex-1" style={{ backgroundColor: 'var(--ept-accent)' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--ept-accent)' }}>Generating...</span>
                </div>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)' }}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                    </div>
                    <div className="flex-1 h-4 rounded mx-2" style={{ backgroundColor: 'var(--ept-border)' }} />
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="h-16 rounded-lg" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }} />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 rounded" style={{ backgroundColor: 'var(--ept-surface)' }} />
                      <div className="h-8 rounded" style={{ backgroundColor: 'var(--ept-surface)' }} />
                      <div className="h-8 rounded" style={{ backgroundColor: 'var(--ept-surface)' }} />
                    </div>
                    <div className="h-10 rounded" style={{ backgroundColor: 'var(--ept-surface)' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
                  <span>5 sections generated</span>
                  <span>SEO score: 94/100</span>
                  <span>Mobile: Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Idea to live site in minutes</h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Four steps. No coding required.</p>
          </div>
          <div data-tutorial="websites-process" className="grid md:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.step} className="text-center relative">
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px" style={{ backgroundColor: 'var(--ept-border)' }} />
                )}
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-extrabold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  {s.step}
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 data-tutorial="websites-template" className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>20+ templates. Unlimited AI layouts.</h2>
            <p className="mt-3 text-sm max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Every template is fully customizable. Start from a design or let AI generate one from your description.</p>
          </div>

          {/* Category filter */}
          <div data-tutorial="websites-category" className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border"
                style={{
                  backgroundColor: categoryFilter === c ? 'var(--ept-accent)' : 'transparent',
                  color: categoryFilter === c ? '#fff' : 'var(--ept-text-secondary)',
                  borderColor: categoryFilter === c ? 'var(--ept-accent)' : 'var(--ept-border)',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Blank canvas */}
            <button
              onClick={() => { if (!user) { router.push('/signup?redirect=/websites/builder'); return; } router.push('/websites/builder'); }}
              className="card-hover rounded-xl border overflow-hidden text-left transition-all hover:border-[var(--ept-accent)] group"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="h-36 flex items-center justify-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
                <div className="w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors group-hover:border-[var(--ept-accent)]" style={{ borderColor: 'var(--ept-text-muted)' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--ept-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>Blank Canvas</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Start from scratch with drag & drop.</p>
              </div>
            </button>

            {/* AI generate card */}
            <button
              onClick={() => { if (!user) { router.push('/signup?redirect=/websites/builder'); return; } router.push('/websites/builder?ai=true'); }}
              className="card-hover rounded-xl border overflow-hidden text-left transition-all hover:border-[var(--ept-accent)] group"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: '2px' }}
            >
              <div className="h-36 flex items-center justify-center relative" style={{ background: isDark ? 'linear-gradient(135deg, #0c1220 0%, #1a1f2e 100%)' : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    <svg className="w-10 h-10 mx-auto" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>AI POWERED</span>
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>NEW</div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>Generate with AI</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Describe your business, get a site.</p>
              </div>
            </button>

            {/* Template cards */}
            {filtered.map(t => (
              <button
                key={t.name}
                onClick={() => { if (!user) { router.push('/signup?redirect=/websites/builder'); return; } router.push(`/websites/builder?template=${encodeURIComponent(t.name)}`); }}
                className="card-hover rounded-xl border overflow-hidden text-left transition-all hover:border-[var(--ept-accent)] group"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="h-36 relative overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <TemplatePreview colors={t.colors} sections={t.sections} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <span className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Use Template</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{t.category}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 data-tutorial="websites-pricing" className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Professional tools. No professional price.</h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Everything you need to build, launch, and grow — included from day one.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="mb-3"><FeatureIcon d={f.icon} /></div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Echo vs Competitors */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>How we compare</h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Feature-for-feature against the biggest names in website building.</p>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                    <th className="px-4 py-3 font-bold text-xs" style={{ color: 'var(--ept-accent)' }}>Echo Prime</th>
                    <th className="px-4 py-3 font-semibold text-xs" style={{ color: 'var(--ept-text-muted)' }}>Wix</th>
                    <th className="px-4 py-3 font-semibold text-xs" style={{ color: 'var(--ept-text-muted)' }}>Squarespace</th>
                    <th className="px-4 py-3 font-semibold text-xs" style={{ color: 'var(--ept-text-muted)' }}>Webflow</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{row.feature}</td>
                      <td className="px-4 py-3 text-center">{row.echo ? <CheckIcon /> : <XIcon />}</td>
                      <td className="px-4 py-3 text-center">{row.wix ? <CheckIcon /> : <XIcon />}</td>
                      <td className="px-4 py-3 text-center">{row.squarespace ? <CheckIcon /> : <XIcon />}</td>
                      <td className="px-4 py-3 text-center">{row.webflow ? <CheckIcon /> : <XIcon />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
              Only Echo Prime combines 5,486+ AI intelligence engines with a visual builder and edge deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Simple, transparent pricing</h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Start free. Upgrade when you need custom domains and advanced features.</p>
            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-xs font-medium" style={{ color: billingCycle === 'monthly' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{ backgroundColor: billingCycle === 'annual' ? 'var(--ept-accent)' : 'var(--ept-border)' }}
              >
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ left: billingCycle === 'annual' ? '26px' : '2px' }} />
              </button>
              <span className="text-xs font-medium" style={{ color: billingCycle === 'annual' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>
                Annual <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Save 20%</span>
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: 'Free', price: 0, desc: 'Build and preview sites. Export HTML.',
                features: ['Drag & drop builder', 'All 20+ templates', 'AI content generation (5/mo)', 'HTML/CSS export', 'Mobile responsive'],
                cta: 'Start Free',
              },
              {
                tier: 'Pro', price: 29, desc: 'Custom domains, full AI, analytics, and SEO tools.',
                features: ['Everything in Free', 'Custom domain + SSL', 'Unlimited AI generation', 'Real-time analytics', 'SEO optimization tools', 'Priority support', 'Remove branding'],
                cta: 'Go Pro', accent: true,
              },
              {
                tier: 'Business', price: 79, desc: 'E-commerce, unlimited sites, white-label.',
                features: ['Everything in Pro', 'E-commerce + Stripe checkout', 'Unlimited sites', 'Team collaboration', 'White-label branding', 'API access', 'Dedicated support'],
                cta: 'Start Business',
              },
            ].map(p => {
              const annualPrice = Math.round(p.price * 0.8);
              const displayPrice = billingCycle === 'annual' ? annualPrice : p.price;
              return (
                <div
                  key={p.tier}
                  className="p-6 rounded-xl border relative"
                  style={{
                    backgroundColor: 'var(--ept-card-bg)',
                    borderColor: p.accent ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                    borderWidth: p.accent ? '2px' : '1px',
                  }}
                >
                  {p.accent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${displayPrice}</span>
                    <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{p.price === 0 ? '/forever' : '/mo'}</span>
                  </div>
                  {billingCycle === 'annual' && p.price > 0 && (
                    <div className="text-xs mb-2" style={{ color: 'var(--ept-accent)' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--ept-text-muted)' }}>${p.price}/mo</span> — Save ${(p.price - annualPrice) * 12}/yr
                    </div>
                  )}
                  <p className="text-xs mb-5" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.tier === 'Free' ? builderHref : `/checkout?service=website-creation&tier=${p.tier.toLowerCase()}`}
                    className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: p.accent ? 'var(--ept-accent)' : 'transparent',
                      color: p.accent ? '#fff' : 'var(--ept-accent)',
                      border: p.accent ? 'none' : '1px solid var(--ept-accent)',
                    }}
                  >
                    {p.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agency / White-Label CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="relative z-10 md:flex items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold mb-4 border" style={{ backgroundColor: 'var(--ept-accent-glow)', borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
                  FOR AGENCIES
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>Build sites for clients under your brand</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                  White-label the builder. Manage unlimited client sites from one dashboard. Invoice your clients directly. No &quot;Powered by&quot; branding.
                </p>
                <ul className="mt-4 space-y-2">
                  {['White-label branding', 'Unlimited client sites', 'Client billing dashboard', 'Team roles & permissions'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 md:mt-0 flex-shrink-0">
                <Link href="/pricing" className="inline-flex px-6 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  Agency Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 border" style={{ backgroundColor: 'var(--ept-accent-glow)', borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
              Portfolio
            </div>
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Real sites. Real businesses.</h2>
            <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Websites in production for businesses across industries. Designed, built, and deployed by our team.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO.map((site, i) => (
              <a
                key={i}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-xl border transition-all hover:border-[var(--ept-accent)] hover:shadow-lg card-hover"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold group-hover:underline" style={{ color: 'var(--ept-text)' }}>{site.name}</h3>
                    <span className="text-xs font-medium" style={{ color: 'var(--ept-accent)' }}>{site.industry}</span>
                  </div>
                  <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{site.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {site.features.map((f, j) => (
                    <span key={j} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{f}</span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t text-xs font-mono" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>{site.url.replace('https://', '')}</div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Want a custom website built for your business? We design, build, and deploy.</p>
            <Link href="/pricing" className="inline-flex px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              View Custom Website Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Web Design Intelligence */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Web Design Intelligence</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our AI engines for UI/UX patterns, SEO strategies, conversion optimization, and industry best practices.</p>
          <EngineQueryPanel
            domains={['UIUX', 'WEBAPP']}
            title="Web Design Doctrine"
            placeholder="Ask about web design, UX patterns, SEO, conversion optimization..."
            exampleQueries={[
              'Mobile-first responsive design patterns',
              'Core Web Vitals optimization techniques',
              'Landing page conversion best practices',
              'SEO technical requirements checklist',
            ]}
            showStats
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to build something great?</h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Start with our free builder or let AI generate your site. No credit card. No vendor lock-in. Export your code anytime.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={builderHref} className="inline-flex px-8 py-4 rounded-xl font-semibold text-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Launch the Builder
          </Link>
          <Link href="/pricing" className="inline-flex px-8 py-4 rounded-xl border font-semibold text-lg" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Compare Plans
          </Link>
        </div>
      </section>
      <ProductTutorialButton tutorialId="websites" productName="Website Builder" />
    </div>
  );
}

export default function WebsitesPage() {
  return <SubscriptionGate serviceId="website-creation"><WebsitesPageContent /></SubscriptionGate>;
}
