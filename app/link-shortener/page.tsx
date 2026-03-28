'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'S', title: 'Custom Short URLs', desc: 'Create branded short links with custom slugs — or let us auto-generate clean 6-character codes' },
  { icon: 'A', title: 'Click Analytics', desc: 'Track every click with geographic location, device type, browser, OS, and referrer data' },
  { icon: 'Q', title: 'QR Code Generation', desc: 'Auto-generated QR codes for every link — download as SVG for print or digital use' },
  { icon: 'U', title: 'UTM Builder', desc: 'Auto-append UTM parameters (source, medium, campaign) to destination URLs for tracking' },
  { icon: 'P', title: 'Password Protection', desc: 'Lock links behind a password — perfect for exclusive content, beta invites, or private documents' },
  { icon: 'E', title: 'Link Expiration', desc: 'Set expiration dates or maximum click counts — links auto-disable when limits are reached' },
  { icon: 'B', title: 'Bulk Creation', desc: 'Create up to 100 short links in a single API call — perfect for marketing campaigns' },
  { icon: 'G', title: 'Geographic Insights', desc: 'See which countries, cities, and regions your clicks come from with interactive maps' },
  { icon: 'D', title: 'Device Analytics', desc: 'Breakdown by desktop, mobile, and tablet — plus browser and OS distribution charts' },
  { icon: 'R', title: 'Referrer Tracking', desc: 'Know exactly where your traffic comes from — social media, email, search, or direct' },
  { icon: 'T', title: 'Tags & Organization', desc: 'Organize links with color-coded tags — filter and search across thousands of links' },
  { icon: 'C', title: 'Custom Domains', desc: 'Use your own domain (links.yourcompany.com) for branded short URLs with free SSL' },
];

const COMPARE = [
  ['Feature', 'Echo Links', 'Bitly', 'Short.io'],
  ['Short links', 'Unlimited', '10/mo free', '1,000/mo'],
  ['Custom slugs', 'All plans', 'All plans', 'All plans'],
  ['Click analytics', 'All plans', 'Free (basic)', 'All plans'],
  ['QR codes', 'All plans', 'Paid', 'All plans'],
  ['UTM builder', 'All plans', 'Paid', 'Paid'],
  ['Password protection', 'All plans', 'Enterprise', 'Paid'],
  ['Link expiration', 'All plans', 'Enterprise', 'Paid'],
  ['Bulk creation', 'All plans', 'Enterprise', 'Pro+'],
  ['Geographic data', 'All plans', 'Paid', 'Paid'],
  ['Device analytics', 'All plans', 'Paid', 'Paid'],
  ['Custom domains', 'Pro+', 'Paid', 'All plans'],
  ['API access', 'All plans', 'All plans', 'All plans'],
  ['Starting price', '$9/mo', '$35/mo', '$25/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$9', per: '/mo', features: ['500 links', '10K clicks/day', 'Custom slugs', 'Click analytics', 'QR codes', 'UTM builder', 'Password protection'] },
  { name: 'Pro', price: '$29', per: '/mo', features: ['5,000 links', '100K clicks/day', 'Custom domains', 'Link expiration', 'Bulk creation', 'Geographic insights', 'Priority support'], popular: true },
  { name: 'Business', price: '$79', per: '/mo', features: ['Unlimited links', 'Unlimited clicks', 'Multiple custom domains', 'API access', 'Team management', 'Export reports', 'Dedicated support'] },
];

const FAQS = [
  { q: 'Can I use custom short domains?', a: 'Yes. Connect your own domain (e.g., go.yourcompany.com) via CNAME record. All shortened links use your branded domain instead of ours. Available on Growth and Enterprise plans.' },
  { q: 'What analytics do I get per link?', a: 'Total clicks, unique clicks, clicks by country, city, device type, browser, operating system, and referrer source. Time-series charts show click trends over days, weeks, or months.' },
  { q: 'Can links expire?', a: 'Yes. Set an expiration date/time or a maximum click count. After expiry, the link shows a configurable "Link Expired" page or redirects to a fallback URL.' },
  { q: 'Do you generate QR codes?', a: 'Yes. Every shortened link gets a free QR code. Download as PNG or SVG at any resolution. QR codes work for print materials, signage, business cards, and packaging.' },
  { q: 'Can I edit a link after creating it?', a: 'Yes. Change the destination URL, slug, tags, or expiration at any time. The short URL stays the same — only the destination changes. Click analytics are preserved.' },
  { q: 'Is there a bulk creation option?', a: 'Yes. Upload a CSV with destination URLs and optional custom slugs. Create hundreds of links at once. Bulk export all links with analytics for reporting.' },
];

export default function LinkShortenerPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Link Shortener', href: '/link-shortener' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=link-shortener&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Link Shortener</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Shorten. Track. Optimize. Every click tells a story.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=link-shortener&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      {/* Demo */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Sub-Millisecond Redirects</h3>
          <p className="mb-2" style={{ color: 'var(--ept-text-secondary)' }}>Powered by Cloudflare&apos;s global edge network with KV-cached lookups</p>
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>300+ data centers worldwide. Your links load instantly, everywhere.</p>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything for Link Management</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              {COMPARE[0].map((h, i) => <th key={i} className="px-4 py-3 text-left font-bold" style={{ color: 'var(--ept-text)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {COMPARE.slice(1).map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--ept-border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Unlimited' || cell.startsWith('All') || cell.startsWith('$9')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: t.popular ? 2 : 1 }}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.per}</span></div>
              <ul className="space-y-2 mb-6">{t.features.map((f) => <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=link-shortener&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Shorten Your First Link?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Track every click with branded short URLs and real-time analytics.</p>
        <TrialCTA serviceId="echo-link-shortener" tier="starter" productName="Echo Link Shortener" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
