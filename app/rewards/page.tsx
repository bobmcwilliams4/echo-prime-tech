'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Services', href: '/services' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

const FEATURES = [
  { icon: '🏆', title: 'Earn While You Work', desc: 'Every interaction with Echo products earns Echo Coins. Use Sentinel, run engines, deploy workers — coins accumulate automatically across 16 earning rules.' },
  { icon: '📈', title: 'Stake for APY', desc: 'Lock your coins in staking tiers from 30 to 365 days and earn up to 15% APY. Your loyalty compounds over time.' },
  { icon: '🔥', title: 'Deflationary Burn', desc: '2% of all coins transacted are permanently burned, reducing supply over time. Combined with a 180-day halving cycle, Echo Coin is designed to appreciate.' },
  { icon: '🗳️', title: 'Governance Voting', desc: 'Platinum tier and above earn voting rights on product roadmap decisions, new feature prioritization, and ecosystem proposals.' },
  { icon: '💰', title: 'Marketplace Discounts', desc: 'Redeem coins for discounts on any Echo Prime subscription — up to 30% off for Sovereign members. Coins never expire.' },
  { icon: '👥', title: 'Referral Bonuses', desc: 'Earn bonus coins for every new member you bring into the ecosystem. Multipliers apply to referral earnings based on your membership tier.' },
  { icon: '⚡', title: 'Priority Support Access', desc: 'Gold tier and above unlock priority support queues and dedicated account access — your membership tier opens doors across the platform.' },
  { icon: '🔗', title: 'On-Chain Transparency', desc: 'Echo Coin (contract 0x1672...C09C6) lives on Base (Coinbase L2). Every transaction, burn, and stake is publicly verifiable on-chain.' },
];

const TIERS = [
  { name: 'Bronze', coins: '0', multiplier: '1x', color: '#cd7f32', perks: ['Base earning rate', 'Standard marketplace access', 'Community forum access'] },
  { name: 'Silver', coins: '5K', multiplier: '1.1x', color: '#94a3b8', perks: ['10% earning boost', 'Early access to new features', 'Monthly rewards digest'] },
  { name: 'Gold', coins: '25K', multiplier: '1.25x', color: '#eab308', perks: ['25% earning boost', 'Priority support queue', 'Quarterly bonus drops', 'Staking dashboard access'] },
  { name: 'Platinum', coins: '100K', multiplier: '1.5x', color: '#e2e8f0', perks: ['50% earning boost', 'Governance voting rights', 'Dedicated account manager', 'Custom API rate limits'] },
  { name: 'Diamond', coins: '500K', multiplier: '2x', color: '#67e8f9', perks: ['2x all earnings', 'White-glove onboarding', 'Beta product access', 'Priority feature requests', 'Annual strategy session'] },
  { name: 'Sovereign', coins: '2M', multiplier: '3x', color: 'var(--ept-accent)', perks: ['3x all earnings', 'Maximum marketplace discounts', 'Roadmap voting veto', 'Revenue share eligibility', 'Private Sovereign channel', 'Zero-queue support'] },
];

const STAKING = [
  { period: '30 days', apy: '8%', label: 'Starter Stake', desc: 'Short-term flexibility with solid returns.' },
  { period: '90 days', apy: '10%', label: 'Committed', desc: 'Quarter-length lock for higher yield.' },
  { period: '180 days', apy: '12%', label: 'Dedicated', desc: 'Half-year stake with premium returns.' },
  { period: '365 days', apy: '15%', label: 'Sovereign Lock', desc: 'Maximum yield for long-term believers.' },
];

const FAQS = [
  {
    q: 'How do I earn Echo Coins?',
    a: 'Echo Coins are earned automatically as you use Echo Prime products. There are 16 earning rules covering actions like running AI queries through Sentinel, deploying engines, using the Knowledge Forge, making referrals, staking tokens, and hitting usage milestones. Your membership tier multiplier applies to all earnings — Sovereign members earn 3x the base rate on every action.',
  },
  {
    q: 'What is staking and how does it work?',
    a: 'Staking means locking your Echo Coins for a set period to earn APY (annual percentage yield). Lock 30 days for 8%, 90 days for 10%, 180 days for 12%, or 365 days for 15%. Interest accrues daily and is paid in Echo Coins at the end of the lock period. Early unstaking is available with a 3% penalty fee, which is burned — adding to the deflationary pressure.',
  },
  {
    q: 'Is Echo Coin a cryptocurrency investment?',
    a: 'Echo Coin is a loyalty and rewards token, not an investment product. It is designed to reward Echo Prime users for their platform engagement and provide utility within the ecosystem (discounts, governance, priority access). While Echo Coin is deployed on Base blockchain for transparency and transferability, it should not be purchased speculatively. Earn it by using the platform.',
  },
  {
    q: 'What is the burn mechanism and why does it matter?',
    a: '2% of every Echo Coin transaction is permanently burned — removed from supply forever. Combined with a 180-day halving cycle (which reduces the earning rate of new coins by 50% every 180 days), the total supply decreases over time as the platform grows. This deflationary design rewards early and loyal users whose existing coins become relatively scarcer as supply contracts.',
  },
  {
    q: 'How does the membership tier system work?',
    a: 'Your tier is determined by your cumulative Echo Coin balance: Bronze starts at 0, Silver at 5K, Gold at 25K, Platinum at 100K, Diamond at 500K, and Sovereign at 2M. Tiers unlock earning multipliers (Bronze 1x up to Sovereign 3x), platform perks, governance rights, and support access. Your tier is calculated daily based on your current balance including staked coins.',
  },
  {
    q: 'What is the Echo Coin smart contract address?',
    a: 'Echo Coin is deployed on Base (Coinbase L2) at contract address 0x1672B2fc7Bc06CaeaaEA91395c0Be6FDBCCD09C6. Base is an Ethereum L2 offering near-zero transaction fees and fast finality backed by Coinbase. You can verify all token activity, burns, and staking transactions publicly on Basescan. 100 Echo Coins equal 1 ECHO token on-chain.',
  },
];

