'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export default function TelegramBotDocPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: 'Echo Telegram Bot', href: '/docs/telegram-bot' },
      ]} />
      <ProductDoc
      name="Echo Telegram Bot"
      tagline="AI-powered Telegram automation — webhook processing, inline queries, group management, payments, and conversational AI."
      accent="#0088cc"
      productUrl="/bots"
      workerUrl="https://echo-telegram.bmcii1976.workers.dev"
      version="3.1.0"
      overview={[
        'Echo Telegram Bot is a full-spectrum Telegram automation platform built on Cloudflare Workers. It processes webhooks in real time, responds to inline queries with AI-generated results, manages groups autonomously, handles payment flows via Telegram Payments API, and maintains multi-turn conversations with long-term memory. Every interaction is routed through the Echo AI engine for intelligent, context-aware responses.',
        'The bot operates as a first-class Telegram citizen — it supports custom keyboards, inline buttons, callback queries, media groups, channel posting, polls, quizzes, and location sharing. Under the hood, a durable state machine tracks each user session, persisting conversation history to D1 and caching hot sessions in KV for sub-10ms response times. Group administrators can configure moderation rules, welcome messages, auto-kick thresholds, and scheduled announcements without writing a single line of code.',
        'Analytics are built into every layer. Every message, command, callback, and payment event is logged with structured telemetry, feeding real-time dashboards that track engagement rates, peak usage hours, revenue per user, and bot health metrics. Scheduled messages are managed through a cron-triggered queue, ensuring reliable delivery even during high-traffic windows. The entire system deploys to 300+ Cloudflare edge locations, guaranteeing low-latency responses worldwide.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Bot on Telegram', desc: 'Open @BotFather on Telegram, send /newbot, and follow the prompts. Copy the HTTP API token. Store it in the Echo Vault so the Worker can pull it at runtime.' },
        { step: 2, title: 'Configure the Webhook', desc: 'Set the Telegram webhook URL to https://echo-telegram.bmcii1976.workers.dev/webhook/<your-bot-token>. The Worker automatically validates incoming updates using the token hash to prevent spoofed requests.' },
        { step: 3, title: 'Set Up Commands', desc: 'Define your bot commands via the /commands endpoint or through the dashboard. Commands can trigger static replies, AI conversations, payment flows, or external API calls. Each command supports argument parsing and permission levels.' },
        { step: 4, title: 'Enable AI Conversations', desc: 'Toggle conversational AI in your bot settings. Choose a personality profile (professional, casual, support agent, sales closer) and configure context length, temperature, and response format. The AI uses conversation history from D1 for multi-turn context.' },
        { step: 5, title: 'Launch and Monitor', desc: 'Send /start to your bot to verify everything works. Open the analytics dashboard at /dashboard to monitor messages, users, errors, and latency in real time. Set up Telegram alerts to notify you of critical errors or payment events.' },
      ]}
      features={[
        { title: 'Webhook Processing', desc: 'Processes all Telegram update types — messages, edited messages, channel posts, inline queries, callback queries, shipping queries, pre-checkout queries, polls, and chat member updates. Each update type routes to a dedicated handler chain with middleware for logging, rate limiting, and auth.' },
        { title: 'Inline Query Engine', desc: 'Responds to inline queries with AI-generated results. Users type @yourbot followed by a query and see live results. Supports article, photo, GIF, video, document, and location result types. Results are cached for 300 seconds to minimize compute.' },
        { title: 'Group Management', desc: 'Autonomous moderation for Telegram groups: configurable welcome messages with button templates, anti-spam detection using AI content analysis, auto-warn/kick/ban escalation, link filtering, flood control, and scheduled announcements. Admins manage everything through inline button menus.' },
        { title: 'Payment Processing', desc: 'Full Telegram Payments integration. Create product catalogs, generate invoices with flexible pricing (subscriptions, one-time, donations), handle pre-checkout validation, process successful payments, and issue refunds. Supports Stripe, LiqPay, and other Telegram-supported providers.' },
        { title: 'Custom Keyboards', desc: 'Dynamic keyboard generation based on user state and context. Reply keyboards for quick selections, inline keyboards for interactive flows, keyboard removal on completion. Pagination support for large option sets. Keyboards persist across messages or auto-dismiss.' },
        { title: 'Media Handling', desc: 'Upload, download, process, and relay all Telegram media types — photos, videos, documents, audio, voice notes, stickers, and animations. Media is cached in R2 for reuse. Automatic thumbnail generation and format conversion for cross-platform compatibility.' },
        { title: 'Channel Posting', desc: 'Scheduled and on-demand posting to Telegram channels. Content queue with priority levels, media album support, silent notifications, pin management, and A/B testing for post variations. RSS feed auto-import converts external content into formatted Telegram posts.' },
        { title: 'Bot Analytics', desc: 'Real-time dashboards tracking daily active users, messages per hour, command usage distribution, conversation length, payment revenue, error rates, and response latency percentiles. Export data as CSV or JSON. Webhook delivery to external analytics platforms.' },
        { title: 'Conversation AI', desc: 'Multi-turn conversational AI powered by the Echo engine. Each user gets a persistent session with full conversation history stored in D1. Personality profiles control tone, vocabulary, and response structure. Supports function calling for booking, lookups, and transactions mid-conversation.' },
        { title: 'Scheduled Messages', desc: 'Cron-based message scheduler supporting one-time and recurring schedules. Time-zone-aware delivery. Batch scheduling via CSV upload. Failed deliveries auto-retry with exponential backoff. Scheduled messages can include media, keyboards, and dynamic template variables.' },
        { title: 'Deep Linking', desc: 'Generate deep links with custom payloads for referral tracking, campaign attribution, and onboarding flows. Parse start parameters to route users into specific conversation branches or trigger automated sequences on first interaction.' },
        { title: 'Multi-Language Support', desc: 'Automatic language detection from user profile and message content. Response templates in 12 languages. AI conversation mode auto-matches the user language. Admin can set a default language per group or channel.' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/webhook/:token', desc: 'Telegram webhook endpoint. Receives all update types. Validates token hash. Routes to appropriate handler chain.', auth: false },
        { method: 'POST', path: '/api/send', desc: 'Send a message to a user or group. Supports text, media, keyboards, and formatting. Returns message_id on success.', auth: true },
        { method: 'POST', path: '/api/broadcast', desc: 'Broadcast a message to all users or a filtered segment. Supports throttling, media attachments, and delivery tracking.', auth: true },
        { method: 'GET', path: '/api/analytics', desc: 'Retrieve analytics data: user counts, message volumes, command usage, payment totals. Supports date range and granularity filters.', auth: true },
        { method: 'POST', path: '/api/schedule', desc: 'Schedule a message for future delivery. Parameters: chat_id, content, send_at (ISO 8601), recurring (cron expression), timezone.', auth: true },
        { method: 'GET', path: '/api/users', desc: 'List bot users with engagement metrics: message count, last active, subscription status, total payments. Supports pagination and search.', auth: true },
        { method: 'POST', path: '/api/commands', desc: 'Create or update bot commands. Each command definition includes handler type, response template, permission level, and argument schema.', auth: true },
        { method: 'GET', path: '/health', desc: 'Health check endpoint returning bot status, webhook state, queue depth, D1 connectivity, and uptime metrics.' },
      ]}
      userGuide={[
        { id: 'bot-setup', title: 'Bot Setup and Configuration', content: [
          'Setting up your Echo Telegram Bot begins with creating the bot through @BotFather and registering the token with the Echo platform. Once the webhook is configured, the Worker intercepts every Telegram update and routes it through the processing pipeline. The pipeline consists of middleware layers — authentication, rate limiting, logging, and state hydration — before reaching your custom command handlers.',
          'Configuration is managed through a JSON settings object stored in KV. This controls every aspect of bot behavior: AI personality, welcome messages, moderation rules, payment provider keys, scheduled post templates, and analytics retention. Settings can be updated via the API or through the built-in admin menu accessible to bot owners via the /admin command.',
          'For production deployments, enable the security hardening options: webhook secret validation (Telegram sends an X-Telegram-Bot-Api-Secret-Token header), rate limiting per user (default: 30 messages/minute), IP allowlisting for API endpoints, and audit logging for all admin actions. These protections run at the edge with zero latency impact.',
        ]},
        { id: 'conversations', title: 'Building Conversational Flows', content: [
          'The conversation engine supports both scripted flows (decision trees with branching logic) and freeform AI conversations. Scripted flows are defined as state machines — each state has a prompt, expected input types, validation rules, and transition conditions. The state machine persists in D1, so users can resume multi-step flows days later without losing progress.',
          'AI conversations use the Echo engine with configurable personality profiles. Each profile defines system instructions, temperature, max tokens, and response constraints. The bot maintains a sliding context window (default: 20 messages) drawn from D1 history, giving the AI genuine conversational memory. Users experience natural, coherent multi-turn dialogue rather than stateless Q&A.',
          'Hybrid flows combine both approaches: a scripted flow for structured data collection (name, email, preferences) that transitions into freeform AI for follow-up questions. This pattern is ideal for customer onboarding, support triage, and lead qualification where you need both structured data and natural conversation.',
        ]},
        { id: 'payments', title: 'Payment Processing Guide', content: [
          'Telegram Payments let you sell products and services directly inside the chat. Configure your payment provider (Stripe is recommended) by storing the provider token in the vault. Create products with title, description, photo, and price array (supports multiple currencies). The bot generates a Telegram invoice with a Pay button.',
          'When a user taps Pay, Telegram handles the card collection UI. Your bot receives a pre_checkout_query — validate inventory, pricing, and user eligibility here. Respond with answerPreCheckoutQuery(ok: true) to approve or provide an error message to reject. On successful payment, you receive a successful_payment message with the payment charge ID, amount, and shipping details.',
          'For subscriptions, use recurring invoices with the suggested_tip_amounts field for optional upsells. Track subscription status in D1 with renewal dates. The scheduled message system can send renewal reminders and handle grace periods. Refunds are processed through the provider API — call /api/refund with the charge_id to issue a full or partial refund.',
        ]},
        { id: 'moderation', title: 'Group Moderation and Administration', content: [
          'Echo Telegram Bot provides autonomous group moderation that scales from small communities to groups with thousands of members. The moderation engine runs three detection layers: pattern matching (regex rules for banned words, links, and phone numbers), AI content analysis (spam, scam, harassment, and off-topic detection), and behavioral analysis (flood detection, join-spam patterns, and raid detection).',
          'When a violation is detected, the escalation ladder kicks in: first offense triggers a warning with explanation, second offense within 24 hours triggers a temporary mute, third offense triggers a kick. Administrators can customize thresholds, cooldown periods, and escalation steps per group. All moderation actions are logged with the triggering message content for audit purposes.',
          'Welcome messages fire when new members join and support rich formatting: the member name as a variable, group rules summary, interactive button menus for self-service role assignment, and a CAPTCHA challenge (math problem or button tap) to filter bot accounts. Administrators manage all settings through an inline button menu triggered by the /admin command — no command-line or API access required.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Contextual Conversation', desc: 'Maintains full conversation history per user in D1 with a sliding context window. The AI references previous messages, remembers user preferences, and builds rapport over multiple sessions. Context survives bot restarts and updates.' },
        { capability: 'Intent Classification', desc: 'Every incoming message is classified into intent categories — question, command, complaint, purchase intent, greeting, farewell, feedback — with confidence scores. Intents route to specialized handlers for optimized responses.' },
        { capability: 'Content Moderation AI', desc: 'Analyzes messages for spam, scam, harassment, hate speech, and off-topic content using a fine-tuned classifier. Operates at the edge with sub-50ms classification time. False positive rate under 2%.' },
        { capability: 'Smart Reply Suggestions', desc: 'Generates contextually appropriate quick-reply options based on conversation state. Reduces user effort for common interactions like confirming appointments, selecting products, or answering FAQs.' },
        { capability: 'Sentiment Analysis', desc: 'Tracks user sentiment across conversations. Detects frustration, satisfaction, confusion, and urgency. Routes negative-sentiment conversations to escalation handlers or human support queues automatically.' },
        { capability: 'Multilingual Understanding', desc: 'Processes messages in 40+ languages without requiring language selection. Automatically detects language and responds in kind. Code-switching within a single conversation is handled naturally.' },
      ]}
      troubleshooting={[
        { issue: 'Bot not responding to messages', solution: 'Verify the webhook is set correctly: call https://api.telegram.org/bot<TOKEN>/getWebhookInfo and confirm the URL matches your Worker endpoint. Check the /health endpoint for errors. Ensure the bot token in the vault is current — BotFather tokens do not expire but can be revoked and regenerated. Check Cloudflare Worker logs for 5xx errors.' },
        { issue: 'Payments failing at pre-checkout', solution: 'The pre_checkout_query must be answered within 10 seconds or Telegram cancels it. Check that your payment provider token is valid and matches the currency in your invoice. Ensure answerPreCheckoutQuery is called with ok: true (not a string "true"). Verify the product price matches what was sent in the original invoice.' },
        { issue: 'Inline queries returning empty results', solution: 'Inline mode must be enabled via @BotFather (/setinline). Check that your inline query handler returns results in the correct InlineQueryResult format. Results are cached by Telegram for cache_time seconds — set to 0 during development. Verify the bot has the necessary permissions if querying external APIs.' },
        { issue: 'Scheduled messages not delivering', solution: 'Scheduled messages rely on Cloudflare Cron Triggers. Verify the cron schedule is configured in wrangler.toml. Check that the target chat_id is valid and the bot has send permissions in that chat. Review the schedule queue in D1 for stuck entries (status = "pending" past their send_at time). Failed messages retry 3 times with backoff before marking as failed.' },
      ]}
      faq={[
        { q: 'How many bots can I run on a single Worker?', a: 'The Worker supports multiple bot tokens — each webhook URL includes the token as a path parameter, so a single deployment can serve unlimited bots. Bot-specific settings are stored per-token in KV. Resource usage scales linearly with message volume.' },
        { q: 'Is there a message rate limit?', a: 'Telegram enforces limits: 30 messages/second to the same group, 1 message/second to the same user. The Worker respects these limits with an internal queue and throttle. Your API calls to /api/send are queued if they would exceed Telegram rate limits. Broadcasts to large audiences are automatically throttled to 25 messages/second.' },
        { q: 'Can the bot handle files and media?', a: 'Yes. The bot processes photos (up to 20MB), videos (up to 50MB), documents (up to 50MB), audio, voice notes, stickers, and animations. Media received from users is cached in R2 with a 90-day retention. Media sent by the bot can reference R2 URLs or Telegram file_ids for instant delivery.' },
        { q: 'How does conversation memory work?', a: 'Every message (user and bot) is stored in D1 with timestamps and metadata. The AI loads the last 20 messages as context for each response. Older messages are summarized and stored as a compressed context note. Users can request /forget to clear their history. Admins can set retention policies per bot.' },
        { q: 'Can I connect the bot to external services?', a: 'Yes. Command handlers support HTTP callouts to any external API. Built-in integrations exist for Echo CRM, payment gateways, Google Sheets, and webhook relay. Custom integrations are configured via the /api/integrations endpoint with URL, auth headers, and payload templates.' },
      ]}
    />
    </>
  )
}
