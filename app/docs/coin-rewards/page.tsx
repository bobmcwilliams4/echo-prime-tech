'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export default function CoinRewardsDocPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: 'Echo Coin Rewards', href: '/docs/coin-rewards' },
      ]} />
      <ProductDoc
      name="Echo Coin Rewards"
      tagline="Gamified loyalty and rewards platform — earn points, unlock tiers, collect badges, refer friends, and redeem real rewards."
      accent="#f59e0b"
      productUrl="/rewards"
      workerUrl="https://echo-coin-rewards.bmcii1976.workers.dev"
      version="1.8.0"
      overview={[
        'Echo Coin Rewards is a fully gamified loyalty platform that turns user engagement into tangible value. Users earn Echo Coins through platform activity — completing tasks, referring friends, achieving milestones, participating in challenges, and making purchases. Coins accumulate toward reward tiers (Bronze, Silver, Gold, Platinum, Diamond) that unlock progressively better perks, discounts, and exclusive features.',
        'The system is designed for stickiness. Achievement badges create collection motivation, daily streaks encourage habitual engagement, leaderboards drive competition, and team challenges build community. Every action on the platform — from logging in to completing a complex workflow — can be configured as a coin-earning event with customizable point values. The reward catalog offers both digital rewards (premium features, extended trials, priority support) and physical rewards (merchandise, gift cards) redeemable with accumulated coins.',
        'For businesses integrating Echo Coin Rewards into their own products, the API provides complete programmatic control. Mint coins for custom events, create branded reward catalogs, run time-limited challenges, and query user balances and tier status. The ledger is append-only and auditable — every coin minted, earned, spent, or expired is recorded in D1 with timestamps and event metadata. Fraud detection flags suspicious earning patterns automatically.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Account', desc: 'Sign up or log in to Echo Prime Tech. Your Echo Coin wallet is created automatically with a starting balance of 50 welcome coins. Your profile page shows your current balance, tier, badges, and earning history.' },
        { step: 2, title: 'Earn Your First Coins', desc: 'Complete the onboarding checklist to earn 200 bonus coins: set up your profile (50 coins), enable notifications (25 coins), explore 3 products (75 coins), and invite a friend (50 coins). Each completed task awards coins instantly with a visual celebration animation.' },
        { step: 3, title: 'Track Your Progress', desc: 'Visit the Rewards dashboard to see your tier progress bar, daily streak counter, available challenges, and badge collection. The activity feed shows recent coin earnings and how other users are progressing on the leaderboard.' },
        { step: 4, title: 'Join a Challenge', desc: 'Browse active challenges — time-limited events with bonus coin multipliers and exclusive badge rewards. Team challenges let you form groups and compete against other teams. Challenge progress updates in real time on the dashboard.' },
        { step: 5, title: 'Redeem Rewards', desc: 'Open the Reward Catalog to browse available rewards. Filter by category (features, discounts, merchandise, gift cards) and point cost. Select a reward, confirm the redemption, and coins are deducted instantly. Digital rewards activate immediately. Physical rewards ship within 5-7 business days.' },
      ]}
      features={[
        { title: 'Point Earning System', desc: 'Configurable earn rules for any platform event. Login streaks (1x-5x multiplier based on consecutive days), purchase rewards (1 coin per dollar spent), referral bonuses (200 coins per qualified referral), task completion, content creation, and community participation. Earn rates adjust by tier — higher tiers earn faster.' },
        { title: 'Reward Tiers', desc: 'Five progressive tiers: Bronze (0-999 coins lifetime), Silver (1,000-4,999), Gold (5,000-19,999), Platinum (20,000-99,999), Diamond (100,000+). Each tier unlocks perks: Silver gets 5% earn bonus, Gold gets priority support, Platinum gets exclusive features, Diamond gets personal account manager and custom rewards.' },
        { title: 'Achievement Badges', desc: 'Over 50 collectible badges across categories: Engagement (login streaks, feature usage), Commerce (purchase milestones), Social (referrals, community), Mastery (advanced feature usage), and Special (seasonal, event-exclusive). Badges display on user profiles and contribute to leaderboard score.' },
        { title: 'Referral Program', desc: 'Two-tier referral system: the referrer earns 200 coins when their invite signs up, plus 50 coins when the referred user reaches Silver tier. The referred user earns 100 bonus welcome coins. Referral links track attribution with 30-day cookie windows. Leaderboard for top referrers with monthly bonus prizes.' },
        { title: 'Redeemable Rewards', desc: 'Digital rewards: premium feature unlocks, extended trial periods, priority support tickets, custom themes, API rate limit upgrades. Physical rewards: branded merchandise, gift cards (Amazon, Visa, Starbucks), and partner product discounts. Catalog is curated monthly with new additions.' },
        { title: 'Leaderboards', desc: 'Global and segmented leaderboards: daily, weekly, monthly, and all-time. Segmented by tier, team, region, and activity type. Top 10 weekly earners receive bonus coin multipliers. Leaderboard position displays on profile badges. Anti-gaming protections prevent artificial inflation.' },
        { title: 'Team Challenges', desc: 'Create or join teams of 2-10 members. Team challenges run for 1-4 weeks with collective point goals. Teams compete on a dedicated leaderboard. Winning team members receive exclusive badges and bonus coins. Challenge themes rotate: engagement, referrals, feature exploration, content creation.' },
        { title: 'Activity Tracking', desc: 'Real-time activity feed showing coin earnings, badge unlocks, tier promotions, and challenge progress. Daily and weekly summaries delivered via email and in-app notification. Historical activity log exportable as CSV for personal records or tax documentation of reward redemptions.' },
        { title: 'Custom Reward Catalog', desc: 'Businesses using the API can create branded reward catalogs with custom items, point values, inventory limits, and expiration dates. Catalog items support images, descriptions, redemption instructions, and fulfillment webhooks. A/B test reward offerings to optimize engagement.' },
        { title: 'API Integration', desc: 'RESTful API for minting coins, querying balances, creating rewards, managing challenges, and retrieving leaderboards. Webhook notifications for tier changes, badge unlocks, and redemptions. SDK libraries for JavaScript, Python, and Go. Rate-limited to 1,000 requests/minute per API key.' },
        { title: 'Fraud Detection', desc: 'Machine learning model flags suspicious earning patterns: rapid-fire logins, automated referral creation, impossible activity sequences, and multi-account abuse. Flagged accounts are temporarily frozen pending review. All fraud events are logged with evidence for manual audit.' },
        { title: 'Streak System', desc: 'Daily login streaks multiply earning rates: Day 1 = 1x, Day 3 = 1.5x, Day 7 = 2x, Day 14 = 3x, Day 30 = 5x. Missing a day resets the multiplier (grace period: 1 skip per 7 days for Gold+ tiers). Streak milestones award bonus coins and exclusive badges.' },
      ]}
      apiEndpoints={[
        { method: 'GET', path: '/api/balance/:userId', desc: 'Get current coin balance, lifetime earned, lifetime spent, current tier, and next tier threshold for a user.', auth: true },
        { method: 'POST', path: '/api/mint', desc: 'Mint coins to a user account. Parameters: userId, amount, reason, event_type, metadata. Coins appear in balance immediately. Triggers tier recalculation.', auth: true },
        { method: 'POST', path: '/api/redeem', desc: 'Redeem coins for a reward. Parameters: userId, reward_id, quantity. Validates balance sufficiency, deducts coins, and triggers fulfillment webhook. Returns redemption_id.', auth: true },
        { method: 'GET', path: '/api/rewards', desc: 'List available rewards with name, description, image_url, coin_cost, category, inventory_remaining, and eligibility rules. Supports category filter and pagination.', auth: false },
        { method: 'GET', path: '/api/leaderboard', desc: 'Retrieve leaderboard rankings. Parameters: period (daily/weekly/monthly/alltime), segment (global/team/tier), limit, offset. Returns user_id, display_name, score, rank.', auth: false },
        { method: 'GET', path: '/api/badges/:userId', desc: 'List all badges earned by a user with unlock timestamps. Also returns locked badges with progress toward unlock conditions.', auth: true },
        { method: 'POST', path: '/api/challenges', desc: 'Create a new challenge. Parameters: name, description, start_date, end_date, goal_type, goal_value, reward_coins, badge_id, team_size.', auth: true },
        { method: 'GET', path: '/health', desc: 'Health check returning service status, D1 connectivity, KV cache hit rate, active challenge count, and total coins in circulation.' },
      ]}
      userGuide={[
        { id: 'earning', title: 'How to Earn Echo Coins', content: [
          'Echo Coins are earned through virtually every meaningful interaction with the platform. The most consistent source is the daily login bonus — log in each day to earn base coins and build your streak multiplier. A 30-day streak earns 5x the base rate, turning a 10-coin daily login into 50 coins. The streak system rewards consistency above all else.',
          'Beyond logins, coins are earned through product engagement. Using platform features (running an engine query, configuring a bot, generating voice content) awards coins proportional to the complexity of the action. Purchases earn 1 coin per dollar spent, and referrals are the highest single-action earner at 200 coins per qualified signup. Community contributions — forum posts, bug reports, feature suggestions — also earn coins when accepted by moderators.',
          'Special earning events run periodically: Double Coin Weekends multiply all earnings by 2x, Seasonal Challenges offer bonus pools for themed activities, and Product Launch events award early adopter badges with coin bonuses. Subscribe to notifications to never miss a bonus event. Your earning history is fully transparent — every coin comes with a timestamp, source event, and multiplier applied.',
        ]},
        { id: 'tiers', title: 'Understanding Reward Tiers', content: [
          'Your tier is determined by lifetime coins earned (not current balance — spending coins does not reduce your tier). Bronze is the starting tier for all users. Each tier above Bronze unlocks cumulative perks that make the platform more valuable the more you engage. Tier status is permanent once achieved — you never lose a tier.',
          'Silver (1,000 lifetime coins) adds a 5% earn rate bonus and access to Silver-exclusive rewards in the catalog. Gold (5,000 coins) adds priority support, a Gold profile badge, and 10% earn bonus. Platinum (20,000 coins) unlocks early access to new features, exclusive merchandise, and 15% earn bonus. Diamond (100,000 coins) provides a personal account manager, custom reward requests, and 25% earn bonus.',
          'Tier progression is displayed as a progress bar on your dashboard. At your current earning rate, the system estimates when you will reach the next tier. Tier promotions trigger a celebration notification and a special tier badge. High tiers also unlock advanced analytics showing your earning patterns, optimal strategies, and comparison to anonymized peer cohorts.',
        ]},
        { id: 'redeeming', title: 'Redeeming Rewards', content: [
          'The Reward Catalog is organized into categories: Features (premium unlocks, extended trials), Services (priority support, consulting credits), Discounts (percentage or fixed-value coupons), Merchandise (branded items, apparel), and Gift Cards (third-party retailers). Each reward shows its coin cost, availability, and any eligibility requirements (some rewards require a minimum tier).',
          'To redeem, select a reward, confirm the coin deduction, and you receive immediate confirmation. Digital rewards activate within seconds — feature unlocks apply to your account instantly, discount codes appear in your redemption history, and service credits are added to your balance. Physical rewards require a shipping address and arrive within 5-7 business days with tracking provided via email.',
          'Redemption is final — coins cannot be refunded once a reward is claimed. However, if a physical reward arrives damaged or incorrect, contact support for a replacement (no additional coin charge). Keep your redemption history as a record — it includes timestamps, coin amounts, and fulfillment status for every reward you have claimed.',
        ]},
        { id: 'challenges', title: 'Participating in Challenges', content: [
          'Challenges are time-limited events that offer bonus coins and exclusive badges for completing specific goals. Solo challenges set individual targets (earn 500 coins in one week, refer 3 friends, use 5 different products). Team challenges require forming or joining a group to reach collective goals (team earns 10,000 coins together, team members all complete a specific action).',
          'Active challenges are displayed on the dashboard with progress bars, time remaining, and current standings. You can participate in up to 3 challenges simultaneously. When a challenge ends, results are finalized and rewards distributed within 1 hour. Winning a challenge awards the listed coin bonus plus an exclusive badge that displays your achievement permanently on your profile.',
          'Challenge themes rotate monthly: January focuses on New Year engagement goals, March on referral sprints, June on product exploration, September on community building, and December on year-end giving (donating coins to charity partners). Special event challenges coincide with product launches and platform milestones. Past challenge results and your participation history are archived in your profile.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Engagement Prediction', desc: 'Machine learning model predicts which users are at risk of disengaging based on activity patterns, streak breaks, and earning velocity changes. Triggers personalized re-engagement nudges — bonus coin offers, challenge invitations, and reward recommendations — before the user churns.' },
        { capability: 'Reward Optimization', desc: 'AI analyzes redemption patterns across the user base to recommend optimal reward catalog composition. Identifies high-demand items, underperforming rewards, and pricing sweet spots. A/B tests new rewards automatically and promotes winners to the featured catalog.' },
        { capability: 'Fraud Detection', desc: 'Anomaly detection model identifies suspicious patterns in real time: abnormal earning velocity, coordinated multi-account activity, bot-like interaction sequences, and referral ring schemes. Flagged accounts are frozen within seconds with full evidence logs for manual review.' },
        { capability: 'Personalized Challenges', desc: 'Generates challenge recommendations tailored to each user based on their activity history, tier level, and earning patterns. Recommends challenges where the user has a high probability of completion, maximizing engagement and satisfaction rather than setting unachievable goals.' },
        { capability: 'Dynamic Earn Rate Tuning', desc: 'Continuously adjusts coin earn rates for different actions based on platform goals. If referral growth is a priority, referral earn rates increase temporarily. If feature adoption is low, feature-use earning rates get boosted. Changes are transparent and communicated to users via the activity feed.' },
        { capability: 'Cohort Analysis', desc: 'Groups users into behavioral cohorts and tracks engagement, spending, and retention metrics per cohort. Identifies which onboarding paths, first actions, and early rewards correlate most strongly with long-term engagement. Findings feed back into the onboarding flow optimization.' },
      ]}
      troubleshooting={[
        { issue: 'Coins not appearing after an action', solution: 'Coin credits are processed asynchronously and typically appear within 5 seconds. If coins are still missing after 60 seconds, check the activity feed for the specific event — it may have been flagged by fraud detection for review. Ensure you are logged in (guest actions do not earn coins). Some actions have daily earning caps — check the earn rules documentation for limits.' },
        { issue: 'Streak reset unexpectedly', solution: 'Streaks require a login action within each calendar day (midnight to midnight in your configured timezone). Check your timezone setting in profile preferences — it may differ from your actual timezone. Gold+ tier members have a 1-skip grace period per 7 days that activates automatically. If your streak was reset incorrectly, contact support with the dates in question.' },
        { issue: 'Reward redemption failed', solution: 'Redemption fails if your balance is insufficient (check the exact coin cost including any tier-based discounts), the reward is out of stock (inventory shows in the catalog), or you do not meet the tier requirement. If the error is "redemption processing failed," the fulfillment webhook may be down — try again in 5 minutes. Your coins are only deducted on successful redemption.' },
        { issue: 'Leaderboard position not updating', solution: 'Leaderboards refresh every 60 seconds. Recent earnings may take up to 2 minutes to reflect in rankings. If your position seems frozen for longer, clear your browser cache or check the leaderboard period — you may be viewing the monthly board while your recent activity would show on the daily board.' },
      ]}
      faq={[
        { q: 'Do Echo Coins expire?', a: 'Coins in your balance do not expire as long as your account remains active. Accounts with zero logins for 12 consecutive months are considered dormant — dormant accounts receive a 90-day warning email before coins are forfeited. Any login within the warning period reactivates the account. Tier status never expires regardless of account activity.' },
        { q: 'Can I transfer coins to another user?', a: 'Direct peer-to-peer transfers are not supported to prevent fraud and coin laundering. However, you can gift reward items to other users — redeem a reward and specify a recipient email during checkout. Team challenge winnings are distributed equally to all team members automatically.' },
        { q: 'How is my tier calculated?', a: 'Tier is based on lifetime coins earned, not current balance. Spending coins on rewards does not affect your tier. Once you reach a tier threshold, you stay at that tier permanently. The progress bar on your dashboard shows coins needed for the next tier based on your lifetime total.' },
        { q: 'Are there limits on how many coins I can earn per day?', a: 'Most actions have individual daily caps to prevent gaming: login bonus is once per day, referral bonuses cap at 10 per day, and purchase rewards cap at 500 coins per day. There is no aggregate daily cap — you can earn from multiple categories simultaneously. Challenges and special events may have their own separate caps.' },
        { q: 'Can my business create a custom rewards program using the API?', a: 'Yes. The API lets you mint coins for custom events, create branded reward catalogs, run challenges, and query user data. You define your own earn rules, reward items, and tier structure. White-label options remove Echo branding entirely. Contact sales for enterprise pricing and dedicated support.' },
      ]}
    />
    </>
  )
}
