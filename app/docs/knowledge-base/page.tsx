'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Knowledge Base',
  tagline: 'Self-service knowledge base with nested categories, versioned articles, search, and AI generation.',
  accent: '#14b8a6',
  productUrl: '/knowledge-base',
  workerUrl: 'https://echo-knowledge-base.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Knowledge Base is a self-service documentation platform that lets customers find answers without contacting support. Create structured articles with nested categories, version history, and full-text search.',
    'The platform supports public and internal knowledge bases, SEO-optimized slugs, helpfulness feedback, and featured article curation. Every article maintains full version history for tracking changes and reverting.',
    'AI capabilities power article generation, improvement suggestions, and intelligent search ranking via Engine Runtime for domain-specific knowledge across any industry vertical.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Categories', desc: 'Set up your knowledge base structure with nested categories, names, descriptions, and display order.' },
    { step: 2, title: 'Write Articles', desc: 'Create articles with titles, slugs, content, and category assignments using the rich editor.' },
    { step: 3, title: 'Configure SEO', desc: 'Each article gets an SEO-friendly slug and meta description. Feature articles for prominence.' },
    { step: 4, title: 'Enable Feedback', desc: 'Visitors rate articles as helpful or not with optional comments. Track helpfulness rates.' },
    { step: 5, title: 'Monitor Analytics', desc: 'Dashboard shows views, search terms, helpfulness rates, and popular categories.' },
  ],
  features: [
    { title: 'Nested Categories', desc: 'Hierarchical structure with parent/child relationships. Drag-and-drop reordering. Category permissions.' },
    { title: 'Versioned Articles', desc: 'Full version history for every article. Side-by-side comparison. One-click revert.' },
    { title: 'Full-Text Search', desc: 'Multi-term search with relevance ranking. Search suggestions. Failed search tracking for gap analysis.' },
    { title: 'Helpfulness Feedback', desc: 'Yes/No feedback with optional comments. Helpfulness rates per article and per category.' },
    { title: 'Featured Articles', desc: 'Pin important articles to the homepage. Curate for seasonal topics or common issues.' },
    { title: 'SEO Optimized', desc: 'Clean URL slugs, meta descriptions, and structured data. Indexed for organic traffic.' },
    { title: 'Analytics Dashboard', desc: 'Views, search terms, helpfulness rates, popular categories, and trends. Data export.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/categories', desc: 'Create a category with name, description, parent ID, and display order.', auth: true },
    { method: 'POST', path: '/api/articles', desc: 'Create article with title, slug, content, category, and SEO metadata.', auth: true },
    { method: 'GET', path: '/api/articles/:slug', desc: 'Retrieve published article by slug. Public, no auth required.', auth: false },
    { method: 'POST', path: '/api/articles/:id/feedback', desc: 'Submit helpfulness feedback with optional comment.', auth: false },
    { method: 'GET', path: '/api/search', desc: 'Full-text search across published articles with relevance scoring.', auth: false },
    { method: 'GET', path: '/api/featured', desc: 'List featured articles for help center display.', auth: false },
    { method: 'POST', path: '/api/ai/generate', desc: 'AI-generate article from topic description via Engine Runtime.', auth: true },
    { method: 'GET', path: '/api/analytics', desc: 'Views, helpfulness, popular articles, and search analytics.', auth: true },
  ],
  userGuide: [
    { title: 'Writing Articles', id: 'writing', content: ['Write clear, scannable articles with descriptive headings and short paragraphs. Use formatting, code blocks, images, and callout boxes.', 'Set meta descriptions for SEO. Choose readable URL slugs. Assign to specific categories. Feature articles that address top support questions.'] },
    { title: 'Analyzing Gaps', id: 'gaps', content: ['The dashboard shows failed searches representing knowledge gaps your team should address.', 'Low helpfulness ratings indicate articles needing revision. Check comments for specific issues. Use AI improvement suggestions to enhance weak articles.'] },
  ],
  aiCapabilities: [
    { capability: 'Article Generation', desc: 'Generate complete articles from a topic description using Engine Runtime MKT-01 in your brand voice.' },
    { capability: 'Content Improvement', desc: 'AI suggests clearer language, missing steps, better formatting, and SEO optimization for existing articles.' },
    { capability: 'Smart Search', desc: 'Natural language query understanding maps to relevant articles even without exact keyword matches.' },
  ],
  troubleshooting: [
    { issue: 'Article not in search', solution: 'Verify status is published. Search indexes update within 5 minutes. Check content contains the terms.' },
    { issue: 'Category not showing', solution: 'Categories with zero published articles are hidden from public view. Add a published article.' },
    { issue: 'Feedback not recording', solution: 'Rate-limited to 1 per article per IP per 24 hours to prevent abuse.' },
  ],
  faq: [
    { q: 'Internal and public articles?', a: 'Yes. Set visibility per article. Internal requires auth and excludes from public search.' },
    { q: 'How does versioning work?', a: 'Every edit creates a new version. View full history, compare versions, and revert with one click.' },
    { q: 'Can AI write articles?', a: 'Yes. Provide a topic and AI generates a complete article. Review and edit before publishing.' },
    { q: 'Article limits?', a: 'Free plans support 50 articles. Pro plans support unlimited with priority indexing and advanced analytics.' },
  ],
}

export default function EchoKnowledgeBaseDocsPage() {
  return <ProductDoc {...data} />
}
