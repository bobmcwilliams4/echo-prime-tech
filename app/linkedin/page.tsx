'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProductTutorialButton from '../../components/product-tutorial-button'
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import { getBotHealth, getLinkedInStats, type BotHealth, type LinkedInStats } from '../../lib/bot-status-api'
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FAQS = [
  { q: 'How does the AI generate LinkedIn content?', a: 'Our AI analyzes your industry, target audience, and personal brand to create original thought leadership posts. It draws from 10 professional categories and adapts to your writing style over time, ensuring every post sounds authentically you.' },
  { q: 'Will LinkedIn flag my account for automation?', a: 'We operate within LinkedIn\'s acceptable use guidelines. All connection requests and posts go through an approval queue, and we use intelligent rate limiting to keep activity within safe thresholds. Your account stays protected.' },
  { q: 'Can I review posts before they go live?', a: 'Absolutely. Every piece of content enters your approval queue first. You can edit, reschedule, or reject any post before it publishes. Enterprise plans also support team review and compliance workflows.' },
  { q: 'How does lead generation work?', a: 'The system identifies decision-makers in your target industries by analyzing profile data, company information, and engagement patterns. Leads are enriched with contact details and exported directly to your CRM (HubSpot, Salesforce, or custom).' },
  { q: 'What kind of results can I expect?', a: 'Most users see a 3-5x increase in profile views and connection requests within the first month. Content engagement typically doubles, and lead generation campaigns average a 3x higher acceptance rate than manual outreach.' },
  { q: 'Is there a free trial?', a: 'Yes. All plans include a 14-day free trial with full feature access. No credit card required to start. You can downgrade or cancel anytime during the trial period.' },
];

