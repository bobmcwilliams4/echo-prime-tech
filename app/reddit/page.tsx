'use client'

import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import Image from 'next/image'
import Link from 'next/link'
import ProductTutorialButton from '../../components/product-tutorial-button'
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

export default function RedditPage() {
  const { isDark } = useTheme()
  const { user } = useAuth()

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: 'Subreddit Monitoring',
      description: 'Track unlimited subreddits in real-time. Monitor new posts, comments, upvotes, and emerging trends across your target communities.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Sentiment Analysis',
      description: 'AI-powered opinion mining with bullish/bearish scoring. Understand community sentiment on stocks, crypto, brands, and products.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Trend Detection',
      description: 'Identify rising topics and viral posts before they hit mainstream. Detect emerging narratives and shifting opinions early.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Brand Monitoring',
      description: 'Track mentions of your brand, product, or competitors across all of Reddit. Get instant alerts when your name comes up.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Crypto & Stock Signals',
      description: 'Monitor r/wallstreetbets, r/cryptocurrency, r/stocks with price correlation analysis. Catch pump signals before price movement.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Keyword Alerts',
      description: 'Real-time notifications for specific terms, phrases, or entities. Never miss a relevant conversation or opportunity.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Influencer Tracking',
      description: 'Monitor high-karma users, moderators, and opinion leaders. Track who drives conversations and shapes narratives.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: 'Data Export & API',
      description: 'REST API access, CSV/JSON export, webhook integration, and historical data archives. Build custom integrations with full API control.'
    }
  ]

  const tiers = [
    {
      name: 'Starter',
      price: 99,
      popular: false,
      features: [
        '10 subreddits',
        '50 keywords',
        'Daily digest email',
        'Basic sentiment analysis',
        'Email alerts',
        '7-day data retention'
      ]
    },
    {
      name: 'Professional',
      price: 299,
      popular: true,
      features: [
        '100 subreddits',
        '500 keywords',
        'Real-time monitoring',
        'Advanced sentiment AI',
        'API access (100K calls/mo)',
        'Webhook integration',
        'Influencer tracking',
        '90-day data retention',
        'Priority support'
      ]
    },
    {
      name: 'Enterprise',
      price: null,
      popular: false,
      features: [
        'Unlimited subreddits',
        'Unlimited keywords',
        'Custom AI models',
        'Dedicated infrastructure',
        'White-label reporting',
        'Historical archives (unlimited)',
        'SLA guarantee (99.9%)',
        'Dedicated account manager'
      ]
    }
  ]

  const steps = [
    { title: 'Set Keywords', description: 'Configure subreddits, keywords, and tracking parameters' },
    { title: 'AI Monitors', description: 'Our AI scans Reddit 24/7 in real-time across all your targets' },
    { title: 'Smart Analysis', description: 'Sentiment scoring, trend detection, influencer mapping' },
    { title: 'Actionable Insights', description: 'Receive alerts, reports, and data via API/email/webhook' }
  ]

  return (
    <div data-tutorial="reddit-hero" className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
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
          <span className="font-bold text-xl" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Login</Link>
              <Link href="/signup" className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          <span className="gradient-text">Reddit Intelligence Platform</span>
        </h1>
        <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Monitor subreddits, track trends, analyze sentiment, and capture market signals before they go mainstream.
          Your 24/7 Reddit intelligence engine powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout?service=reddit&tier=professional" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free Trial
          </Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
            See Features
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Complete Reddit Monitoring Suite
        </h2>
        <div data-tutorial="reddit-features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="mb-4" style={{ color: 'var(--ept-accent)' }}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 data-tutorial="reddit-pricing" className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Transparent Pricing
        </h2>
        <p className="text-center mb-12 text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
          Start with a 14-day free trial. No credit card required.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl border relative"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                borderWidth: tier.popular ? '2px' : '1px'
              }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
              <div className="mb-6">
                {tier.price ? (
                  <>
                    <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${tier.price}</span>
                    <span className="text-lg" style={{ color: 'var(--ept-text-muted)' }}>/month</span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Custom</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.price ? `/checkout?service=reddit&tier=${tier.name.toLowerCase()}` : '/contact'}
                className="block w-full px-6 py-3 rounded-xl font-semibold text-center"
                style={{
                  backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                  color: tier.popular ? '#fff' : 'var(--ept-text)',
                  border: tier.popular ? 'none' : '1px solid var(--ept-border)'
                }}
              >
                {tier.price ? 'Start Free Trial' : 'Contact Sales'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            <span className="gradient-text">Ready to Monitor Reddit?</span>
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Join businesses, traders, and marketers using Echo Reddit Monitor to stay ahead of trends and capture market signals.
          </p>
          <Link href="/checkout?service=reddit&tier=starter" className="inline-block px-10 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Your Free Trial
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            14-day trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>
    <ProductTutorialButton tutorialId="reddit" productName="Reddit Intelligence" />

      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Social Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['MKT', 'AI']}
          title="Ask the Social Intelligence Engine"
          placeholder="Ask about Reddit marketing, sentiment analysis..."
          exampleQueries={['Reddit API rate limits and best practices', 'How to analyze subreddit sentiment', 'Content marketing strategies for Reddit']}
        />
      </section>
    </div>
  )
}
