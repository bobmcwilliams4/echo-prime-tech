'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FAQS = [
  { q: 'Do I need GPU servers to use Echo Runway?', a: 'No. All 3D rendering runs in the browser using WebGL/Three.js. Your customers see real-time 3D fashion shows with zero server-side rendering. Infrastructure cost is under $35/month on Cloudflare.' },
  { q: 'How does the AI content creation pipeline work?', a: 'Upload one product photo. Our AI generates model photos, creates video content, formats for Instagram/TikTok/Pinterest, and delivers 5-10 ready-to-post assets in under 3 minutes. No photographer, no studio, no editing.' },
  { q: 'Can I embed Echo Runway on my Shopify store?', a: 'Yes. A single script tag embeds the 3D runway widget on any page. It auto-imports your product catalog via Shopify API. Under 8KB, no CSS conflicts, Shadow DOM encapsulated.' },
  { q: 'What file formats do you support for garments?', a: 'Product photos (PNG/JPG), 3D garment files (GLB/GLTF with cloth simulation data), and Shopify/WooCommerce catalog auto-import. Most brands start with just photos — no 3D files needed.' },
  { q: 'How does video recording work?', a: 'Built-in browser recording via MediaRecorder API. Capture your 3D runway show as WebM/MP4 video directly from the canvas. No plugins, no downloads — works in Chrome, Firefox, Edge.' },
  { q: 'Is this a virtual try-on product?', a: 'Echo Runway is an AI content creation platform for fashion brands, not a try-on tool. We generate marketing content: runway videos, model photos, social media assets. Try-on is a secondary feature for stores that want it.' },
];

const FEATURES = [
  { icon: '\u{1F3AC}', title: 'Real-Time 3D Runway', desc: 'Browser-native WebGL rendering at 60 FPS. Animated models walk your collection on a virtual catwalk. Zero server GPU required.' },
  { icon: '\u{1F4F8}', title: 'AI Content Pipeline', desc: 'One product photo → 5-10 content assets. AI-generated model photos, runway videos, and social-ready formats in minutes.' },
  { icon: '\u{1F3A5}', title: 'Video Recording', desc: 'Capture high-quality runway videos directly from the browser. WebM/MP4 export. 5 cinematic camera modes built in.' },
  { icon: '\u{1F6CD}', title: 'Shopify Integration', desc: 'Auto-import your product catalog. One script tag, Shadow DOM encapsulated, <8KB widget. Works on any e-commerce platform.' },
  { icon: '\u{1F464}', title: 'Avatar Customization', desc: 'ReadyPlayerMe selfie-to-avatar. Customers see clothes on a model that looks like them. Full body rigging with Mixamo animations.' },
  { icon: '\u{1F4CA}', title: 'Analytics Dashboard', desc: 'Track which products get the most views, try-ons, and shares. Conversion attribution from 3D experience to purchase.' },
  { icon: '\u{1F310}', title: 'Multi-Platform Export', desc: 'Auto-format content for Instagram Reels, TikTok, Pinterest, and YouTube Shorts. One render, every platform.' },
  { icon: '\u{1F3A8}', title: 'Brand Customization', desc: 'Custom runway environments, lighting, music, and branding. White-label for agencies serving multiple fashion clients.' },
];

const PRICING = [
  { tier: 'Starter', price: 0, note: 'Free forever', features: ['5 garments', '3D runway viewer', 'Video recording', 'Basic analytics', '1 environment'], cta: 'Get Started Free', href: '/checkout?service=runway&tier=starter', popular: false },
  { tier: 'Creator', price: 49, note: '/mo', features: ['50 garments', 'AI content pipeline', '5 camera modes', 'Shopify integration', 'Social format export', 'Custom branding', 'Priority rendering'], cta: 'Start Free Trial', href: '/checkout?service=runway&tier=creator', popular: true },
  { tier: 'Studio', price: 149, note: '/mo', features: ['Unlimited garments', 'AI model generation', 'Avatar customization', 'A/B testing', 'API access', 'White-label', 'Priority support', 'Custom environments'], cta: 'Contact Sales', href: '/checkout?service=runway&tier=studio', popular: false },
];

