'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Forms',
  tagline: 'Advanced form builder with quiz scoring, webhooks, and AI question suggestions — 12+ field types, zero code required.',
  accent: '#8b5cf6',
  productUrl: '/forms',
  workerUrl: 'https://echo-forms.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Forms is a production-grade form builder platform with 50+ API endpoints and 7 D1 tables. Build everything from simple contact forms to complex multi-page quizzes with conditional logic, weighted scoring, and automated response processing. Every form is accessed via a public slug-based URL with configurable response limits and date-based availability windows.',
    'The field type system supports 12+ types covering all common input patterns: short text, long text, email, phone, URL, number, date, time, dropdown, multi-select checkbox, file upload, and a quiz-specific correct_value field for auto-scoring. Quiz mode calculates a total score from weighted correct answers and can display the result to respondents immediately on submission, with optional pass/fail thresholds and congratulations or feedback messaging.',
    'Every form submission can trigger outbound webhooks with HMAC-SHA256 signed payloads for secure downstream processing. A template library stores reusable form definitions that can be cloned and customized in seconds. AI question suggestions analyze your form title and generate relevant, well-phrased questions to help you build complete forms faster. Full CSV and JSON export keep your response data accessible for any downstream analysis.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create a Form', desc: 'Navigate to /forms and click "New Form." Enter a title, internal description, and optional public intro text. Choose between Standard form (collect submissions) or Quiz mode (score answers against correct_value keys). Forms generate a unique slug from the title, which you can customize.' },
    { step: 2, title: 'Add Fields', desc: 'Use the field builder to add questions. Select a field type from the 12+ available types, write your label, add help text, mark required/optional, and configure type-specific settings (options list for dropdowns, min/max for numbers, correct_value and points for quiz fields). Drag fields to reorder.' },
    { step: 3, title: 'Configure Settings', desc: 'Set availability: start date, end date (optional), and maximum response count (optional). Enable email notifications to receive an alert on each new submission. Configure the success message or redirect URL shown after submission. For quizzes, set pass threshold and result messaging for pass/fail outcomes.' },
    { step: 4, title: 'Add Webhooks', desc: 'In the Integrations tab, add a webhook URL and select events to subscribe to (response.created is the primary event). Each webhook is sent with an X-Echo-Signature header for verification. Test the webhook immediately from the configuration panel before going live.' },
    { step: 5, title: 'Publish & Share', desc: 'The form is live at echo-ept.com/forms/SLUG the moment you save it (if within the active window). Copy the public URL to share directly, or grab the iframe embed code or JavaScript snippet for in-page embedding. Monitor incoming responses in real time from the Responses tab.' },
  ],

  features: [
    { title: '12+ Field Types', desc: 'Full field type library: text (single line), textarea (multi-line), email (with format validation), phone (with E.164 normalization), url (with protocol validation), number (with min/max range), date, time, datetime, dropdown (single select), checkbox_group (multi-select), file (upload to R2), and quiz (answer with correct_value and point weight).' },
    { title: 'Quiz Scoring Engine', desc: 'Enable quiz mode to unlock answer scoring. Each quiz field has a correct_value and a points weight. On submission, the engine compares submitted answers against correct_value for all quiz fields, sums earned points vs. total possible points, computes a percentage score, and determines pass/fail against the configured threshold — all server-side in a single transaction.' },
    { title: 'Template Library', desc: 'Save any form as a reusable template with a name, category, and description. The template library provides one-click clone — select a template, give the clone a new name, and all fields, settings, and conditional logic are duplicated instantly. Shared templates allow your team to standardize form structures across projects.' },
    { title: 'Conditional Logic', desc: 'Show or hide fields based on previous answers using the visual condition builder. Each field can have one or more display conditions: show this field only if field X equals value Y, or hide if field Z contains text. Conditions support equals, not equals, contains, greater than, and less than operators across all compatible field types.' },
    { title: 'Public Slug Access', desc: 'Forms are served at a clean, memorable public URL with no authentication required for respondents. Slugs support alphanumeric characters and hyphens, up to 64 characters. If a form has an active response window and hasn\'t hit its maximum response count, it renders and accepts submissions. Outside of the window or at the limit, it renders a custom closed message.' },
    { title: 'Date & Response Limits', desc: 'Control form availability with precision: set a start_at timestamp (form is inaccessible before this time), end_at timestamp (form closes automatically at this time), and max_responses integer (form closes once this many submissions are received). All three controls work independently and can be combined.' },
    { title: 'Response Analytics', desc: 'The Analytics tab shows submission volume over time, field completion rates (percentage of submissions that answered each field), common answers for dropdown and checkbox fields (frequency distribution), and average quiz scores. Identify which fields are frequently skipped to improve form completion rates.' },
    { title: 'Signed Webhook Payloads', desc: 'Webhook payloads are signed using HMAC-SHA256 with your per-webhook secret. The signature covers the raw JSON request body and is included in the X-Echo-Signature header as a hex digest. Verify signatures in your receiving server to ensure payloads are authentic before processing.' },
    { title: 'CSV & JSON Export', desc: 'Export all responses for a form in CSV format (one row per submission, one column per field) or JSON (array of response objects with full metadata). Apply date range and status filters before exporting. Scheduled exports can automatically deliver a CSV to an email address or webhook endpoint on a weekly cadence.' },
    { title: 'File Upload Fields', desc: 'File upload fields store submitted files directly to Cloudflare R2. Files are scanned for malware on receipt, stored with a unique object key per submission, and returned as a signed R2 URL in the response payload. Set allowed MIME types, maximum file size (up to 50MB), and maximum file count per field.' },
    { title: 'AI Question Suggestions', desc: 'Enter your form title and purpose — AI generates a complete set of relevant, well-phrased questions with appropriate types and answer options. Suggestions are pre-loaded into the builder for review and one-click acceptance. The AI considers form best practices: question neutrality, logical ordering, and appropriate granularity per field type.' },
    { title: 'Multi-Page Forms', desc: 'Split long forms into multiple pages to reduce cognitive load and improve completion rates. Each page has a title, optional description, and its own set of fields. The form wizard UI shows a progress indicator. Respondents can navigate back to previous pages before final submission. Conditional page branching routes respondents to different pages based on their answers.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/forms', desc: 'List all forms with response counts, quiz mode flag, active status, and latest activity. Supports pagination, search by title, and filter by status (active, closed, draft).', auth: true },
    { method: 'POST', path: '/api/forms', desc: 'Create a new form. Body includes title, slug, fields array (JSON), settings object (quiz_mode, pass_threshold, max_responses, start_at, end_at), and optional intro/success message text.', auth: true },
    { method: 'PUT', path: '/api/forms/:id', desc: 'Update a form definition including fields, settings, and slug. Updating fields does not retroactively alter existing responses. Returns the updated form definition.', auth: true },
    { method: 'GET', path: '/api/f/:slug', desc: 'Public endpoint to fetch a form definition for rendering. Returns fields, settings, and metadata but omits correct_value for quiz fields (preventing answer scraping). Auth not required.', auth: false },
    { method: 'POST', path: '/api/f/:slug/submit', desc: 'Submit a form response. Body is an answers object keyed by field ID. Server validates required fields, runs quiz scoring if enabled, enforces response limits, and fires webhooks. Returns submission ID and quiz score if applicable.', auth: false },
    { method: 'GET', path: '/api/forms/:id/responses', desc: 'Retrieve paginated responses for a form with full answer detail, submission timestamp, quiz score, and pass/fail result per response. Supports date range filtering.', auth: true },
    { method: 'GET', path: '/api/forms/:id/analytics', desc: 'Returns aggregated analytics: daily submission counts, per-field completion rates, answer distributions for choice fields, and average/max/min quiz scores.', auth: true },
    { method: 'POST', path: '/api/forms/:id/clone', desc: 'Clone a form — creates an exact copy with all fields, settings, and conditional logic. The clone gets a new ID and slug (original slug with "-copy" appended, customizable). Templates are created via this endpoint with a template flag.', auth: true },
    { method: 'GET', path: '/api/forms/:id/export', desc: 'Export responses as CSV or JSON. Accepts format query param (csv or json) and optional date range. Large exports are streamed to avoid timeout limits.', auth: true },
    { method: 'POST', path: '/api/ai/suggest', desc: 'AI question suggestion endpoint. Submit form title and purpose — returns a structured field definitions array with recommended types, labels, required flags, and answer options for choice fields.', auth: true },
  ],

  userGuide: [
    {
      id: 'building-forms',
      title: 'Building Forms',
      content: [
        'The form builder is a visual drag-and-drop interface where each field is represented as a card. Add a new field from the "+ Add Field" button, select the field type from the dropdown, and fill in the label, help text, placeholder, and any type-specific settings. For dropdown and checkbox fields, add your option choices in the Options panel — one option per line or comma-separated.',
        'Field validation is configured per field: required/optional toggle, minimum and maximum character count for text fields, allowed file types and max size for upload fields, and number range (min, max, step) for numeric fields. For email and phone fields, format validation is automatic — the form renders real-time inline error messages if the respondent enters an invalid format.',
        'Use the Preview tab at any time to see your form exactly as respondents will see it. The preview is interactive — you can fill it in, trigger conditional logic, and see the quiz scoring in action. Preview mode never creates actual responses, so use it freely for testing before publishing.',
      ],
    },
    {
      id: 'quiz-mode',
      title: 'Quiz Mode & Scoring',
      content: [
        'Enable quiz mode in Form Settings > Quiz Settings. Once enabled, each field gets a "Quiz Answer" section where you can enter the correct_value (the exact answer that earns points) and the points weight (how many points this question is worth). Leave correct_value blank for fields that don\'t contribute to the score.',
        'When a response is submitted, the scoring engine compares each submitted answer to its correct_value using strict equality for text fields and numeric comparison for number fields. For multiple-choice fields, correct_value is the option key that earns full points. Partial scoring is available for checkbox_group fields — assign point values per option.',
        'The result screen shown to respondents after submission includes their score (points earned out of total possible), percentage, and a pass/fail banner based on your threshold. Optionally display which questions were answered correctly or incorrectly for educational quizzes. For private scoring, disable the result display and show only a success message while storing the score internally.',
      ],
    },
    {
      id: 'webhooks',
      title: 'Webhooks & Integrations',
      content: [
        'Webhooks are configured per form in the Integrations tab. Each webhook has a name, target URL, secret key for HMAC signing, and an event filter. The response.created event fires on every new submission. The response.score_failed event fires specifically when a quiz submission falls below the pass threshold — useful for triggering follow-up or review workflows.',
        'To verify a webhook in your receiving server: read the raw request body as bytes, compute HMAC-SHA256 using your webhook secret as the key and the body bytes as the message, convert the result to lowercase hex, and compare it to the X-Echo-Signature header value. Only process the payload if the signatures match.',
        'Common integration patterns: POST new form submissions to a Zapier webhook to route data to Google Sheets, Salesforce, or Slack; POST quiz failures to a CRM Worker to create follow-up tasks; POST contact form submissions to echo-crm.bmcii1976.workers.dev/api/contacts to auto-create CRM contacts from form leads.',
      ],
    },
    {
      id: 'templates',
      title: 'Template Library',
      content: [
        'The template library provides a curated set of pre-built form definitions for common use cases: Contact Form, Job Application, Event Registration, Customer Feedback, NDA Agreement, Product Order, Support Request, Lead Qualification, and Knowledge Assessment Quiz. Each template is fully customizable after cloning.',
        'Save your own forms as templates from the Form Settings > Save as Template option. Set a template name, category (from the standard taxonomy or a custom label), and a short description. Templates are available to all users in your account. Mark templates as "global" to share them with other accounts in your organization.',
        'When you clone a template, you get an independent copy with a new ID and slug. Changes to the clone never affect the original template. Use templates as starting points — clone, customize the fields and settings for your specific use case, and publish. The template library tracks which templates are most cloned so you can prioritize maintaining the most-used ones.',
      ],
    },
    {
      id: 'analytics',
      title: 'Response Analytics',
      content: [
        'The Analytics tab provides submission metrics at the form level and field level. The summary view shows total responses, completion rate (submissions that reached the thank-you page vs. form views), average time to complete, and a daily submission volume chart for the past 30 days.',
        'Field-level analytics show completion rates per field, revealing which questions respondents frequently skip or abandon on. For dropdown and checkbox fields, a frequency distribution chart shows how often each option was selected. For text fields, AI-powered theme analysis groups similar responses into clusters — click any theme to see the underlying verbatim answers.',
        'For quiz forms, the analytics page includes additional metrics: score distribution histogram, average score, pass rate, hardest questions (lowest correct answer rate), and per-question accuracy breakdowns. Use hardest question data to identify which concepts need better instruction in the material preceding the quiz.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Question Suggestions', desc: 'Analyze form title and purpose to generate a complete, optimized field list with recommended types, labels, placeholder text, and answer options for choice fields. Suggestions follow UX best practices for question ordering, label clarity, and response option exhaustiveness — generated in under 3 seconds.' },
    { capability: 'Response Theme Clustering', desc: 'Groups open-text responses into semantic theme clusters using NLP embeddings and k-means clustering. Each cluster is labeled with an AI-generated theme name and includes a response count, sentiment score, and representative sample quotes. Processes up to 10,000 responses in a single analysis job.' },
    { capability: 'Form Completion Optimization', desc: 'Analyzes field-level abandonment rates and answer patterns to identify friction points in your form. Returns specific recommendations: questions that cause high drop-off, field labels that are frequently left blank despite being optional, and ordering adjustments that could improve completion rate based on comparable form patterns.' },
    { capability: 'Quiz Difficulty Analysis', desc: 'For quiz forms, computes per-question difficulty scores based on the ratio of correct to incorrect answers across all submissions. Identifies questions that are too easy (>95% correct), too hard (<20% correct), and poorly discriminating (same accuracy regardless of total score). Outputs a difficulty curve chart and question adjustment recommendations.' },
    { capability: 'Duplicate Submission Detection', desc: 'Identifies potential duplicate submissions by analyzing answer similarity, submission timing, and client fingerprints. Groups near-identical responses and flags them for review. Configurable deduplication rules let you automatically reject exact duplicates or require manual review for near-matches above a similarity threshold.' },
  ],

  troubleshooting: [
    { issue: 'Form shows "closed" despite being within the active window', solution: 'Check both the response limit (Settings > Response Limits) and the end date (Settings > Availability). If the max_responses count has been reached, the form closes regardless of the end date. Increase or remove the response limit to reopen it. Also verify the start_at and end_at timestamps are in UTC — the form engine uses UTC for all comparisons. A form set to end at "5:00 PM" in your local timezone ends at 5:00 PM UTC, which may be different from your local time.' },
    { issue: 'Quiz score not calculating correctly', solution: 'Verify that quiz mode is enabled in Form Settings. Check that each scored field has a correct_value set — fields without a correct_value are excluded from scoring. For dropdown fields, correct_value must match the option value (the internal key) exactly, not the display label. Check the response detail view to see the raw submitted value vs. the stored correct_value for each field to identify mismatches.' },
    { issue: 'File uploads failing', solution: 'Check the allowed MIME types and max file size configured for the upload field. The browser error message indicates whether the file was rejected client-side (type or size mismatch) or server-side (R2 write failure). Ensure the file is under 50MB. For MIME type errors, verify the file\'s actual type matches its extension. If uploads are consistently failing server-side, check the Worker error logs for R2 permission errors or storage quota issues.' },
    { issue: 'Webhook not receiving events', solution: 'Test the webhook from the Integrations tab > Test button to verify the target URL is reachable and returns HTTP 200. Check that your server is not rejecting the request due to signature verification failure — ensure you\'re computing HMAC-SHA256 over the raw request body bytes, not the parsed JSON object. Check your firewall allows inbound connections from Cloudflare edge IP ranges. View the Webhook Delivery Log for detailed error messages on failed deliveries.' },
  ],

  faq: [
    { q: 'How many fields can a form have?', a: 'There is no hard limit on the number of fields per form. From a user experience perspective, forms with more than 15-20 fields typically see significant completion rate drops — consider splitting long forms into multiple pages or using conditional logic to show only relevant fields. The API and database can handle forms with hundreds of fields without performance issues.' },
    { q: 'Can I accept payments through a form?', a: 'Echo Forms currently supports data collection only. For payment-enabled forms, use the Echo Invoicing or Echo Checkout product, which include Stripe payment fields. A payment field type is on the Echo Forms roadmap for an upcoming release — check the changelog for availability.' },
    { q: 'How long are responses stored?', a: 'All responses are stored indefinitely with no automatic deletion. You can manually delete individual responses or bulk delete all responses for a form from the Responses tab. Deleted responses are permanently removed and cannot be recovered — export before deleting if you need a record.' },
    { q: 'Can respondents save and resume a form later?', a: 'Save-and-resume is available for multi-page forms. When enabled in Settings, the browser stores progress locally using a session key. Respondents can close the browser and return to the same URL to continue from where they left off. Progress is stored for 7 days. For authenticated respondents (when using the SDK with user tokens), progress is stored server-side tied to their user ID.' },
    { q: 'Are form responses GDPR compliant?', a: 'Echo Forms provides the tools needed for GDPR compliance: optional consent checkbox field type with customizable text, data subject access request export (all responses from a specific email), and permanent deletion of individual response records. You are responsible for configuring consent fields on forms that collect personal data and for responding to data subject requests using the available export/delete tools.' },
    { q: 'Can I limit one response per person?', a: 'Yes. Enable "One response per email" in Form Settings > Response Limits. This requires an email field in your form — the engine checks the submitted email against existing responses and rejects duplicates with a "You have already submitted this form" message. For anonymous forms, browser cookie-based deduplication is available as an alternative, though it can be bypassed in private browsing mode.' },
  ],
}

export default function EchoFormsDocsPage() {
  return <ProductDoc {...data} />
}
