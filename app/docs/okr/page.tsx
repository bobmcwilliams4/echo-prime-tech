'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo OKR',
  tagline: 'AI-powered Objectives and Key Results tracking with goal alignment and team performance.',
  accent: '#14b8a6',
  productUrl: '/okr',
  workerUrl: 'https://echo-okr.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo OKR brings structured goal-setting with Objectives and Key Results methodology. Set ambitious objectives, define measurable key results, track progress with weighted scoring, and align goals across teams.',
    'The platform auto-calculates objective progress from weighted key results, detects on_track/at_risk/behind status, and provides cycle management for quarterly or custom periods. Alignment trees visualize how individual contributions ladder up to company objectives.',
    'AI suggests well-structured OKRs based on your domain, analyzes progress patterns, and recommends adjustments to keep teams on track.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create a Cycle', desc: 'Define an OKR cycle (quarterly, monthly, or custom dates) as the container for objectives.' },
    { step: 2, title: 'Set Objectives', desc: 'Create objectives with clear descriptions. Assign owners and parent objectives for alignment.' },
    { step: 3, title: 'Define Key Results', desc: 'Add measurable key results with target values, weights, and scoring types.' },
    { step: 4, title: 'Track Progress', desc: 'Update values via check-ins. Objective progress auto-calculates from weighted key results.' },
    { step: 5, title: 'Review and Iterate', desc: 'Use dashboards to review progress, identify blockers, and adjust as priorities evolve.' },
  ],
  features: [
    { title: 'Weighted Key Results', desc: 'Assign weights so some outcomes count more. Auto-calculate objective progress from weighted scores.' },
    { title: 'Status Detection', desc: 'Automatic on_track/at_risk/behind based on progress vs time elapsed. Visual indicators across all views.' },
    { title: 'Check-in History', desc: 'Log progress with notes and evidence. Full history per key result. Trends charted over time.' },
    { title: 'Goal Alignment Trees', desc: 'Visualize how individual OKRs connect to team and company objectives with cascading alignment.' },
    { title: 'Cycle Management', desc: 'Quarterly, monthly, or custom cycles. Archive completed cycles. Compare across cycles.' },
    { title: 'Team Dashboards', desc: 'Aggregate progress by team, department, or company. Identify lagging objectives.' },
    { title: 'Export', desc: 'CSV and JSON export of OKRs, check-ins, and analytics for reporting or integration.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/objectives', desc: 'Create objective with title, description, owner, cycle, and optional parent.', auth: true },
    { method: 'POST', path: '/api/key-results', desc: 'Add key result with target value, weight, scoring type, and parent objective.', auth: true },
    { method: 'POST', path: '/api/check-ins', desc: 'Log progress check-in with new value, notes, and optional evidence.', auth: true },
    { method: 'GET', path: '/api/cycles', desc: 'List cycles with aggregate progress and status breakdown.', auth: true },
    { method: 'GET', path: '/api/alignment-tree', desc: 'Hierarchical alignment tree from company to individual key results.', auth: true },
    { method: 'GET', path: '/api/dashboard', desc: 'Progress summaries, status distribution, and trends.', auth: true },
    { method: 'POST', path: '/api/ai/suggest', desc: 'AI-generated OKR suggestions based on domain and context.', auth: true },
    { method: 'GET', path: '/api/analytics', desc: 'Cycle performance, scoring trends, and team comparisons.', auth: true },
  ],
  userGuide: [
    { title: 'Setting Good OKRs', id: 'setting-okrs', content: ['Objectives should be qualitative and inspiring. Key results should be quantitative and measurable. Use the AI suggest feature for well-structured OKRs based on your role and domain.', 'Best practice: 3-5 objectives per person/team with 2-4 key results each. Focus drives achievement.'] },
    { title: 'Check-in Process', id: 'check-ins', content: ['Update key results weekly or bi-weekly with current values and notes. Status indicators update automatically based on progress vs time elapsed in the cycle.', 'Green means on track. Yellow means at risk. Red triggers alerts to owners and managers.'] },
  ],
  aiCapabilities: [
    { capability: 'OKR Suggestions', desc: 'Generates relevant objectives and measurable key results based on industry, role, and company context following best practices.' },
    { capability: 'Progress Insights', desc: 'Identifies objectives at risk of missing targets and recommends adjustments based on velocity trends.' },
    { capability: 'Alignment Analysis', desc: 'Detects gaps in goal alignment including orphaned objectives and misaligned priorities between teams.' },
  ],
  troubleshooting: [
    { issue: 'Objective progress at 0%', solution: 'Progress calculates from key results. Ensure key results exist with target values and at least one check-in logged.' },
    { issue: 'Wrong status color', solution: 'Status compares progress vs cycle time elapsed. A 50% objective at 80% through the cycle shows behind.' },
    { issue: 'Cannot create objectives', solution: 'An active cycle must exist first. Create a cycle from the Cycles page before adding objectives.' },
  ],
  faq: [
    { q: 'How many objectives per cycle?', a: 'Best practice is 3-5 per person/team with 2-4 key results each. The system supports unlimited but recommends focus.' },
    { q: 'Can I nest objectives?', a: 'Yes. Set a parent objective to build the alignment tree from company to team to individual.' },
    { q: 'What scoring types exist?', a: 'Percentage (0-100%), number (current vs target), and binary (done/not done). Weights determine contribution.' },
    { q: 'Can I carry over OKRs?', a: 'Yes. Clone objectives from a previous cycle. Historical check-in data is preserved for comparison.' },
  ],
}

export default function EchoOkrDocsPage() {
  return <ProductDoc {...data} />
}
