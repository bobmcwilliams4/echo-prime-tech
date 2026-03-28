'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Prompt Forge',
  tagline: '20 auto-enhancement techniques, semantic search, version control, A/B testing, and a marketplace of 194+ sovereign templates.',
  accent: '#a855f7',
  productUrl: '/prompt-forge',
  workerUrl: 'prompt-forge-omega.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Prompt Forge is a prompt engineering platform that eliminates guesswork from AI prompt creation. It automatically detects your task type across 14 categories (code, analysis, creative, research, and more) and applies the optimal combination of 20 enhancement techniques — including chain-of-thought, few-shot injection, role assignment, structured output, and constraint framing.',
    'Every prompt is version-controlled with full diff history, branching, and rollback. A/B testing with built-in statistical analysis lets you split-test prompt variants and determine winners automatically. The 7-dimension selection system scores prompts on quality, speed, cost, creativity, accuracy, consistency, and user satisfaction.',
    'The platform includes 194+ pre-loaded sovereign templates covering every major domain and task type. Share prompts through team workspaces with role-based access control, or publish to the marketplace. A REST API enables programmatic prompt management for integration into any AI pipeline.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create a Prompt', desc: 'Write or paste your prompt. The platform auto-detects the task type (code, analysis, creative, research, etc.) and suggests optimal enhancement techniques.' },
    { step: 2, title: 'Apply Enhancements', desc: 'Select from 20 techniques or let the system apply them automatically based on your detected task type. Techniques include chain-of-thought, few-shot examples, role assignment, and constraint framing.' },
    { step: 3, title: 'Test Across Models', desc: 'Run your prompt against Claude, GPT-4, Gemini, Llama, or any model. The platform tracks performance per model using the 7-dimension scoring system.' },
    { step: 4, title: 'Version and Iterate', desc: 'Every change is automatically versioned. Compare diffs between versions, branch for experiments, and roll back to any previous state.' },
    { step: 5, title: 'Share or Publish', desc: 'Keep prompts private, share within your team workspace, or publish to the marketplace for the community to rate, fork, and improve.' },
  ],
  features: [
    { title: '20 Enhancement Techniques', desc: 'Chain-of-thought, few-shot injection, role assignment, structured output, constraint framing, and 15 more — all applied automatically based on detected task type.' },
    { title: '14 Task Type Detection', desc: 'Auto-detects whether your prompt is for code generation, data analysis, creative writing, research, summarization, or 9 other task categories, then applies the optimal enhancement strategy.' },
    { title: 'Semantic Search', desc: 'Vectorize-powered semantic search finds the perfect prompt by meaning, not just keywords. Discover relevant templates even when using different terminology.' },
    { title: 'Version Control', desc: 'Full version history with diffs, rollbacks, and branching. Track how your prompts evolve over time and revert to any previous version instantly.' },
    { title: 'A/B Testing', desc: 'Split-test prompt variants against each other with built-in statistical analysis. The platform determines winners automatically based on your selected success metrics.' },
    { title: 'Prompt Marketplace', desc: 'Share and discover prompts across your organization or the public marketplace. Rate, fork, and improve prompts created by others.' },
    { title: '7-Dimension Selection', desc: 'Score and select prompts based on quality, speed, cost, creativity, accuracy, consistency, and user satisfaction — a multidimensional view of prompt performance.' },
    { title: 'Model Performance Tracking', desc: 'Track which prompts work best on which models. Auto-recommend optimal model-prompt combinations based on historical data.' },
    { title: 'Template Library', desc: '194+ sovereign templates pre-loaded covering every major domain. Start from proven patterns instead of a blank page.' },
    { title: 'REST API', desc: 'Full API access to fetch, create, update, and apply prompts programmatically. Integrate prompt management directly into your AI pipelines.' },
    { title: 'Analytics Dashboard', desc: 'Usage metrics, performance scores, cost tracking, and optimization recommendations for every prompt in your library.' },
    { title: 'Team Workspaces', desc: 'Shared prompt libraries with role-based access control (RBAC). Collaborate on prompt engineering across your entire organization.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/prompts', desc: 'List all prompts in your workspace with metadata, version info, and performance scores.', auth: true },
    { method: 'POST', path: '/api/prompts', desc: 'Create a new prompt with content, task type, enhancement settings, and workspace assignment.', auth: true },
    { method: 'GET', path: '/api/prompts/:id', desc: 'Retrieve a specific prompt including full version history and performance data.', auth: true },
    { method: 'POST', path: '/api/prompts/:id/enhance', desc: 'Apply enhancement techniques to a prompt. Auto-detect task type or specify techniques manually.', auth: true },
    { method: 'GET', path: '/api/prompts/search', desc: 'Semantic search across all prompts in your workspace. Returns ranked results by relevance score.', auth: true },
    { method: 'POST', path: '/api/prompts/:id/test', desc: 'Run an A/B test between two prompt versions. Returns statistical analysis when sufficient data is collected.', auth: true },
    { method: 'GET', path: '/api/templates', desc: 'Browse the 194+ sovereign template library with filtering by domain, task type, and quality tier.', auth: false },
    { method: 'GET', path: '/api/prompts/:id/versions', desc: 'List all versions of a prompt with diffs, timestamps, and author information.', auth: true },
    { method: 'POST', path: '/api/prompts/:id/fork', desc: 'Fork a prompt from the marketplace into your private workspace for customization.', auth: true },
  ],
  userGuide: [
    { title: 'Enhancement Techniques', id: 'enhancement-techniques', content: [
      'The 20 enhancement techniques are the core of Prompt Forge. Each technique modifies your prompt in a specific way to improve output quality. Chain-of-thought adds step-by-step reasoning instructions. Few-shot injection prepends relevant examples. Role assignment frames the AI as a domain expert.',
      'When auto-enhancement is enabled, the platform detects your task type and applies the optimal combination of techniques. For code generation, it might apply structured output + constraint framing + few-shot. For creative writing, it might use role assignment + style transfer + constraint relaxation.',
      'You can override auto-enhancement and manually select which techniques to apply. Each technique has a description and example showing how it modifies your prompt.',
    ]},
    { title: 'Version Control and Branching', id: 'version-control', content: [
      'Every edit to a prompt creates a new version automatically. The version history shows a full diff between any two versions so you can see exactly what changed and when.',
      'Branching lets you create experimental variants without affecting the main prompt. Create a branch, make changes, A/B test the branch against the main version, and merge the winner back.',
      'Rollback to any previous version with a single click. The platform preserves all version metadata including author, timestamp, and performance scores at the time of that version.',
    ]},
    { title: 'A/B Testing Workflow', id: 'ab-testing', content: [
      'Create an A/B test by selecting two prompt versions (or a main version and a branch). Define your success metric — response quality, speed, cost, or a custom scoring function.',
      'The platform splits traffic between the two variants and collects performance data. Statistical significance is calculated automatically. When one variant wins with sufficient confidence, the test concludes and recommends the winner.',
      'Test results are stored permanently and linked to the prompt version history, creating an auditable record of why each prompt change was made.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Task Type Detection', desc: 'Automatically classifies prompts into 14 task categories (code, analysis, creative, research, summarization, translation, conversation, extraction, classification, comparison, planning, debugging, explanation, review) and applies the optimal enhancement strategy.' },
    { capability: 'Semantic Prompt Search', desc: 'Vectorize-powered embedding search finds semantically similar prompts across your entire library. Search by meaning rather than exact keywords to discover relevant templates you did not know existed.' },
    { capability: 'Auto-Enhancement Engine', desc: 'Applies the optimal combination of 20 prompt engineering techniques based on detected task type. Learns from your A/B test results to improve enhancement recommendations over time.' },
    { capability: 'Multi-Model Optimization', desc: 'Tracks prompt performance across different LLM providers (Claude, GPT-4, Gemini, Llama) and recommends the best model-prompt pairing for each use case based on the 7-dimension scoring system.' },
  ],
  troubleshooting: [
    { issue: 'Enhancement suggestions seem irrelevant', solution: 'Check the auto-detected task type in the prompt editor. If the detection is wrong, manually override it to the correct category. Task type drives which enhancement techniques are applied.' },
    { issue: 'Semantic search returns no results', solution: 'Ensure your workspace has prompts that have been indexed. New prompts take a few seconds to be vectorized. Try broader search terms or check that you are searching the correct workspace.' },
    { issue: 'A/B test not reaching statistical significance', solution: 'A/B tests need sufficient sample size to determine a winner. If the two variants perform similarly, more traffic is needed. Consider increasing the difference between variants or running the test longer.' },
    { issue: 'Version history not showing diffs', solution: 'Diffs require at least two versions of a prompt. If you imported a prompt from the marketplace, the first version is the imported state. Subsequent edits will generate diffs.' },
  ],
  faq: [
    { q: 'What are the 20 enhancement techniques?', a: 'They include chain-of-thought, few-shot injection, role assignment, structured output, constraint framing, and 15 more. Each technique is applied automatically based on your task type, or you can select them manually.' },
    { q: 'Does Prompt Forge work with any LLM?', a: 'Yes. Prompts are provider-agnostic. Optimize for Claude, GPT-4, Gemini, Llama, or any model. The platform tracks which prompts perform best on which models.' },
    { q: 'How does prompt versioning work?', a: 'Every prompt change is versioned with full diff history. Compare performance across versions, roll back to any point, and branch for A/B testing.' },
    { q: 'Can I share prompts with my team?', a: 'Yes. Create shared workspaces with role-based access control. Publish prompts to the internal marketplace or keep them private to your organization.' },
    { q: 'What is the template library?', a: '194+ sovereign templates covering every major domain and task type. Templates are pre-tested, scored, and ready to use. Fork any template into your workspace to customize it.' },
    { q: 'How much does it cost?', a: 'Starter plan at $19/mo includes 100 prompts and 5 techniques. Professional at $59/mo unlocks all 20 techniques, A/B testing, marketplace access, and API. Enterprise at $149/mo adds unlimited prompts, SSO, and custom templates.' },
  ],
}

export default function PromptForgeDocsPage() {
  return <ProductDoc {...data} />
}
