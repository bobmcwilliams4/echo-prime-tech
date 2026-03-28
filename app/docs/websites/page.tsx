'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Website Builder',
  tagline: 'AI-powered website creation with templates, hosting, and one-click deployment.',
  accent: '#06b6d4',
  productUrl: '/websites',
  workerUrl: 'https://echo-website-builder-ai.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Website Builder is an AI-powered platform for creating, hosting, and deploying professional websites without writing a single line of code. Powered by Cloudflare Workers and R2 for global edge delivery, your sites load in under 1 second from 300+ data centers worldwide. From single-page landing pages to full multi-page business sites, the builder handles everything from design to deployment.',
    'The AI page generator transforms natural language descriptions into complete, responsive web pages with optimized layouts, professional typography, and clean semantic HTML. Choose from a curated template library of 50+ designs across industries including business, e-commerce, portfolio, restaurant, real estate, and SaaS, or let the AI create a custom design from your brand guidelines.',
    'Once built, sites deploy to production with a single click. Custom domain configuration is automated with DNS validation and free SSL certificates provisioned via Cloudflare. Built-in analytics track visitor counts, page views, bounce rates, and conversion events. The integrated form builder and CMS give you everything needed to run a complete web presence from one platform.',
  ],
  gettingStarted: [
    { step: 1, title: 'Start a New Site', desc: 'Navigate to Website Builder and click Create Site. Enter your site name, choose a template or select AI Generate, and provide your business details including industry, brand colors, and key messaging.' },
    { step: 2, title: 'Customize Your Pages', desc: 'The visual editor opens with your template or AI-generated design. Drag and drop sections to reorder, click any text to edit inline, swap images from the media library, and adjust colors from the style panel. Changes preview in real time.' },
    { step: 3, title: 'Add More Pages', desc: 'Click Add Page to create additional pages like About, Services, Contact, and Blog. Each page can use a different layout template. The navigation menu updates automatically to include all published pages.' },
    { step: 4, title: 'Configure Your Domain', desc: 'Go to Settings > Domain to connect a custom domain. Enter your domain name and the builder provides DNS records to add at your registrar. SSL certificates are provisioned automatically once DNS propagates, typically within 5 minutes.' },
    { step: 5, title: 'Publish Your Site', desc: 'Click Publish to deploy your site to the global edge network. The build process takes under 10 seconds. Your site is immediately live at your custom domain or the default subdomain (yoursite.echo-ept.com). Future edits go live instantly on publish.' },
  ],
  features: [
    { title: 'AI Page Generation', desc: 'Describe what you want in plain English and the AI generates a complete page with hero section, feature grid, testimonials, pricing table, call-to-action, and footer. The generated design follows modern web standards with responsive layouts and accessible markup.' },
    { title: 'Template Library', desc: '50+ professionally designed templates covering business, portfolio, e-commerce, restaurant, real estate, SaaS, agency, non-profit, and personal blog categories. Each template is fully responsive and optimized for Core Web Vitals performance scores.' },
    { title: 'Drag-and-Drop Editor', desc: 'The visual editor supports drag-and-drop section reordering, inline text editing, image swaps, and style adjustments. A library of 40+ section types includes heroes, feature grids, testimonials, pricing tables, team profiles, FAQ accordions, and contact forms.' },
    { title: 'Responsive Design', desc: 'All pages are automatically responsive across desktop, tablet, and mobile breakpoints. Preview your site at each breakpoint in the editor. The responsive engine adjusts typography, spacing, and layout grid columns to ensure readability on every screen size.' },
    { title: 'SEO Optimization', desc: 'Built-in SEO tools generate meta titles, descriptions, and Open Graph tags for every page. The AI analyzes your content and suggests keyword optimizations. Automatic sitemap.xml and robots.txt generation ensures search engines can crawl and index your site efficiently.' },
    { title: 'Custom Domains & SSL', desc: 'Connect any custom domain with automated DNS configuration guidance. Free SSL certificates are provisioned and renewed automatically via Cloudflare. Supports apex domains, subdomains, and wildcard domains for enterprise configurations.' },
    { title: 'Analytics Integration', desc: 'Built-in analytics track page views, unique visitors, bounce rate, average session duration, and top referral sources. The dashboard shows real-time and historical data with 30, 60, and 90-day trend charts. No third-party scripts required.' },
    { title: 'Form Builder', desc: 'Add contact forms, lead capture forms, and survey forms to any page. Form submissions are stored in the built-in CMS and can trigger Echo Workflow automations. Fields support text, email, phone, dropdown, checkbox, and file upload types with validation.' },
    { title: 'Content Management System', desc: 'The built-in CMS manages blog posts, product listings, team members, and any custom content type. Content is stored in D1 with R2 media storage. The CMS supports draft/publish workflows, scheduled publishing, and role-based access control.' },
    { title: 'Image Optimization', desc: 'Uploaded images are automatically resized, compressed, and converted to WebP format for optimal loading performance. The CDN serves appropriately sized images based on the visitor\'s device resolution. Original files are preserved in R2 for future re-processing.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/sites/create', desc: 'Create a new website project. Body accepts name, template_id (optional), industry, brand_colors, and description. Returns the site record with unique ID, editor URL, and default subdomain.', auth: true },
    { method: 'GET', path: '/sites/:id', desc: 'Retrieve full site details including all pages, settings, domain configuration, and analytics summary. Returns the site object with nested page array, each containing sections, SEO metadata, and publish status.', auth: true },
    { method: 'POST', path: '/pages/generate', desc: 'Generate a page using AI. Body accepts site_id, page_type (landing, about, services, contact, blog), prompt (natural language description), and style preferences. Returns the generated page with sections and content ready for editing.', auth: true },
    { method: 'POST', path: '/deploy', desc: 'Deploy the site to production. Body accepts site_id and optional target (production or staging). The build process optimizes assets, generates sitemaps, and pushes to the global CDN. Returns deployment status with live URL.', auth: true },
    { method: 'GET', path: '/templates', desc: 'List all available website templates. Returns template metadata including name, category, industry, preview image URL, and feature list. Supports filtering by category and industry.', auth: false },
    { method: 'PUT', path: '/domains/configure', desc: 'Configure a custom domain for a site. Body accepts site_id, domain name, and optional subdomain. Returns required DNS records (CNAME or A records) and SSL provisioning status. Polls until DNS propagation is confirmed.', auth: true },
  ],
  userGuide: [
    {
      title: 'Using the Visual Editor',
      id: 'visual-editor',
      content: [
        'The visual editor is the primary tool for building and customizing your website. It opens in a split view with the section library on the left, the live preview in the center, and the style panel on the right. Toggle between Desktop, Tablet, and Mobile preview modes using the device buttons in the top toolbar.',
        'To add content, drag sections from the library onto the canvas. Available section types include Hero Banner, Feature Grid, Testimonial Carousel, Pricing Table, Team Profiles, Image Gallery, FAQ Accordion, CTA Banner, Statistics Counter, Timeline, Logo Bar, and Contact Form. Each section has configurable options for layout, spacing, and content.',
        'Click any text element on the canvas to edit it inline. The floating toolbar provides formatting options including bold, italic, links, lists, and heading levels. For images, click to open the media picker where you can upload new images or choose from previously uploaded assets.',
        'The style panel on the right controls global design settings including brand colors, font families, spacing scale, and border radius. Changes apply instantly across all pages for consistent branding. Override global styles on individual sections using the section-level style options.',
      ],
    },
    {
      title: 'Managing Content and Blog',
      id: 'content-management',
      content: [
        'The CMS section is accessible from the site dashboard under Content. Create content types for blog posts, products, team members, or any custom structure. Each content type has configurable fields including text, rich text, image, date, number, boolean, and relation fields.',
        'Blog posts support rich text editing with embedded images, code blocks, and video embeds. Posts can be saved as drafts, scheduled for future publication, or published immediately. The blog listing page is generated automatically with pagination, category filtering, and search.',
        'Form submissions from your website are collected in the CMS under Responses. Each form has its own submission list with columns matching the form fields. Export submissions as CSV or connect them to Echo Workflows for automated processing like lead routing or notification emails.',
        'Media management is centralized in the Media Library. All images, documents, and files uploaded through the editor or CMS are stored here with automatic organization by upload date. The library supports folders, tags, and search for easy asset management across multiple pages.',
      ],
    },
    {
      title: 'Domain Setup and Deployment',
      id: 'deployment',
      content: [
        'Every site gets a free subdomain at yoursite.echo-ept.com that is immediately active after your first publish. To use a custom domain, navigate to Settings > Domain and enter your domain name. The system generates the required DNS records (typically a CNAME record pointing to echo-ept.com).',
        'Add the DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.). DNS propagation usually completes within 5 minutes but can take up to 48 hours in rare cases. The dashboard shows real-time propagation status. Once confirmed, your SSL certificate is provisioned automatically.',
        'Deployment is a single-click operation. Click Publish in the editor or site dashboard. The build pipeline minifies HTML/CSS/JS, optimizes images, generates sitemap.xml and robots.txt, and pushes all assets to the global CDN. Build times are typically under 10 seconds. Rollback to any previous deployment is available from the Deployments tab.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Full Page Generation from Prompts', desc: 'Provide a natural language description like "Create a landing page for a dog grooming business in Austin, TX with booking capabilities and customer testimonials" and the AI generates a complete, publish-ready page with appropriate sections, copy, color scheme, and imagery suggestions tailored to the industry.' },
    { capability: 'Smart Content Writing', desc: 'The AI writes professional copy for any section based on your business details. Provide your industry, value proposition, and target audience, and it generates headlines, body text, CTAs, and meta descriptions optimized for both readability and SEO. Supports tone adjustment from formal corporate to friendly casual.' },
    { capability: 'Automated SEO Optimization', desc: 'AI analyzes each page and generates optimized meta titles (under 60 characters), meta descriptions (under 160 characters), Open Graph tags for social sharing, and structured data markup (JSON-LD). It also suggests content improvements to target specific keywords and improve search ranking potential.' },
    { capability: 'Design Style Transfer', desc: 'Upload a screenshot or provide a URL of a website you admire, and the AI extracts the design language including color palette, typography choices, spacing ratios, and layout patterns. It then applies those design principles to your site while maintaining originality and your brand identity.' },
  ],
  troubleshooting: [
    { issue: 'Custom domain shows SSL certificate error', solution: 'The SSL certificate takes 1-5 minutes to provision after DNS propagation is confirmed. If the error persists after 15 minutes, verify your DNS records match exactly what the domain settings panel specifies. Ensure you do not have conflicting A records or CAA records that block Cloudflare from issuing certificates.' },
    { issue: 'Published site shows old content', solution: 'Your browser may be serving a cached version. Hard refresh with Ctrl+Shift+R (or Cmd+Shift+R on Mac) to bypass the cache. If the issue persists, check the Deployments tab to confirm the latest publish completed successfully. CDN cache purges automatically on each deploy but may take up to 60 seconds to propagate globally.' },
    { issue: 'AI-generated page does not match my description', solution: 'Try providing more specific details in your prompt including industry, target audience, desired sections, and tone of voice. The AI performs best with concrete descriptions rather than abstract ones. You can also generate multiple variations and pick the best one, then customize it in the editor.' },
    { issue: 'Form submissions not appearing in CMS', solution: 'Verify the form is connected to your site by checking the form ID in the section settings. Ensure the site has been published after adding the form, as draft forms do not accept submissions. Check the Responses tab in CMS for the specific form. If still empty, test the form yourself and check the browser console for JavaScript errors.' },
  ],
  faq: [
    { q: 'How many websites can I create?', a: 'Free plans include 1 website with up to 5 pages. Pro plans support 10 websites with unlimited pages each. Enterprise plans have no limits on sites or pages. All plans include the AI page generator, template library, and built-in analytics.' },
    { q: 'Can I export my website code?', a: 'Yes. Export your site as a static HTML/CSS/JS bundle from Settings > Export. The exported code is clean, semantic, and self-contained with no dependencies on the Echo platform. This ensures you are never locked in.' },
    { q: 'Does the Website Builder support e-commerce?', a: 'Yes. E-commerce templates include product listing pages, shopping cart, and checkout flow. Payment processing integrates with Echo Payments (Stripe-powered). Product management is handled through the built-in CMS with inventory tracking, variant support, and order management.' },
    { q: 'What is the uptime guarantee?', a: 'Sites are hosted on Cloudflare\'s global network with a 99.99% uptime SLA. Static assets are cached at 300+ edge locations worldwide. If the origin Worker experiences an issue, cached content continues to serve. Historical uptime data is available on the Echo Status Page.' },
    { q: 'Can I add custom JavaScript or third-party scripts?', a: 'Yes. The Custom Code section in Settings lets you add custom JavaScript, CSS, and HTML to the head or body of your pages. Common uses include adding Google Analytics, Facebook Pixel, live chat widgets, and custom interactive elements. Scripts are injected at build time for optimal performance.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }
