'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'SEC Intelligence',
  tagline: 'Real-time SEC filing surveillance, insider trading detection, and compliance analytics powered by AI.',
  accent: '#dc2626',
  productUrl: '/sec-intel',
  workerUrl: 'echo-sec-scraper.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'SEC Intelligence is a real-time surveillance platform that monitors every filing published to SEC EDGAR — 10-K annual reports, 10-Q quarterly reports, 8-K current reports, Form 4 insider transactions, 13F institutional holdings, S-1 registration statements, and proxy statements. Filings are ingested within seconds of publication, parsed by AI-driven pipelines, and delivered as structured data and actionable alerts.',
    'The insider trading detection engine cross-references Form 4 filings with historical trading patterns, executive compensation data, and corporate event timelines. It flags anomalous clusters of insider activity — unusual volume, coordinated sells before earnings, or trades deviating from 10b5-1 plan schedules — and assigns a risk score from 1 to 100.',
    'The compliance module tracks beneficial ownership thresholds (Section 13), short-swing profit rules (Section 16b), and Regulation FD disclosure obligations. It generates audit-ready reports mapping each flagged event to the relevant SEC rule. REST API and WebSocket feeds deliver all data in JSON with pre-built connectors for Bloomberg, Alpaca, Interactive Brokers, and custom platforms.',
  ],
  gettingStarted: [
    { step: 1, title: 'Set Up Your Watchlist', desc: 'Add tickers, filing types, or insider names to your watchlist. The platform will monitor these entities and send alerts when new filings match your criteria.' },
    { step: 2, title: 'Configure Alerts', desc: 'Choose how you want to be notified — webhook, email, SMS, or in-dashboard. Set filters by ticker, filing type, insider name, or risk score threshold.' },
    { step: 3, title: 'Review the Filing Monitor', desc: 'Browse real-time filings as they appear on EDGAR. Each filing is parsed and tagged with type, ticker, date, and key extracted data points.' },
    { step: 4, title: 'Analyze Insider Activity', desc: 'Open the Insider Detection dashboard to see anomaly scores on recent Form 4 filings. Filter by risk score to focus on the most unusual trading patterns.' },
    { step: 5, title: 'Connect Your Systems', desc: 'Use the REST API or WebSocket feed to stream filing data, parsed financials, and alert events into Bloomberg Terminal, Alpaca, IBKR, or your custom analytics stack.' },
  ],
  features: [
    { title: 'Filing Monitor', desc: 'Track 10-K, 10-Q, 8-K, Form 4, 13F, S-1, and every other SEC filing type in real time with sub-15-second latency from EDGAR publication.' },
    { title: 'Insider Trading Detection', desc: 'AI-powered anomaly scoring on insider transactions — flagging unusual clusters, timing deviations from 10b5-1 plans, and coordinated activity across multiple insiders.' },
    { title: 'Compliance Engine', desc: 'Automated tracking of Section 13 beneficial ownership thresholds, Section 16b short-swing profit rules, and Reg FD disclosure obligations with audit-ready reporting.' },
    { title: 'Real-Time Alerts', desc: 'Webhook, email, and SMS alerts triggered within 15 seconds of a filing hitting EDGAR. Custom filters by ticker, filing type, insider name, or risk score.' },
    { title: 'XBRL Analytics', desc: 'Structured financial data extraction from XBRL filings — revenue, EPS, debt ratios, and other key metrics parsed and ready for quantitative analysis.' },
    { title: 'API and WebSocket Feeds', desc: 'REST API and WebSocket streams delivering structured filing data, parsed financials, and alert events in JSON format. Pre-built connectors for major trading platforms.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/filings', desc: 'List recent SEC filings with filtering by ticker, filing type, date range, and keyword search.', auth: true },
    { method: 'GET', path: '/api/filings/:id', desc: 'Retrieve a specific filing with full parsed data, XBRL financial extraction, and related insider transactions.', auth: true },
    { method: 'GET', path: '/api/insider/transactions', desc: 'List insider transactions from Form 4 filings with anomaly risk scores, transaction details, and historical context.', auth: true },
    { method: 'GET', path: '/api/insider/anomalies', desc: 'Get flagged insider trading anomalies sorted by risk score. Includes coordinated activity clusters and timing deviation analysis.', auth: true },
    { method: 'GET', path: '/api/holdings/13f', desc: 'Query institutional holdings from 13F filings by institution, ticker, or quarter with position change tracking.', auth: true },
    { method: 'POST', path: '/api/watchlist', desc: 'Add tickers, filing types, or insider names to your watchlist for real-time alert monitoring.', auth: true },
    { method: 'GET', path: '/api/alerts', desc: 'List triggered alerts with filing details, match criteria, and delivery status (webhook/email/SMS).', auth: true },
    { method: 'GET', path: '/api/compliance/report', desc: 'Generate an audit-ready compliance report for a ticker or insider covering Section 13, 16b, and Reg FD obligations.', auth: true },
    { method: 'GET', path: '/api/xbrl/:ticker', desc: 'Retrieve parsed XBRL financial data for a ticker including revenue, EPS, debt ratios, and quarter-over-quarter changes.', auth: true },
    { method: 'GET', path: '/ws/filings', desc: 'WebSocket stream of real-time filing events. Supports filtering by ticker and filing type via subscription messages.', auth: true },
  ],
  userGuide: [
    { title: 'Filing Monitor', id: 'filing-monitor', content: [
      'The Filing Monitor is the real-time feed of all SEC EDGAR filings. Filings appear within 15 seconds of publication and are automatically parsed to extract the filing type, ticker, filer name, date, and key data points.',
      'Use the filter bar to narrow the feed by filing type (10-K, 10-Q, 8-K, Form 4, 13F, etc.), ticker symbol, or date range. Keyword search scans the full text of filings to find specific disclosures or events.',
      'Click any filing to view the parsed detail page including extracted financial data (for XBRL filings), related insider transactions, and links to the original EDGAR document.',
    ]},
    { title: 'Insider Trading Detection', id: 'insider-detection', content: [
      'The Insider Detection engine processes every Form 4 filing and assigns a risk score from 1 to 100. Scores above 70 are flagged as high-risk anomalies and trigger alerts if the ticker or insider is on your watchlist.',
      'Anomaly detection considers multiple factors: transaction volume relative to the insider historical average, timing relative to earnings announcements or material events, deviation from established 10b5-1 plan schedules, and coordination across multiple insiders at the same company.',
      'The anomaly detail view shows a timeline of the insider recent transactions, the specific factors that contributed to the risk score, and comparable historical patterns from other companies.',
    ]},
    { title: 'Compliance Reporting', id: 'compliance-reporting', content: [
      'The Compliance Engine monitors three key SEC regulatory areas: Section 13 beneficial ownership thresholds (5% or 10% crossing), Section 16b short-swing profit rules (buy-sell within 6 months by officers and directors), and Regulation FD selective disclosure obligations.',
      'Each flagged compliance event is mapped to the relevant SEC rule with citations. The audit-ready report format is designed to be handed directly to a compliance officer or legal team.',
      'Reports can be generated on-demand for any ticker or insider, or scheduled for automatic generation on a daily/weekly basis. All compliance events are archived for historical review.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Anomaly Scoring Engine', desc: 'Cross-references Form 4 transactions with historical patterns, compensation data, and corporate events to assign risk scores from 1 to 100. Detects unusual volume, coordinated sells, and 10b5-1 plan deviations.' },
    { capability: 'XBRL Financial Extraction', desc: 'Parses structured XBRL data from 10-K and 10-Q filings to extract revenue, EPS, debt ratios, and other key financial metrics. Calculates quarter-over-quarter and year-over-year changes automatically.' },
    { capability: 'NLP Event Extraction', desc: 'Proprietary NLP pipeline extracts material events from 8-K narrative text — M&A announcements, executive departures, restatements, and other events that move markets.' },
    { capability: 'Compliance Rule Matching', desc: 'Maps every insider transaction and ownership change against Section 13, Section 16b, and Reg FD rules. Automatically identifies potential violations and generates audit-ready citations.' },
  ],
  troubleshooting: [
    { issue: 'Alerts are delayed or not arriving', solution: 'Verify your alert delivery method (webhook URL, email, SMS number) is configured correctly in the Alerts settings. For webhooks, ensure your endpoint returns a 200 status. Check that your watchlist includes the ticker or filing type you expect to be alerted on.' },
    { issue: 'Insider risk scores seem too high or too low', solution: 'Risk scores are relative to the insider historical pattern. A new insider with limited trading history may have inflated scores due to insufficient baseline data. Scores normalize as more transactions are recorded.' },
    { issue: 'XBRL data is missing for a filing', solution: 'Not all SEC filings include XBRL data. XBRL extraction is available for 10-K, 10-Q, and certain other filing types that include structured financial tags. 8-K and Form 4 filings do not contain XBRL data.' },
    { issue: 'WebSocket connection drops frequently', solution: 'Ensure your client implements automatic reconnection with exponential backoff. The WebSocket feed sends a heartbeat every 30 seconds — if you miss 3 consecutive heartbeats, the connection is considered stale and will be closed server-side.' },
  ],
  faq: [
    { q: 'What types of SEC filings does the platform monitor?', a: 'All major types including 10-K, 10-Q, 8-K, Form 4, 13F, S-1, and proxy statements. Filings are ingested within 15 seconds of appearing on EDGAR.' },
    { q: 'How does insider trading detection work?', a: 'The engine cross-references Form 4 filings with historical trading patterns, compensation data, and corporate event timelines. It flags anomalous clusters and assigns a risk score from 1 to 100.' },
    { q: 'How quickly do alerts arrive?', a: 'Alerts are delivered within 15 seconds of a filing hitting the SEC EDGAR system via webhook, email, SMS, or dashboard notification.' },
    { q: 'What data sources power the pipeline?', a: 'SEC EDGAR full-text search API, XBRL structured financial data, CUSIP/CIK cross-reference databases, institutional 13F aggregation feeds, and proprietary NLP extraction of material events from 8-K narratives.' },
    { q: 'Does the platform help with compliance?', a: 'Yes. The compliance module tracks Section 13 beneficial ownership, Section 16b short-swing profits, and Reg FD disclosure obligations. It generates audit-ready reports with SEC rule citations.' },
    { q: 'Can I integrate with my trading platform?', a: 'REST API and WebSocket feeds deliver structured data in JSON. Pre-built connectors are available for Bloomberg Terminal, Alpaca, Interactive Brokers, and custom Python/Node.js clients.' },
  ],
}

export default function SecIntelDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/sec-intel' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
