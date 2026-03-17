'use client';

/* ── Website Builder Tutorial Data ── */

export interface TutorialStep {
  title: string;
  callout: string;
  target?: string;
  exampleValue?: string;
  illustrationType:
    | 'dashboard'
    | 'form'
    | 'table'
    | 'flow'
    | 'chart'
    | 'modal'
    | 'settings'
    | 'live';
  illustrationConfig: Record<string, unknown>;
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

/* ────────────────────────────────────────────────────────────────── */
/*  11 TUTORIALS — 16 BUILDER FEATURES COVERED                      */
/* ────────────────────────────────────────────────────────────────── */

export const TUTORIALS: Tutorial[] = [
  /* ── 1. Welcome / Overview ── */
  {
    id: 'welcome',
    title: 'Welcome to the Builder',
    subtitle: 'Understand the layout and core concepts of the Echo Prime Website Builder.',
    route: '/websites/builder',
    icon: '\u{1F680}',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Builder Layout Overview',
        callout:
          'The builder is divided into three regions: the left sidebar (tools & content), the top bar (actions & device preview), and the central canvas (your live website).',
        illustrationType: 'dashboard',
        illustrationConfig: {
          panels: [
            { label: 'Sidebar', value: '6 tabs', trend: 'up' },
            { label: 'Top Bar', value: 'Actions', trend: 'up' },
            { label: 'Canvas', value: 'GrapeJS', trend: 'up' },
          ],
        },
      },
      {
        title: 'The Sidebar Tabs',
        callout:
          'Six tabs give you access to every tool: Echo Prime (AI), Sections (pre-built blocks), Templates (full pages), Assets (images), Pages (multi-page), and Settings (site-wide config).',
        target: 'sidebar-tabs',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Tab', 'Purpose'],
          rows: [
            ['Echo Prime', 'AI-powered generation'],
            ['Sections', '17 block categories'],
            ['Templates', '20 industry templates'],
            ['Assets', 'Image upload & manage'],
            ['Pages', 'Multi-page management'],
            ['Settings', 'Colors, fonts, radius'],
          ],
        },
      },
      {
        title: 'The Top Bar',
        callout:
          'The top bar houses Undo / Redo, device preview toggles (Desktop, Tablet, Mobile), Clear Canvas, Export HTML, and the Publish button.',
        target: 'top-bar',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Undo/Redo', 'Device Toggle', 'Clear', 'Export', 'Publish'],
        },
      },
    ],
  },

  /* ── 2. AI Chat — Ask Echo Prime ── */
  {
    id: 'ai-chat',
    title: 'AI Website Generation',
    subtitle: 'Use Echo Prime AI to generate entire pages or sections from a text description.',
    route: '/websites/builder',
    icon: '\u2728',
    estimatedMinutes: 4,
    steps: [
      {
        title: 'Open the AI Tab',
        callout:
          'Click the "Echo Prime" tab (first tab) in the sidebar to open the AI chat panel. This is your AI co-builder.',
        target: 'sidebar-ai-tab',
        illustrationType: 'dashboard',
        illustrationConfig: {
          panels: [
            { label: 'AI Tab', value: 'Active', trend: 'up' },
            { label: 'Model', value: 'Echo Chat', trend: 'up' },
          ],
        },
      },
      {
        title: 'Describe What You Want',
        callout:
          'Type a description like "Build a modern SaaS landing page with hero, features grid, pricing table, and footer" and press Send. The AI will generate full HTML.',
        exampleValue: 'Build a modern SaaS landing page with hero, features, pricing, and footer',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Your Prompt', type: 'textarea', placeholder: 'Describe your website...' },
            { label: 'Send', type: 'button' },
          ],
        },
      },
      {
        title: 'Streaming Response',
        callout:
          'Echo Prime streams its response in real-time using Server-Sent Events (SSE). You will see the AI thinking indicator while it generates your page.',
        illustrationType: 'live',
        illustrationConfig: {
          status: 'active',
          label: 'AI Generating...',
          metrics: [
            { label: 'Streaming', value: 'SSE' },
            { label: 'Timeout', value: '30s' },
          ],
        },
      },
      {
        title: 'Apply to Canvas',
        callout:
          'Once the AI responds with HTML, click "Apply to Canvas" to replace the current page content, or "Insert Section" to add it below existing content.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'AI Response Ready',
          buttons: ['Apply to Canvas', 'Insert Section'],
        },
      },
      {
        title: 'Quick Actions',
        callout:
          'Use the four quick-action chips above the chat for common requests: "Landing Page", "About Us", "Contact Form", or "Pricing Table". These send pre-written prompts instantly.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Landing Page', 'About Us', 'Contact Form', 'Pricing Table'],
        },
      },
      {
        title: 'Iterate with AI',
        callout:
          'Continue the conversation to refine. Ask "Make the hero bigger" or "Add a testimonials section below the features grid". The AI remembers the context of your session.',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Follow-up', type: 'textarea', placeholder: 'Make the hero section taller and add a gradient...' },
          ],
        },
      },
    ],
  },

  /* ── 3. Templates ── */
  {
    id: 'templates',
    title: 'Industry Templates',
    subtitle: 'Start from one of 20 professionally designed templates across 6 categories.',
    route: '/websites/builder',
    icon: '\u2B1A',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Open the Templates Tab',
        callout:
          'Click the "Templates" tab in the sidebar. You will see a searchable gallery of 20 industry templates organized into 6 categories.',
        target: 'sidebar-templates-tab',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Category', 'Templates'],
          rows: [
            ['Business', 'SaaS, Consulting, Agency'],
            ['Creative', 'Portfolio, Photography'],
            ['Commerce', 'E-commerce, Restaurant'],
            ['Professional', 'Law Firm, Medical, Real Estate'],
            ['Technology', 'Startup, AI/ML, Developer'],
            ['Community', 'Nonprofit, Education, Church'],
          ],
        },
      },
      {
        title: 'Preview & Apply',
        callout:
          'Click any template card to preview its design. The template will replace the current canvas with a complete, multi-section page including nav, hero, features, and footer.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Apply Template?',
          body: 'This will replace your current canvas content.',
          buttons: ['Cancel', 'Apply'],
        },
      },
      {
        title: 'Customize After Applying',
        callout:
          'Once a template is applied, every element is fully editable on the canvas. Click any text to edit inline, drag sections to reorder, and change colors in Settings.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Choose Template', 'Apply', 'Edit Text', 'Change Colors', 'Publish'],
        },
      },
    ],
  },

  /* ── 4. Sections & Blocks ── */
  {
    id: 'sections',
    title: 'Sections & Blocks',
    subtitle: 'Browse and add pre-built sections from 17 categories to compose your page.',
    route: '/websites/builder',
    icon: '\u25A6',
    estimatedMinutes: 4,
    steps: [
      {
        title: 'Open the Sections Tab',
        callout:
          'Click the "Sections" tab in the sidebar. You will see 17 categories of pre-designed blocks that can be added to your canvas.',
        target: 'sidebar-sections-tab',
        illustrationType: 'chart',
        illustrationConfig: {
          type: 'bar',
          label: 'Section Categories',
          items: [
            { label: 'Hero', value: 95 },
            { label: 'Features', value: 88 },
            { label: 'Pricing', value: 82 },
            { label: 'CTA', value: 78 },
            { label: 'Footer', value: 75 },
          ],
        },
      },
      {
        title: 'Search & Filter',
        callout:
          'Use the search bar at the top of the Sections panel to filter by keyword. Type "pricing" to find pricing tables, or "hero" for hero banners.',
        exampleValue: 'pricing',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Search sections...', type: 'text', placeholder: 'e.g. hero, pricing, footer' },
          ],
        },
      },
      {
        title: 'Browse Categories',
        callout:
          'All 17 categories: Navigation, Hero, Features, About, Services, Pricing, Testimonials, Team, Portfolio, Blog, Contact, CTA, Stats, FAQ, Logos, Newsletter, and Footer.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['#', 'Category'],
          rows: [
            ['1-5', 'Navigation, Hero, Features, About, Services'],
            ['6-10', 'Pricing, Testimonials, Team, Portfolio, Blog'],
            ['11-15', 'Contact, CTA, Stats, FAQ, Logos'],
            ['16-17', 'Newsletter, Footer'],
          ],
        },
      },
      {
        title: 'Insert a Section',
        callout:
          'Click any section card to insert it at the bottom of your canvas. The section HTML is injected into GrapeJS and becomes fully editable — you can change text, images, colors, and layout.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Browse', 'Click Section', 'Inserted on Canvas', 'Edit Inline'],
        },
      },
      {
        title: 'GrapeJS Built-in Blocks',
        callout:
          'In addition to 17 section categories, GrapeJS provides 20+ drag-and-drop blocks in its built-in block manager (columns, text, images, videos, maps, forms, and more).',
        illustrationType: 'dashboard',
        illustrationConfig: {
          panels: [
            { label: 'Echo Sections', value: '17 cats', trend: 'up' },
            { label: 'GrapeJS Blocks', value: '20+', trend: 'up' },
          ],
        },
      },
    ],
  },

  /* ── 5. Code Editor ── */
  {
    id: 'code-editor',
    title: 'Code Editor',
    subtitle: 'View and edit the raw HTML of your page directly in a split-pane code editor.',
    route: '/websites/builder',
    icon: '\u{1F4BB}',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Toggle Code View',
        callout:
          'Click the "< / >" code icon button in the top bar to toggle the code editor panel. It opens as a split view alongside the visual canvas.',
        target: 'code-toggle-btn',
        illustrationType: 'dashboard',
        illustrationConfig: {
          panels: [
            { label: 'Visual Canvas', value: '50%', trend: 'up' },
            { label: 'Code Editor', value: '50%', trend: 'up' },
          ],
        },
      },
      {
        title: 'Edit HTML Directly',
        callout:
          'The code editor shows the full HTML of your current page. Edits here update the canvas in real-time. Use this for fine-tuning CSS, adding custom scripts, or pasting external HTML.',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'HTML Editor', type: 'textarea', placeholder: '<div class="hero">...</div>' },
            { label: 'Apply Changes', type: 'button' },
          ],
        },
      },
      {
        title: 'Sync Between Views',
        callout:
          'Changes flow both ways: editing on the canvas updates the code view, and editing code updates the canvas. The two views are always in sync.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Edit Canvas', '\u2194', 'Edit Code', '\u2194', 'Both in Sync'],
        },
      },
    ],
  },

  /* ── 6. Multi-Page Management ── */
  {
    id: 'pages',
    title: 'Multi-Page Sites',
    subtitle: 'Create, rename, switch between, and manage multiple pages for your website.',
    route: '/websites/builder',
    icon: '\u{1F4C4}',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Open the Pages Tab',
        callout:
          'Click the "Pages" tab in the sidebar to see your page list. Every project starts with a "Home" page. You can add as many pages as you need.',
        target: 'sidebar-pages-tab',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Page', 'Status'],
          rows: [
            ['Home', 'Active \u2713'],
            ['About', 'Saved'],
            ['Contact', 'Saved'],
            ['Pricing', 'Saved'],
          ],
        },
      },
      {
        title: 'Add a New Page',
        callout:
          'Click the "+ New Page" button at the top. Enter a name (e.g., "About", "Pricing", "Contact"). The new page starts with a blank canvas.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'New Page',
          body: 'Enter a name for your new page.',
          buttons: ['Cancel', 'Create'],
        },
      },
      {
        title: 'Switch Between Pages',
        callout:
          'Click any page in the list to switch to it. Your current page is auto-saved before switching. The canvas loads the selected page content.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Auto-save Current', 'Switch Page', 'Canvas Updates'],
        },
      },
      {
        title: 'Rename & Delete Pages',
        callout:
          'Click the pencil icon to rename a page, or the trash icon to delete it. The "Home" page cannot be deleted — every site needs at least one page.',
        illustrationType: 'settings',
        illustrationConfig: {
          sections: [
            {
              title: 'Page Actions',
              items: [
                { label: 'Rename', value: 'Pencil icon' },
                { label: 'Delete', value: 'Trash icon' },
                { label: 'Duplicate', value: 'Copy icon' },
              ],
            },
          ],
        },
      },
    ],
  },

  /* ── 7. Site Settings ── */
  {
    id: 'settings',
    title: 'Site Settings',
    subtitle: 'Configure your site title, description, color palette, fonts, and border radius.',
    route: '/websites/builder',
    icon: '\u2699',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Open Settings Tab',
        callout:
          'Click the "Settings" tab (gear icon) in the sidebar. This controls global site properties that apply across all pages.',
        target: 'sidebar-settings-tab',
        illustrationType: 'settings',
        illustrationConfig: {
          sections: [
            {
              title: 'General',
              items: [
                { label: 'Site Title', value: 'My Website' },
                { label: 'Description', value: 'A modern website...' },
              ],
            },
          ],
        },
      },
      {
        title: 'Color Palette',
        callout:
          'Choose from pre-built color themes (Ocean, Forest, Sunset, Midnight, Rose, etc.) or set custom primary and accent colors using the color pickers. Colors apply to headings, buttons, and links.',
        illustrationType: 'chart',
        illustrationConfig: {
          type: 'bar',
          label: 'Color Themes',
          items: [
            { label: 'Ocean', value: 90 },
            { label: 'Forest', value: 80 },
            { label: 'Sunset', value: 75 },
            { label: 'Midnight', value: 85 },
            { label: 'Rose', value: 70 },
          ],
        },
      },
      {
        title: 'Typography',
        callout:
          'Select a font family for headings and body text. Options include Inter, Poppins, Montserrat, Roboto, Lato, Open Sans, Playfair Display, and more. Changes apply instantly across the canvas.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Category', 'Options'],
          rows: [
            ['Sans-serif', 'Inter, Poppins, Montserrat, Roboto, Lato'],
            ['Serif', 'Playfair Display, Merriweather, Lora'],
            ['Monospace', 'JetBrains Mono, Fira Code'],
          ],
        },
      },
      {
        title: 'Border Radius',
        callout:
          'Adjust the global border radius (0px to 24px) to control the roundness of all buttons, cards, and sections. A value of 0 gives sharp corners; 16-24 gives soft, rounded UI.',
        exampleValue: '12px',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Border Radius', type: 'range', placeholder: '0 — 24px' },
          ],
        },
      },
    ],
  },

  /* ── 8. Asset Manager ── */
  {
    id: 'assets',
    title: 'Image Assets',
    subtitle: 'Upload, manage, and insert images into your website design.',
    route: '/websites/builder',
    icon: '\u{1F5BC}',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'Open the Assets Tab',
        callout:
          'Click the "Assets" tab in the sidebar. This is your image library for the current project. Images are stored in your browser\'s localStorage.',
        target: 'sidebar-assets-tab',
        illustrationType: 'dashboard',
        illustrationConfig: {
          panels: [
            { label: 'Formats', value: 'PNG JPG GIF WebP SVG', trend: 'up' },
            { label: 'Max Size', value: '5 MB', trend: 'up' },
          ],
        },
      },
      {
        title: 'Upload Images',
        callout:
          'Drag and drop images onto the upload zone, or click it to browse your files. Accepted formats: PNG, JPEG, GIF, WebP, and SVG. Maximum 5 MB per file.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Upload Images',
          body: 'Drag & drop files here, or click to browse.',
          buttons: ['Browse Files'],
        },
      },
      {
        title: 'Import from URL',
        callout:
          'Paste an external image URL into the "Import from URL" field at the bottom of the Assets panel and click "Add". The image will be validated and added to your library.',
        exampleValue: 'https://images.unsplash.com/photo-example.jpg',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Image URL', type: 'text', placeholder: 'https://example.com/image.jpg' },
            { label: 'Add', type: 'button' },
          ],
        },
      },
      {
        title: 'Insert on Canvas',
        callout:
          'Click any thumbnail in the grid to select it. Then click "Insert on Canvas" to add the image at the cursor position. You can also drag images directly from the grid onto the canvas.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Select Image', 'Click Insert', 'Image on Canvas', 'Resize & Position'],
        },
      },
    ],
  },

  /* ── 9. Responsive Preview ── */
  {
    id: 'responsive',
    title: 'Responsive Preview',
    subtitle: 'Preview your site on Desktop, Tablet, and Mobile viewports without leaving the builder.',
    route: '/websites/builder',
    icon: '\u{1F4F1}',
    estimatedMinutes: 2,
    steps: [
      {
        title: 'Device Toggle Buttons',
        callout:
          'In the top bar, find the three device buttons: Desktop (full width), Tablet (768px), and Mobile (375px). Click any to instantly resize the canvas.',
        target: 'device-toggle',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Device', 'Width'],
          rows: [
            ['Desktop', 'Full width'],
            ['Tablet', '768 px'],
            ['Mobile', '375 px'],
          ],
        },
      },
      {
        title: 'Check Responsiveness',
        callout:
          'Switch between devices to verify your layout adapts properly. Elements may stack, text may resize, and navigation may collapse based on GrapeJS responsive rules.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Desktop \u2192 Tablet \u2192 Mobile', 'Check layout', 'Fix issues', 'Repeat'],
        },
      },
    ],
  },

  /* ── 10. Publishing & Export ── */
  {
    id: 'publish',
    title: 'Publishing & Export',
    subtitle: 'Publish your website to Vercel, Netlify, or GitHub Pages, or download as a ZIP.',
    route: '/websites/builder',
    icon: '\u{1F310}',
    estimatedMinutes: 4,
    steps: [
      {
        title: 'Click Publish',
        callout:
          'Click the green "Publish" button in the top bar. A modal opens with four deployment options and an export option.',
        target: 'publish-btn',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Publish Your Site',
          body: 'Choose how you want to deploy your website.',
          buttons: ['Vercel', 'Netlify', 'GitHub Pages', 'ZIP Download'],
        },
      },
      {
        title: 'Publish to Vercel',
        callout:
          'Select "Vercel" to deploy your site as a static project on Vercel. You will need a Vercel account. The builder packages all pages into a deployable bundle.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Package HTML', 'Upload to Vercel', 'Get Live URL'],
        },
      },
      {
        title: 'Other Hosting Options',
        callout:
          'Choose Netlify or GitHub Pages for alternative hosting. Each option generates the same static HTML bundle — the only difference is the deployment target.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Platform', 'Free Tier', 'Custom Domain'],
          rows: [
            ['Vercel', 'Yes', 'Yes'],
            ['Netlify', 'Yes', 'Yes'],
            ['GitHub Pages', 'Yes', 'Yes (CNAME)'],
          ],
        },
      },
      {
        title: 'Export as HTML',
        callout:
          'Click the "Export" button in the top bar (or select "ZIP Download" in the Publish modal) to download all pages as a .zip file. Each page becomes a standalone HTML file.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Export All Pages', 'Generate ZIP', 'Download .zip', 'Host Anywhere'],
        },
      },
      {
        title: 'Multi-Page Export',
        callout:
          'When you export, ALL pages are included. Each page gets its own HTML file (home.html, about.html, pricing.html, etc.) plus a shared CSS file extracted from your settings.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['File', 'Content'],
          rows: [
            ['index.html', 'Home page'],
            ['about.html', 'About page'],
            ['pricing.html', 'Pricing page'],
            ['styles.css', 'Shared styles from Settings'],
          ],
        },
      },
    ],
  },

  /* ── 11. Full Workflow ── */
  {
    id: 'full-workflow',
    title: 'Complete Workflow',
    subtitle: 'End-to-end: sign in, create a site from template, customize with AI, and publish.',
    route: '/websites/builder',
    icon: '\u{1F3AF}',
    estimatedMinutes: 6,
    steps: [
      {
        title: 'Step 1 — Sign In',
        callout:
          'The builder requires authentication. If you are not signed in, you will be redirected to /login. Sign in with email/password or Google OAuth.',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Email', type: 'text', placeholder: 'you@example.com' },
            { label: 'Password', type: 'password', placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022' },
            { label: 'Sign In', type: 'button' },
          ],
        },
      },
      {
        title: 'Step 2 — Choose a Starting Point',
        callout:
          'Pick one of three approaches: (A) Start from a template, (B) Ask AI to generate a page, or (C) Build from scratch using sections and blocks.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Template', 'AI Generate', 'From Scratch'],
        },
      },
      {
        title: 'Step 3 — Add Content',
        callout:
          'Add sections from the catalog, edit text by clicking directly on the canvas, upload images via the Assets tab, and use the AI to generate or refine content.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Add Sections', 'Edit Text', 'Upload Images', 'AI Refine'],
        },
      },
      {
        title: 'Step 4 — Configure Settings',
        callout:
          'Go to the Settings tab to set your site title, choose a color palette, pick fonts, and adjust border radius. These settings apply to all pages.',
        illustrationType: 'settings',
        illustrationConfig: {
          sections: [
            {
              title: 'Quick Config',
              items: [
                { label: 'Title', value: 'My Awesome Site' },
                { label: 'Theme', value: 'Ocean' },
                { label: 'Font', value: 'Inter' },
                { label: 'Radius', value: '12px' },
              ],
            },
          ],
        },
      },
      {
        title: 'Step 5 — Add More Pages',
        callout:
          'Open the Pages tab and create additional pages (About, Contact, Pricing). Switch between them to build out each one. Content is auto-saved every 30 seconds.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Page', 'Sections'],
          rows: [
            ['Home', 'Hero + Features + CTA + Footer'],
            ['About', 'Hero + Team + Story + Footer'],
            ['Pricing', 'Hero + Pricing Table + FAQ + Footer'],
            ['Contact', 'Hero + Form + Map + Footer'],
          ],
        },
      },
      {
        title: 'Step 6 — Preview Responsiveness',
        callout:
          'Use the device toggle in the top bar to check how your site looks on Desktop, Tablet, and Mobile. Make adjustments as needed.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Desktop \u2713', 'Tablet \u2713', 'Mobile \u2713'],
        },
      },
      {
        title: 'Step 7 — Review Code (Optional)',
        callout:
          'Toggle the code editor to review or fine-tune the HTML. This is optional but useful for developers who want to add custom CSS or scripts.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          panels: [
            { label: 'Visual', value: 'WYSIWYG', trend: 'up' },
            { label: 'Code', value: 'HTML/CSS', trend: 'up' },
          ],
        },
      },
      {
        title: 'Step 8 — Undo Mistakes',
        callout:
          'Made a mistake? Use the Undo button (or Ctrl+Z) to reverse your last action. Redo (Ctrl+Shift+Z) brings it back. GrapeJS tracks a full history of changes.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: ['Make Change', 'Undo \u21A9', 'Redo \u21AA', 'Continue'],
        },
      },
      {
        title: 'Step 9 — Publish',
        callout:
          'Click "Publish" in the top bar and choose your hosting platform (Vercel, Netlify, GitHub Pages, or ZIP download). Your multi-page website is packaged and deployed.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Site Published!',
          body: 'Your website is now live at your custom domain.',
          buttons: ['View Live Site'],
        },
      },
      {
        title: 'Step 10 — Iterate',
        callout:
          'Come back anytime to edit your site. Your project auto-saves to localStorage and loads automatically when you return to the builder.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          panels: [
            { label: 'Auto-Save', value: 'Every 30s', trend: 'up' },
            { label: 'Persistence', value: 'localStorage', trend: 'up' },
            { label: 'Re-publish', value: 'Instant', trend: 'up' },
          ],
        },
      },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────── */