export default function LinkedInPage() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const router = useRouter()
  const [health, setHealth] = useState<BotHealth | null>(null)
  const [stats, setStats] = useState<LinkedInStats | null>(null)

  useEffect(() => {
    getBotHealth('linkedin').then(setHealth).catch(() => {})
    getLinkedInStats().then(setStats).catch(() => {})
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: 'AI Content Creation',
      description: '10 professional categories including AI tech, startup wisdom, engineering leadership, oil & gas innovation. Thought leadership that positions you as an industry expert.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Smart Scheduling',
      description: 'Optimal posting times based on your network activity. Engagement-maximized scheduling that ensures maximum visibility when your audience is most active.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Connection Automation',
      description: 'Targeted outreach to decision-makers in your industry. Personalized connection requests that convert at 3x industry average. Smart follow-up sequences.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Lead Generation',
      description: 'Profile enrichment with company data, job titles, and contact info. Decision-maker identification across your target industries. Export to CRM with one click.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Analytics & ROI',
      description: 'Post performance tracking with engagement metrics. Profile views and connection growth. Lead conversion attribution. Monthly ROI reports delivered to your inbox.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Approval Workflow',
      description: 'Content queue with team review capabilities. Compliance-safe posting for regulated industries. Edit or reject before publish. Audit trail for all posted content.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Company Page Management',
      description: 'Multi-page support for companies with multiple brands. Employee advocacy tools to amplify reach. Brand consistency enforcement across all posts. Centralized analytics.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: 'CRM Integration',
      description: 'Native HubSpot and Salesforce sync. Custom CRM integrations available. Lead scoring based on engagement and profile data. Automatic contact enrichment in your CRM.'
    }
  ]

  const tiers = [
    {
      name: 'Starter',
      price: '$199',
      period: '/month',
      features: [
        '1 LinkedIn profile',
        '5 AI-generated posts per week',
        'Basic analytics dashboard',
        'Content category selection',
        'Standard scheduling',
        'Email support'
      ],
      cta: 'Start Growing',
      tier: 'starter',
      popular: false
    },
    {
      name: 'Professional',
      price: '$499',
      period: '/month',
      features: [
        '3 LinkedIn profiles',
        'Unlimited AI-generated posts',
        'Advanced analytics & ROI tracking',
        'Lead generation tools',
        'CRM integration (HubSpot/Salesforce)',
        'Approval workflow',
        'Connection automation',
        'Priority support'
      ],
      cta: 'Go Professional',
      tier: 'professional',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited LinkedIn profiles',
        'White-label solution',
        'Custom AI training on your brand',
        'Dedicated account manager',
        'Compliance tools for regulated industries',
        'Company page management',
        'Employee advocacy platform',
        'API access',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      tier: 'enterprise',
      popular: false
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Connect Profile',
      description: 'OAuth 2.0 secure connection to your LinkedIn account. No password sharing. Revoke access anytime.'
    },
    {
      number: '02',
      title: 'AI Creates Content',
      description: 'Our AI analyzes your industry, competitors, and audience. Generates professional thought leadership posts tailored to your voice.'
    },
    {
      number: '03',
      title: 'Review & Approve',
      description: 'Content goes to your approval queue. Edit, schedule, or reject. You stay in full control of what gets published.'
    },
    {
      number: '04',
      title: 'Grow Network',
      description: 'Posts publish on optimal schedule. Connection automation finds and engages decision-makers. Leads flow into your CRM automatically.'
    }
  ]

  const handleCheckout = (tier: string) => {
    if (tier === 'enterprise') {
      router.push('/support')
    } else if (user) {
      router.push(`/checkout?service=linkedin&tier=${tier}`)
    } else {
      router.push(`/signup?redirect=/checkout?service=linkedin&tier=${tier}`)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'LinkedIn Bot', href: '/linkedin' }]} />
      <FaqSchema faqs={FAQS} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={180}
            height={40}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section data-tutorial="linkedin-hero" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="gradient-text font-extrabold text-5xl md:text-6xl mb-6">
            LinkedIn AI Growth Engine
          </h1>
          <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            AI-powered content creation, connection automation, and lead generation for LinkedIn. Grow your professional network on autopilot while maintaining your authentic voice.
          </p>
          <button
            onClick={() => handleCheckout('professional')}
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Start 14-Day Free Trial
          </button>
        </div>
      </section>

      {/* Live Bot Status */}
      {(health || stats) && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Live Bot Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Status</div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: health?.status === 'ok' ? '#22c55e' : '#ef4444' }} />
                <span className="text-sm font-semibold" style={{ color: health?.status === 'ok' ? '#22c55e' : '#ef4444' }}>
                  {health?.status === 'ok' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Total Posts</div>
              <div className="text-2xl font-bold">{stats?.total ?? '—'}</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Published</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{stats?.posted ?? '—'}</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Impressions</div>
              <div className="text-2xl font-bold">{stats?.engagement?.total_impressions?.toLocaleString() ?? '—'}</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Engagement</div>
              <div className="text-2xl font-bold">{stats?.engagement ? (stats.engagement.total_likes + stats.engagement.total_comments + stats.engagement.total_shares).toLocaleString() : '—'}</div>
            </div>
          </div>
          {stats?.top_categories && stats.top_categories.length > 0 && (
            <div className="p-4 rounded-xl border mb-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xs font-medium mb-3" style={{ color: 'var(--ept-text-muted)' }}>Top Categories</div>
              <div className="flex flex-wrap gap-2">
                {stats.top_categories.slice(0, 6).map((cat, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                    {cat.category} ({cat.count})
                  </span>
                ))}
              </div>
            </div>
          )}
          {stats?.recent_posts && stats.recent_posts.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Recent Posts</div>
              {stats.recent_posts.slice(0, 3).map((post, i) => (
                <div key={i} className="p-4 rounded-xl border flex items-start justify-between gap-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--ept-text-secondary)' }}>{post.content?.slice(0, 140)}{(post.content?.length ?? 0) > 140 ? '...' : ''}</p>
                    <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      <span>{post.impressions?.toLocaleString() ?? 0} impressions</span>
                      <span>{post.likes ?? 0} likes</span>
                      <span>{post.comments ?? 0} comments</span>
                    </div>
                  </div>
                  {post.linkedin_url && (
                    <a href={post.linkedin_url} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Features Grid */}
      <section data-tutorial="linkedin-content" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Everything You Need to Dominate LinkedIn</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="mb-4" style={{ color: 'var(--ept-accent)' }}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section data-tutorial="linkedin-config" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl font-bold mb-4 opacity-20">{step.number}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section data-tutorial="linkedin-analytics" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Simple, Transparent Pricing</h2>
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{tier.period}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(tier.tier)}
                className="w-full px-6 py-3 rounded-xl font-semibold"
                style={{
                  backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                  color: tier.popular ? '#fff' : 'var(--ept-accent)',
                  border: tier.popular ? 'none' : '1px solid var(--ept-accent)'
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to 10x Your LinkedIn Presence?</h2>
        <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Join hundreds of professionals using AI to grow their networks, generate leads, and establish thought leadership.
        </p>
        <button
          onClick={() => handleCheckout('professional')}
          className="px-8 py-4 rounded-xl font-semibold text-lg"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          Start Free Trial — No Credit Card Required
        </button>
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

      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Marketing Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['BUS', 'MKT']}
          title="Ask the Marketing Intelligence Engine"
          placeholder="Ask about LinkedIn strategy, B2B marketing..."
          exampleQueries={['Optimal LinkedIn posting frequency for B2B', 'How to write engaging LinkedIn content', 'LinkedIn Sales Navigator best practices']}
        />
      </section>
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technologies. All rights reserved.</p>
      </footer>
      <ProductTutorialButton tutorialId="linkedin-bot" productName="LinkedIn Bot" />
    </div>
  )
}
