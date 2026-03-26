'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Multi-Warehouse', desc: 'Track stock across unlimited warehouses with per-location bin assignments, lot tracking, and expiry date management.' },
  { title: 'Purchase Orders', desc: 'Create, send, and receive POs with auto-incrementing numbers. Partial receiving support with automatic stock adjustment.' },
  { title: 'AI Demand Forecasting', desc: 'Engine Runtime analyzes 90-day movement history to predict demand, recommend restock quantities, and estimate days of stock remaining.' },
  { title: 'Barcode/SKU Lookup', desc: 'Instant product lookup by barcode or SKU. Full product details including stock levels across all warehouses.' },
  { title: 'Low-Stock Alerts', desc: 'Daily cron checks all products against reorder points. Automatic alerts for low-stock and out-of-stock items.' },
  { title: 'Inter-Warehouse Transfers', desc: 'Move stock between warehouses with full tracking. Pending → completed workflow with automatic stock adjustment.' },
  { title: 'Stocktaking', desc: 'Create stocktakes pre-populated with expected quantities. Count, record variances, and apply adjustments in one workflow.' },
  { title: 'Supplier Management', desc: 'Track suppliers with contact info, payment terms, lead times, and ratings. View order history per supplier.' },
  { title: 'Stock Movements Log', desc: 'Full audit trail of every stock change — receives, sales, adjustments, transfers, damages, returns, and stocktake variances.' },
  { title: 'Product Categories', desc: 'Hierarchical categories with parent-child relationships. Filter products by category, brand, or active status.' },
  { title: 'Inventory Valuation', desc: 'Real-time inventory value calculated from cost prices across all warehouses. Pending PO values tracked separately.' },
  { title: 'Analytics Dashboard', desc: 'Overview metrics, 30-day movement trends, and top-moving products. Low-stock and out-of-stock counts at a glance.' },
];

const PRICING = [
  { name: 'Starter', price: '$29', period: '/mo', features: ['1 warehouse', '500 products', 'Purchase orders', 'Stock alerts', 'Basic analytics'] },
  { name: 'Professional', price: '$79', period: '/mo', features: ['5 warehouses', 'Unlimited products', 'AI forecasting', 'Transfers', 'Stocktaking', 'Supplier management', 'Full analytics', 'API access'] },
  { name: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited warehouses', 'Unlimited products', 'AI forecasting', 'Lot & expiry tracking', 'Serial number tracking', 'Custom fields', 'Webhooks', 'Priority support', 'Multi-currency'] },
];

const FAQS = [
  { q: 'How does AI demand forecasting work?', a: 'Echo Inventory analyzes your historical sales data, seasonal patterns, and current stock levels to predict future demand. It recommends reorder points and quantities so you never overstock or run out.' },
  { q: 'Can I manage multiple warehouses?', a: 'Yes. Each warehouse has its own inventory counts, bin locations, and staff. Transfer stock between locations with full tracking. Reports can be filtered by location or viewed globally.' },
  { q: 'How does barcode/SKU scanning work?', a: 'Generate and print barcodes for any product. Scan with any USB or Bluetooth barcode reader to instantly pull up product details, adjust quantities, or process receiving. Works with existing barcode hardware.' },
  { q: 'What happens when stock runs low?', a: 'Configurable low-stock alerts trigger when inventory drops below your set threshold. Notifications go via email, webhook, or in-app alert. AI can auto-generate purchase orders for critical items.' },
  { q: 'Can I track inventory across sales channels?', a: 'Yes. Connect Shopify, WooCommerce, Amazon, or any platform via API. Sales on any channel automatically decrement inventory. Overselling protection prevents selling items you don\'t have.' },
  { q: 'Is there a free plan?', a: 'The Starter plan includes up to 500 SKUs and 1 warehouse for free. Growth supports 5,000 SKUs across 3 warehouses. Enterprise is unlimited with advanced analytics and custom integrations.' },
];

export default function InventoryPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Inventory', href: '/inventory' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI INVENTORY MANAGEMENT</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6"><span className="gradient-text">Echo Inventory</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Multi-warehouse stock tracking, AI demand forecasting, purchase orders, and barcode management.
          Know what you have, where it is, and when to reorder.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout?service=inventory&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Pricing</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ val: '70+', label: 'API Endpoints' }, { val: '15', label: 'Database Tables' }, { val: '3', label: 'Analytics Views' }, { val: '24/7', label: 'Low-Stock Alerts' }].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Complete Inventory Control</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover animate-fade-up" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${i * 50}ms` }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>No per-user fees. No hidden costs. Cancel anytime.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className={`p-6 rounded-xl border ${i === 1 ? 'ring-2 ring-[--ept-accent]' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{p.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=inventory&tier=${p.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>
                {i === 0 ? 'Start Free' : 'Get Started'}
              </Link>
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

      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Stop Guessing. Start Knowing.</h2>
          <p className="mb-6" style={{ color: 'var(--ept-text-secondary)' }}>Real-time stock levels, AI-powered forecasting, and automatic reorder alerts — all in one platform.</p>
          <Link href="/checkout?service=inventory&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
        </div>
      </section>
    </div>
  );
}
