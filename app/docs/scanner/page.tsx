'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Scanner',
  tagline: 'AI-powered security monitoring and vulnerability assessment across 200+ Cloudflare Workers with real-time alerting.',
  accent: '#ef4444',
  productUrl: '/scanner',
  workerUrl: 'https://echo-343-scanner.bmcii1976.workers.dev',
  version: '2.0.0',
  overview: [
    'Echo Scanner (internally designated 343 Scanner) is a comprehensive security monitoring and vulnerability assessment platform built for the ECHO ecosystem. It continuously monitors the health of 200+ Cloudflare Workers, scans web applications for vulnerabilities, validates SSL/TLS certificates, verifies DNS records, discovers open ports and services, and delivers real-time alerts via OmniSync when issues are detected. Every scan runs 12 specialized AI analyzers in parallel across edge infrastructure, producing detailed findings in under 30 seconds.',
    'Unlike traditional security scanners that run from centralized servers and produce static PDF reports, Echo Scanner operates at the Cloudflare edge with zero cold starts and stores every result in Brain Memory for historical trend analysis and regression detection. Each finding is automatically mapped to the MITRE ATT&CK framework, giving security teams actionable intelligence tied to real-world adversary behavior rather than abstract severity numbers.',
    'Echo Scanner serves two distinct roles: external vulnerability assessment for any public-facing URL, and internal fleet health monitoring for the entire ECHO Worker infrastructure. The fleet monitoring side tracks response times, error rates, certificate expiry, and configuration drift across every deployed Worker. When a Worker degrades or a certificate approaches expiration, alerts fire immediately through OmniSync to Slack, Discord, email, or any webhook endpoint.',
  ],
  gettingStarted: [
    { step: 1, title: 'Access the Scanner', desc: 'Navigate to echo-ept.com/scanner or call POST /scan on the Worker URL directly. No agent installation or authentication is required for basic scans. Authenticated users get Brain Memory storage and historical tracking.' },
    { step: 2, title: 'Enter a Target URL', desc: 'Provide any publicly accessible domain or URL. The scanner accepts HTML pages, single-page applications, REST APIs, GraphQL endpoints, and static file servers. No file uploads or server-side agents needed.' },
    { step: 3, title: 'Select Scan Mode', desc: 'Choose Quick (top findings in <15s), Standard (full 12-analyzer sweep in <30s), or Deep (recursive enumeration, JavaScript analysis, and port scanning in <90s). Start with Standard for a comprehensive first assessment.' },
    { step: 4, title: 'Review Findings', desc: 'Each finding includes a severity level (CRITICAL, HIGH, MEDIUM, LOW, INFO, PASS), a risk score, MITRE ATT&CK technique mapping, and specific remediation guidance. Drill into any finding for full technical detail.' },
    { step: 5, title: 'Integrate via API', desc: 'Use the REST API to trigger scans programmatically from CI/CD pipelines, retrieve results as structured JSON, and configure scheduled scans with drift detection alerting.' },
  ],
  features: [
    { title: 'Worker Health Monitoring', desc: 'Continuous health checks across 200+ Cloudflare Workers. Tracks response time, error rates, uptime percentage, and configuration drift. Workers self-report via POST /report and the scanner aggregates fleet-wide health into a single dashboard.' },
    { title: 'Vulnerability Scanning', desc: '12 specialized AI analyzers run in parallel: DNS enumeration, HTTP security headers, SSL/TLS certificate analysis, technology fingerprinting, port scanning, endpoint discovery, cookie security, JavaScript analysis, CSP evaluation, CORS misconfiguration, server information leakage, and MITRE ATT&CK mapping.' },
    { title: 'SSL/TLS Certificate Monitoring', desc: 'Deep certificate chain inspection including issuer trust validation, expiration monitoring, Subject Alternative Name enumeration, certificate transparency log correlation, and cipher suite analysis. Detects weak protocols (SSLv3, TLS 1.0/1.1) and known vulnerabilities (BEAST, POODLE, Heartbleed, ROBOT).' },
    { title: 'DNS Record Verification', desc: 'Complete DNS enumeration of A, AAAA, CNAME, MX, NS, TXT, SOA, and SRV records. Zone transfer testing, subdomain brute-force, DNSSEC validation, and nameserver configuration analysis. Identifies cloud providers, CDN configuration, and mail infrastructure.' },
    { title: 'Port Scanning & Service Discovery', desc: 'TCP and UDP scanning across the most commonly exploited 1,000 ports with service detection and banner grabbing. Correlates open ports with expected services for the detected technology stack to flag anomalies and unauthorized services.' },
    { title: 'Real-Time Alerting via OmniSync', desc: 'Instant notifications when scans detect critical findings, Workers go unhealthy, or certificates approach expiration. Alerts route through OmniSync to Slack, Discord, email, webhooks, and the Echo Prime dashboard.' },
    { title: 'MITRE ATT&CK Mapping', desc: 'Every finding is mapped to MITRE ATT&CK technique IDs, tactic categories, and procedure examples. Enables correlation with threat intelligence, prioritization based on real-world adversary behavior, and security posture tracking over time.' },
    { title: 'Brain Memory Storage', desc: 'Every scan result is stored permanently in Brain Memory for historical comparison, trend analysis, and regression detection. Compare your security posture across weeks or months and get alerted when previously fixed vulnerabilities reappear.' },
    { title: 'Technology Fingerprinting', desc: 'Identifies web servers, frameworks, CMS platforms, JavaScript libraries with exact versions, CDN providers, analytics tools, and third-party integrations. Cross-references discovered versions against CVE databases for known vulnerabilities.' },
    { title: 'HTTP Security Headers Audit', desc: 'Full audit of CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and CORS headers. Each header graded against industry best practices with specific remediation guidance.' },
    { title: 'JavaScript Static Analysis', desc: 'Scans client-side JavaScript for hardcoded API keys, access tokens, internal URLs, debug endpoints, exposed source maps, inline credentials, and PII handling. Identifies dependencies with known CVEs.' },
    { title: 'Scheduled Scans & Drift Detection', desc: 'Configure automated scans on hourly, daily, or weekly cadences. Drift detection compares consecutive scan results and alerts when security posture changes, catching regressions before they become incidents.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/scan', desc: 'Initiate a security scan against a target URL. Accepts parameters for scan mode (quick, standard, deep), specific analyzers to enable/disable, and callback webhook URL for async result delivery. Returns a scan ID for polling.', auth: true },
    { method: 'GET', path: '/report', desc: 'Retrieve the latest scan report. Returns structured JSON with all findings, severity levels, risk scores, MITRE ATT&CK mappings, and remediation guidance. Supports filtering by severity and analyzer.', auth: true },
    { method: 'GET', path: '/report/:scanId', desc: 'Retrieve a specific scan report by ID. Returns the same structured format as /report but for a historical scan. Use this to compare results across time or retrieve reports triggered via API.', auth: true },
    { method: 'GET', path: '/workers', desc: 'List all monitored Workers with their current health status, response time, error rate, last check timestamp, and certificate expiry date. Supports filtering by status (healthy, degraded, down).', auth: true },
    { method: 'POST', path: '/report', desc: 'Worker self-report endpoint. Workers call this to report their own health status, version, uptime, and any internal errors. Used by the fleet monitoring system to aggregate Worker health data.', auth: true },
    { method: 'GET', path: '/health', desc: 'Scanner health check endpoint. Returns the scanner operational status, analyzer availability, and fleet monitoring summary. No authentication required.' },
    { method: 'GET', path: '/history', desc: 'Retrieve scan history for a target domain. Returns a list of previous scan IDs with timestamps, overall risk scores, and finding counts. Useful for trend analysis and regression detection.', auth: true },
    { method: 'POST', path: '/schedule', desc: 'Create a scheduled scan. Specify the target URL, scan mode, cadence (hourly, daily, weekly), and notification preferences. The scanner runs automatically and sends alerts on drift detection.', auth: true },
    { method: 'DELETE', path: '/schedule/:id', desc: 'Remove a scheduled scan by ID. Stops all future automated runs for that schedule. Historical results from past runs are retained in Brain Memory.', auth: true },
    { method: 'GET', path: '/analyzers', desc: 'List all available analyzers with their names, descriptions, and current operational status. Useful for building custom scan configurations that enable only specific analyzers.', auth: false },
  ],
  userGuide: [
    { id: 'scan-modes', title: 'Scan Modes', content: [
      'Quick mode runs the 4 highest-signal analyzers (HTTP headers, SSL/TLS, DNS, and technology fingerprinting) and returns top findings in under 15 seconds. Use Quick for rapid pre-deployment checks or CI/CD pipeline gates.',
      'Standard mode runs all 12 analyzers in parallel and delivers a comprehensive security assessment in under 30 seconds. This is the recommended default for routine security audits and new target assessments.',
      'Deep mode extends Standard with recursive endpoint enumeration, full JavaScript bundle analysis, port scanning across 1,000 ports, and subdomain brute-force. Deep scans take up to 90 seconds but uncover hidden attack surface that Quick and Standard miss.',
    ]},
    { id: 'fleet-monitoring', title: 'Worker Fleet Monitoring', content: [
      'The scanner continuously monitors 200+ Cloudflare Workers in the ECHO ecosystem. Each Worker reports its health via POST /report, and the scanner aggregates fleet-wide status into the /workers endpoint.',
      'Workers are classified as healthy (response time <500ms, error rate <1%), degraded (response time <2000ms or error rate <5%), or down (unresponsive or error rate >5%). Status changes trigger immediate OmniSync alerts.',
      'Certificate monitoring tracks SSL/TLS expiry dates for every Worker domain. Alerts fire at 30-day, 14-day, and 7-day thresholds before expiration, giving operations teams ample time to renew.',
    ]},
    { id: 'reading-results', title: 'Reading Scan Results', content: [
      'Every finding includes a severity level (CRITICAL, HIGH, MEDIUM, LOW, INFO, PASS) based on exploitability, impact, and remediation complexity. CRITICAL and HIGH findings require immediate attention; MEDIUM findings should be addressed in the next maintenance cycle.',
      'Risk scores range from 0.0 (no risk) to 10.0 (critical exposure). The overall scan risk score is the highest individual finding score, not an average. A single CRITICAL finding sets the entire scan to maximum risk.',
      'MITRE ATT&CK mappings link each finding to specific technique IDs (e.g., T1190 for public-facing exploitation). Click any technique ID to view the full ATT&CK description, related tactics, and known adversary groups that use the technique.',
    ]},
    { id: 'ci-cd-integration', title: 'CI/CD Integration', content: [
      'Integrate Echo Scanner into your deployment pipeline by calling POST /scan with your staging or preview URL after each build. Set a risk threshold (e.g., maximum score 5.0) and fail the pipeline if the scan exceeds it.',
      'The API returns a scan ID immediately. Poll GET /report/:scanId until the status field changes from "scanning" to "complete". Typical Standard scans complete in 20-25 seconds.',
      'For GitHub Actions, use the echo-scanner-action which wraps the API calls, waits for completion, and posts a summary comment on the pull request with finding counts by severity.',
    ]},
    { id: 'alerting-config', title: 'Alerting Configuration', content: [
      'Alerts are delivered through OmniSync, which supports Slack, Discord, email, and custom webhook endpoints. Configure your preferred channels in the Echo Prime dashboard under Settings > Notifications.',
      'Alert rules can be customized by severity: receive immediate alerts for CRITICAL and HIGH findings, daily digests for MEDIUM, and weekly summaries for LOW and INFO. Fleet health alerts (Worker down, certificate expiring) always fire immediately.',
      'Each alert includes the finding summary, affected URL, severity, MITRE ATT&CK mapping, and a direct link to the full report. Webhook payloads are JSON-structured for easy parsing in automation tools.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Parallel Analyzer Orchestration', desc: 'All 12 analyzers execute simultaneously across Cloudflare edge infrastructure. The scanner orchestrates DNS, headers, SSL, ports, JavaScript, cookies, CSP, CORS, tech fingerprinting, endpoint discovery, server leakage, and ATT&CK mapping in a single parallel pass, completing a full Standard scan in under 30 seconds.' },
    { capability: 'Intelligent Finding Correlation', desc: 'The AI correlates findings across analyzers to identify compound vulnerabilities. A missing CSP header combined with inline JavaScript and CORS misconfiguration elevates severity because the combination creates an exploitable XSS chain, even if each individual finding is only MEDIUM severity.' },
    { capability: 'Drift Detection', desc: 'Scheduled scans compare current results against the historical baseline stored in Brain Memory. The AI identifies new findings, resolved findings, and severity changes, then generates a drift summary highlighting what changed and why it matters. Alerts fire only on meaningful security posture changes, not noise.' },
    { capability: 'Automated Remediation Guidance', desc: 'Every finding includes AI-generated remediation steps specific to the detected technology stack. If the scanner detects Nginx with a missing HSTS header, the guidance includes the exact Nginx configuration directive, not generic advice. Remediation steps adapt to the target framework, server, and hosting platform.' },
    { capability: 'CVE Cross-Referencing', desc: 'Technology fingerprinting results are automatically cross-referenced against the National Vulnerability Database. When the scanner identifies jQuery 3.4.1, it reports CVE-2020-11022 and CVE-2020-11023 with CVSS scores, exploit availability, and upgrade paths. Updated continuously as new CVEs are published.' },
  ],
  troubleshooting: [
    { issue: 'Scan returns zero findings for a known-vulnerable target', solution: 'Ensure the target URL is publicly accessible and not behind a WAF that blocks scanner traffic. Try the Deep scan mode which uses additional enumeration techniques. If the target requires authentication, the scanner currently only assesses the unauthenticated attack surface.' },
    { issue: 'Port scanning results are incomplete or empty', solution: 'Port scanning is only available in Deep scan mode. Quick and Standard modes skip port scanning for speed. Additionally, some hosting providers (Cloudflare, AWS CloudFront) proxy traffic and block direct port access. The scanner reports the proxy-visible ports in these cases.' },
    { issue: 'Worker fleet shows all Workers as "down"', solution: 'Verify that Workers are configured to call POST /report with valid authentication. Check that the scanner Worker itself is healthy via GET /health. If the scanner recently redeployed, Worker health data resets and repopulates as Workers send their next heartbeat (typically within 60 seconds).' },
    { issue: 'Scheduled scan did not run at the expected time', solution: 'Check the schedule status via GET /schedule to confirm it is active. Cloudflare cron triggers have a tolerance of up to 30 seconds. If the scanner Worker was in a deployment cycle at the scheduled time, the scan runs immediately after deployment completes.' },
    { issue: 'Receiving too many low-severity alerts', solution: 'Configure alert rules to filter by severity threshold. Set minimum severity to MEDIUM or HIGH in the Echo Prime dashboard under Settings > Notifications. Fleet health alerts (Worker down, certificate expiring) always fire regardless of severity filter.' },
  ],
  faq: [
    { q: 'Does the scanner require installing anything on my servers?', a: 'No. Echo Scanner operates entirely externally, exactly like an attacker would. It sends HTTP requests, examines responses, and analyzes publicly visible information. No agents, no server-side code, no firewall changes. Just enter a URL and scan.' },
    { q: 'How many Workers does the fleet monitoring support?', a: 'The scanner currently monitors 200+ Cloudflare Workers in the ECHO ecosystem. The architecture supports up to 10,000 Workers with no configuration changes. Workers self-report via POST /report and the scanner aggregates everything into the /workers dashboard.' },
    { q: 'Can I scan internal or private URLs?', a: 'The scanner operates from the Cloudflare edge and can only reach publicly accessible URLs. For internal network scanning, deploy a Worker within your Cloudflare account that bridges to your internal infrastructure, or use the scanner API as a complement to your internal vulnerability assessment tools.' },
    { q: 'How often should I run scans?', a: 'For production applications, we recommend daily Standard scans and weekly Deep scans. Use Quick scans in CI/CD pipelines on every deployment. The Hunter plan includes unlimited scans and scheduled automation, so frequency is limited only by your preference, not your plan.' },
    { q: 'Are scan results shared or visible to other users?', a: 'No. Scan results are private to your account and stored in your Brain Memory partition. The scanner does not publish, share, or expose scan results to any third party. Enterprise plans include team access controls for multi-user visibility.' },
    { q: 'What is the difference between Echo Scanner and a penetration test?', a: 'Echo Scanner performs automated external reconnaissance and vulnerability assessment. It identifies the same issues a penetration tester finds in the first phase of an engagement (reconnaissance and enumeration). It does not attempt exploitation, privilege escalation, or lateral movement. Use Scanner for continuous automated coverage and supplement with periodic manual penetration tests for depth.' },
  ],
}

export default function ScannerDocPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/scanner' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
