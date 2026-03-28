'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Social Media Manager',
  tagline: 'AI-powered social media management for 8 platforms — schedule posts, run campaigns, analyze engagement, and generate content from one dashboard.',
  accent: '#ec4899',
  productUrl: '/social-media',
  workerUrl: 'https://echo-social-media.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Social Media Manager unifies your presence across Twitter/X, LinkedIn, Instagram, Facebook, Reddit, TikTok, YouTube, and Threads into a single command center. Schedule individual posts, bulk cross-post to multiple platforms simultaneously, build campaigns with budget tracking, and manage your entire content calendar from one interface — no more logging in and out of eight different apps to keep your brand active.',
    'The AI content engine generates platform-optimized posts from a topic brief, automatically adjusting tone, length, hashtag density, and formatting to match each platform\'s best practices. A LinkedIn post about a product launch reads like a professional announcement. The same announcement on Twitter/X becomes a punchy thread with relevant hashtags. On Instagram it\'s caption-first with emoji and 30 targeted hashtags. One brief, eight tailored posts, ready in 30 seconds.',
    'Engagement analytics go beyond raw follower counts to surface what actually drives growth — best posting times per platform based on your audience\'s historical activity, which content types (video, image, carousel, plain text) generate the most engagement for your specific accounts, hashtag performance tracking, and comparative campaign analytics. The AI performance analysis engine identifies patterns in your top-performing posts and recommends content adjustments for future posts.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Your Accounts', desc: 'Navigate to Settings > Connected Accounts and authorize each platform using OAuth. Twitter/X, LinkedIn, Facebook, Instagram, Reddit, TikTok, YouTube, and Threads are supported. Each platform requires separate authorization. Instagram and Facebook use the same Meta Business account connection.' },
    { step: 2, title: 'Set Up Your Profile', desc: 'Configure your brand voice settings — tone (professional, casual, humorous), industry, key topics, and any phrases or hashtag groups you want consistently applied. These settings inform the AI content generator and hashtag suggester.' },
    { step: 3, title: 'Create Your First Post', desc: 'Click "New Post," enter your content or use "Generate with AI" to draft from a topic, select one or more platforms, and either post immediately or schedule for a specific time. The preview panel shows exactly how the post will render on each selected platform.' },
    { step: 4, title: 'Build a Campaign', desc: 'Create a campaign to group related posts with a budget, start and end dates, and campaign goals (engagement, reach, clicks). All posts created under a campaign are tracked together in campaign analytics.' },
    { step: 5, title: 'Analyze & Optimize', desc: 'Review the Analytics dashboard after your first week of scheduled posts. The Best Times heatmap shows when your audience is most active. The Content Performance report shows which post types drive the most engagement. Use these insights to refine your scheduling and content strategy.' },
  ],

  features: [
    { title: '8-Platform Support', desc: 'Full post creation, scheduling, and analytics for Twitter/X, LinkedIn, Instagram, Facebook, Reddit, TikTok, YouTube (Community posts and video description scheduling), and Threads. Platform-specific formatting, character limits, media requirements, and API rate limits are all handled automatically.' },
    { title: 'Post Scheduling & Queue', desc: 'Schedule posts to any combination of platforms at a specific date and time, or add to an auto-queue that fills your optimal posting slots based on best-time analysis. Edit, reorder, or reschedule queued posts via drag-and-drop in the calendar or list view.' },
    { title: 'Bulk Cross-Posting', desc: 'Write one post and publish or schedule it to all 8 platforms simultaneously with platform-specific customizations. Edit the post for each platform independently — shorten for Twitter/X, add professional context for LinkedIn, add hashtags for Instagram — before sending as a batch.' },
    { title: 'Campaign Management', desc: 'Group posts into campaigns with defined goals (brand awareness, lead generation, product launch, event promotion), start/end dates, and optional budget tracking for promoted content. Campaign analytics roll up all post metrics for aggregate performance reporting.' },
    { title: 'Content Calendar', desc: 'Visual calendar view showing all scheduled posts across all platforms color-coded by account. Month, week, and day views. Drag posts to reschedule. See gaps in your posting schedule and fill them with AI-generated content from the calendar interface.' },
    { title: 'Hashtag Groups', desc: 'Create reusable hashtag sets for different content categories (e.g., "Tech News" = 25 specific hashtags, "Product Updates" = 20 others). Apply hashtag groups to posts with one click. The AI hashtag suggester adds platform-appropriate trending hashtags based on your post content and industry.' },
    { title: 'Post Templates', desc: 'Save frequently used post structures as templates — recurring announcements, weekly roundup formats, event promotion sequences. Templates include placeholder tokens that auto-fill with dynamic values (date, product name, link) when creating posts from the template.' },
    { title: 'Team Collaboration', desc: 'Multi-user workspaces with role-based permissions: Admin (full access), Editor (create and edit, no publish), Publisher (can schedule and publish), Analyst (read-only analytics). Post approval workflows let admins review content before it goes live. Comment threads on draft posts for team feedback.' },
    { title: 'Media Library', desc: 'Centralized media library for images, videos, and GIFs. Upload once, use across platforms. Auto-resize images to each platform\'s optimal dimensions. Video transcoding for platform-specific format requirements. Tag and search media by campaign, content type, or custom tags.' },
    { title: 'Link Shortener & UTM Builder', desc: 'Built-in link shortener creates branded short URLs for every post. Auto-append UTM parameters (source, medium, campaign, content) for Google Analytics tracking. Track clicks per platform, per post, and per campaign from the analytics dashboard.' },
    { title: 'Engagement Monitoring', desc: 'Unified inbox aggregates comments, mentions, replies, and DMs from all connected platforms. Reply directly from the inbox without leaving Echo Social Media Manager. Assign conversations to team members, mark as resolved, and filter by platform, sentiment, or status.' },
    { title: 'Best-Time Analysis', desc: 'Machine learning model analyzes your historical post performance data to identify the hours and days when your audience is most likely to engage for each platform and account. The Optimal Times recommendation updates weekly as new engagement data accumulates.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/posts', desc: 'Create a new post with content, platform targets, media attachments, hashtag groups, and optional campaign association. Set status to "scheduled" with a publish_at timestamp or "draft" for review.', auth: true },
    { method: 'POST', path: '/api/posts/bulk', desc: 'Create multiple posts in a single request — used for bulk cross-posting. Each post in the array can have platform-specific content overrides while sharing a base draft.', auth: true },
    { method: 'POST', path: '/api/posts/generate', desc: 'AI content generation endpoint. Pass a topic brief, target platforms, tone, and optionally a hashtag group ID. Returns platform-optimized post content for each requested platform.', auth: true },
    { method: 'GET', path: '/api/posts/calendar', desc: 'Get all scheduled posts for a date range formatted for calendar display. Returns posts grouped by date with platform, status, content preview, and media thumbnails.', auth: true },
    { method: 'POST', path: '/api/campaigns', desc: 'Create a new campaign with name, goal type, start date, end date, budget, and target platforms. Returns campaign ID for associating posts.', auth: true },
    { method: 'GET', path: '/api/analytics/posts', desc: 'Get engagement analytics for posts in a date range — impressions, reach, engagements, clicks, shares, saves, and engagement rate. Filterable by platform, campaign, content type, and account.', auth: true },
    { method: 'GET', path: '/api/analytics/best-times', desc: 'Get optimal posting time recommendations for each connected platform account based on your historical engagement data. Returns hour-of-day and day-of-week matrices with engagement scores.', auth: true },
    { method: 'POST', path: '/api/hashtags/suggest', desc: 'AI hashtag suggestion endpoint. Pass post content and target platform — returns a ranked list of relevant hashtags with estimated reach and recent usage volume for each.', auth: true },
  ],

  userGuide: [
    {
      id: 'creating-scheduling',
      title: 'Creating & Scheduling Posts',
      content: [
        'The post composer is the heart of Echo Social Media Manager. From the dashboard, click "New Post" or use the keyboard shortcut (Ctrl+N). The composer shows a central text area for your post content, a platform selector where you toggle which platforms to publish to, a media uploader, and a preview panel showing real-time renders of your post on each selected platform.',
        'For cross-platform posts, write your base content in the main text area. If you want to customize the version for specific platforms — shorter text for Twitter/X, professional tone for LinkedIn, more hashtags for Instagram — click the platform tab in the preview panel to edit that platform\'s version independently. Changes to the base content don\'t overwrite platform-specific edits once you\'ve customized them.',
        'Scheduling options appear in the bottom-right of the composer: "Publish Now" sends immediately, "Schedule" opens a date/time picker for a specific time, and "Add to Queue" inserts the post into the next open slot in your AI-optimized posting schedule. The queue respects per-platform daily posting limits to avoid flooding your audience.',
      ],
    },
    {
      id: 'ai-content',
      title: 'AI Content Generation',
      content: [
        'Click "Generate with AI" in the composer to open the AI content panel. Enter a topic brief describing what you want to communicate — be specific. "New product launch for our project management software featuring AI task prioritization, targeting busy entrepreneurs" produces much better results than "new product." The AI uses your brand voice settings and the brief to generate content tailored to each selected platform.',
        'The generated content appears in a side-by-side comparison panel with a version for each platform. Accept all with one click, or selectively accept individual platform versions. Click "Regenerate" on any platform to get an alternative take while keeping accepted versions unchanged. Use "Refine" to add specific instructions to an existing generation — "make the LinkedIn version more formal" or "add a call-to-action to the Twitter version."',
        'The AI hashtag suggester runs automatically on generated content. It analyzes the post text and your industry to suggest trending and niche hashtags with estimated reach data. Approve the full suggested set, manually deselect unwanted hashtags, or add your own. Hashtag suggestions take platform limits into account — Instagram allows 30 (and uses them), LinkedIn allows 5 (and should use them sparingly for credibility), Twitter/X works best with 1-2.',
      ],
    },
    {
      id: 'campaigns',
      title: 'Campaign Management',
      content: [
        'Campaigns organize related posts around a common goal and time period. Create a campaign from the Campaigns tab — set the name, select a goal type (Brand Awareness, Engagement, Traffic, Lead Generation, Product Launch, Event Promotion), define start and end dates, and optionally enter a budget for promoted content spending tracking.',
        'When creating posts, associate them with a campaign using the campaign selector in the composer. All posts in a campaign appear in the campaign detail view in the calendar, making it easy to visualize the content cadence and identify gaps. The campaign analytics tab aggregates all post performance into campaign-level metrics: total reach, total engagements, total clicks, cost-per-click (if budget is entered), and progress toward the stated goal.',
        'Campaign templates accelerate launch preparation. Save a campaign structure — content themes, posting cadence, platform mix, hashtag groups — as a reusable template. When you\'re launching a similar campaign next quarter, create from the template and adjust only the dates and specific content. This ensures brand consistency and reduces setup time for recurring campaign types.',
      ],
    },
    {
      id: 'analytics-insights',
      title: 'Analytics & Performance Insights',
      content: [
        'The Analytics dashboard provides three levels of insight. The Overview section shows total reach, engagements, follower growth, and link clicks across all platforms for your selected date range with sparkline trend charts. The Platform Breakdown section shows the same metrics per platform so you can see which channels are driving the most value. The Content Performance section ranks your posts by engagement rate, reach, and click-through — revealing what resonates with your audience.',
        'The Best Times heatmap is one of the most actionable analytics features. For each platform, it shows a 7×24 grid (days vs hours) colored by average engagement rate for posts published at that time. The brighter the cell, the better your audience engages at that hour. Use this to populate your posting queue with the highest-engagement time slots. The heatmap updates weekly as new post performance data is collected.',
        'The AI Performance Analysis runs automatically and surfaces weekly recommendations. It identifies your top 5 performing posts, extracts common characteristics (content type, length, hashtag count, topic, emotional tone), and generates a "what\'s working" summary. It also identifies your 5 lowest-performing posts with a hypothesis about why they underperformed. These recommendations appear in the Insights tab and as suggested improvements when the AI generates new content.',
      ],
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration & Approvals',
      content: [
        'Multi-user access is configured from Settings > Team. Invite team members by email and assign roles. Admins have full access to all features including account connections and billing. Editors can create and edit posts but cannot publish — their posts go into a "Pending Review" queue. Publishers can create, edit, and publish. Analysts can view all analytics and post data but cannot create or edit content.',
        'The approval workflow activates when at least one Editor role exists in your workspace. When an Editor creates a post, it appears in the Pending Review queue for Admin or Publisher review. Reviewers see the post content, platform targets, schedule time, and can leave inline comments. Approve to move to scheduled status, or Request Revision to send back to the editor with feedback.',
        'The activity log records every action in the workspace — who created what post, who approved or rejected it, schedule changes, account connections, and settings modifications. The log is accessible to Admins and is invaluable for understanding what changed if a post went out incorrectly or tracking team productivity.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Platform-Optimized Content Generation', desc: 'Generates tailored post content for each platform simultaneously from a single brief. Automatically adjusts tone (casual for Twitter/X, professional for LinkedIn), length (thread potential for Twitter/X, long-form for LinkedIn, caption for Instagram), emoji usage, CTA style, and hashtag strategy to match each platform\'s best practices and your brand voice settings.' },
    { capability: 'Hashtag Suggestion & Analysis', desc: 'Analyzes post content and industry to suggest relevant hashtags ranked by estimated reach and current usage volume. Differentiates between high-reach broad hashtags (large audience, high competition) and niche hashtags (smaller but more targeted audience). Tracks your historical hashtag performance to refine suggestions toward tags that actually drive engagement on your specific accounts.' },
    { capability: 'Performance Prediction', desc: 'Before publishing, scores each post\'s predicted engagement rate based on content characteristics, historical performance patterns, selected posting time vs optimal time, platform algorithm signals, and current trending topics. Posts scoring below your account average trigger suggestions for improvement before they go live.' },
    { capability: 'Best-Time Optimization', desc: 'Machine learning model continuously analyzes the relationship between posting time and engagement rate for each connected account on each platform. Accounts for day-of-week variation, holiday effects, and seasonal shifts in your audience\'s activity patterns. Recommendations are account-specific — your B2B LinkedIn audience has different activity patterns than your B2C Instagram audience.' },
    { capability: 'Content Repurposing', desc: 'Transforms existing content assets into social-ready posts. Input a blog post URL, podcast transcript, video script, or whitepaper excerpt — the AI extracts the key insights, statistics, and quotes to generate a week\'s worth of posts in different formats (key takeaways thread, quote cards, data callouts, teaser posts) with the original source link as the call to action.' },
    { capability: 'Competitive Intelligence', desc: 'Monitors publicly available engagement metrics and posting patterns for specified competitor accounts. Identifies which content types and topics are driving their highest-performing posts. Surfaces opportunities where competitor posting cadence is low (content gap) and topics where they\'re driving high engagement that your brand could address. Competitor monitoring is limited to public data only.' },
  ],

  troubleshooting: [
    { issue: 'Platform OAuth connection failing or disconnecting', solution: 'OAuth tokens expire and platforms periodically revoke access requiring reauthorization. Go to Settings > Connected Accounts, find the disconnected platform, and click "Reconnect." For Instagram and Facebook, ensure your Meta Business Suite account has the correct permissions — Instagram Creator accounts require "instagram_content_publish" permission and a connected Facebook Page. Twitter/X connections require app-level write permissions — if you previously connected with read-only access, disconnect and reconnect to grant write permissions. LinkedIn company page connections require Page Admin role — personal profile connections cannot publish to company pages.' },
    { issue: 'Scheduled post failed to publish', solution: 'Check the post\'s status in the Scheduled Posts list — failed posts show an error code. Common failure reasons: platform API rate limit exceeded (common if scheduling many posts in the same hour — spread posts across time slots), media format not accepted by the platform (check platform-specific requirements: Instagram requires JPG/PNG/MP4, LinkedIn max 5GB video, TikTok requires vertical video 9:16 aspect ratio), expired OAuth token (reconnect the account), or platform API outage (check platform status pages and retry). Failed posts are automatically retried once after 30 minutes; manually retry from the post detail page after fixing the underlying issue.' },
    { issue: 'AI-generated content not matching brand voice', solution: 'Review and update your Brand Voice settings in Settings > AI > Brand Voice. The tone (professional/casual/humorous), industry, key topics, and any brand-specific terminology significantly affect output quality. Add example posts that represent your ideal brand voice in the "Voice Examples" field — these are used as few-shot examples in the generation prompt. Avoid using the generator for first-time post types without voice examples; add 3-5 representative examples of that post type first.' },
    { issue: 'Analytics showing zero data for connected accounts', solution: 'Analytics data for newly connected accounts takes 24-48 hours to populate historical data. For ongoing gaps, verify the connected account token has analytics/read permissions — some platforms require separate analytics permissions during OAuth. Instagram Insights require a professional account (Business or Creator) connected to a Facebook Page; personal Instagram accounts do not expose analytics via API. Check that your account has at least one post published through the platform\'s native interface — accounts with zero posts return empty analytics from most platform APIs.' },
    { issue: 'Posts not appearing in content calendar', solution: 'Verify the post status is "Scheduled" not "Draft" — drafts do not appear in the calendar. Check the calendar date range covers the post\'s scheduled date. If you recently changed timezones in Settings > Account, scheduled post times may have shifted — the system stores times in UTC and displays them in your configured timezone. Confirm the platform filter in the calendar top bar is not excluding the platform the post is scheduled to.' },
  ],

  faq: [
    { q: 'Which social media platforms are supported?', a: 'Echo Social Media Manager supports Twitter/X, LinkedIn (personal profiles and company pages), Instagram (Business and Creator accounts), Facebook (profiles and Pages), Reddit (posting to subreddits you moderate), TikTok, YouTube (Community posts and video metadata scheduling for pre-uploaded videos), and Threads. Each platform uses the official API — content is published natively and appears organically in your followers\' feeds, not as third-party embedded content.' },
    { q: 'Can I schedule Instagram Stories and Reels?', a: 'Instagram Stories and Reels scheduling is available on Professional and Enterprise plans via the Instagram Content Publishing API. Stories scheduling requires your Instagram Business account to be connected to a Facebook Page. Reels scheduling supports video uploads up to 1 GB, vertical format (9:16), and between 3 and 90 seconds. Story scheduling delivers a mobile push notification at the scheduled time prompting you to approve publication — a current Instagram API limitation for Stories. Feed posts publish automatically without notification.' },
    { q: 'How many team members can I add?', a: 'Starter plans include 2 users. Professional plans include 5 users. Enterprise plans have unlimited users. Additional seats can be added to any plan at a per-seat monthly rate. Each user has their own login and activity is tracked individually in the audit log. Team members can be assigned to specific accounts or campaigns — an agency managing multiple client accounts can configure each team member to only see and manage their assigned clients\' content.' },
    { q: 'Does Echo Social Media Manager handle paid social advertising?', a: 'The platform manages organic posting and scheduling. For paid advertising, you track ad spend via the budget field in campaigns (manual entry of what you\'re spending through each platform\'s native ads manager), which is included in campaign ROI calculations alongside organic engagement data. Direct paid ad campaign creation and management (Facebook Ads Manager, LinkedIn Campaign Manager) is on the product roadmap for a future release.' },
    { q: 'Can I manage multiple clients or brands in one account?', a: 'Yes via Workspaces on Enterprise plans. Each workspace is fully isolated — separate connected accounts, content libraries, analytics, and team members. Switch between workspaces from the top navigation. Agencies can create one workspace per client, add the client\'s accounts to that workspace, and invite the client as an Observer-role user to view their own analytics and post calendar without accessing other clients\' data.' },
    { q: 'How far in advance can I schedule posts?', a: 'Posts can be scheduled up to 12 months in advance on all plans. There is no minimum lead time — you can schedule a post to publish in 5 minutes. The maximum queue size per account is 500 scheduled posts across all platforms. For large content operations, use the bulk import feature (CSV upload) to schedule hundreds of posts at once, then review and adjust in the calendar view.' },
  ],
}

export default function EchoSocialMediaDocsPage() {
  return <ProductDoc {...data} />
}