export default function RewardsPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Echo Coin Rewards - Echo Prime Technologies</h1>
          <p>Earn Echo Coins for every interaction with Echo Prime products. Stake for up to 15% APY, climb membership tiers from Bronze to Sovereign, and redeem for platform discounts. Deployed on Base (Coinbase L2). Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Rewards', href: '/rewards' }]} />
      <FaqSchema faqs={FAQS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Tech"
            width={140}
            height={36}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--ept-text-secondary)' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/checkout?service=rewards&tier=starter"
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          Start Earning
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border"
          style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(13,115,119,0.06)' }}>
          ECHO COIN REWARDS v1.0.0 — BASE L2
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--ept-text)' }}>
          Get Rewarded for<br />
          <span style={{ color: 'var(--ept-accent)' }}>Every Echo Interaction</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Echo Coin is the loyalty and rewards token of the Echo Prime ecosystem. Earn coins by using products, stake for APY up to 15%, and unlock membership perks as you climb from Bronze to Sovereign.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/checkout?service=rewards&tier=starter"
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Earning Free
          </Link>
          <Link href="#staking"
            className="px-8 py-4 rounded-xl font-semibold text-lg border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Staking Tiers
          </Link>
        </div>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Contract: 0x1672B2fc7Bc06CaeaaEA91395c0Be6FDBCCD09C6 on Base (Coinbase L2) · 100 points = 1 ECHO token
        </p>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          How Echo Coin Works
        </h2>
        <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          16 earning rules. Deflationary supply. Real platform utility.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Membership Tiers
        </h2>
        <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          The more you earn and hold, the higher your tier — and the faster you earn more.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIERS.map(tier => (
            <div key={tier.name} className="p-6 rounded-xl border"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              {/* Tier badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: tier.color === 'var(--ept-accent)' ? 'var(--ept-accent)' : tier.color }}>
                  {tier.name[0]}
                </div>
                <div>
                  <div className="font-bold" style={{ color: 'var(--ept-text)' }}>{tier.name}</div>
                  <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    {tier.coins === '0' ? 'Starting tier' : `${tier.coins} coins required`}
                  </div>
                </div>
                <div className="ml-auto text-2xl font-extrabold" style={{ color: tier.color === 'var(--ept-accent)' ? 'var(--ept-accent)' : tier.color }}>
                  {tier.multiplier}
                </div>
              </div>
              {/* Multiplier bar */}
              <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                <div className="h-full rounded-full"
                  style={{
                    width: tier.name === 'Bronze' ? '17%' : tier.name === 'Silver' ? '33%' : tier.name === 'Gold' ? '50%' : tier.name === 'Platinum' ? '67%' : tier.name === 'Diamond' ? '83%' : '100%',
                    backgroundColor: tier.color === 'var(--ept-accent)' ? 'var(--ept-accent)' : tier.color,
                  }} />
              </div>
              <ul className="space-y-1.5">
                {tier.perks.map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: tier.color === 'var(--ept-accent)' ? 'var(--ept-accent)' : tier.color }}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Staking */}
      <section id="staking" className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Stake Your Coins
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          Lock coins to earn APY. Interest is paid in Echo Coins and compounds your tier balance.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAKING.map(s => (
            <div key={s.period} className="p-6 rounded-xl border text-center flex flex-col"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-4xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{s.apy}</div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>APY</div>
              <div className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.period}</div>
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--ept-accent)' }}>{s.label}</div>
              <div className="text-sm flex-1 mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</div>
              <Link href="/checkout?service=rewards&tier=starter"
                className="block text-center px-4 py-2 rounded-lg text-sm font-semibold border"
                style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
                Stake Now
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 rounded-xl border text-sm text-center"
          style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
          2% burn rate on all transactions &nbsp;·&nbsp; 180-day halving cycle &nbsp;·&nbsp; Early unstake incurs 3% penalty (burned) &nbsp;·&nbsp; 100 points = 1 ECHO token on-chain
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden"
              style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold"
                style={{ color: 'var(--ept-text)' }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ color: 'var(--ept-accent)', fontSize: '1.25rem', lineHeight: 1 }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20 text-center border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          You are already using Echo Prime.
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Start earning coins for every query, every engine run, every interaction. Free to join — no credit card.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout?service=rewards&tier=starter"
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Earning Free
          </Link>
          <Link href="/pricing"
            className="px-8 py-4 rounded-xl font-semibold text-lg border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