const COMPETITORS = [
  { name: 'Echo Runway', runway: true, ai_content: true, video: true, widget: true, no_gpu: true, price: 'Free-$149' },
  { name: 'CATCHES', runway: false, ai_content: false, video: false, widget: true, no_gpu: false, price: 'Enterprise' },
  { name: 'Photoroom', runway: false, ai_content: true, video: false, widget: false, no_gpu: true, price: '$9-$49' },
  { name: 'Canva', runway: false, ai_content: true, video: true, widget: false, no_gpu: true, price: '$13-$30' },
  { name: 'SpreeAI', runway: false, ai_content: false, video: false, widget: false, no_gpu: false, price: 'Enterprise' },
];

const BREADCRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/engines' },
  { name: 'Echo Runway', href: '/runway' },
];

export default function RunwayPage() {
  const { isDark } = useTheme();

  return (
    <>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={BREADCRUMBS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Runway</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="https://echo-op.com/runway" target="_blank" className="px-4 py-2 rounded-lg font-semibold text-sm text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
            Live Demo
          </Link>
        </div>
      </nav>

      <div className="min-h-screen px-6 py-16 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-accent)' }}>
            AI Fashion Content Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            <span className="gradient-text">Echo Runway</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Real-time 3D fashion runway in the browser. AI content creation for fashion brands.
            Zero GPU servers. Under $35/month infrastructure.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="https://echo-op.com/runway" target="_blank" className="px-8 py-3 rounded-xl font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Try Live Demo
            </Link>
            <Link href="#pricing" className="px-8 py-3 rounded-xl font-bold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Pricing
            </Link>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: '<16ms', label: 'Render Time', sub: '60 FPS in browser' },
            { value: '$0', label: 'GPU Servers', sub: 'All client-side' },
            { value: '5-10', label: 'Content Assets', sub: 'Per product upload' },
            { value: '<5 min', label: 'Brand Setup', sub: 'Shopify auto-import' },
          ].map((s) => (
            <div key={s.label} className="text-center p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <p className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</p>
              <p className="font-semibold mt-1" style={{ color: 'var(--ept-text)' }}>{s.label}</p>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Features</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-start gap-4">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                  <p className="mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Competitor Comparison */}
        <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto mb-20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                {COMPETITORS.map((c) => (
                  <th key={c.name} className="text-center py-3 px-4 font-bold" style={{ color: c.name === 'Echo Runway' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['3D Runway', 'AI Content', 'Video Export', 'Embeddable Widget', 'No GPU Needed'].map((feature, i) => (
                <tr key={feature} className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--ept-text)' }}>{feature}</td>
                  {COMPETITORS.map((c) => {
                    const keys = ['runway', 'ai_content', 'video', 'widget', 'no_gpu'] as const;
                    const val = c[keys[i]];
                    return (
                      <td key={c.name} className="text-center py-3 px-4">
                        {val ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : <span style={{ color: 'var(--ept-text-muted)' }}>&#10007;</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                <td className="py-3 px-4 font-bold" style={{ color: 'var(--ept-text)' }}>Price</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="text-center py-3 px-4 font-bold" style={{ color: c.name === 'Echo Runway' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>
                    {c.price}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing */}
        <h2 id="pricing" className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {PRICING.map((p) => (
            <div
              key={p.tier}
              className={`p-6 rounded-xl border ${p.popular ? 'ring-2' : ''}`}
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                ['--tw-ring-color' as string]: 'var(--ept-accent)',
              }}
            >
              {p.popular && (
                <div className="text-xs font-bold uppercase tracking-wider mb-3 text-center" style={{ color: 'var(--ept-accent)' }}>
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-center" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="text-center my-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span>
                <span style={{ color: 'var(--ept-text-muted)' }}>{p.note}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className="block text-center px-6 py-3 rounded-xl font-semibold"
                style={{
                  backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent',
                  color: p.popular ? '#fff' : 'var(--ept-text-secondary)',
                  border: p.popular ? 'none' : '1px solid var(--ept-border)',
                }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4 mb-20 max-w-3xl mx-auto">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <span className="ml-2 transition-transform group-open:rotate-45" style={{ color: 'var(--ept-accent)' }}>+</span>
              </summary>
              <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-16 rounded-2xl border mb-12" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to revolutionize your fashion content?</h2>
          <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>See it in action — 3D runway, AI content creation, zero GPU cost.</p>
          <Link href="https://echo-op.com/runway" target="_blank" className="px-10 py-4 rounded-xl font-bold text-white text-lg" style={{ backgroundColor: 'var(--ept-accent)' }}>
            Launch Live Demo
          </Link>
        </div>
      </div>
    </>
  );
}
