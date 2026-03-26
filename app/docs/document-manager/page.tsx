'use client'

import ProductDoc from '@/components/ProductDoc'

export default function DocumentManagerDocPage() {
  return (
    <ProductDoc
      name="Echo Document Manager"
      tagline="AI-powered cloud file management — store, search, share, and collaborate with intelligence built into every file."
      accent="#0369a1"
      productUrl="/document-manager"
      workerUrl="https://echo-document-manager.bmcii1976.workers.dev"
      version="1.3.0"
      overview={[
        'Echo Document Manager is an AI-powered cloud file management platform that replaces Google Drive, Dropbox, and SharePoint with a smarter, faster, and more secure alternative. Every file you upload is automatically analyzed, indexed, and made searchable by content — not just filename. Ask a question in natural language and Document Manager finds the exact paragraph in the exact document that answers it.',
        'The platform is built for teams that need more than basic file storage. Version control tracks every change to every file with full diff history and one-click rollback. Granular sharing permissions control who can view, edit, comment, or manage each file and folder. Team folders with configurable workflows handle review cycles, approvals, and publishing with built-in audit trails that satisfy compliance requirements.',
        'Unlike traditional file managers that treat files as opaque blobs, Echo Document Manager understands your content. OCR makes scanned documents searchable. AI tagging automatically categorizes files by topic, project, and document type. Smart folders auto-populate based on content rules. And the preview engine renders over 200 file formats directly in the browser — no downloads or external applications needed.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Workspace', desc: 'Sign up and create your document workspace. Set your workspace name, upload your company logo for branding, and configure the default storage region. Invite team members with email and assign initial roles (Admin, Editor, Viewer).' },
        { step: 2, title: 'Upload Your Files', desc: 'Drag and drop files or folders into the workspace, or use the upload button to select from your device. Bulk upload supports thousands of files at once. The desktop sync client enables automatic background synchronization of local folders.' },
        { step: 3, title: 'Organize with Folders & Tags', desc: 'Create folder hierarchies for your team structure or project organization. Add tags manually or let the AI auto-tag based on content analysis. Create smart folders that auto-populate based on tag, type, or content rules.' },
        { step: 4, title: 'Set Sharing & Permissions', desc: 'Right-click any file or folder to configure sharing. Set permissions per user or group: View Only, Can Comment, Can Edit, Full Access. Generate shareable links with optional password protection and expiration dates.' },
        { step: 5, title: 'Install Desktop & Mobile Sync', desc: 'Download the desktop sync client for Windows or Mac to keep local folders in sync with your cloud workspace. Install the mobile app for on-the-go access, offline viewing, and camera-to-cloud document capture.' },
      ]}
      features={[
        { title: 'Cloud File Storage', desc: 'Secure cloud storage with automatic redundancy across multiple data centers. Files are encrypted at rest (AES-256) and in transit (TLS 1.3). Storage scales automatically — no provisioning needed. Supports files up to 10GB each.' },
        { title: 'Version Control', desc: 'Every edit creates a new version with full change history. View diffs between any two versions, restore previous versions with one click, and set version retention policies. Supports branching for collaborative editing workflows.' },
        { title: 'Sharing & Permissions', desc: 'Granular permissions at the file, folder, and workspace level. Share with specific users, groups, or via public/password-protected links. Set expiration dates on shared links. Revoke access instantly from the sharing dashboard.' },
        { title: 'AI-Powered Search', desc: 'Search by content, not just filename. Natural language queries find the exact paragraph that answers your question across all documents. Supports boolean operators, date filters, file type filters, and tag filters. Results ranked by relevance with highlighted matches.' },
        { title: 'Document Preview', desc: 'In-browser preview for over 200 file formats including PDF, Word, Excel, PowerPoint, images, videos, audio, CAD files, and code files. No downloads or external applications required. Annotate and comment directly on previews.' },
        { title: 'OCR Processing', desc: 'Scanned documents, photos of paper, and image-based PDFs are automatically processed with OCR to extract text content. Makes every document searchable regardless of how it was created. Supports 30+ languages.' },
        { title: 'Team Folders', desc: 'Shared folders with configurable team access and workflows. Assign folder-level roles (Owner, Manager, Contributor, Viewer). Set up review and approval workflows for controlled document publishing. Activity feeds show all team actions.' },
        { title: 'Audit Trail', desc: 'Complete audit log of every action: uploads, downloads, edits, shares, deletions, permission changes, and logins. Filterable by user, action type, and date range. Exportable for compliance reporting. Tamper-proof storage ensures log integrity.' },
        { title: 'Integrations', desc: 'Connect with Slack (file notifications), email (share via email), Zapier (workflow automation), and the Echo ecosystem. REST API for custom integrations. Webhook support for real-time event notifications.' },
        { title: 'Offline Sync', desc: 'Mark files and folders for offline access on desktop and mobile. Changes made offline sync automatically when connectivity is restored. Conflict resolution handles simultaneous edits with merge or version branching options.' },
        { title: 'Smart Folders', desc: 'Auto-populating folders based on rules you define. Create a folder that automatically contains all PDFs tagged "contracts" from the last 90 days. Rules support file type, tags, date, author, and content keyword conditions.' },
        { title: 'Trash & Recovery', desc: 'Deleted files go to Trash and are retained for 30 days (configurable up to 365 days). Restore any deleted file or folder with one click, including all versions and permissions. Permanent deletion requires admin confirmation.' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/api/files/upload', desc: 'Upload a file with metadata (tags, folder, description). Supports multipart upload for large files.', auth: true },
        { method: 'GET', path: '/api/files/:id', desc: 'Get file metadata including versions, tags, permissions, and preview URL.', auth: true },
        { method: 'GET', path: '/api/files/:id/content', desc: 'Download the file content. Supports range requests for partial downloads.', auth: true },
        { method: 'GET', path: '/api/search', desc: 'Full-text content search across all accessible files. Supports natural language and boolean queries.', auth: true },
        { method: 'POST', path: '/api/folders', desc: 'Create a new folder with name, parent, permissions, and optional smart folder rules.', auth: true },
        { method: 'PUT', path: '/api/files/:id/permissions', desc: 'Update sharing permissions for a file. Add/remove users, change access levels, set link sharing options.', auth: true },
        { method: 'GET', path: '/api/files/:id/versions', desc: 'List all versions of a file with timestamps, author, size, and change summary.', auth: true },
        { method: 'GET', path: '/api/audit', desc: 'Query the audit trail with filters for user, action type, file, and date range.', auth: true },
      ]}
      userGuide={[
        { id: 'file-management', title: 'Managing Files & Folders', content: [
          'The workspace view is your primary interface for managing files. Navigate folders in the left sidebar, or use the breadcrumb trail at the top. The main area shows files in either grid view (with thumbnails) or list view (with metadata columns). Sort by name, date modified, size, or type. Filter by tags, file type, or author.',
          'To upload files, drag them directly into the workspace view or click the Upload button. Folder uploads preserve the directory structure. During upload, you can add tags, select a destination folder, and write a description. The AI automatically suggests additional tags based on content analysis after upload completes.',
          'Move, copy, rename, and delete files using right-click context menus or keyboard shortcuts. Bulk operations are supported — select multiple files with checkboxes and apply actions to all at once. Deleted files go to Trash where they are recoverable for the configured retention period.',
        ]},
        { id: 'collaboration', title: 'Team Collaboration & Sharing', content: [
          'Share any file or folder by right-clicking and selecting Share. Add specific users by email, select a permission level (View Only, Can Comment, Can Edit, Full Access), and optionally add a message. Recipients receive an email notification with a direct link to the shared content.',
          'For external sharing, generate a shareable link. Configure link options: password protection, expiration date (auto-revokes access), download permission (allow or view-only), and watermarking for sensitive documents. Track link analytics to see who accessed shared content and when.',
          'Team folders provide persistent shared spaces for project teams. The folder owner sets default permissions, and managers can adjust access for individual members. Activity feeds in team folders show all member actions. @mention team members in comments to direct their attention to specific files or discussions.',
        ]},
        { id: 'search-discovery', title: 'Search & Content Discovery', content: [
          'The search bar at the top of every page supports natural language queries. Type a question like "what is the liability limit in the Smith contract" and the AI finds the relevant clause across all your documents. Results show the matching text with context, file name, and a direct link to the exact location in the document.',
          'Advanced search operators let you refine results: type:pdf for file type filtering, tag:contracts for tag filtering, author:john for author filtering, and date:2026-01 for date ranges. Combine operators with natural language for precise queries like "NDA amendments type:docx date:2025".',
          'Smart folders extend search into automatic organization. Create rules that continuously filter your workspace — for example, a smart folder that shows all Excel files tagged "financials" modified in the last quarter. Smart folders update in real time as files are added, modified, or retagged.',
        ]},
        { id: 'version-control', title: 'Version Control & History', content: [
          'Every time a file is edited and saved, Document Manager creates a new version automatically. The version history panel (accessible from the file detail view) shows every version with timestamp, author, file size, and a brief change summary generated by the AI.',
          'Compare any two versions side by side with the diff viewer. For text documents, changes are highlighted at the word level. For spreadsheets, changed cells are marked. For images and PDFs, a visual diff overlay shows modifications. This makes it easy to understand exactly what changed between versions.',
          'Restore a previous version with one click — the restored version becomes the new current version without deleting the intermediate versions. Version retention policies can be configured per folder: keep all versions, keep versions for N days, or keep only the last N versions. Admins can also lock versions to prevent accidental deletion.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Semantic Search', desc: 'Understands the meaning behind your queries, not just keywords. Ask "what are our payment terms with Acme Corp" and the AI finds the relevant contract clause even if those exact words do not appear. Contextual ranking ensures the most relevant results appear first.' },
        { capability: 'Auto-Tagging', desc: 'AI analyzes uploaded files and automatically suggests tags based on content, document type, and context. Learns from your tagging patterns to improve suggestions over time. Supports custom tag taxonomies for enterprise classification requirements.' },
        { capability: 'Document Summarization', desc: 'Generates concise summaries of long documents — contracts, reports, proposals, and technical specifications. Summaries appear in search results and file previews, making it faster to find the right document without opening each one.' },
        { capability: 'OCR & Text Extraction', desc: 'Processes scanned documents, photos, and image-based PDFs through advanced OCR to extract text content. Handles handwritten text, stamps, signatures, and multi-column layouts. Extracted text is indexed for full-text search.' },
        { capability: 'Content Classification', desc: 'Automatically classifies documents by type (contract, invoice, report, correspondence, specification) and sensitivity level (public, internal, confidential, restricted). Classification drives smart folder population and access policy suggestions.' },
        { capability: 'Duplicate Detection', desc: 'Identifies duplicate and near-duplicate files across your workspace using content fingerprinting. Catches exact copies, renamed files, and files with minor modifications. Helps reduce storage waste and version confusion.' },
      ]}
      troubleshooting={[
        { issue: 'File upload fails or hangs at a percentage', solution: 'Large files (over 100MB) use chunked upload which may fail on unstable connections. Switch to a wired connection or use the desktop sync client which supports automatic retry and resume. Check that you have not exceeded your storage quota in Settings > Storage. Verify your firewall is not blocking upload requests.' },
        { issue: 'Search not finding a recently uploaded file', solution: 'Content indexing takes 1-5 minutes after upload depending on file size and type. OCR processing for scanned documents may take up to 15 minutes. Check the file detail page for indexing status. If the file shows "Indexed" but search still fails, try different search terms or check that you have access to the folder containing the file.' },
        { issue: 'Desktop sync client not syncing', solution: 'Check the sync client status icon in your system tray. A red icon indicates an error — click for details. Common issues: expired authentication (re-login in the sync client), full local disk, or a file locked by another application. The sync log (accessible from client settings) shows detailed error messages for each failed file.' },
        { issue: 'Cannot preview a specific file type', solution: 'The preview engine supports over 200 formats, but some proprietary or uncommon formats may not render. Check the supported formats list in Settings > Preview. For unsupported formats, the platform offers a download option. If a normally-supported format fails to preview, the file may be corrupted — try re-uploading.' },
      ]}
      faq={[
        { q: 'How much storage is included with each plan?', a: 'Starter includes 100GB, Professional includes 1TB, and Enterprise includes 10TB with the option to add more. Storage is shared across all workspace members. File versions count toward storage — configure version retention policies to manage usage. The storage dashboard shows usage breakdown by folder, user, and file type.' },
        { q: 'Can I migrate from Google Drive or Dropbox?', a: 'Yes. The Migration Tool in Settings > Import supports direct migration from Google Drive, Dropbox, OneDrive, and Box. It preserves folder structure, sharing permissions (where possible), and version history. Large migrations are processed in the background with progress notifications.' },
        { q: 'Is Document Manager compliant with SOC 2 and HIPAA?', a: 'The Enterprise plan includes SOC 2 Type II compliance with annual audits. HIPAA compliance is available as an add-on with BAA signing, enhanced audit logging, and data residency controls. All plans include AES-256 encryption at rest and TLS 1.3 in transit.' },
        { q: 'Can I restrict where my data is stored geographically?', a: 'Enterprise plans support data residency controls. Choose from US, EU, or APAC storage regions. All file data, metadata, and backups are stored exclusively in the selected region. This satisfies GDPR, data sovereignty, and government data handling requirements.' },
        { q: 'What happens if I accidentally delete an important file?', a: 'Deleted files go to Trash and are recoverable for 30 days by default (configurable up to 365 days on Professional and Enterprise plans). Restoring a file recovers all versions, tags, and permissions. Permanent deletion requires admin confirmation and a 24-hour grace period before data is actually purged.' },
      ]}
    />
  )
}
