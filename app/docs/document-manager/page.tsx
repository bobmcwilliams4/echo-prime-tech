'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Document Manager',
  tagline: 'Cloud document management with R2 storage, version history, share links, threaded comments, and AI summarization.',
  accent: '#14b8a6',
  productUrl: '/document-manager',
  workerUrl: 'https://echo-document-manager.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Document Manager is a full-featured cloud document management system built on Cloudflare R2 object storage and D1 relational database. It provides teams with a structured, searchable repository for every file â€” contracts, reports, invoices, design assets, spreadsheets, and more â€” with enterprise-grade access control, version history, and a rich sharing model that works with or without a login.',
    'Files are organized in nested folders with no depth limit. Every upload automatically captures metadata â€” file type, size, uploader, upload timestamp, MIME type, and content hash. Version history preserves every revision of a file with one-click restore. When someone uploads a new version of an existing file, the previous version is archived but never deleted unless you explicitly purge it.',
    'The sharing system generates secure tokenized links with configurable permissions (view-only vs download), optional password protection, expiry dates, and download count limits. Recipients click the share link and access the file immediately without creating an account. Threaded comments attach directly to individual files and support @mentions, reactions, and resolved threads. AI summarization via Engine Runtime generates document summaries and auto-applies descriptive tags on upload.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Root Folder', desc: 'POST to /folders with a name and null parent_id to create your top-level folder structure. Organize by department, project, client, or document type â€” the folder hierarchy is completely flexible and can be reorganized at any time.' },
    { step: 2, title: 'Upload Your First File', desc: 'POST to /files/upload with the file as multipart form data and a folder_id. The file is stored in R2 immediately, metadata is written to D1, and the AI auto-tagging runs asynchronously in the background without blocking the upload response.' },
    { step: 3, title: 'Create a Share Link', desc: 'POST to /shares with the file_id, expiry date, and optional password. The response includes a public share token that anyone with the link can use to access the file without authentication â€” ideal for sharing with clients or external collaborators.' },
    { step: 4, title: 'Enable Version Tracking', desc: 'Subsequent uploads to the same file path or with the same filename in the same folder automatically create a new version. Use GET /versions/:id to see the full version history and POST to restore a previous version as the current one.' },
    { step: 5, title: 'Search and Organize', desc: 'Use GET /search with a query string to find files across all folders by filename, tag, content type, uploader, or AI-generated summary keywords. Search results include relevance ranking and breadcrumb paths to the file location.' },
  ],

  features: [
    { title: 'R2 File Storage', desc: 'All files stored in Cloudflare R2 â€” globally distributed, 99.999999999% durability, and zero egress fees. Files are served directly from R2 for downloads, eliminating bandwidth costs that would apply with AWS S3 or Google Cloud Storage.' },
    { title: 'Nested Folder Structure', desc: 'Unlimited-depth folder hierarchy with drag-and-drop reorganization in the dashboard. Move files and entire folder trees between locations. Folder permissions cascade to contents so you can control access at the department or project level.' },
    { title: 'Version History', desc: 'Every file update creates a new version automatically. Version list shows uploader, timestamp, file size, and change notes per revision. Restore any previous version as current in one click. Versions are never deleted unless explicitly purged.' },
    { title: 'Share Links', desc: 'Generate tokenized share URLs with configurable view vs. download permissions, optional password, expiry datetime, and maximum download count. Revoke share links at any time. Track every access â€” who accessed, when, from what IP â€” in the share access log.' },
    { title: 'Password-Protected Shares', desc: 'Add a password to any share link for an extra layer of protection on sensitive documents. Recipients enter the password once per session. Passwords are hashed with bcrypt and never stored in plaintext in the share record.' },
    { title: 'Threaded Comments', desc: 'Attach threaded conversations to any file. Support for @mentions that notify team members, emoji reactions, inline replies, and resolved thread marking. Comments are searchable and included in the file activity timeline.' },
    { title: 'Trash & 30-Day Purge', desc: 'Deleted files move to trash and are automatically purged after 30 days, matching standard data retention workflows. Restore any file from trash before purge. Admins can permanently delete or immediately purge files with appropriate permissions.' },
    { title: 'Storage Quotas', desc: 'Set per-user and per-folder storage quotas in the admin panel. Quota enforcement prevents runaway uploads from consuming team storage. Quota usage dashboards show consumption per user, department, and folder tree.' },
    { title: 'Bulk Operations', desc: 'Select multiple files or folders for bulk move, copy, download (as ZIP), tag, share, or delete. Bulk operations are processed asynchronously with progress tracking so large operations do not block the UI.' },
    { title: 'Access Control', desc: 'Granular permissions at the folder and file level â€” view, comment, upload, manage, and admin roles. Inherit permissions from parent folders or override per resource. Guest links bypass authentication while respecting the permission model.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/files/upload', desc: 'Upload a file as multipart form data. Accepts folder_id, description, and tags. Stores in R2, writes metadata to D1, triggers async AI summarization and auto-tagging. Returns file_id, version_id, R2 key, and download URL.', auth: true },
    { method: 'GET', path: '/files', desc: 'List files in a folder with pagination. Accepts folder_id, sort (name/date/size), and filter by file type or tag. Returns metadata array with file ID, name, size, type, uploader, version count, and share count.', auth: true },
    { method: 'POST', path: '/folders', desc: 'Create a new folder. Accepts name, parent_id (null for root), description, and initial permission overrides. Returns the folder ID and full path from root.', auth: true },
    { method: 'GET', path: '/versions/:id', desc: 'Retrieve the full version history for a file by file ID. Returns array of versions with version number, uploader, timestamp, size, change notes, and restore status. Supports version restoration via PUT.', auth: true },
    { method: 'POST', path: '/shares', desc: 'Create a share link for a file. Accepts file_id, permission (view/download), password, expires_at, and max_downloads. Returns a public share token and the full share URL.', auth: true },
    { method: 'GET', path: '/shares/:token', desc: 'Public endpoint â€” retrieve a shared file by token without authentication. Returns file metadata and a time-limited presigned R2 download URL. Requires password header if the share is password-protected.', auth: false },
    { method: 'POST', path: '/comments', desc: 'Add a comment to a file. Accepts file_id, body text, optional parent_comment_id for threaded replies, and @mention user IDs. Returns comment ID and triggers mention notifications.', auth: true },
    { method: 'DELETE', path: '/trash/:id', desc: 'Permanently delete a file from trash before the 30-day automatic purge. This action is irreversible and removes both the D1 metadata record and the R2 object. Requires admin or file-owner permission.', auth: true },
    { method: 'GET', path: '/search', desc: 'Full-text search across file names, AI-generated summaries, tags, comments, and metadata. Accepts query string, folder scope, file type filter, and date range. Returns ranked results with match context and breadcrumb paths.', auth: true },
  ],

  userGuide: [
    {
      title: 'Organizing with Folders',
      id: 'organizing-folders',
      content: [
        'The folder hierarchy is the primary organizational structure in Echo Document Manager. Design your top-level folders around your business structure â€” departments, clients, projects, or document types â€” then nest sub-folders as needed for granular organization. There is no depth limit, but deeply nested structures (more than 5 levels) become difficult to navigate. Prefer breadth over depth for most use cases.',
        'Move files and folders by dragging in the dashboard or by updating the parent_id via the API. Moving a folder moves all its contents recursively. Permissions set on the source folder do not automatically transfer to the destination â€” they inherit the destination folder permissions after the move. Review permissions after any reorganization.',
        'Use tags in addition to folder structure for cross-cutting organization. A contract might live in Clients/AcmeCorp/ but also be tagged with "signed", "2026", and "SaaS" so it surfaces in tag-based searches alongside contracts from other clients. Tags are added at upload time or via bulk tag operations after the fact.',
      ],
    },
    {
      title: 'Version History',
      id: 'version-history',
      content: [
        'Every time a file is updated â€” either by uploading a new file with the same name to the same folder, or by explicitly creating a new version via the API â€” Echo Document Manager archives the previous version and makes the new upload the current version. The version counter increments with each update and is displayed in the file metadata.',
        'To view version history, open the file detail panel and click the Versions tab. Each version shows the uploader identity, upload timestamp, file size, and optional change notes. You can download any specific version directly without making it the current version â€” useful for reference without affecting what collaborators see.',
        'Restore a previous version by clicking the Restore button next to it in the version history. Restoration creates a new version that is a copy of the selected historical version â€” the current version is archived, not deleted. This preserves the complete change history even when restoring to an earlier state.',
      ],
    },
    {
      title: 'Creating and Managing Share Links',
      id: 'sharing',
      content: [
        'Share links let you provide file access to anyone â€” clients, contractors, partners â€” without requiring them to create an account. Each share link has a unique cryptographic token embedded in the URL. View-permission links let recipients see and download the file. View-only links serve the file in a browser preview without offering a download button.',
        'Add a password to share links for sensitive documents. The password is set when creating the share and never displayed again after creation â€” record it in a secure channel when sharing with the recipient. Password-protected shares prompt for the password on first access and cache the authorization for the duration of the browser session.',
        'Monitor share access in the Share Access Log accessible from each file detail panel. Every access event records the timestamp, recipient IP address, country, user agent, and whether a file download occurred. Revoke a share link at any time by deleting it from the Shares list â€” the token becomes invalid immediately.',
      ],
    },
    {
      title: 'Storage Quotas and Trash',
      id: 'storage-quotas',
      content: [
        'Storage quotas prevent individual users or teams from consuming disproportionate shared storage. Set quotas in the Admin panel under Users or Folders. Quota checks run at upload time â€” if an upload would exceed the quota, it is rejected with a 413 response and an error message directing the user to free space or contact their admin.',
        'Deleted files go to the Trash view immediately. Files in Trash are invisible to regular users but remain accessible to file owners and admins. The 30-day purge timer starts from the deletion date, not the upload date. Permanently delete a file from Trash at any time â€” this removes both the R2 object and all D1 metadata including version history and comments.',
        'Monitor storage consumption from the Admin Storage dashboard. The usage chart breaks down consumption by user, folder, and file type. Click any segment to drill into the contributing files. Use the bulk export feature to download all files in a folder as a ZIP when migrating or archiving large document collections.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Document Summarization', desc: 'Engine Runtime generates a plain-English summary of uploaded documents â€” PDFs, Word files, text files, and spreadsheets â€” within seconds of upload. Summaries are stored in D1 and surfaced in search results, giving you insight into document contents without opening the file.' },
    { capability: 'Auto-Tagging', desc: 'Analyzes document content and metadata to assign descriptive tags automatically â€” document type, subject area, named entities (companies, people, dates), and topic keywords. Auto-tags supplement manual tags and significantly improve search recall.' },
    { capability: 'Duplicate Detection', desc: 'Content hash comparison on upload identifies files identical to or very similar to existing documents. Duplicate detection prevents wasted storage, alerts uploaders to existing versions, and helps maintain a clean, non-redundant document library.' },
    { capability: 'Smart Search Ranking', desc: 'Search results are ranked by a combination of lexical match, AI-generated summary relevance, tag match, recency, and access frequency. The ranking model learns from which search results users click to improve relevance over time.' },
  ],

  troubleshooting: [
    { issue: 'Upload fails with 413 error', solution: 'The upload exceeds either the per-file size limit (5GB by default) or the user storage quota. Check the error response body for the specific limit exceeded. If it is a quota issue, delete unnecessary files or ask your admin to increase your quota. If it is a file size issue, contact support to request an increased per-file limit for your plan.' },
    { issue: 'Share link returns 404 or "Link expired"', solution: 'The share link has been revoked by the file owner or admin, has reached its maximum download count, or has passed its expiry date. The file owner can generate a new share link. For links that should not have expired, check the Shares list in the file detail panel for the link status and expiry settings.' },
    { issue: 'Search not returning expected files', solution: 'Full-text search indexes file names, tags, and AI summaries but not the raw binary content of all file types. Verify the file has completed AI processing â€” check the ai_status field in the file metadata, which should show "complete". Ensure you have permission to view the files you are searching for â€” results are filtered by access rights.' },
    { issue: 'Version history shows only one version', solution: 'Versioning creates a new version only when a file with the same name is uploaded to the same folder, or when the API POST /files/:id/version endpoint is used explicitly. If you uploaded a renamed file, it is treated as a new file. Use the manual version endpoint to associate the new upload with the existing file ID.' },
  ],

  faq: [
    { q: 'What file types are supported?', a: 'Echo Document Manager supports any file type â€” there are no restrictions on format. AI summarization and auto-tagging work with PDF, DOCX, XLSX, PPTX, TXT, CSV, and common image formats. Binary files, videos, and other formats are stored and served without AI processing but support all other features including versioning, sharing, and comments.' },
    { q: 'How long are deleted files kept in trash?', a: 'Deleted files remain in trash for 30 days before automatic permanent deletion. You can restore any file during this window from the Trash view. Admins can permanently delete files immediately, bypassing the 30-day hold when necessary for compliance or storage management.' },
    { q: 'Can external users access shared files without an account?', a: 'Yes. Share links are public URLs that require no login. Recipients click the link and access the file immediately. If the share has a password, they enter it once per browser session. For secure sharing with specific individuals, combine a share link with a password shared through a separate channel.' },
    { q: 'Is there a limit on version history?', a: 'Starter plans retain the last 10 versions per file. Pro plans retain 50 versions. Business and Enterprise plans have unlimited version history. Older versions beyond your plan limit are automatically purged from oldest to newest. All plans can manually purge specific versions to free storage.' },
    { q: 'How does R2 storage compare to S3 or Google Cloud Storage?', a: 'Cloudflare R2 provides equivalent durability (11 nines) and performance to AWS S3 or GCS but charges zero egress fees â€” downloads are free regardless of volume. This is why Echo Document Manager uses R2: high-frequency file access does not generate bandwidth costs that would be passed on to users.' },
  ],
}

export default function EchoDocumentManagerDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/document-manager' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
