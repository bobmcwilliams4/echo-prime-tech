'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Documents',
  tagline: 'Cloud document management with version control, sharing, and AI-powered organization.',
  accent: '#2563eb',
  productUrl: '/documents',
  workerUrl: 'https://echo-documents.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Documents is a full-featured cloud document management system built on Cloudflare R2 and D1. It provides secure file storage with automatic versioning, granular access control, and AI-powered organization that eliminates manual tagging and categorization. Every file uploaded is encrypted at rest, deduplicated by content hash, and instantly searchable across your entire document library.',
    'Designed for teams and enterprises that need more than a simple file locker, Echo Documents supports nested folder hierarchies, threaded comments on any file, and share links with configurable expiry, password protection, and download limits. The built-in trash system auto-purges deleted files after 30 days, and per-user storage quotas ensure fair resource allocation across your organization.',
    'The AI layer continuously analyzes uploaded documents, generating summaries, extracting key entities, and applying semantic tags that make retrieval effortless. Whether you are managing contracts, technical specifications, or media assets, Echo Documents keeps everything organized, versioned, and accessible from a single unified interface.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Workspace', desc: 'Sign in to echo-ept.com and navigate to Documents. Your personal workspace is provisioned automatically with 5 GB of free storage. Enterprise plans start at 100 GB per seat.' },
    { step: 2, title: 'Upload Your First File', desc: 'Drag and drop files directly onto the page or click the upload button. Echo Documents accepts any file type up to 500 MB per file. Multi-file uploads run in parallel with real-time progress indicators.' },
    { step: 3, title: 'Organize with Folders', desc: 'Create folder hierarchies to mirror your project structure. Folders can be nested up to 10 levels deep. Move files between folders with drag-and-drop or the right-click context menu.' },
    { step: 4, title: 'Share Securely', desc: 'Right-click any file or folder and select Share. Configure access with password protection, expiry dates (1 hour to 90 days), and download limits. Share links use cryptographic tokens that cannot be guessed.' },
    { step: 5, title: 'Enable AI Features', desc: 'Toggle AI Organization in your workspace settings. Documents will be automatically summarized, tagged with semantic labels, and indexed for full-text search. Processing typically completes within 30 seconds per document.' },
  ],
  features: [
    { title: 'R2-Backed File Storage', desc: 'All files are stored on Cloudflare R2 with automatic redundancy across multiple regions. Zero egress fees mean you never pay extra to download your own files, regardless of volume.' },
    { title: 'Folder Hierarchy', desc: 'Create deeply nested folder structures up to 10 levels. Folders support bulk operations, drag-and-drop reordering, and recursive permission inheritance from parent folders.' },
    { title: 'Version History', desc: 'Every file edit creates a new version automatically. Browse the complete version timeline, compare changes between versions, and restore any previous version with a single click. Versions are retained for 365 days.' },
    { title: 'Secure Share Links', desc: 'Generate share links with cryptographic tokens, optional password protection, configurable expiry dates, and download count limits. Revoke access instantly by disabling the link.' },
    { title: 'Password Protection', desc: 'Add a password to any shared link for an extra layer of security. Passwords are hashed with bcrypt and never stored in plaintext. Failed attempts are rate-limited to prevent brute-force attacks.' },
    { title: 'Threaded Comments', desc: 'Attach threaded comments to any file for collaborative review. Comments support @mentions to notify team members, and the full comment history is preserved across file versions.' },
    { title: 'Trash & Auto-Purge', desc: 'Deleted files move to trash instead of being permanently removed. Trash contents are automatically purged after 30 days. Restore any trashed file before the purge window closes.' },
    { title: 'Storage Quotas', desc: 'Administrators can set per-user and per-workspace storage quotas. Usage dashboards show current consumption with trend graphs. Quota alerts fire at 80% and 95% thresholds.' },
    { title: 'AI Summarization', desc: 'Uploaded documents are automatically summarized using multi-model AI. Summaries appear on the file detail page and in search results, letting you assess document relevance without opening the file.' },
    { title: 'Full-Text Search', desc: 'Search across all documents by content, filename, tags, or metadata. Results are ranked by relevance with highlighted matching excerpts. Filters narrow results by file type, date range, and owner.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/files/upload', desc: 'Upload a file to R2 storage. Accepts multipart/form-data with the file payload, target folder ID, and optional metadata. Returns the file record with ID, URL, and version number.', auth: true },
    { method: 'GET', path: '/folders', desc: 'List all folders in the authenticated user\'s workspace. Supports query parameters for parent_id (to list children), depth (recursive listing), and sort order. Returns folder tree with file counts.', auth: true },
    { method: 'POST', path: '/shares/create', desc: 'Create a share link for a file or folder. Body accepts target_id, password (optional), expires_at (ISO 8601), and max_downloads (integer). Returns the share URL and token.', auth: true },
    { method: 'GET', path: '/files/:id/versions', desc: 'Retrieve the full version history for a file. Returns an array of version objects with version number, uploader, timestamp, file size, and content hash. Supports pagination via cursor parameter.', auth: true },
    { method: 'POST', path: '/comments', desc: 'Add a threaded comment to a file. Body accepts file_id, content (markdown supported), and optional parent_comment_id for replies. Returns the created comment with author details.', auth: true },
    { method: 'GET', path: '/search', desc: 'Full-text search across all documents. Query parameters: q (search query), type (file extension filter), folder_id (scope), date_from/date_to (range). Returns ranked results with highlighted excerpts.', auth: true },
  ],
  userGuide: [
    {
      title: 'Managing Files and Folders',
      id: 'managing-files',
      content: [
        'The Documents dashboard presents your workspace as a familiar file explorer. The left panel shows your folder tree, while the main area displays the contents of the selected folder. Click any folder to expand it and view its children.',
        'To upload files, drag them directly onto the main content area or click the Upload button in the toolbar. You can select multiple files at once and they will upload in parallel. Each upload shows a real-time progress bar with speed and estimated time remaining.',
        'Creating folders is done via the New Folder button or by right-clicking in empty space. Folders can be renamed by double-clicking their name in the tree. To move files between folders, drag and drop them or use Cut/Paste from the context menu.',
        'Version history is accessible from the file detail panel. Click any file to open its detail view, then select the Versions tab. Each version shows a timestamp, the user who uploaded it, and the file size delta. Click Restore on any version to make it the current version.',
      ],
    },
    {
      title: 'Sharing and Collaboration',
      id: 'sharing',
      content: [
        'Echo Documents supports two sharing models: share links for external recipients and workspace permissions for team members. Share links are ideal for sending files to clients or partners who do not have an Echo account.',
        'To create a share link, right-click a file or folder and select Share. The share dialog lets you set a password, an expiry date, and a maximum download count. Once created, copy the link and send it via email or messaging. Recipients access the file through a branded download page.',
        'For internal collaboration, invite team members to your workspace. Members can be assigned Viewer (read-only), Editor (upload and modify), or Admin (full control including quota management) roles. Permissions cascade from parent folders to children unless explicitly overridden.',
        'Threaded comments enable asynchronous review. Open a file, switch to the Comments tab, and type your feedback. Use @username to mention a colleague, which triggers an email notification. Comments support markdown formatting for code snippets, lists, and emphasis.',
      ],
    },
    {
      title: 'AI-Powered Organization',
      id: 'ai-organization',
      content: [
        'When AI Organization is enabled, every uploaded document is processed through a multi-stage pipeline. First, text extraction pulls content from PDFs, Office documents, and images (via OCR). Then, the AI generates a concise summary and identifies key entities such as names, dates, and monetary amounts.',
        'Semantic tags are applied automatically based on the document content. For example, a lease agreement might be tagged with "legal", "real-estate", and "contract". Tags appear on the file card and are searchable, making it easy to find related documents without manual categorization.',
        'The full-text search index is updated in real time as documents are processed. Search queries match against file content, AI-generated summaries, tags, and metadata. The ranking algorithm prioritizes exact phrase matches, recency, and document relevance to deliver the most useful results first.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Automatic Document Summarization', desc: 'Every uploaded document is summarized into a concise 2-3 sentence abstract using multi-model AI. Summaries capture the document\'s purpose, key conclusions, and relevant dates or figures. They appear in search results and file previews, reducing the time needed to assess document relevance.' },
    { capability: 'Semantic Auto-Tagging', desc: 'AI analyzes document content and applies semantic tags drawn from a taxonomy of 200+ categories including legal, financial, technical, medical, and administrative. Tags are weighted by confidence score, and low-confidence tags are flagged for human review.' },
    { capability: 'Intelligent Full-Text Search', desc: 'Search queries are expanded with synonyms and related terms to improve recall. The AI understands natural language queries like "contracts signed in Q1 2026" and translates them into precise filters. Results include highlighted excerpts showing exactly where the match occurs.' },
    { capability: 'Entity Extraction', desc: 'Key entities are automatically extracted from documents including person names, company names, dates, monetary amounts, addresses, and reference numbers. Extracted entities are indexed separately, enabling searches like "find all documents mentioning Acme Corp" without scanning full text.' },
  ],
  troubleshooting: [
    { issue: 'Upload fails with "Quota Exceeded" error', solution: 'Your workspace has reached its storage limit. Delete unnecessary files or empty your trash to reclaim space. Alternatively, contact your workspace admin to increase your quota. Enterprise plans support unlimited storage with per-seat billing.' },
    { issue: 'Share link returns 403 Forbidden', solution: 'The share link may have expired, reached its download limit, or been revoked by the file owner. Request a new share link from the sender. If you are the owner, check the share settings in the file detail panel to verify the link is still active.' },
    { issue: 'AI summaries not appearing on uploaded files', solution: 'Ensure AI Organization is enabled in your workspace settings (Settings > AI Features > Enable). Processing typically takes 15-30 seconds per document. If summaries still do not appear after 2 minutes, the file type may not be supported for text extraction. Supported formats include PDF, DOCX, XLSX, PPTX, TXT, and common image formats.' },
    { issue: 'Search returns no results for known documents', solution: 'The search index may still be building for recently uploaded files. Wait 60 seconds and try again. If the issue persists, verify the file is not in the trash (trashed files are excluded from search by default). Check your search scope as well, as folder-scoped searches only return results within the selected folder.' },
  ],
  faq: [
    { q: 'What file types does Echo Documents support?', a: 'Echo Documents accepts any file type. There are no restrictions on extensions or MIME types. AI features (summarization, tagging, search) work best with text-based formats like PDF, DOCX, XLSX, PPTX, TXT, CSV, and HTML. Images are processed via OCR for text extraction.' },
    { q: 'How long are file versions retained?', a: 'All file versions are retained for 365 days from the date of creation. After 365 days, the oldest versions are archived to cold storage and can be restored on request within 24 hours. The current version is never archived.' },
    { q: 'Is there a file size limit?', a: 'Individual files can be up to 500 MB each. For larger files, consider splitting them or using the bulk upload API which supports chunked transfers up to 5 GB. Contact support for enterprise use cases requiring larger limits.' },
    { q: 'Can I use Echo Documents with my own domain?', a: 'Yes. Enterprise plans support custom domain mapping so your team accesses documents at docs.yourcompany.com. Custom domains include automatic SSL certificate provisioning and can be configured through the admin settings panel.' },
    { q: 'How is data encrypted?', a: 'All files are encrypted at rest using AES-256 on Cloudflare R2. Data in transit is protected by TLS 1.3. Share links use cryptographic tokens generated with a CSPRNG. Passwords on share links are hashed with bcrypt (cost factor 12) and never stored in plaintext.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }
