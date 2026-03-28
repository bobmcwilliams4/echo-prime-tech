'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Drive Intelligence',
  tagline: 'AI-powered file system analysis for classification, duplicate detection, sensitive data discovery, and compliance scanning.',
  accent: '#3b82f6',
  productUrl: '/drive-intelligence',
  workerUrl: 'echo-drive-intelligence.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Drive Intelligence transforms chaotic file systems into organized intelligence. AI-powered classification automatically categorizes files by content type, project, department, and relevance. Content-aware duplicate detection goes beyond filename matching to find near-duplicates, versioned copies, and redundant backups consuming your storage.',
    'Sensitive data discovery scans for PII, credentials, API keys, financial data, and PHI across all file types — including PDFs, images with OCR, and archives. Generate compliance reports for GDPR, HIPAA, SOC2, and PCI-DSS to identify data that needs encryption, access control, or deletion. Automated policies handle archival, temp file cleanup, and alerts when sensitive data appears in unsecured locations.',
    'Scan local drives, network shares, NAS devices, and cloud storage (Google Drive, OneDrive, Dropbox, S3, R2) from one unified dashboard. Full-text search across all file contents, metadata, and tags finds any file in seconds, even across terabytes of data. Starting at $19/mo compared to enterprise pricing for Varonis.',
  ],
  gettingStarted: [
    { step: 1, title: 'Connect Storage Sources', desc: 'Add local drives, network shares, or cloud storage accounts (Google Drive, OneDrive, S3, R2) to scan. Each source is authenticated securely and scanned independently.' },
    { step: 2, title: 'Run Initial Scan', desc: 'Start your first scan to inventory all files. The AI classifies files by content type, identifies duplicates, and estimates storage optimization potential. Initial scans may take hours for large volumes.' },
    { step: 3, title: 'Review Findings', desc: 'Browse the dashboard to see file classification results, duplicate clusters, storage waste estimates, and any sensitive data discoveries. Each finding includes actionable recommendations.' },
    { step: 4, title: 'Set Up Policies', desc: 'Configure automated policies for ongoing maintenance: auto-archive files older than N days, delete temp files on schedule, alert when sensitive data appears in unsecured locations.' },
  ],
  features: [
    { title: 'AI File Classification', desc: 'Automatically categorize files by content type, project, department, and relevance. No more digging through folder hierarchies to find what you need.' },
    { title: 'Duplicate Detection', desc: 'Content-aware duplicate finding that goes beyond filename matching. Detect near-duplicates, versioned copies, and redundant backups consuming storage.' },
    { title: 'Storage Optimization', desc: 'Identify large files, old backups, temp files, and unused data consuming storage. Get actionable cleanup recommendations with projected savings in GB and cost.' },
    { title: 'Sensitive Data Discovery', desc: 'AI scans for PII, credentials, API keys, financial data, and PHI across all file types — including PDFs, images with OCR, and compressed archives.' },
    { title: 'Smart Organization', desc: 'AI suggests folder structures based on actual usage patterns. Reorganize years of accumulated files into logical hierarchies with one-click apply.' },
    { title: 'File Relationship Mapping', desc: 'Discover which files reference each other, share data, or belong to the same project — even across different folders and storage locations.' },
    { title: 'Version History', desc: 'Track file versions across locations. Find the latest version of any document regardless of where copies live on your storage.' },
    { title: 'Multi-Source Scanning', desc: 'Scan local drives, network shares, cloud storage (Google Drive, S3, R2, OneDrive), and NAS devices from one unified dashboard.' },
    { title: 'Compliance Reports', desc: 'Generate GDPR, HIPAA, SOC2, and PCI-DSS compliance reports. Identify data that needs encryption, access control, or deletion to meet requirements.' },
    { title: 'Usage Analytics', desc: 'Track which files are accessed frequently, which are stale, and how storage grows over time. Plan capacity and prioritize cleanup.' },
    { title: 'Automated Policies', desc: 'Set rules for automatic archival, deletion of old temp files, and alerts when sensitive data appears in unsecured locations.' },
    { title: 'Search Everything', desc: 'Full-text search across all file contents, metadata, and tags. Find any file in seconds, even across terabytes of data.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/scans', desc: 'Start a new scan on a connected storage source', auth: true },
    { method: 'GET', path: '/api/scans/:id', desc: 'Get scan status and results', auth: true },
    { method: 'GET', path: '/api/files', desc: 'Search and list files across all sources', auth: true },
    { method: 'GET', path: '/api/duplicates', desc: 'List detected duplicate clusters', auth: true },
    { method: 'GET', path: '/api/sensitive', desc: 'List sensitive data findings (PII, credentials, PHI)', auth: true },
    { method: 'GET', path: '/api/compliance/:standard', desc: 'Generate compliance report (GDPR, HIPAA, SOC2, PCI-DSS)', auth: true },
    { method: 'GET', path: '/api/storage/analytics', desc: 'Get storage usage analytics and growth trends', auth: true },
    { method: 'POST', path: '/api/policies', desc: 'Create an automated policy (archive, delete, alert)', auth: true },
  ],
  userGuide: [
    { title: 'Connecting Storage Sources', id: 'storage-sources', content: [
      'Navigate to Settings and click Add Storage Source. Choose from Local Drive (enter mount path), Network Share (UNC path with credentials), or Cloud Storage (Google Drive, OneDrive, S3, R2, Dropbox with OAuth or API key).',
      'Each storage source is scanned independently on its own schedule. Set scan frequency from hourly to weekly depending on how often files change. Initial scans inventory all files; subsequent scans detect changes incrementally.',
      'For large network shares or cloud buckets, consider starting with a subset (specific folders) and expanding coverage after reviewing initial results.',
    ]},
    { title: 'Understanding Scan Results', id: 'scan-results', content: [
      'After a scan completes, the dashboard shows a summary: total files, total size, files classified, duplicates found, storage waste estimated, and sensitive data detections.',
      'Click into any category for details. Duplicate clusters show all copies with file paths, sizes, and last modified dates — click Resolve to choose which to keep and which to remove. Sensitive data findings show the file, data type (PII, credential, financial), and a snippet of the match.',
      'AI classification results appear in the Files tab. Each file gets a content type, project association, and relevance score. Use these to build smarter folder structures or search across your entire storage.',
    ]},
    { title: 'Compliance Scanning', id: 'compliance', content: [
      'Run a compliance scan from the Compliance tab. Select the standard (GDPR, HIPAA, SOC2, PCI-DSS) and the storage sources to include.',
      'The report identifies files containing regulated data types (PII for GDPR, PHI for HIPAA, cardholder data for PCI-DSS) and their current access permissions. Each finding includes a risk level and recommended action.',
      'Export compliance reports as PDF or CSV for auditors. Schedule recurring compliance scans to maintain ongoing compliance posture.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Content Classification', desc: 'AI reads file content (not just filenames) to classify documents by type, project, department, and relevance. Understands context to group related files even with inconsistent naming.' },
    { capability: 'Near-Duplicate Detection', desc: 'Goes beyond hash matching to find near-duplicates — files with minor edits, different formatting, or version variations that are essentially the same document.' },
    { capability: 'Sensitive Data Recognition', desc: 'Identifies PII (names, SSNs, addresses), credentials (API keys, passwords), financial data (account numbers, card data), and PHI (medical records) across text, PDFs, and images via OCR.' },
    { capability: 'Smart Organization Suggestions', desc: 'Analyzes file usage patterns and content relationships to suggest optimal folder structures that match how your team actually works with files.' },
  ],
  troubleshooting: [
    { issue: 'Scan is running very slowly', solution: 'Large initial scans can take hours for terabytes of data. Check that the storage source is accessible and network connectivity is stable. Narrow the scan scope to specific folders if needed. Subsequent incremental scans are much faster.' },
    { issue: 'Cloud storage connection fails', solution: 'Re-authenticate the OAuth connection for Google Drive or OneDrive. For S3/R2, verify the access key, secret key, and bucket name. Ensure the IAM policy grants read access to the target bucket.' },
    { issue: 'False positives in sensitive data scan', solution: 'Review and dismiss false positives in the Sensitive Data tab. Add exclusion patterns for known safe files (e.g., test data, documentation examples). The AI learns from dismissals to reduce future false positives.' },
    { issue: 'Duplicate detection missing files', solution: 'Ensure all relevant storage sources are connected and included in the scan. Near-duplicate detection requires the Professional plan. Verify file types are not excluded in scan settings.' },
  ],
  faq: [
    { q: 'How does AI file analysis work?', a: 'The AI scans file content, metadata, and structure to classify documents, detect duplicates, identify sensitive data, and suggest organization schemes. It understands context — grouping related files even when names are inconsistent.' },
    { q: 'Will it modify my files?', a: 'Never without your approval. Drive Intelligence operates in read-only mode by default. It analyzes and recommends — you approve actions before any files are moved, renamed, or deleted.' },
    { q: 'Can it scan network drives and cloud storage?', a: 'Yes. Scan local drives, NAS, network shares, and cloud storage (Google Drive, OneDrive, Dropbox, S3, R2). Unified view across all storage locations from one dashboard.' },
    { q: 'How does compliance scanning work?', a: 'AI identifies PII, PHI, financial data, and other sensitive information across your file systems. Generate compliance reports for GDPR, HIPAA, SOC2, and PCI-DSS. Flag files that need encryption or access restriction.' },
    { q: 'What is the pricing structure?', a: 'Starter at $19/mo covers 1TB scan capacity on local drives. Professional at $59/mo supports 10TB across cloud and local with AI classification and compliance. Enterprise at $199/mo provides unlimited capacity with all features.' },
  ],
}

export default function DriveIntelligenceDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/drive-intelligence' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
