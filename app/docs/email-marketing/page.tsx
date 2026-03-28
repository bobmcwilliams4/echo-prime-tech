'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Email Marketing',
  tagline: 'AI-powered email campaigns with smart segmentation, automated sequences, deliverability optimization, and conversion tracking.',
  accent: '#f97316',
  productUrl: '/email-marketing',
  workerUrl: 'https://echo-email-marketing.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Email Marketing is an AI-driven email campaign platform that handles the entire lifecycle from list building to conversion tracking. Unlike generic email tools that require manual segmentation and template design, Echo Email uses Intelligence Engine analysis to craft messages tailored to each recipient\u2019s industry, role, and engagement history. The AI writes subject lines, body copy, and CTAs optimized for your specific audience.',
    'The platform integrates directly with the Echo CRM for contact management, the AI Sales Agent (Closer) for lead scoring, and the Analytics Engine for conversion attribution. Email sequences are built visually with branching logic: if a recipient opens but doesn\u2019t click, they get a follow-up; if they click but don\u2019t convert, they enter a nurture sequence. All of this runs autonomously once configured.',
    'Deliverability is a first-class concern. The system monitors sender reputation, manages DKIM/SPF/DMARC configuration, implements automatic warm-up schedules for new domains, and throttles sends to stay within ISP rate limits. Built on Cloudflare Workers for global edge delivery with sub-second send initiation.',
  ],
  gettingStarted: [
    { step: 1, title: 'Connect Your Domain', desc: 'Add your sending domain and configure DKIM, SPF, and DMARC records. The setup wizard provides exact DNS records to add. Verification is automatic \u2014 records are checked every 5 minutes until confirmed.' },
    { step: 2, title: 'Import Contacts', desc: 'Upload a CSV, connect to your CRM, or use the API to import contacts. The system automatically deduplicates, validates email syntax, and scores each contact for engagement likelihood.' },
    { step: 3, title: 'Create a Campaign', desc: 'Use the campaign builder to select your audience segment, write (or AI-generate) your email content, set send timing, and configure tracking. Preview in both desktop and mobile formats before sending.' },
    { step: 4, title: 'Build an Automation', desc: 'Create automated email sequences triggered by events: new signup, abandoned cart, form submission, or custom webhook. Define branching logic based on recipient behavior.' },
    { step: 5, title: 'Review Analytics', desc: 'Monitor open rates, click rates, conversions, unsubscribes, and bounce rates in real-time. AI surfaces insights: best send times, highest-performing subject line patterns, and segments that need re-engagement.' },
  ],
  features: [
    { title: 'AI Content Generation', desc: 'Generate subject lines, email body copy, and CTAs using Intelligence Engine analysis of your industry and audience. A/B test AI-generated variants automatically.' },
    { title: 'Smart Segmentation', desc: 'AI segments your contact list based on engagement history, industry, role, purchase behavior, and predicted conversion likelihood. Segments update dynamically as new data arrives.' },
    { title: 'Visual Automation Builder', desc: 'Drag-and-drop workflow builder for multi-step email sequences. Branching logic based on opens, clicks, replies, conversions, and custom events. Time delays and send windows configurable.' },
    { title: 'Deliverability Suite', desc: 'DKIM/SPF/DMARC management, sender reputation monitoring, automatic warm-up schedules, ISP throttling, and bounce handling. Maintain inbox placement above 95%.' },
    { title: 'A/B Testing', desc: 'Test subject lines, send times, content variants, and CTAs. AI determines statistical significance and auto-promotes the winner. Multi-variant testing supports up to 5 variants.' },
    { title: 'CRM Integration', desc: 'Bi-directional sync with Echo CRM. Contact updates flow both ways. Email engagement data enriches CRM profiles for sales team visibility.' },
    { title: 'Conversion Tracking', desc: 'Track email-to-purchase attribution with pixel tracking and UTM parameters. Revenue attribution per campaign, per segment, and per individual contact.' },
    { title: 'Template Library', desc: '50+ responsive email templates optimized for deliverability. Customizable with your brand colors, logo, and typography. Dark mode compatible.' },
    { title: 'Send Time Optimization', desc: 'AI analyzes each recipient\u2019s historical open patterns and sends at their optimal time. Per-recipient scheduling, not just per-campaign.' },
    { title: 'Compliance Built-In', desc: 'CAN-SPAM and GDPR compliant by default. Automatic unsubscribe handling, preference centers, and consent tracking. One-click data export for GDPR requests.' },
    { title: 'Webhook Events', desc: 'Real-time webhooks for all email events: sent, delivered, opened, clicked, bounced, complained, unsubscribed. Build custom integrations with any system.' },
    { title: 'API-First Design', desc: 'Full REST API for campaigns, contacts, automations, templates, and analytics. Everything you can do in the UI, you can do via API.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/campaigns', desc: 'Create a new email campaign with subject, body, segment targeting, and send schedule. Returns campaign ID for tracking.', auth: true },
    { method: 'POST', path: '/api/campaigns/:id/send', desc: 'Trigger send for a campaign. Emails are queued and sent at optimal times per recipient. Returns estimated completion time.', auth: true },
    { method: 'GET', path: '/api/campaigns/:id/stats', desc: 'Real-time campaign statistics: sent, delivered, opened, clicked, bounced, unsubscribed, and conversion counts with rates.', auth: true },
    { method: 'POST', path: '/api/contacts', desc: 'Create or update contacts. Accepts single contact or batch of up to 1,000. Automatic deduplication and validation.', auth: true },
    { method: 'POST', path: '/api/segments', desc: 'Create a dynamic segment with filter rules. Segments auto-update as contacts change. Use for campaign targeting.', auth: true },
    { method: 'POST', path: '/api/automations', desc: 'Create an email automation workflow with trigger, steps, delays, and branching conditions.', auth: true },
    { method: 'POST', path: '/api/ai/generate', desc: 'AI-generate email content: subject lines, body copy, and CTAs based on campaign goal, audience, and industry context.', auth: true },
    { method: 'GET', path: '/api/analytics/dashboard', desc: 'Aggregate analytics across all campaigns: overall deliverability, engagement trends, top-performing campaigns, and revenue attribution.', auth: true },
  ],
  userGuide: [
    { id: 'deliverability', title: 'Maximizing Deliverability', content: [
      'Deliverability starts with proper DNS configuration. Add the DKIM, SPF, and DMARC records provided in the setup wizard. The system verifies these automatically and flags any misconfigurations that could harm sender reputation.',
      'For new sending domains, use the automatic warm-up schedule. The system gradually increases send volume over 2-4 weeks, building reputation with ISPs. Warm-up progress is visible in the deliverability dashboard.',
      'Monitor your sender score in the dashboard. If reputation drops below 90, the system automatically throttles sends and surfaces the likely cause: high bounce rate, spam complaints, or sudden volume spike. Follow the remediation suggestions to recover.',
    ]},
    { id: 'ai-content', title: 'AI-Powered Content Creation', content: [
      'The AI content generator uses Intelligence Engine analysis of your industry and audience to craft relevant email copy. Provide a campaign goal (awareness, conversion, re-engagement) and the AI generates multiple variants for A/B testing.',
      'Subject line generation considers your historical open rate data, industry benchmarks, and recipient preferences. The AI learns from your results over time \u2014 subject line quality improves with each campaign.',
      'For personalization, the AI can incorporate contact-specific data: name, company, industry, recent interactions, and purchase history. Dynamic content blocks adapt per recipient without creating separate campaigns.',
    ]},
    { id: 'automations', title: 'Building Automations', content: [
      'Automations are event-driven email sequences. Define a trigger (new contact, form submission, purchase, custom webhook), then add email steps with delays between them. Each step can have branching conditions based on recipient behavior.',
      'Common automation patterns: welcome series (5 emails over 14 days), abandoned cart recovery (3 emails over 48 hours), post-purchase follow-up (review request + upsell), and re-engagement (3 emails to dormant contacts).',
      'Automations run continuously once activated. Monitor performance in the automation dashboard. Each step shows entry count, completion rate, and email metrics. Underperforming steps are flagged for review.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Subject Line Optimization', desc: 'AI generates and scores subject lines based on historical performance data, industry benchmarks, and linguistic patterns that correlate with high open rates. Multi-variant testing runs automatically.' },
    { capability: 'Send Time Prediction', desc: 'Per-recipient send time optimization based on historical open patterns. AI learns when each contact is most likely to engage and schedules accordingly.' },
    { capability: 'Engagement Scoring', desc: 'AI scores each contact for engagement likelihood using recency, frequency, and behavioral signals. Low-engagement contacts are automatically moved to re-engagement sequences.' },
    { capability: 'Content Personalization', desc: 'AI adapts email content per recipient based on their industry, role, engagement history, and purchase behavior. Personalization goes beyond name insertion to contextually relevant content.' },
    { capability: 'Churn Prediction', desc: 'AI identifies contacts showing disengagement patterns before they unsubscribe. Early warning triggers automated re-engagement campaigns or sales team alerts.' },
  ],
  troubleshooting: [
    { issue: 'Low open rates (below 20%)', solution: 'Check sender reputation in the deliverability dashboard. Verify DKIM/SPF/DMARC are correctly configured. Use AI subject line generation to A/B test variants. Review send timing \u2014 enable per-recipient optimization.' },
    { issue: 'Emails landing in spam', solution: 'Run the spam score checker before sending. Common issues: missing authentication records, excessive image-to-text ratio, spam trigger words, or sending from a new domain without warm-up.' },
    { issue: 'High bounce rate', solution: 'Enable email validation on import to catch invalid addresses before sending. Check the bounce report for patterns \u2014 if bounces cluster on one ISP, there may be a blocklisting issue. Clean your list regularly.' },
    { issue: 'Automation not triggering', solution: 'Verify the trigger event is correctly configured and that contacts match the automation entry criteria. Check the automation logs for error details. Ensure the automation status is ACTIVE, not PAUSED.' },
  ],
  faq: [
    { q: 'How many emails can I send per month?', a: 'Free tier: 1,000 emails/month. Starter: 25,000/month. Pro: 100,000/month. Enterprise: unlimited with dedicated IP. All tiers include deliverability monitoring and AI content generation.' },
    { q: 'Does it integrate with Shopify or WooCommerce?', a: 'Yes. Direct integrations for Shopify, WooCommerce, and any platform with webhooks. Abandoned cart, post-purchase, and browse abandonment triggers are pre-built.' },
    { q: 'How does AI content generation work?', a: 'Provide your campaign goal and audience. The AI uses Intelligence Engine analysis of your industry to generate subject lines, body copy, and CTAs. Multiple variants are created for automatic A/B testing.' },
    { q: 'Is it CAN-SPAM and GDPR compliant?', a: 'Yes. Built-in unsubscribe handling, preference centers, consent tracking, and one-click data export for GDPR requests. Compliance is automatic, not optional.' },
    { q: 'Can I use my own HTML templates?', a: 'Yes. Upload custom HTML templates or use the drag-and-drop editor. All templates are responsive by default. The system validates HTML for email client compatibility.' },
  ],
}

export default function EmailMarketingDocPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/email-marketing' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
