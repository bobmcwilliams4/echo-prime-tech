// Bot Status API Client — Fetches live health + stats from bot Workers
const API_KEY = 'echo-omega-prime-forge-x-2026';

const BOT_WORKERS: Record<string, string> = {
  'x-bot': 'https://echo-x-bot.bmcii1976.workers.dev',
  linkedin: 'https://echo-linkedin.bmcii1976.workers.dev',
  reddit: 'https://echo-reddit-bot.bmcii1976.workers.dev',
  telegram: 'https://echo-telegram.bmcii1976.workers.dev',
  discord: 'https://echo-prime-discord.bmcii1976.workers.dev',
  slack: 'https://echo-slack.bmcii1976.workers.dev',
  whatsapp: 'https://echo-whatsapp.bmcii1976.workers.dev',
  messenger: 'https://echo-messenger.bmcii1976.workers.dev',
  instagram: 'https://echo-instagram.bmcii1976.workers.dev',
};

async function botFetch(bot: string, path: string) {
  const base = BOT_WORKERS[bot];
  if (!base) throw new Error(`Unknown bot: ${bot}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${base}${path}`, {
      headers: { 'X-Echo-API-Key': API_KEY },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export interface BotHealth {
  status: string;
  version: string;
  service?: string;
  worker?: string;
  features?: string[];
  timestamp?: string;
}

export interface XBotStats {
  total_posts: number;
  posts_today: number;
  posts_this_week: number;
  mentions_replied: number;
  threads_posted: number;
  engagement: { total_likes: number; total_retweets: number; total_replies: number; total_engagements: number };
  by_category: Record<string, number>;
  recent: Array<{ tweet_id: string; text: string; category: string; posted_at: string; url: string; engagement: { likes: number; retweets: number; replies: number } }>;
}

export interface LinkedInStats {
  total: number;
  pending: number;
  posted: number;
  rejected: number;
  failed: number;
  engagement: { total_impressions: number; total_likes: number; total_comments: number; total_shares: number };
  top_categories: Array<{ category: string; count: number }>;
  recent_posts: Array<{ id: string; content: string; category: string; status: string; linkedin_url: string; impressions: number; likes: number; comments: number; shares: number; posted_at: string }>;
}

export interface RedditStats {
  posts: { total: number; today: number; this_week: number; failed: number; avg_engagement: number; avg_score: number };
  replies: { total: number; today: number };
  leads: { total: number; hot: number; warm: number };
  by_subreddit: Array<{ subreddit: string; cnt: number }>;
}

export async function getBotHealth(bot: string): Promise<BotHealth> {
  return botFetch(bot, '/health');
}

export async function getXBotStats(): Promise<XBotStats> {
  return botFetch('x-bot', '/stats');
}

export async function getLinkedInStats(): Promise<LinkedInStats> {
  return botFetch('linkedin', '/stats');
}

export async function getRedditStats(): Promise<RedditStats> {
  return botFetch('reddit', '/stats');
}
