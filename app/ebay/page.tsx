'use client'

import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import Link from 'next/link'
import Image from 'next/image'

export default function EbayPage() {
  const { isDark } = useTheme()
  const { user } = useAuth()

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={40}
            height={40}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
          <span className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-lg font-medium"
            style={{ color: 'var(--ept-text)' }}
          >
            Pricing
          </Link>
          <Link
            href={user ? '/dashboard' : '/login'}
            className="px-6 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            {user ? 'Dashboard' : 'Get Started'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-6xl mx-auto">
        <h1 className="gradient-text font-extrabold text-5xl md:text-6xl mb-6">
          eBay Automation Platform
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Automate your entire eBay operation. Bulk listing management, dynamic repricing, inventory sync, and order fulfillment—all from one powerful dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout?service=ebay&tier=professional"
            className="px-8 py-4 rounded-xl font-bold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Start Free Trial
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 rounded-xl font-bold text-lg border"
            style={{ borderColor: 'var(--ept-card-border)', color: 'var(--ept-text)' }}
          >
            See Features
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Everything You Need to Scale on eBay
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Bulk Listing Management</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Create, update, or end thousands of listings at once. CSV imports, template cloning, and batch editing tools.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Inventory Sync</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Real-time stock levels across eBay, Amazon, Shopify, and your warehouse. Prevent overselling with auto-sync.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Dynamic Repricing</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              AI-powered competitive pricing with margin protection. Win the Buy Box while maximizing profit.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Order Management</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Automated fulfillment workflows, tracking updates, and buyer communication. Ship faster, work less.
            </p>
          </div>

          {/* Feature 5 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Analytics & Reporting</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Sales velocity, profit margins, best sellers, and seasonal trends. Make data-driven decisions.
            </p>
          </div>

          {/* Feature 6 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Template Engine</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Professional listing templates with A/B testing and SEO optimization. Higher conversion rates, more sales.
            </p>
          </div>

          {/* Feature 7 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Returns & Disputes</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Automated return processing, dispute resolution workflows, and refund tracking. Protect your metrics.
            </p>
          </div>

          {/* Feature 8 */}
          <div
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Multi-Store Support</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Manage multiple eBay stores from one dashboard. Separate analytics, unified workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          14-day free trial. No credit card required. Cancel anytime.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter */}
          <div
            className="p-8 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Starter</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: 'var(--ept-accent)' }}>$149</span>
              <span style={{ color: 'var(--ept-text-muted)' }}>/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>1 eBay store</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Up to 1,000 listings</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Basic analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Email support</span>
              </li>
            </ul>
            <Link
              href="/checkout?service=ebay&tier=starter"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold border"
              style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}
            >
              Start Free Trial
            </Link>
          </div>

          {/* Professional */}
          <div
            className="p-8 rounded-xl border-2 relative"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Professional</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: 'var(--ept-accent)' }}>$399</span>
              <span style={{ color: 'var(--ept-text-muted)' }}>/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Up to 3 eBay stores</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Up to 10,000 listings</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Dynamic repricing</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>API access</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Priority support</span>
              </li>
            </ul>
            <Link
              href="/checkout?service=ebay&tier=professional"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div
            className="p-8 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Unlimited stores</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Unlimited listings</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Custom integrations</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: 'var(--ept-text-muted)' }}>99.9% uptime SLA</span>
              </li>
            </ul>
            <Link
              href="/checkout?service=ebay&tier=enterprise"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold border"
              style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Get Started in Minutes
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              1
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Connect Store</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Link your eBay account with secure OAuth. Takes 30 seconds.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              2
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Import Inventory</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Sync existing listings or upload new inventory via CSV.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              3
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Configure Rules</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Set pricing rules, fulfillment workflows, and automation triggers.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              4
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Automate Everything</h3>
            <p style={{ color: 'var(--ept-text-muted)' }}>
              Sit back and watch orders flow in while automation handles the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ready to Scale Your eBay Business?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Join hundreds of sellers automating their eBay operations with Echo Prime Technologies.
        </p>
        <Link
          href="/checkout?service=ebay&tier=starter"
          className="inline-block px-10 py-4 rounded-xl font-bold text-lg"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          Start Your Free Trial
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-6 py-8 text-center"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}
      >
        <p style={{ color: 'var(--ept-text-muted)' }}>
          © 2026 Echo Prime Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
