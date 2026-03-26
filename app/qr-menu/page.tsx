'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { icon: 'Q', title: 'QR Code Generator', desc: 'Generate unique QR codes for each table, counter, or location. Bulk create up to 100 codes at once. Custom styling with your brand colors.' },
  { icon: 'M', title: 'Mobile-First Menus', desc: 'Beautiful, responsive menu pages optimized for phones. Customers scan and browse instantly — no app download needed.' },
  { icon: 'O', title: 'Table Ordering', desc: 'Customers place orders directly from the menu. Table number auto-detected from QR code. Orders appear in your dashboard in real-time.' },
  { icon: 'B', title: 'Full Branding', desc: 'Your logo, colors, fonts, and theme on every menu page. Light or dark mode. No third-party branding — it looks like your own app.' },
  { icon: 'C', title: 'Menu Categories', desc: 'Organize items into categories with descriptions and images. Multiple menus per restaurant (Lunch, Dinner, Drinks, Specials).' },
  { icon: 'I', title: 'Rich Item Details', desc: 'Photos, descriptions, prices, calories, prep time, spicy level, allergens, dietary tags (vegan/GF), variants, and modifiers per item.' },
  { icon: 'L', title: 'Multi-Language', desc: 'Serve menus in multiple languages. Item translations stored per-item. Auto-detect visitor language from browser.' },
  { icon: 'A', title: 'Scan Analytics', desc: 'Track every QR scan: device type, country, time of day, peak hours. Know which tables are busiest and when.' },
  { icon: 'W', title: 'WiFi Sharing', desc: 'Display your restaurant WiFi name and password right on the menu page. No more asking staff for the password.' },
  { icon: 'R', title: 'Reviews & Ratings', desc: 'Customers leave ratings and reviews for individual menu items. Average ratings displayed on the menu. Moderation dashboard.' },
  { icon: 'T', title: 'Time-Based Menus', desc: 'Set availability windows per menu — Breakfast 6-11am, Lunch 11-3pm, Dinner 5-10pm. Available days of the week. Auto-switch.' },
  { icon: 'X', title: 'AI Menu Builder', desc: 'Describe your cuisine and style — AI generates a complete menu with categories, items, descriptions, prices, and dietary info.' },
];

const COMPARE = [
  ['Feature', 'Echo QR Menu', 'MenuTiger', 'ScanMyMenu', 'QR Menu Creator'],
  ['Branded menu pages', 'All plans', 'Premium', 'All plans', 'Premium'],
  ['Table ordering', 'All plans', 'Premium', 'No', 'No'],
  ['Bulk QR generation', 'All plans', 'No', 'No', 'Premium'],
  ['Multi-language menus', 'All plans', 'Premium', 'All plans', 'No'],
  ['Allergen & dietary tags', 'All plans', 'All plans', 'All plans', 'All plans'],
  ['Scan analytics', 'All plans', 'Premium', 'Basic', 'No'],
  ['WiFi sharing on menu', 'All plans', 'No', 'No', 'No'],
  ['Customer reviews', 'All plans', 'No', 'No', 'No'],
  ['AI menu generation', 'All plans', 'No', 'No', 'No'],
  ['Time-based menus', 'All plans', 'Premium', 'No', 'No'],
  ['Item variants & modifiers', 'All plans', 'All plans', 'Premium', 'No'],
  ['Custom domain', 'Growth+', 'Enterprise', 'No', 'No'],
  ['API access', 'All plans', 'Enterprise', 'No', 'No'],
  ['Starting price', '$19/mo', '$49/mo', '$29/mo', '$24/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$19', per: '/mo', features: ['1 restaurant', '3 menus', '50 items', '25 QR codes', 'Branded menu pages', 'Table ordering', 'Scan analytics', 'WiFi sharing', 'API access'] },
  { name: 'Growth', price: '$49', per: '/mo', features: ['Everything in Starter', '3 restaurants', 'Unlimited menus & items', '100 QR codes', 'Multi-language', 'AI menu builder', 'Custom domain', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$99', per: '/mo', features: ['Everything in Growth', 'Unlimited restaurants', 'Unlimited QR codes', 'White-label', 'Webhook integrations', 'Menu export/import', 'Dedicated support', 'SLA guarantee'] },
];

export default function QrMenuPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=qr-menu&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">QR Menu</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Digital menus your customers actually love using.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=qr-menu&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Create Your Menu</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Replace Paper Menus for $19/month</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Paper menus cost $200-500 to reprint every time you change a price. Echo QR Menu updates instantly — change a price, add an item, swap a photo — and every table sees it immediately. No app download required. Customers scan, browse, and order from their phone.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>2s</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Scan to full menu — no app needed</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>0</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Reprinting costs — update anytime</p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-accent)' }}>61%</div>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Cheaper than MenuTiger ($19 vs $49/mo)</p>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything Your Restaurant Needs</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell.startsWith('All') || cell.startsWith('$19')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=qr-menu&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Do customers need to download an app?', a: 'No. Customers scan the QR code with their phone camera and the menu opens instantly in their browser. No app download, no signup, no friction. Works on every smartphone.' },
            { q: 'How do I update my menu?', a: 'Log in to your dashboard, change prices, add items, swap photos, update descriptions — changes are live instantly. Every customer who scans the QR code sees the updated menu immediately. No reprinting needed.' },
            { q: 'Can customers order from the menu?', a: 'Yes. Table ordering is built in. When a customer scans a table QR code, the table number is auto-detected. They browse the menu, select items, and submit their order. Orders appear in your dashboard in real-time.' },
            { q: 'How do QR codes work?', a: 'Each QR code links to a unique short URL (e.g., /m/ABC123). You can print the QR code on table tents, stickers, or receipts. We provide downloadable SVG files for high-quality printing at any size.' },
            { q: 'Can I have different menus for different times?', a: 'Yes. Create separate menus for Breakfast, Lunch, Dinner, Happy Hour, Weekend Brunch, etc. Set availability windows (e.g., Lunch 11am-3pm) and available days. The correct menu shows automatically based on the time.' },
            { q: 'Is the menu available in multiple languages?', a: 'Yes. Add translations for each menu item. The menu auto-detects the visitor\'s browser language and shows the appropriate translation. Perfect for tourist areas and international restaurants.' },
          ].map((item) => (
            <details key={item.q} className="p-4 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center" style={{ color: 'var(--ept-text)' }}>{item.q}<span className="text-lg" style={{ color: 'var(--ept-text-muted)' }}>+</span></summary>
              <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
