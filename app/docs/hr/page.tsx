'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo HR',
  tagline: 'AI-powered human resources — employees, time tracking, leave management, payroll, and performance reviews.',
  accent: '#14b8a6',
  productUrl: '/hr',
  workerUrl: 'https://echo-hr.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo HR is a comprehensive human resources platform that manages the complete employee lifecycle — from onboarding through performance reviews and offboarding. It replaces fragmented HR tools with one AI-powered system that handles employee records, time tracking, leave management, payroll processing, and performance evaluations.',
    'Built for small and mid-size businesses, Echo HR automates the administrative overhead that buries HR teams. Overtime calculations, leave balance carry-overs, tax withholding computations, and review cycle scheduling all happen automatically. The AI engine predicts retention risk, surfaces performance insights, and generates data-driven recommendations.',
    'With 70+ REST API endpoints, 14 database tables, and full integration with the Echo ecosystem via Engine Runtime and Shared Brain, Echo HR fits into your existing workflow. Department hierarchies, role-based permissions, and complete audit logging ensure your employee data stays organized and secure.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Tenant', desc: 'Sign up at echo-ept.com/hr to provision your HR workspace. A default department structure and standard leave types are created automatically.' },
    { step: 2, title: 'Add Departments', desc: 'Set up your organizational hierarchy with departments. Each department can have managers, headcount targets, and custom approval chains for leave and expenses.' },
    { step: 3, title: 'Import Employees', desc: 'Add employees individually or bulk import via CSV. Each profile includes personal details, job information, compensation, emergency contacts, and custom fields.' },
    { step: 4, title: 'Configure Leave Types', desc: 'Set up leave categories (vacation, sick, personal, parental) with annual balances, accrual rules, carry-over limits, and approval workflows.' },
    { step: 5, title: 'Start Managing', desc: 'Employees begin tracking time, requesting leave, and participating in reviews. Managers approve requests and run payroll from the admin dashboard.' },
  ],

  features: [
    { title: 'Employee Profiles', desc: 'Comprehensive employee records with personal info, job details, compensation history, documents, emergency contacts, and custom fields. Search and filter across the entire workforce.' },
    { title: 'Department Hierarchy', desc: 'Multi-level org chart with departments, teams, and reporting lines. Department dashboards show headcount, budget utilization, turnover rates, and open positions.' },
    { title: 'Time Tracking', desc: 'Clock-in/out with automatic overtime calculation based on configurable thresholds (default 40hrs/week). Bulk approve timesheets. Export to payroll.' },
    { title: 'Leave Management', desc: 'Custom leave types with annual balances, accrual rules, carry-over limits, and blackout dates. Multi-step approval workflows. Real-time balance tracking.' },
    { title: 'Payroll Processing', desc: 'Generate pay runs with automatic federal and state tax calculations (all 50 states). Social Security, Medicare, FUTA, SUTA employer taxes. Pre-tax and post-tax deductions.' },
    { title: 'Performance Reviews', desc: 'Multi-dimension rating system with customizable review templates. Self-assessments, manager evaluations, and 360-degree feedback. Goal tracking and competency mapping.' },
    { title: 'Onboarding Templates', desc: 'Structured onboarding checklists with task assignments, document requirements, and milestone tracking. Progress dashboards show completion status per new hire.' },
    { title: 'Document Management', desc: 'Secure document storage with expiry tracking for certifications, licenses, and contracts. Automated reminders before documents expire.' },
    { title: 'Analytics Dashboard', desc: 'Headcount by department, turnover trends, payroll summaries, leave utilization, and performance distributions. Export reports to CSV.' },
    { title: 'Audit Trail', desc: 'Complete activity log tracking every change to employee records, approvals, payroll runs, and system configuration with timestamps and user attribution.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/employees', desc: 'List all employees with filtering by department, status, role, and search. Paginated results with full profile data.', auth: true },
    { method: 'POST', path: '/api/employees', desc: 'Create a new employee record with personal details, job information, compensation, and department assignment.', auth: true },
    { method: 'GET', path: '/api/departments', desc: 'List all departments with headcount, budget, and org chart hierarchy.', auth: true },
    { method: 'POST', path: '/api/time-entries', desc: 'Log a time entry with date, hours, project, and notes. Overtime auto-calculated against weekly threshold.', auth: true },
    { method: 'POST', path: '/api/time-entries/bulk-approve', desc: 'Approve multiple pending time entries in a single request. Manager role required.', auth: true },
    { method: 'POST', path: '/api/leave-requests', desc: 'Submit a leave request with type, dates, and reason. Routes through configured approval workflow.', auth: true },
    { method: 'POST', path: '/api/leave-requests/:id/approve', desc: 'Approve a pending leave request. Updates leave balance automatically.', auth: true },
    { method: 'POST', path: '/api/payroll-runs', desc: 'Generate a new payroll run with automatic tax calculations for all active employees.', auth: true },
    { method: 'POST', path: '/api/performance-reviews', desc: 'Create a performance review cycle with template, participants, and deadline.', auth: true },
    { method: 'GET', path: '/api/analytics/headcount', desc: 'Headcount breakdown by department, employment type, and tenure with historical trends.', auth: true },
  ],

  userGuide: [
    {
      title: 'Employee Management',
      id: 'employee-management',
      content: [
        'Employee profiles are the core of Echo HR. Each profile stores personal information, job details (title, department, hire date, manager), compensation data, emergency contacts, and any custom fields you define.',
        'Add employees individually from the Employees page or bulk import via CSV with intelligent field mapping. The system deduplicates by email address and prompts for resolution on conflicts.',
        'Use filters to segment employees by department, status (active, on leave, terminated), employment type (full-time, part-time, contractor), or any custom field. Saved filters become named views for quick access.',
      ],
    },
    {
      title: 'Leave & Time Off',
      id: 'leave-management',
      content: [
        'Configure leave types in Settings > Leave Types. Each type has an annual balance, accrual rate (immediate, monthly, or per-payroll), carry-over limit, and approval chain. Common types include vacation, sick leave, personal days, and parental leave.',
        'Employees request time off from their dashboard, selecting the leave type, date range, and optional notes. Requests route through the approval chain — typically the direct manager, with escalation to HR for extended leaves.',
        'Leave balances update in real time. Managers see a team calendar overlay showing who is out and can proactively manage coverage gaps. Year-end carry-over processes automatically per type configuration.',
      ],
    },
    {
      title: 'Payroll',
      id: 'payroll',
      content: [
        'Payroll runs process all active employees for a pay period. The system calculates gross pay from salary or hourly rate × hours, applies federal progressive tax brackets, state taxes for the employee\'s work state, and FICA (Social Security + Medicare).',
        'Pre-tax deductions (401k, HSA, FSA) reduce taxable income before withholding calculations. Post-tax deductions (insurance premiums, garnishments) are applied after. Employer taxes (FUTA, SUTA, employer FICA match) are calculated separately.',
        'Each payroll run produces individual pay stubs with gross-to-net breakdown. Year-to-date accumulators track totals for W-2 generation. The run lifecycle is: Draft → Calculate → Review → Approve → Process.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Retention Risk Prediction', desc: 'AI analyzes employee engagement patterns, tenure, compensation market data, performance trends, and team dynamics to predict which employees are at risk of leaving. Risk scores update monthly with specific contributing factors identified.' },
    { capability: 'Performance Insights', desc: 'Machine learning identifies performance patterns across departments, teams, and individual trajectories. Surfaces trends like declining productivity, skill gaps, and high-performer burnout before they become problems.' },
    { capability: 'Smart Scheduling', desc: 'AI recommends optimal shift schedules based on historical demand patterns, employee preferences, skill requirements, and labor law compliance. Minimizes overtime while maintaining coverage.' },
    { capability: 'Compensation Analysis', desc: 'Benchmarks employee compensation against market data, internal equity, and performance metrics. Flags underpaid high-performers and suggests adjustment ranges for retention.' },
  ],

  troubleshooting: [
    { issue: 'Payroll calculations seem incorrect', solution: 'Verify the employee\'s state of residence and work state are set correctly — state tax rates vary significantly. Check that pre-tax deduction amounts are configured as per-paycheck values (not annual). Review the pay stub breakdown for each withholding line. Re-run the Calculate step to refresh computations.' },
    { issue: 'Leave balance shows negative', solution: 'Negative balances occur when approved leave exceeds the accrued balance (some companies allow this). To prevent, enable "Block negative balance" in the leave type settings. To fix existing negatives, adjust the opening balance in the employee\'s leave settings.' },
    { issue: 'Time entries not showing for approval', solution: 'Time entries only appear in the approval queue after the employee submits them for the pay period. Draft entries remain editable. Check that the employee has clicked "Submit for Approval" and that you are listed as their manager in the org chart.' },
    { issue: 'Performance review cycle stuck', solution: 'Check that all reviewers have been assigned and notified. The cycle advances only when all required evaluations are submitted. Use the admin override to close incomplete reviews if the deadline has passed. Check reviewer permissions in Settings > Team.' },
  ],

  faq: [
    { q: 'How many employees can the system handle?', a: 'Echo HR scales from 1 to 10,000+ employees. Free plans support up to 25 employees, Pro up to 500, and Enterprise is unlimited. Performance remains consistent regardless of headcount thanks to Cloudflare\'s edge infrastructure.' },
    { q: 'Does it handle multi-state payroll?', a: 'Yes. Echo HR calculates federal and state taxes for all 50 US states with current tax brackets, FUTA/SUTA rates, and state-specific withholding rules. Employees can have different work states and residence states for proper withholding.' },
    { q: 'Can I customize performance review templates?', a: 'Fully customizable. Create review templates with any combination of rating dimensions (1-5 stars, competency scales, goal completion), free-text sections, and weighted scoring. Use different templates for different roles or departments.' },
    { q: 'Is employee data secure?', a: 'All data is encrypted at rest and in transit. Role-based access control ensures employees only see their own data, managers see their direct reports, and HR admins have full access. Complete audit trail tracks every data access and modification.' },
    { q: 'How does onboarding work?', a: 'Create onboarding templates with task checklists (equipment setup, account provisioning, training modules, document signatures). Assign a template to each new hire — tasks auto-assign to the appropriate team members with due dates and reminders.' },
  ],
}

export default function EchoHrDocsPage() {
  return <ProductDoc {...data} />
}
