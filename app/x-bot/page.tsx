'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import ProductTutorialButton from '../../components/product-tutorial-button'
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import { getBotHealth, getXBotStats, type BotHealth, type XBotStats } from '../../lib/bot-status-api'
import FaqSchema from '../../components/FaqSchema'
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

export default function XBotPage() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [health, setHealth] = useState<BotHealth | null>(null)
  const [stats, setStats] = useState<XBotStats | null>(null)

  useEffect(() => {
    getBotHealth('x-bot').then(setHealth).catch(() => {})
    getXBotStats().then(setStats).catch(() => {})
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI Content Generation',
      description: '14 AI personalities create contextual posts with industry-specific voice and tone. Never sound like a bot again.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Grok Image Generation',
      description: 'AI-generated images with every post. Visual engagement boost from xAI Grok integration. Eye-catching content that stands out.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Smart Scheduling',
      description: 'Optimal posting times based on your audience. Timezone awareness and engagement maximization. Set it and forget it.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
      title: 'Thread Generation',
      description: 'Multi-tweet threads with story arcs. Educational content series. Break complex topics into engaging bite-sized posts.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: 'Engagement Automation',
      description: 'Auto-reply to mentions and comments. Quote tweets with AI-generated insights. Community interaction on autopilot.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Analytics Dashboard',
      description: 'Impression tracking, engagement rates, follower growth. ROI metrics and performance insights. Know what works.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Multi-Account Management',
      description: 'Manage multiple X accounts from one dashboard. Brand accounts, personal accounts, client accounts. All in one place.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Content Calendar',
      description: 'Pre-plan weeks of content. Approval workflows for teams. Collaboration tools. Never run out of content ideas.'
    }
  ]

  const tiers = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 199 : 159,
      period: billingCycle === 'monthly' ? '/month' : '/month (billed annually)',
      popular: false,
      features: [
        '1 X/Twitter account',
        '10 posts per day',
        'Basic analytics dashboard',
        '3 AI personalities',
        'Smart scheduling',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 499 : 399,
      period: billingCycle === 'monthly' ? '/month' : '/month (billed annually)',
      popular: true,
      features: [
        '3 X/Twitter accounts',
        'Unlimited posts per day',
        'Grok AI image generation',
        'Thread generation',
        'All 14 AI personalities',
        'Advanced analytics + insights',
        'Engagement automation',
        'Content calendar',
        'Priority support'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      popular: false,
      features: [
        'Unlimited X/Twitter accounts',
        'White-label dashboard',
        'Custom AI personality training',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment option'
      ]
    }
  ]

  const FAQS = [
    {
      q: 'Is Echo X Bot compliant with X/Twitter API terms of service?',
      a: 'Yes. Echo X Bot uses the official X API v2 with OAuth 2.0 authentication. All posting, engagement, and analytics features operate within X platform rate limits and usage policies. We monitor API policy changes and update our systems accordingly.'
    },
    {
      q: 'How does the AI content generation work?',
      a: 'Our 14 AI personalities are trained on industry-specific language patterns and brand voice profiles. You configure your niche, tone, and content categories, then the AI generates original posts, threads, and replies tailored to your audience. Every piece of content can be reviewed before publishing or set to autopilot.'
    },
    {
      q: 'Can I customize my posting schedule?',
      a: 'Absolutely. You can set specific posting times, frequency caps, and timezone-aware schedules. Our smart scheduling engine also analyzes your audience engagement patterns to recommend optimal posting windows for maximum reach and impressions.'
    },
    {
      q: 'How does engagement automation differ from spam?',
      a: 'Echo X Bot uses contextual AI to craft genuine, relevant replies to mentions, comments, and trending conversations in your niche. Responses are unique, on-brand, and indistinguishable from human interaction. We enforce rate limits and sentiment analysis to ensure every interaction adds value.'
    },
    {
      q: 'What analytics and tracking are available?',
      a: 'The analytics dashboard tracks impressions, engagement rate, follower growth, link clicks, profile visits, and post performance over time. You get daily and weekly reports, A/B testing insights on content types, and ROI metrics tied to your posting strategy.'
    },
    {
      q: 'Can I manage multiple X accounts from one dashboard?',
      a: 'Yes. The Professional plan supports up to 3 accounts and Enterprise supports unlimited accounts. Each account gets its own AI personality configuration, posting schedule, and analytics view. Perfect for agencies, brands with multiple handles, or creators managing personal and business accounts.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Connect Account',
      description: 'Link your X/Twitter account via OAuth. Secure, no password sharing. Full API access.'
    },
    {
      number: '02',
      title: 'Configure AI',
      description: 'Choose AI personalities, content categories, posting frequency. Set your brand voice and tone.'
    },
    {
      number: '03',
      title: 'Schedule Content',
      description: 'AI generates content based on your settings. Review and approve, or let it run on autopilot.'
    },
    {
      number: '04',
      title: 'Grow Audience',
      description: 'Watch engagement metrics climb. Follower growth, impressions, and reach all on autopilot.'
    }
  ]

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'X Bot', href: '/x-bot' }]} />
      <FaqSchema faqs={FAQS} />
      {/* Navigation */}
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
          <Link href="/pricing" className="hover:opacity-80" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section data-tutorial="xbot-hero" className="px-6 py-24 text-center max-w-5xl mx-auto">
        <h1 className="gradient-text font-extrabold text-5xl md:text-7xl mb-6">
          X/Twitter AI Content Engine
        </h1>
        <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          14 AI personalities. Grok-powered images. Unlimited posts. Zero effort. Grow your X audience on autopilot.
        </p>
        <Link
          href="/checkout?service=x-bot&tier=professional"
          className="inline-block px-8 py-4 rounded-xl font-semibold text-lg"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          Start Free Trial
        </Link>
      </section>

      {/* Live Bot Status */}
      {(health || stats) && (
        <section className="px-6 py-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: health?.status === 'healthy' ? '#22c55e' : '#ef4444' }} />
                <span className="text-xs font-semibold" style={{ color: health?.status === 'healthy' ? '#22c55e' : '#ef4444' }}>
                  {health?.status === 'healthy' ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>v{health?.version || '—'}</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{stats?.total_posts ?? '—'}</div>
              <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Total Posts</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{stats?.posts_today ?? '—'}</div>
              <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Posts Today</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{stats?.mentions_replied ?? '—'}</div>
              <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Mentions Replied</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{stats?.threads_posted ?? '—'}</div>
              <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Threads</div>
            </div>
          </div>
          {stats?.recent && stats.recent.length > 0 && (
            <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--ept-text-secondary)' }}>Latest Posts</div>
              <div className="space-y-2">
                {stats.recent.slice(0, 3).map((post, i) => (
                  <a key={i} href={post.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg border hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
                    <div className="text-sm line-clamp-2" style={{ color: 'var(--ept-text)' }}>{post.text}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
                      <span>{post.category}</span>
                      <span>{new Date(post.posted_at).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Features Grid */}
      <section data-tutorial="xbot-feed" className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Everything You Need to Dominate X
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="mb-4" style={{ color: 'var(--ept-accent)' }}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section data-tutorial="xbot-config" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
              >
                {step.number}
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--ept-text)' }}>
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section data-tutorial="xbot-analytics" className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
          Simple, Transparent Pricing
        </h2>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span style={{ color: billingCycle === 'monthly' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-14 h-7 rounded-full transition-colors"
            style={{ backgroundColor: billingCycle === 'annual' ? 'var(--ept-accent)' : 'var(--ept-border)' }}
          >
            <div
              className="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform"
              style={{ transform: billingCycle === 'annual' ? 'translateX(30px)' : 'translateX(4px)' }}
            />
          </button>
          <span style={{ color: billingCycle === 'annual' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>
            Annual <span style={{ color: 'var(--ept-accent)' }}>(Save 20%)</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className="p-8 rounded-xl border relative"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                borderWidth: tier.popular ? '2px' : '1px'
              }}
            >
              {tier.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>
                  {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                </span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.price === 'Custom' ? '/contact' : `/checkout?service=x-bot&tier=${tier.name.toLowerCase()}`}
                className="block w-full text-center px-6 py-3 rounded-xl font-semibold"
                style={{
                  backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                  color: tier.popular ? '#fff' : 'var(--ept-accent)',
                  border: tier.popular ? 'none' : '2px solid var(--ept-accent)'
                }}
              >
                {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ready to Grow Your X Audience?
        </h2>
        <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Join hundreds of creators and businesses using Echo X Bot to scale their X presence. 14-day free trial. No credit card required.
        </p>
        <Link
          href="/checkout?service=x-bot&tier=professional"
          className="inline-block px-8 py-4 rounded-xl font-semibold text-lg"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          Start Free Trial
        </Link>
      </section>

      {/* Footer */}
      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Social Media Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['MKT', 'AI']}
          title="Ask the Social Media Intelligence Engine"
          placeholder="Ask about X/Twitter automation, engagement..."
          exampleQueries={['X API v2 rate limits and best practices', 'How to grow engagement on X organically', 'Content scheduling strategies']}
        />
      </section>

      {/* FAQ */}
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

      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technologies. All rights reserved.</p>
      </footer>
      <ProductTutorialButton tutorialId="x-bot" productName="X/Twitter Bot" />
    </div>
  )
}
