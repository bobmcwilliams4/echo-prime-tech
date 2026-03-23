'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { useTheme } from '../../../lib/theme-context';
import { SDK_TIERS } from '../../../lib/sdk-api';

const ANNUAL_DISCOUNT = 0.20;

const COMPARISON_FEATURES = [
  { feature: 'Daily query limit', free: '100', pro: '10,000', enterprise: 'Unlimited' },
  { feature: 'All 17 endpoints', free: true, pro: true, enterprise: true },
  { feature: '5,486+ engines', free: true, pro: true, enterprise: true },
  { feature: '940+ domains', free: true, pro: true, enterprise: true },
  { feature: 'Brain memory', free: true, pro: true, enterprise: true },
  { feature: 'Knowledge search', free: true, pro: true, enterprise: true },
  { feature: 'Priority routing', free: false, pro: true, enterprise: true },
  { feature: 'Webhook callbacks', free: false, pro: true, enterprise: true },
  { feature: 'Usage analytics', free: false, pro: true, enterprise: true },
  { feature: 'Email support', free: false, pro: true, enterprise: true },
  { feature: 'Dedicated routing', free: false, pro: false, enterprise: true },
  { feature: '24/7 phone support', free: false, pro: false, enterprise: true },
  { feature: 'SLA guarantee (99.9%)', free: false, pro: false, enterprise: true },
  { feature: 'Custom domains', free: false, pro: false, enterprise: true },
  { feature: 'Dedicated account manager', free: false, pro: false, enterprise: true },
];

const FAQ = [
  {
    q: 'What counts as a query?',
    a: 'Every request to an authenticated endpoint counts as one query. Health checks and the OpenAPI spec endpoint are free and do not count.',
  },
  {
    q: 'When do daily limits reset?',
    a: 'Daily query limits reset at midnight UTC (6pm CST / 7pm CDT).',
  },
  {
    q: 'Can I use multiple API keys?',
    a: 'Yes. All keys share the same account-level tier and daily quota.',
  },
  {
    q: 'What happens if I exceed my limit?',
    a: 'Requests return HTTP 429 with a Retry-After header. Upgrade your tier or wait for the daily reset.',
  },
  {
    q: 'Is there a free trial of Pro?',
    a: 'The free tier is your trial. It gives full access to all 17 endpoints and 5,486+ engines — just with a lower daily limit. Upgrade anytime.',
  },
  {
    q: 'Can I downgrade?',
    a: 'Yes. Downgrade anytime from your account settings. Changes take effect at the next billing cycle.',
  },
];

export default function SDKPricingPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (monthly: number): number => {
    if (monthly === 0) return 0;
    return billing === 'annual' ? Math.round(monthly * (1 - ANNUAL_DISCOUNT)) : monthly;
  };

  const tiers = [
    { key: 'free' as const, ...SDK_TIERS.free, popular: false },
    { key: 'pro' as const, ...SDK_TIERS.pro, popular: true },
    { key: 'enterprise' as const, ...SDK_TIERS.enterprise, popular: false },
  ];

  const cardStyle: React.CSSProperties = {
    background: 'var(--ept-card-bg)',
    border: '1px solid var(--ept-card-border)',
    borderRadius: 12,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={{ color: 'var(--ept-text)' }}>
      {/* Header */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>SDK Pricing</h1>
        <p style={{ fontSize: 18, opacity: 0.7, marginBottom: 32 }}>
          Start free. Scale as you grow. All plans include full access to every endpoint.
        </p>

        {/* Billing toggle */}
        <div
          style={{
            display: 'inline-flex',
            gap: 0,
            borderRadius: 8,
            border: '1px solid var(--ept-card-border)',
            overflow: 'hidden',
          }}
        >
          {(['monthly', 'annual'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: billing === b ? 600 : 400,
                background: billing === b ? 'var(--ept-accent)' : 'transparent',
                color: billing === b ? '#fff' : 'var(--ept-text)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {b === 'annual' ? `Annual (${ANNUAL_DISCOUNT * 100}% off)` : 'Monthly'}
            </button>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {tiers.map((tier) => {
            const price = getPrice(tier.price);
            return (
              <div
                key={tier.key}
                style={{
                  ...cardStyle,
                  borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  position: 'relative',
                }}
              >
                {tier.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--ept-accent)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 14px',
                      borderRadius: 20,
                      letterSpacing: '0.5px',
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{tier.name}</div>

                <div style={{ marginBottom: 16 }}>
                  {tier.price === 0 ? (
                    <span style={{ fontSize: 40, fontWeight: 800 }}>Free</span>
                  ) : tier.dailyLimit === -1 ? (
                    <div>
                      <span style={{ fontSize: 40, fontWeight: 800 }}>${price}</span>
                      <span style={{ opacity: 0.6, fontSize: 15 }}>/mo</span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: 40, fontWeight: 800 }}>${price}</span>
                      <span style={{ opacity: 0.6, fontSize: 15 }}>/mo</span>
                      {billing === 'annual' && tier.price > 0 && (
                        <div style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}>
                          <s>${tier.price}/mo</s> · Save ${(tier.price - price) * 12}/yr
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 20 }}>
                  {tier.dailyLimit === -1 ? 'Unlimited' : tier.dailyLimit.toLocaleString()} queries/day
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontSize: 14,
                        padding: '6px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ color: '#22c55e', fontSize: 16 }}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {tier.key === 'free' ? (
                  <Link href="/sdk/signup">
                    <button
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 8,
                        border: '1px solid var(--ept-card-border)',
                        background: 'transparent',
                        color: 'var(--ept-text)',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Get Started Free
                    </button>
                  </Link>
                ) : tier.key === 'enterprise' ? (
                  <Link href="/support">
                    <button
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 8,
                        border: '1px solid var(--ept-card-border)',
                        background: 'transparent',
                        color: 'var(--ept-text)',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Contact Sales
                    </button>
                  </Link>
                ) : (
                  <Link href={user ? `/checkout?service=sdk-gateway&tier=${tier.key}` : `/signup?redirect=${encodeURIComponent(`/checkout?service=sdk-gateway&tier=${tier.key}`)}`}>
                    <button
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'var(--ept-accent)',
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Upgrade to Pro
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
          Feature comparison
        </h2>
        <div
          style={{
            background: 'var(--ept-card-bg)',
            border: '1px solid var(--ept-card-border)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Feature</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Free</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--ept-accent)' }}>Pro</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((row) => (
                <tr key={row.feature} style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                  <td style={{ padding: '10px 16px' }}>{row.feature}</td>
                  {(['free', 'pro', 'enterprise'] as const).map((tier) => {
                    const val = row[tier];
                    return (
                      <td key={tier} style={{ padding: '10px 16px', textAlign: 'center' }}>
                        {typeof val === 'boolean' ? (
                          val ? (
                            <span style={{ color: '#22c55e' }}>&#10003;</span>
                          ) : (
                            <span style={{ opacity: 0.3 }}>—</span>
                          )
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQ.map((item, i) => (
            <div
              key={i}
              style={{
                background: 'var(--ept-card-bg)',
                border: '1px solid var(--ept-card-border)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ept-text)',
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {item.q}
                <span style={{ opacity: 0.5, fontSize: 18 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div
                  style={{
                    padding: '0 16px 14px',
                    fontSize: 14,
                    opacity: 0.7,
                    lineHeight: 1.6,
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
