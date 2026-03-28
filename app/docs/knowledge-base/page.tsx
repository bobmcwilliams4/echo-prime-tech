'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Knowledge Base',
  tagline: 'Self-service knowledge base platform with nested categories, SEO-optimized articles, full-text search, and AI article generation.',
  accent: '#14b8a6',
  productUrl: '/knowledge-base',
  workerUrl: 'https://echo-knowledge-base.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Knowledge Base is a self-service documentation and support platform that lets product teams publish and maintain structured knowledge for customers, users, and internal teams. Articles are organized in a nested category tree, written in rich text with embedded media, and published with SEO-optimized slugs and meta descriptions. A fast full-text search engine makes every article instantly discoverable regardless of how large your knowledge base grows.',
    'Every article is versioned automatically so you can track how documentation evolves over time, review what changed between versions, and restore a previous version if needed. Helpfulness voting captures direct user feedback — "Was this article helpful?" — per article and version, surfacing articles that need improvement and those that perform exceptionally well. Featured article promotion lets editorial teams curate high-priority content for the knowledge base homepage.',
    'The AI capabilities powered by MKT-01 set Echo Knowledge Base apart from static documentation tools. Article generation produces a complete, structured draft from a topic description in seconds. Article improvement analysis scans existing articles for clarity issues, missing sections, outdated terminology, and SEO gaps, then provides specific rewrite suggestions. Teams ship better documentation faster without sacrificing quality.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Category Structure', desc: 'POST to /categories with a name and null parent_id for top-level categories. Nest sub-categories by passing a parent category ID. Design your hierarchy around how users think — product areas, use cases, or user roles work better than internal team structures.' },
    { step: 2, title: 'Write Your First Article', desc: 'POST to /articles with a title, slug, body (HTML or Markdown), category_id, and optional meta_description for SEO. The article is saved as a draft. Set status to "published" when it is ready for public access.' },
    { step: 3, title: 'Publish to Your Public URL', desc: 'Published articles are immediately accessible at GET /articles/:slug without authentication. This is the endpoint your application and search engines use to render articles. The slug should be descriptive and URL-friendly — for example, "how-to-reset-your-password".' },
    { step: 4, title: 'Enable Helpfulness Voting', desc: 'Add feedback buttons to your article rendering that POST to /articles/:id/feedback with helpful: true or helpful: false. The analytics endpoint aggregates helpfulness scores per article and over time, giving you a data-driven view of documentation quality.' },
    { step: 5, title: 'Feature Key Articles', desc: 'POST to /featured with an article_id and display_order to promote important articles to the knowledge base homepage or documentation landing page. Featured articles surface high-priority content to users before they search.' },
  ],

  features: [
    { title: 'Nested Categories', desc: 'Unlimited-depth category tree organizes your knowledge base into logical sections. Categories have names, slugs, descriptions, and display order. Parent categories aggregate article counts from all nested sub-categories for accurate section statistics.' },
    { title: 'Article Management', desc: 'Rich article editor with HTML and Markdown support. Each article has a title, URL slug, body content, excerpt, meta description for SEO, and status (draft/published/archived). Bulk status changes let editors publish or archive multiple articles at once.' },
    { title: 'SEO Optimization', desc: 'Every article includes a meta_title and meta_description field for search engine optimization. Canonical URLs are generated from slugs. The sitemap endpoint returns all published articles for search engine discovery. Open Graph tags are generated automatically from article metadata.' },
    { title: 'Version History', desc: 'Every article save creates a new version with the full content snapshot, editor identity, and timestamp. View and diff any two versions. Restore a previous version as current in one click. Version history enables safe collaborative editing without fear of losing work.' },
    { title: 'Full-Text Search', desc: 'Fast FTS index across all article titles, body text, and tags. Supports phrase queries, wildcard matching, and relevance ranking. Search results include the article title, excerpt with highlighted match context, category breadcrumb, and helpfulness score.' },
    { title: 'Helpfulness Feedback', desc: 'Per-article thumbs-up/thumbs-down voting captures direct user sentiment. Feedback is timestamped and associated with anonymous or authenticated users. The analytics endpoint surfaces articles sorted by helpfulness ratio for editorial triage.' },
    { title: 'Featured Articles', desc: 'Curate a list of featured articles displayed on the knowledge base landing page or embedded in product UI. Featured articles have a configurable display order and can be time-bounded — automatically de-featured after a set date for seasonal content.' },
    { title: 'Draft Workflow', desc: 'Articles move through draft, review, and published states. Draft articles are visible only to authenticated team members. The review state enables a publishing workflow where writers submit drafts for approval before they go live.' },
    { title: 'Related Articles', desc: 'Tag articles with topic keywords and configure related article links. The system automatically suggests related articles based on tag overlap and content similarity. Related article recommendations reduce search abandonment and improve time-to-resolution.' },
    { title: 'Embed Anywhere', desc: 'Embed the knowledge base search widget in your application UI, help centers, and onboarding flows via a lightweight JavaScript snippet. The embed supports scoping to a specific category, custom branding, and callback hooks for tracking search events.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/categories', desc: 'Create a new category with name, slug, description, parent_id (null for top-level), and display_order. Returns the category ID, full slug path from root, and current article count (zero for new categories).', auth: true },
    { method: 'POST', path: '/articles', desc: 'Create a new article with title, slug, body, excerpt, category_id, meta_description, tags, and status (draft/published). Returns the article ID, version number, and public URL path for published articles.', auth: true },
    { method: 'GET', path: '/articles/:slug', desc: 'Public endpoint — retrieve a published article by slug without authentication. Returns full article content, category breadcrumb, version number, helpfulness ratio, related articles, and structured data for SEO. Used by your frontend and search engines.', auth: false },
    { method: 'POST', path: '/articles/:id/feedback', desc: 'Submit helpfulness feedback for an article. Accepts helpful (boolean) and optional comment. Stores the feedback with timestamp and anonymous session ID. Returns the updated helpfulness ratio for the article.', auth: false },
    { method: 'GET', path: '/search', desc: 'Full-text search across all published articles. Accepts a query string, optional category_id scope, and tag filter. Returns ranked results with title, excerpt with highlighted match, category path, and helpfulness score per result.', auth: false },
    { method: 'GET', path: '/featured', desc: 'Retrieve the ordered list of featured articles with full metadata. Public endpoint used by knowledge base landing pages and embedded help widgets. Returns articles in display_order with title, excerpt, category, and cover image.', auth: false },
    { method: 'GET', path: '/analytics', desc: 'Knowledge base analytics — article view counts, search query frequency, helpfulness ratios per article, zero-result search queries, and category traffic breakdown. Authenticated endpoint for editorial teams.', auth: true },
  ],

  userGuide: [
    {
      title: 'Organizing Your Knowledge Base',
      id: 'organizing',
      content: [
        'A well-organized category structure is the foundation of a usable knowledge base. Design categories around how your users think and search — product areas, use cases, and user roles tend to work better than internal team or technical boundaries. Aim for 3–7 top-level categories with 3–10 articles each before adding sub-categories to avoid overwhelming the navigation.',
        'Category slugs appear in article URLs — for example, articles in the "Getting Started" category might live at /kb/getting-started/:article-slug. Keep category slugs short and stable. Changing a category slug changes all article URLs under it, which breaks existing links and requires SEO redirects. Choose category slugs thoughtfully at the start.',
        'Use the display_order field on both categories and articles to control the presentation order in navigation lists. Display order is a simple integer — lower numbers appear first. Leave gaps between values (e.g. 10, 20, 30) so you can insert items later without renumbering all existing entries.',
      ],
    },
    {
      title: 'Writing Effective Articles',
      id: 'writing-articles',
      content: [
        'Every article should answer a single, specific question. Keep titles in the form "How to [do something]" or "What is [concept]" — question-framing titles match how users search and set accurate expectations for the article content. Avoid vague titles like "Advanced Features" that could apply to dozens of different topics.',
        'Structure articles with a brief one-paragraph summary at the top, step-by-step instructions or explanations in the body, and a "Related Articles" section at the bottom. Code blocks, screenshots, and short videos dramatically improve comprehension for procedural articles. Use the excerpt field for a one-sentence summary that appears in search results and category listings.',
        'Meta descriptions are critical for SEO. Write a 120–160 character meta_description that summarizes the article content naturally while including the primary keyword. Meta descriptions appear in Google search snippets and directly influence click-through rates from search results. The AI article improvement tool will flag missing or ineffective meta descriptions automatically.',
      ],
    },
    {
      title: 'Using Helpfulness Data',
      id: 'helpfulness-data',
      content: [
        'The helpfulness ratio (helpful votes / total votes) is the most direct signal of article quality. Articles with ratios below 60% are candidates for immediate revision — read the optional comments submitted with negative feedback for specific improvement signals. Articles with zero votes for more than 30 days either have no traffic (check search analytics) or are never found (check SEO).',
        'Review helpfulness data in the analytics endpoint filtered by category to identify systemic documentation gaps. If all articles in the "Troubleshooting" category have low helpfulness ratios, the issue may be structural — users are looking for solutions that are not organized under the troubleshooting category, or the articles are too generic to address their specific problems.',
        'Use the zero-result search queries report in /analytics to identify topics users are searching for that have no matching articles. Zero-result queries are direct requests for content that does not exist yet. Prioritize creating articles for the most frequent zero-result searches — these represent the highest-value documentation gaps in your knowledge base.',
      ],
    },
    {
      title: 'Search Optimization',
      id: 'search-optimization',
      content: [
        'The full-text search engine indexes article titles, body text, tags, and excerpts. Titles receive higher weight in relevance scoring than body text, so ensure your article titles contain the primary keywords users search for. Tags let you explicitly associate articles with search terms that might not appear in the body — use tags for synonyms, abbreviations, and alternate phrasings.',
        'Monitor search analytics weekly to understand what users are searching for and whether they are finding it. High-volume searches with low click-through rates indicate the search results are not matching user intent — the articles may exist but their titles or excerpts do not clearly signal relevance. Revise titles and excerpts for those articles to improve click-through.',
        'The GET /search endpoint supports scoping to a specific category_id — use this in embedded help widgets to limit search results to documentation relevant to the current product area. A user in the CRM section of your app benefits from help results scoped to CRM articles rather than results from across the entire knowledge base.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Article Generation', desc: 'MKT-01 generates a complete, structured article draft from a topic description, target audience, and key points to cover. Output includes a title, meta description, full body with headings and step-by-step sections, and suggested tags. Generation takes 15–30 seconds and produces publication-ready drafts with minimal editing.' },
    { capability: 'Article Improvement Analysis', desc: 'Analyzes any existing article for clarity score, reading level, structural completeness, missing sections, SEO gaps (thin meta description, missing keywords), outdated terminology, and broken internal link references. Returns a prioritized list of specific improvements with suggested rewrites for flagged sections.' },
    { capability: 'Search Query Expansion', desc: 'Analyzes the knowledge base article corpus and suggests additional tags and synonym terms for each article to improve search recall. Users searching with alternate terminology or abbreviations will find the relevant article even if the exact terms do not appear in the body text.' },
    { capability: 'Related Article Clustering', desc: 'Uses semantic similarity to group related articles and generate the related article recommendations displayed at the bottom of each article. Semantic clustering catches content relationships that tag-based matching misses — articles about different features that solve the same underlying user problem.' },
  ],

  troubleshooting: [
    { issue: 'Article not appearing in search results after publishing', solution: 'The full-text search index updates asynchronously within 60 seconds of a status change to "published". If the article is still not appearing after 2 minutes, verify the article status field is set to "published" (not "draft") via the GET /articles/:id management endpoint. Check that the article body is not empty — articles with empty body content are indexed but score very low in relevance ranking.' },
    { issue: 'GET /articles/:slug returns 404 for a published article', solution: 'Verify the slug in your GET request exactly matches the slug field stored in the article — slugs are case-sensitive and must match character for character. If you updated the slug after initial creation, the old slug no longer resolves. Check the article management endpoint for the current slug value. Consider setting up a redirect from the old slug to the new one at the application level.' },
    { issue: 'Helpfulness feedback not being recorded', solution: 'POST /articles/:id/feedback is a public endpoint that does not require authentication but does enforce rate limiting — 1 vote per IP per article per 24-hour window. If feedback is submitted but not reflected in analytics, check that the article_id in the request matches the article being displayed. The response includes the updated helpful_count for immediate verification.' },
    { issue: 'Category article counts showing incorrect numbers', solution: 'Category article counts aggregate articles from the category and all nested sub-categories. If counts appear wrong, a common cause is articles in draft status — only published articles are counted. Counts update synchronously on article status changes. If counts are still incorrect after publishing, request a count recalculation via the admin endpoint POST /categories/:id/recount.' },
  ],

  faq: [
    { q: 'Can the knowledge base be embedded in my application?', a: 'Yes. Echo Knowledge Base provides a JavaScript embed snippet that renders an inline search widget in your application UI. The widget accepts a category scope, custom CSS for branding, and callback hooks for tracking search and article view events in your analytics platform. The GET /articles/:slug and GET /search endpoints are public for direct API integration without the embed snippet.' },
    { q: 'How does article versioning work?', a: 'Every save to an article creates a new version with the complete content snapshot, editor identity, and timestamp. The current version is the one returned by GET /articles/:slug. Previous versions are accessible via the version history management endpoint. Restoring a previous version creates a new version that is a copy of the historical version, preserving the complete history.' },
    { q: 'Is the knowledge base content public or private?', a: 'Published articles are publicly accessible via GET /articles/:slug and GET /search without authentication — designed for customer-facing documentation. Draft and archived articles require authentication. If you need a fully private internal knowledge base, configure the access_mode setting to "private" which requires authentication for all endpoints including public article reads.' },
    { q: 'How does AI article generation work?', a: 'MKT-01 is a marketing and content-specialized doctrine block in Engine Runtime. You provide a topic description, target audience (e.g. "new users setting up for the first time"), and 3–5 key points to cover. MKT-01 generates a structured article with title, introduction, step-by-step sections, and a summary. Generation takes 15–30 seconds and produces a full draft, not a template.' },
    { q: 'Can I use custom domains for my knowledge base?', a: 'Echo Knowledge Base serves article content through the API. Your application frontend, which calls the API and renders the articles, can live on any domain you control. Configure your DNS and Cloudflare routing to serve the knowledge base frontend at docs.yourdomain.com or help.yourdomain.com. The Worker URL is the backend API — it is not the public-facing URL of your knowledge base.' },
  ],
}

export default function EchoKnowledgeBaseDocsPage() {
  return <ProductDoc {...data} />
}
