'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Podcast',
  tagline: 'Full-stack podcast hosting with RSS 2.0 feeds, R2 audio streaming, embeddable players, and AI show notes',
  accent: '#a855f7',
  productUrl: '/podcast',
  workerUrl: 'https://echo-podcast.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Podcast is a complete podcast hosting and distribution platform built on Cloudflare Workers, R2, and D1. Upload audio files up to 200MB per episode — MP3, M4A, OGG, and WAV are all supported. Files are stored in R2 with byte-range request support for seekable streaming, meaning listeners can jump to any point in an episode without buffering the entire file first.',
    'Each podcast show generates a standards-compliant RSS 2.0 feed with full iTunes and podcast namespace support — including <itunes:image>, <itunes:category>, <itunes:explicit>, <itunes:duration>, <podcast:transcript>, and <podcast:chapters> elements. Feeds are KV-cached so even high-frequency directory crawls (Apple Podcasts, Spotify, Overcast) return instantly without hitting D1. The feed URL format is /feed/:slug and supports enclosure tags with accurate Content-Length headers required by podcast apps.',
    'Download tracking identifies the podcast app from the User-Agent header (Spotify, Apple Podcasts, Overcast, Pocket Casts, Castro, Google Podcasts, and 50+ others) and logs the download with episode ID, timestamp, and geo data. The embeddable HTML5 player (/player/:code) is a self-contained React component served as static HTML — drop it anywhere with an iframe. Eight D1 tables and 55+ endpoints cover the complete podcast lifecycle from upload through distribution and analytics.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Show', desc: 'Sign up at echo-ept.com/podcast and click "New Show". Enter the show title, description, category (from the iTunes category taxonomy), language, author name, and upload a 3000×3000 minimum cover art image. The cover art is stored in R2 and its URL is embedded in the RSS feed.' },
    { step: 2, title: 'Upload Your First Episode', desc: 'Click "New Episode" and upload your audio file (MP3 recommended, max 200MB). Add a title, season number, episode number, and show notes in the markdown editor. The system calculates the exact audio duration and file size automatically for the RSS enclosure tag.' },
    { step: 3, title: 'Submit Your Feed to Directories', desc: 'Your RSS feed is available immediately at https://echo-podcast.bmcii1976.workers.dev/feed/YOUR_SLUG. Submit this URL to Apple Podcasts Connect, Spotify for Podcasters, Amazon Music for Podcasters, and any other directory. Most directories poll the feed every 1–4 hours for new episodes.' },
    { step: 4, title: 'Embed the Player', desc: 'Copy the embed code from the Share panel: <iframe src="https://echo-podcast.bmcii1976.workers.dev/player/EMBED_CODE" height="180" width="100%" frameborder="0"></iframe>. Paste it into any website, blog post, or show notes page. The player renders at any width and handles its own audio loading.' },
    { step: 5, title: 'Set Up AI Show Notes', desc: 'Upload a transcript for any episode (plain text, SRT, or VTT format) and click "Generate AI Show Notes." The AI produces a structured summary with key takeaways, timestamps for major topics, and suggested chapter markers — ready to publish or edit before going live.' },
  ],
  features: [
    { title: 'RSS 2.0 + iTunes/Podcast Namespace', desc: 'Generates fully standards-compliant feeds with every required iTunes namespace element: <itunes:image>, <itunes:category>, <itunes:explicit>, <itunes:duration>, <itunes:episode>, <itunes:season>, and <itunes:episodeType>. Also supports the podcast 2.0 namespace elements including <podcast:transcript>, <podcast:chapters>, <podcast:soundbite>, and <podcast:value>.' },
    { title: 'R2 Audio Upload and Streaming', desc: 'Episodes are uploaded directly to R2 via a pre-signed URL (bypassing the Worker for large file uploads). Playback is served via a streaming endpoint that supports Range requests, enabling seek-to-position without buffering. The stream URL uses a short-lived signed token to prevent hotlinking.' },
    { title: 'Download Tracking with App Detection', desc: 'Every audio stream request is logged with the detected podcast app (identified from the User-Agent string), country, city, episode ID, and timestamp. The app detection library covers 60+ podcast clients including Spotify, Apple Podcasts, Overcast, Pocket Casts, Castro, iCatcher, Downcast, and more.' },
    { title: 'KV-Cached Feed Generation', desc: 'RSS feeds are generated from D1 on the first request and cached in KV for 10 minutes. High-frequency directory polls (Apple Podcasts crawls every hour, Spotify every 30 minutes) are served entirely from cache, keeping D1 query load flat regardless of feed popularity.' },
    { title: 'Embeddable HTML5 Player', desc: 'The /player/:code endpoint returns a complete HTML page with a styled, self-contained audio player. The player shows the episode title, show name, cover art, and a custom-styled HTML5 audio element with play/pause, seek bar, volume, and playback speed controls (0.5×, 0.75×, 1×, 1.25×, 1.5×, 1.75×, 2×).' },
    { title: 'Subscriber Management', desc: 'Track subscribers who opt in for new episode email notifications. Subscribers receive an email with the episode title, show notes summary, and a direct play link when a new episode is published. Bulk export subscribers as CSV for CRM import. Supports double opt-in with GDPR-compliant confirmation.' },
    { title: 'Playlists', desc: 'Create curated playlists (e.g., "Beginner Series", "Best Of 2025") from any combination of episodes, including episodes from different shows in the same account. Each playlist generates its own embeddable player and RSS feed, enabling course-style or compilation content distribution.' },
    { title: 'Scheduled Publishing with Auto-Publish', desc: 'Set a future publish date and time on any episode. The Worker checks for due episodes every 5 minutes via a scheduled cron trigger. When an episode\'s publish time arrives, it is automatically added to the RSS feed, notifications are sent to subscribers, and the episode becomes available for streaming.' },
    { title: 'Transcript Support', desc: 'Upload transcripts in plain text, SRT, or WebVTT format. Transcripts are stored in R2 and referenced in the RSS feed via the <podcast:transcript> tag, enabling Overcast, Apple Podcasts, and other apps to display synchronized captions during playback.' },
    { title: 'AI Show Notes Generator', desc: 'Provide a transcript and the AI produces: a 3-paragraph show summary, 5 key takeaways, a timestamped topic outline (chapter markers), suggested episode title and description, and 10 relevant hashtags for social promotion. Output is editable before publishing.' },
    { title: 'AI Episode Ideas', desc: 'Based on the show\'s existing episode library and description, the AI generates a list of 10 future episode ideas ranked by audience demand signals (derived from the transcript and show notes content patterns). Each idea includes a suggested title, description, and talking points.' },
    { title: 'Analytics Dashboard', desc: 'Track downloads per episode, downloads per show over time, top podcast apps, top countries, and episode completion rates (for listeners who use the embedded player). Export all analytics as CSV. Compare episode performance head-to-head with the side-by-side chart view.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/shows', desc: 'Create a new podcast show with title, description, slug, category, language, and cover art URL. Returns show ID and feed URL', auth: true },
    { method: 'GET', path: '/feed/:slug', desc: 'The RSS 2.0 feed endpoint. Returns the podcast feed XML. KV-cached with 10-minute TTL. No auth required — this is the URL you submit to podcast directories', auth: false },
    { method: 'POST', path: '/shows/:id/episodes', desc: 'Create a new episode record with title, description, season, episode number, audio URL, duration, and publish_at. Returns episode ID and embed player URL', auth: true },
    { method: 'POST', path: '/shows/:id/episodes/upload', desc: 'Get a pre-signed R2 upload URL for a new episode audio file. Accepts filename and content_type. Returns upload_url (PUT to this URL directly) and the final audio_url for the episode record', auth: true },
    { method: 'GET', path: '/player/:code', desc: 'Returns a complete HTML5 player page for a single episode. The embed code is a short token generated per episode. No auth required — the player is designed to be publicly embeddable', auth: false },
    { method: 'GET', path: '/shows/:id/analytics', desc: 'Episode download analytics. Query params: start, end, interval (day/week/month), breakdown (app/country/episode). Returns download counts and timeseries data', auth: true },
    { method: 'POST', path: '/episodes/:id/transcript', desc: 'Upload a transcript (text, SRT, or VTT). The transcript is stored in R2 and linked to the episode. The RSS feed is updated to include the <podcast:transcript> tag', auth: true },
    { method: 'POST', path: '/episodes/:id/ai-show-notes', desc: 'Trigger AI show notes generation. Requires a transcript to be uploaded. Returns summary, key takeaways, chapter markers, suggested title/description, and hashtags', auth: true },
    { method: 'POST', path: '/shows/:id/ai-episode-ideas', desc: 'Generate AI episode ideas based on the show\'s episode library. Returns 10 ranked ideas with titles, descriptions, and talking points', auth: true },
    { method: 'POST', path: '/shows/:id/subscribers', desc: 'Subscribe an email address to new episode notifications. Triggers double opt-in confirmation email', auth: false },
    { method: 'POST', path: '/playlists', desc: 'Create a curated playlist from episode IDs. Returns playlist ID, embed code, and playlist RSS feed URL', auth: true },
  ],
  userGuide: [
    {
      id: 'rss-and-directories',
      title: 'RSS Feed and Directory Submission',
      content: [
        'Your RSS feed URL is https://echo-podcast.bmcii1976.workers.dev/feed/YOUR_SLUG. This is the canonical URL for your podcast. Submit it once to each directory and the directory handles all future updates by polling the feed. Never change this URL after initial submission — changing it breaks the podcast in every directory.',
        'For Apple Podcasts, submit at podcasters.apple.com. Create an account if you don\'t have one, click Add Show, and paste your feed URL. Apple validates the feed for XML correctness, required iTunes tags, cover art dimensions (minimum 1400×1400, maximum 3000×3000), and audio format before approving. Approval typically takes 24–72 hours.',
        'For Spotify, submit at podcasters.spotify.com. Spotify has stricter content policies and may reject shows that violate their policies. Spotify polls feeds every 30 minutes for new episodes — schedule your episode to publish at least 30 minutes before your intended live time to ensure it appears on time.',
      ],
    },
    {
      id: 'audio-upload',
      title: 'Uploading and Managing Audio',
      content: [
        'Audio files up to 200MB can be uploaded per episode. MP3 at 128kbps or 192kbps stereo is the recommended format for the best balance of quality and file size. For interview-style shows, 96kbps mono is sufficient and cuts file size nearly in half. WAV and M4A files are accepted but converted to MP3 for streaming compatibility.',
        'Upload is a two-step process: first call POST /shows/:id/episodes/upload to receive a pre-signed R2 URL, then PUT your file directly to that URL from your client. This bypasses the Worker for large file transfers, avoiding the 128MB Worker request body limit. The pre-signed URL expires after 1 hour.',
        'After uploading, the system uses FFprobe (compiled to WASM and running in the Worker) to extract the exact duration in seconds. The duration is stored on the episode record and included in the RSS feed\'s <itunes:duration> tag — a required field for podcast directories. Do not manually edit the duration as it must match the actual audio length.',
      ],
    },
    {
      id: 'player-embedding',
      title: 'Embedding the Audio Player',
      content: [
        'The /player/:code endpoint returns a full HTML page with a styled audio player for a single episode. The embed code is a short Base62 token generated when the episode is created. Embed the player using an iframe: <iframe src="https://echo-podcast.bmcii1976.workers.dev/player/EMBED_CODE" height="180" width="100%" frameborder="0" scrolling="no"></iframe>.',
        'The player renders the episode title, show name, cover art, and a custom-styled audio control bar. Playback speed controls (0.5× to 2×) are included. The player communicates play events back to the parent frame via postMessage if you want to trigger custom analytics when playback begins.',
        'Playlist players are available at /player/playlist/:id. The playlist player shows a track list, allows listeners to select any episode, and auto-advances to the next episode when one finishes. Use playlist players for course-style content or curated listening series.',
      ],
    },
    {
      id: 'transcripts-and-chapters',
      title: 'Transcripts, Chapters, and AI Tools',
      content: [
        'Upload a transcript in plain text, SRT, or WebVTT format via POST /episodes/:id/transcript. The transcript is stored in R2 and referenced in the RSS feed via the <podcast:transcript> tag. Apps that support podcast namespace 2.0 (Overcast, Fountain, Castamatic) will display synchronized captions during playback.',
        'Chapter markers can be added manually in the episode editor using the timestamps and titles from the AI show notes output. Chapters are stored in JSON and included in the RSS feed via the <podcast:chapters> tag. Podcast apps that support chapters (Overcast, Pocket Casts, Apple Podcasts) display a chapter list and allow listeners to jump between sections.',
        'To generate AI show notes, upload a transcript first, then click "Generate AI Show Notes" on the episode detail page or call POST /episodes/:id/ai-show-notes via the API. The generation takes 5–15 seconds depending on transcript length. Review the output and edit any inaccuracies before publishing — the AI output is a starting point, not final copy.',
      ],
    },
    {
      id: 'scheduled-publishing',
      title: 'Scheduled and Batch Publishing',
      content: [
        'Set a future publish time when creating or editing an episode. The publish_at field accepts any ISO 8601 datetime. Episodes with a future publish_at are not included in the RSS feed until that time arrives. The Worker runs a scheduled cron trigger every 5 minutes to check for episodes due for publication.',
        'When an episode publishes, the RSS feed cache in KV is immediately invalidated, forcing the next feed poll from any directory to fetch fresh data. Subscriber notification emails are queued and sent within 2 minutes of publication. The episode becomes streamable and the embeddable player becomes active simultaneously.',
        'To publish a season all at once on a weekly schedule, create all episodes with publish_at values spaced 7 days apart. The scheduled cron handles publication automatically without any manual action required. This is the recommended workflow for pre-produced season-based podcasts.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'AI Show Notes Generation', desc: 'Processes episode transcripts (plain text, SRT, or VTT) to produce a structured show notes document: 3-paragraph summary, 5 key takeaways, timestamped topic outline ready for chapter markers, and a standalone episode description for the RSS feed.' },
    { capability: 'Episode Idea Generation', desc: 'Analyzes the show\'s full episode library titles, descriptions, and transcripts to identify content gaps and audience interest signals. Generates 10 ranked future episode ideas with titles, 2-sentence descriptions, 5 talking points, and a suggested guest profile for each.' },
    { capability: 'Transcript-Based Search', desc: 'Indexes all uploaded episode transcripts and enables full-text search across the entire podcast library. Listeners can find the exact episode (and timestamp) where a topic was discussed. Search results link directly to the episode player with the playhead set to the matching timestamp.' },
    { capability: 'Clip Suggestion', desc: 'Identifies the most quotable or socially shareable moments in a transcript based on density of insight, completeness of thought, and emotional resonance signals. Outputs the top 5 suggested clips with timestamps, verbatim text, and a suggested social caption for each.' },
    { capability: 'Audience Growth Forecasting', desc: 'Uses download trajectory, subscriber growth rate, directory indexing status, and episode publishing cadence to forecast download counts at 30, 60, and 90 days. Highlights the publishing frequency and episode length combinations that correlate with the fastest growth in comparable shows.' },
    { capability: 'Show Notes SEO Optimization', desc: 'Analyzes the episode title and show notes text against search volume data for podcast-discovery queries. Suggests keyword-optimized title variants and description improvements that improve the show\'s ranking in Apple Podcasts search, Spotify search, and Google podcast results.' },
  ],
  troubleshooting: [
    { issue: 'Apple Podcasts rejected my feed submission', solution: 'The most common rejection reasons are: cover art below 1400×1400 pixels (upload a 3000×3000 square image), missing <itunes:category> tag, audio file returning a non-200 HTTP status, or the feed URL requiring authentication. Check the Apple Podcasts validation response for the specific error. The feed validator at podba.se/validate/ can diagnose most issues before resubmission.' },
    { issue: 'New episode is not appearing in Spotify after publishing', solution: 'Spotify polls feeds every 30 minutes. Wait at least 60 minutes after publishing. If the episode still does not appear, log into podcasters.spotify.com and use the "Refresh feed" button to force an immediate poll. Verify the episode\'s publish_at time has passed and the episode appears correctly in your Echo Podcast dashboard.' },
    { issue: 'Audio is not seekable in some podcast apps', solution: 'Seekability requires the R2 streaming endpoint to support HTTP Range requests. Verify the episode was uploaded via the pre-signed R2 URL flow (not pasted as an external URL). External audio URLs that do not support Range requests will not be seekable. All R2-hosted audio in Echo Podcast supports Range requests natively.' },
    { issue: 'Download count seems lower than expected', solution: 'Download analytics exclude requests from known podcast directory crawlers (Apple, Spotify, Google) that fetch the audio file to validate it — these are not listener downloads. Only requests with a User-Agent matching a listener podcast client are counted. Automated feed validator tools also do not count.' },
    { issue: 'AI show notes generation returned an error', solution: 'AI show notes require a transcript to be uploaded first. The transcript must be at least 500 words for the AI to produce meaningful output. Very short transcripts (< 500 words) return a simplified summary only. Check that the transcript upload completed successfully (the episode detail page shows a Transcript badge when a transcript is attached).' },
  ],
  faq: [
    { q: 'What audio formats are supported?', a: 'MP3, M4A (AAC), OGG Vorbis, and WAV are all accepted for upload. MP3 is the only format universally supported by all podcast directories and apps — M4A is supported by Apple Podcasts and Overcast but not all clients. For maximum compatibility, use MP3 at 128kbps stereo or 96kbps mono for voice-only content.' },
    { q: 'How is the embed player different from the RSS feed?', a: 'The RSS feed is consumed by podcast directories and apps. The embed player is a web-based HTML5 player that can be embedded in any website. Listeners who use the embedded player are tracked separately from directory download counts. The embed player supports chapters, playback speed, and custom branding.' },
    { q: 'Can I host a private podcast with access control?', a: 'Yes. Set a show\'s visibility to Private in Show Settings. Private shows are not listed publicly and the RSS feed requires an authentication token in the URL. Share the authenticated feed URL only with authorized subscribers. This is useful for paid member podcasts, internal company podcasts, and course audio.' },
    { q: 'Does Echo Podcast handle dynamic ad insertion?', a: 'The current version does not support dynamic ad insertion (DAI). Episodes are served as-is from R2. For ad monetization, the recommended approach is host-read ads inserted during production. DAI support with pre-roll, mid-roll, and post-roll injection points is on the product roadmap.' },
    { q: 'How accurate is the download count compared to IAB standards?', a: 'Echo Podcast follows IAB Podcast Measurement Technical Guidelines v2.1 for download counting: only one download per listener per episode per 24-hour window is counted, range requests from the same IP within the same hour are deduplicated, and directory crawls and validator requests are excluded. This makes the counts directly comparable to Spotify and Apple Podcasts analytics.' },
    { q: 'Can I import an existing podcast from another host?', a: 'Yes. Use the Import Show feature in the dashboard. Paste your existing RSS feed URL and the system fetches all episode metadata and audio file URLs. Episode records are created in D1. Audio files are optionally re-uploaded to R2 (recommended for reliability) or left on the original host and referenced by URL (migration option for large back catalogs).' },
  ],
}

export default function PodcastDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/podcast' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
