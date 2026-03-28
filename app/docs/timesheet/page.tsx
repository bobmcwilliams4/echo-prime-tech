'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Timesheet',
  tagline: 'AI-powered time tracking — timers, project budgets, team approvals, and invoice generation.',
  accent: '#14b8a6',
  productUrl: '/timesheet',
  workerUrl: 'https://echo-timesheet.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Timesheet combines one-click timers, manual time entries, project budgets, and team management into a unified time tracking platform. Track every billable minute, manage weekly timesheet approvals, and generate invoices directly from logged hours.',
    'Built for agencies, consultancies, and professional services teams, Echo Timesheet eliminates the gap between tracking and billing. Real-time budget burn-down dashboards show project profitability at a glance. The approval workflow ensures accurate timesheets before payroll or invoicing.',
    'AI-powered productivity insights identify time allocation patterns, flag underutilized capacity, and recommend optimal resource distribution across projects.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Workspace', desc: 'Sign up at echo-ept.com/timesheet. Sample projects and categories are created automatically.' },
    { step: 2, title: 'Add Projects & Budgets', desc: 'Create projects with hourly budgets, billable rates, and team assignments. Set alerts at budget thresholds.' },
    { step: 3, title: 'Start Tracking', desc: 'Click play to start a timer, or log manual entries with date, hours, project, and notes.' },
    { step: 4, title: 'Submit & Approve', desc: 'Submit weekly timesheets for manager approval. Rejected entries return with comments.' },
    { step: 5, title: 'Generate Invoices', desc: 'Select approved billable hours and generate invoices with detailed breakdowns.' },
  ],
  features: [
    { title: 'One-Click Timer', desc: 'Start/stop with one click. Auto-stop on inactivity. Multiple concurrent timers. Desktop notifications for running timers.' },
    { title: 'Manual Time Entries', desc: 'Log time after the fact with date, duration, project, task category, and notes. Bulk entry for recurring work.' },
    { title: 'Project Budgets', desc: 'Hourly or monetary budgets per project. Real-time burn-down tracking. Budget vs actual reports for profitability.' },
    { title: 'Team Management', desc: 'Assign team members with role-based rates. View utilization across projects. Capacity planning dashboards.' },
    { title: 'Approval Workflow', desc: 'Weekly submission and manager approval. Approve/reject with comments. Approved hours lock for invoicing.' },
    { title: 'Invoice Generation', desc: 'Generate itemized invoices from approved hours. Project breakdowns, hourly rates, and totals. PDF export.' },
    { title: 'Overtime Tracking', desc: 'Automatic detection based on weekly thresholds. Separate rate calculations. Manager flagging.' },
    { title: 'Reports & Analytics', desc: 'Time by project, member, date. Utilization rates, billable splits, profitability dashboards. CSV export.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/timers/start', desc: 'Start a new timer with project and notes. Returns timer ID.', auth: true },
    { method: 'POST', path: '/api/timers/stop', desc: 'Stop running timer. Creates time entry with elapsed duration.', auth: true },
    { method: 'POST', path: '/api/entries', desc: 'Create manual time entry with date, duration, project, and notes.', auth: true },
    { method: 'GET', path: '/api/entries', desc: 'List entries with filtering by date, project, member, approval status.', auth: true },
    { method: 'GET', path: '/api/timesheets/weekly', desc: 'Weekly summary with daily breakdowns and totals.', auth: true },
    { method: 'POST', path: '/api/approve', desc: 'Approve or reject submitted timesheets.', auth: true },
    { method: 'POST', path: '/api/invoices/generate', desc: 'Generate invoice from approved billable hours.', auth: true },
    { method: 'GET', path: '/api/analytics', desc: 'Utilization, billable ratios, and profitability analytics.', auth: true },
  ],
  userGuide: [
    { title: 'Tracking Time', id: 'tracking-time', content: ['Use real-time timers for hands-free tracking or manual entries for after-the-fact logging. Each entry needs a project assignment and optional task category. Add notes for entries that appear on invoices.', 'The system auto-detects overtime when weekly hours exceed the configured threshold (default 40 hours). Overtime entries are flagged for manager review.'] },
    { title: 'Approval Workflow', id: 'approval', content: ['At week end, submit your timesheet for review. Submission locks entries and notifies your manager. Managers approve individual entries or the full week.', 'Approved hours become available for invoicing and payroll export. Rejected entries return with comments for revision.'] },
  ],
  aiCapabilities: [
    { capability: 'Productivity Insights', desc: 'AI analyzes time patterns to identify peak productivity hours, context-switching overhead, and underutilized capacity with personalized optimization recommendations.' },
    { capability: 'Budget Forecasting', desc: 'Predicts project completion dates and budget overruns based on historical burn rates and team velocity with early warning flags.' },
    { capability: 'Auto-Categorization', desc: 'Suggests project and task categories for new entries based on notes content and historical patterns.' },
  ],
  troubleshooting: [
    { issue: 'Timer not visible', solution: 'Check you are viewing today\'s date. Running timers appear at the top. Cross-device sync takes up to 30 seconds.' },
    { issue: 'Cannot submit timesheet', solution: 'All entries need a project assignment. Check for zero-duration entries or missing project fields.' },
    { issue: 'Invoice totals wrong', solution: 'Verify billable rates per team member per project. Only approved entries within the date range are included.' },
  ],
  faq: [
    { q: 'Can I track on mobile?', a: 'Yes. The responsive interface works on any device — start/stop timers, log entries, and submit timesheets.' },
    { q: 'Does it integrate with payroll?', a: 'Approved timesheets export to CSV for any payroll system. Direct integration with Echo Payroll is available.' },
    { q: 'How is overtime configured?', a: 'Set weekly threshold and rate multiplier in project settings. Entries past the threshold are auto-flagged.' },
    { q: 'Different rates per person?', a: 'Each member can have unique billable rates per project, with defaults at the member level.' },
  ],
}

export default function EchoTimesheetDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/timesheet' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
