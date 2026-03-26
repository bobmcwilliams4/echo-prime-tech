'use client'

import ProductDoc from '@/components/ProductDoc'
import type { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Security Suite',
  tagline: 'AI-powered cybersecurity — vulnerability scanning, penetration testing, dark web monitoring, and threat intelligence.',
  accent: '#ef4444',
  productUrl: '/security',
  workerUrl: 'https://echo-security-sandbox.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Security Suite is a comprehensive AI-driven cybersecurity platform that unifies offensive and defensive security operations into a single command surface. The platform delivers enterprise-grade network scanning, vulnerability assessment, and penetration testing powered by machine learning models trained on millions of attack patterns, enabling organizations of any size to identify and remediate threats before they become breaches.',
    'Beyond traditional scanning, the suite provides continuous dark web monitoring, open-source intelligence (OSINT) collection, and real-time threat intelligence feeds that correlate external threat data with your internal attack surface. Every discovered vulnerability is prioritized using CVSS v4.0 scoring combined with EPSS exploit prediction data, ensuring your team focuses remediation efforts on the exposures that pose genuine risk rather than chasing theoretical severity scores.',
    'Compliance is deeply integrated into every layer of the platform. Continuous posture monitoring against SOC 2, HIPAA, PCI-DSS v4.0, NIST CSF 2.0, ISO 27001:2022, and CIS Controls v8 runs automatically alongside security operations. Automated evidence collection and audit-ready report generation transform compliance from a quarterly fire drill into a continuous, low-effort process that keeps your organization audit-ready at all times.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/security and complete the onboarding wizard. Select your industry vertical and primary compliance frameworks to customize your dashboard and scanning profiles from day one.' },
    { step: 2, title: 'Add Your Targets', desc: 'Define your attack surface by adding IP ranges, domains, subdomains, cloud accounts, and web application URLs. The asset discovery engine will automatically enumerate additional assets connected to your known infrastructure.' },
    { step: 3, title: 'Run Your First Scan', desc: 'Launch an initial vulnerability scan against your defined targets. Choose from quick scan (top 1,000 ports), standard scan (full port range with service detection), or deep scan (full port range plus web application testing and configuration audit).' },
    { step: 4, title: 'Review Findings', desc: 'Navigate to the Findings dashboard to review discovered vulnerabilities ranked by risk score. Each finding includes severity, affected asset, detailed description, proof of concept where applicable, and step-by-step remediation guidance.' },
    { step: 5, title: 'Set Up Continuous Monitoring', desc: 'Configure scheduled scans, dark web monitoring for your domains and credentials, and real-time alert rules. Enable compliance monitoring for your required frameworks and set notification channels for critical findings.' },
  ],

  features: [
    { title: 'Vulnerability Scanning', desc: 'Automated scanning with 9,000+ vulnerability templates covering network services, web applications, APIs, cloud configurations, and container images. Continuous and scheduled scan modes with configurable depth and scope.' },
    { title: 'Penetration Testing', desc: 'AI-assisted penetration testing that chains discovered vulnerabilities into attack paths. Automated exploitation validation confirms which vulnerabilities are truly exploitable in your environment, eliminating false positives.' },
    { title: 'Dark Web Monitoring', desc: 'Continuous monitoring of dark web forums, paste sites, stealer log markets, and breach databases for your organization\'s credentials, domains, and intellectual property. Alerts trigger within minutes of new exposure detection.' },
    { title: 'OSINT Collection', desc: 'Open-source intelligence gathering from public records, social media, DNS history, certificate transparency logs, code repositories, and job postings to map your external attack surface and identify information leakage.' },
    { title: 'Compliance Checking', desc: 'Continuous automated assessment against SOC 2, HIPAA, PCI-DSS v4.0, NIST CSF 2.0, ISO 27001:2022, and CIS Controls v8. Gap identification with remediation guidance and automated evidence collection for audits.' },
    { title: 'Threat Intelligence', desc: 'Real-time threat intelligence feeds correlated with your asset inventory. STIX/TAXII integration, IOC matching against your network telemetry, and industry-specific threat briefings keep your defenses current.' },
    { title: 'Incident Response', desc: 'Automated incident response playbooks for common attack scenarios. Containment actions execute in seconds — endpoint isolation, IP blocking, account disabling — with full audit trail and forensic evidence preservation.' },
    { title: 'Asset Discovery', desc: 'Automated enumeration of your complete attack surface including shadow IT, forgotten subdomains, exposed cloud storage, orphaned DNS records, and third-party integrations that may introduce risk.' },
    { title: 'API Security Testing', desc: 'Dedicated API security scanner that tests authentication, authorization, input validation, rate limiting, and business logic flaws across REST, GraphQL, and gRPC endpoints with automatic schema detection.' },
    { title: 'Cloud Security Audit', desc: 'Multi-cloud security posture management for AWS, Azure, GCP, and Cloudflare. CIS Benchmark scanning, IAM misconfiguration detection, storage exposure checks, and infrastructure-as-code security analysis.' },
    { title: 'Phishing Simulation', desc: 'Controlled phishing campaigns that test employee security awareness. Customizable email templates, landing page clones, and detailed reporting on click rates, credential submission, and reporting behavior.' },
    { title: 'Security Scoring', desc: 'Unified security score (0-100) combining vulnerability density, patch cadence, configuration hygiene, compliance posture, and threat exposure into a single metric with trend tracking and peer benchmarking.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/scans', desc: 'Initiate a new vulnerability scan. Accepts target definitions, scan profile, and scheduling parameters. Returns a scan ID for status polling.', auth: true },
    { method: 'GET', path: '/api/scans/:id', desc: 'Retrieve scan status and results. Returns progress percentage, discovered hosts, vulnerability counts by severity, and detailed findings when complete.', auth: true },
    { method: 'GET', path: '/api/findings', desc: 'List all findings across scans with filtering by severity, status, asset, and compliance framework. Supports pagination and sorting by risk score.', auth: true },
    { method: 'GET', path: '/api/targets', desc: 'List all configured scan targets with asset counts, last scan date, and current vulnerability summary per target group.', auth: true },
    { method: 'POST', path: '/api/reports', desc: 'Generate a formatted report — executive summary, technical detail, or compliance-specific. Returns a download URL for the PDF or JSON output.', auth: true },
    { method: 'GET', path: '/api/darkweb/alerts', desc: 'Retrieve dark web monitoring alerts for your organization. Returns exposed credentials, leak source, detection timestamp, and remediation status.', auth: true },
    { method: 'GET', path: '/api/compliance/:framework', desc: 'Get compliance posture for a specific framework (soc2, hipaa, pci, nist, iso27001, cis). Returns control-level status with evidence and gap details.', auth: true },
    { method: 'GET', path: '/health', desc: 'Health check endpoint. Returns service status, scanner availability, threat feed connectivity, and last successful scan timestamp.', auth: false },
  ],

  userGuide: [
    {
      title: 'Running Scans',
      id: 'running-scans',
      content: [
        'Scans are initiated from the Dashboard or via the API. Select your target group, choose a scan profile (quick, standard, or deep), and optionally set a maintenance window to avoid scanning during peak business hours. Each scan type trades speed for depth — quick scans complete in minutes while deep scans may run for several hours depending on target count.',
        'Scan results populate in real time as the scanner progresses through your target list. Critical and high-severity findings appear immediately in your notification channels so remediation can begin before the full scan completes. Historical scan data is retained for 12 months to enable trend analysis and regression detection.',
        'Recurring scans can be scheduled on daily, weekly, or monthly intervals. The platform automatically compares results across scan iterations to identify new vulnerabilities, resolved issues, and regressions where previously-fixed problems have reappeared.',
      ],
    },
    {
      title: 'Understanding Findings',
      id: 'understanding-findings',
      content: [
        'Each finding includes a severity rating (Critical, High, Medium, Low, Informational), a risk score combining CVSS v4.0 with EPSS exploit prediction data, the affected asset and service, a technical description of the vulnerability, and step-by-step remediation instructions.',
        'The risk score is more actionable than raw CVSS because it incorporates real-world exploit activity. A Medium-severity vulnerability with active exploitation in the wild will rank higher than a Critical vulnerability with no known exploit code, ensuring your team patches what matters first.',
        'Findings can be triaged with status labels: Open, In Progress, Mitigated, Accepted Risk, and False Positive. SLA timers track remediation progress against your configured targets (e.g., Critical within 48 hours, High within 7 days).',
      ],
    },
    {
      title: 'Dark Web Monitoring',
      id: 'dark-web-monitoring',
      content: [
        'The dark web monitoring module continuously scans underground forums, paste sites, stealer log marketplaces, Telegram channels, and known breach databases for any mention of your configured domains, email addresses, or keywords.',
        'When a credential exposure is detected, the alert includes the affected account identifier, the source of the leak, the detection timestamp, and a risk assessment based on password age and current usage status. Automated workflows can trigger password resets for affected accounts in supported identity providers.',
        'Historical breach data is maintained so you can audit whether previously-exposed credentials have been properly rotated. The module also performs proactive password strength testing against your Active Directory or identity provider to identify credentials vulnerable to offline cracking attacks.',
      ],
    },
    {
      title: 'Compliance Reports',
      id: 'compliance-reports',
      content: [
        'Navigate to the Compliance tab to view your posture against each enabled framework. Controls are displayed with status indicators — Compliant, Non-Compliant, Partially Compliant, and Not Assessed — along with evidence references and gap descriptions for any failing controls.',
        'Report generation produces audit-ready documents that include control mapping, evidence artifacts, gap analysis, and remediation timelines. Reports can be generated on-demand or scheduled for automatic delivery to your compliance team on a recurring basis.',
        'Cross-framework mapping identifies where a single remediation action satisfies controls across multiple standards, helping you prioritize efforts that deliver the greatest compliance coverage improvement per hour of work invested.',
      ],
    },
    {
      title: 'Incident Response',
      id: 'incident-response',
      content: [
        'When a security incident is detected or manually reported, create an incident case from the Incidents tab. Each case follows a structured lifecycle: Detection, Containment, Eradication, Recovery, and Lessons Learned, with automated playbook actions available at each stage.',
        'Containment playbooks execute within seconds of activation — isolating affected endpoints, blocking malicious IP addresses, disabling compromised accounts, and preserving forensic evidence. All automated actions are logged with timestamps and can be reviewed or rolled back.',
        'Post-incident reports are generated automatically, providing a full timeline of the attack, the response actions taken, root cause analysis, and recommendations for preventing recurrence. These reports satisfy regulatory notification requirements and feed back into detection rules.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Vulnerability Prioritization', desc: 'ML models combine CVSS v4.0 base scores with EPSS exploit prediction data, asset criticality ratings, and business context to rank vulnerabilities by actual exploitability risk rather than theoretical severity alone.' },
    { capability: 'Attack Path Analysis', desc: 'AI maps discovered vulnerabilities into chained attack paths showing how an attacker could pivot from initial access through lateral movement to high-value targets, revealing systemic risks that individual findings cannot show.' },
    { capability: 'Threat Correlation', desc: 'Real-time correlation engine matches external threat intelligence feeds against your internal telemetry and vulnerability data, identifying which active threat campaigns are relevant to your specific infrastructure and exposure profile.' },
    { capability: 'False Positive Reduction', desc: 'Machine learning models trained on millions of scan results distinguish genuine vulnerabilities from false positives with 95%+ accuracy, reducing alert fatigue and ensuring remediation effort is spent on real issues.' },
    { capability: 'Remediation Suggestions', desc: 'AI-generated remediation guidance tailored to your specific technology stack and configuration. Suggestions include exact commands, configuration changes, and patch versions with estimated effort and risk assessment for each option.' },
    { capability: 'Risk Scoring', desc: 'Unified risk scoring algorithm that weighs vulnerability severity, exploit availability, asset value, network exposure, and compensating controls to produce a single actionable risk number for every finding and every asset in your environment.' },
  ],

  troubleshooting: [
    { issue: 'Scan is running but not finding any vulnerabilities', solution: 'Verify that your target IP ranges and ports are correct and that no firewall rules are blocking the scanner\'s source IP. Check the scan log for connection timeouts or access denied errors. For internal scans, ensure the scanning agent has network visibility to the target subnet.' },
    { issue: 'Dark web alerts showing expired or already-rotated credentials', solution: 'Breach databases often contain historical data. Mark resolved credentials as "Rotated" in the alert dashboard to acknowledge them. Enable the "Active Only" filter to focus on credentials currently in use. The platform will continue monitoring for new exposures of the same accounts.' },
    { issue: 'Compliance controls showing as Not Assessed', solution: 'Not Assessed means the platform lacks sufficient data to evaluate that control. Verify that monitoring agents are deployed on the relevant assets and that log collection is configured. Some controls require manual evidence upload — click "Provide Evidence" on the control detail page.' },
    { issue: 'Scan performance degraded on large target sets', solution: 'For networks exceeding 500 hosts, use the incremental scan mode which discovers hosts first then deep-scans in parallel batches. Adjust the concurrent thread count in Settings > Scanning > Performance. Consider splitting large networks into separate target groups scanned on staggered schedules.' },
  ],

  faq: [
    { q: 'What types of vulnerabilities does the scanner detect?', a: 'The scanner covers network service vulnerabilities, web application flaws (OWASP Top 10), API security issues, cloud misconfigurations, container image vulnerabilities, SSL/TLS weaknesses, and configuration drift. Over 9,000 vulnerability templates are updated continuously as new CVEs are published.' },
    { q: 'How does dark web monitoring protect my organization?', a: 'The platform monitors underground forums, paste sites, stealer log markets, and breach databases for exposed credentials, domains, and sensitive data belonging to your organization. Early detection allows you to rotate compromised credentials and close exposed access points before attackers can use them.' },
    { q: 'Which compliance frameworks are supported?', a: 'SOC 2 Type I and Type II, HIPAA Security Rule, PCI-DSS v4.0, NIST CSF 2.0, NIST 800-53 Rev 5, ISO 27001:2022, CIS Controls v8, and GDPR. Cross-framework mapping shows where a single control satisfies requirements across multiple standards simultaneously.' },
    { q: 'Can I integrate the Security Suite with my existing tools?', a: 'Yes. The platform supports webhook integrations for alerts (Slack, PagerDuty, Jira, ServiceNow), SIEM forwarding via syslog and STIX/TAXII, and a full REST API for custom integrations. Scan results can be exported as JSON, CSV, or PDF for import into any downstream system.' },
    { q: 'How often should I run vulnerability scans?', a: 'We recommend continuous scanning with weekly full scans and daily quick scans for critical assets. The platform supports automated scheduling on any interval. After infrastructure changes, patches, or deployments, trigger an ad-hoc scan to validate that no new vulnerabilities were introduced.' },
  ],
}

export default function SecurityDocsPage() {
  return <ProductDoc {...data} />
}
