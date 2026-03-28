'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Document Delivery',
  tagline: 'Universal document generation, viewing, and delivery via Print, PDF, Email, and SMS.',
  accent: '#0891b2',
  productUrl: '/document-delivery',
  workerUrl: 'https://echo-document-delivery.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Document Delivery is a universal document generation and distribution platform that transforms structured data into professionally formatted documents and delivers them through any channel — print, PDF download, email, or SMS link. Built for businesses that generate invoices, reports, proposals, contracts, or any recurring document type, the system eliminates manual document creation by combining templated HTML generation with multi-channel delivery in a single API call.',
    'The platform uses server-side HTML rendering with your brand\'s colors, logos, and layout preferences baked into configurable templates. Documents are stored in Cloudflare R2 with unique token-based access URLs, so recipients can view documents in the browser without authentication. Client-side PDF export via html2pdf.js gives recipients a one-click download option directly from the document viewer, while print-optimized CSS ensures clean output on paper.',
    'Delivery channels run in parallel — a single API call can simultaneously email a document via Resend, send an SMS link via Twilio, and store the document for web viewing. View count tracking and delivery receipts give you visibility into whether recipients actually opened the document. Company branding settings apply globally, so every document maintains consistent visual identity without per-document configuration.',
  ],
  gettingStarted: [
    { step: 1, title: 'Configure Branding', desc: 'Navigate to Document Delivery settings and upload your company logo, set primary and secondary brand colors, and configure your business name, address, and contact information. These settings are injected into every document template automatically.' },
    { step: 2, title: 'Choose or Create Templates', desc: 'Select from built-in document templates (invoice, proposal, report, receipt, contract) or create custom HTML templates using the template editor. Templates use Handlebars syntax for dynamic data insertion — variables like {{company_name}}, {{line_items}}, and {{total}} are replaced at generation time.' },
    { step: 3, title: 'Connect Delivery Channels', desc: 'Add your Resend API key for email delivery and Twilio credentials for SMS delivery. Both are optional — you can use any combination of channels. The system validates credentials on save and sends a test message to confirm connectivity.' },
    { step: 4, title: 'Generate Your First Document', desc: 'Call POST /documents/generate with your template ID and data payload. The API returns a document object with a unique view token, a public viewing URL, and delivery status for each requested channel. The document is immediately available for viewing.' },
    { step: 5, title: 'Monitor and Track', desc: 'Use the Documents dashboard to see all generated documents, their delivery status across channels, and view counts. Click any document to preview it exactly as recipients see it. Export delivery reports for reconciliation or audit purposes.' },
  ],
  features: [
    { title: 'HTML Document Generation', desc: 'Server-side HTML rendering using Handlebars templates with full CSS styling support. Templates accept arbitrary JSON data payloads and produce pixel-perfect documents with responsive layouts that adapt to screen size and print media. Supports tables, images, headers, footers, and page breaks.' },
    { title: 'PDF Export', desc: 'Client-side PDF generation via html2pdf.js gives document viewers a one-click download button. PDFs are rendered directly in the browser from the HTML document, maintaining exact visual fidelity. No server-side PDF generation overhead — conversion happens on the recipient\'s device.' },
    { title: 'Email Delivery via Resend', desc: 'Automated email delivery with customizable subject lines, sender name, and optional body text accompanying the document link. Emails are sent through Resend with delivery tracking, bounce detection, and automatic retry on temporary failures. Supports CC and BCC recipients.' },
    { title: 'SMS Delivery via Twilio', desc: 'Send document links via SMS using Twilio. Messages include a short, branded link to the document viewer. SMS delivery is confirmed via Twilio status callbacks, and undeliverable messages are flagged in the dashboard with carrier-specific error codes.' },
    { title: 'Token-Based Public Viewing', desc: 'Each generated document receives a unique, unguessable token URL that allows viewing without authentication. Token URLs are safe to share via email, SMS, or any messaging platform. Tokens can be configured to expire after a set number of views or days.' },
    { title: 'Branded Templates', desc: 'Pre-built template library for common document types (invoices, proposals, contracts, receipts, reports) with your branding applied automatically. Custom templates support full HTML and CSS with live preview in the template editor. Template versioning tracks changes over time.' },
    { title: 'R2 Storage', desc: 'All generated documents are stored as HTML files in Cloudflare R2 with indefinite retention by default. Storage is organized by account, document type, and date for easy retrieval. Configurable retention policies can auto-delete documents after a specified period.' },
    { title: 'View Count Tracking', desc: 'Every document view is logged with timestamp, IP address (anonymized), user agent, and referrer. The dashboard shows total views, unique viewers, and a timeline of access events. Webhooks can notify your system when a document is first viewed by the recipient.' },
    { title: 'Company Branding Settings', desc: 'Global branding configuration including logo image, primary color, secondary color, business name, address, phone, email, and website. These values are available in all templates as standard variables, ensuring consistent branding without duplicating configuration per document.' },
    { title: 'Print-Optimized CSS', desc: 'All document templates include @media print stylesheets that strip navigation elements, optimize font sizes, handle page breaks cleanly, and ensure tables don\'t split awkwardly across pages. Recipients get professional printed output directly from the browser print dialog.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/documents/generate', desc: 'Generate a new document from a template ID and JSON data payload. Optionally specify delivery channels (email, sms) with recipient details. Returns the document object with view token, public URL, and delivery status per channel.', auth: true },
    { method: 'GET', path: '/documents/view/:token', desc: 'Public endpoint for viewing a generated document. No authentication required — the token serves as the access credential. Returns the rendered HTML document with embedded PDF download button and print-optimized styles.', auth: false },
    { method: 'POST', path: '/documents/email', desc: 'Send or resend a document via email. Specify the document ID, recipient email addresses (to, cc, bcc), subject line, and optional body text. The email includes a styled link to the document viewer with your branding.', auth: true },
    { method: 'POST', path: '/documents/sms', desc: 'Send or resend a document link via SMS. Specify the document ID, recipient phone number (E.164 format), and optional custom message text. The SMS includes a shortened link to the document viewer.', auth: true },
    { method: 'GET', path: '/documents/list', desc: 'List all generated documents with pagination, filtering by template type, date range, delivery status, and recipient. Returns document metadata including view counts, delivery receipts, and creation timestamps.', auth: true },
    { method: 'PUT', path: '/settings/branding', desc: 'Update company branding settings including logo URL, primary color, secondary color, business name, address, and contact details. Changes apply to all documents generated after the update. Existing documents retain their original branding.', auth: true },
  ],
  userGuide: [
    { title: 'Creating and Managing Templates', id: 'templates', content: [
      'Templates are HTML files with Handlebars expressions for dynamic content. Access the template editor from the dashboard to create or modify templates with live preview. The editor provides syntax highlighting, variable autocomplete from your branding settings, and a test data panel where you can paste sample JSON to see real-time rendering.',
      'Built-in templates cover the most common document types: invoices with line item tables and tax calculations, proposals with sections and pricing tiers, contracts with signature blocks, receipts with transaction details, and reports with charts and data tables. Each built-in template can be cloned and customized without affecting the original.',
      'Template variables follow Handlebars syntax: {{variable_name}} for simple values, {{#each items}} for iterating over arrays, and {{#if condition}} for conditional sections. Company branding variables ({{company_name}}, {{company_logo}}, {{primary_color}}) are injected automatically from your global settings.',
    ] },
    { title: 'Delivering Documents to Recipients', id: 'delivery', content: [
      'Documents can be delivered through multiple channels simultaneously. When calling POST /documents/generate, include a delivery object specifying the channels and recipients. For email, provide the to, cc, and bcc addresses along with a custom subject line. For SMS, provide the phone number in E.164 format.',
      'Delivery status is tracked per channel and available in the document detail view. Email delivery shows "sent", "delivered", "opened", or "bounced" states based on Resend webhooks. SMS delivery shows "sent", "delivered", or "failed" with carrier error codes from Twilio. You can resend via any channel at any time from the dashboard or API.',
      'For bulk document delivery (e.g., monthly invoice runs), use the batch generation endpoint POST /documents/batch with an array of template + data + delivery objects. The system processes up to 500 documents per batch with parallel delivery across all channels.',
    ] },
    { title: 'Tracking Views and Engagement', id: 'tracking', content: [
      'Every document view is recorded automatically when a recipient opens the token URL. The Documents dashboard shows aggregate metrics — total documents generated, delivery success rate, average time-to-first-view, and overall view counts. Individual document detail pages show the full access log.',
      'Configure a webhook URL in Settings to receive real-time notifications when documents are first viewed. The webhook payload includes the document ID, viewer metadata (anonymized IP, user agent, timestamp), and the channel that referred the viewer (email click, SMS link, or direct URL). Use this data to trigger follow-up workflows — for example, calling a customer 24 hours after they view a proposal.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'Smart Template Selection', desc: 'AI analyzes the data payload structure and content to automatically suggest the most appropriate template when no template ID is specified. The system recognizes invoice-like data (line items, totals), report-like data (metrics, time series), and proposal-like data (sections, pricing) with 95% accuracy.' },
    { capability: 'Content Optimization', desc: 'Natural language processing reviews document text for clarity, grammar, and professional tone before generation. The AI suggests improvements to descriptions, terms, and formatting while preserving the original meaning. Optimization is optional and non-destructive — original content is always preserved.' },
    { capability: 'Delivery Timing Intelligence', desc: 'Machine learning models analyze historical open rates by day of week, time of day, and recipient behavior patterns to recommend optimal delivery windows. Documents scheduled for delivery are held until the predicted highest-engagement window, improving open rates by an average of 22%.' },
    { capability: 'Automated Follow-Up Generation', desc: 'AI generates contextual follow-up messages based on document type and recipient engagement status. If an invoice goes unviewed for 48 hours, the system drafts a reminder email. If a proposal is viewed multiple times, it drafts a closing follow-up. All drafts require approval before sending.' },
  ],
  troubleshooting: [
    { issue: 'Document viewer showing blank page', solution: 'A blank viewer page typically indicates the document HTML failed to render. Check the document generation response for error details — the most common cause is a malformed Handlebars expression in the template (e.g., unclosed {{#each}} block). Validate your template in the editor with test data before using it in production. If the template is valid, verify the data payload matches the expected variable names.' },
    { issue: 'Email delivery marked as bounced', solution: 'Bounced emails indicate the recipient address is invalid or the receiving mail server rejected the message. Check the bounce reason in the delivery log — "hard bounce" means the address does not exist and should be removed from your contacts, while "soft bounce" means a temporary issue (full mailbox, server down) that may resolve on retry. Resend automatically retries soft bounces twice.' },
    { issue: 'SMS link not being received by recipient', solution: 'Verify the phone number is in E.164 format (e.g., +14325551234). Check the Twilio delivery status in the document detail — carrier filtering is the most common cause of undelivered SMS, especially for shortcode URLs. If delivery consistently fails to a specific carrier, contact Twilio support to verify your sender registration. Ensure your Twilio account has sufficient balance for outbound SMS.' },
    { issue: 'PDF download producing blank or cut-off pages', solution: 'PDF generation via html2pdf.js runs client-side in the recipient\'s browser. Blank PDFs usually indicate a content security policy blocking the html2pdf.js library. Cut-off content is typically caused by fixed-width elements exceeding the PDF page width. Use percentage-based widths in templates and test PDF output across Chrome, Firefox, and Safari — rendering differences between browsers can affect layout.' },
  ],
  faq: [
    { q: 'What document types can Echo Document Delivery generate?', a: 'Any document that can be represented as HTML — invoices, proposals, contracts, receipts, reports, letters, certificates, shipping labels, and custom formats. The template system is fully flexible, so if you can design it in HTML and CSS, the platform can generate and deliver it.' },
    { q: 'How are documents stored and for how long?', a: 'Documents are stored as HTML files in Cloudflare R2 with indefinite retention by default. You can configure retention policies to auto-delete documents after a specified number of days (30, 90, 365, or custom). Deleted documents are permanently removed from storage and their token URLs return a 404.' },
    { q: 'Can recipients view documents without creating an account?', a: 'Yes. Every document has a unique token-based URL that provides access without authentication. Recipients simply click the link in their email or SMS to view the document immediately in their browser. No login, no app download, no friction.' },
    { q: 'How does the PDF export work?', a: 'PDF export uses html2pdf.js running entirely in the recipient\'s browser. When the recipient clicks the "Download PDF" button on the document viewer, the HTML is converted to PDF client-side with no server round-trip. This means zero server load for PDF generation and the PDF matches exactly what the recipient sees on screen.' },
    { q: 'Can I send documents to multiple recipients at once?', a: 'Yes. The email delivery endpoint supports multiple to, cc, and bcc addresses per document. For SMS, you can send to multiple phone numbers by including an array in the delivery request. For bulk document generation (different documents to different recipients), use the batch endpoint which processes up to 500 documents per request.' },
  ],
}

export default function Page() { return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/document-delivery' },
      ]} />
      <ProductDoc {...data} />
    </>
  ) }
