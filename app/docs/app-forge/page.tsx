'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo App Forge',
  tagline: 'Describe your app, we build it. Desktop, web, mobile, CLI — 16-stage AI pipeline with multi-LLM competitive generation.',
  accent: '#8b5cf6',
  productUrl: '/app-forge',
  workerUrl: 'echo-app-forge.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo App Forge turns natural language descriptions into production-ready applications. Describe what you want and the 16-stage AI pipeline handles requirements analysis, architecture design, component planning, code generation, testing, optimization, packaging, and deployment — all automated.',
    'Unlike single-prompt generators like Bolt.new or Lovable, App Forge supports six app archetypes: Electron desktop apps, Next.js web apps, React Native mobile, CLI tools, Chrome extensions, and MCP servers. Multiple LLMs compete on each build stage, and the best output wins.',
    'All generated code is clean, well-documented TypeScript with no lock-in. Export to GitHub with one click, modify in your editor, or refine through the chat interface. Every build iteration is versioned so you can roll back, compare, or branch from any point.',
  ],
  gettingStarted: [
    { step: 1, title: 'Sign Up', desc: 'Create an account at echo-ept.com and select an App Forge plan. All plans include a free trial period to test the full pipeline.' },
    { step: 2, title: 'Choose an Archetype', desc: 'Select from six app types: Electron desktop, Next.js web, React Native mobile, CLI tool, Chrome extension, or MCP server. Each has specialized templates and build pipelines.' },
    { step: 3, title: 'Describe Your App', desc: 'Write a natural language description of what your app should do. Be specific about features, user flows, and integrations. The more detail, the better the first build.' },
    { step: 4, title: 'Review & Refine', desc: 'Watch the 16-stage pipeline generate your app in real-time with live preview. Chat with the AI to describe changes — it updates the code as you type.' },
    { step: 5, title: 'Export & Deploy', desc: 'One-click export to GitHub with proper project structure, README, CI/CD config, and deployment settings. Deploy to Vercel, Cloudflare Pages, or as an Electron build.' },
  ],
  features: [
    { title: '6 App Archetypes', desc: 'Electron desktop, Next.js web, React Native mobile, CLI tools, Chrome extensions, and MCP servers — all from a single natural language prompt.' },
    { title: '16-Stage Pipeline', desc: 'From requirements to deployment in 16 automated stages. Each stage produces clean, tested, production-ready output reviewed by AI quality gates.' },
    { title: 'Multi-LLM Competition', desc: 'Multiple AI models compete on each build stage. The best code wins — you get output from the strongest model for each specific task, not just one provider.' },
    { title: 'Full Stack Generation', desc: 'Frontend, backend, database schema, API routes, and auth — complete applications, not just UI components. Real full-stack apps from a single prompt.' },
    { title: 'Iterative Refinement', desc: 'Chat with your app — describe changes in natural language and the AI updates the code in real-time. No need to touch code unless you want to.' },
    { title: 'Live Preview', desc: 'See your app running in real-time as it builds. Make changes and watch updates instantly in the preview window.' },
    { title: 'GitHub Export', desc: 'One-click export to a GitHub repository with proper project structure, README, CI/CD configuration, and deployment config.' },
    { title: 'Template Library', desc: 'Start from proven templates for common app types — SaaS dashboards, landing pages, mobile apps, developer tools, and more.' },
    { title: 'Custom Components', desc: 'Save generated components to your personal library for reuse across projects. Build faster with each iteration.' },
    { title: 'Version History', desc: 'Every build iteration is versioned. Roll back, compare, or branch from any point in your app\'s history.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/builds', desc: 'Start a new build with archetype, description, and optional template selection.', auth: true },
    { method: 'GET', path: '/builds/:id', desc: 'Get build status, current stage progress, and preview URL.', auth: true },
    { method: 'POST', path: '/builds/:id/refine', desc: 'Send a refinement message to update the current build via natural language.', auth: true },
    { method: 'GET', path: '/builds/:id/artifacts', desc: 'Download generated source code, assets, and configuration files.', auth: true },
    { method: 'POST', path: '/builds/:id/export', desc: 'Export the build to a GitHub repository with full project structure and CI/CD.', auth: true },
    { method: 'GET', path: '/templates', desc: 'List available templates filtered by archetype and category.', auth: false },
  ],
  userGuide: [
    { title: 'Writing Effective Prompts', id: 'prompts', content: [
      'Be specific about your app\'s purpose, target users, and key features. Instead of "build a dashboard," try "build a SaaS analytics dashboard with user authentication, real-time charts for revenue and user metrics, and an admin panel for managing team members."',
      'Mention technologies you prefer (e.g., "use Tailwind CSS" or "use Prisma for the database") and the AI will incorporate them. If you do not specify, it picks production-proven defaults.',
      'For complex apps, describe the user journey step by step. The pipeline uses your description to generate navigation, page layouts, and data flows that match real user workflows.',
    ] },
    { title: 'Using the Refinement Chat', id: 'refinement', content: [
      'After the initial build, use the chat interface to make changes. Describe what you want in plain language — "make the sidebar collapsible," "add dark mode," or "change the chart colors to blue."',
      'The AI maintains context from the entire build history, so you can reference previous iterations. Say "go back to the layout from version 3 but keep the new color scheme" and it understands.',
      'For major architectural changes (e.g., switching from REST to GraphQL), create a new branch from the version history rather than refining in place. This preserves your working version while you experiment.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'Multi-LLM Competitive Generation', desc: 'Each build stage is processed by multiple AI models simultaneously. The outputs are evaluated and the best result is selected — combining the strengths of different models for optimal code quality.' },
    { capability: 'Intelligent Architecture Design', desc: 'The AI analyzes your requirements and designs an appropriate architecture — choosing database schemas, API patterns, component structures, and deployment configurations based on the app type and scale.' },
    { capability: 'Automated Testing', desc: 'The pipeline generates unit tests and integration tests alongside application code. Tests are run as part of the build process to catch issues before you see the preview.' },
    { capability: 'Code Quality Analysis', desc: 'Generated code passes through automated linting, type checking, and best-practice analysis at each stage. The AI fixes issues before advancing to the next pipeline stage.' },
  ],
  troubleshooting: [
    { issue: 'Build stuck at a pipeline stage', solution: 'Check the build status via the dashboard. If a stage has been processing for more than 5 minutes, it may have hit a complexity limit. Try simplifying the prompt or breaking the app into smaller components.' },
    { issue: 'Generated code has TypeScript errors', solution: 'The pipeline includes type checking, but complex custom types can occasionally cause issues. Use the refinement chat to describe the error and the AI will fix it. Include the exact error message for fastest resolution.' },
    { issue: 'GitHub export fails', solution: 'Verify your GitHub account is connected in Settings. Ensure the target repository name is available (not already taken). For organization repos, confirm you have write access.' },
    { issue: 'Live preview not loading', solution: 'The preview runs in a sandboxed iframe. Check that your browser allows third-party cookies for the preview domain. Try refreshing the page or opening the preview URL directly.' },
  ],
  faq: [
    { q: 'What types of apps can it generate?', a: 'Six archetypes: Electron desktop apps, Next.js web apps, React Native mobile, CLI tools, Chrome extensions, and MCP servers. Each archetype has specialized templates and build pipelines.' },
    { q: 'How does the 16-stage pipeline work?', a: 'Requirements analysis, architecture design, component planning, code generation, testing, optimization, packaging, and deployment — all automated. Multiple LLMs compete on each stage and the best output wins.' },
    { q: 'Can I modify generated code?', a: 'All generated code is clean, well-documented TypeScript with no lock-in. Export to GitHub, modify in VS Code, or refine through the chat interface.' },
    { q: 'How is this different from Bolt.new or Lovable?', a: 'Multi-LLM competitive generation, 16 stages vs single-prompt, and support for desktop/mobile/CLI — not just web apps. Plus full-stack generation including backend, database, and auth.' },
    { q: 'What are the pricing tiers?', a: 'Starter at $49/mo (10 builds, web only), Professional at $149/mo (50 builds, all 6 archetypes, multi-LLM), and Enterprise at $399/mo (unlimited builds, custom archetypes, team collaboration).' },
  ],
}

export default function AppForgeDocsPage() {
  return <ProductDoc {...data} />
}
