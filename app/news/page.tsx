'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'

export default function NewsPage() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const [activeTier, setActiveTier] = useState<'starter' | 'professional' | 'enterprise'>('professional')

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Real-Time News Monitoring',
      description: '10,000+ sources including RSS feeds, news APIs, and web scraping. Sub-minute latency from publication to ingestion.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'AI Summarization',
      description: 'GPT-powered article summaries with key takeaway extraction. Multi-paragraph articles condensed to 3-sentence summaries.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Sentiment Analysis',
      description: 'Market sentiment scoring from -100 (bearish) to +100 (bullish). Trend detection and opinion tracking across time.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: 'Topic Clustering',
      description: 'Auto-categorize news by topic, entity, and industry. AI-powered classification with 95%+ accuracy.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Custom Alerts',
      description: 'Keyword, company, and industry monitoring with Telegram, email, webhook, and SMS delivery. Real-time and digest modes.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Competitive Intelligence',
      description: 'Track competitor mentions, product launches, PR activity, executive quotes. Full-text search across all articles.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Financial News Feed',
      description: 'Earnings reports, M&A announcements, IPO filings, regulatory submissions. SEC Edgar integration for instant filing alerts.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'API Access',
      description: 'REST API with OpenAPI spec, webhook callbacks for real-time events, bulk export (CSV/JSON), historical data access back to 2020.'
    }
  ]

  const tiers = {
    starter: {
      name: 'Starter',
      price: 149,
      popular: false,
      features: [
        '100 tracked keywords',
        '5,000 articles/day',
        'Email alerts',
        'Daily digest',
        'Web dashboard',
        '7-day history',
        'Standard support'
      ]
    },
    professional: {
      name: 'Professional',
      price: 399,
      popular: true,
      features: [
        '500 tracked keywords',
        '50,000 articles/day',
        'Real-time alerts (Telegram/Email/Webhook)',
        'API access (10K req/day)',
        'Sentiment scoring',
        'Topic clustering',
        '90-day history',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: null,
      popular: false,
      features: [
        'Unlimited tracked keywords',
        'Custom source integration',
        'Dedicated news feed',
        'White-label API',
        'Historical data (unlimited)',
        'Custom AI models',
        'SLA guarantee (99.9%)',
        'Dedicated account manager'
      ]
    }
  }

  const steps = [
    {
      number: 1,
      title: 'Configure Sources',
      description: 'Select topics, keywords, companies, and industries to monitor. Choose alert frequency and delivery channels.'
    },
    {
      number: 2,
      title: 'AI Processes',
      description: 'Our AI reads and categorizes every article in real-time. Sentiment scoring, entity extraction, and topic clustering happen automatically.'
    },
    {
      number: 3,
      title: 'Smart Alerts',
      description: 'Get notified instantly for high-priority news via Telegram, email, or webhook. Daily digests for low-priority updates.'
    },
    {
      number: 4,
      title: 'Actionable Intelligence',
      description: 'Use the web dashboard or API to explore trends, track competitors, and make data-driven decisions.'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={40}
            height={40}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
          <span className="text-xl font-bold">Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="font-medium hover:opacity-80" style={{ color: 'var(--ept-text-secondary)' }}>
            Pricing
          </Link>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
          <span className="gradient-text">AI-Powered News Intelligence</span>
        </h1>
        <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Monitor 10,000+ sources in real-time. AI summarization, sentiment analysis, and custom alerts for competitive intelligence.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/checkout?service=news&tier=starter"
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Start Free Trial
          </Link>
          <Link
            href="#pricing"
            className="px-8 py-4 rounded-xl font-semibold text-lg border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--ept-text)' }}>
          Everything You Need for News Intelligence
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border hover:scale-105 transition-transform"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="mb-4" style={{ color: 'var(--ept-accent)' }}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--ept-text)' }}>
          Choose Your Plan
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(tiers).map(([key, tier]) => (
            <div
              key={key}
              className={`p-8 rounded-xl border ${tier.popular ? 'ring-2' : ''}`}
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                ...(tier.popular ? { boxShadow: '0 0 0 2px var(--ept-accent)' } : {})
              }}
            >
              {tier.popular && (
                <div className="text-center mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                {tier.name}
              </h3>
              <div className="mb-6">
                {tier.price ? (
                  <>
                    <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
                      ${tier.price}
                    </span>
                    <span className="text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
                      /month
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
                    Custom
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.price ? `/checkout?service=news&tier=${key}` : '/contact'}
                className="w-full block text-center px-6 py-3 rounded-xl font-semibold"
                style={{
                  backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                  color: tier.popular ? '#fff' : 'var(--ept-accent)',
                  border: tier.popular ? 'none' : '1px solid var(--ept-accent)'
                }}
              >
                {tier.price ? 'Start Free Trial' : 'Contact Sales'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--ept-text)' }}>
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
              >
                {step.number}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          Start Monitoring News in Minutes
        </h2>
        <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          14-day free trial. No credit card required. Cancel anytime.
        </p>
        <Link
          href="/checkout?service=news&tier=starter"
          className="inline-block px-10 py-4 rounded-xl font-semibold text-lg"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          Start Free Trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <p style={{ color: 'var(--ept-text-muted)' }}>
          © 2026 Echo Prime Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
