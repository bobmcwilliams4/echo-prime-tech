// Scanner Tutorial Data — 8 interactive tutorials for the REVENG Scanner product

export interface TutorialStep {
  title: string;
  description: string;
  callout?: string;
  target?: string;
  exampleValue?: string;
  illustrationType?: 'dashboard' | 'form' | 'table' | 'flow' | 'chart' | 'modal' | 'settings' | 'live';
  illustrationConfig?: Record<string, unknown>;
}

export interface Tutorial {
  id: string;
  title: string;
  subtitle: string;
  route?: string;
  icon: string;
  steps: TutorialStep[];
  estimatedMinutes: number;
}

export interface QuickRefCard {
  title: string;
  items: Array<{ label: string; value: string }>;
}

export const SCANNER_TUTORIALS: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    subtitle: 'Create your account and access the scanner',
    icon: '🚀',
    estimatedMinutes: 2,
    steps: [
      {
        title: 'Create Your Account',
        description: 'Sign up at echo-ept.com/signup or log in with your existing account. You can start with a single scan ($49) or choose a monthly plan for unlimited access.',
        illustrationType: 'form',
        illustrationConfig: {
          title: 'Sign Up',
          fields: [
            { label: 'Email', placeholder: 'you@company.com' },
            { label: 'Password', placeholder: '••••••••' },
          ],
          button: 'Create Account',
        },
      },
      {
        title: 'Choose Your Plan',
        description: 'Select the plan that matches your needs. Scout ($49/scan) for one-off audits, Hunter ($199/mo) for ongoing monitoring, or Arsenal ($999/mo) for enterprise-scale operations.',
        callout: 'Hunter is the most popular plan — unlimited scans with scheduled monitoring.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Feature', 'Scout', 'Hunter', 'Arsenal'],
          rows: [
            ['Scans', '1', 'Unlimited', 'Unlimited'],
            ['Monitoring', '—', 'Daily/Weekly', 'Custom'],
            ['API Access', '—', '✓', '✓'],
            ['White-label', '—', '—', '✓'],
          ],
        },
      },
      {
        title: 'Access the Dashboard',
        description: 'After purchase, the scanner dashboard appears in your account. You\'ll see the scan input bar, recent scans list, and usage statistics.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          title: 'Scanner Dashboard',
          stats: [
            { label: 'Scans Used', value: '0' },
            { label: 'Targets', value: '0' },
            { label: 'Avg Risk', value: '—' },
          ],
        },
      },
    ],
  },
  {
    id: 'first-scan',
    title: 'Running Your First Scan',
    subtitle: 'Target a website and launch a full analysis',
    icon: '🔍',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Enter a Target URL',
        description: 'Type or paste any URL, domain name, or IP address into the scan input. The scanner accepts full URLs (https://example.com), bare domains (example.com), and IP addresses (1.2.3.4).',
        callout: 'Only scan targets you own or have explicit written authorization to test.',
        exampleValue: 'https://your-website.com',
        illustrationType: 'form',
        illustrationConfig: {
          title: 'New Scan',
          fields: [{ label: 'Target', placeholder: 'https://your-website.com' }],
          button: 'Start Scan',
        },
      },
      {
        title: 'Select Scan Mode',
        description: 'Choose your scan depth. Quick mode (30 seconds) runs DNS and header checks. Standard mode (2 minutes) adds subdomain discovery, TLS audit, and technology fingerprinting. Deep mode (5+ minutes) enables port scanning, source analysis, and full crawling.',
        illustrationType: 'settings',
        illustrationConfig: {
          title: 'Scan Configuration',
          options: [
            { label: 'Quick', description: 'DNS + Headers (30s)', selected: false },
            { label: 'Standard', description: 'Full recon (2min)', selected: true },
            { label: 'Deep', description: 'Everything (5min+)', selected: false },
          ],
        },
      },
      {
        title: 'Watch the Scan Progress',
        description: 'After clicking Start, the 12 analyzers run in parallel. A real-time progress indicator shows which analyzers are active: DNS Recon, Header Analysis, TLS Audit, Subdomain Discovery, Cloud Detection, Crawler, and more.',
        illustrationType: 'live',
        illustrationConfig: {
          title: 'Scan in Progress',
          items: [
            { label: 'DNS Recon', status: 'complete' },
            { label: 'Header Analysis', status: 'complete' },
            { label: 'TLS Audit', status: 'running' },
            { label: 'Subdomain Discovery', status: 'running' },
            { label: 'Cloud Detection', status: 'pending' },
            { label: 'Technology Fingerprint', status: 'pending' },
          ],
        },
      },
      {
        title: 'Review Results',
        description: 'When complete, you\'ll see the risk score (0-10), total findings count, and a breakdown by severity (Critical, High, Medium, Low, Info). Click any finding to see full details, evidence, and remediation steps.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          title: 'Scan Complete',
          stats: [
            { label: 'Risk Score', value: '7.2' },
            { label: 'Findings', value: '342' },
            { label: 'Duration', value: '1m 47s' },
          ],
        },
      },
    ],
  },
  {
    id: 'risk-scores',
    title: 'Understanding Risk Scores',
    subtitle: 'How the scanner calculates and ranks risk',
    icon: '📊',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Risk Score Overview',
        description: 'Every scan produces a risk score from 0.0 (minimal risk) to 10.0 (maximum risk). The score is calculated from the severity and count of findings, weighted by confidence levels and exploitability.',
        illustrationType: 'chart',
        illustrationConfig: {
          title: 'Risk Scale',
          type: 'scale',
          ranges: [
            { label: '0-2', color: '#10b981', description: 'Low Risk' },
            { label: '3-5', color: '#f59e0b', description: 'Medium Risk' },
            { label: '6-8', color: '#f97316', description: 'High Risk' },
            { label: '9-10', color: '#ef4444', description: 'Critical Risk' },
          ],
        },
      },
      {
        title: 'Severity Levels',
        description: 'Each finding is classified as CRITICAL (actively exploitable, immediate action needed), HIGH (exploitable with moderate effort), MEDIUM (potential risk, should address), LOW (informational risk, best practice), or INFO (neutral observation).',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Severity', 'Meaning', 'Action'],
          rows: [
            ['CRITICAL', 'Actively exploitable', 'Fix immediately'],
            ['HIGH', 'Exploitable with effort', 'Fix within 24h'],
            ['MEDIUM', 'Potential risk', 'Fix within 1 week'],
            ['LOW', 'Best practice gap', 'Fix when convenient'],
            ['INFO', 'Observation', 'No action needed'],
          ],
        },
      },
      {
        title: 'Confidence Scores',
        description: 'Each finding includes a confidence score (0.0 to 1.0) indicating how certain the analyzer is about the finding. Scores above 0.8 are high-confidence. Scores below 0.5 should be manually verified.',
        illustrationType: 'chart',
        illustrationConfig: {
          title: 'Confidence Distribution',
          type: 'bar',
          data: [
            { label: '0.9-1.0', value: 45 },
            { label: '0.7-0.9', value: 30 },
            { label: '0.5-0.7', value: 15 },
            { label: '<0.5', value: 10 },
          ],
        },
      },
    ],
  },
  {
    id: 'reading-findings',
    title: 'Reading Findings',
    subtitle: 'Navigate and understand scan results',
    icon: '📋',
    estimatedMinutes: 4,
    steps: [
      {
        title: 'Finding Structure',
        description: 'Every finding has a title, description, severity, confidence, analyzer source, evidence (if applicable), and remediation guidance. Critical and High findings include MITRE ATT&CK technique mappings.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Missing Content Security Policy',
          fields: [
            { label: 'Severity', value: 'MEDIUM' },
            { label: 'Confidence', value: '0.85' },
            { label: 'Analyzer', value: 'web_recon' },
            { label: 'MITRE', value: 'T1190' },
          ],
        },
      },
      {
        title: 'Filter by Severity',
        description: 'Use the severity filter to focus on what matters most. Start with CRITICAL and HIGH findings for immediate action items, then review MEDIUM for your security roadmap.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Filter', 'Count', 'Priority'],
          rows: [
            ['CRITICAL', '2', 'Immediate'],
            ['HIGH', '8', 'This week'],
            ['MEDIUM', '23', 'This month'],
            ['LOW', '89', 'Backlog'],
            ['INFO', '220', 'Reference'],
          ],
        },
      },
      {
        title: 'Evidence & Proof',
        description: 'Many findings include raw evidence — actual HTTP headers, DNS records, certificate details, or source code snippets. This evidence is what a real attacker would see, presented so you can verify and prioritize the finding.',
        callout: 'Evidence is sanitized in reports but available in full detail in the dashboard.',
        illustrationType: 'live',
        illustrationConfig: {
          title: 'Evidence',
          items: [
            { label: 'server: nginx/1.18.0', status: 'complete' },
            { label: 'X-Powered-By: Express', status: 'complete' },
            { label: 'Missing: X-Frame-Options', status: 'running' },
          ],
        },
      },
      {
        title: 'Remediation Steps',
        description: 'Each finding includes specific remediation guidance. For security headers, you get the exact header values to add. For misconfigurations, you get the configuration changes needed. Copy-paste ready.',
        illustrationType: 'form',
        illustrationConfig: {
          title: 'Remediation',
          fields: [
            { label: 'Add Header', value: 'Content-Security-Policy: default-src \'self\'' },
            { label: 'Add Header', value: 'X-Frame-Options: DENY' },
          ],
          button: 'Copy All',
        },
      },
    ],
  },
  {
    id: 'dns-infrastructure',
    title: 'DNS & Infrastructure',
    subtitle: 'Map your external attack surface',
    icon: '🗺️',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Subdomain Discovery',
        description: 'The scanner finds subdomains through two methods: active DNS brute-force (testing 100+ common prefixes) and passive Certificate Transparency log searches. Results show resolved vs. unresolved subdomains.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Subdomain', 'IP', 'Status'],
          rows: [
            ['api.example.com', '1.2.3.4', 'Resolved'],
            ['staging.example.com', '1.2.3.5', 'Resolved'],
            ['dev.example.com', '—', 'Unresolved'],
            ['old.example.com', '—', 'CNAME Dangling'],
          ],
        },
      },
      {
        title: 'Cloud Provider Detection',
        description: 'Multi-signal detection identifies your hosting providers. We check IP range databases, HTTP response headers, DNS patterns, and certificate issuers to determine primary host, CDN layer, and WAF presence.',
        illustrationType: 'flow',
        illustrationConfig: {
          title: 'Detection Signals',
          nodes: ['IP Ranges', 'HTTP Headers', 'DNS Patterns', 'Cert Issuers', 'Response FP'],
          connections: [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5]],
          labels: ['', '', '', '', '', 'Cloud ID'],
        },
      },
      {
        title: 'Dangling DNS & Takeover Risk',
        description: 'Subdomains pointing to decommissioned services (Heroku, S3, GitHub Pages) can be claimed by attackers. The scanner flags CNAMEs pointing to unclaimed resources as HIGH severity subdomain takeover candidates.',
        callout: 'Subdomain takeover is one of the most common and impactful vulnerabilities found in external audits.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Subdomain Takeover Risk',
          fields: [
            { label: 'Subdomain', value: 'old-blog.example.com' },
            { label: 'CNAME', value: 'example.herokuapp.com' },
            { label: 'Status', value: 'UNCLAIMED — Takeover Possible' },
            { label: 'Severity', value: 'HIGH' },
          ],
        },
      },
    ],
  },
  {
    id: 'security-headers',
    title: 'Security Header Audit',
    subtitle: 'Check HTTP headers, cookies, and TLS',
    icon: '🛡️',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Required Security Headers',
        description: 'The scanner checks for 10 critical HTTP security headers. Missing headers are flagged by severity — CSP and HSTS are HIGH priority, while COOP/CORP/COEP are MEDIUM.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Header', 'Purpose', 'Priority'],
          rows: [
            ['Content-Security-Policy', 'XSS prevention', 'HIGH'],
            ['Strict-Transport-Security', 'Force HTTPS', 'HIGH'],
            ['X-Frame-Options', 'Clickjacking', 'MEDIUM'],
            ['X-Content-Type-Options', 'MIME sniffing', 'MEDIUM'],
            ['Referrer-Policy', 'Leak prevention', 'LOW'],
          ],
        },
      },
      {
        title: 'Cookie Security Flags',
        description: 'Every cookie is checked for three security flags: Secure (HTTPS-only transmission), HttpOnly (no JavaScript access), and SameSite (CSRF prevention). Cookies missing any flag are reported.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Cookie', 'Secure', 'HttpOnly', 'SameSite'],
          rows: [
            ['session_id', '✓', '✓', 'Strict'],
            ['preferences', '✗', '✗', 'None'],
            ['analytics', '✓', '✗', 'Lax'],
          ],
        },
      },
      {
        title: 'TLS Configuration',
        description: 'The TLS audit checks protocol version (TLSv1.2 minimum, TLSv1.3 preferred), cipher suite strength (128-bit minimum, 256-bit preferred), and certificate validity including expiration and chain integrity.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          title: 'TLS Health',
          stats: [
            { label: 'Protocol', value: 'TLSv1.3' },
            { label: 'Cipher', value: '256-bit' },
            { label: 'Expires', value: '220 days' },
          ],
        },
      },
    ],
  },
  {
    id: 'export-reports',
    title: 'Exporting Reports',
    subtitle: 'Generate professional security reports',
    icon: '📄',
    estimatedMinutes: 2,
    steps: [
      {
        title: 'PDF Report',
        description: 'Generate a professional PDF report with executive summary, risk score visualization, finding details sorted by severity, and remediation roadmap. Ideal for sharing with stakeholders or compliance teams.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Export Report',
          fields: [
            { label: 'Format', value: 'PDF' },
            { label: 'Include', value: 'All findings + remediation' },
            { label: 'Branding', value: 'Echo Prime (or white-label)' },
          ],
        },
      },
      {
        title: 'JSON & API Export',
        description: 'Download raw scan results as JSON for integration with your security tools, SIEM, or CI/CD pipeline. Hunter and Arsenal plans include full API access for programmatic scanning and result retrieval.',
        illustrationType: 'live',
        illustrationConfig: {
          title: 'API Response',
          items: [
            { label: 'GET /scan/{id}', status: 'complete' },
            { label: 'Content-Type: application/json', status: 'complete' },
            { label: '{ scan_id, risk_score, findings[] }', status: 'complete' },
          ],
        },
      },
      {
        title: 'White-Label Reports (Arsenal)',
        description: 'Arsenal plan customers can generate white-label reports with their own branding — company logo, colors, and custom cover page. Perfect for security consultants and MSPs delivering client reports.',
        callout: 'White-label reports are available on the Arsenal plan ($999/mo).',
        illustrationType: 'form',
        illustrationConfig: {
          title: 'Branding',
          fields: [
            { label: 'Company Name', placeholder: 'Your Security Co.' },
            { label: 'Logo URL', placeholder: 'https://...' },
            { label: 'Primary Color', placeholder: '#1a1a2e' },
          ],
          button: 'Save Branding',
        },
      },
    ],
  },
  {
    id: 'continuous-monitoring',
    title: 'Continuous Monitoring',
    subtitle: 'Set up automated scans and alerts',
    icon: '🔔',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Schedule Recurring Scans',
        description: 'Set up daily, weekly, or custom scan schedules for your targets. The scanner runs automatically and stores results for trend analysis. Available on Hunter and Arsenal plans.',
        illustrationType: 'settings',
        illustrationConfig: {
          title: 'Schedule',
          options: [
            { label: 'Daily', description: 'Scan every 24h', selected: false },
            { label: 'Weekly', description: 'Scan every Monday', selected: true },
            { label: 'Custom', description: 'Cron expression', selected: false },
          ],
        },
      },
      {
        title: 'Change Detection',
        description: 'The scanner compares each scan to previous results and highlights changes — new findings, resolved findings, risk score changes, and new subdomains or technologies. Get notified when your attack surface changes.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Change', 'Type', 'Impact'],
          rows: [
            ['New subdomain: api-v2.example.com', 'Added', 'Review needed'],
            ['CSP header added', 'Resolved', 'Risk reduced'],
            ['New open port: 8080', 'Added', 'Investigate'],
            ['TLS cert renewed', 'Changed', 'Good'],
          ],
        },
      },
      {
        title: 'Alert Configuration',
        description: 'Configure alerts for risk score increases, new CRITICAL/HIGH findings, certificate expiration warnings, or any change detection. Alerts can be sent via email, webhook, or Slack integration.',
        illustrationType: 'form',
        illustrationConfig: {
          title: 'Alert Rules',
          fields: [
            { label: 'Trigger', value: 'Risk score increases by 2+' },
            { label: 'Channel', value: 'Email + Slack webhook' },
            { label: 'Frequency', value: 'Immediate' },
          ],
          button: 'Save Alert',
        },
      },
    ],
  },
];

