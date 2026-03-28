'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Status Page',
  tagline: 'Public-facing service status — real-time uptime monitoring, incident management, and subscriber notifications.',
  accent: '#10b981',
  productUrl: '/status-page',
  workerUrl: 'https://echo-status-page.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Status Page provides a branded, public-facing status page for your services. Display real-time uptime, respond to incidents with structured updates, and keep your customers informed automatically through email and webhook notifications.',
    'Built on Cloudflare Workers for 100% uptime even when your other services are down, the status page operates independently of your infrastructure. Automated health checks monitor your services and update status in real time without manual intervention.',
    'Incident management follows industry best practices: investigating, identified, monitoring, resolved. Each incident supports multiple updates with timestamps, and affected components are clearly marked. Scheduled maintenance windows keep users informed about planned downtime.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Status Page', desc: 'Set up your status page with company branding (logo, colors, custom domain). Configure which services/components to display publicly.' },
    { step: 2, title: 'Add Components', desc: 'Define your service components (API, Web App, Database, CDN, etc.) with descriptions. Group related components into categories for clean organization.' },
    { step: 3, title: 'Configure Health Checks', desc: 'Set up automated health checks for each component. Define check interval (1-15 min), expected response codes, timeout thresholds, and alert conditions.' },
    { step: 4, title: 'Set Up Notifications', desc: 'Enable subscriber notifications via email, webhook, or RSS. Subscribers receive alerts for incidents, status changes, and scheduled maintenance.' },
    { step: 5, title: 'Go Live', desc: 'Point your custom domain (status.yourdomain.com) to the status page. Share the URL with customers and add a status link to your application.' },
  ],

  features: [
    { title: 'Public Status Dashboard', desc: 'Clean, branded status page showing all components with current status (operational, degraded, partial outage, major outage). 90-day uptime history bar chart.' },
    { title: 'Automated Health Checks', desc: 'Configurable monitoring checks every 1-15 minutes. HTTP/HTTPS endpoint monitoring with expected status codes, response time thresholds, and content validation.' },
    { title: 'Incident Management', desc: 'Structured incident workflow: investigating → identified → monitoring → resolved. Multiple timeline updates per incident. Affected components automatically marked.' },
    { title: 'Scheduled Maintenance', desc: 'Plan and announce maintenance windows in advance. Subscribers notified before, during, and after maintenance. Auto-resolve when the window closes.' },
    { title: 'Subscriber Notifications', desc: 'Email and webhook notifications for incidents, status changes, and maintenance. Subscribers self-manage their preferences via a portal link.' },
    { title: 'Component Groups', desc: 'Organize components into logical groups (Infrastructure, APIs, Web Apps). Collapsed by default with expand/collapse for clean presentation.' },
    { title: 'Uptime Metrics', desc: '90-day uptime percentage per component. Daily, weekly, and monthly uptime calculations. Historical incident log with resolution times.' },
    { title: 'Custom Domain', desc: 'Host your status page on your own domain (e.g., status.example.com). Full SSL support via Cloudflare.' },
    { title: 'RSS Feed', desc: 'Public RSS feed of incidents and maintenance for integration with monitoring tools and news readers.' },
    { title: 'API Access', desc: 'Full REST API for programmatic status updates, incident creation, and subscriber management. Integrate with your CI/CD pipeline.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/status', desc: 'Current status of all components. Public endpoint (no auth required).', auth: false },
    { method: 'POST', path: '/api/incidents', desc: 'Create a new incident with affected components and initial status update.', auth: true },
    { method: 'POST', path: '/api/incidents/:id/updates', desc: 'Add an update to an existing incident. Changes incident status and notifies subscribers.', auth: true },
    { method: 'POST', path: '/api/maintenance', desc: 'Schedule a maintenance window with start time, duration, and affected components.', auth: true },
    { method: 'POST', path: '/api/subscribers', desc: 'Add a subscriber for notifications. Supports email and webhook endpoints.', auth: false },
    { method: 'GET', path: '/api/uptime', desc: 'Historical uptime data per component for the last 90 days.', auth: false },
    { method: 'PUT', path: '/api/components/:id/status', desc: 'Manually update a component\'s status (operational, degraded, partial_outage, major_outage).', auth: true },
    { method: 'GET', path: '/feed.xml', desc: 'RSS feed of incidents and maintenance windows.', auth: false },
  ],

  userGuide: [
    {
      title: 'Managing Incidents',
      id: 'incidents',
      content: [
        'When an issue occurs, create an incident immediately — even before you have all the details. The initial update should acknowledge the problem: "We are investigating reports of increased error rates on the API."',
        'Update the incident as you learn more. Move through the status workflow: Investigating (we know something is wrong), Identified (we found the cause), Monitoring (fix deployed, watching for recurrence), Resolved (confirmed fixed).',
        'Each update is timestamped and sent to subscribers. Keep updates concise but informative. Users want to know: what\'s affected, what you\'re doing about it, and when you expect resolution.',
      ],
    },
    {
      title: 'Health Check Configuration',
      id: 'health-checks',
      content: [
        'Configure health checks for each component. At minimum, check the primary endpoint with an expected 200 status code. For more thorough monitoring, add response time thresholds and content validation.',
        'Set the check interval based on the component\'s SLA. Critical components (API, authentication) should be checked every 1-2 minutes. Less critical components (blog, documentation) can use 5-15 minute intervals.',
        'When a health check fails, the component status automatically updates to degraded (1-2 failures) or major outage (3+ consecutive failures). Auto-recovery updates status back to operational when checks pass again.',
      ],
    },
    {
      title: 'Subscriber Management',
      id: 'subscribers',
      content: [
        'Subscribers receive notifications for incidents, status changes, and scheduled maintenance. They can subscribe to all components or select specific ones they care about.',
        'Email subscribers receive formatted HTML notifications. Webhook subscribers receive JSON payloads that can integrate with Slack, PagerDuty, or any monitoring tool.',
        'Subscribers can manage their preferences (component selection, notification frequency) via a self-service portal link included in every notification.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Incident Auto-Detection', desc: 'Health check failures automatically create incidents with appropriate severity. Correlated failures across multiple components are grouped into a single incident.' },
    { capability: 'Impact Assessment', desc: 'AI analyzes which components are affected and estimates user impact based on traffic patterns and component dependencies.' },
    { capability: 'Resolution Time Prediction', desc: 'Based on historical incident data, predicts estimated time to resolution for similar incident types. Helps set customer expectations.' },
    { capability: 'Trend Analysis', desc: 'Identifies recurring patterns in incidents (same time of day, same component, same error). Highlights systemic issues that need architectural fixes.' },
  ],

  troubleshooting: [
    { issue: 'Health checks show false failures', solution: 'Increase the timeout threshold — some endpoints respond slowly under load. Set consecutive failure count to 3+ before triggering a status change. Ensure the health check URL is correct and accessible from Cloudflare\'s edge network.' },
    { issue: 'Subscribers not receiving notifications', solution: 'Check that the notification channel (email/webhook) is configured correctly. For email, verify the sender domain has proper SPF/DKIM records. For webhooks, verify the endpoint returns 200. Check the notification log for delivery failures.' },
    { issue: 'Custom domain not working', solution: 'Verify the DNS CNAME record points to the correct Cloudflare endpoint. Check that SSL/TLS is enabled and the certificate is provisioned. DNS propagation can take up to 48 hours.' },
    { issue: 'Uptime calculation seems incorrect', solution: 'Uptime is calculated from health check results over the 90-day window. Planned maintenance windows are excluded from the calculation by default. Check if manual status changes were made that affected the tracking period.' },
  ],

  faq: [
    { q: 'Will the status page work when my services are down?', a: 'Yes. The status page runs on Cloudflare Workers, completely independent of your infrastructure. It remains accessible even during total outages of your services — which is exactly when your customers need it most.' },
    { q: 'Can I use my own domain?', a: 'Yes. Configure a CNAME record pointing status.yourdomain.com to the Cloudflare Workers endpoint. Full SSL is included automatically via Cloudflare\'s edge certificates.' },
    { q: 'How many components can I monitor?', a: 'Free tier supports up to 10 components with 15-minute health checks. Pro supports 50 components with 1-minute checks. Enterprise offers unlimited components with sub-minute monitoring.' },
    { q: 'Can I customize the look and feel?', a: 'Yes. Configure your brand colors, logo, and custom header text. The layout follows proven status page conventions (similar to Statuspage.io) but with your branding throughout.' },
    { q: 'Does it support multiple status pages?', a: 'Enterprise tier supports multiple status pages from one account — useful for companies with multiple products or brands that need separate public-facing status dashboards.' },
  ],
}

export default function EchoStatusPageDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/status-page' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