/*  QUICK REFERENCE — one-line how-tos                              */
/* ────────────────────────────────────────────────────────────────── */

export const QUICK_REFERENCE = [
  {
    action: 'Generate a full page with AI',
    where: 'Echo Prime tab \u2192 type description \u2192 Send',
    howTo: 'Open the AI tab, describe the page you want, click Send, then "Apply to Canvas".',
  },
  {
    action: 'Apply a template',
    where: 'Templates tab \u2192 click a template card',
    howTo: 'Opens the template gallery. Click any template to replace the canvas content.',
  },
  {
    action: 'Add a section',
    where: 'Sections tab \u2192 search or browse \u2192 click to insert',
    howTo: 'Sections are inserted at the bottom of the canvas. Drag to reorder.',
  },
  {
    action: 'Upload an image',
    where: 'Assets tab \u2192 drag & drop or click upload zone',
    howTo: 'Images are stored in localStorage. Click an image, then "Insert on Canvas".',
  },
  {
    action: 'Switch device preview',
    where: 'Top bar \u2192 Desktop / Tablet / Mobile buttons',
    howTo: 'Instantly resizes the canvas to the selected device width.',
  },
  {
    action: 'Edit the HTML code',
    where: 'Top bar \u2192 Code icon button (&lt;/&gt;)',
    howTo: 'Toggles a split-pane code editor alongside the visual canvas.',
  },
  {
    action: 'Undo / Redo',
    where: 'Top bar \u2192 Undo (\u21A9) / Redo (\u21AA) buttons, or Ctrl+Z / Ctrl+Shift+Z',
    howTo: 'GrapeJS tracks full action history. Unlimited undo/redo.',
  },
  {
    action: 'Manage multiple pages',
    where: 'Pages tab \u2192 + New Page / click to switch / pencil to rename / trash to delete',
    howTo: 'Each page has its own canvas. Current page auto-saves when you switch.',
  },
  {
    action: 'Change colors & fonts',
    where: 'Settings tab \u2192 color theme / font family / border radius',
    howTo: 'Settings apply globally across all pages in the project.',
  },
  {
    action: 'Publish or export',
    where: 'Top bar \u2192 green Publish button (or Export for ZIP)',
    howTo: 'Choose Vercel, Netlify, GitHub Pages, or ZIP download. All pages included.',
  },
  {
    action: 'Auto-save behavior',
    where: 'Automatic — every 30 seconds',
    howTo: 'Your project saves to localStorage automatically. No manual save needed.',
  },
];

/* ────────────────────────────────────────────────────────────────── */
/*  CONTEXT TRIGGERS — auto-open tutorial when user visits a route   */
/* ────────────────────────────────────────────────────────────────── */

export const CONTEXT_TRIGGERS: Record<
  string,
  { tutorialId: string; stepIndex: number }
> = {
  '/websites/builder': { tutorialId: 'welcome', stepIndex: 0 },
};
