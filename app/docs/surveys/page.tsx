'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Surveys',
  tagline: 'Intelligent survey platform with NPS, CSAT, and custom feedback collection — powered by AI analysis.',
  accent: '#06b6d4',
  productUrl: '/surveys',
  workerUrl: 'https://echo-surveys.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Surveys is a full-featured survey and feedback platform with 40+ API endpoints and 6 D1 tables. Build surveys from scratch using a flexible JSON question schema, or deploy pre-configured NPS (0-10 scale) and CSAT (1-5 stars) presets in under a minute. Every survey is accessible via a clean public slug-based URL with no login required for respondents.',
    'The NPS engine automatically calculates your Net Promoter Score from responses — classifying each respondent as a promoter (9-10), passive (7-8), or detractor (0-6) and computing the rolling NPS score as percentage promoters minus percentage detractors. CSAT surveys aggregate 1-5 star ratings into an average satisfaction score with trend tracking over time. Both preset types capture qualitative follow-up reasons for the quantitative score.',
    'Response webhooks fire in real time as answers are submitted, enabling downstream workflows like creating CRM tasks for detractors, alerting your support team to low CSAT scores, or syncing feedback to your data warehouse. AI-powered question generation helps you build better surveys faster, while AI feedback analysis surfaces themes, sentiment patterns, and actionable insights from open-ended responses without manual review.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create a Survey', desc: 'Navigate to /surveys and click "New Survey." Choose a blank survey or start from a preset (NPS, CSAT, Product Feedback, Employee Engagement). Give it a name, internal description, and set the public-facing title and intro text that respondents will see.' },
    { step: 2, title: 'Add Questions', desc: 'Use the question builder to add questions with type, label, required flag, and type-specific settings. NPS questions use type "nps" (0-10 scale with automatic promoter/passive/detractor classification). CSAT uses type "rating" (1-5). Open text, multiple choice, checkbox, and dropdown types are also available.' },
    { step: 3, title: 'Configure Response Settings', desc: 'Set the survey active window (start and end dates), maximum response limit, allow anonymous responses toggle, and redirect URL after submission. Advanced settings include response deduplication by email or cookie, and GDPR consent checkbox injection.' },
    { step: 4, title: 'Share Your Survey', desc: 'Copy the public survey URL (echo-ept.com/surveys/SLUG) and share via email, social media, SMS, or embed the survey inline on your website using the iframe embed code from the Share tab. QR code generation is available for print materials.' },
    { step: 5, title: 'Analyze Responses', desc: 'Monitor responses in real time from the Analytics dashboard. View NPS scores, CSAT averages, individual response details, and AI-generated theme analysis on open-ended questions. Export responses to CSV or trigger the AI analysis job for a structured insight report.' },
  ],

  features: [
    { title: 'JSON Question Schema', desc: 'Surveys are defined by a flexible JSON question array supporting 8 question types: nps (0-10), rating (1-5), text (short answer), textarea (long answer), multiple_choice (single select), checkbox (multi-select), dropdown (select menu), and email. Each question has label, required, placeholder, and type-specific config fields.' },
    { title: 'NPS Preset', desc: 'One-click NPS survey template with the standard "How likely are you to recommend us?" question (0-10 scale), automatic promoter/passive/detractor classification, and an optional follow-up open-text question. The dashboard displays rolling NPS score, response volume, and distribution breakdown by classification.' },
    { title: 'CSAT Preset', desc: 'Customer Satisfaction preset with a 1-5 star rating question, automatic average score calculation, and an optional "What can we improve?" text follow-up. Scores trend over a rolling 30-day window. CSAT scores can be segmented by tag, allowing comparison across product areas, support agents, or customer segments.' },
    { title: 'Public Slug-Based Access', desc: 'Every survey is available at a clean URL (echo-ept.com/surveys/YOUR-SLUG) with no authentication required. Slugs are auto-generated from the survey name but fully customizable. Survey pages render with your branding colors and logo, and are fully mobile-responsive.' },
    { title: 'Auto NPS Score Calculation', desc: 'As responses arrive, the NPS engine recalculates the current NPS score in real time: (promoters% − detractors%). The dashboard shows the current score, a 30-day trend chart, promoter/passive/detractor percentages, and volume breakdowns. Historical NPS scores are snapshotted daily for long-term trend analysis.' },
    { title: 'Response Webhooks', desc: 'Configure outbound webhooks on the response.created event to fire a JSON payload to any HTTPS endpoint immediately when a response is submitted. The payload includes the response ID, survey ID, all answers, submission timestamp, respondent email (if collected), and computed scores for NPS/CSAT questions.' },
    { title: 'AI Question Generation', desc: 'Describe your survey goal (e.g., "measure customer satisfaction after a support interaction") and the AI generates a complete, validated question set with appropriate types, labels, and order — optimized for completion rate and data quality. Generated questions are pre-loaded into the builder for review and editing.' },
    { title: 'AI Feedback Analysis', desc: 'Run an AI analysis job on any survey\'s open-ended responses. The analysis returns: key themes with frequency counts, overall sentiment breakdown (positive/neutral/negative), representative verbatim quotes per theme, and a prioritized list of actionable improvement recommendations — all without manually reading every response.' },
    { title: 'Response Limits & Scheduling', desc: 'Set a maximum response cap (the survey auto-closes when reached) and an expiration date for time-bounded campaigns. Surveys can also be set to accept one response per email address, preventing duplicate submissions from the same respondent.' },
    { title: 'Multi-Language Support', desc: 'Configure surveys with translated question labels and UI strings for up to 12 languages. The survey UI auto-detects the respondent\'s browser language and renders the appropriate translation. AI-assisted translation is available to generate initial translations from your source language for review.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/surveys', desc: 'List all surveys with response counts, NPS scores, CSAT averages, and status (active, closed, draft). Supports filtering by status and search by name.', auth: true },
    { method: 'POST', path: '/api/surveys', desc: 'Create a new survey. Body includes name, slug, questions array (JSON), settings object, and optional preset type (nps, csat). Returns created survey with ID.', auth: true },
    { method: 'GET', path: '/api/surveys/:id/responses', desc: 'Retrieve all responses for a survey with pagination. Each response includes all answer values, submission timestamp, computed NPS classification or CSAT score, and respondent email if captured.', auth: true },
    { method: 'POST', path: '/api/s/:slug', desc: 'Public endpoint for submitting a survey response. Accepts an answers object keyed by question ID. Validates required questions, enforces response limits, and fires webhooks. No auth required.', auth: false },
    { method: 'GET', path: '/api/surveys/:id/nps', desc: 'Returns current NPS score, promoter/passive/detractor percentages, response volume, and a 30-day daily NPS trend array. All metrics computed in real time from the responses table.', auth: true },
    { method: 'GET', path: '/api/surveys/:id/csat', desc: 'Returns current CSAT average score (1.00–5.00), score distribution histogram, rolling 30-day trend, and top verbatim responses sorted by recency.', auth: true },
    { method: 'POST', path: '/api/surveys/:id/analyze', desc: 'Trigger an AI analysis job on open-ended responses. Returns a job ID for polling. On completion, the job result contains themes, sentiment breakdown, and prioritized recommendations.', auth: true },
    { method: 'GET', path: '/api/surveys/:id/export', desc: 'Export all survey responses to CSV. Columns include submission timestamp, respondent email, and one column per question. Accepts format=csv or format=json query param.', auth: true },
  ],

  userGuide: [
    {
      id: 'building-surveys',
      title: 'Building Surveys',
      content: [
        'The survey builder uses a drag-and-drop interface to compose questions. Each question card shows the question type badge, label text, required indicator, and a preview of how it will appear to respondents. Drag questions to reorder them — survey completion rates generally improve when shorter or easier questions come first.',
        'For multiple choice and dropdown questions, add options in the Choices panel. Mark one option as "other" to allow free-text write-ins. For NPS questions, the 0-10 scale renders automatically — you only configure the anchor labels ("Not at all likely" and "Extremely likely") and the optional follow-up open text question. For rating questions, choose between 1-5 stars, 1-5 numeric, or emoji scale (😞 to 😊).',
        'Use the Branching tab to set conditional logic — show or hide questions based on previous answers. For example, show a follow-up question only to respondents who score 6 or below on an NPS question (detectors and passives). Branching is defined per question using a simple condition editor with no code required.',
      ],
    },
    {
      id: 'nps-analysis',
      title: 'NPS Analysis',
      content: [
        'Net Promoter Score is calculated as: (% Promoters) − (% Detractors), where promoters are 9-10 scores, passives are 7-8, and detractors are 0-6. NPS ranges from -100 to +100. Scores above 0 are considered good, above 50 are excellent, and above 70 are world class.',
        'The NPS dashboard shows your current score prominently alongside the response volume and distribution breakdown. Use the date range filter to see how your NPS has changed over time — compare post-launch vs. today, or Q1 vs. Q2. Click into the detractor segment to read their verbatim responses and identify common pain points to address.',
        'Tag responses with segment labels (e.g., "Enterprise," "SMB," "Support Ticket") to compare NPS across customer types. Segment-level NPS often reveals that your overall score is masking strong performance in one segment and poor performance in another. The segment filter applies to all NPS dashboard views.',
      ],
    },
    {
      id: 'response-webhooks',
      title: 'Response Webhooks',
      content: [
        'Configure webhooks in Survey Settings > Integrations > Webhooks. Add a target URL and optionally filter by score range — for example, only fire webhooks for NPS detractors (score 0-6) to route low-score responses directly to your support team CRM. Multiple webhooks can be configured per survey.',
        'Webhook payloads are signed with HMAC-SHA256 using your webhook secret. Verify signatures in your receiving endpoint by computing HMAC-SHA256 over the raw request body using your secret and comparing it to the X-Echo-Signature header. This ensures payloads are genuine and haven\'t been tampered with.',
        'The webhook delivery log shows every attempted delivery with status code, response body, and retry history. Failed webhooks are retried up to 5 times with exponential backoff (1, 5, 25, 125, 625 minutes). After 5 failures, the webhook is marked "failed" and an email alert is sent to the account owner.',
      ],
    },
    {
      id: 'ai-analysis',
      title: 'AI Feedback Analysis',
      content: [
        'The AI analysis feature processes all open-ended text responses for a survey and returns a structured insight report. Trigger it from the Analytics tab > AI Insights > Generate Report. Analysis runs asynchronously — for surveys with up to 1,000 responses, it typically completes in under 2 minutes.',
        'The report includes: a theme breakdown showing each identified theme, its frequency, sample quotes, and sentiment; an overall sentiment distribution (positive, neutral, negative percentages); and a prioritized recommendation list sorted by frequency and impact. Each recommendation links to the supporting response quotes.',
        'AI analysis results are cached and displayed directly in the dashboard. You can re-run the analysis at any time to include new responses collected since the last run. Export the analysis report to PDF for sharing with stakeholders or including in quarterly business reviews.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Question Generation', desc: 'Describe your survey goal in plain language and AI generates a complete, validated question set with appropriate types, optimal ordering for completion rate, and pre-written answer choices for multiple select questions. Generated surveys follow best practices for question neutrality and response validity.' },
    { capability: 'Open-Text Theme Analysis', desc: 'Processes all open-ended responses using NLP to cluster responses into recurring themes, assign sentiment labels, count theme frequency, and extract representative verbatim quotes. Returns structured JSON themes with counts, sentiment breakdown, and quote samples — turning hundreds of free-text responses into actionable categories.' },
    { capability: 'Sentiment Scoring', desc: 'Assigns individual sentiment scores (positive, neutral, negative) to every open-text response. Aggregate sentiment is tracked over time and segmented by NPS classification — allowing you to see if detractor sentiment is becoming more negative or if promoter comments are shifting.' },
    { capability: 'Response Anomaly Detection', desc: 'Identifies suspicious response patterns: identical responses submitted multiple times, response times under 10 seconds (indicating click-through without reading), sequential IP submissions, and response distributions that deviate significantly from baseline. Flagged responses are marked in the response table for manual review.' },
    { capability: 'Insight Recommendations', desc: 'Synthesizes theme analysis, sentiment trends, and score distributions into a prioritized list of specific, actionable recommendations. Each recommendation is backed by response evidence and ranked by estimated impact on NPS or CSAT improvement — giving your team a clear, evidence-based improvement roadmap.' },
  ],

  troubleshooting: [
    { issue: 'NPS score showing as 0 with responses present', solution: 'NPS calculation requires at least one NPS-type question in the survey (question type set to "nps" with scale 0-10). If responses exist but NPS shows 0, verify the question type is set to "nps" and not "rating." Update the question type in the survey editor — existing responses will be reprocessed automatically. Also check that response values are integers 0-10 and not string values.' },
    { issue: 'Webhook not firing on response submission', solution: 'Check the webhook configuration in Survey Settings > Integrations and verify the target URL is publicly accessible HTTPS. Test the webhook from the Delivery Log > Test button. If you\'ve configured a score filter (e.g., only NPS 0-6), verify the test response falls within the filter range. Check your server logs for incoming requests — the request arrives within 2 seconds of submission. Ensure your server returns HTTP 200; any other status triggers the retry queue.' },
    { issue: 'Survey shows "closed" to respondents before expected', solution: 'Check the response limit setting in Survey Settings > Response Limits. If a max response count was set, the survey auto-closes when that limit is reached. Also verify the survey end date in the Active Window settings — the survey closes at midnight UTC on the end date. Increase the limit or extend the end date to reopen the survey.' },
    { issue: 'AI analysis returning "insufficient data" error', solution: 'AI feedback analysis requires at least 10 open-text responses to generate meaningful themes. Surveys with fewer responses return this error. Collect more responses or combine responses from multiple survey runs using the merged analysis feature in Advanced Settings. Note that AI analysis only processes question types "text" and "textarea" — ensure your survey includes at least one of these question types.' },
  ],

  faq: [
    { q: 'Can respondents take the survey without creating an account?', a: 'Yes. All public surveys are accessible via the slug URL with no account or login required. You can optionally request an email address as a survey question to identify respondents, but it\'s never required unless you explicitly mark it as required in the question settings. Respondents never need to create an Echo account.' },
    { q: 'How is NPS different from a customer satisfaction rating?', a: 'NPS (Net Promoter Score) measures loyalty and likelihood to recommend — it predicts future behavior. CSAT measures satisfaction with a specific recent interaction — it reflects past experience. NPS is better for tracking long-term relationship health; CSAT is better for evaluating specific touchpoints like support tickets or onboarding. Echo Surveys supports both with pre-built presets and combined analysis.' },
    { q: 'How many responses can I collect per survey?', a: 'Free plans support up to 100 responses per survey and 500 total responses/month. Pro plans support up to 10,000 responses per survey and 50,000/month. Enterprise plans have no limits. All responses are stored indefinitely regardless of plan.' },
    { q: 'Can I embed a survey on my website?', a: 'Yes. Copy the iframe embed code from the survey Share tab. The iframe is responsive and automatically adjusts height to fit the survey content. For a modal/popup experience, use the JavaScript SDK (one script tag) which provides an open() method you can trigger from any button click or page event.' },
    { q: 'Are survey responses anonymous by default?', a: 'Responses are anonymous unless you include an email question or enable user authentication via the survey settings. When anonymous mode is on, IP addresses are hashed before storage, and no personally identifiable information is linked to responses. For GDPR compliance, anonymous mode is recommended for general feedback surveys.' },
    { q: 'How do I compare NPS scores across different time periods?', a: 'Use the Date Range filter on the NPS dashboard to select custom periods. The comparison mode lets you place two date ranges side by side to see NPS, response volume, and distribution for each period simultaneously. You can also view the daily NPS trend chart with a 7-day or 30-day rolling average overlay to smooth out day-to-day variance.' },
  ],
}

export default function EchosurveysDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/surveys' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
