'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Domain Harvester',
  tagline: 'AI-powered domain intelligence for WHOIS monitoring, brand protection, DNS tracking, and expiring domain discovery.',
  accent: '#ec4899',
  productUrl: '/domain-harvester',
  workerUrl: 'echo-domain-harvester.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Domain Harvester is a comprehensive domain intelligence platform that monitors WHOIS changes, detects brand impersonation, tracks DNS records, and discovers expiring premium domains — all from one dashboard. It replaces the need for separate tools from DomainTools, SecurityTrails, and WhoisXML at a fraction of the cost.',
    'AI-powered brand protection scans new domain registrations for typosquatting, homoglyph attacks, and brand impersonation. Get alerted within hours when someone registers a domain similar to yours — before they can use it for phishing or brand dilution. Monitor competitor domain portfolios to track new registrations, redirects, and infrastructure changes.',
    'Track domains approaching expiration in your niche with keyword-filtered alerts. Integrate directly with GoDaddy, Namecheap, Cloudflare, and other registrars for instant domain acquisition. AI-powered domain valuation estimates worth based on length, keywords, TLD, backlinks, traffic history, and comparable sales data.',
  ],
  gettingStarted: [
    { step: 1, title: 'Add Domains to Monitor', desc: 'Import domains via CSV upload, API, or manual entry. Add your own domains, competitor domains, or keyword-based watchlists. Bulk import supports thousands of domains at once.' },
    { step: 2, title: 'Configure Alerts', desc: 'Set up WHOIS change alerts, DNS record monitoring, SSL certificate tracking, and expiration warnings. Choose delivery via email, Slack, Discord, or webhook.' },
    { step: 3, title: 'Enable Brand Protection', desc: 'Enter your brand names and the AI will scan new domain registrations for typosquatting, homoglyphs, and impersonation attempts. Alerts fire within hours of suspicious registration.' },
    { step: 4, title: 'Track Expiring Domains', desc: 'Set keyword filters for premium domains entering the expiration cycle. Connect your registrar API for instant acquisition when a target domain becomes available.' },
  ],
  features: [
    { title: 'WHOIS Monitoring', desc: 'Track ownership changes, registrar transfers, nameserver updates, and expiration dates across all TLDs. Instant alerts on any WHOIS change with before/after diffs.' },
    { title: 'Brand Protection', desc: 'AI detects typosquatting, homoglyph attacks, and phishing domains targeting your brand. Alerts within hours of suspicious domain registration.' },
    { title: 'DNS Tracking', desc: 'Monitor A, AAAA, CNAME, MX, TXT, and NS records. Detect unauthorized changes, hijacking attempts, and DNS misconfigurations.' },
    { title: 'Expiring Domain Alerts', desc: 'Track premium domains approaching expiration. Set keyword filters and get notified before they hit the drop market for acquisition.' },
    { title: 'SSL Certificate Monitor', desc: 'Track certificate issuance, expiration, and changes via CT log monitoring. Detect unauthorized certificates issued for your domains.' },
    { title: 'Competitor Intelligence', desc: 'Monitor competitor domain portfolios. Track new registrations, redirects, and infrastructure changes to understand their strategy.' },
    { title: 'Bulk Domain Import', desc: 'Import thousands of domains via CSV, API, or registrar integration. Monitor entire portfolios effortlessly with one-click import.' },
    { title: 'Historical WHOIS Data', desc: 'Full WHOIS history for any domain. See ownership changes, registrar transfers, and nameserver history over time.' },
    { title: 'Subdomain Discovery', desc: 'Enumerate and monitor subdomains for any domain. Discover hidden services, staging environments, and shadow IT.' },
    { title: 'Registrar API Integration', desc: 'Direct integration with GoDaddy, Namecheap, Cloudflare, and major registrars for instant domain acquisition when targets become available.' },
    { title: 'Webhook Alerts', desc: 'Real-time webhook notifications to Slack, Discord, email, or any HTTP endpoint when monitored domains change.' },
    { title: 'Domain Valuation', desc: 'AI-powered domain value estimation based on length, keywords, TLD, backlinks, traffic history, and comparable sales data.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/domains', desc: 'List all monitored domains with status', auth: true },
    { method: 'POST', path: '/api/domains', desc: 'Add domains to monitoring (single or bulk)', auth: true },
    { method: 'GET', path: '/api/domains/:domain/whois', desc: 'Get current and historical WHOIS data', auth: true },
    { method: 'GET', path: '/api/domains/:domain/dns', desc: 'Get current DNS records for a domain', auth: true },
    { method: 'GET', path: '/api/domains/:domain/ssl', desc: 'Get SSL certificate details and history', auth: true },
    { method: 'GET', path: '/api/domains/:domain/subdomains', desc: 'Enumerate subdomains for a domain', auth: true },
    { method: 'GET', path: '/api/brand/alerts', desc: 'List brand protection alerts for typosquatting detections', auth: true },
    { method: 'GET', path: '/api/expiring', desc: 'List expiring domains matching your keyword filters', auth: true },
    { method: 'GET', path: '/api/domains/:domain/valuation', desc: 'Get AI domain valuation estimate', auth: true },
  ],
  userGuide: [
    { title: 'Domain Monitoring Setup', id: 'monitoring-setup', content: [
      'Navigate to the Domains dashboard and click Add Domains. You can add individual domains, paste a list, upload a CSV file, or connect a registrar API to import your entire portfolio automatically.',
      'Each monitored domain tracks WHOIS data, DNS records, SSL certificates, and nameserver status. Changes are detected within hours and trigger alerts based on your notification preferences.',
      'Organize domains into groups (e.g., "Our Domains", "Competitors", "Acquisition Targets") for easier management and filtering.',
    ]},
    { title: 'Brand Protection Configuration', id: 'brand-protection', content: [
      'Go to Brand Protection and add your brand names, company names, and product names. The AI scans new domain registrations globally for typosquatting variants, homoglyph attacks (using similar-looking Unicode characters), and keyword combinations.',
      'Configure sensitivity levels: High (alerts on any partial match), Medium (alerts on likely impersonation), or Low (alerts only on exact typosquats). Higher sensitivity produces more alerts but catches more threats.',
      'Review brand alerts in the Brand Protection dashboard. Each alert includes the suspicious domain, registration date, registrant details (when available), and a threat assessment score.',
    ]},
    { title: 'Expiring Domain Acquisition', id: 'expiring-domains', content: [
      'Set up keyword filters in the Expiring Domains section. Enter keywords, minimum/maximum domain length, preferred TLDs, and any exclusion patterns.',
      'The system scans domains entering the expiration cycle and matches them against your filters. You receive alerts before the domain hits the public drop market.',
      'Connect your registrar API (GoDaddy, Namecheap, or Cloudflare) to enable one-click acquisition directly from the alert. The system can also auto-bid on domains matching high-priority criteria.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Typosquatting Detection', desc: 'AI generates and monitors typosquatting variants of your brand names including character substitution, transposition, omission, insertion, and homoglyph attacks using similar Unicode characters.' },
    { capability: 'Domain Valuation', desc: 'Estimates domain value based on length, keyword relevance, TLD desirability, backlink profile, traffic history, and comparable recent sales data.' },
    { capability: 'Threat Assessment', desc: 'Scores suspicious domain registrations by analyzing registrant patterns, hosting infrastructure, content similarity, and historical phishing indicators.' },
    { capability: 'Keyword Matching for Expiring Domains', desc: 'AI filters expiring domains using semantic understanding of your keyword intent, not just exact string matching, to surface relevant acquisition opportunities.' },
  ],
  troubleshooting: [
    { issue: 'WHOIS data shows as unavailable', solution: 'Some registrars and TLDs implement WHOIS privacy or RDAP restrictions. The system shows the most recent available data. Try checking historical records for previously public information.' },
    { issue: 'Brand alerts are too frequent', solution: 'Lower your brand protection sensitivity from High to Medium or Low. Add common false-positive patterns to your exclusion list in Brand Protection Settings.' },
    { issue: 'DNS changes not detected', solution: 'DNS monitoring checks records at regular intervals. Very brief changes may be missed between checks. Ensure the domain is in Active monitoring status (not Paused).' },
    { issue: 'Registrar integration not connecting', solution: 'Verify your registrar API key has the correct permissions. GoDaddy requires production (not OTE) keys. Namecheap requires IP whitelisting. Check the integration status page for specific error messages.' },
  ],
  faq: [
    { q: 'What does domain monitoring include?', a: 'Real-time WHOIS change detection, DNS record monitoring, SSL certificate tracking, nameserver changes, registrar transfers, and expiration alerts. Every change is logged with before/after diffs.' },
    { q: 'How does brand protection work?', a: 'AI scans new domain registrations for typosquatting, homoglyph attacks, and brand impersonation. Get alerted within hours when someone registers a domain similar to yours.' },
    { q: 'Can it find expiring domains?', a: 'Yes. Track domains in your niche as they approach expiration. Set alerts for premium domains, competitor domains, or keyword-rich domains entering the drop cycle. Integrates with registrar APIs for instant acquisition.' },
    { q: 'How many domains can I monitor?', a: 'Starter plan tracks 100 domains, Professional handles 1,000, and Enterprise is unlimited. Bulk import via CSV or API. Add entire competitor portfolios with one click.' },
    { q: 'Which registrars integrate for auto-acquisition?', a: 'Direct API integration with GoDaddy, Namecheap, Cloudflare, and other major registrars. Connect your account in Settings for one-click domain acquisition from alerts.' },
  ],
}

export default function DomainHarvesterDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/domain-harvester' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
