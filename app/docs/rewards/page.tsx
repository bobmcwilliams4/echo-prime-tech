'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Coin Rewards',
  tagline: 'Earn coins for every Echo interaction. Stake for up to 15% APY. Climb from Bronze to Sovereign.',
  accent: '#eab308',
  productUrl: '/rewards',
  workerUrl: 'echo-coin-rewards.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Coin is the loyalty and rewards token of the Echo Prime ecosystem. Every interaction with Echo products — running AI queries, deploying engines, using the Knowledge Forge, making referrals — earns Echo Coins automatically across 16 earning rules. Your membership tier multiplier (1x Bronze to 3x Sovereign) amplifies every reward.',
    'Stake your coins in lock periods from 30 to 365 days and earn APY from 8% to 15%. A 2% burn on all transactions combined with a 180-day halving cycle creates deflationary pressure, meaning existing coins become scarcer as the ecosystem grows. Early unstaking is available with a 3% penalty that is also burned.',
    'Echo Coin is deployed on Base (Coinbase L2) at contract address 0x1672B2fc7Bc06CaeaaEA91395c0Be6FDBCCD09C6. Every transaction, burn, and stake is publicly verifiable on-chain. 100 Echo Coins equal 1 ECHO token on-chain. This is a loyalty and utility token, not a speculative investment.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create an Account', desc: 'Sign up for Echo Prime. Your rewards account is created automatically at the Bronze tier with a 1x earning multiplier. No credit card required.' },
    { step: 2, title: 'Use Echo Products', desc: 'Run queries through Sentinel, deploy engines, use Knowledge Forge, or interact with any Echo product. Coins are earned automatically based on 16 earning rules.' },
    { step: 3, title: 'Track Your Balance', desc: 'View your coin balance, earning history, and tier progress on the Rewards dashboard. Your tier is recalculated daily based on your total balance including staked coins.' },
    { step: 4, title: 'Stake for APY', desc: 'Lock coins for 30 days (8% APY), 90 days (10%), 180 days (12%), or 365 days (15%). Interest accrues daily and is paid in Echo Coins at the end of the lock period.' },
    { step: 5, title: 'Redeem or Climb', desc: 'Redeem coins for discounts on Echo Prime subscriptions (up to 30% off at Sovereign), or hold to climb tiers and unlock higher earning multipliers and platform perks.' },
  ],
  features: [
    { title: 'Earn While You Work', desc: 'Every interaction with Echo products earns Echo Coins automatically across 16 earning rules. Use Sentinel, run engines, deploy workers — coins accumulate with zero extra effort.' },
    { title: 'Staking with APY', desc: 'Lock coins in four staking tiers: 30-day (8% APY), 90-day (10%), 180-day (12%), or 365-day (15%). Interest accrues daily and compounds your tier balance.' },
    { title: 'Deflationary Burn', desc: '2% of all coins transacted are permanently burned, reducing total supply over time. Combined with a 180-day halving cycle that reduces new coin emission by 50%, existing coins become scarcer.' },
    { title: 'Six Membership Tiers', desc: 'Bronze (0), Silver (5K), Gold (25K), Platinum (100K), Diamond (500K), Sovereign (2M). Each tier unlocks a higher earning multiplier from 1x to 3x and platform perks.' },
    { title: 'Governance Voting', desc: 'Platinum tier and above earn voting rights on product roadmap decisions, new feature prioritization, and ecosystem proposals. Sovereign members can veto proposals.' },
    { title: 'Marketplace Discounts', desc: 'Redeem coins for discounts on any Echo Prime subscription — up to 30% off for Sovereign members. Coins never expire.' },
    { title: 'Referral Bonuses', desc: 'Earn bonus coins for every new member you bring into the ecosystem. Referral earnings are amplified by your membership tier multiplier.' },
    { title: 'On-Chain Transparency', desc: 'Echo Coin lives on Base (Coinbase L2) with near-zero transaction fees. Every transaction, burn, and stake is publicly verifiable on Basescan.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/balance', desc: 'Get the current coin balance, tier, multiplier, and lifetime earnings for the authenticated user.', auth: true },
    { method: 'GET', path: '/api/history', desc: 'List earning and spending history with timestamps, amounts, rule descriptions, and running balance.', auth: true },
    { method: 'POST', path: '/api/stake', desc: 'Stake coins for a specified lock period (30, 90, 180, or 365 days). Returns stake ID and projected APY yield.', auth: true },
    { method: 'GET', path: '/api/stakes', desc: 'List all active and completed stakes with lock dates, APY rates, and accrued interest.', auth: true },
    { method: 'POST', path: '/api/unstake', desc: 'Early unstake with 3% penalty (burned). Only available for active stakes.', auth: true },
    { method: 'GET', path: '/api/tiers', desc: 'List all membership tiers with thresholds, multipliers, and perks. No authentication required.', auth: false },
    { method: 'POST', path: '/api/redeem', desc: 'Redeem coins for a subscription discount code. Returns a one-time discount code and the coins deducted.', auth: true },
    { method: 'GET', path: '/api/referrals', desc: 'Get referral statistics including total referrals, bonus coins earned, and active referral link.', auth: true },
  ],
  userGuide: [
    { title: 'Understanding Earning Rules', id: 'earning-rules', content: [
      'Echo Coin has 16 earning rules that cover virtually every product interaction. Running AI queries through Sentinel, deploying engines via Engine Runtime, uploading documents to Knowledge Forge, creating prompts in Prompt Forge, and many other actions all generate coin rewards.',
      'Each earning rule has a base reward amount. Your membership tier multiplier is applied on top — a Sovereign member earning 3x receives three times the base reward for every action. The 180-day halving cycle reduces base rewards by 50% every six months, incentivizing early and consistent participation.',
      'View all earning rules and their current base rates on the Rewards dashboard. Rates update after each halving event.',
    ]},
    { title: 'Staking Strategy', id: 'staking-strategy', content: [
      'Staking locks your coins for a fixed period in exchange for APY. The longer the lock, the higher the yield: 30 days at 8%, 90 days at 10%, 180 days at 12%, and 365 days at 15%.',
      'Interest accrues daily and is paid in Echo Coins at the end of the lock period. Staked coins still count toward your tier balance, so staking does not reduce your tier. Early unstaking is possible but incurs a 3% penalty that is permanently burned.',
      'A common strategy is laddering — splitting coins across multiple lock periods so some coins mature regularly while others earn the highest APY.',
    ]},
    { title: 'Tier Progression', id: 'tier-progression', content: [
      'Your tier is recalculated daily based on your total balance including staked coins. Moving up a tier immediately increases your earning multiplier on all future rewards.',
      'Bronze (1x) is the starting tier. Silver (5K coins, 1.1x) adds early feature access. Gold (25K, 1.25x) unlocks priority support. Platinum (100K, 1.5x) adds governance voting. Diamond (500K, 2x) includes beta product access. Sovereign (2M, 3x) is the top tier with revenue share eligibility and maximum discounts.',
      'Tier benefits are cumulative — each tier includes everything from the tiers below it.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Automatic Earning Tracking', desc: 'AI monitors all product interactions across the Echo ecosystem and applies the appropriate earning rule in real time. No manual claiming required — rewards appear in your balance automatically.' },
    { capability: 'Tier Optimization Suggestions', desc: 'Analyzes your earning patterns and staking activity to suggest the fastest path to your next membership tier, including which products to use more and optimal staking durations.' },
    { capability: 'Burn Rate Analytics', desc: 'Tracks the deflationary burn rate across the ecosystem, showing total coins burned, current supply, and projected supply contraction over time.' },
    { capability: 'Referral Performance Analysis', desc: 'Monitors referral link performance and suggests optimal sharing strategies based on which channels generate the most conversions for your account.' },
  ],
  troubleshooting: [
    { issue: 'Coins not appearing after product usage', solution: 'Earning events are processed in near-real-time but may take up to 60 seconds to reflect in your balance. If coins still do not appear after 5 minutes, check that your action matches one of the 16 earning rules on the Rewards dashboard.' },
    { issue: 'Tier not updating after reaching threshold', solution: 'Tiers are recalculated once daily. If you crossed a tier threshold today, the new tier will take effect by the next calculation cycle. Staked coins are included in the balance calculation.' },
    { issue: 'Staking yield seems lower than expected', solution: 'APY is annual percentage yield. A 30-day stake at 8% APY yields approximately 0.66% over the 30-day period, not 8%. The full 8% is earned over a full year at that rate.' },
    { issue: 'Early unstake penalty seems high', solution: 'The 3% early unstake penalty is applied to the total staked amount and is permanently burned. This penalty exists to maintain staking integrity and add deflationary pressure. Consider waiting for the lock period to expire if possible.' },
  ],
  faq: [
    { q: 'How do I earn Echo Coins?', a: 'Coins are earned automatically as you use Echo Prime products. There are 16 earning rules covering AI queries, engine deployments, Knowledge Forge usage, referrals, staking, and usage milestones. Your membership tier multiplier applies to all earnings.' },
    { q: 'Is Echo Coin a cryptocurrency investment?', a: 'No. Echo Coin is a loyalty and rewards token designed to reward platform engagement and provide utility (discounts, governance, priority access). While deployed on Base blockchain for transparency, it should not be purchased speculatively.' },
    { q: 'What is the burn mechanism?', a: '2% of every Echo Coin transaction is permanently burned. Combined with a 180-day halving cycle that reduces new coin emission by 50%, total supply decreases over time as the platform grows.' },
    { q: 'What is the smart contract address?', a: 'Echo Coin is deployed on Base (Coinbase L2) at 0x1672B2fc7Bc06CaeaaEA91395c0Be6FDBCCD09C6. All transactions are verifiable on Basescan. 100 Echo Coins equal 1 ECHO token on-chain.' },
    { q: 'Can I lose my tier?', a: 'Yes. If your total balance (including staked coins) drops below a tier threshold — for example by redeeming coins for discounts — your tier will adjust at the next daily recalculation.' },
    { q: 'Do coins expire?', a: 'No. Echo Coins never expire. Your balance persists indefinitely and staked coins continue to earn APY for the duration of the lock period.' },
  ],
}

export default function RewardsDocsPage() {
  return <ProductDoc {...data} />
}