export const SCANNER_QUICK_REF: QuickRefCard[] = [
  {
    title: 'Scan Modes',
    items: [
      { label: 'Quick', value: 'DNS + Headers — 30 seconds' },
      { label: 'Standard', value: 'Full recon — 2 minutes' },
      { label: 'Deep', value: 'Everything + ports — 5+ minutes' },
    ],
  },
  {
    title: 'Severity Levels',
    items: [
      { label: 'CRITICAL', value: 'Actively exploitable, fix now' },
      { label: 'HIGH', value: 'Exploitable, fix within 24h' },
      { label: 'MEDIUM', value: 'Potential risk, fix this week' },
      { label: 'LOW', value: 'Best practice gap' },
      { label: 'INFO', value: 'Observation, no action' },
    ],
  },
  {
    title: '12 Analyzers',
    items: [
      { label: 'DNS Recon', value: 'Records, mail security' },
      { label: 'Subdomain', value: 'Brute-force + CT logs' },
      { label: 'TLS/SSL', value: 'Certs, ciphers, protocol' },
      { label: 'Headers', value: '10 security headers' },
      { label: 'Cloud', value: 'AWS/GCP/Azure/CF detect' },
      { label: 'Tech Stack', value: 'Frameworks, CMS, libs' },
      { label: 'Crawler', value: 'robots.txt, sitemap, paths' },
      { label: 'Source', value: 'Maps, keys, debug endpoints' },
      { label: 'Ports', value: 'Open services, banners' },
      { label: 'Cookies', value: 'Flags, security attributes' },
      { label: 'Email', value: 'SPF, DKIM, DMARC' },
      { label: 'MITRE', value: 'ATT&CK technique mapping' },
    ],
  },
  {
    title: 'Keyboard Shortcuts',
    items: [
      { label: '←/→', value: 'Previous/next step' },
      { label: 'Esc', value: 'Close tutorial panel' },
      { label: '?', value: 'Toggle tutorial panel' },
    ],
  },
];
